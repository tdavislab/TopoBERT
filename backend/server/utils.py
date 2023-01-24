from collections import Counter, defaultdict
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from graph_generator import read_labels
from sklearn.decomposition import PCA
# from MulticoreTSNE import MulticoreTSNE as TSNE
from sklearn.manifold import TSNE
from umap import UMAP

label_list_ss = [
    'p.Circumstance', 'p.Time', 'p.StartTime', 'p.EndTime', 'p.Frequency', 'p.Duration', 'p.Interval', 'p.Locus', 'p.Goal', 'p.Source',
    'p.Path', 'p.Direction', 'p.Extent', 'p.Means', 'p.Manner', 'p.Explanation', 'p.Purpose', 'p.Causer', 'p.Agent', 'p.Co-Agent',
    'p.Theme', 'p.Co-Theme', 'p.Topic', 'p.Stimulus', 'p.Experiencer', 'p.Originator', 'p.Recipient', 'p.Cost', 'p.Beneficiary',
    'p.Instrument', 'p.Identity', 'p.Species', 'p.Gestalt', 'p.Possessor', 'p.Whole', 'p.Characteristic', 'p.Possession',
    'p.PartPortion', 'p.Stuff', 'p.Accompanier', 'p.ComparisonRef', 'p.RateUnit', 'p.Quantity', 'p.Approximator', 'p.SocialRel',
    'p.OrgRole'
]

label_list_dep = ['acl', 'acl:relcl', 'advcl', 'advmod', 'advmod:emph', 'advmod:lmod', 'amod', 'appos', 'aux', 'aux:pass', 'case', 'cc',
                  'cc:preconj', 'ccomp', 'clf', 'compound', 'compound:lvc', 'compound:prt', 'compound:redup', 'compound:svc', 'conj', 'cop',
                  'csubj', 'csubj:pass', 'dep', 'det', 'det-predet', 'det:numgov', 'det:nummod', 'det:poss', 'discourse', 'dislocated',
                  'expl', 'expl:impers', 'expl:pass', 'expl:pv', 'fixed', 'flat', 'flat:foreign', 'flat:name', 'goeswith', 'iobj', 'list',
                  'mark', 'nmod', 'nmod:poss', 'nmod:tmod', 'nsubj', 'nsubj:pass', 'nummod', 'nummod:gov', 'obj', 'obl', 'obl:agent',
                  'obl:arg', 'obl:lmod', 'obl:tmod', 'orphan', 'parataxis', 'punct', 'reparandum', 'root', 'vocative', 'xcomp']


def get_purities(graph):
    """
    Function that returns the purity of a given list of purities.
    """

    def histogram(lst, label):
        """
        Function that returns a histogram of a given list.
        """
        hist, bins = np.histogram(lst, bins=np.arange(0, 1.05, 0.1))
        chartjs_hist = {
            "type": "bar",
            "data": {
                "labels": [round(bins, 1) for bins in bins],
                "datasets": [
                    {
                        "label": label,
                        "data": list(hist),
                        "backgroundColor": ["#8F7AC0FF"] * len(hist),
                    }
                ]
            },
            "width": 200, "height": 200,
            "options": {
                "responsive": False,
            }
        }

        return chartjs_hist

    purity_over_nodes = dict([(label, []) for label in label_list])

    for node in graph['nodes']:
        metadata = node['membership']['metadata']
        labels = Counter([x[3] for x in metadata])
        for label in labels:
            purity_over_nodes[label].append(round(labels[label] / len(metadata), 4))

    purity_hists = {label: histogram(purities, label) for label, purities in purity_over_nodes.items()}
    bin_edges = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]

    return purity_hists, bin_edges


def get_train_index_node_id(graph, train_index):
    """
    Function that returns the node id of the node with the given index in the training set.
    """
    for node in graph['nodes']:
        memberIndices = [member['memberId'] for member in node['memberPoints']]

        if train_index in memberIndices:
            return node['id']

    return None


def fetch_test_metadata(test_label, test_ids):
    metadata = []
    for idx in test_ids:
        data = test_label.loc[idx].tolist()
        # data[2] = data[2] + '-' + data[3]
        # data[3] = 'p.Test'
        data.append(10)
        # data.append('test')
        metadata.append(data)

    return metadata


def add_test_nodes(graph, activation_train_df, activation_test_df, label_train, label_test, pred_labels, dataset):

    def memberPointify(metadata, mindex):
        metadata = dict(metadata)
        metadata['memberId'] = mindex
        metadata['sentId'] = metadata.pop('sent_id')
        metadata['wordId'] = metadata.pop('word_id')
        metadata['classLabel'] = metadata.pop('label')
        if pred_labels is not None:
            metadata['predLabel'] = pred_labels.iloc[mindex]
        return metadata

    # fit nearest neighbors model on activations_train
    nbrs = NearestNeighbors(n_neighbors=1).fit(activation_train_df)
    # get distances and indices of nearest neighbors on activations_test
    indices = nbrs.kneighbors(activation_test_df, return_distance=False)

    if dataset == 'dep':
        label_list = label_list_dep
    else:
        label_list = label_list_ss

    attachment_distributions = dict([(label, []) for label in label_list])

    graph_to_test_points = defaultdict(list)

    for i, train_index in enumerate(indices):
        if label_test.loc[i]['label'] in label_list:
            attachment_distributions[label_test.loc[i]['label']].append(label_train.loc[train_index[0]]['label'])
            node_id = get_train_index_node_id(graph, train_index)
            if node_id:
                graph_to_test_points[node_id].append(i)

    for i, node_id in enumerate(graph_to_test_points):
        test_node_name = 'test_node_' + str(i)
        graph['nodes'].append({
            'id': test_node_name, 'name': test_node_name, 'avgFilterValue': 0,
            'memberPoints': [memberPointify(label_test.loc[member_index], member_index) for member_index in graph_to_test_points[node_id]],
            'x_pca': -1, 'y_pca': -1, 'type': 'test'
        })
        graph['links'].append({'source': node_id, 'target': test_node_name, 'intersection': 0.5})

    return graph, {label: Counter(distributions) for label, distributions in attachment_distributions.items()}


def compute_projection(activations, labels, datatypes, method):
    if method == 'PCA':
        projector = PCA(n_components=2)
    elif method == 'TSNE':
        projector = TSNE(n_components=2, n_jobs=8)
    elif method == 'UMAP':
        projector = UMAP(n_components=2, n_jobs=8)
    else:
        raise KeyError(f'Unexpected projection method = {method}')

    projection = projector.fit_transform(activations)
    projection = pd.DataFrame(np.hstack([np.expand_dims(np.arange(len(projection)), 1), projection]), columns=['index', 'x', 'y'])
    projection = projection.astype({'index': int, 'x': float, 'y': float})
    projection = pd.concat([projection, labels[['word', 'label']]], axis=1)
    projection['datatype'] = datatypes
    return projection.to_dict('records')

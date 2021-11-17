from collections import Counter, defaultdict
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from graph_generator import read_labels
from sklearn.decomposition import PCA
from MulticoreTSNE import MulticoreTSNE as TSNE
from umap import UMAP


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

    label_list = ['p.Circumstance', 'p.Time', 'p.StartTime', 'p.EndTime', 'p.Frequency', 'p.Duration', 'p.Interval', 'p.Locus', 'p.Goal', 'p.Source',
                  'p.Path', 'p.Direction', 'p.Extent', 'p.Means', 'p.Manner', 'p.Explanation', 'p.Purpose', 'p.Causer', 'p.Agent', 'p.Co-Agent',
                  'p.Theme', 'p.Co-Theme', 'p.Topic', 'p.Stimulus', 'p.Experiencer', 'p.Originator', 'p.Recipient', 'p.Cost', 'p.Beneficiary',
                  'p.Instrument', 'p.Identity', 'p.Species', 'p.Gestalt', 'p.Possessor', 'p.Whole', 'p.Characteristic', 'p.Possession',
                  'p.PartPortion', 'p.Stuff', 'p.Accompanier', 'p.ComparisonRef', 'p.RateUnit', 'p.Quantity', 'p.Approximator', 'p.SocialRel',
                  'p.OrgRole']

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
        if train_index in node['membership']['membership_ids']:
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


def add_test_nodes(graph, activation_train, activation_test, test_label_file):
    activation_train_df = pd.read_csv(activation_train, delim_whitespace=True, header=None)
    activation_test_df = pd.read_csv(activation_test, delim_whitespace=True, header=None)
    test_label = read_labels(test_label_file)

    # fit nearest neighbors model on activations_train
    nbrs = NearestNeighbors(n_neighbors=1).fit(activation_train_df)
    # get distances and indices of nearest neighbors on activations_test
    indices = nbrs.kneighbors(activation_test_df, return_distance=False)

    graph_to_test_points = defaultdict(list)

    for i, train_index in enumerate(indices):
        node_id = get_train_index_node_id(graph, train_index)
        if node_id:
            graph_to_test_points[node_id].append(i)

    for i, node_id in enumerate(graph_to_test_points):
        test_node_name = 'test_node_' + str(i)
        graph['nodes'].append({
            'id': test_node_name,
            'name': test_node_name,
            'l2avg': 0,
            'membership': {
                'membership_ids': graph_to_test_points[node_id],
                'metadata': fetch_test_metadata(test_label, graph_to_test_points[node_id]),
                'l2avg': 0,
                'x': 0,
                'y': 0,
                'type': 'test'
            }
        })
        graph['links'].append({
            'source': node_id,
            'target': test_node_name,
            'intersection': 0.5
        })

    return graph


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
    return projection

from collections import Counter, defaultdict
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from graph_generator import read_labels
from sklearn.decomposition import PCA
from MulticoreTSNE import MulticoreTSNE as TSNE
from umap import UMAP
import networkx as nx
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, linkage, to_tree
from scipy.spatial.distance import pdist
from collections import deque

import sys

sys.setrecursionlimit(2000)


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

    label_list = [
        'p.Circumstance', 'p.Time', 'p.StartTime', 'p.EndTime', 'p.Frequency', 'p.Duration', 'p.Interval', 'p.Locus', 'p.Goal', 'p.Source',
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


def get_hierarchy(graph, activations, labels, max_level=10):
    def point_to_node(nodes, num_points=4282):
        ptn_dict = {}
        for point_idx in range(num_points):
            for node_idx, node in enumerate(nodes):
                node_data = nodes[node]['membership']['membership_ids']

                if point_idx in node_data:
                    ptn_dict[point_idx] = node_idx

        return ptn_dict

    def linkage_matrix(model):
        # Create linkage matrix and then plot the dendrogram

        # create the counts of samples under each node
        counts = np.zeros(model.children_.shape[0])
        n_samples = len(model.labels_)
        for i, merge in enumerate(model.children_):
            current_count = 0
            for child_idx in merge:
                if child_idx < n_samples:
                    current_count += 1  # leaf node
                else:
                    current_count += counts[child_idx - n_samples]
            counts[i] = current_count

        linkage_matrix = np.column_stack([model.children_, model.distances_, counts]).astype(float)

        return linkage_matrix

    def populate_tree_labels(treeNode, labels):
        if treeNode.id < len(labels):
            treeNode.label = set([labels.iloc[treeNode.id]['label'].split('.')[1]])
        else:
            # popluate children
            populate_tree_labels(treeNode.left, labels)
            populate_tree_labels(treeNode.right, labels)

            # label is union of labels of left and right children
            treeNode.label = treeNode.left.label | treeNode.right.label

        return treeNode

    def populate_tree_labels_counter(treeNode, labels):
        if treeNode.id < len(labels):
            treeNode.label = Counter([labels.iloc[treeNode.id]['label'].split('.')[1]])
        else:
            # popluate children
            populate_tree_labels_counter(treeNode.left, labels)
            populate_tree_labels_counter(treeNode.right, labels)

            # label is union of labels of left and right children
            treeNode.label = treeNode.left.label + treeNode.right.label

        return treeNode

    def process_label(label, max_length=15):
        label_str = ','.join(sorted(label))
        if len(label_str) > max_length:
            return f'{label_str[:max_length]}... ({len(label)})'
        else:
            return label_str

    def process_label_counter(label, max_length=15):
        label_str = ','.join([k for k, v in label.most_common()])
        if len(label_str) > max_length:
            return f'{label_str[:max_length]}... ({len(label)})'
        else:
            return label_str

    def bfs_traversal(treeNode, graph, max_level=5):
        q = deque()

        q.append(treeNode)
        level = 0

        while len(q) > 0 and level < max_level:
            level_size = len(q)

            for _ in range(level_size):
                node = q.popleft()
                num_labels = len(node.label)

                graph.add_node(node.id, label=process_label_counter(node.label), class_counts=node.label)

                # terminate if node's label has one label
                if num_labels > 1:
                    if node.left is not None:
                        q.append(node.left)
                        graph.add_edge(node.id, node.left.id, weight=node.left.dist)
                        graph.add_node(node.left.id, label=process_label(node.left.label), class_counts=node.left.label)

                    if node.right is not None:
                        q.append(node.right)
                        graph.add_edge(node.id, node.right.id, weight=node.right.dist)
                        graph.add_node(node.right.id, label=process_label(node.right.label), class_counts=node.right.label)

            level += 1

    def node_to_point_matrix(activations, ptn_dict, node_dist_matrix):
        point_dist_mat_from_graph = np.zeros((len(activations), len(activations)))

        # populate point_dist_mat_from_graph
        for point_idx1 in range(len(activations)):
            for point_idx2 in range(len(activations)):
                if point_idx1 not in ptn_dict or point_idx2 not in ptn_dict:
                    point_dist_mat_from_graph[point_idx1][point_idx2] = 100
                elif point_idx1 != point_idx2:
                    point_dist_mat_from_graph[point_idx1, point_idx2] = node_dist_matrix[ptn_dict[point_idx1], ptn_dict[point_idx2]]

        return point_dist_mat_from_graph

    graph_nx = nx.json_graph.node_link_graph(graph)

    # shortest path distance using distance between node centroids as the metric
    distance_matrix = nx.algorithms.shortest_paths.dense.floyd_warshall_numpy(graph_nx, weight='centroid_dist')

    # set disconnected node distance to max + euclidean distance
    # max_distance = np.ma.masked_invalid(distance_matrix).max()
    max_distance = pdist(activations.iloc[np.random.randint(activations.shape[0], size=500), :]).max() + 5
    nodelist = list(graph_nx.nodes())

    for i in range(len(distance_matrix)):
        for j in range(len(distance_matrix)):
            if np.isinf(distance_matrix[i][j]):
                centroid_i = np.array(graph_nx.nodes[nodelist[i]]['membership']['centroid'])
                centroid_j = np.array(graph_nx.nodes[nodelist[j]]['membership']['centroid'])
                distance_matrix[i][j] = max_distance + np.linalg.norm(centroid_i - centroid_j)

    # convert node-to-node distance matrix to point-to-node distance matrix
    ptn_dict = point_to_node(graph_nx.nodes)
    point_dist_mat_from_graph = node_to_point_matrix(activations, ptn_dict, distance_matrix)

    # Perform hierarchical clustering using pointwise distance matrix
    model_aggclust_mapper = AgglomerativeClustering(n_clusters=None, distance_threshold=99, affinity='precomputed', linkage='average')
    model_aggclust_mapper.fit(point_dist_mat_from_graph)

    # compute the linkage matrix
    linkage_matrix_mapper = linkage_matrix(model_aggclust_mapper)
    tree = to_tree(linkage_matrix_mapper)
    populate_tree_labels_counter(tree, labels)

    # Create a networkx directional graph
    linkage_graph = nx.DiGraph()

    # Populate the graph with using BFS traversal of the tree
    bfs_traversal(tree, linkage_graph, max_level=max_level)

    return nx.readwrite.json_graph.tree_data(linkage_graph, root=8562, attrs=dict(id='name', children='children'))

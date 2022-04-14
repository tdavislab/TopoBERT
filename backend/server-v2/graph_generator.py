import dataclasses

import kneed
import numpy as np
import pandas as pd
import zipfile
import ast
import kmapper as km
from sklearn.cluster import DBSCAN
from networkx.readwrite import json_graph
import json
import os
import itertools

from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from tqdm import tqdm
from dataclasses import dataclass

DBSCAN_MIN_SAMPLES = 3


@dataclass
class Config:
    metric: str = 'euclidean'
    filter_func: str = 'l2'
    intervals: int = 50
    overlap: float = 0.5


class NumpyEncoder(json.JSONEncoder):
    """ Custom encoder for numpy data types """

    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
                            np.int16, np.int32, np.int64, np.uint8,
                            np.uint16, np.uint32, np.uint64)):

            return int(obj)

        elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
            return float(obj)

        elif isinstance(obj, (np.complex_, np.complex64, np.complex128)):
            return {'real': obj.real, 'imag': obj.imag}

        elif isinstance(obj, (np.ndarray,)):
            return obj.tolist()

        elif isinstance(obj, (np.bool_)):
            return bool(obj)

        elif isinstance(obj, (np.void)):
            return None

        return json.JSONEncoder.default(self, obj)


def read_file_from_zip(zip_path, file_relative_path):
    data = []
    with zipfile.ZipFile(zip_path, mode='r') as dataset:
        with dataset.open(file_relative_path, mode='r') as f:
            data = pd.read_csv(f, sep=' ', header=None)

    return data


def read_labels(path, dataset=None):
    label_data = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            if dataset in ['ss-func', 'ss-role']:
                word_info, word_label = line.strip().split('\t')
                sent_info, word = word_info.split(':')
                sent_info = ast.literal_eval(sent_info)
                label_data.append([sent_info[0], sent_info[1], word, word_label])
            elif dataset == 'dep':
                word_pair, word_label = line.strip().split('\t')
                word_pair = word_pair.split('--')
                if len(word_pair) == 2:
                    word1, word2 = word_pair
                elif len(word_pair) == 3:
                    word1, word2 = word_pair[0], '--'
                sent_info = [0, 0]
                label_data.append([sent_info[0], sent_info[1], f'{word1}--{word2}', word_label])
            else:
                raise ValueError('Dataset not supported')

    return pd.DataFrame(label_data, columns=['sent_id', 'word_id', 'word', 'label'])


def add_node_metadata_ud(graph, data):
    for node_name in graph['nodes']:
        member_list = graph['nodes'][node_name]
        members_with_metadata = []

        for member_idx in member_list:
            metadata = data.loc[member_idx]
            members_with_metadata.append([str(x) for x in metadata.tolist()[:-1]] + [np.linalg.norm(metadata[-1])])

        graph['nodes'][node_name] = {'membership_ids': member_list, 'metadata': members_with_metadata,
                                     'l2avg': np.average([x[-1] for x in members_with_metadata])}

    return graph


def memberPointify(metadata, mindex):
    metadata = dict(metadata)
    metadata['memberId'] = mindex
    metadata['sentId'] = metadata.pop('sent_id')
    metadata['wordId'] = metadata.pop('word_id')
    metadata['classLabel'] = metadata.pop('label')
    return metadata


def add_node_metadata(graph, metadata_source, activations):
    # create PCA model first
    nodewise_activations = np.vstack([np.mean(activations.iloc[graph['nodes'][node_name]], axis=0) for node_name in graph['nodes']])
    pca_positions = PCA(n_components=2).fit_transform(nodewise_activations)

    for i, node_name in enumerate(graph['nodes']):
        member_list = graph['nodes'][node_name]

        metadata = [memberPointify(metadata_source.loc[member_index], member_index) for member_index in member_list]
        # graph['nodes'][node_name] = {'membership_ids': member_list, 'metadata': metadata,
        #                              'avgFilterValue': np.average(metadata_source.loc[member_list]['l2norm']),
        #                              'x': pca_positions[i][0], 'y': pca_positions[i][1], 'type': 'train'}

        graph['nodes'][node_name] = {
            'memberPoints': metadata,
            'avgFilterValue': np.average(metadata_source.loc[member_list]['l2norm']),
            'x_pca': pca_positions[i][0], 'y_pca': pca_positions[i][1], 'type': 'train'
        }

    return graph


def store_as_json(graph, path):
    nx_graph = km.adapter.to_networkx(graph)
    js_graph = json_graph.node_link_data(nx_graph)

    for i, node in enumerate(js_graph['nodes']):
        js_graph['nodes'][i]['name'] = js_graph['nodes'][i]['id']
        js_graph['nodes'][i]['l2avg'] = js_graph['nodes'][i]['membership']['l2avg']

    for i, link in enumerate(js_graph['links']):
        id_s = link['source']
        id_t = link['target']
        mem1 = [x['membership']['membership_ids'] for x in js_graph['nodes'] if x['id'] == id_s][0]
        mem2 = [x['membership']['membership_ids'] for x in js_graph['nodes'] if x['id'] == id_t][0]
        mem1, mem2 = set(mem1), set(mem2)
        jaccard = len(mem1.intersection(mem2)) / len(mem1.union(mem2))
        js_graph['links'][i]['intersection'] = jaccard

    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, 'w') as f:
        json.dump(js_graph, f, cls=NumpyEncoder)

    return js_graph


def serialize_graph(graph):
    nx_graph = km.adapter.to_networkx(graph)
    js_graph = json_graph.node_link_data(nx_graph)

    for i, node in enumerate(js_graph['nodes']):
        # js_graph['nodes'][i]['name'] = js_graph['nodes'][i]['id']
        # js_graph['nodes'][i]['avgFilterValue'] = js_graph['nodes'][i]['membership']['avgFilterValue']
        node_temp = js_graph['nodes'][i]
        node_temp = {**node_temp, **node_temp['membership']}
        del node_temp['membership']
        js_graph['nodes'][i] = node_temp

    for i, link in enumerate(js_graph['links']):
        id_s = link['source']
        id_t = link['target']
        mem1 = [[y['memberId'] for y in x['memberPoints']] for x in js_graph['nodes'] if x['id'] == id_s][0]
        mem2 = [[y['memberId'] for y in x['memberPoints']] for x in js_graph['nodes'] if x['id'] == id_t][0]
        mem1, mem2 = set(mem1), set(mem2)
        jaccard = len(mem1.intersection(mem2)) / len(mem1.union(mem2))
        js_graph['links'][i]['intersection'] = jaccard

    del js_graph['graph'], js_graph['directed'], js_graph['multigraph']
    return js_graph


def elbow_eps(data):
    nbrs = NearestNeighbors(n_neighbors=2).fit(data)
    distances, indices = nbrs.kneighbors(data)
    distances = np.sort(distances, axis=0)[::-1]
    kneedle = kneed.KneeLocator(distances[:, 1], np.linspace(0, 1, num=len(distances)), curve='convex', direction='decreasing')
    eps = kneedle.knee * 0.75
    return eps


def create_mapper(file_name, label_file, activation_file, graph_output_file, conf):
    # if os.path.isfile(graph_output_file + file_name.replace('.txt', '.json')):
    #     return

    labels = read_labels(label_file)
    if activation_file.endswith('.zip'):
        activations = read_file_from_zip(activation_file, f'fine_tuning_changes/{file_name}')
    else:
        activations = pd.read_csv(activation_file, delim_whitespace=True, header=None)

    activation_norms = np.linalg.norm(activations, axis=1)
    labels['l2norm'] = np.expand_dims(np.linalg.norm(activations.to_numpy(), axis=1), 1)
    mapper = km.KeplerMapper()

    if conf.filter_func == 'l1':
        projected_data = np.linalg.norm(activations, ord=1, axis=1).reshape((activations.shape[0], 1))
    elif conf.filter_func == 'l2':
        projected_data = mapper.fit_transform(activations, projection='l2norm')
    elif conf.filter_func == 'knn5':
        projected_data = mapper.fit_transform(activations, projection='knn_distance_5') / 5
    else:
        raise KeyError('Unexpected filter function')

    eps = elbow_eps(activations)
    graph = mapper.map(projected_data, activations, clusterer=DBSCAN(eps=eps, metric=conf.metric, min_samples=DBSCAN_MIN_SAMPLES),
                       cover=km.Cover(n_cubes=conf.intervals, perc_overlap=conf.overlap))

    add_node_metadata(graph, labels, activations)

    # graph = store_as_json(graph, graph_output_file + file_name.replace('.txt', '.json'))
    return serialize_graph(graph), activations, labels


def get_mapper(activations, labels, conf):
    labels['l2norm'] = np.expand_dims(np.linalg.norm(activations.to_numpy(), axis=1), 1)
    mapper = km.KeplerMapper()

    if conf.filter_func == 'l1':
        projected_data = np.linalg.norm(activations, ord=1, axis=1).reshape((activations.shape[0], 1))
    elif conf.filter_func == 'l2':
        projected_data = mapper.fit_transform(activations, projection='l2norm')
    elif conf.filter_func == 'knn5':
        projected_data = mapper.fit_transform(activations, projection='knn_distance_5') / 5
    else:
        raise KeyError('Unexpected filter function')

    eps = elbow_eps(activations)
    graph = mapper.map(projected_data, activations, clusterer=DBSCAN(eps=eps, metric=conf.metric, min_samples=DBSCAN_MIN_SAMPLES),
                       cover=km.Cover(n_cubes=conf.intervals, perc_overlap=conf.overlap))

    add_node_metadata(graph, labels, activations)

    # graph = store_as_json(graph, graph_output_file + file_name.replace('.txt', '.json'))
    return serialize_graph(graph)

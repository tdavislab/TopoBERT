from dataclasses import dataclass
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

from sklearn.neighbors import NearestNeighbors

from pyBallMapper import BallMapper

from sklearn.decomposition import PCA
from tqdm import tqdm
import kneed


@dataclass
class Config:
    algo: str = 'kmapper'  # or 'ballmapper
    metric: str = 'euclidean'
    filter_func: str = 'l2'
    intervals: int = 50
    overlap: float = 0.5


def generate_configs(small=False):
    if small:
        metrics = ['euclidean']
        filter_funcs = ['l2']
        intervals = [50]
    metrics = ['euclidean', 'cosine']
    filter_funcs = ['l2', 'knn5', 'l1']
    intervals = [50, 100]
    overlaps = [0.25, 0.50, 0.75]

    config_list = []
    for metric, filter_func, interval, overlap in itertools.product(metrics, filter_funcs, intervals, overlaps):
        config_list.append(Config(metric=metric, filter_func=filter_func, intervals=interval, overlap=overlap))

    return config_list
    # return [Config(algo='ballmapper', filter_func='l2', intervals=50, overlap=0.50)]
    # conf_euc_50_25 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.25)
    # conf_euc_50_50 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.50)
    # conf_euc_50_75 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.75)
    # conf_euc_100_25 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.25)
    # conf_euc_100_50 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.50)
    # conf_euc_100_75 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.75)
    # conf_cos_50_25 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.25)
    # conf_cos_50_50 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.50)
    # conf_cos_50_75 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.75)
    # conf_cos_100_25 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.25)
    # conf_cos_100_50 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.50)
    # conf_cos_100_75 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.75)
    #
    # filter_func = 'knn_5'
    # conf_euc_50_25 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.25)
    # conf_euc_50_50 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.50)
    # conf_euc_50_75 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.75)
    # conf_euc_100_25 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.25)
    # conf_euc_100_50 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.50)
    # conf_euc_100_75 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.75)
    # conf_cos_50_25 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.25)
    # conf_cos_50_50 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.50)
    # conf_cos_50_75 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.75)
    # conf_cos_100_25 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.25)
    # conf_cos_100_50 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.50)
    # conf_cos_100_75 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.75)
    #
    # filter_func = 'l1'
    # conf_euc_50_25 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.25)
    # conf_euc_50_50 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.50)
    # conf_euc_50_75 = Config(metric='euclidean', filter_func=filter_func, intervals=50, overlap=0.75)
    # conf_euc_100_25 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.25)
    # conf_euc_100_50 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.50)
    # conf_euc_100_75 = Config(metric='euclidean', filter_func=filter_func, intervals=100, overlap=0.75)
    # conf_cos_50_25 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.25)
    # conf_cos_50_50 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.50)
    # conf_cos_50_75 = Config(metric='cosine', filter_func=filter_func, intervals=50, overlap=0.75)
    # conf_cos_100_25 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.25)
    # conf_cos_100_50 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.50)
    # conf_cos_100_75 = Config(metric='cosine', filter_func=filter_func, intervals=100, overlap=0.75)

    # config_list = [conf_euc_50_25, conf_euc_50_50, conf_euc_50_75, conf_euc_100_25, conf_euc_100_50, conf_euc_100_75,
    #                conf_cos_50_25, conf_cos_50_50, conf_cos_50_75, conf_cos_100_25, conf_cos_100_50, conf_cos_100_75]

    # config_list = [conf_cos_50_25, conf_cos_50_50, conf_cos_50_75, conf_cos_100_25, conf_cos_100_50, conf_cos_100_75]
    # config_list = [conf_euc_50_25, conf_euc_100_25, conf_cos_50_25, conf_cos_100_25]

    # return config_list


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
    with zipfile.ZipFile(zip_path, mode='r') as dataset:
        with dataset.open(file_relative_path, mode='r') as f:
            data = pd.read_csv(f, sep=' ', header=None)
    return data


def read_labels(path):
    label_data = []
    with open(path, 'r') as f:
        for line in f:
            word_info, word_label = line.strip().split('\t')
            sent_info, word = word_info.split(':')
            sent_info = ast.literal_eval(sent_info)
            label_data.append([sent_info[0], sent_info[1], word, word_label])

    return pd.DataFrame(label_data, columns=['sent_id', 'word_id', 'word', 'label'])


def add_node_metadata(graph, metadata_source, activations):
    # create PCA model first
    nodewise_activations = np.vstack([np.mean(activations.iloc[graph['nodes'][node_name]], axis=0) for node_name in graph['nodes']])
    pca_positions = PCA(n_components=2).fit_transform(nodewise_activations)

    for i, node_name in enumerate(graph['nodes']):
        member_list = graph['nodes'][node_name]

        metadata = [metadata_source.loc[member_index].tolist() for member_index in member_list]
        graph['nodes'][node_name] = {'membership_ids': member_list, 'metadata': metadata,
                                     'l2avg': np.average(metadata_source.loc[member_list]['l2norm']),
                                     'x': pca_positions[i][0], 'y': pca_positions[i][1]}

    return graph


def add_node_metadata_bmapper(graph, metadata_source, activations):
    # create PCA model first
    nodewise_activations = np.vstack([np.mean(activations.iloc[graph.nodes[node_name]['points covered']], axis=0) for node_name in graph.nodes])
    pca_positions = PCA(n_components=2).fit_transform(nodewise_activations)

    for i, node_name in enumerate(graph.nodes):
        member_list = graph.nodes[node_name]['points covered']

        metadata = [metadata_source.loc[member_index].tolist() for member_index in member_list]
        graph.nodes[node_name].update({'membership': {'membership_ids': member_list, 'metadata': metadata,
                                                      'l2avg': np.average(metadata_source.loc[member_list]['l2norm']),
                                                      'x': pca_positions[i][0], 'y': pca_positions[i][1]}})

    return graph


def store_as_json_bmapper(graph, path):
    js_graph = json_graph.node_link_data(graph)

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


def elbow_eps(data):
    nbrs = NearestNeighbors(n_neighbors=2).fit(data)
    distances, indices = nbrs.kneighbors(data)
    kneedle = kneed.KneeLocator(distances[:, 1], np.linspace(0, 1, num=len(distances)), curve='convex', direction='increasing')
    return kneedle.knee


def create_mapper(file_name, label_file, activation_file, graph_output_file, conf):
    if os.path.isfile(graph_output_file + file_name.replace('.txt', '.json')):
        # return
        pass

    labels = read_labels(label_file)
    activations = read_file_from_zip(activation_file, f'fine_tuning_changes/{file_name}')
    # labels['l2norm'] = MinMaxScaler().fit_transform(np.expand_dims(np.linalg.norm(activations.to_numpy(), axis=1), 1))
    labels['l2norm'] = np.expand_dims(np.linalg.norm(activations.to_numpy(), axis=1), 1)

    if conf.algo == 'ballmapper':
        mapper = BallMapper(activations.values, pd.DataFrame(activations.apply(np.linalg.norm, axis=1)),
                            activations.apply(np.linalg.norm, axis=1).mean())
        graph = mapper.Graph
        add_node_metadata_bmapper(graph, labels, activations)
        store_as_json_bmapper(graph, graph_output_file + file_name.replace('.txt', '.json'))
    else:
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
        # eps = 10
        graph = mapper.map(projected_data, activations, clusterer=DBSCAN(eps=eps, metric=conf.metric, min_samples=1),
                           cover=km.Cover(n_cubes=conf.intervals, perc_overlap=conf.overlap))

        add_node_metadata(graph, labels, activations)

        store_as_json(graph, graph_output_file + file_name.replace('.txt', '.json'))


if __name__ == "__main__":
    for config in generate_configs():
        LABEL_FILE = '../data/Supersense-Role/entities/train.txt'
        ACTIVATION_FILE = '../data/Supersense-Role/SS_fine_tuned.zip'
        GRAPH_OUTPUT_FILE = '../probing-topoact/public/static/mapper_graphs/' + \
                            f'{config.metric}_{config.filter_func}_{config.intervals}_{int(config.overlap * 100)}/'

        for file_index in tqdm(range(177)):
            create_mapper(f'{file_index}.txt', LABEL_FILE, ACTIVATION_FILE, GRAPH_OUTPUT_FILE, config)

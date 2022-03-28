import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from umap import UMAP

import graph_generator
import utils
import pandas as pd
import numpy as np

import logging

logging.basicConfig(level=logging.INFO)

# configuration
DEBUG = True

# instantiate app
app = Flask(__name__)
app.config.from_object(__name__)
app.json_encoder = graph_generator.NumpyEncoder
app.graph_data = None
app.activations = None
app.labels = None

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')


@app.route('/get_graph', methods=['GET', 'POST'])
def get_graph():
    params: str = request.args.get('params')
    iteration: int = int(request.args.get('iteration'))
    layer: int = int(request.args.get('layer'))

    # # Create directory if not already exists
    # os.makedirs(f'../probing-topoact/public/static/mapper_graphs/{dataset}', exist_ok=True)

    dataset, metric, filter_func, intervals, overlap = params.split('_')
    intervals = int(intervals)
    overlap = float(overlap) / 100

    if dataset == 'ss-role':
        label_file = '../data/ss-role/entities/train.txt'
        activation_file = f'../data/ss-role/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    elif dataset == 'ss-func':
        label_file = '../data/ss-func/entities/train.txt'
        activation_file = f'../data/ss-func/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    elif dataset == 'pos':
        label_file = '../data/pos/entities/train.txt'
        activation_file = f'../data/pos/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    elif dataset == 'dep':
        label_file = '../data/dep/entities/train.txt'
        activation_file = f'../data/dep/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    else:
        raise ValueError('Dataset not supported')

    graph, activations, labels = graph_generator.create_mapper(
        '', label_file, activation_file, graph_output_file, graph_generator.Config(
            metric=metric, filter_func=filter_func, intervals=intervals, overlap=overlap))

    app.graph_data, app.activations, app.labels = graph, activations, labels

    purities, bin_edges = utils.get_purities(graph)

    app.logger.info(f'Graph generated for {dataset}')

    return jsonify(graph=graph, purities=purities, bin_edges=bin_edges)


@app.route('/show_test', methods=['GET', 'POST'])
def show_test():
    params: str = request.args.get('params')
    iteration: int = int(request.args.get('iteration'))
    layer: int = int(request.args.get('layer'))

    dataset, metric, filter_func, intervals, overlap = params.split('_')
    intervals = int(intervals)
    overlap = float(overlap) / 100

    if dataset == 'ss-role':
        label_file = '../data/ss-role/entities/train.txt'
        activation_train = f'../data/ss-role/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test = f'../data/ss-role/fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_test = '../data/ss-role/entities/test.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    elif dataset == 'ss-func':
        label_file = '../data/ss-func/entities/train.txt'
        activation_train = f'../data/ss-func/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test = f'../data/ss-func/fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_test = '../data/ss-func/entities/test.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    else:
        raise ValueError('Dataset not supported')

    graph, activations, labels = graph_generator.create_mapper(
        '', label_file, activation_train, graph_output_file, graph_generator.Config(
            metric=metric, filter_func=filter_func, intervals=intervals, overlap=overlap))
    app.graph_data, app.activations, app.labels = graph, activations, labels

    purities, bin_edges = utils.get_purities(graph)

    graph = utils.add_test_nodes(graph, activation_train, activation_test, label_test)

    return jsonify(graph=graph, purities=purities, bin_edges=bin_edges)


@app.route('/projection', methods=['GET', 'POST'])
def get_projection():
    if app.activations is None:
        return jsonify(projection=None)

    proj_type: str = request.args.get('proj_type')
    projection = utils.compute_projection(app.activations, app.labels, ['train'] * len(app.activations), proj_type)
    projection_json = projection.to_dict(orient='records')
    return jsonify(projection=projection_json)


@app.route('/graph', methods=['GET', 'POST'])
def graph_route():
    params: str = request.args.get('params')
    iteration: int = int(request.args.get('iteration'))
    layer: int = int(request.args.get('layer'))
    datasplit: str = request.args.get('datasplit')

    # # Create directory if not already exists
    # os.makedirs(f'../probing-topoact/public/static/mapper_graphs/{dataset}', exist_ok=True)

    dataset, metric, filter_func, intervals, overlap = params.split('_')
    intervals = int(intervals)
    overlap = float(overlap) / 100

    config = graph_generator.Config(metric=metric, filter_func=filter_func, intervals=intervals, overlap=overlap)

    if dataset == 'ss-role':
        activation_train_file = f'../data/ss-role/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test_file = f'../data/ss-role/fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_train = '../data/ss-role/entities/train.txt'
        label_test = '../data/ss-role/entities/test.txt'
    elif dataset == 'ss-func':
        activation_train_file = f'../data/ss-func/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test_file = f'../data/ss-func/fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_train = '../data/ss-func/entities/train.txt'
        label_test = '../data/ss-func/entities/test.txt'
    elif dataset == "ss-func-role":
        activation_train_file = f'../data/ss-role-fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test_file = f'../data/ss-role/fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_train = '../data/ss-func/entities/train.txt'
        label_test = '../data/ss-func/entities/test.txt'
    elif dataset == "ss-func-pos":
        activation_train_file = f'../data/pos-pud-fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test_file = f'../data/pos-pud-fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_train = '../data/ss-func/entities/train.txt'
        label_test = '../data/ss-func/entities/test.txt'
    elif dataset == 'dep':
        activation_train_file = f'../data/dep/fine-tuned-bert-base-uncased/train/{iteration}/{layer}.txt'
        activation_test_file = f'../data/dep/fine-tuned-bert-base-uncased/test/{iteration}/{layer}.txt'
        label_train = '../data/dep/entities/train.txt'
        label_test = '../data/dep/entities/test.txt'
    else:
        raise ValueError('Dataset not supported')

    if datasplit == 'train':
        activations = pd.read_csv(activation_train_file, delim_whitespace=True, header=None)
        labels = graph_generator.read_labels(label_train, dataset=dataset)
    elif datasplit == 'test':
        activations = pd.read_csv(activation_test_file, delim_whitespace=True, header=None)
        labels = graph_generator.read_labels(label_test, dataset=dataset)
    elif datasplit == 'trainutest':
        activation_train = pd.read_csv(activation_train_file, delim_whitespace=True, header=None)
        activation_test = pd.read_csv(activation_test_file, delim_whitespace=True, header=None)
        label_train = graph_generator.read_labels(label_train, dataset=dataset)
        label_test = graph_generator.read_labels(label_test, dataset=dataset)
        activations = pd.concat([activation_train, activation_test])
        labels = pd.concat([label_train, label_test])
    else:
        raise ValueError(f'Datasplit="{datasplit}" not supported')

    app.activations = activations
    app.labels = labels

    graph = graph_generator.get_mapper(activations, labels, config)
    if dataset in ['ss-role', 'ss-func']:
        purities, bin_edges = utils.get_purities(graph)
        hierarchy = utils.get_hierarchy(graph, activations, labels, max_level=20)
        # print(hierarchies)
        # hierarchies = None
    else:
        purities, bin_edges, hierarchy = None, None, None

    app.logger.info(f'USER: {dataset} {metric} {filter_func} {intervals} {overlap}')

    return jsonify(graph=graph, purities=purities, bin_edges=bin_edges, hierarchy=hierarchy)


if __name__ == '__main__':
    app.run()

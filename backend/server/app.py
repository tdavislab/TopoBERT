from cmath import log
import os
from pprint import pprint
from diskcache import Cache

from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from umap import UMAP

import graph_generator
import utils
import pandas as pd
import numpy as np

from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '%(asctime)s %(levelname)s: %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})


# configuration
DEBUG = True
CACHING = True
cache = Cache('./cache/')


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


@app.route('/graph', methods=['GET', 'POST'])
def mgraph():
    dataset: str = request.args.get('dataset')
    epoch: int = request.args.get('epoch', type=int)
    layer: int = request.args.get('layer', type=int)
    data_split = request.args.get('dataSplit')
    metric: str = request.args.get('metric')
    filter_func: str = request.args.get('filter')
    overlap: float = float(request.args.get('overlap', type=int)) / 100
    intervals: int = request.args.get('intervals', type=int)
    min_samples: int = request.args.get('minSamples', type=int)

    cache_key = f'{dataset}_{epoch}_{layer}_{data_split}_{metric}_{filter_func}_{overlap}_{intervals}_{min_samples}'

    if CACHING and cache_key in cache:
        app.logger.info(f'Cache hit for {cache_key}')
        graph, projection, attachments = cache[cache_key]
        return jsonify(graph=graph, projection=projection, attachments=attachments)

    app.logger.info(f'Request params = {dataset} {epoch} {layer} {data_split} {metric} {filter_func} {overlap} {intervals}')

    config = graph_generator.Config(metric=metric, filter_func=filter_func, intervals=intervals, overlap=overlap, min_samples=min_samples)

    if dataset == 'ss-role':
        activation_train_file = f'../data/ss-role/fine-tuned-bert-base-uncased/train/{epoch}/{layer}.txt'
        activation_test_file = f'../data/ss-role/fine-tuned-bert-base-uncased/test/{epoch}/{layer}.txt'
        label_train = '../data/ss-role/entities/train.txt'
        label_test = '../data/ss-role/entities/test.txt'
    elif dataset == 'ss-func':
        activation_train_file = f'../data/ss-func/fine-tuned-bert-base-uncased/train/{epoch}/{layer}.txt'
        activation_test_file = f'../data/ss-func/fine-tuned-bert-base-uncased/test/{epoch}/{layer}.txt'
        label_train = '../data/ss-func/entities/train.txt'
        label_test = '../data/ss-func/entities/test.txt'
    elif dataset == 'dep':
        activation_train_file = f'../data/dep/fine-tuned-bert-base-uncased/train/{epoch}/{layer}.txt'
        activation_test_file = f'../data/dep/fine-tuned-bert-base-uncased/test/{epoch}/{layer}.txt'
        label_train = '../data/dep/entities/train_aug.txt'
        label_test = '../data/dep/entities/test_aug.txt'
    elif dataset == 'roberta':
        activation_train_file = f'../data/roberta/fine-tuned-bert-base-uncased/train/{epoch}/{layer}.txt'
        activation_test_file = f'../data/roberta/fine-tuned-bert-base-uncased/test/{epoch}/{layer}.txt'
        label_train = '../data/roberta/entities/train.txt'
        label_test = '../data/roberta/entities/test.txt'
    elif dataset == 'berttiny':
        activation_train_file = f'../data/berttiny/fine-tuned-bert-base-uncased/train/{epoch}/{layer}.txt'
        activation_test_file = f'../data/berttiny/fine-tuned-bert-base-uncased/test/{epoch}/{layer}.txt'
        label_train = '../data/berttiny/entities/train.txt'
        label_test = '../data/berttiny/entities/test.txt'
    else:
        raise ValueError('Dataset not supported')

    if data_split == 'train':
        activations = pd.read_csv(activation_train_file, delim_whitespace=True, header=None)
        labels = graph_generator.read_labels(label_train, dataset=dataset)
    elif data_split == 'test':
        activations = pd.read_csv(activation_test_file, delim_whitespace=True, header=None)
        labels = graph_generator.read_labels(label_test, dataset=dataset)
    elif data_split == 'trainutest':
        activation_train = pd.read_csv(activation_train_file, delim_whitespace=True, header=None)
        activation_test = pd.read_csv(activation_test_file, delim_whitespace=True, header=None)
        label_train = graph_generator.read_labels(label_train, dataset=dataset)
        label_test = graph_generator.read_labels(label_test, dataset=dataset)
        activations = pd.concat([activation_train, activation_test])
        labels = pd.concat([label_train, label_test])
    elif data_split == 'trainknntest':
        activation_train = pd.read_csv(activation_train_file, delim_whitespace=True, header=None)
        activation_test = pd.read_csv(activation_test_file, delim_whitespace=True, header=None)
        label_train = graph_generator.read_labels(label_train, dataset=dataset)
        label_test = graph_generator.read_labels(label_test, dataset=dataset)
        label_test_pred = pd.read_csv('../data/ss-role/fine_tuning_batch_preds.csv')
    else:
        raise ValueError(f'Datasplit="{data_split}" not supported')

    attachments = None

    if data_split == 'trainknntest':
        graph = graph_generator.get_mapper(activation_train, label_train, config)
        predicted_labels = label_test_pred[str(epoch)] if dataset in ['ss-role', 'ss-func', 'roberta', 'berttiny'] else None
        graph, attachments = utils.add_test_nodes(graph, activation_train, activation_test,
                                                  label_train, label_test, predicted_labels, dataset)
        projection = utils.compute_projection(activation_train, label_train, ['train'] * len(activation_train), 'PCA')
        app.activations = activation_train
        app.labels = label_train
    else:
        graph = graph_generator.get_mapper(activations, labels, config)
        app.activations = activations
        app.labels = labels
        projection = utils.compute_projection(activations, labels, ['train'] * len(activations), 'PCA')

    # pprint(graph)

    cache[cache_key] = [graph, projection, attachments]

    # if dataset in ['ss-role', 'ss-func']:
    #     purities, bin_edges = utils.get_purities(graph)
    # else:
    #     purities, bin_edges = None, None

    # return jsonify(graph=graph, purities=purities, bin_edges=bin_edges)

    return jsonify(graph=graph, projection=projection, attachments=attachments)


@app.route('/get_graph', methods=['GET', 'POST'])
def get_graph():
    # possibly reduntant
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


# @app.route('/graph', methods=['GET', 'POST'])
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
    else:
        purities, bin_edges = None, None

    return jsonify(graph=graph, purities=purities, bin_edges=bin_edges)


if __name__ == '__main__':
    app.run()

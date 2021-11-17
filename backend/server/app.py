import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from umap import UMAP

from graph_generator import create_mapper, Config, NumpyEncoder
import utils

# configuration
DEBUG = True

# instantiate app
app = Flask(__name__)
app.config.from_object(__name__)
app.json_encoder = NumpyEncoder
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

    graph, activations, labels = create_mapper('', label_file, activation_file, graph_output_file,
                                               Config(metric=metric, filter_func=filter_func, intervals=intervals, overlap=overlap))

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
    else:
        raise ValueError('Dataset not supported')

    graph, activations, labels = create_mapper('', label_file, activation_train, graph_output_file,
                                               Config(metric=metric, filter_func=filter_func, intervals=intervals, overlap=overlap))
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


if __name__ == '__main__':
    app.run()

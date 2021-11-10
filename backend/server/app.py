import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from graph_generator import create_mapper, Config, NumpyEncoder
from utils import get_purities

# configuration
DEBUG = True

# instantiate app
app = Flask(__name__)
app.config.from_object(__name__)
app.json_encoder = NumpyEncoder
app.graph_data = None

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

    graph = create_mapper('', label_file, activation_file, graph_output_file,
                          Config(metric=metric, filter_func=filter_func, intervals=int(intervals), overlap=float(overlap) / 100))

    app.graph_data = graph

    purities, bin_edges = get_purities(graph)

    return jsonify(graph=graph, purities=purities, bin_edges=bin_edges)


if __name__ == '__main__':
    app.run()

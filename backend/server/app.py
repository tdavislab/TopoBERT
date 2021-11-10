import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from graph_generator import create_mapper, Config, NumpyEncoder

# configuration
DEBUG = True

# instantiate app
app = Flask(__name__)
app.config.from_object(__name__)
app.json_encoder = NumpyEncoder

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
        activation_file = f'../data/ss-role/fine-tuned-bert-based-uncased/train/{iteration}/{layer}.txt'
        graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'
    else:
        raise ValueError('Dataset not supported')

    graph = create_mapper('', label_file, activation_file, graph_output_file,
                          Config(metric=metric, filter_func=filter_func, intervals=int(intervals), overlap=float(overlap) / 100))

    return jsonify(graph)


if __name__ == '__main__':
    app.run()

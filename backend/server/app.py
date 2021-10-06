import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from graph_generator import create_mapper, Config

# configuration
DEBUG = True

# instantiate app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')


@app.route('/get_graph', methods=['GET', 'POST'])
def get_graph():
    dataset: str = request.args.get('dataset')
    iteration: int = int(request.args.get('iteration'))

    print(dataset, iteration)
    # # Create directory if not already exists
    # os.makedirs(f'../probing-topoact/public/static/mapper_graphs/{dataset}', exist_ok=True)

    metric, filter_func, intervals, overlap = dataset.split('_')

    label_file = '../data/Supersense-Role/entities/train.txt'
    activation_file = '../data/Supersense-Role/SS_fine_tuned.zip'
    graph_output_file = '../../frontend/public/static/mapper_graphs/' + f'{metric}_{filter_func}_{intervals}_{overlap}/'

    graph = create_mapper(str(iteration) + '.txt', label_file, activation_file, graph_output_file,
                          Config(metric=metric, filter_func=filter_func, intervals=int(intervals), overlap=float(overlap) / 100))

    return 'success'


if __name__ == '__main__':
    app.run()

import ast
import os
import zipfile

import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
# from sklearn.manifold import TSNE
from MulticoreTSNE import MulticoreTSNE as TSNE
from tqdm import tqdm
from umap import UMAP


def read_file_from_zip(zip_path, file_relative_path):
    data = []
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


def compute_projection(file_name, label_file, activation_file, output_path, method='PCA'):
    output_filename = os.path.join(output_path, method, file_name.replace('.txt', '.csv'))
    if os.path.isfile(output_filename):
        return None

    activations = read_file_from_zip(activation_file, f'fine_tuning_changes/{file_name}')

    if method == 'PCA':
        projector = PCA(n_components=2)
    elif method == 'TSNE':
        projector = TSNE(n_components=2, n_jobs=8)
    elif method == 'UMAP':
        projector = UMAP(n_components=2, n_jobs=8)
    else:
        raise KeyError(f'Unexpected projection method = {method}')

    projection = projector.fit_transform(activations)
    projection = pd.DataFrame(np.hstack([np.expand_dims(np.arange(4282), 1), projection]), columns=['index', 'x', 'y'])
    projection = projection.astype({'index': int, 'x': float, 'y': float})
    projection = pd.concat([projection, labels[['word', 'label']]], axis=1)

    os.makedirs(output_path + method, exist_ok=True)
    projection.to_csv(output_filename, index=False, float_format='%.4f')


if __name__ == '__main__':
    LABEL_FILE = '../data/Supersense-Role/entities/train.txt'
    ACTIVATION_FILE = '../data/Supersense-Role/SS_fine_tuned.zip'
    OUTPUT_PATH = '../../frontend/public/static/projections/'

    labels = read_labels(LABEL_FILE)

    methods = ['PCA', 'UMAP', 'TSNE']
    for method in methods:
        for file_index in tqdm(range(177)):
            compute_projection(f'{file_index}.txt', LABEL_FILE, ACTIVATION_FILE, OUTPUT_PATH, method)

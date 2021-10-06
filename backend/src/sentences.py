import zipfile
import pandas as pd
import json


class Sentence:
    def __init__(self, sent_dict, sent_id):
        self.sent_id = sent_id
        self.words = [(x['#'], x["word"]) for i, x in enumerate(sent_dict["toks"])]

    def __repr__(self):
        return ' '.join(map(lambda x: x[1], self.words))

    def __str__(self):
        return ' '.join(map(lambda x: x[1], self.words))


def read_file_from_zip(zip_path, file_relative_path, type='csv'):
    data = []
    with zipfile.ZipFile(zip_path, mode='r') as dataset:
        with dataset.open(file_relative_path, mode='r') as f:
            # for line in f:
            #     decoded_line = line.decode('utf-8').strip().split(' ')
            #     data.append(list(map(float, decoded_line)))
            if type == 'csv':
                data = pd.read_csv(f, sep=' ', header=None)
            elif type == 'json':
                data = json.load(f)
    return data


def create_sentence_file(sentence_list, output_filepath):
    processed_sentences = {}
    for sentence in sentence_list:
        processed_sentences[sentence.sent_id] = str(sentence)

    with open(output_filepath, 'w') as f:
        json.dump(processed_sentences, f)


if __name__ == '__main__':
    sentence_data = read_file_from_zip('../data/Supersense-Role/topoAct.zip', 'topoAct/streusle.ud_train.json', type='json')
    sentences = [Sentence(sent, i) for i, sent in enumerate(sentence_data)]
    create_sentence_file(sentences, '../../frontend/src/assets/data/sentences.json')

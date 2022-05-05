import zipfile
import pandas as pd
import json
import os


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

    # create path if it doesn't exist
    if not os.path.exists(os.path.dirname(output_filepath)):
        os.makedirs(os.path.dirname(output_filepath))

    with open(output_filepath, 'w') as f:
        # write to json with indentation
        json.dump(processed_sentences, f, indent=4)


if __name__ == '__main__':
    base_paths = ['../data/ss-role', '../data/ss-func']
    train_suffix = 'original/streusle.ud_train.json'
    test_suffix = 'original/streusle.ud_test.json'

    # process training files
    for base_path in base_paths:
        train_path = os.path.join(base_path, train_suffix)
        with open(train_path, 'r') as f:
            sentence_data = json.load(f)
            sentences = [Sentence(x, i) for i, x in enumerate(sentence_data)]
            create_sentence_file(sentences, os.path.join(base_path, 'sentences/train.json'))

    # process test files
    for base_path in base_paths:
        test_path = os.path.join(base_path, test_suffix)
        with open(test_path, 'r') as f:
            sentence_data = json.load(f)
            sentences = [Sentence(x, i) for i, x in enumerate(sentence_data)]
            create_sentence_file(sentences, os.path.join(base_path, 'sentences/test.json'))

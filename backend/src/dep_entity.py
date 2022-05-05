# !/usr/bin/env python3
# -*- coding:utf-8 -*-
#
# Author: Yichu Zhou - flyaway1217@gmail.com
# Blog: zhouyichu.com
#
# Python release: 3.8.0
#
# Date: 2021-01-27 13:50:24
# Last modified: 2021-09-09 21:01:56

"""
Build dependency entities.
"""

from typing import List, Tuple

import pyconll


def load_conll(path):
    conll = pyconll.load_from_file(path)
    reval = []
    for sent in conll:
        cur_sent = []
        sentID = sent.id.split('-')[-1]
        for token in sent:
            token.index = (sentID, token.id)
            cur_sent.append(token)
        reval.append(cur_sent)
    return reval


def extract_dep(data) -> List[Tuple[str, str, str]]:
    """Return:
        - a list of (head, mod, rel).
    """
    reval = []
    c = 0
    for sent_id, sent in enumerate(data):
        tokens = [t for t in sent if t.head is not None]
        c += (len(sent)-len(tokens))
        for token_id, token in enumerate(tokens):
            head_idx = int(token.head) - 1
            # Ignore the root
            if head_idx == -1:
                continue
            else:
                triple = (sent_id, token_id, sent[head_idx].form, token.form, token.deprel)
            reval.append(triple)
    print(c)
    return reval


def write(triples, path):
    with open(path, 'w', encoding='utf8') as f:
        for sent_id, token_id, head, mod, rel in triples:
            s = '\t'.join([str(sent_id), str(token_id), head+'--'+mod, rel])
            f.write(s+'\n')


if __name__ == '__main__':
    path = 'original/train.txt'
    data = load_conll(path)
    triples = extract_dep(data)
    path = 'entities/train_aug.txt'
    write(triples, path)

    path = 'original/test.txt'
    data = load_conll(path)
    triples = extract_dep(data)
    path = 'entities/test_aug.txt'
    write(triples, path)

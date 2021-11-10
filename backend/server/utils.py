from collections import Counter
import numpy as np


def get_purities(graph):
    """
    Function that returns the purity of a given list of purities.
    """

    def histogram(lst):
        """
        Function that returns a histogram of a given list.
        """
        return list(np.histogram(lst, bins=np.arange(0, 1.05, 0.1))[0])

    label_list = ['p.Circumstance', 'p.Time', 'p.StartTime', 'p.EndTime', 'p.Frequency', 'p.Duration', 'p.Interval', 'p.Locus', 'p.Goal', 'p.Source',
                  'p.Path', 'p.Direction', 'p.Extent', 'p.Means', 'p.Manner', 'p.Explanation', 'p.Purpose', 'p.Causer', 'p.Agent', 'p.Co-Agent',
                  'p.Theme', 'p.Co-Theme', 'p.Topic', 'p.Stimulus', 'p.Experiencer', 'p.Originator', 'p.Recipient', 'p.Cost', 'p.Beneficiary',
                  'p.Instrument', 'p.Identity', 'p.Species', 'p.Gestalt', 'p.Possessor', 'p.Whole', 'p.Characteristic', 'p.Possession',
                  'p.PartPortion', 'p.Stuff', 'p.Accompanier', 'p.ComparisonRef', 'p.RateUnit', 'p.Quantity', 'p.Approximator', 'p.SocialRel',
                  'p.OrgRole']

    purity_over_nodes = dict([(label, []) for label in label_list])

    for node in graph['nodes']:
        metadata = node['membership']['metadata']
        labels = Counter([x[3] for x in metadata])
        for label in labels:
            purity_over_nodes[label].append(round(labels[label] / len(metadata), 4))

    purity_hists = {label: histogram(purities) for label, purities in purity_over_nodes.items()}
    bin_edges = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]

    return purity_hists, bin_edges

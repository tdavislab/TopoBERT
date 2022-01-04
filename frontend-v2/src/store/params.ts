import { MapperParams } from './types';

export const params: MapperParams = {
  dataSplit: {
    paramList: [
      { name: 'Train', value: 'train' },
      { name: 'Test', value: 'test' },
      { name: 'Train ∪ Test', value: 'trainutest' },
      { name: 'Train + Test (knn)', value: 'trainknntest' },
    ],
    selected: 'train',
  },
  metric: {
    paramList: [
      { name: 'Euclidean', value: 'euclidean' },
      { name: 'Cosine', value: 'cosine' },
    ],
    selected: 'euclidean',
  },
  filter: {
    paramList: [
      { name: 'L1', value: 'l1' },
      { name: 'L2', value: 'l2' },
      { name: 'Average KNN-5', value: 'knn' },
    ],
    selected: 'l1',
  },
  intervals: {
    paramList: [
      { name: '50', value: 50 },
      { name: '100', value: 100 },
    ],
    selected: 50,
  },
  overlap: {
    paramList: [
      { name: '25', value: 25 },
      { name: '50', value: 50 },
      { name: '100', value: 100 },
    ],
    selected: 50,
  },
  layout: {
    paramList: [
      { name: 'Force Directed', value: 'force' },
      { name: 'PCA', value: 'pca' },
    ],
    selected: 'force',
  },
};

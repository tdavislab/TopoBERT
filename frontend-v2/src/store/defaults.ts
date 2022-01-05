export const defaults = {
  defaultEpochs: [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160,
    165, 170, 175, 176,
  ],
  defaultMapperParams: {
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
  },
  defaultLayerObj: {
    layers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    selected: 0,
  },
  defaultDatasetList: {
    datasets: [
      { name: 'SuperSense Role', value: 'ss-role' },
      { name: 'SuperSense Function', value: 'ss-func' },
      { name: 'Part of Speech', value: 'pos' },
      { name: 'Dependency', value: 'dep' },
    ],
    selected: 'ss-role',
  },
};

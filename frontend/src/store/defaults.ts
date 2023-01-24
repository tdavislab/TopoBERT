export const defaults = {
  defaultEpochs: [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160,
    165, 170, 175, 176,
  ],
  defaultMapperParams: {
    dataSplit: {
      paramList: [
        { name: 'Train', value: 'train' },
        { name: 'Validation', value: 'test' },
        // { name: 'Train ∪ Test', value: 'trainutest' },
        { name: 'Train + Validation (via Node attachment)', value: 'trainknntest' },
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
        { name: 'BallMapper', value: 'ballmapper' },
      ],
      selected: 'l2',
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
        { name: '75', value: 75 },
      ],
      selected: 50,
    },
    minSamples: {
      paramList: [
        { name: '1', value: 1 },
        { name: '3', value: 3 },
        { name: '5', value: 5 },
      ],
      selected: 3,
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
    selected: 12,
  },
  defaultDatasetList: {
    datasets: [
      { name: 'SuperSense Role - BERT Base', value: 'ss-role' },
      // { name: 'Part of Speech', value: 'pos' },
      { name: 'SuperSense Role - RoBERTa', value: 'roberta' },
      { name: 'SuporSense Role - BERTTiny', value: 'berttiny' },
      { name: 'SuperSense Function', value: 'ss-func' },
      { name: 'Dependency', value: 'dep' },
    ],
    selected: 'ss-role',
  },
  defaultColorScheme: {
    'p.Circumstance': { color: '#00429d', selected: false },
    'p.Time': { color: '#5e5caf', selected: false },
    'p.StartTime': { color: '#5e5caf', selected: false },
    'p.EndTime': { color: '#5e5caf', selected: false },
    'p.Frequency': { color: '#8f7ac0', selected: false },
    'p.Duration': { color: '#b89bd3', selected: false },
    'p.Interval': { color: '#debfe8', selected: false },
    'p.Locus': { color: '#ffe5ff', selected: false },
    'p.Goal': { color: '#ffe5ff', selected: false },
    'p.Source': { color: '#ffe5ff', selected: false },
    'p.Path': { color: '#eabcdd', selected: false },
    'p.Direction': { color: '#d693b8', selected: false },
    'p.Extent': { color: '#d693b8', selected: false },
    'p.Means': { color: '#c26a90', selected: false },
    'p.Manner': { color: '#ad3f65', selected: false },
    'p.Explanation': { color: '#93003a', selected: false },
    'p.Purpose': { color: '#93003a', selected: false },
    'p.Causer': { color: '#486721', selected: false },
    'p.Agent': { color: '#486721', selected: false },
    'p.Co-Agent': { color: '#486721', selected: false },
    'p.Theme': { color: '#658b4f', selected: false },
    'p.Co-Theme': { color: '#658b4f', selected: false },
    'p.Topic': { color: '#658b4f', selected: false },
    'p.Stimulus': { color: '#85af7d', selected: false },
    'p.Experiencer': { color: '#a8d5ad', selected: false },
    'p.Originator': { color: '#d0fbdd', selected: false },
    'p.Recipient': { color: '#afeccc', selected: false },
    'p.Cost': { color: '#8cddbf', selected: false },
    'p.Beneficiary': { color: '#63ceb4', selected: false },
    'p.Instrument': { color: '#22bfac', selected: false },
    'p.Identity': { color: '#ecad00', selected: false },
    'p.Species': { color: '#f4b842', selected: false },
    'p.Gestalt': { color: '#fac368', selected: false },
    'p.Possessor': { color: '#fac368', selected: false },
    'p.Whole': { color: '#fac368', selected: false },
    'p.Characteristic': { color: '#ffcf8a', selected: false },
    'p.Possession': { color: '#ffcf8a', selected: false },
    'p.PartPortion': { color: '#ffcf8a', selected: false },
    'p.Stuff': { color: '#ffcf8a', selected: false },
    'p.Accompanier': { color: '#ffdbac', selected: false },
    'p.ComparisonRef': { color: '#ffe8ce', selected: false },
    'p.RateUnit': { color: '#f5c8a2', selected: false },
    'p.Quantity': { color: '#eca87c', selected: false },
    'p.Approximator': { color: '#eca87c', selected: false },
    'p.SocialRel': { color: '#d86042', selected: false },
    'p.OrgRole': { color: '#cd3030', selected: false },
    Others: { color: '#989898', selected: false },
    // 'p.Test': { color: '#c7c7c7', selected: false },
  },
  defaultColorSchemeDepBackup: {
    acl: { color: '#46075a', selected: false },
    'acl:relcl': { color: '#470d60', selected: false },
    advcl: { color: '#471365', selected: false },
    advmod: { color: '#48186a', selected: false },
    'advmod:emph': { color: '#481d6f', selected: false },
    'advmod:lmod': { color: '#482374', selected: false },
    amod: { color: '#482878', selected: false },
    appos: { color: '#472d7b', selected: false },
    aux: { color: '#46327e', selected: false },
    'aux:pass': { color: '#453781', selected: false },
    case: { color: '#443b84', selected: false },
    cc: { color: '#424086', selected: false },
    'cc:preconj': { color: '#404588', selected: false },
    ccomp: { color: '#3e4989', selected: false },
    clf: { color: '#3d4e8a', selected: false },
    compound: { color: '#3b528b', selected: false },
    'compound:lvc': { color: '#39568c', selected: false },
    'compound:prt': { color: '#375b8d', selected: false },
    'compound:redup': { color: '#355f8d', selected: false },
    'compound:svc': { color: '#33638d', selected: false },
    conj: { color: '#31678e', selected: false },
    cop: { color: '#2f6b8e', selected: false },
    csubj: { color: '#2e6f8e', selected: false },
    'csubj:pass': { color: '#2c728e', selected: false },
    dep: { color: '#2a768e', selected: false },
    det: { color: '#297a8e', selected: false },
    'det:numgov': { color: '#277e8e', selected: false },
    'det:nummod': { color: '#26828e', selected: false },
    'det:poss': { color: '#25858e', selected: false },
    discourse: { color: '#23898e', selected: false },
    dislocated: { color: '#228d8d', selected: false },
    expl: { color: '#21918c', selected: false },
    'expl:impers': { color: '#1f948c', selected: false },
    'expl:pass': { color: '#1f988b', selected: false },
    'expl:pv': { color: '#1e9c89', selected: false },
    fixed: { color: '#1fa088', selected: false },
    flat: { color: '#20a386', selected: false },
    'flat:foreign': { color: '#22a785', selected: false },
    'flat:name': { color: '#25ab82', selected: false },
    goeswith: { color: '#28ae80', selected: false },
    iobj: { color: '#2db27d', selected: false },
    list: { color: '#32b67a', selected: false },
    mark: { color: '#38b977', selected: false },
    nmod: { color: '#3fbc73', selected: false },
    'nmod:poss': { color: '#46c06f', selected: false },
    'nmod:tmod': { color: '#4ec36b', selected: false },
    nsubj: { color: '#56c667', selected: false },
    'nsubj:pass': { color: '#5ec962', selected: false },
    nummod: { color: '#67cc5c', selected: false },
    'nummod:gov': { color: '#70cf57', selected: false },
    obj: { color: '#7ad151', selected: false },
    obl: { color: '#84d44b', selected: false },
    'obl:agent': { color: '#8ed645', selected: false },
    'obl:arg': { color: '#98d83e', selected: false },
    'obl:lmod': { color: '#a2da37', selected: false },
    'obl:tmod': { color: '#addc30', selected: false },
    orphan: { color: '#b8de29', selected: false },
    parataxis: { color: '#c2df23', selected: false },
    punct: { color: '#cde11d', selected: false },
    reparandum: { color: '#d8e219', selected: false },
    root: { color: '#e2e418', selected: false },
    vocative: { color: '#ece51b', selected: false },
    xcomp: { color: '#f6e620', selected: false },
    Others: { color: '#989898', selected: false },
  },
  defaultColorSchemeDep: {
    // core dependents of clausal predicates
    nsubj: { color: '#56c667', selected: false },
    'nsubj:pass': { color: '#56c667', selected: false },
    'nsubj:outer': { color: '#56c667', selected: false },
    obj: { color: '#80ce5c', selected: false },
    iobj: { color: '#a9c152', selected: false },

    csubj: { color: '#2cac7e', selected: false },
    'csubj:pass': { color: '#2cac7e', selected: false },
    'csubj:outer': { color: '#2cac7e', selected: false },
    ccomp: { color: '#21b290', selected: false },

    xcomp: { color: '#1febf1', selected: false },

    // noun dependents
    nummod: { color: '#8f5bd7', selected: false },
    'nummod:gov': { color: '#8f5bd7', selected: false },
    appos: { color: '#b08bed', selected: false },
    nmod: { color: '#be2cdc', selected: false },
    'nmod:npmod': { color: '#be2cdc', selected: false },
    'nmod:poss': { color: '#be2cdc', selected: false },
    'nmod:tmod': { color: '#be2cdc', selected: false },

    acl: { color: '#46075a', selected: false },
    'acl:relcl': { color: '#470d60', selected: false },

    amod: { color: '#c31e8f', selected: false },
    det: { color: '#e174c2', selected: false },
    'det:predet': { color: '#e174c2', selected: false },
    'det:numgov': { color: '#e174c2', selected: false },
    'det:nummod': { color: '#e174c2', selected: false },
    'det:poss': { color: '#e174c2', selected: false },

    // case-marking, prepositions, possessive
    case: { color: '#0a5d5d', selected: false },

    // Non-core dependents of clausal predicates
    obl: { color: '#f42f2f', selected: false },
    'obl:agent': { color: '#f42f2f', selected: false },
    'obl:npmod': { color: '#f42f2f', selected: false },
    'obl:arg': { color: '#f42f2f', selected: false },
    'obl:lmod': { color: '#f42f2f', selected: false },
    'obl:tmod': { color: '#f42f2f', selected: false },

    advcl: { color: '#b00b44', selected: false },

    advmod: { color: '#4c0505', selected: false },
    'advmod:emph': { color: '#4c0505', selected: false },
    'advmod:lmod': { color: '#4c0505', selected: false },

    // Compounding and unanalyzed
    compound: { color: '#3b528b', selected: false },
    'compound:lvc': { color: '#39568c', selected: false },
    'compound:prt': { color: '#375b8d', selected: false },
    'compound:redup': { color: '#355f8d', selected: false },
    'compound:svc': { color: '#33638d', selected: false },
    fixed: { color: '#1fa088', selected: false },

    flat: { color: '#4e6eba', selected: false },
    'flat:foreign': { color: '#4e6eba', selected: false },
    'flat:name': { color: '#4e6eba', selected: false },
    goeswith: { color: '#8098e5', selected: false },

    // Loose joining relations
    list: { color: '#44b632', selected: false },
    dislocated: { color: '#379b2a', selected: false },
    parataxis: { color: '#328425', selected: false },
    orphan: { color: '#317132', selected: false },
    reparandum: { color: '#67ae7f', selected: false },

    // Special clausal dependents
    vocative: { color: '#ff8e19', selected: false },
    discourse: { color: '#c06a0b', selected: false },
    expl: { color: '#9d4c00', selected: false },
    'expl:impers': { color: '#9d4c00', selected: false },
    'expl:pass': { color: '#9d4c00', selected: false },
    'expl:pv': { color: '#9d4c00', selected: false },

    aux: { color: '#e59e07', selected: false },
    'aux:pass': { color: '#e59e07', selected: false },
    cop: { color: '#9e6e05', selected: false },

    mark: { color: '#c0a708', selected: false },

    // Coordination
    conj: { color: '#90f142', selected: false },
    cc: { color: '#6ab231', selected: false },
    'cc:preconj': { color: '#6ab231', selected: false },

    // Other
    root: { color: '#e2e418', selected: false },
    punct: { color: '#ff9ca9', selected: false },
    dep: { color: '#91e4ff', selected: false },

    clf: { color: '#121212', selected: false },
  },
  defaultTable: {
    header: ['sent_id', 'word_id', 'word', 'class', 'sentence'],
    rows: [
      ['-', '-', '-', '-', '-'],
      // TODO: Replace with approriate interface
    ],
  },
  defaultGraph: {
    nodes: [],
    links: [],
  },
  defaultProjectionData: [],
  defaultTrackingMode: false,
  defaultBubbleGlyph: false,
  defaultTransitionEffect: false,
};

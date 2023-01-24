import { faTable } from '@fortawesome/free-solid-svg-icons';
import * as d3 from 'd3';
import { Pie } from 'd3';
import { NodeEntity } from '../../../store/types';

type PieData = {
  classLabel: string;
  count: number;
};

type Path = {
  arc: any;
  classLabel: string;
};

export default class PieGlyph {
  maxSegments: number;

  constructor(maxSegments: number) {
    this.maxSegments = maxSegments;
  }

  generatePath(nodeData: NodeEntity, nodeSize: number, key: 'classLabel' | 'predLabel' = 'classLabel') {
    const memberPoints = nodeData.memberPoints;

    const groupedData = d3.rollup(
      memberPoints,
      (v) => v.length,
      (d) => d[key]
    );

    const numOthers = [...groupedData.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(this.maxSegments - 1)
      .reduce((acc, curr) => acc + curr[1], 0);

    let topVals: [string, number][] = [...groupedData.entries()].sort((x, y) => y[1] - x[1]).slice(0, this.maxSegments);

    if (numOthers > 0) {
      topVals[this.maxSegments - 1] = ['Others', numOthers];
    }

    const pieData: PieData[] = topVals.map((x) => {
      return { classLabel: x[0], count: x[1] };
    });

    const pieGenerator = d3
      .pie<PieData>()
      .value((d) => d.count)
      .sort(null)(pieData);

    const piePath = pieGenerator.map((d) => {
      return {
        arc: d3.arc().innerRadius(0).outerRadius(nodeSize)(<any>d),
        classLabel: d.data[key],
        type: nodeData.type,
      };
    });

    return piePath;
  }

  generatePathAggregate(nodeDataList: NodeEntity[], nodeSize: number) {
    // merge nodeDataList into a single NodeEntity and then call generatePath on it
    const nodeData: NodeEntity = {
      id: 'aggregatedNode',
      name: 'aggregatedNode',
      avgFilterValue: nodeDataList.map((x) => x.avgFilterValue).reduce((x, y) => x + y, 0) / nodeDataList.length,
      x_pca: 0,
      y_pca: 0,
      x: 0,
      y: 0,
      memberPoints: nodeDataList.map((ne) => ne.memberPoints).flat(),
    };

    return this.generatePath(nodeData, nodeSize);
  }
}

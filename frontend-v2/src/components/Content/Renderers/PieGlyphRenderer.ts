import { faTable } from '@fortawesome/free-solid-svg-icons';
import * as d3 from 'd3';
import { Pie } from 'd3';
import { NodeEntity } from '../../../store/types';

type PieData = {
  classLabel: string;
  count: number;
};

type Path = {
  arc: d3.Arc;
  classLabel: string;
};

export default class PieGlyph {
  maxSegments: number;

  constructor(maxSegments: number) {
    this.maxSegments = maxSegments;
  }

  generatePath(nodeData: NodeEntity, nodeSize: number) {
    const memberPoints = nodeData.memberPoints;

    const groupedData = d3.rollup(
      memberPoints,
      (v) => v.length,
      (d) => d.classLabel
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
      .pie()
      .value((d) => d.count)
      .sort(null)(pieData);

    const piePath: Path = pieGenerator.map((d) => {
      return {
        arc: d3.arc().innerRadius(0).outerRadius(nodeSize)(d),
        classLabel: d.data.classLabel,
      };
    });

    return piePath;
    // console.table(groupedData);
    // console.table(topVals);

    // console.log(topVals);

    // const pie = d3.pie().value((d: [string, number]) => d[1]);

    // let pie = d3
    //   .pie()
    //   .value((d) => d[1])
    //   .sort(null)(topVals);

    // let chartData: PieData[] = pie.map((d) => {
    //   console.log(d);
    //   return {
    //     arc: d3.arc().innerRadius(0).outerRadius(nodeSize)(d),
    //     group: d.data,
    //     //   type: dType,
    //   };
    // });
    // return chartData;
  }
}

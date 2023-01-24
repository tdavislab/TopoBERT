import * as d3 from 'd3';
import { store } from '../../../store/store';
import { ProjectionData, ColorMap, ProjectionRow } from '../../../store/types';

export default class ProjectionRenderer {
  pca_g: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  points!: d3.Selection<d3.BaseType | SVGCircleElement, ProjectionRow, d3.BaseType, unknown>;

  constructor() {
    this.pca_g = d3.select('#projection-svg>g');
  }

  draw(projectionData: ProjectionData) {
    // draw projection using d3
    this.pca_g = d3.select('#projection-svg-g');

    const width = 100;
    const height = 100;

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // get data bounds
    const xbounds = d3.extent(projectionData.map((d) => d.x));
    const ybounds = d3.extent(projectionData.map((d) => d.y));

    const xScale = d3.scaleLinear().domain(xbounds).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain(ybounds).range([innerHeight, 0]);

    // const xAxis = d3.axisBottom(xScale).ticks(5);
    // const yAxis = d3.axisLeft(yScale).ticks(5);

    // const xAxisG = this.pca_g.select('.x-axis');
    // const yAxisG = this.pca_g.select('.y-axis');

    // xAxisG.call(xAxis);
    // yAxisG.call(yAxis);

    this.points = this.pca_g
      .selectAll('.dot')
      .data(projectionData)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('fill', (d) => store.state.colorMap[d.label].color)
            .attr('cx', (d) => margin.left + xScale(d.x))
            .attr('cy', (d) => margin.top + yScale(d.y)),
        (update) =>
          update
            .attr('fill', (d) => store.state.colorMap[d.label].color)
            .transition()
            .duration(5000)
            .attr('cx', (d) => margin.left + xScale(d.x))
            .attr('cy', (d) => margin.top + yScale(d.y))
            .attr('r', 0.5),
        (exit) => exit.remove()
      )
      .attr('class', 'dot')
      .attr('r', 0.5)
      .attr('fill', (d) => store.state.colorMap[d.label].color);

    this.points.append('title').text((d) => d.label);
  }

  filterLabels(labels: Set<string>) {
    this.points.each(function (d) {
      if (labels.has(d.label)) {
        d3.select(this).attr('opacity', 1);
      } else {
        d3.select(this).attr('opacity', 0.05);
      }
    });
  }

  clearHighlight() {
    this.points.attr('opacity', 1);
  }
}

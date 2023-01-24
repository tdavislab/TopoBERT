import * as d3 from 'd3';
import { filter } from 'd3';
import { BaseTransition } from 'vue';
import { store } from '../../../store/store';
import { NodeEntity } from '../../../store/types';

export default class FilterDistRenderer {
  svg_g: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;

  constructor() {
    this.svg_g = d3.select('#filter-dist-svg');
    this.margin = { top: 20, right: 50, bottom: 20, left: 50 };
    this.width = 1000;
    this.height = 500;
    this.xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.margin.left, this.width - this.margin.right]);
    this.yScale = d3.scaleLinear().domain([0, 50]).range([this.height, 0]);
  }

  draw2(selectedNodes: NodeEntity[]) {
    this.svg_g = d3.select('#filter-dist-svg-g');
    // this.svg_g.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const filterDistData = selectedNodes.map((node) => node.memberPoints.map((point) => point.l2norm)).flat();
    const all_norms = store.state.graph.nodes.map((node) => node.memberPoints.map((m) => m.l2norm)).flat();
    this.xScale.domain(<[number, number]>d3.extent(all_norms)).nice();
    // this.xScale.domain([0, 20]);

    const xAxis = d3.axisBottom(this.xScale);
    const xAxisGroup = this.svg_g.select('.x-axis').attr('transform', 'translate(0, 225)').transition().duration(500).call(xAxis);

    function kde(kernel, thresholds: number[], data: number[]) {
      return thresholds.map((t) => [t, d3.mean(data, (d) => kernel(t - d))]);
    }

    function epanechnikov(bandwidth: number) {
      return (x) => (Math.abs((x /= bandwidth)) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0);
    }

    const line = d3
      .line()
      .curve(d3.curveBasis)
      .x((d) => this.xScale(d[0]))
      .y((d) => this.yScale(d[1]));

    // const area = d3
    //   .area()
    //   .curve(d3.curveBasis)
    //   .x((d) => this.xScale(d[0]))
    //   .y0(0)
    //   .y1((d) => this.yScale(d[1]));

    const threshold_arr = this.xScale.ticks(40);
    const bandwidth = 0.00001;
    const density = kde(epanechnikov(bandwidth), threshold_arr, filterDistData);

    const bins = d3.bin().domain(this.xScale.domain()).thresholds(threshold_arr)(filterDistData);

    this.svg_g
      .select('.filterValues')
      .selectAll('.upside')
      .data([density])
      .join('path')
      .attr('class', 'upside')
      .transition()
      .duration(500)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1)
      .attr('d', line)
      .attr('transform', 'translate(0, 225) scale(1, -1)');
  }

  draw(selectedNodes: NodeEntity[]) {
    this.svg_g = d3.select('#filter-dist-svg-g');
    this.svg_g;
    //   .attr('width', this.width - this.margin.left - this.margin.right)
    //   .attr('height', this.height - this.margin.top - this.margin.bottom)
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const filterDistData = selectedNodes
      .map((node) =>
        node.memberPoints.map((point) => {
          return { filterValue: point.l2norm, classLabel: point.classLabel };
        })
      )
      .flat(2)
      .sort((a, b) => (a.classLabel > b.classLabel ? 1 : -1));
    this.svg_g.selectAll('*').remove();
    BeeswarmChart(filterDistData, this.svg_g, {
      x: (d) => d.filterValue,
      height: this.height,
      width: this.width,
      group: (d) => d.classLabel,
      radius: 5,
    });
    // const all_norms = store.state.graph.nodes.map((node) => node.memberPoints.map((m) => m.l2norm)).flat();

    // this.xScale.domain(<[number, number]>d3.extent(all_norms)).nice();
    // const xAxis = d3.axisBottom(this.xScale);
    // this.svg_g
    //   .select('.x-axis')
    //   .attr('transform', `translate(0, ${this.height})`)
    //   .call(xAxis as any);

    // this.yScale.domain([0, 50]);
    // const yAxis = d3.axisLeft(this.yScale);
    // this.svg_g
    //   .select('.y-axis')
    //   .attr('transform', `translate(${this.margin.left}, 0)`)
    //   .call(yAxis as any);

    // const bins = d3
    //   .bin()
    //   .domain(<[number, number]>this.xScale.domain())
    //   .thresholds(this.xScale.ticks(40))(filterDistData);

    // const maxNum = d3.max(bins, (bin) => bin.leng th);

    // const yNum = d3.scaleLinear().domain([0, maxNum]).range([this.height, 0]);

    // console.log(maxNum, bins);

    // this.svg_g
    //   .select('.filterValues')
    //   .selectAll('path')
    //   .data([bins])
    //   .join('path')
    //   .attr('stroke', 'steelblue')
    //   .attr('d', (d) => d3.area().x1((d) => this.xScale(d.x0)));
  }
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/beeswarm
function BeeswarmChart(
  data,
  svg,
  {
    value = (d) => d, // convenience alias for x
    label, // convenience alias for xLabel
    type = d3.scaleLinear, // convenience alias for xType
    domain, // convenience alias for xDomain
    x = value, // given d in data, returns the quantitative x value
    title = null, // given d in data, returns the title
    group, // given d in data, returns an (ordinal) value for color
    groups, // an array of ordinal values representing the data groups
    colors = d3.schemeTableau10, // an array of color strings, for the dots
    radius = 3, // (fixed) radius of the circles
    padding = 1.5, // (fixed) padding between the circles
    marginTop = 10, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 20, // left margin, in pixels
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    xType = type, // type of x-scale, e.g. d3.scaleLinear
    xLabel = label, // a label for the x-axis
    xDomain = domain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x).map((x) => (x == null ? NaN : +x));
  const T = title == null ? null : d3.map(data, title);
  const G = group == null ? null : d3.map(data, group);

  // Compute which data points are considered defined.
  const I = d3.range(X.length).filter((i) => !isNaN(X[i]));

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (G && groups === undefined) groups = d3.sort(G);

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const color = group == null ? null : d3.scaleOrdinal(groups, colors);

  // Compute the y-positions.
  const Y = dodge(
    I.map((i) => xScale(X[i])),
    radius * 2 + padding
  );

  // Compute the default height;
  if (height === undefined) height = d3.max(Y) + (radius + padding) * 2 + marginTop + marginBottom;

  // Given an array of x-values and a separation radius, returns an array of y-values.
  function dodge(X, radius) {
    const Y = new Float64Array(X.length);
    const radius2 = radius ** 2;
    const epsilon = 1e-3;
    let head = null,
      tail = null;

    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    function intersects(x, y) {
      let a = head;
      while (a) {
        const ai = a.index;
        if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
        a = a.next;
      }
      return false;
    }

    // Place each circle sequentially.
    for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {
      // Remove circles from the queue that can’t intersect the new circle b.
      while (head && X[head.index] < X[bi] - radius2) head = head.next;

      // Choose the minimum non-intersecting tangent.
      if (intersects(X[bi], (Y[bi] = 0))) {
        let a = head;
        Y[bi] = Infinity;
        do {
          const ai = a.index;
          let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
          if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
          a = a.next;
        } while (a);
      }

      // Add b to the queue.
      const b = { index: bi, next: null };
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }

    return Y;
  }

  // const svg = d3.create("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("viewBox", [0, 0, width, height])
  //     .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const xAxisGroup = svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(xAxis);

  xAxisGroup.selectAll('.tick text').attr('font-size', '16px');

  xAxisGroup.call((g) =>
    g
      .append('text')
      .attr('x', width)
      .attr('y', marginBottom - 4)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .text(xLabel)
  );

  const dot = svg
    .append('g')
    .selectAll('circle')
    .data(I)
    .join('circle')
    .attr('cx', (i) => xScale(X[i]))
    .attr('cy', (i) => height - marginBottom - radius - padding - Y[i])
    .attr('r', radius);

  if (G) dot.attr('fill', (i) => store.state.colorMap[G[i]].color);

  if (T) dot.append('title').text((i) => T[i]);

  return svg.node();
}

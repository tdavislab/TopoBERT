import * as d3 from 'd3';
import { BaseType } from 'd3';
import { defaults } from '../../../store/defaults';
import { Graph, NodeEntity } from '../../../store/types';

type Points = {
  x: number;
  y: number;
  fx?: number;
  fy?: number;
};

export default class GraphRenderer {
  nodeColorScale: d3.ScaleSequential<string, never>;
  nodeSizeScale: d3.ScaleLinear<number, number, never>;
  linkColorScale: d3.ScaleSequential<string, never>;
  linkSizeScale: d3.ScaleLinear<number, number, never>;
  svg: d3.Selection<SVGElement, any, HTMLElement, any>;

  constructor() {
    this.svg = d3.select('#graph-svg');
    this.nodeColorScale = d3.scaleSequential(d3.interpolateTurbo);
    this.nodeSizeScale = d3.scaleLinear().range([5, 15]);
    this.linkColorScale = d3.scaleSequential(d3.interpolatePlasma);
    this.linkSizeScale = d3.scaleLinear().range([1, 10]);
  }

  draw(graph: Graph, svg_selector: string) {
    try {
      const node_group = d3.select('g#node_group');
      const link_group = d3.select('g#link_group');

      this.nodeSizeScale.domain(<[number, number]>d3.extent(graph.nodes, (node) => node.memberPoints.length));
      this.nodeColorScale.domain(<[number, number]>d3.extent(graph.nodes, (node) => node.avgFilterValue));
      console.log(this.nodeColorScale);

      const simulation = d3
        .forceSimulation(graph.nodes)
        .force(
          'link',
          d3.forceLink(graph.links).id((d: any) => d.id)
        )
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(500, 500))
        .force('x', d3.forceX().strength(0.2))
        .force('y', d3.forceY().strength(0.2))
        .stop();

      simulation.tick(200);
      simulation.restart();

      const links = link_group
        .selectAll('line')
        .data(graph.links)
        .join('line')
        .attr('stroke', (d) => this.linkColorScale(d.intersection))
        .attr('stroke-width', (d) => this.linkSizeScale(d.intersection));

      const nodes = node_group
        .selectAll('g')
        .data(graph.nodes)
        .join('g')
        .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

      this.drag(simulation)(<any>nodes);

      nodes
        .append('circle')
        .attr('r', (d) => this.nodeSizeScale(d.memberPoints.length))
        .attr('fill', (d) => this.nodeColorScale(d.avgFilterValue))
        .attr('stroke', 'black');

      simulation.on('tick', () => {
        nodes.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

        links
          .attr('x1', (d) => (d as unknown as { source: Points }).source.x)
          .attr('y1', (d) => (d as unknown as { source: Points }).source.y)
          .attr('x2', (d) => (d as unknown as { target: Points }).target.x)
          .attr('y2', (d) => (d as unknown as { target: Points }).target.y);
      });

      d3.zoom().scaleExtent([0.2, 10]).on('zoom', zoomed)(d3.select(svg_selector));

      function zoomed(event: any) {
        d3.select(svg_selector).select('g').attr('transform', event.transform);
      }
    } catch (e) {
      console.log(e);
    }
  }

  drag(simulation: d3.Simulation<NodeEntity, any>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.01).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      // d3.select(this).classed("fixed", true);
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      // event.subject.fx = null;
      // event.subject.fy = null;
    }

    return d3.drag<SVGGElement, NodeEntity>().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  }
}

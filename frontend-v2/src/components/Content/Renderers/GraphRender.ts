import * as d3 from 'd3';
import { BaseType, HierarchyPointNode, Path, PieArcDatum } from 'd3';
import { defaults } from '../../../store/defaults';
import { store } from '../../../store/store';
import { Graph, NodeEntity, LinkEntity, MemberPoints } from '../../../store/types';
import PieGlyph from './PieGlyphRenderer';

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
  glyphType: 'circle' | 'pie' = 'pie';
  glyphRenderer: PieGlyph;
  nodeD3: d3.Selection<d3.BaseType | SVGGElement, NodeEntity, d3.BaseType, unknown>;
  linkD3: d3.Selection<d3.BaseType | SVGLineElement, LinkEntity, d3.BaseType, unknown>;
  simulation!: d3.Simulation<NodeEntity, undefined>;

  constructor() {
    this.svg = d3.select('#graph-svg');
    this.nodeColorScale = d3.scaleSequential(d3.interpolateTurbo);
    this.nodeSizeScale = d3.scaleLinear().range([15, 50]);
    this.linkColorScale = d3.scaleSequential(d3.interpolatePlasma);
    this.linkSizeScale = d3.scaleLinear().range([1, 10]);
    this.glyphRenderer = new PieGlyph(8);
    this.nodeD3 = d3.select('#graph-svg').selectAll('g');
    this.linkD3 = d3.select('#graph-svg').selectAll('line');
  }

  draw(graph: Graph, svg_selector: string, pieColorScale: d3.ScaleOrdinal<string, unknown, never>) {
    const node_group = d3.select('g#node_group');
    const link_group = d3.select('g#link_group');
    const graph_obj = this;

    node_group.selectAll('*').remove();
    link_group.selectAll('*').remove();

    this.nodeSizeScale.domain(<[number, number]>d3.extent(graph.nodes, (node) => node.memberPoints.length));
    this.nodeColorScale.domain(<[number, number]>d3.extent(graph.nodes, (node) => node.avgFilterValue));

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        'link',
        d3.forceLink(graph.links).id((d: any) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(500, 500))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .stop();

    simulation.tick(200);
    simulation.restart();

    this.simulation = simulation;

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
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
      .attr('style', 'cursor: pointer;');

    nodes.on('click', function (clickEvent) {
      const node = d3.select(this);
      const nodeEntity: NodeEntity = node.datum() as NodeEntity;
      store.commit('addSelectedNode', nodeEntity);

      const selectedNodeIds = new Set(store.state.selectedNodes.map((node) => node.id));

      nodes.selectAll('.node-outline').remove();
      // nodes
      //   .insert('circle', ':first-child')
      //   .attr('class', 'node-outline')
      //   .attr('stroke', 'red')
      //   .attr('stroke-width', '5px')
      //   .attr('fill', 'red')
      //   .attr('r', (d) => {
      //     if (selectedNodeIds.has(d.id)) {
      //       return graph_obj.nodeSizeScale(d.memberPoints.length) + 20;
      //     } else {
      //       return 0;
      //     }
      //   });
      graph_obj.selectionHighlight(store.state.selectedNodes);

      store.dispatch('updateMetadataTable');
    });

    this.nodeD3 = nodes;
    this.linkD3 = links;

    this.drag(simulation)(<any>nodes);

    if (this.glyphType === 'circle') {
      nodes
        .append('circle')
        .attr('r', (d) => this.nodeSizeScale(d.memberPoints.length))
        .attr('fill', (d) => this.nodeColorScale(d.avgFilterValue))
        .attr('stroke', 'black')
        .attr('stroke-width', '2px');
    } else if (this.glyphType === 'pie') {
      nodes
        .append('g')
        .attr('class', 'force-glyph')
        .selectAll('path')
        .data((d) => this.glyphRenderer.generatePath(d, this.nodeSizeScale(d.memberPoints.length)))
        .join('path')
        .attr('d', (d) => d.arc)
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('fill', (d): any => pieColorScale(d.classLabel))
        .append('title')
        .text((d) => d.classLabel);
    }

    simulation.on('tick', () => {
      nodes.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

      links
        .attr('x1', (d) => (d as unknown as { source: Points }).source.x)
        .attr('y1', (d) => (d as unknown as { source: Points }).source.y)
        .attr('x2', (d) => (d as unknown as { target: Points }).target.x)
        .attr('y2', (d) => (d as unknown as { target: Points }).target.y);
    });

    d3.zoom().scaleExtent([0.2, 10]).on('zoom', zoomed)(d3.select(svg_selector));

    // const nodeBubbleGlyph = d3
    //   .select('g#node_group')
    //   .selectAll('g')
    //   .selectAll('g.bubble-glyph')
    //   .data(graph.nodes)
    //   .join('g')
    //   .attr('class', 'bubble-glyph');
    // console.log(nodeBubbleGlyph);

    // const nodeEncirclers = nodeGroups.selectAll('g.bubble-glyph').data(nodes.data()).join('g').classed('bubble', true);

    // circle pack for each nodeEncircler
    // nodeBubbleGlyph
    //   .append('g')
    //   .attr('transform', (d) => `translate(-${this.nodeSizeScale(d.memberPoints.length) / 2}, -${this.nodeSizeScale(d.memberPoints.length) / 2})`)
    //   .selectAll('circle.bubble-element')
    //   .data((d) => pack(d.memberPoints, this.nodeSizeScale(d.memberPoints.length)))
    //   .join('circle')
    //   .attr('class', 'bubble-element')
    //   .attr('fill', (d) => (d.children ? 'white' : store.state.colorMap[d.data.classLabel].color))
    //   .attr('transform', (d, i) => 'translate(' + d.x + ',' + d.y + ')')
    //   .attr('r', (d) => d.r)
    //   .attr('stroke', 'black')
    //   .attr('stroke-width', '1px')
    //   .attr('stroke-opacity', 0.3)
    //   .append('title')
    //   .text((d) => `${d.data.word}-${d.data.classLabel}`);

    console.log(this);

    function zoomed(event: any) {
      d3.select(svg_selector).select('g').attr('transform', event.transform);
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

  selectionHighlight(nodes: NodeEntity[]) {
    this.nodeD3.selectAll('.node-outline').remove();
    const selectedNodeIds = new Set(nodes.map((node) => node.id));

    // this.nodeD3
    //   .insert('circle', ':first-child')
    //   .attr('class', 'node-outline')
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', '5px')
    //   .attr('fill', 'red')
    //   .attr('r', (d) => {
    //     if (selectedNodeIds.has(d.id)) {
    //       return this.nodeSizeScale(d.memberPoints.length) + 40;
    //     } else {
    //       return 0;
    //     }
    //   });

    this.nodeD3
      .insert('circle', ':first-child')
      .attr('class', 'node-outline')
      .attr('stroke', '#de2612')
      .attr('stroke-width', (d) => {
        if (selectedNodeIds.has(d.id)) {
          return '15px';
        } else {
          return '0px';
        }
      })
      .attr('fill', (d) => {
        if (selectedNodeIds.has(d.id)) {
          return 'none';
        } else {
          return 'none';
        }
      })
      .attr('r', (d) => {
        if (selectedNodeIds.has(d.id)) {
          return this.nodeSizeScale(d.memberPoints.length) + 20;
        } else {
          return 0;
        }
      });
  }

  filterHighlight(nodes: NodeEntity[]) {
    const selectedNodeIds = new Set(nodes.map((node) => node.id));

    this.nodeD3.attr('opacity', (d) => {
      if (selectedNodeIds.has(d.id)) {
        return 1;
      } else {
        return 0.2;
      }
    });

    this.linkD3.attr('opacity', 0.2);
  }

  clearHighlight() {
    this.nodeD3.selectAll('.node-outline').remove();
    this.nodeD3.attr('opacity', 1);
    this.linkD3.attr('opacity', 1);
  }

  convertToLayout(layout: String | Number) {
    const nodeData = this.nodeD3.data();

    if (layout === 'pca') {
      this.simulation.restart();
      this.linkD3.transition().duration(500).attr('opacity', 0);

      this.nodeD3
        .transition()
        .delay(250)
        .duration(1000)
        .attr('transform', (d, i) => {
          const x = nodeData[i].x_pca * 100;
          const y = nodeData[i].y_pca * 100;

          return 'translate(' + x + ',' + y + ')';
        })
        .on('end', () => {
          this.simulation.nodes().forEach((node, idx) => {
            node.fx = node.x_pca * 100;
            node.fy = node.y_pca * 100;
          });
        });
    } else if (layout === 'force') {
      const nodeData = this.nodeD3.data();

      this.nodeD3
        .transition()
        .duration(1000)
        .attr('transform', (d, i) => {
          const x = nodeData[i].x;
          const y = nodeData[i].y;

          return 'translate(' + x + ',' + y + ')';
        })
        .on('end', () => {
          this.simulation.nodes().forEach((node) => {
            node.fx = null;
            node.fy = null;
          });
          this.simulation.restart();
        });
      this.linkD3.transition().delay(750).duration(500).attr('opacity', 1);
    }
  }

  bubbleGlyph(visible: Boolean) {
    if (visible) {
      d3.selectAll('g.force-glyph').attr('visibility', 'hidden');

      this.nodeD3
        .append('g')
        .attr('class', 'bubble-glyph')
        .attr('transform', (d) => `translate(-${this.nodeSizeScale(d.memberPoints.length) / 2}, -${this.nodeSizeScale(d.memberPoints.length) / 2})`)
        .selectAll('circle')
        .data((d) => pack(d.memberPoints, this.nodeSizeScale(d.memberPoints.length)))
        .join('circle')
        .attr('class', 'bubble-element')
        .attr('fill', (d) => (d.children ? 'white' : store.state.colorMap[d.data.classLabel].color))
        .attr('transform', (d, i) => 'translate(' + d.x + ',' + d.y + ')')
        .attr('r', (d) => d.r)
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .attr('stroke-opacity', 0.3)
        .append('title')
        .text((d) => `${d.data.word}-${d.data.classLabel}`);
    } else {
      d3.selectAll('g.force-glyph').attr('visibility', 'visible');
      d3.selectAll('g.bubble-glyph').remove();
    }

    function pack(memberPoints: MemberPoints[], size: number) {
      const root = d3.hierarchy({ name: 'root', children: memberPoints });
      const pack = d3
        .pack()
        .size([size, size])
        .padding(0)
        .radius((d) => 5);

      return pack(root).descendants();
    }
  }
}

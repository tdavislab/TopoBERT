import * as d3 from 'd3';
import { BaseType, HierarchyPointNode, Path, PieArcDatum, utcParse } from 'd3';
import { onUpdated } from 'vue';
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
  pieColorScale!: d3.ScaleOrdinal<string, unknown, never>;
  graphData!: Graph;

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
    console.log('drawing graph');

    this.graphData = graph;
    this.svg = d3.select(svg_selector);
    this.pieColorScale = pieColorScale;

    let node_group = this.svg.select('g g.node_group');
    const link_group = this.svg.select('g g.link_group');

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
      .force('center', d3.forceCenter(2000, 1250))
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
      .classed('node-element', true)
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
      .attr('style', 'cursor: pointer;');

    nodes.on('click', function (clickEvent) {
      const node = d3.select(this);
      const nodeEntity: NodeEntity = node.datum() as NodeEntity;
      store.commit('addSelectedNode', nodeEntity);

      const selectedNodeIds = new Set(store.state.selectedNodes.map((node) => node.id));

      nodes.selectAll('.node-outline').remove();

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

    console.log({ graph: this, d3: d3 });

    function zoomed(event: any) {
      graph_obj.svg.select('g').attr('transform', event.transform);
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
      // this.simulation.restart();
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
          // this.simulation.restart();
        });
      this.linkD3.transition().delay(750).duration(500).attr('opacity', 1);
    }
  }

  bubbleGlyph(visible: Boolean) {
    if (visible) {
      this.svg.selectAll('g.force-glyph').attr('visibility', 'hidden');

      this.nodeD3
        .append('g')
        .attr('class', 'bubble-glyph')
        .attr('transform', (d) => `translate(-${this.nodeSizeScale(d.memberPoints.length) / 2}, -${this.nodeSizeScale(d.memberPoints.length) / 2})`)
        .selectAll('circle')
        .data((d) => pack(d.memberPoints, this.nodeSizeScale(d.memberPoints.length)))
        .join('circle')
        .attr('class', 'bubble-element')
        .attr('fill', (d) => (d.children ? 'white' : store.state.colorMap[d.data.classLabel].color))
        .attr('class', (d) => (d.children ? 'bubble-boundary' : 'bubble-element'))
        .attr('transform', (d, i) => 'translate(' + d.x + ',' + d.y + ')')
        .attr('r', (d) => d.r)
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .attr('stroke-opacity', 0.3)
        .append('title')
        .text((d) => `${d.data.word}-${d.data.classLabel}`);
    } else {
      this.svg.selectAll('g.force-glyph').attr('visibility', 'visible');
      this.svg.selectAll('g.bubble-glyph').remove();
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

  transitionToNewGraph(newGraph: Graph) {
    // convert previous graph data from node view to point view
    const pointData = d3
      .selectAll('.bubble-element')
      .data()
      .map((d: any) => d.data);

    // augment point data with location info
    const svgCoords = this.svg.node().getBoundingClientRect();
    const coords: any[] = [];

    this.nodeD3.selectAll('.bubble-element').each(function (d, i) {
      const bbox = this!.getBoundingClientRect();
      const x = bbox.x - svgCoords.x + bbox.width / 2;
      const y = bbox.y - svgCoords.y + bbox.height / 2;
      coords.push({ x, y, r: d.r });
    });

    this.svg.select('g').selectAll('*').remove();
    // reset translation but keep zoom level
    const transform = this.svg.select('g').attr('transform');
    if (transform) {
      const scale = transform.split('scale(')[1].split(')')[0].split(',')[0];
      this.svg.select('g').attr('transform', '');
    }
    const pointGroup = this.svg.select('g').append('g').attr('class', 'point-group');

    // add circles to svg
    pointGroup
      .selectAll('circle')
      .data(pointData)
      .join('circle')
      .attr('class', 'point-element')
      .attr('fill', (d) => store.state.colorMap[d.classLabel].color)
      .attr('r', (d, i) => coords[i].r)
      .attr('cx', (d, i) => coords[i].x)
      .attr('cy', (d, i) => coords[i].y)
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .attr('stroke-opacity', 0.3);

    // draw new graph on new-graph svg
    // d3.select('#graph-svg').classed('hidden', true);
    this.draw(newGraph, '#new-svg', this.pieColorScale);
    this.bubbleGlyph(true);
    d3.select('#new-svg').classed('hidden', false);
    this.svg.attr('opacity', 0);

    // compute pointData and coords for new graph
    const newPointData = this.svg
      .selectAll('.bubble-element')
      .data()
      .map((d: any) => d.data);

    const newSvgCoords = this.svg.node().getBoundingClientRect();
    const newCoords: any[] = [];

    // d3.select('#new-svg').classed('hidden', false);
    this.nodeD3.selectAll('.bubble-element').each(function (d, i) {
      const bbox = this!.getBoundingClientRect();
      const x = bbox.x - newSvgCoords.x + bbox.width / 2;
      const y = bbox.y - newSvgCoords.y + bbox.height / 2;
      newCoords.push({ x, y, r: d.r });
    });
    d3.select('#new-svg').classed('hidden', true);

    console.log(newCoords);

    this.svg.select('g').selectAll('*').remove();
    // reset translation but keep zoom level
    const newtransform = this.svg.select('g').attr('transform');
    if (newtransform) {
      const newScale = newtransform.split('scale(')[1].split(')')[0].split(',')[0];
      this.svg.select('g').attr('transform', '');
    }
    const newPointGroup = this.svg.select('g').append('g').attr('class', 'point-group');

    // add circles to svg
    pointGroup
      .selectAll('circle')
      .data(newPointData)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('fill', (d) => store.state.colorMap[d.classLabel].color)
            .attr('r', (d, i) => 0)
            .attr('cx', (d, i) => newCoords[i].x)
            .attr('cy', (d, i) => newCoords[i].y)
            .call((g) =>
              g
                .transition()
                .delay(5000)
                .duration(5000)
                .ease(d3.easePolyIn)
                .attr('r', (d, i) => newCoords[i].r)
            ),
        (update) =>
          update.call((g) =>
            g
              .transition()
              .delay((d, i) => (i / 10) * 5)
              .duration(5000)
              .attr('cx', (d, i) => newCoords[i].x)
              .attr('cy', (d, i) => newCoords[i].y)
          ),
        (exit) => exit.transition().duration(5000).attr('opacity', 0).remove()
      )
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .attr('stroke-opacity', 0.3);
  }

  transitionToNewGraph2(newGraph: Graph) {
    console.log('transition to new graph');

    // stop simulation
    const nodes = this.nodeD3;
    const links = this.linkD3;

    // this.linkD3.data(newGraph.links).join(
    //   (enter) => enter.append('line').attr('opacity', 0).transition().duration(1500).attr('opacity', 0.5).selection(),
    //   (update) => update.transition().duration(1500).attr('opacity', 1).selection(),
    //   (exit) => exit.transition().duration(1500).attr('opacity', 0).remove().selection()
    // );
    this.linkD3.remove();

    const svg_coords = this.svg.node().getBoundingClientRect();
    console.log(svg_coords);

    this.nodeD3.selectAll('.force-glyph').remove();
    d3.selectAll('.bubble-element').each(function () {
      // get screen space coords
      const bbox = this!.getBoundingClientRect();
      // console.log(this.getBBox());

      d3.select('#graph-svg .node_group')
        .append(() => this)
        .attr('transform', `translate(${bbox.x - svg_coords.x + bbox.width / 2}, ${bbox.y - svg_coords.y + bbox.height / 2})`);
    });

    d3.selectAll('.node-element').remove();

    const origSvg = this.svg;
    const origSvgGTranmsform = origSvg.select('g').attr('transform');

    // create a new hidden svg to temporarily store the new nodes
    const newSvg = d3.select('#new-svg').attr('opacity', 0);

    // apply previous transform to new svg
    origSvg
      .attr('opacity', 1)
      .transition()
      .duration(1000)
      .attr('opacity', 0.1)
      .on('end', () => {
        origSvg.classed('hidden', true);
        this.draw(newGraph, '#new-svg', this.pieColorScale);
        newSvg.select('g').attr('transform', origSvgGTranmsform);

        this.bubbleGlyph(true);
        // add delay to allow for new nodes to be drawn
        setTimeout(() => {
          newSvg.classed('hidden', false).transition().duration(1000).attr('opacity', 1);
        }, 1000);
      });
    // .on('end', () => {
    //   const svg_id = origSvg.attr('id');
    //   origSvg.classed('hidden', true);
    //   //     newSvg.classed('hidden', false);
    //   //     // draw the new graph in the hidden svg
    //   //     try {
    //   //       this.draw(newGraph, '#new-svg', this.pieColorScale);
    //   //       this.bubbleGlyph(true);
    //   //     } catch (error) {
    //   //       console.log(error);
    //   //     }
    //   //     newSvg
    //   //       .transition()
    //   //       .duration(1000)
    //   //       .attr('opacity', 1)
    //   //       .on('end', () => {
    //   //         newSvg.attr('id', svg_id);
    //   //         origSvg.remove();
    //   //       });
    // });

    // // compute new graph
    // const simulation = d3
    //   .forceSimulation(newGraph.nodes)
    //   .force(
    //     'link',
    //     d3.forceLink(newGraph.links).id((d: any) => d.id)
    //   )
    //   .force('charge', d3.forceManyBody().strength(-1000))
    //   .force('center', d3.forceCenter(500, 500))
    //   .force('x', d3.forceX())
    //   .force('y', d3.forceY())
    //   .stop();

    // simulation.on('tick', () => {
    //   nodes.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

    //   links
    //     .attr('x1', (d) => (d as unknown as { source: Points }).source.x)
    //     .attr('y1', (d) => (d as unknown as { source: Points }).source.y)
    //     .attr('x2', (d) => (d as unknown as { target: Points }).target.x)
    //     .attr('y2', (d) => (d as unknown as { target: Points }).target.y);
    // });

    // simulation.tick(200);
    // simulation.restart();

    // this.simulation = simulation;
    // const transition_obj = this.svg.transition().duration(500);

    // this.nodeD3.data(newGraph.nodes).join('g');
  }
}

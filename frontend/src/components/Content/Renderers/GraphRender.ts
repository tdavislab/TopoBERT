import * as d3 from 'd3';
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
  zoomObj!: void;

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
    this.graphData = graph;
    this.svg = d3.select(svg_selector);
    this.pieColorScale = pieColorScale;

    // create a node with one member point from each class
    console.log(Object.entries(store.state.colorMap));
    
    // const dummyNode: NodeEntity = {
    //   id: 'dummy',
    //   name: 'dummy',
    //   avgFilterValue: 50,
    //   x_pca: 0,
    //   y_pca: 0,
    //   x: 0,
    //   y: 0,
    //   type: 'train',
    //   memberPoints: Object.entries(store.state.colorMap).map(([className, color]) => {
    //     return {
    //       classLabel: className,
    //       l2norm: 1000,
    //       memberId: 1234,
    //       sentId: 4321,
    //       sentence: 'dummy',
    //       word: 'dummy',
    //       wordId: 0
    //     };
    //   })
    // }

    // graph.nodes.push(dummyNode);

    let node_group = this.svg.select('g g.node_group');
    const link_group = this.svg.select('g g.link_group');

    const graph_obj = this;

    node_group.selectAll('*').remove();
    link_group.selectAll('*').remove();

    this.nodeSizeScale.domain(<[number, number]>d3.extent(graph.nodes, (node) => node.memberPoints.length));
    this.nodeColorScale.domain(<[number, number]>d3.extent(graph.nodes, (node) => node.avgFilterValue));

    const forceLink = d3
      .forceLink(graph.links)
      .id((d: any) => d.id)
      .distance(100)
      // .strength((d: any) => 0.5)
      .iterations(5);

    const forceCharge = d3.forceManyBody().strength(-1000);

    // find largest node's index
    // const max_node_index = d3.maxIndex(graph.nodes, (node) => node.memberPoints.length);
    // const forceCharge = d3.forceManyBody().strength((d: any, i: number) => (i === max_node_index ? -10000 : -500));

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force('link', forceLink)
      .force('charge', forceCharge)
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => graph_obj.nodeSizeScale(d.memberPoints.length))
      )
      .force('center', d3.forceCenter(0, 0))
      .force('x', d3.forceX().strength(0.1))
      .force('y', d3.forceY().strength(0.1))
      .alphaDecay(0.05)
      .stop();

    simulation.tick(100);
    simulation.alphaDecay(0.05);
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

    nodes
      .on('mouseenter', function (enterEvent, d) {
        // find IDs of all nodes in the connected component
        function connectedComponent(node: NodeEntity) {
          const visited = new Set();
          const queue = [node];

          while (queue.length > 0) {
            const current = queue.shift()!;
            visited.add(current.id);

            const current_node_links = graph.links.filter((link) => link.source.id === current.id || link.target.id === current.id);

            for (const link of current_node_links) {
              if (link.source.id === current.id && !visited.has(link.target.id)) {
                queue.push(link.target);
              } else if (link.target.id === current.id && !visited.has(link.source.id)) {
                queue.push(link.source);
              }
            }
          }

          return visited;
        }

        const connected_component = connectedComponent(d);
        links
          .transition()
          .duration(500)
          .attr('opacity', 0.15)
          // .attr('stroke-width', (d) => {this
          .filter((link) => connected_component.has(link.source.id) || connected_component.has(link.target.id))
          .attr('opacity', 1);
      })
      .on('mouseleave', function (leaveEvent, d) {
        links.transition().duration(500).attr('opacity', 1);
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
        .attr('stroke-dasharray', (d) => (d.type === 'test' ? '5,5' : ''))
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

    this.zoomObj = d3.zoom().scaleExtent([0.2, 10]).on('zoom', zoomed)(d3.select(svg_selector));

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
        .duration(5000)
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
        .duration(5000)
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
      this.linkD3.transition().delay(5000).duration(500).attr('opacity', 1);
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
      const labelCounts: { [key: string]: number } = {};

      memberPoints.forEach((memberPoint) => {
        if (labelCounts[memberPoint.classLabel] === undefined) {
          labelCounts[memberPoint.classLabel] = 1;
        } else {
          labelCounts[memberPoint.classLabel] += 1;
        }
      });
      const sortedMemberPoints = memberPoints.sort((a, b) => {
        return -(labelCounts[a.classLabel] - labelCounts[b.classLabel]);
      });

      const root = d3.hierarchy({
        name: 'root',
        // children: memberPoints.sort((a, b) => {
        //   return a.classLabel > b.classLabel ? 1 : -1;
        // }),
        children: sortedMemberPoints,
      });

      const pack = d3
        .pack()
        .size([size, size])
        .padding(0)
        .radius((d) => 5);

      return pack(root).descendants();
    }
  }

  transitionToNewGraph(newGraph: Graph) {
    const docSVG = document.getElementById('graph-svg');
    const gDocSVG = document.getElementById('graph-svg-g');
    const dummyPoint = docSVG.createSVGPoint();

    function convertToSVGSpace1(element: any, x: number, y: number) {
      dummyPoint.x = x;
      dummyPoint.y = y;
      return dummyPoint.matrixTransform(element.getScreenCTM().inverse());
    }

    console.log(convertToSVGSpace1(gDocSVG, 0, 0));

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
      const adjusted_x = bbox.x - bbox.width / 2;
      const adjusted_y = bbox.y - bbox.height / 2;
      const { x, y } = convertToSVGSpace1(gDocSVG, adjusted_x, adjusted_y);
      coords.push({ x, y, r: d.r });
    });

    // console.log(svgCoords);
    // console.log(coords[0]);

    this.svg.select('g > g.node_group').selectAll('*').remove();
    this.svg.select('g > g.link_group').selectAll('*').remove();
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

    this.draw(newGraph, '#new-svg', this.pieColorScale);
    this.bubbleGlyph(true);

    d3.select('#new-svg').classed('w-0', false).classed('h-0', false);

    const newdocSVG = document.getElementById('new-svg');
    const newgDocSVG = document.getElementById('new-svg-g');
    const newdummyPoint = newdocSVG.createSVGPoint();

    function convertToSVGSpace2(element: any, x: number, y: number) {
      newdummyPoint.x = x;
      newdummyPoint.y = y;
      return newdummyPoint.matrixTransform(element.getScreenCTM().inverse());
    }

    const newPointData = this.svg
      .selectAll('.bubble-element')
      .data()
      .map((d: any) => d.data);

    const newSvgCoords = this.svg.node().getBoundingClientRect();
    const newCoords: any[] = [];

    this.nodeD3.selectAll('.bubble-element').each(function (d, i) {
      const bbox = this!.getBoundingClientRect();
      const adjusted_x = bbox.x - bbox.width / 2;
      const adjusted_y = bbox.y - bbox.height / 2;
      const { x, y } = convertToSVGSpace2(newgDocSVG, adjusted_x, adjusted_y);
      newCoords.push({ x, y, r: d.r });
    });

    d3.select('#new-svg').classed('w-0', true).classed('h-0', true);

    this.svg.select('g').selectAll('*').remove();
    const newPointGroup = this.svg.select('g').append('g').attr('class', 'point-group');

    const labelRanks = Object.keys(store.state.colorMap).map((key, i) => {
      return { key, rank: i };
    });

    const labelRankMap = Object.fromEntries(labelRanks.map((labelRank) => [labelRank.key, labelRank.rank]));
    console.log(labelRankMap);

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
                .delay(0)
                .duration(500)
                .ease(d3.easePolyIn)
                .attr('r', (d, i) => newCoords[i].r)
            ),
        (update) =>
          update.call((g) =>
            g
              .attr('fill', (d) => store.state.colorMap[d.classLabel].color)
              .transition()
              .delay((d, i) => labelRankMap[d.classLabel] * 500)
              .duration(500)
              .attr('cx', (d, i) => newCoords[i].x)
              .attr('cy', (d, i) => newCoords[i].y)
              .end()
              .then(() => {
                this.draw(newGraph, '#graph-svg', this.pieColorScale);
                this.svg.select('g.point-group').remove();
                this.bubbleGlyph(true);
              })
          ),
        (exit) => exit.transition().duration(5000).attr('opacity', 0).remove()
      )
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .attr('stroke-opacity', 0.3);

    d3.select('#new-svg').classed('hidden', true);
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

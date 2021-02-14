import * as d3 from "d3";

export default class ForceGraph {
  constructor(svg, width, height) {
    this.width = width;
    this.height = height;
    this.svg = d3.select(svg).attr('viewBox', [0, 0, 1000, 1000])
    this.svg_group = this.svg.append("g").attr("id", "graph-container-group");
  }

  graphData(gData) {
    this.svg_group.selectAll('*').remove();

    this.gData = gData;

    const linkData = this.gData.links.map(d => Object.assign({}, d));
    const nodeData = this.gData.nodes.map(d => Object.assign({}, d));

    // Scales
    this.nodeColorScale = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(nodeData.map(d => parseFloat(d["l2avg"]))));
    this.nodeSizeScale = d3.scaleLog().domain(d3.extent(nodeData.map(d => d["membership"]["membership_ids"].length))).range([3, 8]);
    this.linkColorScale = d3.scaleSequential(d3.interpolatePlasma).domain(d3.extent(linkData.map(d => d.intersection)));
    this.linkWidthScale = d3.scaleLog().domain(d3.extent(linkData.map(d => d["intersection"]))).range([1, 4]);

    // Simulation
    this.simulation = d3.forceSimulation(nodeData)
      .force("link", d3.forceLink(linkData).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(500, 500))
      .stop();

    this.simulation.tick(200);
    this.simulation.restart();
    // Links
    this.links = this.svg_group.append("g")
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr("stroke", d => this.linkColorScale(d["intersection"]))
      .attr("stroke-width", d => this.linkWidthScale(d["intersection"]))
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .call(this.drag(this.simulation));

    // Nodes
    this.nodes = this.svg_group.append("g")
      .selectAll("g")
      .data(nodeData)
      .join("g")
      .attr("style", "cursor: pointer")
      .append("circle")
      .attr("fill", d => this.nodeColorScale(d["l2avg"]))
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => this.nodeSizeScale(d["membership"]["membership_ids"].length))
      .call(this.drag(this.simulation));

    this.simulation.on('tick', () => {
      this.nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      this.links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    })

    let svg_group = this.svg_group;

    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', zoomed)
    this.svg.call(zoom)

    function zoomed(event) {
      svg_group.attr('transform', event.transform);
    }
  }

  drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.01).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      // d3.select(this).classed("fixed", true);
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      // event.subject.fx = null;
      // event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
}
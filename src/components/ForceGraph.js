import * as d3 from "d3";

export default class ForceGraph {
  constructor(svg, width, height) {
    this.width = width;
    this.height = height;
    this.svg = d3.select(svg).attr('viewBox', [0, 0, 1000, 1000]);
    this.svg_group = this.svg.append("g").attr("id", "graph-container-group");

    // Scales
    this.nodeColorScale = d3.scaleSequential(d3.interpolateTurbo);
    this.nodeSizeScale = d3.scaleLinear().range([5, 15]);
    this.linkColorScale = d3.scaleSequential(d3.interpolatePlasma);
    // this.linkColorScale = function(d) {return '#484848'}
    this.linkWidthScale = d3.scaleLinear().range([1, 10]);
  }

  graphDataPCA(gData) {
    this.svg_group.selectAll('*').remove();

    this.gData = gData;

    const linkData = this.gData.links.map(d => Object.assign({}, d));
    const nodeData = this.gData.nodes.map(d => Object.assign({}, d));

    this.nodeColorScale.domain(d3.extent(nodeData.map(d => parseFloat(d["l2avg"]))));
    this.nodeSizeScale.domain(d3.extent(nodeData.map(d => d["membership"]["membership_ids"].length)))
    this.linkColorScale.domain(d3.extent(linkData.map(d => d.intersection)));
    this.linkWidthScale.domain(d3.extent(linkData.map(d => d["intersection"])))

    // Axes
    this.xAxis = d3.scaleLinear().domain(d3.extent(nodeData.map(d => d.membership.x))).range([0, 1000]);
    this.yAxis = d3.scaleLinear().domain(d3.extent(nodeData.map(d => d.membership.y))).range([0, 1000]);

    // Simulation
    // this.simulation = d3.forceSimulation(nodeData)
    //   .force("link", d3.forceLink(linkData).id(d => d.id))
    //   .force("charge", d3.forceManyBody().strength(-10))
    //   .force("center", d3.forceCenter(500, 500))
    //   .stop();

    // this.simulation.tick(200);
    // this.simulation.restart();

    // Links
    function get_node(node_name) {
      return nodeData.filter(d => d.id === node_name)[0]
    }

    this.links = this.svg_group.append("g")
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr("stroke", d => this.linkColorScale(d["intersection"]))
      .attr("stroke-width", d => this.linkWidthScale(d["intersection"]))
      .attr("x1", d => this.xAxis(get_node(d.source).membership.x))
      .attr("y1", d => this.yAxis(get_node(d.source).membership.y))
      .attr("x2", d => this.xAxis(get_node(d.target).membership.x))
      .attr("y2", d => this.yAxis(get_node(d.target).membership.y))
    // .call(this.drag(this.simulation));

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
      .attr("cx", d => this.xAxis(d.membership.x))
      .attr("cy", d => this.yAxis(d.membership.y))
      .attr("r", d => this.nodeSizeScale(d["membership"]["membership_ids"].length))
    // .call(this.drag(this.simulation));

    // this.simulation.on('tick', () => {
    //   this.nodes
    //     .attr("cx", d => d.x)
    //     .attr("cy", d => d.y);
    //
    //   this.links
    //     .attr("x1", d => d.source.x)
    //     .attr("y1", d => d.source.y)
    //     .attr("x2", d => d.target.x)
    //     .attr("y2", d => d.target.y);
    // })

    let svg_group = this.svg_group;

    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', zoomed)
    this.svg.call(zoom)

    function zoomed(event) {
      svg_group.attr('transform', event.transform);
    }
  }

  graphDataForce(gData) {
    this.svg_group.selectAll('*').remove();

    this.gData = gData;

    const linkData = this.gData.links.map(d => Object.assign({}, d));
    const nodeData = this.gData.nodes.map(d => Object.assign({}, d));

    this.nodeColorScale.domain(d3.extent(nodeData.map(d => parseFloat(d["l2avg"]))));
    this.nodeSizeScale.domain(d3.extent(nodeData.map(d => d["membership"]["membership_ids"].length)))
    // this.linkColorScale.domain(d3.extent(linkData.map(d => d.intersection)));
    this.linkWidthScale.domain(d3.extent(linkData.map(d => d["intersection"])))

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

  colorNodesByLabel(allLabels, nodeColorScale) {
    function majorityLabel(datapoint) {
      let arr = datapoint.membership.metadata.map(d => d[3]);
      return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
    }

    this.nodes.attr('fill', d => nodeColorScale(majorityLabel(d)))
      .append('title')
      .text(d => majorityLabel(d))
  }
}
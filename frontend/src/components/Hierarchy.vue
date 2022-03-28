<template>
  <div id="hierarchy-view">
    <button
        type="button"
        class="btn btn-primary w-100"
        data-toggle="modal"
        data-target="#hierarchy-modal"
    >Induced Hierarchy
    </button>

    <div class="modal fade" id="hierarchy-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document" style="max-width: 95vw">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Induced Hierarchy</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="height: 90vh; overflow: scroll">
            <svg id="hierachy-svg" width="100%" height="100%"></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import * as d3 from "d3";


export default {
  name: "Hierarchy",
  data() {
    return {methodList: ["PCA", "TSNE", "UMAP"]};
  },
  computed: mapState({
    hierarchyData: (state) => state.hierarchyData,
  }),
  mounted() {
    console.log("Hierarchy mounted", this.hierarchyData);
    this.drawHierarchy();
  },
  watch: {
    "$store.state.hierarchyData": function () {
      this.drawHierarchy();
    }
  },
  methods: {
    drawHierarchy() {
      // Draw a colapsible hierarchy tree using d3-hierarchy

      // Set margins
      const margin = ({top: 10, right: 40, bottom: 10, left: 100});
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      // Set dx and dy for the tree layout
      const dx = 40;
      const dy = 100;

      console.log(width, height, dx, dy);

      let diagonal = d3.linkHorizontal().x((d) => d.y).y((d) => d.x);
      let tree = d3.tree().nodeSize([dx, dy]);

      // Set the root of the tree
      const root = d3.hierarchy(this.hierarchyData);

      root.x0 = dy / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        // if (d.depth && d.data.name.length !== 7) d.children = null;
      });

      // Remove any previously drawn tree
      d3.select("#hierachy-svg").selectAll("*").remove();

      const svg = d3.select("#hierachy-svg")
          .attr("viewBox", [-margin.left, -margin.top, width, dx])
          .style("font", "10px sans-serif")
          .style("user-select", "none");

      const g = svg.append("g").attr("transform", `translate(${width / 2},${margin.top})`);

      const gLink = g.append("g")
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5);

      const gNode = g.append("g")
          .attr("cursor", "pointer")
          .attr("pointer-events", "all");

      const zoomBehaviours = d3.zoom()
          .scaleExtent([0.05, 15])
          .on('zoom', (event) => g.attr('transform', event.transform));

      svg.call(zoomBehaviours);

      // setTimeout(() => zoomBehaviours.translateTo(svg, 0, 0), 100);

      function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg.transition()
            .duration(duration)
            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {
              d.children = d.children ? null : d._children;
              update(d);
              if (d3.event && d3.event.altKey) {
                setTimeout(() => {
                  zoomToFit();
                }, duration + 100);
              }
            });

        nodeEnter.append("circle")
            .attr("r", 15)
            .attr("fill", d => d._children ? "#555" : "#999")
            .attr("stroke-width", 10);

        // add pie chart for each node using data from class_counts attribute
        // nodeEnter.append("path")
        //     .attr("d", d => {
        //       const pie = d3.pie()
        //           .value(d => d.value)
        //           .sort(null);
        //       const data = pie(d.class_counts);
        //       const arc = d3.arc()
        //           .innerRadius(0)
        //           .outerRadius(30);
        //       console.log({d, pie, data, arc});
        //       return arc(data[0]);
        //     });


        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d._children ? -10 : 10)
            .attr("text-anchor", d => d._children ? "end" : "start")
            .text(d => d.data.label)
            .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white");

        // Add tooltip to the node showing the class_counts
        nodeEnter.append("title")
            .text(d => JSON.stringify(Object.fromEntries(Object.entries(d.data.class_counts).sort(([, a], [, b]) => b - a))));

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
              const o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
              const o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      function zoomToFit(paddingPercent) {
        const bounds = g.node().getBBox();
        const parent = svg.node().parentElement;
        const fullWidth = parent.clientWidth;
        const fullHeight = parent.clientHeight;

        const width = bounds.width;
        const height = bounds.height;

        const midX = bounds.x + (width / 2);
        const midY = bounds.y + (height / 2);

        if (width == 0 || height == 0) return; // nothing to fit

        const scale = (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight);
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        const transform = d3.zoomIdentity
            .translate(translate[0], translate[1])
            .scale(scale);

        svg
            .transition()
            .duration(500)
            .call(zoomBehaviours.transform, transform);
      }

      update(root);
    }
  }
}

</script>

<style scoped>
#hierarchy-view {
  margin: 1rem 0.5rem;
}

.modal-content {
  width: 100%;
  height: 100%;
}
</style>
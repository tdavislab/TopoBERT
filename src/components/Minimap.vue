<template>
  <svg id="minimap-svg" width="20%" height="20%" viewBox="-50 -50 100 100" hidden>
    {{ generatePiePath(nodeData) }}
  </svg>
</template>

<script>
import {mapState} from "vuex";
import * as d3 from "d3";

export default {
  name: "Minimap",
  computed: mapState({
    nodeData: state => state.tableData.rows,
  }),
  methods: {
    generatePiePath(mData, numPies = 5) {
      if (mData.length !== 0) {
        d3.select('#minimap-svg').attr('hidden', null);
      } else {
        d3.select('#minimap-svg').attr('hidden', true);
      }

      let groupedmData = d3.rollup(mData, v => v.length, d => d[3]);
      let pie = d3.pie().value(d => d[1])([...groupedmData.entries()].sort((x, y) => x[1] - y[1]).slice(0, numPies));
      let chartData = pie.map(d => ({pie: (d), group: d.data[0]}));

      let radius = 55;
      let arcGenerator = d3.arc().innerRadius(0).outerRadius(20);

      d3.select('#minimap-svg')
          .selectAll('path')
          .data(chartData)
          .join('path')
          .attr('d', d => arcGenerator(d.pie))
          .attr('stroke', 'black')
          .attr('stroke-width', '0.4px')
          .attr('fill', d => this.$store.state.nodeColorScale(d.group))
          .append('title')
          .text(d => d.group);

      d3.select('#minimap-svg')
          .selectAll('text')
          .data(chartData)
          .join('text')
          .attr('text-anchor', 'middle')
          .attr('font-size', '6px')
          .attr("x", d => {
            let a = d.pie.startAngle + (d.pie.endAngle - d.pie.startAngle) / 2 - Math.PI / 2;
            return d.x = Math.cos(a) * (radius - 20);
          })
          .attr("y", d => {
            let a = d.pie.startAngle + (d.pie.endAngle - d.pie.startAngle) / 2 - Math.PI / 2;
            return d.y = Math.sin(a) * (radius - 20);
          })
          .text(d => d.group);
    }
  }
}
</script>

<style scoped>
#minimap-svg {
  border-radius: 5px;
  background-color: #ffffff;
  position: absolute;
  top: 10px;
  left: 10px;
  box-shadow: 5px 5px 10px #a0a0a0;
}

</style>
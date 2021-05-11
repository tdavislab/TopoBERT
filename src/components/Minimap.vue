<template>
  <svg id="minimap-svg" width="25%" height="25%" viewBox="-50 -50 100 100" hidden>
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
    generatePiePath(mData, numPies = 8) {
      if (mData.length !== 0) {
        d3.select('#minimap-svg').attr('hidden', null);
      } else {
        d3.select('#minimap-svg').attr('hidden', true);
      }

      let groupedmData = d3.rollup(mData, v => v.length, d => d[3]);
      let numOthers = [...groupedmData.entries()].sort((x, y) => y[1] - x[1]).slice(numPies - 1).reduce((acc, curr) => acc + curr[1], 0);
      let topVals = [...groupedmData.entries()].sort((x, y) => y[1] - x[1]).slice(0, numPies - 1);
      if (numOthers > 0) {
        topVals.push(['Others', numOthers]);
      }

      let pie = d3.pie().value(d => d[1]).sort(null)(topVals);
      let chartData = pie.map(d => ({pie: (d), group: d.data[0], count: d.data[1]}));

      let radius = 25;
      let arcGenerator = d3.arc().innerRadius(0).outerRadius(20);

      d3.select('#minimap-svg').selectAll('*').remove();

      // Pie-chart
      d3.select('#minimap-svg')
          .append('g')
          .attr('transform', `translate(${-radius - 15}, 0)`)
          .selectAll('path')
          .data(chartData)
          .join('path')
          .attr('d', d => arcGenerator(d.pie))
          .attr('stroke', 'black')
          .attr('stroke-width', '0.4px')
          .attr('fill', d => this.$store.getters.nodeColorMap(d.group))
          .append('title')
          .text(d => `${d.group} (${d.count})`);

      // Legend
      // d3.select('#minimap-svg')
      //     .selectAll('text')
      //     .data(chartData)
      //     .join('text')
      //     // .attr('text-anchor', 'middle')
      //     .attr('font-size', '5px')
      //     .attr("x", d => {
      //       let a = d.pie.startAngle + (d.pie.endAngle - d.pie.startAngle) / 2 - Math.PI / 2;
      //       return d.x = Math.cos(a) * radius;
      //     })
      //     .attr("y", d => {
      //       let a = d.pie.startAngle + (d.pie.endAngle - d.pie.startAngle) / 2 - Math.PI / 2;
      //       return d.y = Math.sin(a) * radius;
      //     })
      //     .attr('text-anchor', function (d) {
      //       if (d.x >= 0) return 'start';
      //       if (d.x < 0) return 'end';
      //     })
      //     .text(d => `${d.group} (${d.count})`);

      let numLegend = chartData.length;

      function position(i, numLegend) {
        if (numLegend % 2 === 0) {
          return -5 - (10 * (numLegend / 2)) + 10 * i;
        } else {
          return -5 - (10 * (numLegend - 1) / 2) + 10 * i;
        }
      }

      let legend = d3.select('#minimap-svg')
          .append('g')
          .attr('id', 'legend')
          .selectAll('g')
          .data(chartData)
          .join('g');

      legend.append('rect')
          .attr('x', radius - 35)
          .attr('y', (d, i) => position(i, numLegend))
          .attr('width', '10px')
          .attr('height', '10px')
          .attr('fill', d => this.$store.getters.nodeColorMap(d.group))
          .attr('stroke', 'black')
          .attr('stroke-width', '0.5px')

      legend.append('text')
          .attr('x', radius - 17.5)
          .attr('y', (d, i) => position(i, numLegend) + 7.5)
          .attr('font-size', '6px')
          .text(d => `${d.group} (${d.count})`);
    }
  }
}
</script>

<style scoped>
#minimap-svg {
  border-radius: 5px;
  background-color: #ffffff;
  position: absolute;
  bottom: 10px;
  right: 10px;
  box-shadow: 5px 5px 10px #a0a0a0;
}

</style>
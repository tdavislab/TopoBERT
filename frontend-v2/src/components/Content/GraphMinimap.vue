<script lang="ts" setup>
  import { computed, watch, watchEffect } from 'vue';
  import { useStore } from '../../store/store';
  import * as d3 from 'd3';
  import PieGlyph from './Renderers/PieGlyphRenderer';
  import { NodeEntity } from '../../store/types';

  const store = useStore();
  const showMinimap = computed(() => store.state.selectedNodes.length > 0);
  const nodeData = computed(() => store.state.selectedNodes);
  const pieRenderer = new PieGlyph(8);
  const pieColorScale = computed(() => store.getters.pieColorScale);

  function drawPieChart(data: NodeEntity[]) {
    const minimapPieGlyph = d3.select('g#pieGlyph');
    minimapPieGlyph.selectAll('*').remove();

    minimapPieGlyph
      .selectAll('path')
      .data((d) => pieRenderer.generatePathAggregate(data, 40))
      .join('path')
      .attr('d', (d) => d.arc)
      .attr('stroke', 'black')
      .attr('stroke-width', '2px')
      .attr('fill', (d) => store.getters.pieColorScale(d.classLabel))
      .append('title')
      .text((d) => d.classLabel);
  }

  // watch(nodeData, (newNodeData, oldNodeData) => {
  //   drawPieChart(newNodeData);
  // });
</script>

<template>
  <!-- <span id="minimap" class="shadow border border-r-4 inline-block"><svg></svg></span> -->
  <svg id="minimap-svg" class="absolute border rounded shadow bg-white" :class="showMinimap ? 'visible' : 'invisible'">
    <!-- <rect width="100%" height="100%" fill="#CCCCCC"></rect> -->
    <g transform="translate(75, 75)">
      <g id="pieGlyph">
        <path
          v-for="path in pieRenderer.generatePathAggregate(nodeData, 40)"
          :d="path.arc"
          :fill="pieColorScale(path.classLabel)"
          stroke="black"
          stroke-width="2px"
        >
          <title>{{ path.classLabel }}</title>
        </path>
      </g>
      <g id="legend" transform="translate(0, -50)">
        <rect
          v-for="(path, index) in pieRenderer.generatePathAggregate(nodeData, 40)"
          :x="75 - 25"
          :y="index * 15"
          width="15px"
          height="15px"
          :fill="pieColorScale(path.classLabel)"
          stroke="black"
          stroke-width="2px"
        ></rect>
        <text v-for="(path, index) in pieRenderer.generatePathAggregate(nodeData, 40)" :x="75" :y="index * 15 + 7.5" font-size="12px">
          {{ path.classLabel }}
        </text>
      </g>
    </g>
  </svg>
</template>

<style lang="postcss" scoped>
  /* #minimap-svg { */
  /* border-radius: 5px; */
  /* background-color: #020202; */
  /* position: absolute; */
  /* bottom: 10px; */
  /* right: 10px; */
  /* box-shadow: 5px 5px 10px #a0a0a0; */
  /* } */
</style>

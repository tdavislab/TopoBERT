<script lang="ts" setup>
  import { computed, watch, watchEffect } from 'vue';
  import { useStore } from '../../store/store';
  import * as d3 from 'd3';
  import PieGlyph from './Renderers/PieGlyphRenderer';
  import { NodeEntity } from '../../store/types';

  const store = useStore();

  const showMinimap = computed(() => store.state.selectedNodes.length > 0);
  const nodeSize = 60;
  const nodeData = computed(() => store.state.selectedNodes);

  const pieRenderer = new PieGlyph(8);
  const pieColorScale = computed(() => store.getters.pieColorScale);
  const pieArcs = computed(() => pieRenderer.generatePathAggregate(nodeData.value, nodeSize));

  const legendTransform = computed(() => `translate(40, -${(pieArcs.value.length * 15) / 2})`);

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
</script>

<template>
  <svg id="minimap-svg" class="absolute border rounded shadow bg-white" :class="showMinimap ? 'visible' : 'invisible'">
    <g transform="translate(75, 75)">
      <g id="pieGlyph">
        <path v-for="path in pieArcs" :d="path.arc || ''" :fill="pieColorScale(path.classLabel)" stroke="black" stroke-width="1px">
          <title>{{ path.classLabel }}</title>
        </path>
      </g>
      <g id="legend" :transform="legendTransform">
        <rect
          v-for="(path, index) in pieArcs"
          :x="75 - 25"
          :y="index * 15"
          width="15px"
          height="15px"
          :fill="pieColorScale(path.classLabel)"
          stroke="black"
          stroke-width="1px"
        ></rect>
        <text v-for="(path, index) in pieArcs" :x="75" :y="index * 15 + 12" font-size="12px">
          {{ path.classLabel }}
        </text>
      </g>
    </g>
  </svg>
</template>

<style lang="postcss" scoped></style>

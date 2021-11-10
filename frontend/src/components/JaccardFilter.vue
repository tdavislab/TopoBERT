<template>
  <div id="jaccard-holder" class="border rounded px-4 py-2 mb-2">
    <label id="sliderLabel" for="iterationSlider" class="form-label"
    >Show links with weight greater than: <span class="param-highlight">{{ value }}</span></label
    >
    <input
        type="range"
        id="iterationSlider"
        class="custom-range"
        min="0"
        max="1"
        step="0.01"
        v-model="value"
        v-on:change="jaccardChanged"
    />
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "JaccardFilter",
  computed: mapState({
    value: (state) => state.jaccardFilter,
  }),
  methods: {
    jaccardChanged: function (event) {
      this.$store.dispatch("filterJaccard", parseFloat(event.target.value));
    },
  },
};
</script>

<style scoped>
.param-highlight {
  background: #949494;
  color: white;
  padding-top: 0.25em;
  padding-right: 0.5em;
  padding-left: 0.5em;
  padding-bottom: 0.25em;
  border-radius: 0.25rem;
}
</style>
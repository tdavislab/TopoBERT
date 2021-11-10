<template>
  <div class="border rounded px-4 py-2 mb-2">
    <label id="sliderLabel" for="iterationSlider" class="form-label">
      Current graph = <span class="param-highlight">{{ value }}</span>
    </label>
    <div class="row">
      <div
          id="playBtn"
          class="col-1"
          v-on:click="togglePlay"
          v-html="symbol"
      ></div>
      <input
          type="range"
          id="iterationSlider"
          class="custom-range col-11"
          min="0"
          max="176"
          step="5"
          v-model="value"
          v-on:change="iterationChanged"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "IterationSlider",
  data() {
    return {
      play: false,
      symbol: "<p>&#9654</p>",
      timer: "",
    };
  },
  computed: mapState({
    value: (state) => state.currentIteration,
  }),
  methods: {
    iterationChanged(event) {
      this.$store.dispatch("loadIterationFile", parseInt(event.target.value));
    },
    togglePlay() {
      this.play = !this.play;
      if (this.play) {
        this.symbol = "<p>&#9209</p>";
        this.timer = setInterval(() => {
          // this.value = (parseInt(this.value) + 1) % 177;
          this.$store.dispatch(
              "loadIterationFile",
              (parseInt(this.value) + 1) % 177
          );
        }, 1000);
      } else {
        this.symbol = "<p>&#9654</p>";
        clearInterval(this.timer);
      }
    },
  },
};
</script>

<style scoped>
.form-range {
  width: 90%;
}

#playBtn {
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.param-highlight {
  background: #949494;
  color: white;
  padding: 0.25em 0.5em;
  border-radius: 0.25rem;
}
</style>
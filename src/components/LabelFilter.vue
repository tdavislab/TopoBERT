<template>
  <div class="border rounded p-2 mt-2">
    <div id="filter-header">
      <h5 class="header-text" title="Placeholder for explanation of filtering criteria">
        <span>Filter labels </span>
        <font-awesome-icon id="filter-help" icon="question-circle"/>
      </h5>
      <span style="float: right" id="selection-indicator" title="Clear selection" v-on:click="clearSelection()">
        ({{ numFiltered }} selected <font-awesome-icon icon="times-circle"/>)
      </span>
    </div>
    <div id="tag-container" hidden>
      <div id="threshold-container">
        <label for="threshold-slider">Criteria: {{ threshold }}</label>
        <input id="threshold-slider" class="form-range d-inline-block" type="range" min="0" max="200" step="1" value="0"
               v-on:input="sliderDragged" v-on:change="thresholdChanged">
      </div>
      <div v-for="labelItem in labels" v-bind:class="{'label-selected': labelItem.selected}"
           v-on:click="labelClicked(labelItem.label)" class="label-tag" v-bind:style="bgColor(labelItem.label)">
        {{ labelItem.label }}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import {mapState} from "vuex";

export default {
  name: "LabelFilter",
  // data: function () {
  //   return {
  //     labels: this.$store.state.labels,
  //   }
  // },
  computed: {
    numFiltered() {
      return this.$store.state.labels.filter(d => d.selected === true).length
    },
    threshold() {
      let threshold;
      let storeThreshold = this.$store.state.labelThreshold;
      if (storeThreshold === 0) {
        return 'Most frequent label'
      }
      if (0 <= storeThreshold && storeThreshold < 100) {
        return `Nodes where each selected label comprises of more than ${storeThreshold}%`
      } else {
        return `Nodes where each selected label occurs at least ${storeThreshold - 100} times`
      }
    },
    labels() {
      return this.$store.state.labels
    }
  },
  mounted: function () {
    $('.header-text').on('click', function () {
      let tag_container = $('#tag-container');
      tag_container.prop('hidden', !tag_container.prop('hidden'));
    });
  },
  methods: {
    labelClicked(label) {
      this.$store.dispatch('filterLabel', label);
    },
    clearSelection() {
      this.$store.dispatch('filterLabel', -1);
    },
    bgColor(label) {
      return {'border': '5px solid ' + this.$store.state.nodeColorScale(label)};
    },
    sliderDragged(event) {
      this.$store.commit('updateThreshold', parseInt(event.target.value));
    },
    thresholdChanged(event) {
      this.$store.dispatch('thresholdChanged', parseInt(event.target.value));
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styles/variables.scss";

.label-tag {
  cursor: pointer;
  margin: 0.4em;
  font-size: 0.8em;
  font-weight: bold;
  //color: #EEEEEE;
  padding: 0.4em 0.5em 0.5em 0.4em;
  display: inline-block;
  //background-color: $label-bg-color;
  border-radius: 10px;
  box-shadow: #c3c3c3 3px 3px 5px;
}

.label-tag:hover {
  background-color: #d2d2d2;
}

.label-tag:active {
  transform: translateY(2px);
  box-shadow: #b7b7b7 3px 3px 5px;
}

.label-selected {
  background-color: #919191;
}

.header-text {
  display: inline-block;
  cursor: pointer;
}

#selection-indicator {
  cursor: pointer;
}
</style>
<template>
  <div class="border rounded p-2 mt-2">
    <div id="filter-header">
      <h5 class="header-text">
        <span>Filter labels</span>
        <!--        <font-awesome-icon icon="filter"/>-->
      </h5>
      <span style="float: right" id="selection-indicator" title="Clear selection" v-on:click="clearSelection()">
        ({{ numFiltered }} selected <font-awesome-icon icon="times-circle"/>)
      </span>
    </div>
    <div id="tag-container" hidden>
      <div v-for="labelItem in labels" v-bind:key="labelItem.label" v-bind:class="{'label-selected': labelItem.selected}"
           v-on:click="labelClicked(labelItem.label)" class="label-tag" v-bind:style="bgColor(labelItem.label)">
        {{ labelItem.label }}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: "LabelFilter",
  data: function () {
    return {
      labels: this.$store.state.labels,
    }
  },
  computed: {
    numFiltered() {
      return this.$store.state.labels.filter(d => d.selected === true).length
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
      return {'border-style': 'solid', 'border-color': this.$store.state.nodeColorScale(label)};
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
  background-color: #bcbcbc;
}

.label-tag:active {
  transform: translateY(2px);
  box-shadow: #858585 3px 3px 5px;
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
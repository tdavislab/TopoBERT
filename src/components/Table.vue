<template>
  <div id="data-table" class="mt-3">
    <table class="table table-bordered table-hover">
      <thead>
      <tr>
        <th v-for="hItem in tableData.header" scope="col">{{ hItem }}</th>
      </tr>
      </thead>
      <tbody>
      <tr
          class="tooltip-container"
          v-for="row in tableData.rows"
          v-bind:style="bgColor(row)"
      >
        <td v-for="rowElement in row">{{ rowElement }}</td>
        <td class="tooltip-text" v-html="tableHover(row)"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import * as d3 from "d3";

function bgColorPicker(backgroundColor, lightColor, darkColor) {
  let color =
      backgroundColor.charAt(0) === "#"
          ? backgroundColor.substring(1, 7)
          : backgroundColor;
  let r = parseInt(color.substring(0, 2), 16); // hexToR
  let g = parseInt(color.substring(2, 4), 16); // hexToG
  let b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}

export default {
  name: "Table",
  data() {
    this.tableData = this.$store.state.tableData;
    return {};
  },
  methods: {
    tableHover(row) {
      function formatSentence(sentence, word_id) {
        return `<p>${sentence
            .split(" ")
            .map((d, i) => (i === word_id - 1 ? `<u><b>${d}</b></u>` : d))
            .join(" ")}</p>`;
      }

      let sent_id = row[0],
          word_id = row[1];
      return formatSentence(this.$store.state.sentData[sent_id], word_id);
    },
    bgColor(row) {
      if (this.$store.state.labels.map((d) => d.label).includes(row[3])) {
        // return {'border': '5px solid ' + this.$store.state.nodeColorScale(row), 'box-sizing': 'border-box'}
        let scaleColor = this.$store.getters.nodeColorMap(row[3]);
        return {
          background: scaleColor,
          color: bgColorPicker(scaleColor, "white", "black"),
        };
      }
    },
  },
};
</script>

<style scoped>
#data-table {
  height: 32vh;
  overflow-y: auto;
}

.tooltip-container {
  /*display:inline-block;*/
  position: relative;
  border-bottom: 1px dotted #666;
  cursor: pointer;
  /*text-align:left;*/
}

.tooltip-container .tooltip-text {
  min-width: 200px;
  top: 40px;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 10px 20px;
  color: #444444;
  background-color: #eeeeee;
  font-weight: normal;
  font-size: 13px;
  border-radius: 8px;
  position: absolute;
  z-index: 99999999;
  box-sizing: border-box;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.8s;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tooltip-container .tooltip-text i {
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -12px;
  width: 24px;
  height: 12px;
  overflow: hidden;
}

.tooltip-container .tooltip-text i::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  left: 50%;
  transform: translate(-50%, 50%) rotate(45deg);
  background-color: #eeeeee;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
}

.th {
  position: sticky;
  top: 0;
}
</style>
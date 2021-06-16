<template>
  <div id="projection-view">
    <button id="proj-button" class="btn btn-primary w-100" data-backdrop="false" data-toggle="modal" data-target="#projection-panel"
            v-on:click="projBtnClicked">
      2D Projection
    </button>
    <div id="projection-panel" class="modal fade modeless">
      <div class="modal-dialog" role="dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">2D projection</h5>
            <div class="mx-5">
              <select name="projection-list" id="projection-list-dropdown" class="custom-select" v-on:change="projMethodChanged">
                <option disabled value="">Choose projection</option>
                <option v-for="method in methodList" v-bind:value="method" v-bind:selected="method===currentProjection">{{ method }}</option>
              </select>
            </div>
            <div class="loader" hidden></div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <vue3-chart-js ref="chartRef" v-bind="{ ...projectionData }"></vue3-chart-js>
            <!--            <canvas id="projection-canvas" width="800" height="800"></canvas>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import {mapGetters, mapState} from "vuex";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
// import zoomPlugin from 'chartjs-plugin-zoom';

export default {
  name: "Projection",
  components: {
    Vue3ChartJs,
  },
  data() {
    return {methodList: ['PCA', 'TSNE', 'UMAP']}
  },
  computed: {
    ...mapState({
      iteration: state => state.currentIteration,
      currentProjection: state => state.currentProjection,
      projectionData: state => state.projectionData
    })
  },
  mounted() {
    $('#projection-panel').draggable({
      handle: ".modal-header"
    });
    this.$store.state.chartRef = this.$refs.chartRef;
  },
  methods: {
    projBtnClicked(event) {
      let proj = this.currentProjection;
      let chartRef = this.$refs.chartRef;
      this.$store.dispatch('drawProjection', proj);
    },
    projMethodChanged(event) {
      let proj = event.target.value;
      let chartRef = this.$refs.chartRef;
      this.$store.dispatch('drawProjection', proj);
    }
  }
}
</script>

<style scoped>
#projection-view {
  margin: 1rem 0.5rem;
}

#projection-panel {
  width: auto !important;
  /*min-width: 800px;*/
  /*min-height: 700px;*/
  height: auto !important;
}

.modal-dialog {
  width: auto;
  max-width: 850px;
}

#projection-canvas {
  margin: 0.2rem;
  background: gainsboro;
}

.loader {
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  width: 35px;
  height: 35px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
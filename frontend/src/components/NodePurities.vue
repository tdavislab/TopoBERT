<template>
  <div id="purity-view">
    <button
        id="purity-button"
        class="btn btn-primary w-100"
        data-backdrop="false"
        data-toggle="modal"
        data-target="#purity-panel"
        v-on:click="purityBtnClicked"
    >
      Node purities
    </button>
    <div id="purity-panel" class="modal fade modeless">
      <div class="modal-dialog" role="dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Pointwise Node Purities</h5>
            <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <vue3-chart-js ref="purityChartRef" v-bind="{...purityData}"></vue3-chart-js>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import {mapState} from "vuex";

export default {
  name: "NodePurities",
  components: {
    Vue3ChartJs
  },
  mounted() {
    $("#purity-panel").draggable({
      handle: ".modal-header",
    });
    this.$store.state.purityChartRef = this.$refs.purityChartRef;
  },
  computed: {
    ...mapState(
        {
          purityData: (state) => state.purityData
        }
    )
  },
  methods: {
    purityBtnClicked(event) {
      // this.$store.dispatch('drawNodePurities');
      return
    }
  }
}
</script>

<style scoped>
#purity-view {
  margin: 1rem 0.5rem;
}

#purity-panel {
  width: fit-content;
  /*min-width: 800px;*/
  /*min-height: 700px;*/
  height: fit-content;
}

.modal-dialog {
  width: auto;
  max-width: 850px;
}

</style>
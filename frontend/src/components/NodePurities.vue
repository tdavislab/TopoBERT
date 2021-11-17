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
      Class purities
    </button>
    <div id="purity-panel" class="modal fade modeless">
      <div class="modal-dialog" role="dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Classwise Purities</h5>
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
            <!--{{ purityData }}-->
            <div style="display: none">
            <vue3-chart-js ref="purityChartRef" v-bind="{...purityData}"></vue3-chart-js>
            </div>

            <!--<vue3-chart-js ref="histChartRef" v-bind="{...purityHists['p.Agent']}"></vue3-chart-js>-->
            <!--<vue3-chart-js ref="p.Accompanier" v-bind="purityHists['p.Accompanier']"></vue3-chart-js>-->

            <!--<div class="histogram-holder" v-for="(histData, label) in purityHists" :ref="setItemRef">-->
            <!--  {{ label }}-->
            <!--  <vue3-chart-js v-bind="histData"></vue3-chart-js>-->
            <!--</div>-->
            <div class="histogram-holder">
              <vue3-chart-js v-for="(hist, label) in purityHists" v-bind="{...hist}" :ref="label"></vue3-chart-js>
            </div>
            <!--<span class="histogram-holder" v-for="(hist, label) in purityHists" ref="spanner">-->
            <!--  {{ label }}-->
            <!--  <vue3-chart-js :ref="label" v-bind="{...hist}"></vue3-chart-js>-->
            <!--  &lt;!&ndash;  &lt;!&ndash;<vue3-chart-js v-bind="{...hist}"></vue3-chart-js>&ndash;&gt;&ndash;&gt;-->
            <!--</span>-->
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
import {ref} from "vue";

export default {
  name: "NodePurities",
  components: {
    Vue3ChartJs
  },
  data() {
    return {itemRefs: []}
  },
  mounted() {
    $("#purity-panel").draggable({
      handle: ".modal-header",
    });
    this.$store.state.purityChartRef = this.$refs.purityChartRef;
    this.$store.state.histChartRefs = this.$refs.histChartRefs;
  },
  computed: {
    ...mapState(
        {
          purityData: (state) => state.purityData,
          purityHists: (state) => state.purityHists
        }
    )
  },
  methods: {
    setItemRef(el) {
      this.itemRefs.push(ref(el));
    },
    purityBtnClicked(event) {
      // console.log(this.$refs)

      // return
      // this.$store.dispatch('drawNodePurities');
      // return
      // this.$refs.histChartRef.update();
      // this.itemRefs.map(ref => ref.update());
      // this.$refs.map(ref => ref.update());
      // this.$ref[]
      // console.log(this.purityHists);
      // console.log(purityHistsKey);
      // console.log('update');
      for (let purityHistsKey in this.purityHists) {
        this.$refs[purityHistsKey].update();
      }
      // purityHists.map(ref => ref.update());
    }
  }
}
</script>

<style scoped>
#purity-view {
  margin: 1rem 0.5rem;
}

#purity-panel {
  /*width: fit-content;*/
  /*max-height: 50vh;*/
  /*min-width: 800px;*/
  /*min-height: 700px;*/
  /*height: fit-content;*/

}

.modal-dialog {
  width: auto;
  max-width: 850px;
}

.modal-body {
  overflow: scroll;
}

.histogram-holder {
  /*display: inline-block;*/
  display: flex;
  flex-direction: row;
}

</style>
<template>
  <!-- Button trigger modal -->
  <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#color-scheme-modal"
  >
    Change color scheme
  </button>

  <!-- Modal -->
  <div
      class="modal fade"
      id="color-scheme-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Choose colors</h5>
          <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body overflow-auto">
          <div
              v-for="label in labels"
              class="input-group"
              v-bind:id="'colorpicker-' + label.label.replace('.', '-')"
              v-bind:data-color="colorScale(label.label)"
          >
            <div class="input-group-prepend w-50">
              <span class="input-group-text w-100">{{ label.label }}</span>
            </div>
            <input
                type="text"
                class="color-input text-monospace form-control input-lg"
                v-bind:value="colorScale(label.label)"
            />
            <span class="input-group-append">
              <span class="input-group-text colorpicker-input-addon"
              ><i></i
              ></span>
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button
              id="dismiss"
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
          >
            Close
          </button>
          <button
              id="save"
              type="button"
              class="btn btn-primary"
              v-on:click="updateColors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "bootstrap";
import "bootstrap-colorpicker";
import {mapGetters, mapState} from "vuex";

export default {
  name: "ColorSchemeDesigner",
  methods: {
    bgColor(label) {
      return {
        "background-color": this.$store.getters.nodeColorMap(label),
        color: this.$store.state.nodeColorScale(label),
      };
    },
    updateColors() {
      console.log("updating colormap", this.$store.state.colorScale);
      let newColorMap = {};
      this.labels.forEach((label) => {
        // console.log($('#colorpicker-' + label.label.replace('.', '-')).attr('data-color'));
        newColorMap[label.label] = $(
            "#colorpicker-" + label.label.replace(".", "-")
        ).attr("data-color");
      });
      this.$store.commit("updateColorMap", newColorMap);
      this.$store.dispatch("drawGraph");
      $("#dismiss").click();
    },
  },
  computed: {
    ...mapState({
      labels: (state) => state.labels,
    }),
    ...mapGetters({
      colorScale: "nodeColorMap",
    }),
  },
  mounted() {
    this.labels.forEach((label) => {
      $("#colorpicker-" + label.label.replace(".", "-"))
          .colorpicker()
          .on("change", function (event) {
            $("#colorpicker-" + label.label.replace(".", "-")).attr(
                "data-color",
                event.value
            );
          });
    });
  },
};
</script>

<style scoped>
.modal-body {
  max-height: 80vh;
}
</style>
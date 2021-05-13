<template>
  <div id="param-config-adder">
    <button type="button" class="btn btn-primary w-100" data-toggle="modal" data-target="#config-modal">
      Add new parameter config
    </button>

    <div class="modal fade" id="config-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add a new configuration</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <div class="input-group-prepend w-25">
                <label class="input-group-text w-100">Intervals</label>
              </div>
              <input type="text" class="form-control" placeholder="Integer greater than 0" v-model="params.interval">
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend w-25">
                <label class="input-group-text w-100">Overlap</label>
              </div>
              <input type="text" class="form-control" placeholder="Integer in range [1, 99]" v-model="params.overlap">
            </div>
          </div>
          <div class="modal-footer">
            <button id="dismiss-params" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button id="save-params" type="button" class="btn btn-primary" v-on:click="saveConfig">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "AddParamConfig",
  data() {
    this.params = {
      interval: '',
      overlap: '',
    }
    return {}
  },
  methods: {
    saveConfig() {
      console.log(this.params)
      this.$store.commit('addDataSetConfig', this.params);
      $('#dismiss-params').click();
    }
  }
}
</script>

<style scoped>
#param-config-adder {
  margin: 1rem 0.5rem;
}
</style>
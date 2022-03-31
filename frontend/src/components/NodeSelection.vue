<template>
  <div class="border rounded px-4 py-2 mb-2">
    <!--  Radiobox to set selection mode
    Possible selection modes:
    - single
    - multiple
    - path
    - component
    -->
    <div class="row">
      <div class="col-sm-3">Select nodes</div>
      <div class="col-sm-9">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="node-selection-radios" id="node-selection-single" value="single"
                 v-model="nodeSelectionMode">
          <label class="form-check-label" for="node-selection-single">Single</label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="radio" name="node-selection-radios" id="node-selection-multiple" value="multiple"
                 v-model="nodeSelectionMode">
          <label class="form-check-label" for="node-selection-multiple">Multiple</label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="radio" name="node-selection-radios" id="node-selection-path" value="path"
                 v-model="nodeSelectionMode">
          <label class="form-check-label" for="node-selection-path">Path</label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="radio" name="node-selection-radios" id="node-selection-component" value="component"
                 v-model="nodeSelectionMode">
          <label class="form-check-label" for="node-selection-component">Component</label>
        </div>

        <div>{{ nodeSelectionMode }}</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'NodeSelection',
  computed: {
    nodeSelectionMode: {
      get: function () {
        return this.$store.state.nodeSelectionMode;
      },
      set: function (newMode) {
        console.log('set nodeSelectionMode to ' + this.$store.state.nodeSelectionMode);
        this.$store.commit('setNodeSelectionMode', newMode);
      }
    }
  }
};
</script>

<style scoped>

</style>
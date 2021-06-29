<template>
  <form>
    <fieldset class="form-group border rounded px-4 py-2 mb-2">
      <div class="row">
        <legend class="col-form-label col-sm-3 pt-0">Node Size</legend>
        <div class="col-sm-9">
          <div class="custom-control custom-radio">
            <input
              class="custom-control-input"
              type="radio"
              name="gridRadios"
              id="gridRadios1"
              value="size-scaled"
              v-on:click="nodeToSizeScaled"
              checked
            />
            <label class="custom-control-label" for="gridRadios1">
              Scaled to cluster size
            </label>
          </div>
          <div class="custom-control custom-radio">
            <input
              class="custom-control-input"
              type="radio"
              name="gridRadios"
              id="gridRadios2"
              value="uniform"
              v-on:click="nodeToUniform"
            />
            <label class="custom-control-label" for="gridRadios2">
              Constant
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script>
export default {
  name: "NodeSizeToggle",
  methods: {
    nodeToUniform() {
      this.$store.dispatch("toggleNodeSize", "uniform");
    },
    nodeToSizeScaled() {
      this.$store.dispatch("toggleNodeSize", "size-scaled");
    },
  },
};
</script>

<style scoped>
input {
  cursor: pointer;
}

label {
  cursor: pointer;
}
</style>
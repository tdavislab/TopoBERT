<template>
  <div id="data-table" class="mt-3">
    <table class="table table-striped table-bordered">
      <thead>
      <tr>
        <th v-for="hItem in tableData.header" scope="col">{{ hItem }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in tableData.rows">
        <td v-for="rowElement in row">{{ rowElement }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: "Table",
  data() {
    this.tableData = this.$store.state.tableData;
  },
}
</script>

<style scoped>
#data-table {
  height: 65vh;
  overflow-y: auto;
}
</style>
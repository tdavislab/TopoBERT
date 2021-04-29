<template>
  <div id="stats-div" class="border rounded p-2">
    <h5>Statistics</h5>
    <hr/>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Node ID</th>
        <th>Num Points</th>
        <th>Avg L2 norm</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ stats.nodeName }}</td>
        <td>{{ stats.numMembers }}</td>
        <td>{{ stats.avgNorm }}</td>
      </tr>
      </tbody>
    </table>
<!--    <div class="stat-item">Node ID: {{ stats.nodeName }}</div>-->
<!--    <div class="stat-item"># points: {{ stats.numMembers }}</div>-->
<!--    <div class="stat-item">Average L2 norm: {{ stats.avgNorm }}</div>-->
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: "Stats",
  computed: mapState({
    stats: state => state.stats,
  }),
}
</script>

<style scoped>
.stat-item {
  font-weight: 600;
}
</style>
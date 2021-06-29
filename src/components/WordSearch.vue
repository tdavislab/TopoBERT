<template>
  <div class="form-inline d-flex mx-3">
    <div class="input-group">
      <input
        id="searchBar"
        class="form-control mr-2"
        type="search"
        placeholder="Search by word"
        aria-label="Search"
      />
      <button
        class="input-group-append btn btn-primary my-2 my-sm-0"
        v-on:click="search"
      >
        Search
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "WordSearch",
  methods: {
    search() {
      let searchVal = $("#searchBar").val();
      this.$store.dispatch("searchWord", searchVal);
    },
  },
};
</script>

<style scoped>
</style>
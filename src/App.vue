<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// @group Template
// Root of the Vue app; the main template of our project
export default {
  name: 'App',
};
</script>

<style scoped>

@font-face {
  font-family: "Levitation";
  src: url('/assets/Levitation.ttf');
}
#app {
  text-align: center;
  margin: 0;
  padding: 0;
  overflow: hidden;
}


</style>

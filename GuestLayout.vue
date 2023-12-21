<template>
  <div>
    <header>
      <GuestNavbar />
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import GuestNavbar from "./GuestNavbar.vue";

// @group Template
// Holds the Guest customer navigation bar 
export default {
  components: {
    GuestNavbar,
  },
};
</script>

<style scoped>

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
}
</style>

<template>
  <div>
    <header>
      <CustomerNavbar/>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import CustomerNavbar from "./CustomerNavbar.vue";
// @group Template
// Holds the Customer navigation bar 
export default {
  components: {
    CustomerNavbar,
  },
};
</script>

<style scoped>
</style>

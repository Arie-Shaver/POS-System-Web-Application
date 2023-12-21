<template>
        <div>
          <header>
            <CashierNavbar/>
          </header>
          <main>
            <router-view></router-view>
          </main>
        </div>
</template>

<script>
import CashierNavbar from "./CashierNavbar.vue";
// @group Template
// Holds the Cashier navigation bar
export default {
components: {
        CashierNavbar,
},
};
</script>

<style scoped>
</style>
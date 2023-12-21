<template>
        <div>
          <header>
            <ManagerNavbar/>
          </header>
          <main>
            <router-view></router-view>
          </main>
        </div>
</template>

<script>
import ManagerNavbar from "./ManagerNavbar.vue";

// @group Template
// Holds Manager navigation bar
export default {
components: {
        ManagerNavbar,
},
};
</script>

<style scoped>
</style>
<template>
  <div class="navbar">
    <router-link class="options" style="text-decoration: none; color: inherit;" to="/kungfutea/menu">MENU</router-link>
    <router-link class="options" style="text-decoration: none; color: inherit;" to="/kungfutea/orderpage">ORDER</router-link>
    <router-link class="title" style="text-decoration: none; color: inherit;" to="/">
      <span class="red">KUNG FU </span><span class="white">TEA</span>
    </router-link>
    <router-link class="options" style="text-decoration: none; color: inherit;" to="/kungfutea/customerlogin">PROFILE</router-link>
    <router-link class="options" style="text-decoration: none; color: inherit;" to="/kungfutea/customerlogin">LOGIN</router-link>
    <div class="settings-btn" @click="goToSettings">
      <div class="line white"></div>
      <div class="line white"></div>
      <div class="line white"></div>
    </div>
  </div>
</template>

<script>
// @group Template
// Guest navigation bar: allows guest customers to navigate to Menu, Order, Profile, Login, and Settings pages
export default {
  name: 'GuestNavbar',
  methods: {
    // @vuese
    // Brings customer to settings page
    goToSettings() {
      // Programmatically navigate to the settings page
      this.$router.push('/kungfutea/settings');
    }
  },
  created() {
    // Clear local storage when the GuestLayout is created
    localStorage.removeItem('customerEmail');
  },
}
</script>       

<style scoped>

:root {
  /* light mode */
  --main-font-color: #000;
  --sub-font-color: white;
  --bg-color: white;
  --title-color: #EA0B43;
  --hover-color: #EA0B43;
  --selected-color: #EA0B43;
  --navbar-color: black;
}

[data-theme="dark"] {
  --main-font-color: #8b8b8b;
  --sub-font-color: white;
  --bg-color: black;
  --title-color: #FF9291;
  --hover-color: #FF9291;
  --selected-color: #FF9291;
  --navbar-color: #282828;
}

@font-face {
  font-family: "Levitation";
  src: url('src/assets/Levitation.ttf');
}

.navbar {
  display: flex;
  font-family: Levitation;
  background-color: var(--navbar-color);
  color: var(--sub-font-color);
  padding: 10px;
  height: 80px;
  text-align: center;
  align-items: center;
  justify-content: space-between; /* Add space between items */
}

.options {
  font-size: 35px;
  color: var(--sub-font-color);
  text-decoration: none;
  flex: 10%;
}

.title {
  font-size: 50px;
  flex: 20%;
}

.red {
  color: var(--title-color);
}

.settings-btn {
  cursor: pointer;
}

.line {
  width: 30px; /* Increased width */
  height: 3.5px; /* Increased height */
  background-color: var(--sub-font-color);
  margin: 8px 0; /* Adjusted spacing between lines */
  margin-right: 10px;
}
</style>

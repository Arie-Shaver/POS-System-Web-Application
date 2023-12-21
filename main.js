import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js'; // Import your router configuration

const app = createApp(App);
app.use(router).mount('#app');
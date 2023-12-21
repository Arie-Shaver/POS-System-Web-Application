<template>
  <div class="confirmation-container">
    <h1>Sign In Confirmation</h1>
    <p v-if="loading">Loading...</p>
    <p v-else>Thank you for signing in!</p>
    <button @click="login" class="login-button" v-if="!loading">Login Using Google</button>
  </div>
</template>

<script>

import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";

//@group Customer
//Displays a login confirmation button that when clicked allows a user to sign in with Google through oAuth,
export default {
  name: "GoogleButton",
  data() {
    return {
      userDetails: null,
      loading: false,
    };
  },
  methods: {
    //@vuese
    //Triggers googleSdkLoaded when login button is clicked
    login() {
      this.loading = true; // Set loading to true when the login button is clicked

      //@vuese
      //Initialize the Google OAuth process
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              "696225076406-906h45v5b28ho4h3nmb1l6p0cgqe3v6a.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "https://scad.onrender.com/auth/callback",
            callback: response => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            },
          })
          .requestCode();
      });
    },
    //@vuese
    //Get user information from oAuth and send to profile page for display
    // @arg code -- user's google code for data access
    async sendCodeToBackend(code) {
      try {
        const headers = {
          Authorization: code,
        };
        const response = await axios.post(
          "https://scad.onrender.com/auth",
          null,
          { headers }
        );
        const data = response.data;

        console.log("Login Data:", data);

        // Check for success in the response
        if (data.success) {
          // Store the token securely (e.g., in a cookie or local storage)
          localStorage.setItem("customerName", data.customerName);
          localStorage.setItem("customerPoints", data.customerPoints);
          localStorage.setItem("customerEmail", data.customerEmail);

          this.$router.push({
            path: "/kungfuteacustomer/profile",
            query: {
              customerName: data.customerName,
              customerPoints: data.customerPoints,
              customerEmail: data.customerEmail,
            },
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Failed to send authorization code:", error);
      } finally {
        this.loading = false; // Set loading back to false when the request is complete
      }
    },
  },
};
</script>

<style scoped>
.confirmation-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.login-button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45a049;
}
</style>

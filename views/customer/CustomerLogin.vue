<template>
  <div>
    <div class="main-panel">
      <p class="loginTitle">Log In</p>

      <div class="formDiv">
        <form @submit.prevent="login" class="loginForm">
          <div class="userDiv">
            <label for="email" class="label-id">Email:</label>
            <input type="text" id="email" v-model="email" />
          </div>

          <div class="passDiv">
            <label for="password" class="label-password">Password:</label>
            <input type="password" id="password" v-model="password" />
          </div>

          <div class="Buttons">
            <button :disabled="loading" type="submit" class="submitBtn">
              <span v-if="loading">Loading...</span>
              <span v-else>Sign In</span>
            </button>
            <button type="button" class="submitBtn" @click="goToCorporateLogin">Corporate Login</button>
            <button type="button" class="submitBtn" @click="goToCreateAccount">Create Account</button>
            <button type="button" class="submitBtn" @click="goToGoogleSignIn">Sign In With Google</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

// @group Customer
// Allows customer to login with special email and password t order and earn rewards
export default {
  // @vuese 
  // Variables containing specific customer emails and passwords
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    // @vuese
    // Allow customers to login based on emails and passwords stored in the login sql table in the database
    // @throws error Network error when attempting to access the database
    async login() {
      const { email, password } = this;
      this.loading = true; // Set loading state to true

      try {
        const response = await fetch('https://scad.onrender.com/customerLogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('Login Data:', data);
          // Store the token securely (e.g., in a cookie or local storage)
          localStorage.setItem('customerName', data.customerName);
          localStorage.setItem('customerPoints', data.customerPoints);
          localStorage.setItem('customerEmail', data.customerEmail);

          this.$router.push({
            path: '/kungfuteacustomer/profile',
            query: {
              customerName: data.customerName,
              customerPoints: data.customerPoints,
              customerEmail: data.customerEmail,
            },
          });
        } else {
          alert(data.message);
          this.email = '';
          this.password = '';
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
      } finally {
        this.loading = false; // Set loading state back to false
      }
    },

    // @vuese
    // Allow managers and cashiers to use corporate logins
    goToCorporateLogin() {
      this.$router.push('/kungfutea/login');
    },
    // @vuese
    // Allow customers to create accounts if they do not already have one created
    goToCreateAccount() {
      this.$router.push('/kungfutea/create');
    },
    // @vuese
    // Allow for oauth and google signin for customers
    goToGoogleSignIn() {
      this.$router.push('/kungfutea/google');
    },
  },
};
</script>

<style>
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

.time-label {
  text-align: right;
  font-weight: bold;
  font-size: 25px;
}

.main-panel {
  text-align: center;
}

.main-panel h1 {
  font-size: 60px;
  font-weight: bold;
}

.main-panel h2{
  font-size: 30px;
}

.label-id,
.label-password{
  font-size: 20px;
}

.loginTitle{
  font-family: levitation;
  font-size: 45px;
  color: var(--title-color);
}

.formDiv{
  border-style: solid;
  border-width: 2px;
  border-radius: 15.2px;
  border-color: var(--navbar-color);
  width:50%;
  height: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.label-id, .label-password{
  font-family: 'Concert One', sans-serif;
  font-size: 27px;
  padding-right: 6%;
  color: var(--main-font-color);
}

.userDiv {
  height: 20%;
  margin-top: 5%; /* Increase the margin-top as needed */
  margin-bottom: 10%;
}

.passDiv {
  margin-bottom: 10%;
}

.loginForm {
  height: 100%;
  padding: 50px; /* Adjust the padding as needed */
}


#email, #password{
  width: 50%;
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: var(--bg-color);
  border-radius: 8px;
  border-color: var(--main-font-color);
  padding-left: 10px;
  padding-right: 10px;
  color: var(--main-font-color);
}

#email:focus, #password:focus{
  border-color: #EA0B43;
}

.submitBtn{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: var(--bg-color);
  border-radius: 8px;
  border-color: var(--main-font-color);
  padding: 8px 15px; /* Adjust padding as needed */
  margin-top: 2%;
  color: var(--main-font-color);
}

.submitBtn:hover{
  background-color: var(--hover-color);
  color: var(--bg-color);
}

.Buttons{
  display: block;
}
.center-container{
  margin-left: 220px;
  margin-top: 35px;
  width: 70px;
}

</style>
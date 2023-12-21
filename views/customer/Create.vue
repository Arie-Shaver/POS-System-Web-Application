<template>
  <div>
    <div class="main-panel">
      <p class="loginTitle">Create Account</p>

      <div class="formDiv">
        <form @submit.prevent="createAccount" class="loginForm">
          <div class="form-group">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" v-model="firstName" :class="{ 'highlight': submitAttempt && !firstName }" />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" v-model="lastName" :class="{ 'highlight': submitAttempt && !lastName }" />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" id="youremail" v-model="email" :class="{ 'highlight': submitAttempt && !email }" />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input :type="showPassword ? 'text' : 'password'" id="yourpassword" v-model="password" :class="{ 'highlight': submitAttempt && !password }" />
          </div>

          <div class="form-group">
            <label for="retypePassword">Confirm Password:</label>
            <input :type="showPassword ? 'text' : 'password'" id="retypePassword" v-model="retypePassword" :class="{ 'highlight': submitAttempt && (!retypePassword || password !== retypePassword) }" />
            <div v-if="submitAttempt && password !== retypePassword" class="error-message">Passwords do not match</div>
          </div>

          <div class="form-group">
            <div class="showPass">
              <input type="checkbox" v-model="showPassword" id="showPassword" />
              <label for="showPassword">Show Password</label>
            </div>
          </div>

          <div class="form-group">
            <button type="submit" class="submitBtn">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

// @group Customer
// Create customer account to order drinks from the ordering page
export default {

  // @vuese
  // Contains variables for customer account data
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      retypePassword: '',
      showPassword: false,
      submitAttempt: false, // Flag to track submit attempt
    };
  },
  methods: {

    // @vuese
    // Create the customer account for users to order containing their first name, lastname, email and password
    async createAccount() {
      // Set the submitAttempt flag to true
      this.submitAttempt = true;

      // Check if required fields are empty
      if (!this.firstName || !this.lastName || !this.email || !this.password || !this.retypePassword || this.password !== this.retypePassword) {
        window.alert('Please fill in all fields and make sure passwords match.');
        return;
      }

      try {
        // Make the API request to create an account using the native fetch API
        const response = await fetch('https://scad.onrender.com/createAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('Account created successfully');
            const confirmCreate = window.confirm('Account created successfully please sign in.');
            this.$router.push('/kungfutea/customerLogin');
            // Optionally, you can redirect the user to a success page or perform other actions
          } else {
            console.error('Error creating account:', result.message);
            window.alert('Error creating account: ' + result.message);
            // Handle the error, e.g., show an error message to the user
          }
        } else {
          console.error('Error creating account:', response.statusText);
          window.alert('Error creating account: ' + response.statusText);
          // Handle the error, e.g., show an error message to the user
        }
      } catch (error) {
        console.error('Error creating account:', error.message);
        window.alert('Error creating account: ' + error.message);
        // Handle the error, e.g., show an error message to the user
      }
    },
  },
};
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

/* Highlight style for empty fields */
.highlight {
  border: 2px solid var(--hover-color); /* Change the color as needed */
}

.error-message {
  color: var(--selected-color); /* Error message color */
  font-size: 14px; /* Error message font size */
  margin-top: 5px; /* Error message margin top */
}

.form-group {
  display: flex;
  margin-bottom: 15px;
  width: 100%;
  justify-content: space-around;
}

.form-group input{
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

label {
  font-size: 20px;
}

.loginForm {
  margin-top: 70px; 
}

.submitBtn {
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: var(--bg-color);
  border-radius: 8px;
  border-color: var(--main-font-color);
  padding: 8px 15px;
  margin-top: 2%;
  color: var(--main-font-color);
}

.submitBtn:hover {
  background-color: var(--hover-color);
  color: var(--bg-color);
}

.formDiv{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: var(--bg-color);
  color: var(--main-font-color);
}

.showPass{
  text-align: right;
  width: 100%;
}
</style>
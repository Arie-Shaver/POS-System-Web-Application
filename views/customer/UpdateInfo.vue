import localStorage from 'localStorage';

<template>
  <div>
    <h1>Update Information</h1>
    <div>
      <label for="newName">New Name:</label>
      <input type="text" id="newName" v-model="newName" />
      <button @click="updateName">Update Name</button>
    </div>

    <div>
      <label for="newPassword">New Password:</label>
      <input type="password" id="newPassword" v-model="newPassword" />
      <button @click="updatePassword">Update Password</button>
    </div>

    <div>
      <label for="newEmail">New Email:</label>
      <input type="text" id="newEmail" v-model="newEmail" />
      <button @click="updateEmail">Update Email</button>
    </div>

    <!-- Add the "Done" button -->
    <button @click="goToCustomerLogin">Done</button>
  </div>
</template>

<script>
//@group Customer
//Changes customer information (name, password, or email),
export default {
  created() {
    // Try to get customer information from local storage
    const storedCustomerEmail = localStorage.getItem('customerEmail');

    // Check if information is available in local storage
    if (storedCustomerEmail) {
      this.customerEmail = storedCustomerEmail;
    } else {
      // If no information is found, handle it accordingly
      this.customerEmail = '';
    }
  },
  data() {
    return {
      newName: '',
      newPassword: '',
      newEmail: '',
      customerEmail: '',
    };
  },
  methods: {
    //@vuese
    //Grabs email from local storage and calls updateInformation function with updated name
    async updateName() {
      const storedCustomerEmail = localStorage.getItem('customerEmail');

      if (!storedCustomerEmail) {
        console.error('Customer email is undefined');
        return;
      }

      this.customerEmail = storedCustomerEmail; // Update the local variable

      await this.updateInformation('updateCustomerName', this.newName);
      console.log('Updating name with data:', {
        customer_email: this.customerEmail,
        value: this.newName,
      });
    },

    //@vuese
    //Calls updateInformation function with updated password
    async updatePassword() {
      await this.updateInformation('updateCustomerPassword', this.newPassword);
    },

    //@vuese
    //Calls updateInformation function with updated email
    async updateEmail() {
      await this.updateInformation('updateCustomerEmail', this.newEmail);
    },
    
    //@vuese
    // Sends api request to server and updates the customer Information in the database based on values
    // @arg apiEndpoint -- api request being called
    // @arg value -- value to update the given customer information with 
   async updateInformation(apiEndpoint, value) {
      const storedCustomerEmail = localStorage.getItem('customerEmail');

      if (!storedCustomerEmail) {
        console.error('Customer email is undefined');
        return;
      }

      const requestData = {
        customer_email: storedCustomerEmail,
        value: value,
      };

      console.log(`Updating information with data for ${apiEndpoint}:`, requestData);

      try {
        const response = await fetch(`https://scad.onrender.com/${apiEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (data.success) {
          alert('Update successful');
        } else {
          alert('Update failed: ' + data.message);
        }
      } catch (error) {
        console.error('An error occurred during the update:', error);
        alert('An error occurred. Please try again later.');
      }
    },

    //@vuese
    // Navigates back to the customerLogin page
    goToCustomerLogin() {
      this.$router.push('/kungfutea/customerLogin');
    },
  },
};
</script>


<style scoped>
.update-info-container {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #EA0B43;
  font-family: 'Concert One', sans-serif;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
  font-family: 'Concert One', sans-serif;
}

input {
  width: 50%; /* Change this back to 50% if you prefer */
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

button {
  background-color: #EA0B43;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  display: inline-block;
}

button:hover {
  background-color: #333;
}
</style>

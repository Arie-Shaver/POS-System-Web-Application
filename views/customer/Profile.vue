<template>
  <div id="profile-page">
    <div class="welcome-message">
      <p>Welcome {{ customerName }}!</p>
    </div>
    <div class="points-display">
      {{ customerPoints }}/{{ totalPoints }} points
    </div>
    <div class="circle-container">
      <div class="circle-fill" :style="{ background: `conic-gradient(var(--title-color) 0% ${percentage}%, black ${percentage}% 100%)` }"></div>
    </div>
    <div class="space">
      space
      space
      space
    </div>
    <div class="rewards-display">
      ${{ dollars_earned }} earned. {{ totalPoints - customerPoints }} points till next reward!
    </div>

    <!-- Settings button -->
    <div class="settings-button" @click="toggleSettings">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>

    <!-- Settings section -->
    <div v-if="showSettings" class="settings-section">
      <!-- Add your settings options here -->
      <button @click="updateInformation({ customerEmail })">Update Information</button>
      <button @click="signOut">Switch Account</button> <!-- Change from signIn to signOut -->
      <button @click="deleteAccount({ customerEmail: customerEmail })">Delete Account</button>
    </div>
  </div>
</template>


<script>
//@group Customer
//Displays the customer's name, number of points, and rewards dollars -- also give user the option to update account and delete account,
export default {
  data() {
    return {
      customerName: 'Customer',
      customerPoints: 0,
      customerEmail: '',
      percentage: 0,
      totalPoints: 0,
      dollars_earned: 0,
      temporaryPoints: 500,
      showSettings: false,
    };
  },
  // ...

  created() {
  // Try to get customer information from local storage
  const storedCustomerEmail = localStorage.getItem('customerEmail');
  const storedCustomerName = localStorage.getItem('customerName');
  const storedCustomerPoints = localStorage.getItem('customerPoints');

  // Check if information is available in local storage
  if (storedCustomerEmail && storedCustomerName && storedCustomerPoints) {
    this.customerEmail = storedCustomerEmail;
    this.customerName = storedCustomerName;
    this.customerPoints = parseInt(storedCustomerPoints) || 0;

    // Your existing logic
    while (this.totalPoints < this.customerPoints) {
      this.totalPoints += 500;
    }
    while (this.temporaryPoints < this.customerPoints) {
      this.dollars_earned += 5;
      this.temporaryPoints += 500;
    }

    // Call your animateFill method here
    this.animateFill();

    // Pass customerEmail to fetchUserData
    this.fetchUserData(this.customerEmail);
  } else {
    // If no information is found, handle it accordingly
    this.customerName = 'Customer';
    this.customerPoints = 0;
    this.customerEmail = '';
  }
},
methods: {
  //@vuese
  // Sends API request to fetch customer data from the database
  //@arg customerEmail -- user's email from login
  async fetchUserData(customerEmail) {
    // Fetch user data from the server based on the provided email
    // Use customerEmail in the request if needed
    // Your existing logic
    while ((this.totalPoints < this.customerPoints) || this.totalPoints==0) {
      this.totalPoints += 500;
    }
    while (this.temporaryPoints < this.customerPoints) {
      this.dollars_earned += 5;
      this.temporaryPoints += 500;
    }

    // Call your animateFill method here
    this.animateFill();
  },
    //@vuese
    // Shows circle being filled with percentage of points.
   animateFill() {
      const targetPercentage = (this.customerPoints / this.totalPoints) * 100;
      const duration = 2000;
      let startTime;

      const animate = (time) => {
        if (!startTime) startTime = time;

        const progress = Math.min((time - startTime) / duration, 1);
        this.percentage = progress * targetPercentage;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },
    //@vuese
    // Opens options for user to delete account, update information, or switch account
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    //@vuese
    // Navigates user to the update Information page where they change their data
    // @arg data -- customer data 
   updateInformation(data) {
      localStorage.setItem('customerEmail', data.customerEmail);
      this.$router.push({
            path: '/kungfuteacustomer/updateInfo',
            query: {
              customerEmail: data.customerEmail,
            },
          });
    },
    //@vuese
    // Signs user out and navigates back to login page
    signOut() {
      this.$router.push('/kungfutea/customerLogin');
    },
    //@vuese
    // Deletes customers account from the database
    // @arg userData -- User's information
    async deleteAccount(userData) {
      // Log the current customer email to check if it's defined
      localStorage.setItem('customerEmail', userData.customerEmail);

      // Check if customer email is defined
      if (!userData.customerEmail) {
        console.error('Customer email is undefined');
        return;
      }

      const confirmDelete = window.confirm('Are you sure you want to delete your account? This action is irreversible.');

      if (confirmDelete) {
        // Make a request to the server to delete the account
        try {
          const response = await fetch('https://scad.onrender.com/deleteCustomer', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userData.customerEmail }),
          });

          const responseData = await response.json();

          if (responseData.success) {
            // Successful deletion, you might want to handle this accordingly
            console.log('Account deleted successfully');
          } else {
            // Handle deletion failure
            console.error('Failed to delete account:', responseData.message);
          }
          this.$router.push('/kungfutea/customerLogin');
        } catch (error) {
          console.error('An error occurred while deleting account:', error);
        }
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

#profile-page {
  background-color: var(--main-font-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--sub-font-color);
}

.welcome-message {
  margin-top: -200px;
  font-size: 60px;
  font-family: 'Concert One', sans-serif;
}

.points-display {
  font-size: 45px;
  color: var(--title-color);
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'Concert One', sans-serif;
}

.rewards-display {
  font-size: 40px;
  color: var(--title-color);
  font-weight: bold;
  font-family: 'Concert One', sans-serif;
}

.circle-container {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.circle-fill {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid var(--sub-font-color);
}

.space {
  font-size: 40px;
  color: transparent;
}

.settings-button {
  position: absolute;
  top: 110px;
  left: 40px;
  z-index: 999;
  color: var(--sub-font-color);
  cursor: pointer;
}

.line {
  width: 30px;
  height: 3px;
  background-color: var(--sub-font-color);
  margin: 5px 0;
}

.settings-section {
  background-color: var(--bg-color);
  position: absolute;
  top: 120px;
  left: 10px;
  width: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 998;
}

button {
  background-color: var(--bg-color);
  color: var(--title-color);
  padding: 10px;
  margin: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  white-space: nowrap;
  font-family: 'Concert One', sans-serif;
}

button:hover {
  background-color: var(--hover-color);
  color: var(--main-font-color);
}
</style>

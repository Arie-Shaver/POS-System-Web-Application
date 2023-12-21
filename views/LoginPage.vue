<template>
  <div>
    <div class="main-panel">
      <p class="loginTitle">Log In</p>
      
      <div class="formDiv">
        <form @submit.prevent="login" class="loginForm">
          <div class="userDiv">
            <label for="username" class="label-id">Username:</label>
            <input type="text" id="username" v-model="username" />
          </div>
  
          <div class="passDiv">
            <label for="password" class="label-password">Password:</label>
            <input type="password" id="password" v-model="password" />
          </div>
  
          <button type="submit" class="submitBtn">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// @group Login
// A login page featuring a form for entering usernames and passwords, authenticating users based on predefined roles upon submission, and redirecting them to corresponding views.
export default {
  data() {
    return {
      currentTime: new Date().toLocaleTimeString(),
      username: '',
      password: '',
      userToNameMap: {
        employee: 'Casey Kung',
        manager: 'Leah Tomotaki',
        customer: 'Dr.Taele',
      },
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    // @vuese
    // computes the current time in the format HH:mm:ss
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString();
    },
    // @vuese
    // Handle the login form submission
    login() {
      if (this.authenticateEmployee(this.username, this.password)) {
        this.openPOS(this.username);
      } else if (this.authenticateManager(this.username, this.password)) {
        this.openManager();
      } else if (this.authenticateCustomer(this.username, this.password)) {
        this.openCustomer();
      } else if(this.authenticateCashier(this.username, this.password)){
        this.openCashier();
      }
      else {
        alert('Invalid username or password');
        this.username = '';
        this.password = '';
      }
    },
    // @vuese
    // Authenticate employee credentials
    // @arg employee username, employee password, True if authentication succeeds, false otherwise.
    authenticateEmployee(username, password) {
      return (
        (username === 'employee' && password === 'employee1234')
      );
    },
    // @vuese
    // Authenticate manager credentials
    // @arg manager username, manager password, True if authentication succeeds, false otherwise.
    authenticateManager(username, password) {
      return username === 'manager' && password === 'manager1234';
    },
    // @vuese
    // Authenticate customer credentials
    // @arg customer username, customer password, True if authentication succeeds, false otherwise.
    authenticateCustomer(username, password) {
      return username === 'customer' && password === 'customer1234';
    },
    // @vuese
    // Authenticate cashier credentials
    // @arg cashier username, cashier password, True if authentication succeeds, false otherwise.
    authenticateCashier(username, password){
      return username === 'cashier' && password === 'cashier1234';
    },
    // @vuese
    // Open the Point of Sale (POS) view for an employee
    // @arg employee username
    openPOS(username) {
      const actualName = this.userToNameMap[username];
      console.log('Open POS for', actualName);
      // Here you would route to your POS component or page
      this.$router.push({ path: '/kungfutea/c_orderpage' }); // same as customer's view but main page would be order page
    },
    // @vuese
    // Open the Manager view.
    openManager() {
      console.log('Open Manager view');
      this.$router.push({ path: '/kungfuteamanager/manager' });
    },
    // @vuese
    // Open the customer view.
    openCustomer() {
      console.log('Open Customer view');
      this.$router.push({ path: '/kungfuteacustomer' });
    },
    // @vuese
    // Open the cashier view.
    openCashier() {
      console.log('Open Cashier view');
      this.$router.push({ path: '/kungfuteacashier/c_orderpage' });
    },
  },
};
</script>

<style>
.header-panel {
  background-color: #d3d3d3;
  padding: 0 50px;
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
}

.formDiv{
  border-style: solid;
  border-width: 2px;
  border-radius: 15.2px;
  border-color: black;
  width: 50%;
  height: 60vh;
  margin-left: auto;
  margin-right: auto;
}

.label-id, .label-password{
  font-family: 'Concert One', sans-serif;
  font-size: 27px;
  padding-right: 6%;
}

.userDiv{
  height: 20%;
  margin-top: 20%;
}

.passDiv{
  height: 20%;
}

.loginForm{
  height: 100%;
}

#username, #password{
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

#username:focus, #password:focus{
  border-color: #EA0B43;
}

.submitBtn{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
  padding-left: 15px;
  padding-right: 15px;
  height: 8%;
  margin-top: 2%;
}

.submitBtn:hover{
  background-color: #EA0B43;
}

</style>
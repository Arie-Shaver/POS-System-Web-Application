<template>
        <div class="navbar">
                <router-link class="options" style="text-decoration: none; color: inherit;" to="/kungfuteacashier/c_orderpage">CASHIER</router-link>
                <router-link class="options" style="text-decoration: none; color: inherit;" to="/">CUSTOMER</router-link>
                <div class="title">
                        <span class="red">KUNG FU </span><span class="white">TEA</span>
                </div>
                <p class="options" id="timeLabel"></p>
                <router-link class="options" style="text-decoration: none; color: inherit;" to="/kungfutea/customerlogin">LOGOUT</router-link>
        </div>
</template>

<script>
// @group Template
// Manager navigation bar: allows managers to navigate to cashier view, customer view, or to logout; also shows the current time
export default {
        name: 'CashierNavbar',
        created() {
                setInterval(() => {
                        this.setTime();
                }, 1000)
        },
        methods: {
                // @vuese
                // Gets current time to display in navbar
                setTime(){
                        var dt = new Date();
                        document.getElementById("timeLabel").innerHTML = dt.toLocaleTimeString();
                },
        },
}
</script>       

<style scoped>
.navbar {
        display: flex;
        font-family: Levitation;
        background-color: black;
        color: white;
        padding: 10px;
        height: 80px;
        text-align: center;
        align-items: center;
        justify-content: center;
}

.options{
        font-size: 35px;
        color: white;
        text-decoration: none;
        flex: 10%;
}

.title {
        font-size: 50px;
        flex: 20%;
}

.red {
        color: #EA0B43;
}

.white {
        color: white;
}
.settings-btn {
  cursor: pointer;
}

.line {
  width: 30px; /* Increased width */
  height: 3.5px; /* Increased height */
  background-color: white;
  margin: 8px 0; /* Adjusted spacing between lines */
  margin-right: 10px;
}
</style>
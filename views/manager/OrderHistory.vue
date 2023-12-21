<template>
  <div id="orderHistory">
    <div id="titleDiv">
      <h1 class="title">
        Order History
      </h1>
    </div>
    <div class="group">
    <div id="dateRangeDiv">
      <div class="date-label">
        Today's Date: <span id="current-date">{{ currentDate }}</span>
      </div>
      <div class="buttons">
        <button @click="setTimeFrame('today')">Today</button>
        <button @click="setTimeFrame('1d')">1D</button>
        <button @click="setTimeFrame('1w')">1W</button>
        <button @click="setTimeFrame('1m')">1M</button>
        <button @click="setTimeFrame('3m')">3M</button>
        <button @click="toggleDateSelection">Select Date</button>
      </div>
    </div>
    <div v-if="showDateSelection" class="accordion">
        <div class="accordion-content" id="redBack">
          <label for="startDateInput">Start Date:</label>
          <input type="date" id="startDateInput" v-model="selectedStartDate" />
          <label for="endDateInput">End Date:</label>
          <input type="date" id="endDateInput" v-model="selectedEndDate" />
          <button class="applyBtn" @click="updateDateRange">Apply</button>
        </div>
    </div>
    <div id="orderHistoryTable">
      <table>
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Time</th>
            <th>Order Details</th>
            <th>Tip</th>
            <th>Total Price</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" style="text-align: center;">
              <div class="loadingDiv display"></div>
            </td>
          </tr>
          <tr v-for="(order, index) in orderHistory" :key="index">
            <td>{{ formatDate(order.order_date) }}</td>
            <td>{{ order.order_time }}</td>
            <td>{{ order.order_details }}</td>
            <td>{{ order.tip }}</td>
            <td>{{ order.price }}</td>
            <td>{{ order.payment_method }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
</template>

<script>
//@group Manager
// Fetches order history data from the specified dates/timeframe, displays it in a table.
export default {
  data() {
    return {
      orderHistory: [],
      startDate: "",
      endDate: "",
      currentDate: "",
      showDateSelection: false,
      isLoading: false,
    };
  },
  created() {
    this.setCurrentDate();
    this.setTimeFrame("today");
  },
  methods: {
    // @vuese
    // fetches order history data based on start & end dates specified by user
    fetchOrderHistoryData() {
        this.isLoading = true;
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/orderHistory?startDate=${this.startDate}&endDate=${this.endDate}`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            this.orderHistory = data;
          })
          .catch((error) => {
            console.error("Error fetching order_history data:", error);
          })
          .finally(() => {
          this.isLoading = false; // Set loading state to false after the fetch
          });
    },
    // @vuese
    // set currentDate with the current date
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      this.currentDate = `${year}-${month}-${day}`;
    },
    // @vuese
    // sets the start & end dates based on timeframe selected by user
    // @arg timeframe -- Today / 1D / 1W / 1M / 3M -- timeframe to grab data from
    setTimeFrame(timeframe) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();

      switch (timeframe) {
        case "today":
          this.startDate = this.currentDate;
          this.endDate = this.currentDate;
          break;
        case "1d":
          this.startDate = this.calculateDate(year, month, day - 1);
          this.endDate = this.currentDate;
          break;
        case "1w":
          this.startDate = this.calculateDate(year, month, day - 7);
          this.endDate = this.currentDate;
          break;
        case "1m":
          this.startDate = this.calculateDate(year, month - 1, day);
          this.endDate = this.currentDate;
          break;
        case "3m":
          this.startDate = this.calculateDate(year, month - 3, day);
          this.endDate = this.currentDate;
          break;
        default:
          // Handle select date logic here
          break;
      }

      this.fetchOrderHistoryData();
      this.showDateSelection = false; // Close the accordion
    },
    // @vuese
    // returns a yyyy-MM--dd formatted date using the given year, month, and day
    // @arg year -- integer year, month -- integer month, day -- integer day
    calculateDate(year, month, day) {
      const date = new Date(year, month - 1, day);
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate;
    },
    // @vuese
    // formats date given to be yyyy-MM-dd
    // @arg date -- specified string date
    formatDate(date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      return formattedDate;
    },
    // @vuese
    //updates showDateSelection, and displays date selection panel for user
    toggleDateSelection() {
      this.showDateSelection = !this.showDateSelection;
    },
    // @vuese
    // updates the start & end dates and regrabs order history data to display
    updateDateRange(){
      this.startDate = document.getElementById("startDateInput").value;
      this.endDate = document.getElementById("endDateInput").value;
      this.fetchOrderHistoryData();
    }
  },
};
</script>

<style>

.applyBtn{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
}

#startDateInput{
  margin-right: 70px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
}

#endDateInput{
  margin-right: 20px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
}
.group{
  width: 100%;
}
.title{
  font-family: levitation;
  font-size: 35px;
  color: #EA0B43;
}
#dateRangeDiv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #EA0B43;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

.date-label {
  font-weight: bold;
}

.buttons button {
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
}

#orderHistory{
  margin: 0 auto;
  padding: 50px; /* Add padding to control the margins */
}

table {
  border-collapse: collapse;
  margin: 0; /* Remove the default table margin */
  width: 100%;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #EA0B43;
}

.accordion-content {
  padding: 10px;
  overflow: hidden;
  padding-top: 20px;
  padding-bottom: 20px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  background-color: #EA0B43;
}

.accordion-content input {
  margin-bottom: 10px;
}

.accordion.active .accordion-content {
  display: block;
}

.accordion-content label{
  margin-right: 20px;
}

#redBack{
  background-color: #EA0B43 !important;
}


.loadingDiv {
  width: 2rem;
  height: 2rem;
  border: 5px solid black;
  border-top: 6px solid #EA0B43;
  border-radius: 100%;
  margin: auto;
  visibility: hidden;
  animation: spin 1s infinite linear;
  margin-top: 15px;
  margin-bottom: 15px;
}
.loadingDiv.display {
  visibility: visible;
}
@keyframes spin {
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(360deg);
  }
}

</style>
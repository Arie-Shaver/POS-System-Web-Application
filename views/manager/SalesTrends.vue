<template>
  <div id="salesTrends">
        <div id="titleDiv">
          <h1 class="title">
            Sales/Trends
          </h1>
        </div>
          <div class="graph-controls">
              <div class="controls-row">
                  <select class="select" v-model="selectedGraphType">
                          <option :value="'Select Graph'" selected>Select Graph</option>
                          <option :value="'Prices Over Time'">Prices Over Time</option>
                          <option :value="'Order History Trends'">Order History Trends</option>
                          <option :value="'Menu Pairs'">Menu Pairs</option>
                  </select>
                  <div class="buttons">
                          <button @click="setTimeFrame('1W')">1W</button>
                          <button @click="setTimeFrame('1M')">1M</button>
                          <button @click="setTimeFrame('3M')">3M</button>
                          <button @click="setTimeFrame('1Y')">1Y</button>
                          <button @click="toggleDateSelection">Select Date</button>
                  </div>
              </div>
          </div>
          <div v-if="showDateSelection" class="accordion">
            <div class="accordion-content">
              <label for="startDateInput">Start Date:</label>
              <input type="date" id="startDateInput" v-model="selectedStartDate" />
              <label for="endDateInput">End Date:</label>
              <input type="date" id="endDateInput" v-model="selectedEndDate" />
              <button class='salesBtns' @click="updateDateRange">Apply</button>
            </div>
          </div>
          <div class="graph-display">
                  <div v-if="selectedGraphType === 'Select Graph'">
                  </div>
                  <div v-if="selectedGraphType === 'Prices Over Time'">
                          <PricesOverTime class="graph-container" ref="pricesOverTime" :startDate="startDate" :endDate="endDate" />
                  </div>
                  <div v-else-if="selectedGraphType === 'Order History Trends'">
                          <OrderHistoryTrends class="graph-container" ref="orderHistoryTrends" :startDate="startDate" :endDate="endDate" />
                  </div>
                  <div v-else-if="selectedGraphType === 'Menu Pairs'">
                    <MenuPairs class="graph-container" ref="menuPairs" :startDate="startDate" :endDate="endDate"></MenuPairs>
                  </div>
          </div>
  </div>
</template>

<script>
import OrderHistoryTrends from './OrderHistoryTrends.vue';
import PricesOverTime from './PricesOverTime.vue';
import MenuPairs from './MenuPairs.vue';

// @group Manager
// Displays the following graph options: "Select Graph" / "Prices Over Time" / "Order History Trends" / "Menu Pairs". These graphs show different information about the order history postgreSQL database.
export default {
  name: 'SalesTrends',
  data() {
    return {
      selectedGraphType: 'Select Graph',
      timeFrame: '1W',
      currentDate: null, 
      selectedStartDate: null,
      selectedEndDate: null,
      showDateSelection: false,
    };
  },
  computed: {
    // @vuese
    // computes the startDate based on timeframe/user input
    startDate() {
      if(this.timeFrame != null){
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        switch (this.timeFrame) {
          case '1W':
            return this.calculateDate(year, month, day - 7);
          case '1M':
            return this.calculateDate(year, month - 1, day);
          case '3M':
            return this.calculateDate(year, month - 3, day);
          case '1Y':
            return this.calculateDate(year - 1, month, day);
          default:
            // Handle select date logic here
            break;
        }
      }else{
        return this.selectedStartDate;
      }
    },
    // @vuese
    // computes the endDate based on timeframe/user input. For timeframe, the endDate is always today.
    endDate() {
      if(this.timeFrame != null){
        return this.currentDate;
      }else{
        return this.selectedEndDate;
      }
    }
  },
  created() {
    this.setCurrentDate();
    this.setTimeFrame("1W");
  },
  methods: {
    // @vuese
    // calculates the current date and returns in string form: yyyy-MM-dd
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      this.currentDate = `${year}-${month}-${day}`;
    },
    // @vuese
    // sets the current graph's timeframe, by resetting the selectedGraphType to "Select Graph" and then updating the selectedGraphType back to the originally chosen type. This refreshes the data & graph information & rerenders.
    // @arg timeFrame -- 1W / 1M / 3M / 1Y -- timeframe to grab data from for the graph
    async setTimeFrame(timeFrame) {
      // Save the current selected graph type
      const currentGraphType = this.selectedGraphType;

      // Reset the selectedGraphType to "Select Graph"
      this.selectedGraphType = "Select Graph";

      // Set the new time frame
      this.$nextTick(() => {
        // Use setTimeout to allow the DOM to fully reflect "Select Graph"
        setTimeout(() => {
          // Set the new time frame
          this.timeFrame = timeFrame;

          // Use $nextTick to wait for the DOM to update again
          this.$nextTick(() => {
            // Restore the selected graph type to its original value
            this.selectedGraphType = currentGraphType;
          });
        }, 0)});
    },
    // @vuese
    // returns a yyyy-MM--dd formatted string date using the given year, month, and day
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
    // handles user inputted start & end dates -- refreshes the data & component
    updateDateRange() {
      const currentGraphType = this.selectedGraphType;
      this.selectedGraphType = "Select Graph";
      

      this.$nextTick(() => {
        // Use setTimeout to allow the DOM to fully reflect "Select Graph"
        setTimeout(() => {
          // Set the new time frame
          this.timeFrame = null;

          // Use $nextTick to wait for the DOM to update again
          this.$nextTick(() => {
            // Restore the selected graph type to its original value
            this.selectedGraphType = currentGraphType;
          });
        }, 0)});
    },
  },
  components: {
    PricesOverTime,
    OrderHistoryTrends,
    MenuPairs,
  }
};
</script>

<style>
#salesTrends {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.graph-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background-color: #EA0B43;
  width: 60%;
  height: 50px;
  padding-left: 20px;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.time-range-buttons {
  display: flex;
  margin-top: 10px;
}

.time-range-buttons button {
  margin-right: 5px;
}


.graph-display {
  align-items: center;
  width: 90%;
  height: fit-content;
  border: 1px solid #ccc;
}

.graph-display h2 {
  margin-bottom: 10px;
}

.select, .time-range-buttons {
  flex: 1;
}

select{
  height: 30px;
  margin-top: 10px;
  margin-right: 50px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  max-width: fit-content;
}

.salesBtns{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
}




</style>
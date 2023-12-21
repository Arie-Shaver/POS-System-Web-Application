<template>
        <div id="chartDiv" ref="orderHistoryTrends">
                <div class="titleAndBtn">
                        <p class="chartTitle">Order History Trends</p>
                        <button class="chooseBtn" @click="showCheckedDiv" :disabled="isLoading">Choose Menu Items</button>
                </div>
                <div v-if="isLoading">
                        <div class="loadingDiv display"></div>
                </div>
                <div v-if="isModalOpen" class="modal">
                        <div class="modal-content">
                          <h3>Menu Items</h3>
                          <div class="checkScroll">
                                <div v-for="(item, index) in menu" :key="index" class="checkbox-container">
                                        <input :ref="`checkbox${index}`" type="checkbox" :id="'item-' + index" :value="item.tea_type" :checked="isSelected(item)" @change="handleCheckboxChange($event, item)">
                                        <label :for="'item-' + index" class="itemLabels">{{ item.tea_type }}</label>
                                </div>
                          </div>
                          <button class="chooseBtn" @click="updateChart">done</button>
                        </div>
                </div>
                <canvas id="myChart" ref="chartCanvas"></canvas>
        </div>
</template>

<script>
//@group Manager
//Displays a line graph of selected menu items and their order frequencies, given specified start and end dates.
export default {
        props: {
                //start date of order history data to grab. form: yyyy-MM--dd
                startDate: {
                        type: String,
                        required: true
                },
                //end date of order history data to grab. form: yyyy-MM--dd
                endDate: {
                        type: String,
                        required: true
                }
        },
        data() {
                return {
                        menu: [],
                        orderHistory: [],
                        dates: [],
                        freqs: [],
                        isModalOpen: false,
                        selectedItems: [],
                        currChart: null,
                        isLoading: false,
                };
        },
        created() {
                this.fetchMenu();
        },
        methods: {
                // @vuese
                //fetches all menu item names from postgreSQL database, updates menu var
                fetchMenu() {
                        this.isLoading = true;
                        const apiBaseUrl = "https://scad.onrender.com";
                        const url = `${apiBaseUrl}/teatypes`;
                        fetch(url).then(response => {
                        if (!response.ok) {
                                throw new Error("Network response was not ok");
                        }
                        return response.json();
                        })
                        .then(data => {
                                this.menu = data;
                                this.fetchPricesFreq()
                        })
                        .catch(error => {
                        console.error("Error fetching order_history price data:", error);
                        });
                },
                // @vuese
                //Called from fetchMenu(), to fetch order history data from startDate to endDate
                fetchPricesFreq() {
                        // /orderHistory/prices?startDate=2023-01-01&endDate=2023-12-31.
                        const apiBaseUrl = "https://scad.onrender.com";
                        const url = `${apiBaseUrl}/orderHistory/pricesFreq?startDate=${this.startDate}&endDate=${this.endDate}`;
                        fetch(url).then(response => {
                        if (!response.ok) {
                                throw new Error("Network response was not ok");
                        }
                        return response.json();
                        })
                        .then(data => {
                                this.orderHistory = data;
                                this.setFreq();
                        })
                        .catch(error => {
                        console.error("Error fetching order_history price data:", error);
                        });
                },
                // @vuese
                //Called from fetchPricesFreq(), uses order history data to fill in dates & frequencies value lists
                setFreq(){
                        for(let i = 0; i < this.orderHistory.length; i++){
                                let freq = [];
                                for(let j = 0; j < this.menu.length; j++){
                                        freq.push(0);
                                }
                                let currOrder = this.orderHistory[i].order_details;
                                let currDate = this.orderHistory[i].order_date;
                                currOrder = currOrder.split(",");
                                for(let j = 0; j < currOrder.length; j++){
                                        let currItem = currOrder[j].trim();
                                        for(let k = 0; k < this.menu.length; k++){
                                                if(currItem == this.menu[k].tea_type){
                                                        freq[k] = freq[k] + 1;
                                                }
                                        }
                                }
                                if(this.datesContains(this.dates, currDate)){
                                        let index = this.dateIndex(this.dates, currDate);
                                        for(let j = 0 ; j < freq.length; j++){
                                                this.freqs[index][j] = this.freqs[index][j] + freq[j];
                                        }
                                }else{
                                        this.dates.push(currDate);
                                        this.freqs.push(freq);
                                }
                        }
                        this.isLoading = false;
                },
                // @vuese
                // returns boolean -- whether or not the list arr contains the date curr
                // @arg arr is a list of dates
                // @arg curr is a specific date in form yyyy-MM-dd
                datesContains(arr, curr){
                        for(let i = 0; i < arr.length; i++){
                                if(arr[i] == curr){
                                        return true;
                                }
                        }
                        return false;
                },
                // @vuese
                // returns integer -- index of date curr in list arr
                // @arg arr is a list of dates
                // @arg curr is a specific date in form yyyy-MM-dd
                dateIndex(arr, curr){
                        for(let i = 0; i < arr.length; i++){
                                if(arr[i] == curr){
                                        return i;
                                }
                        }
                        return -1;
                },
                // @vuese
                // sets modal variable to show modal of menu items with checkboxes next to each
                showCheckedDiv(){
                        this.isModalOpen = !this.isModalOpen;
                },
                // @vuese
                // appends to selectedItems list with item upon event
                // @arg event -- checkbox change applied
                // @arg item -- menu item chosen
                handleCheckboxChange(event, item) {
                        // Check if the checkbox is checked
                        if (event.target.checked) {
                                this.selectedItems.push(item);
                        }else{
                                let index = -1;
                                for(let i = 0; i < this.selectedItems.length; i++){
                                        if(this.selectedItems[i] == item){
                                                index = i;
                                                break;
                                        }
                                }
                                this.selectedItems.splice(index, 1);
                        }
                },
                // @vuese
                // returns boolean -- whether or not the menu item was selected by the user
                // @arg item -- menu item
                isSelected(item) {
                        // Check if the item is in the selectedItems array
                        return this.selectedItems.includes(item);
                },
                // @vuese
                // Handles chart update + calls the redraw function
                updateChart(){
                        this.isLoading = true;
                        this.showCheckedDiv();
                        const c = this.$refs.chartCanvas;
                        const ctx = c.getContext("2d");
                        if(this.currChart != null){
                                this.currChart.destroy();
                                this.drawChart();
                        }else{
                                this.drawChart();
                        }
                },
                // @vuese
                // returns a randomized color as a hex code
                generateRandomColor(){
                        let maxVal = 0xFFFFFF; // 16777215
                        let randomNumber = Math.random() * maxVal; 
                        randomNumber = Math.floor(randomNumber);
                        randomNumber = randomNumber.toString(16);
                        let randColor = randomNumber.padStart(6, 0);   
                        return `#${randColor.toUpperCase()}`
                },
                // @vuese
                // draws the line chart using the dates & frequencies lists, with each menu item having a different random colored line. 
                drawChart() {
                        const c = this.$refs.chartCanvas;
                        const ctx = c.getContext("2d");
                        const formattedDates = this.dates.map(date =>
                        new Date(date).toISOString().split("T")[0]
                        );

                        let dataSets = [];
                        for(let i = 0; i < this.selectedItems.length; i++){
                                let item = this.selectedItems[i].tea_type;
                                let index = -1;
                                for(let j = 0; j < this.menu.length; j++){
                                        if(this.menu[j].tea_type == item){
                                                index = j;
                                                break;
                                        }
                                }
                                dataSets.push(this.freqs[index]);
                        }
                        var dataObjects = [];

                        for(let i = 0; i < this.selectedItems.length; i++){
                                var dataItem = {
                                        label: this.selectedItems[i].tea_type,
                                        data: dataSets[i],
                                        lineTension: 0,
                                        fill: false,
                                        borderColor: this.generateRandomColor(),
                                };
                                dataObjects.push(dataItem);
                        }

                        var chartData = {
                                labels: formattedDates,
                                datasets: dataObjects
                        };

                        var chartOptions = {
                                legend: {
                                        display: true,
                                        position: 'top',
                                        labels: {
                                                boxWidth: 80,
                                                fontColor: 'black'
                                        }
                                },
                                scales: {
                                        y: {
                                                beginAtZero: true
                                        }
                                },
                                responsive: true, // Ensures the chart resizes with the container
                                maintainAspectRatio: true // Disables maintaining aspect ratio
                        };
                        
                        this.currChart = new Chart(ctx, {
                                type: 'line',
                                data: chartData,
                                options: chartOptions
                        });

                        this.isLoading = false;
                },
        },
};
</script>


<style>

#chartDiv{
        width: 100%;
        height: 800px;
}

#myChart{
        height: 500px;
        width: 100%;
}
.modal-content {
        background-color: white;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        display: flex; /* Change display to flex */
        flex-direction: column; /* Stack components on top of each other */
        font-family: 'Concert One', sans-serif;
        font-size: 17px;
        align-items: center;
}

.modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
}
.checkScroll{
        overflow: scroll;
        height: 300px;
}

.chartTitle{
        font-size: 30px;
        font-family: 'Concert One', sans-serif;
}

.titleAndBtn{
}

.chooseBtn{
        margin-right: 5px;
        font-family: 'Concert One', sans-serif;
        font-size: 20px;
        background-color: white;
        border-radius: 8px;
        border-color: black;
}
</style>
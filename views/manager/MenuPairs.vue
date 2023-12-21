<template>
        <div id="chartDiv" ref="menuPairs">
                <div class="scrollMenuPair">
                        <div class="titleDiv">
                                <p class="chartTitle">Menu Pairs</p>
                        </div>
                        <div class="pairsTableDiv">
                                <table class="pairsTable">
                                        <thead>
                                                <tr>
                                                        <th scope="col">Drink Pair</th>
                                                        <th scope="col">Frequency</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-if="isLoading">
                                                        <td colspan="6" style="text-align: center;">
                                                        <div class="loadingDiv display"></div>
                                                        </td>
                                                </tr>
                                                <tr v-for="(frequency, pair) in menuPairsFrequency" :key="pair">
                                                <td>{{ pair }}</td>
                                                <td class="freqCol">{{ frequency }}</td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </div>
        </div>
        
</template>


<script>
// @group Manager
// Displays all menu item pairs with their frequency in a table, given specified start and end dates.
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
                        orderHistory: [],
                        menuPairsFrequency: {},
                        isLoading: false,
                };
        },
        created() {
                this.fetchOrderHistoryData();
        },
        methods: {
                // @vuese
                // Used to fetch order history data from the postgreSQL database, uses startDate & endDate props
                fetchOrderHistoryData(){
                        this.isLoading = true;
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
                                this.calculateMenuPairsFrequency();
                        })
                        .catch(error => {
                                console.error("Error fetching order_history data:", error);
                        });  
                },
                // @vuese
                //Called from fetchOrderHistoryData(), takes current order history data, and records all menu item pairs with their frequencies. 
                calculateMenuPairsFrequency() {
                        this.orderHistory.forEach((order) => {
                                const items = order.order_details.split(","); // Split order_details into individual items
                                this.recordMenuPairs(items);
                        });
                        this.sortMenuPairsByFrequency();
                },
                // @vuese
                //Helper function used in calculateMenuPairsFrequency(). Records frequencies of menu item pairs in the menuPairsFrequency list.
                // @arg The argument, items, is a list of menu items from an order
                recordMenuPairs(items) {
                        for (let i = 0; i < items.length; i++) {
                                for (let j = i + 1; j < items.length; j++) {
                                        const pair = `${items[i]},${items[j]}`;
                                        this.menuPairsFrequency[pair] = (this.menuPairsFrequency[pair] || 0) + 1;
                                }
                        }
                },
                // @vuese
                //Helper function used in calculateMenuPairsFrequency(). Sorts the current menu pairs list descending by frequency
                sortMenuPairsByFrequency() {
                        // Convert the object into an array of key-value pairs
                        const menuPairsArray = Object.entries(this.menuPairsFrequency);

                        // Sort the array based on the frequency (the second element in each pair)
                        menuPairsArray.sort((a, b) => b[1] - a[1]);

                        // Create a new object from the sorted array
                        const sortedMenuPairs = Object.fromEntries(menuPairsArray);

                        // Update the menuPairsFrequency with the sorted object
                        this.menuPairsFrequency = sortedMenuPairs;
                        this.isLoading = false;
                },
        }
};
</script>
        
        
<style>
#chartDiv{
        width: 100%;
        height: fit-content;
}

.pairsTableDiv{
        width: 100%;
        padding: 15px;
}

.pairsTable{
        width: 60%;
        margin-left: auto;
        margin-right: auto;
}

.freqCol{
        text-align: center;
}
</style>
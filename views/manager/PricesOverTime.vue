<template>
    <div id="chartDiv" ref="pricesOverTime">
      <div class="titleDiv">
              <p class="chartTitle">Prices Over Time</p>
      </div>
      <div v-if="isLoading">
        <div class="loadingDiv display"></div>
      </div>
      <canvas id="myChart" ref="chartCanvas"></canvas>
    </div>
    
    </template>
    
    <script>
    //@group Manager
    //Displays a line graph of daily order price totals over time, given specified start and end dates.
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
          dates: [],
          prices: [],
          isLoading: false,
        };
      },
      created() {
        this.fetchPricesDates();
      },
      methods: {
        // @vuese
        //draws line chart using dates & prices lists
        drawChart() {
          const c = this.$refs.chartCanvas;
          const ctx = c.getContext("2d");
          const formattedDates = this.dates.map(date =>
            new Date(date).toISOString().split("T")[0]
          );
    
          new Chart(ctx, {
            type: "line",
            data: {
              labels: formattedDates,
              datasets: [
                {
                  label: "Price",
                  data: this.prices,
                  backgroundColor: "#EA0B43",
                  borderColor: "#EA0B43",
                  borderWidth: 1
                }
              ]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              responsive: true, // Ensures the chart resizes with the container
              maintainAspectRatio: true // Disables maintaining aspect ratio
            }
          });
          this.isLoading = false;
        },
        // @vuese
        //Called from fetchPricesDates(), to aggregate each day's data -- each date should have 1 price value
        aggregateData() {
          let aggregatedData = [];
          for (let i = 0; i < this.orderHistory.length; i++) {
            const d = this.orderHistory[i].order_date;
            const p = this.orderHistory[i].price;
            let index = -1;
            for (let j = 0; j < aggregatedData.length; j++) {
              if (aggregatedData[j][0] === d) {
                index = j;
                break;
              }
            }
            if (index == -1) {
              aggregatedData.push([d, p]);
            } else {
              aggregatedData[index][1] += p;
            }
          }
          for (let i = 0; i < aggregatedData.length; i++) {
            this.prices.push(aggregatedData[i][1]);
            this.dates.push(aggregatedData[i][0]);
          }
          this.drawChart();
        },
        // @vuese
        // Fetches order history data between startDate and endDate
        fetchPricesDates() {
          this.isLoading = true;
          // /orderHistory/prices?startDate=2023-01-01&endDate=2023-12-31.
          const apiBaseUrl = "https://scad.onrender.com";
          const url = `${apiBaseUrl}/orderHistory/pricesDates?startDate=${this.startDate}&endDate=${this.endDate}`;
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then(data => {
              this.orderHistory = data;
              this.aggregateData();
            })
            .catch(error => {
              console.error("Error fetching order_history price data:", error);
            });
        },
        // @vuese
        //Refreshes all graph data with a new start & end date
        // @arg newStart -- new start date, newEnd -- new end date
        refresh(newStart, newEnd) {
                this.startDate = newStart;
                this.endDate = newEnd;
                this.orderHistory = [];
                this.dates = [];
                this.prices = [];
                this.fetchPricesDates();
        }
      },
    };
    </script>
    
    
    <style>
    #chartDiv{
            width: 100%;
            height: 90vh;
    }
    </style>
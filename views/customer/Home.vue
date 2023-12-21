<template>
        <div class="homeDiv">
                <div class="titleWeatherDiv">
                        <p class="welcomeTitle">Welcome!</p>
                        <div class="weatherDiv" v-if="location">
                                <p class="weather">Currently, it's {{weather.data.values.temperature}}°F and {{weatherCode[weather.data.values.weatherCode]}}</p>
                        </div>
                </div>
                <div class="slider">
                        <div class="slider-images">
                                <img v-for="(image, index) in slideshowImages" :src="`/assets/${image}`" :key="index" :class=" { active: index === currentSlide }" :alt="getAltText(image)"/>
                        </div>
                </div>
                <div class="titleDiv">
                        <p class="popularTitle">Popular Now</p>
                </div>
                <div class="popular-slider">
                        <button class="arrowBtn" @click="togglePopular">&lt;</button>
                        <div class="popular-container">
                                <div v-if="isLoading">
                                        <div class="loadingDiv display"></div>
                                </div>
                        <div v-for="(item, index) in visiblePopular" :key="index" class="popular-item" @mouseenter="toggleHover(true)" @mouseleave="toggleHover(false)">
                                <div :class="{ 'flip-container': isPopularHovered }">
                                <div class="flipper">
                                <img class="popularImg" :src="`/assets/${item.image}`" :alt="getAltText(item.image)"/>
                                <div class="back-content">
                                <p class="menuName">{{ item.tea_type }}</p>
                                <p class="menuDesc">{{item.description}}</p>
                                </div>
                                </div>
                                </div>
                        </div>
                        </div>
                        <button class="arrowBtn" @click="togglePopular">></button>
                </div>
        </div>
</template>
    
<script>
    // @group Customer
    // Home page for customers, contains image slide shows and all of the drinks with the drink names, descriptions, and images
    export default {
        name: 'Home',
        // @vuese
        // Variables containing weather API, images for the home page and all menu items with their alt text/descriptios.
        data(){
                return{
                        slideshowImages:[
                                'Home1.jpeg',
                                'Home2.jpeg',
                                'Home3.jpeg',
                                'Home4.jpeg',
                        ],
                        currentSlide: 0,
                        orderHistory: [],
                        menu: [],
                        popular: [],
                        currentPopularIndex: 0,
                        isPopularHovered: false,
                        isLoading: false,
                        altText: [],
                        location: null,
                        weather: null,
                        weatherCode: {
                                "0": "Unknown",
                                "1000": "Clear, Sunny",
                                "1100": "Mostly Clear",
                                "1101": "Partly Cloudy",
                                "1102": "Mostly Cloudy",
                                "1001": "Cloudy",
                                "2000": "Fog",
                                "2100": "Light Fog",
                                "4000": "Drizzle",
                                "4001": "Rain",
                                "4200": "Light Rain",
                                "4201": "Heavy Rain",
                                "5000": "Snow",
                                "5001": "Flurries",
                                "5100": "Light Snow",
                                "5101": "Heavy Snow",
                                "6000": "Freezing Drizzle",
                                "6001": "Freezing Rain",
                                "6200": "Light Freezing Rain",
                                "6201": "Heavy Freezing Rain",
                                "7000": "Ice Pellets",
                                "7101": "Heavy Ice Pellets",
                                "7102": "Light Ice Pellets",
                                "8000": "Thunderstorm"
                        },
                };
        },
        // @vuese
        // Set the font size of the page
        mounted(){
                this.startAutoSlide();
                const selectedFontSize = parseInt(localStorage.getItem('selectedFontSize')) || 24;
                this.applyFontSize(selectedFontSize);
        },
        // @vuese
        // Retrieve all data needed for the home page such as the menu drink items and the location for the weather API
        created(){
                this.fetchMenuData();
                this.getLocation();
        },
        computed: {
                // @vuese
                // Generate end date based upon user input to find popular items ordered
                // @return endDate Formatted date
                endDate(){
                        const date = new Date();
                        let day = date.getDate();
                        let month = date.getMonth() + 1;
                        let year = date.getFullYear();
                        return year + "-" + month + "-" + day;
                },
                // @vuese
                // Generate start date based upon user input to find popular items ordered
                // @return startDate Formatted date
                startDate(){
                        const date = new Date();
                        let day = date.getDate();
                        let month = date.getMonth() + 1;
                        let year = date.getFullYear();

                        if(month > 3){
                                month -= 3;
                        }else{
                                let rem = 3 - month;
                                month = 12 - rem;
                        }
                        return year + "-" + month + "-" + day;
                },
                // @vuese
                // Find popular drink items based on the dates inputted by the user
                // @return popular Popular menu items to be displayed in the home page
                visiblePopular() {
                        return this.popular[this.currentPopularIndex];
                },
        },
        methods:{
                // @vuese
                // Click to the next slide of the slideshow of drink images
                nextSlide(){
                        this.currentSlide = (this.currentSlide + 1) % this.slideshowImages.length;
                },
                // @vuese
                // Click to the previous slide of the slideshow of drink images
                prevSlide() {
                        this.currentSlide = (this.currentSlide + this.slideshowImages.length - 1) % this.slideshowImages.length;
                },
                // @vuese
                // Begin the slideshow of images from the drink menu
                startAutoSlide() {
                        setInterval(() => {
                                this.nextSlide();
                        }, 3000);
                },

                // @vuese
                // Retrieve order history of drink items ordered based on user date inputs from the database
                // @throws error Network error when attempting to access the database
                fetchOrderHistoryData(){
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
                                this.addFrequencies();
                                this.fetchAltText();
                        })
                        .catch(error => {
                                console.error("Error fetching order_history data:", error);
                        });  
                },

                // @vuese
                // Retrieve all menu drink items from the menu sql table of the database to be displayed on the home page
                // @throws error Network error when attempting to access the database
                fetchMenuData(){
                        this.isLoading = true;
                        const apiBaseUrl = "https://scad.onrender.com";
                        const url = `${apiBaseUrl}/menu/display`;
                        fetch(url).then(response => {
                        if (!response.ok) {
                                throw new Error("Network response was not ok");
                        }
                        return response.json();
                        })
                        .then(data => {
                                this.menu = data;
                                this.fetchOrderHistoryData();
                        })
                        .catch(error => {
                                console.error("Error fetching menu data:", error);
                        });  
                },

                // @vuese
                // Based upon the order history of the drinks a frequency of drinks ordered is calculated to display on the homepage
                addFrequencies() {
                        // Create a frequency map to store the count of each menu item
                        const frequencyMap = {};

                        // Traverse the orderHistory list
                        this.orderHistory.forEach(order => {
                                // Split the order_details string into individual menu items
                                const menuItems = order.order_details.split(',').map(item => item.trim());

                                // Update the frequency map based on menu items in the current order
                                menuItems.forEach(menuItem => {
                                // If the menuItem is not in the frequencyMap, initialize its count to 1
                                if (!frequencyMap[menuItem]) {
                                frequencyMap[menuItem] = 1;
                                } else {
                                // Increment the count if the menuItem is already in the frequencyMap
                                frequencyMap[menuItem]++;
                                }
                                });
                        });

                        // Update the menu list with the calculated frequencies
                        this.menu.forEach(item => {
                                // Use the menuItem as the key to access its frequency in the map
                                const menuItem = item.tea_type;
                                // Set the frequency property in the menu list
                                item.frequency = frequencyMap[menuItem] || 0;
                        });
                        this.findPopular();
                },

                // @vuese
                // Finalize a list of most popular drinks ordered by other customers on the homepage
                findPopular() {
                        // Sort the menu by frequency in descending order
                        const sortedMenu = this.menu.slice().sort((a, b) => b.frequency - a.frequency);

                        // Take the top 6 items as the most popular
                        this.popular = sortedMenu.slice(0, 6);
                        let temp = [];
                        let firstHalf = [];
                        for(let i = 0; i < 3; i++){
                                firstHalf.push(this.popular[i]);
                        }
                        temp.push(firstHalf);
                        let secHalf = [];
                        for(let i = 3; i < 6; i++){
                                secHalf.push(this.popular[i]);
                        }
                        temp.push(secHalf);
                        this.popular = temp;
                        this.isLoading = false;
                },
                // @vuese
                // Retrieved image alt text from the database and image table
                // @throws error Network error when accessing the database
                fetchAltText() {
                        const apiBaseUrl = "https://scad.onrender.com";
                        fetch(`${apiBaseUrl}/allimageAltText`)
                                .then((response) => {
                                if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                }
                                return response.json();
                                })
                                .then((data) => {
                                        this.altText = data;
                                })
                                .catch((error) => {
                                        console.error('Error fetching alt text data:', error);
                                });
                },
                // @vuese
                // Retrieve boba tea image descriptions and images
                // @param image image file name from database
                // @return altText string value of alt text for the images on the database
                getAltText(image) {
                        for(let i = 0; i < this.altText.length; i++){
                                if(this.altText[i].image.trim() == image.trim()){
                                        return this.altText[i].alt_text;
                                }
                        }
                        return "";
                },
                // @vuese
                // Enable the calculation of popular drinks on the home page
                togglePopular() {
                        this.currentPopularIndex = 1 - this.currentPopularIndex;
                },
                // @vuese
                // Allow hovering over the popular drinks on the home page
                toggleHover(isHovered) {
                        this.isPopularHovered = isHovered;
                },
                // @vuese
                // Retrieve location of the user accessing the website to enable the weather API of their location
                getLocation() {
                        if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(this.showPosition);
                        } else {
                                alert("Geolocation is not supported by this browser.");
                        }
                },
                // @vuese
                // Retrieve the weather based on the location of the user accessing the website
                showPosition(position) {
                        this.location = [position.coords.latitude, position.coords.longitude];
                        this.fetchWeather();
                },
                // @vuese
                // Retrieve weather data based on the longitude and latitude coordinates
                // @throws error Network error when attempting to access the database
                async fetchWeather(){
                        if(this.location && this.location.length == 2){
                                const apiBaseUrl = "https://scad.onrender.com";
                                const url = `${apiBaseUrl}/weather?lat=${this.location[0]}&long=${this.location[1]}`;
                                fetch(url)
                                        .then((response) => {
                                                if (!response.ok) {
                                                        //alert("begin err");
                                                        throw new Error('Network response was not ok');
                                                }
                                                return response.json();
                                        })
                                        .then((data) => {
                                                //alert("in");
                                                this.weather = data;
                                                //alert("done");
                                                //this.weather.data.values.temperature
                                                //this.weather.data.values.weatherCode
                                                //this.weatherCode["1000"] returns "Clear, Sunny"
                                        })
                                        .catch((error) => {
                                                //alert("end err");
                                                console.error('Error fetching weather data:', error);
                                        });
                        }
                },

                // @vuese
                // Apply the font size designated by the user on the website page
                applyFontSize(fontSize) {
                        document.body.style.fontSize = `${fontSize}px`;
                },
                
        }
    }
    
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
.homeDiv{
        width: 100%;
        height: 100%;
}
@font-face {
  font-family: "Levitation";
  src: url('src/assets/Levitation.ttf');
}

.title {
  font-size: 50px;
  flex: 20%;
}

.slider-images img {
  display: none;
  height: 100%;
  min-width: 800px;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15.2px;
}

.slider-images{
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        height: 100%;
        border-radius: 8px;
}

.slider-images img.active {
  display: block;
}

.slider {
  display: flex; 
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  height: 60vh; 
  align-items: center;
  text-align: center;
  margin-top: 35vh;
  border-radius: 8px;
  background-color: transparent;
}

.titleDiv{
        font-family: 'Concert One', sans-serif;
        font-size: 50px;
        color: var(--title-color);
        margin-top: 75vh;
}

.popular-slider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        width: 100%;
        height: fit-content;
        margin-bottom: 50px;
        margin-top: 5vh;
}
      
      .popular-container {
        display: flex;
        transition: transform 0.5s ease;
        background-color: transparent;
        column-gap: 25px;
        justify-content: space-between;
      }
      
      .popular-item {
        flex: 0 0 26%;
        padding: 10px;
        text-align: center;
        background-color: var(--hover-color);
        border-radius: 8px;
      }
      
      .popularTitle {
        font-family: 'Concert One', sans-serif;
        font-size: 40px;
        margin-bottom: 10px;
      }

      .arrowBtn{
        padding: 20px;
        font-family: 'Concert One', sans-serif;
        font-size: 25px;
        cursor: pointer;
        background-color: transparent;
        outline: none;
        border-style: none;
        color: var(--hover-color);
      }

      .popularImg{
        width: 70%;
        height: 80%;
        border-radius: 8px;
      }

      .menuName{
        font-family: 'Concert One', sans-serif;
        margin-bottom: 10px;
      }

      .flip-container {
        perspective: 1000px;
      }
      
      .flipper {
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }
      
      .flip-container:hover .flipper,
      .flip-container.flip-hover .flipper {
        transform: rotateY(180deg);
      }
      
      .flipper img,
      .flipper .back-content {
        backface-visibility: hidden;
      }
      
      .back-content {
        transform: rotateY(180deg);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--hover-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px;
      }

      .menuDesc{
        font-family: 'Concert One', sans-serif;
      }

      .titleWeatherDiv{
        height: fit-content;
      }

      .weatherDiv{
        margin-top: 0;
        margin-bottom: 0;
        width: 90%;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
      }

      .welcomeTitle{
        color:var(--title-color);
        font-family: levitation;
        font-size: 50px;
        padding-bottom: 0px;
        margin-bottom: 0px;
      }

      .weather{
        font-family: 'Concert One', sans-serif;
        font-size: 22px;
        color: var(--main-font-color);
      }
</style>
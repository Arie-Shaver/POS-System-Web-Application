<template>
  <div>
    <div class="btnDiv">
      <button @click="goBack" class="go-back-button">Back to Drink</button>
    </div>
    <div v-if="isLoading">
      <div class="loadingDiv display"></div>
    </div>


    <div class="colCustom">
      <div class="drink_name">
          <!-- Add a button to link go back -->
          <p class="orderTitle">{{ selectedDrink }}</p>
          <p class="drinkDesc">{{ displayInfo.description }}</p>
      </div>
      <div class="drinkImgDiv">
        <img class="drinkImg" :src="`/assets/${displayInfo.image}`" :alt="getAltText(displayInfo.image)"/>
      </div>
    </div>
    <hr class="w8">

    <div class="customPanel">
      <div class="sizePanel">
        <h2 class="h2">Size</h2>
        <div class="options-container">
          <div
            v-for="size in drinksize"
            :key="size"
            @click="selectDrinkSize(size)"
            :class="{ selected: size === selectedDrinkSize }"
          >
            {{ size }}
          </div>
        </div>
      </div>
      <hr>

      <div>
        <h2 class="h2">Sweetness</h2>
        <div class="options-container">
          <div
            v-for="level in sweetnessLevels"
            :key="level"
            @click="selectSweetnessLevel(level)"
            :class="{ selected: level === selectedSweetness }"
          >
            {{ level }}
          </div>
        </div>
      </div>
      <hr>
      
      <div>
        <h2 class="h2">Ice</h2>
        <div class="options-container">
          <div
            v-for="ice in iceOptions"
            :key="ice"
            @click="selectIceOption(ice)"
            :class="{ selected: ice === selectedIce }"
          >
            {{ ice }}
          </div>
        </div>
      </div>
      <hr>
      
      <h2 class="h2">Toppings</h2>
      <div class="options-container">
        <div
          v-for="topping in toppings"
          :key="topping"
          @click="toggleTopping(topping)"
          :class="{ selected: selectedToppings.includes(topping) }"
        >
          {{ topping }}
        </div>
      </div>
    </div>
  
    <div class="add-to-cart" >  <!-- v-if="selectedToppings.length > 0: add-to-cart only appears when user selected toppings -->
      <button class="addCartBtn" @click="addToCart">Add to Cart</button>
    </div>

    <div class="popup" v-if="showPopup">
      <p>Added to Cart!</p>
    </div>

    <!-- Include the AddToCart component here -->
    <!-- <AddToCart :cartItems="cartItems" /> -->
    
      <div class="view-cart-container">
        <button @click="goToCart" class="view-cart-button">
          View Cart ({{ totalCartItems }})
        </button>
      </div>
  </div>
  </template>
  
  <script>

  import AddToCart from "@/views/customer/AddToCart.vue";
  // @group Customer
  // Website page to custpmize the drink order before adding to cart
  export default {
    // @vuese
    // Variables containing the order cusomization such as sweetness, size, ice levels, toppings and quantity
    data() {
      return {
        drinksize: [],
        selectedDrinkSize: null,
        sweetnessLevels: [],
        selectedSweetness: null,
        iceOptions: [],
        selectedIce: null,
        toppings: [],
        selectedToppings: [],
        selectedDrink: "",
        totalPrice: 0.00,
        showPopup: false, // initially hidden
        quantity: 1,
        displayInfo: null,
        altText: [],
        isLoading: false,
        totalCartItems: 0,
        totalCartItems: 0,
      };
    },

    // @vuese
    // Complete order with drink size, sweetness, ice and topping options
    created() {
        this.selectedDrink = this.$route.params.drinkName;
        this.fetchAddOnData('Size', 'drinksize');
        this.fetchAddOnData('Sweetness', 'sweetnessLevels');
        this.fetchAddOnData('Ice', 'iceOptions');
        this.fetchAddOnData('Toppings', 'toppings');
        this.fetchDisplayData();
        this.fetchAltText();
        this.fetchCartQuantity();
    },

    // @vuese 
    // Font size for the customization page 
    mounted(){
      const selectedFontSize = parseInt(localStorage.getItem('selectedFontSize')) || 24;
      this.applyFontSize(selectedFontSize);
    },
  
    methods: {
      // @vuese
      // Apply the font size selected on the customization page
      applyFontSize(fontSize) {
        document.body.style.fontSize = `${fontSize}px`;
      },

      // @vuese 
      // Retrieve the addon options from the database in the addon sql table
      // @param type represents the type of addon
      // @param dataProperty represents the values of the different addons selected by the user
      // @throws error Network error when attempting to access the database
      async fetchAddOnData(type, dataProperty) {
        this.isLoading = true;
        this.isLoading = true;
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/add-ons?type=${type}`;
        fetch(url)
          .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
            throw new Error("Network response was not ok");
          }
          return response.json();
          })
          .then((data) => {
            this[dataProperty] = data.map(item => item.add_on); // Extract only the "add_on" values in the data property
            this.isLoading = false;
            this[dataProperty] = data.map(item => item.add_on); // Extract only the "add_on" values in the data property
            this.isLoading = false;
          })
          .catch((error) => {
            console.error("Error fetching order_history data:", error);
            console.error("Error fetching order_history data:", error);
          });
      },

      // @vuese
      // Retrieve the number of items in the cart from the database cart sql table
      // @throws error Network error when attempting to access the database
      async fetchCartQuantity() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/cart`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          // Calculate the total quantity from the fetched cart items
          this.totalCartItems = data.reduce((total, item) => total + item.quantity, 0);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      },

      async fetchCartQuantity() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/cart`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          // Calculate the total quantity from the fetched cart items
          this.totalCartItems = data.reduce((total, item) => total + item.quantity, 0);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      },

      // @vuese
      // Route the user when clicking cart button depending on whether they added an email to login
      goToCart() {
        const email = localStorage.getItem('customerEmail');  
        if (email) {
          // If the customer is logged in, navigate to the selected drink's page with both the category name and drink name as parameters
          this.$router.push('/kungfuteacustomer/cart');
        } else {
          // If the customer is not logged in, navigate to the same route under /kungfutea
          this.$router.push('/kungfutea/cart');
        }
      },

      // @vuese
      // Go to the previous window when back button is clicked
      goBack() {
        // Use window.history.back() to go back to the previous page
        window.history.back();
      },

      // @vuese
      // Capture the selected drink size based on user input 
      // @param size User selects either medium or large drink size when customizing their order
      selectDrinkSize(size) {
        this.selectedDrinkSize = size;
      },

      // @vuese
      // Cature the selected sweetness level based on the user input
      // @param level User selects the sweetness percentage when customizing their order
      selectSweetnessLevel(level) {
        this.selectedSweetness = level;
      },

      // @vuese
      // Caputre the selected ice option based on user input
      // @param ice User selects ice quantity when customizing their order
      selectIceOption(ice) {
        this.selectedIce = ice;
      },

      // @vuese
      // Capture the selected toppings based on user input
      // @param topping User selects from a wide range of toppings stored in the addon sql table
      toggleTopping(topping) {
        if (this.selectedToppings.includes(topping)) {
          this.selectedToppings = this.selectedToppings.filter((t) => t !== topping);
        } else {
          this.selectedToppings.push(topping);
        }
      },

      // @vuese
      // Retrieve the drink price of the tea type selected by the user from the database menu table
      // @param type Specific drink type selected by the user
      // @throws error Network error when attempting to access the database
      async fetchDrinkPrice(type) {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/drinkPrice?type=${type}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            this.totalPrice += data[0].price;
        } catch (error) {
            console.error("Error fetching drink price data:", error);
        }
      },

      // vuese
      // Retrieve the addons and the addon price selected by the user from the database addon sql table
      // @param type Specific drink type selected by the user
      // @param dataProperty data retrieved from the database with all of the addons
      // @throws error Network error when attempting to access the database
      async fetchAddonPrice(type, dataProperty) {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/addonPrice?type=${type}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            this.totalPrice += data[0].price;
        } catch (error) {
            console.error("Error fetching add-on price data:", error);
        }
      },

      // @vuese
      // Add all of the addons to the cart based on the user inputs
      // @throws error Network error when attempting to access the database
      async addToCart() {
        try {
          await this.fetchAddonPrice(this.selectedDrinkSize);

          // Use Promise.all to wait for all topping prices to be fetched
          await Promise.all(
              this.selectedToppings.map(async (topping) => {
                  await this.fetchAddonPrice(topping);
              })
          );

          await this.fetchDrinkPrice(this.selectedDrink);
          
          await this.fetchDisplayData();
          
          await this.fetchDisplayData();

          const toppingsArray = Array.from(this.selectedToppings);
          const selectedItems = {
              drink_name: this.selectedDrink,
              drink_size: this.selectedDrinkSize,
              sweetness: this.selectedSweetness,
              ice: this.selectedIce,
              toppings: `${toppingsArray.join(', ')}`,
              quantity: this.quantity,
              price: this.totalPrice.toFixed(2),
              image: this.displayInfo.image,
              image: this.displayInfo.image,
          };

          const apiBaseUrl = "https://scad.onrender.com";
          const url = `${apiBaseUrl}/cart`;

          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(selectedItems),
          });

          if (!response.ok) {
              throw new Error("Failed to add order to the database");
          }

          const data = await response.json();

          // Order successfully added to the database
          console.log("Added to cart:", data);

          // Show the message of the order has been added to the cart
          this.showPopup = true;

          // Reset the pop-up message after a delay
          setTimeout(() => {
              this.showPopup = false;
          }, 5000); // Hide after 5 seconds

          // Clear the selected options
          this.selectedDrinkSize = null;
          this.selectedSweetness = null;
          this.selectedIce = null;
          this.selectedToppings = [];
          this.totalPrice = 0;
          
          this.fetchCartQuantity();
          this.totalPrice = 0;
          
          this.fetchCartQuantity();
        } catch (error) {
          console.error("Error adding order to the database:", error);
        }
      },

      // @vuese
      // Display the customizations selected by the user from the customization page
      // @throws error Network error when attempting to access the database
      fetchDisplayData(){
        //this.isLoading = true;
        //this.isLoading = true;
        // /orderHistory/prices?startDate=2023-01-01&endDate=2023-12-31.
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/menu/displayItem?tea_type=${this.selectedDrink}`;
        fetch(url).then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
          throw new Error("Network response was not ok");
        }
        return response.json();
        })
        .then(data => {
          this.displayInfo = data[0];
          //this.isLoading = false;
          this.displayInfo = data[0];
          //this.isLoading = false;
        })
        .catch(error => {
          console.error("Error fetching drink data:", error);
          console.error("Error fetching drink data:", error);
        });
      },

      // @vuese
      // Retrieve the image alt text from the images in the sql images table in the database
      // @throws error Network error when attempting to access the database
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
            console.error('Error fetching alt text:', error);
            console.error('Error fetching alt text:', error);
          });
      },

      // @vuese
      // Get the alt text retrieved from the database for the images in the website
      // @param image Specific image selected by the customer 
       // @return altText string of the alttext/description of the image of the boba tea drink
      getAltText(image) {
        const altTextEntry = this.altText.find(entry => entry.image.trim() === image.trim());
        return altTextEntry ? altTextEntry.alt_text : '';
      },
    },
    components: {
      AddToCart,
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
  .go-back-button {
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: var(--bg-color);
    border-radius: 8px;
    border-color: var(--main-font-color);
    color: var(--main-font-color);
  }
  
  .go-back-button:hover{
    background-color: var(--main-font-color);
    color: var(--bg-color);
  }
  .options-container {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    margin-bottom: 50px;
    align-items: center;
  }

  .h2{
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
    font-family: 'Concert One', sans-serif;
    color: var(--title-color);
  }

  .selected {
    background-color: var(--selected-color);
    color: var(--bg-color);
    border: 10px solid var(--selected-color);
    border-radius: 8px;
    cursor: pointer;
  }
  .selected:active {
    background-color: var(--selected-color);
    color: var(--bg-color);
  }

  .add-to-cart {
    margin-top: 30px;
    margin-bottom: 100px;
  }

  .addCartBtn {
    font-size: 28px;
    padding: 10px 55px;
  }

  .popup {
    font-family: 'Concert One', sans-serif;
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 20px;
    background-color: var(--hover-color);
    color: var(--bg-color);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    font-family: 'Concert One', sans-serif;
  }

  .view-cart-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: 100%;
  }
  
  .view-cart-button {
    font-family: 'Concert One', sans-serif;
    font-family: 'Concert One', sans-serif;
    display: inline-block;
    padding: 15px 70px;
    background-color: var(--main-font-color);
    color: var(--selected-color);
    border-radius: 10px;
    text-decoration: none;
    font-size: 180%;
    font-size: 180%;
  }
  
  .view-cart-button:hover {
    background-color: var(--bg-color); /* Darken the color on hover */
  }

  .btnDiv{
    text-align: left;
    margin-top: 25px;
    margin-left: 25px;
  }

  .colCustom{
    display: flex;
    column-gap: 50px;
  }

  .drink_name{
    flex: 50%;
    text-align: right;
  }

  .drinkImgDiv{
    flex: 50%;
    text-align: left;
  }

  .drinkImg{
    width: 40%;
    border-radius: 15.2px;
  }

  .drinkDesc{
    font-family: 'Concert One', sans-serif;

    width: 50%;
    float: right;
    color: var(--main-font-color);
  }

  .customPanel{
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Concert One', sans-serif;
    color: var(--main-font-color);
  }

  .w8{
    width: 70%;
    margin-top: 20px;
  }

  .orderTitle{
    font-family: levitation;
    font-size: 45px;
    color: var(--title-color);
  }

  .addCartBtn{
    background-color: var(--bg-color);
    border-color: var(--main-font-color);
    color: var(--main-font-color);
  }

  .addCartBtn:hover{
    background-color: var(--hover-color);
    color: var(--bg-color);
  }

  </style>
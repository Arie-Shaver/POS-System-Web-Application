<template>
  <div>
    <p class="orderTitle">{{ selectedCategory }}</p>
    <div class="btnDiv">
      <button @click="goBack" class="go-back-button">Back to Category</button>
    </div>
    <div v-if="isLoading">
      <div class="loadingDiv display"></div>
    </div>
    <div class="drink-list">
      <div v-for="drink in drinks" :key="drink.id" class="drink-item" @click="selectDrink(drink)">
        <p class="drinkName">{{ drink.tea_type }}</p>
        <p class="drinkPrice">${{ drink.price }}</p>
        <div class="flipBtnDiv">
          <button class="flipBtn" @click="flipCard(drink, $event)">more</button>
        </div>
      </div>
    </div>
    <div v-if="isOpen" class="orderModal">
      <div class="orderModal-content">
        <p class="orderDrinkName">{{ flippedDrink.tea_type }} <span class="red">${{ currPrice }}</span></p>
        <img class="modalImg" :src="`/assets/${flippedDrink.image}`" :alt="getAltText(flippedDrink.image)"/>
        <p class="orderDrinkDesc">{{ flippedDrink.description }}</p>
        <div class="modalBtnDiv">
          <button class="go-back-button" @click="closeModal">Close</button>
          <button class="go-back-button" @click="selectDrink(flippedDrink)">add +</button>
        </div>
      </div>
    </div>
  </div>
  <div class="view-cart-container">
    <button @click="goToCart" class="view-cart-button">
      View Cart ({{ totalCartItems }})
    </button>
  </div>
  <div class="view-cart-container">
    <button @click="goToCart" class="view-cart-button">
      View Cart ({{ totalCartItems }})
    </button>
  </div>
</template>

<script>

// @group Customer
// Category Page with all of the drink categories and routing to the specific drinks part of the category
export default {
  // @vuese
  // Holds the variables of the menu drink items
  data() {
    return {
      selectedCategory: null,
      drinks: [],
      menu: [],
      flippedDrink: null,
      isOpen:false,
      currPrice: 0.0,
      altText: [],
      isLoading: false,
      currDrink: null,
      totalCartItems: 0,
    };
  },

  // @vuese
  // Routes the next page depending on the drink category selected by the customer
  created() {
    this.selectedCategory = this.$route.params.categoryName;
    this.fetchDrinkData();
    this.fetchMenu();
    this.fetchAltText();
  },

  // @vuese
  // Set the font size of the page
  mounted(){
    const selectedFontSize = parseInt(localStorage.getItem('selectedFontSize')) || 24;
    this.applyFontSize(selectedFontSize);
  },
  methods: {
    // @vuese
    // @param fontSize Numerical value representing the font of the drink categories on the page
    applyFontSize(fontSize) {
      document.body.style.fontSize = `${fontSize}px`;
    },

    // @vuese
    // Retrieve data from the database, retrieves drinks part of the category selected
    // @throws error Network error when attempting to access the database
    fetchDrinkData() {
      this.isLoading = true;
      // Fetch drinks for the selected category based on this.selectedCategory
      const apiBaseUrl = "https://scad.onrender.com"; 
      const url = `${apiBaseUrl}/drinks?type=${this.selectedCategory}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          this.drinks = data; // Ensure that your API response includes both tea_type and price
          this.isLoading = false;
        })
        .catch((error) => {
          console.error("Error fetching drink data:", error);
        });
    },

    // @vuese
    // Sets to the page before the category page on the website
    goBack() {
      // Use window.history.back() to go back to the previous page
      window.history.back();
    },

    // @vuese
    // Apply navigation and route the user to the correct drink page when the category is selected
    // @param drink represents the specific boba tea drink from the menu
    selectDrink(drink) {
      // Check if the customer is logged in by verifying the presence of the email in local storage
      const email = localStorage.getItem('customerEmail');

      if (email) {
        // If the customer is logged in, navigate to the selected drink's page with both the category name and drink name as parameters
        this.$router.push(`/kungfuteacustomer/categorypage/${this.selectedCategory}/${drink.tea_type}`);
      } else {
        // If the customer is not logged in, navigate to the same route under /kungfutea
        this.$router.push(`/kungfutea/categorypage/${this.selectedCategory}/${drink.tea_type}`);
      }
    },

    // @vuese
    // Provides specific details for each drink when clicked on
    // @param drink specific boba team item on the drink 
    // @param event triggered event when the dirnk card is clicked
    flipCard(drink, event) {
      this.currDrink = drink;
      // Stop the event propagation to prevent the outer div's click event from being triggered
      event.stopPropagation();

      for(let i = 0; i < this.menu.length; i++){
        if(this.menu[i].tea_type == drink.tea_type){
          this.flippedDrink = this.menu[i];
          this.currPrice = drink.price;
        }
      }
      this.isOpen = true;
    },

    // @vuese
    // Retrieves all menu drink boba tea items from the menu sql table on the database
    // @throws error Network error when attempting to access the database
    fetchMenu() {
      const apiBaseUrl = "https://scad.onrender.com";
      fetch(`${apiBaseUrl}/menu/display`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          this.menu = data;
        })
        .catch((error) => {
          console.error('Error fetching menu data:', error);
        });
    },

    // @vuese
    // Closes the ability to view menu item details
    closeModal() {
      this.isOpen = false;
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
          console.error('Error fetching menu data:', error);
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

    // @vuese
    // Retrieve the quantity of items in the cart when the customer placed the order
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

    // @vuese
    // Access cart depending on if the customer inputted an email
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
.drink-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 25px;
}
.drink-item {
  margin: 10px;
  border: 2px solid var(--main-font-color);
  padding: 30px;
  text-align: center;
  max-width: 300px;
  background-color: var(--main-font-color);
  cursor: pointer;
  border-radius: 15.2px;
  color: var(--bg-color);
}
.drink-item:hover {
  background-color: var(--hover-color); 
}

  .btnDiv{
    width: 100%;
    text-align: left;
    margin-left: 50px;
  }

  .drinkName, .drinkPrice{
    font-family: 'Concert One', sans-serif;
  }

  .flipBtnDiv{
    align-items: right;
    text-align: right;
  }

.flipBtn{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: transparent;
  border-style: 1px;
  border-radius: 8px;
  border-color: var(--bg-color);
  width: fit-content;
  height: fit-content;
  color: var(--sub-font-color);
}

.flipBtn:hover{
  background-color: var(--bg-color);
  color: var(--hover-color);
}

  .modalImg{
    width: 50%;
    border-radius: 15.2px;
  }

.drinkDesc{
  font-size: 20px;
}

.loadingDiv {
  width: 2rem;
  height: 2rem;
  border: 5px solid black;
  border-top: 6px solid var(--selected-color);
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

.orderTitle{
  font-family: levitation;
  font-size: 45px;
  color: var(--title-color);
}

.orderModal {
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

.orderModal-content {
  background-color: var(--bg-color);
  padding: 20px;
  border: 1px solid var(--main-font-color);
  border-radius: 5px;
  display: flex; /* Change display to flex */
  flex-direction: column; /* Stack components on top of each other */
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  align-items: center;
}

.orderDrinkName{
  font-size: 30px;
  color: var(--main-font-color);
}

.orderDrinkDesc{
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: justify;
  font-family: 'Concert One', sans-serif;
  color: var(--main-font-color);
}

.red{
  color: var(--selected-color);
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
  display: inline-block;
  padding: 15px 70px;
  background-color: var(--main-font-color);
  color: var(--selected-color);
  border-radius: 10px;
  text-decoration: none;
  font-size: 180%;
}

.view-cart-button:hover {
  background-color: var(--bg-color); /* Darken the color on hover */
}

</style>
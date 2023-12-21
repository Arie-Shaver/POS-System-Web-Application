<template>

  <div>
    <p class="orderTitle">Order Now!</p>
  </div>
  <div v-if="isLoading">
    <div class="loadingDiv display"></div>
  </div>

  <div>
    <div class="category-list">
      <div v-for="category in categories" :key="category" class="category-item" @click="selectCategory(category)">
          <p class="categoryText"> {{ category }}</p>
      </div>
    </div>
  </div>

  <div class="view-cart-container">
    <button @click="goToCart" class="view-cart-button">
      View Cart ({{ totalCartItems }})
    </button>
  </div>
</template>


<script>
//@group Customer
//Displays the order page and allows the customer to select a category or view the cart,
export default {
  data() {
    return {
      categories: [], // store unique categories
      isLoading: false,
      totalCartItems: 0,
    };
  },
  created() {
    this.fetchCategoryData();
    this.fetchCartQuantity();
  },
  mounted(){
    const selectedFontSize = parseInt(localStorage.getItem('selectedFontSize')) || 24;
    this.applyFontSize(selectedFontSize);
  },

  methods: {
    //@vuese
    //Changes the font size of the orderpage
    applyFontSize(fontSize) {
      document.body.style.fontSize = `${fontSize}px`;
    },
    //@vuese
    //Makes an API request to get menu categories from the database and puts them in a set
    fetchCategoryData() {
      this.isLoading = true;
      const apiBaseUrl = "https://scad.onrender.com";
      const url = `${apiBaseUrl}/categories`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Extract unique category names and update this.categories
          const uniqueCategories = [...new Set(data.map((item) => item.category))];
          this.categories = uniqueCategories;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error("Error fetching categories data:", error);
        });
    },
    //@vuese
    //Navigates user to the category page they selected
    selectCategory(categoryName) {
      // navigate to the selected category page
      // Check if the customer is logged in by verifying the presence of the email in local storage
      const email = localStorage.getItem('customerEmail');  
      if (email) {
        // If the customer is logged in, navigate to the selected drink's page with both the category name and drink name as parameters
        this.$router.push(`/kungfuteacustomer/categorypage/${categoryName}`);
      } else {
        // If the customer is not logged in, navigate to the same route under /kungfutea
        this.$router.push(`/kungfutea/categorypage/${categoryName}`);
      }
    },
    //@vuese
    //Calculates cart quantity from cart database
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
    //@vuese
    //Navigates users to the customer cart page where they can view their order
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
.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.category-item {
  margin: 10px;
  border: 2px solid var(--main-font-color);
  padding: 90px; /* Increase size of containers */
  text-align: center;
  max-width: 300px; 
  background-color: var(--selected-color); 
  cursor: pointer; 
  border-radius: 15.2px;
}

.category-item:hover {
  background-color: var(--navbar-color);
  color: var(--title-color); 
}

.categoryText{
  font-family: 'Concert One', sans-serif;
}

.orderTitle{
  font-family: levitation;
  font-size: 45px;
  color: var(--title-color);
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


<template>
  <div>
    <p class="menuTitle">Menu</p>
    <div v-if="isLoading">
      <div class="loadingDiv display"></div>
    </div>
    <div class="menu-grid">
      <div v-for="(category, index) in uniqueCategories" :key="category" :class="'menu-category category-' + index">
        <h2 class="catText">{{ category }}</h2>
        <div class="menu-items">
          <div v-for="drink in menuByCategory(category)" :key="drink.id" class="menu-item">
            <div class="drink-info">
              <p class="tea-type">{{ drink.tea_type }}</p>
              <p class="price">${{ formatPrice(drink.price) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @group Menu
// Displays a menu, fetching menu data from an API, categorizing and rendering it in a responsive grid layout.
export default {
  data() {
    return {
      uniqueCategories: [],
      menu: [],
      isLoading: false,
    };
  },
  created() {
    this.fetchMenuData();
  },
  mounted(){
    const selectedFontSize = parseInt(localStorage.getItem('selectedFontSize')) || 24;
    this.applyFontSize(selectedFontSize);
  },
  methods: {
    // @vuese
    // apply font size based on user's selection from settings
    // @arg font size
    applyFontSize(fontSize) {
      document.body.style.fontSize = `${fontSize}px`;
    },
    // @vuese
    // fetch menu data from database
    fetchMenuData() {
      this.isLoading = true;
      const apiBaseUrl = 'https://scad.onrender.com';
      fetch(`${apiBaseUrl}/menu`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          this.menu = data;
          this.extractUniqueCategories();
        })
        .catch((error) => {
          console.error('Error fetching menu data:', error);
        });
    },
    // @vuese
    // Extracts menu items by categories
    extractUniqueCategories() {
      this.uniqueCategories = [...new Set(this.menu.map((item) => item.category))];
      this.isLoading = false;
    },
    // @vuese
    // Display menu by categories
    // @arg item's category
    menuByCategory(category) {
      return this.menu.filter((item) => item.category === category);
    },
    // @vuese
    // Display each item's price
    // @arg price
    formatPrice(price) {
      // Format price to two decimal places
      return price.toFixed(2);
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
.menu-grid {
  column-count: 3; /* Display items in three columns */
  column-gap: 35px; /* Add gap between columns */
  padding-left: 35px;
  padding-right: 35px;
}

.menu-category {
  margin: 0 0 35px 0; /* Add spacing between categories */
  break-inside: avoid-column; /* Prevent categories from breaking across columns */
  padding: 5px; /* Add padding to separate categories */
  background-color: var(--selected-color);
  border-style: solid;
  border-radius: 15.2px;
  border-width: 2px;
  border-color: var(--main-font-color);
  color: var(--main-font-color);
  font-family: 'Concert One', sans-serif;
}

.menu-items {
  display: block;
}

.menu-item {
  display: inline-block;
  width: 100%; /* Each item takes the full width of its column */
  line-height: 70%;
}

.drink-info {
  padding-left: 10px;
  max-width: 95%;
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis (...) when content overflows */
}

.tea-type {
  font-family: 'Concert One', sans-serif;
  float: left;
  color: var(--sub-font-color);
}

.price {
  font-family: 'Concert One', sans-serif;
  float: right;
  color: var(--sub-font-color);
}

.menuTitle{
  font-family: levitation;
  font-size: 45px;
  color: var(--title-color);
}

.catText{
  color: var(--bg-color);
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
</style>
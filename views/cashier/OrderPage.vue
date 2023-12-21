<template>
  <div id="outerDiv">
    <div class="column" style="width: 75%;">
      <!-- Content for the 75% width column -->
      <div id="navTabs">
        <nav class="navbar">
          <ul class="navbar-nav">
            <li v-for="category in categories" :key="category" class="nav-item">
              <a
                href="#"
                class="nav-link"
                :class="{ 'active-tab': selectedTab === category }"
                @click="selectedTab = category"
              >
                {{ category }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div v-if="isLoading">
          <div class="loadingDiv display"></div>
        </div>
        <div class="tabContents" v-for="(category, index) in categories" :key="index">
          <div v-if="selectedTab === category" class="innerTabDiv">
            <div v-for="item in menu[index]" :key="category" class="menuItemDiv" @click="openModal(item)">
              {{ item.tea_type }}
            </div>
          </div>
        </div>
        <div class="customizerModal" v-if="isModalOpen">
          <div class="customizerContent">
            <span class="close" @click="closeModal">&times;</span>
            <p class="modalTitle">{{ selectedMenuItem.tea_type }}</p>
            <p class="optionTitle">Size: </p>
            <div class="optionDiv">
              <button
                class="sizeOption"
                v-for="item in sizes"
                :class="getSizeClass(item)"
                @click="selectSize(item)"
              >
                {{ item.add_on }}
              </button>
            </div>
            <p class="optionTitle">Ice: </p>
            <div class="optionDiv">
              <button
                class="iceOption"
                v-for="item in ice"
                :class="getIceClass(item)"
                @click="selectIce(item)"
              >
                {{ item.add_on }}
              </button>
            </div>
            <p class="optionTitle">Sweetness: </p>
            <div class="optionDiv">
              <button
                class="sweetOption"
                v-for="item in sweetness"
                :class="getSweetClass(item)"
                @click="selectSweet(item)"
              >
                {{ item.add_on }}
              </button>
            </div>
            <p class="optionTitle">Toppings: </p>
            <div class="optionDiv">
              <button class="toppingOption" v-for="item in toppings" :class="getToppingClass(item)"
              @click="selectTopping(item)">{{ item.add_on }}</button>
            </div>
            <div class="addCartDiv">
              <button class="addCartBtn" @click="addToCart">Add To Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column" style="width: 25%;">
      <!-- Content for the 25% width column -->
      <div class="promptDiv" v-if="checkoutClicked">
        <div class="promptDivContent">
          <p class="summaryTitle">Order Summary</p>
          <div v-for="(item, index) in cartItems">
            <p class="summaryItems">{{(index + 1)}}.&#x29; {{item}}</p>
          </div>
          <p class="summaryTotal">TOTAL: ${{cartTotal}}</p>
          <div class="checkoutBtnDiv">
            <button class="addCartBtn" @click="checkout()">confirm</button>
            <button class="addCartBtn" @click="closeCheckout()">×</button>
          </div>
        </div>
      </div>
      <div class="ordersDiv">
        <div class="flexOrderDiv" v-for="order in cart">
          <div class="infoDiv" style="width: 75%;">
          <p class="orderTitle">{{order.item}}</p>
          <p class="orderSize">size: {{order.size}}</p>
          <p class="orderIce">ice: {{order.ice}}</p>
          <p class="orderSweet">{{order.sweetness}}</p>
          <p class="orderAddOn" v-for="top in order.toppings">+{{top}}</p>
          </div>
          <div class="priceDiv" style="width: 25%;">
            <button class="closeBtn" @click="removeFromCart(order)">&times;</button>
            <p>{{order.total}}</p>
            <div class="orderQuantityDiv">
              <button @click="decreaseOrder(order)" class="quantityBtn">-</button>
                <span>{{order.quantity}}</span>
              <button @click="increaseOrder(order)" class="quantityBtn">+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="panelDiv">
        <div class="discountPanel">
          <p class="panelTitle">Discount: </p>
          <div class="discountBtnDiv">
            <button class="discountBtn" :class="{ 'selected': selectedDiscount === 0 }" @click="setDiscount(0)">0%</button>
            <button class="discountBtn" :class="{ 'selected': selectedDiscount === 10 }" @click="setDiscount(10)">10%</button>
            <button class="discountBtn" :class="{ 'selected': selectedDiscount === 15 }" @click="setDiscount(15)">15%</button>
            <button class="discountBtn" :class="{ 'selected': selectedDiscount === 20 }" @click="setDiscount(20)">20%</button>
          </div>
        </div>
        <div class="pricePanel">
          <p class="priceTitle">
            Subtotal:
          </p>
          <p class="priceTag">${{cartSubtotal}}</p>
        </div>
        <div class="pricePanel">
          <p class="priceTitle">
            Discount:
          </p>
          <p class="priceTag">${{calcCartDiscount}}</p>
        </div>
        <div class="pricePanel">
          <p class="priceTitle">
            Tax:
          </p>
          <p class="priceTag">${{cartTax}}</p>
        </div>
        <div class="totalPricePanel">
          <p class="totalPriceTitle">
            Total:
          </p>
          <p class="totalPriceTag">${{cartTotal}}</p>
        </div>
        <div class="checkoutBtnPanel">
          <button class="checkoutBtn" @click="openCheckout()">checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  // @group Cashier
  // Displays a Point of Sale (POS) system for cashier's view
  export default {
    data() {
      return {
        categories: [], // store unique categories
        selectedTab: "Classic",
        menu: [],
        showItemCustomizer: false,
        isModalOpen: false,
        selectedMenuItem: null,
        sizes: [],
        sweetness: [],
        ice: [],
        toppings: [],
        selectedSize: null,
        selectedIce: null,
        selectedSweet: null,
        selectedToppings: [],
        cart: [],
        selectedDiscount: 0,
        taxRate: 0.0625,
        isLoading: false,
        orderCounter: 1,
        formattedOrders: '',
        ingredients: [],
        checkoutClicked: false,
      };
    },
    created() {
      this.fetchCategoryData();
    },
    computed: {
      // @vuese
      // Calculate subtotal of items in cart
      cartSubtotal() {
        let total = 0.0;
        for (let i = 0; i < this.cart.length; i++) {
          for(let j = 0; j < this.cart[i].quantity; j++){
            total += this.cart[i].total;
          }
        }
        let strTotal = total.toFixed(2);
        return strTotal;
      },
      // @vuese
      // Calculate discount of total amount
      calcCartDiscount() {
        let factor = 0.01 * this.selectedDiscount;
        let dis = parseFloat(this.cartSubtotal)*factor;
        let strDis = dis.toFixed(2);
        return strDis;
      },
      // @vuese
      // Calculate amount of tax in cart
      cartTax(){
        let t = parseFloat(this.cartSubtotal) * this.taxRate;
        let strTax = t.toFixed(2);
        return strTax;
      },
      // @vuese
      // Calculate total amount of items in cart
      cartTotal(){
        let total = parseFloat(this.cartSubtotal) + parseFloat(this.cartTax) - parseFloat(this.calcCartDiscount);
        let strTotal = total.toFixed(2);
        return strTotal;
      },
      // @vuese
      // Format order detail of items in cart
      cartItems(){
        let items = [];
        for(let i = 0; i < this.cart.length; i++){
          let itemStr = this.cart[i].item;
          for(let j = 0; j < this.cart[i].toppings.length; j++){
            if(j == 0){
              itemStr += " w/";
            }
            itemStr += this.cart[i].toppings[j];
            if(j != this.cart[i].toppings.length - 1){
              itemStr += " & ";
            }
          }
          items.push(itemStr);
        }
        return items;
      }
    },
    methods: {
      // @vuese
      // Fetch item's category data from database
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
            this.fetchMenuData();
          })
          .catch((error) => {
            console.error("Error fetching categories data:", error);
          });
      },
      // @vuese
      // Fetch menu data from database
      fetchMenuData() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/teascategoriesprices`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Extract unique category names and update this.categories
            this.menu = data;
            this.aggregate();
            this.fetchSizeData();
            this.fetchIceData();
            this.fetchSweetnessData();
            this.fetchToppingsData();
          })
          .catch((error) => {
            console.error("Error fetching categories data:", error);
          });
      },
      //add-ons?type=Size
      // @vuese
      // Fetch drink's size data from database
      fetchSizeData() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/add-ons-prices?type=Size`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Extract unique category names and update this.categories
            this.sizes = data.map((item, index) => ({ ...item,
              selected: index === 0, // Select the first size by default
            }));
            this.selectedSize = this.sizes[0];
          })
            .catch((error) => {
              console.error("Error fetching categories data:", error);
            });
      },
      // @vuese
      // Fetch types of ice data from database
      fetchIceData() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/add-ons-prices?type=Ice`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Extract unique category names and update this.categories
            this.ice = data.map((item, index) => ({ ...item,
              selected: index === 0, // Select the first size by default
            }));
            this.selectedIce = this.ice[0];
          })
          .catch((error) => {
            console.error("Error fetching categories data:", error);
          });
      },
      // @vuese
      // Fetch types of sweetness data from database
      fetchSweetnessData() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/add-ons-prices?type=Sweetness`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Extract unique category names and update this.categories
            this.sweetness = data.map((item, index) => ({ ...item,
              selected: index === 0, // Select the first size by default
            }));
            this.selectedSweet = this.sweetness[0];
          })
          .catch((error) => {
            console.error("Error fetching categories data:", error);
          });
      },
      // @vuese
      // Fetch types of topping data from database
      fetchToppingsData() {
        const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/add-ons-prices?type=Toppings`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Extract unique category names and update this.categories
            this.toppings = data.map(item => ({ ...item, selected: false }));
            
          })
          .catch((error) => {
            console.error("Error fetching categories data:", error);
          })
          .finally(() => {
            this.isLoading = false;
          } 
          );
      },
      // @vuese
      // Organize the menu data by grouping items based on categories.
      aggregate(){
        let splitMenu = [];
        for(let i = 0; i < this.categories.length; i++){
          splitMenu.push([]);
        }

        for(let i = 0; i < this.menu.length; i++){
          if(this.categories.includes(this.menu[i].category)){
            let index = this.categories.indexOf(this.menu[i].category);
            splitMenu[index].push(this.menu[i]);
          }else{
            splitMenu[splitMenu.length].push(this.menu[i]);
          }
        }
        this.menu = splitMenu;
      },
      // @vuese
      // Open a pop-up window that allows the user to customize options
      // @arg selected item
      openModal(item) {
        this.selectedMenuItem = item;
        this.isModalOpen = true;
      },
      // @vuese
      // Close a pop-up window that allows the user to customize options
      closeModal() {
        this.selectedMenuItem = null;
        this.isModalOpen = false;
      },
      // @vuese
      // Select drink's size based on user's selection
      // @arg selected drink's size
      selectSize(size) {
        // Unselect the previously selected size
        if (this.selectedSize) {
          this.selectedSize.selected = false;
        }

        // Select the clicked size
        size.selected = true;
        this.selectedSize = size;
      },
      // @vuese
      // Select an ice option based on user's selection
      // @arg selected an ice option
      selectIce(ice) {
        // Unselect the previously selected ice
        if (this.selectedIce) {
          this.selectedIce.selected = false;
        }

        // Select the clicked ice
        ice.selected = true;
        this.selectedIce = ice;
      },
      // @vuese
      // Select drink's sweetness level based on user's selection
      // @arg selected a sweetness level option
      selectSweet(sweet) {
        // Unselect the previously selected sweetness
        if (this.selectedSweet) {
          this.selectedSweet.selected = false;
        }

        // Select the clicked sweetness
        sweet.selected = true;
        this.selectedSweet = sweet;
      },
      // @vuese
      // Select drink's toppings based on user's selection
      // @arg selected topping options
      selectTopping(topping) {
        // Toggle the selected state of the clicked topping
        topping.selected = !topping.selected;

        // If the topping is selected, add it to the array; otherwise, remove it
        if (topping.selected) {
          this.selectedToppings.push(topping);
        } else {
          const index = this.selectedToppings.findIndex((t) => t === topping);
          if (index !== -1) {
            this.selectedToppings.splice(index, 1);
          }
        }
      },
      // @vuese
      // reset user's selection for customization
      resetSelectedOptions() {
        this.selectedSize = this.sizes[0];
        this.selectedIce = this.ice[0];
        this.selectedSweet = this.sweetness[0];
        this.selectedToppings = [];
      },
      // @vuese
      // Determine if orders are identical in terms of item, size, ice, sweetness, and toppings.
      // @arg order1 and order2
      orderEquals(order1, order2){
        let itemsSame = order1.item == order2.item;
        let sizeSame = order1.size == order2.size;
        let iceSame = order1.ice == order2.ice;
        let sweetSame = order1.sweetness == order2.sweetness;
        let toppingsSame = true;
        for(let i = 0; i < order1.toppings.length; i++){
          if(!order2.toppings.includes(order1.toppings[i])){
            toppingsSame = false;
            break;
          }
        }
        if(order1.toppings.length != order2.toppings.length){
          toppingsSame = false;
        }

        return itemsSame && sizeSame && iceSame && sweetSame && toppingsSame;
      },
      // @vuese
      // Check if a given order already exists in the shopping cart
      // @arg order
      checkOrder(order){ 
        for(let i = 0; i < this.cart.length; i++){
          if(this.orderEquals(order, this.cart[i])){
            return true;
          }
        }
        return false;
      },
      // @vuese
      // Searches for the index of a specific order within the cart.
      // @arg order
      findOrder(order){
        for(let i = 0; i < this.cart.length; i++){
          if(this.orderEquals(order, this.cart[i])){
            return i;
          }
        }
        return -1;
      },
      // @vuese
      // Add an order into the cart
      addToCart() {
        if (!this.selectedMenuItem) {
          console.error("No menu item selected");
          return;
        }

        // Create an order object with selected options
        let totalPrice = parseFloat(this.selectedMenuItem.price) + parseFloat(this.selectedSize.price) + parseFloat(this.selectedIce.price) + parseFloat(this.selectedSweet.price);
        for(let i = 0; i < this.selectedToppings.length; i++){
          totalPrice += parseFloat(this.selectedToppings[i].price);
        }

        const order = {
          item: this.selectedMenuItem.tea_type,
          size: this.selectedSize.add_on,
          ice: this.selectedIce.add_on,
          sweetness: this.selectedSweet.add_on,
          toppings: this.selectedToppings.map(topping => topping.add_on),
          total: totalPrice,
          quantity: 1,
        };

        if(this.checkOrder(order)){
          let index = this.findOrder(order);
          this.cart[index].quantity += order.quantity;
        }else{
          this.cart.push(order);
        }

        this.closeModal();

        this.resetSelectedOptions();
      },
      // @vuese
      // Remove order from cart
      // @arg order
      removeFromCart(order){
        let index = this.cart.indexOf(order);
        this.cart.splice(index, 1);
      },
      // @vuese
      // Get drink's size
      // @arg item
      getSizeClass(item) {
        return {
          'sizeOption': true,
          'selected': item === this.selectedSize
        };
      },
      // @vuese
      // Get drink's ice option
      // @arg item
      getIceClass(item) {
        return {
          'iceOption': true,
          'selected': item === this.selectedIce
        };
      },
      // @vuese
      // Get drink's sweetness level option
      // @arg item
      getSweetClass(item) {
        return {
          'sweetOption': true,
          'selected': item === this.selectedSweet
        };
      },
      // @vuese
      // Get drink's toppings
      // @arg item
      getToppingClass(item) {
        return {
          'toppingOption': true,
          'selected': this.selectedToppings.includes(item)
        };
      },
      // @vuese
      // Set discount options
      // @arg discount percentage
      setDiscount(percent){
        this.selectedDiscount = percent;
      },
      // @vuese
      // Increase quantity of order by 1
      // @arg order
      increaseOrder(order){
        order.quantity++;
      },
      // @vuese
      // Decrease quantity of order by 1
      // @arg order
      decreaseOrder(order){
        order.quantity--;
      },
      // @vuese
      // Open display of the checkout panel in the user interface
      openCheckout(){
        this.checkoutClicked = true;
      },
      // @vuese
      // Close display of the checkout panel in the user interface
      closeCheckout(){
        this.checkoutClicked = false;
      },
      // @vuese
      // Update inventory stocks and send order details to order history in database
      checkout() {
        const orderStrings = [];
        
        this.cart.forEach((order) => {
          for (let i = 0; i < order.quantity; i++) {
            let toppingsString = order.toppings.length > 0 ? ` with ${order.toppings.join(' & ')}` : '';
            const orderString = `${order.item}${toppingsString}`;
          
            orderStrings.push(orderString);

            console.log('Order Item:', order.item);
            this.GetIngredients(order.item);

            // Update inventory quantity of toppings
            order.toppings.forEach((topping) => {
              //console.log('topping:', topping);
              this.InventoryUpdate(topping);
            });
          }
        });

        //this.formattedOrders = [...new Set(orderStrings)].join(', ');
        //orderStrings.join(', ');

        // print the quantity of orders into orderhistory
        const orderCounts = {};
        orderStrings.forEach((orderString) => {
          orderCounts[orderString] = (orderCounts[orderString] || 0) + 1;
        });

        this.formattedOrders = Object.keys(orderCounts).map((orderString) => `${orderString} (x${orderCounts[orderString]})`).join(', ');

        // insert orders to orderhistory
        this.OrderHistoryInsert();

        this.showMessage();

        // clear cart after order submitted
        this.clear();
        this.closeCheckout();
      },
      // @vuese
      // Show message that placing order is completed
      showMessage() {
        alert('Order Sent!');
      },
      // @vuese
      // Clear all orders in cart
      clear() {
        this.cart = [];
      },
      // @vuese
      // Set orderID by incrementing the order counter
      OrderId() {
        // order ID by incrementing the order counter
        const orderId = this.orderCounter;
        this.orderCounter++;
        return orderId;
      },
      // @vuese
      // Get the current date in the format YY-mm-dd
      CurrentDate() {
        // Get the current date in the format YY-mm-dd
        const currentDate = new Date();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getDate()).padStart(2, '0');
        const yy = String(currentDate.getFullYear());
        return `${yy}-${mm}-${dd}`;
      },
      // @vuese
      // Get the current time in the format HH:mm:ss
      CurrentTime() {
        // Get the current time in the format HH:mm:ss
        const currentTime = new Date();
        const hh = String(currentTime.getHours()).padStart(2, '0');
        const mm = String(currentTime.getMinutes()).padStart(2, '0');
        const ss = String(currentTime.getSeconds()).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      },

      // adding cart items to order history
      // @vuese
      // adding cart items to order history
      async OrderHistoryInsert() {
        const apiBaseUrl = 'https://scad.onrender.com';

        // Generate values for order_id, order_date, order_time, price
        const orderId = this.OrderId();
        const orderDate = this.CurrentDate();
        const orderTime = this.CurrentTime();
        const totalPrice = parseFloat(this.cartTotal);
      
        const newItem= {
          order_id: orderId,
          order_date: orderDate, 
          order_time: orderTime,
          order_details: this.formattedOrders,
          price: totalPrice, 
          tip: 0,
          payment_method: 'Credit Card', 
        };

        console.log(newItem);

        try {
          const response = await fetch(`${apiBaseUrl}/orderhistory/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Order History added:', data);
        } catch (error) {
          console.error('Failed to add Order History:', error);
        }
      },

      // get ingredients from a drink
      // @vuese
      // get ingredients from a drink
      // @arg drink's name
      GetIngredients(drinkname) {
        const apiBaseUrl = 'https://scad.onrender.com';
        const url = `${apiBaseUrl}/ingredients?type=${drinkname}`;

        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const uniqueIngredient = [...new Set(data.map((item) => item.ingredients))];
            this.ingredients = uniqueIngredient;
                
            // Update inventory quantity of ingredients from a drink
            console.log('Ingredients:', uniqueIngredient);
            uniqueIngredient.forEach((ingredient) => {
                this.InventoryUpdate(ingredient);
            });
            
          })
          .catch((error) => {
            console.error("Error fetching ingredients data:", error);
          })
          .finally(() => {
            this.isLoading = false;
          } 
          );
      },

      // update inventory quantity
      // @vuese
      // update inventory quantity
      // @arg item
      async InventoryUpdate(updateitem) {
        const apiBaseUrl = 'https://scad.onrender.com';

        const orderDate = this.CurrentDate();

        const InventoryUpdate = {
          timestamp: orderDate,
          product: updateitem,
        };

        console.log(InventoryUpdate);

        try {
          const response = await fetch(`${apiBaseUrl}/cart/inventory/updatequantity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(InventoryUpdate),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Inventory Updated:', data);
        } catch (error) {
          console.error('Failed to update inventory:', error);
        }
      }
    },
  };
  </script>
  
  <style>
  #outerDiv {
    display: flex;
    height: 85vh;
    background-color: white;
  }

  .column {
    box-sizing: border-box;
    padding: 15px;
  }

  .flexOrderDiv{
    display: flex;
    height: fit-content;
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    font-family: 'Concert One', sans-serif;
    border-radius: 15.2px;
  }

  .panelDiv{
    background-color: white;
  }

  .ordersDiv{
    height: 45%;
    background-color: #828282;
    overflow: scroll;
    border-radius: 15.2px;
  }

  .infoDiv{
    margin-left: 10px;
    text-align: left;
    height: fit-content;
  }

  .priceDiv{
      align-items: center;
      font-size: 20px;
  }

  .discountPanel{
    display: flex;
    margin: 5px;
  }

  .discountBtn{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    padding-left: 10px;
    padding-right: 10px;
    height: 60%;
    margin-top: 4%;
    cursor: pointer;
  }

  .panelTitle{
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    width: 30%;
  }

  .priceTitle{
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    text-align: justify;
    width: 75%;
    height: 100%;
  }

  .pricePanel{
    display: flex;
    height: fit-content;
    margin: 5px;
  }

  .priceTag{
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    text-align: right;
    width: 25%;
    height: 100%;
  }

  .totalPricePanel{
    display: flex;
    height: fit-content;
    margin: 5px;
  }

  .totalPriceTitle{
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    text-align: justify;
    width: 75%;
    height: 100%;
  }

  .totalPriceTag{
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    text-align: right;
    width: 25%;
    height: 100%;
  }

  .discountBtnDiv{
    display: flex;
    width: 75%;
  }

  .orderTitle{
    font-size: 20px;
  }

  .orderSize, .orderAddOn, .orderIce, .orderSweet{
    font-size: 14px;
  }

  #navTabs {
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
  }
  
  .navbar {
    background-color: white;
    padding: 17;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  
  .navbar-nav {
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0;
  }
  
  .nav-item {
    flex: 1;
  }
  
  .nav-link {
    color: #333;
    text-decoration: none;
    border-radius: 5px;
  }
  
  /* Increase specificity */
  #navTabs .active-tab {
    background-color: black;
    color: white;
  }
  
  #navTabs .active-tab:hover {
    background-color: black;
    color: white;
  }

  .innerTabDiv {
    overflow-y: scroll;
    height: auto;
    max-height: 80vh;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-row-gap: 0; /* Adjust the row gap to remove any spacing between rows */
    align-items: start;
    box-sizing: border-box; /* Ensure consistent box-sizing model */
  }
  
  .menuItemDiv {
    box-sizing: border-box; /* Ensure consistent box-sizing model */
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    padding: 10px;
    border: 1px solid black;
    margin: 10px;
    text-align: center;
    background-color: #EA0B43;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    cursor: pointer;
    border-radius: 15.2px;
  }
  
  .tabContents {
    height: 100%;
  }

  .customizerModal {
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

  .customizerContent {
    padding: 20px;
    background-color: white;
    color: black;
    height: 70%;
    width: 40%;
    align-items: center;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 20%;
    top: 20%;
    overflow: auto; /* Enable scroll if needed */
    border-radius: 15.2px;
    border-style: solid;
    border-color: black;
    border-width: 4px;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }

  .optionDiv {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* Adjust the minimum and maximum width as needed */
    gap: 5px; /* Adjust the gap between buttons as needed */
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
  }

  .optionTitle{
    vertical-align: center;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
  }

  .sizeOption{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    margin-top: 2%;
  }

  .sweetOption{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    margin-top: 2%;
  }

  .iceOption{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    margin-top: 2%;
  }

  .toppingOption{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    margin-top: 2%;
  }

  .modalTitle{
    font-family: 'Concert One', sans-serif;
    font-size: 30px;
  }

  .sizeOption.selected, .iceOption.selected, .sweetOption.selected, .toppingOption.selected {
    background-color: black;
    color: white;
  }

  .addCartDiv{
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .addCartBtn{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    margin-top: 2%;
  }

  .quantityBtn{
    font-family: 'Concert One', sans-serif;
    font-size: 17px;
    background-color: black;
    border-radius: 8px;
    color: white;
    border-color: transparent;
    height: fit-content;
    padding-left: 5px;
    padding-right: 5px;
  }

  .addCartBtn:hover{
    cursor: pointer;
    background-color: #EA0B43;
  }

  .discountBtn.selected {
    background-color: black;
    color: white;
  }

  .closeBtn{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: white;
    border-radius: 8px;
    border-color: transparent;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    margin-top: 12%;
  }

  .checkoutBtn{
    margin-right: 5px;
    font-family: 'Concert One', sans-serif;
    font-size: 20px;
    background-color: #EA0B43;
    border-radius: 8px;
    border-color: black;
    padding: 13px;
    height: fit-content;
    cursor: pointer;
  }

  .orderQuantityDiv{
    display: flex;
  }

  .promptDiv{
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

  .promptDivContent{
    padding: 20px;
    padding-bottom: 40px;
    background-color: white;
    color: black;
    height: fit-content;
    width: 40%;
    align-items: center;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 20%;
    top: 20%;
    overflow: auto; /* Enable scroll if needed */
    border-radius: 15.2px;
    border-style: solid;
    border-color: black;
    border-width: 4px;
  }

  .summaryItems{
    font-family: 'Concert One', sans-serif;
    font-size: 20px;

  }

  .summaryTitle{
    font-family: 'Concert One', sans-serif;
    font-size: 30px;
    color:#EA0B43;
  }

  .summaryTotal{
    font-family: 'Concert One', sans-serif;
    font-size: 30px;
    color:#EA0B43;
  }

</style>
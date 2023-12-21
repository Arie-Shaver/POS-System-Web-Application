<template>
  <div class="btnDiv">
    <button @click="goBack" class="go-back-button">Back to Category</button>
  </div>
<div class="add-to-cart">
  <div class="order-summary">
    <p class="orderTitle">Order Summary</p>

    <div class="order-total" v-if="cartItems.length === 0">
      <p>No drinks added to the cart yet!</p>
    </div>

    <div v-if="isLoading">
      <div class="loadingDiv display"></div>
    </div>

    <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
      <img class="drinkImg" :src="`/assets/${item.image}`" :alt="getAltText(item.image)"/>

      <div class="item-details">
        <p style="font-size: 120%; color: var(--selected-color);">{{ item.tea_type }}</p>
        <p>{{ item.drink_size }}</p>
        <p>{{ item.sweetness }}</p>
        <p>{{ item.ice }}</p>
        <p>{{ item.toppings }}</p>
      </div>

      <div class="quantity-control">
        <button @click="decreaseQuantity(index)">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="increaseQuantity(index)">+</button>
      </div>

      <div class="item-total">
        <p>
          ${{ itemTotals[index] !== undefined ? itemTotals[index].toFixed(2) : 'N/A' }}
        </p>
      </div>

      <button class="deleteOrderBtn" @click="deleteCartItem(item.item_id)">X</button>
    </div>
    
    <br>
    <hr style="border: 1px solid var(--selected-color); margin-top: 10px; margin-bottom: 20px;">

    <p class="orderTitle" style="font-size: 240%;">Payment Details</p>

    <div class="order-total">
      <p>Subtotal: ${{ calculateSubtotal }}</p>
      <p>Tax: ${{ (0.0625 * subtotal).toFixed(2) }}</p>
      <!-- <p>Tip: ${{ (selectedtip / 100.0 * subtotal).toFixed(2) }}</p> -->
    </div>

    <div class="tipBtnDiv">
      <p>Tip: 
      <button class="tipBtn" :class="{ 'selected': selectedtip === 0 }" @click="setTip(0)">0%</button>
      <button class="tipBtn" :class="{ 'selected': selectedtip === 10 }" @click="setTip(10)">10%</button>
      <button class="tipBtn" :class="{ 'selected': selectedtip === 15 }" @click="setTip(15)">15%</button>
      <button class="tipBtn" :class="{ 'selected': selectedtip === 18 }" @click="setTip(18)">18%</button></p>
    </div>

    <div class="total">
      <p>Total: ${{ calculateTotal }}</p>
    </div>

    <div class="payment-options">
      <label for="payment-method">Select Payment Method: </label>
      <select id="payment-method" v-model="selectedPaymentMethod">
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
      </select>
    </div>

    <div class="pay-button-panel">
      <button @click="processPayment" class="pay-button">Check Out</button>
    </div>
  </div>

  <div class="popup" v-if="showPopup">
    <p>Drink deleted from order!</p>
  </div>

</div>
</template>

<script>
// @group Customer
// Enables add to cart feature when customer orders a boba tea
export default {
created() {
  this.fetchAltText();
  this.fetchCartItems();
},
// @vuese
// Contains variables for calculating order total and keeping track of items in the cart
data() {
  return {
    selectedPaymentMethod: 'cash',
    subtotal: 0.0,
    selectedtip: 0,
    cartItems: [],
    showPopup: false,
    orderDetails: '',
    itemTotals: [],
    altText: [],
    isLoading: false,
  };
},
computed: {
  // @vuese 
  // Calculates the subtotal before tip, tax and discounts when a customer orders boba tea
  // @return subtotal 
  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce((sum, item, index) => {
      const itemTotal = item.price * item.quantity;
      this.itemTotals[index] = itemTotal;
      return sum + itemTotal;
    }, 0);
    return this.subtotal.toFixed(2);
  },

  // @vuese
  // Calculates final total of transaction including subtotal and tip
  // @return total
  calculateTotal() {
    return (0.0625 * this.subtotal + this.subtotal + (this.selectedtip / 100.0 * this.subtotal)).toFixed(2);
  },
},
methods: {
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
        console.error('Error fetching menu data:', error);
      });
    this.isLoading = false;
  },

  // @vuese
  // Retrieve boba tea image descriptions and images
  // @param image image file name from database
  // @return altText string value of alt text for the images on the database
  getAltText(image) {
    const altTextEntry = this.altText.find(entry => entry.image?.trim() === image?.trim());
    return altTextEntry ? altTextEntry.alt_text : '';
  },

  // @vuese
  // Allows the user to increase the quantity of a boba tea when in the cart
  // @param index represents a particular item on the menu
  increaseQuantity(index) {
    const cartItem = this.cartItems[index];

    // Increase the quantity locally
    cartItem.quantity++;

    // Update the quantity in the database
    this.updateQuantityInDatabase(cartItem.item_id, cartItem.quantity);
  },

  // @vuese
  // Allows the user to decrease the quantity of a boba tea when in the cart
  // @param index represents a particular item on the menu
  decreaseQuantity(index) {
    const cartItem = this.cartItems[index];

    // Decrease the quantity locally, ensuring it doesn't go below 1
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else if(cartItem.quantity == 1) {
      // Ask for confirmation before reducing to 0
      const userConfirmation = window.confirm(
        `Are you sure you want to remove ${cartItem.tea_type} from your order?`
      );

      if (userConfirmation) {
        this.deleteCartItem(cartItem.item_id);
        return;
      }
    }
    this.updateQuantityInDatabase(cartItem.item_id, cartItem.quantity);
  },

  // @vuese
  // Sets the tip based on the percent selected by the customer when ordering
  // @param percent tip value selected by the user when ordering 
  setTip(percent){
    this.selectedtip = percent;
  },

  // @vuese
  // Process the order being inputted by the user, sends user a confirmation message with the details of the order
  processPayment() {
    const orderDetailsString = this.formatOrderDetails();

    const confirmMessage = `You are about to place the following order:\n\n${orderDetailsString}\n\nTotal: $${this.calculateTotal}\n\nProceed with payment?`;
    const userConfirmation = window.confirm(confirmMessage);

    if (userConfirmation) {
    // Logic to process the payment
    // Example: Send a request to a payment gateway
    // this.clearCart();
      console.log('Order placed.');
      this.clearCart();
      this.addOrderHistory();
      this.updateInventoryForCartItems();
    } else {
        console.log('Order cancelled.');
    }
  },

  // @vuese
  // Retrieves items ordered and added to the cart from the database cart table
  // @throws error Network error when attempting to access the database
  async fetchCartItems() {
    try {
      this.isLoading = true;
      const apiBaseUrl = "https://scad.onrender.com";
      const url = `${apiBaseUrl}/cart`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      this.cartItems = data; // Assuming the response contains an array of cart items
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    this.isLoading = false;
  },

  // @vuese
  // Deletes all of the items in the cart
  // @throws error Network error when attempting to access the database
  async clearCart() {
    try {
      const apiUrl = "https://scad.onrender.com";
      const clearCartUrl = `${apiUrl}/clearCart`;

      const response = await fetch(clearCartUrl, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Clear the local cartItems array
      this.cartItems = [];
      console.log('Cart cleared successfully.');
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },

  // @ vuese
  // @param itemID specific boba tea menu item being added to the cart
  // @throws error Network error when accessing the database
  async deleteCartItem(itemId) {
    const apiBaseUrl = "https://scad.onrender.com";
    const deleteCartItemUrl = `${apiBaseUrl}/cart/${itemId}`;

    try {
      const response = await fetch(deleteCartItemUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item with ID ${itemId}`);
      }

      // Remove the deleted item from the local cartItems array
      this.cartItems = this.cartItems.filter(item => item.item_id !== itemId);

      console.log(`Item with ID ${itemId} deleted successfully.`);

      this.showPopup = true;

      setTimeout(() => {
        this.showPopup = false;
      }, 5000);

    } catch (error) {
      console.error(`Error deleting item with ID ${itemId}:`, error);
    }
  },

  // @vuese
  // Update the quantity of the particular menu item in the database in the cart table
  // @param item_id represents a singular item in the cart added by the customer
  // @param quantity represents the amount of the item added to the cart
  // @throws error Network error when attempting to access the databse
  async updateQuantityInDatabase(itemId, quantity) {
    try {
      const apiUrl = "https://scad.onrender.com";
      const updateQuantityUrl = `${apiUrl}/cart/updateQuantity/${itemId}`;
      const updateQuantityData = { quantity }; // Assuming your server expects an object with the new quantity

      const response = await fetch(updateQuantityUrl, {
        method: "PATCH", // Use the appropriate HTTP method (PATCH, PUT, or POST)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateQuantityData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(`Quantity for item with ID ${itemId} updated successfully.`);
    } catch (error) {
      console.error(`Error updating quantity for item with ID ${itemId}:`, error);
    }
  },

  // @vuese
  // Navigate the user to the correct ordering page based on their login
  goBack() {
      const email = localStorage.getItem('customerEmail');  
      if (email) {
        // If the customer is logged in, navigate to the selected drink's page with both the category name and drink name as parameters
        this.$router.push('/kungfuteacustomer/orderpage');
      } else {
        // If the customer is not logged in, navigate to the same route under /kungfutea
        this.$router.push('/kungfutea/orderpage');
      }
    },

  // @vuese
  // Create the string for order details when the user adds all of their items to the cart
  // @return orderDetails string for all of the items in the cart order
  formatOrderDetails() {
    return this.cartItems.map(item => {
      // Check if toppings is an array and has elements before joining
      let toppingsString = Array.isArray(item.toppings) && item.toppings.length > 0 
                          ? ` with toppings: ${item.toppings.join(', ')}` 
                          : '';

      return `${item.tea_type} - Size: ${item.drink_size}, Sweetness: ${item.sweetness}, Ice: ${item.ice}${toppingsString} (Quantity: ${item.quantity})`;
    }).join(', ');
  },

  // @vuese
  // Stores the unique id for every order
  // @return orderId numerical value for each order placed
  OrderId() {
      // order ID by incrementing the order counter
      const orderId = this.orderCounter;
      this.orderCounter++;
      return orderId;
    },

  // @vuese
  // Sets the date on the cart page when the customer places the order
  // @return currentDate real-time date when order from the cart is placed
  CurrentDate() {
    // Get the current date in the format YY-mm-dd
    const currentDate = new Date();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const yy = String(currentDate.getFullYear());
    return `${yy}-${mm}-${dd}`;
  },

  // @vuese
  // Sets the current time on the cart page when the customer places the order
  // @return currentTime real-time timestamp when the order from the cart is placed
  CurrentTime() {
    // Get the current time in the format HH:mm:ss
    const currentTime = new Date();
    const hh = String(currentTime.getHours()).padStart(2, '0');
    const mm = String(currentTime.getMinutes()).padStart(2, '0');
    const ss = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },

  // @vuese
  // Adds order data from the cart to the database cart sql table
  // @throws error Network error when attempting to access the database
  async addOrderHistory() {
    const apiBaseUrl = 'https://scad.onrender.com';

    // Generate values for order_id, order_date, order_time, price
    const orderDetails = this.formatOrderDetails();
    const totalPrice = this.calculateTotal;
    const paymentMethod = this.selectedPaymentMethod;
  
    const orderData= {
      order_id: this.OrderId(),
      order_date: this.CurrentDate(),
      order_time: this.CurrentTime(),
      order_details: orderDetails,
      price: totalPrice,
      tip: 0,
      payment_method: paymentMethod,
    };

    console.log(orderData);

    try {
      const response = await fetch(`${apiBaseUrl}/orderhistory/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
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

  // @vuese
  // Retrieves ingredients for the specific boba tea drink added to the cart
  // @param teaType specific boba tea ordered by the customer and added to cart
  // @throw error Network error when attempting to access the database
  async GetIngredients(teaType) {
    const apiBaseUrl = 'https://scad.onrender.com';
    const url = `${apiBaseUrl}/ingredients?type=${teaType}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const uniqueIngredient = [...new Set(data.map((item) => item.ingredients))];

      // Log the ingredients for debugging
      console.log('Ingredients:', uniqueIngredient);

      return uniqueIngredient;
    } catch (error) {
      console.error('Error fetching ingredients data:', error);
      throw error; // Re-throw the error to be caught by the caller
    }
  },
  
  // @vuese
  // Updates inventory quantity with the time, date and ordered boba tea item when order is processed
  // @param updateitem menu item that is ordered by the customer
  // @throws error Network when attempting to access the database
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
  },

  // @vuese
  // Updates ingredients in the inventory database table
  async updateInventoryForCartItems() {
    try {
      for (const cartItem of this.cartItems) {
        const teaType = cartItem.tea_type;

        // Get ingredients for the current cart item
        const ingredients = await this.GetIngredients(teaType);

        // Get quantity of each ingredient
        for (const ingredient of ingredients) {
          const { quantity } = cartItem;

          // Update inventory based on the quantity
          for (let i = 0; i < quantity; i++) {
            await this.InventoryUpdate(ingredient);
          }
        }
        // TODO: add inventory update for each topping
        // const topping = split cartItem.toppings by ", " then InventoryUpdate(topping)
        const toppings = cartItem.toppings ? cartItem.toppings.split(', ') : [];
        for (const topping of toppings) {
          // Update inventory based on the quantity
          for (let i = 0; i < cartItem.quantity; i++) {
            await this.InventoryUpdate(topping);
          }
        }
      }

      console.log('Inventory updated for all cart items.');
    } catch (error) {
      console.error('Error updating inventory for cart items:', error);
    }
  }
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
.order-summary {
  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
  padding: 30px;
  border: 1px solid var(--selected-color);
  border-radius: 5px;
  line-height: 70%;
}

.order-total {
  font-family: 'Concert One', sans-serif;
  font-size: 22px;
  color: var(--main-font-color);
}

.total {
  font-family: 'Concert One', sans-serif;
  font-size: 28px;
  color:var(--title-color);
}

.cart-item {
  margin: 10px 0;
  padding: 10px;
  border: 4px solid var(--selected-color);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}

.item-details {
  width: 60%;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  color: var(--main-font-color);
}

.quantity-control {
  display: flex;
  align-items: center;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  color: var(--main-font-color);
}

.quantity-control span{
  color: var(--main-font-color);
}

.quantity-control button{
  background-color: transparent;
  border-style: 1px solid;
  border-radius: 25px;
  margin-left: 5px;
  margin-right: 5px;
  border-color: var(--main-font-color);
  color: var(--main-font-color);
}

.item-total {
  font-weight: bold;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  display: flex;
  align-items: center;
  color: var(--selected-color);
}

.payment-options {
  margin-top: 20px;
  font-family: 'Concert One', sans-serif;
  font-size: 22px;
}

.payment-options label{
  color: var(--main-font-color);
}


#payment-method {
  font-size: 22px;
  background-color: var(--bg-color);
  color: var(--main-font-color);
}

.pay-button {
  margin-top: 40px;
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 30px;
  background-color: var(--selected-color);
  border-radius: 8px;
  border-color: var(--main-font-color);
  padding: 10px;
  height: fit-content;
  transition: background-color 0.3s ease; 
  cursor: pointer;
}

.pay-button:hover {
  background-color: var(--bg-color); 
  color: var(--hover-color);
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
}

.tipBtnDiv{
  font-family: 'Concert One', sans-serif;
  font-size: 22px;
}

.tipBtnDiv p{
  color: var(--main-font-color);
}

.tipBtn.selected {
  background-color: var(--main-font-color);
  color: var(--bg-color);
}

.tipBtn{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: var(--bg-color);
  border-radius: 8px;
  color: var(--main-font-color);
  border-color: var(--main-font-color);
  padding-left: 10px;
  padding-right: 10px;
  height: 60%;
  transition: background-color 0.3s ease; 
  cursor: pointer;
  margin-right: 18px;
}

.tipBtn:hover {
  background-color: var(--main-font-color);
  color: var(--bg-color);
}

.deleteOrderBtn{
  background-color: var(--hover-color);
  border-style: 8px;
  border-radius: 8px;
  margin-left: 5px;
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

.orderTitle{
  font-family: levitation;
  font-size: 45px;
  color: var(--title-color);
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

.btnDiv{
  float: left;
}

.drinkImg{
  width: 200px;
  margin-left: 4%;
}

</style>
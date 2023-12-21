<template>
  <div id="inventory">
    <div id="titleDiv">
      <p class="title">
        Inventory
      </p>
    </div>
    <div class="buttons">
      <button class="accordion-btn" @click="showSection('addItems')">Add Items</button>
      <button @click="showSection('updateQuantity')">Update Quantity</button>
      <button class="accordion-btn" @click="showSection('restockItems')">Restock Items</button>
      <button @click="showSection('excessReport')">Excess Report</button>
      <button @click="showSection('restockSettings')">Manage Restock Settings</button>
    </div>
    <div v-if="currentSection === 'restockSettings'" id="restockSettingsDiv">
      <h3 class="manageRestockTitle">Manage Restock Settings</h3>
      <div v-for="(itemType, index) in restockQuantities" :key="index" class="manageRestockInputDiv">
        <div class="innerManagerRestockInputDiv">
          <label class="restockLabels">{{ itemType.product_type }}</label>
          <input class="restockInputs" type="number" v-model="itemType.minimum_quantity" @change="updateRestockArr(index, itemType.minimum_quantity)"/>
        </div>
      </div>
      <button class='invBtns' @click="applyRestockSettings">Apply</button>
    </div>
    <div v-if="currentSection === 'updateQuantity'" id="showAddItemsDiv">
      <h3 class="addItemsTitle">Update Quantity</h3>
      <form>
        <div class="addItemDiv">
          <select @change="updateSelectedItem">
            <option value="" disabled selected hidden>Select Item</option>
            <option v-for="(item, index) in itemList" :value="item.product" :key="index">{{ item }}</option>
          </select>
          <input class="addItemInput" type="number" v-model="newQuant" placeholder="Enter Product Quantity" required>
          <button class="invBtns" type="button" @click="updateQuantityCall">Update</button>
        </div>  
      </form>  
    </div>
    <div v-if="currentSection === 'restockItems'" id="restockItemsDiv">
      <h3 class="restockTitle">Restock Items</h3>
      <div class="restockTable">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Left</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lowItems" :key="index">
              <td>{{ item.product }}</td>
              <td>{{ item.quantity_left }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="currentSection === 'excessReport'" class="accordion">
        <div class="accordion-content">
          <div class="datesDiv">
            <label for="startDateInput">Start Date:</label>
            <input type="date" id="startDateInput" v-model="startDate" />
            <label for="endDateInput">End Date:</label>
            <input type="date" id="endDateInput" v-model="endDate" />
            <button class='invBtns' @click="showExcessReport"> Apply </button>
          </div>
          <div v-if="excessreport.length > 0">
            <h3 class="excessReport">Excess Report - Products Consumed &lt; 10%</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Product Type</th>
                  <th>Product</th>
                  <th>Timestamp</th>
                  <th>Start Quantity</th>
                  <th>Quantity Consumed</th>
                  <th>Quantity Left</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in excessreport" :key="index">
                  <td>{{ item.product_type }}</td>
                  <td>{{ item.product }}</td>
                  <td>{{ item.timestamp }}</td>
                  <td>{{ item.start_quantity }}</td>
                  <td>{{ item.quantity_consumed }}</td>
                  <td>{{ item.quantity_left }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No data available for the selected date range.</p>
          </div>
        </div>
      </div>
    <div v-if="currentSection === 'addItems'" id="showAddItemsDiv">
      <h3 class="addItemsTitle">Add New Item</h3>
      <form @submit="addItem">
        <div class="addItemDiv">
          <input class="addItemInput" type="text" v-model="product_type" placeholder="Enter Product Type" required>
          <input class="addItemInput" type="text" v-model="product" placeholder="Enter Product Name" required>
          <input class="addItemInput" type="number" v-model="start_quantity" placeholder="Enter Product Quantity" required>
          <button class="invBtns" type="button" @click="handleInsert">Insert Item</button>
        </div>  
      </form>  
    </div>
    <div id="inventoryTablesDiv">
      <!-- Checkboxes for each item type -->
      <div class="outerCheck">
        <div v-for="(itemType, index) in restockQuantities" :key="index" class="checkbox-container">
          <input :ref="`checkbox${index}`" type="checkbox" :id="'accordion-' + index" v-model="openAccordions" :value="itemType.product_type" @change="toggleAccordion(index)">
          <label :for="'accordion-' + index" class="accordion-btn">{{ itemType.product_type }}</label>
        </div>
      </div>
      <!-- Display tables for checked items -->
      <div class="invTablesDiv">
        <div v-for="(itemType, index) in restockQuantities" :key="index" class="tableDiv">
          <div class="innerTableDiv" v-if="isAccordionOpen(index)">
            <table>
              <caption class="tableTitle">{{ getAccordionProduct(index) }}</caption>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity Left</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, itemIndex) in inventoryData[index]" :key="itemIndex" :class="{ 'low-item': isLowItem(item) }">
                  <td>{{ item.product }}</td>
                  <td>{{ item.quantity_left }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
//@group Manager
//Displays inventory data & information, and offers the following features to managers: add item to inventory, update remaining quantity of inventory item, update restock quantities, view list of items that need to be restocked, view the excess report for a specified time frame, 
export default {
  data() {
    return {
      inventoryData: [],
      itemList: [],
      openAccordions: [],
      restockQuantities: [],
      restockQuantitiesInputs: [],
      restockQuantitiesLabels: [],
      lowItems: [],
      excessreport: [],
      showRestockSettingsDiv: false,
      showRestockItemsDiv: false,
      showExcessReportDiv: false,
      showAddItemsDiv: false,
      showRestockSettingsDiv: false,
      showUpdateQuantityDiv: false,
      product_type: '',
      product: '',
      start_quantity: '',
      allChecked: false,
      selectedUpdateItem: '',
      newQuant: '',
      startDate:'',
      endDate:'',
      currentSection:'',
    };
  },
  created() {
    this.fetchRestockQuantities();
  },
  methods: {
    // @vuese
    // updates currentSection, and shows specified div
    // @arg section -- specified div section
    showSection(section) {
      //show the selected section and hide others
      this.currentSection = section;
    },
    // @vuese
    //handles inventory item insert, and updates the postgreSQL database accordingly
    async handleInsert() {
      
      const newItem= {
        product: this.product,
        product_type: this.product_type,
        start_quantity: this.start_quantity
      };


      try {
        const response = await fetch(`${apiBaseUrl}/inventory-insert`, {
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
        console.log('Customer added:', data);
      } catch (error) {
        console.error('Failed to add item:', error);
      }
    },
    // @vuese
    //fetches restock quantities from postgreSQL database -- the minimum quantity that each category has to signal restock
    fetchRestockQuantities() {
      const apiBaseUrl = 'https://scad.onrender.com';
      fetch(`${apiBaseUrl}/inventory/restockQuantities`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          this.restockQuantities = data;
          for(let i = 0; i < this.restockQuantities.length; i++){
            this.restockQuantitiesLabels.push(this.restockQuantities[i].product_type);
            this.restockQuantitiesInputs.push(this.restockQuantities[i].minimum_quantity);
          }
          this.fetchInventoryData();
        })
        .catch((error) => {
          console.error('Error fetching inventory unique types data:', error);
        });
    },
    // @vuese
    //called from fetchRestockQuantities(). fetches inventory data from postgreSQL database. 
    fetchInventoryData() {
      const apiBaseUrl = 'https://scad.onrender.com';
      fetch(`${apiBaseUrl}/inventory`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          this.inventoryData = data;
          this.groupInventoryByType();
        })
        .catch((error) => {
          console.error('Error fetching inventory data:', error);
        });
    },
    // @vuese
    //called from fetchInventoryData(). groups inventory data we already grabbed by item type, updates inventoryData & itemList
    groupInventoryByType() {
      let newInventoryData = [];
      for(let i = 0; i < this.restockQuantities.length; i++){
          newInventoryData.push([]);
      }
      for(let i = 0; i < this.inventoryData.length; i++){
          let type = this.inventoryData[i].product_type;
          let index = -1;
          for(let j = 0; j < this.restockQuantities.length; j++){
            if(this.restockQuantities[j].product_type == type){
              index = j;
              break;
            }
          }
          newInventoryData[index].push(this.inventoryData[i]);
      }
      this.inventoryData = newInventoryData;
      for(let i = 0; i < this.inventoryData.length; i++){
            let type = this.inventoryData[i];
            for(let j = 0; j < type.length; j++){
              this.itemList.push(type[j].product);
            }
      }
      this.getLowItems();
    },
    // @vuese
    //called from groupInventoryByType(). traverses inventory data & finds and records all items below the item type's restock quantity.
    getLowItems(){
      for(let i = 0; i < this.restockQuantities.length; i++){
        let type = this.restockQuantities[i].product_type;
        let minQuant = this.restockQuantities[i].minimum_quantity;
        let currItems = this.inventoryData[i];
        for(let j = 0; j < currItems.length; j++){
          //alert(currItems[j].quantity_left <= minQuant);
          if(currItems[j].quantity_left <= minQuant){
            this.lowItems.push(currItems[j]);
          }
        }
      }
    },
    // @vuese
    //returns boolean -- whether or not an item is "low" ie needs to be restocked & should be highlighted
    // @arg item -- inventory item
    isLowItem(item) {
      return this.lowItems.includes(item);
    },
    // @vuese
    //updates selectedUpdateItem with the item selected in the event
    //@arg event -- item selected
    updateSelectedItem(event) {
      this.selectedUpdateItem = event.target.value;
    },
    // @vuese
    // updates inventory restock quantity of the selectedUpdateItem with newQuant in the postgreSQL database
    updateQuantityCall(){
      const updatedQuantity = {
        product_name: this.selectedUpdateItem,
        quantity_left: this.newQuant,
      };
      fetch('https://scad.onrender.com/inventory/updateQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuantity),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data);
        // Handle success
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error
      });
    },
    // @vuese
    //shows the excess report form using startDate & endDate -- updates excessreport & displays in section
    showExcessReport() {
      this.showExcessReportDiv = !this.showExcessReportDiv;
      const startDate = this.startDate;
      const endDate = this.endDate;

      const apiBaseUrl = "https://scad.onrender.com";
        const url = `${apiBaseUrl}/inventory/excessreport?startDate=${startDate}&endDate=${endDate}`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            this.excessreport = data;
            this.showExcessReportDiv = true;
          })
          .catch((error) => {
            console.error("Error fetching order_history data:", error);
          });
    },
    // @vuese
    // opens or closes accordion at index, and appends index to openAccordions list if necessary
    // @arg index -- index of accordion to be toggled
    toggleAccordion(index) {
      const isOpen = this.isAccordionOpen(index);
      if (isOpen) {
        this.openAccordions = this.openAccordions.filter((i) => i !== index);
      } else {
        this.openAccordions.push(index);
      }
    },
    // @vuese
    //returns boolean -- whether or not the accordion at the index is open
    // @arg index -- index of accordion specified
    isAccordionOpen(index) {
      // Check if the accordion at the given index is open
      return this.openAccordions.includes(index);
    },
    // @vuese
    // Updates the restock quantities list at the index with the quantity
    // @arg index -- index of item type, quantity -- new restock quantity
    updateRestockArr(index, quantity){
      this.restockQuantitiesInputs[index] = quantity;
    },
    // @vuese
    //called in applyRestockSettings(). Updates restock quantity of specific type of item in the postgreSQL database
    // @arg productType -- type of inventory item, quantity -- new restock quantity
    updateRestockQuantity(productType, quantity){
      const updatedQuantity = {
        product_type: productType,
        minimum_quantity: quantity,
      };
      fetch('https://scad.onrender.com/inventory/restockQuantities/updateQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuantity),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data);
        // Handle success
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error
      });
    },
    // @vuese
    // uses updateRestockQuantity() as helper function to update database values
    applyRestockSettings() {
      // Save the updated restockQuantities settings
      // (you may want to include validation logic here)
      for(let i = 0; i < this.restockQuantities.length; i++){
        this.updateRestockQuantity(this.restockQuantitiesLabels[i], this.restockQuantitiesInputs[i]);
      }
      this.showRestockSettingsDiv = false;
    },
    // @vuese
    //returns the type of item displayed in the given index's accordion
    // @arg index -- index of accordion specified
    getAccordionProduct(index){
      let curr = this.inventoryData[index];
      let type = curr[0].product_type;
      return type;
    },
  },
};
</script>


<style>
#inventory {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
}


#inventoryTablesDiv table {
  width: 60%; /* Adjust the width value as per your preference */
  table-layout: fixed;
  margin-left: auto;
  margin-right: auto;
}

#inventoryTablesDiv th:first-child,
#inventoryTablesDiv td:first-child {
  text-align: left;
}

#inventoryTablesDiv th:last-child,
#inventoryTablesDiv td:last-child {
  text-align: right;
}

.low-item{
  background-color: #FFAEAE;
}

.restockInputs{
  width: 20%;
  text-align: center;
  margin-left: 20px;

}

.checkbox-container {
  margin: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

.outerCheck {
  display: flex;
  justify-content: center;
  width: 100%; /* Set a fixed width to keep it centered */
}

.invTablesDiv{
  display: block;
  padding-top: 50px;
  padding-bottom: 50px;
}

.buttons button {
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
  padding-left: 10px;
  padding-right: 10px;
  height: 60%;
}

.buttons{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #EA0B43;
  padding-left: 10px;
  padding-right: 10px;
  height: 50px;
  align-items: center;
}

.tableTitle{
  padding-top: 20px;
  padding-bottom: 10px;
  background-color: #EA0B43;
}

.tableDiv{
  padding-top: 10px;
  padding-bottom: 10px;
}

#showAddItemsDiv{
  padding-bottom: 20px;
}

.addItemsTitle{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

.addItemInput{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
  padding-left: 10px;
  padding-right: 10px;
  height: 60%;
}

.addItemInput:focus{
  border-color: #EA0B43;
}


.invBtns{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
  padding-left: 10px;
  padding-right: 10px;
  height: 60%;
}

.restockTitle{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: #EA0B43;
  margin-bottom: 0;
  height: 40px;
  padding-top: 25px;
}

#restockItemsDiv{
  padding-bottom: 20px;
}

.accordion-content{
  background-color: white;
}

.manageRestockInputDiv {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  width: 250px;
}

.innerManagerRestockInputDiv{
  width: 250px;
}

.manageRestockInputDiv label {
  float: left
}

.manageRestockInputDiv input {
  float: right;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
}

.manageRestockTitle{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

#restockSettingsDiv{
  padding-bottom: 20px;
}

.restockLabels{
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
}

.quantitySelect{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
  padding-left: 10px;
  padding-right: 10px;
  height: 60%;
}
</style>
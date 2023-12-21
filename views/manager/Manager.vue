<template>
  <div id="managerView">
    <div id="managerTabs">
      <nav class="navbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              href="#"
              class="nav-link"
              :class="{ 'active-tab': selectedTab === 'Order History' }"
              @click="selectedTab = 'Order History'"
              key="Order History"
            >
              Order History
            </a>
          </li>
          <li class="nav-item">
            <a
              href="#"
              class="nav-link"
              :class="{ 'active-tab': selectedTab === 'Inventory' }"
              @click="selectedTab = 'Inventory'"
              key="Inventory"
            >
              Inventory
            </a>
          </li>
          <li class="nav-item">
            <a
              href="#"
              class="nav-link"
              :class="{ 'active-tab': selectedTab === 'Sales/Trends' }"
              @click="selectedTab = 'Sales/Trends'"
              key="Sales/Trends"
            >
              Sales/Trends
            </a>
          </li>
          <li class="nav-item">
            <a
              href="#"
              class="nav-link"
              :class="{ 'active-tab': selectedTab === 'Menu' }"
              @click="selectedTab = 'Menu'"
              key="Menu"
            >
              Menu
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="tabManager">
      <div v-if="selectedTab === 'Order History'" :key="'Order History'">
        <OrderHistory></OrderHistory>
      </div>
      <div v-else-if="selectedTab === 'Inventory'" :key="'Inventory'">
        <Inventory></Inventory>
      </div>
      <div v-else-if="selectedTab === 'Sales/Trends'" :key="'Sales/Trends'">
        <SalesTrends></SalesTrends>
      </div>
      <div v-else-if="selectedTab === 'Menu'" :key="'Menu'">
        <MenuEditor></MenuEditor>
      </div>
    </div>
  </div>
</template>

<script>
import SalesTrends from './SalesTrends.vue';
import OrderHistory from './OrderHistory.vue';
import Inventory from './Inventory.vue';
import MenuEditor from './MenuEditor.vue';

//@group Manager
//Display's manager's interface with 4 main tabs: Order History, Inventory, Sales/Trends, and Menu Editor. 
export default {
  name: 'Manager',
  components: {
    OrderHistory,
    Inventory,
    SalesTrends,
    MenuEditor
  },
  data() {
    return {
      selectedTab: 'Order History'
    };
  }
};
</script>

<style>

#managerView{
  background-color: white;
}
#managerTabs {
  font-family: levitation;
  font-size: 30px;
}

.navbar {
  background-color: white;
  padding: 10px;
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
  margin-right: 10px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 5px;
}

/* Increase specificity */
#managerTabs .active-tab {
  background-color: black;
  color: white;
}

#managerTabs .active-tab:hover {
  background-color: black;
  color: white;
}
</style>
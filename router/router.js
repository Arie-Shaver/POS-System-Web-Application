import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '../views/MenuPage.vue';
import CustomerLayout from '../CustomerLayout.vue';
import ManagerLayout from '../ManagerLayout.vue';
import CashierLayout from '../CashierLayout.vue';
import GuestLayout from '../GuestLayout.vue';
import LoginPage from '../views/LoginPage.vue';
import Orderpage from '../views/customer/OrderPage.vue';
import CategoryPage from '../views/customer/CategoryPage.vue';
import CustomPage from '../views/customer/CustomPage.vue';
import Manager from '../views/manager/Manager.vue';
import AddToCart from '../views/customer/AddToCart.vue';
import Profile from '../views/customer/Profile.vue';
import CustomerLogin from '../views/customer/CustomerLogin.vue';
import Create from '../views/customer/Create.vue';
import UpdateInfo from '../views/customer/UpdateInfo.vue';
import Home from '../views/customer/Home.vue';
import Google from '../views/customer/Google.vue';
import Settings from '../views/customer/Settings.vue';


// should be change file names in cashier since it is identical to customer folder
import C_Orderpage from '../views/cashier/OrderPage.vue';

const routes = [
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: '/',
        component: Home,
      },
      {
        path: '/kungfutea/login',
        component: LoginPage,
      },
      {
        path: '/kungfutea/menu',
        component: MenuPage,
      },
      {
        path: '/kungfutea/orderpage', 
        component: Orderpage, 
      },
      {
        path: '/kungfutea/categorypage/:categoryName',
        component: CategoryPage,
      },
      {
        path: '/kungfutea/categorypage/:categoryName/:drinkName',
        component: CustomPage,
      },
      {
        path: '/kungfutea/cart',
        component: AddToCart,
      },
      {
        path: '/kungfutea/customerlogin',
        component: CustomerLogin,
      },
      {
        path: '/kungfutea/create',
        component: Create,
      },
      {
        path: '/kungfutea/google',
        component: Google,
      },
      {
        path: '/kungfutea/settings',
        component: Settings,
      },
    ],
  },
  {
    path: '/kungfuteacustomer',
    component: CustomerLayout,
    children: [
      {
        path: '/kungfuteacustomer',
        component: Home,
      },
      {
        path: '/kungfuteacustomer/menu',
        component: MenuPage,
      },

      // customer
      {
        path: '/kungfuteacustomer/orderpage', 
        component: Orderpage, 
      },
      {
        path: '/kungfuteacustomer/categorypage/:categoryName',
        component: CategoryPage,
      },
      {
        path: '/kungfuteacustomer/categorypage/:categoryName/:drinkName',
        component: CustomPage,
      },
      {
        path: '/kungfuteacustomer/cart',
        name: 'Customer Cart',
        component: AddToCart,
        props: true,
      },
      {
        path: '/kungfuteacustomer/profile',
        component: Profile,
      },
      {
        path: '/kungfuteacustomer/updateInfo',
        component: UpdateInfo,
      },
      {
        path: '/kungfuteacustomer/settings',
        component: Settings,
      },
    ],
  },
  {
    path: '/kungfuteacashier',
    component: CashierLayout,
    children: [
      // cashier
      {
        path: '/kungfuteacashier/c_orderpage', 
        component: C_Orderpage, 
      },
    ],
  },
  {
    path: '/kungfuteamanager',
    component: ManagerLayout,
    children: [
      // cashier
      {
        path: '/kungfuteamanager/manager',
        component: Manager,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

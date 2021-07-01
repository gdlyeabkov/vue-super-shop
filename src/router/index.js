import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Product from '../views/Product.vue'
import UserCreateSuccess from '../views/UserCreateSuccess.vue'
import OrdersList from '../views/OrdersList.vue'
import Bucket from '../views/Bucket.vue'
import UsersLogin from '../views/UsersLogin.vue'
import UsersRegistry from '../views/UsersRegistry.vue'
import Amount from '../views/Amount.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product/:productID',
    name: 'product',
    component: Product
  },
  {
    path: '/users/usercreatesuccess',
    name: 'UserCreateSuccess',
    component: UserCreateSuccess
  },
  {
    path: '/admin/orders',
    name: 'OrdersList',
    component: OrdersList
  },
  {
    path: '/users/bucket',
    name: 'Bucket',
    component: Bucket
  },
  {
    path: '/users/login',
    name: 'UsersLogin',
    component: UsersLogin
  },
  {
    path: '/users/register',
    name: 'UsersRegistry',
    component: UsersRegistry
  },
  {
    path: '/users/amount',
    name: 'Amount',
    component: Amount
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

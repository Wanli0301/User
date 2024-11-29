import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../views/UserList.vue'
import UserForm from '../views/UserForm.vue'

const routes = [
  {
    path: '/',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/user/create',
    name: 'CreateUser',
    component: UserForm
  },
  {
    path: '/user/edit/:id',
    name: 'EditUser',
    component: UserForm
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
}) 
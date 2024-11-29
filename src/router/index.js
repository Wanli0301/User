import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('../layouts/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'UserList',
          component: () => import('../views/UserList.vue')
        },
        {
          path: '/user/create',
          name: 'UserCreate',
          component: () => import('../views/UserCreate.vue')
        },
        {
          path: '/user/edit/:id',
          name: 'UserEdit',
          component: () => import('../views/UserEdit.vue')
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('../views/Profile.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router 
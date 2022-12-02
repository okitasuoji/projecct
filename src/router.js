import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/User.vue'
import Power from './components/Power.vue'
import Roles from './components/Roles.vue'
import Reports from './components/Reports.vue'
import Params from './components/Params.vue'
import Orders from './components/Orders.vue'
import Goods from './components/Goods.vue'
import Categories from './components/Categories.vue'
import Add from './components/Add.vue'
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Power },
        { path: '/roles', component: Roles },
        { path: '/reports', component: Reports },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: Add },
        { path: '/categories', component: Categories },
      ]
    }
  ]
});


router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

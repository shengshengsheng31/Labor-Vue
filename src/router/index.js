import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Test from '../components/LoginInput.vue'
import LaborCreate from '../views/LaborCreate.vue'
import LaborSelect from '../views/LaborSelect.vue'
import LaborList from '../views/LaborList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { path: '/login', component: Login },
  { path: '/test', component: Test },
  { path: '/LaborCreate', component: LaborCreate },
  { path: '/LaborSelect', component: LaborSelect },
  { path: '/LaborList', component: LaborList }

]

const router = new VueRouter({
  routes
})

// 路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })

export default router

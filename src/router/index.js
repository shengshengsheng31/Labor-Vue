import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Test from '../components/LoginInput.vue'
import LaborEdit from '../views/LaborEdit.vue'
import LaborSelect from '../views/LaborSelect.vue'
import LaborList from '../views/LaborList.vue'
import Home from '../views/Home.vue'
import DetailList from '../views/DetailList.vue'
import RegisterUser from '../views/RegisterUser.vue'
import CreateDepartment from '../views/CreateDepartment.vue'
import DepartmentList from '../views/DepartmentList.vue'
import UserList from '../views/UserList.vue'

Vue.use(VueRouter)

// 重复路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/LaborList', component: LaborList },
      { path: '/LaborEdit', component: LaborEdit },
      { path: '/LaborSelect', component: LaborSelect, name: 'LaborSelect' },
      { path: '/DetailList', component: DetailList, name: 'DetailList' },
      { path: '/RegisterUser', component: RegisterUser, name: 'RegisterUser' },
      { path: '/CreateDepartment', component: CreateDepartment, name: 'CreateDepartment' },
      { path: '/DepartmentList', component: DepartmentList, name: 'DepartmentList' },
      { path: '/UserList', component: UserList, name: 'UserList' }
    ]

  },
  { path: '/login', component: Login },
  { path: '/test', component: Test }

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

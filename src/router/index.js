import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Test from '../components/LoginInput.vue'
import LaborEdit from '../views/LaborEdit.vue'
import LaborSelect from '../views/LaborSelect.vue'
import LaborManage from '../views/LaborManage.vue'
import Home from '../views/Home.vue'
import DetailList from '../views/DetailList.vue'
import RegisterUser from '../views/RegisterUser.vue'

import DepartmentManage from '../views/DepartmentManage.vue'
import UserManage from '../views/UserManage.vue'
import RoleManage from '../views/RoleManage.vue'
import MenuManage from '../views/MenuManage.vue'

Vue.use(VueRouter)

// 重复路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/LaborManage', component: LaborManage },
      { path: '/LaborEdit', component: LaborEdit },
      { path: '/LaborSelect', component: LaborSelect, name: 'LaborSelect' },
      { path: '/DetailList', component: DetailList, name: 'DetailList' },
      { path: '/RegisterUser', component: RegisterUser, name: 'RegisterUser' },

      { path: '/DepartmentManage', component: DepartmentManage, name: 'DepartmentManage' },
      { path: '/UserManage', component: UserManage, name: 'UserManage' },
      { path: '/RoleManage', component: RoleManage, name: 'RoleManage' },
      { path: '/MenuManage', component: MenuManage, name: 'MenuManage' }

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

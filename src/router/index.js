import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/Login.vue'
// import LaborEdit from '../views/LaborEdit.vue'
// import LaborSelect from '../views/LaborSelect.vue'
// import LaborManage from '../views/LaborManage.vue'
// import Home from '../views/Home.vue'
// import DetailList from '../views/DetailList.vue'
// import RegisterUser from '../views/RegisterUser.vue'
// import DepartmentManage from '../views/DepartmentManage.vue'
// import UserManage from '../views/UserManage.vue'

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
  { path: '/login', component: () => import(/* webpackChunkName: "login_home_LaborSelect" */'../views/Login.vue') },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "login_home_LaborSelect" */'../views/Home.vue'),
    children: [
      { path: '/LaborSelect', component: () => import(/* webpackChunkName: "login_home_LaborSelect" */'../views/LaborSelect.vue'), name: 'LaborSelect' },

      { path: '/LaborManage', component: () => import(/* webpackChunkName: "LaborManage_LaborEdit" */'../views/LaborManage.vue') },
      { path: '/LaborEdit', component: () => import(/* webpackChunkName: "LaborManage_LaborEdit_DetailList" */'../views/LaborEdit.vue') },
      { path: '/DetailList', component: () => import(/* webpackChunkName: "LaborManage_LaborEdit_DetailList" */'../views/DetailList.vue'), name: 'DetailList' },

      { path: '/RegisterUser', component: () => import(/* webpackChunkName: "RegisterUser_UserManage" */'../views/RegisterUser.vue'), name: 'RegisterUser' },
      { path: '/UserManage', component: () => import(/* webpackChunkName: "RegisterUser_UserManage" */'../views/UserManage.vue'), name: 'UserManage' },

      { path: '/DepartmentManage', component: () => import(/* webpackChunkName: "DepartmentManage" */'../views/DepartmentManage.vue'), name: 'DepartmentManage' }

    ]

  }

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

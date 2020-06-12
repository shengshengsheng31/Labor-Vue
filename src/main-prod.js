import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 全局样式表
import './assets/css/global.css'
// 字体图标
import './assets/fonts/iconfont.css'
// axios挂载到vue原型
import axios from 'axios'
axios.defaults.baseURL = 'http://152.136.139.149:8091'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'bearer ' + sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

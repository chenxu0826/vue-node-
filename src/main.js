// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import axios from './config/axiosConfig'
import config from './config.js'
import Utils from './utils.js'
import store from './store'
// console.log('in main')
Vue.use(Vuex)
Vue.use(axios)
Vue.use(Utils) // 自定义的工具类
Vue.use(config)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store
  components: { App },
  template: '<App/>'
})

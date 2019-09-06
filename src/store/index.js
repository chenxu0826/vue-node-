import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

import home_store from '../components/home_store.js'
import navheader_store from '../components/navheader_store.js'

export default new vuex.Store({
  state: {
    'dict': {}, // 字典数据集合
    'criminalList': [], // 罪犯基础信息集合
    'policeList': [], // 全部警员数据
    'toolList': {}, // 工具基础信息集合
    'currentPage': '' // 当前的页面
  },
  modules: {
    home: home_store,
    navheader: navheader_store
  },
  mutations: {
    setDict (state, Payload) {
      state.dict = Payload
    },
    setCriminalList (state, Payload) {
      state.criminalList[0] = Payload
    },
    setToolList (state, Payload) {
      state.toolList = Payload
    },
    setPoliceList (state, Payload) {
      state.policeList = Payload
    },
    setCurrentPage (state, Payload) {
      state.currentPage = Payload
    }
  }
})

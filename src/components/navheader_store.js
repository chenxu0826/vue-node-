export default {
  state: {
    'appTitle': '盐城监狱智慧卫生间', // 软件名称，在desktopCheck下会发生改变
    'navRightVisable': true // 右侧内容是否显示，在desktopCheck下会发生改变
  },
  mutations: {
    setAppTitle (state, Payload) {
      state.appTitle = Payload
    },
    setNavRightVisable (state, Payload) {
      state.navRightVisable = Payload
    }
  }
}

// 配置baseurl
// 接口地址
/* 基础数据接口地址 */

/* 上线版本 */
// export const BasicUrl = 'http://' + window.location.host + '/api/'
// export const BasicUrl = 'http://10.58.4.110:9510/api/' // 开发临时使用

// jsonp的方式
// $.ajax({
//   type: 'get',
//   contentType: 'application/json; charset=utf-8',
//   dataType: 'jsonp',
//   jsonp: 'callback',
//   async: false,
//   url: BasicUrl + 'HomeIndex/GetGateWayConfig' + '?callback=?',
//   success: function (result) {
//     localStorage.setItem('IP', result[0].GateWayIP)
//     localStorage.setItem('WebSocketPort', result[0].WebSocketPort)
//     localStorage.setItem('TcpPort', result[0].GateWayPort)
//   },
//   complete: function (XHR, TS) {
//     XHR = null // 回收资源
//   },
//   error: function (e) {
//     return false
//   }
// })

/* 服务请求接口地址 */
export const ajaxUrl = 'http://' + localStorage.getItem('IP') + ':' + localStorage.getItem('TcpPort')
// export const ajaxUrl = 'http://10.58.4.61:20001/'

/* 静态资源地址 */
export const IMG = ''
export const MapUrl = 'http://' + window.location.host
// export const MapUrl = "http://10.58.4.62:8889"
// export const MapUrl = 'http://10.58.1.178:9501'

export default {
  /* 全局弹窗显示变量 */
  install (Vue) {
    /* 全局本地 获取 */
    Vue.prototype.getLocalStorage = (keyName) => {
      return (localStorage.getItem(keyName))
    }
    /* 全局本地存储 */
    Vue.prototype.setLocalStorage = (keyName, keyValue) => {
      localStorage.setItem(keyName, keyValue)
    }

    /* websocket地址配置 */
    // if (localStorage.getItem('IP') != null) {
    //   Vue.prototype.ws = new WebSocket('ws:' + localStorage.getItem('IP') + ':' + localStorage.getItem('WebSocketPort'))
    // }
  }
}



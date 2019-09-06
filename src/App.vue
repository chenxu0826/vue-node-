<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <img src="/static/logo.png"> -->
    <navheader></navheader>

    <router-view></router-view>

    <menufooter></menufooter>
  </div>
</template>

<script>
import { getGateWayConfig } from './service/'
import navheader from './components/navheader.vue' // 引入组件头部导航
import menufooter from './components/menufooter.vue' // 引入组件底部菜单

export default {
  name: 'App',
  components: {
    navheader: navheader, // 引入组件头部导航
    menufooter: menufooter // 引入组件底部菜单
  },
  data() {
      return {
          
      }
  },
  created(){
    let vm = this
    vm.getGateWayConfigFunc()
  },
  mounted() {
    let vm = this
  },
  methods:{
    getGateWayConfigFunc(){
      let vm = this
      getGateWayConfig(vm).then((res) => {
        let result = eval(res.data)
        localStorage.setItem('IP', result[0].GateWayIP)
        localStorage.setItem('WebSocketPort', result[0].WebSocketPort)
        localStorage.setItem('TcpPort', result[0].GateWayPort)
        //页面刚进入时开启长连接
        vm.initWebSocket()
      }).catch((err) => {
        // 统一处理错误信息
        console.log(err)
        return false
      });
    },
    initWebSocket(){ 
      let vm = this
      let wsuri = 'ws:' + localStorage.getItem('IP') + ':' + localStorage.getItem('WebSocketPort')
      vm.ws = new WebSocket(wsuri); 
      vm.ws.onopen = vm.websocketonopen;
      vm.ws.onerror = vm.websocketonerror;
      vm.ws.onmessage = vm.websocketonmessage; 
      vm.ws.onclose = vm.websocketclose;
　　}, 
    websocketonopen() {
　　　console.log("WebSocket连接成功");
      let vm = this
      /* 保持心跳 */
      var keep_heart = {
        Header: {
          MsgID: '201501260000000001',
          MsgType: 1
        },
        Body: JSON.stringify({
          OrgID: vm.getLocalStorage('OrgID')
        })
      }
      vm.socketInterval = setInterval(function () {
        /* 保持心跳-参数-01 */
        vm.ws.send(JSON.stringify(keep_heart))
      },2000)
　　},
　　websocketonerror(e) { //错误
　　　console.log("WebSocket连接发生错误");
      let vm = this
      vm.errorInterval = setInterval(function () {
        // todo暂时取消五秒刷新
        // vm.$router.push({ path: '/' })
        // window.location.reload()
      }, 5000)
　　},
　　websocketonmessage(e){ //数据接收 
      var msg = JSON.parse(event.data)
      if (msg == null) {
        return
      }
　　}, 
　　websocketsend(agentData){//数据发送 
      let vm = this
      vm.ws.send(agentData); 
　　}, 
　　websocketclose(e){ //关闭 
　　　console.log("connection closed (" + e.code + ")"); 
      let vm = this
      vm.closeInterval = setInterval(function () {
        // todo暂时取消五秒刷新
        // vm.$router.push({ path: '/' })
        // window.location.reload()
      }, 5000)
　　}
  },
  destroyed: function() {
　　//页面销毁时关闭长连接
    let vm = this
    vm.websocketclose();
    clearInterval(vm.socketInterval)
    clearInterval(vm.errorInterval)
    clearInterval(vm.closeInterval)
　 },
}
</script>
<style>
  @import "./css/app.css";
</style>



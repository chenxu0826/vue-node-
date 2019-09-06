<template>
  <el-row class="navheader">
    <el-col :span="12" class="logo" v-if="true == true">
      <el-col :span="2">
        <img src="../assets/hui.png" alt="">
      </el-col>
      <el-col :span="22">
        <el-col :span="10">
          <p class="bold">{{appTitle}}</p>
        </el-col>
        <el-col :span="10" class="location" style="margin-top:5px">
          <p>({{siteName}})</p>
        </el-col>
      </el-col>
    </el-col>
    <el-col :span="12" class="logo logo-hui" v-else>
      <el-col :span="2">
        <img src="../assets/hu.png" alt="">
      </el-col>
      <el-col :span="22">
        <el-col :span="10">
          <p class="bold">{{appTitle}}</p>
        </el-col>
        <el-col :span="10" class="location">
          <p>({{siteName}})</p>
        </el-col>
      </el-col>
    </el-col>
<!--    <el-col v-if="navRightVisable" :span="12" class="navRight">-->
<!--      <el-col :span="16" class="title floatRight">-->
<!--        {{currentOutWorkStatus.Status}}-->
<!--      </el-col>-->
<!--      <el-col :span="8" class="title">-->
<!--        今日{{currentOutWorkStatus.Status}}:{{currentOutWorkStatus.Count}}人-->
<!--      </el-col>-->
<!--    </el-col>-->
  </el-row>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { getBindJQ } from '../service/'
export default {
  name: 'navheader',
  data () {
    return {
      siteName: '', // 监区的地点名称
      prisonSelect:[]
    }
  },
  computed: {
    ...mapState({
      appTitle: state => state.navheader.appTitle, // 软件名称，在desktopCheck下会发生改变
      navRightVisable: state => state.navheader.navRightVisable, // 右侧内容是否显示，在desktopCheck下会发生改变
      currentOutWorkStatus: state => state.outwork.currentOutWorkStatus // 当前出收工状态
    })
  },
  beforeCreate () {},
  methods: {
    /* 初始化默认监区 */
    initPrison: function () {
      let vm = this
      getBindJQ(vm,{}).then((res) => {
        vm.prisonSelect = eval(res.data)
          if (
            vm.prisonSelect[0].OrgName == '' ||
            vm.prisonSelect[0].OrgName == undefined ||
            vm.prisonSelect[0].OrgName == null
          ) {
            vm.siteName = '初始化信息屏位置失败'
          } else {
            vm.siteName = vm.prisonSelect[0].OrgName
          }
          vm.setLocalStorage('OrgID', vm.prisonSelect[0].OrgID)
          vm.setLocalStorage('DoorID', vm.prisonSelect[0].AssociatedDoor)
          vm.setLocalStorage('AreaID', vm.prisonSelect[0].AreaID)
          vm.setLocalStorage('AreaType', vm.prisonSelect[0].AreaType)
          vm.setLocalStorage('MapFlnkID', vm.prisonSelect[0].MapFlnkID)
      }).catch((err) => {
        // 统一处理错误信息
        console.log(err)
        return false
      });
    },
    /* 系统定时刷新23:59:59 */
    pageReloadByTime: function () {
      var vm = this
      setInterval(function () {
        var Hours = new Date().getHours()
        var Minutes = new Date().getMinutes()
        var Seconds = new Date().getSeconds()
        /* 系统定时刷新23:59:59 */
        if (Hours == 23 && Minutes == 59 && Seconds == 59) {
          window.location.reload()
        }
      })
    }
  },
  mounted () {
    var vm = this
    vm.pageReloadByTime()
    vm.initPrison()
  }
}
</script>
<style lang="scss">
@import "../css/navheader.scss";
</style>

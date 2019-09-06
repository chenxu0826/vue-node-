<template>
  <div class="home">
    <div class="body">
      <el-col>
        <div class="map-w">
          <div class="flow_persons">
            <div class="urineNum">
              小号池位：<font class="fontYellow">{{urineList.length}}</font>&nbsp;人
            </div>
            <div class="urineList">
                <div class="personCard-w"
                  :style="urineList.length > 6 ? {'animation': 20 + 's wordsLoop linear infinite normal'} : null"
                >
                  <div
                    class="personCard"
                    :class="{illegal:item.Type == 2,shit:item.Type !== 2,even:item.oddOrEven == 'even',odd:item.oddOrEven == 'odd'}"
                    :style="item.Status == 10 ? 'background:rgb(220, 137, 14)':null"
                    v-for="(item,index) in urineList"
                    :key="index"
                  >
                    <div class="personPhoto">
                      <img :src="item.PhotoPath">
                    </div>
                    <div class="photo-font">
                      <p>{{item.Name}}</p>
                      <p>{{item.InToiletStartTime}}</p>
                    </div>
                    <div class="groupNum">
                      {{item.GroupNum}}
                    </div>
                  </div>
                </div>
            </div>
            <div class="shitNum">
              大号坑位：<font class="fontYellow">{{shitList.length}}</font>&nbsp;人
            </div>
            <div class="shitList">
                <div class="personCard-w"
                  :style="shitList.length > 6 ? {'animation': 20 + 's wordsLoop linear infinite normal'} : null"
                >
                  <div
                    class="personCard"
                    :class="{illegal:item.Type == 2,shit:item.Type !== 2,even:item.oddOrEven == 'even',odd:item.oddOrEven == 'odd'}"
                    :style="item.Status == 10 ? 'background:rgb(220, 137, 14)':null"
                    v-for="(item,index) in shitList"
                    :key="index">
                    <div
                      class="personPhoto"
                    >
                      <img :src="item.PhotoPath">
                    </div>
                    <div class="photo-font">
                      <p>{{item.Name}}</p>
                      <p>{{item.InToiletStartTime}}</p>
                    </div>
                    <div class="groupNum">
                      {{item.GroupNum}}
                    </div>
                  </div>
                </div>
            </div>

        </div>
        </div>

      </el-col>

      <el-col :span="24">
        <div class="waiting">
          <div class="total-toilet">今日如厕：<font class="fontYellow">{{todayFinishCount}}</font>&nbsp;人</div>
          <span>待如厕：</span>
          <marquee><span v-for="(item,index) in waitToiletNameList" :key="index">&nbsp;{{item}}&nbsp;{{index+1 == waitToiletNameList.length ? '' : '、'}}</span></marquee>
        </div>

      </el-col>
    </div>

  </div>
</template>

<script>
import { ajaxUrl, MapUrl } from '../config'
import { mapState } from 'vuex'
import { getCriminalGroupNum, getInfoByAgreement } from '../service/'

export default {
  name: 'home',
  data () {
    return {
      float_personnelA: 1,
      float_personnelB: 4, // 4个一页
      prefixMapUrl: '', // 地图图片url的前缀
      mapList: [], // 所有地图数据集合
      mapScale: [], // 地图图片缩放比例集合
      currentmapScale: 0, // 当前播放的地图图片的缩放比例
      LocationPointOffset: 0, // 点位合并时使用的像素半径范围
      toolStatus: {}, // 工具清点情况

      outInnerCriminalCount: 0, // 外出监内
      outOuterCriminalCount: 0, // 外出监外

      getOrgOutCriminalDetailInterval: null,

      dialogVisible: false, // 提示框
      inToiletPeople: [],
      todayFinishCount: 0,
      urinalList: [],
      waitToiletNameList: [],
      urineList: [],
      shitList: [],
      groupNum: [] // 联号分组信息
    }
  },
  computed: {
    ...mapState({
      crimalCount_outCrimalCount: state =>
        state.home.crimalCount_outCrimalCount, // 监区人数 && 外出人数（监外）
      toolList: state => state.toolList, // 工具基础信息集合
      prisonerFlowing: state => state.home.prisonerFlowing, // 非法流动
      positionObjects: state => state.home.positionObjects, // 点位数据(合并前)
      countObject: state => state.home.countObject, // 区域各类人员数量统计对象
      personPlanObject: state => state.home.personPlanObject, // 人员清点计划
      prisonerNotOnline: state => state.home.prisonerNotOnline, // 非在线的犯人
      toolPlanObject: state => state.home.toolPlanObject, // 工具清点计划
      toolCheckSituation: state => state.toolcheck.toolCheckSituation, // 当前计划下的本监区清点情况
      Iswebsocket: state => state.home.Iswebsocket
    }),
    // 流动人员的页码控制数组
    prisonerFlowingPage: function () {
      let vm = this
      let pageIconArray = [{ circle: 'solid' }]
      let flag = vm.prisonerFlowing.length / 4
      if (flag <= 1) {
        return null
      } else {
        for (let i = 0; i < parseInt(flag); i++) {
          pageIconArray.push({ circle: 'hollow' })
        }
        return pageIconArray
      }
    },
    /* 本区域情况-区域罪犯 数量 */
    orgCriminalCnt: function () {
      var vm = this
      if (vm.countObject.CriminalCnt == undefined) {
        console.log('11号协议无数据')
        return 0
      }
      var orgCriminalCnt =
        vm.countObject.CriminalCnt.LooseManagement +
        vm.countObject.CriminalCnt.StrictManagement +
        vm.countObject.CriminalCnt.GeneralManagement +
        vm.countObject.CriminalCnt.Investigate
      return orgCriminalCnt
    },
    /* 合并后的点位数据 */
    positionObjectsMerged: function () {
      var vm = this
      var positionObjectsMerged = []
      for (var i = 0; i < vm.positionObjects.length; i++) {
        if (vm.positionObjects[i].merged != true) {
          vm.positionObjects[i].count = 1
          for (var j = i + 1; j < vm.positionObjects.length; j++) {
            // 两点之间的距离
            var distance = Math.sqrt(
              Math.pow(vm.positionObjects[i].X - vm.positionObjects[j].X, 2) +
                Math.pow(vm.positionObjects[i].Y - vm.positionObjects[j].Y, 2)
            )
            if (distance <= vm.LocationPointOffset) {
              vm.positionObjects[i].count++
              vm.positionObjects[j].merged = true
            }
          }
          positionObjectsMerged.push(vm.positionObjects[i])
        }
      }
      return positionObjectsMerged
    }
  },
  methods: {
    /* 获取联号信息 */
    getGroupNum: function () {
      var vm = this
      getCriminalGroupNum(vm,{ OrgID: localStorage.getItem('OrgID') }).then((res) => {
        let result = eval(res.data)
        if(result && result.length){
          vm.groupNum = result
        }
      }).catch((err) => {
        // 统一处理错误信息
        console.log(err)
        return false
      });
    },
    // 计算时间差
    formateData (date) {
      var date1 = date  // 开始时间
      var date2 = new Date()    // 结束时间
      var date3 = date2.getTime() - new Date(date1).getTime()   // 时间差的毫秒数

      if (date3 < 0) {
        return '00:00'
      }
      // ------------------------------
      // 计算出相差天数
      // var days = Math.floor(date3 / (24 * 3600 * 1000))

      // 计算出小时数
      var leave1 = date3 % (24 * 3600 * 1000)    // 计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      var leave2 = leave1 % (3600 * 1000)        // 计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000))
      // 计算相差秒数
      var leave3 = leave2 % (60 * 1000)      // 计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000)
      
      return (hours > 0 ? '1小时以上' : (minutes < 10 ? '0' + minutes : minutes) + ' :' + (seconds < 10 ? '0' + seconds : seconds))
    },
    // 获取如厕信息
    getCriminalToiletInfo: function () {
      let vm = this
      // let send = {
      //   Header: {
      //     MsgID: '201501260000000003',
      //     MsgType: 108
      //   },
      //   Body: JSON.stringify({
      //     OrgID: "d332edff-eea0-4a9f-9086-3908a40414b5"
      //   })
      // }
      let send = {"Header":{"MsgID":"201501260000000003","MsgType":82},"Body":"{\"OrgID\":\"d332edff-eea0-4a9f-9086-3908a40414b5\"}"}
      getInfoByAgreement(vm,send).then((res) => {
        let result = eval(res.data)
        console.log(result)
      }).catch((err) => {
        // 统一处理错误信息
        console.log(err)
        return false
      });
      // vm.$ajax({
      //   url: ajaxUrl,
      //   data: JSON.stringify(send),
      //   success: function (result) {
      //     if (result && result.InToiletPeople && result.InToiletPeople.length >= 0) {
      //       vm.urineList = []
      //       vm.shitList = []
      //       result.InToiletPeople.map((item,index) => {
      //         item.InToiletStartTime = vm.formateData(item.InToiletStartTime)
              
      //         // 添加联号分组信息
      //         vm.groupNum.map((item1,index1)=>{
      //           if(item1.FlnkID == item.FlnkID){
      //             item.GroupNum = item1.GroupNum
      //           }
      //         })

      //         if (item.Type == 2) {
      //           vm.urineList.push(item)
      //         }
      //         if (item.Type == 1) {
      //           vm.shitList.push(item)
      //         }
      //         // console.log(vm.shitList)
      //       })

      //       // 小号按分组信息排序
      //       vm.urineList.sort(function(x,y){
      //         return x.GroupNum - y.GroupNum
      //       })
      //       // 小号间隔显示
      //       for(let i in vm.urineList){
      //         if(vm.urineList[i - 1] && vm.urineList[i - 1].oddOrEven){
      //           if(vm.urineList[i - 1].GroupNum !== vm.urineList[i].GroupNum){
      //               vm.urineList[i].oddOrEven = (vm.urineList[i-1].oddOrEven == 'odd' ? 'even' : 'odd')
      //           }else{
      //             vm.urineList[i].oddOrEven = (vm.urineList[i-1].oddOrEven == 'odd' ? 'odd' : 'even')
      //           }
      //         }else{
      //           vm.urineList[i].oddOrEven = 'odd'
      //         }
      //       }
            
      //       // 大号按分组信息排序
      //       vm.shitList.sort(function(x,y){
      //         return x.GroupNum - y.GroupNum
      //       })

      //       // 大号间隔显示
      //       for(let i in vm.shitList){
      //         if(vm.shitList[i - 1] && vm.shitList[i - 1].oddOrEven){
      //           if(vm.shitList[i - 1].GroupNum !== vm.shitList[i].GroupNum){
      //              vm.shitList[i].oddOrEven = (vm.shitList[i-1].oddOrEven == 'odd' ? 'even' : 'odd')
      //           }else{
      //             vm.shitList[i].oddOrEven = (vm.shitList[i-1].oddOrEven == 'odd' ? 'odd' : 'even')
      //           }
      //         }else{
      //           vm.shitList[i].oddOrEven = 'odd'
      //         }
      //       }
      //       // console.log(vm.shitList)
      //     }
      //     vm.todayFinishCount = result.TodayFinishCount > 0 ? result.TodayFinishCount : 0
      //     vm.inToiletPeople = result.InToiletPeople
      //     vm.waitToiletNameList = result.WaitToiletNameList
      //   }
      // })
    },

    // 获取监区人员外出明细（监内&监外）
    getOrgOutCriminalDetail: function () {
      let vm = this
      let send = {
        Header: {
          MsgID: '201501260000000003',
          MsgType: 82
        },
        Body: JSON.stringify({
          OrgID: localStorage.getItem('OrgID')
        })
      }
      vm.$ajax({
        url: ajaxUrl,
        data: JSON.stringify(send),
        success: function (result) {
          vm.outInnerCriminalCount = result.InnerPersons.length
          vm.outOuterCriminalCount = result.OuterPersons.length
        }
      })
    },
    /* 轮播切换时触发的回调函数 */
    carouselChange: function (currentIndex, prevIndex) {
      var vm = this
      $('#mapTitle')
        .children()
        .eq(currentIndex)
        .siblings()
        .css('border-bottom', '')
      $('#mapTitle')
        .children()
        .eq(currentIndex)
        .css('border-bottom', '3px solid #fff')
      vm.$store.commit('setPositionObjects', [])
      vm.currentmapScale = vm.mapScale[currentIndex]
      vm.setLocalStorage('currentMapID', vm.mapList[currentIndex].FlnkID)
    },
    /* 重新处理地图的宽高比例以适应父div */
    scaleMapImg: function () {
      var vm = this
      var divH = $('#myMap').height()
      var divW = $('#myMap').width()

      for (var i in vm.mapList) {
        var hScale = divH / vm.mapList[i].Height
        var wScale = divW / vm.mapList[i].Width
        if (hScale < wScale) {
          vm.mapList[i].Height = divH
          vm.mapList[i].Width = vm.mapList[i].Width * hScale
          vm.mapScale.push(hScale)
        } else {
          vm.mapList[i].Height = vm.mapList[i].Height * wScale
          vm.mapList[i].Width = divW
          vm.mapScale.push(wScale)
        }
      }
    }
  },
  watch: {

  },
  mounted () {
    var vm = this
    vm.prefixMapUrl = MapUrl
    vm.getGroupNum()
    vm.getCriminalToiletInfo()
    vm.getOrgOutCriminalDetail()
    vm.criminalToiletInfo = setInterval(() => {
      vm.getCriminalToiletInfo()
    }, 5000)
    // 5秒钟没有数据 刷新界面
    setInterval(function () {
      // todo暂时取消5秒刷新页面
      if (vm.Iswebsocket == 0) {
        // vm.$router.push({ path: '/' })
        // window.location.reload()
      }
    }, 5000)
  },
  beforeDestroy: function () {
    let vm = this
    clearInterval(vm.criminalToiletInfo)
    clearInterval(vm.toolStatus)
    clearInterval(vm.getOrgOutCriminalDetailInterval)
    vm.criminalToiletInfo = null
    vm.toolStatus = null
    vm.getOrgOutCriminalDetailInterval = null
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../css/home.scss";
</style>

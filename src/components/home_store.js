export default {
  state: {
    'crimalCount_outCrimalCount': {}, // 监区人数 && 外出人数（监外）

    'prisonerFlowing': [], // 流动人员
    'positionObjects': [], // 点位数据
    'countObject': {}, // 区域各类人员数量统计对象
    'personPlanObject': {}, // 人员清点计划
    'toolPlanObject': {}, // 工具清点计划
    'prisonerNotOnline': [], // 非在线的犯人
    'Iswebsocket': 0, // 是否建立websocket
    'IllegalIntoToilet': '' // 未经允许如厕推送
  },
  mutations: {
    setCrimalCount_outCrimalCount (state, Payload) {
      state.crimalCount_outCrimalCount = Payload
    },
    setPrisonerFlowing (state, Payload) {
      state.prisonerFlowing = Payload
    },
    setPositionObjects (state, Payload) {
      state.positionObjects = Payload
    },
    setCountObject (state, Payload) {
      state.countObject = Payload
    },
    setPersonPlanObject (state, Payload) {
      state.personPlanObject = Payload
    },
    setToolPlanObject (state, Payload) {
      state.toolPlanObject = Payload
    },
    setPrisonerNotOnline (state, Payload) {
      state.prisonerNotOnline = Payload
    },
    setIswebsocket (state, Payload) {
      state.Iswebsocket = Payload
    },
    setIllegalIntoToilet (state, Payload) {
      state.IllegalIntoToilet = Payload
    }
  }
}

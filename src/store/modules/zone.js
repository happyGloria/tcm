export default {
  state: {
    activeZoneNode: null,
    zoneTab: 'list' // 激活的选项卡名称 'list' || 'map' 主要用于地图的初始化
  },
  mutations: {
    SET_ACTIVE_NODE: (state, node) => {
      state.activeZoneNode = node
    },
    SET_TAB: (state, tabName) => {
      state.zoneTab = tabName
    }
  },
  actions: {
    SET_ACTIVE_ZONE_NODE: ({ commit }, node) => {
      commit('SET_ACTIVE_NODE', node)
    },
    SET_ZONE_TAB: ({ commit }, tabName) => {
      commit('SET_TAB', tabName)
    }
  }
}

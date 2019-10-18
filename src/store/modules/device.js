export default {
  state: {
    portTotal: 0,
    mapCameras: [],
    lostCameras: []
  },
  mutations: {
    CHANGE_PORTTOTAL: (state, obj) => {
      var n = Number(obj.num)
      if (!obj.flag) {
        state.portTotal += n
      } else {
        state.portTotal = n
      }
    },
    EDIT_MAP (state, obj) {

    },
    PUSH_MAP (state, obj) {

    },
    DEL_FROM_MAP (state, obj) {

    },
    PUSH_LOST (state, list) {

    },
    DEL_FROM_LOST (state, obj) {

    },
    CLEAR_ZONE (state) {
      state.lostCameras = []
      state.mapCameras = []
    }
  },
  actions: {
    ChangePortTotal: ({ commit }, obj) => {
      commit('CHANGE_PORTTOTAL', obj)
    },
    pushMap ({ commit }, obj) {
      return new Promise(resolve => {
        commit('PUSH_MAP', obj)
        resolve()
      })
    },
    delFromMap ({ commit }, obj) {
      return new Promise(resolve => {
        commit('DEL_FROM_MAP', obj)
        resolve()
      })
    },
    pushLost ({ commit }, obj) {
      return new Promise(resolve => {
        commit('PUSH_LOST', obj)
        resolve()
      })
    },
    delFromLost ({ commit }, obj) {
      return new Promise(resolve => {
        commit('DEL_FROM_LOST', obj)
        resolve()
      })
    },
    clearZone ({ commit }) {
      return new Promise(resolve => {
        commit('CLEAR_ZONE')
      })
    }
  }
}

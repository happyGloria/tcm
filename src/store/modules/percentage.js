import { Message } from 'element-ui'
export default {
  state: {
    timer_upload: null,
    uploadStatus: '',
    uploadLoading: !1,
    isHideUpload: !1,
    isUploaded: !1,
    ajaxing: !1,
    fileList: []
  },
  mutations: {
    CHANGE_UPLOADSTATUS: (state, cbFn) => {
      state.uploadLoading = !0
      function clearTimers (r, cbFn) {
        if (state.timer_upload) {
          clearInterval(state.timer_upload)
        }
        Message({
          message: r.err,
          type: 'error',
          duration: 2000
        })
        state.uploadStatus = ''
        state.uploadLoading = !1
        cbFn && cbFn()
      }
      state.timer_upload = setInterval(() => {
        Service.updatePercentage().then(
          r => {
            if (r && r.retCode == 1) {
              state.uploadStatus = r.err
              state.uploadLoading = !0
            } else {
              clearTimers(r, cbFn)
            }
          },
          r => {
            clearTimers(r, cbFn)
            if (r.cbFn) r.cbFn()
          }
        )
      }, 1000)
    },
    CHANGE_COMPSTATUS: (state, data) => {
      state.isHideUpload = data.isHideUpload
      state.isUploaded = data.isUploaded
      state.ajaxing = data.ajaxing
      state.fileList = data.fileList
    }
  },
  actions: {
    GetUploadPercent: ({ commit }, cbFn) => {
      commit('CHANGE_UPLOADSTATUS', cbFn)
    },
    ChangeCompUploadStatus ({ commit }, data) {
      commit('CHANGE_COMPSTATUS', data)
    }
  }
}

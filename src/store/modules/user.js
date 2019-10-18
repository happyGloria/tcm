import FINAL from '@/data/final.js'
import { MessageBox } from 'element-ui'
import { Encrpt } from '@/utils/endecrept.js'
var tt = {
  syncType: [
    { id: '0', name: '不同步（默认）' },
    { id: '1', name: '仅系统配置' },
    { id: '2', name: '全部' }
  ],
  userType: [
    { id: '0', name: '超级用户' },
    { id: '1', name: '管理员' },
    { id: '2', name: '普通用户' }
  ],
  accessType: [
    { id: 'dv', name: '数字摄像机' },
    { id: 'Encoder', name: '编码器' },
    { id: 'VideoPlatform', name: '第三方视频平台' }
  ],
  streamMode: [
    { id: '0', name: '空' },
    { id: '1', name: '接入转发服务' },
    { id: '2', name: '前端摄像机' },
    { id: '3', name: '前端摄像机(组播)' }
  ],
  BackUpDays: [
    { id: '1', name: '1天' },
    { id: '3', name: '3天' },
    { id: '5', name: '5天' },
    { id: '7', name: '7天' },
    { id: '15', name: '15天' }
  ],
  status: [{ id: '0', name: '离线' }, { id: '1', name: '在线' }]
}

const user = {
  state: {
    userId: '',
    username: '',
    userType: '',
    siteId: '',
    siteName: '',
    siteType: '',
    version: '',
    curSite: {},
    bjVMS: 0
  },
  mutations: {
    SET_USERINFO: (state, { id, name, userType }) => {
      state.userId = id
      state.username = name
      state.userType = userType
    },
    SET_SITEINFO: (state, { siteId, siteName, siteType, version }) => {
      state.siteId = '' + siteId
      state.siteName = siteName
      state.siteType = siteType
      state.version = version
    }
  },
  actions: {
    CheckKickout ({ dispatch }, cbFn) {
      Service.isKicked().then(r => {
        if (r && r.items.status == 1) {
          MessageBox.alert('此账号在其它设备上登录，您已被强制退出！', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              dispatch('ClearSession', () => location.reload())
            }
          })
          cbFn && cbFn()
        } else {
          dispatch('CheckKickout', cbFn)
        }
      })
    },
    initConst ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        Service.listConst().then(({ items }) => {
          // TODO:
          var { deviceType } = items
          var serverType = [],
            cameraType = []
          deviceType.forEach(item => {
            if (item.parentId == 'Server') serverType.push(item)
            if (item.parentId == 'Camera') cameraType.push(item)
          })
          var data = Object.assign({ serverType, cameraType }, items)
          $.db.setConsts(Object.assign({}, data, tt))
          var ff = {}
          for (var key in data) {
            var list = data[key]
            ff[key] = {
              default: '',
              list: list.map(item => {
                var ll = {}
                ll[item.id] = item.name
                return ll
              })
            }
          }
          $.db.setFinal(Object.assign({}, FINAL, ff))
          resolve()
        })
      })
    },
    StartSession ({ dispatch, commit }, obj) {
      return new Promise((resolve, reject) => {
        var {
          bjVMS = 0,
          userType,
          lineInfo: { sites }
        } = obj
        $.db.setSites(
          sites.map(site =>
            Object.assign({}, site, {
              id: '' + site.id,
              icon: site.siteType
            })
          )
        )
        $.db.setBJVMS(bjVMS)
        $.db.setUserType(userType)
        commit('SET_USERINFO', obj)
        // 当前站点信息
        var curSite = {}
        for (var i = 0; i < sites.length; i++) {
          var item = sites[i]
          if (item.id == obj.siteId) {
            curSite = item
          }
        }
        commit('SET_SITEINFO', {
          siteId: obj.siteId,
          version: obj.version || '暂无版本信息',
          siteName: curSite.name || '',
          siteType: curSite.siteType || ''
        })
        dispatch('initConst').then(() => resolve(obj))
      })
    },
    Login ({ dispatch, commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        password = Encrpt(password)
        Service.login({ username, password })
          .then(({ data }) => {
            $.db.setSessionKey(data.id + '-' + data.siteId)
            resolve()
          })
          .catch(r => reject(r))
      })
    },
    CheckSession ({ dispatch }) {
      return new Promise((resolve, reject) => {
        Service.checkSession()
          .then(({ data }) => {
            dispatch('StartSession', data).then(r => {
              $.db.setSessionKey(r.id + '-' + r.siteId)
              dispatch('CheckKickout')
              resolve(data)
            })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    ClearSession ({ commit }, cbFn) {
      commit('SET_USERINFO', {})
      commit('SET_SITEINFO', {})
      $.db.clear()
      cbFn && cbFn()
    },
    LogOut ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        Service.logout(state)
          .then(() => {
            dispatch('ClearSession', () => resolve())
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user

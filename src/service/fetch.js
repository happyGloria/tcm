import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { Notification, Message, MessageBox } from 'element-ui'
import listApis from './api.js'
import FetchMock from './mock/index.js'

Vue.prototype.$http = axios

var apiPrefix = process.env.NODE_ENV === 'production' ? '' : '/api'

Util.getMapUrl = function (url) {
  return `${apiPrefix}/map/${url}`
}
Util.formatApi = function (url) {
  return `${apiPrefix}${url}`
}
Vue.prototype.$API = {
  UPLOAD_MAP: Util.formatApi('/deviceZone/uploadMap.do'),
  IMPORT_DATA: Util.formatApi('/settings/importData.do')
}

var Test = !1,
  Service = {},
  axiosObj = axios.create({
    timeout: 30000
  })

axiosObj.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Message({
      message: '错误的传参',
      type: 'error',
      duration: 1000
    })
    Promise.reject(error)
  }
)
axiosObj.interceptors.response.use(
  response => {
    const res = response.data
    if (
      response.headers &&
      response.headers['content-type'] &&
      response.headers['content-type'].indexOf('ms-excel') > -1
    ) {
      return Promise.resolve(response)
    }

    let isUploadResponse =
      ['/settings/importData/percentage'].filter(d => {
        return response.request.responseURL.indexOf(d) > -1
      }).length > 0
    if (res.retCode !== 1) {
      if (res.retCode === -1) {
        if (isUploadResponse) {
          return Promise.reject(
            Object.assign(res, {
              cbFn: () => {
                setTimeout(
                  () => store.dispatch('ClearSession', () => location.reload()),
                  2000
                )
              }
            })
          )
        }
        var err = res.err || '你已被登出，继续操作，请重新登录'
        return MessageBox.alert(err, '提示', {
          confirmButtonText: '重新登录',
          callback: action => {
            store.dispatch('ClearSession', () => location.reload())
          }
        })
      } else if (res.retCode === -2) {
        store.dispatch('ClearSession', () => location.reload())
        return false
      }
      Message({
        message: res.err,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  },
  err => {
    let {
      response: { status, statusText }
    } = err
    Notification({
      title: '错误',
      type: 'error',
      message: `${status}, ${statusText}`,
      duration: 3 * 1000
    })
    return Promise.reject(err)
  }
)

function formatURL (URL, params) {
  var reg = /\/\{(.+?)\}/g
  if (reg.test(URL)) {
    return URL.replace(reg, ($0, $1) => {
      return '/' + params[$1]
    })
  }
  return URL
}

listApis(apiPrefix).forEach(v => {
  if (Service[v[0]]) {
    Message('接口名称:' + v[0] + '已被占用，请修改！', 'fail')
    return false
  }
  Service[v[0]] = params => {
    var settings = {
      url: formatURL(v[1], params) + '.do',
      method: v[2],
      data: params || {}
    }

    if (v[3] === 'blob') {
      settings.responseType = v[3]
    }
    /* if (v[3] === 'text/plain') {
      settings.data = JSON.stringify(params)
      settings.headers = {
        'Content-type': v[3]
      }
    } */
    return Test ? FetchMock(v[0], settings) : axiosObj(settings)
  }
})

export default (window.Service = Service)

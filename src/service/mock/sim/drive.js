import T from '../query.js'
import Mock from 'mockjs'
var driverList = Mock.mock({
  'items|10': [{
    'id|+1': 1,
    'name|1': ['驱动1', '驱动2', '驱动3', '驱动4', '驱动5'],
    'driverType|1': ['Server', 'Decoder'],
    'provider|1': ['海康', '大华'],
    'style|1': ['sdk', 'onvif'],
    'username': 'user1',
    'password': 'user1',
    'port': '8080',
    'desc|1': /[\u4e00-\u9fa5]{2,5}/,
    'driverParam|1-5': /[a-z][A-Z][0-9]/,
    'secondParam|1-5': /[a-z][A-Z][0-9]/,
    'monitorParam|1-5': /[a-z][A-Z][0-9]/,
    'recordParam|1-5': /[a-z][A-Z][0-9]/,
    'otherParam|1-5': /[a-z][A-Z][0-9]/
  }]
})
export default {
  listDriver (param) {
    var data = param.id ? {
      data: driverList.items[0]
    } : driverList
    return T.fr({
      total: data.length,
      ...data
    })
  },
  getDriverSync () {
    return T.fr({
      'data': {
        DriverSync: 1
      }
    })
  },
  setDriverSync () {
    return T.fr()
  },
  editDriver () {
    return T.fr()
  }
}

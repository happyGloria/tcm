import T from '../query.bak.js'
var sites = T.page('site', {}).items,
  username = '',
  getSession = function (name) {
    username = name || username
    var curSite = sites[0]
    return T.fr({
      data: {
        lineInfo: {
          sites,
          roles: []
        },
        name: username,
        account: username,
        userType: username == 'admin' ? 1 : 0,
        id: curSite.id,
        siteId: curSite.id,
        currentSite: curSite,
        gbFlag: true
      }
    })
  }
export default {
  // params : {username, password}
  login (param) {
    return getSession(param.username)
  },
  checkSession () {
    return getSession()
  },
  logout () {
    return T.fr({})
  },
  isKicked () {
    return T.fr({
      'items': {
        'status': 0
      }
    })
  },
  listConst () {
    return T.fr({
      items: {
        'deviceType': [{
          'code': 0,
          'id': '1',
          'name': '球机',
          'orderNo': 1,
          'parentId': 'Camera',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'TNM',
          'name': '网管服务器',
          'orderNo': 1,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'Server',
          'name': '服务器',
          'orderNo': 1,
          'parentId': '',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': '2',
          'name': '半球',
          'orderNo': 2,
          'parentId': 'Camera',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'TVS',
          'name': '视频服务器',
          'orderNo': 2,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'Camera',
          'name': '摄像机',
          'orderNo': 2,
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': '3',
          'name': '固定枪机',
          'orderNo': 3,
          'parentId': 'Camera',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'TVR',
          'name': '存储服务器',
          'orderNo': 3,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'Encoder',
          'name': '视频编码器',
          'orderNo': 3,
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'TFS',
          'name': '流媒体服务器',
          'orderNo': 4,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'Decoder',
          'name': '视频解码器',
          'orderNo': 4,
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'KBS',
          'name': '键盘服务',
          'orderNo': 5,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'Keyboard',
          'name': '网络键盘',
          'orderNo': 5,
          'parentId': '',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'VideoAnalysis',
          'name': '视频分析服务器',
          'orderNo': 6,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'VideoDiagnose',
          'name': '视频诊断服务器',
          'orderNo': 7,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'VideoPlatform',
          'name': '第三方视频平台',
          'orderNo': 8,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'CloudStorage',
          'name': '云存储服务器',
          'orderNo': 9,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'SuperiorGB',
          'name': '上级国标',
          'orderNo': 10,
          'parentId': 'Server',
          'type': 'deviceType'
        }, {
          'code': 0,
          'id': 'SubordinateGB',
          'name': '下级国标',
          'orderNo': 11,
          'parentId': 'Server',
          'type': 'deviceType'
        }],
        'siteType': [{
          'code': 1,
          'id': 'OCC',
          'name': '上级部门',
          'orderNo': 1,
          'type': 'siteType'
        }, {
          'code': 1,
          'id': 'Station',
          'name': '车站',
          'orderNo': 3,
          'type': 'siteType'
        }]
      }
    })
  }
}

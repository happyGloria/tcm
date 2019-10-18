import Mock from 'mockjs'

let db_sites = {},
  db_roles = {},
  db_users = {}
let const_sites = [
    '上级部门',
    '车站1',
    '车站1289'
  ],
  const_roles = [
    'TCC调度员',
    '控制中心防灾值班员',
    '控制中心行车调度员',
    '控制中心电力调度员',
    '控制中心AFC调度员',
    '车辆段 / 停车场防灾值班员',
    '车辆段 / 停车场行车值班员',
    '车辆段 / 停车场运转值班员',
    '车辆段 / 停车场安保值班员',
    '车站防灾值班员',
    '车站行车值班员',
    '换乘线路车站值班员',
    '公安车站值班员',
    '公安派出所调度员',
    '公安派出所值班员',
    '公交总队调度员及其它部门人员'
  ]
let SITES = Array.from(const_sites).map((name, idx) => {
  let id = Mock.Random.integer(1, 9999)
  let site = Mock.mock({
    'id': id,
    'no': id,
    'siteId': id,
    'name': name,
    'siteType': idx > 0 ? 'Station' : 'OCC',
    'ip': '@ip()',
    'code': '@integer(0, 1)',
    'desc': '@word',
    'createTime': '' + Mock.Random.date('T')
  })
  db_sites[id] = site
  return site
})
let ROLES = Array.from(const_roles).map(name => {
  let id = Mock.Random.integer(1, 9999),
    site = Mock.mock({
      'id': id,
      'name': name,
      'siteType|1': ['OCC', 'Station'],
      'siteId|1': Object.keys(db_sites),
      'no': id,
      'ip': '@ip()',
      access: JSON.stringify({
        'record': true,
        'download': true,
        'ip': '192.168.12.88,178.44.22.33',
        'real': {
          Site: '9705000134,9705000135'.split(','),
          Civil: '402-DeviceZone-1,402-DeviceZone-4,402-DeviceZone-2,402-DeviceZone-5,402-DeviceZone-3,402-DeviceZone-6'.split(','),
          Camera: []
        },
        'ptz': {
          Site: [],
          Camera: '9705000134,9705000135'.split(','),
          Civil: '402-DeviceZone-1,402-DeviceZone-4,402-DeviceZone-2,402-DeviceZone-5,402-DeviceZone-3,402-DeviceZone-6'.split(',')
        },
        'monitor': '1,2'
      })
    })
  db_roles[id] = site
  return site
})

Array.from({
  length: 9
}).map(idx => {
  let id = Mock.Random.integer(1, 9999),
    user = Mock.mock({
      id,
      'mappingId': id,
      'no': id,
      'siteId|1': Object.keys(db_sites),
      'userType|1': [0, 1, 2],
      'code|1': ['0', '1'],
      'ip': '@ip()',
      'name|1': ['admin', 'user1', 'user2'],
      'account|1': ['admin', 'user1', 'user2'],
      'role|1': Object.keys(db_roles),
      'userLevel|1-999': 100,
      'desc|1-10': /[a-z][A-Z][0-9]/
    })
  db_users[id] = user
  return user
})

let sql_const = {
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
export default {
  sql_const,
  lineInfo: {
    'id': 1289000002,
    'siteId': 1289,
    'password': '21232F297A57A5A743894A0E4A801FC3',
    'lineInfo': {
      'id': 1,
      sites: SITES,
      roles: ROLES
    }
  },
  db_roles,
  db_sites,
  db_users
}

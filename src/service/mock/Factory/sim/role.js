var fs = require('fs'),
  path = require('path'), // 系统路径模块,
  Mock = require('mockjs'),
  sites = require('./site.json'),
  db_roles = {},
  ROLElIST = [
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

ROLElIST.forEach((name, idx) => {
  var id = Mock.mock('@id'),
    site = Object.values(Mock.mock({
      'site|1': sites
    }).site)[0]
  var access = JSON.stringify({
    'record': true,
    'download': true,
    'ip': '192.168.12.88,178.44.22.33',
    'real': {
      'Site| 2-3': Object.keys(Mock.mock({
        'site|1': sites
      }).site),
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
  db_roles[id] = Mock.mock({
    'id': id,
    'no': id,
    'name': name,
    'siteType': site.siteType,
    'siteId': site.siteId,
    'ip': '@ip()',
    access
  })
})
var file = path.join(__dirname, '/role.json'),
  content = JSON.stringify(db_roles)

fs.writeFile(file, content, function (err) {
  if (err) {
    return console.log(err)
  }
  console.log('文件创建成功，地址：' + file)
})

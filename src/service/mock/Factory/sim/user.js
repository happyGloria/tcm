import {
  times
} from 'lodash'
var fs = require('fs'),
  path = require('path'), // 系统路径模块,
  Mock = require('mockjs'),
  sites = require('./site.json'),
  roles = require('./role.json'),
  db_user = {}
times(10).forEach(d => {
  var id = Mock.mock('@id'),
    name = Mock.mock('@cname')
  db_user[id] = Mock.mock({
    id,
    account: name,
    name: name,
    password: '@first',
    mappingId: '',
    'siteId|1': Object.keys(sites),
    'role|1': Object.keys(roles),
    'userLevel|1-999': 999,
    'userType|1': [1, 2]
  })
})

var file = path.join(__dirname, '/user.json'),
  content = JSON.stringify(db_user)

fs.writeFile(file, content, function (err) {
  if (err) {
    return console.log(err)
  }
  console.log('文件创建成功，地址：' + file)
})

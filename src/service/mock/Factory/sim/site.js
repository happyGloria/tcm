var fs = require('fs')
var path = require('path') // 系统路径模块
var Mock = require('mockjs')

var SITELIST = [
  '安河桥北',
  '北宫门',
  '西苑',
  '圆明园',
  '北京大学东门',
  '中关村',
  '海淀黄庄',
  '人民大学',
  '魏公村',
  '国家图书馆',
  '动物园',
  '西直门',
  '新街口',
  '平安里',
  '西四',
  '灵境胡同',
  '西单',
  '宣武门',
  '菜市口',
  '陶然亭',
  '北京南站',
  '马家堡',
  '角门西',
  '公益西桥',
  '新宫',
  '西红门',
  '高米店北',
  '高米店南',
  '枣园',
  '清源路',
  '黄村西大街',
  '黄村火车站',
  '义和庄',
  '生物医药基地',
  '天宫院'
]
var db_sites = {}
SITELIST.forEach((name, idx) => {
  var id = Mock.mock('@id')
  db_sites[id] = Mock.mock({
    id,
    name: name,
    no: id,
    siteId: id,
    siteType: idx > 0 ? 'Station' : 'OCC',
    ip: '@ip()',
    code: '@integer(0, 1)',
    desc: '@word',
    createTime: '' + Mock.Random.date('T')
  })
})
var file = path.join(__dirname, '/site.json'),
  content = JSON.stringify(db_sites)

fs.writeFile(file, content, function (err) {
  if (err) {
    return console.log(err)
  }
  console.log('文件创建成功，地址：' + file)
})

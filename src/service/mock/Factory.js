import Mock from 'mockjs'
import {
  times,
  random
} from 'lodash'
var SiteNames = '朱辛庄站,育知路站,平西府站,回龙观东大街站,霍营站,育新站,西小口站,永泰庄站,林萃桥站,森林公园南门站,奥林匹克公园站,奥体中心站,北土城站'.split(',')
var SiteIds = times(SiteNames.length - 1, d => Mock.Random.guid())
var zoneNames = '站台层,站厅层,通道层,出入口层,设备区层,票务室'.split(',')
var FF = {
  Sites: {},
  Zones: {},
  Cameras: {},
  MapCameras: {},
  NoMapCameras: {}
}
function genSites () {
  for (let i = 0; i < SiteIds.length; i++) {
    var id = SiteIds[i],
      name = SiteNames[i]
    FF.Sites[id] = Mock.mock({
      'id': id,
      'siteId': id,
      'name': name,
      'parentId': '',
      'nodeType': 'Site',
      'total': Mock.Random.integer(100, 999)
    })
  }
}
function genZones () {
  for (var j = 0; j < SiteIds.length; j++) {
    for (let i = 0; i < random(0, 5); i++) {
      var id = Mock.Random.guid(),
        siteId = FF.Sites[SiteIds[j]].id
      FF.Zones[id] = Mock.mock({
        'id': id,
        'siteId': siteId,
        'parentId': siteId,
        'name': zoneNames[i],
        'nodeType': 'Zone',
        'total': random(1, 99)
      })
      if (i % 3 == 0) {
        FF.Zones[id].list = Mock.mock({
          1: random(1, 22),
          2: random(1, 55),
          3: random(1, 33)
        })
      }
    }
  }
}
function genCameras () {
  for (let i = 0; i < 100; i++) {
    var id = Mock.Random.id()
    FF.Cameras[id] = Mock.mock({
      'id': id,
      'deviceSubType': random(1, 3),
      'siteId': SiteIds[random(0, SiteIds.length - 1)],
      'name': '@ctitle(4, 10)',
      'ip': '@ip',
      'zoneName|1': zoneNames,
      'channelNum': random(1, 65535),
      'inMap': '@boolean()'
    })
  }
}

function genMapCameras () {
  for (var key in FF.Cameras) {
    var item = FF.Cameras[key]
    if (item.inMap) {
      FF.MapCameras[item.id] = item
    } else {
      FF.NoMapCameras[item.id] = item
    }
  }
}
genSites()
genZones()
genCameras()
genMapCameras()

export default FF
/*
module.exports = () => {
  // 使用 Mock
  var data = Mock.mock({
    'course|227': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1000,
      course_name: '@ctitle(5,10)',
      autor: '@cname',
      college: '@ctitle(6)',
      'category_Id|1-6': 1
    }],
    'course_category|6': [{
      'id|+1': 1,
      'pid': -1,
      cName: '@ctitle(4)'
    }]
  })
  // 返回的data会作为json-server的数据
  return data

  var data2 = Mock.mock({
    'list|2': [{
      'id|+1': 1,
      'color': '@color()',
      'date': '@datetime()',
      'img': '@image()',
      'url': '@url(http)',
      'email': '@email()',
      'name': "@name(1,2)",
      'text': '@paragraph()'
    }]
  })
} */


import T from '../query.js'

export default {
  syncCameraInfo () {
    return T.fr()
  },
  listMonitor () {
    return T.fr({
      items: [{
        id: '1',
        name: '监视器1'
      },
      {
        id: '2',
        name: '监视器2'
      },
      {
        id: '3',
        name: '监视器3'
      },
      {
        id: '4',
        name: '监视器4'
      },
      {
        id: '5',
        name: '监视器5'
      }
      ]
    })
  },
  listDeviceCount () {
    return T.fr({
      items: [{
        'siteType': 'OCC',
        'siteId': 9720,
        'siteName': '八通线控制中心',
        'devices': [{
          'count': 1,
          'type': 'TNM'
        }, {
          'count': 2,
          'type': 'TVS'
        }, {
          'count': 2,
          'type': 'VideoAnalysis'
        }, {
          'count': 3,
          'type': 'Storage'
        }, {
          'count': 44,
          'type': 'camera'
        },
        {
          'count': 2,
          'type': 'encoder'
        }
        ]
      }, {
        'siteType': 'Station',
        'siteId': 9701,
        'siteName': '四惠站',
        'devices': [{
          'count': 1,
          'type': 'TNM'
        }, {
          'count': 2,
          'type': 'TVS'
        }, {
          'count': 2,
          'type': 'VideoAnalysis'
        }, {
          'count': 3,
          'type': 'Storage'
        }, {
          'count': 44,
          'type': 'camera'
        },
        {
          'count': 2,
          'type': 'encoder'
        }
        ]
      }]
    })
  },
  listDevice4Type (param) {
    if (param.id) {
      return T.fr({
        obj: {
          'id': 9705000001,
          'siteId': 9705,
          'accessType': 'dv',
          'name': '30.97.18.1',
          'deviceSubType': 2,
          'zoneId': '',
          'devParam': '',
          'encoderId': 1,
          'channelNo': 3,
          'mappingId': '123',
          'ip': '30.97.18.1',
          'port': 20,
          'driverId': 1,
          'userName': 'happy',
          'password': '123456',
          'channelParam': 'dd',
          'multicastIp': '1.2.3.4',
          'multicastPort': '22'
        }
      })
    } else {
      return T.fr({
        'total': 4,
        'items': [{
          'id': 9705000001,
          'desc': '',
          'siteId': 9705,
          'name': '30.97.18.1',
          'devParam': '',
          'type': 1,
          'version': '',
          'ip': '30.97.18.1'
        }, {
          'id': 9705000002,
          'desc': '',
          'siteId': 9705,
          'name': '30.97.18.2',
          'devParam': '',
          'type': 4,
          'version': '',
          'ip': '30.97.18.2'
        }, {
          'id': 9705000003,
          'port': 80,
          'mappingId': '1',
          'desc': '',
          'channelNum': 1,
          'gb28181': {},
          'type': 21,
          'password': 'jsd1896bt',
          'zoneName': '设备区',
          'zoneId': 9705000002,
          'ip': '30.97.17.1',
          'username': 'admin',
          'siteId': 9705,
          'name': '05001双桥-水泵房',
          'driverId': 25,
          'bcAddr': '',
          'bcPort': 0
        }, {
          'id': 9705000004,
          'port': 80,
          'mappingId': '2',
          'desc': '',
          'channelNum': 1,
          'gb28181': {},
          'type': 21,
          'password': 'jsd1896bt',
          'zoneName': '设备区',
          'zoneId': 9705000002,
          'ip': '30.97.17.2',
          'username': 'admin',
          'siteId': 9705,
          'name': '05002双桥-水泵房外通道',
          'driverId': 25,
          'bcAddr': '',
          'bcPort': 0
        }]
      })
    }
  },
  listRecordDriver () {
    return T.fr({
      total: 4,
      items: [{
        id: '1',
        name: '录像驱动1'
      }, {
        id: '2',
        name: '录像驱动2'
      }]
    })
  },
  editDevice () {
    return T.fr()
  },
  delDevice () {
    return T.fr()
  },
  addDevice () {
    return T.fr()
  },
  listCamera () {},
  getDevices4Type () {},
  isRelatePickup () {},
  listNotRelatedDeivces () {
    return T.fr({
      total: 3,
      items: [{
        'id': 1,
        'name': '编码器1',
        'channels': [{
          'used': 0,
          'channelNo': 1
        },
        {
          'used': 0,
          'channelNo': 2
        },
        {
          'used': 1,
          'channelNo': 3
        }
        ]
      }, {
        'id': 2,
        'name': '编码器2',
        'channels': [{
          'used': 0,
          'channelNo': 22
        },
        {
          'used': 0,
          'channelNo': 52
        },
        {
          'used': 1,
          'channelNo': 33
        }
        ]
      }]
    })
  },
  getDriver () {},
  hasData () {},
  releasePTZ () {},
  listCoder () {},
  listNotRelatedCamera () {},
  listNotRelatedSpliter () {}
}

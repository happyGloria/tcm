import T from '../query.js'
export default {
  listVideoWall () {
    return {
      'retCode': 1,
      'items': [{
        'id': 67,
        'specialDecoder': {
          'id': 9705001391,
          'driverId': 9,
          'name': 'dd',
          'relatedChannel': 1,
          'type': 55
        },
        'monitor': {
          'id': 9705000181,
          'style': '1',
          'name': '上行监视器-1',
          'provider': '1'
        },
        'siteId': 9705
      }, {
        'id': 68,
        'specialDecoder': {
          'id': 9705001391,
          'driverId': 9,
          'name': 'dd',
          'relatedChannel': 3,
          'type': 55
        },
        'monitor': {
          'id': 9705000183,
          'style': '3',
          'name': '上行监视器-3',
          'provider': '3'
        },
        'siteId': 9705
      }, {
        'id': 69,
        'specialDecoder': {
          'id': 9705001391,
          'driverId': 9,
          'name': 'dd',
          'relatedChannel': 2,
          'type': 55
        },
        'monitor': {
          'id': 9705000182,
          'style': '2',
          'name': '上行监视器-2',
          'provider': '2'
        },
        'siteId': 9705
      }]
    }
  },
  getVideoWall () {
    return {
      'retCode': 1,
      'data': {
        'notRelatedMonitor': [{
          'id': 9705000184,
          'siteId': 9705,
          'name': '上行监视器-4'
        }, {
          'id': 9705000185,
          'siteId': 9705,
          'name': '下行监视器-1'
        }, {
          'id': 9705000186,
          'siteId': 9705,
          'name': '下行监视器-2'
        }, {
          'id': 9705000187,
          'siteId': 9705,
          'name': '下行监视器-3'
        }, {
          'id': 9705000188,
          'siteId': 9705,
          'name': '下行监视器-4'
        }, {
          'id': 9705000189,
          'siteId': 9705,
          'name': '监视器1-1'
        }, {
          'id': 9705000190,
          'siteId': 9705,
          'name': '监视器1-2'
        }, {
          'id': 9705000191,
          'siteId': 9705,
          'name': '监视器1-3'
        }, {
          'id': 9705000192,
          'siteId': 9705,
          'name': '监视器1-4'
        }, {
          'id': 9705000193,
          'siteId': 9705,
          'name': '监视器2-1'
        }, {
          'id': 9705000194,
          'siteId': 9705,
          'name': '监视器2-2'
        }, {
          'id': 9705000195,
          'siteId': 9705,
          'name': '监视器2-3'
        }, {
          'id': 9705000196,
          'siteId': 9705,
          'name': '监视器2-4'
        }, {
          'id': 9705000197,
          'siteId': 9705,
          'name': '监视器3-1'
        }, {
          'id': 9705000198,
          'siteId': 9705,
          'name': '监视器3-2'
        }, {
          'id': 9705000199,
          'siteId': 9705,
          'name': '监视器3-3'
        }, {
          'id': 9705000200,
          'siteId': 9705,
          'name': '监视器3-4'
        }, {
          'id': 9705000201,
          'siteId': 9705,
          'name': '监视器4'
        }, {
          'id': 9705000202,
          'siteId': 9705,
          'name': '轮乘监视器1-1'
        }, {
          'id': 9705000203,
          'siteId': 9705,
          'name': '轮乘监视器1-2'
        }, {
          'id': 9705000204,
          'siteId': 9705,
          'name': '轮乘监视器1-3'
        }, {
          'id': 9705000205,
          'siteId': 9705,
          'name': '轮乘监视器1-4'
        }, {
          'id': 9705000210,
          'siteId': 9705,
          'name': '警务室监视器1-1'
        }, {
          'id': 9705000211,
          'siteId': 9705,
          'name': '警务室监视器1-2'
        }, {
          'id': 9705000212,
          'siteId': 9705,
          'name': '警务室监视器1-3'
        }, {
          'id': 9705000213,
          'siteId': 9705,
          'name': '警务室监视器1-4'
        }, {
          'id': 9705001312,
          'siteId': 9705,
          'name': 'ces'
        }, {
          'id': 9705001393,
          'siteId': 9705,
          'name': 'gggg'
        }, {
          'id': 9705001394,
          'siteId': 9705,
          'name': 'f'
        }],
        'notRelatedSpecialDecoder': [{
          'channels': [4, 5, 6, 7, 8, 9, 10, 11, 12],
          'ip': '12.12.12.12',
          'id': 9705001391,
          'siteId': 9705,
          'name': 'dd'
        }],
        'notRelatedDecoder': [],
        'specialDecoder': {},
        'monitor': {},
        'siteId': 9705,
        'spliter': {},
        'notRelatedSpliter': [{
          'channels': [1],
          'id': 9705001392,
          'siteId': 9705,
          'name': 'ddd'
        }],
        'decoder': {}
      }
    }
  },
  addVideoWall () {
    return T.fr()
  },
  editVideoWall () {
    return T.fr()
  },
  delVideoWall () {
    return T.fr()
  },
  getSite4WallAndStore () {
    return {
      'retCode': 1,
      'data': [{
        'id': 9705,
        'desc': '',
        'lineid': 1,
        'no': 9705,
        'name': '八通线/双桥站',
        'code': '0',
        'type': 3,
        'createdat': 1514876417000,
        'ip': '30.97.18.1'
      }]
    }
  }
}

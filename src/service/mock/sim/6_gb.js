import T from '../query.js'
export default {
  listGBStatus () {
    return T.fr({
      items: [{
        gbId: '12',
        name: '12',
        type: '23',
        ip: '12.12.12.12',
        regTime: '12122',
        expires: '22000000',
        channels: '22',
        online: '1',
        offline: '0',
        status: '0'
      },
      {
        gbId: '23',
        name: '23',
        type: '23',
        ip: '23,23,23,23',
        regTime: '23423423',
        expires: '23423423',
        channels: '22',
        online: '0',
        offline: '1',
        status: '1'
      }
      ],
      total: 2
    })
  },
  getGB () {
    return T.fr({
      'data': {
        'flag': true,
        'firmware': '',
        'model': '',
        'expires': 30,
        'manuFacturer': '',
        'userName': '1234567890123',
        'localPort': 20,
        'keepAlive': 30,
        'password': '123456',
        'timeout': 3,
        'localIp': '12.12.12.12'
      }
    })
  },
  addGB () {
    return T.fr({})
  },
  editGB () {
    return T.fr({})
  }
}

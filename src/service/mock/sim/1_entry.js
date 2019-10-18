import T from '../query.js'
import db from './consts.js'

export default {
  // params : {username, password}
  login (param) {
    $.db.setUserName(param.username)
    return T.fr({
      data: Object.assign({}, db.lineInfo, {
        'name': param.username,
        'account': param.username,
        'userType': param.username == 'admin' ? 1 : 0,
        'gbFlag': true
      })
    })
  },
  checkSession () {
    var name = $.db.getUserName()
    return T.fr({
      data: Object.assign({}, db.lineInfo, {
        'name': name,
        'account': name,
        'userType': name == 'admin' ? 1 : 0,
        'gbFlag': true,
        'currentSite': {
          'id': 952,
          'no': 952,
          'siteId': 952,
          'name': '4号线西苑站',
          'siteType': 'Station',
          'ip': '192.168.12.52'
        }
      })
    })
  },
  logout () {
    return T.fr({})
  },
  isKicked () {
    return {
      'retCode': 1,
      'items': {
        'status': 0
      }
    }
  },
  listConst () {
    return T.fr({
      items: db.sql_const
    })
  }
}


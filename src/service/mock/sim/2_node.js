import T from '../query.js'
import DB from './consts.js'
export default {
  setCurNode (param) {
    return T.fr({})
  },
  listNode (param) {
    if (param.id) {
      return T.get(DB.db_sites, param.id)
    } else {
      return T.page(DB.db_sites, param)
    }
  },
  delSite (param) {
    return T.delByIds(DB.db_sites, param.ids)
  },
  addSite (param) {
    return T.save(DB.db_sites, param)
  },
  editSite (param) {
    return T.save(DB.db_sites, param)
  },
  listSiteTree () {
    return {
      'total': 1,
      'retCode': 1,
      'items': [{
        'siteType': 'Station',
        'siteId': 1289,
        'siteName': '刘伟笔记本',
        'count': 1
      }]
    }
  }
}

import T from '../query.bak.js'
export default {
  setCurNode (param) {
    return T.fr({})
  },
  listNode (param) {
    if (param.id) {
      return T.get('site', param.id)
    } else {
      return T.page('site', param)
    }
  },
  delSite (param) {
    return T.delByIds('site', param.ids)
  },
  addSite (param) {
    return T.save('site', param)
  },
  editSite (param) {
    return T.save('site', param)
  },
  listSiteTree () {
    return T.page('site')
  }
}

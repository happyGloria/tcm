import db from './data.js'
export default {
  fr (data) {
    data = data || {}
    return {
      retCode: 1,
      ...data
    }
  },
  get (db, id) {
    return this.fr({
      data: $.extend(true, {}, db[id] || {})
    })
  },
  page_new (modal) {

  },
  page (db, args) {
    var list = Object.values(db)
    let pageNo = $.int(args.pageNo),
      pageSize = $.int(args.pageSize),
      start = ((pageNo || 1) - 1) * (pageSize || 10),
      end = start + (pageSize || 10)
    return this.fr({
      pageNo: pageNo || 1,
      total: list.length,
      pageSize: pageSize || 10,
      items: list.slice(start, end)
    })
  },
  del (modal, id) {
    if (modal instanceof Array) {
      for (let i = 0; i < modal.length; i++) {
        if (db[modal[i]][id]) {
          delete db[modal[i]][id]
        }
      }
    } else {
      delete db[id]
    }
    return this.fr()
  },
  delByIds (db, id) {
    var ids = id instanceof Array ? id : [id]
    for (let i = 0; i < ids.length; i++) {
      delete db[ids[i]]
    }
    return this.fr()
  },
  save (db, obj, flag) {
    let old = db[obj.id]
    if (old) {
      $.extend(old, obj)
    } else {
      obj.id = $.uuid()
      old = obj
    }
    db[obj.id] = $.str2json($.json2str(old))
    return this.fr()
  }
}

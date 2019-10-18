import T from '../query.js'
import DB from './consts.js'
export default {
  listUser (param) {
    if (param.id) {
      return T.get(DB.db_users, param.id)
    } else {
      return T.page(DB.db_users, param)
    }
  },
  delUser (param) {
    return T.delByIds(DB.db_users, param.ids)
  },
  addUser (param) {
    return T.save(DB.db_users, param)
  },
  editUser (param) {
    return T.save(DB.db_users, param)
  },
  resetPwd () {
    return T.fr()
  },
  /* id */
  kickUser (id) {
    return T.fr()
  }
}

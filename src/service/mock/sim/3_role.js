import T from '../query.js'
import DB from './consts.js'
export default {
  listRole (param) {
    if (param.id) {
      return T.get(DB.db_roles, param.id)
    } else {
      return T.page(DB.db_roles, param)
    }
  },
  delRole (param) {
    return T.delByIds(DB.db_roles, param.ids)
  },
  addRole (param) {
    return T.save(DB.db_roles, param)
  },
  editRole (param) {
    return T.save(DB.db_roles, param)
  }
}

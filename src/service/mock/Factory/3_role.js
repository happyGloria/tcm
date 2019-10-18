import T from '../query.bak.js'
export default {
  listRole (param) {
    if (param.id) {
      return T.get('role', param.id)
    } else {
      return T.page('role', param)
    }
  },
  delRole (param) {
    return T.delByIds('role', param.ids)
  },
  addRole (param) {
    return T.save('role', param)
  },
  editRole (param) {
    return T.save('role', param)
  }
}

import T from '../query.bak.js'
export default {
  listUser (param) {
    if (param.id) {
      return T.get('user', param.id)
    } else {
      return T.page('user', param)
    }
  },
  delUser (param) {
    return T.delByIds('user', param.ids)
  },
  addUser (param) {
    return T.save('user', param)
  },
  editUser (param) {
    return T.save('user', param)
  },
  resetPwd () {
    return T.fr()
  },
  /* id */
  kickUser (id) {
    return T.fr()
  }
}

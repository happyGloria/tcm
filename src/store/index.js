import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import device from './modules/device'
import permission from './modules/permission'
import zone from './modules/zone'
import percentage from './modules/percentage'
import getters from './getters'

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    user,
    device,
    zone,
    percentage
  },
  getters
})

export default store

import { asyncRouterMap, constantRouterMap } from '@/router/index.js'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (userType, route) {
  if (route.meta && route.meta.roles) {
    if (route.name == 'gbStatus' || route.name.indexOf('gbStatus-') > -1) {
      return userType ? $.db.getBJVMS() == 1 : false
    } else {
      return route.meta.roles.indexOf(userType) >= 0
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouterMap, userType) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(userType, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, userType)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    secondNav: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      $.db.setDefaultUrl(routers[0].children[0].path)
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_SECONDNAV: (state, list) => {
      state.secondNav = list
    },
    SET_FIRSTNAV: (state, list) => {
      state.firstNav = list
    }
  },
  actions: {
    GenerateRoutes ({
      commit
    }, userType) {
      return new Promise(resolve => {
        // let accessedRouters = filterAsyncRouter(asyncRouterMap, userType)
        commit('SET_ROUTERS', filterAsyncRouter(asyncRouterMap, userType))
        resolve()
      })
    },
    set_secondNav: ({
      commit,
      state
    }, name) => {
      for (var i = 0; i < state.routers.length; i++) {
        var item = state.routers[i]
        if (item.name == name) {
          commit('SET_SECONDNAV', item.children)
        }
      }
    }
  }
}

export default permission

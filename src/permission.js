import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false
})
const whiteList = ['/login', '/errorPage']

function setSecondNav (to) {
  var firstNav = to.matched[0] ? to.matched[0].name : to.path.split('/')[1]
  store.dispatch('set_secondNav', firstNav)
}
router.beforeEach((to, from, next) => {
  NProgress.start()
  if ($.db.getSessionKey()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      if (Util.isEmptyFn(store.getters.userId)) {
        store.dispatch('CheckSession').then(obj => {
          store.dispatch('GenerateRoutes', obj.userType).then(() => {
            if (!$.findInTree(to.path, store.getters.addRouters, 'path')) {
              to = {
                path: '/sys/node',
                matched: []
              }
              setSecondNav(to)
              next({
                ...to,
                replace: true
              })
              location.reload()
            } else {
              router.addRoutes(store.getters.addRouters)
              setSecondNav(to)
              next({
                ...to,
                replace: true
              })
            }
            /* router.addRoutes(store.getters.addRouters)
            setSecondNav(to)
            next({
              ...to,
              replace: true
            }) */
          })
        }).catch(error => {
          console.log('error:', error)
          store.dispatch('LogOut').then(() => {
            Message.error('验证错误, 请重新登录')
            next({
              path: '/login'
            })
          })
        })
      } else {
        setSecondNav(to)
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

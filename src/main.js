import Vue from 'vue'
// 加载公共样式
import 'element-ui/lib/theme-chalk/index.css'
import 'static/img/sprite.css'
// import 'normalize.css/normalize.css'// A modern alternative to CSS resets
// 工程全局配置
import '@/util/core.js'
import '@/utils/base.js'

import router from './router'
import store from './store'
import App from './App'

// 引入服务
import '@/service/fetch.js'

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

// 引入全局组件
import '@/comp/index.js'
import '@/permission.js'
import '@/compEl/index.js'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

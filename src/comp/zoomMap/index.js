import ZoomMap from './map.vue'

/* istanbul ignore next */
ZoomMap.install = function (Vue) {
  Vue.component(ZoomMap.name, ZoomMap)
}

export default ZoomMap

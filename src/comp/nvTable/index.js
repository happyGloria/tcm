/* jshint esversion: 6 */
import nvTable from './nvTable.vue'

nvTable.install = function (Vue, options) {
  Vue.component(nvTable.name, nvTable)
}

export default nvTable

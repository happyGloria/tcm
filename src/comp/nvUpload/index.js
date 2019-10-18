/* jshint esversion: 6 */
import nvUpload from './upload.vue'

nvUpload.install = function (Vue, options) {
  Vue.component(nvUpload.name, nvUpload)
}

export default nvUpload

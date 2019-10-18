import nvDialog from './dialog'
/* istanbul ignore next */
nvDialog.install = function (Vue) {
  Vue.component(nvDialog.name, nvDialog)
}

export default nvDialog

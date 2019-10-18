import IDialog from './dialog'
/* istanbul ignore next */
IDialog.install = function (Vue) {
  Vue.component(IDialog.name, IDialog)
}
export default IDialog

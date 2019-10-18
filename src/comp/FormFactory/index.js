import FormFactory from './formFactory.vue'

/* istanbul ignore next */
FormFactory.install = function (Vue) {
  Vue.component(FormFactory.name, FormFactory)
}

export default FormFactory

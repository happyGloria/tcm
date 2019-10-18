export default {
  methods: {
    closeEvent() {
      $.isIE9() && this.$nextTick(() => {
        let form = this.getForm()
        let getAllDropdown = ($el) => {
          let children = $el.$children
          if (children) {
            $.for(children, (child) => {
              if (child.$options.name === 'ElSelectDropdown') {
                child.doDestroy()
              } else {
                getAllDropdown(child)
              }
            })
          }
        }
        getAllDropdown(form)
      })
    }
  }
}

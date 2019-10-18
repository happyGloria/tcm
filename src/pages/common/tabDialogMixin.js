export default {
  data () {
    return {
      tab: 'first',
      gbOption: {}
    }
  },
  methods: {
    getFirstForm () {
      return this
        .$refs.formFactory
        .$refs.form
    },
    getSecondForm () {
      return this
        .$refs.gbFormFactory
        .$refs.form
    },
    validateFirst (success, fail, excluded) {
      return new Promise((resolve, reject) => {
        this.getFirstForm().validateTabForm((valid, errors) => {
          resolve(valid)
        }, excluded)
      })
    },
    validateSecond (success, fail, excluded) {
      return new Promise((resolve, reject) => {
        this.getSecondForm().validate((valid, errors) => {
          resolve(valid)
        }, false)
      })
    },
    getSecondFormValue (model) {
      let map = {}
      this.gbFields.forEach(f => {
        if (f.name && (!f.show || f.show())) {
          var val = this.model[f.name]
          map[f.name] = val
          // delete model[f.name]
        }
      })
      return {
        gb28181: JSON.stringify(map)
      }
    },
    submit (event) {
      if (this.tab == 'first') {
        Promise.all([
          this.validateFirst()
        ]).then(r => {
          if (r[0]) {
            this.saveAjax()
          }
        })
      } else {
        Promise.all([
          this.validateFirst(),
          this.validateSecond()
        ]).then(r => {
          if (!r[0] && !r[1]) {
            return this.nvMsg('请确认基础配置、国标配置', 'warning')
          }
          if (!r[0]) {
            return this.nvMsg('请确认基础配置', 'warning')
          }
          if (!r[1]) {
            return this.nvMsg('请确认国标配置', 'warning')
          }
          if (r[0] && r[1]) {
            this.saveAjax()
          }
        })
      }
    },
    closeEvent () {
      this.tab = 'first'
    }
  }
}

export default {
  data () {
    return {
      model: {},
      inline: false,
      loading: !1
    }
  },
  props: {
    title: String
  },
  computed: {
    dialog () {
      return this.find('dialog')
    },
    renderInit () {
      return window.formFactoryRender.bind(this, this.fields, {})
    }
  },
  methods: {
    /* 开始加载动画 */
    start (callback) {
      this.loading = !0
      $.fire(callback)
    },
    /* 结束加载动画 */
    end (callback) {
      $.fire(callback)
      setTimeout(() => {
        this.loading = !1
      }, 200)
    },
    find (name) {
      return $.ref.call(this, name)
    },
    closest (name) {
      return $.pref.call(this, name)
    },
    getForm () {
      return this
        .$refs.formFactory
        .$refs.form
    },
    validate (success, fail, excluded) {
      try {
        this.getForm().validate((valid, errors) => {
          if (valid) {
            success && success.call(this)
          } else {
            fail && fail.call(this, errors)
            return false
          }
        }, excluded)
      } catch (err) {
        console.log(err)
      }
    },
    submit (event) {
      this.validate(this.saveAjax)
    },
    resetForm (data) {
      this.getForm().resetFields(data || this.defModel)
    },
    close () {
      this.dialog.close()
      if (this.tab) {
        this.tab = 'first'
      }
    }
  }
}

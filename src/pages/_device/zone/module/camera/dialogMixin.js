export default {
  data () {
    return {
      loading: !1
    }
  },
  props: {
    title: String
  },
  computed: {
    dialog () {
      return this.find('dialog')
    }
  },
  methods: {
    find (name) {
      return $.ref.call(this, name)
    },
    /* 开始加载动画*/
    start (callback) {
      this.loading = !0
      $.fire(callback)
    },
    /* 结束加载动画*/
    end (callback) {
      $.fire(callback)
      setTimeout(() => {
        this.loading = !1
      }, 200)
    },
    close () {
      this.dialog.close()
    },
    submit (event) {
    }
  }
}

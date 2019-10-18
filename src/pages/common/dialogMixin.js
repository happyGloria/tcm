export default {
  methods: {
    openEvent () {
      this.$nextTick(() => {
        $(document).bind('keyup.esc', (e) => {
          if (e.keyCode === 27) {
            this.close()
          }
        })
      })
    },
    closeEvent (cbFn) {
      this.$nextTick(() => {
        this.resetForm()
        cbFn && cbFn()
        $(document).unbind('keyup.esc')
      })
    },
    close () {
      this.$refs.dialog.handleClose()
    },
    handleClose () {
      this.isShow = false
      this.defModel = this.model = {}
    },
    submit () {
      this.validate(() => {
        this.saveAjax(() => {
          this.close()
        })
      })
    }
  }
}

import ElFormItem from '../form/src/form-item'

/* istanbul ignore next */
ElFormItem.install = function (Vue) {
  Vue.component(ElFormItem.name, ElFormItem)

  Vue.mixin({
    methods: {
      nvMsg (data = '操作成功', type = 'success', duration = 3000) {
        var vNode = data
        if (data instanceof Array) {
          var $$ = this.$createElement
          var nodes = data.map(d => $$('p', d))
          vNode = $$(
            'div', {
              'class': {
                'msg-list': true
              }
            },
            nodes
          )
        }
        this.$message({
          message: vNode,
          type: type,
          duration: duration
        })
      },
      msg (result) {
        let text = result
        let fnName = this.$notify.warning
        if ($.isPlainObject(result)) {
          if (result.retCode === 1) {
            fnName = this.$notify.success
            text = '成功'
          } else {
            fnName = this.$notify.error
            text = result.err
          }
        }
        fnName({
          title: '提示',
          message: text,
          duration: 3000
        })
      },
      confirm (text, success, fail) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(success || $.noop).catch(fail || $.noop)
      }
    }
  })
}

export default ElFormItem

(function (win, $) {
  let broadcast = function (val) {
    this.$children.forEach(child => {
      if (child.$options.componentName === 'ElOption') {
        let parsedQuery = String(val).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1')
        child.visible = new RegExp(parsedQuery, 'i').test(child.currentLabel) || child.created

        if (child.cacheText) {
          child.$el.innerHTML = child.cacheText
        } else {
          child.cacheText = child.$el.innerHTML
        }
        if (!child.visible) {
          child.$el.innerHTML = child.cacheText
          child.parent.filteredOptionsCount--
        } else if (val) {
          child.$el.innerHTML = child.currentLabel
        }
      } else {
        broadcast.call(child, val)
      }
    })
  }
  $.extend({
    el: {
      selectFilterMethod (val) {
        this.filteredOptionsCount = this.optionsCount
        let flag = !0
        this.options.forEach((option) => {
          if (val === option.currentLabel && this.value === option.value) {
            return flag = !1
          }
        })
        if (flag) {
          broadcast.call(this, val)
        } else {
          broadcast.call(this, '')
        }
      }
    },
    ref (name) {
      return this.$refs[name]
    },
    pref (name, $parent = this.$parent) {
      if ($parent) {
        if ($parent.$refs[name]) {
          return $parent.$refs[name]
        } else {
          return $.pref(name, $parent.$parent)
        }
      }
    }
  })
})(window, window.jQuery)

(function (win, $) {
  $.extend({
    hack: {
      tooltips (e) {
        if (!e && $.isIE9()) {
          const list = this.$refs.tooltip
          setTimeout(() => {
            if ($.isArray(list)) {
              $.for(list, (item) => {
                item.doDestroy()
              })
            } else if (list) {
              list.doDestroy()
            }
          }, 0)
        }
      }
    }
  })
})(window, window.jQuery)

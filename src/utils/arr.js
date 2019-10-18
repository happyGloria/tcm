(function(win, $) {
  $.extend({
    chunk(arr, num) {
      num = num * 1 || 1
      var ret = []
      arr.forEach((item, i) => {
        if (i % num === 0) {
          ret.push([])
        }
        ret[ret.length - 1].push(item)
      })
      return ret
    }
  })
})(window, window.jQuery)

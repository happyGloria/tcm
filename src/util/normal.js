(function (win, $) {
  var BaseTypes = {
    'object': Object,
    'function': Function,
    'string': String,
    'boolean': Boolean,
    'number': Number
  }
  function isTypeFn (type) {
    return function (obj) {
      return (obj !== null && (typeof (obj) === type || obj instanceof BaseTypes[type]))
    }
  }

  $.extend({
    isNull (value) {
      return value === null
    },
    isDefined (value) {
      return typeof value !== 'undefined'
    },
    isUndefined (value) {
      return typeof value === 'undefined'
    },
    isEmptyFn (val) {
      return (val === undefined || val === null || val === '')
    },
    isBoolean: isTypeFn('boolean'),
    isString: isTypeFn('string'),
    isFn: isTypeFn('function')
  })
})(window, jQuery)

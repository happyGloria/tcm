/* import _ from 'lodash'
window._ = _ */

var util = {
  isEmptyFn (obj) {
    return (obj === undefined || obj === null || obj === '')
  },
  isIE9 () {
    let isIE9 = !1
    let browser = $.browser
    if (
      browser.msie &&
      browser.version < 10
    ) {
      isIE9 = !0
    }
    return isIE9
  },
  v2str (attrName, v, _f_) {
    var map = _f_ || $.db.getFinal()[attrName].list
    for (var i = 0; i < map.length; i++) {
      if (v == Object.keys(map[i])[0]) {
        return Object.values(map[i])[0]
      }
    }
    return ''
  },
  formatObj (obj) {
    for (let k in obj) {
      return {
        name: obj[k],
        value: k
      }
    }
  },
  objArray2List (arr, key, label) {
    key = key || 'id'
    label = label || 'name'
    var res = {}
    res.value = key
    res.name = label
    res.list = arr.map(item => {
      return this.formatObj(item)
    })
    return res
  },
  deepClone (source) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach((key) => {
      if (source[key] && typeof source[key] === 'object') {
        targetObj[key] = source[key].constructor === Array ? [] : {}
        targetObj[key] = this.deepClone(source[key])
      } else {
        targetObj[key] = source[key]
      }
    })
    return targetObj
  },
  deepClone2 (source) {
    // if (obj === undefined) return undefined
    if (source === null) return null
    if (typeof obj != 'object') return source // 包含undefined和普通类型的情况
    if (source instanceof RegExp) return new RegExp(source)
    if (source instanceof Date) return new Date(source)
    // 对象 || 数组
    let newObj = new source.constructor()
    for (var key in source) {
      newObj[key] = this.deepClone2(source[key])
    }
    return newObj
  },
  getHMS (val) {
    var date = null
    if (val instanceof Date) {
      date = val
    } else {
      date = new Date(val)
    }
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
}

export default window.Util = util

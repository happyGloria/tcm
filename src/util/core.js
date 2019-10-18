import './normal'
import './storage'
import './form'
import './elext'
import './hack'
import './render'
import './hash'

(function (win, $) {
  $.extend({
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
    int: win.parseInt,
    fot: win.parseFloat,
    for (list, callback) {
      return $.each(list, function (i, obj) {
        return callback(obj, i, list)
      })
    },
    fire (fn, ...args) {
      if (fn) {
        return fn.apply(this, args)
      }
    },
    random16: function (length, min, max) {
      let Min = $.isUndefined(min) ? this.int(['0x1', this.repeat(0, length - 1)].join('')) : min,
        Range = (max - min) || this.int(['0xe', this.repeat('f', length - 1)].join('')),
        Rand = Math.random()
      return (Min + Math.round(Rand * Range)).toString(16)
    },
    uuid: function () {
      return [
        this.random16(8),
        this.random16(4),
        this.random16(4),
        this.random16(4),
        this.random16(12)
      ].join('-')
    },
    repeat: function (str, length) {
      return length > 0 ? this.map(new Array(length), function () {
        return str
      }).join('') : ''
    },
    ip (value) {
      if (!value) {
        value = '192.168.1.0'
      }
      let ass = this.ass(value, '.', 256, 10)
      return {
        add: ass.add,
        sub (ip) {
          if (ip) {
            let list = value.split('.').reverse()
            let minuend = ip.split('.').reverse()
            let result = 0
            $.for(list, (num, i) => {
              result += (num - minuend[i]) * Math.pow(2, 8 * i)
            })
            return result
          }
          return 0
        },
        val () {
          return ass.val(!1)
        }
      }
    },
    mac (value) {
      if (!value) {
        value = '00:00:00:00:00:00'
      }
      return this.ass(value, ':')
    },
    ass (value, separate, max = 256, bit = 16) {
      let list = value.split(separate)

      list = $.map(list, (num) => {
        return ~~((bit === 16 ? '0x' : '') + num)
      }).reverse()

      return {
        add (num) {
          list = $.map(list, (n, i) => {
            if (i === 0) {
              n += num
            }
            if (n / max >= 1) {
              let next = list[i + 1]
              if (!$.isUndefined(next)) {
                list[i + 1] = next + ~~(n / max)
              }
              n = n % max
            }
            return n
          })
          return this
        },
        val (isRepeat0 = !0, length = 2) {
          let result = $.map(list, (n) => {
            n = n.toString(bit)
            if (isRepeat0 && n.length < length) {
              n = $.repeat('0', length - n.length) + n
            }
            return n
          })
          return result.reverse().join(separate)
        }
      }
    },
    // 将json类型的值转化为字符串
    json2str: function (json) {
      return JSON.stringify(json)
    },
    // 将字符串转化为json
    str2json: function (str) {
      return JSON.parse(str)
    },
    log: function (data) {
      if ($.isPlainObject(data)) {
        console.log('{')
        $.map(data, (attr, key) => {
          console.log(key, ':', attr)
        })
        console.log('}')
      } else if ($.isArray(data)) {
        console.log('[')
        $.each(data, (i, obj) => {
          $.log(obj)
        })
        console.log(']')
      } else {
        console.log(data)
      }
    },
    tpl: (function () {
      let _FN_REG_ = /^(fn:)(.+?)\((.*?)\)$/,
        _STR_PARAM_REG_ = /([''])(.+?)\1/,
        _REG_ = /{(.+?)}/g,
        isFn = function (v) {
          return _FN_REG_.test(v)
        },
        format = function (tpl, obj, tempFn) {
          return tpl.replace(_REG_, function () {
            let arg = arguments[1]
            if (isFn(arg)) {
              let fnData = _FN_REG_.exec(arg),
                fnName = fnData[2],
                fnParam = fnData[3],
                list = []

              if (fnParam) {
                fnParam = fnParam.split(',')
              } else {
                fnParam = []
              }

              for (let param in fnParam) {
                param = fnParam[param]
                if (_STR_PARAM_REG_.test(param)) {
                  param = _STR_PARAM_REG_.exec(param)[2]
                } else {
                  param = obj[param]
                }
                list.push(param)
              }
              if (tempFn && tempFn[fnName]) {
                return tempFn[fnName].apply(obj, list)
              }
              return ''
            }
            return obj[arg] === undefined ? '' : obj[arg]
          })
        },
        formatList = function (tpl, i, size, list, array, tempFn) {
          while (--i >= 0) {
            let d = list[i]
            d.i = i + size + 1
            array[i] = format(tpl, d, tempFn)
          }
        }

      return function (tpl, obj, tempFn) {
        if (!tpl && !obj) {
          return ''
        }
        if ($.isArray(obj)) {
          if (obj.length > 0) {
            let array = [],
              list = obj,
              i = list.length,
              size = 0

            formatList(tpl, i, size, list, array, tempFn)
            return array.join('')
          } else {
            return ''
          }
        }
        return format(tpl, obj, tempFn)
      }
    })(),
    le4json (json) {
      let le = 0
      $.map(json, () => {
        le++
      })
      return le
    },
    le4Tree (tree) {
      let le = 0
      let getLe = (list) => {
        $.map(list, (obj) => {
          ++le && obj.children && getLe(obj.children)
        })
      }
      getLe(tree)
      return le
    },
    findInTree (id, tree, key) {
      var fKey = key || 'id'
      let validate = (list) => {
        for (let i in list) {
          let item = list[i]
          if (id == item[fKey]) {
            return item
          }
          let children = item.children
          if (children && children.length > 0) {
            let flag = validate(children)
            if (flag) {
              return flag
            }
          }
        }
      }
      return validate(tree)
    },
    array2tree (list, id, pId, children, parent) {
      if (!list || list.length === 0) {
        return []
      }

      id = id || 'id'
      pId = pId || 'pId'
      children = children || 'children'
      parent = parent || 'parent'

      let tree = [],
        tmp = []

      for (let i = 0, l = list.length; i < l; i++) {
        tmp[list[i][id]] = list[i]
      }
      for (let i = 0, l = list.length; i < l; i++) {
        if (tmp[list[i][pId]] && list[i][id] !== list[i][pId]) {
          if (!tmp[list[i][pId]][children]) {
            tmp[list[i][pId]][children] = []
          }
          tmp[list[i][pId]][children].push(list[i])
          list[i][parent] = tmp[list[i][pId]]
        } else {
          tree.push(list[i])
        }
      }
      return tree
    },
    tree2Array (tree, list = []) {
      $.for(tree, (obj) => {
        list.push(obj)
        $.tree2Array(obj.children, list)
        delete obj.children
        delete obj.children2
        delete obj.parent
      })
      return list
    },
    /**
     * @param array Array
     * @param items Array
     * @param start Number
     * @param delNum Number
     *
     * 1, 只有 `array` 将清空 `array`
     * 2, 只有 `array`, `items` ，清空 `array` 之后，将items的值插入 `array` 中
     * 3, 存在 `start`, `delNum`，将会从 `start` 开始删除 `delNum` 个对象，然后将 `items` 的值从
     *   `start` 插入 `array`
     * */
    splice (array, items, start, delNum) {
      if (array && array !== items) {
        if ($.isUndefined(start)) {
          start = 0
          delNum = array.length
        } else {
          delNum = delNum || 0
        }
        array.splice(start, delNum)

        if (items) {
          let step = 100000
          let length = items.length
          if (length > step) {
            let count = length / step + (length % step > 0 ? 1 : 0)
            for (let i = 0; i < count; i++) {
              $.splice(array, items.slice(i * step, (i + 1) * step), start + step * i)
            }
          } else {
            items.splice(0, 0, start, 0)
            items.splice.apply(array, items)
          }
        }
      }
      return array
    },
    browser: (function () {
      let uaMatch = function (ua) {
        ua = ua.toLowerCase()

        let match = /(chrome)[ \\/]([\w.]+)/.exec(ua) ||
          /(webkit)[ \\/]([\w.]+)/.exec(ua) ||
          /(opera)(?:.*version|)[ \\/]([\w.]+)/.exec(ua) ||
          /(msie) ([\w.]+)/.exec(ua) ||
          ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
          []

        return {
          browser: match[1] || '',
          version: match[2] || '0'
        }
      }

      let matched = uaMatch(navigator.userAgent),
        browser = {
          is4plugin: !1
        }

      if (matched.browser) {
        browser[matched.browser] = true
        browser.version = matched.version
      }

      // Chrome is Webkit, but Webkit is also Safari.
      if (browser.chrome) {
        browser.webkit = true
      } else if (browser.webkit) {
        browser.safari = true
      }

      let version = parseFloat(browser.version.slice(0, 2))
      if (browser.chrome) {
        if (version <= 40 && version >= 30) {
          browser.is4plugin = !0
        }
      } else if (browser.msie) {
        browser.is4plugin = !0
        if (version < 9) {
          browser.notChromeFrame = !0
        }
      }

      return browser
    })(),
    isAllEqual (array, eqVal) {
      if (array.length > 0) {
        return !array.some((val) => {
          return val !== eqVal ? eqVal : array[0]
        })
      } else {
        return true
      }
    },
    timer (np, fn, time) {
      let timer = win.timer = win.timer = {}
      if ($.isDefined(timer[np])) {
        win.clearTimeout(timer[np])
      }
      if (fn) {
        timer[np] = win.setTimeout(fn, time)
      }
    }
  })
})(window, window.jQuery)

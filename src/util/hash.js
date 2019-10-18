(function (win, $) {
  /*
  * iterate(arr, iterFn) : iterate to call iterFn for every elements in arr by sequence.
    iterFn is a function to accept such object and index of object in arr. it can be defined
     as function(item, indexOfItemInArray)
  * map(arr, mapFn) : return the new object which is mapped from arr's every element by mapFn.
  */

  // Loop/Iterate Utilities definitions :
  function loopFn (varr, sIdx, eIdx, acc0, fun, isAscLoop) {
    if (!varr || varr.length === 0) {
      return acc0
    }
    var len = varr.length
    eIdx = (eIdx === -1) ? len : eIdx
    if (sIdx >= eIdx) {
      return acc0
    }
    var acc = acc0,
      min = Math.max(0, sIdx),
      max = Math.min(len, eIdx)
    var xlen = len - 1
    for (var i = 0; i <= xlen; i++) {
      var idx = isAscLoop ? i : (xlen - i)
      if (idx >= min && idx < max && (idx in varr)) {
        acc = fun(acc, varr[idx], idx)
      }
    }
    return acc
  }

  $.extend({
    isEmptyFn: function (obj) {
      return (obj === undefined || obj === null || obj === '')
    },
    iterate: function (arr, fun) {
      if ($.isEmptyFn(arr)) {
        return
      }
      var len = arr.length
      for (var i = 0; i < len; i += 1) {
        fun(arr[i], i)
      }
    },
    ixmap: function (arr, fun) {
      return loopFn(arr, 0, -1, [], function (acc, item, idx) {
        acc.push(fun(item, idx))
        return acc
      }, true)
    },
    arrayIndexOf: function (arr, matchFn) {
      let len = arr.length
      if (!arr || len === 0) {
        return -1
      }
      for (var i = 0; i < len; i++) {
        if (matchFn(arr[i])) {
          return i
        }
        return -1
      }
    },
    IManager: function () {
      var _ht = {}
      return {
        isRegistered: function (name) {
          return (name in _ht) && (_ht[name])
        },
        register: function (name, obj) {
          _ht[name] = obj
        },
        unregister: function (name) {
          _ht[name] = null
        },
        get: function (name) {
          return (name in _ht) ? _ht[name] : null
        },
        clear: function () {
          _ht = {}
        }
      }
    },
    IList: function () {
      var _keyList = []

      function indexOfFn (key) {
        return key ? $.arrayIndexOf(_keyList, function (item) {
          return item == key
        }) : -1
      }

      function removeFn (idx) {
        if (idx >= 0 && idx < _keyList.length) {
          _keyList = _keyList.slice(0, idx).concat(_keyList.slice(idx + 1))
        }
      }

      function appendFn (key) {
        if (!_keyList || _keyList.length === 0) {
          _keyList = [key]
        } else {
          var idx = indexOfFn(key)
          removeFn(idx)
          _keyList.push(key)
        }
      }

      function insertBefore (key, dstKey) {
        // find the dstKey, if not exist, append current key to the end of list.
        var dstIdx = indexOfFn(dstKey)
        if (dstIdx == -1) {
          appendFn(key)
          return
        }
        // find the key, if current key is before dstKey, do nothing.
        var idx = indexOfFn(key)
        if (idx != -1 && dstIdx - idx == 1) {
          return
        }
        // else remove the existed record and insert it before dstKey.
        if (idx >= 0) {
          removeFn(idx)
          dstIdx = indexOfFn(dstKey)
        }
        _keyList = _keyList.slice(0, dstIdx).concat([key], _keyList.slice(idx))
      }

      return {
        isEmpty: function () {
          return _keyList.length === 0
        },
        isLast: function (k) {
          return _keyList.length > 0 && k == _keyList[_keyList.length - 1]
        },
        getList: function () {
          return _keyList
        },
        getSize: function () {
          return _keyList.length
        },
        indexOf: indexOfFn,
        remove: removeFn,
        tryRemove: function (key) {
          removeFn(indexOfFn(key))
        },
        append: appendFn,
        tryAdd: function (key) {
          if (!_keyList || _keyList.length === 0) {
            _keyList = [key]
          } else if (indexOfFn(key) < 0) {
            _keyList.push(key)
          }
        },
        insertBefore: insertBefore,
        clear: function () {
          _keyList = []
        }
      }
    },
    IListManager: function () {
      let _super = new $.IManager(),
        _list = new $.IList()

      function registerFn (key, obj) {
        _super.register(key, obj)
        let idx = _list.indexOf(key)
        if (obj) {
          if (idx == -1) {
            _list.append(key)
          }
        } else {
          _list.remove(idx)
        }
      }

      function listFn (keys) {
        return $.map(keys, function (item) {
          return _super.get(item)
        })
      }

      return $.extend({}, _super, {
        // register should not change the sequence of key.
        register: registerFn,
        unregister: function (key) {
          registerFn(key)
        },
        isEmpty: function () {
          return _list.isEmpty()
        },
        getSize: function () {
          return _list.getSize()
        },
        hasKey: _super.isRegistered,
        isLastKey: function (key) {
          return _list.isLast(key)
        },
        getKeys: function () {
          return _list.getList()
        },
        getByKeys: function (keys) {
          return listFn(keys)
        },
        getAll: function () {
          return listFn(_list.getList())
        },
        iterate: function (fn) {
          _list.getList().forEach(function (item, idx) {
            fn(_super.get(item), item, idx)
          })
        },
        getFirst: function () {
          let arr = _list.getList(),
            len = arr.length
          if (!arr || len === 0) {
            return null
          }
          for (var i = 0; i < len; i++) {
            var inst = _super.get(arr[i])
            if (inst) {
              return inst
            }
          }
          return null
        },
        // only for key. append will remove existed record in keyList and
        // append it to the end
        append: _list.append,
        insertBefore: _list.insertBefore,
        remove: function (key) {
          registerFn(key)
        },
        clear: function () {
          _super.clear()
          _list.clear()
        }
      })
    }
  })
})(window, window.jQuery)

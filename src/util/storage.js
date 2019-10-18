(function (win, $) {
  let db = win.DB = {},
    SN = 'tcm-',
    store = win.sessionStorage,
    getName = function (name) {
      return name.replace(SN, '')
    },
    set = function (key, value) {
      db[key] = value
      merge(key)
    },
    get = function (key) {
      return db[key]
    },
    remove = function (key) {
      delete db[key]
      store.removeItem(SN + key)
    },
    merge = function (key) {
      store.setItem(SN + key, JSON.stringify(db[key]))
    },
    createGetFn = function (context, defValue) {
      return function () {
        return get(context) || (typeof defValue === 'undefined' ? {} : defValue)
      }
    },
    createSetFn = function (context) {
      return function (data) {
        set(context, data)
      }
    }

  $.extend({
    tmp (key, value) {
      if ($.isUndefined(value)) {
        return db[key]
      } else {
        db[key] = value
      }
    },
    db: {
      clear: function () {
        Object.keys(store).forEach(function (key) {
          if (key.indexOf(SN) === 0) {
            remove(key.replace(SN, ''))
          }
        })
      },
      setUserId: createSetFn('userId'),
      getUserId: createGetFn('userId', !1),
      setUserName: createSetFn('username'),
      getUserName: createGetFn('username', !1),
      setUserType: createSetFn('userType'),
      getUserType: createGetFn('userType'),
      setSessionKey: createSetFn('session-key', ''),
      getSessionKey: createGetFn('session-key', !1),
      setSites: createSetFn('sites'),
      getSites: function () {
        return JSON.parse(JSON.stringify(createGetFn('sites')()))
      },
      setRoles: createSetFn('roles'),
      getRoles: function () {
        return JSON.parse(JSON.stringify(createGetFn('roles')()))
      },
      setDefaultUrl: createSetFn('url', ''),
      getDefaultUrl: createGetFn('url', !1),
      setConsts: createSetFn('consts'),
      getConsts: createGetFn('consts', !1),
      setFinal: createSetFn('final'),
      getFinal: createGetFn('final', !1),
      setSiteId: createSetFn('siteId'),
      getSiteId: createGetFn('siteId'),
      setBJVMS: createSetFn('bjVMS'),
      getBJVMS: createGetFn('bjVMS', 0)
    }
  })

  /**
   * 初始化localStorage数据
   * */
  $.each(store, function (key) {
    if (key.indexOf(SN) === 0) {
      db[getName(key)] = JSON.parse(store.getItem(key))
    }
  })
})(window, window.jQuery)

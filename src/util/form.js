import final from '@/data/final'
(function (win, $) {
  let format = obj => {
    for (let k in obj) {
      return {
        name: obj[k],
        value: k
      }
    }
  }
  let tagFormat = {
    'el-select': 'el-option',
    'el-checkbox-group': 'el-checkbox',
    'el-radio-group': 'el-radio'
  }
  $.extend({
    initForm (setting) {
      let conf = $.extend(
          true, {}, {
            model: {},
            ajax: [],
            events: []
          },
          setting || {}
        ),
        model = conf.model,
        method = $.isEmptyFn(model.id) ? 'post' : 'put',
        events = conf.events,
        eventFilter = function () {
          return this.method === method
        },
        createAjax = conf => {
          let data = conf.ajax
          let list = []
          let getParam = list => {
            let flag
            $.map(list, obj => {
              if (obj !== 'put' && !$.isFunction(obj)) {
                flag = obj
              }
            })
            return flag
          }
          let getMethod = list => {
            let flag = 'post'
            list.forEach(obj => {
              if (obj === 'put') {
                flag = 'put'
              }
            })
            return flag
          }
          for (let i = 0; i < data.length; i++) {
            let ajax = data[i]
            if ($.isArray(ajax)) {
              if (getMethod(ajax) === 'put') {
                if (!$.isEmptyFn(model.id)) {
                  list.push(ajax[0](getParam(ajax)))
                }
              } else {
                list.push(ajax[0](getParam(ajax)))
              }
            } else if ($.isFunction(ajax)) {
              list.push(ajax())
            } else {
              list.push(ajax)
            }
          }
          return Promise.all(list)
        }
      createAjax(conf).then(r => {
        for (let i = 0; i < events.length; i++) {
          let event = events[i]
          if ($.isFunction(event)) {
            event.call(model, r)
            continue
          }
          if (eventFilter.call(event)) {
            event.fn.call(model, r)
          }
        }
      })
    },
    v2str (attrName, v, _f_) {
      var map = _f_ || $.db.getConsts()[attrName]
      for (var i = 0; i < map.length; i++) {
        if (v == map[i].id) {
          return map[i].text || map[i].name
        }
      }
      return ''
    },
    v2s (objName, attrName, v, _f_) {
      let map = _f_ || final
      let result = ''
      if (objName === 'service') {
        result = map['serviceType'][v]
      }
      if (result) {
        return result
      }
      let list = map[objName][attrName]['list']
      for (let i in list) {
        for (let j in list[i]) {
          if (j == v) {
            return list[i][j]
          }
        }
      }
      return ''
    },
    id2Name (model, attrs, options) {
      let getName = (id, list) => {
        if (list && list.length > 0) {
          for (let i in list) {
            let obj = list[i]
            if (obj.id === id) {
              return obj.name
            }
            if (obj.children) {
              return getName(id, obj.children)
            }
          }
        }
      }
      for (let attr in attrs) {
        let id = model[attr]
        let nAttr = attrs[attr]
        if ($.isArray(id)) {
          let list = []
          $.for(id, (item, i) => {
            list[i] = getName(item, options[attr].list)
          })
          model[nAttr] = list.join()
        } else {
          model[nAttr] = getName(id, options[attr].list)
        }
      }
      return model
    },
    increment (value) {
      if (value) {
        let num = $.int(
          '1' +
          value
            .split('')
            .reverse()
            .join('')
        )
        if (num != 1) {
          let str = value.split('').reverse()
          str.splice(0, (num + '').length - 1)
          num = num + '1'
          num =
            ($.int(
              num
                .split('')
                .reverse()
                .join('')
            ) +
              9) /
            10 +
            ''
          num = (() => {
            let array = num.split('').reverse()
            if (array[array.length - 1] == '1') {
              return array.slice(0, num.length - 1)
            } else {
              array[array.length - 1] = '1'
              return array
            }
          })()
          value = str.reverse().join('') + num.reverse().join('')
        } else {
          value = ''
        }
      }
      return value
    },
    s2j (model, attr) {
      if (!$.isArray(attr)) {
        attr = [attr]
      }
      $.map(attr, t => {
        let value = model[t]
        if (value && $.isStr(value)) {
          model[t] = $.str2json(value)
        }
      })
      return model
    },
    j2s (model, attr) {
      if (!$.isArray(attr)) {
        attr = [attr]
      }
      $.map(attr, t => {
        let value = model[t]
        if (value && !$.isStr(value)) {
          model[t] = $.json2str(value)
        }
      })
      return model
    },
    /**
     * 格式化fields数据
     *
     * @param fields 实体对应的字段定义
     * @param final 常量数据
     * @param prop 一般为ajax加载的select数据
     * {
     *    name: 'name',
     *    value: 'id',
     *    list: []
     * }
     * @param hasEmptyFlag 是否为select开启空选项
     *
     * */
    formatFinal (fields, final, prop, hasEmptyFlag) {
      return $.each(fields, (i, field) => {
        let name = field.name
        let tag = tagFormat[field.tag]
        let isSelect = field.tag === 'el-select'
        let isSelectTree = field.tag === 'el-select-tree'
        let isCascader = field.tag === 'el-cascader'
        let children = field.children

        if (children) {
          $.formatFinal(children, final, prop, hasEmptyFlag)
        }

        /**
         * 判断是否为表单属性而不是普通标签
         * 依据为field中是否存在name属性
         * */
        if (!name) {
          return true
        }

        if (final && final[name]) {
          let type = final[name].type || String
          field.default = final[name].default
          if (isSelectTree) {
            field.data = $.extend(true, field.data, {
              props: {
                list: $.map(final[name].list, item => {
                  item = format(item)
                  return {
                    label: item.name,
                    value: Number === type ? $.fot(item.value) : item.value
                  }
                })
              }
            })
          } else {
            field.children = final[name].list.map(item => {
              item = format(item)
              let value = Number === type ? $.fot(item.value) : item.value
              return {
                tag: tag,
                data: {
                  props: isSelect
                    ? {
                      label: item.name,
                      value: value
                    }
                    : {
                      name: name,
                      label: value
                    }
                },
                children: [item.name]
              }
            })
          }
        } else if (prop && prop[name]) {
          if (isCascader) {
            let format = list => {
              return $.map(list, obj => {
                /* let item = {
                  value: obj.id,
                  label: obj.name
                } */
                let item = {
                  value: obj[prop[name]['value']],
                  label: obj[prop[name]['name']]
                }
                if (obj.children) {
                  item.children = format(obj.children)
                }
                return item
              })
            }
            let tree = format(prop[name] && prop[name].list)
            if (tree.length > 0) {
              field.default = [tree[0]['value']]
            }
            field.data = $.extend(true, field.data, {
              props: {
                changeOnSelect: !0,
                options: tree
              }
            })
          } else if (isSelect) {
            let tree = prop[name].list
            let cache = [],
              i = 0,
              getPrefix = (l, isEnd) => {
                let j = l + 0,
                  str = ''
                if (j > 0) {
                  while (--j) {
                    str += '&nbsp;&nbsp;&nbsp;'
                  }
                  str += isEnd
                    ? '&nbsp;&nbsp;&#8211;&nbsp;'
                    : '&nbsp;&nbsp;&nbsp;'
                }
                return str
              },
              format = (list, l) => {
                list.forEach(obj => {
                  cache.push({
                    tag: tag,
                    data: {
                      props: {
                        label: obj[prop[name]['name']],
                        value: obj[prop[name]['value']]
                      },
                      domProps: {
                        innerHTML: getPrefix(l, !!obj.children) + obj[prop[name]['name']]
                      }
                    }
                  })
                  obj.children && format(obj.children, l + 1)
                })
              }

            format(tree, i)

            if (tree.length > 0) {
              field.default = tree[0][prop[name]['value']]
            }
            if (hasEmptyFlag) {
              if ($.isUndefined(field.multiple)) {
                cache.unshift({
                  tag: tag,
                  data: {
                    props: {
                      label: '无',
                      value: ''
                    }
                  },
                  children: ['无']
                })
              }
            }

            field.children = cache
            field.customFilterMethod = !0
          } else if (isSelectTree) {
            let list = prop[name].list
            if (list.length > 0) {
              field.default = list[0][prop[name]['value']]
            }
            field.data = $.extend(true, field.data, {
              props: {
                list: $.map(list, item => {
                  return {
                    label: item[prop[name]['name']],
                    value: item[prop[name]['value']]
                  }
                })
              }
            })
          } else {
            let list = prop[name].list
            if (list.length > 0) {
              field.default = list[0][prop[name]['value']]
            }
            field.children = list.map(item => {
              return {
                tag: tag,
                data: {
                  props: {
                    name: name,
                    label: item[prop[name]['value']]
                  }
                },
                children: [item[prop[name]['name']]]
              }
            })
          }
        }
      })
    },
    destroyCascadeValue (value) {
      if ($.isArray(value)) {
        return value.slice(-1).join()
      }
      return ''
    },
    createCascadeValue (value, tree, key) {
      var fKey = key || 'id'
      if (value) {
        let node = $.findInTree(value, tree, key)
        let result = []
        let getParent = node => {
          if (node) {
            result.push(node[fKey])
            getParent(node.parent)
          }
        }
        getParent(node)
        return result.reverse()
      }
      return ['']
    },
    /**
     * @param {Object 目标对象, 一般是{}} dest
     * @param {Object 源对象} tpl
     * @param {Array 字段信息列表} attr
     * @returns
     */
    copyValue (dest, tpl, attr) {
      if (attr) {
        if ($.isArray(attr)) {
          $.for(attr, field => {
            $.copyValue(dest, tpl, field.name)
          })
        } else {
          dest[attr] = $.isUndefined(tpl[attr]) ? '' : tpl[attr]
        }
      }
      return dest
    },
    copyValue_2 (dest, tpl, attr, tempTpl = {}) {
      if (attr) {
        if ($.isArray(attr)) {
          $.for(attr, field => {
            tempTpl[field.name] = $.isUndefined(field.default) ? '' : field.default
            $.copyValue_2(dest, tpl, field.name, tempTpl)
          })
        } else {
          dest[attr] = $.isUndefined(tpl[attr]) ? tempTpl[attr] : tpl[attr]
        }
      }
      return dest
    },
    /**
     * @param {Array 字段信息列表} fields
     * @param {Object 表单类型为el-select,el-cascade等从此字段取list对象} prop
     * @param {Object 自定义字段信息} tpl
     * @returns
     */
    modelTpl (fields, opts, tpl) {
      if ($.isPlainObject(tpl)) {
        tpl = $.extend(true, {}, tpl)
      } else {
        tpl = {}
      }
      $.for(fields, field => {
        let name = field.name
        /**
         * 判断是否为表单属性而不是普通标签
         * 依据为field中是否存在name属性
         * */
        if (name) {
          if ($.isUndefined(tpl[name])) {
            if ($.isUndefined(field.default)) {
              if (opts && opts[name]) {
                let tree = opts[name].list
                let key = opts[name].value
                if (field.tag === 'el-cascader') {
                  tpl[name] = tree.length > 0 ? [tree[0][key]] : []
                } else {
                  tpl[name] = tree.length > 0 ? tree[0][key] : ''
                }
              } else {
                tpl[name] = ''
              }
            } else {
              tpl[name] = field.default
            }
          } else if (field.tag === 'el-cascader') {
            if (opts && opts[name]) {
              tpl[name] = $.isArray(tpl[name])
                ? tpl[name]
                : $.createCascadeValue(tpl[name], opts[name].list)
            }
          }
        }
      })
      return tpl
    },
    /**
     * SAVE OR UPDATE
     * 根据 model.id 执行数据持久化动作
     * */
    persist (model, addApi, editApi, ...args) {
      return Service[model.id ? editApi : addApi].apply(
        this,
        [].concat(model, args)
      )
    }
  })
})(window, window.jQuery)

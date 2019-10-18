/**
 * 用于vue模板的配置化生成
 * 以下是标签模板 用与构造formItem的item
 *
 *{
 * tag: 'el-input',
 * type: '当tag为el-input时使用',
 * data: {
 *   ref: '',
 *   key: '',
 *   attrs: {
 *     id: '',
 *     name: ''
 *   },
 *   props: {},
 *   on: {
 *     click: function () {}
 *   },
 *   slot: 'name'
 * },
 * show: function(){},
 * change: function(){},
 * children: [],
 * createFunction: ''
 *}
 *
 * */
var init = function ($$, item, customRender) {
  var createFunction = item.createFunction,
    renderFunction = customRender[createFunction] || tplFunction[createFunction]
  if (renderFunction) {
    return renderFunction.call(this, $$, item, customRender)
  } else {
    // $.extend({}, item.data) 为了解决 vue 2.5.16 会清空 data.on 的问题
    return $$(item.tag, $.extend({}, item.data), (item.children || []).map((child) => {
      return child.tag ? init.call(this, $$, child, customRender) : child
    }))
  }
}

/**
 * 模板工厂函数
 * 会先检查自定义工厂函数(customRender),在没有找到匹配时，才会调用(tplFunction)
 * */
let tplFunction = {
  comp ($$, item, customRender) {
    let me = this,
      show = item.show || (() => true),
      itemData = {
        style: {},
        class: item.data.class || '',
        props: {
          checked: item.label,
          label: item.label
        }
      },
      childData = $.extend({}, item.data)

    if (!show.call(me)) {
      itemData.style.display = 'none'
    }
    /*
    itemData.class = {}
    item.class ? (itemData.class[item.class] = !0) : (itemData.class[item.class] = !1) */

    return init.call(me, $$, {
      tag: 'el-form-item',
      data: itemData,
      children: [{
        tag: item.tag,
        data: childData,
        children: item.children
      }]
    }, customRender)
  },
  formItem ($$, item, customRender) {
    let me = this
    // 在 model 属性变更时，重新绑定观察者
    if (item.name && !(item.name in me.model)) {
      me.$set(me.model, item.name, item.default || '')
    }
    let getPropVal = function (item) {
      if (['el-switch', 'el-cascader'].indexOf(item.tag) > -1) {
        if (item.tag == 'el-switch') {
          if (['download', 'record', 'map'].indexOf(item.name) > -1) {
            return me.model[item.name]
          } else {
            return Number(me.model[item.name])
          }
        } else {
          return me.model[item.name]
        }
      } else {
        return '' + me.model[item.name]
      }
    }
    let show = item.show || (() => true),
      props = {
        value: getPropVal(item)
      },
      event = {
        input (value) {
          me.model[item.name] = value
          /* window.clearTimeout(item.to)
          item.to = window.setTimeout(() => {
            me.model[item.name] = value
          }, $.isIE9() ? 300 : 0) */
        }
      },
      itemData = {
        style: {},
        props: {
          rules: item.rules,
          label: item.label,
          prop: item.name
        }
      },
      childData = $.extend(true, {
        props: props,
        on: event
      }, item.data)

    if (item.name) {
      itemData.class = {}
      itemData.class['form-item-' + item.name] = !0
    }

    if (!show.call(me)) {
      itemData.style.display = 'none'
    }

    if (item.change) {
      event.change = (value) => {
        item.change.call(me, value)
      }
    }

    if (item.desc) {
      props.placeholder = item.desc
    }

    if (['el-input', 'el-date-picker'].indexOf(item.tag) >= 0) {
      props.type = item.type || 'text'
      props.rows = 6
      /* if (item.type == 'textarea') {
        props.maxlength = '64'
        props['show-word-limit'] = true
      } */
    } else if (item.tag === 'el-switch') {
      props['active-text'] = props['inactive-text'] = ''
    } else if (item.tag === 'el-select') {
      props['filterable'] = !0
      if (item.customFilterMethod) {
        props['filterMethod'] = $.el.selectFilterMethod
      }
      if (item.multiple) {
        props['multiple'] = !0
      }
    }

    // 兄弟节点
    item.siblings = item.siblings || []

    // 添加字段说明
    item.tips = []
    if (item.tip) {
      let text = item.tip
      let tip = {
        tag: 'span',
        data: {
          class: 'tip'
        }
      }
      if ($.isFunction(text)) {
        text = text()
      }
      if ($.isPlainObject(text)) {
        tip = text
      } else if ($.isArray(text)) {
        tip.children = $.map(text, (tip) => {
          return {
            tag: 'i',
            data: {
              class: 'tip-item icon icon-tip'
            },
            children: [tip]
          }
        })
      } else {
        // tip.children = [text]
        tip.children = [{
          tag: 'i',
          data: {
            class: 'tip-item icon icon-tip'
          },
          children: [text]
        }]
      }
      if (text) {
        item.tips.push(tip)
        itemData.class['has-tip'] = !0
      }
    }

    return init.call(me, $$, {
      tag: 'el-form-item',
      data: itemData,
      children: [{
        tag: item.tag,
        data: childData,
        children: item.children
      }].concat(item.siblings, item.tips)
    }, customRender)
  }
}

window.init = init
export default window.formFactoryRender = function (list, customRender, $$, slot) {
  return init.call(this, $$, {
    tag: 'el-form',
    data: {
      ref: 'form',
      props: {
        'inline': this.inline,
        'model': this.model,
        'label-width': '140px'
      }
    },
    children: slot ? list.concat([slot]) : list
  }, customRender)
}

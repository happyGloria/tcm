import Vue from 'vue'

const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

let broadcast = function (elName, list = []) {
  if (this.children) {
    this.children.forEach(child => {
      if (child.tag && child.tag.indexOf(elName) > 0) {
        list.push(child)
      } else {
        broadcast.call(child, elName, list)
      }
    })
  }
  return list
}

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e))

!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
})
/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind (el, binding, vnode) {
    nodeList.push(el)
    const id = seed++
    const documentHandler = function (mouseup = {}, mousedown = {}) {
      if (!vnode.context ||
        !mouseup.target ||
        !mousedown.target ||
        el.contains(mouseup.target) ||
        el.contains(mousedown.target) ||
        el === mouseup.target ||
        (
          vnode.context.popperElm &&
          (
            vnode.context.popperElm.contains(mouseup.target) ||
            vnode.context.popperElm.contains(mousedown.target)
          )
        )
      ) {
        return
      }

      /**
       * 解决ElCascader选中事件会导致窗口关闭的问题
       * */
      let elList = broadcast.call(vnode, 'ElCascader')
      let flag = !0

      $.for(elList, (el) => {
        let menu = el.componentInstance.menu
        if (flag && menu && (menu.$el.contains(mouseup.target) || menu.$el.contains(mousedown.target))) {
          return flag = !1
        }
      })

      if (!flag) {
        return
      }

      if (binding.expression &&
        el[ctx].methodName &&
        vnode.context[el[ctx].methodName]) {
        vnode.context[el[ctx].methodName]()
      } else {
        el[ctx].bindingFn && el[ctx].bindingFn()
      }
    }
    el[ctx] = {
      id,
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },
  update (el, binding) {
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },
  unbind (el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
  }
}

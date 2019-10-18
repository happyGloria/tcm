<template>
  <div class="shop-cart">
    <div v-drag class="button" @click="showFn">{{ title }}</div>
    <div class="sup">{{ num }}</div>
    <transition name="shop">
      <div v-show="show" class="cart-content">
        <slot name="cart-content" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'NvShop',
  directives: {
    drag: {
      bind (el, binding) {
        el.onmousedown = function (ev) {
          let disX = ev.clientX - el.offsetLeft,
            disY = ev.clientY - el.offsetTop,
            diff = 15

          ev.stopPropagation()
          ev.preventDefault()

          document.onmousemove = function (ev) {
            var maxX = el.parentNode.offsetWidth - el.offsetWidth - diff,
              maxY = el.parentNode.offsetHeight - el.offsetHeight
            let l = ev.clientX - disX
            let t = ev.clientY - disY
            if (l <= 0) l = 0
            if (t <= diff) t = diff
            if (l >= maxX) l = maxX
            if (t >= maxY) t = maxY
            el.style.left = l + 'px'
            el.style.top = t + 'px'
            /* binding.value({
              x: ev.pageX,
              y: ev.pageY
            }) */
          }
          document.onmouseup = function (ev) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  props: {
    total: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      val: null,
      show: false
    }
  },
  computed: {
    num () {
      return this.total >= 99 ? '99+' : this.total
    }
  },
  methods: {
    showFn () {
      this.show = !this.show
    }
  }
}
</script>

<style lang="less">
@import "~@/less/mixin.less";
.shop-cart {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 70px;
  height: 70px;
  border-radius: 5px;
  z-index: 50;
  background: #409eff;
  z-index: 99999;
  cursor: pointer;
  .x-y-center-parent;
  .button {
    width: 45px;
		font-size: 14px;
    color: #fff;
    line-height: 20px;
  }
  .sup {
    position: absolute;
    right: -15px;
    top: -15px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 50%;
    background-color: #ff1f1f;
    color: #fff;
    text-align: center;
  }

  .cart-content {
    position: absolute;
    bottom: 0;
    right: 70px;
    width: 360px;
    height: 450px;
    border-radius: 3px;
    border: 2px solid #409eff;
    background-color: #fff;
    z-index: 999;
  }

  // shop动画
  .shop-enter-active, .shop-leave-active {
    transition: all .4s;
    transform-origin: 110% 95%;
  }
  .shop-enter, .shop-leave-active {
    opacity: 0.5;
    transform: scale(0);
  }
}
</style>

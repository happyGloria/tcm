<template>
  <transition name="dialog">
    <div v-if="visible" class="model-dialog">
      <div>
        <p v-if="title">
          <span>{{ title }}</span>
          <a title="关闭" class="fr el-icon-close" @click="close()" />
        </p>
        <div v-loading="loading" :style="{ top: title ? '30px' : '0' }">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
let $win = $(window)
export default {
  name: 'IDialog',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: !1,
      loading: !0
    }
  },
  methods: {
    /* 开始加载动画 */
    start (callback) {
      this.loading = !0
      $.fire(callback)
    },
    /* 结束加载动画 */
    end (callback) {
      $.fire(callback)
      setTimeout(() => {
        this.loading = !1
      }, 200)
    },
    callBack (event) {
      let me = this
      me.visible = !0
      me.$nextTick(() => {
        $.fire(event)
        me.$emit('open')
        $win.bind('keyup.esc', (e) => {
          if (e.keyCode === 27) {
            me.close()
          }
        })
      })
    },
    sync (event) {
      this.loading = !1
      this.callBack(event)
    },
    /* 开启 */
    open (event) {
      this.start(() => {
        this.callBack(event)
      })
    },
    /* 取消 */
    close (callBack) {
      let me = this
      me.visible = !1
      me.$nextTick(() => {
        $.fire(callBack)
        me.$emit('close')
        $win.unbind('keyup.esc')
      })
    }
  }
}
</script>
<style lang="less">
  .model-dialog {
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1033;
    overflow: hidden;

    > div {
      position: absolute;
      height: 100%;
      width: 100%;
      bottom: 0;
      left: 0;
      background: #fff;
      z-index: 999;
      overflow: hidden;

      > p {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 30px;
        margin: 0;
        padding-left: 30px;
        color: #fff;
        font-size: 14px;
        line-height: 30px;
        text-align: left;
        background: #555;

        > span {
          position: relative;
        }

        > a {
          cursor: pointer;
          margin-right: 15px;
          margin-top: 7px;
        }
      }

      > div {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    .el-loading-mask {
      background-color: rgba(255, 255, 255, 0.5) !important;
    }
  }

  .dialog-enter {
    opacity: 0;
    transform: translateY(800px);
  }

  .dialog-enter-active {
    opacity: 1;
    transition: all .2s ease;
  }

  .dialog-leave {
    opacity: 1;
  }

  .dialog-leave-active {
    opacity: 0;
    transition: all .5s ease;
    transform: translateY(800px);
  }
</style>

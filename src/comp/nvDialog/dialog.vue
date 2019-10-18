<template>
  <div class="nv-dialog">
    <i-dialog ref="dialog" :title="title" @close="closed">
      <div class="libBox">
        <div class="dialog-container">
          <div class="left-bar center-vertical">
            <div class="title">
              <i class="ico ico-file-edit" />
              <div class="description">{{ sideName || title }}</div>
            </div>
          </div>
          <div class="right-form">
            <div v-if="title" class="form-title">{{ title }}</div>
            <div class="form-area">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </i-dialog>
  </div>
</template>
<script>
export default {
  name: 'NvDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    sideName: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialog () {
      return this.$refs.dialog
    }
  },
  methods: {
    /* 开始加载动画 */
    start (callback) {
      this.dialog.start(callback)
    },
    /* 结束加载动画 */
    end (callback) {
      this.dialog.end(callback)
    },
    callback (event) {
      $.fire(event)
      this.$emit('open')
      $('div.form-area', this.$el).scrollTop(0)
    },
    /* 开启 */
    open (event, async = !0) {
      this.dialog[async ? 'open' : 'sync'](() => {
        this.callback(event)
      })
    },
    /* 取消 */
    close (callback) {
      this.dialog.close(() => {
        $.fire(callback)
      })
    },
    closed () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less">
  .nv-dialog {
    .libBox {
      width: 100%;
      height: 100%;
    }

    .dialog-container {
      position: absolute;
      top: 15px;
      left: 15px;
      bottom: 15px;
      right: 15px;
      min-width: 1000px;
      border: 1px solid #e1e1e1;

      .left-bar {
        display: inline-block;
        width: 240px;
        height: 100%;
        background-color: #F9F9F9;
        border-right: 1px solid #e1e1e1;

        .title {
          width: 100%;
          text-align: center;
        }

        .description {
          padding: 10px 40px;
          font-size: 14px;
          color: #666;
        }
      }

      .right-form {
        position: absolute;
        left: 240px;
        right: 0;
        top: 0;
        bottom: 0;

        .form-title {
          height: 40px;
          line-height: 40px;
          text-indent: 20px;
          border-bottom: 1px solid #e1e1e1;
          font-size: 14px;
        }

        .form-area {
          padding: 20px;
          height: calc(~'100% - 40px');
          overflow: auto;
        }

        .el-form-item__content .el-input {
          width: 300px;
        }
      }
    }
  }
</style>

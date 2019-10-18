<template>
  <div class="page">
    <el-upload :action="action"
               :data="uploadData"
               :before-upload="beforeUploadFn"
               :on-error="errorFn"
               :on-success="uploadSuccessFn"
               class="btn-upload">
      <el-button size="small"
                 type="primary">点击上传地图</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'NvUpload',
  props: {
    action: {
      type: String,
      default: ''
    },
    param: {
      type: Object,
      default () {
        return {}
      }
    },
    isFiled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      acceptType: 'jpg,gif,png,bmp',
      limitSize: 1024 * 1024 * 100,
      ajaxing: !1,
      uploadData: {}
    }
  },
  watch: {
    param () {
      this.uploadData = {
        zoneId: this.param.zoneId
      }
    }
  },
  methods: {
    beforeUploadFn (file) {
      let h = this.$createElement,
        /* filedPromp = h(
          'div',
          {
            'class': 'nv-message-box'
          },
          [
            h('p', `重新上传地图，需重新分配摄像机。`),
            h('p', `是否继续操作？`)
          ]
        ), */
        typePromp = h(
          'div',
          {
            'class': 'nv-message-box'
          },
          [
            h('p', `上传文件 ${file.name} 不符合文件格式要求!`),
            h('p', `请上传 ${this.acceptType} 类型的文件!`)
          ]
        )
      return new Promise((resolve, reject) => {
        let reg_fileType = new RegExp(`${this.acceptType.split(',').join('|')}$`)
        if (!reg_fileType.test(file.name)) {
          reject(this.$message({
            type: 'error',
            message: typePromp,
            duration: 5 * 1000
          }))
          return false
        }
        if (file.size > this.limitSize) {
          reject(this.$message({
            type: 'error',
            message: `上传文件大小超过${this.limitSize / 1024 / 1024} M的限制`,
            duration: 5 * 1000
          }))
          return false
        }
        resolve()
      })
    },
    uploadSuccessFn (res, file) {
      if (res.retCode == 1) {
        this.$message.success('上传成功')
        this.$emit('success', res)
      } else {
        this.$message({
          message: res.err,
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    errorFn (r) {
      this.$message.error('上传失败')
    }
  }
}
</script>
<style lang="less">
.nv-message-box {
  p {
    height: 24px;
    line-height: 24px;
    color: #f56c6c;
    font-size: 14px;
  }
}
</style>


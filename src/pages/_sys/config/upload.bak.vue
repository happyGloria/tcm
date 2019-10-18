<template>
  <div class="upload">
    <el-upload ref="upload"
               :data="param"
               :class="['file-upload', {
                 'hide-upload': isHideUpload,
                 'is-timeout': isTimeout,
                 'is-uploaded': isUploaded && ajaxing
               }]"
               :accept="accept"
               :action="action"
               :fileList="fileList"
               :multiple="!1"
               :auto-upload="!1"
               :with-credentials="!0"
               :on-remove="removeEvent"
               :on-change="changeEvent"
               :on-error="handleError"
               :on-progress="progressEvent"
               :on-success="handleSuccess"
               :http-request="ajax"
               :before-upload="beforeUpload"
               drag>
      <i class="el-icon-upload" />
      <div class="el-upload__text">请先导出模板，再将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <slot name="btns" />
  </div>
</template>
<script>
function getError (action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.status} ${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.status} ${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}
function getBody (xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}
import { mapGetters } from 'vuex'
export default {
  props: {
    accept: {
      type: String,
      default: '.xlsx'
    },
    param: {
      type: Object,
      default: () => ({})
    },
    action: {
      type: String,
      default: ''
    },
    importWay: {
      type: String,
      default: ''
    },
    hasImportWay: {
      type: Boolean,
      default: true
    },
    btnTxt: {
      type: String,
      default: '上传'
    }
  },
  data () {
    return {
      ajaxing: !1,
      isTimeout: !1,
      /* isHideUpload: !1,
      isUploaded: !1, */
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'isHideUpload',
      'isUploaded'
    ])
  },
  watch: {
    importWay (v) {
      this.$emit('update:importWay', v)
    }
  },
  methods: {
    ajax (option) {
      if (typeof XMLHttpRequest === 'undefined') {
        return
      }
      let me = this
      const xhr = new XMLHttpRequest()
      const action = option.action

      xhr.timeout = 3600000
      xhr.ontimeout = (e) => {
        me.isTimeout = !0
        me.msg('数据太大,请求已超时')
      }
      if (xhr.upload) {
        xhr.upload.onprogress = function progress (e) {
          if (e.total > 0) {
            e.percent = e.loaded / e.total * 100
          }
          option.onProgress(e)
        }
      }

      const formData = new FormData()

      if (option.data) {
        Object.keys(option.data).map(key => {
          formData.append(key, option.data[key])
        })
      }

      formData.append(option.filename, option.file)

      xhr.onerror = function error (e) {
        option.onError(e)
      }

      xhr.onload = function onload () {
        if (xhr.status < 200 || xhr.status >= 300) {
          return option.onError(getError(action, option, xhr))
        }

        option.onSuccess(getBody(xhr))
      }

      xhr.open('post', action, true)

      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
      }

      const headers = option.headers || {}

      for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item])
        }
      }
      xhr.send(formData)
      return xhr
    },
    removeEvent (file, fileList) {
      this.ajaxing = !1
      this.isTimeout = !1
      this.$store.dispatch('ChangeCompUploadStatus', {
        
      })
      this.isUploaded = !1
      this.isHideUpload = fileList.length > 0
      this.fileList = fileList
    },
    changeEvent (file, fileList) {
      this.ajaxing = !1
      this.isTimeout = !1
      this.isUploaded = !1
      this.fileList = fileList
      if (file.percentage == 0) {
        this.isHideUpload = !0
      }
    },
    handleError (r) {
      this.$message.error('上传失败')
      this.isUploaded = !1
      this.ajaxing = !1
    },
    progressEvent (e) {
      if (e.percent === 100) {
        // this.isUploaded = !1
      }
    },
    handleSuccess (r) {
      function handleInit () {
        this.isUploaded = !1
        this.isHideUpload = !1
        this.ajaxing = !1
        this.$refs.upload && this.$refs.upload.clearFiles()
      }
      if (r.retCode == 1) {
        this.$emit('success', () => {
          handleInit.call(this)
        })
      } else {
        this.nvMsg(r.err.split('<br>'), 'error', 6 * 1000)
      }
    },
    beforeUpload (file) {
      let regs = this.accept.split(',').map((obj) => {
        return new RegExp('\\' + $.trim(obj) + '$')
      })
      let flag = false
      for (let i = 0; i < regs.length; i++) {
        if (regs[i].test(file.name)) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.$alert('文件' + file.name + ', 不符合文件格式要求。 请上传' + this.accept + '类型的文件。')
        return flag
      } else {
        this.ajaxing = !0
      }
      // this.fileList = []
    },
    close () {
      this.$emit('close')
    },
    save () {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style lang="less">
.upload {
  .file-upload {
    width: 100%;
    padding: 10px 0;
    input[type="file"] {
      display: none;
    }
    &.hide-upload > .el-upload {
      display: none;
    }

    &.is-uploaded .el-progress__text {
      color: transparent;
      &:after {
        color: #97a8be;
        content: "数据解析中";
      }
    }

    &.is-timeout .el-progress__text {
      color: transparent;
      &:after {
        color: #ff5555;
        content: "连接超时";
      }
    }

    .el-upload-dragger {
      border-color: rgb(217,217,217);
      border-width: 2px;
      width: 456px;
      height: 200px;
      padding-top: 60px;
      &:hover {
        border-color: #20a0ff;
      }

      .el-upload__text{
        font-size: 12px;
      }
      .el-icon-upload{
        margin: 10px 0 16px;
      }
    }

    .el-upload-list {
      width: 100%;
      max-width: 450px;
      .el-icon-upload-success {
        top: 10px;
      }
      > li {
        outline: 2px dashed #86C0E8;
        margin-bottom: 20px;

        &:hover {
          background-color: #ebf6fd;
        }

        > i {
          top: 18px;
          right: 10px;
          color: #00a2ff;
          z-index: 1033;
        }

        > a {
          position: relative;
          padding-left: 60px;
          line-height: 50px;
          z-index: 1033;
          background: url(/static/img/excel.png) 10px 0 no-repeat;
          .el-icon-document {
            &:before {
              content:'';
            }
          }
        }
        > div {
          top: 0;
          bottom: 0;

          .el-progress__text {
            top: 19px;
            right: 10px;
          }

          .el-progress-bar__outer {
            height: 50px !important;
            border-radius: 0;
            background-color: transparent;
          }

          .el-progress-bar__inner {
            border-radius: 0;
            background-color: #cbe9ff;
          }
        }
      }
    }
  }
}
</style>

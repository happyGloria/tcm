<template>
  <el-dialog
    :visible.sync="isOpen"
    :modal-append-to-body="false"
    width="600px"
    title="节点信息拷贝"
    class="node-copy-form"
    @close="closeEvent">
    <form-factory ref="formFactory" :init="renderInit">
      <el-form-item>
        <el-button :loading="isLoading" size="small" class="btn2" type="primary" @click="submit">确定</el-button>
        <el-button size="small" class="btn2" @click="close">取消</el-button>
      </el-form-item>
    </form-factory>
  </el-dialog>
</template>

<script>
import { copyFieldFactory } from './fields.js'
import formFactoryMixin from '@/comp/FormFactory/mixin'

export default {
  mixins: [formFactoryMixin],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isOpen: !1,
      model: {},
      isLoading: false
    }
  },
  computed: {
    jtable () {
      return this.$parent.$refs.jtable
    },
    fields () {
      return $.formatFinal(copyFieldFactory(this), {}, this.option, !0)
    }
  },
  methods: {
    setData (model, callback) {
      $.fire(callback, this.data = model)
    },
    closeEvent () {
      this.model = {}
    },
    open (data) {
      this.setData(data, (data) => {
        this.model = $.modelTpl(this.fields, this.option, data)
        this.isOpen = !0
      })
    },
    close () {
      this.isOpen = !1
      this.resetForm()
    },
    saveAjax (callback) {
      this.isLoading = !0
      Service.copySite(this.model).then(r => {
        this.isLoading = !1
        this.$message.success('处理成功')
        this.jtable.init()
        $.fire(callback)
      }).finally(() => {
        this.isLoading = !1
        $.fire(callback)
      })
    },
    submit () {
      this.validate(() => {
        if (this.isLoading) {
          return false
        }
        this.saveAjax(() => {
          this.close()
        })
      })
    }
  }
}
</script>

<style lang="less">
  .node-copy-form {
    .el-form-item__label {
      width: 130px !important;
    }
    .el-form-item__content {
      margin-left: 130px !important;

      .el-input {
        width: 300px;
      }
    }
    .el-dialog {
      width: 530px;
    }
  }
</style>

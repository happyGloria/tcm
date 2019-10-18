<template>
  <nv-dialog ref="dialog" :title="title" class="driver-dialog">
    <div class="form-content">
      <form-factory ref="formFactory" :init="renderInit">
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </form-factory>
    </div>
  </nv-dialog>
</template>
<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import FormFactory from './fields'

export default {
  nname: 'EditForm',
  mixins: [formFactoryMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    flag: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      model: {},
      option: {}
    }
  },
  computed: {
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return $.formatFinal(FormFactory(this), null, this.option, !1)
    }
  },
  methods: {
    setData (model, callback) {
      let me = this
      $.initForm({
        model,
        ajax: [
          [Service.listDriver, { driverType: model.driverType, id: model.id }, 'put']
        ],
        events: [
          (r) => {
            me.option = {
            }
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[0].data
            }
          },
          {
            method: 'post',
            fn: (r) => {
              me.data = model
            }
          },
          () => {
            $.fire(callback, me.data)
          }
        ]
      })
    },
    open (prop) {
      this.model = this.defModel = $.modelTpl(this.fields)
      this.setData(prop, (data) => {
        this.dialog.open(() => {
          let obj = {
            id: data.id
          }
          obj = $.modelTpl(this.fields, this.option, data)
          this.model = $.extend(true, {}, obj)
          this.dialog.end()
        })
      })
    },
    getFormValue () {
      let fields = this.fields
      let map = {
        id: this.data.id
      }
      $.each(fields, (i, field) => {
        /* if (field.name && (!field.show || field.show())) { */
        if (field.name) {
          map[field.name] = this.model[field.name]
        }
      })
      return map
    },
    submit () {
      this.validate(() => {
        this.saveAjax(() => {
          this.dialog.close()
        })
      })
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        Service.editDriver(model).then((r) => {
          this.$message.success('操作成功')
          this.close()
          this.jtable.init()
        }).finally(this.end)
      })
    }
  }
}
</script>
<style lang="less">
.driver-dialog {
  .form-content {
    .form-item-days > .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>

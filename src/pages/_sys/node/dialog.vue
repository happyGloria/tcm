<template>
  <nv-dialog ref="dialog"
             :title="title">
    <div class="form-content">
      <form-factory ref="formFactory"
                    :init="renderInit">
        <el-form-item class="btns">
          <el-button :loading="loading"
                     type="primary"
                     @click="submit">确定</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </form-factory>
    </div>
  </nv-dialog>
</template>
<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import fieldFactory from './fields'
export default {
  name: 'EditForm',
  mixins: [formFactoryMixin],
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    flag: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      curNodeFlag: false,
      model: {},
      option: {}
    }
  },
  computed: {
    fields () {
      return $.formatFinal(fieldFactory(this), $.db.getFinal(), this.option, !0)
    }
  },
  methods: {
    setData (model, callback) {
      let me = this
      $.initForm({
        model,
        ajax: [
          [Service.listNode, { id: model.id }, 'put']
        ],
        events: [
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
    open (prop, curNodeFlag) {
      this.curNodeFlag = curNodeFlag
      this.model = this.defModel = $.modelTpl(this.fields, this.option, {})
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
            id: data.id
          }
          if (obj.id) {
            $.copyValue(obj, data, this.fields)
          } else {
            obj = $.modelTpl(this.fields, this.option, {})
          }
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
        if (field.name) {
          map[field.name] = this.model[field.name]
        }
      })
      return map
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        $.persist(model, (this.curNodeFlag ? 'setCurNode' : 'addSite'), 'editSite').then((r) => {
          this.$message.success('操作成功')
          this.close()
          if (this.curNodeFlag) {
            this.$parent.init()
          } else {
            this.$parent.$refs.relation.$refs.jtable.init()
          }
          this.$store.dispatch('CheckSession')
        }).finally(this.end)
      })
    }
  }
}
</script>

<template>
  <nv-dialog ref="dialog" :title="title" class="role-dialog">
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
  name: 'EditForm',
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
      isShow: false,
      model: {},
      option: {}
    }
  },
  computed: {
    jtree () {
      return this.closest('jtree')
    },
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return $.formatFinal(FormFactory(this), null, this.option, !0)
    }
  },
  methods: {
    editPermit () {
      return this
        .$refs.formFactory
        .$refs.editPermit
    },
    setData (model, callback) {
      let me = this
      $.initForm({
        model,
        ajax: [
          [Service.listRole, {
            id: model.id,
            siteId: model.siteId
          }, 'put']
        ],
        events: [
          (r) => {
            me.option = {
              type: {
                name: 'text',
                value: 'id',
                list: $.db.getConsts().siteType.filter(item => (item.id == 1 || item.id == 3))
              }
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
      this.model = this.defModel = $.extend(true, {}, $.modelTpl(this.fields))
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
            id: data.id,
            siteId: data.siteId
          }
          if (obj.id) {
            let {
              download,
              record,
              map,
              ip
            } = JSON.parse(data.access)
            $.copyValue(obj, $.extend(data, { download, ip, record, map }), this.fields)
          } else {
            Object.assign(obj, $.modelTpl(this.fields, this.option))
          }
          this.model = $.extend(true, {}, obj)
          this.dialog.end()
          this.$nextTick(() => this.editPermit().init(this.model, data.access))
        })
      })
    },
    getFormValue () {
      var access = Object.assign({}, this.editPermit().getValue())
      let map = {
        id: this.data.id,
        siteId: this.model.siteId
      }
      this.fields.forEach(field => {
        if (field.name) {
          if (['download', 'record', 'ip', 'map'].indexOf(field.name) > -1) {
            access[field.name] = this.model[field.name]
          } else {
            map[field.name] = this.model[field.name]
          }
        }
      })
      return Object.assign(map, { access })
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        Service[this.model.id ? 'editRole' : 'addRole'](model).then((r) => {
          this.$message.success('操作成功')
          this.jtree.init().then(() => this.$parent.refreshFn())
          this.close()
          this.$store.dispatch('CheckSession')
        }).finally(this.end)
      })
    }
  }
}
</script>
<style lang="less">
.role-dialog {
  .el-form-item__label {
    width: 180px !important;
  }
  .el-form-item__content {
    margin-left: 180px !important;
  }
  .form-title {
    margin-bottom: 10px;
  }
  .edit-permit {
    height: 400px;
  }
}
</style>

<template>
  <nv-dialog ref="dialog" :title="title" class="device-dialog">
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
import dialogMixin from '../../dialogMixin.js'
import FormFactory from './fields.js'
import { listToTree } from '../../utils.js'
export default {
  name: 'EditForm',
  mixins: [formFactoryMixin, dialogMixin],
  data () {
    return {
      model: {},
      option: {
        driverId: []
      }
    }
  },
  computed: {
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
          [Service.listDriver, { driverType: model.deviceType }],
          [Service.listDevice4Type, { id: model.id }, 'put']
        ],
        events: [
          (r) => {
            var driverList = r[0].items
            me.option = {
              driverId: {
                name: 'text',
                value: 'virId',
                list: listToTree('provider', 'provider', driverList || [])
              }
            }
            me.setDriverHT(r[0].items)
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[1].data
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
      this.model = this.defModel = $.extend(true, {}, $.modelTpl(this.fields, this.option, { driverId: [] }))
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
            id: data.id
          }
          let {
            driverId: {
              list: driverList
            }
          } = this.option
          if (obj.id) {
            $.copyValue(obj, data, this.fields)
            obj.driverId = $.createCascadeValue(obj.driverId, driverList, 'virId')
          } else {
            let {
              id,
              port,
              username,
              password
            } = driverList[0]
            obj = Object.assign({}, $.modelTpl(this.fields, this.option), {
              driverId: $.createCascadeValue(id, driverList, 'virId'),
              port,
              username,
              password,
              ...obj
            })
          }
          this.model = $.extend(true, {}, obj)
          this.dialog.end()
        })
      })
    }
  }
}
</script>

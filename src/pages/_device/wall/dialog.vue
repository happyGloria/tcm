<template>
  <nv-dialog ref="dialog" :title="title">
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
      model: {},
      option: {},
      decoderHT: {}
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
      return $.formatFinal(FormFactory(this), null, this.option, !1)
    }
  },
  methods: {
    setData (model, callback) {
      let me = this
      $.initForm({
        model,
        ajax: [
          [Service.listNotRelatedDevices, { siteId: model.siteId, deviceType: 'Decoder' }],
          [Service.listDevice4Type, { id: model.id }, 'put']
        ],
        events: [
          (r) => {
            r[0].items.map(d => {
              me.decoderHT[d.id] = d
            })
            me.option = {
              decoderId: {
                name: 'name',
                value: 'id',
                list: Object.values(me.decoderHT) || []
              },
              channelNo: {
                name: 'name',
                value: 'id',
                list: []
              }
            }
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[1].data
              me.$nextTick(() => {
                /* me.model.decoderId = me.data.decoderId */
                me.setChannel()
              })
            }
          },
          {
            method: 'post',
            fn: (r) => {
              me.data = model
              me.model.decoderId = Object.values(this.decoderHT)[0] ? Object.values(this.decoderHT)[0].id : ''
              me.setChannel()
            }
          },
          () => {
            $.fire(callback, me.data)
          }
        ]
      })
    },
    setChannel () {
      if (!this.model.decoderId) return
      var channelList = (this.decoderHT[this.model.decoderId].channels || []).filter(c => c.used == 0)
      this.option = Object.assign({}, this.option, {
        channelNo: {
          name: 'channelNo',
          value: 'channelNo',
          list: channelList
        }
      })
    },
    open (prop) {
      this.model = this.defModel = $.extend(true, {}, $.modelTpl(this.fields))
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
            id: data.id,
            ...prop
          }
          if (obj.id) {
            $.copyValue(obj, data, this.fields)
          } else {
            obj = Object.assign({}, $.modelTpl(this.fields, this.option), obj)
          }
          this.model = $.extend(true, {}, obj)
          this.dialog.end()
        })
      })
    },
    getFormValue () {
      let fields = this.fields
      let map = {
        id: this.model.id,
        siteId: this.model.siteId,
        deviceType: 'Monitor'
      }
      fields.forEach(field => {
        if (field.name && (!field.show || field.show())) {
          map[field.name] = this.model[field.name]
        }
      })
      return map
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        $.persist(model, 'addDevice', 'editDevice').then((r) => {
          this.decoderHT = {}
          this.$message.success('操作成功')
          this.close()
          this.jtree.init().then(() => {
            this.$parent.refreshFn()
          })
        }).finally(this.end)
      })
    }
  }
}
</script>

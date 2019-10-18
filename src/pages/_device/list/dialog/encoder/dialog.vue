<template>
  <nv-dialog ref="dialog"
             :title="title"
             class="tab-dialog"
             @close="closeEvent">
    <div class="form-content">
      <el-tabs v-model="tab" type="border-card">
        <el-tab-pane label="基础配置" name="first">
          <span slot="label"><i class="icon icon-basic" /> 基础配置</span>
          <form-factory ref="formFactory" :init="renderInit" />
        </el-tab-pane>
        <el-tab-pane label="国标配置" name="second">
          <span slot="label"><i class="icon icon-gb" /> 国标配置</span>
          <form-factory ref="gbFormFactory" :init="renderGBInit" />
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button :loading="loading" size="mini" type="primary" @click="submit">确定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </div>
    </div>
  </nv-dialog>
</template>
<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import gbFormFactory from './gb-fields.js'
import dialogMixin from '../../dialogMixin.js'
import tabDialogMixin from '@/pages/common/tabDialogMixin.js'
import FormFactory from './fields.js'
import { listToTree } from '../../utils.js'
export default {
  name: 'EditForm',
  mixins: [formFactoryMixin, dialogMixin, tabDialogMixin],
  data () {
    return {
      isShowGBTab: !0,
      option: {
        driverId: [],
        recordDriverId: []
      }
    }
  },
  computed: {
    fields () {
      return $.formatFinal(FormFactory(this), null, this.option, !1)
    },
    gbFields () {
      return $.formatFinal(gbFormFactory(this), null, this.gbOption, !1)
    },
    renderInit () {
      return window.formFactoryRender.bind(this, this.fields, {})
    },
    renderGBInit () {
      return window.formFactoryRender.bind(this, this.gbFields, {})
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
            var emptyVal = [{
              virId: '',
              text: '无',
              id: '-1'
            }]
            var driverList = listToTree('provider', 'provider', r[0].items || [])
            me.option = {
              driverId: {
                name: 'text',
                value: 'virId',
                list: driverList
              },
              recordDriverId: {
                name: 'text',
                value: 'virId',
                list: [{ virId: '', text: '无' }].concat(driverList)
              }
            }
            me.setDriverHT(emptyVal.concat(r[0].items))
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
      this.model = this.defModel = $.extend(true, $.modelTpl(this.fields), {
        driverId: [],
        recordDriverId: []
      })
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
              id: data.id,
              ...prop
            },
            gbObj = {}
          let {
            driverId: {
              list: driverList
            },
            recordDriverId: {
              list: recordDriverList
            }
          } = this.option

          if (obj.id) {
            if ('gb28181' in data) {
              var gbData = Util.isEmptyFn(data.gb28181) ? {} : JSON.parse(data.gb28181)
              $.copyValue(gbObj, gbData, this.gbFields)
            }
            $.copyValue(obj, data, this.fields)
            obj.driverId = $.createCascadeValue(obj.driverId, driverList, 'virId')
            obj.recordDriverId = $.createCascadeValue(obj.recordDriverId, recordDriverList, 'virId')
          } else {
            let {
              id,
              port,
              username,
              password
            } = driverList[0]
            obj = Object.assign({}, $.modelTpl(this.fields, this.option), {
              driverId: $.createCascadeValue(id, driverList, 'virId'),
              /* recordDriverId: $.createCascadeValue('', [{ virId: '', text: '无' }].concat(recordDriverList), 'virId'), */
              port,
              username,
              password,
              ...obj
            })
          }
          this.model = $.extend(true, {}, obj, gbObj)
          this.dialog.end()
        })
      })
    }
  }
}
</script>

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
        <el-tab-pane v-if="isShowGBTab" label="国标配置" name="second">
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
import dialogMixin from '../../dialogMixin.js'
import tabDialogMixin from '@/pages/common/tabDialogMixin.js'
import FormFactory from './fields.js'
import gbFormFactory from './gb-fields.js'
import { listToTree } from '../../utils.js'
import final from '@/data/final.js'
export default {
  name: 'EditForm',
  mixins: [formFactoryMixin, dialogMixin, tabDialogMixin],
  data () {
    return {
      tab: 'first',
      defaultPorts: {
        TNM: 2031,
        TVS: 2011, // 视频服务
        TVR: 6936, // 存储
        TFS: 2020, // 流媒体
        KBS: 2015, // 键盘
        SuperiorGB: 5060 // 国标上级
      },
      specialServerType: ['VideoAnalysis', 'VideoDiagnose', 'CloudStorage', 'VideoPlatform'],
      gbDataset: ['TVR', 'TFS', 'VideoAnalysis', 'VideoDiagnose', 'SuperiorGB', 'SubordinateGB'],
      // 存储， 流媒体， 视频分析，视频诊断 需进行国标配置
      option: {
        driverId: []
      }
    }
  },
  computed: {
    fields () {
      return $.formatFinal(FormFactory(this), null, this.option, !1)
    },
    gbFields () {
      return $.formatFinal(gbFormFactory(this), final.gb, this.gbOption, !1)
    },
    renderInit () {
      return window.formFactoryRender.bind(this, this.fields, {})
    },
    renderGBInit () {
      return window.formFactoryRender.bind(this, this.gbFields, {})
    },
    isShowGBTab () {
      return this.gbDataset.indexOf(this.model.deviceSubType) > -1
    }
  },
  methods: {
    setData (model, callback) {
      let me = this
      $.initForm({
        model,
        ajax: [
          [Service.listDevice4Type, { id: model.id }, 'put'],
          [Service.listDriver, { driverType: model.deviceSubType }, 'put']
        ],
        events: [
          (r) => {
            var constList = $.db.getConsts()
            me.option = {
              deviceSubType: {
                default: '',
                name: 'name',
                value: 'id',
                list: constList.serverType || []
              },
              driverId: {
                default: '',
                name: 'text',
                value: 'virId',
                list: []
              }
            }
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[0].data
              me.option = Object.assign({}, this.option, {
                driverId: {
                  name: 'name',
                  value: 'id',
                  list: listToTree('provider', 'provider', r[1].items || [])
                }
              })
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
    listDriver (param) {
      return new Promise(resolve => {
        Service.listDriver(param || { driverType: this.model.deviceSubType }).then(r => {
          this.option = Object.assign({}, this.option, {
            driverId: {
              name: 'text',
              value: 'virId',
              list: listToTree('provider', 'provider', r.items || [])
            }
          })
          this.setDriverHT(r.items)
          resolve()
        })
      })
    },
    open (prop) {
      this.model = this.defModel = $.extend(true, $.modelTpl(this.fields), { driverId: [] })
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
              id: data.id,
              ...prop
            },
            gbObj = {}
          if (obj.id) {
            if ('gb28181' in data) {
              var gbData = Util.isEmptyFn(data.gb28181) ? {} : JSON.parse(data.gb28181)
              $.copyValue(gbObj, gbData, this.gbFields)
            }
            $.copyValue(obj, data, this.fields)
          } else {
            $.modelTpl(this.fields, this.option)
          }
          if (this.specialServerType.indexOf(obj.deviceSubType) > -1) {
            this.listDriver({ driverType: obj.deviceSubType }).then(() => {
              let {
                driverId: {
                  list: driverList
                }
              } = this.option
              obj.driverId = $.createCascadeValue(obj.id ? data.driverId : '', driverList, 'virId')
              if (!obj.id && obj.deviceSubType) {
                obj.port = this.defaultPorts[obj.deviceSubType] ? this.defaultPorts[obj.deviceSubType] : ''
              }
              this.model = $.extend(true, {}, obj, gbObj)
              this.dialog.end()
            })
          } else {
            obj.driverId = []
            if (!obj.id && obj.deviceSubType) {
              obj.port = this.defaultPorts[obj.deviceSubType] ? this.defaultPorts[obj.deviceSubType] : ''
            }
            this.model = $.extend(true, {}, obj, gbObj)
            this.dialog.end()
          }
        })
      })
    }
  }
}
</script>


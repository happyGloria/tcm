<template>
  <nv-dialog ref="dialog"
             :title="title"
             class="camera-dialog tab-dialog"
             @close="closeEvent">
    <div class="form-content">
      <el-tabs v-model="tab"
               type="border-card">
        <el-tab-pane label="基础配置"
                     name="first">
          <span slot="label"><i class="icon icon-basic" /> 基础配置</span>
          <form-factory ref="formFactory"
                        :init="renderInit" />
        </el-tab-pane>
        <el-tab-pane label="国标摄像机"
                     name="second">
          <span slot="label"><i class="icon icon-gb" /> 国标配置</span>
          <form-factory ref="gbFormFactory"
                        :init="renderGBInit" />
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button size="mini"
                   type="primary"
                   @click="submit">确定</el-button>
        <el-button size="mini"
                   @click="close">取消</el-button>
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
import setData from './setData.js'
import final from '@/data/final.js'
export default {
  name: 'EditForm',
  mixins: [formFactoryMixin, dialogMixin, tabDialogMixin],
  data () {
    return {
      tab: 'first',
      isShowGBTab: !0,
      model: {},
      defModel: {},
      loading: !1,
      encoderHT: new $.IListManager(),
      driverHT: {},
      option: {
        driverId: [],
        zoneId: [],
        recordDriverId: []
      },
      gbOption: {}
    }
  },
  computed: {
    fields () {
      return $.formatFinal(FormFactory(this), $.db.getFinal(), this.option, !1)
    },
    gbFields () {
      return $.formatFinal(gbFormFactory(this), final.gb, this.gbOption, !1)
    },
    renderInit () {
      return window.formFactoryRender.bind(this, this.fields, {})
    },
    renderGBInit () {
      return window.formFactoryRender.bind(this, this.gbFields, {})
    }
  },
  methods: {
    getNotRelatedDevices (param) {
      if (this.encoderHT) this.encoderHT.clear()
      if (this.model.accessType == 'dv') {
        this.setChannelNoList()
        return false
      }
      Service.listNotRelatedDevices(param || {
        siteId: this.model.siteId,
        deviceType: this.model.accessType
      }).then(({ items }) => {
        items.map(item => {
          this.encoderHT.register(item.id, item)
        })
        this.option = Object.assign({}, this.option, {
          encoderId: {
            name: 'name',
            value: 'id',
            list: this.encoderHT.getAll()
          }
        })
        this.setChannelNoList()
      })
    },
    setChannelNoList () {
      var channelList = [], encoderId = this.model.encoderId
      if (this.model.accessType == 'dv') {
        Object.assign(this.model, { channelNo: 1 })
        channelList = [{ id: 1, name: 1 }]
      } else {
        if (!this.model.id) Object.assign(this.model, { channelNo: '' })
        channelList = (encoderId ? this.encoderHT.get(encoderId).channels : [])
          .filter(c => c.used == 0)
          .map(d => {
            return {
              id: d.channelNo,
              name: d.channelNo
            }
          })
      }
      this.option = Object.assign({}, this.option, {
        channelNo: {
          name: 'name',
          value: 'id',
          list: channelList
        }
      })
    },
    open (prop) {
      var m1 = $.modelTpl(this.fields), m2 = $.modelTpl(this.gbFields)
      this.model = this.defModel = Object.assign({}, m1, m2, {
        driverId: [],
        zoneId: [],
        recordDriverId: []
      })
      this.dialog.open(() => {
        setData.call(this, prop, (data) => {
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
            let zoneIdArr = $.createCascadeValue(obj.zoneId, this.option.zoneId.list)
            obj.zoneId = Util.isEmptyFn(zoneIdArr[zoneIdArr.length - 1]) ? ['-1'] : zoneIdArr
            obj.driverId = $.createCascadeValue(obj.driverId, this.option.driverId.list, 'virId')
            obj.recordDriverId = $.createCascadeValue(obj.recordDriverId, this.option.recordDriverId.list, 'virId')
          } else {
            let p1 = $.modelTpl(this.fields, this.option),
              p2 = $.modelTpl(this.gbFields)
            let {
              driverId: {
                list: driverIdList
              },
              recordDriverId: {
                list: recordDriverIdList
              }
            } = this.option
            let {
              port,
              username,
              password
            } = driverIdList[0]
            var driverId = $.createCascadeValue(driverIdList[0].id, driverIdList, 'virId'),
              recordDriverId = $.createCascadeValue('', recordDriverIdList, 'virId')
            obj = Object.assign({}, p1, p2, obj, {
              driverId,
              recordDriverId,
              port,
              username,
              password
            })
          }
          this.model = $.extend(true, {}, obj, gbObj)
          this.tab = 'first'
          this.dialog.end()
        })
      })
    },
    saveAjax () {
      this.start(() => {
        let model = Object.assign({}, this.getFormValue())
        /* if (model.zoneId == '-1') {
          delete model.zoneId
        } */
        $.persist(model, 'addDevice', 'editDevice').then((r) => {
          this.nvMsg()
          if (this.encoderHT) this.encoderHT.clear()
          this.jtree.init().then(() => this.$parent.refreshFn())
          this.close()
        }).finally(this.end)
      })
    }
  }
}
</script>
<style lang="less">
.camera-dialog {
  .form-area {
    height: 100% !important;
    overflow: hidden;
    .form-content {
      height: 100%;
      .el-tabs {
        height: calc(~"100% - 40px");
        .el-tabs__content {
          height: calc(~"100% - 50px");
          overflow-y: auto;
        }
      }
    }
  }
}
</style>

<template>
  <el-dialog :modal-append-to-body="false"
             :title="title"
             :visible.sync="isOpen"
             class="zone-dialog"
             width="650px"
             @close="closeEvent">
    <el-tabs v-model="tab"
             type="card">
      <el-tab-pane name="first">
        <span slot="label"><i class="icon icon-basic" /> 基础配置</span>
        <form-factory ref="formFactory"
                      :init="renderInit" />
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><i class="icon icon-gb" /> 国标配置</span>
        <form-factory ref="gbFormFactory"
                      :init="renderGBInit" />
      </el-tab-pane>
    </el-tabs>
    <div class="btns"
         style="padding-left: 180px;">
      <!-- <el-button :loading="loading"
                 size="mini"
                 type="primary"
                 @click="submit">确定</el-button> -->
      <el-button size="small"
                 type="primary"
                 @click="submit">确定</el-button>
      <el-button size="small"
                 @click="close">取消</el-button>
    </div>
    <!-- <form-factory ref="formFactory" :init="renderInit">
      <el-form-item>
        <el-button size="small" type="primary" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-form-item>
    </form-factory> -->
  </el-dialog>
</template>

<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import FormFactory from './fields.js'
import gbFormFactory from './gbFields.js'
import { mapGetters } from 'vuex'
import tabDialogMixin from '@/pages/common/tabDialogMixin.js'
export default {
  name: 'ZoneForm',
  mixins: [formFactoryMixin, tabDialogMixin],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    var me = this
    return {
      tab: 'first',
      isOpen: !1,
      model: {},
      option: {},
      filter: {
        siteId: ''
      },
      gridConfig: {
        selectable: !0,
        pagination: !0,
        column: [
          { type: 'index', name: '序号', width: '60', minWidth: '50px' },
          { key: 'id', name: '摄像机ID', width: '150px' },
          { key: 'name', name: '名称', minWidth: '200px' },
          {
            key: 'deviceSubType', name: '摄像机类型', width: '220px', minWidth: '220px',
            format: (value) => {
              return $.v2str('cameraType', value)
            }
          }
        ],
        ajax: {
          init: (pageInfo) => {
            if (me.isOpen) {
              var param = Object.assign({}, pageInfo, me.filter)
              return Service.listCameraWithoutZone(param).then(r => r)
            } else {
              return new Promise((resolve, reject) => {
                resolve(me.model.ajaxedVal)
              })
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['activeZoneNode']),
    fields () {
      return $.formatFinal(FormFactory(this), null, this.option, !0)
    },
    gbFields () {
      return $.formatFinal(gbFormFactory(this), null, {}, !1)
    },
    jtree () {
      return this.closest('jtree')
    },
    renderGBInit () {
      return window.formFactoryRender.bind(this, this.gbFields, {})
    }
  },
  methods: {
    closeEvent () {
      this.model = {}
    },
    setData (model, callback) {
      $.fire(callback, this.data = model)
    },
    open (data = {}) {
      this.setData(data, (data) => {
        let obj = {
            id: data.id
          },
          gbObj = {}
        if (obj.id) {
          if ('gb28181' in data) {
            var gbData = Util.isEmptyFn(data.gb28181) ? {} : JSON.parse(data.gb28181)
            $.copyValue(gbObj, gbData, this.gbFields)
          }
          $.copyValue(obj, data, this.fields)
        } else {
          let p1 = $.modelTpl(this.fields, this.option),
            p2 = $.modelTpl(this.gbFields, this.option)
          Object.assign(obj, p1, p2)
        }
        this.model = Object.assign({}, obj, gbObj)
        // this.model = $.modelTpl(this.fields, this.option, data)
        this.isOpen = !0
        this.tab = 'first'
      })
    },
    close () {
      this.isOpen = !1
      this.resetForm()
    },
    getFormValue () {
      let map = {
        id: this.data.id
      }
      this.fields.forEach((field) => {
        if (field.name && (!field.show || field.show())) {
          map[field.name] = this.model[field.name]
        }
      })
      // second
      Object.assign(map, this.getSecondFormValue(this.model))
      let {
        siteId: ssId,
        nodeType,
        id,
        parentId
      } = this.activeZoneNode
      return Object.assign({}, map, {
        siteId: nodeType == 'Site' ? id : ssId,
        parentId: map.id ? parentId : id
      })
    },
    /* getFormValue () {
      let map = {}
      this.fields.forEach((field) => {
        if (field.name && (!field.show || field.show())) {
          map[field.name] = this.model[field.name]
        }
      })
      return map
    }, */
    saveAjax () {
      var model = this.getFormValue()
      /* var model = this.getFormValue()
      let {
        siteId: ssId,
        nodeType,
        id,
        parentId
      } = this.activeZoneNode
      let param = Object.assign({}, model, {
        siteId: nodeType == 'Site' ? id : ssId,
        parentId: model.id ? parentId : id
      }) */
      Service[model.id ? 'editZone' : 'addZone'](model).then((r) => {
        this.$message.success('操作成功')
        this.jtree.init().then(() => {
          this.$parent.refreshFn()
        })
        this.close()
      })
    }
    /* save () {
      this.validate(this.saveAjax)
    },
    submit () {
      this.validate(() => {
        this.saveAjax(() => {

        })
      })
    } */
  }
}
</script>
<style lang="less">
.zone-dialog {
  .el-form-item__label {
    width: 130px !important;
  }
  .el-form-item__content {
    margin-left: 130px !important;

    .el-input {
      width: 320px;
    }
  }
  .el-dialog {
    width: 530px;
  }
}
</style>

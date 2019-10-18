<template>
  <nv-dialog ref="dialog"
             :title="title"
             class="tab-dialog store-dialog"
             @close="closeEvent">
    <div class="form-content">
      <el-tabs v-model="tab"
               :class="`tab-${tab}`"
               type="border-card">
        <el-tab-pane label="基础配置"
                     name="first">
          <span slot="label"><i class="icon icon-basic" /> 基础配置</span>
          <form-factory ref="formFactory"
                        :init="renderInit" />
        </el-tab-pane>
        <el-tab-pane label="国标配置"
                     name="second">
          <span slot="label">
            <i class="icon icon-Camera" />
            <i>选取摄像机</i>
          </span>
          <edit-camera ref="editCamera"
                       :doneCameras="doneCameras"
                       :lostCameras="lostCameras" />
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button :loading="loading"
                   size="mini"
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
import FormFactory from './fields'
import EditCamera from './editCamera'
import tabDialogMixin from '@/pages/common/tabDialogMixin.js'
export default {
  name: 'EditForm',
  components: {
    EditCamera
  },
  mixins: [formFactoryMixin, tabDialogMixin],
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
      tab: 'first',
      model: {},
      option: {},
      doneCameras: [],
      lostCameras: []
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
      return $.formatFinal(FormFactory(this), $.db.getFinal(), this.option, !1)
    }
  },
  methods: {
    setData (model, callback) {
      let me = this
      $.initForm({
        model,
        ajax: [
          [Service.listDeviceWithoutPlan, { siteId: model.siteId }],
          [Service.listPlan, { siteId: model.siteId, id: model.id }, 'put']
        ],
        events: [
          (r) => {
            me.option = {
              storageId: {
                name: 'name',
                value: 'id',
                list: r[0].items.storages || []
              }
            }
            me.lostCameras = r[0].items.cameras
            me.doneCameras = []
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[1].data
              me.doneCameras = r[1].data.cameras
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
      this.model = this.defModel = $.extend(true, $.modelTpl(this.fields), { days: 'all' })
      this.setData(prop, (data) => {
        this.dialog.open(() => {
          let obj = {
            id: data.id
          }
          if (obj.id) {
            let { from, to, days } = data
            obj = Object.assign({}, $.copyValue(obj, data, this.fields), { from, to, days })
          } else {
            obj = $.modelTpl(this.fields, this.option, {
              days: 'all'
            })
          }
          this.model = $.extend(true, {}, obj)
          this.dialog.end()
        })
      })
    },
    getFormValue () {
      let map = {
        id: this.data.id,
        siteId: this.jtree.getActive().siteId
      }
      $.each(this.fields, (i, field) => {
        // if (field.name && (!field.show || field.show())) {
        if (field.name) {
          map[field.name] = this.model[field.name]
        }
      })
      return map
    },
    validateBase (success, fail, excluded) {
      return new Promise((resolve, reject) => {
        this.getForm().validateTabForm((valid, errors) => {
          resolve(valid)
        }, excluded)
      })
    },
    submit () {
      Promise.all([
        this.validateBase(),
        this.$refs.formFactory.$refs.datePlan.validate(),
        this.$refs.editCamera.validate()
      ]).then(r => {
        if (r[0] && r[1] && r[2]) {
          this.saveAjax(() => this.dialog.close())
        }
        if (!r[0]) {
          this.msg('请核准基础配置信息!')
        }
        if (!r[1]) {
          this.msg('请核准日期计划!')
        }
      })
    },
    saveAjax () {
      this.start(() => {
        let baseVal = this.getFormValue(),
          extVal = Object.assign(
            {},
            this.$refs.formFactory.$refs.datePlan.getValue(),
            this.$refs.editCamera.getValue()
          ),
          model = { ...baseVal, ...extVal }
        Service[model.id ? 'editPlan' : 'addPlan'](model).then((r) => {
          this.doneCameras.length = 0
          this.lostCameras.length = 0
          this.$refs.editCamera.clear(() => {
            this.nvMsg()
            this.jtree.init().then(() => this.$parent.refreshFn())
            this.close()
          })
        }).finally(this.end)
      })
    },
    close () {
      this.dialog.close()
      this.$refs.editCamera.clear()
      this.tab = 'first'
    }
  }
}
</script>
<style lang="less">
.store-dialog {
  .dialog-container .right-form .form-area {
    height: 100%;
  }
  .form-content {
    height: 100%;
    .tab-second {
      height: calc(~"100% - 40px");
      .el-tabs__content {
        height: calc(~"100% - 40px");
        #pane-second {
          height: 100%;
          .edit-camera {
            height: 100%;
            .el-table {
              height: calc(~"100% - 100px");
            }
          }
        }
      }
      .el-table--scrollable-y .el-table__body-wrapper {
        overflow-y: auto;
      }
    }
    .form-item-days > .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>

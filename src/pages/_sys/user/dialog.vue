<template>
  <nv-dialog ref="dialog"
             :title="title"
             class="tab-dialog"
             @close="closeEvent">
    <div class="form-content">
      <el-tabs v-model="tab" type="border-card">
        <el-tab-pane name="first">
          <span slot="label"><i class="icon icon-basic" /> 基础配置</span>
          <form-factory ref="formFactory" :init="renderInit" />
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label"><i class="icon icon-gb" /> 国标用户配置</span>
          <form-factory ref="gbFormFactory" :init="renderGBInit" />
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button :loading="loading"
                   size="mini"
                   type="primary"
                   @click="submit">确定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </div>
    </div>
  </nv-dialog>
</template>
<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import { FormFactory } from './fields'
import gbFormFactory from './gb-fields.js'
import { mapGetters } from 'vuex'
import tabDialogMixin from '@/pages/common/tabDialogMixin.js'
import { Encrpt } from '@/utils/endecrept.js'
export default {
  name: 'EditForm',
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
      isShow: false,
      model: {},
      option: {}
    }
  },
  computed: {
    ...mapGetters([
      'userType',
      'siteType'
    ]),
    jtree () {
      return this.closest('jtree')
    },
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return $.formatFinal(FormFactory(this), null, this.option, !1)
    },
    gbFields () {
      return $.formatFinal(gbFormFactory(this), null, {}, !1)
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
          [Service.listRole, { siteId: model.siteId }],
          [Service.listUser, { id: model.id }, 'put']
        ],
        events: [
          (r) => {
            let { userType } = $.db.getConsts(),
              sites = $.db.getSites()
            me.option = {
              siteId: {
                name: 'name',
                value: 'id',
                list: sites
              },
              userType: {
                name: 'name',
                value: 'id',
                list: me.userType == 1 ? userType.slice(1) : userType.slice(1, 2)
              },
              role: {
                name: 'name',
                value: 'id',
                list: r[0].items
              }
            }
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
      this.model = Object.assign({}, $.modelTpl(this.fields, {}, {
        siteType: this.siteType,
        siteId: prop.siteId
      }))
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
              id: data.id,
              siteId: data.siteId
            },
            gbObj = {}
          if (obj.id) {
            if ('gb28181' in data) {
              var gbData = Util.isEmptyFn(data.gb28181) ? {} : JSON.parse(data.gb28181)
              $.copyValue(gbObj, gbData, this.gbFields)
            }
            $.copyValue(obj, data, this.fields)
            this.model = Object.assign({}, obj, gbObj)
          } else {
            let p1 = $.modelTpl(this.fields, this.option),
              p2 = $.modelTpl(this.gbFields, this.option)
            Object.assign(obj, p1, p2)
            this.model = Object.assign({}, obj, gbObj, {
              userType: $.db.getUserType() == 1 ? '2' : '1'
            })
          }
          this.dialog.end()
        })
      })
    },
    getSecondFormValue (model) {
      let map = {}
      this.gbFields.forEach(f => {
        if (f.name && (!f.show || f.show())) {
          var val = this.model[f.name]
          if (f.name == 'password') {
            map[f.name] = Encrpt(val)
          } else {
            map[f.name] = val
          }
        }
      })
      return {
        gb28181: JSON.stringify(map)
      }
    },
    getFormValue () {
      let fields = this.fields
      let map = {
        id: this.model.id,
        siteId: this.model.siteId
      }
      $.each(fields, (i, field) => {
        if (field.name && (!field.show || field.show())) {
          if (field.name != 'password-confirm') {
            map[field.name] = this.model[field.name]
            if (field.name == 'password') {
              map[field.name] = Encrpt(this.model[field.name])
            }
          }
        }
      })
      Object.assign(map, this.getSecondFormValue(this.model))
      return map
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        $.persist(model, 'addUser', 'editUser').then((r) => {
          this.nvMsg()
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

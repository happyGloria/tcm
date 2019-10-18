<template>
  <div v-loading.fullscreen="loading"
       class="page-gb">
    <form-factory ref="formFactory"
                  :init="renderInit"
                  :inline="true">
      <el-form-item>
        <el-button :loading="loading"
                   type="primary"
                   @click="submit">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </form-factory>
  </div>
</template>
<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import FormFactory from './fields.js'
import final from '@/data/final.js'
export default {
  name: 'LocalGb',
  mixins: [formFactoryMixin],
  data () {
    return {
      model: {},
      loading: !1,
      inline: true
    }
  },
  computed: {
    fields () {
      return $.formatFinal(FormFactory(this), final.gb, this.option, !1)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = !0
      // this.model = $.extend(true, {}, $.modelTpl(this.fields))
      return Service.getGB().then(r => {
        this.loading = !1
        this.model = $.copyValue_2({}, r.data, this.fields)
      })
    },
    getFormValue () {
      var map = {}
      let model = this.model
      $.for(this.fields, (filed) => {
        if (filed.name && (!filed.show || filed.show())) {
          map[filed.name] = model[filed.name]
        }
      })
      return map
    },
    submit () {
      if (this.model.flag == 0) {
        this.saveAjax(() => {
          this.close()
        })
      } else {
        this.validate(() => {
          this.saveAjax(() => {
            this.close()
          })
        })
      }
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        Service.setGB(model).then((r) => {
          $.db.setBJVMS(model.bjVMS)
          this.$message.success('操作成功')
          // vms控制录像计划启动、停止按钮、国标状态页签是否显示
          setTimeout(() => location.reload(), 1000)
        }, () => {
          this.loading = false
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      })
    },
    close () {
      this.init().then(() => this.$message.warning('操作取消'))
    }
  }
}
</script>
<style lang="less">
.page-gb {
  .el-form {
    .el-form-item:last-child {
      width: 100%;
      height: 50px;
      position: relative;
      .el-form-item__content {
        position: absolute;
        top: 50%;
        left: 45%;
        transform: translate(-50%,-50%);
      }
    }
  }
}
</style>

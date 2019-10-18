<template>
  <nv-dialog ref="dialog" :title="title" class="zone-camera-dialog">
    <div class="form-content">
      <div class="table-wraper">
        <edit-camera ref="ctable" :list="cameras"/>
      </div>
      <div class="btn-action">
        <el-button size="small" class="btn2" type="primary" @click="submit">确定</el-button>
        <el-button size="small" class="btn2" @click="close">取消</el-button>
      </div>
    </div>
  </nv-dialog>
</template>

<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import editCamera from '@/pages/common/editCamera'
export default {
  name: 'CameraForm',
  components: {
    editCamera
  },
  mixins: [formFactoryMixin],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cameras: [],
      isOpen: !1,
      isInit: !1,
      model: {},
      filter: {
        siteId: ''
      }
    }
  },
  computed: {
    jtree () {
      return this.closest('jtree')
    },
    ctable () {
      return this.$refs.ctable
      // return $.ref.call(this, name)
    }
  },
  methods: {
    open (prop) {
      this.dialog.open(() => {
        this.cameras = prop.list
        this.model = prop
        this.dialog.end()
      })
    },
    saveAjax (callback) {
      /* var aChecked = this.ctable.getValue()
      if (aChecked.length == 0) {
        return this.msg('请至少选择一个摄像机')
      } */
      this.$refs.ctable.validate().then(cameras => {
        this.start(() => {
          Service.addCameras2Zone({
            cameras,
            zoneId: this.model.zoneId
          }).then((r) => {
            this.$message.success('操作成功')
            this.close()
            $.fire(callback)
            this.jtree.init().then(() => this.$parent.refreshFn())
          }).finally(this.end)
        })
      })
    },
    submit () {
      this.saveAjax(() => {
        this.isInit = !1
        this.$refs.ctable.clear(() => {
          this.model = {}
        })
      })
    }
  }
}
</script>
<style lang="less">
.zone-camera-dialog {
  .form-content {
    width: 100%;
    height: 98%;
    position: relative;
  }
  .edit-camera {
    height: 100%;
  }
  .table-wraper {
    height: calc(~"100% - 60px");
    .el-table {
      height: calc(~"100% - 84px");
    }
    .el-table__body-wrapper {
      height: calc(~"100% - 40px");
    }
  }
  .btn-action {
    position: absolute;
    bottom: 10px;
    height: 40px;
  }
}
</style>

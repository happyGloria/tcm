<template>
  <div v-loading="loading" class="edit-permission">
    <el-tabs v-model="tab">
      <el-tab-pane label="实时视频"
                   name="first">
        <access-tree ref="realTree"
                     :dataSet="realList"
                     :checkedKeys="realChecked" />
      </el-tab-pane>
      <el-tab-pane label="云台控制"
                   name="second">
        <access-tree ref="ptzTree"
                     :dataSet="ptzList"
                     :checkedKeys="ptzChecked" />
      </el-tab-pane>
      <el-tab-pane label="监视器权限"
                   name="third">
        <monitor ref="monitorTree"
                 :data="monitorList"
                 :checked="monitorChecked" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Monitor from './monitor.vue'
import AccessTree from './accessTree.vue'
export default {
  components: {
    Monitor,
    AccessTree
  },
  data () {
    return {
      loading: false,
      tab: 'first',
      /* 云台 */
      ptzList: [],
      ptzChecked: [],
      /* 实时视频 */
      realList: [],
      realChecked: [],
      /* 监视器 */
      monitorList: [],
      monitorChecked: []
    }
  },
  methods: {
    init (model, access) {
      this.loading = true
      Promise.all([
        Service.listZoneAndCameraInfo({ siteId: model.siteId }),
        Service.listDevice4Type({ siteId: model.siteId, deviceType: 'Monitor' })
      ]).then(r => {
        this.ptzList = r[0].items.filter(item => {
          if (item.nodeType == 'Camera') {
            return item.deviceSubType == 1
          } else {
            return true
          }
        })
        this.realList = r[0].items
        if (access) {
          var obj = JSON.parse(access)
          /* 监视器 */
          this.monitorChecked = obj.monitor == 'all' ? r[1].items.map(d => d.id) : obj.monitor
          /* 实时视频 */
          this.realChecked = []
          Object.values(obj.real).forEach(item => this.realChecked.push(...item))
          /* 云台控制 */
          this.ptzChecked = []
          Object.values(obj.ptz).forEach(item => this.ptzChecked.push(...item))
        }
        this.monitorList = r[1].items.map(item => {
          return Object.assign({}, item, {
            isChecked: this.monitorChecked.indexOf(item.id) > -1
          })
        })

        this.loading = false
      })
    },
    getValue () {
      return {
        monitor: this.$refs.monitorTree.getValue(),
        real: this.$refs.realTree.getValue(),
        ptz: this.$refs.ptzTree.getValue()
      }
    }
  }
}
</script>

<style lang="less">
.edit-permission {
  position: relative;
  width: 80%;
  height: 400px;
  border-radius: 3px;
  border: 1px solid #a4d5f9;
  .el-tabs {
    height: 100%;
  }
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }
  .el-tabs__header {
    background-color: #47b1ff;
    margin-bottom: 0;
    .el-tabs__item,
    .el-tabs__item.is-active {
      position: relative;
      font-size: 12px;
      color: #fff;
      padding: 0 20px;
    }
    .el-tabs__item.is-active::after {
      content: "";
      position: absolute;
      bottom: 1px;
      left: calc(50% - 6px);
      border: 6px solid transparent;
      border-bottom: 10px solid #eee;
    }
    .el-tabs__active-bar {
      background-color: transparent;
    }
  }
  .el-tabs__content {
    padding: 20px;
    font-size: 12px;
    height: calc(~"100% - 40px");
    .el-tab-pane {
      height: 100%;
    }
  }
  /* .el-tabs .el-tabs__header{
    position: relative;
    outline: 1px solid #47b1ff;
    margin-bottom: 0;
    border-bottom: 1px solid #d1dbe5;
    padding: 0;
    margin: 0 0 15px;
  } */
}
</style>

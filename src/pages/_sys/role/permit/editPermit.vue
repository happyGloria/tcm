<template>
  <div v-loading="loading"
       class="edit-permission">
    <el-tabs v-model="tab"
             @tab-click="tabClickFn">
      <el-tab-pane label="实时视频"
                   name="first">
        <template slot="label">
          <div class="filter-field">
            <div class="wrap-icon">
              <i>实时视频</i>
              <i class="icon icon-filter"
                 @click="showRealFilter = !showRealFilter" />
            </div>
          </div>
        </template>
        <div v-show="showRealFilter"
             class="filter-content">
          <div style="position: relative;height: 40px;line-height: 40px;width: 400px;">
            <span class="label-txt"
                  style="position: absolute;left: 0;">名称：</span>
            <el-input v-model="realFilterText"
                      style="position: absolute;width: 70%;left: 80px;"
                      placeholder="请输入检索信息"
                      clearable
                      @change="changeFilter" />
          </div>
        </div>
        <div :class="['tree-wrap', { 'height_40': showRealFilter }]">
          <access-tree ref="realTree"
                       :dataSet="realList"
                       :checkedKeys="realChecked" />
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="isNotBJVMS"
                   label="云台控制"
                   name="second">
        <template slot="label">
          <div class="filter-field">
            <div class="wrap-icon">
              <i>云台控制</i>
              <i class="icon icon-filter"
                 @click="showPtzFilter = !showPtzFilter" />
            </div>
          </div>
        </template>
        <div v-show="showPtzFilter"
             class="filter-content">
          <div style="position: relative;height: 40px;line-height: 40px;width: 400px;">
            <span class="label-txt"
                  style="position: absolute;left: 0;">名称：</span>
            <el-input v-model="ptzFilterText"
                      style="position: absolute;width: 70%;left: 80px;"
                      placeholder="请输入检索信息"
                      clearable
                      @change="changePtzFilter" />
          </div>
        </div>
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
import { deepClone } from '@/util/utils.js'
export default {
  components: {
    Monitor,
    AccessTree
  },
  data () {
    return {
      loading: false,
      tab: 'first',
      realFilterType: ['1', '2', '3'],
      realFilterTypes: [
        { value: '1', text: '球机' },
        { value: '2', text: '半球' },
        { value: '3', text: '枪机' }
      ],
      realFilterText: '',
      ptzFilterText: '',
      showRealFilter: false,
      showPtzFilter: false,
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
  computed: {
    isNotBJVMS () {
      return $.db.getBJVMS() == 0
    }
  },
  methods: {
    changePtzFilter () {
      this.$refs.ptzTree && this.$refs.ptzTree.filterParam(Object.assign({}, {
        type: ['1'],
        text: this.ptzFilterText
      }))
    },
    changeFilter () {
      this.$refs.realTree.filterParam(Object.assign({}, {
        type: this.realFilterType,
        text: this.realFilterText
      }))
    },
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
        }).slice(0)
        this.realList = r[0].items.slice(0)
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
        this.$nextTick(() => this.tabClickFn())
      })
    },
    getValue () {
      return {
        monitor: this.$refs.monitorTree.getValue(),
        real: this.$refs.realTree.getValue(),
        ptz: this.$refs.ptzTree ? this.$refs.ptzTree.getValue() : {
          Camera: [],
          Civil: [],
          Site: this.ptzList.filter(d => d.nodeType == 'Site').map(d => d.id)
        }
      }
    },
    tabClickFn (tab, event) {
      let realList = this.$refs.realTree.getCheckedNodes().map(d => d.id),
        ptzChecked = this.$refs.ptzTree ? this.$refs.ptzTree.getCheckedNodes().filter(d => {
          if ($.isEmptyFn(d.disabled) || d.disabled == false) {
            return d
          }
        }).map(d => d.id) : [],
        tempPtzArr = deepClone(this.ptzList)
      this.ptzList = tempPtzArr.map(item => {
        if (item.nodeType == 'Camera' && realList.indexOf(item.id) < 0) {
          return Object.assign(item, { disabled: true })
        }
        return Object.assign(item, { disabled: false })
      })
      this.ptzChecked = ptzChecked
    }
  }
}
</script>

<style lang="less">
.edit-permission {
  position: relative;
  width: 50%;
  height: 400px;
  border-radius: 3px;
  border: 1px solid #a4d5f9;
  .tree-wrap {
    height: 100%;
    &.height_40 {
      height: calc(~"100% - 40px");
    }
  }
  .filter-content {
    background-color: rgba(71, 177, 255, 0.39);
    padding: 5px 10px;
    .el-checkbox {
      .el-checkbox__label {
        color: rgb(96, 98, 102);
      }
      &.is-checked .el-checkbox__label {
        color: #409eff;
      }
    }
    span.label-txt {
      display: inline-block;
      width: 80px;
      text-align: right;
      font-size: 12px;
      color: rgb(96, 98, 102);
    }
  }
  .el-tabs {
    height: 100%;
  }
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }
  .el-tabs__header {
    background-color: #47b1ff;
    margin-bottom: 0;
    .el-tabs__item {
      height: 38px;
      &.is-active {
        background-color: rgba(41, 142, 246, 0.75);
      }
    }
    .el-tabs__item,
    .el-tabs__item.is-active {
      position: relative;
      font-size: 12px;
      color: #fff;
      padding: 0 20px;
      .icon-filter:hover {
        color: #ffd600;
      }
    }
    .el-tabs__item.is-active::after {
      content: "";
      position: absolute;
      bottom: 0px;
      left: calc(50% - 6px);
      border: 6px solid transparent;
      border-bottom: 10px solid #eee;
    }

    .el-tabs__active-bar {
      background-color: transparent;
    }
  }
  .el-tabs__content {
    padding: 10px 20px;
    font-size: 12px;
    height: calc(~"100% - 40px");
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>

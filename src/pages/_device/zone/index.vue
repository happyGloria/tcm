<template>
  <div class="page-zone clearfix">
    <div class="zone-tree fl">
      <div class="tree-tool">
        <el-button :disabled="zoneAddDisabled"
                   type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   title="添加分区"
                   plain
                   @click="addZoneFn" />
        <el-button :disabled="zoneEditDisabled"
                   type="primary"
                   icon="el-icon-edit"
                   size="mini"
                   title="修改分区"
                   plain
                   @click="editZoneFn" />
        <el-button :disabled="zoneDeleteDisabled"
                   type="primary"
                   icon="el-icon-delete"
                   size="mini"
                   title="删除分区"
                   plain
                   @click="delZoneFn" />
      </div>
      <nv-tree ref="jtree"
               :setting="treeSetting" />
    </div>
    <div class="zone-list fl">
      <el-tabs ref="ztab"
               v-model="activeTabName"
               @tab-click="tabClickFn">
        <el-tab-pane label="摄像机列表"
                     name="list">
          <nv-table ref="jtable"
                    :setting="gridConfig" />
        </el-tab-pane>
        <el-tab-pane :disabled="mapDisabled"
                     label="地图"
                     name="map">
          <zone-map ref="zmap" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <zone-form ref="zoneDialog"
               :title="title" />
    <camera-form ref="cameraForm"
                 :title="title" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import filterMixin from '~/common/filterMixin'
import zoneMap from './module/map/index.vue'
import zoneForm from './module/zone/dialog.vue'
import cameraForm from './module/camera/dialog.vue'

import { parseTree } from './utils.js'

export default {
  components: {
    zoneForm,
    zoneMap,
    cameraForm
  },
  mixins: [filterMixin],
  data () {
    var me = this
    return {
      mapDisabled: !0,
      zoneAddDisabled: !0,
      zoneEditDisabled: !0,
      zoneDeleteDisabled: !0,
      title: '',
      listLabel: '',
      prevNode: null,
      prevNodeKey: null, // 上次激活的树节点
      activeTabName: 'list',
      filter: {
        /* zoneId: '', */
        deviceSubType: ''
      },
      treeSetting: {
        showFilter: !0,
        nodeKey: 'id',
        ajax: {
          init () {
            return Service.listZoneCameraCount().then(({ items }) => parseTree(items))
          }
        },
        nodeClickFn (node, data) {
          me.prevNode = node
          me.prevNodeKey = node.id
          me.activeTabName = 'list'
          me.$store.dispatch('SET_ACTIVE_ZONE_NODE', me.jtree.getActive())
          me.jtable.clear(() => me.refreshFn(node, data))
        },
        initNodeFn (list) {
          var curKey = me.prevNodeKey ? [me.prevNodeKey] : [list[0][this.nodeKey]]
          // var activeKey = list[0].children[0].id
          me.jtree.curNodeKeys = curKey
          me.jtree.setCurrentNode(curKey[0])
        },
        renderFn ($$, { node, data }) {
          var {
            id,
            name,
            total,
            nodeType,
            siteType,
            icon
          } = node.data
          return (
            <div data-id={id} data-type={nodeType} class={{ node: true }}>
              <span class={['icon', 'icon-' + `${nodeType == 'leaf' ? icon : (nodeType == 'Zone' ? 'Zone' : siteType)}`]}></span>
              <span class='node-name' title={name}>{name}</span>
              <span class='count'>{`(${total})`}</span>
            </div>
          )
        }
      },
      gridConfig: {
        selectable: !0,
        pagination: !0,
        actions: [
          {
            name: 'refresh',
            icon: 'icon icon-refresh',
            title: '刷新',
            handleFn (data) {
              me.refreshFn()
            }
          },
          {
            name: 'create',
            icon: 'el-icon-edit-outline',
            title: '分配摄像机',
            disabledFn () {
              return me.jtree.getActive() && me.jtree.getActive().nodeType !== 'Zone'
            },
            handleFn () {
              me.title = '分配摄像机'
              let {
                siteId,
                id: zoneId
              } = me.jtree.getActive()
              /* let {
                pageNo,
                pageSize
              } = me.cameraForm.gridConfig.pager */
              Service.listCameraWithoutZone({ siteId }).then(r => {
                if (r.total > 0) {
                  me.cameraForm.open({
                    siteId,
                    zoneId,
                    ajaxedVal: r,
                    list: r.items
                  })
                } else {
                  return me.msg('暂无可分配的摄像机!')
                }
              })
            }
          },
          {
            name: 'batchDel',
            icon: 'el-icon-delete',
            title: '批量删除',
            handleFn () {
              me.delFn()
            }
          }
        ],
        listenerWidth: '150px',
        listeners: [
          {
            name: 'delete',
            icon: 'el-icon-delete',
            title: '删除',
            handleFn (data) {
              me.delFn(data)
            }
          }
        ],
        column: [
          { type: 'index', name: '序号', width: '60', minWidth: '50' },
          {
            key: 'deviceSubType', name: '设备类型', width: '220', sortable: true,
            format: (value) => {
              return `<i class="icon icon-Camera-${value}"></i>` + $.v2str('cameraType', value)
            }
          },
          { key: 'name', name: '名称', sortable: true },
          { key: 'ip', name: 'IP地址' },
          { key: 'channelNo', name: '通道号' },
          {
            key: 'zoneName', name: '分区名称',
            format (val) {
              return Util.isEmptyFn(val) ? '--' : val
            }
          },
          {
            key: 'gbId', name: '国标编号',
            format (val) {
              return Util.isEmptyFn(val) ? '--' : val
            }
          }
        ],
        ajax: {
          init: (pageInfo) => {
            var param = Object.assign({}, pageInfo, me.filter)
            return Service.listCameraByZone(param).then(r => r)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['activeZoneNode']),
    jtree () {
      return this.$refs.jtree
    },
    jtable () {
      return this.$refs.jtable
    },
    zmap () {
      return this.$refs.zmap
    },
    zoneDialog () {
      return this.$refs.zoneDialog
    },
    cameraForm () {
      return this.$refs.cameraForm
    }
  },
  watch: {
    activeZoneNode (node) {
      this.zoneAddDisabled = !(['Site', 'Zone'].indexOf(node.nodeType) > -1)
      this.zoneEditDisabled = !(['Zone'].indexOf(node.nodeType) > -1)
      this.zoneDeleteDisabled = !(['Zone'].indexOf(node.nodeType) > -1)
      // 地图功能是否可用
      this.mapDisabled = node.nodeType != 'Zone'/*  || !(node.hasOwnProperty('list')) */
    }
  },
  mounted () {
    this.jtree.init().then((list) => {
      this.$store.dispatch('SET_ACTIVE_ZONE_NODE', this.jtree.getActive())
      this.refreshFn()
    })
  },
  methods: {
    tabClickFn (tab) {
      this.$store.dispatch('SET_ZONE_TAB', tab.name)
      if (tab.name == 'map') {
        this.zmap.init()
      }
    },
    addZoneFn () {
      // var isDisabled = children && children.some(item => item.nodeType == 'leaf')
      /*  var curNode = this.jtree.getActive()
      if (!Util.isEmptyFn(curNode.list)) {
        return this.msg('该分区下已有摄像机，不能添加分区')
      } */
      this.title = '新建分区'
      this.zoneDialog.open()
    },
    editZoneFn () {
      var { id, name, mappingId, share, gb28181 } = this.jtree.getActive()
      this.title = '编辑分区'
      this.zoneDialog.open({ id, mappingId, name, share, gb28181 })
    },
    delZoneFn () {
      var { id } = this.jtree.getActive()
      this.$confirm('确认要删除这个分区吗？', '提示', { type: 'warning' })
        .then(() => {
          Service.delZone({ id }).then(() => {
            if (this.prevNode && this.prevNode.parent) {
              this.prevNodeKey = this.prevNode.parent.id
              this.prevNode = this.prevNode.parent
              this.$store.dispatch('SET_ACTIVE_ZONE_NODE', this.prevNode)
            }
            this.jtree.init().then(() => {
              this.activeTabName = 'list'
              this.$message.success('操作成功')
              this.refreshFn()
            })
          })
        }, () => this.$message.warning('操作取消'))
    },
    refreshFn () {
      var node = this.jtree.getActive()
      let {
        id,
        parentId,
        nodeType,
        cameraType
      } = node
      switch (nodeType) {
        case 'Site':
          Object.assign(this.filter, {
            siteId: id,
            zoneId: '',
            deviceSubType: ''
          })
          this.mapDisabled = true
          break
        case 'Zone':
          Object.assign(this.filter, {
            siteId: node.siteId,
            zoneId: id,
            deviceSubType: ''
          })
          // this.mapDisabled = !node.hasOwnProperty('list')
          break
        case 'leaf':
          Object.assign(this.filter, {
            siteId: node.siteId,
            zoneId: parentId,
            deviceSubType: cameraType
          })
          break
      }
      this.jtable.init()
    },
    delFn (row) {
      var aChecked = [row]
      if (!row) {
        aChecked = this.jtable.getChecked()
        if (!aChecked.length) {
          return this.$message({
            message: '请至少选择一条信息',
            type: 'warning'
          })
        }
      }
      var curNode = this.jtree.getActive(), zoneId = ''
      switch (curNode.nodeType) {
        case 'leaf':
          zoneId = curNode.parentId
          break
        default:
          zoneId = curNode.id
      }
      this.$confirm('确认从该分区移除这些设备吗？', '提示', { type: 'warning' })
        .then(() => {
          Service.delCameraFromZone({
            cameras: aChecked.map((item) => item.id),
            zoneId
          }).then(() => {
            this.$message.success('操作成功')
            this.jtree.init().then(() => this.query())
          })
        }, () => this.$message.warning('操作取消'))
    }
  }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
.page-zone {
  .zone-tree,
  .zone-list {
    border: 1px solid #ccc;
    height: 100%;
  }
  .zone-tree {
    width: 280px;
    margin-right: 10px;
    background-color: #fff;
    .tree-tool {
      text-align: center;
      padding: 10px 10px 0;
    }
    .node .node-name {
      .ellipsis(100px);
    }
    .nv-tree {
      height: calc(~"100% - 50px");
    }
  }
  .zone-list {
    width: calc(~"100% - 290px");
    padding: 0 10px;
    .el-tabs {
      height: calc(~"100% - 10px");
    }
    .el-tabs__content {
      height: calc(~"100% - 50px");
    }
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>

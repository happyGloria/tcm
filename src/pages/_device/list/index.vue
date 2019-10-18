<template>
  <div class="page-device clearfix">
    <div class="device-tree fl">
      <nv-tree ref="jtree"
               :setting="treeSetting" />
    </div>
    <div class="device-list fl">
      <nv-table ref="jtable"
                :setting="gridConfig">
        <div slot="filter">
          <el-input v-model="filter.selectParam"
                    placeholder="请输入查询条件"
                    @keyup.enter.native="refreshFn">
            <el-tooltip slot="prefix"
                        content="检索范围：设备IP、设备名称"
                        effect="light"
                        placement="top-end">
              <i class="icon icon-qs" />
            </el-tooltip>
            <i slot="suffix"
               class="el-input__icon el-icon-close"
               @click="clearFilter" />
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="refreshFn" />
          </el-input>
        </div>
      </nv-table>
    </div>
    <server-form ref="ServerForm"
                 :title="title" />
    <camera-form ref="CameraForm"
                 :title="title" />
    <encoder-form ref="EncoderForm"
                  :title="title" />
    <decoder-form ref="DecoderForm"
                  :title="title" />
    <keyboard-form ref="KeyboardForm"
                   :title="title" />
  </div>
</template>
<script>
import filterMixin from '~/common/filterMixin'
import { getColumn } from './column.js'
import ServerForm from './dialog/server/dialog.vue'
import CameraForm from './dialog/camera/dialog.vue'
import EncoderForm from './dialog/encoder/dialog.vue'
import DecoderForm from './dialog/decoder/dialog.vue'
import KeyboardForm from './dialog/keyboard/dialog.vue'

import { parseTree, editForm } from './utils.js'
export default {
  name: 'DeviceList',
  components: {
    ServerForm,
    CameraForm,
    EncoderForm,
    DecoderForm,
    KeyboardForm
  },
  mixins: [filterMixin],
  data () {
    var me = this
    return {
      title: '',
      prevNodeKey: null, // 上次激活的树节点
      filter: {
        siteId: '',
        deviceType: '',
        deviceSubType: '',
        selectParam: ''
      },
      treeSetting: {
        nodeKey: 'key',
        props: {
          children: 'children',
          label: 'name'
        },
        initNodeFn (list) {
          var curKey = me.prevNodeKey ? [me.prevNodeKey] : [list[0][this.nodeKey]]
          me.jtree.curNodeKeys = curKey
          me.jtree.setCurrentNode(curKey[0])
        },
        ajax: {
          init () {
            return Service.listDeviceCount().then(({ items }) => parseTree(items))
          }
        },
        nodeClickFn (node, data) {
          me.prevNodeKey = node.key
          me.jtable.clear(() => me.refreshFn(node))
        },
        renderFn ($$, { node, data }) {
          return (
            <div class={{ node: true, 'data-key': node.data.id, 'data-type': data.nodeType }}>
              <span class={['icon', 'icon-' + node.data.icon]}></span>
              <span>{node.label}</span>
              <span class='count'>{data.nodeType == 'site' ? '' : `（${data.count}）`}</span>
            </div>
          )
        }
      },
      gridConfig: {
        clz: 'device-grid',
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
            title: '添加',
            disabledFn () {
              var activeNode = me.jtree.getActive()
              return activeNode ? activeNode.nodeType == 'site' : false
            },
            handleFn (data) {
              me.title = '添加' + me.getDialogTitle()
              editForm.call(me)
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
        listenerWidth: '140px',
        listeners: [
          {
            name: 'edit',
            icon: 'icon icon-release',
            title: '释放云台',
            showFn ({ deviceType, deviceSubType }) {
              return (deviceType == 'Camera' && deviceSubType == 1)
            },
            /* disabledFn ({ deviceType, deviceSubType }) {
              return !(deviceType == 'Camera' && deviceSubType == 1)
            }, */
            handleFn ({ id }) {
              Service.releasePTZ({ id }).then(r => me.$message.success('操作成功'))
            }
          },
          {
            name: 'edit',
            icon: 'icon icon-sync',
            title: '同步',
            showFn ({ deviceType, deviceSubType }) {
              return (deviceType == 'Server' && deviceSubType == 'VideoPlatform')
            },
            handleFn ({ id }) {
              Service.syncCameraInfo({ id }).then(r => me.$message.success('操作成功'))
            }
          },
          {
            name: 'edit',
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              me.title = '编辑' + me.getDialogTitle()
              editForm.call(me, data)
            }
          },
          {
            name: 'delete',
            icon: 'el-icon-delete',
            title: '删除',
            handleFn (data) {
              me.delFn(data)
            }
          }
        ],
        column: getColumn('default'),
        ajax: {
          init: (pageInfo) => {
            var param = Object.assign({}, pageInfo, me.filter)
            return Service.listDevice4Type(param).then(r => r)
          }
        }
      }
    }
  },
  computed: {
    jtree () {
      return this.$refs.jtree
    },
    jtable () {
      return this.$refs.jtable
    },
    dialog () {
      return this.$refs.dialog
    }
  },
  mounted () {
    this.jtree.init().then(r => this.refreshFn())
  },
  methods: {
    clearFilter () {
      this.filter.selectParam = ''
    },
    getDialogTitle () {
      var nodeKeyArr = String(this.jtree.getActive().key).split('-')
      return $.v2str('deviceType', nodeKeyArr[1])
    },
    refreshFn () {
      var nodeKeyArr = String(this.jtree.getActive().key).split('-')
      Object.assign(this.filter, {
        siteId: nodeKeyArr[0],
        deviceType: nodeKeyArr[1] || '',
        deviceSubType: nodeKeyArr[2] || ''
      })
      this.jtable.setColumn(getColumn(nodeKeyArr[1] || 'default'))
      this.jtable.init()
    },
    delFn (row) {
      var aChecked = [row]
      if (!row) {
        aChecked = this.jtable.getChecked()
        if (!aChecked.length) {
          return this.$message.warning('请至少选择一条信息')
        }
      }
      this.$confirm('确认要删除这些设备吗？', '提示', { type: 'warning' }).then(() => {
        Service.delDevice({ ids: aChecked.map((item) => item.id) }).then(r => {
          this.$message.success('操作成功')
          this.jtree.init().then(r => this.refreshFn())
        })
      }, () => this.$message.warning('操作取消'))
    }
  }
}
</script>
<style lang="less">
.page-device {
  .device-tree,
  .device-list {
    border: 1px solid #ccc;
    height: 100%;
  }
  .device-tree {
    width: 280px;
    margin-right: 10px;
  }
  .device-list {
    width: calc(~"100% - 290px");
    padding: 10px;
    .icon-release {
      font-size: 12px;
    }
  }
  .area-filter {
    width: 280px;
    /* .el-input__suffix {
      top: 8px;
    } */
    .el-input__prefix {
      top: 8px;
      left: 10px;
    }
    .el-input__suffix {
      .el-input__icon {
        line-height: 33px;
        &:hover {
          color: red;
          cursor: pointer;
        }
      }
    }
  }
  .icon-sync {
    font-size: 13px;
  }
}
</style>

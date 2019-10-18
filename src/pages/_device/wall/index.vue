<template>
  <div class="page-device clearfix">
    <div class="device-tree fl">
      <nv-tree ref="jtree"
               :setting="treeSetting" />
    </div>
    <div class="device-list fl">
      <nv-table ref="jtable"
                :setting="gridConfig" />
    </div>
    <edit-form ref="dialog"
               :title="title" />
  </div>
</template>

<script>
import filterMixin from '~/common/filterMixin'
import EditForm from './dialog.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    EditForm
  },
  mixins: [filterMixin],
  data () {
    let me = this
    return {
      title: '',
      prevNodeKey: null, // 上次激活的树节点
      filter: {
        siteId: '',
        deviceType: 'Monitor'
      },
      treeSetting: {
        nodeKey: 'siteId',
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
            return Service.listSiteTree({ type: 'Monitor' }).then(({ items }) => items)
          }
        },
        nodeClickFn (node, data) {
          me.prevNodeKey = node.key
          me.jtable.clear(() => me.refreshFn(node))
        },
        renderFn ($$, { node, data }) {
          return (
            <div class={{ node: true, 'data-key': data.siteId }}>
              <span class={['icon', 'icon-' + data.siteType]}></span>
              <span>{data.siteName}</span>
              <span class='count'>({data.count})</span>
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
            title: '添加',
            handleFn () {
              me.title = '添加电视墙'
              let {
                siteId
              } = me.jtree.getActive()
              me.dialog.open({ siteId })
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
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              me.title = '编辑设备'
              me.dialog.open(data)
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
        column: [
          { type: 'index', name: '序号', width: '60', minWidth: '50' },
          { key: 'name', name: '名称' },
          { key: 'decoderName', name: '解码器名称' },
          { key: 'ip', name: 'IP地址' },
          { key: 'channelNo', name: '通道编号' },
          { key: 'driverInfo', name: '驱动类型' },
          { key: 'mappingId', name: '编号', format: (val) => Util.isEmptyFn(val) ? '--' : val }
        ],
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
    },
    ...mapGetters(['siteType'])
  },
  mounted () {
    this.jtree.init().then(() => {
      this.refreshFn()
    })
  },
  methods: {
    refreshFn () {
      let { siteId } = this.jtree.getActive()
      Object.assign(this.filter, { siteId })
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
      this.$confirm('确认要删除这些设备吗？', '提示', { type: 'warning' })
        .then(() => {
          Service.delDevice({ ids: aChecked.map((item) => item.id) }).then(r => {
            this.$message.success('操作成功')
            this.jtree.init().then(() => this.refreshFn())
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
  }
}
</style>

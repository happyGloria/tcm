<template>
  <div class="page-store clearfix">
    <div class="store-tree fl">
      <nv-tree ref="jtree"
               :setting="treeSetting" />
    </div>
    <div class="store-list fl">
      <nv-table ref="jtable"
                :setting="gridConfig">
        <div slot="expandTpl"
             slot-scope="scope"
             class="expand-tpl">
          <el-table :data="scope.info.cameras"
                    :span-method="arraySpanMethod"
                    height="198"
                    style="width:99%">
            <el-table-column type="index"
                             label="#"
                             width="60"
                             align="center" />
            <el-table-column v-for="ec in expandColumn"
                             :key="ec.prop"
                             :prop="ec.prop"
                             :label="ec.name"
                             :width="ec.width"
                             :sortable="ec.sortable"
                             align="center"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="ec.format ? ec.format(scope.row, scope.row[ec.prop]) : scope.row[ec.prop]" />
              </template>
            </el-table-column>
            <el-table-column :label="`总数 ：${scope.info.cameras.length}`"
                             prop=""
                             align="center" />
          </el-table>
        </div>
      </nv-table>
    </div>
    <edit-form ref="dialog"
               :title="title" />
  </div>
</template>

<script>
import filterMixin from '~/common/filterMixin'
import EditForm from './dialog.vue'
export default {
  name: 'StoreList',
  components: {
    EditForm
  },
  mixins: [filterMixin],
  data () {
    var me = this
    return {
      filter: {
        siteId: ''
      },
      title: '',
      prevNode: null,
      prevNodeKey: null, // 上次激活的树节点
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
            return Service.listSiteTree({ type: 'Recordplan' }).then(({ items }) => items)
          }
        },
        nodeClickFn (node, data) {
          me.prevNode = node
          me.prevNodeKey = node.siteId
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
        selectable: !1,
        pagination: !0,
        expandable: !0,
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
              me.title = '添加录像计划'
              let {
                siteId
              } = me.jtree.getActive()
              Service.listDeviceWithoutPlan({ siteId }).then(({ items }) => {
                if (items.storages.length > 0) {
                  me.dialog.open({ siteId })
                } else {
                  me.$message.error('请先添加存储服务器，再设置录像计划')
                }
              })
            }
          }
        ],
        listenerWidth: '160px',
        listeners: [
          {
            name: 'delete',
            icon: 'icon icon-start',
            title: '启动',
            showFn () {
              return $.db.getBJVMS() == 1
            },
            handleFn ({ siteId, id }) {
              Service.startPlan({ siteId, id }).then(() => me.$message.success('操作成功'))
            }
          },
          {
            name: 'delete',
            icon: 'icon icon-stop',
            title: '停止',
            showFn () {
              return $.db.getBJVMS() == 1
            },
            handleFn ({ siteId, id }) {
              me.$confirm('确认停止此录像计划吗？', '提示', { type: 'warning' })
                .then(() => {
                  Service.stopPlan({ id, siteId }).then(() => me.$message.success('操作成功'))
                }, () => {
                  me.$message.warning('操作取消')
                })
            }
          },
          {
            name: 'edit',
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              let {
                siteId
              } = me.jtree.getActive()
              me.title = '编辑录像计划'
              me.dialog.open({
                siteId,
                id: data.id
              })
            }
          },
          {
            name: 'delete',
            icon: 'el-icon-delete',
            title: '删除',
            handleFn (data) {
              me.delFn(data)
              // me.dialog.editCamera.clear()
            }
          }
        ],
        column: [
          { type: 'index', name: '序号', width: '60', minWidth: '50' },
          { key: 'name', name: '录像计划名称', width: 120, sortable: !0 },
          {
            key: 'days', name: '日期计划', width: 150,
            format: (value) => {
              return value == 'all' ? '全周' : $.db.getFinal().days.list
                .filter(d => JSON.parse(value).indexOf(Number(Object.keys(d)[0])) > -1)
                .map(d => Object.values(d)[0]).join('，')
            }
          },
          {
            key: 'streamMode', name: '取流方式', width: 120,
            format: (value) => $.v2str('streamMode', value)
          },
          {
            key: 'circle', name: '存储周期', width: 120,
            format: (value) => value + '天'
          },
          {
            key: 'timeRange', name: '录像时间',
            format: (from, { row }) => `${row.from} - ${row.to}`
          },
          { key: 'storageName', name: '存储服务器名称', minWidth: 120 }
        ],
        ajax: {
          init: (pageInfo) => {
            var param = Object.assign({}, pageInfo, me.filter)
            return Service.listPlan(param).then(r => r)
          }
        }
      },
      expandColumn: [
        { prop: 'id', name: '摄像机ID', width: 120 },
        { prop: 'name', name: '摄像机名称', width: 150 },
        {
          prop: 'deviceSubType', name: '摄像机类型', width: 120,
          format: ({ deviceSubType }, val) => {
            return `<i class="icon icon-Camera-${deviceSubType}"></i>${$.v2str('cameraType', deviceSubType)}`
          }
        },
        {
          prop: 'zoneName', name: '所属分区', width: 120
        },
        {
          prop: 'mappingId', name: '编号',
          format: (rowData, val) => Util.isEmptyFn(val) ? '--' : val
        },
        {
          prop: 'gbId', name: '国标编号',
          format: (rowData, val) => Util.isEmptyFn(val) ? '--' : val
        }
      ]
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
    this.jtree.init().then(() => this.refreshFn())
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 8) {
        /* if (rowIndex >= 0) { */
        return {
          rowspan: 10,
          colspan: 1
        }
        /* } */
      }
    },
    formatter (row) {
      var val = row.deviceSubType
      return `<i class="icon icon-Camera-${val}" style=""></i>` + $.v2str('cameraType', val)
    },
    refreshFn () {
      let {
        siteId
      } = this.jtree.getActive()
      Object.assign(this.filter, { siteId })
      this.jtable.init()
    },
    delFn (row) {
      let {
        siteId
      } = this.jtree.getActive()
      this.$confirm('确认要删除这个录像计划吗？', '提示', { type: 'warning' }).then(() => {
        Service.delPlan({
          id: row.id,
          siteId
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
.page-store {
  .store-tree,
  .store-list {
    border: 1px solid #ccc;
    height: 100%;
  }
  .store-tree {
    width: 280px;
    margin-right: 10px;
  }
  .store-list {
    width: calc(~"100% - 290px");
    padding: 10px;
  }
  .expand-tpl {
    padding: 10px 20px 10px 50px;
    .el-table {
      border: 1px solid #ebeef5;
      th {
        background-color: rgba(230, 162, 60, 0.12);
      }
    }
  }
  .el-table__row.expanded + tr {
    & > td {
      padding: 0 0;
    }
    td {
      background-color: #fafafa;
    }
  }
  .icon-start,
  .icon-stop {
    font-size: 13px;
  }
}
</style>

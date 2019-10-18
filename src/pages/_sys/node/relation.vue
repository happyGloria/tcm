<template>
  <div class="right-content">
    <nv-table ref="jtable"
              :setting="gridConfig" />
    <copy-dialog ref="copyDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import filterMixin from '~/common/filterMixin'
import EditForm from './dialog.vue'
import CopyDialog from './copyDialog.vue'
export default {
  components: {
    EditForm,
    CopyDialog
  },
  mixins: [filterMixin],
  data () {
    var me = this
    return {
      filter: {},
      gridConfig: {
        selectable: !0,
        pagination: !0,
        command: {
          name: '更多操作',
          commands: [
            { value: 1, name: '节点信息拷贝' }
          ],
          handleCommand (value) {
            me.copyDialog.open({})
          }
        },
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
            title: '新建',
            handleFn (data) {
              me.$parent.title = '新建节点'
              me.dialog.open({})
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
        listenerWidth: '80px',
        listeners: [
          {
            name: 'edit',
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              me.$parent.title = '编辑节点'
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
          { key: 'siteId', name: '节点ID', sortable: true },
          { key: 'no', name: '节点编号', sortable: true },
          {
            key: 'siteType', name: '节点类型', minWidth: '110', sortable: true,
            width: '100',
            format: (value) => {
              return `<i class="icon icon-${value}"></i> ${Util.v2str('siteType', value)}`
            }
          },
          { key: 'name', name: '节点名称', minWidth: '120' },
          { key: 'ip', name: 'IP地址', minWidth: '110' },
          {
            key: 'code', name: '同步类型', width: 120, minWidth: 120,
            format: (value) => {
              return $.isEmptyFn(value) ? '--' : `${Util.v2str('syncType', value)}`
            }
          },
          {
            key: 'code', name: '直属上级', width: 100, minWidth: 100,
            format: (value) => {
              return value > 0 ? '是' : '--'
            }
          },
          {
            key: 'gbId', name: '国标编号',
            format: (val) => {
              return $.isEmptyFn(val) ? '--' : val
            }
          }
        ],
        ajax: {
          init: (pageInfo) => {
            var param = Object.assign({}, pageInfo, me.filter)
            return Service.listNode(param).then(r => r)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'siteId'
    ]),
    dialog () {
      return this.$parent.$refs.dialog
    },
    copyDialog () {
      return this.$refs.copyDialog
    },
    jtable () {
      return this.$parent.jtable
    }
  },
  mounted () {
    if (this.siteId == -1) {
      return this.msg('请在【节点管理】页面，至少添加一个站点信息作为当前站点，否则无法继续操作！')
    } else {
      this.refreshFn()
    }
  },
  methods: {
    refreshFn () {
      return this.$parent.jtable.init()
    },
    delFn (row) {
      var aChecked = [row]
      if (!row) {
        aChecked = this.$parent.jtable.getChecked()
        if (!aChecked.length) {
          return this.msg('请至少选择一条信息')
        }
      }
      this.$confirm('确认要删除吗？', '提示', { type: 'warning' }).then(() => {
        Service.delSite({ ids: aChecked.map((item) => item.siteId) }).then(r => {
          this.$message.success('操作成功')
          this.query()
        })
      }, () => this.$message.warning('操作取消'))
    }
  }
}
</script>

<style lang="less" scoped>
.right-content {
  padding: 10px;
  height: calc(~"100% - 50px");
}
</style>

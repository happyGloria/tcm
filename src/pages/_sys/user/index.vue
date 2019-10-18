<template>
  <div class="page-user clearfix">
    <div class="sidebar fl">
      <nv-tree ref="jtree"
               :setting="treeSetting" />
    </div>
    <div class="main device-list fl">
      <nv-table ref="jtable"
                :setting="gridConfig" />
    </div>
    <edit-form ref="dialog"
               :title="title" />
    <pwd-form ref="pwdDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import filterMixin from '~/common/filterMixin'
import EditForm from './dialog.vue'
import PwdForm from './pwdDialog.vue'
export default {
  components: {
    EditForm,
    PwdForm
  },
  mixins: [filterMixin],
  data () {
    var me = this
    return {
      filter: {},
      title: '',
      prevNodeKey: null,
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
            return Service.listSiteTree({ type: 'User' }).then(({ items }) => items)
          }
        },
        nodeClickFn (node, data) {
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
        selectable: !0,
        pagination: !0,
        listenerWidth: '180px',
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
              me.title = '新建用户'
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
        listeners: [
          {
            name: 'delete',
            icon: 'icon icon-kickout',
            title: '强制退出',
            showFn ({ userType }) {
              return userType == 2
            },
            handleFn ({ id }) {
              Service.kickUser({ id }).then(r => me.$message.success('操作成功'))
            }
          },
          {
            name: 'delete',
            icon: 'icon icon-password',
            title: '密码修改',
            handleFn (data) {
              me.$refs.pwdDialog.open(data)
            }
          },
          {
            name: 'edit',
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              me.title = '编辑用户'
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
          {
            key: 'userType', name: '用户类型', sortable: true, minWidth: '100',
            format: (value) => {
              return `${$.v2str('userType', value)}`
            }
          },
          { key: 'name', name: '用户名', minWidth: '100', sortable: true },
          { key: 'account', name: '登录账号', minWidth: '100' },
          {
            key: 'role', name: '用户角色', minWidth: '200',
            format: (value) => $.isEmptyFn(value) ? '--' : value
          },
          {
            key: 'userLevel', name: '用户级别',
            format: (value) => $.isEmptyFn(value) ? '--' : value
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
            return Service.listUser(Object.assign({}, pageInfo, me.filter)).then(r => r)
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
    copyDialog () {
      return this.$refs.copyDialog
    },
    ...mapGetters(['siteId'])
  },
  mounted () {
    this.jtree.init().then(() => this.refreshFn())
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
          return this.$message.warning('请至少选择一条信息')
        }
      }
      this.$confirm('确认要删除吗？', '提示', { type: 'warning' })
        .then(() => {
          Service.delUser({ ids: aChecked.map((item) => item.id) }).then(r => {
            this.$message.success('操作成功')
            this.jtree.init().then(() => this.refreshFn())
          })
        }, () => this.$message.warning('操作取消'))
    }
  }
}
</script>
<style lang="less">
.page-user {
  .icon-password,
  .icon-kickout {
    font-size: 12px;
  }
}
</style>

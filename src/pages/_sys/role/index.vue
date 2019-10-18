<template>
  <div class="page-role clearfix">
    <div class="sidebar fl">
      <nv-tree ref="jtree"
               :setting="treeSetting" />
    </div>
    <div class="main fl">
      <nv-table ref="jtable"
                :setting="gridConfig">
        <div slot="expandTpl"
             slot-scope="props"
             class="expand-tpl">
          <p class="limit-access-ip">
            <span class="label">客户端限制IP：</span>
            <span>{{ getLimitIP(props.info.access) }}</span>
          </p>
        </div>
        <template slot="filter">
          <span class="txt">图例：</span>
          <span v-for="(d, idx) in legend"
                :key="idx"
                class="legend">
            <i :class="`icon icon-${d.icon}`" />
            <i class="txt">{{ d.txt }}</i>
          </span>
        </template>
      </nv-table>
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
    var me = this
    return {
      legend: [
        { icon: 'selected', txt: '允许' },
        { icon: 'unselected', txt: '禁止' },
        { icon: 'whole', txt: '全部选中' },
        { icon: 'part', txt: '部分选中' },
        { icon: 'none', txt: '无' }
      ],
      title: '新建角色',
      filter: {},
      prevNodeKey: null,
      treeSetting: {
        showFilter: !1,
        nodeKey: 'siteId',
        props: {
          children: 'children',
          label: 'siteName'
        },
        initNodeFn (list) {
          var curKey = me.prevNodeKey ? [me.prevNodeKey] : [list[0][this.nodeKey]]
          me.jtree.curNodeKeys = curKey
          me.jtree.setCurrentNode(curKey[0])
        },
        ajax: {
          init () {
            return Service.listSiteTree({ type: 'UserRole' }).then(({ items }) => items)
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
        clz: 'role-grid',
        selectable: !0,
        pagination: !0,
        expandable: !0,
        listenerWidth: '90px',
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
              me.title = '新建角色'
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
            name: 'edit',
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              me.title = '编辑角色'
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
          { key: 'name', name: '角色名称', sortable: true, minWidth: '120' },
          {
            key: 'access', name: '录像文件检索与回放',
            format (val) {
              return me.getIcon(val, 'record')
            }
          },
          {
            key: 'access', name: '录像文件下载',
            format (val) {
              return me.getIcon(val, 'download')
            }
          },
          {
            key: 'access', name: '查看地图',
            format (val) {
              return me.getIcon(val, 'map')
            }
          },
          {
            key: 'access', name: '实时视频',
            format (val) {
              return me.getIcon(val, 'real')
            }
          },
          {
            key: 'access', name: '云台控制',
            format (val) {
              return me.getIcon(val, 'ptz')
            }
          },
          {
            key: 'access', name: '监视器权限',
            format (val) {
              return me.getIcon(val, 'monitor')
            }
          }
        ],
        ajax: {
          init: (pageInfo) => {
            let { siteId } = me.jtree.getActive()
            return Service.listRole(Object.assign({}, pageInfo, me.filter, { siteId })).then(r => r)
          }
        }
      }
    }
  },
  computed: {
    sites () {
      return $.db.getSites()
    },
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
    ...mapGetters(['siteType']),
    curNode () {
      return this.$refs.jtree.$refs.tree.getCurrentNode()
    }
  },
  mounted () {
    this.jtree.init().then(() => this.refreshFn())
  },
  methods: {
    getLimitIP (access) {
      var obj = JSON.parse(access)
      return $.isEmptyFn(obj.ip) ? '暂无' : obj.ip
    },
    getIcon (data, key) {
      var obj = JSON.parse(data)
      var icon = ''
      switch (key) {
        case 'monitor':
          icon = obj[key] == 'all' ? 'whole' : obj[key].length ? 'part' : 'none'
          break
        case 'real':
        case 'ptz':
          if (this.curNode.siteType == 'OCC') {
            if (obj[key].Site.length == this.sites.length) {
              icon = 'whole'
            } else if (obj[key].Site.length || obj[key].Civil.length || obj[key].Camera.length) {
              icon = 'part'
            } else {
              icon = 'none'
            }
          } else {
            icon = obj[key] ? (obj[key].Site.length ? 'whole' : (obj[key].Civil.length || obj[key].Camera.length) ? 'part' : 'none') : 'none'
          }
          break
        case 'map':
        case 'download':
        case 'record':
          icon = obj[key] ? 'selected' : ($.isEmptyFn(obj[key]) ? '' : 'unselected')
          break
      }
      return `<i class="icon icon-${icon}"></i>`
    },
    refreshFn () {
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
      this.$confirm('确认要删除吗？', '提示', { type: 'warning' })
        .then(() => {
          Service.delRole({ ids: aChecked.map((item) => item.id) }).then(r => {
            this.$message.success('删除成功')
            this.query()
          })
        }, () => this.$message.warning('操作取消'))
    }
  }
}
</script>
<style lang="less">
.page-role {
  .grid-toolbar {
    .legend {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin-right: 8px;
    }
    i {
      vertical-align: middle;
    }
    .txt {
      color: #6d6d6d;
      font-size: 12px;
    }
  }
  .limit-access-ip {
    height: 40px;
    line-height: 40px;
    padding-left: 60px;

    .label {
      color: #99a9bf;
    }
  }
}
</style>

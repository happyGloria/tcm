<template>
  <div class="sys-drive">
    <nv-table ref="jtable"
              :setting="gridConfig">
      <template slot="filter">
        <el-checkbox v-if="!isSuper"
                     v-model="DriverSync"
                     @change="syncFn">【是否同步上级的驱动信息】</el-checkbox>
      </template>
    </nv-table>
    <edit-form ref="dialog"
               :title="title" />
  </div>
</template>

<script>
import EditForm from './dialog.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    EditForm
  },
  data () {
    var me = this
    return {
      DriverSync: !1,
      title: '',
      gridConfig: {
        selectable: !1,
        pagination: !0,
        listenerWidth: '100px',
        actions: [
          {
            name: 'refresh',
            icon: 'icon icon-refresh',
            title: '刷新',
            handleFn (data) {
              me.refreshFn()
            }
          }
        ],
        listeners: [
          {
            name: 'edit',
            icon: 'el-icon-edit',
            title: '编辑',
            handleFn (data) {
              me.title = '编辑驱动'
              me.dialog.open(data)
            }
          }
        ],
        column: [
          { key: 'id', name: '驱动ID' },
          { key: 'name', name: '驱动名', sortable: true },
          { key: 'driverType', name: '驱动类型', sortable: true },
          { key: 'provider', name: '厂家', sortable: true },
          { key: 'style', name: '型号' },
          { key: 'username', name: '默认用户名' },
          { key: 'password', name: '默认密码' },
          { key: 'port', name: '默认端口', width: '100' },
          { key: 'descr', name: '描述' }
        ],
        ajax: {
          init: (pageInfo) => {
            var param = Object.assign({}, pageInfo, me.filter)
            return Service.listDriver(param).then(r => r)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['siteType']),
    jtable () {
      return this.$refs.jtable
    },
    dialog () {
      return this.$refs.dialog
    },
    isSuper () {
      return this.siteType == 'OCC'
    }
  },
  mounted () {
    this.refreshFn()
    this.setDriverSync()
  },
  methods: {
    setDriverSync () {
      Service.getDriverSync().then(r => this.DriverSync = Boolean(parseInt(r.data.DriverSync)))
    },
    refreshFn () {
      this.jtable.init()
    },
    syncFn (val) {
      let h = this.$createElement,
        vNode = h(
          'div',
          [
            h('p', '驱动参数的错误修改，可能导致本站无法查看！！！'),
            h('p', '是否继续操作？')
          ]
        )
      this.$confirm(vNode, '提示', { type: 'warning' })
        .then(() => {
          Service.setDriverSync({ DriverSync: val ? 1 : 0 }).then(r => this.msg('设置成功'))
        }, () => {
          this.DriverSync = !val
        })
    }
  }
}
</script>

<template>
  <div class="temp-tree">
    <div class="box-all">
      <el-checkbox v-if="isSuper"
                   v-model="allChecked"
                   @change="changeAllCheckedFn">全部站点</el-checkbox>
    </div>
    <el-tree ref="jtree"
             :default-expanded-keys="expandKeys"
             :default-checked-keys="checkedKeys"
             :props="defaultProps"
             :data="list"
             :render-content="renderFn"
             show-checkbox
             node-key="id"
             @node-click="nodeClickFn"
             @check-change="checkChangeFn" />
  </div>
</template>

<script>
import { deepClone } from '@/util/utils.js'
import { mapGetters } from 'vuex'
export default {
  props: {
    checkedKeys: {
      type: Array,
      default () {
        return []
      }
    },
    dataSet: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      allChecked: false
    }
  },
  computed: {
    ...mapGetters(['siteType']),
    isSuper () {
      return this.siteType == 'OCC'
    },
    expandKeys () {
      return this.list[0] && [this.list[0].id]
    },
    list () {
      return $.array2tree(deepClone(this.dataSet), 'id', 'parentId') || []
    },
    siteIds () {
      return this.dataSet.filter(data => data.nodeType == 'Site').map((d) => d.id)
    }
  },
  watch: {
    checkedKeys (defaultChecked) {
      for (let i = 0; i < this.siteIds.length; i++) {
        let item = this.siteIds[i]
        if (!defaultChecked.includes(item)) {
          return this.allChecked = false
        }
      }
      this.allChecked = true
    }
  },
  methods: {
    changeAllCheckedFn (val) {
      this.$refs.jtree.setCheckedKeys(val ? this.siteIds : [])
    },
    renderFn ($$, { node, data }) {
      var {
        id,
        name,
        nodeType,
        deviceSubType
      } = node.data
      let type = nodeType && nodeType
      return (
        <div data-id={id} data-type={type} class={{ node: true }}>
          <span class={['icon', 'icon-' + `${nodeType == 'Camera' ? ('Camera-' + deviceSubType) : (type == 'Zone' ? 'Zone' : 'Station')}`]}></span>
          <span class='node-name' title={name}>{name}</span>
        </div>
      )
    },
    getChecked () {
      return this.$refs.jtree.getCheckedKeys()
    },
    getCheckedNodes () {
      return this.$refs.jtree.getCheckedNodes()
    },
    /* getValue () {
      var checkedNodes = this.$refs.jtree.getCheckedNodes(),
        checkedKeys = this.$refs.jtree.getCheckedKeys(),
        Camera = [],
        Civil = [],
        Site = []
      if (checkedNodes.length == this.dataSet.length) {
        let {
          id
        } = this.list[0]
        return {
          Camera: [],
          Civil: [],
          Site: [id]
        }
      } else {
        for (var i = 0; i < checkedNodes.length; i++) {
          var item = checkedNodes[i]
          if (item.nodeType == 'Camera') {
            if (!(checkedKeys.indexOf(item.parent.id) > -1)) {
              Camera.push(item.id)
            }
          } else if (item.nodeType == 'Site') {
            Site.push(item.id)
          } else {
            if (!(checkedKeys.indexOf(item.parent.id) > -1)) {
              Civil.push(item.id)
            }
          }
        }
      }
      return {
        Camera,
        Civil,
        Site
      }
    }, */
    getValue () {
      let Camera = [], Civil = [], Site = []
      if (this.allChecked) {
        return {
          Camera,
          Civil,
          Site: this.siteIds
        }
      }
      let checkedKeys = this.$refs.jtree.getCheckedKeys(),
        nodes = this.$refs.jtree.getCheckedNodes()
      for (let i = 0; i < nodes.length; i++) {
        var item = nodes[i]
        if (item.nodeType == 'Camera') {
          if (!(checkedKeys.indexOf(item.parent.id) > -1)) {
            Camera.push(item.id)
          }
        } else if (item.nodeType == 'Site') {
          Site.push(item.id)
        } else {
          if (!(checkedKeys.indexOf(item.parent.id) > -1)) {
            Civil.push(item.id)
          }
        }
      }
      return {
        Camera,
        Civil,
        Site
      }
    },
    checkChangeFn (data, checked) {
      let checkedSites = this.$refs.jtree.getCheckedNodes().filter((item) => item.nodeType == 'Site')
      /* console.log('checkedSites:', checkedSites)
      console.log('checkClick', data, checked) */
      this.allChecked = checkedSites.length == this.siteIds.length
    }
  }
}
</script>

<style lang="less">
.temp-tree {
  height: 100%;
  overflow: auto;
  .box-all {
    padding-left: 24px;
  }
  .el-tree {
    .el-tree-node__content {
      height: 36px !important;
      line-height: 36px !important;
    }
  }
  .icon {
    margin-right: 5px;
    color: #3aa8ff;
  }
  .el-tree-node__content {
    height: 36px;
  }
}
</style>

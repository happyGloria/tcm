<template>
  <div class="temp-tree">
    <div class="box-all">
      <el-checkbox v-if="siteType == 'OCC'"
                   v-model="allChecked"
                   @change="changeAllCheckedFn">全部站点</el-checkbox>
    </div>
    <el-tree ref="jtree"
             :default-expanded-keys="expandKeys"
             :default-checked-keys="checkedKeys"
             :props="defaultProps"
             :data="list"
             :render-content="renderFn"
             :filter-node-method="filterNode"
             show-checkbox
             auto-expand-parent
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
    expandKeys () {
      return this.list[0] && [this.list[0].id]
    },
    /* list () {
      return $.array2tree(deepClone(this.dataSet), 'id', 'parentId') || []
    }, */
    list () {
      let treeData = $.array2tree(deepClone(this.dataSet), 'id', 'parentId') || []
      if (treeData.length > 0) {
        let tempFn = function (arr) {
          for (var i = 0; i < arr.length; i++) {
            let item = arr[i]
            if (item.children && item.children.length > 0) {
              tempFn(item.children)
              var disabledItem = item.children.find(d => {
                return d.disabled && (d.disabled == true)
              })
              if (disabledItem) {
                Object.assign(item, { disabled: true })
              }
            }
          }
        }
        tempFn(treeData)
      }
      return treeData
    },
    siteIds () {
      return this.dataSet.filter(data => data.nodeType == 'Site').map((d) => d.id)
    }
  },
  watch: {
    checkedKeys (newChecked) {
      for (let i = 0; i < this.siteIds.length; i++) {
        let item = this.siteIds[i]
        if (!newChecked.includes(item)) {
          return this.allChecked = false
        }
      }
      this.allChecked = true
    }
  },
  methods: {
    filterParam (param) {
      this.$refs.jtree.filter(param)
    },
    filterNode (param, data) {
      if (!param.text && !param.type.length) {
        return true
      }
      if (data.name.indexOf(param.text) !== -1) {
        if (data.nodeType == 'Site' || data.nodeType == 'Zone') {
          return true
        }
        if (param.type.indexOf(data.deviceSubType) > -1) {
          return true
        }
      }
    },
    changeAllCheckedFn (val) {
      var disabledItem = this.list.find(item => item.disabled == true)
      if (disabledItem) {
        this.allChecked = false
        return false
      }
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
      // console.log(this.dataSet.filter(d => d.disabled))
      return this.$refs.jtree.getCheckedNodes()
    },
    getValue () {
      let Camera = [], Civil = [], Site = []
      if (this.allChecked) {
        return {
          Camera,
          Civil,
          Site: this.siteIds
        }
      }
      // this.dataSet.forEach(d => console.log(d))
      let checkedKeys = this.$refs.jtree.getCheckedKeys(),
        nodes = this.$refs.jtree.getCheckedNodes(),
        disabledNodes = this.dataSet.filter(d => d.disabled),
        disabledIds = disabledNodes.length ? disabledNodes.map(d => d.id) : []
      for (let i = 0; i < nodes.length; i++) {
        var item = nodes[i]
        if (item.nodeType == 'Camera') {
          if (!(checkedKeys.indexOf(item.parent.id) > -1)) {
            if (disabledIds.length > 0) {
              if (!(disabledIds.indexOf(item.id) > -1)) {
                Camera.push(item.id)
              }
            } else {
              Camera.push(item.id)
            }
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
      var p = this.$parent.$parent.$parent
      if (p.tab == 'first') {
        p.tabClickFn()
      }
      let checkedSites = this.$refs.jtree.getCheckedNodes().filter((item) => item.nodeType == 'Site')
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

    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background-color: #fa2121;
      border-color: #fa2121;
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

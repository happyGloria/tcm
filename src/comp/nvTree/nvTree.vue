<template>
  <div :class="clz"
       class="nv-tree">
    <div v-if="showFilter"
         class="filter">
      <el-input v-model="filterText"
                placeholder="请输入检索信息">
        <i slot="prefix"
           class="el-input__icon el-icon-search" />
        <i slot="suffix"
           class="el-input__icon el-icon-close"
           @click="clearFilter" />
      </el-input>
    </div>
    <div :class="{'h100_60': showFilter, 'h100': !showFilter }"
         class="tree-wrap">
      <el-tree v-loading="loading"
               ref="tree"
               :node-key="nodeKey"
               :indent="indent"
               :data="list"
               :render-content="renderFn"
               :props="props"
               :default-expanded-keys="curNodeKeys"
               :show-checkbox="showCheckbox"
               :lazy="lazy"
               :load="loadFn"
               :filter-node-method="filterNode"
               auto-expand-parent
               highlight-current
               @node-contextmenu="rightClickFn"
               @node-click="nodeClickFn"
               @check-change="checkChangeFn" />
    </div>
  </div>
</template>
<script>
var config = {
  clz: 'nv-tree',
  showFilter: !1,
  nodeKey: 'id',
  lazy: !1,
  indent: 24,
  curNodeKeys: [],
  checkedKeys: [],
  checkChangeFn (data, node) { },
  nodeClickFn (data, node) { },
  rightClickFn (data, node) { },
  loadFn (node, resolve) { },
  showCheckbox: !1,
  props: {
    children: 'children',
    label: 'name'
  },
  renderFn ($$, { node, data }) {
    return (
      <div class={{ node: true, 'data-key': node.data.id, 'data-type': data.nodeType }}>
        <span class={['icon', 'icon-' + node.data.icon]}></span>
        <span>{node.label}</span>
      </div>
    )
  }
}
export default {
  name: 'NvTree',
  props: {
    setting: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    let {
      ajax,
      clz,
      props,
      showFilter,
      showCheckbox,
      renderFn,
      nodeClickFn,
      rightClickFn,
      checkChangeFn,
      lazy,
      loadFn,
      indent,
      initNodeFn,
      nodeKey
    } = this.setting
    return {
      filterText: '',
      ajax, // 必传项, 否则无法初始化tree
      list: [],
      loading: !1,
      initNodeFn,
      nodeKey: nodeKey || config.nodeKey,
      indent: indent || config.indent,
      lazy: lazy || config.lazy,
      loadFn: loadFn || config.loadFn, // 加载自数据的方法，仅当lazy属性为true时生效
      showFilter: showFilter || config.showFilter,
      curNodeKeys: [], // 当前选中节点
      clz: clz || config.clz,
      props: props || config.props, // 控制list数据显示方式
      showCheckbox: showCheckbox || config.showCheckbox, // 是否显示选中
      renderFn: renderFn || config.renderFn, // 自定义渲染函数,
      nodeClickFn: nodeClickFn || config.nodeClickFn,
      rightClickFn: rightClickFn || config.rightClickFn,
      checkChangeFn: checkChangeFn || config.checkChangeFn
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    clearFilter () {
      this.filterText = ''
    },
    setCurrentNode (key) {
      this.$refs.tree.setCurrentKey(key)
    },
    getActive () {
      return this.$refs.tree.getCurrentNode()
    },
    filterNode (value, data) {
      if (!value) return true
      return data[this.props.label].indexOf(value) !== -1
    },
    initSelectNodeFn (list) {
      this.curNodeKeys = [list[0][this.nodeKey]]
      this.setCurrentNode(this.curNodeKeys[0])
    },
    init () {
      this.loading = !0
      return new Promise((resolve, reject) => {
        this.ajax.init().then(treeData => {
          this.list = treeData
          this.$nextTick(() => {
            this.initNodeFn ? this.initNodeFn(this.list) : this.initSelectNodeFn(this.list)
            resolve(this.list)
            this.loading = !1
          })
        })
      })
    }
    /* ,
    filterNode (value, data, node) {
      if (!value) {
        return true
      }
      let _array = [] // 这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value)
      let result = false
      _array.forEach((item) => {
        result = result || item
      })
      return result
    },
    getReturnNode (node, _array, value) {
      let isPass = node.data && node.data[this.props.label] && node.data[this.props.label].indexOf(value) !== -1
      isPass ? _array.push(isPass) : ''
      this.index++
      console.log(this.index)
      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value)
      }
    } */
  }
}
</script>
<style lang="less">
.nv-tree {
  height: 100%;
  font-size: 12px;
  .filter {
    height: 60px;
    line-height: 60px;
    padding: 0px 10px 10px;
  }
  .h100 {
    height: 100%;
  }
  .h100_60 {
    height: calc(~"100% - 60px");
  }
  .el-icon-close:hover {
    cursor: pointer;
    color: #2d87f9;
  }
  .tree-wrap {
    overflow: auto;
    .el-tree {
      background: transparent;
      border: none;
      .el-tree-node__content {
        height: 32px;
        line-height: 32px;
        position: relative;
      }
      .el-tree-node > .el-tree-node__children {
        overflow: visible;
      }
      .el-tree-node.is-current > .el-tree-node__content {
        /* background-color: rgba(115, 211, 255, 0.4); */
        position: relative;
        &::before {
          content: "";
          display: block;
          width: 2px;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #4e9fff;
        }
      }
      .el-tree-node__content {
        height: 32px;
        line-height: 32px;
        position: relative;
      }
      .node {
        [class^="icon"] {
          font-size: 16px;
          margin-right: 5px;
          position: relative;
          top: 0px;
          color: #66b1ff;
        }
        .node-name {
          margin-right: 2px;
        }
        span {
          vertical-align: middle;
        }
        .count {
          color: #00b3de;
          padding: 0 3px;
          font: bold 12px Arial, Helvetica, sans-serif;
        }
        .tool {
          display: none;
          position: absolute;
          right: 3px;
          top: 0px;
          i {
            margin-right: 5px;
            padding: 2px;
            border: 1px solid #3abbf5;
            color: #3abbf5;
          }
        }
      }
    }
  }
}
</style>


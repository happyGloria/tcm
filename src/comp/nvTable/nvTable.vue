<template>
  <div v-loading.body="loading"
       :class="clz"
       element-loading-text="加载中..."
       class="nv-grid">
    <el-col ref="toolbar"
            :span="24"
            class="grid-toolbar clearfix">
      <div class="area-action fl">
        <div v-for="item in actions"
             :key="item.name"
             class="fl">
          <el-button v-if="item.name == 'batchDel'"
                     :disabled="batchDisable"
                     :icon="item.icon"
                     :loading="item.loading || false"
                     type="primary"
                     size="mini"
                     @click.stop="item.handleFn(item.name)">{{ item.title }}</el-button>
          <el-button v-else
                     :disabled="item.disabledFn ? item.disabledFn(item) : false"
                     :icon="item.icon"
                     type="primary"
                     size="mini"
                     @click.stop="item.handleFn(item.name)">{{ item.title }}</el-button>
        </div>
        <div v-if="command.commands.length"
             class="tool-commands">
          <el-dropdown trigger="click"
                       @command="command.handleCommand">
            <el-button type="primary"
                       size="small">{{ command.name }}<i class="el-icon-caret-bottom el-icon--right" /></el-button>
            <el-dropdown-menu v-for="item in command.commands"
                              slot="dropdown"
                              :key="item.value">
              <el-dropdown-item :command="item.value">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <slot name="extAction" />
      <div class="area-filter fr">
        <slot ref="filter"
              name="filter" />
      </div>
    </el-col>
    <el-table ref="table"
              :data="list"
              :height="`${tBodyHeight}px`"
              :row-key="getRowKeys"
              :expand-row-keys="expands || []"
              style="width: 100%"
              class="grid-body"
              stripe
              border
              highlight-current-row
              resizable
              @selection-change="selectionChange"
              @row-click="rowClick"
              @expand-change="expandChange">
      <!-- 下拉 -->
      <el-table-column v-if="expandable"
                       type="expand"
                       align="center">
        <template slot-scope="props">
          <slot :info="props.row"
                name="expandTpl" />
        </template>
      </el-table-column>
      <!-- 选中列 -->
      <el-table-column v-if="selectable"
                       type="selection"
                       label=""
                       align="center" />
      <!-- 表格主体 -->
      <el-table-column v-for="(item, index) in column"
                       :key="index"
                       :sortable="item.sortable ? item.sortable : false"
                       :type="item.type || ''"
                       :prop="item.key || ''"
                       :width="item.width || ''"
                       :min-width="item.minWidth || ''"
                       :formatter="item.formatter && item.formatter(item)"
                       :style="item.style || ''"
                       :header-align="item.headerAlign || 'center'"
                       :align="item.align || 'center'"
                       show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span v-if="item.htmlFlag" v-html="item.name" />
          <span v-else>{{ item.name }}</span>
        </template>
        <el-table-column v-for="child in item.children"
                         v-if="child.children"
                         :key="child.key"
                         :type="child.type || ''"
                         :align="child.align || 'center'"
                         :width="child.width || ''"
                         :min-width="child.minWidth || ''"
                         :prop="child.key"
                         :label="child.name">
          <template slot-scope="scope">
            <span v-html="getChildCell(child, scope)" />
          </template>
        </el-table-column>
        <template slot-scope="scope">
          <span v-html="getCell(item, scope)" />
        </template>
        <!-- <template slot-scope="scope">
          <slot v-if="item.type == 'img'"
                :value="scope.row[item.key]"
                name="img" />
          <span v-html="getCell(item, scope)" />
        </template> -->
      </el-table-column>
      <slot name="status" />
      <el-table-column v-if="listeners.length"
                       :label="listenerColName"
                       :width="listenerWidth"
                       align="right"
                       class="operation">
        <template slot-scope="scope">
          <el-button v-for="item in listeners"
                     v-show="item.showFn ? item.showFn(scope.row) : true"
                     :key="item.index"
                     :disabled="item.disabledFn ? item.disabledFn(scope.row) : false"
                     :icon="item.icon"
                     :title="item.title"
                     type="primary"
                     size="mini"
                     @click.stop="item.handleFn(scope.row, scope.$index)" />
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="empty-info x-y-center-child">
          <i class="ico ico-empty-info" />
          <div class="desc">暂无数据</div>
        </div>
      </template>
    </el-table>
    <!-- 分页 - start -->
    <el-col v-show="column.length && pagination && list.length"
            :span="24"
            class="grid-foot">
      <el-pagination :layout="pagerLayout"
                     :page-sizes="pageSizes"
                     :current-page="pageNo"
                     :page-size="pageSize"
                     :total="totalSize"
                     @size-change="sizeChange"
                     @current-change="currentChange" />
    </el-col>
  </div>
</template>
<script>
let defaults = {
  showIndex: !0,
  listenerWidth: 100,
  listenerColName: '操作',
  pagination: !0,
  pager: {
    layout: 'total, prev, pager, next, sizes, jumper',
    pageSizes: [20, 50, 100, 200, 500],
    pageNo: 1,
    totalSize: 0,
    pageSize: 20
  },
  rowClick (row, column, cell, event) { },
  expandable: false,
  command: {
    name: '更多操作',
    commands: [],
    handleCommand () { }
  }
}
export default {
  name: 'NvTable',
  props: {
    setting: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    let {
      clz,
      ajax,
      selectable,
      pagination,
      column,
      listeners,
      pager,
      showIndex,
      listenerWidth,
      rowClick,
      expandable,
      listenerColName,
      command,
      actions
    } = this.setting
    return {
      clz: clz,
      expandable: expandable || defaults.expandable,
      rowClick: rowClick || defaults.rowClick,
      search: '', // 搜索字段
      aChecked: [], // 选中行
      list: [], // 列表数据
      loading: !0,
      ajax: ajax,
      listeners: listeners || [],
      listenerWidth: listenerWidth || defaults.listenerWidth,
      listenerColName: listenerColName || defaults.listenerColName,
      showIndex: showIndex || defaults.showIndex,
      pagination: pagination,
      selectable: selectable,
      column: column || [],
      /* pager: pager || defaults.pager, */
      pagerLayout: (pager && pager.layout) ? pager.layout : defaults.pager.layout,
      pageNo: (pager && pager.pageNo) ? pager.pageNo : defaults.pager.pageNo, // 当前页
      pageSizes: (pager && pager.pageSizes) ? pager.pageSizes : defaults.pager.pageSizes, // 每页显示多少条options
      pageSize: (pager && pager.pageSize) ? pager.pageSize : defaults.pager.pageSize, // 每页显示多少条
      totalSize: (pager && pager.totalSize) ? pager.totalSize : defaults.pager.totalSize, // 总页数
      batchDisable: true,
      command: command || defaults.command,
      actions: actions || [],
      tFootHeight: 42,
      tBodyHeight: null,
      expands: []
    }
  },
  watch: {
    tBodyHeight (val) {
      this.tBodyHeight = val
    }
  },
  mounted () {
    this.resizeFn()
    window.onresize = this.resizeFn
  },
  methods: {
    resizeFn () {
      var $contaner = this.$el
      var $toolBar = this.$el.children[0]
      this.tBodyHeight = $contaner.clientHeight - $toolBar.clientHeight - this.tFootHeight
    },
    getChildCell (child, scope) {
      var keys = child.key.split('.')
      var val = scope.row[keys[0]][keys[1]]
      if (child.format) {
        return child.format(val, scope)
      } else {
        return val
      }
    },
    getCell (item, scope) {
      if (item.type == 'index') {
        return this.pageSize * (this.pageNo - 1) + (scope.$index + 1)
      } else if (item.format) {
        return item.format(scope.row[item.key], scope)
      } else {
        return scope.row[item.key]
      }
    },
    init (args) {
      var pageInfo = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (args) {
        Object.assign(pageInfo, args)
      }
      this.loading = !0
      return this.ajax.init(pageInfo).then((res) => {
        this.totalSize = res.total
        this.list = res.items
        this.loading = !1
      }).finally(() => {
        this.loading = !1
      })
    },
    clear (cbFn) {
      this.list = []
      this.pageNo = 1
      // this.pageSize = defaults.pager.pageSize
      cbFn && cbFn()
    },
    sizeChange (size) {
      this.pageSize = size
      this.init({
        pageNo: 1,
        pageSize: size
      })
    },
    setColumn (column) {
      this.column = column
    },
    currentChange (num) {
      this.pageNo = num
      this.init({
        pageNo: this.pageNo,
        pageSize: this.pageSize
      })
    },
    getChecked () {
      return this.aChecked
    },
    selectionChange (arr) {
      this.aChecked = arr
      this.batchDisable = (arr.length == 0)
      this.$emit('batchDelDiabeldFn', this.batchDisable)
    },
    getRowKeys (row) {
      return row.id
    },
    expandChange (row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
      } else {
        this.expands = []
      }
    }
  }
}
</script>
<style lang="less">
.nv-grid {
  position: relative;
  width: 100%;
  height: 100%;
  .empty-column-info {
    width: 100%;
    border: 1px solid #d3dce6;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .desc {
      font-weight: 900;
      color: #4cb1ff;
      font-size: 14px;
      display: inline-block;
      height: 60px;
      line-height: 60px;
    }
  }
  .grid-toolbar {
    // 工具
    padding: 0 0 8px 0;
    & > div {
      display: inline-block;
      vertical-align: middle;
    }
    .area-action {
      & > div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      .el-button,
      .el-dropdown {
        font-size: 12px;
      }
    }
    .el-button i.icon {
      font-size: 12px;
      &::before {
        margin-right: 5px;
      }
    }
    .filter {
      .el-button + .el-button {
        margin-left: 5px;
      }
    }
    .tool-commands .el-dropdown .el-button--small {
      padding: 7px 15px;
    }

    .area-filter {
      .el-input {
        font-size: 12px;
        .el-input__inner {
          height: 30px;
        }
      }
    }
  }
  .grid-body {
    .el-button {
      padding: 3px 4px;
    }
  }
  .grid-foot {
    padding-top: 10px;
    font-size: 12px;
    .el-pagination {
      button,
      span {
        display: inline-block;
        font-size: 13px;
        min-width: 28px;
        height: 28px;
        line-height: 28px;
        vertical-align: top;
        box-sizing: border-box;
      }
      button {
        padding: 0 6px;
      }
      button:hover {
        color: #20a0ff;
      }
      button.disabled {
        color: #e4e4e4;
        background-color: #fff;
        cursor: not-allowed;
      }
      .btn-prev,
      .btn-next {
        border-radius: 2px 0 0 2px;
        border-right: 0;
        background: 50% no-repeat #fff;
        background-size: 16px;
        border: 1px solid #d3dce6;
        cursor: pointer;
        margin: 0;
        color: #99a9bf;
      }
    }
    .el-pager {
      li {
        padding: 0 4px;
        border: 1px solid #d3dce6;
        border-right: 0;
        background: #fff;
        font-size: 13px;
        min-width: 28px;
        height: 28px;
        line-height: 28px;
        box-sizing: border-box;
        text-align: center;
        font-weight: normal;
      }
      li.active {
        border-color: #20a0ff;
        background-color: #20a0ff;
        color: #fff;
        cursor: default;
      }
    }
    .el-pagination__sizes .el-input .el-input__inner {
      font-size: 12px;
    }
    .el-pagination {
      padding: 2px 0px;
      .tip {
        background-color: transparent;
      }
      .el-pagination__sizes {
        float: left;
      }
      .el-icon-arrow-left:before {
        content: "< 上一页";
      }
      .el-icon-arrow-right:before {
        content: "下一页 >";
      }
      .el-pagination__jump {
        .el-pagination__editor {
          width: 50px;
          border: none;
          padding: 0 5px;
        }
        .el-input__inner {
          padding: 0 10px;
          height: 28px;
        }
      }
    }
  }
  .el-table {
    font-size: 12px;
    table {
      .cell {
        span .icon {
          margin-right: 5px;
          color: #66b1ff;
        }
        button .icon {
          color: #fff;
        }
      }
    }
    thead {
      border-top: 1px solid #eef1f6;
      border-right: 1px solid #dfe6ec;
    }
    th,
    td {
      padding: 4px 0;
    }
    th {
      background-color: rgb(238, 241, 246);
      border-bottom: 1px solid #eef1f6;
      border-right: 1px solid #dfe6ec;
    }
    .empty-info {
      .desc {
        height: 20px;
        line-height: 20px;
        color: #606266;
        padding: 0 10px;
      }
    }
  }
}
</style>

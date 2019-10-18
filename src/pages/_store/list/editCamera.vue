<template>
  <div class="edit-camera">
    <div class="total">已选取<b style="color:red"> {{ count }} </b>个摄像机</div>
    <el-table ref="table"
              :data="tableList"
              :height="`${tBodyHeight}px`"
              stripe border highlight-current-row resizable
              style="width: 90%"
              @select-all="selectFn"
              @select="selectFn">
      <el-table-column v-if="selectable" type="selection" align="center" />
      <el-table-column v-for="(item, index) in columns"	:key="index"
                       :sortable="item.sortable ? item.sortable : false"
                       :type="item.type || ''"
                       :prop="item.key || ''"
                       :label="item.name"
                       :align= "item.align || 'center'"
                       :width="item.width || ''"
                       :min-width="item.minWidth || ''"
                       :formatter="item.formatter && item.formatter(item)"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="getCell(item, scope)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="page-info">
      <el-pagination
        :total="list.length"
        :page-sizes="pageSizes"
        :current-page="pageNo"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="sizeChange"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
var checkHT = {}
export default {
  props: {
    lostCameras: {
      type: Array,
      default () {
        return []
      }
    },
    doneCameras: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tBodyHeight: null,
      tFootHeight: 42,
      count: 0,
      selectable: true,
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 30, 40, 50, 100],
      columns: [
        { type: 'index', name: '序号', width: '60', minWidth: '50px' },
        { key: 'id', name: '摄像机编号' },
        { key: 'name', name: '摄像机名称' },
        {
          key: 'deviceSubType', name: '设备类型', /* sortable: true, */
          format: (value) => {
            return `<i class="icon icon-Camera-${value}" style="margin-right: 5px; color:#66b1ff;"></i>` + $.v2str('cameraType', value)
          }
        },
        { key: 'zoneName', name: '分区名称' },
        {
          key: 'zoneName', name: '所属分区'
        },
        {
          key: 'mappingId', name: '编号', format: (val) => Util.isEmptyFn(val) ? '--' : val
        },
        {
          key: 'gbId', name: '国标编号', format: (val) => Util.isEmptyFn(val) ? '--' : val
        }
      ]
    }
  },
  computed: {
    list () {
      var newList = this.doneCameras.concat(this.lostCameras)
      return newList
    },
    tableList () {
      var fromIdx = (this.pageNo - 1) * this.pageSize
      var endIdx = fromIdx + this.pageSize
      return this.list.slice(fromIdx, endIdx)
    }
  },
  watch: {
    tBodyHeight (val) {
      this.tBodyHeight = val
    }
  },
  mounted () {
    checkHT = {}
    this.doneCameras.forEach(item => {
      checkHT[item.id] = item
    })
    this.setSelection()
    this.setCount()
    this.resizeFn()
  },
  methods: {
    resizeFn () {
      var $contaner = this.$el
      var $toolBar = this.$el.children[0]
      this.tBodyHeight = $contaner.clientHeight - $toolBar.clientHeight - this.tFootHeight
    },
    setCount () {
      this.count = Object.keys(checkHT).length
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
    setSelection () {
      Object.values(checkHT).forEach(row => {
        this.$refs.table.toggleRowSelection(row)
      })
    },
    selectFn (selection) {
      checkHT = {}
      if (selection.length) {
        selection.forEach(item => {
          this.$set(checkHT, item.id, item)
        })
      }
      this.setCount()
    },
    sizeChange (size) {
      this.pageSize = size
      this.$nextTick(() => {
        this.setSelection()
      })
    },
    currentChange (num) {
      this.pageNo = num
      this.$nextTick(() => {
        this.setSelection()
      })
    },
    getValue () {
      return {
        cameras: Object.values(checkHT).map(d => d.id)
      }
    },
    validate (cbFn) {
      return new Promise((resolve, reject) => {
        var cameras = Object.values(checkHT)
        if (!cameras.length) {
          this.msg('请至少选择一个摄像机!')
        }
        resolve(!!cameras.length)
      })
    },
    clear (cbFn) {
      checkHT = {}
      this.count = 0
      this.pageNo = 1
      this.pageSize = this.pageSize
      this.selectFn([])
      this.setSelection()
      cbFn && cbFn()
    }
  }
}
</script>
<style lang="less">
.edit-camera {
  padding: 10px 20px 0;
  font-size: 14px;
  .total {
    height: 40px;
    line-height: 40px;
  }
  .el-table {
    font-size: 12px;
    thead {
      border-top: 1px solid #eef1f6;
      border-right: 1px solid #dfe6ec;
    }
    th, td {
      padding: 4px 0;
    }
    th {
      background-color: rgb(238, 241, 246);
      border-bottom: 1px solid #eef1f6;
      border-right: 1px solid #dfe6ec;
    }
    .cell{
      text-align: center;
    }
    [class*="icon-Camera"] {
      margin-right: 5px;
      color:#66b1ff;
    }
  }
  .page-info {
    margin-top: 10px;
  }
}
</style>

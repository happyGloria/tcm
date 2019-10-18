<template>
  <div class="edit-camera">
    <div class="total">已选取了<b style="color:red"> {{ count }} </b>个摄像机</div>
    <el-table ref="table"
              :data="tableList"
              stripe border highlight-current-row resizable
              style="width:100%"
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
        :page-size="10"
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="sizeChange"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditCamera',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      selectable: true,
      pageNo: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      columns: [
        { type: 'index', name: '序号', width: '60' },
        { key: 'id', name: '摄像机编号', width: '200', minWidth: '200' },
        { key: 'name', name: '摄像机名称', minWidth: '200' },
        {
          key: 'deviceSubType', name: '设备类型',
          format: (value) => {
            return `<i class="icon icon-Camera-${value}" style="margin-right: 5px; color:#66b1ff;"></i>` + $.v2str('cameraType', value)
          }
        },
        { key: 'zoneName', name: '分区名称' }
      ],
      checkHT: {},
      count: 0
    }
  },
  computed: {
    tableList () {
      var fromIdx = (this.pageNo - 1) * this.pageSize
      var endIdx = fromIdx + this.pageSize
      return this.list.slice(fromIdx, endIdx)
    }
  },
  mounted () {
    this.setSelection()
  },
  methods: {
    setCount () {
      this.count = Object.keys(this.checkHT).length
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
      Object.values(this.checkHT).forEach(row => {
        this.$refs.table.toggleRowSelection(row)
      })
    },
    selectFn (selection) {
      this.checkHT = {}
      if (selection.length) {
        selection.forEach(item => {
          this.$set(this.checkHT, item.id, item)
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
    validate (cbFn) {
      return new Promise((resolve, reject) => {
        var cameras = Object.values(this.checkHT)
        if (!cameras.length) {
          return this.msg('请至少选择一个摄像机!')
        } else {
          resolve(cameras.map(d => d.id))
        }
      })
    },
    clear (cbFn) {
      this.setSelection()
      this.count = 0
      this.pageNo = 1
      this.pageSize = this.pageSize
      cbFn && cbFn()
    }
  }
}
</script>
<style lang="less">
.edit-camera {
  height: 100%;
  font-size: 12px;
  .total {
    height: 40px;
    line-height: 40px;
  }
  .el-table__body-wrapper {
    overflow-y: auto;
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
  }
  .page-info {
    margin-top: 10px;
  }
}
</style>

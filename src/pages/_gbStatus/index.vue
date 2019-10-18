<template>
  <div class="gb-status">
    <nv-table ref="jtable"
              :setting="gridConfig">
      <div slot="extAction">
        <el-select v-model="interval"
                   placeholder="请选择"
                   style="width: 120px;">
          <el-option v-for="item in intervalOpts"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </div>
      <template slot="filter">
        <div class="clearfix">
          <div v-if="deviceType == 'child'"
               class="fl"
               style="margin-right:10px;">
            <span style="font-size: 12px;margin-right: 5px;">设备类型</span>
            <el-select v-model="type"
                       placeholder="请选择"
                       style="width: 120px;"
                       clearable>
              <el-option v-for="item in deviceOpts"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" />
            </el-select>
          </div>
          <div class="fl"
               style="margin-right:10px;">
            <el-input v-model="selectParam"
                      class="field-search"
                      placeholder="请输入查询条件">
              <el-tooltip slot="prefix"
                          content="检索范围：IP、名称"
                          effect="light"
                          placement="top-end">
                <i class="icon icon-qs" />
              </el-tooltip>
            </el-input>
          </div>
          <div class="fl">
            <el-button size="mini"
                       type="primary"
                       @click="refreshFn">
              <i class="el-icon-search" />
              <span>查询</span>
            </el-button>
          </div>
        </div>
      </template>
    </nv-table>
  </div>
</template>

<script>
import { getColumn } from './column.js'
let dvOpts = $.db.getConsts()
  .deviceType
  .filter(item => item.parentId !== 'Camera')
  .filter(item => item.parentId !== 'Server')
  .filter(item => item.id !== 'Keyboard')
export default {
  data () {
    var me = this
    return {
      selectParam: '',
      type: '',
      timer: null,
      interval: 0,
      intervalOpts: [
        { value: 0, label: '不自动刷新' },
        { value: 3, label: '3秒' },
        { value: 5, label: '5秒' },
        { value: 10, label: '10秒' }
      ],
      deviceOpts: dvOpts,
      deviceType: 'parent',
      gridConfig: {
        selectable: !1,
        pagination: !0,
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
        column: getColumn('parent'),
        ajax: {
          init: (pageInfo) => {
            var param = Object.assign({}, pageInfo, {
              deviceType: me.deviceType,
              selectParam: me.selectParam
            })
            if (me.deviceType == 'child') {
              Object.assign(param, { type: me.type })
            }
            return Service.listGBStatus(param).then(r => r)
          }
        }
      }
    }
  },
  computed: {
    jtable () {
      return this.$refs.jtable
    }
  },
  watch: {
    interval (newVal) {
      if (newVal == 0) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          this.refreshFn()
        }, newVal * 1000)
      }
    }
  },
  mounted () {
    if (this.timer) clearInterval(this.timer)
    this.deviceType = this.$route.name.split('-')[1]
    this.selectParam = ''
    this.interval = 0
    this.jtable.setColumn(getColumn(this.deviceType))
    this.refreshFn()
  },
  destroyed () {
    if (this.timer) { // 如果定时器在运行则关闭
      clearInterval(this.timer)
    }
  },
  methods: {
    refreshFn () {
      this.jtable.init()
    }
  }
}
</script>
<style lang="less">
.gb-status {
  em {
    font-style: normal;
  }
  th, td {
    @green: green;
    @red: red;
    i {
      vertical-align: middle;
    }
    .circle {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 3px;
    }
    .red {
      .circle {
        background-color: @red;
      }
      color: @red;
    }
    .green {
      .circle {
        background-color: @green;
      }
      color: @green;
    }
  }
  .area-filter {
    .field-search {
      .icon-qs {
        color: #909399;
      }
      .el-input__prefix {
        left: 8px;
        top: 8px;
      }
      .el-input-group__append {
        padding: 0 10px;
        background-color: #fff;
        width: 30px;
      }
      .el-input-group__append {
        padding: 0 20px;
        background-color: #f5f7fa;
      }
    }
  }
}
</style>

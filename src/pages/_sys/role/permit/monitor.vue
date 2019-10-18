<template>
  <div class="monitor">
    <div v-if="dataList.length"
         class="module">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   border
                   size="medium"
                   @change="handleCheckAllChange">全部监视器</el-checkbox>
      <div style="margin: 15px 0;" />
      <div class="monitor-box clearfix">
        <div v-for="item in data"
             :key="item.id"
             class="fl monitor-item">
          <el-tooltip :content="item.name"
                      class="item"
                      effect="light"
                      placement="top-start">
            <el-checkbox v-model="item.isChecked"
                         border
                         size="medium"
                         @change="handleCheckedChange">{{ item.name }}</el-checkbox>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div v-else
         class="x-y-center-child empty-box">
      <div class="info">
        <i class="ico ico-empty-info" />
        <div class="desc">尚无监视器数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    checked: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    dataList () {
      return this.data
    },
    checkAll: {
      get () {
        return this.data.every(item => item.isChecked)
      },
      set (val) {
        this.data.forEach(item => item.isChecked = val)
      }
    },
    isIndeterminate () {
      var arr = this.data.filter(item => item.isChecked)
      if (arr.length == 0) {
        return false
      }
      return !this.data.every(item => item.isChecked)
    }
  },
  methods: {
    handleCheckAllChange (val) {
    },
    handleCheckedChange () {
    },
    getValue () {
      if (!this.data.length) {
        return []
      } else {
        var checkedArr = this.data.filter(item => item.isChecked).map(d => d.id)
        return checkedArr.length == this.data.length ? 'all' : checkedArr
      }
    }
  }
}
</script>

<style lang="less">
@import "~@/less/mixin.less";
.monitor {
  width: 100%;
  height: 100%;
  .module {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .monitor-box {
    .monitor-item {
      width: 160px;
      margin-right: 10px;
      label {
        width: 100%;
      }
      .el-checkbox__label {
        .ellipsis_r("10px");
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .el-checkbox,
  .el-checkbox-group {
    .el-checkbox__label {
      font-size: 12px !important;
    }
  }
}
.empty-box {
  .desc {
    height: 20px;
    line-height: 20px;
    color: #333;
    padding: 0 10px;
  }
}
</style>

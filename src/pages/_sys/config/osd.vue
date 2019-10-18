<template>
  <div class="area area-osd">
    <div class="area-title">云台控制设置</div>
    <div class="container">
      <div class="field">
        <span class="label">OSD显示</span>
        <el-switch v-model="ControlOsdEnable"
                   :disabled="isNotSuper"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   @change="startFn" />
      </div>
      <div class="split-line" />
      <div class="field clearfix">
        <span class="label">释放延时</span>
        <el-input v-model.number="ControlReleaseTime"
                  :disabled="isNotSuper"
                  auto-complete="off">
          <template slot="append">秒</template>
        </el-input>
        <el-button :disabled="isNotSuper"
                   class="btn-save"
                   type="primary"
                   size="mini"
                   @click="releaseTimeFn('ControlReleaseTime')">保存</el-button>
        <span class="tip">
          <i class="tip-item icon icon-tip" />请输入1 ~ 3600范围内的整数
        </span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    isNotSuper: {
      type: Boolean,
      default: !1
    },
    model: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ControlReleaseTime: {
      get () {
        return this.model.ControlReleaseTime
      },
      set (val) {
        this.model.ControlReleaseTime = val
      }
    },
    ControlOsdEnable: {
      get () {
        return this.model.ControlOsdEnable
      },
      set (val) {
        this.model.ControlOsdEnable = val
      }
    }
  },
  methods: {
    submit (param) {
      Service.setConfig(param).then(r => {
        this.$message.success('操作成功')
      })
    },
    releaseTimeFn (key) {
      var reg = /^[1-9]\d{0,3}$/
      var val = this.model.ControlReleaseTime
      if (reg.test(val) && val > 0 && val <= 3600) {
        this.submit({ ControlReleaseTime: this.ControlReleaseTime })
      } else {
        this.$message.error('释放延时时间，请输入1 ~ 3600 范围内的整数')
      }
    },
    startFn (val) {
      this.submit(val ? {
        ControlOsdEnable: this.ControlOsdEnable,
        ControlReleaseTime: this.ControlReleaseTime
      } : {
        ControlOsdEnable: this.ControlOsdEnable
      })
    }
  }
}
</script>

<style lang="less" scoped>
.area-osd {
  .el-input {
    width: 200px;
  }
  .field .label {
    display: inline-block;
    width: 140px;
    height: 30px;
    line-height: 30px;
    padding-right: 10px;
    text-align: right;
    color: #606266;
  }
  .tip {
    margin-left: 140px;
    padding: 10px 0;
    .tip-item {
      display: inline-block;
    }
  }
  .split-line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed rgb(206, 205, 205);
  }
  .btn-save {
    margin-left: 10px;
  }
}
</style>

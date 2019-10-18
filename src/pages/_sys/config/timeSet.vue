<template>
  <div class="area area-timeset">
    <div class="area-title">系统校时设置</div>
    <div class="container">
      <el-form ref="timesetForm"
               :model="timeSet"
               :rules="rules"
               class="form-timeset"
               label-width="140px">
        <el-form-item label="自动校时">
          <el-switch v-model="timeSet.useNTP"
                     :disabled="isNotSuper"
                     class="nv-switch"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="startFn" />
        </el-form-item>
        <el-form-item class="check-time clearfix"
                      label=""
                      prop="schedule">
          <span class="prev">每天</span>
          <el-time-picker v-model="schedule"
                          :disabled="isNotSuper"
                          :clearable="false"
                          type="fixed-time"
                          placeholder="选择时间" /><span class="post">时进行同步</span>
        </el-form-item>
        <el-form-item label="NTP服务器"
                      prop="ip">
          <el-input v-model="timeSet.ip"
                    :disabled="isNotSuper" />
        </el-form-item>
        <el-form-item label="端口"
                      prop="port">
          <el-input v-model="timeSet.port"
                    :disabled="isNotSuper" />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="isNotSuper"
                     type="primary"
                     size="mini"
                     @click="saveNtpFn">保存</el-button>
          <el-button :disabled="isNotSuper"
                     type="primary"
                     size="mini"
                     @click="clockSyncFn">立即校时</el-button>
          <span class="tip" style="width: 380px;margin-left: -80px;">
            <i class="tip-item icon icon-tip" style="color:red;display:inline-block;"/>
            <i>风险提示：手动强行校时,可能会导致录像空缺（向前），或者录像覆盖（靠后），时间差距太大可能会导致服务停止工作。</i>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import reg from '@/data/reg'
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
  data () {
    return {
      rules: {
        ip: [
          reg.required,
          reg.ip
        ],
        port: [
          reg.required,
          reg.port
        ]
      }
    }
  },
  computed: {
    timeSet () {
      return this.model.TimingSetting
    },
    schedule: {
      get () {
        if (typeof (this.timeSet.schedule) == 'string') {
          var t = this.timeSet.schedule.split(':')
          return new Date(1970, 1, 1, t[0], t[1], t[2])
        } else {
          return this.timeSet.schedule
        }
      },
      set (date) {
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
          s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        this.timeSet.schedule = `${h}:${m}:${s}`
      }
    }
  },
  methods: {
    startFn (val) {
      if (val) {
        this.$refs.timesetForm.validate((valid) => {
          if (valid) {
            Service.setConfig({ TimingSetting: this.timeSet }).then(r => this.$message.success('操作成功'))
          } else {
            return false
          }
        })
      } else {
        Service.setConfig({ TimingSetting: this.timeSet }).then(r => this.$message.success('操作成功'))
      }
    },
    clockSyncFn () {
      this.$refs.timesetForm.validate((valid) => {
        if (valid) {
          Service.clockSync({
            TimingSetting: this.timeSet
          }).then(() => this.$message.success('服务器已向TVS发出立即同步时钟命令！'))
        } else {
          return false
        }
      })
    },
    saveNtpFn () {
      Service.setConfig({ TimingSetting: this.timeSet }).then(r => {
        this.$message.success('操作成功')
      })
    }
  }
}
</script>
<style lang="less">
.form-timeset {
  .el-input {
    width: 265px;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
    .tip-item::before {
      color: red;
    }
  }
}
.check-time {
  .el-date-editor {
    position: relative;
    display: inline-block;
    width: 140px !important;
    top: -1px;
  }
  span.prev,
  span.post {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    color: #909399;
    white-space: nowrap;
    font-size: 12px;
  }
  span.prev {
    border-right: 0;
    border-radius: 4px 0 0 4px;
  }
  span.post {
    border-left: 0;
    border-radius: 0px 4px 4px 0;
  }
  .el-date-editor .el-input__inner {
    border-radius: 0;
  }
}
</style>


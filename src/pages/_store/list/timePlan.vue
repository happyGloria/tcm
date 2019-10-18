<template>
  <div class="date-plan">
    <el-form-item label="日期计划"
                  required>
      <el-checkbox v-model="checkAll">全选</el-checkbox>
      <el-checkbox-group v-model="checkDays">
        <el-checkbox v-for="(item, idx) in daysOpts"
                     :key="idx"
                     :label="item.id">{{ item.text }}</el-checkbox>
      </el-checkbox-group>
      <div v-show="model.days.length == 0"
           class="tips">日期计划不能为空！</div>
    </el-form-item>
    <el-form-item label="录像时间"
                  required>
      <el-time-picker v-model="fromTo"
                      is-range
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      @change="change" />
      <div v-show="!validFlag"
           class="tips">{{ tips }}</div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default () {
        return {
          days: 'all',
          from: '00:00:00',
          to: '23:59:59'
        }
      }
    }
  },
  data () {
    return {
      from: '00:00:00',
      to: '23:59:59',
      validFlag: true,
      tips: '请选择起止时间',
      daysOpts: [
        { id: 1, text: '周一' },
        { id: 2, text: '周二' },
        { id: 3, text: '周三' },
        { id: 4, text: '周四' },
        { id: 5, text: '周五' },
        { id: 6, text: '周六' },
        { id: 0, text: '周日' }
      ]
    }
  },
  computed: {
    fromTo: {
      get () {
        var fromStr = `2019,1,1 ${this.from}`,
          toStr = `2019,1,1 ${this.to}`,
          from = new Date(fromStr),
          to = new Date(toStr)
        return [from, to]
      },
      set (val) {
        if ($.isEmptyFn(val)) {
          this.from = ''
          this.to = ''
        } else {
          this.from = moment(val[0]).format('HH:mm:ss')
          this.to = moment(val[1]).format('HH:mm:ss')
        }
      }
    },
    checkDays: {
      get () {
        if (this.model.days == 'all') {
          return this.daysOpts.map(d => d.id)
        } else {
          return this.daysOpts.filter(item => this.model.days.indexOf(item.id) > -1).map(d => d.id)
        }
      },
      set (val) {
        this.model.days = val
      }
    },
    checkAll: {
      get () {
        if (this.model.days == 'all') {
          return true
        }
        return this.model.days.length == 7
      },
      set (val) {
        return this.model.days = val ? this.daysOpts.map(d => d.id) : []
      }
    }
  },
  watch: {
    model (newVal) {
      this.from = newVal.from || '00:00:00'
      this.to = newVal.to || '23:59:59'
    }
  },
  methods: {
    change (val) {
      if (Util.isEmptyFn(val)) {
        this.validFlag = false
        this.tips = '请指定录像起止时间'
        return false
      }
      var diff = moment(val[1]).diff(moment(val[0]))
      if (diff < 0) {
        this.validFlag = false
        this.tips = '开始时间需小于结束时间'
        return false
      }
      this.validFlag = true
      this.tips = ''
      this.from = moment(val[0]).format('HH:mm:ss')
      this.to = moment(val[1]).format('HH:mm:ss')
    },
    getValue () {
      return {
        days: this.checkDays.length == 7 ? 'all' : this.checkDays,
        from: this.from,
        to: this.to
      }
    },
    validate (cbFn) {
      return new Promise(resolve => {
        resolve(this.checkDays.length && this.validFlag)
      })
    }
  }
}
</script>
<style lang="less">
.tips {
  color: #f56c6c;
  font-size: 12px;
}
.el-range-editor {
  .el-range-input {
    font-size: 12px;
  }
  .el-range-separator {
    font-size: 12px;
    width: 8%;
  }
}
</style>

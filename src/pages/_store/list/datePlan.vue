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
      <el-time-select v-model="from"
                      :picker-options="{
                        start: '00:00',
                        step: '03:00',
                        end: '21:00',
                        maxTime: to
                      }"
                      placeholder="起始时间"
                      @change="changeStartFn"/>
      <el-time-select v-model="to"
                      :picker-options="{
                        start: '03:00',
                        step: '03:00',
                        end: '24:00',
                        minTime: from,
                      }"
                      placeholder="结束时间"
                      @change="changeEndFn"/>
      <div v-show="!from || !to"
           class="tips">请指定录像起止时间！</div>
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
          from: '',
          to: ''
        }
      }
    }
  },
  data () {
    return {
      fromStart: '00:00',
      fromEnd: '21:00',
      toStart: '03:00',
      toEnd: '24:00',
      step: '03:00',
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
    from: {
      get () {
        return this.model.from
      },
      set (val) {
        this.model.from = val
      }
    },
    to: {
      get () {
        return this.model.to
      },
      set (val) {
        this.model.to = val
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
  methods: {
    changeStartFn (val) {
      this.from = val
    },
    changeEndFn (val) {
      this.to = val
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
        resolve(this.checkDays.length && !$.isEmptyFn(this.from) && !$.isEmptyFn(this.to))
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tips {
  color: #f56c6c;
  font-size: 12px;
}
</style>

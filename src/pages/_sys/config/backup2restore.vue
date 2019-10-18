<template>
  <div class="area area-backup">
    <div class="area-title">
      <span>备份</span>
      <span v-if="userType == 0"> & 手动还原</span>
    </div>
    <div class="container">
      <div class="field">
        <span class="label">自动备份功能</span>
        <el-switch v-model="on"
                   class="nv-switch"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   @change="changeBackupDays" />
      </div>
      <div class="field">
        <span class="label">备份间隔</span>
        <el-select
          v-model="BackUpDays"
          :disabled="!on"
          placeholder="请选择备份时间间隔"
          @change="changeBackupDays">
          <el-option
            v-for="item in BackUpDaysOpt"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </div>
      <div class="field" style="margin-bottom:6px;">
        <span class="label" />
        <el-button type="primary" size="mini" @click="backupFn">立即备份</el-button>
      </div>
    </div>
    <div v-if="userType == 0" class="container">
      <div class="spliter" style="width:400px;position:relative;left:20px;border-top:2px dashed #ddd;" />
      <div class="field">
        <span class="label">请选择还原文件</span>
        <el-select v-model="restoreFile" placeholder="请选择">
          <el-option
            v-for="item in restoreFiles"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </div>
      <div class="field">
        <span class="label" />
        <el-button type="primary" size="mini" @click="restoreFn">立即还原</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      defaultBackupDay: '7',
      BackUpDaysOpt: $.db.getConsts().BackUpDays || [],
      restoreFile: '',
      restoreFiles: []
    }
  },
  computed: {
    ...mapGetters(['userType']),
    backupDisabled () {
      return !this.model.BackUpDays
    },
    on: {
      get (val) {
        return this.model.BackUpDays > 0
      },
      set (val) {
        if (val) {
          this.model.BackUpDays = this.model.BackUpDays ? this.model.BackUpDays : this.defaultBackupDay
        } else {
          this.model.BackUpDays = ''
        }
      }
    },
    BackUpDays: {
      get () {
        return this.model.BackUpDays
      },
      set (val) {
        this.model.BackUpDays = val
      }
    }
  },
  mounted () {
    Service.listBackupFile().then(r => {
      this.restoreFiles = r.items.map(item => ({ id: item, name: item }))
    })
  },
  methods: {
    changeBackupDays () {
      Service.setConfig({
        BackUpDays: this.on ? this.BackUpDays : ''
      }).then(() => this.$message.success('操作成功'))
    },
    backupFn () {
      Service.backup().then(() => this.$message.success('操作成功'))
    },
    restoreFn () {
      if (!this.restoreFile) {
        return this.msg('请选择还原文件')
      }
      var h = this.$createElement
      var vNode = h(
        'div',
        [
          h('p', '还原不正确的数据库备份，可能会导致系统无法使用。'),
          h('p', '请谨慎选择还原文件！！！'),
          h('p', '是否继续操作？')
        ]
      )
      this.$confirm(vNode, '数据库还原', '手动还原', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Service.restore({ fileName: this.restoreFile })
      }, () => this.$message.warning('操作取消'))
    }
  }
}
</script>

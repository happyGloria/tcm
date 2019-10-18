<template>
  <div class="area area-server-backup">
    <div class="area-title">服务器备份设置</div>
    <div class="container">
      <div class="field">
        <span class="label">启用<b style="color:#F56C6C;">视频</b>服务器异地备份功能</span>
        <el-switch v-model="tvs"
                   :disabled="isNotSuper"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   @change="tvsFn" />
      </div>
      <div class="field">
        <span class="label">启用<b style="color:#F56C6C;">存储</b>服务器异地备份功能</span>
        <el-switch v-model="StorageBackupSetting"
                   :disabled="isNotSuper"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   @change="ssFn" />
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
    StorageBackupSetting: {
      get () {
        return this.model.StorageBackupSetting
      },
      set (val) {
        this.model.StorageBackupSetting = val
        this.model.ServerBackupSetting.ss.backup = val
      }
    },
    tvs: {
      get () {
        return this.model.ServerBackupSetting.tvs.backup
      },
      set (val) {
        this.model.ServerBackupSetting.tvs.backup = val
      }
    }
  },
  methods: {
    ssFn (val) {
      Service.setConfig({
        StorageBackupSetting: this.StorageBackupSetting,
        ServerBackupSetting: this.model.ServerBackupSetting
      }).then(r => {
        this.$message.success('操作成功')
      })
    },
    tvsFn (val) {
      Service.setConfig({
        ServerBackupSetting: this.model.ServerBackupSetting
      }).then(r => {
        this.$message.success('操作成功')
      })
    }
  }
}
</script>


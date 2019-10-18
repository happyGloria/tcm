<template>
  <div class="page-config">
    <el-row type="flex" justify="space-between">
      <el-col :span="11">
        <!-- 数据同步设置 -->
        <data-sync :model="model" />
        <!-- 云台控制 -->
        <osd :isNotSuper="isNotSuper" :model="model" />
        <!-- 系统校时设置 -->
        <time-set :isNotSuper="isNotSuper" :model="model" />
        <!-- 服务器备份设置 -->
        <server-backup :isNotSuper="isNotSuper" :model="model" />
      </el-col>
      <el-col :span="12">
        <!-- 自动备份 & 手动还原(超级管理员具有还原数据库功能) -->
        <backup-restore :isNotSuper="isNotSuper" :model="model" />
        <!-- 模板文件上传或下载 -->
        <ud-tpl />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import formFactoryMixin from '@/comp/FormFactory/mixin'
import { mapGetters } from 'vuex'
import UdTpl from './udTpl'
import DataSync from './dataSync'
import Osd from './osd'
import TimeSet from './timeSet'
import ServerBackup from './serverBackup.vue'
import BackupRestore from './backup2restore.vue'
export default {
  components: {
    DataSync,
    Osd,
    TimeSet,
    ServerBackup,
    BackupRestore,
    UdTpl
  },
  mixins: [formFactoryMixin],
  data () {
    return {
      sync: !1, // 数据同步
      model: {
        Sync: true,
        ControlOsdEnable: true,
        ControlReleaseTime: 15,
        StorageBackupSetting: true,
        ServerBackupSetting: {
          tvs: {
            backup: !0
          },
          ss: {
            backup: !0
          }
        },
        TimingSetting: {
          schedule: '01:00:00',
          useNTP: true/* ,
          useRS422: false */
        },
        BackUpDays: '7'
      },
      restoreFiles: []
    }
  },
  computed: {
    ...mapGetters(['siteType']),
    isNotSuper () {
      return !(this.siteType == 'OCC')
      // 仅允许上级部门的root和admin用户进行修改
    }
  },
  created () {
    Service.listConfig().then(r => this.setData(r.data))
  },
  methods: {
    setData (data) {
      var obj = JSON.parse(JSON.stringify(data))
      var res = {}
      for (var key in obj) {
        if (key == 'BackUpDays') {
          res[key] = obj[key]
        } else {
          res[key] = JSON.parse(obj[key])
        }
      }
      this.model = res
    },
    submitFn () {
      Service.setConfig(this.model).then(r => this.$message.success('配置成功'))
    }
  }
}
</script>
<style lang="less">
.page-config {
  overflow-y: auto;
  .area-title {
    height: 34px;
    line-height: 34px;
    background: rgb(236, 243, 254);
    font-size: 12px;
    font-weight: bold;
    color: #597a96;
    text-indent: 20px;
    letter-spacing: .5px;
    margin-bottom: 8px;
  }
  .container {
    padding: 10px 20px;
    font-size: 12px;
    width: 100%;
    & > div {
      margin-bottom: 16px;
    }
  }
  .field {
    .label {
      display: inline-block;
      color: #606266;
      width: 200px;
      padding-right: 10px;
      text-align: right;
    }
  }
}
</style>


<template>
  <div class="area area-sync">
    <div class="area-title">数据同步设置</div>
    <div class="container">
      <div>
        <el-checkbox v-model="Sync" @change="checkSyncFn">{{ txt }}</el-checkbox>
      </div>
      <div class="field">
        <span class="label" />
        <el-button type="primary" size="mini" @click="syncDataFn">立即同步数据</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
var SYNCDATATXT = {
  'occ': '修改控制中心配置数据时，立即向控制中心TVS和下属各车站／车辆段发送配置数据',
  'station': '修改本车站配置数据时，立即向控制中心和本车站TVS发送配置数据'
}
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
    ...mapGetters(['siteType']),
    txt () {
      if (Util.isEmptyFn(this.siteType)) {
        return '未配置站点类型，无法得知如何发送配置数据'
      } else {
        return SYNCDATATXT[this.siteType.toLowerCase()]
      }
    },
    Sync: {
      get () {
        return this.model.Sync
      },
      set (val) {
        return this.model.Sync = val
      }
    }
  },
  methods: {
    checkSyncFn () {
      Service.setConfig({
        Sync: this.model.Sync
      }).then(() => this.$message.success('操作成功'))
    },
    syncDataFn () {
      Service.syncData().then(r => this.$message.success('同步成功'))
    }
  }
}
</script>

<style lang="less">
.area-sync {
  .field .label {
    width: 150px !important;
  }
}
</style>


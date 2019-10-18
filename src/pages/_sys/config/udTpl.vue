<template>
  <div class="area area-tpl">
    <div class="area-title">数据 导入 & 导出</div>
    <div class="area-content">
      <div style="margin:10px 0;">
        <el-button :loading="downLoading"
                   size="mini"
                   type="primary"
                   @click="download('exportData', '')">导出</el-button>
      </div>
      <div class="upload-area">
        <nv-upload ref="refUpload"
                   :action="IMPORT_DATA"
                   accept=".xlsx"
                   @success="successFn">
          <template slot="btns">
            <el-button :loading="uploadLoading"
                       class="btn2"
                       size="small"
                       type="primary"
                       icon="icon icon-upload"
                       @click="uploadFn">导入</el-button>
          </template>
        </nv-upload>
      </div>
      <div v-if="uploadLoading"
           class="area-progress">
        {{ uploadStatus }}
      </div>
    </div>
  </div>
</template>

<script>
import NvUpload from './upload.vue'
import filterMixin from '@/pages/common/filterMixin.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    NvUpload
  },
  mixins: [filterMixin],
  data () {
    let {
      IMPORT_DATA
    } = this.$API
    return {
      IMPORT_DATA
    }
  },
  computed: {
    ...mapGetters([
      'uploadStatus',
      'uploadLoading'
    ])
  },
  methods: {
    uploadFn () {
      if (this.$refs.refUpload.fileList.length) {
        this.$refs.refUpload.save()
      } else {
        this.$message.error('请选择文件')
      }
    },
    successFn (cbFn) {
      this.$store.dispatch('GetUploadPercent', cbFn)
    }
  }
}
</script>
<style lang="less">
.area-tpl {
  .area-content {
    padding: 10px 40px;
  }
  .area-progress {
    height: 30px;
    line-height: 30px;
    color: red;
  }
}
</style>

<template>
  <div v-loading="loading"
       class="map">
    <zone-map ref="zoneMap"/>
    <!--  -->
    <!-- <nv-upload :action="uploadUrl"
               :param="uploadParam"
               :isFiled="isFiled"
               class="btn-upload"
               @success="uploadFn" /> -->
    <lost ref="lost" />
  </div>
</template>

<script>
import lost from './lost.vue' // 未分配摄像机
import ZoneMap from './map.vue'
export default {
  components: {
    lost,
    ZoneMap
  },
  data () {
    return {
      uploadUrl: this.$API.UPLOAD_MAP,
      uploadParam: null,
      loading: !1,
      losts: [],
    }
  },
  mounted () {
    this.$refs.lost.init()
  },
  methods: {
  }
}
</script>

<style lang="less">
@import "~@/less/mixin.less";
.map {
  width: 100%;
  height: 100%;
  position: relative;
  .stage {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    user-select: none;
    background: url('~@/assets/bg/transparent.png');
    border: 2px dashed #908b8b;
  }
  .fix {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }
  .btn-controls{
    background: rgba(58, 56, 63, 0.8);
    border: solid 1px #100000;
    color: #fff;
    padding: 8px;
    text-align: left;
    position: absolute;
    right: 20px;
    top: 10px;
    border-radius: 3px;
    /*  .zoom {
      margin-bottom: 5px;
    } */
    [class*="ico-zoom"] {
      cursor: pointer;
    }
  }
  .btn-upload {
    position: absolute;
    top: 10px;
    left: 10px;
    .el-upload-list {
      display: none;
    }
  }
}
</style>

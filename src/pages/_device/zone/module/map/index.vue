<template>
  <div v-loading="loading" class="map">
    <zone-map ref="zoneMap"
              :markers="mapMarkers"
              @markerDragFn="updateMarker"
              @delMarker="delMarker" />
    <nv-upload :action="uploadUrl"
               :param="uploadParam"
               :isFiled="isFiled"
               class="btn-upload"
               @success="uploadFn" />
    <lost ref="lost" :node="activeZoneNode" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      loading: !0,
      mapSrc: '',
      mapMarkers: [],
      losts: [],
      isFiled: false
    }
  },
  computed: {
    ...mapGetters(['activeZoneNode', 'zoneTab'])
  },
  watch: {
    zoneTab (newVal) {
      if (newVal == 'map') {
        this.init()
      }
    }
  },
  methods: {
    updateMarker ({ id, x, y }) {
      Service.editCameraOfMap({ id, x, y }).then(r => {
        var mc = this.mapMarkers
        for (var i = 0; i < mc.length; i++) {
          if (mc[i].id == id) {
            this.$set(mc, i, Object.assign(mc[i], { x, y }))
            return
          }
        }
      })
    },
    delMarker ({ id }) {
      // 从地图上删除摄像机
      var mc = this.mapMarkers
      Service.delCamera4Map({ id }).then(() => {
        for (var i = 0; i < mc.length; i++) {
          if (mc[i].id == id) {
            let {
              siteId,
              id: zoneId
            } = this.activeZoneNode
            // console.log('this.activeZoneNode:', this.activeZoneNode)
            this.$refs.lost.init({ siteId, zoneId })
            mc.splice(i, 1)
            return
          }
        }
      })
    },
    closest (name) {
      return $.pref.call(this, name)
    },
    uploadFn () {
      this.init()
    },
    addCamera2Map (param, cameraInfo, cbFn) {
      var naturalOffset = this.$refs.zoneMap.getNaturalOffset(param.x, param.y)
      var queryParam = Object.assign({}, param, naturalOffset)
      Service.addCamera2Map(queryParam).then(() => {
        this.mapMarkers.push({
          ...queryParam,
          ...cameraInfo
        })
        cbFn && cbFn()
      })
    },
    init () {
      if (this.$refs.zoneMap) {
        this.$refs.zoneMap.src = null
      }
      if (this.zoneTab == 'list') return
      var {
        siteId,
        id: zoneId
      } = this.activeZoneNode
      this.uploadParam = { zoneId }
      if (!zoneId || !siteId) return
      this.mapMarkers = []
      Service.getMap({ zoneId, siteId }).then(res => {
        this.loading = !1
        let {
          items: {
            url,
            cameras
          }
        } = res
        this.isFiled = Util.isEmptyFn(url)
        if (Util.isEmptyFn(url)) {
          return this.$message.error('您还未上传地图,请先上传地图')
        } else {
          this.mapMarkers = cameras
          this.$refs.zoneMap.init(url)
        }
      })
      if (this.$refs.lost) {
        this.$refs.lost.init({ zoneId, siteId })
        this.$refs.lost.$refs.cShop.show = false
      }
    }
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

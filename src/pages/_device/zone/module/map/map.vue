<template>
  <div class="stage">
    <div :style="{
           width: width + 'px',
           height: height + 'px',
           left: left + 'px',
           top: top + 'px'
         }"
         class="fix">
      <img v-show="src"
           :src="src"
           :style="{
             width: width + 'px',
             height: height + 'px'
           }"
           alt="分区地图"
           @click.prevent="preventFn" >
      <div v-for="item in cameras"
           :key="item.id"
           :style="{
             'left': `${item.left}px`,
             'top': `${item.top}px`
           }"
           :title="item.name"
           :data-type="item.type"
           :data-id="item.id"
           :data-siteId="item.siteId"
           class="dropped-camera">
        <i :class="[`icon-${item.icon}`]" class="icon" />
        <i class="icon icon-close" @click="delMarkerFn(item)" />
      </div>
    </div>
    <div v-show="src" class="btn-controls">
      <div class="zoom">
        <span class="zoom-out ico ico-zoom-in" title="放大" @click.prevent="zoom(null, 1)" />
        <span class="zoom-in ico ico-zoom-out" title="缩小" @click.prevent="zoom(null, 0)" />
        <!-- <div class="move ico ico-move"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
function _getImgSize (img, src) {
  if (typeof img.naturalWidth === 'undefined') {
    var i = new Image()
    i.src = src
    return {
      width: i.width,
      height: i.height
    }
  } else {
    return {
      width: img.naturalWidth,
      height: img.naturalHeight
    }
  }
}
export default {
  props: {
    /* src: {
      type: String,
      default: ''
    }, */
    markers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      src: null,
      imgEl: null,
      rate: 0.2, // 缩放速率, 图片滚动放大时的速率 值越大图片缩放速度越快 {0, 1}
      imgNaturalSize: {},
      width: 600,
      height: null,
      min: 300, // 图片最小宽度
      max: 3000, // 图片最大宽度
      marker_size: 28, // 标记点尺寸
      left: 0,
      top: 0,
      stageW: 0,
      stageH: 0,
      cameras: []
    }
  },
  watch: {
    markers: {
      deep: true,
      handler () {
        this.reloadMarkers()
        this.bindMarkerDrag()
      }
    }
  },
  updated () {
    this.bindMarkerDrag()
  },
  methods: {
    delMarkerFn (item) {
      this.$emit('delMarker', item)
    },
    getNaturalOffset (offsetX, offsetY) {
      return {
        x: offsetX * this.imgNaturalSize.width / this.width,
        y: offsetY * this.imgNaturalSize.height / this.height
      }
    },
    setMarkerOffset (obj) {
      return {
        icon: `Camera-${obj.deviceSubType}`,
        left: ((this.width * obj.x) / this.imgNaturalSize.width),
        top: ((this.height * obj.y) / this.imgNaturalSize.height)
      }
    },
    reloadMarkers () {
      this.cameras = this.markers.map(d => Object.assign({}, d, this.setMarkerOffset(d)))
    },
    imageCenterAlign () {
      let left = (this.stageW - this.width) / 2
      let top = (this.stageH - this.height) / 2
      this.left = left > 0 ? left : 0
      this.top = top > 0 ? top : 0
    },
    /* {
      center: 缩放中心坐标,
      scale: 缩放比例 (>0 放大 <0 缩小)
    } */
    zoom (center, flag) {
      var scale = flag == 1 ? (1 + this.rate) : (1 - this.rate)
      var w0 = this.width, h0 = this.height
      var tarWidth = w0 * scale, tarHeight = h0 * scale
      /* 限制宽度 */
      if (tarWidth > this.max || tarWidth < this.min) {
        return false
      }
      if ($.isEmptyFn(center)) {
        center = {}
        center.x = this.left + this.width / 2
        center.y = this.top + this.height / 2
      }
      this.width = tarWidth
      this.height = tarHeight
      this.left = (center.x - (center.x - this.left) / w0 * this.width)
      this.top = (center.y - (center.y - this.top) / h0 * this.height)

      this.reloadMarkers()
    },
    bindMouseWheel () {
      this.imgEl.onmousewheel = (ev) => {
        var rect = this.$el.getBoundingClientRect()
        var flag = (ev.wheelDelta > 0 || ev.detail < 0) ? 1 : 0
        this.zoom({ x: ev.clientX - rect.left, y: ev.clientY - rect.top }, flag)
      }
    },
    /* 地图拖拽 */
    bindMapDrag () {
      var me = this
      $(this.$el.querySelector('.fix')).draggable({
        stop: function (ev, ui) {
          me.top = ui.position.top
          me.left = ui.position.left
        }
      })
    },
    bindMarkerDrag () {
      var me = this
      $('.dropped-camera').draggable({
        revert: false,
        containment: '.fix',
        stop (ev, ui) {
          var id = this.dataset.id
          var x = (ui.position.left * me.imgNaturalSize.width) / me.width
          var y = (ui.position.top * me.imgNaturalSize.height) / me.height
          me.$emit('markerDragFn', { id, x, y })
        }
      })
    },
    preventFn (ev) {
      ev.preventDefault()
    },
    loadImage (imgEl, cbFn) {
      imgEl.src = this.src
      imgEl.onload = null
      if (imgEl.complete) { // 缓存
        cbFn(_getImgSize(imgEl, this.src))
      } else {
        imgEl.onload = function () {
          cbFn(_getImgSize(imgEl, this.src))
        }
      }
    },
    init (src) {
      this.src = Util.getMapUrl(src)
      this.stageW = this.$el.clientWidth
      this.stageH = this.$el.clientHeight
      let imgEl = this.imgEl = this.$el.querySelector('.fix img')
      this.loadImage(imgEl, (size) => {
        this.height = (this.width / size.width) * size.height
        this.imgNaturalSize = size
        this.imageCenterAlign()
        this.$nextTick(() => {
          this.reloadMarkers()
          this.bindMouseWheel()
          this.bindMapDrag()
          this.bindMarkerDrag()
        })
      })
    }
  }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
.dropped-camera {
    position: absolute;
    background-color: #ffa54e;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    border: 2px solid #fff;
    box-shadow: 0 0 4px #777;
    .icon {
      color: #fff;
    }
    [class*='icon-Camera'] {
      .x-y-center-child;
    }
    .icon-close {
      position: absolute;
      top: -8px;
      right: -12px;
      color: #f00;
      transition: all 0.8s;
      opacity: 0;
    }
    &:hover .icon-close {
      cursor: pointer;
      display: block;
      opacity: 1;
    }
  }
</style>


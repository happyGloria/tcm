
<template>
  <div class="zoom-map">
    <img :src="src"
         :style="{
           width: width + 'px',
           height: height + 'px',
           left: left + 'px',
           top: top + 'px'
         }"
         class="zoom-img"
         alt="分区地图" >
  </div>
</template>

<script>
var defaults = {
  rate: 0.2, // 鼠标滚动缩放速率
  width: 500, // 制定图片宽度
  min: 300, // 图片最小宽度
  max: 3000 // 图片最大宽度
}

var _getImageSize = function (img) {
  var rw, rh
  if (typeof img.naturalWidth === 'undefined') {
    // IE 6/7/8
    var i = new Image()
    i.src = img.src
    rw = i.width
    rh = i.height
  } else {
    // HTML5 browsers
    rw = img.naturalWidth
    rh = img.naturalHeight
  }
  return ({ width: rw, height: rh })
}
export default {
  name: 'ZoomMap',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    let {
      rate,
      width,
      min,
      max
    } = this.options
    return {
      stageWidth: 0,
      stageHeight: 0,
      rate: rate || defaults.rate,
      min: min || defaults.min,
      max: max || defaults.max,
      imgNaturalSize: {},
      width: width || defaults.width,
      height: 1,
      src: null, // 图片资源
      left: 0,
      top: 0,
      imgEl: null
    }
  },
  methods: {
    getImageSize (imgEl, cbFn) {
      imgEl.onload = null
      if (imgEl.complete) {
        cbFn(_getImageSize(imgEl))
      } else {
        imgEl.onload = function () {
          cbFn(_getImageSize(imgEl))
        }
      }
    },
    imageCenterAlign () {
      this.left = this.left + (this.stageWidth - this.width) / 2
      this.top = this.top + (this.stageHeight - this.height) / 2
    },
    loadImage (url) {
      this.src = url
      this.getImageSize(this.imgEl, (size) => {
        this.imgNaturalSize = size
        this.height = (this.width / this.imgEl.naturalWidth) * this.imgEl.naturalWidth
        this.imageCenterAlign()
        this.bindMouseWheel()
      })
    },
    bindMouseWheel () {
      this.imgEl.onmousewheel = (ev) => {
        // this.scrolling = true
        var rect = this.$el.getBoundingClientRect()
        var rate = (ev.wheelDelta > 0 || ev.detail < 0) ? (1 + this.rate) : (1 - this.rate)
        this.zoom({ x: ev.clientX - rect.left, y: ev.clientY - rect.top }, rate)
        // this.scrolling = false
        return false
      }
    },
    init ({ url }) {
      this.imgEl = this.$el.querySelector('.zoom-img')
      this.stageWidth = this.$el.clientWidth
      this.stageHeight = this.$el.clientHeight
      this.loadImage(url)
    },
    zoom (center, scale) {
      var w0 = this.width, h0 = this.height
      var tarWidth = w0 * scale
      if (tarWidth > this.max || tarWidth < this.min) {
        return false
      }
      this.width = w0 * scale
      this.height = h0 * scale

      this.left = center.x - this.width * (center.x - this.left) / w0
      this.top = center.y - this.height * (center.y - this.top) / h0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/less/mixin.less";
.zoom-map {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px dashed #ddd;
  background: url('~@/assets/bg/transparent.png');
  overflow: hidden;
  .zoom-img {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>

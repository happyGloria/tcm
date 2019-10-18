<template>
  <div class="map-wrapper">
    <div id="zoom-marker-div"
         class="zoom-marker-div">
      <img class="zoom-marker-img"
           id="zoom-marker-img-alt"
           alt="zoom-marker-img-alt"
           name="zoom-marker-img-alt"
           draggable="false" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tagNumber: 1
    }
  },
  mounted () {
    this.initImg($('#zoom-marker-img-alt'))
    $('#zoom-marker-img-alt').zoomMarker({
      src: "static/lib/zoomMarker/img/rail.jpg",
      rate: 0.2,
      width: 600,
      max: 3000,
      markers: [
        { src: "static/lib/zoomMarker/img/marker.svg", x: 300, y: 300 },
        { src: "static/lib/zoomMarker/img/marker.svg", x: 100, y: 200 },
        { src: "static/lib/zoomMarker/img/marker.svg", x: 300, y: 100 }
      ],
      enable_canvas: false,
      move_limit: true
    })
  },
  methods: {
    initImg (item) {
      let me = this
      // handle "TAP" event and add marker to image
      item.on("zoom_marker_mouse_click", function (event, position) {
        console.log("Mouse click on: " + JSON.stringify(position));
        const marker = item.zoomMarker_AddMarker({
          src: "static/lib/zoomMarker/img/marker.svg",
          x: position.x,
          y: position.y,
          size: 30,
          dialog: {},
          hint: { value: me.tagNumber, style: { color: "#ffffff", left: "10px" } }
        });
        // 手动配置dialog
        marker.param.dialog = {
          value: "<h4>content for dialog_" + me.tagNumber + "</h4>",
          offsetX: 20,
          style: {
            "border-color": "#86df5f"
          }
        };
        // 画线
        /* const context = item.zoomMarker_Canvas();
        if (context !== null) {
          context.strokeStyle = 'red';
          context.moveTo(position.x, position.y);
          context.lineTo(100, 100);
          context.stroke();
        } */
        if (++me.tagNumber >= 10)
          me.tagNumber = 1;
      });

      // 删除marker
      item.on("zoom_marker_click", function (event, marker) {
        // $('#zoom-marker-img').zoomMarker_RemoveMarker(marker.id);
      });

      /* // message for the beginning of image loading process
      item.on("zoom_marker_img_load", function (event, src) {
        console.log("loading started for image : " + src);
        EasyLoading.show({
          text: $("<span>loading image</span>"),
          button: $("<span>dismiss</span>"),
          type: EasyLoading.TYPE.PACMAN
        });
      });

      // message for image loaded
      item.on("zoom_marker_img_loaded", function (event, size) {
        console.log("image has been loaded with size: " + JSON.stringify(size));
        // we have to set a timer in order to watching the loader in local environment, cause the loading speed is too fast
        setTimeout(function () {
          EasyLoading.hide();
        }, 3000);
      }); */
    }

  }
}
</script>

<style lang="less" scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <nv-shop ref="cShop"
           :total="total"
           title="未分配摄像机">
    <template slot="cart-content">
      <el-collapse v-model="activeCollapse"
                   accordion
                   class="category-camera">
        <el-collapse-item v-for="item in cameras"
                          :key="item.name"
                          :title="item.title"
                          :name="item.name">
          <template slot="title">
            <div class="title">
              <i :class="[`icon-${item.icon}`]"
                 class="icon" />
              <span>{{ item.title }}</span>
              <span class="count">({{ item.count }})</span>
            </div>
          </template>
          <ul v-if="item.children.length>0"
              class="camera-list clearfix">
            <li v-for="c in item.children"
                :key="c.id"
                :data-key="c.id"
                class="camera-item fl">
              <i :class="[`icon-${c.icon}`]"
                 class="icon" />
              <i :title="c.name"
                 class="name">{{ c.name }}</i>
            </li>
          </ul>
          <div v-else
               class="empty-box">
            <div class="empty-info x-y-center-child">
              <i class="ico ico-empty-info" />
              <div class="desc">尚无该类型摄像机</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>
  </nv-shop>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      activeCollapse: 0,
      cameras: [],
      total: 0
    }
  },
  updated () {
    this.bindDrag()
  },
  methods: {
    parseData (list) {
      var cameraTypes = $.db.getConsts().cameraType,
        cameraCategories = [[], [], [], []], // 0: 枪机， 1: 球机， 2: 半球机, 11 - 鹰眼
        res = []
      list.forEach(item => {
        var typeIdx = Number(item.deviceSubType) - 1
        if (item.deviceSubType == 11) {
          typeIdx = 3
        }
        cameraCategories[typeIdx].push(Object.assign(item, { icon: `Camera-${item.deviceSubType}` }))
      })
      cameraCategories.forEach((list, idx) => {
        let iconType = idx == 3 ? 11 : (idx + 1)
        res.push({
          icon: `Camera-${iconType}`,
          name: idx,
          count: list.length,
          title: cameraTypes[idx].name,
          children: list
        })
      })
      return res
    },
    delFn (key, x, y) {
      var cs = this.cameras
      for (var i = 0; i < cs.length; i++) {
        var cc = cs[i].children
        for (var j = 0; j < cc.length; j++) {
          if (cc[j].id == key) {
            this.$parent.addCamera2Map({ id: key, x, y }, cc[j], () => {
              cc.splice(j, 1)
              this.total--
              cs[i].count--
            })
            return
          }
        }
      }
    },
    isInRect ({ tarX, tarY }, rect) {
      return (tarX > rect.left && tarX < (rect.left + rect.width) && tarY > rect.top && tarY < (rect.top + rect.height))
    },
    bindDrag () {
      var me = this, offsetX = 0, offsetY = 0
      $('.camera-item').draggable({
        helper: 'clone',
        cancel: '.name',
        start (ev, ui) {
          offsetX = ev.offsetX
          offsetY = ev.offsetY
        },
        stop (ev, ui) {
          console.log(ev.clientX, ev.clientY)
          /* var refRect = me.$el.parentNode.querySelector('.fix').getBoundingClientRect()
          if (!me.isInRect({
            tarX: ev.clientX,
            tarY: ev.clientY
          }, refRect)) {
            return me.msg('请拖拽摄像机到图片区域中')
          }
          var x = ev.clientX - refRect.left - offsetX
          var y = ev.clientY - refRect.top - offsetY
          var key = this.dataset.key
          me.delFn(key, x, y) */
        }
      })
    },
    init (param) {
      /* 
      0: {deviceSubType: "1", deviceType: "Camera",…}
1: {deviceSubType: "3", deviceType: "Camera",…}
2: {deviceSubType: "3", deviceType: "Camera", driverId: "Camera-onvifhost-IPC",…} */
      Service.getCamerasNotInMap(
        {
          siteId: 1,
          zoneId: "1-Zone-66bcca5bc95e4438844170b627a736c0"
        }
      ).then(({ items }) => {
        this.cameras = this.parseData(items)
        this.total = items.length
      })
    }
  }
}
</script>

<style lang="less">
@import "~@/less/mixin.less";
.category-camera{
  z-index: 9999;
  user-select: none;
  .el-collapse-item__header {
    .title {
      font-size: 12px;
      padding-left: 10px;
      .icon{
        color: #409EFF;
      }
    }
  }
  .el-collapse-item__content {
    padding: 0 10px;
    max-height: 250px;
    min-height: 250px;
    height: 250px !important;
    overflow-y: auto;
    ul.camera-list {
      padding: 0 20px;
      max-height: 250px;
    }
    li {
      width: 48%;
      font-size: 12px;
      i {
        vertical-align: middle;
      }
      .name {
        display: inline-block;
        .ellipsis(@w: 105px);
      }
    }

    [class*="icon-Camera"] {
      color: #ffa54e;
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .empty-box {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 12px;
  }
}
</style>

<template>
  <ul class="tab-link">
    <li v-for="mod in nav" :key="mod.name"
        :class="{active: activeNav.indexOf(mod.path) === 0}"
        @click="link(mod)">
      <i :class="'ico-' + ico(mod)" class="ico" />
      <a>{{ mod.name }}</a>
    </li>
  </ul>
</template>
<script>
import { asyncRouterMap } from '@/router/index.js'
export default {
  name: 'TabLink',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    var nav = asyncRouterMap, list
    for (var i in nav) {
      if (nav[i].path.indexOf(this.name) === 1) {
        list = nav[i].children
        break
      }
    }
    return {
      nav: list
    }
  },
  computed: {
    activeNav () {
      return this.$route.path
    }
  },
  methods: {
    ico (mod) {
      return mod.path.replace(/\//g, '-').replace(/^-/, '')
    },
    link (mod) {
      $.url.go(this.$router, mod.path)
    }
  }
}
</script>
<style lang="less">
  .tab-link {
    width: 100%;
    height: 45px;
    margin: 0;
    padding: 0;
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    background-color: #F6F6F6;

    li {
      position: relative;
      display: inline-block;
      padding: 0 20px;
      color: #555;
      font-size: 14px;
      line-height: 45px;
      cursor: pointer;

      &.active {
        background-color: #e9e9e9;

        &:before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #2D87F9;
        }
      }

      i.ico-org-otheros, i.ico-org-administrative {
        font-size: 17px;
      }
    }
  }
</style>

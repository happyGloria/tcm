<template>
  <div class="app-wrapper">
    <nav class="clearfix">
      <router-link to="/">
        <span class="logo fl">轨道交通配置管理系统</span>
      </router-link>
      <div class="fl nav-list first-nav">
        <router-link v-for="item in addRouters"
                     :key="item.name"
                     :to="item.path"
                     :class="{'nav-item': true, 'active': $route.matched[0].path.indexOf(item.path) === 0}">
          <i :class="['icon', 'icon-'+item.meta.icon]" />
          <span>{{ item.meta.title }}</span>
        </router-link>
      </div>
      <div class="profile fr">
        <span v-if="isVersion"
              title="版本信息"
              class="version"
              @click="dialogVisible = true">
          <i class="icon icon-guanyu" />
          <i>关于</i>
        </span>
        <span v-if="siteName"
              title="线路名称"
              class="site">
          <i class="icon icon-site-1" />
          <i class="username">{{ siteName }}</i>
        </span>
        <span class="user"
              title="当前用户">
          <i class="icon icon-user" />
          <i class="username">{{ username }}</i>
        </span>
        <span class="icon icon-logout"
              title="退出"
              @click="logout" />
      </div>
    </nav>
    <app-main />
    <el-dialog :visible.sync="dialogVisible"
               :modal-append-to-body="false"
               title="关于"
               width="400px"
               class="version-dialog">
      <div slot="title" class="header-title">
        <i class="icon icon-guanyu" />
        <span>关于</span>
      </div>
      <span>{{ version }}</span>
    </el-dialog>
  </div>
</template>

<script>
import AppMain from './AppMain.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'siteName',
      'addRouters',
      'version'
    ]),
    isVersion () {
      return !$.isEmptyFn(this.version)
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    linkFn (item) {
      this.$router.push(item)
    }
  }
}
</script>

<style lang="less">
.app-wrapper {
  nav {
    min-width: 1360px;
    padding: 0 30px;
    background-color: #2d87f9;
    .logo {
      margin: 15px 50px 0 0;
      color: #fff;
      font-size: 20px;
    }
    .profile {
      color: #fff;
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      & > span:nth-child(-n + 2) {
        margin-right: 20px;
      }
      .icon-logout, .version {
        cursor: pointer;
      }
      .user {
        margin-right: 10px;
      }
    }
  }
}
.nav-list {
  .nav-item {
    display: inline-block;
    padding: 0 20px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }
  .nav-item.active {
    background-color: #137de5;
  }
}
.first-nav {
  line-height: 50px;
}
.second-nav {
  width: 100%;
  height: 40px;
  line-height: 38px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #ddd;
  .nav-item {
    color: #555;
    position: relative;
    &::after {
      content: "";
      width: 1px;
      height: 20px;
      position: absolute;
      right: 0px;
      top: 10px;
      background-color: #e9e9e9;
    }
  }
  .nav-item.active {
    background-color: #e9e9e9;
    border-bottom: 2px solid #2d87f9;
  }
}
.version-dialog {
  .header-title {
    height: 40px;
    line-height: 40px;
    color: #fff;
  }
}
</style>

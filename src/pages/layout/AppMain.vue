<template>
  <section class="app-main">
    <div class="nav-list second-nav">
      <router-link v-for="item in secondNav"
                   :to="item.path"
                   :key="item.name"
                   :class="{ 'active': $route.path.indexOf(item.path) === 0 }"
                   class="nav-item">
        <i :class="['icon', 'icon-'+item.meta.icon]" />
        <span>{{ item.meta.title }}</span>
      </router-link>
    </div>
    <transition name="fade-transform"
                mode="out-in">
      <router-view :key="key"
                   class="page-wrapper" />
    </transition>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(['secondNav']),
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  mounted () {
    // console.log('this.secondNav:', this.secondNav)
  }
}
</script>
<style lang="less">
/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 150ms;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

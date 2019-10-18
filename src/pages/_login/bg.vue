<template>
  <div class="entry-bg">
    <vue-particles
      :particleOpacity="0.8"
      :particlesNumber="16"
      :particleSize="20"
      :linesWidth="3"
      :lineOpacity="0.9"
      :linesDistance="180"
      :moveSpeed="5"
      :lineLinked="true"
      :hoverEffect="true"
      shapeType="circle"
      linesColor="#c8e3f9"
      color="#c8e3f9"
      clickMode="push" />
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="less">
#particles-js,.entry-bg {
  width: 100%;
  height: 100%;
}
</style>

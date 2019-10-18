<template>
  <div class="errPage-container">
    <div class="wraper">
      <el-row>
        <el-col :span="12">
          <h1 class="text-jumbo">Oops!</h1>
          <h2>您还没有进行系统配置，否则系统暂时无法使用。</h2>
          <el-button type="primary" @click="go2ConfigFn">进行系统配置</el-button>
        </el-col>
        <el-col :span="12" />
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    go2ConfigFn () {
      this.$router.push({ path: '/sysConf' })
    }
  }
}
</script>
<style lang="less">
.errPage-container{
  width: 100%;
  height: 100%;
  background: url("~@/assets/bg/404.png");
  background-size: cover;
  .wraper {
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%,-50%);
  }
  h1 {
    font-size: 40px;
    font-weight: 800;
    color: #484848;
  }
  h1, h2 {
    line-height: 40px;
    font-weight: normal;
    margin-bottom: 20px;
  }

  .text-jumbo {
    font-size: 40px;
    font-weight: 600;
    color: #484848;
  }
}
</style>


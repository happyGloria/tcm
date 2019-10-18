<template>
  <div class="page-login">
    <bg-canvas />
    <div class="wrapper">
      <div class="login-container">
        <el-form ref="loginForm"
                 :rules="loginRules"
                 :model="loginForm"
                 auto-complete="off"
                 label-position="left"
                 label-width="0px"
                 class="card-box login-form">
          <div class="logo">轨道交通配置管理系统</div>
          <el-form-item prop="username"
                        errorType="tooltip">
            <i class="icon icon-username" />
            <el-input v-model="loginForm.username"
                      name="username"
                      type="text"
                      disableautocomplete
                      auto-complete="off"
                      placeholder="请输入登录账号" />
          </el-form-item>
          <el-form-item prop="password"
                        errorType="tooltip">
            <i class="icon icon-password" />
            <el-input v-model="loginForm.password"
                      :type="pwdType"
                      name="password"
                      disableautocomplete
                      auto-complete="off"
                      placeholder="请输入密码"
                      @keyup.enter.native="handleLogin" />
            <span class="show-pwd"
                  @click="showPwd">
              <i :class="['icon', { 'icon-eye-close': pwdType == 'password', 'icon-eye': pwdType == '' }]" />
            </span>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading"
                       type="primary"
                       style="width:100%;"
                       @click.native.prevent="handleLogin"> 登 录 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import BgCanvas from './bg.vue'
import '@/utils/endecrept.js'
export default {
  name: 'Login',
  components: {
    BgCanvas
  },
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的登录账号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
      callback()
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: null
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      var me = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(r => {
            this.loading = false
            /* this.$nextTick(() => {
              // 防止篡改 localStorage
              window.addEventListener('storage', (e) => {
                this.$store.dispatch('ClearSession', () => {
                  location.reload()
                })
              }, false)
            }) */
            return me.$router.push({ path: '/', name: 'root' })
          }).catch((r) => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
.page-login {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgb(240, 244, 248);
}
.wrapper {
  position: absolute;
  width: 54%;
  height: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url("~@assets/bg/login.png") no-repeat center center;
  background-size: cover;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 0px 50px 0px rgba(30, 127, 239, 0.5);
}
.login-container {
  width: 50%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  /* .x-y-center-parent(); */
  .el-form {
    width: 60%;
    min-width: 300px;
    .x-y-center-child();
  }
}
.login-form {
  position: absolute;
  top: 45%;
  transform: translateY(-42%);
  .logo {
    margin-bottom: 56px;
    font-weight: 500;
    color: #000;
    font-size: 1.9em;
    text-align: center;
    white-space: nowrap;
  }
  .el-form-item:nth-child(-n + 3) {
    background-color: #becfe1;
    border-radius: 25px;
    color: #000;
    width: 100%;
    margin-bottom: 20px;
    .icon {
      font-size: 24px;
      margin: 0 12px 0 25px;
      vertical-align: middle;
      color: #666;
    }
    .el-input {
      display: inline-block;
      width: calc(~"100% - 110px");
      height: 48px;
      line-height: 48px;
    }
    .el-input__inner {
      padding: 0px;
      color: #000;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 100%;
      line-height: 48px;
      font-size: 15px;
      color: #000 !important;
    }
    input:-webkit-autofill {
      background-color: #becfe1;
      box-shadow: 0 0 0px 1000px #becfe1 inset; // 使用足够大的纯色内阴影覆盖黄色背景
      /* -webkit-box-shadow: 0 0 0px 1000px rgb(235,243,249) inset; */
      border: none !important;
    }
    /* input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
      background-color: rgb(250, 255, 189);
      background-image: none;
      color: rgb(0, 0, 0);
    } */
    input::-webkit-input-placeholder {
      color: #999;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #999;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #999;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #999;
    }

    .el-tooltip {
      top: 17px !important;
      right: 42px !important;
      background: transparent !important;
      font-size: 14px !important;
    }
  }

  .el-form-item:last-child {
    width: 100%;
    height: 48px;
    .el-button {
      height: 48px;
      border-radius: 25px;
      background-color: rgb(63, 159, 255);
      font-size: 18px;
      font-weight: 500;
    }
  }
  .show-pwd {
    position: absolute;
    right: 4px;
    top: 4px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>

<template>
  <div class="login-container" v-loading="loading">
    <img src="@/assets/login-bg.png" alt class="wave" />
    <div class="container">
      <div class="login-box">
        <form action ref="loginForm">
          <img src="@/assets/avator.svg" alt class="avator" />
          <h2>Welcome</h2>
          <login-input
            @inputContent="getAccount"
            iconType="icon iconfont icon-usercenter"
            inputTitle="域账号"
          />
          <login-input
            inputType="password"
            autocomplete="current-password"
            iconType="icon iconfont icon-password"
            inputTitle="密码"
            @inputContent="getPassword"
          />
          <el-popover placement="right-end" width="160" v-model="popVisible">
            <p>是否使用本机登录？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="popVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="autoLogin">确定</el-button>
            </div>
            <a href="#login?Id=Forget" slot="reference">忘记密码</a>
          </el-popover>
          <input
            type="submit"
            class="btn"
            value="登录"
            @click.prevent="manulLogin"
            :disabled="btnDisabled"
          />
        </form>
      </div>
    </div>
    <a href="#" class="copyright">&copy; Ferrotec-劳保系统</a>
  </div>
</template>

<script>
import LoginInput from '@/components/LoginInput.vue'
import jwtDecode from 'jwt-decode'
export default {
  components: { LoginInput },
  data () {
    return {
      // 帐号密码
      user: {
        Account: '',
        Password: ''
      },
      // 登录时的loading
      loading: false,
      // 登录按钮禁用
      btnDisabled: false,
      // 忘记密码提示框
      popVisible: false
    }
  },
  mounted () {
    // 初始状态地址栏无参数则直接登录
    if (this.$route.query.Id === undefined) {
      this.autoLogin()
    }
  },
  methods: {
    // 自动登录，使用本机域账号
    autoLogin () {
      this.popVisible = false
      this.user.Account = ''
      this.user.Password = ''
      this.login()
    },
    // 帐号密码登录
    manulLogin () {
      if (!this.validateForm()) {
        return
      }
      this.login()
    },
    // 登录，不同环境使用不同的jsonp
    login () {
      this.loading = true
      this.btnDisabled = true
      this.$jsonp('http://localhost:22390/api/User/Login', { UserName: this.user.Account, Password: this.user.Password }).then(res => {
      // this.$jsonp('http://152.136.139.149:8091/api/User/Login', { UserName: this.user.Account, Password: this.user.Password }).then(res => {
      // this.$jsonp('http://10.10.42.81:8090/api/User/Login', { UserName: this.user.Account, Password: this.user.Password }).then(res => {
        window.sessionStorage.setItem('token', res)
        const tokenParse = jwtDecode(window.sessionStorage.token)
        this.$message.success(`欢迎-${tokenParse.UserName}`)
        this.$router.push('/home')
      }).catch(err => {
        this.$message.error(`登录失败，请检查用户-${err}`)
        this.loading = false
        this.btnDisabled = false
      })
    },
    // 获取帐号组件值
    getAccount (data) {
      this.user.Account = data
    },
    // 获取密码组件值
    getPassword (data) {
      this.user.Password = data
    },
    // 检验表格内容
    validateForm () {
      if (this.user.Account === '' || this.user.Password === '') {
        this.$message.error('填写帐号密码')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-container {
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.container {
  width: 100vw;
  height: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
}

.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.img img {
  width: 500px;
}

.login-box {
  display: flex;
  align-items: center;
  text-align: center;
}

form {
  width: 360px;
}

.avator {
  width: 100px;
}

form h2 {
  font-size: 2.9rem;
  text-transform: uppercase;
  margin: 15px 0;
  color: #999;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #70CBFF;
}

.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  margin: 1rem 0;
  font-size: 1.2rem;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #C1E4FB, #70CBFF, #C1E4FB);
  cursor: pointer;
  color: #fff;
  text-transform: uppercase;
  background-size: 200%;
  transition: 0.5s;
}

.btn:hover {
  background-position: right;
}

.copyright {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 2px;
  color: #5499C0;
  text-align: center;
  font-size: 18px;
}

</style>

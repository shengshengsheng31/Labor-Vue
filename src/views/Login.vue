<template>
  <div class="login-container">
    <img src="@/assets/login-bg.png" alt class="wave" />
    <div class="container">
      <div class="login-box">
        <form action ref="loginForm">
          <img src="@/assets/avator.svg" alt class="avator" />
          <h2>Welcome</h2>
          <login-input @inputContent="getAccount" iconType="icon iconfont icon-usercenter" inputTitle="Account"/>
          <login-input inputType="password" autocomplete="current-password" iconType="icon iconfont icon-password" inputTitle="Password" @inputContent="getPassword"/>
          <a href="#">Forget Password</a>
          <input type="submit" class="btn" value="Login" @click.prevent="login" />
        </form>
      </div>
    </div>
    <a href="#" class="copyright">&copy; shengshengsheng</a>
  </div>
</template>

<script>
import LoginInput from '@/components/LoginInput.vue'
export default {
  components: { LoginInput },
  data () {
    return {
      user: {
        Account: '',
        Password: ''
      }
    }
  },
  mounted () {
    if (this.user.Account !== '') {
      this.$refs.loginForm.childNodes[2].classList.add('exist')
      this.$refs.loginForm.childNodes[3].classList.add('exist')
    }
  },
  methods: {
    async login (event) {
      if (this.user.Account.trim() === '') {
        this.$message.error('请输入账号')
        return
      }
      if (this.user.Password.trim() === '') {
        this.$message.error('请输入密码')
        return
      }
      await this.$http.post('api/user/login', this.user).then(res => {
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data)
        this.$router.push('/home')
      }).catch(err => {
        this.$message.error(`登录失败-${err.toString()}`)
      })
    },
    getAccount (data) {
      this.user.Account = data
    },
    getPassword (data) {
      this.user.Password = data
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

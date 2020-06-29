<template>
  <div class="container">
    <el-container>
      <el-header height="5rem">
        <div>
          <el-image :src="require('@/assets/logo.png')" style="width:6rem"></el-image>
          <h3>劳保系统</h3>
        </div>
        <div>
          <el-link type="info">
            {{userName}}
            <i class="el-icon-edit"></i>
          </el-link>
          <el-button @click="quit">重新登录</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="10rem">
          <el-menu
            default-active="/LaborSelect"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="reload"
            router
            unique-opened
          >
            <el-menu-item index="/LaborSelect">
              <i class="el-icon-present"></i>
              <span slot="title">本期劳保</span>
            </el-menu-item>
            <el-menu-item index="/LaborManage">
              <i class="el-icon-tickets"></i>
              <span slot="title">劳保管理</span>
            </el-menu-item>

              <el-menu-item index="/UserManage">
                <i class="el-icon-link"></i>
                <span slot="title">人员管理</span>
              </el-menu-item>

            <el-menu-item index="/DepartmentManage">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">部门管理</span>
            </el-menu-item>

          </el-menu>
        </el-aside>

        <el-main>
          <router-view v-if="isRouterAlive" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      userName: '',
      isRouterAlive: true,
      tokenParse: jwtDecode(window.sessionStorage.token)
    }
  },
  mounted () {
    this.roleRight()
    this.userName = this.tokenParse.UserName
    this.$router.push('/LaborSelect')
  },
  methods: {
    handleOpen () {

    },
    handleClose () {

    },
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 刷新
    reload () {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true // 再打开
      })
    },
    // 判断权限
    roleRight () {
      // console.log(this.tokenParse.Role)
    }

  }
}
</script>
<style lang="stylus" scoped>
.el-container, .container {
  height: 100%;
}

.el-main {
  background-color: #f0f2f5;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;

  >div {
    display: flex;
    align-items: center;

    >.el-link {
      font-size: 1rem;
      margin-right: 1rem;
    }
  }
}
</style>

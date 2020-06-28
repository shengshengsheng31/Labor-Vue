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
          <!-- <el-button @click="quit">退出</el-button>-->
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
            <el-submenu index="manageLabor" v-if="tokenParse.UserRole!=='staff'">
              <template slot="title">
                <i class="el-icon-paperclip"></i>
                <span>劳保管理</span>
              </template>
              <el-menu-item index="/LaborList">
                <i class="el-icon-tickets"></i>
                <span slot="title">劳保列表</span>
              </el-menu-item>
              <el-menu-item index="/LaborEdit" v-if="tokenParse.UserRole==='admin'">
                <i class="el-icon-edit-outline"></i>
                <span slot="title">创建劳保</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="manageUser" v-if="tokenParse.UserRole!=='staff'">
              <template slot="title">
                <i class="el-icon-thumb"></i>
                <span>人员管理</span>
              </template>
              <el-menu-item index="/UserList">
                <i class="el-icon-link"></i>
                <span slot="title">人员列表</span>
              </el-menu-item>
              <el-menu-item index="/RegisterUser">
                <i class="el-icon-files"></i>
                <span slot="title">人员注册</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="manageDept" v-if="tokenParse.UserRole==='admin'">
              <template slot="title">
                <i class="el-icon-data-analysis"></i>
                <span>部门管理</span>
              </template>
              <el-menu-item index="/CreateDepartment">
                <i class="el-icon-magic-stick"></i>
                <span slot="title">创建部门</span>
              </el-menu-item>
              <el-menu-item index="/DepartmentList">
                <i class="el-icon-notebook-1"></i>
                <span slot="title">部门列表</span>
              </el-menu-item>
            </el-submenu>
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
export default {
  data () {
    return {
      userName: '',
      isRouterAlive: true,
      tokenParse: JSON.parse(decodeURIComponent(escape(window.atob(window.sessionStorage.token.split('.')[1]))))
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
      console.log(this.tokenParse.UserRole)
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

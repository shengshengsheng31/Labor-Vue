<template>
  <div class="container">
    <el-container>
      <el-header height="5rem">
        <div>
          <el-image :src="require('@/assets/logo.png')" style="width:6rem"></el-image>
          <h3>劳保系统</h3>
        </div>
        <div>
          <el-link type="info">{{userName}}<i class="el-icon-edit"></i></el-link>
          <el-button @click="quit">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="10rem">
          <el-menu
            default-active="/LaborSelect"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router
          >
            <el-menu-item index="/LaborList">
              <i class="el-icon-tickets"></i>
              <span slot="title">劳保列表</span>
            </el-menu-item>
            <el-menu-item index="/LaborCreate">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">创建劳保</span>
            </el-menu-item>
            <el-menu-item index="/LaborSelect">
              <i class="el-icon-present"></i>
              <span slot="title">本期劳保</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userName: '用户名'
    }
  },
  mounted () {

  },
  methods: {
    handleOpen () {

    },
    handleClose () {

    },
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
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

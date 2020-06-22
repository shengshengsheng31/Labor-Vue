<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>创建部门</span>
      </div>
      <el-form ref="deptForm" :model="deptForm" label-width="80px">
        <el-form-item label="部门名称" >
          <el-input v-model="deptForm.DeptName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="btnDisabled">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      deptForm: {
        DeptName: ''
      }

    }
  },
  methods: {
    // 确认创建
    onSubmit () {
      this.$http.post('api/Department/CreateDept', this.deptForm).then(res => {
        this.$message.success(`${this.deptForm.DeptName}创建成功`)
        this.deptForm.DeptName = ''
      }).catch(err => {
        this.$message.error(`创建失败-${err.response.data}`)
      })
    }
  },
  computed: {
    btnDisabled () {
      if (this.deptForm.DeptName === '') { return true } else {
        return false
      }
    }
  }

}
</script>
<style lang="stylus" scoped>
.el-input{
  width 20rem
}

</style>

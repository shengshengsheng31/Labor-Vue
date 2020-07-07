<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{pageTitle}}</span>
      </div>
      <el-form :model="userForm" :rules="userFormrules" ref="userForm" label-width="100px">
        <el-form-item label="姓名" prop="UserName">
          <el-input v-model="userForm.UserName"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="EmpNo">
          <el-input v-model="userForm.EmpNo"></el-input>
        </el-form-item>
        <el-form-item label="域账号">
          <el-input v-model="userForm.DomainAccount"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="userForm.DepartmentId"
            placeholder="选择部门"
            filterable
            :disabled="selectDisabled"
          >
            <el-option
              v-for="item in departments"
              :key="item.Id"
              :label="item.DeptName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="userForm.Level" placeholder="选择权限" filterable>
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
          <el-button @click="resetForm('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      userForm: {
        UserName: '',
        EmpNo: '',
        DomainAccount: '',
        DepartmentId: '',
        Level: 0,
        Id: ''
      },
      userFormrules: {
        UserName: { required: true, message: '输入姓名', trigger: 'blur' },
        EmpNo: { required: true, message: '输入工号', trigger: 'blur' }

      },
      departments: [{ Id: '', DeptName: '' }],
      roles: [
        { label: '普通用户', value: 0 },
        { label: '部门管理员', value: 1 },
        { label: '系统管理员', value: 2 }
      ],
      tokenParse: jwtDecode(window.sessionStorage.token),
      selectDisabled: false,
      // 标题
      pageTitle: ''

    }
  },
  mounted () {
    this.getDepts()
  },
  methods: {
    // 初始化、获取所有部门
    getDepts () {
      this.$http.get('api/Department/GetAllDepartment').then(res => {
        this.departments = res.data
        this.roleRight()
      }).catch(err => {
        this.$message.error(`获取失败-${err.response.data}`)
      })
    },
    // 确认创建用户
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '/api/User/Register'
          if (this.pageTitle === '修改人员') {
            url = '/api/User/UpdateUser'
          }
          this.userForm.EmpNo = Number.parseInt(this.userForm.EmpNo)
          this.$http.post(url, this.userForm).then(res => {
            this.$message.success(`${this.pageTitle}${this.userForm.UserName}成功`)
          }).catch(err => {
            this.$message.error(`创建失败-${err.response.data}`)
          })
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 判断权限
    roleRight () {
      if (this.tokenParse.Role === 'deptManager') {
        this.roles.pop()
        this.selectDisabled = true
      }
      this.isRegister()
    },
    // 判断创建还是修改
    isRegister () {
      const query = this.$route.query
      if (query.Id !== undefined) {
        this.userForm.UserName = query.UserName
        this.userForm.EmpNo = query.EmpNo
        this.userForm.DomainAccount = query.DomainAccount
        this.userForm.DepartmentId = query.DepartmentId
        this.userForm.Level = query.Level
        this.userForm.Id = query.Id
        this.pageTitle = '修改人员'
      } else {
        this.userForm.DepartmentId = this.tokenParse.DeptId
        this.pageTitle = '注册人员'
      }
    }

  }
}
</script>
<style lang="stylus" scoped>
.el-input {
  width: 30rem;
}
</style>

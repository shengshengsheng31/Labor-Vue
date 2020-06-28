<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
        <div class="deptBox">
          <span>部门：</span>
          <el-select v-model="deptId" placeholder="请选择" @change="deptChange">
            <el-option
              v-for="item in departments"
              :key="item.Id"
              :label="item.DeptName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-table :data="userData" style="width: 80%">
        <el-table-column prop="UserName" label="姓名"></el-table-column>
        <el-table-column prop="EmpNo" label="工号"></el-table-column>
        <el-table-column prop="Department.DeptName" label="部门"></el-table-column>
        <el-table-column prop="Level" label="等级">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Level === 0 ? 'success' :scope.row.Level === 1?'warning':'danger' "
            >{{scope.row.Level===0?'用户':scope.row.Level===1?'部门管理员':'系统管理员'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="updateUser(scope.row)" type="warning" size="mini">修改权限</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.PageNumber"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryData.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--修改提示框-->
    <el-dialog title="警告" :visible.sync="updateDialogVisible" width="30%">
      <span>{{currentData.UserName}}：</span>
      <el-select v-model="role" placeholder="请选择" @change="roleSelect">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除提示框-->
    <el-dialog title="警告" :visible.sync="deleteDialogVisible" width="30%">
      <span>是否确认删除：{{currentData.EmpNo}}-{{currentData.UserName}}</span>
      <span slot="footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userData: [{
        UserName: '',
        EmpNo: 0,
        Department: { DeptName: '' },
        Level: ''
      }],
      departments: [
        { DeptName: '', Id: '' }
      ],
      deptId: '',
      queryData: {
        PageNumber: 1,
        PageSize: 5,
        DeptId: ''
      },
      total: 0,
      deleteDialogVisible: false,
      currentData: { UserName: '', EmpNo: '', Id: '' },
      updateDialogVisible: false,
      options: [
        { label: '普通用户', value: 0 },
        { label: '部门管理员', value: 1 },
        { label: '系统管理员', value: 2 }],
      role: ''
    }
  },
  mounted () {
    this.getDepts()
  },
  methods: {
    // 根据部门获取用户
    getUsers () {
      this.$http.get('api/User/GetAllUser', { params: this.queryData }).then(res => {
        this.total = parseInt(res.headers['pagination-x'])
        this.userData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取所有部门
    getDepts () {
      this.$http.get('api/Department/GetAllDepartment').then(res => {
        this.departments = res.data
        const all = Object.assign({}, this.departments[0])
        all.DeptName = '全部'
        all.Id = '00000000-0000-0000-0000-000000000000'
        this.departments.unshift(all)
        this.deptId = this.departments[0].Id
        this.queryData.DeptId = this.deptId
        this.getUsers()
      })
    },
    // 部门改变
    deptChange (option) {
      this.queryData.DeptId = option
      this.getUsers()
    },
    // 页面容量改变
    handleSizeChange (size) {
      this.queryData.PageSize = size
      this.getUsers()
    },
    // 当前页改变
    handleCurrentChange (page) {
      this.queryData.PageNumber = page
      this.getUsers()
    },
    // 显示删除对话框
    deleteUser (row) {
      // console.log(row)
      this.currentData = row
      this.deleteDialogVisible = true
    },
    // 确认删除
    confirmDelete () {
      console.log(this.currentData.Id)
      this.$http.delete('api/User', { params: { Id: this.currentData.Id } }).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.getUsers()
      }).catch(err => {
        this.$message.error(`删除失败-${err.response}`)
      })
    },
    // 显示权限修改
    updateUser (row) {
      this.currentData = row
      this.role = row.Level
      this.updateDialogVisible = true
    },
    // 确认修改
    confirmUpdate () {
      this.currentData.Level = this.role
      this.$http.post('api/User/ChangeRole', this.currentData).then(res => {
        this.$message.success('修改成功')
        this.updateDialogVisible = false
      }).catch(err => {
        this.$message.error(`修改失败-${err.response.data}`)
        this.updateDialogVisible = false
      })
    },
    // 选择权限
    roleSelect (option) {
      this.role = option
    }

  }
}
</script>
<style lang="stylus" scoped>
.clearfix {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>

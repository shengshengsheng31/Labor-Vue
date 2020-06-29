<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>角色：</span>
        <el-input v-model="roleName" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="addRole">添加</el-button>
      </div>
      <el-table :data="roleTable" style="width: 80%">
        <el-table-column prop="RoleName" label="角色"></el-table-column>
         <el-table-column  label="操作" >
          <template slot-scope="scope">
            <el-button @click="updateRole(scope.row)" type="warning" size="mini" >修改权限</el-button>
            <el-button @click="deleteRole(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="30%">
      <span>确认删除角色：{{currentRole.RoleName}}</span>
      <br />
      <span class="attention">注意：属于该角色的人员将被一并删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleName: '',
      roleTable: [{ Id: '', RoleName: '' }],
      currentRole: { Id: '', RoleName: '' },
      deleteDialogVisible: false
    }
  },
  mounted () {
    this.getRole()
  },
  methods: {
    // 获取所有角色
    getRole () {
      this.$http.get('/api/Role/GetAllRole').then(res => {
        this.roleTable = res.data
      }).catch(err => {
        this.$message.error(`获取角色失败-${err.response.data}`)
      })
    },
    // 添加角色
    addRole () {
      this.$http.post('/api/Role/AddRoleName', { RoleName: this.roleName }).then(res => {
        this.$message.success('添加成功')
        this.getRole()
      }).catch(err => {
        this.$message.error(`添加失败-${err.response.data}`)
      })
    },
    // 显示删除对话框
    deleteRole (row) {
      this.currentRole = row
      this.deleteDialogVisible = true
    },
    // 确认删除角色
    deleteConfirm () {
      this.$http.delete('/api/Role', { params: { roleId: this.currentRole.Id } }).then(res => {
        this.$message.success('删除成功')
        this.getRole()
        this.deleteDialogVisible = false
      }).catch(err => {
        this.$message.error(`删除失败-${err.response.data}`)
        this.deleteDialogVisible = false
      })
    },
    // 修改权限
    updateRole () {

    }
  }
}
</script>
<style lang="stylus" scoped>
.el-input {
  width: 20%;
  margin: 0 1rem;
}
</style>

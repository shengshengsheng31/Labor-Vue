<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix">
        <span>部门：</span>
        <el-input v-model="deptName" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="addDept" :disabled="addDisabled">添加</el-button>
      </div>
      <el-table :data="deptData" style="width: 100%">
        <el-table-column prop="DeptName" label="日期" width="180"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="updateLabor(scope.row)" type="warning" size="mini">修改</el-button>
            <el-button @click="deleteLabor(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改" :visible.sync="updateDialogVisible" width="30%">
      <el-form ref="form" :model="updateDeptForm" label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="updateDeptForm.DeptName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="30%">
      <span>确认删除部门：{{deleteDeptForm.DeptName}}</span>
      <br />
      <span class="attention">注意：属于该部门的人员将被一并删除</span>
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
      deptData: [{
        Id: '',
        DeptName: ''
      }],
      updateDeptForm: { DeptName: '', Id: '' },
      deleteDeptForm: { DeptName: '', Id: '' },
      updateDialogVisible: false,
      deleteDialogVisible: false,
      deptName: '',
      addDisabled: true,
      loading: true

    }
  },
  mounted () {
    this.getAllDept()
  },
  methods: {
    // 获取所有部门
    getAllDept () {
      this.$http.get('api/Department/GetAllDepartment').then(res => {
        this.deptData = res.data
        this.loading = false
      }).catch(err => {
        this.$message.error(err.response.data)
      })
    },
    // 显示修改对话框
    updateLabor (row) {
      this.updateDeptForm.Id = row.Id
      this.updateDeptForm.DeptName = row.DeptName
      this.updateDialogVisible = true
    },
    // 显示删除对话框
    deleteLabor (row) {
      this.deleteDeptForm.Id = row.Id
      this.deleteDeptForm.DeptName = row.DeptName
      this.deleteDialogVisible = true
    },
    // 确认更新
    updateConfirm () {
      this.$http.post('api/Department/UpdateDept', this.updateDeptForm).then(res => {
        this.$message.success('更新成功')
        this.updateDialogVisible = false
        this.getAllDept()
      }).catch(err => {
        this.$message.error(`更新失败${err.response.data}`)
        this.updateDialogVisible = false
      })
    },
    // 确认删除
    deleteConfirm () {
      this.$http.delete('api/Department', { params: { Id: this.deleteDeptForm.Id } }).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.getAllDept()
      }).catch(err => {
        this.$message.error(`删除失败-${err.response.data}`)
        this.deleteDialogVisible = false
      })
    },
    // 添加部门
    addDept () {
      this.$http.post('api/Department/CreateDept', { DeptName: this.deptName }).then(res => {
        this.$message.success(`${this.deptName}创建成功`)
        this.getAllDept()
      }).catch(err => {
        this.$message.error(`创建失败-${err.response.data}`)
      })
    }
  },
  watch: {
    deptName (val) {
      if (val === '') { this.addDisabled = true } else {
        this.addDisabled = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.clearfix >.el-input {
  width: 20rem;
  margin: 0 3rem;
}
</style>

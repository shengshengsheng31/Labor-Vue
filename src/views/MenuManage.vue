<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="addMenu">添加</el-button>
      </div>
    </el-card>
    <!--添加菜单-->
    <el-dialog title="添加菜单" :visible.sync="addDialogVisible" width="30%">
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="MenuName">
          <el-input v-model="addForm.MenuName"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="Index">
          <el-input v-model="addForm.Index"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="Url">
          <el-input v-model="addForm.Url"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="ParentMenu">
          <el-input v-model="addForm.ParentMenu"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="Icon">
          <el-input v-model="addForm.Icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addDialogVisible: false,
      addForm: { MenuName: '', Url: '', ParentMenu: '', Icon: '', Index: '' },
      addFormrules: {
        MenuName: { required: true, message: '输入菜单名称', trigger: 'blur' },
        Index: { required: true, message: '输入序号', trigger: 'blur' }
      }
    }
  },
  mounted () {

  },
  methods: {
    // 获取菜单
    getMenu () {
      this.$http.get()
    },
    // 显示添加菜单对话框
    addMenu () {
      this.addDialogVisible = true
    },
    // 确认添加
    confirmAdd () {
      this.addForm.Index = parseInt(this.addForm.Index)
      this.$http.post('api/Menu/AddMenu', this.addForm).then(res => {
        this.$message.success('添加成功')
      }).catch(err => {
        this.$message.error(err.response.data)
      })
    }

  }

}
</script>
<style lang="stylus" scoped></style>

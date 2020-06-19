<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>劳保列表</span>
      </div>
      <el-table :data="laborData" style="width: 80%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.Goods.split(';')" :key="index">{{ item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Title" label="标题" width="180">
          <template slot-scope="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{scope.row.Title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="UpdateTime" label="时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="exlExport(scope.row)" type="primary" size="mini">导出</el-button>
            <el-button @click="updateLabor(scope.row)" type="warning" size="mini">修改</el-button>
            <el-button @click="deleteLabor(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageQuery.PageNumber"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageQuery.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--提示框-->
    <el-dialog title="警告" :visible.sync="deleteDialogVisible" width="30%">
      <span>是否确认删除劳保：{{currentData.Title}}</span>
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
      laborData: [],
      total: 0,
      pageQuery: { PageNumber: 1, PageSize: 10 },
      deleteDialogVisible: false,
      currentData: { Title: '', Options: '', Goods: '', Id: '', CreateTime: '', UodateTime: '' }
    }
  },
  methods: {
    // 获取所有数据
    async getData () {
      await this.$http.get('api/LaborHead/GetAllLaborHead', { params: this.pageQuery }).then(res => {
        this.laborData = res.data
        this.total = parseInt(res.headers['pagination-x'])
      })
    },
    // 待定
    handleClick (row) {
      this.$router.push({ name: 'LaborSelect', params: { Id: row.Id } })
    },
    // 页面容量改变
    handleSizeChange (size) {
      this.pageQuery.PageSize = size
      this.getData(this.pageQuery)
    },
    // 页码改变
    handleCurrentChange (page) {
      this.pageQuery.PageNumber = page
      this.getData(this.pageQuery)
    },
    // 删除按钮激发删除对话框
    deleteLabor (row) {
      this.currentData = row
      this.deleteDialogVisible = true
    },
    // 确认删除劳保
    async confirmDelete () {
      await this.$http.delete('/api/LaborHead', { params: { Id: this.currentData.Id } }).then(res => {
        this.$message.success(`已删除劳保：${this.currentData.Title}`)
        this.getData()
      }).catch(err => {
        this.$message.error(`删除失败${err.response.data.title}`)
      })
      this.deleteDialogVisible = false
    },
    // 修改按钮跳转到修改
    updateLabor (row) {
      this.$router.push({ path: '/LaborEdit', query: row })
    },
    // 跳转到详情
    toDetail (row) {
      console.log(row)
      this.$router.push({ path: '/DetailList', query: row })
    },
    // 导出
    async exlExport (row) {
      console.log(row)
      await this.$http.get('api/LaborDetail/ExportLabor', { params: { LaborId: row.Id, Title: row.Title }, responseType: 'blob' }).then(res => {
        const blob = new Blob([res.data])// 构造一个blob对象来处理数据
        const fileName = `${row.Title}-${Date.now()}.xlsx`
        if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
          const link = document.createElement('a')// 创建a标签
          link.download = fileName// a标签添加属性
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()// 执行下载
          URL.revokeObjectURL(link.href) // 释放url
          document.body.removeChild(link)// 释放标签
        } else { // IE浏览器
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch(err => {
        this.$message.error(`下载失败${err.toString()}`)
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="stylus" scoped>
.el-tag {
  margin: 0.3rem 1rem;
}

.el-pagination {
  margin-top: 1rem;
}
</style>

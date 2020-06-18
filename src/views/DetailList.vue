<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>本期劳保{{pageTitle}}</span>
      </div>
      <el-table :data="detailData" style="width: 80%">
        <el-table-column prop="Title" label="帐号" width="180"></el-table-column>
        <el-table-column prop="Title" label="姓名"></el-table-column>
        <el-table-column prop="Title" label="选项"></el-table-column>
        <el-table-column prop="Title" label="产品"></el-table-column>
        <el-table-column prop="UpdateTime" label="时间"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageTitle: '12',
      detailData: []
    }
  }
}
</script>
<style lang="stylus" scoped></style>

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
        <el-table-column prop="Title" label="标题" width="180"></el-table-column>
        <el-table-column prop="UpdateTime" label="时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary">GO</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      laborData: []
    }
  },
  methods: {
    async getData () {
      await this.$http.get('api/LaborHead/GetAllLaborHead').then(res => {
        this.laborData = res.data
      })
    },
    handleClick (row) {
      this.$router.push({ name: 'LaborSelect', params: { Id: row.Id } })
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
</style>

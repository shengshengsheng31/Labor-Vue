<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="cardHead">
        <div>
          <span>本期劳保{{pageTitle}}</span>
          <el-button class="btnExport" type="primary" @click="exlExport" :loading="btnLoading">导出</el-button>
        </div>
        <div>
          <el-button class="btnFresh" @click="getData">刷新</el-button>
          <el-select
            v-model="DeptId"
            placeholder="请选择"
            @change="deptChange"
            :disabled="selectDisabled"
          >
            <el-option
              v-for="item in departments"
              :key="item.Id"
              :label="item.DeptName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-table :data="detailData" style="width: 80%">
        <el-table-column prop="Account" label="帐号" width="180"></el-table-column>
        <el-table-column prop="Department" label="部门"></el-table-column>
        <el-table-column prop="Option" label="选项"></el-table-column>
        <el-table-column prop="Goods" label="劳保"></el-table-column>
        <el-table-column prop="Finish" :label="finishTitle">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Finish === '未完成' ? 'danger' : 'success'">{{scope.row.Finish}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      pageTitle: '',
      detailData: [],
      laborId: '',
      finishCount: 0,
      finishTitle: '',
      tokenParse: jwtDecode(window.sessionStorage.token),
      DeptId: '',
      departments: [],
      btnLoading: false,
      selectDisabled: false
    }
  },
  mounted () {
    this.roleRight()
    this.getDepts()
  },
  methods: {
    // 初始化、获取所有部门
    getDepts () {
      this.$http.get('api/Department/GetAllDepartment').then(res => {
        this.departments = res.data
        this.DeptId = this.tokenParse.DeptId
        const all = Object.assign({}, this.departments[0])
        all.DeptName = '全部'
        all.Id = '00000000-0000-0000-0000-000000000000'
        this.departments.unshift(all)
        this.getData()
      }).catch(err => {
        this.$message.error(`获取部门失败-${err.response.data}`)
      })
    },
    // 获取数据
    async getData () {
      const query = this.$route.query
      this.laborId = query.Id
      this.pageTitle = query.Title
      await this.$http.get('api/LaborDetail/GetLaborDetailByHead', { params: { LaborId: this.laborId, DeptId: this.DeptId } }).then(res => {
        for (const i in res.data) {
          if (res.data[i].Goods === null) {
            Object.assign(res.data[i], { Finish: '未完成' })
          } else {
            Object.assign(res.data[i], { Finish: '完成' })
            this.finishCount += 1
          }
        }
        this.finishTitle = `完成(${this.finishCount}/${res.data.length})`
        this.detailData = res.data
        console.log(this.detailData)
      }).catch(err => {
        this.$message.error(`获取数据失败-${err.response.data}`)
      })
    },
    // 导出
    async exlExport () {
      this.btnLoading = true

      await this.$http.get('api/LaborDetail/ExportLabor', { params: { LaborId: this.laborId, Title: this.pageTitle, DeptId: this.DeptId }, responseType: 'blob' }).then(res => {
        const blob = new Blob([res.data])// 构造一个blob对象来处理数据
        const fileName = `${this.pageTitle}-${Date.now()}.xlsx`
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
      this.btnLoading = false
    },
    // 部门改变
    deptChange (newDeptId) {
      this.DeptId = newDeptId
      this.getData()
    },
    // 权限判断
    roleRight () {
      if (this.tokenParse.Role !== 'admin') {
        this.selectDisabled = true
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.btnExport {
  margin-left: 3rem;
}

.cardHead {
  display: flex;
  justify-content: space-between;
}

.btnFresh {
  margin-right: 2rem;
}
</style>

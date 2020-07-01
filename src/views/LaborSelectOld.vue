<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择劳保--</span>
        <h3 v-if="laborChoice ===undefined">当前未选择任何劳保</h3>
        <h3 v-else>当前已选择的劳保：{{laborChoice}}</h3>
      </div>
      <template>
        <div class="radios">
          <el-radio
            v-model="choice"
            :label="optionsList[index]+'-'+item"
            v-for="(item,index) in goodsList"
            :key="index"
            @change="choiceChange"
          >{{`${optionsList[index]}-${item}`}}</el-radio>
        </div>
      </template>
      <el-button @click="confirmLabor" >确定</el-button>
    </el-card>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      laborHead: {},
      goodsList: [],
      optionsList: [],
      choice: '',
      createDate: {
        UserId: '',
        LaborId: '',
        Option: '',
        Goods: ''
      },
      laborChoice: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取劳保选项
    async getData () {
      await this.$http.get('api/LaborHead/GetLaborLatest').then(res => {
        this.laborHead = res.data
        this.goodsList = this.laborHead.Goods.split(';')
        this.optionsList = this.laborHead.Options.split(';')
        const token = jwtDecode(window.sessionStorage.getItem('token'))
        this.createDate.UserId = token.jti
        this.createDate.LaborId = this.laborHead.Id
        this.getChoice()
        this.getOptionRate()
      }).catch(err => {
        this.$message.error(`获取劳保失败-${err.response.data}`)
      })
    },
    // 改变劳保选项触发
    choiceChange (res) {
      this.createDate.Option = res.split('-')[0]
      this.createDate.Goods = res.split('-')[1]
    },
    // 确定提交
    confirmLabor () {
      this.$http.post('api/LaborDetail/CreateLaborDetail', this.createDate).then(res => {
        this.$message.success('选择成功')
        this.getChoice()
      }).catch(err => {
        this.$message.error(`选择失败-${err.response.data}`)
      })
    },
    // 获取选择的选项
    getChoice () {
      this.$http.get('api/LaborDetail/GetUserLaborChoice', { params: { UserId: this.createDate.UserId, LaborId: this.createDate.LaborId } }).then(res => {
        this.laborChoice = res.data.Option
        if (this.laborChoice === undefined) {
          // 给初始值
          this.createDate.Option = this.optionsList[0]
          this.createDate.Goods = this.goodsList[0]
          this.choice = `${this.optionsList[0]}-${this.goodsList[0]}`
        } else {
          this.createDate.Option = res.data.Option
          this.createDate.Goods = res.data.Goods
          this.choice = `${this.createDate.Option}-${this.createDate.Goods}`
        }
      }).catch(err => {
        this.$message.error(`获取已选择失败${err.response.data}`)
      })
    },
    // 获取各个选项的选择比例
    getOptionRate () {
      this.$http.get('/api/LaborDetail/GetOptionRate', {
        params: { Options: this.optionsList, LaborId: this.laborHead.Id, DeptId: jwtDecode(window.sessionStorage.getItem('token')).DeptId },
        paramsSerializer: function (params) {
          const Options = params.Options.map(_ => `Options=${_}`).join('&')
          params = `${Options}&LaborId=${params.LaborId}&DeptId=${params.DeptId}`
          return params
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }

  },
  computed: {

  }
}
</script>
<style lang="stylus" scoped>
h3 {
  display: inline;
}

.container {
  height: 100%;
}

.el-card {
  height: 80%;
}

.box {
  background-color: grey;
  height: 100%;
}

.radios {
  display: flex;
  flex-direction: column;
}

.el-radio {
  margin: 1rem;
}
</style>

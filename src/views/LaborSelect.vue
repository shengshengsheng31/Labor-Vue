<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择劳保</span>
      </div>
      <template>
        <div>
          <el-radio
            v-model="choice"
            :label="optionsList[index]+'-'+item"
            border
            v-for="(item,index) in goodsList"
            :key="index"
            @change="choiceChange"
          >{{`${optionsList[index]}-${item}`}}</el-radio>
        </div>
      </template>
      <el-button @click="confirmLabor">确定</el-button>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      Id: this.$route.params.Id,
      laborHead: {},
      goodsList: [],
      optionsList: [],
      choice: '',
      createDate: {
        UserId: '',
        LaborId: '',
        Option: '',
        Goods: ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.get('api/LaborHead/GetOneLaborHead', { params: { Id: this.Id } }).then(res => {
        this.laborHead = res.data
        this.goodsList = this.laborHead.Goods.split(';')
        this.optionsList = this.laborHead.Options.split(';')
      }).catch(err => {
        this.$message.error(`获取劳保失败-${err.response.data}`)
      })
    },
    choiceChange (res) {
      this.createDate.Option = res.split('-')[0]
      this.createDate.Goods = res.split('-')[1]
    },
    confirmLabor () {
      const token = decodeURIComponent(escape(window.atob(window.sessionStorage.getItem('token').split('.')[1])))
      this.createDate.UserId = JSON.parse(token).jti
      this.createDate.LaborId = this.Id
      this.$http.post('api/LaborDetail/CreateLaborDetail', this.createDate).then(res => {
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
</style>

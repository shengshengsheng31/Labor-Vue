<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择劳保--</span>
        <h3 v-if="laborSelected ===undefined">当前未选择任何劳保</h3>
        <h3 v-else>当前已选择的劳保：{{laborSelected}}</h3>
      </div>
      <div class="cardBody">
        <div class="radioGroup">
          <div
            v-for="(goods,index) in goodsList"
            :key="index"
            class="radioBox"
            @click.prevent="chooseToRadio(index)"
          >
            <el-popover placement="top" width="200" trigger="hover" :content="goods">
              <el-radio-group v-model="choiceIndex" slot="reference">
                <el-radio
                  :label="index"
                >{{`${optionsList[index]}-${goods}`.substring(0,15).concat('...')}}</el-radio>
              </el-radio-group>
            </el-popover>
            <el-progress :text-inside="true" :stroke-width="20" :percentage="rateList[index]"></el-progress>
          </div>
        </div>
        <el-button
          type="primary"
          @click="selectLabor"
          class="btnChoose"
          :disabled="selectDisabled"
        >选择劳保</el-button>
        <div class="surrogateBox" v-if="tokenParse.Role!=='user'">
          <el-input placeholder="请输入代选工号" v-model="surrogateEmpNum" @change="enterToFind"></el-input>
          <el-button type="warning" :disabled="surrogateDisabled" @click="selectLaborSurrogate">劳保代选</el-button>
        </div>
        <span class="surrogateName">{{surrogateName}}</span>
      </div>
    </el-card>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      tokenParse: jwtDecode(window.sessionStorage.getItem('token')),
      // 本期劳保数据
      LaborHead: {
        Title: '',
        Options: '',
        Goods: '',
        Id: ''

      },
      // 劳保品列表
      goodsList: [],
      // 劳保选项列表
      optionsList: [],
      // 用户选择的选项
      choiceIndex: 0,
      // 选项比例
      rateList: [],
      // 显示已选择的劳保
      laborSelected: '',
      // 代选工号
      surrogateEmpNum: '',
      // 选择劳保按钮可用
      selectDisabled: false,
      // 代选劳保可用
      surrogateDisabled: false,
      // 被代选的人名字
      surrogateName: '',
      // 查询到的代选人信息
      surrogateUser: { Id: '', DomainAccount: '', UserName: '', EmpNo: '' }
    }
  },
  mounted () {
    this.getlabor()
  },
  methods: {
    // 获取本期劳保
    getlabor () {
      this.$http.get('api/LaborHead/GetLaborLatest').then(res => {
        this.LaborHead = res.data
        this.goodsList = this.LaborHead.Goods.split(';')
        this.optionsList = this.LaborHead.Options.split(';')
        this.getOptionRate()
        this.getSelected()
      }).catch(err => {
        this.$message.error(`获取劳保失败-${err.response.data}`)
      })
    },
    // 获取选项比例，根据本期劳保与当前部门
    getOptionRate () {
      this.$http.get('/api/LaborDetail/GetOptionRate', {
        params: { Options: this.optionsList, LaborId: this.LaborHead.Id, DeptId: this.tokenParse.DeptId },
        paramsSerializer: function (params) {
          const Options = params.Options.map(_ => `Options=${_}`).join('&')
          params = `${Options}&LaborId=${params.LaborId}&DeptId=${params.DeptId}`
          return params
        }
      }).then(res => {
        this.rateList = []
        res.data.forEach(item => {
          this.rateList.push(Math.floor((item.OptionCount / item.Total * 100)))
        })
      }).catch(err => {
        this.$message.error(`获取选项比例失败-${err.response.data}`)
      })
    },
    // 获取已选择的选项
    getSelected () {
      this.$http.get('api/LaborDetail/GetUserLaborChoice', { params: { UserId: this.tokenParse.jti, LaborId: this.LaborHead.Id } }).then(res => {
        this.laborSelected = res.data.Option
        if (this.laborSelected !== undefined) {
          this.choiceIndex = this.optionsList.indexOf(res.data.Option)
        }
      }).catch(err => {
        this.$message.error(`获取已选择失败${err.response.data}`)
      })
    },
    // 选择劳保
    selectLabor () {
      this.$http.post('api/LaborDetail/CreateLaborDetail', { UserId: this.tokenParse.jti, LaborId: this.LaborHead.Id, Option: this.optionsList[this.choiceIndex], Goods: this.goodsList[this.choiceIndex] }).then(res => {
        this.getOptionRate()
        this.laborSelected = this.optionsList[this.choiceIndex]
        this.$message.success('选择成功')
      }).catch(err => {
        this.$message.error(`选择失败-${err.response.data}`)
      })
    },
    // 代选劳保
    selectLaborSurrogate () {
      if (this.surrogateName === '' || this.surrogateName === '未查询到') {
        return
      }
      this.$http.post('api/LaborDetail/CreateLaborDetail', { UserId: this.surrogateUser.Id, LaborId: this.LaborHead.Id, Option: this.optionsList[this.choiceIndex], Goods: this.goodsList[this.choiceIndex] }).then(res => {
        this.getOptionRate()
        this.laborSelected = this.optionsList[this.choiceIndex]
        this.$message.success('选择成功')
      }).catch(err => {
        this.$message.error(`选择失败-${err.response.data}`)
      })
    },
    // 点击div即可选择radio
    chooseToRadio (index) {
      this.choiceIndex = index
    },
    // 回车查找
    enterToFind () {
      if (this.surrogateEmpNum === '') {
        return
      }
      this.$http.get('/api/User/GetUserByNum', { params: { EmpNo: this.surrogateEmpNum } }).then(res => {
        this.surrogateUser = res.data
        if (this.surrogateUser !== '') {
          this.surrogateName = `被代选人:${this.surrogateUser.UserName}`
        } else {
          this.surrogateName = '未查询到'
        }
      }).catch(err => {
        this.$message.error(`查询用户失败-${err.response.data}`)
      })
    }
  },
  watch: {
    surrogateEmpNum (val) {
      if (val !== '') {
        this.selectDisabled = true
        this.surrogateDisabled = false
      } else {
        this.selectDisabled = false
        this.surrogateDisabled = true
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.box-card {
  height: 80%;
}

.cardBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  display: inline;
}

.radioGroup {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 2rem;
}

.radioBox {
  border: 1px solid #dad4cb;
  padding: 2rem;
  border-radius: 1rem;
  flex: 0 1 8rem;
}

.radioBox:hover {
  cursor: pointer;
}

.btnChoose {
  width: 30%;
  margin-top: 5rem;
}

.surrogateBox {
  margin-top: 5rem;
  display: flex;
  justify-content: space-between;
  width: 30%;

  >.el-input {
    width: 60%;
  }
}

.el-radio {
  margin: 0rem 0 2rem 0;
}

.surrogateName {
  margin-top: 1rem;
  color: #67C23A;
}
</style>

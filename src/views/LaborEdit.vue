<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{pageTitle}}</span>
      </div>
      <el-form :model="laborForm" ref="laborForm" label-width="100px">
        <el-form-item prop="title" label="标题" :rules="laborFormRule.titleRule">
          <el-input v-model="laborForm.title" :disabled="titleDisabled"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in laborForm.options"
          :label="'劳保' + item.option"
          :key="item.key"
          :prop="'options.' + index + '.goods'"
          :rules="laborFormRule.optionRule"
        >
          <el-input v-model="item.goods">
            <el-button
              slot="append"
              @click.prevent="removeOption(item)"
              v-if="index===laborForm.options.length-1"
            >删除</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('laborForm')">提交</el-button>
          <el-button @click="addOption">新增劳保</el-button>
          <el-button @click="resetForm('laborForm')" :disabled="resetDisabled">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 表单数据
      laborForm: {
        title: '',
        options: [{ goods: '', option: 'A' }, { goods: '', option: 'B' }, { goods: '', option: 'C' }]
      },
      // 表单规则
      laborFormRule: {
        titleRule: { required: true, message: '输入标题', trigger: 'blur' },
        optionRule: [{ required: true, message: '劳保不能为空', trigger: 'blur' }]
      },
      // 提交到数据库的数据
      labor: {
        Title: '',
        Options: '',
        Goods: ''
      },
      pageTitle: '321',
      titleDisabled: false,
      resetDisabled: false
    }
  },
  mounted () {
    this.initForm()
  },
  methods: {
    // 初始化表单判读是新增还是修改
    initForm () {
      // 新增
      if (this.$route.query.Title === undefined) {
        this.pageTitle = '创建劳保'
        this.laborForm.title = this.getDate()
      } else {
        // 修改
        this.titleDisabled = true
        this.resetDisabled = true
        const query = this.$route.query
        this.pageTitle = '修改劳保'
        this.laborForm.title = query.Title
        this.laborForm.options = []
        query.Goods.split(';').forEach((item, index) => {
          this.laborForm.options.push({ goods: item, option: query.Options.split(';')[index] })
        })
      }
    },
    // 提交
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const goodslist = []
          const optioins = []
          this.labor.Title = this.laborForm.title
          this.laborForm.options.forEach(item => {
            goodslist.push(item.goods)
            optioins.push(item.option)
          })
          this.labor.Goods = goodslist.join(';')
          this.labor.Options = optioins.join(';')

          if (this.pageTitle === '创建劳保') {
            await this.$http.post('api/LaborHead/CreateLaborHead', this.labor).then(res => {
              this.$message.success('创建成功')
              this.$router.push('/LaborManage')
            }).catch(err => {
              this.$message.error(`创建失败-${err.response.data}`)
            })
          } else {
            console.log(Object.assign(this.labor, { Id: this.$route.query.Id }))
            await this.$http.post('api/LaborHead/UpdateLaborHead', Object.assign(this.labor, { Id: this.$route.query.Id })).then(res => {
              this.$message.success('修改成功')
              this.$router.push('/LaborManage')
            }).catch(err => {
              this.$message.error(`修改失败-${err.response.data}`)
            })
          }
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 删除一个劳保
    removeOption (item) {
      const index = this.laborForm.options.indexOf(item)
      if (index !== -1) {
        this.laborForm.options.splice(index, 1)
      }
    },
    // 新增一个劳保
    addOption () {
      this.laborForm.options.push({
        goods: '',
        option: this.returnLetter(this.laborForm.options.length)
      })
    },
    // 根据index返回字母
    returnLetter (index) {
      return String.fromCharCode(index + 65)
    },
    // 获取当前日期
    getDate () {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth()
      if (month < 10) {
        month = `0${month}`
      }
      return `${year}-${month}`
    }
  },

  computed: {

  }

}
</script>

<style lang="stylus" scoped>
.el-input {
  width: 40%;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>创建劳保</span>
      </div>
      <el-form :model="laborForm" ref="laborForm" label-width="100px">
        <el-form-item prop="title" label="标题" :rules="laborFormRule.titleRule">
          <el-input v-model="laborForm.title"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in laborForm.options"
          :label="'劳保' + item.option"
          :key="item.key"
          :prop="'options.' + index + '.goods'"
          :rules="laborFormRule.optionRule"
        >
          <el-input v-model="item.goods"></el-input>
          <el-button @click.prevent="removeOption(item)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('laborForm')">提交</el-button>
          <el-button @click="addOption">新增劳保</el-button>
          <el-button @click="resetForm('laborForm')">重置</el-button>
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
        optionRule: { required: true, message: '劳保不能为空', trigger: 'blur' }
      },
      // 提交到数据库的数据
      labor: {
        Title: '',
        Options: '',
        Goods: ''
      }
    }
  },
  methods: {
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
          await this.$http.post('api/LaborHead/CreateLaborHead', this.labor).then(res => {
            this.$message.success('创建成功')
            // 需要跳转到列表界面
          }).catch(err => {
            this.$message.error(`创建失败-${err.response.data}`)
          })
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
    }
  },
  mounted () {

  }

}
</script>

<style lang="stylus" scoped>
.el-input {
  width: 40%;
}
</style>

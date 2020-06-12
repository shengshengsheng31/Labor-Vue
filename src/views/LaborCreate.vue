<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>创建劳保</span>
      </div>
      <el-form
        :model="laborForm"
        ref="laborForm"
        label-width="100px"
      >
        <el-form-item
          prop="Title"
          label="标题"
          :rules="formRule.titleRule"
        >
          <el-input v-model="laborForm.Title"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(option, index) in laborForm.Options"
          :label="'选项' + index"
          :key="option.key"
          :prop="'Options.' + index + '.Goods'"
          :rules="formRule.goodsRule"
        >
          <el-input v-model="laborForm.Options.Goods"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          <el-button @click="addDomain">新增劳保</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      laborForm: {
        Title: '',
        Options: [{ Goods: '' }]
      },
      formRule: {
        titleRule: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        goodsRule: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  }

}
</script>

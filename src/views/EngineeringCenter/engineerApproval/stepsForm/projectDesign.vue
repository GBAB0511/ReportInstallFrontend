<template>
  <div class="projectDesign">
    <legend class="legendColumn">工程设计</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="designDesc" label="设计意见：" class="col-2" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" type="textarea" v-model="form.designDesc"></el-input>
        <span v-else>{{form.designDesc}}</span>
      </el-form-item>
      <el-form-item prop="designStaff" label="设计人员：" :class="{'disable-item': disabled}">
         <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled"  v-model="form.designStaff"></el-input>
        <span v-else>{{form.designStaff}}</span>
      </el-form-item>
      <el-form-item prop="designDate" label="设计日期：" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" v-model="form.designDate" value-format="yyyy-MM-dd"></el-date-picker>
        <span v-else>{{form.designDate}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled'],
  data() {
    return {
      form: {
        designStaff: '',
        designDate: '',
        designDesc: ''
      },
      rules: {
        designStaff: [{ required: true, message: '设计人员不能为空', trigger: 'blur' }],
        designDate: [{ required: true, message: '设计日期不能为空', trigger: 'change' }],
      }
    }
  },
  created() {
    if(this.editData) {
      this.form = {...this.editData}
    }
  },
  methods: {
    
inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.projectDesign {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>
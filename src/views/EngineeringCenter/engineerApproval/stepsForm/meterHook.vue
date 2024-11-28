<template>
  <div class="meterHook">
    <legend class="legendColumn">表计挂接</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="constEndDate" label="挂接完成时间：" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" v-model="form.meterHookDate"></el-date-picker>
        <span v-else>{{form.meterHookDate}}</span>
      </el-form-item>
      <el-form-item prop="constComments" label="备注：" class="col-2" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" type="textarea" v-model="form.meterHookComment"></el-input>
        <span v-else>{{form.meterHookComment}}</span>
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
        meterHookDate: '',
        meterHookComment: '',
      },
      rules: {
        meterHookDate: [{ required: true, message: '挂接完成时间不能为空', trigger: 'change' }]
      },
    }
  },
  created() {
    if(this.editData) {
      this.form = {...this.editData}
    }
     this.form.meterHookDate = new Date();
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    }
  },
  methods:{
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
  }
}
</script>

<style lang="scss" scoped>
.meterHook {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>
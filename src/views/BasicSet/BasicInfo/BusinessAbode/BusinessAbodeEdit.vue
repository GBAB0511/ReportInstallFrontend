
<template>
    <div class="BusinessAbodeEdit">
            <el-form :inline="true" class="formBill-One" size="mini" ref="BusinessAbodeEditForm" :rules="rules" :model="ruleForm" label-width="100px">
                <el-form-item label="营业所编号：" prop="abodeNo">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.abodeNo" placeholder="营业所编号"  maxlength="50" clearable  ></el-input>
                </el-form-item>
                <el-form-item label="营业所名称：" prop="abodeName">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.abodeName" placeholder="营业所名称"  maxlength="50" clearable ></el-input>
                </el-form-item>
                <el-form-item label="排序号：" prop="sortNo">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.sortNo" placeholder="排序号"  maxlength="6" clearable > </el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="ruleForm.status" placeholder="请选择状态">
                        <el-option label="停用" :value="0"></el-option>
                        <el-option label="启用" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="ruleForm.comments" type="textarea" :rows="3" show-word-limit maxlength="150" placeholder="备注" clearable  ></el-input>
                </el-form-item>
            </el-form>
    </div>
</template>
<script>
export default {
    name:"BusinessAbodeEdit",
    data(){
        return{
            ruleForm:{
                
            },
            type:'add',
            formData:{
                id:"",
                abodeNo:'',
                abodeName:'',
                groupCode:"",
                tenantId:"",
                status:"",
                comments:'',
                sortNo:"",
            },
            rules: {
                abodeNo: [
                    { required: true, message: '请输入营业所编号', trigger: 'blur' }
                ],
                abodeName: [
                    { required: true, message: '请输入营业所名称', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请输入状态', trigger: 'blur' }
                ],
                sortNo: [
                    { required: true, message: '请输入排序号', trigger: 'blur' },
                    { type: 'number', message: '排序号必须为数字值', trigger: 'blur'}
                ],
            },
        }
    },
    methods: {
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      //保存按钮
      resetForm() {
        this.$refs.BusinessAbodeEditRuleForm.resetFields();
      },
      submitForm(formName) {
        let _this = this;
        let params = {};
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
             if(this.type === 'update'){
               params = {
                  "busicode": "BusinessAbodeUpdate",
                  "data": this.ruleForm
              }
             }else{
               params = {
                  "busicode": "BusinessAbodeAdd",
                  "data": this.ruleForm
              };
             }
              this.$api.fetch({
                params: params,//参数
              }).then(res => {
                _this.$message({
                  showClose:true,
                  message:'保存成功',
                  type:'success',
                });
                _this.$parent.init();
                _this.$parent.closeDialog();   
              })
              
          } else {
            return false;
          }
        });
      },
      handleClose() {
        this.common.chargeObjectEqual(this,this.ruleForm,'get','BusinessAbodeEdit',this.$parent.closeDialog);
      },
      editData(val,type){
        this.ruleForm = val;
        this.type = type
      }
    },
}
</script>
<style lang="scss">
.BusinessAbodeEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin:  0 auto;
  .formBill-One{
      line-height: 43px;
  }
}
</style>



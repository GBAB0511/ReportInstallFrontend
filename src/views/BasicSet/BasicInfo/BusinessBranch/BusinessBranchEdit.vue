
<template>
    <div class="BusinessBranchEdit">
        <el-form :inline="true" class="formBill-Two" size="mini" ref="BusinessBranchEditForm" :rules="rules" :model="ruleForm" label-width="100px">
            <el-form-item label="网点编号：" prop="branchNo">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.branchNo" placeholder="网点编号"  maxlength="50" clearable  ></el-input>
            </el-form-item>
            <el-form-item label="网点名称：" prop="branchName">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.branchName" placeholder="网点名称"  maxlength="50" clearable ></el-input>
            </el-form-item>
            <el-form-item label="网点坐标：" prop="branchOpsition">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.branchOpsition" placeholder="网点坐标"  maxlength="50" clearable  ></el-input>
            </el-form-item>
            <el-form-item label="网点地址：" prop="branchAddr">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.branchAddr" placeholder="网点地址"  maxlength="200" clearable ></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="telephone">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.telephone" placeholder="联系电话"  maxlength="200" clearable ></el-input>
            </el-form-item>
            <el-form-item label="营业时间：" prop="businessTime">
                <el-input v-model="ruleForm.businessTime" type="textarea" :rows="2"  maxlength="200" placeholder="周一至周五 上午 9:00 ~ 12:00，下午 14:00 ~ 17:30" clearable > </el-input>
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
    name:"BusinessBranchEdit",
    data(){
        return{
            ruleForm:{
                
            },
            formData:{
                id:"",
                branchNo:'',
                branchName:'',
                branchOpsition:'',
                branchAddr:'',
                telephone:'',
                businessTime:"",
                status:1,
                comments:'',
                sortNo:"",
            },
            rules: {
                branchNo: [
                    { required: true, message: '请输入网点编号', trigger: 'blur' }
                ],
                branchName: [
                    { required: true, message: '请输入网点名称', trigger: 'blur' }
                ],
                branchOpsition: [
                    { required: true, message: '请输入网点坐标', trigger: 'blur' }
                ],
                branchAddr: [
                    { required: true, message: '请输入网点地址', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' }
                ],
                businessTime: [
                    { required: true, message: '请选择营业时间', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请输入状态', trigger: 'blur' }
                ],
                sortNo: [
                    { required: true, message: '请输入排序号', trigger: 'blur' },
                    { type: 'number', message: '排序号必须为数字值', trigger: 'blur' }
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
        this.$refs.BusinessBranchEditRuleForm.resetFields();
      },
      submitForm(formName) {
        let _this = this;
        let params = {};
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
             if(this.ruleForm.id){
               params = {
                  "busicode": "BusinessBranchUpdate",
                  "data": this.ruleForm
              }
             }else{
               params = {
                  "busicode": "BusinessBranchAdd",
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
        this.common.chargeObjectEqual(this,this.ruleForm,'get','BusinessBranchEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
      }
    },
}
</script>
<style lang="scss">
.BusinessBranchEdit {
  width: 100%;
  height: calc(100% - 41px);
  .formBill-Two {
      margin-top: 20px;
      .el-form-item__label {
        line-height: 30px;
      }
  }
}
</style>


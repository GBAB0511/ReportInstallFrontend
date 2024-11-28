
<template>
    <div class="GlobalParamSetEdit">
         <div class="GlobalParamSetEditIndex">
            <el-form class="formBill-One" ref="GlobalParamSetEditForm" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">

                <el-form-item label="参数名称：" prop="configName">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.configName" maxlength="50" clearable></el-input>
                </el-form-item>

                <el-form-item label="参数内容：" prop="configValue">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.configValue"  maxlength="200" clearable></el-input>
                </el-form-item>

                <el-form-item label="状态：" prop="status">
                    <el-select v-model="ruleForm.status" placeholder="请选择状态" clearable>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="停用" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="ruleForm.comments" show-word-limit maxlength="150" clearable
                            placeholder="请输入备注"
                            type="textarea">
                    </el-input>
                </el-form-item>
 
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"GlobalParamSetEdit",
    data(){
        return{
            ruleForm:{
            
            },
            formData:{
                configId:"",
                configName: "",
                configValue: "",
                comments:"",
                status:"",
            },
            rules: {
              configName: [
                  { required: true, message: '请输入参数名称', trigger: 'blur' }
              ],
              configValue: [
                  { required: true, message: '请选择参数内容', trigger: 'blur' }
              ],
              status: [
                  { required: true, message: '请选择状态', trigger: 'blur' }
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
        this.$refs.GlobalParamSetEditForm.resetFields();
        },
        submitForm(formName,type) {
        let _this = this;
        let params = {};
        this.$refs[formName].validate((valid) => {
            if (valid) {
                if(type === '添加'){
                
                params = {
                    "busicode": "ConfigAdd",
                    "data": this.ruleForm
                }
                }else{
                this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
                params = {
                    "busicode": "ConfigUpdate",
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
        this.common.chargeObjectEqual(this,this.ruleForm,'get','GlobalParamSetEdit',this.$parent.closeDialog);
        },
        editData(val){
        this.ruleForm = val;
        
        }
    },
}
</script>
<style lang="scss">
.GlobalParamSetEdit {
  width: 100%;
  height: 100%;
  .GlobalParamSetEditIndex{    
    height: calc(100% - 41px);
    width: 60%;
    margin: 0 auto;
    overflow-y:hidden;
    overflow-x:hidden;
    .formBill-One .el-form-item .el-form-item__content{
      width:calc(95% - 100px); 
    }
  }
}
</style>

<template>
    <div class="MeterStatusEdit">
         <div class="backfillSubmitForm">
            <el-form class="MeterStatusEditForm" ref="MeterStatusEditForm" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">
                <el-form-item label="状态名称：" prop="statusName">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                                @input="e => input = inputMe(e)"
                                v-model="ruleForm.statusName" maxlength="50" clearable
                                placeholder="请输入状态名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="异常标记：" prop="abnormalFlag">
                        <el-select v-model="ruleForm.abnormalFlag" placeholder="请选择异常标记" clearable>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序号：" prop="sortNo">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="ruleForm.sortNo" maxlength="6" clearable
                                @input="e => input = inputMe(e)"
                                placeholder="请输入排序号">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="ruleForm.status" placeholder="请选择状态" clearable>
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="停用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    
        
                    <el-form-item label="备注：" prop="comments">
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
    name:"MeterStatusEdit",
    data(){
        return{
            ruleForm:{
            },
            formData:{
                statusId:"",
                statusName:'',
                abnormalFlag:'',
                status:'',
                sortNo:'',
                comments:"",
            },
            rules: {
                statusName: [
                    { required: true, message: '请输入状态名称', trigger: 'blur' }
                ],
                abnormalFlag: [
                    { required: true, message: '请选择异常标记', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ],
                sortNo: [
                    { required: true, message: '请输入排序号', trigger: 'blur' },
                    { type: 'number', message: '排序号必须为数字值'}
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
        this.$refs.MeterStatusEditForm.resetFields();
      },
      submitForm(formName,type) {
        let _this = this;
        let params = {};
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
              
             if(type === '添加'){
               
               params = {
                  "busicode": "MeterStatusAdd",
                  "data": this.ruleForm
              }
             }else{
                this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
               params = {
                  "busicode": "MeterStatusUpdate",
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
        this.common.chargeObjectEqual(this,this.ruleForm,'get','MeterStatusEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
      }
    },
}
</script>
<style lang="scss">
.MeterStatusEdit{
    height: 100%;
    width: 60%;
    margin: 10px auto;
    .backfillSubmitForm{
        margin: 0px;
        width: 100%;
        .el-form-item{
            width:100%;
            .el-form-item__content{
                width: calc(100% - 100px);
            }
        }
        .el-input--mini /deep/ .el-input__inner,.el-select{
                width: 100%;
        }
    }
}
</style>

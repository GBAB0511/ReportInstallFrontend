
<template>
    <div class="AdminRegionEdit">
         <div class="backfillSubmitForm">
            <el-form class="AdminRegionEditForm" ref="AdminRegionEditForm" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">
                <el-form-item label="上级区域：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.superiorArea" placeholder="上级区域" clearable ></el-input>
                </el-form-item>
                <el-form-item label="区域编号：" prop="areaNo">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.areaNo" placeholder="区域编号" maxlength="50" clearable  ></el-input>
                </el-form-item>
                <el-form-item label="区域名称：" prop="areaName">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.areaName" placeholder="区域名称" maxlength="50" clearable ></el-input>
                </el-form-item>
                <el-form-item label="排序号：" prop="sortNo">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.sortNo" placeholder="排序号"  maxlength="6" clearable ></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="ruleForm.status"  placeholder="请选择状态">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="备注：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.desc" type="textarea" :rows="5" placeholder="备注" clearable  ></el-input>
                </el-form-item> -->
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"AdminRegionEdit",
    data(){
        return{
            ruleForm:{
                areaNo:'',
                areaName:'',
                sortNo:'',
                status:'',
            },
            formData:{
                areaNo:'',
                areaName:'',
                sortNo:'',
                status:'',
            },
            rules: {
                areaNo: [
                { required: true, message: '请输入区域编号', trigger: 'blur' }
                ],
                areaName: [
                { required: true, message: '请输入区域名称', trigger: 'blur' }
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
        this.$refs.AdminRegionEditForm.resetFields();
      },
      submitForm(formName,type,id) {
        let _this = this;
        let params = {};
        this.ruleForm.companyNo = id;
        this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
        this.$refs[formName].validate((valid) => {
          if (valid) {
             if(type === '添加'){
               
               params = {
                  "busicode": "BankInterfaceConfigAdd",
                  "data": this.ruleForm
              }
             }else{
               params = {
                  "busicode": "BankInterfaceConfigUpdate",
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
                if(type === '添加') {
                  _this.$parent.getTreeDatas(); 
                }
              })
              
          } else {
            return false;
          }
        });
      },
      handleClose() {
        this.common.chargeObjectEqual(this,this.ruleForm,'get','AdminRegionEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
      }
    },
}
</script>
<style lang="scss">
 @import "../../../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
.AdminRegionEdit{
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


<template>
    <div class="WaterMeterFactoryEdit">
      <el-form class="formBill-One" ref="WaterMeterFactoryEditForm" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">
        <el-form-item label="供应商名称：" prop="factoryName">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.factoryName" maxlength="50" clearable
                      placeholder="请输入供应商名称">
            </el-input>
          </el-form-item>

          <el-form-item label="供应商全称：" prop="factoryFullName">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.factoryFullName" maxlength="200" clearable
                      placeholder="请输入供应商全称">
            </el-input>
          </el-form-item>

          <el-form-item label="供应商地址：" prop="factoryAddr">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.factoryAddr" maxlength="200" clearable
                      placeholder="请输入供应商地址">
            </el-input>
          </el-form-item>

          <el-form-item label="联系人：" prop="linkMan">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.linkMan" maxlength="50" clearable
                      placeholder="请输入联系人">
            </el-input>
          </el-form-item>

          <el-form-item label="固定电话：" prop="linkTel">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.linkTel" maxlength="50" clearable
                      placeholder="请输入固定电话">
            </el-input>
          </el-form-item>
          <el-form-item label="排序号：" prop="sortNo">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.sortNo" maxlength="6" clearable
                      placeholder="请输入排序号">
            </el-input>
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
</template>
<script>
export default {
    name:"WaterMeterFactoryEdit",
    data(){
        return{
          ruleForm:{
          },
          formData:{
            id:"",
            factoryName:'',
            factoryFullName:'',
            factoryAddr:'',
            linkMan:'',
            linkTel:"",
            status:'',
            tenantId:'',
            sortNo:'',
            comments:'',
          },
          rules: {
                factoryName: [
                    { required: true, message: '请输入供应商名称', trigger: 'blur' }
                ],
                factoryFullName: [
                    { required: true, message: '请输入供应商全称', trigger: 'blur' }
                ],
                factoryAddr: [
                    { required: true, message: '请输入供应商地址', trigger: 'blur' }
                ],
                linkMan: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                linkTel: [
                    { required: true, message: '请输入固定电话', trigger: 'blur' }
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
        this.$refs.WaterMeterFactoryEditForm.resetFields();
      },
      submitForm(formName,type) {
        let _this = this;
        let params = {};
        this.$refs[formName].validate((valid) => {
          if (valid) {
             if(type === 'MeterFactoryAdd'){
               params = {
                  "busicode": "MeterFactoryAdd",
                  "data": this.ruleForm
              }
             }else{
                this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
               params = {
                  "busicode": "MeterFactoryUpdate",
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
        this.common.chargeObjectEqual(this,this.ruleForm,'get','WaterMeterFactoryEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
      }
    },
}
</script>
<style lang="scss">
.WaterMeterFactoryEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin:  0 auto;
}
</style>


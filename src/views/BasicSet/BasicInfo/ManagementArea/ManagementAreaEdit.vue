
<template>
    <div>
         <div>
            <el-form class="formBill-One" ref="ManagementAreaEdit" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">
                <el-form-item label="区域名称：" prop="areaName">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.areaName" placeholder="区域名称" maxlength="50" clearable ></el-input>
                </el-form-item>
                <el-form-item label="排序号：" prop="sortNo">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.sortNo" placeholder="排序号"  maxlength="6" clearable ></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="ruleForm.status"  placeholder="请选择状态">
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="停用" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="areaComments">
                    <el-input v-model="ruleForm.areaComments" type="textarea" :rows="3" show-word-limit maxlength="150" placeholder="备注" clearable  ></el-input>
                </el-form-item>
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
                areaName:'',
                sortNo:'',
                status:'',
                areaComments:"",
            },
            formData:{
                manageAreaId:"",
                areaName:'',
                sortNo:'',
                status:'',
                areaComments:"",
            },
            rules: {
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
        this.$refs.ManagementAreaEdit.resetFields();
      },
      submitForm(formName,type,id) {
        let _this = this;
        let params = {};
        
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
             if(type === '添加'){
               this.ruleForm.parentId = id;
               params = {
                  "busicode": "ManageAreaAdd",
                  "data": this.ruleForm
              }
             }else{
                this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
                params = {
                  "busicode": "ManageAreaUpdate",
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
                if(type === '添加') {
                  _this.$parent.getTreeDatas(); 
                }else{
                    _this.$parent.init();
                }
                
                _this.$parent.closeDialog();   
                
              })
              
          } else {
            return false;
          }
        });
      },
      handleClose() {
        this.common.chargeObjectEqual(this,this.ruleForm,'get','ManagementAreaEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
      }
    },
}
</script>


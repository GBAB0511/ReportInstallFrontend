
<template>
    <div class="OldAreaEdit">
        <el-form class="formBill-One" ref="OldAreaEdit" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">
            <el-form-item label="上级节点：" prop="upperAreaName">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="upperAreaName" disabled maxlength="50" clearable ></el-input>
            </el-form-item>
            <el-form-item label="区域编号：" prop="areaNo">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.areaNo" placeholder="区域编号：" maxlength="50" clearable ></el-input>
            </el-form-item>
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
            <el-form-item label="区域描述：" prop="areaComments">
                <el-input v-model="ruleForm.areaComments" type="textarea" :rows="3" show-word-limit maxlength="150" placeholder="备注" clearable  ></el-input>
            </el-form-item>
        </el-form>
        <!-- <div class="block">
          <span>asd</span>
        </div> -->
    </div>
</template>
<script>
export default {
    name:"OldAreaEdit", 
    data(){
      const validatorSortNo = (rule, value, callback) => {
        if (!value || value == '') {
          return callback();
        }
        if(!/^[0-9]*$/.test(value)) {
          return callback(new Error('排序号必须为数字'))
        }
        return callback()
        
      };
        return{
          upperAreaName:'',
            ruleForm:{
                areaNo:"",
                areaName:"",
                groupCode:"",
                tenantId:"",
                sortNo:"",
                status:1,
                areaComments:"",
                parentId:"",
            },
            formData:{
                id:"",
                areaNo:"",
                areaName:"",
                groupCode:"",
                tenantId:"",
                sortNo:"",
                status:1,
                areaComments:"",
                parentId:"",
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
                    { validator: validatorSortNo, trigger: 'blur'}
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
        this.$refs.OldAreaEdit.resetFields();
      },
      submitForm(formName,type,parentId) {
        let _this = this;
        let params = {};
        this.$refs[formName].validate((valid) => {
            if(valid){
              if(type==='add' || type==='addnext'){
                delete this.ruleForm.upperAreaName
               params = {
                  "busicode": "OldAreaAdd",
                  "data": this.ruleForm
              }
             }else{
              this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
                params = {
                  "busicode": "OldAreaUpdate",
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
                if(type === 'add' || type==='addnext') {
                  _this.$parent.getOldAreaTree(); 
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
        this.common.chargeObjectEqual(this,this.ruleForm,'get','OldAreaEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
        this.upperAreaName = val.upperAreaName
      }
    },
}
</script>
<style lang="scss" scoped>
.OldAreaEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin:  0 auto;
  .formBill-One{
      line-height: 43px;
      .el-form-item__label {
        // line-height: 43px;
        vertical-align: top;
      }
  }
  /deep/{
    .desc{
      .el-form-item__content{
        font-size:15px;
        margin-left:100px;
        color:rgb(96, 98, 102)
      }
    }
  }
}
</style>



<template>
    <div class="BankInfoEdit">
      <div class="BankInfo-index">
   <el-form class="formBill-One" ref="BankInfoEditForm" :rules="rules" :inline="true" size="mini" :model="formData" label-width="100px">
            <el-form-item label="银行名称：" prop="bankName"> 
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                v-model="formData.bankName" maxlength="50" clearable
                @input="e => input = inputMe(e)"
                placeholder="请输入银行名称">
                </el-input>
            </el-form-item>
            <el-form-item label="银行行号：" prop="bankNumber">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                v-model="formData.bankNumber" maxlength="50" clearable
                @input="e => input = inputMe(e)"
                placeholder="请输入银行行号">
                </el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="linkMan">   
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                v-model="formData.linkMan" maxlength="50" clearable
                @input="e => input = inputMe(e)"
                placeholder="请输入联系人">
                </el-input>
            </el-form-item>
            <el-form-item label="固定电话：" prop="linkTel">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                v-model="formData.linkTel" maxlength="50" clearable
                @input="e => input = inputMe(e)"
                placeholder="请输入固定电话">
                </el-input>
            </el-form-item>
            <el-form-item label="排序号：" prop="sortNo">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="formData.sortNo" placeholder="排序号"  maxlength="6" clearable ></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-select v-model="formData.status"  placeholder="请选择状态">
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="停用" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="comments">
                <el-input v-model="formData.comments" type="textarea" :rows="3" show-word-limit maxlength="150" placeholder="备注" clearable  ></el-input>
            </el-form-item>
            
        </el-form>
      </div>
    </div>
</template>
<script>
export default {
    name:"BankInfoEdit",
    data(){
        return{
            formData:{
                id:"",
                bankNo:'',
                bankName:'',
                bankNumber:'',
                linkMan:'',
                linkTel:'',
                tenantId:'',
                sortNo:'',
                status:1,
                parentId:'',
                comments:"",
            },
            rules: {
                bankName: [
                { required: true, message: '请输入银行名称', trigger: 'blur' }
                ],
                bankNumber: [
                { required: true, message: '请输入银行行号', trigger: 'blur' }
                ],
                // linkMan: [
                // { required: true, message: '请输入联系人', trigger: 'blur' }
                // ],
                // linkTel: [
                // { required: true, message: '请输入固定电话', trigger: 'blur' }
                // ],
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
    mounted(){
        this.init();
    },
    methods: {
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      init(){
        if(this.$parent.formType==='BankAdd'){
            this.formData={
                id:'',
                bankNo:this.$parent.bankNo,
                bankName:'',
                bankNumber:'',
                linkMan:'',
                linkTel:'',
                tenantId:'',
                sortNo:'',
                status:1,
                comments:"",
                isLeaf:'',
                parentId:this.$parent.parentId,
            }
        }else{
            let params = {
                "busicode": "BankQuery",
                "data": {
                  id:this.$parent.id,
                },
            }
            this.$api.fetch({
              params: params,//参数
            }).then(res => {
              this.formData=res;
            })
        }
      },
      //保存按钮
      resetForm() {
        this.$refs.BankInfoEditForm.resetFields();
      },
      submitForm(formName,type,parentId) {
        let _this = this;
        let params = {};
        this.$refs[formName].validate((valid) => {
          if (valid) {
             if(type === 'BankAdd'){
               this.formData.parentId = parentId;
               params = {
                  "busicode": "BankAdd",
                  "data": this.formData
              }
             }else{
                //  this.formData = this.common.handleData(this.formData,this.formData);
                 params = {
                  "busicode": "BankUpdate",
                  "data": this.formData
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
                if(type === 'BankAdd') {
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
        this.common.chargeObjectEqual(this,this.formData,'get','BankInfoEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.formData = val;
      }
    },
}
</script>

<style lang="scss">
.BankInfoEdit {
  width: 100%;
  height: 100%;
  .BankInfo-index{
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


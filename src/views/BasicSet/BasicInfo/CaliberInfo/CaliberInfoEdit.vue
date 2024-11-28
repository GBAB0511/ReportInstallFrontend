
<template>
    <div class="CaliberInfoEdit">
         <div class="backfillSubmitForm">
            <el-form class="CaliberInfoEditForm" ref="CaliberInfoEditForm" :rules="rules" :inline="true" size="mini" :model="ruleForm" label-width="100px">
                
                <el-form-item label="口径名称：" prop="boreName">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.boreName" placeholder="请输入口径名称" maxlength="50" clearable  ></el-input>
                </el-form-item>
                <el-form-item label="口径值：" prop="boreValue">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.boreValue" placeholder="请输入口径数量" maxlength="6" clearable ></el-input>
                </el-form-item>
                <el-form-item label="最大流量：" prop="maxFlux">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.maxFlux" placeholder="请输入最大流量" maxlength="10" clearable  ></el-input>
                </el-form-item>
                <el-form-item label="表码位数：" prop="meterPlaces">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.meterPlaces" placeholder="请输入表码位数" maxlength="6" clearable ></el-input>
                </el-form-item>
                <el-form-item label="旧表换表周期：" prop="oldChangeCycle">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.oldChangeCycle" placeholder="请输入旧表换表周期" maxlength="6" clearable ></el-input>
                </el-form-item>
                <el-form-item label="新表换表周期：" prop="newChangeCycle">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="ruleForm.newChangeCycle" placeholder="请输入新表换表周期" maxlength="6" clearable ></el-input>
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
    name:"CaliberInfoEdit",
    data(){
        return{
            ruleForm:{
                
            },
            formData:{
                boreId:"",
                boreName:"",
                boreValue:"",
                maxFlux:'',
                meterPlaces:'',
                oldChangeCycle:'',
                newChangeCycle:'',
                comments:"",
                status:"",
                sortNo:""
            },
            rules: {
                boreName: [
                    { required: true, message: '请输入口径名称', trigger: 'blur' }
                ],
                boreValue: [
                    { required: true, message: '请输入口径数量', trigger: 'blur' },
                    { type: 'number', message: '口径数量必须为数字值'}
                ],
                maxFlux: [
                    { required: true, message: '请输入最大流量', trigger: 'blur' },
                    { type: 'number', message: '最大流量必须为数字值'}
                ],
                meterPlaces: [
                    { required: true, message: '请输入表码位数', trigger: 'blur' },
                    { type: 'number', message: '表码位数必须为数字值'}
                ],
                oldChangeCycle: [
                    { required: true, message: '请输入旧表换表周期', trigger: 'blur' },
                    { type: 'number', message: '旧表换表周期必须为数字值'}
                ],
                newChangeCycle: [
                    { required: true, message: '请输入新表换表周期', trigger: 'blur' },
                    { type: 'number', message: '新表换表周期必须为数字值'}
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
        this.$refs.CaliberInfoEditForm.resetFields();
      },
      submitForm(formName,type) {
        let _this = this;
        let params = {};
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
              
             if(type === '添加'){
               
               params = {
                  "busicode": "MeterBoreAdd",
                  "data": this.ruleForm
              }
             }else{
                this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
               params = {
                  "busicode": "MeterBoreUpdate",
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
        this.common.chargeObjectEqual(this,this.ruleForm,'get','CaliberInfoEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.ruleForm = val;
      }
    },
}
</script>
<style lang="scss">
.CaliberInfoEdit{
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


<template>
    <div class="HolidaySetEdit">
         <div class="backfillSubmitForm">
            <el-form ref="HolidaySetEditForm" class="formBill-One" :rules="rules" :inline="true" size="mini" :model="formData" label-width="100px">
                <el-form-item label="假期名称：" prop="vacationName">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                        @input="e => input = inputMe(e)"
                        v-model="formData.vacationName" clearable
                        placeholder="请输入假期名称"
                        maxlength="50">
                    </el-input>
                </el-form-item>
                <el-form-item label="假期时间：">
                    <el-date-picker
                    maxlength="50"
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="假期说明：">
                    <el-input   
                        v-model="formData.vacationComments" show-word-limit maxlength="50" clearable
                        type="textarea"
                        placeholder="请输入假期说明">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"HolidaySetEdit",
    data(){
        return{
            time:[],
            formData:{
                id:"",
                vacationName:'',
                vacationBeginDate:'',
                vacationEndDate:'',
                vacationComments:'',
            },
            rules: {
                vacationName: [
                    { required: true, message: '请输入假期名称', trigger: 'blur' }
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
        this.$refs.HolidaySetEditForm.resetFields();
      },
      submitForm(type) {
        let _this = this;
        let params = {};
             // 点击日期清除按钮time值为null需要处理
        if(this.time===null){
            this.time = ['','']
        }
        this.formData.vacationBeginDate = this.time[0];
        this.formData.vacationEndDate = this.time[1];
        if(type === 'ConfigVacationAdd'){
        params = {
            "busicode": "ConfigVacationAdd",
            "data": this.formData
        }
        }else{
        params = {
            "busicode": "ConfigVacationUpdate",
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
        _this.$parent.init();
        _this.$parent.closeDialog();   
        });
      },
      handleClose() {
        this.common.chargeObjectEqual(this,this.formData,'get','holidaySetEdit',this.$parent.closeDialog);
      },
      editData(val){
        this.formData = val;
        this.$set(this.time,0,this.formData.vacationBeginDate);
        this.$set(this.time,1,this.formData.vacationEndDate);
      }
    },
}
</script>
<style lang="scss">
.HolidaySetEdit {
  width: 100%;
  height: 100%;
  .backfillSubmitForm{    
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



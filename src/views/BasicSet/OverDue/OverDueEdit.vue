

<template>
  <div class="OverDueEdit">

    <div class="main-content">
    
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="formBill-One" label-width="80px" :inline="true">
    
      <el-form-item label="单据类型:" class="select-f1">
        <el-select v-model="ruleForm.receiptNo" placeholder="请选择" @change="changeReceipt">
              <el-option v-for="item in billData" :key="item.processCode"  :label="item.receiptName" :value="item.processCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总天数：" prop="hour">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   @input="e => input = inputMe(e)" v-model="ruleForm.hour" @keyup.native="handleInput()" clearable placeholder="请输入总时长(天数)"></el-input>
      </el-form-item>


    </el-form>
   </div>
  </div>
</template>

<script>

export default {
  name: "OverDueEdit",
  data() {
    return {
      databaseData: [],
      ruleForm: {
        receiptNo:"",
        receiptName:"",
        hour:0
      },
      billData:{},
       rules: {
        receiptNo: [
          { required: true, message: '请输入单据类型',trigger:'blur,change'},
        ],
         hour: [
          { required: true, message: '请输入天数',trigger:'blur,change'},
        ],
      },
    }
  },
  mounted() {
    this.getReceiptType()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    formatDate(row) {
        return row.billDate.slice(0,10)
    },
    changeReceipt(receiptNo) {
      this.billData.forEach((item)=>{
        if(receiptNo == item.processCode)
          this.ruleForm.receiptName = item.receiptName
      }) 
        
    },
    handleInput() {
      if(this.ruleForm.hour.length === 1)
        this.ruleForm.hour = this.ruleForm.hour.replace(/[^1-9]/g, '')         
        else {
            this.ruleForm.hour = this.ruleForm.hour.replace(/[^\.\d]/g, '')
      this.ruleForm.hour = this.ruleForm.hour.replace('.', '')
        }
      

  },
  getReceiptType() {
      let _this = this
      let params = {
          "busicode": "ReceiptSelect",
          "data": {}
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
          _this.billData = res;        
      })
  },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //保存按钮
    
    submitForm(type) {
      let _this = this;
       this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
            return false;
        }else{
          let params = {};
            if(type === 'ProcessTimeAdd'){
              params = {
                "busicode": "ProcessTimeAdd",
                "data": this.ruleForm
              }
            }else{
              params = {
                "busicode": "ProcessTimeUpdate",
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
        }
      })
    },

    editData(val) {
      this.ruleForm = val;
    },
  },

}
</script>
<style lang="scss">
.OverDueEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin: 0 auto;

   .main-content {
    border:none !important;

    width: calc(100% - 20px);
    height: calc(100% - 20px);
    .kl-table {
      height: calc(100% - 41px);
    }
  }
  .select-f1{
 .el-input__icon{
   line-height: 0;
 }
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-form-item__error{
    position:static !important;
  }
}
</style>

<template>
  <div class="BillManagementEdit">

    <el-form class="formBill-Three" :disabled="status===1" :rules="rules"
      size="mini" :inline="true" :model="formData" label-width="130px" ref="ruleForm" >
      <el-form-item label="票据类型：" prop="invoicetype">
        <el-select clearable v-model="formData.invoicetype" placeholder="票据类型">
          <el-option v-for="item in invoiceType" :key="item.invoiceNo" :label="item.invoiceName" :value="item.invoiceNo"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="票据来源：" prop="invoicesource">
        <el-select clearable v-model="formData.invoicesource" placeholder="票据来源">
          <el-option v-for="(item,index) in dictionaryData.BBS" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="营业区域：" prop="businessabode">
        <!--el-select clearable v-model="formData.businessabode" placeholder="营业所">
          <el-option v-for="item in businessAbodeOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
        </el-select-->
        <el-cascader ref="cascader" clearable v-model="formData.businessabode" :options="businessAbodeOptions" :show-all-levels="false" :props="props">
            </el-cascader>
      </el-form-item>

      <el-form-item label="发票代码：" prop="invoicecode">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.invoicecode" placeholder="" ></el-input>
      </el-form-item>

      <el-form-item label="开始号码：" prop="invoicebeginnum">
        <el-input v-model="formData.invoicebeginnum" type="text" placeholder="" @input="changeNum"
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
      </el-form-item>

      <el-form-item label="结束号码：" prop="invoiceendnum">
        <el-input v-model="formData.invoiceendnum" type="text" placeholder="" @input="changeNum"
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
      </el-form-item>

      <el-form-item label="年份：" prop="regmonth">
        <el-date-picker
          v-model="formData.regmonth"
          type="month"
          value-format="yyyyMM"
          format="yyyy-MM"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="发票数量：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="number" :disabled="true" v-model="formData.invoiceamount" placeholder=""></el-input>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
export default {
  name: "BillManagementEdit",
  props: ["rowData", "indexAddDate","status"],
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      businessAbodeOptions: [],
      dictionaryData: [],
      invoiceType:[],
      formData: {
        invoicetype:"",
        invoicesource:"",
        businessabode:"",
        invoicecode:"",
        invoicebeginnum:"",
        invoiceendnum:"",
        regmonth:"",
      },
      invoiceType: {},
      rules:{
        invoicetype:[{ required:true, message:"票据类型不能为空", trigger: 'change'}],
        invoicesource:[{ required:true, message:"票据来源不能为空", trigger: 'change'}],
        businessabode:[{ required:true, message:"营业所不能为空", trigger: 'change'}],
        invoicecode:[{ required:true, message:"发票代码不能为空", trigger: 'blur'}],
        invoicebeginnum:[{ required:true, message:"开始号码不能为空", trigger: 'blur'}],
        invoiceendnum:[{ required:true, message:"结束号码不能为空", trigger: 'blur'}],
        regmonth:[{ required:true, message:"年份不能为空", trigger: 'blur'}],
      },
    };
  },
  mounted() {
    if (this.indexAddDate == "detail") {
      this.init();
    }else{
      this.formData.regmonth=this.getNowFormatDate();
    }
    this.selectBAbodeOptions();
    this.getDictionary();
    this.getInvoiceType();
  },
  methods: {
    init() {
      let params = {
        busicode: "FnInvoiceRegQuery",
        data: {
          id: this.rowData
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res;
        });
    },
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month;
        return currentdate;
    },
    changeNum(){
      if(this.formData.invoiceendnum && this.formData.invoicebeginnum){
        let val=Number(this.formData.invoiceendnum)-Number(this.formData.invoicebeginnum)+1;
        this.formData.invoiceamount=val>0?val:0;
      }
    },
    //营业所
    selectBAbodeOptions() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
          _this.businessAbodeOptions = data.children;
        });
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BBS,BBT"
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取发票类型
    getInvoiceType() {
      var _this = this
      var params = {
        "busicode": "InvoiceTypeList",
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.invoiceType= res
      })
    },
    save(){
      let _this = this;
      if (_this.formData.invoiceendnum - _this.formData.invoicebeginnum +1 <=0) {
        this.$notify({
          title: "警告",
          message: "发票数量必须大于0",
          type: "error"
        });
        return false;
      }
      let validateFlag = false
      _this.$refs.ruleForm.validate(valid=>{
        if(!valid){
          validateFlag=true;
        }
      });
      if(validateFlag){
        this.$notify({
          title: "警告",
          message: "请完善必填信息",
          type: "error"
        });
        return;
      }
      if (_this.$parent.indexAddDate === "detail") {
        _this.updateInvoice();
      } else {
        _this.saveInvoice();
      }
    },
    updateInvoice() {
      let _this = this;
      this.formData.businessabode=this.common.handleTreeData(this.formData.businessabode)
      let params = {
        busicode: "FnInvoiceRegUpdate",
        data: _this.formData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success"
          });
          this.$parent.closeDialog();
        });
    },
    saveInvoice() {
      let _this = this;
      this.formData.businessabode=this.common.handleTreeData(this.formData.businessabode)
      let params = {
        busicode: "FnInvoiceRegAdd",
        data: _this.formData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          this.$parent.closeDialog();
        });
    },
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.BillManagementEdit {
  padding: 10px;
  .formBill-Three{
    .el-form-item__label{
      width: 130px;
      line-height: 45px;
    }
    .el-form-item__content{
      line-height: 40px;
    }
  }

}
</style>


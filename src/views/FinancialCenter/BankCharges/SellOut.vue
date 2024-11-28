
<template>
  <div class="SellOut">
    <el-form ref="form" class="formBill-One" :inline="true" :model="formData" :rules="rules" label-width="100px">
     <!--
      <el-form-item label="营业区域：" prop="businessArea">
        <el-select v-model="formData.businessArea" clearable size="mini">
          <el-option
            v-for="item in businessAbodeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      -->
      <el-form-item label="营业区域：">
        <el-cascader ref="cascader" clearable v-model="formData.businessArea" @change="getBusinessArea"
              :options="businessAreaData"
              :show-all-levels="false"
              :props="props">
        </el-cascader>
      </el-form-item>
      <el-form-item label="收费类型：" prop="chargingType">
        <el-select clearable v-model="formData.chargingType" placeholder>
          <el-option
            v-for="(item,index) in chargingTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="出盘银行：" prop="outBank">
        <el-cascader
          v-model="formData.outBank"
          :options="openABankOptions"
          :show-all-levels="false"
          :props="props"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="开始账期：" prop="beginPeriod">
        <el-date-picker v-model="formData.beginPeriod"  type="month"  format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"  ></el-date-picker>
      </el-form-item>

      <el-form-item label="截止账期：" prop="endPeriod">
        <el-date-picker v-model="formData.endPeriod"  type="month" format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"  ></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SellOut",
  data() {
    return {
      formData: {
        businessArea: "", //"营业区域",
        chargingType: "1", // 收费类型,
        outBank: "", //"出盘银行",
        beginPeriod: "1990-01", //开始周期,
        endPeriod: this.common.date("month","") // 结束周期
      },
      businessAreaData: [], //营业区域
      chargingTypeOptions: [
        {
          name: "代扣",
          id: "1"
        },
        {
          name: "托收",
          id: "2"
        }
      ],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false
      },
      openABankOptions: [],
      businessAbodeOptions: [], //营业所下拉框
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules:{
        businessAbode: [{ required: true, message: '营业所不能为空', trigger: 'change' }],
        chargingType: [{ required: true, message: '收费类型不能为空', trigger: 'change' }],
        outBank: [{ required: true, message: '出盘银行不能为空', trigger: 'change' }],
        beginPeriod: [{ required: true, message: '开始账期不能为空', trigger: 'change' }],
        endPeriod: [{ required: true, message: '截止账期不能为空', trigger: 'change' }],
      }
    };
  },
  mounted() {
    this.init();
    //营业所接口
    this.selectBAreaOptions();
    //开户银行接口
    this.selectOABankOptions();
  },
  methods: {
    init() {},
    //营业所
    selectBAbodeOptions() {
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.businessAbodeOptions = res;
          if(this.businessAbodeOptions!=null && this.businessAbodeOptions.length>0) {
            this.formData.businessAbode = this.businessAbodeOptions[0].id
          }
        });
    },
    //营业区域
    getBusinessArea(val) {
      val = this.common.handleTreeData(val);
      return val;
    },
    selectBAreaOptions(id) {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res);
          let data = this.getArr(res);
          // console.log(data);
          _this.businessAreaData = data.children;
          // console.log(this.businessAreaData);
        });
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map((i) => {
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
    getBankArr(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children;
        } else {
          this.getArr(data[i].children);
        }
      }
      return data;
    },
    // 开户银行
    selectOABankOptions() {
      let _this = this;
      let params = {
        busicode: "BankTree",
        data: {}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          let data = _this.getBankArr(res.children);
          _this.openABankOptions = data;
        });
    },
    //   导出
    exportExcel() { 
      this.$refs.form.validate(valid => {
        if(valid) {
           if(this.formData.beginPeriod>this.formData.endPeriod){
            this.$message({
                message: "开始账期不能大于结束账期",
                type: "warning"
              });
            return;
          }
          let params = {
              "busicode": "FnBankOut",
              "data": this.formData,
              token: sessionStorage.getItem('token'),
              sysType: '002'
            }
          window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
        }
      })
    }
     
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        console.log(val)
      }
    }
  }
};
</script>
<style lang="scss">
.SellOut {
  width: 60%;
  height: 100%;
  margin: 0 auto;
  .el-form--inline .el-form-item__content{
      vertical-align: middle !important;
  }
  .formBill-One .el-form-item .el-form-item__content{
      line-height: 30px;
  }
  .el-input__icon{
    line-height: 30px !important;
  }
}
</style>
<template>
  <div class="UnsettledAccountsStatistics">
    <div>
      <el-form class="formBill" :inline="true" :model="formData" label-width="130px">
            <el-form-item label="日期：">
          <el-date-picker
      
            v-model="tableQuery.chargeDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            @change="search"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btnBox">
          <el-button
            size="mini"
            class="searchBtn"
            @click="search"
            icon="el-icon-search"
          ></el-button>
        </el-form-item>
      <el-form-item >
        <div class="depositeTxt">
            <span>
               <el-tag effect="dark"> {{formData.depositeDate}}</el-tag> 
            </span>
            
              <!-- <span class="depositeStatus" :style="{color:statusColor,fontSize:statusSize}">   -->
              <span class="depositeStatus">
                <el-tag effect="dark" :type="statusType">  {{formData.statusName}}</el-tag>          
              </span>
          </div>
           </el-form-item>
      
           <legend class="legendColumn">收费信息</legend> 
  
        <el-form-item label="收费总额：" class="disable-item">
          <el-input
             v-model="chargeInfoMap['chargeAmount']"
            placeholder=""
            disabled
            class="read-only"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
        
        <el-form-item :label="item.name?item.name+'：':''"  v-for="item in payWayList" :key="item.id"  class="disable-item">
          <el-input
            v-model="chargeInfoMap[item.value]"
            placeholder="" 
            disabled
            class="read-only"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
      </el-form>
 

          <el-form class="formBill" :inline="true" :model="formData" label-width="130px">
           <legend class="legendColumn">开票信息</legend> 
        <el-form-item label="专用发票："  class="disable-item"> 
          <el-input
            v-model="openInvoiceInfoMap['ZYFP']"
            placeholder="" 
            disabled
            class="read-only"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="item.invoiceName?item.invoiceName+'：':''"  v-for="item in invoiceTypeList" :key="item.id"  class="disable-item">
          <el-input
            v-model="openInvoiceInfoMap[item.invoiceNo]"
            placeholder=""
            disabled
            class="read-only"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
        
      </el-form>
       <el-form class="formBill"  :inline="true" :model="formData" label-width="130px" :rules="rules" ref="ruleForm">
           <legend class="legendColumn">缴存信息</legend> 
   
        <el-form-item label="上日未缴：" prop="yesterdayNotDeposite" class="disable-item">
          <el-input
            v-model="formData.yesterdayNotDeposite"
            placeholder=""
            :disabled="!formData.yesterdayNotDepositeFlag"
            class="read-only"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
        <el-form-item label="本日缴存：" prop="todayDeposite">
          <el-input
            v-model="formData.todayDeposite"
            placeholder=""
            @input="calculation"
            :disabled="formData.checkStatus == 1"
            :class="[{ 'read-only': !(tableQuery.chargeDate == nowDate) }]"
          ></el-input>
        </el-form-item>
        <el-form-item label="进账银行：" prop="incomeBank" v-if="showBankCheck" class="incomeBank">
          <el-select
            v-model="formData.incomeBank"
            placeholder="请选择进账银行"
            :disabled="formData.checkStatus == 1"
            :class="[{ 'read-only': !(tableQuery.chargeDate == nowDate) }]"
          >
            <el-option
              v-for="(item, index) in incomeBankList"
              :key="index"
              :label="item.bankName + ' ' + item.bankAccount"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="未缴金额：" prop="todayNotDeposite" class="disable-item">
          <el-input
            v-model="formData.todayNotDeposite"
            placeholder=""
            disabled
            class="read-only"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>

      </el-form>

    </div>
           <bankCheck
        v-show="false"
        ref="bankCheck"
        @getIncomeBankListData="getIncomeBankListData"
      ></bankCheck>
  </div>
</template>
<script>
import bankCheck from "@/components/bankCheck"; //上传附件
export default {
  name: "UnsettledAccountsStatistics",
components:{
  bankCheck
},
  data() {
    return {
      dda:[],
      crumbsData: {  //面包屑
        titleList: [
          { title: '工作台', path: '/UnsettledAccountsStatistics' },
          { title: '现金缴存', method: () => { window.histroy.back() } }
        ],

      },
        showBankCheck:false,
        incomeBankList:[],
      tableQuery: {
        chargeDate: '',
      },
      invoiceTypeList:[],
      openInvoiceInfoMap:{},
      chargeInfoMap:{},
      payWayList:[],
      // 表单数据
      formData: {
        todayDeposite: '',
        // bankStatement:'',
        // billPicture:''
        incomeBank:'',
      },
      //缴存状态颜色
      statusType: 'info',
      // 当天日期
      nowDate: '',

      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      UnsettledAccountsStatisticsVisible: false,  //综合查询的显示和隐藏
      UnsettledAccountsStatisticsName: '现金缴存',
      rules:{
        incomeBank: [
          { required: true, message: '请选择进账银行', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    var time = new Date()
    // this.tableQuery.chargeDate = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDay() >= 10 ? time.getDay() : '0' + time.getDay()}`
    this.tableQuery.chargeDate = this.common.date('')
    // 存储当天日期
    this.nowDate = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()}`
  this.getCashDepositConfig();
 this.getDictionary();
 this.getBaseInvoiceTypeList();
   this.init();

  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },

        // 计算结存、找零
    calculation(num) {
     if(isNaN(Number(num)) || num < 0){
        this.$message({
          type: "error",
          message: "请输入正确的金额"
        });
        return;
     }
        this.formData.todayNotDeposite =(Number(this.chargeInfoMap['1']||0) + Number(this.formData.yesterdayNotDeposite) -  Number(num) ).toFixed(2);
    },

        // 获取数据字典数据
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "BPG" // 收费方式
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          this.payWayList = res.BPG;
        });
    },

        getBaseInvoiceTypeList() {
      var _this = this;
      var params = {
        busicode: "BaseInvoiceTypeList",
        data: {} 
      };
      this.$api
        .fetch({
          params: params, //参数
           
        })
        .then(res => {
          this.invoiceTypeList = res.list;
        });
    },
    

        getIncomeBankListData(data){
      this.incomeBankList = data;
    },
    getCashDepositConfig(){//获取支付宝电子屏二维码配置
            let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'Cash_deposit_in_bank',
        }
      };
      this.$api
        .fetch({
          params,
           
        })
        .then(res => {

       if(res.list.length&&res.list[0].configValue === "01"){//为02则启用
         this.showBankCheck = true;
       }
        })
    },


    // 表单初始化
    init() {
      let _this = this;
      let params = {
        busicode: "BillDepoQuery",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数
        
      }).then(res => {
        if (res != '') {
          _this.formData = res
          let openInvoiceInfoMap = {};
          let chargeInfoMap = {};
          res.openInvoiceInfo.forEach(i=>openInvoiceInfoMap[i.k] = i.v);
         _this.openInvoiceInfoMap = openInvoiceInfoMap;
         res.chargeInfo.forEach(i=>chargeInfoMap[i.k] = i.v);
         _this.chargeInfoMap = chargeInfoMap;
          if (_this.formData.status == '1') {
            _this.formData.statusName = '已缴存'
            _this.statusType = 'success'
          } else if (_this.formData.status == '0') {
            _this.formData.statusName = '未缴存'
            _this.statusType = 'info'
          }
        } else {
          _this.formData = {}
        }
      })
    },
    // 保存按钮（由父页面调用）
    submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (Number(this.formData.todayDeposite.toString().match(/^\d+(?:\.\d{0,2})?/)) == 0) {
               this.$confirm('当日缴存金额为0, 是否继续保存?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    let _this = this;
                    let params = {
                      busicode: "BillDepoAdd",
                      data: {
                        id: this.formData.id,
                        depositeDate: this.formData.depositeDate,
                        cash:this.chargeInfoMap['1']||0, //1现金
                        todayNotDeposite:this.formData.todayNotDeposite,
                        yesterdayNotDeposite: this.formData.yesterdayNotDeposite,
                        chargeMoney: this.formData.chargeMoney,
                        todayDeposite: Number(this.formData.todayDeposite.toString().match(/^\d+(?:\.\d{0,2})?/)),
                        incomeBank:this.formData.incomeBank
                      }
                    };
                    this.$api.fetch({
                      params: params,//参数
                    }).then(res => {
                      _this.$message({
                        type: "success",
                        message: "保存成功!"
                      });
                      _this.init();
                    })
                }).catch(() => {        
                });
            } else{
              let _this = this;
              let params = {
                busicode: "BillDepoAdd",
                data: {
                  id: this.formData.id,
                  depositeDate: this.formData.depositeDate,
                  cash:this.chargeInfoMap['1']||0, //1现金
                  todayNotDeposite:this.formData.todayNotDeposite,
                  yesterdayNotDeposite: this.formData.yesterdayNotDeposite,
                  chargeMoney: this.formData.chargeMoney,
                  todayDeposite: Number(this.formData.todayDeposite.toString().match(/^\d+(?:\.\d{0,2})?/)),
                  incomeBank:this.formData.incomeBank
                }
              };
              this.$api.fetch({
                params: params,//参数
              }).then(res => {
                _this.$message({
                  type: "success",
                  message: "保存成功!"
                });
                _this.init();
              })
            }
          } else {
            return false;
          }
        });
       
    // if( params.data.incomeBank == ""){
    //  _this.$message({
    //       type: "error",
    //       message: "请选择进账银行"
    //     });
    // return;

    // }
      //   if(this.showBankCheck){
      //   let formData =  this.$refs.bankCheck.getFormData();
      //   if(formData){
      //  params.data.incomeBank = formData.incomeBank;
      // //   params.data.bankStatement = formData.bankStatement;
      // //  params.data.billPicture = formData.billPicture;
      //   }else{
      //     return;
      //   }

      // }
    },




    search() {  //查询
      this.init()
    },
    closeDialog() { //关闭会话
      this.UnsettledAccountsStatisticsVisible = false;
      this.backfillVisible = false;
      this.init()
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.UnsettledAccountsStatistics {
  width: 100%;
  margin-top: 5px;
  .depositeTxt{
    font-size: 14px;
   width: 200px;
  }
  .btnBox  {
    width: auto;
  }
//  .incomeBank{
//    width: 360px;
//  }
     .formBill .incomeBank.el-form-item .el-input {
    height: inherit;
  }
  .incomeBank {
    width: 50%;
    .el-form-item__content {
      width: 75% !important;
      .el-input__inner {
        width: 100% !important;
      }
    }
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .el-form--inline .el-form-item:first-of-type {
    margin-right: 0px;
  }
}
</style>

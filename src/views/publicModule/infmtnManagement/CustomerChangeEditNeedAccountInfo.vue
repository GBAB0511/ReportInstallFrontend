<template>
  <div class="accountInfo">

      <legend class="legendColumn">账户信息</legend>
      <el-form
          :model="formData"
          class="formBill-Two"
          size="mini"
          :rules="rules"
          ref="ruleForm"
        >
        <el-form-item label="账户编号：" :class="{'disable-item':disableAccountNo}">
          <el-select
            v-if="!disableAccountNo"
            v-model="formData.accountNo"
            filterable
            allow-create
            @change='chooseCert'
            default-first-option>
            <el-option
              v-for="item in accountlist"
              :key="item.id"
              :label="item.accountNo"
              :value="item.accountNo">
            </el-option>
          </el-select>
          <span  v-else>{{formData.accountNo}}</span>
        </el-form-item>
        <el-form-item label="缴费方式："  prop="payWay" :class="{'disable-item':editType==0}">
          <span v-if="editType==0">{{formData.payWayName}}</span>
          <!-- <el-select v-if="editType==0" clearable v-model="formData.payWay" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <el-select v-else clearable v-model="formData.payWay"  placeholder="" @change="paywayChange">
            <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型："  prop="accountType" :class="{'disable-item':editType==0}">

          <span v-if="editType==0">{{formData.accountTypeName}}</span>
          <!-- <el-select v-if="editType==0" clearable v-model="formData.accountType" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.ACT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <el-select v-else clearable v-model="formData.accountType"  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.ACT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="开户银行：" prop="openAccountBank" :class="{'disable-item':editType==0}">

          <span v-if="editType==0">{{formData.openAccountBankName}}</span>
          <!-- <el-cascader
            v-if="editType==0"
            disabled
            v-model="formData.openAccountBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader> -->
          <el-cascader
            v-else
            @change="bankChange"
            v-model="formData.openAccountBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="开户名称：" prop="openAccountName" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.openAccountName}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.openAccountName" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item v-if="showFormItem" label="银行账户：" prop="bankAccount" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.bankAccount}}</span>
          <el-input v-else v-model="formData.bankAccount" placeholder="" clearable @input="validateNum1()"></el-input>
        </el-form-item>

        <el-form-item v-if="showFormItem" label="托号：" prop="entrustNo" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.entrustNo}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.entrustNo" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="银行协议号：" prop="entrustContract" :class="{'disable-item':editType==0}">
          <span v-if="editType==0">{{formData.entrustContract}}</span>
          <template v-else>
          <el-tooltip :disabled="entrustContractAddrToolShow" effect="dark" :content="formData.entrustContract" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="entrustContract" v-model="formData.entrustContract" placeholder clearable></el-input>
          </el-tooltip>
        </template>
        </el-form-item>

        <el-form-item label="投递方式：" prop="deliverWay" :class="{'disable-item':editType==0}">

          <span v-if="editType==0">{{formData.deliverWayName}}</span>
          <!-- <el-select v-if="editType==0" clearable v-model="formData.deliverWay" disabled placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.SDW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <el-select v-else clearable v-model="formData.deliverWay"  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.SDW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投递地址："  prop="deliverAddr" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.deliverAddr}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.deliverAddr" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="电子邮件："  prop="emailAddr" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.emailAddr}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.emailAddr" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="账户余额："  prop="accountBalance" class="disable-item">
          <span>{{formData.accountBalance}}</span>
          <!--el-input v-else v-model="formData.accountBalance" placeholder="" clearable></el-input-->
        </el-form-item>
        <el-form-item v-if="showFormItem" label="开户行号：" style="width: calc(46% + 10px)" prop="bankSn" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.bankSn}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankSn" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="出盘编号：" prop="outNo" :class="{'disable-item': editType==0}">
          <el-select v-model="formData.outNo" placeholder="" v-if="editType!==0">
            <el-option label="新用户编号" :value="1"></el-option>
            <el-option label="旧用户编号" :value="2"></el-option>
          </el-select>
          <span v-else>{{formData.outNo === 2 ? '旧用户编号' : '新用户编号'}}</span>
        </el-form-item>
      </el-form>

  </div>
</template>
<script>
export default {
  name: "accountInfo",
  props: ['editType','wayOpen', 'disableAccountNo'],
  components: {
  },
  data() {
    return {
      ctmNo:'',
      showFormItem:false,
      curWaterCode:'',
      //账户下拉框数据
      accountlist:[],
      dictionaryData:[],
      //开户行
      bankTreeData:[],
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      formData:{
          // 账户信息
          accountNo: "新开户",//账户编号
          payWay: '3',//缴费方式
          payWayName: '',//缴费方式
          accountType: "1",//账户类型
          accountTypeName: "私户",//账户类型
          openAccountBank: "",//开户银行
          openAccountBankName: "",//开户银行
          openAccountName: "",//开户名称
          bankAccount: "",//银行账户
          entrustNo: "",//托号
          entrustContract: "",//托收合同
          deliverWay: "1",//投递方式
          deliverWayName: "",//投递方式
          deliverAddr: "",//投递地址
          emailAddr: "",//电子邮件
          accountBalance: 0,
          bankSn:"",//开户行号
          outNo:1,//出盘编号
        },
      changeData:{
        // 账户信息
        accountNo: "新开户",//账户编号
        payWay: '3',//缴费方式
        payWayName: '',//缴费方式
        accountType: "1",//账户类型
        accountTypeName: "私户",//账户类型
        openAccountBank: "",//开户银行
        openAccountBankName: "",//开户银行
        openAccountName: "",//开户名称
        bankAccount: "",//银行账户
        entrustNo: "",//托号
        entrustContract: "",//托收合同
        deliverWay: "1",//投递方式
        deliverWayName: "",//投递方式
        deliverAddr: "",//投递地址
        emailAddr: "",//电子邮件
        accountBalance: 0,
        bankSn:"",//开户行号
        outNo:1,//出盘编号
        // 开票信息
        invoiceTitle: "", //单位名称
        invoiceTax: "", //纳税人识别号
        invoiceAddr: "", //联系地址
        invoiceLink: "", //座机号码
        invoiceBank: "", //开户银行
        invoiceAccount: "" //银行账户
      },
      rules:{
          //accountNo:[{ required:true, message:"账户编号不能为空", trigger: 'blur'}],
          payWay:[{ required:true, message:"缴费方式不能为空", trigger: 'change'}],
          accountType:[{ required:true, message:"账户类型不能为空", trigger: 'change'}],
          //deliverWay:[{ required:true, message:"投递方式不能为空", trigger: 'change'}],
          //deliverAddr:[{ required:true, message:"投递地址不能为空", trigger: 'blur'}],
          //emailAddr:[{ required:true, message:"电子邮件不能为空", trigger: 'blur'}],
          outNo: [{ required: true, message: '出盘编号不能为空', trigger: 'change' }]
        },

        entrustContractAddrToolShow: true

    }
  },
  mounted() {
    if(this.editType!=0){
      this.dictionaryOptions()
      this.bankTreeDataOptions()
    }
   this.curWaterCode = localStorage.getItem('companyNo')
    console.log(this.curWaterCode)
    if(this.curWaterCode !== '01'){
      this.showFormItem = true
    } else {
      this.showFormItem = false
    }
  },

  watch: {
    'formData.entrustContract': {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if(!/^[0-9a-zA-Z\\-]*$/.test(val) && val !== '') {
          if(oldVal === '' || oldVal === null || oldVal === undefined) {
            this.formData.entrustContract = ''
          } else {
            this.formData.entrustContract = oldVal
          }
        }
        const entrustContract = document.querySelector('.entrustContract .el-input__inner')
        entrustContract && (this.entrustContractAddrToolShow = (entrustContract.scrollWidth <= entrustContract.offsetWidth) || !(val && val.length > 0))
      }
    },
  },
methods: {
  // 数据初始化
    init(val) {
      if (val) {
        this.formData = val
        // this.getAccountDetail()
        // this.getAccountList(val.id)
        this.validateNum1();

        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate();
        })
      }
    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.formData)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.bankAccount = data.bankAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'bankAccount', data.bankAccount)
    },
    paywayChange(val){
      if(val === '1') {
        this.$set(this.rules,"openAccountBank",[{ required:true, message:"代扣时，开户银行不能为空", trigger: 'change'}]);
        this.$set(this.rules,"openAccountName",[{ required:true, message:"代扣时，开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"bankAccount",[{ required:true, message:"代扣时，银行账户不能为空", trigger: 'blur'}]);
      } else {
        const names = ['openAccountBank', 'openAccountName', 'bankAccount']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      if(val==='2'){
        this.$set(this.rules,"openAccountBank",[{ required:true, message:"代扣时，开户银行不能为空", trigger: 'change'}]);
        this.$set(this.rules,"openAccountName",[{ required:true, message:"代扣时，开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"bankAccount",[{ required:true, message:"代扣时，银行账户不能为空", trigger: 'blur'}]);

        this.$set(this.rules,"entrustNo",[{ required:true, message:"托收时，托号不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"entrustContract",[{ required:true, message:"托收时，托号合同号不能为空", trigger: 'blur'}]);
      }else{
        const names = ['entrustNo', 'entrustContract']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate();
      })
    },
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPW,ACT,SDW"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData",res);
      }).catch(res => {
        this.$set(this, "dictionaryData",[]);
      });
    },
    getAccountList(val){
      if(val){
         this.ctmNo = val
      }

         let params = {
        "busicode": "QueryAccountByCtm",
        "data": {
          'ctmNo':this.ctmNo,
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.accountlist = res;
      })
    },
    //树结构数据处理
    getArr(data) {
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
    //开户银行
    bankTreeDataOptions() {
      let params = { busicode: "BankTree", data: "" };
      this.$api.fetch({ params }).then(res => {
        let data = this.getArr(res)
        this.bankTreeData = data.children;
      }).catch(res => {
        this.bankTreeData = [];
      });
    },
    bankChange(val) {
        //console.log(val)
    },
    getAccountDetail(val){
        let _this = this
        let params = {
          "busicode": "AccountInfoQuery",
          "data": {
            'accountNo':val,
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          console.log(res);
          this.getAccountList(this.ctmNo);
          _this.formData = res;
          _this.changeData = res;
          if (_this.wayOpen !== 'changeMangement') {
            _this.$parent.$parent.getAccoInvoData(_this.formData,'getValue')
          }else {
            console.log(_this.changeData);
            eventBus.$emit('getAccoInvoData', _this.changeData, 'getValue')
          }

        })
    },
    //点击确定
    chooseCert(val){
      if (val=='' || val=='新开户') {
        this.formData={  accountNo: "新开户", }
        if (this.wayOpen !== 'changeMangement') {
          this.$parent.$parent.getAccoInvoData(this.formData,'clear')
        }else{
          eventBus.$emit('getAccoInvoData', this.formData, 'clear')
        }
      }else{
        this.getAccountDetail(this.formData.accountNo);

      }
    },
  },
}
</script>
<style lang="scss" scoped>
.accountInfo {
  height: 100%;
 /deep/ .formBill-Two {
    .el-form-item{
    width: 47%;
    float: none;
    margin-bottom: 15px !important;
    }
    .el-form-item__label{
      // width: 150px;
      line-height: 28px;
    }
  }
}
</style>

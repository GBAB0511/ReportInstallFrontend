<template>
  <div class="QuickCustomerChangeEdit ">

    <el-form
      size="mini"
      class="formBill"
      :inline="true"
      :disabled="NotDisabled"
      :model="formData"
      label-width="130px"
      :rules="rules"
      ref="ruleFormV"
      @submit.native.prevent
    >

      <el-form-item label="用户编号：" v-if="searchBtnShow" class="width450" style="margin-top: 20px">
        <el-input
          class="read-only"
          v-model="searchUserNum"
          placeholder="请输入户号"
          @change="initUserNo"
          clearable
          @input="e => input = inputMe(e)"
        >
          <el-button
            slot="append"
            class="searchBtn scanning-btn"
            @click="initUserNo"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form-item>

          <!-- 客户信息 -->
          <custInfo ref="custInfo" :editType="custEditType" :wayOpen="wayOpen" :quickConfig="quickConfig" :disableCerNo="true" :disableChangeCertNo="true"></custInfo>

          <accountInfo ref="accountInfo" :editType="accountEditType" :quickConfig="quickConfig" :wayOpen="wayOpen" :disableAccountNo="true"></accountInfo>
          <invoiceInfo ref="invoiceInfo" :editType="invoiceEditType" :quickConfig="quickConfig" :wayOpen="wayOpen"></invoiceInfo>

          <!-- 用户信息 -->
          <userInfo ref="userInfo" :addWay="NotDisabled" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>
          <!-- 抄表信息
          <meterReadInfo ref="meterReadInfo" :editType="meterEditType" :quickConfig="quickConfig" :wayOpen="wayOpen"></meterReadInfo>-->
          <!-- 水表信息 @change="areaHandleChange" -->
          <waterMInfo ref="waterMInfo" :addWay="NotDisabled" :editType="waterMEditType" :wayOpen="wayOpen"></waterMInfo>

        <!-- <el-tab-pane label="用水类型变更" v-if="checkQuickConfig('useWaterType')">
          <span slot="label">
            <i class="el-icon-user"></i> 用水类型变更
          </span>
          <el-form-item label="用水类型：" prop="userInfo.useWaterType"
           :rules="[{ required:true, message:'用水类型变更必填项未完善', trigger: 'change'}]">
            <el-cascader
              v-model="formData.userInfo.useWaterType"
              :options="waterTypeData"
              :show-all-levels="false"
              :props="props"
            ></el-cascader>
          </el-form-item>

        </el-tab-pane>



        <el-tab-pane label="优惠用水变更">
          <span slot="label">
            <i class="el-icon-user"></i> 优惠用水变更
          </span>
          <priceInfo ref="priceInfo" :editType="priceEditType" :quickConfig="quickConfig" :wayOpen="wayOpen"></priceInfo>
        </el-tab-pane> -->

    </el-form>
  </div>
</template>
<script>
import custInfo from "@/views/CustomerCenter/quickCustomChange/QuickCustomerChangeEditNeedCustInfo";//
import userInfo from "@/views/CustomerCenter/quickCustomChange/quickUserInfo";//用户配置
//import meterReadInfo from "@/views/CustomerCenter/quickCustomChange/quickMeterReadInfo";
import waterMInfo from "@/views/CustomerCenter/quickCustomChange/quickWaterMInfo";
import accountInfo from "@/views/CustomerCenter/quickCustomChange/quickAccountInfo";
import invoiceInfo from "@/views/CustomerCenter/quickCustomChange/quickInvoiceInfo";
// import priceInfo from "@/views/CustomerCenter/quickCustomChange/quickPriceInfo";

export default {
  name: "QuickCustomerChangeEdit",
  props: ["idCuster", "billStute", 'fuzzyQuery', 'NotDisabled'],
  components: {
    custInfo,
    userInfo,
    //meterReadInfo,
    waterMInfo,
    accountInfo,
    invoiceInfo,
    // priceInfo,
  },
  data() {
    return {
          msWaterInfo: {
          // 用户-水表信息
            // meterNo: "", //水表编号：
          // setupMeterAddr: "", //装表地址：
          // setupMeterLocation: "", //装表位置：
          // setupMeterLocationName: "", //装表位置：
          // virtualDesignFormulas: "", //虚拟计算公式：
          // meterUse: "1", //水表用途：
          // meterUseName: "", //水表用途：
          // useWaterObject: "1", //用水对象：
          // useWaterObjectName: "", //用水对象：
          // virtualDesignFormulas: "", //虚拟计算公式：
          meterPatternName: "", //水表型式
          protocolName: "",
          valvueControlName: "",
          // setupMeterDate: "", //装表日期：
          changeMeterDate: "", //换表日期：
          splitMeterDate: "", //拆表日期：
          splitMeterWay: "", //拆表类型：
          splitMeterWayName: "", //拆表类型：
          fatherMeterNo: "", //总表编号：
          // meterType: "", //水表类型：
          mastarNo:"",
          // meterTypeName: "",//水表类型：
           // 用户-水表信息
          factoryNo: "", //水表表身号：
          meterBore: "", //水表口径：
          meterFactoryName: "", //水表厂家：
          meterFactory: "", //水表厂家：
          transmittalModel:"",//传输方式
          meterModelName: "", //水表型号：
          meterModel: "",
          transCommFee: "", //远传通讯费：
          commOperatorName: "", //通讯运营商：
          commFeeStart: "", //通讯费开始日期：
          commFeeEnd: "", //通讯费结束日期：
          meterBoreName: "",//水表口径：
          transmittalModelName: "",//传输方式
          meterSensorName: "",//传感器
          meterSensor: "",////传感器
          maxValue: "",//"满码值"
          valveControl: "",//是否阀控,
          protocol:"",//"下行规约"
          meterPattern: "",//水表型式
          shelfLife: "",//"使用期限"
        },
      receiptType: "QUICK_USER_CHANGE",
      residueData:[{"id":1,"name":"是"},{"id":2,"name":"否"}],
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      searchBtnShow: true,
      searchUserNum: "",

      wayOpen: "quickChangeMangement",
      //是否可以填写
      custEditType: 1,
      accountEditType: 1,
      invoiceEditType: 1,
      userInfoEditType: 1,
      meterEditType: 1,
      waterMEditType: 1,
      priceEditType: 1,

      //表单数据
      formData: {
        userInfo: {
          useWaterType: []
        },
        userChangeInfo: {}
      },
      // 价格模块数据
      priceData: {},
      //客户信息
      custData: {},
      //单据信息
      billData: {},
      //用户信息
      userData: {},
      //抄表信息
      meterReadData: {},
      //水表信息
      waterMData: {},
      //账户信息
      accountData: {},
      //开票信息
      invoiceData: {},
      //用水类型
      waterTypeData: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      approveFlag: 0,
      // NotDisabled: false, //是否可编辑
      rules:{

      },
      ruleFormV:{
        userInfo:{
          //useWaterType:[{ required:true, message:"用水类型变更必填项未完善", trigger: 'change'}],
        }
      },
      accountlist: [],
      userNo:"",
      quickConfig:[],
    };
  },
  mounted() {
    this.waterTypeDataOption();
    this.getclientAddrConfig();
    this.initQuickConfig();
    if (this.idCuster && this.idCuster.id && this.idCuster.id!="") {
      this.searchBtnShow = false;
      this.custEditType = 0
      this.accountEditType=  0
      this.invoiceEditType=  0
      this.userInfoEditType=  0
      this.meterEditType=  0
      this.waterMEditType=  0
      this.priceEditType=  0
      this.init();

    } else {

      this.searchBtnShow = true;



      if (this.idCuster && this.idCuster.userNo) {
        this.searchUserNum = this.idCuster.userNo;
        this.initUserNo();
      }
    }

    eventBus.$on('getAccoInvoData', (formData, type) => {
      this.getAccoInvoData(formData, type)
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    initQuickConfig() {
      let _this =this
      let params = {
        busicode: "UserChangeQuickConfigQuery",
        data: {}
      };
      this.$api
        .fetch({ params })
        .then(res => {
        //   _this.quickConfig = res
        res.forEach(item => {
          if(item.isUse == 1){
            _this.quickConfig.push(item.code);
          }
        })
      })
        .catch(res => {});
    },
    init() {
      let _this =this
      let params = {
        busicode: "QuickChangeUserQuery",
        data: { id: this.idCuster.id }
      };
      this.$api
        .fetch({ params })
        .then(res => {
          this.formData = res;
          this.searchUserNum = res.userNo;
          this.getFormData(res);
          //单据信息
          this.getBillData(res);

          let userWaterType = this.getFathersById(res.userInfo.useWaterType,JSON.parse(JSON.stringify(this.waterTypeData)),'id');
          this.formData.userInfo.useWaterType=userWaterType;
          tthis.$nextTick(() => {
            this.$refs.custInfo.adminAreaDataByFullName(res.ctmInfo.clientAddr)
            this.$refs.userInfo.$refs.dynamicForm.adminAreaDataByFullName(this.formData.userInfo.clientContractAddr)
          });
          _this.userNo = res.userNo;

        })
        .catch(res => {});
    },
    checkQuickConfig(val) {
      let config = 0
      if(this.quickConfig!=null && this.quickConfig.length> 0) {
          this.quickConfig.forEach(item=> {
              if(item.value.indexOf(val)!=-1) {
                  config = 1
              }
          })
      }else
        return false
      if(config == 1)
        return true
      else
        return false
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.userChangeInfo.billNo, //单据编号
        billDate: res.userChangeInfo.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    getCustData(res) {
      // 客户信息
      this.custData = {
        ctmNo: res.ctmInfo.ctmNo, //客户编号：
        ctmName: res.ctmInfo.ctmName, //客户名称：
        certNo: res.ctmInfo.certNo, //客户身份证号：
        certType: res.ctmInfo.certType, //证件类型：
        certTypeName: res.ctmInfo.certTypeName, //证件类型：
        ctmAddr: res.ctmInfo.ctmAddr, //客户地址：
        clientAddr: res.ctmInfo.clientAddr,
        clientAddrDetail: res.ctmInfo.clientAddrDetail,
        ctmType: res.ctmInfo.ctmType, //客户类型：
        ctmTypeName: res.ctmInfo.ctmTypeName, //客户类型：
        creditLevel: res.ctmInfo.creditLevel, //信用等级：
        creditLevelName: res.ctmInfo.creditLevelName, //信用等级：
        linkMan: res.ctmInfo.linkMan, //联系人：
        linkTel: res.ctmInfo.linkTel, //固定电话：
        mobile: res.ctmInfo.mobile, //手机号码：
        faxNumber: res.ctmInfo.faxNumber,
        id:res.ctmInfo.id
      };
    },
    getUserData(res) {
      // 用户信息
      let nodeId=res.userInfo.adminArea
      let cascaderData =this.$refs.userInfo.adminAreaData
      let msg = this.getCascaderFullValue(cascaderData,nodeId);

      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        statusName: res.userInfo.statusName, //用户状态
        houseCert: res.userInfo.houseCert, //户口簿号
        comments: res.userInfo.comments, //备注
        fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限
        reformFlag: res.userInfo.reformFlag, //户表改造标记
        contractNo: res.userInfo.contractNo, //合同编号
        contractAddr: res.userInfo.contractAddr, //合同地址
        contractDate: res.userInfo.contractDate, //合同日期
        businessAbodeName: res.userInfo.businessAbodeName, //营业所
        businessAbode: res.userInfo.businessAbode, //营业所
        adminAreaName: res.userInfo.adminAreaName, //行政区域
        adminArea: msg, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类F
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类F
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        oldUserNo:res.userInfo.oldUserNo, //旧用户编号
        stopWaterLinkMan:res.userInfo.stopWaterLinkMan, //停水联系人
        stopWaterLinkMobile:res.userInfo.stopWaterLinkMobile, //停水联系手机
        userGroupNo:res.userInfo.userGroupNo,
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
		id: res.userInfo.id,
        clientContractAddr: res.userInfo.clientContractAddr,
        clientContractAddrDetail: res.userInfo.clientContractAddrDetail,
        clientContractAddrId: res.userInfo.clientContractAddrId,
        quotaWater: res.userInfo.quotaWater, // 定额水量
        bankCode: res.userInfo.bankCode, // 子账户银行
        bankSubAccount: res.userInfo.bankSubAccount, // 子账户银行
      };
    },
    getWaterMData(res) {
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        //setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        setupMeterLocationName: res.userInfo.setupMeterLocationName, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途：
        meterUseName: res.userInfo.meterUseName, //水表用途：
        mastarNo: res.userInfo.mastarNo,//主表编号
        useWaterObject: res.userInfo.useWaterObject, //用水对象：
        useWaterObjectName: res.userInfo.useWaterObjectName, //用水对象：
        meterType: res.userInfo.meterType, //水表类型：
        meterTypeName: res.userInfo.meterTypeName, //水表类型：
        setupMeterDate: res.userInfo.setupMeterDate, //装表日期：
        changeMeterDate: res.userInfo.changeMeterDate, //换表日期：
        splitMeterDate: res.userInfo.splitMeterDate, //拆表日期：
        splitMeterWay: res.userInfo.splitMeterWay, //拆表类型：
        splitMeterWayName: res.userInfo.splitMeterWayName, //拆表类型：
        fatherMeterNo: res.userInfo.fatherMeterNo, //总表编号
        meterBjxs: res.userInfo.meterBjxs, // 表井形式
        meterBjxsName: res.userInfo.meterBjxsName, // 表井形式
      };
      let key = "userInfo";
      this.waterMData[key] = valMeter;
    },
    getWMeterData(res) {
      // 水表信息
      let valMeter = {
        meterModel: res.msInfo.meterModel, //水表型号
        factoryNo: res.msInfo.factoryNo,
        meterTypeName: res.msInfo.meterTypeName, //水表类型
        meterBoreName: res.msInfo.meterBoreName, //水表口径
        meterFactoryName: res.msInfo.meterFactoryName, //水表厂家
        meterModelName: res.msInfo.meterModelName, //水表型号
        transCommFee: res.msInfo.transCommFee, //远传通讯费
        commOperatorName: res.msInfo.commOperatorName, //通讯运营商
        commFeeStart: res.msInfo.commFeeStart, //通讯费开始日期
        commFeeEnd: res.msInfo.commFeeEnd, //通讯费结束日期
        id: res.msInfo.id,
        meterPatternName: res.msInfo.meterPatternName, //水表型式
        valveControlName: res.msInfo.valveControlName, //是否阀控
        // transmissionName: res.msInfo.transmissionName,//是否远传
        protocolName: res.msInfo.protocolName, //下行规约
        meterSensorName: res.msInfo.meterSensorName, //水表传感器
        maxValue: res.msInfo.maxValue, //满码值
        shelfLife: res.msInfo.shelfLife //使用期限
      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
    },
    getMeterReadData(res) {
      // 抄表信息
      this.meterReadData = {
        bookNo: res.userInfo.bookNo, //册本号
        sortNo: res.userInfo.sortNo, //排序号
        lastReadingDate: res.userInfo.lastReadingDate, //抄表日
        meterReadingCycle: res.userInfo.meterReadingCycle, //抄表周期
        meterReadingCycleName: res.userInfo.meterReadingCycleName, //抄表周期
        lastReadingNum: res.userInfo.lastReadingNum, //最后抄码
      };
    },
    getAccountData(res) {
      let {
        accountNo, //账户编号
        payWay, //缴费方式
        payWayName, //缴费方式
        accountType, //账户类型
        accountTypeName, //账户类型
        openAccountBank, //开户银行
        openAccountBankName, //开户名称
        openAccountName,
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverWayName, //投递方式
        deliverAddr, //投递地址
        emailAddr, //邮箱地址
        bankSn,//开户行号
        outNo, //出盘编号
        id,
        accountBalance, // 账户余额
      } = res.accountInfo;
      // 账户信息
      this.accountData = {
        accountNo, //账户编号
        payWay, //缴费方式
        payWayName, //缴费方式
        accountType, //账户类型
        accountTypeName, //账户类型
        openAccountBank, //开户银行
        openAccountBankName, //开户名称
        openAccountName,
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverWayName, //投递方式
        deliverAddr, //投递地址
        emailAddr, //邮箱地址
        bankSn,//开户行号
        outNo, //出盘编号
        id,
        accountBalance, // 账户余额
      };
    },
    getInvoiceData(res) {
      // 开票信息
      this.invoiceData = {
        invoiceType: res.accountInfo.invoiceType, //发票类型
        invoiceTypeName: res.accountInfo.invoiceTypeName, //发票类型
        invoiceTitle: res.accountInfo.invoiceTitle, //单位名称
        invoiceTax: res.accountInfo.invoiceTax, //纳税人识别号
        invoiceAddr: res.accountInfo.invoiceAddr, //联系地址
        invoiceLink: res.accountInfo.invoiceLink, //座机号码
        invoiceBank: res.accountInfo.invoiceBank, //开户银行
        invoiceBankName: res.accountInfo.invoiceBankName, //开户银行
        invoiceAccount: res.accountInfo.invoiceAccount, //银行账户
        vatFlagName: res.accountInfo.vatFlagName,
        vatFlag: res.accountInfo.vatFlag,
        mergeInvoicing: res.accountInfo.mergeInvoicing,
        preInvoicing: res.accountInfo.preInvoicing,
      };
    },
    getPriceData(res) {
      // 价格信息
      this.priceData = {
        useWaterTypeName: res.userInfo.useWaterTypeName, //用水类型：
        useWaterType: res.userInfo.userWaterType, //用水类型：
        prefStrategyName: res.userInfo.prefStrategyName, //优惠策略：
        prefStrategyId: res.userInfo.prefStrategyId, //优惠策略id
        prefCertNo: res.userInfo.prefCertNo, //优惠证件号码：
        prefBeginDate: res.userInfo.prefBeginDate, //优惠策略开始日期：
        prefEndDate: res.userInfo.prefEndDate, //优惠策略结束日期：
        ladderPersonNum: res.userInfo.ladderPersonNum, //用水人口：
      };
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
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree"
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res);
          this.$set(this, "waterTypeData", data.children);
        })
        .catch(res => {
          this.$set(this, "waterTypeData", []);
        });
    },

    getFormData(res) {
      // 1 客户编号为空
      if (res.ctmInfo.ctmNo) {
        if (!res.accountInfo.accountNo) {
          this.getaccountCusData(res.ctmInfo.ctmNo);
        }
      }
      this.getWaterMData(res);
      this.getCustData(res);
      this.getUserData(res);
      this.getWMeterData(res);
      this.getMeterReadData(res);
      this.getAccountData(res);
      this.getInvoiceData(res);
      this.getPriceData(res);
      //客户信息
      this.$refs.custInfo.init(this.custData);

      //用户信息
      this.$refs.userInfo.init(this.userData);

      //水表信息
      this.$refs.waterMInfo.init(this.waterMData);

      //抄表信息
      //this.$refs.meterReadInfo.init(this.meterReadData);

      //账户信息
      this.$refs.accountInfo.init(this.accountData);

      //开票信息
      this.$refs.invoiceInfo.init(this.invoiceData);

      //价格信息
      //this.$refs.priceInfo.init(this.priceData);
    },
    //切换客户时
    async getaccountCusData(val) {
      let QuerySameAcPar = {
        busicode: "QuerySameAccount",
        data: { ctmNo: val }
      };
      let a = await this.$api.fetch({ params: QuerySameAcPar });
      let b = {};
      //清空账户下拉框数据
      this.$refs.accountInfo.accountlist = [];

      if (a.length == 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
        this.accountlist=a;
      } else if (a.length < 1) {
        b.accountInfo = {};
        this.getAccountData(b);
        this.getInvoiceData(b);

        this.accountEditType = 1;
        this.invoiceEditType = 1;
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
      } else if (a.length > 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);

        // let c = {
        //   accountNo: "",
        //   openAccountName: "新开账户",
        //   id: "123456"
        // };
        // a.unshift(c);

        this.accountEditType = 1;
        this.invoiceEditType = 1;
        this.$refs.accountInfo.accountlist = a;
        this.accountlist=a;
      }
    },
    // 清空账户、开票数据
    getAccoInvoData(val, type) {
      this.$refs.accountInfo.accountlist=this.accountlist;

      if (type == "clear") {
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        val = {
          // 账户信息
          accountNo: "", //账户编号
          payWay: "3", //缴费方式
          payWayName:"",
          accountType: "1", //账户类型
          accountTypeName:"",
          openAccountBank: "", //开户银行
          openAccountName: "", //开户名称
          bankAccount: "", //银行账户
          entrustNo: "", //托号
          entrustContract: "", //托收合同
          deliverWay: "", //投递方式
          deliverAddr: "", //投递地址
          bankSn:"",//开户行号
          outNo: 1, //出盘编号
          emailAddr: "", //邮箱地址
          // 开票信息
          invoiceType: "1", //发票类型
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "", //银行账户
          vatFlagName:"否",
          vatFlag:"0",
          preInvoicing: 0,
          mergeInvoicing: 1,
        };
        //账户信息
        this.$refs.accountInfo.init(val);
        //开票信息
        this.$refs.invoiceInfo.init(val);
      } else if (type == "getValue") {
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        //账户信息
        this.$refs.accountInfo.init(val);
        //开票信息
        this.$refs.invoiceInfo.init(val);
      }
    },
    initUserNo() {
      //用户编号查询
      let _this = this
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: this.searchUserNum ,
        status: 9,//状态为9查询除销户以外的
      };
      let params = { busicode: "UserSelect", data };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.formData.ctmNo = res.ctmInfo.ctmNo;
          this.formData.userNo = res.userInfo.userNo;
          let userWaterType = this.getFathersById(res.userInfo.useWaterType,JSON.parse(JSON.stringify(this.waterTypeData)),'id');
          _this.formData.userInfo.useWaterType=userWaterType;

          this.getFormData(res);

          this.userNo = res.userInfo.userNo;
          this.$nextTick(() => {
            this.$refs.custInfo.adminAreaDataByFullName(res.ctmInfo.clientAddr)
            this.$refs.userInfo.$refs.dynamicForm.adminAreaDataByFullName(res.userInfo.clientContractAddr)
          });
        })
        .catch(res => {});
    },
    //根据节点id获取全路径
    //节点id
    //匹配数据
    //字段名
    getFathersById (id, data, prop) {
      var arrRes = []
      const rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          const node = data[i]
          if (node[prop] === nodeId) {
            arrRes.unshift(node[prop])
            return true
          } else {
            if (node.children && node.children.length) {
              if (rev(node.children, nodeId)) {
                arrRes.unshift(node[prop])
                return true
              }
            }
          }
        }
        return false
      }
      rev(data, id)
      return arrRes
    },
    //用水类型下拉框值发生改变
    areaHandleChange(value) {
      let length = value.length;
      this.formData.userInfo.adminArea = value[length - 1];
    },
    indexMethod(index) {
      return (
        (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1)
      );
    },
    indexMethod1(index) {
      //获取表格序号
      return ( index + 1 );
    },
    getFormbData() {
          if(this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag =='否'){
               //户表标记判断转换（是/否）  提交表单数据需相应转换数字
                 this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag = 0
           }else if(this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag == '是'){
                 this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag = 1
                   }
       for(var i in this.$refs.waterMInfo.$refs.dynamicForm.editFormData){
         //提交表单-去掉相应水表表单字段
         for(var j in this.msWaterInfo){
           if(i == j){
            delete this.$refs.waterMInfo.$refs.dynamicForm.editFormData[i]
           }
         }
       }
        console.log(this.$refs.waterMInfo.$refs.dynamicForm.editFormData)
      let useWaterType = {
        useWaterType:this.formData.userInfo.useWaterType
      }
      let val = {
        accountInfo: {
          ...this.$refs.accountInfo.formData,
          ...this.$refs.invoiceInfo.formData
        },
        ctmInfo: {
          ...this.$refs.custInfo.formData
        },
        userInfo: {
         ...this.$refs.userInfo.$refs.dynamicForm.editFormData,
         ...this.$refs.waterMInfo.$refs.dynamicForm.editFormData,
          //...this.$refs.meterReadInfo.formData,
          ...this.meterReadData,
          ...this.priceData,
          ...useWaterType
        },
        //person: this.$refs.wPopulation.submit()
      };

      // if (this.billStute == "ChangeUserUpdate") {
      //   val.userChangeInfo = {
      //     ...this.formData.userChangeInfo
      //   };
      // }
      val.userChangeInfo = {
          ...this.formData.userChangeInfo
        };
      // 树结构
      // 行政区域 只需要传最后一个值过去
      val.userInfo.adminArea = this.common.handleTreeData(
        val.userInfo.adminArea
      );

      // 开户银行 数据格式处理
      val.accountInfo.invoiceBank = this.common.handleTreeData(
        val.accountInfo.invoiceBank
      );
      val.accountInfo.openAccountBank = this.common.handleTreeData(
        val.accountInfo.openAccountBank
      );
      // 用水类型 数据格式处理
      val.userInfo.useWaterType = this.common.handleTreeData(
        val.userInfo.useWaterType
      );

      return val;
    },
    closeDialog(){
      this.EditVisible =false;
    },
    //根据node查询路径数组
    getCascaderFullValue(cascader, id) {
      let cascaderFullValue = [id];
      this.getParentId(cascaderFullValue, cascader,cascader, id);

      return cascaderFullValue;

    },
    getParentId(cascaderFullValue, cascader, _cascader, _id) {
      if (!Array.isArray(cascader)) return;

      for (let cascaderItem of cascader) {
        if (!Array.isArray(cascaderItem.children)) continue;

        let index = cascaderItem.children.findIndex(item => item.value === _id);
        if (index >= 0) {
          cascaderFullValue.unshift(cascaderItem.value);

          if(_cascader.findIndex(item => item.value === cascaderItem.value) < 0) //is original item
            this.getParentId(cascaderFullValue, _cascader, _cascader,cascaderItem.value);
        } else {
          this.getParentId(cascaderFullValue, cascaderItem.children, _cascader,_id);
        }
      }
    },
    validateFrom(){
      let val = 1
      this.$refs.waterMInfo.getFormData()
      // this.$refs.waterMInfo.$refs.ruleForm.validate((valid)=>{
      //   if(!valid){
      //     val="用户资料-水表信息必填项未完善"
      //   }
      // })
      //验证抄表必填信息
      // this.$refs.meterReadInfo.$refs.ruleForm.validate((valid)=>{
      //   if(!valid){
      //     val="用户资料-抄表信息必填项未完善"
      //   }
      // })
      //验证客户信息
      this.$refs.custInfo.$refs.ruleForm.validate((valid)=>{
        if(!valid){
          val="客户资料必填项未完善"
        }
      })
      //验证发票信息
      this.$refs.invoiceInfo.$refs.ruleForm.validate((valid)=>{
        if(!valid){
          val="开票资料必填项未完善"
        }
      })
      //账户信息验证
      this.$refs.accountInfo.$refs.ruleForm.validate((valid)=>{
        if(!valid){
          val="账户信息必填项未完善"
        }
      })
      //用户信息验证
      this.$refs.userInfo.getFormData()

      //用水类型验证
      this.$refs.ruleFormV.validate((valid)=>{
        if(!valid){
          val="用水类型变更必填项未完善"
        }
      })
      return val;
    },
    //弹出框
    submit(valType) {
      let params = {
        busicode: this.billStute,
        data: this.getFormbData()
      };

      let message = this.validateFrom();
      if(message!==1){
        this.$notify({
          title: "验证失败",
          message: message,
          type: "error"
        });
        return;
      };

      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success"
        });
        if (valType == "userInfo") {
          this.$parent.$parent.closeDialog1();
        } else if (valType === 'integratedBusiness') {
          this.$parent.$parent.closeDialog();
        } else {
          this.$parent.closeDialog();
        }
        if(this.idCuster && this.idCuster.id!="") {
           this.$refs.userMixtureEdit && this.$refs.userMixtureEdit.submitForm(this.idCuster.id)
           this.$refs.userDiscountEdit && this.$refs.userDiscountEdit.submitForm(this.idCuster.id)
        } else {
          this.$refs.userMixtureEdit && this.$refs.userMixtureEdit.submitForm(res.id);
          this.$refs.userDiscountEdit && this.$refs.userDiscountEdit.submitForm(res.id);
        }
      });
    },
    getclientAddrConfig(){
        let params = {
            busicode: "ConfigList",
            data: {
                searchContent: "STRUCTURED_ADDRESS",
                status: 1
            }
        }
        this.$api
        .fetch({
          params
        })
        .then(res => {
            console.log('res', res)
          if (res.list.length && res.list[0].configValue == "1") {//为1则启用
            this.$refs.custInfo.isShowclientAddr = true;
            this.$refs.userInfo.$refs.dynamicForm.isShowClientContractAddr = true;
            console.log('_this.$refs.custInfo.isShowclientAddr',this.$refs.custInfo.isShowclientAddr)
          }else{
            this.$refs.custInfo.isShowclientAddr = false;
            this.$refs.userInfo.$refs.dynamicForm.isShowClientContractAddr = false;
          }
        })
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
.QuickCustomerChangeEdit {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .tabsBlock {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    margin-top: 10px;
    .el-tabs__header {
      margin: 0 0 5px;
    }
    .el-tabs--border-card {
      border: 1px solid #eaf4ff;
    }
    .el-tabs__content {
      padding: 5px;
      height: calc(100% - 60px);
      .idCard {
        border: 0px;
      }
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .search-btn {
    .el-form-item__content {
      .el-input {
        width: 70% !important;
      }
    }
  }
}
</style>

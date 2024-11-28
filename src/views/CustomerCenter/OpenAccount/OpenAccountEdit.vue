<template>
  <div class="OpenAccountEdit">
    <el-form :model="formData" class="formBill" :inline="true" :disabled="NotDisabled" ref="ruleForm" size="mini" label-width="130px">
      <!-- 单据信息
      <billInfo v-if="billStute=='OpenAccUpdate'" ref="billInfo" :editType="0"></billInfo>-->
      <!-- 客户信息 -->
      <custInfo ref="custInfo" :editType="custEditType" :wayOpen="wayOpen" :disableChangeCertNo="disableChangeCertNo"></custInfo>
      <!-- 账户信息 -->
      <accountInfo ref="accountInfo" :editType="accountEditType" :wayOpen="wayOpen" :disableAccountNo="disableAccountNo"></accountInfo>
      <!-- 开票信息 -->
      <invoiceInfo ref="invoiceInfo" :editType="invoiceEditType" :wayOpen="wayOpen"></invoiceInfo>
      <!-- 用户信息 -->
      <userInfo ref="userInfo" :addWay="NotDisabled" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>
      <!-- 用户-IC卡信息 -->
      <ICCardInfo ref="ICCardInfo" :addWay="NotDisabled" :editType="userInfoEditType" :wayOpen="wayOpen"></ICCardInfo>
      <!-- 抄表信息 -->
      <meterReadInfo ref="meterReadInfo" :editType="meterEditType" :wayOpen="wayOpen"></meterReadInfo>
      <!-- 水表信息 -->
      <waterMInfo ref="waterMInfo" :addWay="NotDisabled" :editType="waterMEditType" :wayOpen="wayOpen"></waterMInfo>
      <!-- 价格信息 -->
      <priceInfo v-if="priceInfoShow" ref="priceInfo" :idCuster="idCuster" :editType="priceEditType" :wayOpen="wayOpen"></priceInfo>
      <!--legend class="legendColumn">上传附件
        <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
      </legend
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>-->
    </el-form>
  </div>
</template>
<script>
import ICCardInfo from "@/views/publicModule/infmtnManagement/ICCardInfo";
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import custInfo from "@/views/publicModule/infmtnManagement/custInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";
import meterReadInfo from "@/views/publicModule/infmtnManagement/meterReadInfo";
import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";
import accountInfo from "@/views/publicModule/infmtnManagement/accountInfo";
import invoiceInfo from "@/views/publicModule/infmtnManagement/invoiceInfo";
import priceInfo from "@/views/publicModule/infmtnManagement/priceInfo";
import uploadFile from '@/components/uploadPic'
export default {
  name: "OpenAccountEdit",
  props: ["idCuster", 'billStuteDetail', 'editData', 'NotDisabled'],
  components: {
    uploadFile,
    billInfo,
    custInfo,
    userInfo,
    meterReadInfo,
    waterMInfo,
    accountInfo,
    invoiceInfo,
    priceInfo,
    ICCardInfo
  },
  data () {
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
        virtualDesignFormulas: "", //虚拟计算公式：
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
        mastarNo: "",
        // meterTypeName: "",//水表类型：
        // 用户-水表信息
        factoryNo: "", //水表表身号：
        meterBore: "", //水表口径：
        meterFactoryName: "", //水表厂家：
        meterFactory: "", //水表厂家：
        transmittalModel: "",//传输方式
        meterModelName: "", //水表型号：
        meterModel: "",
        transCommFee: "", //远传通讯费：
        commOperator: "",
        commOperatorName: "", //通讯运营商：
        commFeeStart: "", //通讯费开始日期：
        commFeeEnd: "", //通讯费结束日期：
        meterBoreName: "",//水表口径：
        transmittalModelName: "",//传输方式
        meterSensorName: "",//传感器
        meterSensor: "",////传感器
        maxValue: "",//"满码值"
        valveControl: "",//是否阀控,
        protocol: "",//"下行规约"
        meterPattern: "",//水表型式
        shelfLife: "",//"使用期限"
      },
      //IC卡信息
      ICCardInfo: {
        miicno: '', // IC卡号
        miljfje: '', // IC子表号
      },
      disableAccountNo: true,
      disableChangeCertNo: false,
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "USER_OPEN",
      //打开功能下
      wayOpen: "OpenAccount",
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
        userOpenInfo: {}
      },
      // 价格模块数据
      priceData: {},
      //单据信息
      billData: {},
      //客户信息
      custData: {},
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
      approveFlag: 0,
      // 价格信息显示与隐藏，用于解决父传子的问题
      priceInfoShow: false,
      rules: {
        //客户信息
        ctmNo: [{ required: true, message: "客户编号不能为空", trigger: 'blur' }],
        ctmName: [{ required: true, message: "客户名称不能为空", trigger: 'blur' }],
        ctmAddr: [{ required: true, message: "客户地址不能为空", trigger: 'blur' }],
        ctmType: [{ required: true, message: "客户类型不能为空", trigger: 'blur' }],
        certType: [{ required: true, message: "证件类型不能为空", trigger: 'blur' }],
        certNo: [{ required: true, message: "客户证件号码不能为空", trigger: 'blur' }],
        //账户信息
        accountNo: [{ required: true, message: "账户编号不能为空", trigger: 'blur' }],
        payWay: [{ required: true, message: "缴费方式不能为空", trigger: 'blur' }],
        accountType: [{ required: true, message: "账户类型不能为空", trigger: 'blur' }],
        deliverWay: [{ required: true, message: "投递方式不能为空", trigger: 'blur' }],
        deliverAddr: [{ required: true, message: "投递地址不能为空", trigger: 'blur' }],
        emailAddr: [{ required: true, message: "投递地址不能为空", trigger: 'blur' }],
        //开票信息
        // invoiceType: [{ required: true, message: "发票类型不能为空", trigger: 'blur' }],
        //用户信息
        adminArea: [{ type: 'array', required: true, message: "行政区域不能为空", trigger: 'blur,change' }],
        businessAbode: [{ required: true, message: "营业所不能为空", trigger: 'blur' }],
        businessArea: [{ required: true, message: "营业区域不能为空", trigger: 'blur' }],
        //抄表信息
        bookNo: [{ required: true, message: "账户编号不能为空", trigger: 'blur' }],
        //水表信息
        userInfo: {
          meterType: [{ required: true, message: "水表类型不能为空", trigger: 'change' }],
          setupMeterAddr: [{ required: true, message: "装表地址不能为空", trigger: 'change' }],
          meterUse: [{ required: true, message: "水表用途不能为空", trigger: 'change' }],
          useWaterObject: [{ required: true, message: "用水对象不能为空", trigger: 'change' }],
        }

      },
    };
  },
  mounted () {
    this.priceInfoShow = true
    this.getclientAddrConfig();
    if (this.idCuster) {
      this.init(this.idCuster);
      eventBus.$emit('receiptId', this.idCuster)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.userOpenInfo.tempId = tempId
      //this.getHtmlData()
      let mixtureEdit = false
      let discountEdit = false

      setTimeout(() => {
        this.$refs.priceInfo.editData({ list: [] }, mixtureEdit, "");
        this.$refs.priceInfo.editDiscountData({ list: [] }, discountEdit, "");
      }, 0);
    }
    eventBus.$on('getCapaMoney', () => { //设置容量水价事件
      this.$refs.userInfo.getCapaMoney(this.$refs.waterMInfo.readFormData.meterBore, this.$refs.priceInfo.formData.useWaterType);
    });
  },
  beforeDestroy () {
    eventBus.$off('getCapaMoney')
  },
  watch: {},
  methods: {
    init () {
      let _this = this
      let mixtureType = 2;//查询混合用水表  1：正式   2：临时
      let discountType = 2;//查询费用折扣表  1：正式  2：临时
      let mixtureEdit = false;
      let discountEdit = false;
      let params = {
        busicode: "OpenAccQuery",
        data: { id: this.idCuster }
      };
      this.$api.fetch({ params })
        .then(res => {
          console.log('openAcc res', res)
          this.formData = res;
          this.$refs.meterReadInfo.changeArea(res.userInfo.businessArea, false);
          this.getFormData(res);

          if (this.billStuteDetail === "" || this.billStuteDetail === 'register') {
            this.disableChangeCertNo = false
            this.setEditType(1);
          } else {
            this.disableChangeCertNo = true
            this.setEditType(0);
            this.approveFlag = 1;
            mixtureEdit = true;
            discountEdit = true;
          }
          if (this.billStuteDetail === "END") {
            mixtureType = 1;
            discountType = 1;
          }
          this.editMixture(mixtureType, mixtureEdit, res.userInfo.userNo);
          this.editDiscount(discountType, discountEdit, res.userInfo.userNo);
          this.$nextTick(() => {
            this.$refs.custInfo.adminAreaDataByFullName(res.ctmInfo.clientAddr)
            this.$refs.userInfo.$refs.dynamicForm.adminAreaDataByFullName(res.userInfo.clientContractAddr)
          });
        });

    },

    editMixture (mixtureType, mixtureEdit, userNo) {   //混合用水数据
      let _this = this
      let params = {
        busicode: "UserMinxtureList",
        data: { id: _this.idCuster, userNo: userNo, type: mixtureType }
      }
      _this.$api.fetch({ params }).then(mixtureData => {
        _this.$refs.priceInfo.editData(mixtureData, mixtureEdit, userNo);
      });
    },
    editDiscount (discountType, discountEdit, userNo) {   //费用折扣数据
      let _this = this
      let params = {
        busicode: "UserDiscountList",
        data: { id: _this.idCuster, userNo: userNo, type: discountType }
      }
      _this.$api.fetch({ params }).then(discountData => {
        _this.$refs.priceInfo.editDiscountData(discountData, discountEdit, userNo);
      });
    },
    setEditType (val) {
      this.custEditType = val
      this.accountEditType = val
      this.invoiceEditType = val
      this.userInfoEditType = val
      this.meterEditType = val
      this.waterMEditType = val
      this.priceEditType = val
    },
    getCustData (res) {
      // 客户信息
      this.custData = {
        ctmNo: res.ctmInfo.ctmNo ? res.ctmInfo.ctmNo : "新开户", //客户编号：
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
        faxNumber: res.ctmInfo.faxNumber,
        mobile: res.ctmInfo.mobile //手机号码：
      };
    },
    getICCardInfo (res) {
      this.ICCardInfo = {
        miicno: res.userInfo.miicno, // IC卡号
        miljfje: res.userInfo.miljfje, // IC子表号
      }
    },
    getUserData (res) {
      // 用户信息
      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        houseCert: res.userInfo.houseCert, //户口簿号
        comments: res.userInfo.comments, //备注
        fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限
        lastReadingNum:res.userInfo.lastReadingNum,
        reformFlag: res.userInfo.reformFlag, //户表改造标记
        contractNo: res.userInfo.contractNo, //合同编号
        contractAddr: res.userInfo.contractAddr, //合同地址
        contractDate: res.userInfo.contractDate, //合同日期
        businessAbodeName: res.userInfo.businessAbodeName, //营业所
        businessAbode: res.userInfo.businessAbode, //营业所
        adminAreaName: res.userInfo.adminAreaName, //行政区域
        adminArea: res.userInfo.adminArea, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        stopWaterLinkMan: res.userInfo.stopWaterLinkMan,
        stopWaterLinkMobile: res.userInfo.stopWaterLinkMobile,
        userGroupNo: res.userInfo.userGroupNo,//用户组编号
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        clientContractAddr: res.userInfo.clientContractAddr,//装表地址
        clientContractAddrDetail: res.userInfo.clientContractAddrDetail,
        clientContractAddrId: res.userInfo.clientContractAddrId,//结构化地址ID（带入集中器）
        quotaWater: res.userInfo.quotaWater,//足额水量
        realEstateNo: res.userInfo.realEstateNo,//不动产单元号
        bankCode: res.userInfo.bankCode, // 子银行账户
        bankSubAccount: res.userInfo.bankSubAccount, // 子银行
        capaMoney: res.userInfo.capaMoney, // 容量水费
        area:res.userInfo.area,//旧行政区域
        areaName:res.userInfo.areaName,
      };
    },

    getWaterMData (res) {
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        //setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：迁移到用户信息 userData
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        setupMeterLocationName: res.userInfo.setupMeterLocationName, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途：
        meterUseName: res.userInfo.meterUseName, //水表用途：
        mastarNo: res.userInfo.mastarNo,//主表编号
        useWaterObject: res.userInfo.useWaterObject, //用水对象：
        useWaterObjectName: res.userInfo.useWaterObjectName, //用水对象：
        meterType: res.msInfo.meterType, //水表类型：
        meterTypeName: res.msInfo.meterTypeName, //水表类型：
        setupMeterDate: res.userInfo.setupMeterDate, //新装日期：
        changeMeterDate: res.userInfo.changeMeterDate, //换表日期：
        splitMeterDate: res.userInfo.splitMeterDate, //拆表日期：
        splitMeterWay: res.userInfo.splitMeterWay, //拆表类型：
        fatherMeterNo: res.userInfo.fatherMeterNo, //总表编号
        concentratorNo: res.userInfo.concentratorNo, //集中器
        meterBjms: res.userInfo.meterBjms, // 表井模式
        meterBjmsName: res.userInfo.meterBjmsName, // 表井模式名称
      };
      let key = "userInfo";
      this.waterMData[key] = valMeter;
    },

    getWMeterData (res) {
      // 水表信息
      let valMeter = {
        meterModel: res.msInfo.meterModel, //水表型号
        meterTypeName: res.msInfo.meterTypeName, //水表类型
        factoryNo: res.msInfo.factoryNo,
        meterBoreName: res.msInfo.meterBoreName, //水表口径
        meterBore: res.msInfo.meterBore, //水表口径
        meterFactoryName: res.msInfo.meterFactoryName, //水表厂家
        meterFactory: res.msInfo.meterFactory, //水表厂家
        transmittalModel: res.msInfo.transmittalModel,//传输方式
        transmittalModelName: res.msInfo.transmittalModelName,//传输方式
        meterModelName: res.msInfo.meterModelName, //水表型号
        transCommFee: res.msInfo.transCommFee, //远传通讯费
        commOperatorName: res.msInfo.commOperatorName, //通讯运营商
        commOperator: res.msInfo.commOperator, //通讯运营商
        commFeeStart: res.msInfo.commFeeStart, //通讯费开始日期
        commFeeEnd: res.msInfo.commFeeEnd, //通讯费结束日期
        meterPatternName: res.msInfo.meterPatternName, //水表型式
        meterPattern: res.msInfo.meterPattern, //水表型式
        protocol: res.msInfo.protocol, //下行规约
        protocolName: res.msInfo.protocolName, //下行规约
        valveControl: res.msInfo.valveControl, //是否阀控
        valveControlName: res.msInfo.valveControlName, //是否阀控
        // transmissionName: res.msInfo.transmissionName,//是否远传
        meterSensorName: res.msInfo.meterSensorName, //水表传感器
        meterSensor: res.msInfo.meterSensor, //水表传感器
        maxValue: res.msInfo.maxValue, //满码值
        shelfLife: res.msInfo.shelfLife, //使用期限
        meterSite: res.userInfo.meterSite,//表位
        meterBjwz: res.userInfo.meterBjwz,//表井位置
        meterBjxs: res.userInfo.meterBjxs,//表井形式
        meterSiteName: res.userInfo.meterSiteName,//表位
        meterBjwzName: res.userInfo.meterBjwzName,//表井位置
        meterBjxsName: res.userInfo.meterBjxsName,//表井形式
      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
    },

    getMeterReadData (res) {
      let {
        bookNo, //册本号
        sortNo, //排序号
        lastReadingDate, //抄表日
        meterReadingCycle, //抄表周期
        meterReadingCycleName, //抄表周期
        lastReadingNum, //最后抄码
        threePeriodAvgWater,//三期均量
        openAccountLastMonth,//最后开账账期
        nextMonthid, // 下次抄表月
      } = res.userInfo;
      // 抄表信息
      this.meterReadData = {
        bookNo, //册本号
        sortNo, //排序号
        lastReadingDate, //抄表日
        meterReadingCycle, //抄表周期
        meterReadingCycleName, //抄表周期
        lastReadingNum, //最后抄码
        threePeriodAvgWater,//三期均量
        openAccountLastMonth,//最后开账账期
        nextMonthid, // 下次抄表月
      };
    },

    getAccountData (res) {
      let {
        accountNo, //账户编号
        payWay, //缴费方式
        payWayName, //缴费方式
        accountType, //账户类型
        accountTypeName, //账户类型
        openAccountBank, //开户银行
        openAccountBankName, //开户银行
        openAccountName, //开户名称
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverWayName, //投递方式
        deliverAddr, //投递地址
        bankSn,//开户行号
        emailAddr, //邮箱地址
        outNo, //出盘编号
      } = res.accountInfo;
      // 账户信息
      this.accountData = {
        accountNo, //账户编号
        payWay, //缴费方式
        payWayName, //缴费方式
        accountType, //账户类型
        accountTypeName, //账户类型
        openAccountBank, //开户银行
        openAccountBankName, //开户银行
        openAccountName, //开户名称
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverWayName, //投递方式
        deliverAddr, //投递地址
        bankSn,//开户行号
        emailAddr, //邮箱地址
        outNo, //出盘编号
      };
    },

    getInvoiceData (res) {
      let {
        invoiceType, //发票类型
        invoiceTypeName, //发票类型
        invoiceTitle, //单位名称
        invoiceTax, //纳税人识别号
        invoiceAddr, //联系地址
        invoiceLink, //座机号码
        invoiceBank, //开户银行
        invoiceBankName, //开户银行
        invoiceAccount, //银行账户
        vatFlag,//增值税标识
        vatFlagName,//增值税标识
        preInvoicing, //预开票标识
        mergeInvoicing, //合并开票
      } = res.accountInfo;
      // 开票信息
      this.invoiceData = {
        invoiceType, //发票类型
        invoiceTypeName, //发票类型
        invoiceTitle, //单位名称
        invoiceTax, //纳税人识别号
        invoiceAddr, //联系地址
        invoiceLink, //座机号码
        invoiceBank, //开户银行
        invoiceBankName, //开户银行
        invoiceAccount, //银行账户
        vatFlag,//增值税标识
        vatFlagName,//增值税标识
        preInvoicing, //预开票标识
        mergeInvoicing, //合并开票
      };
      console.log('invoiceData', this.invoiceData)
    },
    getPriceData (res) {
      let {
        useWaterTypeName, //用水类型：
        useWaterType, //用水类型：
        prefStrategyName, //优惠策略：
        prefStrategyId, //优惠策略id
        prefCertNo, //优惠证件号码：
        prefBeginDate, //优惠策略开始日期：
        prefEndDate, //优惠策略结束日期：
        ladderPersonNum, //用水人口：
      } = res.userInfo;
      // 价格信息
      this.priceData = {
        useWaterTypeName, //用水类型：
        useWaterType, //用水类型：
        prefStrategyName, //优惠策略：
        prefStrategyId, //优惠策略id
        prefCertNo, //优惠证件号码：
        prefBeginDate, //优惠策略开始日期：
        prefEndDate, //优惠策略结束日期：
        ladderPersonNum, //用水人口：
      };
    },

    //根据node查询路径数组
    getCascaderFullValue (cascader, id) {
      let cascaderFullValue = [id];
      this.getParentId(cascaderFullValue, cascader, cascader, id);

      return cascaderFullValue;

    },
    getParentId (cascaderFullValue, cascader, _cascader, _id) {
      if (!Array.isArray(cascader)) return;

      for (let cascaderItem of cascader) {
        if (!Array.isArray(cascaderItem.children)) continue;

        let index = cascaderItem.children.findIndex(item => item.value === _id);
        if (index >= 0) {
          cascaderFullValue.unshift(cascaderItem.value);

          if (_cascader.findIndex(item => item.value === cascaderItem.value) < 0) //is original item
            this.getParentId(cascaderFullValue, _cascader, _cascader, cascaderItem.value);
        } else {
          this.getParentId(cascaderFullValue, cascaderItem.children, _cascader, _id);
        }
      }
    },
    //树结构数据处理
    getArr (data) {
      function abc (arr) {
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
    getFormData (res) {
      // 1 客户编号为空
      if (res.ctmInfo.ctmNo) {
        this.custEditType = 0;
        if (!res.accountInfo.accountNo) {
          this.accountEditType = 0;
          this.invoiceEditType = 0;
          this.getaccountCusData(res.ctmInfo.ctmNo);
        }
      }
      console.log('getFormData', res)
      //this.getBillData(res);
      this.getCustData(res);
      this.getWaterMData(res);
      this.getWMeterData(res);
      this.getUserData(res);
      this.getICCardInfo(res);
      this.getMeterReadData(res);
      this.getAccountData(res);
      this.getInvoiceData(res);
      this.getPriceData(res);
      //客户信息
      this.$refs.custInfo.init(this.custData);

      //用户信息
      this.$refs.userInfo.init(this.userData);

      //用户IC卡信息
      this.$refs.ICCardInfo.init(this.ICCardInfo)

      //水表信息
      this.$refs.waterMInfo.init(this.waterMData);

      //抄表信息
      this.$refs.meterReadInfo.init(this.meterReadData);

      //账户信息
      this.$refs.accountInfo.init(this.accountData);

      //开票信息
      this.$refs.invoiceInfo.init(this.invoiceData);
      setTimeout(() => {
        //价格信息
        this.$refs.priceInfo.init(this.priceData);
      }, 0);

    },
    //切换客户时
    async getaccountCusData (val) {
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
        //账户信息
        this.accountEditType = 0;
        this.invoiceEditType = 0;
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
        let c = { accountNo: "新开户", id: "12345" }
        a.unshift(c)
        this.$refs.accountInfo.accountlist = a;
        this.accountlist = a;
      } else if (a.length < 1) {
        b.accountInfo = {};
        this.getAccountData(b);
        this.getInvoiceData(b);

        this.accountEditType = 0;
        this.invoiceEditType = 0;
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

        let c = {
          accountNo: "新开户",
          openAccountName: "",
          id: "123456"
        };
        a.unshift(c);
        this.accountEditType = 0;
        this.invoiceEditType = 0;
        this.$refs.accountInfo.accountlist = a;
      }
    },
    getDetail () {
      let val = {
        accountInfo: {
          ...this.$refs.accountInfo.formData,
          ...this.$refs.invoiceInfo.formData
        },
        ctmInfo: {
          ...this.$refs.custInfo.formData
        },
        userInfo: {
          //    ...this.$refs.userInfo.$refs.dynamicForm.editFormData,
          //  ...this.$refs.waterMInfo.$refs.dynamicForm.editFormData,
          ...this.$refs.userInfo.formData,
          ...this.$refs.waterMInfo.formData.userInfo,
          ...this.$refs.waterMInfo.formData.msInfo,
          ...this.$refs.meterReadInfo.formData,
          ...this.$refs.priceInfo.formData,
        },
        msInfo: {
          ...this.$refs.waterMInfo.formData.msInfo,
          ...this.$refs.waterMInfo.formData.userInfo,
          ...this.$refs.meterReadInfo.formData,
        },
        userOpenInfo: {
          processState: "",
        }
      };

      return val;
    },
    getFormbData () { //添加客户确认子界面
      for (var i in this.$refs.waterMInfo.$refs.dynamicForm.editFormData) {
        for (var j in this.msWaterInfo) {
          if (i == j) {
            //  this.$refs.waterMInfo.$refs.dynamicForm.editFormData[i] = ''
            delete this.$refs.waterMInfo.$refs.dynamicForm.editFormData[i]
          }
        }
      }
      console.log(this.$refs.userInfo.$refs.dynamicForm.editFormData);
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
          ...this.$refs.ICCardInfo.$refs.dynamicForm.editFormData,
          // ...this.$refs.waterMInfo.formData.userInfo,
          ...this.$refs.meterReadInfo.formData,
          ...this.$refs.priceInfo.formData
        }
      };
      // console.log('00000',val);
      // 树结构
      // 行政区域 只需要传最后一个值过去
      val.userInfo.adminArea = this.common.handleTreeData(val.userInfo.adminArea)
      val.userInfo.businessArea = this.common.handleTreeData(val.userInfo.businessArea)
      //数据格式处理
      var reg = new RegExp(' ', 'g');
      if (val.accountInfo.invoiceAccount.length > 0)
        val.accountInfo.invoiceAccount = val.accountInfo.invoiceAccount.replace(reg, '');

      if (val.accountInfo.bankAccount.length > 0)
        val.accountInfo.bankAccount = val.accountInfo.bankAccount.replace(reg, '');


      // 开户银行 数据格式处理
      val.accountInfo.invoiceBank = this.common.handleTreeData(val.accountInfo.invoiceBank)
      val.accountInfo.openAccountBank = this.common.handleTreeData(val.accountInfo.openAccountBank)
      val.accountInfo.openAccountBank = this.common.handleTreeData(val.accountInfo.openAccountBank)

      val.userInfo.useWaterType = this.common.handleTreeData(val.userInfo.useWaterType)

      if (val.ctmInfo.ctmNo == "新开户") {
        val.ctmInfo.ctmNo = "";
      }
      if (val.accountInfo.accountNo == "新开户") {
        val.accountInfo.accountNo = "";
      }
      // if (this.billStute== "OpenAccUpdate") {
      //   val.userOpenInfo = {
      //     ...this.formData.userOpenInfo
      //   };
      // }
      val.userOpenInfo = {
        ...this.formData.userOpenInfo
      };

      if (this.$refs.priceInfo.$refs.userMixtureEdit != undefined)
        val.userMixtureData = this.$refs.priceInfo.$refs.userMixtureEdit.mixtureData
      if (this.$refs.priceInfo.$refs.userDiscountEdit != undefined)
        val.discountData = this.$refs.priceInfo.$refs.userDiscountEdit.discountData
      return val;
    },
    validateFrom () {
      let val = 1
      // this.$refs.waterMInfo.$refs.ruleForm.validate((valid) => {
      //   if (!valid) {
      //     val = "用户-水表信息必填项未完善"
      //   }
      // })
      return new Promise(async (resolve, reject) => {
        //用户水表信息
        await this.$refs.waterMInfo.getFormData().then(
          function (data) {
          },
          function (reason) {
            reject(reason);
          })
        //验证抄表信息
        await this.$refs.meterReadInfo.$refs.ruleForm.validate().then(
          function (data){
          },
          function (reason){
             reject("用户-抄表信息必填项未完善");
          })

        //验证客户信息
        await this.$refs.custInfo.$refs.ruleForm.validate().then(
          function (data) {
          },
          function (reason) {
            reject("客户信息必填项未完善");
          }
        )
        //验证发票信息
        await this.$refs.invoiceInfo.$refs.ruleForm.validate().then(
          function (data) {
          },
          function (reason) {
            reject("开票信息必填项未完善");
          }
        )
        //账户信息验证
        await this.$refs.accountInfo.$refs.ruleForm.validate().then(
          function (data) { },
          function (reason) {
            reject("账户信息必填项未完善")
          }
        )
        //用户信息验证
        await this.$refs.userInfo.getFormData().then(
          function (data) {
          },
          function (reason) {
            reject(reason);
          })

        //用户价格验证
        await this.$refs.priceInfo.$refs.ruleForm.validate().then(
          function (data) { },
          function (reason) {
            reject("用户-价格信息必填项未完善");
          })
        resolve("成功");
      });

      /*if (Object.keys(this.$refs.waterMInfo.formData.userInfo.meterNo).length === 0) {
        val = "用户-水表信息-水表编号必填项未完善"
      }*/
    },
    // 保存接口
    submit (type) {
      let message = this.validateFrom();
      let _this = this;
      message.then(
        function (data) {
          let params = {
            busicode: type,
            data: this.getFormbData()
          };

          _this.$api.fetch({ params }).then(res => {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
            if (_this.idCuster) {
              // this.$refs.priceInfo.userMixtureSave(this.idCuster);
              // this.$refs.priceInfo.userDiscountSave(this.idCuster);
              _this.$refs.priceInfo.wPopulationSubmit(this.idCuster)
            }
            else {
              // this.$refs.priceInfo.userMixtureSave(res.id);
              // this.$refs.priceInfo.userDiscountSave(res.id);
              _this.$refs.priceInfo.wPopulationSubmit(res.id)
            }
            _this.$parent.closeDialog();
          });
        },
        function (reason) {
          _this.$notify({
            title: "验证失败",
            message: message,
            type: "error"
          });
        }
      )
    },
    // 清空账户、开票数据
    getAccoInvoData (val, type) {
      if (type == "clear") {
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        val = {
          // 账户信息
          accountNo: "新开户", //账户编号
          payWay: "3", //缴费方式
          accountType: "1", //账户类型
          openAccountBank: "", //开户银行
          openAccountName: "", //开户名称
          bankAccount: "", //银行账户
          entrustNo: "", //托号
          entrustContract: "", //托收合同
          deliverWay: "", //投递方式
          deliverAddr: "", //投递地址
          bankSn: '',//开户行号
          outNo: '', //出盘编号
          emailAddr: "", //邮箱地址
          // 开票信息
          invoiceType: "1", //发票类型
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "" //银行账户
        };
        //账户信息
        this.$refs.accountInfo.init(val);
        //开票信息
        this.$refs.invoiceInfo.init(val);
      } else if (type == "getValue") {
        this.accountEditType = 0;
        this.invoiceEditType = 0;
        //账户信息
        this.$refs.accountInfo.init(val);
        //开票信息
        this.$refs.invoiceInfo.init(val);
      }
    },
    // 结构化地址控制
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
          }else{ // 关闭结构化地址
          // 去除结构化地址校验
            this.$refs.custInfo.isShowclientAddr = false;
            this.$refs.userInfo.$refs.dynamicForm.isShowClientContractAddr = false;
          }
        })
    },
  }
};
</script>
<style lang="scss">
.OpenAccountEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
  // span {
  //   font-size: 12px;
  // }
}
</style>

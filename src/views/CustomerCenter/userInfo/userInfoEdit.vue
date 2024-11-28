<template>
  <div class="userInfoEdit">
    <el-form size="mini" class="formBill" :inline="true" :model="formData" label-width="130px" ref="ruleForm">
      <!-- 客户信息 -->
      <custInfo ref="custInfo" :disableChangeMobile="false" :editType="0" :wayOpen="wayOpen" disableChangeCertNo="false"></custInfo>
      <!-- 账户信息
      <accountInfo ref="accountInfo" :editType="0" :wayOpen="wayOpen" disableAccountNo="false"></accountInfo> -->
      <!-- 开票信息 
      <invoiceInfo ref="invoiceInfo" :editType="0" :wayOpen="wayOpen"></invoiceInfo>-->
      <!-- 用户信息1 -->
      <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo>
      <!-- 用户-IC卡信息 -->
      <ICCardInfo ref="ICCardInfo" :editType="0" :wayOpen="wayOpen"></ICCardInfo>
      <!-- 水表信息 -->
      <waterMInfo ref="waterMInfo" :editType="0" :wayOpen="wayOpen"></waterMInfo>
      <!-- 抄表信息2 -->
      <meterReadInfo ref="meterReadInfo" :editType="0" :wayOpen="wayOpen"></meterReadInfo>
      <!-- 价格信息 -->
      <priceInfo ref="priceInfo" :editType="0" :wayOpen="wayOpen"></priceInfo>
      <!-- 账户信息 -->
      <accountInfo ref="accountInfo" :editType="0" :wayOpen="wayOpen" disableAccountNo="false"></accountInfo>
      <!-- 开票信息 -->
      <invoiceInfo ref="invoiceInfo" :editType="0" :wayOpen="wayOpen"></invoiceInfo>
    </el-form>
  </div>
</template>
<script>
import custInfo from "@/views/publicModule/infmtnManagement/custInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";
import ICCardInfo from "@/views/publicModule/infmtnManagement/ICCardInfo";
import meterReadInfo from "@/views/publicModule/infmtnManagement/meterReadInfo";
import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";
import accountInfo from "@/views/publicModule/infmtnManagement/accountInfo";
import invoiceInfo from "@/views/publicModule/infmtnManagement/invoiceInfo";
import priceInfo from "@/views/publicModule/infmtnManagement/priceInfo";
export default {
  name: "userInfoEdit",
  components: {
    custInfo,
    userInfo,
    ICCardInfo,
    meterReadInfo,
    waterMInfo,
    accountInfo,
    invoiceInfo,
    priceInfo
  },
  props: ["formDataUserNo"],
  data () {
    return {
      wayOpen: "userInfo",
      formData: {
        ctmInfo: {
          ctmNo: "", //客户编号：
          ctmName: "", //客户名称：
          certNo: "", //客户身份证号：
          certType: "", //证件类型：
          certTypeName: "", //证件类型：
          ctmAddr: "", //客户地址：
          ctmType: "", //客户类型：
          ctmTypeName: "", //客户类型：
          creditLevel: "", //信用等级：
          creditLevelName: "", //信用等级：
          linkMan: "", //联系人：
          linkTel: "", //固定电话：
          mobile: "", //手机号码：
          userAmount: "", //用户数量
        },
        userInfo: {
          userNo: "", //用户编号：
          lockFlag: "", //锁定状态：
          status: "", //用户状态：
          houseCert: "", //房地产编号：
          comments: "", //备注：

          reformFlag: "", //户表改造标记：
          contractNo: "", //合同编号：
          contractAddr: "", //合同地址：
          contractDate: "", //签订日期：
          businessAbodeName: "", //营业所：
          adminAreaName: "", //行政区域：
          businessAreaName: "", //营业区域：

          tradeClassifyName: "", //行业分类：
          openDate: "", //立户日期：
          stopDate: "", //停用日期：
          stopWaterLinkMan: "",
          stopWaterLinkMobile: "",
          userGroupNo: "",
          cancelDate: "", //注销日期：
          useTimeLimit: "", //用水期限：
          realEstateNo: '',//不动产单元号
          capaMoney: '',//容量水价

          // 用户-水表信息
          meterNo: "", //水表编号：
          setupMeterAddr: "", //装表地址：
          setupMeterLocation: "", //装表位置：
          virtualDesignFormulas: "", //虚拟计算公式：
          meterUse: "", //水表用途：
          meterUseName: "", //水表用途：
          useWaterObject: "", //用水对象：
          setupMeterDate: "", //新装日期：
          changeMeterDate: "", //换表日期：
          splitMeterDate: "", //拆表日期：
          splitMeterWay: "", //拆表类型：
          meterSite: "",//表位
          meterBjwz: "",//表井位置
          meterBjxs: "",//表井形式
          // 用户-抄表信息
          bookNo: "", //册本号：
          sortNo: "", //排序号：
          lastReadingDate: "", //抄表日：
          meterReadingCycle: "", //抄表周期：
          lastReadingNum: "", //最后抄码：
          threePeriodAvgWater: '',//三期均量
          openAccountLastMonth: '',//最后开账账期
          // 用户-价格信息
          useWaterTypeName: "", //用水类型：
          prefStrategyName: "", //优惠策略：
          prefCertNo: "", //优惠证件号码：
          prefBeginDate: "", //优惠策略开始日期：
          lastReadingDate: "", //优惠策略结束日期：
          ladderPersonNum: "", //用水人口：
          area:"",//旧行政区域
          areaName:"",
        },
        ICCardInfo: {
          miicno: '', // IC卡号
          miljfje: '', // IC子表号
          miiccnt: '', // IC累计购买次数
          miicyearcnt: '', // 年次
          miicsl: '', // 累购
          miicusesl: '', // IC累计用量
          miicdisplay: '', // 显示报警量
          miicclosing: '', // 关阀报警量
          miicpurchase: '', // 限购
          miicyd: '', // 采样点
          miicpresl: '', // IC卡维修底数
          miicprehbsl: '', // IC上期换表底数
          mihbljl: '', // 累积购水量
          mihbzbl: '', // 累积追补量
          mizhgssj: '', // 最后购水时间
          mizhgsl: '', // 最后购水量
          miicmemo: '', // 卡表备注
        },
        msInfo: {
          // 用户-水表信息
          factoryNo: "", //水表表身号：
          meterTypeName: "", //水表类型：
          meterBoreName: "", //水表口径：
          transmittalModel: "",//传输方式
          meterFactoryName: "", //水表厂家：
          meterModelName: "", //水表型号：
          transCommFee: "", //远传通讯费：
          commOperatorName: "", //通讯运营商：
          commFeeStart: "", //通讯费开始日期：
          commFeeEnd: "", //通讯费结束日期：
          mtdycChkDate: "",//周检起算日
          imei: "",//imei
          valveStatusName: "" //阀门状态
        },
        accountInfo: {
          // 账户信息
          accountNo: "", //账户编号
          payWay: "", //缴费方式
          payWayName: "", //缴费方式
          accountType: "", //账户类型
          accountTypeName: "", //账户类型
          openAccountBank: "", //开户银行
          openAccountName: "", //开户名称
          bankAccount: "", //银行账户
          entrustNo: "", //托号
          entrustContract: "", //托收合同
          deliverWay: "", //投递方式
          deliverWayName: "", //投递方式
          deliverAddr: "", //投递地址
          emailAddr: "", //邮箱地址
          // 开票信息
          invoiceType: "", //发票类型
          invoiceTypeName: "", //发票类型
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "", //银行账户
          preInvoicing: "", // 预开票标记
          mergeInvoicing: "", //合并开票
        }
      },
      // 价格模块数据
      priceData: {},
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
      invoiceData: {}
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let params = {
        busicode: "UserInfoQuery",
        data: { userNo: this.formDataUserNo }
      };
      this.$api.fetch({ params }).then(res => {
        this.formData = res;
        this.getFormData(res);
        this.$emit("fromLockFlag", this.formData.userInfo.lockFlag); //
        eventBus.$emit("userNo", this.formData.userInfo.userNo)
      });
      this.editMixture(1);
      this.editDiscount(1);
    },
    editMixture (mixtureType) {
      let _this = this
      let params = {
        busicode: "UserMinxtureList",
        data: { id: "", userNo: _this.formDataUserNo, type: mixtureType }
      }
      _this.$api.fetch({ params }).then(mixtureData => {
        _this.$refs.priceInfo.editData(mixtureData, true, _this.formDataUserNo);
      });

    },
    editDiscount (discountType) {
      let _this = this
      let params = {
        busicode: "UserDiscountList",
        data: { id: "", userNo: _this.formDataUserNo, type: discountType }
      }
      _this.$api.fetch({ params }).then(discountData => {
        _this.$refs.priceInfo.editDiscountData(discountData, true, _this.formDataUserNo);
      });

    },
    getCustData (res) {
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
        faxNumber: res.ctmInfo.faxNumber,
        mobile: res.ctmInfo.mobile, //手机号码：
        userAmount: res.ctmInfo.userAmount,//用户数量
      };
    },
    getUserData (res) {
      // 用户信息
      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        statusName: res.userInfo.statusName, //用户状态
        houseCert: res.userInfo.houseCert, //户口簿号
        comments: res.userInfo.comments, //备注
        fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限
        oldUserNo: res.userInfo.oldUserNo,//旧用户编号
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
        userGroupNo: res.userInfo.userGroupNo,
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址
        clientContractAddr: res.userInfo.clientContractAddr,
        clientContractAddrDetail: res.userInfo.clientContractAddrDetail,
        yearWater: res.userInfo.yearWater,//年用水量
        quotaWater: res.userInfo.quotaWater,//足额水量
        lastReadingNum: res.userInfo.lastReadingNum,//最后抄码
        realEstateNo: res.userInfo.realEstateNo,//不动产单元号
        capaMoney: res.userInfo.capaMoney,//容量水价
        bankCode: res.userInfo.bankCode, // 子银行账户
        bankSubAccount: res.userInfo.bankSubAccount, // 子银行
        nfcCode: res.userInfo.nfcCode, //水表电子标签码
        area:res.userInfo.area,//旧行政区域
        areaName:res.userInfo.areaName,
      };
    },

    getICCardInfo (res) {
      this.ICCardInfo = {
        miicno: res.userInfo.miicno, // IC卡号
        miljfje: res.userInfo.miljfje, // IC子表号
        miiccnt: res.userInfo.miiccnt, // IC累计购买次数
        miicyearcnt: res.userInfo.miicyearcnt, // 年次
        miicsl: res.userInfo.miicsl, // 累购
        miicusesl: res.userInfo.miicusesl, // IC累计用量
        miicdisplay: res.userInfo.miicdisplay, // 显示报警量
        miicclosing: res.userInfo.miicclosing, // 关阀报警量
        miicpurchase: res.userInfo.miicpurchase, // 限购
        miicyd: res.userInfo.miicyd, // 采样点
        miicpresl: res.userInfo.miicpresl, // IC卡维修底数
        miicprehbsl: res.userInfo.miicprehbsl, // IC上期换表底数
        mihbljl: res.userInfo.mihbljl, // 累积购水量
        mihbzbl: res.userInfo.mihbzbl, // 累积追补量
        mizhgssj: res.userInfo.mizhgssj, // 最后购水时间
        mizhgsl: res.userInfo.mizhgsl, // 最后购水量
        miicmemo: res.userInfo.miicmemo, // 卡表备注
      }
    },

    getWaterMData (res) {

      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址： 迁移到用户信息模块
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        setupMeterLocationName: res.userInfo.setupMeterLocationName, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途：
        meterUseName: res.userInfo.meterUseName, //水表用途：
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
        concentratorNo: res.userInfo.concentratorNo, //集中器
        meterBjwz: res.userInfo.meterBjwz,
        meterBjwzName: res.userInfo.meterBjwzName,
        meterBjxs: res.userInfo.meterBjxs,
        meterBjxsName: res.userInfo.meterBjxsName,
        meterSite: res.userInfo.meterSite
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
        shelfLife: res.msInfo.shelfLife,//使用期限
        meterSite: res.userInfo.concentratorNo,//表位
        meterSite: res.userInfo.meterSite,//表位
        meterBjwz: res.userInfo.meterBjwz,//表井位置
        meterBjxs: res.userInfo.meterBjxs,//表井形式
        meterSiteName: res.userInfo.meterSiteName,//表位
        meterBjwzName: res.userInfo.meterBjwzName,//表井位置
        meterBjxsName: res.userInfo.meterBjxsName,//表井形式
        mtdycChkDate: res.msInfo.mtdycChkDate, //周检起算日
        imei: res.msInfo.imei, //imei
        valveStatusName: res.msInfo.valveStatusName, //阀门管理
        mtdycChkDate: res.msInfo.mtdycChkDate, //周检起算日
        meterStatus: res.msInfo.meterStatus,//水表状态
        meterStatusName: res.msInfo.meterStatusName,
      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
    },

    getMeterReadData (res) {
      // 抄表信息
      this.meterReadData = {
        bookNo: res.userInfo.bookNo, //册本号
        sortNo: res.userInfo.sortNo, //排序号
        lastReadingDate: res.userInfo.lastReadingDate, //抄表日
        meterReadingCycle: res.userInfo.meterReadingCycle, //抄表周期
        meterReadingCycleName: res.userInfo.meterReadingCycleName, //抄表周期
        // lastReadingNum: res.userInfo.lastReadingNum ,//最后抄码
        threePeriodAvgWater: res.userInfo.threePeriodAvgWater,//三期均量
        openAccountLastMonth: res.userInfo.openAccountLastMonth,//最后开账账期
        meterReadingStaff: res.userInfo.meterReadingStaff,//抄表员
        nextMonthid:res.userInfo.nextMonthid//下次抄表月
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
        emailAddr, //邮箱地址
        bankSn,//开户行号
        outNo, //出盘编号
        accountBalance,//账户余额
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
        emailAddr, //邮箱地址
        bankSn,//开户行号
        outNo, //出盘编号
        accountBalance,//账户余额
      };
    },

    getInvoiceData (res) {
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
        vatFlag: res.accountInfo.vatFlag, //增值税标识
        vatFlagName: res.accountInfo.vatFlagName, //增值税标识
        preInvoicing: res.accountInfo.preInvoicing, // 预开票标记
        mergeInvoicing: res.accountInfo.mergeInvoicing, //合并开票
      };
    },
    getPriceData (res) {
      // 价格信息
      this.priceData = {
        useWaterTypeName: res.userInfo.useWaterTypeName, //用水类型：
        useWaterType: res.userInfo.useWaterType, //用水类型：
        prefStrategyName: res.userInfo.prefStrategyName, //优惠策略：
        prefStrategyId: res.userInfo.prefStrategyId, //优惠策略id
        prefCertNo: res.userInfo.prefCertNo, //优惠证件号码：
        prefBeginDate: res.userInfo.prefBeginDate, //优惠策略开始日期：
        prefEndDate: res.userInfo.prefEndDate, //优惠策略结束日期：
        ladderPersonNum: res.userInfo.ladderPersonNum //用水人口：
      };
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

      //价格信息
      this.$refs.priceInfo.init(this.priceData);
    },

    toParentData () {
      let data = {};
      data.userNo = this.$refs.userInfo.formData.userNo;
      if (this.$refs.userInfo.$refs.dynamicForm.editFormData.lockFlag == '否') {
        data.lockFlag = 1;
      } else if (this.$refs.userInfo.$refs.dynamicForm.editFormData.lockFlag == '是') {
        data.lockFlag = 0;
      }
      return data;
    },

    closeDialog () {
      this.$parent.closeDialog1();
    },
  }
};
</script>
<style lang="scss" scoped>
.userInfoEdit {
  width: 100%;
  height: 100%;
  span {
    font-size: 12px;
  }
  /deep/ {
    .el-form-item {
      .el-form-item__content {
        min-height: 28px;
        border-bottom: solid 1px #ccc;
      }
    }
  }
}
</style>


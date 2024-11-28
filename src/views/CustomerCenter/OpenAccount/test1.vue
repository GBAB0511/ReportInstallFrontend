<template>
  <div class="test1">
    <el-form
      :model="formData"
      class="formBill"
      :inline="true"
      :disabled="NotDisabled"
      ref="form"
      size="mini"
      label-width="130px"
    >
      <!-- 单据信息 -->
      <billInfo v-if="billStute=='OpenAccUpdate'" ref="billInfo" :editType="0"></billInfo>
      
      <cusAccountMixInfo ref="custInfo" :editType="formData" :wayOpen="wayOpen"></cusAccountMixInfo>
      <!-- 客户信息
      <custInfo ref="custInfo" :editType="custEditType" :wayOpen="wayOpen"></custInfo>
      账户信息
      <accountInfo ref="accountInfo" :editType="accountEditType" :wayOpen="wayOpen"></accountInfo>
      开票信息
      <invoiceInfo ref="invoiceInfo" :editType="invoiceEditType" :wayOpen="wayOpen"></invoiceInfo> -->
      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>
      <!-- 抄表信息 -->
      <meterReadInfo ref="meterReadInfo" :editType="meterEditType" :wayOpen="wayOpen"></meterReadInfo>
      <!-- 水表信息 -->
      <waterMInfo ref="waterMInfo" :editType="waterMEditType" :wayOpen="wayOpen"></waterMInfo>
      <!-- 价格信息 -->
      <priceInfo ref="priceInfo" :editType="priceEditType" :wayOpen="wayOpen"></priceInfo>
      
      <legend class="legendColumn">流程处理</legend>
        <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import custInfo from "@/views/publicModule/infmtnManagement/custInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";
import cusAccountMixInfo from "@/views/publicModule/infmtnManagement/cusAccountMixInfo";
import meterReadInfo from "@/views/publicModule/infmtnManagement/meterReadInfo";
import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";
import accountInfo from "@/views/publicModule/infmtnManagement/accountInfo";
import invoiceInfo from "@/views/publicModule/infmtnManagement/invoiceInfo";
import priceInfo from "@/views/publicModule/infmtnManagement/priceInfo";
export default {
  name: "test1",
  props: ["idCuster",'billStute'],
  components: {
    billInfo,
    cusAccountMixInfo,
    custInfo,
    userInfo,
    meterReadInfo,
    waterMInfo,
    accountInfo,
    invoiceInfo,
    priceInfo,
  },
  data() {
    return {
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
        userOpenInfo:{}
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
      NotDisabled: false, //是否可编辑
    };
  },
  mounted() {
    if (this.idCuster) {
      this.init();
    }else{
      this.getHtmlData()
    }
  },
  watch: {},
  methods: {
    init() {
      let params = {
        busicode: "OpenAccQuery",
        data: {id: this.idCuster}
      };
      this.$api.fetch({ params })
        .then(res => {
          this.formData = res;
          if (
            this.formData.userOpenInfo.processState == "approval" ||
            this.formData.userOpenInfo.processState == "END"
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          this.getFormData(res);
          this.getBillData(res);
          this.getHtmlData()
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "USER_OPEN",
        "审批流配置:" +
          _this.formData.userOpenInfo.processName +
          "(" +
          _this.formData.userOpenInfo.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.userOpenInfo.id, // 任务id
        _this.formData.userOpenInfo.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          _this.$parent.closeDialog(); // 提交后回调方法
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.billStute
      );
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.userOpenInfo.billNo, //单据编号
        billDate: res.userOpenInfo.billDate //单据日期
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
        ctmAddr: res.ctmInfo.ctmAddr, //客户地址：
        clientAddr: res.ctmInfo.clientAddr,
        clientAddrDetail: res.ctmInfo.clientAddrDetail,
        ctmType: res.ctmInfo.ctmType, //客户类型：
        creditLevel: res.ctmInfo.creditLevel, //信用等级：
        linkMan: res.ctmInfo.linkMan, //联系人：
        linkTel: res.ctmInfo.linkTel, //固定电话：
        mobile: res.ctmInfo.mobile //手机号码：
      };
    },
    getUserData(res) {
      // 用户信息
      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
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
        adminArea: res.userInfo.adminArea, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        clientContractAddr: res.userInfo.clientContractAddr,
        clientContractAddrDetail: res.userInfo.clientContractAddrDetail,
      };
    },

    getWaterMData(res) {
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途：

        useWaterObject: res.userInfo.useWaterObject, //用水对象：
        meterType: res.userInfo.meterType, //水表类型：
        setupMeterDate: res.userInfo.setupMeterDate, //新装日期：
        changeMeterDate: res.userInfo.changeMeterDate, //换表日期：
        splitMeterDate: res.userInfo.splitMeterDate, //拆表日期：
        splitMeterWay: res.userInfo.splitMeterWay, //拆表类型：
        fatherMeterNo: res.userInfo.fatherMeterNo //总表编号
      };
      let key = "userInfo";
      this.waterMData[key] = valMeter;
    },

    getWMeterData(res) {
      // 水表信息
      let valMeter = {
        meterModel: res.msInfo.meterModel, //水表型号
        meterTypeName: res.msInfo.meterTypeName, //水表类型
        meterBoreName: res.msInfo.meterBoreName, //水表口径
        meterFactoryName: res.msInfo.meterFactoryName, //水表厂家
        meterModelName: res.msInfo.meterModelName, //水表型号
        transCommFee: res.msInfo.transCommFee, //远传通讯费
        commOperatorName: res.msInfo.commOperatorName, //通讯运营商
        commFeeStart: res.msInfo.commFeeStart, //通讯费开始日期
        commFeeEnd: res.msInfo.commFeeEnd //通讯费结束日期

      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
    },

    getMeterReadData(res) {
      let {
        bookNo, //册本号
        sortNo, //排序号
        lastReadingDate, //抄表日
        meterReadingCycle, //抄表周期
        lastReadingNum, //最后抄码
      } = res.userInfo;
       // 抄表信息
      this.meterReadData = {
        bookNo, //册本号
        sortNo, //排序号
        lastReadingDate, //抄表日
        meterReadingCycle, //抄表周期
        lastReadingNum, //最后抄码
      };
    },

    getAccountData(res) {
      let {
        accountNo, //账户编号
        payWay, //缴费方式
        accountType, //账户类型
        openAccountBank, //开户银行
        openAccountName, //开户名称
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverAddr, //投递地址
        emailAddr, //邮箱地址
        outNo, //出盘编号
      } = res.accountInfo;
      // 账户信息
      this.accountData = {
        accountNo, //账户编号
        payWay, //缴费方式
        accountType, //账户类型
        openAccountBank, //开户银行
        openAccountName, //开户名称
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverAddr, //投递地址
        emailAddr, //邮箱地址
        outNo, //出盘编号
      };
    },

    getInvoiceData(res) {
      let {
        invoiceType, //发票类型
        invoiceTitle, //单位名称
        invoiceTax, //纳税人识别号
        invoiceAddr, //联系地址
        invoiceLink, //座机号码
        invoiceBank, //开户银行
        invoiceAccount, //银行账户
      } = res.accountInfo;
       // 开票信息
      this.invoiceData = {
        invoiceType, //发票类型
        invoiceTitle, //单位名称
        invoiceTax, //纳税人识别号
        invoiceAddr, //联系地址
        invoiceLink, //座机号码
        invoiceBank, //开户银行
        invoiceAccount, //银行账户
      };
    },
    getPriceData(res) {
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
    getFormData(res) {
      // 1 客户编号为空
      if (res.ctmInfo.ctmNo) {
        this.custEditType = 0;
        if (res.accountInfo.accountNo) {
          this.accountEditType = 0;
          this.invoiceEditType = 0;
          this.getaccountCusData(res.ctmInfo.ctmNo);
        }
      }
      this.getBillData(res);
      this.getCustData(res);
      this.getWaterMData(res);
      this.getWMeterData(res);
      this.getUserData(res);
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
      this.$refs.meterReadInfo.init(this.meterReadData);

      //账户信息
      this.$refs.accountInfo.init( this.accountData );

      //开票信息
      this.$refs.invoiceInfo.init(this.invoiceData);

      //价格信息
      this.$refs.priceInfo.init( this.priceData);
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
        //账户信息
        this.accountEditType = 0;
        this.invoiceEditType = 0;
        this.$refs.accountInfo.init( this.accountData );
        //开票信息
        this.$refs.invoiceInfo.init( this.invoiceData);
      } else if (a.length < 1) {
        b.accountInfo = {};
        this.getAccountData(b);
        this.getInvoiceData(b);

        this.accountEditType = 1;
        this.invoiceEditType = 1;
        //账户信息
        this.$refs.accountInfo.init( this.accountData );
        //开票信息
        this.$refs.invoiceInfo.init( this.invoiceData);
      } else if (a.length > 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        //账户信息
        this.$refs.accountInfo.init( this.accountData );
        //开票信息
        this.$refs.invoiceInfo.init( this.invoiceData);

        let c = {
          accountNo: "",
          openAccountName: "新开账户",
          id: "123456"
        };
        a.unshift(c);

        this.accountEditType = 0;
        this.invoiceEditType = 0;
        this.$refs.accountInfo.accountlist = a;
      }
    },
    
    getFormbData() {
      let val = {
        accountInfo: {
          ...this.$refs.accountInfo.formData,
          ...this.$refs.invoiceInfo.formData
        },
        ctmInfo: {
          ...this.$refs.custInfo.formData
        },
        userInfo: {
          ...this.$refs.userInfo.formData,
          ...this.$refs.waterMInfo.formData.userInfo,
          ...this.$refs.meterReadInfo.formData,
          ...this.$refs.priceInfo.formData
        }
      };
      
      // 树结构
      // 行政区域 只需要传最后一个值过去
      val.userInfo.adminArea = this.common.handleTreeData(val.userInfo.adminArea)
      // 开户银行 数据格式处理
      val.accountInfo.invoiceBank = this.common.handleTreeData(val.accountInfo.invoiceBank)
      val.accountInfo.openAccountBank = this.common.handleTreeData(val.accountInfo.openAccountBank)

      if (val.ctmInfo.ctmNo == "新开户") {
        val.ctmInfo.ctmNo = "";
      }
      if (this.billStute== "OpenAccUpdate") {
        val.userOpenInfo = {
          ...this.formData.userOpenInfo
        };
      }
      return val;
    },
    // 保存接口
    submit(type) {
      let val = {
        accountInfo: {
          ...this.$refs.accountInfo.formData,
          ...this.$refs.invoiceInfo.formData
        },
        ctmInfo: {
          ...this.$refs.custInfo.formData
        },
        userInfo: {
          ...this.$refs.userInfo.formData,
          ...this.$refs.waterMInfo.formData.userInfo,
          ...this.$refs.meterReadInfo.formData,
          ...this.$refs.priceInfo.formData
        }
      };
      // 树结构
      // 行政区域 只需要传最后一个值过去
      val.userInfo.adminArea = this.common.handleTreeData(val.userInfo.adminArea)
      // 开户银行 数据格式处理
      val.accountInfo.invoiceBank = this.common.handleTreeData(val.accountInfo.invoiceBank)
      val.accountInfo.openAccountBank = this.common.handleTreeData(val.accountInfo.openAccountBank)

      if (val.ctmInfo.ctmNo == "新开户") {
        val.ctmInfo.ctmNo = "";
      }
      if (type == "OpenAccUpdate") {
        val.userOpenInfo = {
          ...this.formData.userOpenInfo
        };
      }
      let params = {
        busicode: type,
        data: val
      };
      
      this.$api.fetch({  params })  .then(res => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.$parent.closeDialog();
        });
    },
    // 清空账户、开票数据
    getAccoInvoData(val, type) {
      if (type == "clear") {
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        val = {
          // 账户信息
          accountNo: "", //账户编号
          payWay: "", //缴费方式
          accountType: "", //账户类型
          openAccountBank: "", //开户银行
          openAccountName: "", //开户名称
          bankAccount: "", //银行账户
          entrustNo: "", //托号
          entrustContract: "", //托收合同
          deliverWay: "", //投递方式
          deliverAddr: "", //投递地址
          emailAddr: "", //邮箱地址
          // 开票信息
          invoiceType: "", //发票类型
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "" //银行账户
        };
        //账户信息
        this.$refs.accountInfo.init( val);
        //开票信息
        this.$refs.invoiceInfo.init( val);
      } else if (type == "getValue") {
        this.accountEditType = 0;
        this.invoiceEditType = 0;
        //账户信息
        this.$refs.accountInfo.init( val);
        //开票信息
        this.$refs.invoiceInfo.init( val);
      }
    }
  }
};
</script>
<style lang="scss">
.test1 {
  height: calc(100% - 41px);
  overflow-y: auto;
  span {
    font-size: 12px;
  }
}
</style>

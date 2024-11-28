<template>
  <div class="userInfoSearchDetail">
    <div class="bread-contain">
      <!-- //初始化按钮 -->
      <div class="bread-contain-left">
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="ctmChange">变动情况</el-button>
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="payInfo">费用信息</el-button>
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="meterInfo">抄表信息</el-button>
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="Predeposit">账户流水</el-button>
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="initContractTemplate()">打印合同</el-button>
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="doPrint('xk')">打印新卡</el-button>
        <el-button :disabled="disabledBtn" size="mini" type="primary" @click="AttachmentView">查看附件({{attachmentQty}})</el-button>
      </div>
      <div class="bread-contain-right">
        <span class="contain-right">
          <el-select v-model="queryType" size="mini" placeholder="请选择" clearable>
            <el-option v-for="item in dictionaryData.USER_QUERY_TYPE" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
          <el-button class="searchBtn" @click="search" icon="el-icon-search" size="mini">查询</el-button>
          <el-button @click="nextSearch(0)" size="mini">上一户</el-button>
          <el-button @click="nextSearch(1)" size="mini">下一户</el-button>
        </span>
      </div>
    </div>

    <!-- 多户信息 -->
    <ChooseUserDialog ref="ChooseUserDialog" @submit="multiChooseUser" />

    <!-- 弹出表资料变更 -->
    <el-dialog :title="DataChangeVisibleName" :visible.sync="DataChangeVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog" v-if="DataChangeVisible">
      <CustomerChangeEdit ref="customerChangeEdit" :idCuster="idCuster" :billStute="status"></CustomerChangeEdit>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitCustomerChange">保存为草稿</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单客户变动情况 -->
    <el-dialog :title="ctmChangeName" :close-on-click-modal="false" v-if="CustomerChangesVisible" :visible.sync="CustomerChangesVisible" class="common-dialog" @close="closeDialog">
      <CustomerChangesEdit ref="ctmChangeEditor" :CustomerChangesEditData="CustomerChangesEditData"></CustomerChangesEdit>
    </el-dialog>
    <!-- 弹出表单费用信息 -->
    <el-dialog :title="payInfoName" :close-on-click-modal="false" v-if="payInfoVisible" :visible.sync="payInfoVisible" class="common-dialog" @close="closeDialog">
      <WaterUseOverTheYears ref="payInfoEditor" :WaterUseOverTheYearsData="WaterUseOverTheYearsData"></WaterUseOverTheYears>
    </el-dialog>
    <!-- 弹出表单抄表信息 -->
    <el-dialog :title="MeterReadingName" :close-on-click-modal="false" v-if="MeterReadingVisible" :visible.sync="MeterReadingVisible" class="common-dialog" @close="closeDialog">
      <MeterReadingInfo ref="MeterReading" :MeterReadingInfoData="MeterReadingInfoData"></MeterReadingInfo>
    </el-dialog>
    <!-- 弹出表单账户流水 -->
    <el-dialog :title="PredepositDdetailsName" :close-on-click-modal="false" v-if="PredepositDdetailsVisible" :visible.sync="PredepositDdetailsVisible" class="common-dialog" @close="closeDialog">
      <PredepositDdetailsInfo ref="PredepositDdetails" :PredepositDdetailsInfoData="PredepositDdetailsInfoData"></PredepositDdetailsInfo>
    </el-dialog>
    <!-- 弹出表单附件查看 -->
    <el-dialog :title="AttachmentViewName" :close-on-click-modal="false" v-if="AttachmentViewVisible" :visible.sync="AttachmentViewVisible" class="button-dialog" @close="closeDialog">
      <AttachmentViewInfo :receiptAccessory="receiptAccessory" ref="AttachmentView"></AttachmentViewInfo>
    </el-dialog>
    <el-dialog :title="ContractTemplateVisibleName" :visible.sync="ContractTemplateVisible" :close-on-click-modal="false" class="button-dialog" @close="closeTemplateDialog" v-if="ContractTemplateVisible">
      <div class="toolbar">
        <el-select v-model="fjName" placeholder="请选择">
          <el-option v-for="item in templateList" :key="item.templateName" :label="item.templateName" :value="item.fjName">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitTemplate()">保存</el-button>
        <el-button type="info" size="mini" plain @click="closeTemplateDialog()">取 消</el-button>
      </div>

    </el-dialog>
    <div class="userInfoIndex">
      <el-form size="mini" class="formBill" :inline="true" :model="formData" label-width="130px" ref="ruleForm">
        <!-- 客户信息 -->
        <custInfo :disableChangeMobile="true" ref="custInfo" :editType="0" :wayOpen="wayOpen" disableChangeCertNo="false"></custInfo>
        <!-- 用户信息 -->
        <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo>
        <!-- 用户-IC卡信息 -->
        <ICCardInfo ref="ICCardInfo" :editType="0" :wayOpen="wayOpen"></ICCardInfo>
        <!-- 抄表信息 -->
        <meterReadInfo ref="meterReadInfo" :editType="0" :wayOpen="wayOpen"></meterReadInfo>
        <!-- 水表信息 -->
        <waterMInfo ref="waterMInfo" :editType="0" :wayOpen="wayOpen"></waterMInfo>
        <!-- 价格信息 -->
        <priceInfo ref="priceInfo" :editType="0" :wayOpen="wayOpen"></priceInfo>
        <!-- 账户信息 -->
        <accountInfo ref="accountInfo" :editType="0" :wayOpen="wayOpen" disableAccountNo="false"></accountInfo>
        <!-- 开票信息 -->
        <invoiceInfo ref="invoiceInfo" :editType="0" :wayOpen="wayOpen"></invoiceInfo>

      </el-form>
    </div>

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
import CustomerChangesEdit from "@/components/IntegratedBusiness/UserInformation/CustomerChanges";//变动信息
import WaterUseOverTheYears from "@/components/IntegratedBusiness/UserInformation/WaterUseOverTheYears";//费用信息
import MeterReadingInfo from "@/components/IntegratedBusiness/UserInformation/MeterReadingInfo";//抄表信息
import PredepositDdetailsInfo from "@/components/IntegratedBusiness/UserInformation/PredepositDdetailsInfo";//账户流水
import AttachmentViewInfo from "@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo";//
import ChooseUserDialog from './ChooseUserDialog.vue';
export default {
  name: "userInfoSearchDetail",
  components: {
    custInfo,
    userInfo,
    ICCardInfo,
    meterReadInfo,
    waterMInfo,
    accountInfo,
    invoiceInfo,
    priceInfo,
    WaterUseOverTheYears,
    MeterReadingInfo,
    PredepositDdetailsInfo,
    AttachmentViewInfo,
    CustomerChangesEdit,
    ChooseUserDialog
  },
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
          capaMoney: '', // 容量水价

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
          ladderPersonNum: "" //用水人口：
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
          imei: "", // imei
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
          outNo: 1, //出盘编号
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
      invoiceData: {},
      queryType: '0',
      disabledBtn: true,//按钮状态判断
      fuzzyQuery: '',
      formDataUserNo: "",
      status: "ChangeUserAdd", //add 新增 updata 修改
      dictionaryData: {},
      CustomerChangesEditData: {
        //变动情况
        userNo: ""
      },
      WaterUseOverTheYearsData: {
        //费用信息
        userNo: ""
      },
      MeterReadingInfoData: {
        //抄表信息
        userNo: ""
      },
      PredepositDdetailsInfoData: {
        //账户流水
        accountNo: "",
        userNo: "",
      },
      lockFlagStr: "锁定",
      DataChangeVisibleName: "资料变更",
      DataChangeVisible: false,
      countManagementName: "查看客户资料",
      countManagementVisible: false,
      ContractTemplateVisibleName: "合同模板选择",
      ContractTemplateVisible: false,
      CustomerChangesVisible: false,
      ctmChangeName: "变动情况",
      payInfoName: "费用信息",
      payInfoVisible: false,
      MeterReadingName: "抄表信息",
      MeterReadingVisible: false,
      PredepositDdetailsName: "账户流水",
      PredepositDdetailsVisible: false,
      // 查看附件弹出框显示与隐藏
      AttachmentViewVisible: false,
      AttachmentViewName: "查看附件",
      //查看附件传参
      receiptAccessory: { userNo: "" },
      ContractTemplateVisible: false,
      attachmentData: [],
      attachmentQty: 0,
      templateList: [],
      fjName: '',
      dictionaryData: {},
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getParams()
    })
    // window.open('/UserInfoSearchDetail')
    // this.init();
    this.getDictionary()

    this.common.changeTable(this, ".userInfoSearchDetail", [
      ".userInfoSearchDetail .bread-contain",
    ]);

  },
  methods: {
    search () {
      if (this.fuzzyQuery.length == 0 || !this.queryType || this.queryType.length === 0) {
        this.$message({
          message: "查询条件不能为空",
          type: "warning"
        });
        return

      } else {
        this.disabledBtn = false
      }
      var reg = new RegExp(' ', "g")
      var reg2 = new RegExp('\\t', "g")
      if (this.fuzzyQuery)
        this.fuzzyQuery = this.fuzzyQuery.replace(reg, '');
      this.fuzzyQuery = this.fuzzyQuery.replace(reg2, '');
      let params = {
        busicode: "UserInfoSelect",
        data: { fuzzyQuery: this.fuzzyQuery, queryType: this.queryType }
      };
      this.$api.fetch({ params }).then(res => {
        if (res.length > 1) {
          this.$refs.ChooseUserDialog.open(res)
        } else {
          this.formDataUserNo = res[0].userNo
          this.init()
        }
      });
    },
    getParams () {
      if (sessionStorage.getItem('userNo')) {
        this.fuzzyQuery = sessionStorage.getItem('userNo')
        this.search()
        sessionStorage.removeItem('userNo')
      }
    },
    nextSearch (sortFlag) {
      if (this.meterReadData.sortNo.length == 0 || this.meterReadData.bookNo.length == 0) {
        this.$message({
          message: "当前用户没有册本号/排序号，无法使用该功能",
          type: "warning"
        });
        return
      }
      let params = {
        busicode: "UserInfoSelect",
        data: {
          sortNo: this.meterReadData.sortNo,
          bookNo: this.meterReadData.bookNo,
          sortFlag: sortFlag
        }
      };
      this.$api.fetch({ params }).then(res => {
        this.formDataUserNo = res[0].userNo
        this.fuzzyQuery = res[0].userNo
        this.queryType = '0'
        this.init()
      });
    },
    multiChooseUser (row) {
      this.formDataUserNo = row.userNo
      this.init()
    },
    init () {
      if (this.formDataUserNo.length == 0) {
        this.$message({
          message: "用户编号不能为空",
          type: "warning"
        });
        return
      }
      let params = {
        busicode: "UserInfoQuery",
        data: { userNo: this.formDataUserNo }
      };
      this.$api.fetch({ params }).then(res => {
        this.formData = res;
        this.getFormData(res);
        this.$emit("fromLockFlag", this.formData.userInfo.lockFlag); //
        eventBus.$emit("userNo", this.formData.userInfo.userNo)
        this.receiptAccessory.userNo = this.formData.userInfo.userNo
        this.initAccessory()
      });
      this.editMixture(1);
      this.editDiscount(1);

    },
    // 数据字典数据获取
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "USER_QUERY_TYPE" //查询项、工程类型、信息来源、流程状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
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
    editShow () {
      this.DataChangeVisible = true;
    },
    ctmChange () {
      this.CustomerChangesEditData.userNo = this.formDataUserNo
      this.CustomerChangesVisible = true;
    },
    payInfo () {
      this.WaterUseOverTheYearsData.userNo = this.formDataUserNo
      this.payInfoVisible = true;
    },
    meterInfo () {
      this.MeterReadingInfoData.userNo = this.formDataUserNo
      this.MeterReadingVisible = true;
    },
    Predeposit () {
      this.PredepositDdetailsInfoData.userNo = this.formDataUserNo
      this.PredepositDdetailsInfoData.accountNo = this.formData.accountInfo.accountNo
      this.PredepositDdetailsVisible = true;
    },
    AttachmentView () {
      let _this = this;
      this.receiptAccessory.userNo = this.formData.userInfo.userNo
      this.AttachmentViewVisible = true;
    },
    initContractTemplate () {
      let _this = this;
      let params = {
        busicode: "ContractTemplateList",
        data: { page: 1, pageCount: 8888, type: 2 }
      };

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.templateList = res.list
      })
      this.ContractTemplateVisible = true;

    },
    doPrint (type) {
      let _this = this;
      let params = {
        busicode: "XkPrint",
        data: { userNo: _this.formDataUserNo }
      };

      this.$api.fetch({
        params: params,
      }).then(res => {

        if (type == 'xk') {// 打印
          // _this.printTable('print', res)
          _this.common.print('view', 'XkPrint', '', res, _this);
        }
      })
    },
    initAccessory () { //初始化附件
      let _this = this;
      let params = {
        busicode: "AccessoryAboutUserList",
        data: _this.receiptAccessory
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if (res != null && res.length > 0) {
            _this.attachmentData = res;
            _this.attachmentQty = res.length
          } else {
            _this.attachmentQty = 0
          }
        });
    },
    closeTemplateDialog () {
      this.ContractTemplateVisible = false;
    },
    //打印模板
    submitTemplate () {
      let _this = this;
      var token = sessionStorage.getItem('token')
      let params = {
        data: { userNo: _this.formDataUserNo, fjName: _this.fjName }
      };
      axios({
        method: 'post',
        url: 'contractTemplatePrint.api',
        responseType: 'blob',
        data: {
          token: token,
          data: { userNo: _this.formDataUserNo, fjName: _this.fjName }
        }
      }).then(res => {
        var blob = new Blob([res.data], { type: "application/msword" })
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = this.fjName; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象

      })
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
        userNo: res.userInfo.userNo, //用户编号
        stopWaterLinkMobile: res.userInfo.stopWaterLinkMobile, // 通知人号码
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
        mobile: res.ctmInfo.mobile, //手机号码：
        ctmNo: res.ctmInfo.ctmNo, //客户编号：
        nfcCode:res.userInfo.nfcCode, //nfc芯片码
        capaMoney: res.userInfo.capaMoney, // 容量水价
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
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
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
        meterFactoryName: res.msInfo.meterFactoryName, //水表厂家
        transmittalModel: res.msInfo.transmittalModel,//传输方式
        transmittalModelName: res.msInfo.transmittalModelName,//通讯类型名称
        meterModelName: res.msInfo.meterModelName, //水表型号
        transCommFee: res.msInfo.transCommFee, //远传通讯费
        commOperatorName: res.msInfo.commOperatorName, //通讯运营商
        commFeeStart: res.msInfo.commFeeStart, //通讯费开始日期
        commFeeEnd: res.msInfo.commFeeEnd,//通讯费结束日期
        meterPatternName: res.msInfo.meterPatternName, //水表型式
        valveControl: res.msInfo.valveControl, //是否阀控
        valveControlName: res.msInfo.valveControlName, //是否阀控
        // transmissionName: res.msInfo.transmissionName,//是否远传
        protocolName: res.msInfo.protocolName, //下行规约
        meterSensorName: res.msInfo.meterSensorName, //水表传感器
        maxValue: res.msInfo.maxValue, //满码值
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        shelfLife: res.msInfo.shelfLife, //使用期限
        imei: res.msInfo.imei,
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
        lastReadingNum: res.userInfo.lastReadingNum, //最后抄码
        meterReadingStaff: res.userInfo.meterReadingStaff, // 抄表员
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
        accountBalance,//账户余额
        bankSn,//开户行号
        outNo
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
        accountBalance,//账户余额
        bankSn,//开户行号
        outNo, //出盘编号
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
        preInvoicing:res.accountInfo.preInvoicing, // 预开票
        mergeInvoicing:res.accountInfo.mergeInvoicing, //合并开票
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
      if (this.$refs.userInfo.formData.lockFlag == 0) {
        data.lockFlag = 1;
      } else if (this.$refs.userInfo.formData.lockFlag == 1) {
        data.lockFlag = 0;
      }
      return data;
    },
    closeDialog () {
      this.CustomerChangesVisible = false;
      this.payInfoVisible = false;
      this.MeterReadingVisible = false;
      this.PredepositDdetailsVisible = false;
      this.AttachmentViewVisible = false;
      this.DataChangeVisible = false;
    },
  },
  watch: {
    AttachmentViewVisible (val) {
      if (!val) {
        this.initAccessory()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.userInfoSearchDetail {
  width: 100%;
  height: 100%;
  // overflow-y: auto;
  .userInfoIndex {
    height: calc(100% - 41px);
    overflow-y: auto;
    .fuzzy-query-input {
      width: 180px !important;
      /deep/ {
        .el-input__inner {
          width: 100%;
        }
      }
    }
  }
  .bread-contain {
    display: flex;
  }
  .bread-contain-left {
    width: 50%;
    line-height: 40px;
  }
  span {
    font-size: 12px;
  }
  /deep/ {
    .el-form-item {
      .el-form-item__content {
        min-height: 28px;
      }
    }
  }
  .contain-right {
    float: right;
    text-align: right;
    line-height: 40px;
    .el-select {
      width: 120px;
      /deep/ {
        .el-input__suffix {
          height: 28px;
          line-height: 28px;
          margin: 6px 0;
        }
      }
    }
    .el-input {
      width: 200px;
      /deep/ {
        .el-input__inner {
          width: 200px;
        }
      }
    }
  }
}
</style>


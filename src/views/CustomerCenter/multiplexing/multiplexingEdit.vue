
<template>
  <div class="multiplexingEdit common-editDiv">
    <!-- 弹出表单明细 -->
    <el-dialog title="欠费明细" :close-on-click-modal="false" :visible.sync="DetailsArrearsShow" @close="closeDialog">
      <DetailsArrears ref="DetailsArrears"></DetailsArrears>
    </el-dialog>

    <el-form class="formBill" size="mini" :inline="true" :model="formData" :disabled="NotDisabled" :rules="formRules" label-width="130px" ref="ruleForm">
      <el-form-item style="margin-top:1%" label="用户编号：" v-if="searchBtnShow" class="width450">
        <el-input class="read-only" v-model="searchUserNum" placeholder="请输入户号" @change="initUserNo" clearable @keydown.enter.native="initUserNo" @input="e => input = inputMe(e)">
          <el-button slot="append" class="searchBtn scanning-btn" @click="initUserNo" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="billStute=='ReuseUserUpdate'" ref="billInfo" :editType="0"></billInfo>

      <legend class="legendColumn">复用信息</legend>
      <el-form-item label="信息来源：" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.sourceFlag" placeholder>
          <el-option v-for="(item,index) in dictionaryData.PIS" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.sourceFlagName}}</span>
      </el-form-item>
      <el-form-item label="复用日期：" prop="reuseDate" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-if="!NotDisabled" v-model="formData.reuseDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        <span v-else>{{formData.reuseDate}}</span>
      </el-form-item>

      <!-- <el-form-item label="是否复表：" prop="reuseMeterFlag" :class="{'disable-item': NotDisabled}">
        <template v-if="!NotDisabled">
          <el-radio v-model="formData.reuseMeterFlag" :label="1">是</el-radio>
          <el-radio v-model="formData.reuseMeterFlag" :label="0">否</el-radio>
        </template>
        <span v-else>{{formData.reuseMeterFlag ? '是' : '否'}}</span>
      </el-form-item> -->
      <el-form-item label="备注：" class="Remarks" prop="comments" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
        <span v-else>{{formData.comments}}</span>
      </el-form-item>

      <!-- 复表信息 -->
      <legend class="legendColumn">复表信息</legend>
      <el-form-item label="复装方式：" prop="reuseType">
        <el-radio-group v-model="formData.changeMeterFlag" class="reuseTypeRadio" @change="reuseTypeChange" size="mini" :disable="NotDisabled">
          <el-radio :label="0">原表复装</el-radio>
          <el-radio :label="1">换表复装</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="水表起码：" prop="reuseMeterStartNum" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="text" size="mini" v-model="formData.reuseMeterStartNum" placeholder="水表起码" clearable></el-input>
        <span v-else>{{formData.reuseMeterStartNum}}</span>
      </el-form-item>
      <el-form-item label="水表表身码：" prop="reuseFactoryNo" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="formData.reuseFactoryNo" size="mini" clearable placeholder="水表表身码" @keydown.native.enter="queryWaterMeter">
          <el-button slot="append" class="searchBtn" @click="queryWaterMeter" icon="el-icon-search"></el-button>
        </el-input>
        <span v-else>{{formData.reuseFactoryNo}}</span>
      </el-form-item>
      <el-form-item label="水表编号：" prop="reuseMeterNo" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="text" size="mini" v-model="formData.reuseMeterNo" placeholder="水表编号" clearable></el-input>
        <span v-else>{{formData.reuseMeterNo}}</span>
      </el-form-item>
      <el-form-item label="水表型号：" prop="reuseMeterModel" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="text" size="mini" v-model="formData.reuseMeterModel" placeholder="水表型号" clearable></el-input>
        <span v-else>{{formData.reuseMeterModel}}</span>
      </el-form-item>
      <el-form-item label="水表口径：" prop="reuseMeterBore" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" v-model="formData.reuseMeterBore" size="mini" placeholder="水表口径" clearable>
          <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
        </el-select>
        <span v-else>{{formData.reuseMeterBore}}</span>
      </el-form-item>

      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>

      <!-- 水表信息 -->
      <!-- 过户模块 水表信息不可修改 -->
      <!-- 去除水表信息 -->
      <!-- <waterMInfo ref="waterMInfo" :editType="waterMEditType" :wayOpen="wayOpen"></waterMInfo> -->

      <legend class="legendColumn">上传附件
        <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
      </legend>
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>

      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv" v-if="workflowShow"></div>
    </el-form>
  </div>
</template>
<script>
import DetailsArrears from "@/components/DetailsArrears/index"; //欠费明细
import uploadFile from "@/components/uploadPic";
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";//用户信息
// import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";//水表信息
export default {
  name: "multiplexingEdit",
  props: ["idCuster", "billStute", "userNo"],
  components: {
    DetailsArrears,
    uploadFile,
    userInfo,
    // waterMInfo,
    billInfo,
  },
  data () {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "USER_REUSE",
      searchBtnShow: true,
      searchUserNum: "",
      formData: {
        id: "",
        ctmNo: "",
        userNo: "",
        sourceFlag: "1", //信息来源
        reuseDate: this.common.date(), //复用日期：
        reuseMeterFlag: 0, //是否复表：
        comments: "", //备注：
        reuseMeterStartNum: "", //起码
        reuseFactoryNo: "", //水表表身码
        reuseMeterNo: "", //水表编码
        reuseMeterModel: "", //水表型号
        reuseMeterBore: "", //水表口径
        changeMeterFlag: 0, // 复装类型
      },
      DetailsArrearsShow: false,
      //打开功能下
      wayOpen: "multiplexing",
      //是否可以填写
      userInfoEditType: 0,
      waterMEditType: 0,
      //单据信息
      billData: {},
      //用户信息
      userData: {},
      //水表信息
      waterMData: {},
      //数据字典
      dictionaryData: [],
      //详情信息
      allData: {},
      approveFlag: 0,
      NotDisabled: false, //是否可编辑
      workflowShow: true,
      meterBoreData: [],
      reuseTypeData: [{ label: '原表复装', value: 1 }, { label: '换表复装', value: 2 }],
      formRules: {
        reuseMeterStartNum: [{reuqired: true, message: "请填写起码", trigger: blur}],
        reuseFactoryNo: [{reuqired: true, message: "请填写表身码", trigger: blur}]
      }
    };
  },
  mounted () {

    this.dictionaryDataOption();
    this.getMeterBoreData();
    this.workflowShow = false;
    if (this.idCuster && this.idCuster.id != "") {
      this.init();
      eventBus.$emit('receiptId', this.idCuster.id)
      this.searchBtnShow = false;
    } else {

      this.searchBtnShow = true;
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId = tempId
      this.getHtmlData()
      if (this.userNo) {
        this.searchUserNum = this.userNo;
        this.initUserNo();
      }
    }
    this.workflowShow = true;

  },
  methods: {
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      //console.log(str);
      return str;
    },
    init () {
      let params = {
        busicode: "ReuseUserQuery",
        data: { id: this.idCuster.id }
      };
      this.$api.fetch({ params })
        .then(res => {
          this.formData = res;
          this.searchUserNum = res.userNo
          this.initUserNo()
          //单据信息
          this.getBillData(res);
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END" ||
            this.formData.processState == 'CANCEL'
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
            this.meterBoreData.forEach(item => {
              if (item.id == this.formData.reuseMeterBore) {
                this.formData.reuseMeterBore = item.boreName;
              }
            })
          }
          if (this.formData.processState == 'register') {
            this.searchBtnShow = true;
          }
          this.getHtmlData()
        });
    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "user_reuse",
        "审批流配置:" +
        _this.formData.processName +
        "(" +
        _this.formData.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.billStute
      );
    },
    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
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
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        clientContractAddr: res.userInfo.clientContractAddr,
        clientContractAddrDetail: res.userInfo.clientContractAddrDetail,
        factoryNo: res.msInfo.factoryNo, //表身码
        meterBjxs: res.userInfo.meterBjxs,// 表井形式
        meterBjxsName: res.userInfo.meterBjxsName, 
        meterBjms: res.userInfo.meterBjms,//表井模式
        meterBjmsName: res.userInfo.meterBjmsName,
        meterSite: res.userInfo.meterSite, // 表位
      };
    },

    getWaterMData (res) {

      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        //setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
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
        fatherMeterNo: res.userInfo.fatherMeterNo //总表编号
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
        shelfLife: res.msInfo.shelfLife //使用期限
      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
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

    dictionaryDataOption (res) {
      // 数据字典
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "PIS"
      };
      this.$api.fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        }).catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    getFormData (res, type) {
      this.getWaterMData(res);
      this.getWMeterData(res);
      this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);

      //水表信息
      //   this.$refs.waterMInfo.init(this.waterMData);
    },

    getFormbData () {
      return this.formData
    },
    // 保存接口
    submit (type) {
      let params = {
        busicode: type,
        data: this.getFormbData()
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        });
        if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
          // 流程中心模块触发
          this.$parent.$parent.closeDialog();
        } else {
          // 普通模块触发
          this.$parent.closeDialog(); // 提交后回调方法
        }
      });
    },
    initUserNo () {
      //用户编号查询
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let status = '8'
      if (this.formData.processState == "END") {
        status = ''
      }
      let data = {
        userNo: this.searchUserNum,
        status: status
      };
      let params = {
        busicode: "UserSelect",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.allData = res;
          this.formData.ctmNo = res.ctmInfo.ctmNo
          this.formData.userNo = res.userInfo.userNo
          if (this.formData.changeMeterFlag == 0 && this.formData.reuseFactoryNo == "") {
            this.formData.reuseFactoryNo = res.msInfo.factoryNo;
            this.formData.reuseMeterStartNum = res.userInfo.lastReadingNum;
            this.formData.reuseMeterNo = res.userInfo.meterNo;
            this.queryWaterMeter();
          }
          this.getFormData(res)
          this.$refs.uploadFiles.editUserNo(res.userInfo.userNo)
        }).catch(err => {
          this.clearInfo();
        });
    },
    closeDialog () {
      //关闭会话
      this.DetailsArrearsShow = false;
      this.init();
    },
    //水表表身号查询
    queryWaterMeter () {
      if(this.NotDisabled){ // 审批时不查询，直接使用后端返回值
        return;
      }
      if (!this.formData.reuseFactoryNo) {
        this.$message.error('请填写水表表身号！')
        return
      }
      var reg = new RegExp(' ', "g")
      var reg2 = new RegExp('\\t', "g")
      this.formData.reuseFactoryNo = this.formData.reuseFactoryNo.replace(reg, '');
      this.formData.reuseFactoryNo = this.formData.reuseFactoryNo.replace(reg2, '');
      let _this = this
      let params = {
        busicode: "MsInfoList",
        data: {
          factoryNo: this.formData.reuseFactoryNo
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        if (res.list.length > 0) {
          this.$set(this.formData, "reuseMeterNo", res.list[0].meterNo);
          this.$set(this.formData, "reuseMeterModel", res.list[0].meterModel);
          this.$set(this.formData, "reuseMeterBore", res.list[0].meterBore);
        } else {
          this.$message.warning('该水表表身号不存在！')
          this.$set(this.formData, "reuseMeterNo", "");
          this.$set(this.formData, "reuseMeterModel", "");
          this.$set(this.formData, "reuseMeterBore", "");
        }
      })
    },
    clearInfo () {
      this.formData.reuseMeterStartNum = "";
      this.formData.comments = "";
      this.formData.reuseFactoryNo = "";
      this.formData.reuseMeterModel = "";
      this.formData.reuseMeterNo = "";
      this.formData.reuseMeterBore = "";
      this.getFormData({
        userInfo: {},
        accountInfo: {},
        msInfo: {},
        ctmInfo: {}
      });
    },
    meterModelSearch (queryString, cb) {
      let params = {
        busicode: "MsMeterModelSelect",
        data: {
          page: 1,
          pageCount: 100,
          fuzzyQuery: queryString
        }
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        cb(res);
      })
    },
    getMeterBoreData () {
      let params = {
        busicode: "MeterBoreList",
        data: {
          page: 1,
          pageCount: 999
        }
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.meterBoreData = res.list
      })
    },
    reuseTypeChange (val) {
      if (val == 0) { //原表复装,使用原来的水表
        if (this.allData && this.allData.msInfo) {
          this.formData.reuseMeterStartNum = this.allData.userInfo.lastReadingNum;
          this.formData.reuseFactoryNo = this.allData.msInfo.factoryNo;
          this.queryWaterMeter();
        }
      } else if (val == 1) {
        this.$set(this.formData, "reuseFactoryNo", "");
        this.$set(this.formData, "reuseMeterNo", "");
        this.$set(this.formData, "reuseMeterModel", "");
        this.$set(this.formData, "reuseMeterBore", "");
        this.$set(this.formData, "reuseMeterStartNum", "");
      }
    },
  }
};
</script>

<style lang="scss">
.multiplexingEdit {
  height: 100%;
  .reuseTypeRadio {
    width: 200px !important;
  }
}
</style>

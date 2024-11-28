<template>
  <div class="ComparisonTableEdit">

    <el-form :model="formData" ref="form" :rules="rules" class="formBill" :inline="true" :disabled="NotDisabled" size="mini" label-width="130px">

      <el-form-item style="margin-top:1%" label="用户编号：" v-if="searchBtnShow" class="width-250">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="searchUserNum" placeholder="请输入户号" @change="initUserNo" clearable>
          <el-button slot="append" class="searchBtn scanning-btn" @click="initUserNo" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo" :editType="0"></billInfo>
      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>

      <!-- 水表信息 -->
      <waterMInfo ref="waterMInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></waterMInfo>

      <legend class="legendColumn">复核信息</legend>
      <!-- <el-form-item label="支付押金：" prop="deposit">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.deposit" placeholder="请输入" type="text"
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
      </el-form-item> -->
      <el-form-item label="备注：" class="f2" prop="comments">
        <el-input type="textarea" v-model="formData.comments" size="mini" :rows="2" clearable placeholder="请输入"></el-input>
      </el-form-item>
       <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>

  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";//用户信息
import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";//水表信息
export default {
  name: "ComparisonTableEdit",
  props: ["editNeedData", "userNo"],
  components: {
    uploadFile,
    userInfo,
    waterMInfo,
    billInfo,
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_verify",
      tempId:"",
      searchBtnShow: true,
      searchUserNum: "",
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      formData: {
       // deposit: '',
        comments: '',
      },
      //打开功能下
      wayOpen: "ComparisonTable",
      //是否可以填写
      userInfoEditType: 0,
      //单据信息
      billData: {},
      //水表信息
      waterMData: {},
      // 用户信息数据
      userData: {
        ctmInfo: {},
        msInfo: {},
        userInfo: {},
      },
      // 表单校验
      rules: {
        // deposit: [
        //   { required: true, message: '请输入支付押金', trigger: 'blur' },
        // ],
        comments: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
      },
      operationShow: 1,
      operation: 0,
    };
  },
  mounted() {
    this.tempId = this.util.generateUUID()
    eventBus.$emit('receiptId', this.tempId)
    this.getHtmlData();
    if(this.userNo) {
      this.searchUserNum=this.userNo;
      this.initUserNo()
    }
  },
  methods: {

    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_verify",
        "审批流配置:" +
        _this.formData.processStateName +
        "(" +
        _this.formData.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.editNeedData.busicode
      );
    },
    initUserNo() {
      //用户编号查询
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: this.searchUserNum,
        status: ""
      };
      let params = { busicode: "UserSelect", data };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.formData.ctmNo = res.ctmInfo.ctmNo
          this.formData.userNo = res.userInfo.userNo
          this.formData.meterNo = res.userInfo.meterNo
          this.formData.installDate = res.userInfo.setupMeterDate
          this.getFormData(res)
        });
    },

    getFormData(res, type) {
      this.getWaterMData(res);
      this.getWMeterData(res);
      this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);
      //水表信息
      this.$refs.waterMInfo.init(this.waterMData);
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },

    getUserData(res) {
      // 用户信息
      // this.userData = {
      //   userNo: res.userInfo.userNo, //用户编号
      //   lockFlag: res.userInfo.lockFlag, //锁定状态
      //   status: res.userInfo.status, //用户状态
      //   houseCert: res.userInfo.houseCert, //户口簿号
      //   comments: res.userInfo.comments, //备注
      //   fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限

      //   reformFlag: res.userInfo.reformFlag, //户表改造标记
      //   contractNo: res.userInfo.contractNo, //合同编号
      //   contractAddr: res.userInfo.contractAddr, //合同地址
      //   contractDate: res.userInfo.contractDate, //合同日期
      //   businessAbodeName: res.userInfo.businessAbodeName, //营业所
      //   businessAbode: res.userInfo.businessAbode, //营业所
      //   adminAreaName: res.userInfo.adminAreaName, //行政区域
      //   adminArea: res.userInfo.adminArea, //行政区域
      //   businessAreaName: res.userInfo.businessAreaName, //营业区域
      //   businessArea: res.userInfo.businessArea, //营业区域
      //   tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
      //   tradeClassify: res.userInfo.tradeClassify, //行业分类
      //   openDate: res.userInfo.openDate, //立户日期
      //   stopDate: res.userInfo.stopDate, //停用日期
      //   cancelDate: res.userInfo.cancelDate, //注销日期
      //   useTimeLimit: res.userInfo.useTimeLimit //用水期限
      // };

      this.userData = res.userInfo
    },

    getWaterMData(res) {
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
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
	      transmissionName: res.msInfo.transmissionName,//是否远传
        meterSensorName: res.msInfo.meterSensorName, //水表传感器
        meterSensor: res.msInfo.meterSensor, //水表传感器
        maxValue: res.msInfo.maxValue, //满码值
        shelfLife: res.msInfo.shelfLife //使用期限
      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
    },
    getFormbData() {
      let data = {
        userNo: this.formData.userNo,
        meterNo: this.formData.meterNo,
        installDate: this.formData.installDate,
       // deposit: this.formData.deposit,
        comments: this.formData.comments,
      }
      return data
    },
    // 暂存按钮（添加）
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var _this = this
          var params = {
            "busicode": this.editNeedData.busicode,
            "data": {
              userNo: _this.formData.userNo,
              meterNo: _this.formData.meterNo,
              installDate: _this.formData.installDate,
             // deposit: _this.formData.deposit,
              comments: _this.formData.comments,
              tempId: _this.tempId,
            }
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            });
            if (window.location.href.indexOf('HallBusiness') > 0) {// 工作台页面进入执行以下代码
              _this.$parent.$parent.closeDialog()
            } else {
              _this.$parent.closeDialog()
            }
          })
        } else {

          return false;
        }
      });
    },
    stepActive(val) {
      this.operationShow = val;
      this.operation = val - 1;
    }
  }
};
</script>
<style lang="scss" scoped>
// @import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.ComparisonTableEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
  .formBill{
    float: none;
    .width-250 {
      width: 400px;
      margin-top: 4px;
    }
  }
}
</style>

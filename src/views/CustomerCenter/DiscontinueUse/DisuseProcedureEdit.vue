
<template>
  <div class="DisuseProcedureEdit">
    <!-- 弹出表单明细 -->
    <el-dialog
      title="欠费明细"
      :close-on-click-modal="false"
      :visible.sync="TransferDetailsVisible"
      class="TransferDetails"
      @close="closeDialog"
      append-to-body
    >
      <DetailsArrears ref="DetailsArrears"></DetailsArrears>
    </el-dialog>
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :disabled="NotDisabled"
      :model="formData"
      label-width="130px"
      ref="ruleForm"
      :rules="rules"
    >
      <el-form-item style="margin-top:1%" label="用户编号：" v-if="searchBtnShow" class="width450">
        <el-input
          class="read-only"
          v-model="searchUserNum"
          placeholder="请输入户号"
          @change="initUserNo"
          clearable
          @keydown.enter.native="initUserNo"
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
      <!-- 单据信息 -->
      <billInfo v-if="billStute=='StopUserUpdate'" ref="billInfo" :editType="0"></billInfo>

      <legend class="legendColumn">停用信息</legend>

      <el-form-item label="信息来源：" :class="{'disable-item': NotDisabled}">
        <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="multiplexingEditForm.sourceFlag" clearable placeholder="" disabled class="read-only"></el-input> -->
        <el-select v-if="!NotDisabled" clearable v-model="formData.sourceFlag" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.PIS"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.sourceFlagName}}</span>
      </el-form-item>
      <el-form-item label="停用日期：" prop="stopDate" :class="{'disable-item': NotDisabled}">
        <el-date-picker
          v-if="!NotDisabled"
          v-model="formData.stopDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <span v-else>{{formData.stopDate}}</span>
      </el-form-item>
      <el-form-item label="是否拆表：" prop="chabsplitMeterFlag" :class="{'disable-item': NotDisabled}">
        <el-radio-group v-if="!NotDisabled" v-model="formData.splitMeterFlag" @change="changeHandler">
          <el-radio label=1>是</el-radio>
          <el-radio label=0>否</el-radio>
        </el-radio-group>
        <span v-else>{{ formData.splitMeterFlag == 1 ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="复表时限：" prop="reuseTimeLimit" :class="{'disable-item': NotDisabled}">
        <el-date-picker
          v-if="!NotDisabled"
          v-model="formData.reuseTimeLimit"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
        <span v-else>{{formData.reuseTimeLimit}}</span>
      </el-form-item>
          <!-- <el-form-item label="用户状态：" prop="status"  :class="{'disable-item': NotDisabled}"> -->
        <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="multiplexingEditForm.sourceFlag" clearable placeholder="" disabled class="read-only"></el-input> -->
        <!-- <el-select v-if="!NotDisabled"  clearable v-model="formData.status" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.CUS"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.statusName}}</span>
      </el-form-item> -->
      <el-form-item label="停用类型：" prop="stopType" :disabled="NotDisabled" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.stopType" placeholder="请选择停用类型" @change="stopTypeChange">
          <el-option
            v-for="(item,index) in stopTypeData"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.stopType == 1 ? '欠费拆表' : '用户报停'}}</span>
      </el-form-item>

      <!-- <el-form-item label="拆表类型：" v-if="formData.splitMeterFlag==1" prop="splitMeterWay" :disabled="NotDisabled" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.splitMeterWay" placeholder="请选择拆表类型">
          <el-option
            v-for="(item,index) in dictionaryData.MRM"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.splitMeterWayName}}</span>
      </el-form-item> -->
      <el-form-item label="停用说明：" class="Remarks" prop="splitMeterRemark" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.splitMeterRemark" placeholder></el-input>
        <span v-else>{{formData.splitMeterRemark}}</span>
      </el-form-item>

      <!-- 拆表信息 -->
      <legend class="legendColumn"  v-if="formData.splitMeterFlag==1">拆表信息</legend>
      <el-form-item label="水表止码：" class="meterEndNum" prop="meterEndNum" :class="{'disable-item': NotDisabled}"  v-if="formData.splitMeterFlag==1">
        <el-input v-if="!NotDisabled" type="text" v-model="formData.meterEndNum" placeholder="水表止码" clearable></el-input>
        <span v-else>{{formData.meterEndNum}}</span>
      </el-form-item>
      <el-form-item label="旧表处理方式：" :class="{'disable-item': NotDisabled}"  v-if="formData.splitMeterFlag==1">
          <el-select v-if="!NotDisabled" v-model="formData.oldMeterType" placeholder="旧表处理方式">
              <el-option v-for="item in oldMeterTypeOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <span v-else>{{formData.oldMeterType == 1 ? "作废":"入库"}}</span>
      </el-form-item>


      <!-- 用户信息 -->
      <userInfo ref="userInfo" :addWay="Disabled" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>

      <!-- 水表信息 -->
      <!-- 过户模块 水表信息不可修改 -->
      <!-- 去除水表信息 -->
      <!-- <waterMInfo ref="waterMInfo" :addWay="Disabled"  :editType="waterMEditType" :wayOpen="wayOpen"></waterMInfo> -->

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
import uploadFile from "@/components/uploadPic";
import DetailsArrears from "@/components/DetailsArrears/index"; //欠费明细
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
// import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo"; //水表信息
export default {
  name: "DisuseProcedureEdit",
  props: ["idCuster", "billStute","userNo"],
  components: {
    uploadFile,
    DetailsArrears,
    userInfo,
    // waterMInfo,
    billInfo
  },
  data() {
    return {
      Disabled:true,//不可编辑
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "USER_STOP",
      searchBtnShow: true,
      searchUserNum: "",
      //表单数据
      formData: {
        status:"2",
        id: "",
        ctmNo: "",
        userNo: "",
        sourceFlag: "1", //信息来源
        stopDate: this.common.date(), //停用日期
        splitMeterFlag: "0", //是否拆表
        reuseTimeLimit: "", //复表时限
        splitMeterWay: "", //拆表类型
        splitMeterRemark: "", //拆表原因
        oldMeterType: 0, //旧表处理方式
        meterEndNum: "", //水表止码
        stopType: 0, // 停用类型
      },
      TransferDetailsVisible: false,
      //打开功能下
      wayOpen: "DiscontinueUse",
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
      //用户信息
      allData: {},
      approveFlag: 0,
      NotDisabled: false, //是否可编辑
      workflowShow:true,
      rules:{
        // status:[{ required:true, message:"请选择用户状态", trigger: 'change'}],
        splitMeterRemark:[{ required:true, message:"停用说明不能为空", trigger: 'blur'}],
        stopType: [{ required:true, message:"停用类型不能为空", trigger: 'blur'}],
      },
      oldMeterTypeOptions: [{label: '入库', value: 0},{label: '作废', value: 1}], // 旧表处理方式
      stopTypeData: [{name: '用户报停', value: 0},{name: '欠费拆表', value: 1}], // 停用类型
    };
  },

  mounted() {
    this.dictionaryDataOption();
    this.workflowShow=false;

    if (this.idCuster && this.idCuster.id!="") {
      this.searchBtnShow = false;
      this.changeMattersShow = true;
      this.init();
       eventBus.$emit('receiptId', this.idCuster.id)
    } else {
      this.searchBtnShow = true;
      this.changeMattersShow = false;
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId = tempId
      this.getHtmlData();
      if(this.userNo){
        this.searchUserNum=this.userNo;
        this.initUserNo();
      }
    }

    this.workflowShow=true;
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let params = {
        busicode: "StopUserQuery",
        data: { id: this.idCuster.id }
      };
      this.$api.fetch({ params }).then(res => {
        this.formData = res;
        this.formData.splitMeterFlag = this.formData.splitMeterFlag + ''
        this.searchUserNum = res.userNo;
        this.initUserNo();
        //单据信息
        this.getBillData(res);
        if (
          this.formData.processState == "approval" ||
          this.formData.processState == "END" ||
          this.formData.processState == 'CANCEL'
        ) {
          this.NotDisabled = true;
          this.approveFlag = 1;
        }
        if (this.formData.processState == "register") {
          this.searchBtnShow = true;
        }
        this.getHtmlData();
      });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "user_stop",
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
          if (window.location.href.indexOf("HallBusiness") > 0 ||window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
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
    changeHandler(val){
      if(Number(val)===1){
        // this.$set(this.rules,'splitMeterWay',[{ required:true, message:"拆表类型不能为空", trigger: 'change'}])
        this.$set(this.formData, 'oldMeterType', 0);
        this.$set(this.formData, 'meterEndNum', this.allData.userInfo.lastReadingNum);
      }else{
        // this.$delete(this.rules,'splitMeterWay')
        this.$set(this.formData, 'meterEndNum', '');
        this.$set(this.formData, 'oldMeterType', '');
      }
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
        oldUserNo: res.userInfo.oldUserNo, //旧用户编号
      };
    },

    getWaterMData(res) {
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        //setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：迁移到userData
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        setupMeterLocationName: res.userInfo.setupMeterLocationName, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途：
        meterUseName: res.userInfo.meterUseName, //水表用途：
        useWaterObject: res.userInfo.useWaterObject, //用水对象：
        useWaterObjectName: res.userInfo.useWaterObjectName, //用水对象中文：
        meterType: res.userInfo.meterType, //水表类型：
        meterTypeName: res.userInfo.meterTypeName, //水表类型：
        setupMeterDate: res.userInfo.setupMeterDate, //装表日期：
        changeMeterDate: res.userInfo.changeMeterDate, //换表日期：
        splitMeterDate: res.userInfo.splitMeterDate, //拆表日期：
        splitMeterWay: res.userInfo.splitMeterWay, //拆表类型：
        splitMeterWayName: res.userInfo.splitMeterWayName, //拆表类型：
        fatherMeterNo: res.userInfo.fatherMeterNo, //总表编号
        factoryNo: res.msInfo.factoryNo, //表身码
        meterBjxs: res.userInfo.meterBjxs,// 表井形式
        meterBjxsName: res.userInfo.meterBjxsName, 
        meterBjms: res.userInfo.meterBjms,//表井模式
        meterBjmsName: res.userInfo.meterBjmsName,
        meterSite: res.userInfo.meterSite, // 表位
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

    dictionaryDataOption(res) {
      // 数据字典
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "PIS,MRM,CUS"
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    getFormData(res) {
      this.getWaterMData(res);
      this.getWMeterData(res);
      this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);
      //水表信息
      // this.$refs.waterMInfo.init(this.waterMData);
    },
    getFormbData() {
      return this.formData;
    },

    // 保存接口
    submit(type) {
      let validflag=false;
      this.$refs.ruleForm.validate((valid)=>{
        if(!valid){
          validflag=true
        }
      })
      if(validflag){
        this.$notify({
          title: "警告",
          message: "必填项未完善",
          type: "warning"
        });
        return;
      }
      let params = {
        busicode: type,
        data: this.getFormbData()
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success"
        });
        if (window.location.href.indexOf("HallBusiness") > 0 ||window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            this.$parent.closeDialog(); // 提交后回调方法
          }
      });
    },
    initUserNo() {
      //用户编号查询
      let _this = this;
      if (_this.searchUserNum == "") {
        _this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let status =9
      if (this.formData.processState == "END") {
        status = ''
      }
      let data = {
        userNo: _this.searchUserNum,
        status: status,//状态为9查询除销户以外的
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
          this.formData.ctmNo = res.ctmInfo.ctmNo;
          this.formData.userNo = res.userInfo.userNo;
          this.getFormData(res);
          this.getDataLength();
          this.$refs.uploadFiles.editUserNo(res.userInfo.userNo)
        });
    },
    closeDialog() {
      //关闭会话
      this.TransferDetailsVisible = false;
      this.init();
    },
    Details() {
      this.TransferDetailsVisible = true;
    },
    getDataLength() {
      let params = {
        busicode: "ChargeLackDetail",
        data: {
          userNo: this.searchUserNum
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (res.length > 0) {
            this.$notify({
              title: "费用未结清提醒",
              message: "此用户费用未结清！",
              type: "warning"
            });
          }
        });
    },
    stopTypeChange(val){
    },
  }
};
</script>

<style lang="scss" scoped>
.DisuseProcedureEdit{
  .search-btn {
    .el-form-item__content {
      .el-input {
        width: 70% !important;
      }
    }
  }
}
</style>




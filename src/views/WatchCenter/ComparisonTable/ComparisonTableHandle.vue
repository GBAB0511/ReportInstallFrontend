<template>
  <div class="ComparisonTableHandle process">
    
    <!-- 弹出表单选择水表 -->
    <el-dialog title="水表选择" v-if="waterChooseVisible" :visible.sync="waterChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="SelectWaterClose">
      <SelectWaterTable ref="SelectWaterTable" waterChooseType='chooseNewMater' :formType='formType'></SelectWaterTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="getWaterNum">确 定</el-button>
        <el-button type="info" size="mini" plain @click="SelectWaterClose">取 消</el-button>
      </div>
    </el-dialog>

    <div class="process-left">
      <el-form :disabled="NotDisabled" :model="formData" ref="form" :show-message="false"   class="formBill" :inline="true" size="mini" label-width="130px">
        <!-- 单据信息 -->
        <el-form-item label="用户编号：" v-if="searchBtnShow" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  style="margin-top:1%" class="read-only" v-model="searchUserNum" placeholder="请输入户号"  @change="initUserNo"  clearable  >
            <el-button slot="append" class="searchBtn scanning-btn"  @click="initUserNo" icon="el-icon-search" ></el-button>
          </el-input>
        </el-form-item>
        <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo" :editType="0"></billInfo>     
        <!-- 用户信息 -->
        <userInfo ref="userInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>
        <!-- 登记信息 -->
        <div  v-show="operationShow == 'register'">
          <!-- 水表信息 -->
          <waterMInfo ref="waterMInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></waterMInfo>
          <legend class="legendColumn">复核信息</legend>
            <el-form-item label="支付押金：" prop="deposit" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.msVerify.deposit" placeholder="请输入" type="text"
              onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
              onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
              <span v-else>{{formData.msVerify.deposit}}</span>
            </el-form-item>
            <el-form-item label="备注：" class="f2" prop="comments" :class="{'disable-item': NotDisabled}">
              <el-input v-if="!NotDisabled" type="textarea" v-model="formData.msVerify.comments" size="mini" :rows="2" clearable placeholder="请输入"></el-input>
              <span v-else>{{formData.msVerify.comments}}</span>
            </el-form-item>
        </div>
        <!-- 换表信息 -->

        <div  v-if="operationShow == 'changeInfo'">
          <legend class="legendColumn">换表信息</legend>
            <el-form-item label="原表底码：" :class="{'disable-item': NotDisabled}">
              <template v-if="!NotDisabled">
                 <el-tooltip class="item" effect="dark" content="请上传底码照片" placement="top-start">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.msVerify.oldMeterNum" placeholder="请输入原表底码">
                    <el-button slot="append" icon="el-icon-upload2" type="primary" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                  </el-input>
                </el-tooltip>
              </template>
             <span v-else>{{formData.msVerify.oldMeterNum}}</span>
            </el-form-item>

            <el-form-item label="临时表起码：" :class="{'disable-item': NotDisabled}">
              <template v-if="!NotDisabled">
                <el-tooltip class="item" effect="dark" content="请上传起码照片" placement="top-start">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.msVerify.tempMeterStartNum" placeholder="请输入临时表起码">
                    <el-button slot="append" icon="el-icon-upload2" type="primary" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                  </el-input>
                </el-tooltip>
              </template>
              <span v-else>{{formData.msVerify.tempMeterStartNum}}</span>
            </el-form-item>

            <el-form-item label="水表编号：" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.userInfo.meterNo" placeholder=""  @focus="SelectWaterShow"></el-input>
              <span v-else>{{formData.userInfo.meterNo}}</span>
            </el-form-item>

            <el-form-item label="换表日期：" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-if="!NotDisabled" v-model="formData.msVerify.replaceDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.msVerify.replaceDate}}</span>
            </el-form-item>

            <el-form-item label="装表地址：" class="f2" :class="{'disable-item': NotDisabled}">
              <el-input v-if="!NotDisabled" type="textarea" v-model="formData.msVerify.installAddr" :rows="2" placeholder=""></el-input>
              <span v-else>{{formData.msVerify.installAddr}}</span>
            </el-form-item>
        </div>

        <!-- 校核信息 -->
        <div  v-if="operationShow == 'checkInfo'">
          <legend class="legendColumn">校核信息</legend>
            <el-form-item label="校核人：" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.msVerify.checkStaffName" placeholder=""></el-input>
              <span v-else>{{formData.msVerify.checkStaffName}}</span>
            </el-form-item>
            <el-form-item label="校核日期：" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-if="!NotDisabled" v-model="formData.msVerify.checkDate" type="date" placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.msVerify.checkDate}}</span>
            </el-form-item>

            <el-form-item label="校核结果：" :class="{'disable-item': NotDisabled}">
              <el-select v-if="!NotDisabled" v-model="formData.msVerify.checkResult" placeholder="正常" >
                  <el-option v-for="item in dictionaryData.RCN" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.msVerify.checkResultName}}</span>
            </el-form-item>

            <el-form-item label="备注：" class="f3" :class="{'disable-item': NotDisabled}">
              <el-input v-if="!NotDisabled" type="textarea" v-model="formData.msVerify.comments" :rows="2" placeholder="备注"></el-input>
              <span v-else>{{formData.msVerify.comments}}</span>
            </el-form-item>
        </div>

        <!-- 处理信息 -->
        <div  v-if="operationShow == 'handleInfo'">
          <legend class="legendColumn">处理信息</legend>
            <div v-if="resultShow" :model="formData.msVerify">
              <div style="padding: 5px 40px;color: #b5bbb5;">检验结果正常，换回原水表</div>
              <el-form-item label="装表地址：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.msVerify.installAddr" placeholder=""></el-input>
                <span v-else>{{formData.msVerify.installAddr}}</span>
              </el-form-item>

              <el-form-item label="水表编号：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.userInfo.meterNo"  placeholder=""></el-input>
                <span v-else>{{formData.userInfo.meterNo}}</span>
              </el-form-item>
            </div>

              <div v-else :model="formData">
                <div style="padding: 5px 40px;color: #b5bbb5;">检验结果异常，退回押金</div>
                <el-form-item label="旧表处理方式：" size="mini" prop="oldHandleWay" :class="{'disable-item': NotDisabled}">
                  <el-select v-if="!NotDisabled" v-model="formData.msVerify.oldHandleWay" placeholder="请选择">
                    <el-option v-for="item in dictionaryData.OMD" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                  <span v-else>{{formData.msVerify.oldHandleWayName}}</span>
                </el-form-item>

                <el-form-item label="退款方式：" style="width: 40%">
                  <el-radio v-model="formData.msVerify.cashPledgeRefundWay" label="1">转余额</el-radio>
                  <el-radio v-model="formData.msVerify.cashPledgeRefundWay" label="2">现金</el-radio>
                  <el-radio v-model="formData.msVerify.cashPledgeRefundWay" label="3">转账</el-radio>
                </el-form-item>
              </div>
        </div>
        <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
        <!-- 审批信息 -->
        <div  v-if="operationShow == 'approval'">
        </div>

        <legend class="legendColumn">流程处理</legend>
        <div id="workflowDiv"></div>
      </el-form>
    </div>

    <div class="StepCollapse" @click="collapse">
      <i class="el-icon-arrow-right leftChange"></i>
    </div>
    <div class="process-right" v-if="approvalShow">
      <div class="stepsTitle">流程信息</div>
      <div class="line"></div>
      <el-steps :active="operation" direction="vertical" finish-status="success">
        
        <el-step title="登记信息" @click.native="stepActive(1,'register')"></el-step>
        <el-step title="换表信息" @click.native="stepActive(2,'changeInfo')"></el-step>
        <el-step title="校核信息" @click.native="stepActive(3,'checkInfo')"></el-step>
        <el-step title="处理信息" @click.native="stepActive(4,'handleInfo')"></el-step>
        <!-- <el-step title="处理审批" @click.native="stepActive(5,'approval')"></el-step> -->
      </el-steps>
    </div>

  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";//用户信息
import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";//水表信息
import SelectWaterTable from "@/components/SelectWaterTable";//选择水表
export default {
  name: "ComparisonTableHandle",
  props: ['editNeedData'],
  components: {
    uploadFile,
    userInfo,
    waterMInfo,
    billInfo,
    SelectWaterTable,//选择水表
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_verify",
      //选择水表
      waterChooseVisible: false,
      //选择水表 弹框类型
      formType: 'ChangeTablesHandle',
      //选择水表 选择数据获取类型
      waterChooseType: '',
      searchBtnShow: true,
      searchUserNum: "A0005271",
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //打开功能下
      wayOpen: "ComparisonTable",
      //是否可以填写
      userInfoEditType: 0,
      //单据信息
      billData: {},
      //水表信息
      waterMData: {},
      // 数据字典
      dictionaryData: {},
      // 用户信息数据
      userData: {
        ctmInfo: {},
        msInfo: {},
        userInfo: {},
      },
      // 所有信息数据
      formData: {
        ctmInfo: {},
        msInfo: {},
        userInfo: {},
        msVerify: {},
      },
      approvalShow: true,
      resultShow: true,
      operationShow: 0,
      operation: 0,
    };
  },
  mounted() {
    this.init()
    eventBus.$emit('receiptId', this.editNeedData.id)
    this.getDictionary()
  },
  methods: {
    // 数据字典（查询框）
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "OMD,PBT,RCN" // 旧表处理方式、退款方式
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 初始化
    init(type) {
      var _this = this
      var params = {
        "busicode": "MsVeriQuery",
        "data": {  id:_this.editNeedData.id }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.operationShow = res.msVerify.processState
        this.formData = res;
        this.initUserNo(res.userInfo.userNo)
        this.getHtmlData()
        this.getBillData(res.msVerify)
      })
    },
    initUserNo(val) {
      //用户编号查询
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let params = { busicode: "UserSelect", data: {userNo: this.searchUserNum,  status: ""}};
      if(val){
        params.data.userNo = val
      }
      this.$api.fetch({ params  })
        .then(res => {
          this.formData.ctmNo = res.ctmInfo.ctmNo
          this.formData.userNo = res.userInfo.userNo
          this.formData.meterNo = res.userInfo.meterNo
          this.formData.installDate = res.userInfo.setupMeterDate
          this.getFormData(res)
        });
    },
    getFormbData(){
      let data = {
        id:this.editNeedData.id,
        userNo: this.formData.userNo,
        meterNo: this.formData.userInfo.meterNo,

        installDate: this.formData.installDate,
        deposit: this.formData.msVerify.deposit,
        comments: this.formData.msVerify.comments,

        oldMeterNum: this.formData.msVerify.oldMeterNum,
        tempMeterStartNum: this.formData.msVerify.tempMeterStartNum,
        replaceDate: this.formData.msVerify.replaceDate,
        checkStaffName: this.formData.msVerify.checkStaffName,
        checkDate: this.formData.msVerify.checkDate,
        checkResult: this.formData.msVerify.checkResult,

        oldHandleWay: this.formData.msVerify.oldHandleWay,
        cashPledgeRefundWay: this.formData.msVerify.cashPledgeRefundWay,

      }
      return data
    },
    getFormData(res) {
        this.getWaterMData(res);
        this.getWMeterData(res);
        this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);
      // 水表信息
      this.$refs.waterMInfo && this.$refs.waterMInfo.init(this.waterMData);
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      if (this.editNeedData.saveType == 'edit') {
        this.$refs.billInfo.init(this.billData);
      }
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
      };
    },

    getWaterMData(res) {
      console.log(res)
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        //setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途： 
        useWaterObject: res.userInfo.useWaterObject, //用水对象：
        meterType: res.userInfo.meterType, //水表类型：
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
        factoryNo: res.msInfo.factoryNo,//水表表身号
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
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_verify",
        "审批流配置:" +
        _this.formData.msVerify.processStateName +
        "(" +
        _this.formData.msVerify.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.msVerify.id, // 任务id
        _this.formData.msVerify.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
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
    collapse() {
      if (this.approvalShow == true) {
        this.approvalShow = false;
        this.util.approvalShow(
          this.approvalShow,
          ".process-left",
          ".process-right",
          ".StepCollapse",
          ".leftChange"
        );
      } else {
        this.approvalShow = true;
        this.util.approvalShow(
          this.approvalShow,
          ".process-left",
          ".process-right",
          ".StepCollapse",
          ".leftChange"
        );
      }
    },
    stepActive(val,step){
      this.operationShow = step;
      this.operation = val-1;
    },
    

    getWaterNum(){
      
      this.formData.userInfo.meterNo = this.$refs.SelectWaterTable.selectData[0].meterNo
      this.SelectWaterClose()
    },
    // 选择水表弹出框取消按钮
    SelectWaterClose() {
      this.waterChooseVisible = false;
    },
    // 选择水表弹出框确定按钮
    SelectWaterShow() {
      this.waterChooseVisible = true;
    },
  },
  
  watch: {
    operationShow(newVal,oldVal){
      if (this.editNeedData.processState == newVal||this.editNeedData.processState == '') {
        this.NotDisabled = false//可修改
        if(this.editNeedData.processState == ''||this.editNeedData.processState == 'register'){
          this.searchBtnShow = true;
        }
        this.searchBtnShow = false;
        // 不同的业务节点
      }else{
        this.NotDisabled = true//不可修改
          this.searchBtnShow = false;
      }

      if (newVal == 'END') {
          this.operation = 0;
          this.NotDisabled = true;
          this.operationShow = 'register'
      }else if(newVal == 'CANCEL'){
          this.operation = 0;
          this.NotDisabled = true;
          this.operationShow = 'register'
      }else{
        // 校表登记：register
        // 换表信息：changeInfo
        // 校核信息：checkInfo
        // 处理信息：handleInfo
        // 处理审批：approval
        if (newVal == 'changeInfo') {//换表信息
          this.operation = 1;
        }else if( newVal == 'checkInfo'){//校核信息
          this.operation = 2;
        }else if( newVal == 'handleInfo'){//处理信息
          this.operation = 3;
          this.formData.msVerify.checkResult =='1'?this.resultShow = true:this.resultShow = false
          this.getDictionary()
        }else if( newVal == 'approval'){//处理审批
          this.operation = 3;
          this.NotDisabled = true;
          this.approveFlag == 1
        }else if( newVal == 'register'|| newVal == ''){//登记
          this.operation = 0;
          this.operationShow = 'register'
          
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ComparisonTableHandle {
  height: calc(100% - 41px);
  .formBill {
    height: auto;
    overflow-y: auto;
    float: none;
    width: 100%;
    .width-250 {
      width: 400px;
      margin-top: 4px;
    }
  }
}
</style>

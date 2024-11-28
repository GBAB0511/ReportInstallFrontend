<template>
  <div class="engineerApprovalEdit process">
    <div class="process-left">
      <el-tabs type="border-card" tab-position="top" v-model="activeName">
        <el-tab-pane label="基础信息" name='basic'>

          <!-- 工程信息 -->
          <engineer-info @sonPjType="getSonPjType" @getPdfList = "getPdfList" @getPjType = "getPjType" v-if="operation === 0 || operation === 1" ref="engineerInfo" :dict="{PSZ: dictionaryData.PSZ,PPT: dictionaryData.PPT, UWD: dictionaryData.UWD, EGD: dictionaryData.EGD,PIS:dictionaryData.PIS}" :editData="editData.engineerInfo" :tempid="tempid" :disabled="!!editData.processState && editData.processState !== '' && editData.processState !== 'register'||overruleFlag==1" :operation="operation" :currentStep="currentStep"></engineer-info>
          <!-- 客户信息 -->
          <ctm-info v-if="operation === 0 || operation === 1" ref="ctmInfo" :dict="{CTT: dictionaryData.CTT, CDL: dictionaryData.CDL, IDT: dictionaryData.IDT}" :editData="editData.ctmInfo" :disabled="!!editData.processState && editData.processState !== '' && editData.processState !== 'register'||overruleFlag==1" :currentStep="currentStep"></ctm-info>
          <!-- 账户信息 -->
          <account-info v-if="(operation === 0 || operation === 1) && showAccountInfo" ref="accountInfo" :dict="{ACT: dictionaryData.ACT, BPW: dictionaryData.BPW, SDW: dictionaryData.SDW}" :editData="editData.accountInfo" :disabled="!!editData.processState && editData.processState !== '' && editData.processState !== 'register' && editData.processState === 'infoApproval'"></account-info>
          <!-- 开票信息 -->
          <invoice-info v-if="operation === 0 || operation === 1" ref="invoiceInfo" :dict="{BBT: dictionaryData.BBT}" :editData="editData.invoiceInfo" :disabled="!!editData.processState && editData.processState !== '' && editData.processState !== 'register' && editData.processState === 'infoApproval'"></invoice-info>
          <!-- 勘察邀约.勘察接受 -->
          <send-orders v-if="operation === 2" ref="sendOrders" :editData="editData.sendOrders" :disabled="editData.processState !== 'invitationSurvey'"></send-orders>
          <!-- 施工勘察 -->
          <reconnaissance v-if="operation === 3" ref="reconnaissance" :editData="editData.reconnaissance" :disabled="editData.processState !== 'survey'"></reconnaissance>
          <!-- 工程设计 设计审批  -->
          <project-design v-if="operation === 4" ref="projectDesign" :editData="editData.projectDesign" :disabled="editData.processState !== 'design'"></project-design>
          <!-- 预算编制 -->
          <budget v-if="operation === 5 " ref="budget" :dict="{PCW: dictionaryData.PCW, PJC: dictionaryData.PJC}" :editData="editData.budget" :disabled="editData.processState !== 'budget'" :currentStep="currentStep"></budget>
          <!-- 工程收款 -->
          <!-- <project-proceeds
              v-if="operation === 9"
              ref="projectProceeds"
              :dict="{BPP: dictionaryData.BPP}"
              :editData="editData.projectProceeds"
              :disabled="editData.processState !== 'charge'"
            ></project-proceeds> -->
          <!--施工计划 -->
          <project-orders v-if="operation === 7" :oper="currentStep" :time="plantime" ref="projectOrders" :editData="editData.projectOrders" :disabled="editData.processState !== 'build'&& editData.processState !== 'installBuild'"></project-orders>
          <!-- 安装施工 -->
          <install-project v-if="operation === 8" ref="installProject" :editData="editData.installProject" :disabled="editData.processState !== 'installBuild'"></install-project>
          
          <!-- 验收邀约 -->
          <invitation-check v-if="operation === 9" ref="invitationCheck" :editData="editData.invitationCheck" :disabled="editData.processState !== 'invitationCheck'"></invitation-check>
          <!-- 工程验收 -->
          <project-acceptance v-if="operation === 10" ref="projectAcceptance" :PjdepartBelong='PjdepartBelong' :editData="editData.projectAcceptance" :disabled="editData.processState !== 'check'" v-on:checkPassFlag="watchPassFlag" :currentStep="currentStep"></project-acceptance>
          <!-- 立户 -->
          <register-account v-if="operation === 11" ref="registerAccount" :detailInfo='detailInfo' :editData="editData.registerAccount" :id="editData.consultId" :disabled="editData.processState !== 'registerAccount'" :currentStep="currentStep" v-on="$listeners"></register-account>
          <!-- 表计挂接 -->

          <!-- <meter-hook v-if="operation === 11" ref="meterHook" :editData="editData.meterHook" :disabled="editData.processState !== 'meterHook'"></meter-hook> -->
          <!-- 资料归档 -->
          <data-archive v-if="operation === 12" ref="dataArchive"></data-archive>
          <!-- 结算编制 -->
          <budgetMaking v-if="operation === 16" ref="budgetMaking" :editData="editData.settlementCompile" :disabled="editData.processState !== 'settlement'"></budgetMaking>
          <!-- 合同管理 -->
          <contractManagement v-if="operation === 17" ref="contractSign"></contractManagement>
          <!-- 工程结算 -->
          <engineeringSettlement v-if="operation === 18 " ref="engineeringSettlement" :dict="{PCW: dictionaryData.PCW, PJC: dictionaryData.PJC}" :editData="editData.settlementCompile" :disabled="editData.processState !== 'pjsettlement'"></engineeringSettlement>
          <!-- 工程收款 -->
          <engineeringPayment v-if="operation === 19 " ref="engineeringPayment" :dict="{BPG: dictionaryData.BPG, PBT: dictionaryData.PBT, PJ_MOENY_DIVIDE_WAY: dictionaryData.PJ_MOENY_DIVIDE_WAY}" :editData="editData.settlementCompile" :disabled="editData.processState !== 'pjpayment'"></engineeringPayment>
          <!-- 为了限制点击不同节点的时候材料清单的编辑情况 -->
          <!-- 材料清单 -->
          <materialsBill v-if="operation === 3" ref="materialsBill" :editData="editData.materialsBill" :disabled="editData.processState !== 'survey'" :operation="operation"></materialsBill>
          <!-- 材料清单 -->
          <materialsBill v-if=" operation === 5 " ref="materialsBill" :editData="editData.materialsBill" :disabled="editData.processState !== 'budget'" :operation="operation"></materialsBill>
          <!-- 材料清单 -->
          <materialsBill v-if=" operation === 18" ref="materialsBill" :editData="editData.materialsBill" :disabled="editData.processState !== 'pjsettlement'" :operation="operation"></materialsBill>
          
          <template>
            <legend class="legendColumn">上传附件
              <!-- <i class="fontRight" :class="uploadIcon"></i> -->
              <el-button type="primary" size="mini" class="QRCode" @click="getQRCode" :disabled="!!editData.processState && editData.processState !== '' && editData.processState !== 'register'" v-if="QRtypeShow">电子证照</el-button>
            </legend>
          </template>
          <template v-if="dataArchiveStep">
            <attachment-view-info ref="attachment" :receiptAccessory="receiptAccessory" busicode="ReceiptAccessoryList"></attachment-view-info>
          </template>
          <uploadFile ref="uploadFiles" :editData="editData" :pdfList="pdfList" :receiptType="receiptType" :disabledUpload="!!editData.processState && editData.processState !== '' && editData.processState !== 'register'" ></uploadFile>
          <legend v-if="!noProcess" class="legendColumn">流程处理
            <i class="fontRight"></i>
          </legend>
          <div id="workflowDiv"></div>
        </el-tab-pane>
        <el-tab-pane v-if="(operation >= 5 && operation!=9)||((operation == 1 || operation == 0 || operation == 3) && operation!=9) ||(operation == -1)" label="水表信息" name='watch'>
          <waterMeterPj ref="buildwaterMeter" :data="{userCtmTempId:editData.userCtmTempId,userAccountTempId:editData.userAccountTempId}" :behindRegisterAccount="behindRegisterAccount" :stepIdx="operation" :currentStep="currentStep" :id="editData.consultId" :installAddr="getInstallAddr" :ctmName="getCtmName" :NotDisabled="editData.processState == 'CANCEL' || editData.processState == 'END' || editData.processState == 'TERMINATION'" v-on="$listeners" @getMeterList="getMeterList"></waterMeterPj>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="process-right">
      <div class="stepsTitle">流程信息</div>
      <div class="line"></div>
      <el-steps v-if="showStep" :active="stepval" direction="vertical" finish-status="success" class="processInfo">
        <el-step v-for="(item, index) in steps" :key="index" :title="item.name" 
          :class="{
            'haveDone':currentStep>=13&&item.processName=='资料归档',
            'selected':item.key==selectedStep
          }"
          @click.native="toggleOperation(item.key)">
        </el-step>
      </el-steps>
    </div>
    <!-- 编制结算 -->
    <el-dialog title="编制结算（单位：元）" :visible.sync="isPjSetmtShow" :close-on-click-modal="false" width="60%" @close="isPjSetmtShow = false" style="margin-top:-90px;">
      <settlement-compile ref="settlementCompile" @settlementFlag='getSettlement' :editData="editData.settlementCompile" :dict="{PBT:dictionaryData.PBT,BPT:dictionaryData.BPT}" @success="closePjst" ></settlement-compile>

      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primery" size="mini" plain @click="pjSetmtSave">保 存</el-button>
        <el-button type="info" size="mini" plain @click="isPjSetmtShow = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 施工派单 -->
    <el-dialog title="施工派单" :visible.sync="isSgpdShow" :close-on-click-modal="false" width="30%" height="100%" @close="isSgpdShow = false">
      <projectSingle v-on:closeSGDialog="closeSGDialog($event)" ref="buildwaterMeter" :stepIdx="operation" :id="editData.consultId" :NotDisabled="editData.processState == 'CANCEL' || editData.processState == 'END' || editData.processState == 'TERMINATION'"></projectSingle>
    </el-dialog>

    <!-- 超时查询 -->
    <el-dialog class="CSCX" :visible.sync="overTimeDialog" style="width:70%;height:1300px;margin-left:15%" title="超时查询">
      <el-form>
        <el-form-item label="原截止时间:">
          <span>{{oldDelayTime}}</span>
        </el-form-item>
        <el-form-item v-if="isDelay == false" label="是否延期:">
          <el-radio v-model="overTimeRadio" :label="1" >是</el-radio>
          <el-radio v-model="overTimeRadio" :label="0" >否</el-radio>
        </el-form-item>
        <el-form-item v-if="isDelay==true || needDelay==true" label="现增加时间:">
          <el-input v-model="needDelayTime" size="size" style="width:70px"></el-input> 小时
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="overTimeSure()">确 定</el-button>
        <el-button type="info" size="mini" plain @click="overTimeDialog = flase">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow"    :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        busicode="ReceiptAccessoryList"
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <deviceDialog ref="device" :customerData="customerData"></deviceDialog>
  </div>
</template>

<script>
import EngineerInfo from './stepsForm/engineerInfo.vue'
import ctmInfo from './stepsForm/ctmInfo.vue'
import accountInfo from './stepsForm/accountInfo.vue'
import invoiceInfo from './stepsForm/invoiceInfo.vue'
import sendOrders from './stepsForm/sendOrders.vue'
import reconnaissance from './stepsForm/reconnaissance.vue'
import materialsBill from './stepsForm/materialsBill.vue'
import ProjectDesign from './stepsForm/projectDesign.vue'
import Budget from './stepsForm/budget.vue'
import budgetMaking from './stepsForm/budgetMaking.vue'
import contractManagement from './stepsForm/contractManagement.vue'
import engineeringSettlement from './stepsForm/engineeringSettlement.vue'
import engineeringPayment from './stepsForm/engineeringPayment.vue'
import projectProceeds from './stepsForm/projectProceeds.vue'
import ProjectOrders from './stepsForm/projectOrders.vue'
import InstallProject from './stepsForm/installProject.vue'
import ProjectAcceptance from './stepsForm/projectAcceptance.vue'
import SettlementCompile from './stepsForm/settlementCompile.vue'
import SettlementPayment from './stepsForm/settlementPayment.vue'
import registerAccount from './stepsForm/registerAccount.vue'
import meterHook from './stepsForm/meterHook.vue'
import dataArchive from './stepsForm/dataArchive.vue'
import invitationCheck from './stepsForm/invitationCheck.vue'
import waterMeterPj from './stepsForm/waterMeterPj.vue';
import projectSingle from './stepsForm/projectSingle.vue';
import uploadFile from '@/components/uploadPic'
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
import deviceDialog from "@/components/DeviceDialog.vue";//修改手机号码、通知人手机
import Vue from 'vue'
export default {
  props: ['id', 'noProcess'],
  components: {
    EngineerInfo,
    ctmInfo,
    accountInfo,
    invoiceInfo,
    sendOrders,
    reconnaissance,
    materialsBill,
    ProjectDesign,
    Budget,
    budgetMaking,
    contractManagement,
    engineeringSettlement,
    engineeringPayment,
    projectProceeds,
    ProjectOrders,
    InstallProject,
    ProjectAcceptance,
    SettlementCompile,
    SettlementPayment,
    waterMeterPj,
    projectSingle,
    uploadFile,
    registerAccount,
    meterHook,
    dataArchive,
    invitationCheck,
    AttachmentViewInfo,
    deviceDialog
  },
  data () {
    return {
      customerData:{
          ctmNo:'',
          ctmName:'',
          mobile:''
        },
      selectedStep:0,
      overruleFlag:'',
      overruleFlagName:'',
      viewAttachmentShow:false,
      AttachmentQty:0,
      showStep:true,
      stepConfig:[['register'], ['infoApproval'], ['invitationSurvey', 'invitationAccept'], ['survey'],  ['installBuild'],  ['invitationCheck', 'invitationCheckAccept'], ['check'], ['registerAccount'], ['dataArchive'],['settlementApproval'], ['settlement']],
      resData:{},
      newDelayTime:'',
      needDelayTime:0,
      needDelay:false,
      isDelay:false,
      oldDelayTime:'2022-7-12',
      overTimeRadio:0,
      overTimeDialog:false,
      designFlag:1,
      pjType:1,
      constructionUnit:'',
      settlementFlag:0,
      PjdepartBelong:'',
      projecType:0,
      oloUserNoList:0,
      moneyFlag:1,
      registerMustWrite:true,//；立户必填项
      registerMustNserNo: [],//记录没有填写完整的用户的用户编号
      registerAccountData:[],
      waterLength: 5,
      checkPassFlag: 1,
      isSave: 1,
      fixTime: "",
      plantime: '',
      nowTime: '',
      isSgpdShow: false,
      isPjSetmtShow: false,
      showAttachment: false,
      receiptAccessory: {},
      tempid: '',
      clickStep: 0,
      showAccountInfo: true,
      receiptType: "pj_info_new",
      activeName: 'basic',
      operation: 0,
      stepval: 0,
      // 动态获取
      steps: [
        {
          name: '信息登记',
          key: '1'
        },
        {
          name: '资料审核',
          key: '3'
        },
        {
          name: '勘察邀约',
          key: '4'
        },
        
        {
          name: '施工勘察',
          key: '5'
        },
        {
          name: '安装施工',
          key: '9'
        },
        {
          name: '验收邀约',
          key: '10'
        },
        {
          name: '工程验收',
          key: '11'
        },
        {
          name: '立户',
          key: '12'
        },
        {
          name: '资料归档',
          key: '13'
        }
      ],
      currentStep: 0,
      dictionaryData: {
        PPT: [],
        UWD: [],
        EGD: [],
        CTT: [],
        CDL: [],
        IDT: [],
        ACT: [],
        BPW: [],
        SDW: [],
        BBT: [],
        PCW: [],
        BPP: [],
        PBT: [],
        PIS: [],
        BPT: []
      },
      editData: {},
      uploadIcon: 'el-icon-minus',
      uploadFileShow: true,
      detailInfo: {},
      pdfList: [],
      QRpjType: "",
      QRtypeShow: true,
      getInstallAddr:'',
      getCtmName: "",
      behindRegisterAccount: false,//判断安装施工节点是不是在立户节点之后
      waterMeterInfoIfRequiredConfig: true,
    }
  },
  watch: {
    currentStep(){
      
    },
    // 微厅的单被驳回后，工程登记节点是否可以编辑
    getProjectEditFlag() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PROJECT_WT_REJECT_EDIT_FLAG',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length && res.list.length > 0) {
          let v = res.list[0].configValue;
          if(v != '' && v == 1){
              _this.overruleFlag = 0;
          };
        }
      })
    },
    overTimeRadio(){
      if(this.overTimeRadio==1){
        this.needDelay=true
      }else{
        this.needDelay=false
      }
    },
    constructionUnit(){
      let m=this.constructionUnit
      this.constructionUnit=''
      this.constructionUnit=m
      // console.log(this.constructionUnit)
      // console.log(this.pjType)
    },
    isPjSetmtShow (newVal, oldVal) {
      //   console.log(newVal, oldVal)
      if (newVal) {
        this.$refs.settlementCompile.getAccruedMoney()
      }
    },
    operation(newVal, oldVal){
      // 对水表信息列表进行重新渲染，解决错位问题
      if(this.$refs.buildwaterMeter != undefined){
        this.$refs.buildwaterMeter.tableShow = false;
        this.$nextTick(() => {
          if(this.$refs.buildwaterMeter != undefined){
              this.$refs.buildwaterMeter.tableShow = true;
          }
        })
      }
    }
  },
  computed: {

  },
  mounted () {
    eventBus.$on('deviceSbumit',item=>{
      this.$parent.closeDialog(); // 提交后回调方法
    });
    this.overruleFlag = sessionStorage.getItem('overruleFlag');
    this.getProjectEditFlag();
    this.getSonPjType();
    
    // console.log(this.id);
    eventBus.$on("getPjType", (QRpjType) => {
      // console.log(QRpjType);
      this.QRshow(QRpjType) 
    });
    if (this.id==undefined||this.id=="") {
      let tempId = this.util.generateUUID();
      this.editData.tempId = tempId;
      this.id = tempId;
      sessionStorage.setItem('tempid',this.tempid)
      eventBus.$emit('receiptId', tempId)   //添加时 附件临时ID
      eventBus.$emit('QRtempId', tempId)
    } else {
      eventBus.$emit('QRtempId', this.id)
    }
    this.nowTimes();
    eventBus.$on('overTimeSearch',item=>{
      const params = {
        "busicode": "CompanyQuery",
        "data": {
          companyNo:localStorage.getItem('companyNo'),
        }
      }
      this.$api.fetch({
        params: params,//参数
        }).then(res => {
          const params = {
          "busicode": "OverdueDelayList",
          "data": {
            processSetCode:res.workflowApp,
            processCode:'pj_info_new',
            billId:localStorage.getItem('billId'),
            nodeName:this.resData.consult.processName
          }
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.overTimeDialog=true
          if(res != ''){
            this.oldDelayTime=res.predictTime;
            //获取当前时间并对比
            let date=new Date()
            let oldDate=new Date(this.oldDelayTime)
            if((date-oldDate)>0){//已超时
              this.isDelay = true
            }else{
              this.isDelay = false
            }
          }
        }).catch(()=>{
         
        })
      })

    })
    this.initAccessory()
    this.$parent.getYWSLConfig();
    this.$parent.getSGYSConfig();
    this.$parent.getGZLCConfig();
  },
  beforeDestroy() {
    eventBus.$off("getPjType");
  },
  created () {
    this.getApprovalTableData()
    if (this.id) {
      this.getDetailById(this.id)

    } else {
      if (!this.noProcess){
        this.getHtmlData();
      }
      this.$emit('isTermination', false); // 登记的时候，按钮的状态要重置
    }
    this.getDictionaryOptions()
    this.$emit('changeButtons', ['save','DJSQ'])
    this.getShowAccountInfo();
    this.getWaterMeterInfoIfRequired();
    eventBus.$on("waterValidate2", item => {
      this.isSave = 1
      if (item == 0) {
        this.isSave = 0
      }
    })

    eventBus.$on("waterLength2", item => {
      this.waterLength = item
      //console.log("waterLength" + this.waterLength);
    })

    eventBus.$on('validateRegister',item=>{
      this.registerMustWrite = true;
      this.registerMustNserNo = [];
      // console.log(JSON.stringify(item));
      for(let i = 0; i < item.length; i++){
        // console.log("useWaterType",typeof(item[i].userInfo.useWaterType));
        if(item[i].userInfo.useWaterType == undefined || item[i].userInfo.useWaterType == ''){
          this.registerMustNserNo.push(item[i].userInfo.userNo);
          this.registerMustWrite = false;
        }
      }
    })
    eventBus.$on('getPjInfoQueryDataforAccount',item=>{
      eventBus.$emit('sendPjInfoQueryDataforAccount',this.detailInfo)
    })
    //
  },
  beforeDestroy () {
    eventBus.$off("waterValidate2")
    eventBus.$off("waterLength2")
    eventBus.$off("validateRegister")
    eventBus.$off('getPjInfoQueryDataforAccount')
    eventBus.$off('overTimeSearch')
  },
  methods: {
    closeAttachDialog(){
      this.viewAttachmentShow=false
    },
    initAccessory(){    //初始化附件个数
        let _this = this;
        console.log(this.id);
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType: "pj_info_new",
              receiptId: this.id
            }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res != null && res.length > 0) {
            _this.AttachmentQty = res.length
          }else{
            _this.AttachmentQty=0
          }
          console.log( _this.AttachmentQty);
          this.$emit('getReceiptAccessoryList',_this.AttachmentQty)
          
        });
    },
    getSonPjType(data){
      if(data==undefined||data==''){
        this.getProcessNode();
        return
      }
      this.pjType = data;
      this.getProcessNode(data);
      this.getHtmlData();
    },
    getProcessNode(data){
      if(data==undefined||data==''){
        data=1
      }
      // console.log(data);
      const params = {
        "busicode": "ProjectNodeInfoList",
        "data": {
          receiptType:'pj_info_new_' + data,
        }
      }
      this.$api.fetch({
        params: params,//参数
        }).then(res => {
          var newArr = eval('(' + res+ ')');
          console.log(newArr);
          this.steps=newArr.steps
          this.stepConfig=newArr.nodeCode
          let indexOne = 0;
          let indexTwo = 0;
          for(let i=0;i<this.steps.length;i++){
          // console.log(this.steps[i].key+' '+this.steps[i].name);
            this.showStep=false
            this.$nextTick(()=>{
              this.showStep=true
              if(this.resData.consult!=undefined){
                this.changeStep(this.resData.consult.processState)
              }
              
            })
            // 判断安装施工节点是不是在立户节点之后,安装施工是9,立户是12
            if(this.steps[i].key == 9){
              indexOne = i;
            }
            if(this.steps[i].key == 12){
              indexTwo = i;
            }
          }
          if(indexOne > indexTwo){//说明安装施工在立户节点之后
            this.behindRegisterAccount = true;
          }
        })
    },
    getPdfList(value) { //获取pdf列
      // console.log(value);
      this.pdfList = value
    },
    getPjType(value) {
      this.QRpjType = value
      console.log(this.QRpjType);
    },
    QRshow(value) {
      if (value == undefined || value == '1' || value == 1 || value == '5' || value == 5) {
        this.QRtypeShow = true
      } else {
        this.QRtypeShow = false
      }
    },
    overTimeSure(){
      if(this.overTimeRadio==0&&this.isDelay==false){
        this.overTimeDialog=false
        return
      }
      let m=new Date(this.oldDelayTime)
      this.newDelayTime=this.timeFormate2(new Date(Date.parse(m)+this.needDelayTime*3600*1000))
      let data={
        pjBillNo:this.resData.consult.billNo,
        pjType:this.resData.consult.pjType,
        installAddr:this.resData.consult.installAddr,
        ctmName:this.resData.ctmInfo.ctmName,
        phone:this.resData.ctmInfo.mobile!=undefined?this.resData.ctmInfo.mobile:'',
        nodeName:this.resData.consult.processName,
        oldDelayTime:this.oldDelayTime,
        overdueTime:this.needDelayTime*3600,
        comment:this.resData.consult.comments,
      }
      const params = {
        "busicode": "PjDelayInsert",
        "data": data
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        // console.log(res);
        // this.QRid = res
        var params = {
              busicode: "ProcessCommit",
              data: {
                "billId":res,
                "formVariables":{},
                "operation":32,
                "comment":"",
                "nextCandidateUsers":"{}",
                "receiptType":"pj_delay",
                "title":"审批流配置:报装(工程延期)"
              },
              token: sessionStorage.getItem('token')
            };
            // let data=window.getSubmitData();
            // console.log(data);
            // if(data.operation!=undefined&&data.operation==32){
            this.$api.fetch({
              params: params //参数
            }).then(res => {
              let param1={
                busicode: "PjInfoUpdate",
                data:{
                  id:this.id,
                  delayFlag:1
                }
              }
              this.$api.fetch({
                params:param1
              }).then(res=>{
                if(this.overTimeRadio==1){
                this.$message({
                  type:'success',
                  message:'延期新增成功'
                })
              }
              this.overTimeDialog=false
              })

              })
      })
    },
    getQRCode() {
      let tempId = this.util.generateUUID();
      // console.log(tempId);
      this.$refs.engineerInfo.refreshQRCode();//刷新二维码
      this.$refs.engineerInfo.getQRCode(); //将单据id传递给子组件
    },
    getSettlement(msg){
      this.settlementFlag=msg
      this.$emit('settlementFlag',1)
    },
    getApprovalTableData(){
      var params = {
          busicode: "PjCheckTemplateStaffList",
          data: {
            checkStaff:this.$store.state.account
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            // console.log(res);
            if(res[0]!=undefined&&res[0]!=0 &&res[0].moneyFlag!=undefined){
              this.moneyFlag=res[0].moneyFlag
              this.PjdepartBelong=res[0].departBelong
            }
          })
    },
    watchPassFlag (data) {
      this.checkPassFlag = data
      //console.log("checkPassFlag:"+data);
    },
    nowTimes () {
      this.timeFormate(new Date());

      //this.clear()
    },
    //显示当前时间（年月日时分秒）
    timeFormate (timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
      let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
      this.nowTime = year + "-" + month + "-" + date;
    },
    timeFormate2 (timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
      let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
      let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
      let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
      let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      timeStamp = year + "-" + month + "-" + date+' '+hh+':'+mm+':'+ss;
      return timeStamp
    },
    closeSGDialog (data) {
      if (data == false) {
        this.isSgpdShow = false
      }
    },
    // 查看附件按钮
    viewAllAttachment(type) {
      this.receiptAccessory = {
        receiptType: "pj_info_new",
        receiptId: this.id
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    viewAttachment (flag) {

      if (flag) {
        this.receiptAccessory = {
          receiptType: "pj_info_new",
          receiptId: this.id
        }
        this.$refs.attachment && this.$refs.attachment.init()
      } else {
        let params = {
          busicode: "ReceiptAccessoryList",
          data: {
            receiptType: "pj_info_new",
            receiptId: this.id
          }
        };

        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.attachmentData = res;
          });
      }
    },
    closePjst () {
      this.isPjSetmtShow = false;
    },
    pjSetmtSave () {
      this.$refs.settlementCompile.submit()

    },
    getShowAccountInfo () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'pjinfo_account_display_switch',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.showAccountInfo = res.list[0].configValue == 1 ? true : false;
          }
        })
    },
    // 信息登记时，是否限制水表信息必须有数据 0：否 1是
    getWaterMeterInfoIfRequired () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WATERMETERINFO_IF_REQUIRED',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length > 0) {
          this.waterMeterInfoIfRequiredConfig = res.list[0].configValue == 0 ? true : false;
        }
      })
    },
    // 获取详情
    getDetailById (id) {
      const params = {
        "busicode": "PjInfoQuery",
        "data": { id }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.resData=res;
        this.getInstallAddr = this.resData.consult.installAddr;
        this.getCtmName = this.resData.ctmInfo.ctmName;
        this.receiptType='pj_info_new#' + res.consult.pjType;
        this.pjType = res.consult.pjType;;
        this.getProcessNode(res.consult.pjType)
        
        if(res.consult.processState=='CANCEL'){
          this.$emit('isTermination',true)
        }else{
          this.$emit('isTermination',false)
        }
        this.designFlag=res.consult.designFlag
        if(res.consult.settlementFlag!=undefined){
          this.projecType=res.consult.pjType
          this.pjType=res.consult.pjType
          if(this.projecType==4||this.projecType=='4'){
            this.$store.commit('setIsStatus2', true);
          }else{
            this.$store.commit('setIsStatus2', false);
          }
          this.$emit('settlementFlag',res.consult.settlementFlag)
          this.$emit('constructionUnit',res.consult.constructionUnit)
          this.constructionUnit=res.consult.constructionUnit
        }
        this.setFormData(res)
        this.detailInfo = res
        
        localStorage.setItem('billId', res.consult.id)
        this.tempid = res.consult.id;
        eventBus.$emit('receiptId', res.consult.id)
      })
    },
    // 获取字典数据
    getDictionaryOptions () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PPT,UWD,EGD,CTT,CDL,IDT,ACT,BPW,SDW,BBT,PCW,BPP,PBT,PJC,PIS,BPT,PSZ,BPG,PJ_MOENY_DIVIDE_WAY"
        // 工程类型、用水期、紧急程度、客户类型、信用等级、客户（经办人）证件类型、账户类型、缴费方式、投递方式、发票类型、结算方式、预缴方式、余额退款形式、收款主体、信息来源
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        // "pj_info_new",
        "pj_info_new#" + this.pjType,
        _this.editData.installAddr,
        _this.editData.consultId,
        _this.editData.processInstanceId,
        "workflowDiv",
        _this, (res) => {
          if (window.location.href.indexOf("HallBusiness") > -1 || window.location.href.indexOf("PendingTrial") > -1 || window.location.href.indexOf("WaterSideIndex") > -1) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog ? this.$parent.$parent.closeDialog() : this.$parent.closeDialog();
          } else {
            // 普通模块触发
            // if (_this.detailInfo.consult != undefined && _this.detailInfo.consult.processState === 'budget') { // 预算编制押金大于0时新增工程收款
            //   _this.$refs.budget.autoCollection();
            // }
            let data=window.getSubmitData();
            if(data!=undefined&&data.operation==32&&this.currentStep==12){
              this.PjInfoUpdate()
            }
            if(this.resData.ctmInfo!=undefined){
              this.customerData.ctmNo=this.resData.ctmInfo.ctmNo
              this.customerData.ctmName=this.resData.ctmInfo.ctmName
              this.customerData.mobile=this.resData.ctmInfo.mobile
            }else{
              this.customerData.ctmNo=this.$refs.ctmInfo.form.ctmNo
              this.customerData.ctmName=this.$refs.ctmInfo.form.ctmName
              this.customerData.mobile=this.$refs.ctmInfo.form.mobile
            }
            if(localStorage.getItem('windowNo')!=undefined&&localStorage.getItem('windowNo')!=null){
              this.$refs.device.sendDevice()
              // this.$refs.device.showDialog()
            }else{
              this.$refs.device.showDialog()
            }
          }
        },
        _this.editData.approveFlag,
        'PjSave',//保存方法的接口名称
        'PjProcessCommit'
      );
    },
    PjInfoUpdate(){
      var myDate = new Date();
      let date=myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate()
      var params = {
        "busicode": "PjInfoUpdate",
        "data": {
          id:this.id,
          completionDate:date
         }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(() => {
        this.$emit('success')
        this.tempid = '';
      })
    },
    async save () {
      if(this.currentStep == 20){
        // 工程收款节点，提交前要检查金额
        let tempMessage = await this.$refs.engineeringPayment.saveEngineeringPayment();
        if(tempMessage != ""){
          this.$message({
            type: 'error',
            message: tempMessage
          })
          return;
        }
      }
      if(this.currentStep == 19){
        // 工程结算节点，点击保存按钮的时候要检查数量跟类型然后在调用保存接口
        let tempMessage = await this.$refs.materialsBill.validateMaterialsBill();
        if(tempMessage != ""){
          this.$message({
            type: 'error',
            message: tempMessage
          })
          return;
        }
        this.$refs.materialsBill.saveMBill(); // 调用材料清单保存接口
      }
      const formData = this.getFormData()
      var params = {
        "busicode": "PjSave",
        "data": { ...formData, temporaryFlag: 1 }
      }
       this.$api.fetch({
        params: params,//参数
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$parent.editData.id = res.id;//这里是用于点击暂存之后，在点击提交的时候，要刷新id的值，在common.js中才能正确获得暂存之后的id
        this.savePjMeterBatchInsert(res.id);
        this.$set(this.$parent.showButtons, "YWSL", true);
        // this.$emit('success')
        this.tempid = '';
      })
    },
    savePjMeterBatchInsert(billId){
      let _this = this;
      return new Promise(resolve => {
        // 草稿状态或者登记状态要调用这里
        if(_this.$refs.buildwaterMeter.currentStep == 0 || _this.$refs.buildwaterMeter.currentStep == 1){
          const params = {
            "busicode": "PjInfoQuery",
            "data": { id: billId }
          }
          _this.$api.fetch({
            params: params,//参数
          }).then(res1 => {
            if(this.$parent.showButtons.save == false){//（只有暂存的时候需要刷新这个）
              this.editData.userCtmTempId = res1.consult.userCtmTempId;
              this.editData.userAccountTempId = res1.consult.userAccountTempId;
              this.editData.consultId = res1.consult.id;
              this.getDetailById(res1.consult.id);//要等查询的基本信息赋值给下一个模块的水表信息之后，才可以刷新页面的内容，刷新是为了更新流程中的表单信息的内容
            }
            if(_this.$refs.buildwaterMeter.tableData.length > 0){
              let params = {
                busicode: "PjMeterBatchInsert",
                data: _this.$refs.buildwaterMeter.tableData.map((row, i)=>{
                  if(row.accountNos == ""){
                    row.accountNos = [];
                  }
                  if(row.hasOwnProperty("gsContract")){
                    delete row.gsContract;//这个是不需要的，不能更改合同编号的相关信息
                  }
                  if(row.hasOwnProperty("sgContract")){
                    delete row.sgContract;//这个是不需要的，不能更改合同编号的相关信息
                  }
                  // if(i == 0){
                  //   row.userCtmTempId = res1.consult.userCtmTempId;
                  //   row.userAccountTempId = res1.consult.userAccountTempId;
                  // }
                  row.consultId = res1.consult.id;
                  if(row.accountInfo==""){
                    row.userInfo.accountNos=undefined
                    return {
                      ...row,
                      "discountData": undefined,
                      "userMixtureData": undefined,
                      "accountInfo":undefined,
                      "ctmInfo":undefined,
                      "index":undefined
                    }
                  }
                  return {
                    ...row,
                    "discountData": undefined,
                    "userMixtureData": undefined,
                    "index":undefined
                  }
                })
              };
              _this.$api.fetch({
                params: params //参数
              })
              .then(res => {
                _this.$message({
                  type: "success",
                  message: "保存成功"
                });
                resolve(true);//只有两个接口都调用成功的时候才返回true
              }).catch(err=>{
                resolve(false);
              });
            }
          }).catch(err1 =>{
            resolve(false);
          })
        }else{
          resolve(true);//其他的节点不需要上面的水表保存的情况就直接返回true
        }
      })
    },
    // 从各表单中获取数据
    getFormData () {
      const engineerInfo = this.$refs.engineerInfo && this.$refs.engineerInfo.form || this.editData.engineerInfo || {}
      const ctmInfo = this.$refs.ctmInfo && this.$refs.ctmInfo.form || this.editData.ctmInfo || {}
      const accountInfo = this.$refs.accountInfo && this.$refs.accountInfo.form || this.editData.accountInfo || {}
      const invoiceInfo = this.$refs.invoiceInfo && this.$refs.invoiceInfo.form || this.editData.invoiceInfo || {}
      const sendOrders = this.$refs.sendOrders && this.$refs.sendOrders.form || this.editData.sendOrders || {}
      const reconnaissance = this.$refs.reconnaissance && this.$refs.reconnaissance.form || this.editData.reconnaissance || {}
      const projectDesign = this.$refs.projectDesign && this.$refs.projectDesign.form || this.editData.projectDesign || {}
      const budget = this.$refs.budget && this.$refs.budget.form || this.editData.budget || {}
      const projectProceeds = this.editData.projectProceeds || {}
      const projectOrders = this.$refs.projectOrders && this.$refs.projectOrders.form || this.editData.projectOrders || {}
      const installProject = this.$refs.installProject && this.$refs.installProject.form || this.editData.installProject || {}
      const invitationCheck = this.$refs.invitationCheck && this.$refs.invitationCheck.form || this.editData.invitationCheck || {}
      const projectAcceptance = this.$refs.projectAcceptance && this.$refs.projectAcceptance.form || this.editData.projectAcceptance || {}
      const settlementCompile = this.$refs.settlementCompile && this.$refs.settlementCompile.form || this.editData.settlementCompile || {}
      const settlementPayment = this.$refs.settlementPayment && this.$refs.settlementPayment.form || this.editData.settlementPayment || {}
      const engineeringSettlement = this.$refs.engineeringSettlement && this.$refs.engineeringSettlement.form || this.editData.engineeringSettlement || {}
      const engineeringPayment = this.$refs.engineeringPayment && this.$refs.engineeringPayment.form || this.editData.engineeringPayment || {}
      const meterDto = this.$refs.buildwaterMeter &&
      this.$refs.buildwaterMeter.tableData.map(item => {
        let useWaterType = ''
        if (item.useWaterType instanceof Array) {
          useWaterType = item.useWaterType.length > 0 ? item.useWaterType[item.useWaterType.length - 1] : ''
        } else {
          useWaterType = item.useWaterType
        }
        if (item.accountNos == "") {
          item.accountNos = [];
        }
        return {
          ...item,
          useWaterType
        }
      })

      return {
        accountInfo: {
          id: this.editData.accountInfoId || '',
          accountNo: accountInfo.accountNo, // 账户编号
          payWay: accountInfo.payWay, // 缴费方式
          accountType: accountInfo.accountType, //账户类型
          openAccountBank: this.editData.processState == 'setmt' ? settlementPayment.openAccountBank : accountInfo.openAccountBank, // 开户银行 setmt-结算收款
          openAccountName: this.editData.processState == 'setmt' ? settlementPayment.openAccountName : accountInfo.openAccountName, // 开户名称
          bankAccount: this.editData.processState == 'setmt' ? settlementPayment.bankAccount : accountInfo.bankAccount, // 银行账号
          entrustNo: accountInfo.entrustNo, // 托号
          entrustContract: accountInfo.entrustContract, // 银行协议
          deliverWay: accountInfo.deliverWay, // 投递方式
          deliverAddr: accountInfo.deliverAddr, // 投递地址
          emailAddr: accountInfo.emailAddr, // 邮箱地址
          bankSn: accountInfo.bankSn,
          invoiceType: invoiceInfo.invoiceType, // 发票类型
          invoiceTitle: invoiceInfo.invoiceTitle, // 单位名称
          invoiceTax: invoiceInfo.invoiceTax, // 纳税人识别号
          invoiceAddr: invoiceInfo.invoiceAddr, // 联系地址
          invoiceLink: invoiceInfo.invoiceLink, // 联系电话
          invoiceBank: invoiceInfo.invoiceBank, // 开户银行
          invoiceAccount: invoiceInfo.invoiceAccount, // 银行账号
          vatFlag: invoiceInfo.vatFlag, // 增值税标记
        },
        consult: {
          id: this.editData.consultId || this.tempid,
          insertFlag: !this.editData.consultId ? 1 : undefined,
          tenantId: this.editData.tenantId || '',
          agentMan: ctmInfo.agentMan, // 经办人名称
          agentCertNo: ctmInfo.agentCertNo, // 经办人证件号码
          agentCertType: ctmInfo.agentCertType, // 经办人证件类型
          agentLinkTel: ctmInfo.agentLinkTel, // 经办人电话
          eSignatureUrl: ctmInfo.eSignatureUrl,//电子签名
          billDate: engineerInfo.billDate, // 申请日期
          billNo: engineerInfo.billNo, // 工程编号
          constructionUnit: engineerInfo.constructionUnit, //施工主体
          isUploadWorkBuild: engineerInfo.isUploadWorkBuild, //上传工建
          redLineConstruction:reconnaissance.redLineConstruction,//红线外施工
          pjName: engineerInfo.pjName, // 工程名称 survey-施工勘察
          pjType: engineerInfo.pjType, // 工程类型
          sourceFlag: engineerInfo.sourceFlag, //信息来源
          businessArea: engineerInfo.businessArea, // 营业区域
          urgentFlag: engineerInfo.urgentFlag, // 紧急程度
          oloUserNo: engineerInfo.oloUserNo, // 原户号
          suserNo: engineerInfo.suserNo, // 总表户号
          contractNo: engineerInfo.contractNo, // 合同编号
          limitDate: engineerInfo.limitDate, // 用水年限（年月）
          limitFlag: engineerInfo.limitFlag, // 用水期
          installAddr: engineerInfo.installAddr,
          comments: settlementPayment.comments,
          creditCode: ctmInfo.creditCode, // 统一社会信用代码
          processInstanceId: this.editData.processInstanceId || '',
          processName: this.editData.processName || '',
          processState: this.editData.processState || '',
          tempId: this.editData.tempId || '',
          meterBore: this.editData.processState === 'survey' ? reconnaissance.meterBore : engineerInfo.meterBore, // 水表口径
          meterNum: this.editData.processState === 'survey' ? reconnaissance.meterNum : engineerInfo.meterNum, // 装表个数
          surveyStaff: this.editData.processState === 'survey' ? undefined : (sendOrders.surveyStaff ? sendOrders.surveyStaff.join(',') : ''), // 勘察人员 survey-施工勘察
          surveyInviteDate: sendOrders.surveyInviteDate,//邀约时间
          beforeMeterLength: reconnaissance.beforeMeterLength, // 表前管长
          surveyResult: reconnaissance.surveyResult, // 勘察结论
          workFlag: reconnaissance.workFlag ? 1 : 0, // 满足施工条件
          designFlag: reconnaissance.designFlag ? 1 : 0, // 需要设计
          branchRoadFlag: reconnaissance.branchRoadFlag ? 1 : 0, // 需要办破路手续
          exceedHigh: reconnaissance.exceedHigh ? 1 : 0, // 超高标
          surveyDate: reconnaissance.surveyDate, // 勘察日期
          designStaff: projectDesign.designStaff, // 设计人员
          designDate: projectDesign.designDate, // 设计日期
          designDesc: projectDesign.designDesc, // 设计意见
          budgetLaborMeterBefore: budget.budgetLaborMeterBefore, // 表前人工费预算
          budgetLaborMeterAfter: budget.budgetLaborMeterAfter, // 表后人工费预算
          budgetMatrMeterBefore: budget.budgetMatrMeterBefore, // 表前材料费预算
          budgetMatrMeterAfter: budget.budgetMatrMeterAfter, // 表后材料费预算
          budgetCost: budget.budgetCost, // 预算费
          designCost: budget.designCost, // 设计费
          depositMoney: this.editData.processState == 'charge' ? projectProceeds.depositMoney : budget.depositMoney, // 押金 charge-工程收款
          budgetMoney: this.editData.processState == 'pjsettlement' ? engineeringSettlement.budgetMoney : budget.budgetMoney, // 预算金额
          prepayType: budget.prepayType, // 结算方式
          //   projectCharge: budget.projectCharge, // 收款主体
          projectCharge: engineerInfo.constructionUnit,
          budgetComments: this.editData.processState == 'charge' ? projectProceeds.budgetComments : budget.budgetComments, // 预算意见
          actuallyReceived: projectProceeds.actuallyReceived, // 预缴款
          budgetPayWay: projectProceeds.budgetPayWay, // 预缴方式
          constBeginDate: projectOrders.constBeginDate, // 施工日期
          constEndDate: projectOrders.constEndDate, // 施工人员
          //newConstEndDate:'',
          //constEndDate:this.nowTimes : projectOrders.constEndDate,
          constComments: installProject.constComments, // 安装说明
          wateringTime: installProject.wateringTime, // 通水时间
          checkInviteDate: invitationCheck.checkInviteDate, // 完工日期
          // checkInviteStaff: invitationCheck.checkInviteStaff, // 验收人员
          checkInviteStaff: this.editData.processState === 'check' ? undefined : (invitationCheck.checkInviteStaff? invitationCheck.checkInviteStaff.join(',') : ''), // 勘察人员 survey-施工勘察
          checkInfo: this.$refs.projectAcceptance && this.$refs.projectAcceptance.getParams() || [], // 验收通过的验收子项
          setmtMatrMeterBefore: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtMatrMeterBefore : settlementCompile.setmtMatrMeterBefore, // 表前材料费结算
          setmtLaborMeterBefore: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtLaborMeterBefore : settlementCompile.setmtLaborMeterBefore, // 表前人工费结算
          setmtMatrMeterAfter: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtMatrMeterAfter : settlementCompile.setmtMatrMeterAfter, // 表后材料费结算
          setmtLaborMeterAfter: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtLaborMeterAfter : settlementCompile.setmtLaborMeterAfter, // 表后人工费结算
          setmtBudgetCost: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtBudgetCost : settlementCompile.setmtBudgetCost, // 预算费结算
          setmtBudgetCostFlag: settlementCompile.setmtBudgetCostFlag ? 1 : 0, // 是否勾选预算费结算
          setmtDesignCost: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtDesignCost : settlementCompile.setmtDesignCost, // 设计费结算
          setmtDesignCostFlag: settlementCompile.setmtDesignCostFlag ? 1 : 0, //是否勾选设计费结算
          constructionCost: this.editData.processState === 'pjsettlement' ? engineeringSettlement.constructionCost : settlementCompile.constructionCost, // 工程造价
          setmtDate: this.editData.processState === 'pjpayment' ? engineeringPayment.setmtDate : settlementCompile.setmtDate, // 结算日期
          accruedMoney: this.editData.processState === 'pjsettlement' ? engineeringSettlement.accruedMoney : settlementCompile.accruedMoney, // 预缴金额
          costShare: this.editData.processState === 'pjsettlement' ? engineeringSettlement.costShare : settlementCompile.costShare, // 总管分摊费用
          setmtMoney: this.editData.processState === 'pjsettlement' ? engineeringSettlement.setmtMoney : settlementCompile.setmtMoney, // 合计总额
          utensilMoney: this.editData.processState === 'pjsettlement' ? engineeringSettlement.utensilMoney : settlementCompile.utensilMoney, // 计量器具
          redLineInMoney: this.editData.processState === 'pjsettlement' ? engineeringSettlement.redLineInMoney : settlementCompile.redLineInMoney, // 红线内施工费用
          redLineOutMoney: this.editData.processState === 'pjsettlement' ? engineeringSettlement.redLineOutMoney : settlementCompile.redLineOutMoney, // 红线外施工费用
          depositBackFlag: settlementCompile.depositBackFlag, // 是否退押金
          backFillMoney: this.editData.processState === 'pjpayment' ? engineeringPayment.backFillMoney : settlementPayment.backFillMoney, // 找补金额
          setmtPayWay: this.editData.processState === 'pjpayment' ? engineeringPayment.setmtPayWay :settlementPayment.setmtPayWay, // 收款方式
          setmtPayDate: this.editData.processState === 'pjpayment' ? engineeringPayment.setmtPayDate :settlementPayment.setmtPayDate, // 收款时间
          refundWay: this.editData.processState === 'pjpayment' ? engineeringPayment.refundWay : settlementPayment.refundWay, // 余额退款方式
          balanceAllocWay: engineeringPayment.balanceAllocWay, // 余额分配方式
          bankName: engineeringPayment.bankName, // 退款银行名称
          bankAccount: engineeringPayment.bankAccount, // 退款银行账户
          bankAccountName: engineeringPayment.bankAccountName, // 退款银行户名
          accountInfoList: engineeringPayment.accountInfoList, // 预存金额的表格内容
          userCtmTempId: this.editData.userCtmTempId,
          userAccountTempId: this.editData.userAccountTempId,
          createTime: this.editData.createTime,
          meterHookDate: meterHook.meterHookDate,
          meterHookComment: meterHook.meterHookComment,
          disposableChargeFlag: budget.disposableChargeFlag,
          budgetNo: budget.budgetNo, //预算编号
          budgetPerson: budget.budgetPerson, //预算人
        },
        ctmInfo: {
          id: this.editData.ctmInfoId || '',
          ctmNo: ctmInfo.ctmNo, // 客户编号
          ctmType: ctmInfo.ctmType, // 客户类型
          certType: ctmInfo.certType, // 客户证件类型
          certNo: ctmInfo.certNo, // 客户证件号码
          creditLevel: ctmInfo.creditLevel, //信用等级
          ctmAddr: ctmInfo.ctmAddr, // 客户地址
          ctmName: ctmInfo.ctmName, // 客户名称
          faxNumber: ctmInfo.faxNumber, // 传真号码
          linkTel: ctmInfo.linkTel, // 联系电话
          mobile: ctmInfo.mobile, // 手机号码
          acceptSMS: ctmInfo.acceptSMS, // 受理短信
        },
        //pjMeterList: meterDto,
        pjMeterList: this.currentStep == 10 ? meterDto : undefined,
        updateCtmFlag: this.editData.updateCtmFlag,
        updateAccountFlag: this.editData.updateAccountFlag,
        // updateCtmFlag: !this.editData.consultId ? 1 : (this.editData.processState=='installBuild'?undefined:this.editData.updateCtmFlag),
        // updateAccountFlag: !this.editData.consultId ? 1 : (this.editData.processState=='installBuild'?undefined:this.editData.updateAccountFlag),
        approveFlag: this.editData.approveFlag,
        formVariables: {
          designFlag: this.editData.processState == 'survey' ? (reconnaissance.designFlag ? 1 : 0) : undefined,
          //prepayType: this.editData.processState == 'check' ? budget.prepayType : undefined,
          pjType: this.editData.processState == 'registerApproval' || this.editData.processState == 'installBuild' ? engineerInfo.pjType : undefined,
          checkPassFlag: this.editData.processState == 'check' ? this.checkPassFlag : undefined,
          constructionUnit:engineerInfo.constructionUnit

        },
        temporaryFlag: 0
      }

    },
    getFormbData () {
      return this.getFormData()
    },
    // 将详情数据写入表单
    setFormData (res) {
      const accountInfo = res.accountInfo
      const consult = res.consult
      const ctmInfo = res.ctmInfo
      this.editData = {
        registerAccount: {
          accountInfo,
          ctmInfo,
          consultId: consult.id,
        },
        engineerInfo: {
          constructionUnit: consult.constructionUnit,//施工主体
          pjName: consult.pjName, // 工程名称
          billNo: consult.billNo, // 工程编号
          billDate: consult.billDate, // 申请日期
          pjType: consult.pjType, // 工程类型
          pjTypeName: consult.pjTypeName, // 工程类型
          oloUserNo: consult.oloUserNo, // 原户号
          suserNo: consult.suserNo, // 总表户号
          isUploadWorkBuild: consult.isUploadWorkBuild, // 上传工建
          businessArea: consult.businessArea, // 营业区域
          businessAreaName: consult.businessAreaName, // 营业区域
          limitFlag: consult.limitFlag, // 用水期
          limitFlagName: consult.limitFlagName, // 用水期
          limitDate: consult.limitDate, // 用水年限（年月）
          urgentFlag: consult.urgentFlag, // 紧急程度
          urgentFlagName: consult.urgentFlagName, // 紧急程度
          meterBore: consult.meterBore, // 水表口径
          meterBoreName: consult.meterBoreName, // 水表口径
          installAddr: consult.installAddr, // 工程地址
          meterNum: consult.meterNum, // 装表个数
          sourceFlag: consult.sourceFlag,//信息来源
          sourceFlagName: consult.sourceFlagName,
          contractNo: consult.contractNo, // 合同编号
        },
        ctmInfo: {
          ctmName: ctmInfo.ctmName, // 客户名称
          ctmType: ctmInfo.ctmType, // 客户类型
          ctmTypeName: ctmInfo.ctmTypeName, // 客户类型
          certType: ctmInfo.certType, // 客户证件类型
          certTypeName: ctmInfo.certTypeName, // 客户证件类型
          certNo: ctmInfo.certNo, // 客户证件号码
          mobile: ctmInfo.mobile, // 手机号码
          linkTel: ctmInfo.linkTel, // 联系电话
          ctmAddr: ctmInfo.ctmAddr, // 客户地址
          agentMan: consult.agentMan, // 经办人名称
          agentCertType: consult.agentCertType, // 经办人证件类型
          agentCertTypeName: consult.agentCertTypeName, // 经办人证件类型
          agentCertNo: consult.agentCertNo, // 经办人证件号码
          agentLinkTel: consult.agentLinkTel, // 经办人电话
          faxNumber: ctmInfo.faxNumber, // 传真号码
          creditCode: consult.creditCode, // 统一社会信用代码
          creditLevel: ctmInfo.creditLevel, // 信用等级
          creditLevelName: ctmInfo.creditLevelName, // 信用等级
          eSignatureUrl: consult.eSignatureUrl,
          acceptSMS: ctmInfo.acceptSMS, //受理短信
        },
        accountInfo: {
          accountNo: accountInfo.accountNo, // 账户编号
          accountType: accountInfo.accountType, // 账户类型
          accountTypeName: accountInfo.accountTypeName, // 账户类型
          payWay: accountInfo.payWay, // 缴费方式
          payWayName: accountInfo.payWayName, // 缴费方式
          entrustNo: accountInfo.entrustNo, // 托号
          openAccountBank: accountInfo.openAccountBank, // 开户银行
          openAccountBankName: accountInfo.openAccountBankName, // 开户银行
          openAccountName: accountInfo.openAccountName, // 开户名称
          bankAccount: accountInfo.bankAccount, // 银行账号
          entrustContract: accountInfo.entrustContract, // 银行协议号
          deliverAddr: accountInfo.deliverAddr, // 投递地址
          emailAddr: accountInfo.emailAddr, // 邮箱地址
          deliverWay: accountInfo.deliverWay, // 投递方式
          deliverWayName: accountInfo.deliverWayName // 投递方式
        },
        invoiceInfo: {
          invoiceType: accountInfo.invoiceType, // 发票类型
          invoiceTypeName: accountInfo.invoiceTypeName, // 发票类型
          invoiceTax: accountInfo.invoiceTax, // 纳税人识别号
          invoiceLink: accountInfo.invoiceLink, // 联系电话
          vatFlag: accountInfo.vatFlag, // 增值税标记
          vatFlagName: accountInfo.vatFlagName, // 增值税标记
          invoiceTitle: accountInfo.invoiceTitle, // 单位名称
          invoiceAddr: accountInfo.invoiceAddr, // 联系地址
          invoiceBank: accountInfo.invoiceBank, // 开户银行
          invoiceBankName: accountInfo.invoiceBankName, // 开户银行
          invoiceAccount: accountInfo.invoiceAccount // 银行账号
        },
        sendOrders: {
          surveyStaff: consult.surveyStaff && consult.surveyStaff.split(','), // 邀约人
          surveyStaffName: consult.surveyStaffName, // 邀约人
          surveyInviteDate: consult.surveyInviteDate//邀约时间
        },
        reconnaissance: {
          redLineConstruction:consult.redLineConstruction,//红线外施工
          redLineConstructionName:consult.redLineConstructionName,//红线外施工
          pjName: consult.pjName, // 工程名称
          beforeMeterLength: consult.beforeMeterLength, // 表前管长
          surveyResult: consult.surveyResult, // 勘察结论
          workFlag: consult.workFlag, // 满足施工条件
          designFlag: consult.designFlag, // 需要设计
          branchRoadFlag: consult.branchRoadFlag, // 需要办破路手续
          exceedHigh: consult.exceedHigh, // 超高标
          surveyDate: consult.surveyDate, // 勘察日期
          meterNum: consult.meterNum, // 装表个数
          meterBore: consult.meterBore, // 水表口径
          meterBoreName: consult.meterBoreName, // 水表口径名称
        },
        projectDesign: {
          designStaff: consult.designStaff, // 设计人员
          designStaffName: consult.designStaffName, // 设计人员
          designDate: consult.designDate, // 设计日期
          designDesc: consult.designDesc // 设计意见
        },
        budget: {
          budgetLaborMeterBefore:this.moneyFlag==1?consult.budgetLaborMeterBefore:0, // 表前人工费预算
          budgetLaborMeterAfter: this.moneyFlag==1?consult.budgetLaborMeterAfter:0, // 表后人工费预算
          budgetMatrMeterBefore:this.moneyFlag==1?consult.budgetMatrMeterBefore:0, // 表前材料费预算
          budgetMatrMeterAfter: this.moneyFlag==1?consult.budgetMatrMeterAfter:0, // 表后材料费预算
          budgetCost: this.moneyFlag==1?consult.budgetCost:0, // 预算费
          designCost: this.moneyFlag==1?consult.designCost:0, // 设计费
          depositMoney: this.moneyFlag==1?consult.depositMoney:0, // 押金
          budgetMoney: this.moneyFlag==1?consult.budgetMoney:0, // 预算金额
          prepayType: consult.prepayType, // 结算方式
          prepayTypeName: consult.prepayTypeName, // 结算方式
          projectCharge: consult.projectCharge, // 收款主体
          //projectChargeName: consult.projectChargeName, // 收款主体
          budgetComments: consult.budgetComments, // 预算意见
          disposableChargeFlag: consult.disposableChargeFlag,
          constructionUnit: consult.constructionUnit,
          budgetNo: consult.budgetNo, //预算编号
          budgetPerson: consult.budgetPerson, //预算人
        },
        projectProceeds: {
          budgetMoney: consult.budgetMoney, // 预算金额
          depositMoney: consult.depositMoney, // 押金
          actuallyReceived: consult.actuallyReceived, // 预缴款
          budgetComments: consult.budgetComments, // 预缴说明
          budgetPayWay: consult.budgetPayWay, // 预缴方式
          budgetPayWayName: consult.budgetPayWayName // 预缴方式
        },
        projectOrders: {
          constBeginDate: consult.constBeginDate, // 施工日期
          constEndDate: consult.constEndDate // 施工人员
        },
        installProject: {
          constComments: consult.constComments, // 安装说明
          wateringTime: consult.wateringTime, // 通水时间
        },
        projectAcceptance: {
          billNo: consult.billNo, // 工程编号
          // checkInviteStaff: consult.checkInviteStaff, // 验收人员
          // checkInviteStaffName: consult.checkInviteStaffName // 验收人员
        },
        invitationCheck: {
          checkInviteDate: consult.checkInviteDate,
          // checkInviteStaff: consult.checkInviteStaff, // 验收人员
          checkInviteStaff: consult.checkInviteStaff && consult.checkInviteStaff.split(','), // 邀约人
          checkInviteStaffName: consult.checkInviteStaffName // 验收人员
        },
        meterHook: {
          meterHookDate: consult.meterHookDate,
          meterHookComment: consult.meterHookComment
        },
        settlementCompile: {
          consult,
          ctmInfo,

        },
        settlementPayment: {
          backFillMoney: consult.backFillMoney, // 找补金额
          setmtPayDate: consult.setmtPayDate, // 结算日期
          refundWay: consult.refundWay, // 余额退款方式
          refundWayName: consult.refundWayName, // 余额退款方式
          openAccountBank: accountInfo.openAccountBank, // 开户行
          openAccountBankName: accountInfo.openAccountBankName, // 开户行
          openAccountName: accountInfo.openAccountName, // 户名
          bankAccount: accountInfo.bankAccount, // 账户号
          comments: consult.comments // 备注
        },
        materialsBill: {
          consultId: consult.id, // 工程单据主键ID
        },
        accountInfoId: accountInfo.id,
        ctmInfoId: ctmInfo.id,
        consultId: consult.id,
        billNo: consult.billNo,
        processState: consult.processState,
        processName: consult.processName,
        processInstanceId: consult.processInstanceId,
        tempId: consult.tempId || this.tempId,
        tenantId: consult.tenantId,
        updateCtmFlag: res.updateCtmFlag,
        updateAccountFlag: res.updateAccountFlag,
        approveFlag: res.approveFlag,
        userAccountTempId: consult.userAccountTempId,
        createTime: consult.createTime,
        userCtmTempId: consult.userCtmTempId
      }
      if (!this.noProcess)
        this.getHtmlData();
        this.$nextTick(() => {
          this.$refs.buildwaterMeter && this.$refs.buildwaterMeter.init()
        })
    },

    // 点击右侧流程步骤节点时切换表单和右上角按钮组
    toggleOperation (index) {
      this.selectedStep=index
      this.operation=index-1
      this.currentStep=this.operation+1
      // if (parseInt(index) > parseInt(this.currentStep)) {
      //   return
      // }      
      // this.clickStep = parseInt(index)+1;
      // this.operation = index-1
      const showButton = [
        ['save', 'noUpload','AUpload','DJSQ'],
        ['CSCX','YWSL','AUpload','DJSQ'],
        ['CSCX','AUpload'],
        ['CSCX','AUpload'],
        ['CSCX','GZLC','SGYS','AUpload'],
        ['CSCX','AUpload'],
        ['CSCX','AUpload','GCSK'],
        ['','AUpload'],
        ['SGPD', 'printPGD','GCSK','CSCX','AUpload'],
        ['SGPD', 'printPGD', 'GCSK','CSCX','AUpload'],
        ['GCSK','SGHT','CSCX','AUpload'],
        ['GCSK','SGHT','YSBG','YSLS','CSCX','AUpload'],
        ['BZJS', 'GCSK','SGHT','CSCX','AUpload'],
        ['GCSK','RESGHT','CSCX','AUpload','HTQD'],
        ['BZJS', 'GCSK', 'upload','CSCX','AUpload','HTQD'],
        ['CSCX','AUpload'],
        ['CSCX','AUpload'],
        ['CSCX','AUpload'],
        ['CSCX','DYSGHT','DYGSHT','CJSGHT','CJGSHT','HTGL','AUpload'],
        ['BCJS'], // 工程结算
        ['BCSK'], // 工程收款
      ]
      // //   console.log('toggle', this.detailInfo.consult)
      // 流程结束后未进行编制结算的，需在工程登记信息节点添加编制结算按钮
      if (this.detailInfo.consult.processState === "END" && this.detailInfo.consult.settlementFlag == 0) {
        showButton[0].push("BZJS")
      }
      // 已办结的去除暂存按钮
      if(this.detailInfo.consult.processState === "END"){
          showButton[0] = showButton[0].filter(item => item != 'save');
          showButton[1] = showButton[1].filter(item => item != 'save');
          showButton[0].push("HTQD")
      }
      this.$emit('changeButtons', showButton[index])
      this.$emit('currentStep',[this.currentStep,this.operation])
      if(this.operation<5){
        this.activeName='basic'
      }
      // 控制材料清单中导出按钮的显示跟隐藏，在预算编制跟工程结算要显示导出按钮
      if(this.operation == 5 || this.operation == 18){
        this.$nextTick(() => {
          this.$set(this.$refs.materialsBill, "materialOperation", true);
        })
      }
      if(this.operation == 3 ){
        this.$nextTick(() => {
          this.$set(this.$refs.materialsBill, "materialOperation", false);
        })
      }
    },
    // 根据流程状态切换右侧流程步骤
    changeStep (processState) {
      // console.log(this.stepConfig)
      const index = this.stepConfig.findIndex(item => item.includes(processState))
      // console.log(index);
      // console.log(index);
      this.stepval = index;
      if(this.stepval>(this.steps.length)-1){
        this.stepval = (this.steps.length)-1;
      }
      if(index != -1){
        // console.log(this.steps[index].key);
        this.toggleOperation(this.steps[this.stepval].key)
      }
      // console.log(index);
      const lastStep = 12;
        if(index!=-1){
          let step=parseInt(this.steps[this.stepval].key)
          let last=parseInt(this.steps[this.steps.length-1].key)
          this.currentStep=step>-1?step:last
          this.operation=step>-1?step-1:0
        }else{
          this.currentStep=3
          this.operation=2
        }
        if(this.editData.processState=='END'){
          this.currentStep=13
        }
      
      if(processState === 'END' || processState === 'CANCEL'){
        this.toggleOperation(0) 
      }
      this.$emit('currentStep',[this.currentStep,this.operation])
    },
    // 表单校验
    validate () {
      return new Promise((res, rej) => {
        if(this.$refs.engineerInfo&&(this.currentStep==0||this.currentStep==1||this.currentStep==2)){
          let params = {
              busicode: "ChargeLackDetail",
              data: {
                userNo: this.$refs.engineerInfo.getOloUserNO()
              }
            };
            this.$api
              .fetch({
                params //参数
              })
              .then(reaction => {
                this.oloUserNoList=reaction.length
                let type=0
                  type=this.$refs.engineerInfo.getPjType()
                  if((this.currentStep==0||this.currentStep==1||this.currentStep==2)&&type==2){
                        if(this.oloUserNoList!=0){
                          const h = this.$createElement;
                            this.$msgbox({
                              title: '温馨提示',
                              message: h('div', null, [
                                  h('span', null, [
                                  h('span', null, '该用户存在欠费，是否确认提交'),
                                  ])
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '提交',
                            cancelButtonText: '取消',
                            customClass: 'color-dialog'
                          }).then(action => {
                              res(null)
                              return
                          }).catch(e => {
                              rej()
                            return ;
                          })
                        }
                        else{
                          res(null)
                          return
                        }

                }
                return
              });

        }
        else{
                res(null)
              }

      }).then((res) => {
        return res
      })
    },

    async changeBeforeSubmit (data) {
      if(this.currentStep==0||this.currentStep==1||this.currentStep==2){
        let type=0
        type=this.$refs.engineerInfo.getPjType()
        if(type!=undefined&&type==2){
          let message = null
          message = await this.validate();
          // return new Promise((res, rej) => {
          //     return true
          //   })
          return message
        }
      }
      if(this.currentStep == 20){
        // 工程收款节点，提交前要检查金额
        let tempMessage = this.$refs.engineeringPayment.saveEngineeringPayment();
        if(tempMessage != ""){
          return tempMessage;
        }
      }
      if(this.currentStep == 4 || this.currentStep == 6 || this.currentStep == 19){
        // 施工勘察、预算编制、工程结算节点，提交前要检查数量跟类型
        let tempMessage = this.$refs.materialsBill.validateMaterialsBill();
        if(tempMessage != ""){
          return tempMessage;
        }
      }
      return null

    },
    async BeforeSubmit (data) {
      this.isSave = 1
      if (this.currentStep >= 5) {
        eventBus.$emit("waterValidate", this.currentStep)
      }
      eventBus.$emit("waterLength", 1)
      if (data.operation != 32) {      // console.log("currentStep"+this.currentStep);

        return null
      }
      const arr = ['engineerInfo', 'ctmInfo', 'accountInfo', 'invoiceInfo', 'sendOrders', 'reconnaissance', 'projectDesign', 'budget', 'projectOrders', 'installProject', 'projectAcceptance', 'settlementCompile', 'settlementPayment', 'invitationCheck', 'meterHook', "engineeringSettlement","engineeringPayment"]
      let errorInfo = ''
      return new Promise(async resolve => {
        let result = null
        for (let i = 0; i < arr.length; i++) {
          if (this.$refs[arr[i]]) {
            try {

              result =await this.$refs[arr[i]].$refs.form.validate()
              console.log(result);
            } catch (e) {
              // console.log(JSON.stringify(e));
              result = e
                if(Object.values(e).length!=0){
                  resolve(Object.values(Object.values(e)[0])[0].message)
                }
            }
            if (result == false) {
              break
            }
          }
        }
          if (result) {
            //console.log(this.waterLength);
            //工程施工水表校验
            if (this.waterLength == 0 && this.currentStep == 9) {
              resolve("水表数据为空，无法提交")
            }


            if (this.$refs.buildwaterMeter && this.$refs.buildwaterMeter.validate) {
              this.$refs.buildwaterMeter.validate() ? '' : resolve("水表信息未填完整（装表地址、水表模式、水表形式、水表表位）")



            }

          }
          if (result == false) {
            resolve('表单未通过校验')
          } else if (this.$refs.projectAcceptance && this.$refs.projectAcceptance.validate) {
            //   this.$refs.projectAcceptance.validate() ? resolve('') : resolve('需要通过全部验收子项才能提交表单')
            this.$refs.projectAcceptance.validate() ? resolve('') : resolve('验收结论为保留通过或不通过的需填写描述')
          } else {
            if (this.waterLength == 0 && this.currentStep ==12) {
              if (this.waterLength == 0) {
                resolve("立户数据为空,无法提交")
              }
            }
            //立户提交前校验未填数据
            if(this.currentStep == 12 && this.registerMustWrite == false){
              resolve('用户编号：' + this.registerMustNserNo[0] + '立户必填项未填完整');
            }
            if(this.currentStep==8){
              this.$refs.projectOrders.validate()?resolve(''):resolve('开始时间不能大于结束时间')
            }
            if(this.currentStep==6){
              let mes=this.$refs.budget.validate()
              mes==true?resolve(''):resolve(mes)
            }
            resolve('')
          }
      })
    },
    // 展示更多
    showMore (val, icon) {
      if (this[val]) {
        this[val] = false;
        this[icon] = "el-icon-plus";
      } else {
        this[val] = true;
        this[icon] = "el-icon-minus";
      }
    },
    // 获取水表数组
    getMeterList(val){
      this.$emit('getMeterList',val)
    }
  },
  computed: {
    showUpload () {
      // return !this.editData.processState || this.editData.processState == '' || this.editData.processState == 'register'
      return true;
    },
    dataArchiveStep () {
      if (this.clickStep === 12) {
        this.viewAttachment(true);
      }
      return this.clickStep === 12;
    }
  }
}
</script>

<style lang="scss" scoped>
.engineerApprovalEdit {
  height: 100%;
  .process-left {
    height: calc(100% - 41px);
  }
  .el-step.greyInfo /deep/ {
    .el-step__icon {

      color:rgb(192,196,204) !important;
      border:2px solid rgb(192,196,204) !important;
    }
    .el-step__title {

      color: rgb(192,196,204);
    }

    .el-step__head {
      // color:rgb(102, 194, 60)
      color: rgb(192,196,204);
    }
    .el-step__icon .is-text{
    }
    // .el-step__head.is-finish{
    //   color: LightGray;
    // }
  }



  .el-step.blod /deep/ {
    .el-step__icon {
      width: 30px;
      height: 30px;
      position: relative;
      left: -4px;
      color: black;
      border: 2px  black solid;
    }
    .el-step__title {
      font-weight: bolder;
      font-size: 1.1rem;
      color: black;
      
    }
    .is-wait{
        color: black !important;
        font-weight:bolder !important;
      }
    .el-step__head {
      // color:rgb(102, 194, 60)
      color: black;
    }
  }
  .el-step.haveDone /deep/ {
    .el-step__title {
      font-weight: normal;
      color: rgb(102, 194, 60);
    }
    .el-step__head {
      // color:rgb(102, 194, 60)
      color: rgb(102, 194, 60);
      border-color: rgb(102, 194, 60);
    }
    .el-step__line {
      // color:rgb(102, 194, 60)
      color: rgb(102, 194, 60);
    }
  }
  /deep/ {
    .el-tabs--border-card {
      height: 100%;
      border: 0;
      .el-tabs__content {
        padding: 15px 0;
        height: calc(100% - 51px);
        overflow-y: auto;
      }
    }
  }
  .QRCode {
    float: right;
    margin-top: -3.5px;
  }
    .processInfo .el-step.selected .el-step__head {
    background-color: black;
    color: white;
  }

  .processInfo .el-step.selected .el-step__line {
    border-color: black;
  }
}
.el-step.selected /deep/ {
    .el-step__icon {
      width: 30px;
      height: 30px;
      position: relative;
      left: -4px;
      color: black;
      border: 2px  black solid;
    }
    .el-step__title {
      font-weight: bolder;
      font-size: 1.1rem;
      color: black;
      
    }
    .is-wait{
        color: black !important;
        font-weight:bolder !important;
      }
    .el-step__head {
      // color:rgb(102, 194, 60)
      color: black;
    }
  }
</style>

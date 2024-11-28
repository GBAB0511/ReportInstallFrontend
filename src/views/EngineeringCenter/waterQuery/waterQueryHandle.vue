<template>
  <div class="waterQueryHandle process">
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
      <!-- 预览电子签名 -->
      <el-dialog append-to-body :title="signName" :visible.sync="signVisible"  :close-on-click-modal="false" class="common-dialog">
           <img src="@/assets/images/sign.jpg" alt="签名">
    	</el-dialog>
      <!-- 登记 -->
      <div v-if="operationShow == 'register' || operationShow == 'Process-task8'" class="process-left">
        <waterQueryEdit ref="waterQueryEdit" 
          :NotDisabled="NotDisabled"
          :indexAdd="indexAddDate"
          :wQEditData="formData"
          @fromChild="fromChildVal"
        ></waterQueryEdit>
      </div>
    <div class="process-left" v-show="operationShow != 'register' && operationShow != 'Process-task8'">
      <el-form :model="formData" class="formBill" :inline="true" ref="form" :rules="rules" size="mini" label-width="130px">
        <el-form-item label="单据编号：" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.consult.billNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单据日期：" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.consult.billDate" placeholder=""></el-input>
        </el-form-item>
        <!-- 勘察 -->
        <div v-if="operationShow == 'survey' || operationShow == 'Process-task1'"   >
            <legend class="legendColumn">  勘察信息 </legend>
              <el-form-item  class="Remarks" style=" margin-left: 70px;">
                <el-checkbox  true-label=1 false-label=0 v-model="formData.consult.branchRoadFlag" :disabled="NotDisabled">需要办开挖许可证手续</el-checkbox>
                <el-checkbox  true-label=1 false-label=0 v-model="formData.consult.exceedHigh" :disabled="NotDisabled">超标高</el-checkbox>
              </el-form-item>
              <br>
              <el-form-item label="勘察人员：" prop="consult.surveyStaff" :class="{'disable-item': NotDisabled}">
                <el-select v-model="formData.consult.surveyStaff" size="mini" placeholder="勘察人员" v-if="!NotDisabled">
                  <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.consult.surveyStaffName}}</span>
              </el-form-item>

              <el-form-item label="勘察日期：" prop="consult.surveyDate" :class="{'disable-item': NotDisabled}">
                <el-date-picker v-model="formData.consult.surveyDate" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期"></el-date-picker>
                <span v-else>{{formData.consult.surveyDate}}</span>
              </el-form-item>
              <el-form-item label="勘察结论：" class="Remarks" prop="consult.surveyResult" :class="{'disable-item': NotDisabled}">
                <el-input type="textarea" v-model="formData.consult.surveyResult" v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.surveyResult}}</span>
              </el-form-item>
        </div>
        <!-- 设计 -->
        <div v-if="operationShow == 'design' || operationShow == 'Process-task9'"   >
          <el-tabs type="border-card" tab-position="bottom"  v-model="activeName" @tab-click="tabCurrent">
            <el-tab-pane label="基础信息" name='基础信息'>
                <legend class="legendColumn">  设计信息 </legend>
                  <el-form-item label="设计人员：" prop="consult.designStaff" :class="{'disable-item': NotDisabled}">
                    <!--el-input v-model="formData.consult.designStaff" clearable :disabled="NotDisabled"></el-input-->
                    <el-select v-model="formData.consult.designStaff" size="mini" placeholder="设计人员" v-if="!NotDisabled">
                      <el-option v-for="item in designStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                    </el-select>
                    <span v-else>{{formData.consult.designStaffName}}</span>
                  </el-form-item>
                  <el-form-item style="width:280px" label="施工人员：" size="mini" prop="consult.installStaff" :class="{'disable-item': NotDisabled}">
                    <el-select v-model="formData.consult.installStaff" multiple placeholder="请选择" v-if="!NotDisabled">
                      <span slot="prefix">{{installStaffName}}</span>
                      <el-option v-for="item in installStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                    </el-select>
                    <span v-else>{{formData.consult.installStaffName}}</span>
                  </el-form-item>
                  <el-form-item label="设计日期：" prop="consult.designDate" :class="{'disable-item': NotDisabled}">
                    <el-date-picker v-model="formData.consult.designDate" value-format="yyyy-MM-dd" type="date" v-if="!NotDisabled" placeholder="选择日期"></el-date-picker>
                    <span v-else>{{formData.consult.designDate}}</span>
                  </el-form-item>
                  <el-form-item label="设计说明：" class="Remarks" prop="consult.designDesc" :class="{'disable-item': NotDisabled}">
                    <el-input type="textarea" v-model="formData.consult.designDesc" v-if="!NotDisabled"></el-input>
                    <span v-else>{{formData.consult.designDesc}}</span>
                  </el-form-item>
            </el-tab-pane>
            <el-tab-pane  label="施工材料" name='施工材料'>
              <legend class="legendColumn">  施工材料 </legend>
                <ConstructionMaterials
                  ref="ConstructionMaterials"
                  :isId="formData.consult.id"
                  :NotDisabled="NotDisabled">
                </ConstructionMaterials>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 编制预算 -->
        <div v-if="operationShow == 'budget' || operationShow == 'sub_pj_consult_budget' || 
          operationShow == 'sub_pj_consult_budget1' || operationShow == 'sub_pj_consult_budget2' || 
          operationShow == 'sub_pj_consult_budget3' || operationShow == 'sub_pj_consult_budget4' "   >
            <legend class="legendColumn">  编制预算信息（单位：元） </legend>
              <el-form-item label="表前人工费预算：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetLaborMeterAfter" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.budgetLaborMeterAfter}}</span>
              </el-form-item>
              <el-form-item label="表后人工费预算：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetLaborMeterBefore" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.budgetLaborMeterBefore}}</span>
              </el-form-item>
              <el-form-item label="表前材料费预算：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetMatrMeterAfter" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.budgetMatrMeterAfter}}</span>
              </el-form-item>
              <el-form-item label="表后材料费预算：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetMatrMeterBefore" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.budgetMatrMeterBefore}}</span>
              </el-form-item>
              <el-form-item label="其他预算：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetOther" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.budgetOther}}</span>
              </el-form-item>
              <el-form-item label="设计费：" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.designCost" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.designCost}}</span>
              </el-form-item>
              <el-form-item label="用水保证金："  prop="consult.depositMoney" :class="{'disable-item': NotDisabled}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.depositMoney" size="mini" clearable v-if="!NotDisabled" ></el-input>
                <span v-else>{{formData.consult.depositMoney}}</span>
              </el-form-item>
              <el-form-item   prop="consult.budgetMoney" :class="{'disable-item': NotDisabled}">
                <template slot="label"><span style="color:red;">* </span>预算合计：</template>
               <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetMoney" size="mini" clearable v-if="!NotDisabled"></el-input>
               <span v-else>{{formData.consult.budgetMoney}}</span>
              </el-form-item>
              <el-form-item label="结算方式："  prop="consult.prepayType" :class="{'disable-item': NotDisabled}">
                <el-select v-model="formData.consult.prepayType" clearable size="mini" v-if="!NotDisabled">
                  <el-option v-for="item in dictionaryData.PCW" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-else>{{formData.consult.prepayTypeName}}</span>
              </el-form-item>
              <el-form-item label="编制人员："  prop="consult.budgetStaff" :class="{'disable-item': NotDisabled}">
                <!--el-input v-model="formData.consult.budgetStaff" size="mini" clearable :disabled="NotDisabled"></el-input-->
                <el-select v-model="formData.consult.budgetStaff" size="mini" placeholder="编制人员" v-if="!NotDisabled">
                  <el-option v-for="item in budgetStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.consult.budgetStaffName}}</span>
              </el-form-item>
              <el-form-item label="工程收款主体："  prop="consult.projectCharge" :class="{'disable-item': NotDisabled}">
                <el-select v-model="formData.consult.projectCharge" clearable size="mini" v-if="!NotDisabled">
                  <el-option v-for="item in payeeData" :key="item.id" :label="item.subjectName" :value="item.id"></el-option>
                </el-select>
                <span v-else>{{formData.consult.projectCharge}}</span>
              </el-form-item>
              <el-form-item label="编制日期："  prop="consult.budgetDate" :class="{'disable-item': NotDisabled}">
                <el-date-picker v-model="formData.consult.budgetDate" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期"></el-date-picker>
                <span v-else>{{formData.consult.budgetDate}}</span>
              </el-form-item>
              <el-form-item label="编制说明：" class="Remarks" prop="consult.budgetComments" :class="{'disable-item': NotDisabled}">
                <el-input type="textarea" v-model="formData.consult.budgetComments" v-if="!NotDisabled"></el-input>
                <span v-else>{{formData.consult.budgetComments}}</span>
              </el-form-item>
            <!-- <legend class="legendColumn">流程处理</legend>
              <div id="workflowDiv"></div> -->
          <!-- </el-form> -->
        </div>
        <!-- 工程收款 -->
          <div v-if="operationShow == 'charge' || operationShow == 'charge-approval'">
            <legend class="legendColumn"> 收款信息 </legend>

            <el-form-item label="预缴合计：" prop="prepayMoney" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetMoney" size="mini" clearable class="read-only" :disabled="NotDisabled"></el-input>
            </el-form-item>

            <el-form-item label="用水保证金合计：" prop="depositMoney" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.depositMoney" size="mini" clearable class="read-only" :disabled="NotDisabled"></el-input>
            </el-form-item>

            <el-form-item label="应收合计：" prop="budgetMoney" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.prepayMoney" size="mini" clearable class="read-only" :disabled="NotDisabled"></el-input>
            </el-form-item>

            <el-form-item label="收款人员：" prop="budgetPayStaff" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetPayStaff" size="mini" clearable class="read-only" :disabled="NotDisabled"></el-input>
            </el-form-item>

            <el-form-item label="工程收款主体："  prop="consult.projectCharge" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.projectCharge" clearable size="mini" v-if="!NotDisabled">
                  <el-option v-for="item in payeeData" :key="item.id" :label="item.subjectName" :value="item.id"></el-option>
                </el-select>
              <span v-else>{{formData.consult.projectCharge}}</span>
            </el-form-item>

            <el-form-item label="收款日期：" prop="budgetPayDate" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.budgetPayDate" size="mini" clearable class="read-only" :disabled="NotDisabled"></el-input>
            </el-form-item>

            <el-form-item label="缴款说明：" class="Remarks" prop="budgetPayComments" :class="{'disable-item': NotDisabled}">
              <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="textarea" disabled v-model="formData.consult.budgetPayComments"></el-input> -->
              <span>{{formData.consult.budgetPayComments}}</span>
            </el-form-item>

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
      <el-steps :active="operation" direction="vertical"  finish-status="success">
        <el-step title="登记信息" @click.native="stepActive(1,'register')"> </el-step>
        <el-step title="勘察" @click.native="stepActive(2,'survey')"></el-step>
        <el-step title="设计" @click.native="stepActive(3,'design')"></el-step>
        <el-step title="编制预算" @click.native="stepActive(4,'budget')"></el-step>
        <el-step title="工程收款" @click.native="stepActive(5,'charge')"></el-step>
      </el-steps>
    </div>
  </div>
</template>
<script>
import waterQueryEdit from "./waterQueryEdit";//登记界面
import uploadFile from '@/components/uploadPic';
import ConstructionMaterials from '@/components/ConstructionMaterials';
import procedure from "@/components/procedure"
import choosectm from "@/components/ctmInfor"
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name:"waterQueryHandle",
  props: ['editNeedData','openWay'],
  // props:[],
  components: {
    waterQueryEdit,
    uploadFile,
    ConstructionMaterials,
    procedure,
    choosectm,
    AttachmentViewInfo
  },
  data() {
    return {
      //勘察人员
      meterReaderList: [],
      designStaffList:[],//设计人员
      budgetStaffList:[],
      installStaffList:[],//施工人员，可多选
      indexAddDate:'',
      // 是否可编辑
      NotDisabled: true,
      approvalShow: true,
      eleSignType:"签名",
      procedureShow:true,
      procedureIcon:"el-icon-minus",
      uploadFileShow:true,
      uploadIcon:"el-icon-minus",
      signName:"电子签名",
      signVisible:false,
      hangUp:{},
      activeName: '基础信息',
      isShow:false,
      oldData:[],
      uploadPic:false,//上传附件
      isExecution:false,//施工材料
      editContent: false,//多水表录入
      isEdit:false,//多水表录入是否可编辑
      editContent1:false,
      dictionaryData:[],//数据字典存值
      //表单信息
      formData:{
        accountInfo:{//账户信息
          id: "",//
          //账户信息
            accountNo: "",//账户编号
            payWay: "3",//缴费方式
            accountType: "1",//账户类型
            openAccountBank: "",//开户银行
            openAccountName: "",//开户名称
            bankAccount: "",//银行账户
            entrustNo: "",//托号
            entrustContract: "",//托收合同
            deliverWay: "",//投递方式
            deliverAddr: "",//投递地址
            emailAddr: "",//邮箱地址
            bankSn:"",//开户行号
          // 开票信息
            invoiceType: "",//发票类型
            invoiceTitle: "",//单位名称
            invoiceTax: "",//纳税人识别号
            invoiceAddr: "",//联系地址
            invoiceLink: "",//座机号码
            invoiceBank: "",//开户银行
            invoiceAccount: "",//银行账户
        },
        consult:{
            id: "",//
            tenantId: "",//租户id
          // 开户信息-经办人信息
            agentMan: "",//经办人姓名
            agentCertNo: "",//经办人证件号码
            agentCertType: "1",//经办人证件类型
            agentLinkTel: "",//经办人联系电话
          //单据信息
            billDate: "",//单据日期
            billNo: "",//单据编号
          // 工程信息
            pjName: "",//工程名称
            pjType: "",//工程类型
            adminArea: [],//行政区域
            businessArea: "",//营业区域
            businessAbode: "",//营业所
            urgentFlag: "2",//紧急程度
            installAddr: "",//装表地址
            sourceFlag: "1",//信息来源
            oloUserNo: "",//原户号
            suserNo: "",//总表户号
            suserNo2: "",//总表户号2
            limitDate: "",//用水期限
            limitFlag: "q",//用水期
            comments: "",//备注
          // 流程信息
            processInstanceId: "",//流程id
            processName: "",//节点名称
            processState: "",//节点编号
          // 勘察节点信息
            branchRoadFlag: 1,//需要办开挖许可证手续
            exceedHigh: 1,//超标高
            surveyDate: this.common.date(),//勘察日期
            surveyResult: "",//勘察结论
            surveyStaff: "",//勘察人员
          // 设计节点 信息
            designDate: this.common.date(),//设计日期
            designDesc: "",//设计说明
            designStaff: "",//设计人员
            installStaff:null,
          // 预算节点信息
            budgetLaborMeterAfter: "",//表前人工费预算
            budgetLaborMeterBefore: "",//表后人工费预算
            budgetMatrMeterAfter: "",//表前材料费预算
            budgetMatrMeterBefore: "",//表后材料费预算
            budgetOther: "",//其他预算
            designCost: "",//设计费
            depositMoney: "",//押金
            budgetMoney: "",//预算合计
            prepayType: "1",//结算方式
            budgetStaff: "",//预算编制人员
            projectCharge:"",//工程收款主体
            budgetDate: this.common.date(),//预算编制日期
            budgetComments: "",//预算编制说明
            // 工程收款节点
            prepayMoney: "",//预缴合计
            depositMoney: "",//押金合计
            budgetMoney: "",//应收合计
            budgetPayStaff: "",//收款人员
            budgetPayDate: this.common.date(),//收款日期
            budgetPayComments: "",//缴款说明
            
          },
        ctmInfo:{
          id: "",//
          ctmNo: "",//开户编号
          ctmType: "1",//开户类型
          certType: "1",//证件类型
          certNo: "",//开户证件号码
          creditLevel: "1",//信用等级
          ctmAddr: "",//业主地址
          ctmName: "",//业主名称
          faxNumber: "",//传真号码
          linkTel: "",//固定电话
          mobile: "",//业主电话
        },
      },
      operationShow:'',
      operation:1,
      rules: {
        consult:{
          surveyDate:[{ required:true, message:"勘察日期不能为空", trigger: "change"}],
          surveyResult:[{ required:true, message:"勘察结论不能为空", trigger: "change"}],
          surveyStaff:[{ required:true, message:"勘察人员不能为空", trigger: "change"}],

          designDate: [{ required:true, message:"设计日期不能为空", trigger: "change"}],
          //designDesc: [{ required:true, message:"设计说明不能为空", trigger: "blur"}],
          designStaff: [{ required:true, message:"设计人员不能为空", trigger: "change"}],
          installStaff:[{ required:true, message:"施工人员不能为空", trigger: "change"}],
          //depositMoney: [{ required:true, message:"押金不能为空", trigger: "blur"}],
          //budgetMoney: [{ required:true, message:"预算合计不能为空", trigger: "blur"}],
          prepayType: [{ required:true, message:"结算方式不能为空", trigger: "change"}],
          budgetStaff: [{ required:true, message:"预算编制人员不能为空", trigger: "blur"}],
          projectCharge:[{ required:true, message:"工程收款主体不能为空", trigger: "blur"}],
          budgetDate: [{ required:true, message:"预算编制日期不能为空", trigger: "change"}],
          budgetComments: [{ required:true, message:"预算编制说明不能为空", trigger: "blur"}],
        }
      },
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
      attachmentData: [],
      budgetBoolean:"",
      payeeData:{}
    }
  },
  computed: {
    installStaffName() {
      return this.installStaffList && this.installStaffList.filter(item => this.formData.consult.installStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
    }
  },
  mounted() {
    if(this.editNeedData && this.editNeedData.id) {

      let params = {
        busicode: "PjConsultQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.clearformData()
          this.formData = res
          this.formData.consult.surveyDate=this.common.date();
          this.formData.consult.designDate=this.common.date();
          this.formData.consult.budgetDate=this.common.date();
          if(this.formData.consult.installStaff.length>0){
            this.formData.consult.installStaff=this.formData.consult.installStaff.split(',');
          }else{
            this.formData.consult.installStaff=[]
          }
          if(res.consult.processState==''){
            this.operationShow='register';
            this.openWay!=="waterMeterHandleInfo" && this.$parent.showSuspend && this.$parent.showSuspend(0);
          }else if(res.consult.processState=='suspend' || res.consult.processState=='charge-approval'){
            this.getUserAuthority(res.consult.processState);
            this.operationShow='charge-approval';
            this.formData.consult.processState='charge-approval'
          }else if(res.consult.processState=='sub_pj_consult_budget1' || res.consult.processState=='sub_pj_consult_budget2'
            || res.consult.processState=='sub_pj_consult_budget3' || res.consult.processState=='sub_pj_consult_budget4'){
              this.budgetBoolean=res.consult.processState
              this.operationShow='budget';
              this.formData.consult.processState='budget'
          }else{
            this.operationShow = res.consult.processState
            this.openWay!=="waterMeterHandleInfo" && this.$parent.showSuspend && this.$parent.showSuspend(0);
          }
          this.$emit('detail', res)
          //审批界面接口
          this.getHtmlData();
        });
    } else {
      this.clearformData()
      //审批界面接口
      this.getHtmlData();
    }
    this.getReadingStaff();
    this.getInstaffStaff();
    this.getDesignStaffList();
    this.getbudgetStaff();
    this.getProjectPayee();
  },
  watch: {
    operationShow(newVal,oldVal){
      if (newVal == 'END') {
          this.operation = 0;
          this.NotDisabled = true;
          this.operationShow = 'register'
      }else if(newVal == 'CANCEL'){
          this.operation = 0;
          this.NotDisabled = true;
          this.operationShow = 'register'
      }else{
        if (newVal == 'survey' || newVal == 'Process-task1') {//勘察
          this.operation = 1;
          this.formData.consult.branchRoadFlag = this.formData.consult.branchRoadFlag==1?true:false
          this.formData.consult.exceedHigh = this.formData.consult.exceedHigh==1?true:false
        }else if( newVal == 'design' || newVal == 'Process-task9'){//设计
          this.operation = 2;
        }else if( newVal == 'budget' || newVal == 'sub_pj_consult_budget' || newVal == 'sub_pj_consult_budget1'
            || newVal == 'sub_pj_consult_budget2'|| newVal == 'sub_pj_consult_budget3'|| newVal == 'sub_pj_consult_budget4'){//预算
          this.getDictionary();
          this.operation = 3;
        }else if( newVal == 'register' || newVal == 'Process-task8'){//登记
          this.operation = 0;
          this.indexAddDate = 'handle'
        }else if( newVal == 'charge' || newVal == 'charge-approval'){//登记
          this.operation = 4;
        }
        //在相同业务节点下
        if (this.formData.consult.processState == newVal) {
          if (this.formData.approveFlag == 1) {
            //审批节点
            this.NotDisabled = true//不可修改
          }else{
            //非审批节点
            this.NotDisabled = false//可修改
          }
          // 不同的业务节点
        }else{
          if (this.formData.consult.processState ==''){
            this.NotDisabled = false//草稿可修改
          }else{
            this.NotDisabled = true//不可修改
          }
          
          /*
          if (this.formData.approveFlag == 1) {
            //审批节点
            // console.log('审批节点不可修改');
            this.NotDisabled = true//不可修改
          }else{
            //非审批节点
            if (this.formData.consult.processState =='budget') {
              //登记节点 预算节点时 不可修改
              this.NotDisabled = true//不可修改
            }else{
              //登记节点 非预算节点 可修改
              this.NotDisabled = false//可修改
            }
          }*/
        }
      }
    },
  },
  methods: {
    //获取登录人权限
    getUserAuthority(val){
      this.$api
        .fetch({
          params: {busicode:"UserAuthority"} //参数
        })
        .then(res => {
          let flag = false
          res.roles.forEach((item,index)=>{
            if(item.roleId==51 || item.roleId==50){
              flag=true
            }
          })
          if(flag && val=='suspend'){
            this.openWay!=="waterMeterHandleInfo" && this.$parent.showSuspend(2);
          }else if(flag) {
            this.openWay!=="waterMeterHandleInfo" && this.$parent.showSuspend(1);
          }else{
            this.openWay!=="waterMeterHandleInfo" && this.$parent.showSuspend(0);
          }
          
        });
    },
    //各节点必填校验
    validateFormData(val){
      let rel = '1';
      let valid = [];
      
      
      if(val.consult.processState==='survey'){
        valid.push(['surveyDate','surveyResult','surveyStaff']);
      }else if(val.consult.processState==='design'){
        valid.push(['designDate','designDesc','designStaff']);
      }else if(val.consult.processState==='budget'){
        valid.push(['depositMoney','budgetMoney','prepayType','budgetStaff','budgetDate','budgetComments']);
      }
      
      if(valid.length>0){
        this.$refs.form.validateField(valid,(surveyError) => {
          if(surveyError){
            rel='当前必填项未完善，请检查'
          }
        });
      }
      return rel;
    },
    //工程暂停
    suspend(){
      var _this = this;
      var params = {
        "busicode": "PjConsultSuspend",
        "data": { "id": _this.formData.consult.id },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '暂停成功',
            type: 'success'
          });
          this.$parent.showSuspend(2);
          this.$parent.closeDialog();
        });
    },
    recovery(){
      var _this = this;
      var params = {
        "busicode": "PjConsultRecovery",
        "data": { "id": _this.formData.consult.id },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '启动成功',
            type: 'success'
          });
          this.$parent.showSuspend(1);
          this.$parent.closeDialog();
        });
    },
    //打印流程审批记录
    workFlowPrint(){
      let _this=this
      let data={
        billId:_this.formData.consult.id,
        processCode:"pj_consult"
      }
      let params = {
        busicode: "WorkFlowHistoryPrint",
        data:data,
      };
      _this.$api.fetch({
        params: params,
      }).then(res => {
          let data = res
          _this.common.print('print', 'WorkFlowHistoryPrint', '', data[0], _this);
      })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView("PJ_CONSULT",
        "审批流配置:" + _this.formData.consult.processName + "(" + _this.formData.consult.billNo + ")",
        _this.formData.consult.id, 
        _this.formData.consult.processInstanceId, "workflowDiv", _this, 
        () => {
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
          if(_this.formData.consult.processState=='design'){
            _this.saveExecution();
          }
          if(_this.formData.consult.processState=='register' || _this.formData.consult.processState==''){
           _this.SaveWaterMeter();
          }
        },
        _this.formData.approveFlag , 
        'PjConsultSave',//保存方法的接口名称
        );
    },
    async BeforeSubmit(val){
      //收款机节点驳回判断
      //console.log(this.formData.consult.id,val.operation);
      /*
      if((this.formData.consult.processState==='charge-approval' || this.formData.consult.processState==='charge')&& val.operation==="1"){
        var _this = this;
        var params = {
          "busicode": "ProjectReceiptDelete",
          "data": { 
              billId: this.formData.consult.id,
              chargeFlag:1 
            },
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            if(res!='1'){
              return res
            }else{
              return null
            }
          });
      }
      //收款机节点不允许提交
      if((this.formData.consult.processState==='charge-approval' || this.formData.consult.processState==='charge')&& val.operation==="32"){
        return "当前节点不允许提交,请到工程收费进行收费"
      }
      */
      return null
    },
    // 勘察人员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "7" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...res];
        });
    },
    // 施工人员数据获取
    getInstaffStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "8" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.installStaffList = [...res];
        });
    },
    // 编制人员数据获取
    getbudgetStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "14" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.budgetStaffList = [...res];
        });
    },
    // 设计人员数据获取
    getDesignStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "9" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.designStaffList = [...res];
        });
    },
    // getTotal(){
    //   this.formData.consult.budgetMoney=Number(this.formData.consult.budgetLaborMeterAfter) + 
    //     Number(this.formData.consult.budgetLaborMeterBefore) + Number(this.formData.consult.budgetMatrMeterAfter) +
    //     Number(this.formData.consult.budgetMatrMeterBefore) + Number(this.formData.consult.budgetOther) + 
    //     Number(this.formData.consult.designCost);
    // },
    getFormbData(index){//步骤条-工程登记-暂存/暂存
      let _this = this
      // 行政区域 只需要传最后一个值过去 
      if (typeof _this.formData.consult.adminArea == 'object') {
        _this.formData.consult.adminArea = _this.formData.consult.adminArea.pop()
      }
      if (typeof _this.formData.consult.businessArea == 'object') {
        _this.formData.consult.businessArea = _this.formData.consult.businessArea.pop()
      }
      // // 开户银行 数据格式处理
      // if (_this.formData.accountInfo.openAccountBank.length != 0) {
      //   _this.formData.accountInfo.openAccountBank = _this.formData.accountInfo.openAccountBank[0]
      // }
      // // 开户银行 数据格式处理
      // if (_this.formData.accountInfo.invoiceBank.length != 0) {
      //   _this.formData.accountInfo.invoiceBank = _this.formData.accountInfo.invoiceBank[0]
      // }
      _this.formData.consult.installStaff=this.formData.consult.installStaff.toString();
      //console.log(_this.formData.consult.installStaff);
      _this.formData.accountInfo.openAccountBank = this.common.handleTreeData(_this.formData.accountInfo.openAccountBank)
      _this.formData.accountInfo.invoiceBank = this.common.handleTreeData(_this.formData.accountInfo.invoiceBank)
      this.formData.consult.branchRoadFlag = this.formData.consult.branchRoadFlag == true ? 1 : (this.formData.consult.branchRoadFlag == 1 ? 1 : 0)
      this.formData.consult.exceedHigh = this.formData.consult.exceedHigh == true ? 1 : (this.formData.consult.exceedHigh == 1 ? 1 : 0)
      if(this.operationShow == 'register' || this.operationShow == 'Process-task8'){
        let data = _this.$refs.waterQueryEdit.$refs.waterMeter.getData()
        _this.$set(_this.formData,'meterDto',{'consultId':'','userInfo':data});
      }
      //这2个节点传条件工流程分支使用
      
      if(this.budgetBoolean==='sub_pj_consult_budget2' || this.budgetBoolean==='sub_pj_consult_budget3'
              || this.budgetBoolean==='sub_pj_consult_budget4'){
          this.formData.formVariables={budgetMoney:Number(this.formData.consult.budgetMoney),user:sessionStorage.getItem("account")}
      }
      return this.formData
    },
      async Preservation() {
      let params = {
        "busicode": "PjConsultSave",
        "data": this.getFormbData()
      }
      let val = '1'
      this.$refs.waterQueryEdit.$refs.form.validate((valid)=>{
        if(!valid){
          val="当前必填项未完善，请检查"
        }
      })
      if(val!=='1'){
        this.$notify({
          title: "验证失败",
          message: val,
          type: "error"
        });
        return;
      }
      if(this.$refs.waterQueryEdit.$refs.waterMeter.tableData.length===0){
        this.$notify({
          title: '校验失败',
          message: '多水表至少要添加一条数据',
          type: 'error'
        });
        return
      }
       let receiptId=""
      if (this.wQEditData != '') {
          receiptId= this.formData.consult.id
      }else{
          receiptId= this.formData.consult.tempId
      }
       let accesooryParams = {
        "busicode": "AccessorySubmitJudge",
        "data": {receiptId:receiptId,receiptType:"PJ_CONSULT"}
      }
      let a =  await this.$api.fetch({
        params: accesooryParams,//参数
      })
     if(a!=null && a!="") {
        this.$notify({
              title: '',
              message: a,
              type: 'error'
        });
        return;
     }
     
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '表单保存成功',
          type: 'success'
        });
        if (this.formData.consult.id == '') {
          //获取id
          //this.details(res, 'Preservation')
          this.formData.consult.id=res.id
          this.SaveWaterMeter();
        }else{
          this.SaveWaterMeter();
        }
        
        //this.$refs.uploadFiles.submitFile(this.formData.consult.id);
        localStorage.setItem('billId', this.formData.consult.id)
        this.$parent.closeDialog();
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PCW,PJC"
        //结算方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
// 获取工程收款主体
    getProjectPayee() {
      var _this = this
      var params = {
        "busicode": "ProjectPayeeList",
        "data": {
          page:1,
          pageCount:1000,
          status:1
      }
        //结算方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.payeeData= res.list
      })
    },
//上传附件
    uploadAttachment(file) {
      let _this = this;
      //console.log(file)
      // const isJPG = file.file.type === 'image/jpg';
      // const isPNG = file.file.type === 'image/png';
      // if (!isJPG&&!isPNG) {
      //   this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
      //   return
      // }
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.formData.consult.id,
          receiptType: "PJ_CONSULT",
          accessoryNo: "000",
          file: file.file
        },
        //token: "krrjdev123", //
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });

          _this.$parent.AttachmentQty = _this.$parent.AttachmentQty + 1
        });
    },
    showTemplateDialog(){
      this.$refs.ConstructionMaterials.showTemplateDialog();//初始化 多水表页面
    },
    collapse(){
      if(this.approvalShow == true){
        this.approvalShow = false
        this.util.approvalShow(this.approvalShow, '.waterQueryHandle .process-left', '.waterQueryHandle .stepsCompar','.waterQueryHandle .StepCollapse', '.waterQueryHandle .leftChange')
      }else{
        this.approvalShow = true
        this.util.approvalShow(this.approvalShow, '.waterQueryHandle .process-left', '.waterQueryHandle .stepsCompar','.waterQueryHandle .StepCollapse', '.waterQueryHandle .leftChange')
      }
    },
    // 电子签名
    Signature(){
      if(this.eleSignType==="进行签名"){
        this.eleSignType = "查看";
        this.ruleForm.electronicSignature = "已签名";
      }else{
        this.signVisible = true;
      }
    },
    clearformData(){
      this.formData = {
        accountInfo:{//账户信息
          id: "",//
          //账户信息
            accountNo: "",//账户编号
            payWay: "3",//缴费方式
            accountType: "1",//账户类型
            openAccountBank: "",//开户银行
            openAccountName: "",//开户名称
            bankAccount: "",//银行账户
            entrustNo: "",//托号
            entrustContract: "",//托收合同
            deliverWay: "",//投递方式
            deliverAddr: "",//投递地址
            emailAddr: "",//邮箱地址
            bankSn:"",//开户行号
          // 开票信息
            invoiceType: "",//发票类型
            invoiceTitle: "",//单位名称
            invoiceTax: "",//纳税人识别号
            invoiceAddr: "",//联系地址
            invoiceLink: "",//座机号码
            invoiceBank: "",//开户银行
            invoiceAccount: "",//银行账户
        },
        consult:{
            id: "",//
            tenantId: "",//租户id
          // 开户信息-经办人信息
            agentMan: "",//经办人姓名
            agentCertNo: "",//经办人证件号码
            agentCertType: "1",//经办人证件类型
            agentLinkTel: "",//经办人联系电话
          //单据信息
            billDate: "",//单据日期
            billNo: "",//单据编号
          // 工程信息
            pjName: "",//工程名称
            pjType: "",//工程类型
            adminArea: [],//行政区域
            businessArea: "",//营业区域
            businessAbode: "",//营业所
            urgentFlag: "2",//紧急程度
            installAddr: "",//装表地址
            sourceFlag: "1",//信息来源
            oloUserNo: "",//原户号
            suserNo: "",//总表户号
            suserNo2: "",//总表户号2
            limitDate: "",//用水期限
            limitFlag: "q",//用水期
            comments: "",//备注
          // 流程信息
            processInstanceId: "",//流程id
            processName: "",//节点名称
            processState: "",//节点编号
          // 勘察节点信息
            branchRoadFlag: "",//需要办开挖许可证手续
            exceedHigh: "",//超标高
            surveyDate: this.common.date(),//勘察日期
            surveyResult: "",//勘察结论
            surveyStaff: "",//勘察人员
          // 设计节点 信息
            designDate: this.common.date(),//设计日期
            designDesc: "",//设计说明
            designStaff: "",//设计人员
            installStaff:null,
          // 预算节点信息
            budgetLaborMeterAfter: "",//表前人工费预算
            budgetLaborMeterBefore: "",//表后人工费预算
            budgetMatrMeterAfter: "",//表前材料费预算
            budgetMatrMeterBefore: "",//表后材料费预算
            budgetOther: "",//其他预算
            designCost: "",//设计费
            depositMoney: "",//押金
            budgetMoney: "",//预算合计
            prepayType: "1",//结算方式
            budgetStaff: "",//预算编制人员
            projectCharge:"",//工程收款主体
            budgetDate: this.common.date(),//预算编制日期
            budgetComments: "",//预算编制说明
            // 工程收款节点
            prepayMoney: "",//预缴合计
            depositMoney: "",//押金合计
            budgetMoney: "",//应收合计
            budgetPayStaff: "",//收款人员
            budgetPayDate: this.common.date(),//收款日期
            budgetPayComments: "",//缴款说明
          },
        ctmInfo:{
          id: "",//
          ctmNo: "",//开户编号
          ctmType: "1",//开户类型
          certType: "1",//证件类型
          certNo: "",//开户证件号码
          creditLevel: "1",//信用等级
          ctmAddr: "",//业主地址
          ctmName: "",//业主名称
          faxNumber: "",//传真号码
          linkTel: "",//固定电话
          mobile: "",//业主电话
        },
      }
    },
    addExecution(){//步骤条-设计-施工材料-添加
      this.$refs.ConstructionMaterials.addExecution();
    },
    saveExecution(){
      this.$refs.ConstructionMaterials.save();
    },
    // 多页签的点击
    tabCurrent(val,tab){
      if(val.index == '基础信息'){
        this.$emit('fromChildVal', val.index)//给父组件传递当前tabs值 0/登记界面 1/多水表界面  
      }else{
        this.$emit('fromChildVal', val.index)//给父组件传递当前tabs值 0/登记界面 1/多水表界面  
      }
    },
    //审批流程返回按钮
    operationReturn() {
      eventBus.$emit('operationReturn', false);
    },
    chooseCtm(){
      this.$emit('chooseCtm','chooseCtm')
    },
    //判断右侧流程节点是否可以点击
    processstep(){
      let process = 0;
      if(this.formData.consult.processState==='register' || this.formData.consult.processState==='Process-task8' || this.formData.consult.processState===''){
        process=1
      }else if(this.formData.consult.processState==='survey' || this.formData.consult.processState==='Process-task1'){
        process=2
      }else if(this.formData.consult.processState==='design' || this.formData.consult.processState==='Process-task9'){
        process=3
      }else if(this.formData.consult.processState==='budget' || this.formData.consult.processState==='sub_pj_consult_budget' 
          || this.formData.consult.processState==='sub_pj_consult_budget1' || this.formData.consult.processState==='sub_pj_consult_budget2' 
          || this.formData.consult.processState==='sub_pj_consult_budget3' || this.formData.consult.processState==='sub_pj_consult_budget4' ){
        process=4
      }else if(this.formData.consult.processState==='charge' || this.formData.consult.processState==='charge-approval'){
        process=5
      }else{//不是这些节点统一能查所有
        process=5
      }
      return process
    },
    stepActive(val,step){
      let processStep = this.processstep();
      if(processStep>=val){
        this.$emit('fromHandleChild',step)
        this.operationShow = step;
        this.operation = val-1;
        //审批界面接口
        this.getHtmlData();
      }
      
    },
    fromChildVal(val){
      this.$emit('fromChildVal', val)
    },
    SaveWaterMeter(){
      this.$refs.waterQueryEdit.SaveWaterMeter(this.formData.consult.id)
    },
    closeDialog(){
      this.$parent.closeDialog ? this.$parent.closeDialog() : this.$parent.$parent.closeDialog();
    },
    // 查看附件按钮
    viewAttachment(type) {
      this.receiptAccessory = {
        receiptType: "PJ_CONSULT",
        receiptId: this.formData.consult.id
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
      this.$emit('closeAttachment')
    },
  },
}
</script>
<style lang="scss" scoped>
.waterQueryHandle{
  height: 100%;
  .el-textarea.is-disabled .el-textarea__inner{
    color:#606266,
  }
}
</style>
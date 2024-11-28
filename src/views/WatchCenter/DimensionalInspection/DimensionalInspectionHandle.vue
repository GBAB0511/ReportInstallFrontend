<template>
  <div class="DimensionalInspectionHandle process">
    <div class="process-left">
      <el-form 
        :disabled="NotDisabled"
        :model="formData"
        ref="form"
        show-message="false"
        class="formBill"
        :inline="true"
        size="mini"
        label-width="130px"
      >
        <!-- 单据信息 -->
        <el-form-item label="水表编号：" :class="{'disable-item': NotDisabled}">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="searchUserNum" placeholder="请输入水表编号" @change="initMeterNo" clearable>
          </el-input>
        </el-form-item>
        <el-form-item v-if="searchBtnShow">
          <el-button class="searchBtn" @click="initMeterNo" icon="el-icon-search"></el-button>
        </el-form-item>
        <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo" :editType="0"></billInfo>     

        <!-- 水表信息 -->
        <meterBasicInfo  ref="meterBasicInfo" :editType="0"></meterBasicInfo>

        <!-- 维检信息 -->
        <div  v-if="operationShow == 'register'">
          <legend class="legendColumn">维检信息</legend>
              <el-form-item label="拆表日期：" :class="{'disable-item': NotDisabled}">
                  <el-date-picker v-if="!NotDisabled" v-model="formData.removeDate" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期">
                  </el-date-picker>
                  <span v-else>{{formData.removeDate}}</span>
              </el-form-item>
              <el-form-item label="送修日期：" :class="{'disable-item': NotDisabled}">
                  <el-date-picker v-if="!NotDisabled" v-model="formData.sendRepairDate" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期">
                  </el-date-picker>
                  <span v-else>{{formData.sendRepairDate}}</span>
              </el-form-item>
              <el-form-item label="维检类型：" :class="{'disable-item': NotDisabled}">
                  <el-select v-if="!NotDisabled" clearable v-model="formData.repairType" placeholder="维检类型">
                  <el-option v-for="item in dictionaryData.REPAIR_TYPE" :key="item.id" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                  <span v-else>{{formData.repairTypeName}}</span>
              </el-form-item>
              <el-form-item label="信息来源：" :class="{'disable-item': NotDisabled}">
                <el-select v-if="!NotDisabled" v-model="formData.sourceFlag" clearable placeholder="" >
                  <el-option v-for="item in dictionaryData.PIS" :key="item.id" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-else>{{formData.sourceFlagName}}</span>
              </el-form-item>
              <br>
              <el-form-item label="备注：" class="f2" :class="{'disable-item': NotDisabled}">
                  <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments"  size="mini" :rows="2" clearable placeholder="备注"></el-input>
                  <span v-else>{{formData.comments}}</span>
              </el-form-item>
        </div>

        <!-- 维修信息 -->
        <div  v-if="operationShow == 'repairInfo'">
          <legend class="legendColumn">维修信息</legend>
          <el-form-item label="维修结果：" class="f2" :class="{'disable-item': NotDisabled}">
              <el-input v-if="!NotDisabled" type="textarea" :rows="2" clearable v-model="formData.repairResult" placeholder=""></el-input>
              <span v-else>{{formData.repairResult}}</span>
            </el-form-item>
            <el-form-item label="维修日期：" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-if="!NotDisabled" v-model="formData.repairDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.repairDate}}</span>
            </el-form-item>
            <el-form-item label="维修说明：" class="f2" :class="{'disable-item': NotDisabled}">
              <el-input v-if="!NotDisabled" type="textarea" :rows="2" clearable v-model="formData.repairComments" placeholder=""></el-input>
              <span v-else>{{formData.repairComments}}</span>
            </el-form-item>
        </div>

        <!-- 检定信息 -->
        <div  v-if="operationShow == 'checkInfo' || operationShow == 'approval'">
          <legend class="legendColumn">检定信息</legend>
              <el-form-item label="检定日期：" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-if="!NotDisabled" v-model="formData.calibrationDate" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.calibrationDate}}</span>
              </el-form-item>
              <el-form-item label="检定结果：" :class="{'disable-item': NotDisabled}">
              <el-select v-if="!NotDisabled" v-model="formData.calibrationResult" placeholder="">
                  <el-option v-for="item in dictionaryData.CALI_RESULT" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
              </el-select>
              <span v-else>{{formData.calibrationResultName}}</span>
              </el-form-item>
              <el-form-item label="检定说明：" class="f2" :class="{'disable-item': NotDisabled}">
                <el-input v-if="!NotDisabled" type="textarea" :rows="2" clearable v-model="formData.calibrationComments" placeholder=""></el-input>
                <span v-else>{{formData.calibrationComments}}</span>
              </el-form-item>
        </div>

        <!-- 审批信息
        <div  v-if="operationShow == 'approval'">
          
        </div> -->
        <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
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
        
        <el-step title="维检信息" @click.native="stepActive(1,'register')"></el-step>
        <el-step title="维修信息" @click.native="stepActive(2,'repairInfo')"></el-step>
        <el-step title="检定信息" @click.native="stepActive(3,'checkInfo')"></el-step>
        <!-- <el-step title="处理审批" @click.native="stepActive(4,'approval')"></el-step> -->
      </el-steps>
    </div>

  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import meterBasicInfo from "@/views/publicModule/infmtnManagement/meterBasicInfo";//水表信息
export default {
  name: "DimensionalInspectionHandle",
  props: ['editNeedData'],
  components: {
    uploadFile,
    billInfo,
    meterBasicInfo,
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_repair",
      searchBtnShow: true,
      searchUserNum: "",
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      formData:{
        "id":'',
        "meterNo":'',//"水表编号",

        "removeDate":'',//"拆表日期",
        "sendRepairDate":'',//"送修日期",
        "repairType":'',//"修复类型  1维修，2送检",

        "repairDate":'',//"维修日期",
        "repairResult":'',//"维修结果",
        "repairComments":'',//"维修说明",

        "comments":'',//"备注",
        "calibrationDate":'',//"检定日期",
        "calibrationResult":'',//"检定结果",
        "calibrationComments":'',//"检定说明",
        "sourceFlag":'',//"信息来源 PIS"
      },
      formDataVal:{
        "id":'',
        "meterNo":'',//"水表编号",

        "removeDate":'',//"拆表日期",
        "sendRepairDate":'',//"送修日期",
        "repairType":'',//"修复类型  1维修，2送检",

        "repairDate":'',//"维修日期",
        "repairResult":'',//"维修结果",
        "repairComments":'',//"维修说明",

        "comments":'',//"备注",
        "calibrationDate":'',//"检定日期",
        "calibrationResult":'',//"检定结果",
        "calibrationComments":'',//"检定说明",
        "sourceFlag":'',//"信息来源 PIS"
      },
      //单据信息
      billData: {},
      // 数据字典
      dictionaryData: {},
      // 所有信息数据
      formData: {
      },
      approvalShow: true,
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
        data: "REPAIR_TYPE,CALI_RESULT,PIS" // 
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
    init() {
      var _this = this
      var params = {
        "busicode": "MsRepairQuery",
        "data":this.editNeedData.id 
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.operationShow = res.processState
        this.formData = res;
        this.searchUserNum = res.meterNo
        this.initMeterNo()
        this.getHtmlData()
        this.getBillData(res)
        this.$nextTick(() => {
          if(this.formData.processState === '') {
            this.searchBtnShow = true
          } else {
            this.searchBtnShow = false
          }
        })
      })
    },
    
    async initMeterNo() {
      //水表编号查询
      if (this.searchUserNum == "") {
        this.$message({
          message: "水表编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = { meterNo: this.searchUserNum, };
      if (this.editNeedData.processState !='END') { data.meterStatus =  "3"  }
      let params = { busicode: "MsInfoList",  data};
      const res = await this.$api.fetch({  params  });

      if (res.list.length>0) {
        this.$refs.meterBasicInfo.init(res.list[0])
        this.formData.meterNo = res.list[0].meterNo;
        try {
            // 水表型号查出的信息
          const resData = await this.$api.fetch({ 
            params: { busicode: "MeterModelQuery", data: {  id: res.list[0].meterModel }}, 
          })
          this.$refs.meterBasicInfo.getWaterMeterInquiryData(resData)
        }catch(e) {
          console.log(e)
        }
      }else{
        this.$refs.meterBasicInfo.init({})
        this.formData.meterNo = ''
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

    getFormbData(){
      let val = this.formData
      val = this.common.handleData(val,this.formDataVal)
      return val
    },
    
    // 暂存按钮（添加）
    save() {
      var _this = this
      var params = {
        "busicode": this.editNeedData.busicode,
        "data": this.getFormbData()
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: '操作成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
      })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_repair",
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
  },
  
  watch: {
    operationShow(newVal,oldVal){
      if (this.formData.processState == newVal||this.formData.processState == '') {
        this.NotDisabled = false//可修改
        this.searchBtnShow = true;
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
        // 维检信息：register
        // 维修信息：repairInfo
        // 检定信息：checkInfo
        // 处理审批：approval
        if( newVal == 'repairInfo'){//校核信息
          this.operation = 1;
        }else if( newVal == 'checkInfo'){//检定信息
          this.operation = 2;
        }else if( newVal == 'approval'){//处理审批
          // this.operation = 0;
          // this.operationShow = 'register'
          // this.NotDisabled = true;
          // this.approveFlag == 1
          this.operation = 2;
          //this.operationShow = 'register'
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
<style lang="scss">
.DimensionalInspectionHandle {
  height:100%;
}
</style>

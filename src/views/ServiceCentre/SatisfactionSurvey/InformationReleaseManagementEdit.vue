<template>
  <div class="InformationReleaseManagementEdit">
    <!-- 弹出表单含添加题目 -->
    <el-dialog class="QuestionDialog" :title="addQuestionsName" v-if="addQuestionsVisible" :visible.sync="addQuestionsVisible" :close-on-click-modal="false" @close="closeDialog">
      <Questionsadd ref="aQusScoring" :questionType="topicType" :rowData="rowData"></Questionsadd>

      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="submit();">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    
    
    <el-form :disabled="formData.processState!='' && formData.processState!='Drafts'" class="backfillSubmitForm" size="mini" :inline="true" :model="formData" label-width="150px" ref="ruleForm">
      
      <billInfo v-show="formData.processState!='' && formData.processState!='Drafts'" ref="billInfo"></billInfo>
      <legend class="legendColumn">问卷信息</legend>
      <el-form-item style="width：100%" label="问卷主题：" class="remark">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.questTheme" placeholder="请输入问卷主题"></el-input>
      </el-form-item>
      <el-form-item label="问卷说明：" class="remark">
        <el-input type="textarea" :rows="3" v-model="formData.questContent" placeholder="请输入问卷说明"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="开始日期：">
        <el-date-picker v-model="formData.beginDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期：">
        <el-date-picker v-model="formData.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <br>
      <el-form-item label="发布渠道：">
        <el-checkbox-group v-model="formData.releaseChannel">
          <el-checkbox label="1">网上营业厅</el-checkbox>
          <el-checkbox label="2">微信营业厅</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否允许同一用户多次调查：" class="MultipleInvestigations">
        <el-radio v-model="formData.moreSurvey" label="1">是</el-radio>
        <el-radio v-model="formData.moreSurvey" label="2">否</el-radio>
      </el-form-item>

    <div class="kl-table">
      <!-- <h3>调查题库</h3> -->
      <div class="toolbar">
        <div class="form-left">
          <div class="toolbar-fontSon"> 调查题库</div>
        </div>
        <div class="form-right">
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="addScoringQuestions('评分','')">评分题</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addScoringQuestions('单选','')">单选题</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addScoringQuestions('多选','')">多选题</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addScoringQuestions('问答','')">问答题</el-button>

        </div>
      </div>
      <el-table stripe border :data="formData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." fixed="left" width="50">
        </el-table-column>

        <el-table-column prop="title" min-width="400" label="题目">
        </el-table-column>

        <el-table-column prop="theme" min-width="80" label="题型">
          
        </el-table-column>

        <el-table-column class="cell" label="排序" fixed="right" width="130 ">
          <template slot-scope="scope">
            <el-button type="text" @click="moveUp(scope.$index,scope.row)">上移</el-button>
            <span  >|</span>
            <el-button type="text" class="noclick" @click="moveDown(scope.$index,scope.row)">下移</el-button>
          </template>
        </el-table-column>

        <el-table-column class="cell" label="操作" fixed="right" width="120 ">
          <template slot-scope="scope">
            <el-button type="text" class="noclick" @click="addScoringQuestions(scope.$index,scope.row)">编辑</el-button>
            <span  >|</span>
            <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>
    
    </el-form>
    <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import Questionsadd from "./Questionsadd";
import procedure from "@/components/procedure"; //流程审核
export default {
  name: "InformationReleaseManagementEdit",
  components: {
    billInfo,
    Questionsadd,
    procedure
  },
  props:["id"],
  data() {
    return {
      formData: {
        list:[],
        questTheme:"",
        questContent:"",
        beginDate: "",
        endDate: "",
        releaseChannel:[],
        moreSurvey: "1",
        processState:"Drafts",
        billNo:"",
        billDate:"",
      },
      checkBoxValue:[],
      rowData:{},
      addQuestionsName: "添加评分题",
      addQuestionsVisible: false,
      topicType: 1,
      rowNumber:"",
      processName:"",
      isSave:0,
      billData:{},
    };
  },
  mounted() {
    this.init();
    
  },
  methods: {
    init(){
      if(this.id.length>0){
        let params = {
          "busicode": "QuestManageQuery",
          "data": {"id":this.id}
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.formData=res;
          this.isSave=0;
          this.getHtmlData();
          this.getBillData(res);
        })
        this.processName="QuestManageUpdate";
        
      }else{
        this.processName="QuestManageAdd";
        this.isSave=1;
        this.getHtmlData();
      }
      
    },
    getBillData(res) {
      // 单据信息
      let billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(billData);
    },
    // 获取审批流前端代码
    getHtmlData() {
      
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "CS_QUEST",
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
          _this.$parent.closeDialog(); // 提交后回调方法
        },
        _this.isSave, // 不等于1时，先保存后提交
        _this.processName
      );
    },
    getFormbData(){
      return this.formData
    },
    submit() {
      let _this=this;
      let data;
      if(_this.topicType===1){
        //_this.$refs.aQusScoring.ScoringQuestionsForm.theme="评分题";
        data = JSON.parse(JSON.stringify(_this.$refs.aQusScoring.ScoringQuestionsForm))
      }else if(_this.topicType===2){
        //_this.$refs.aQusScoring.SingleQuestionsForm.theme="单选题";
        data = JSON.parse(JSON.stringify(_this.$refs.aQusScoring.SingleQuestionsForm))
      }else if(_this.topicType===3){
        //_this.$refs.aQusScoring.DoubleQuestionsForm.theme="多选题";
        data = JSON.parse(JSON.stringify(_this.$refs.aQusScoring.DoubleQuestionsForm))
      }else if(_this.topicType===4){
        //_this.$refs.aQusScoring.AnswersQuestionsForm.theme="问答题";
        data = JSON.parse(JSON.stringify(_this.$refs.aQusScoring.AnswersQuestionsForm))
      }
      if(this.rowNumber>=0){
        _this.formData.list[this.rowNumber]=data;
        this.$set(_this.formData.list,this.rowNumber,_this.formData.list[this.rowNumber]);
      }else{
        _this.formData.list.push(data);
      }
      
      _this.addQuestionsVisible=false;
      //_this.$refs.aQusScoring.ScoringQuestionsForm={list:[]};
    },
    moveUp(index,row){
      var _this=this;
      if(index>0){
        let update = _this.formData.list[index-1];
        _this.formData.list.splice(index-1,1);
        _this.formData.list.splice(index,0,update );
      }else{
        this.$notify({
          title: '消息',
          message: '已是第一条，不可上移',
          type: 'waring'
        });
      }
    },
    moveDown(index,row){
      var _this=this;
      if((index+1)=== _this.formData.list.length){
        this.$notify({
          title: '消息',
          message: '已是第最后一条，不可下移',
          type: 'waring'
        });
      }else{
        let downdate = _this.formData.list[index+1];
        _this.formData.list.splice(index+1,1);
        _this.formData.list.splice(index,0,downdate );
      }
    },
    // 删除行
    deleteRow(index, row) {
      if(formData.processState!='' && formData.processState!='Drafts'){
        this.$notify({
          title: '消息',
          message: '当前单据状态已不可修改',
          type: 'waring'
        });
      }else{
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.formData.list.splice(index, 1);
          this.$notify({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$notify({
            type: "info",
            message: "已取消删除"
          });
        });
      }
    },
    addScoringQuestions(val,row) {
      
      if(this.formData.processState==='' || this.formData.processState==='Drafts'){
        this.rowNumber="-1";
        this.rowData={};
        this.addQuestionsName = `添加${val}题`;
        if (val === "评分" || row.theme==1) {
          //1
          this.topicType = 1;
        } else if (val === "单选" || row.theme==2) {
          this.topicType = 2;
        } else if (val === "多选" || row.theme==3) {
          this.topicType = 3;
        } else if (val === "问答" || row.theme==4) {
          this.topicType = 4;
        } 

        if(Object.keys(row).length>0){
          this.rowData=JSON.parse(JSON.stringify(row));
          this.rowNumber=val;
          this.addQuestionsName = '修改';
        }
        this.addQuestionsVisible = true;
      }else{
        this.$notify({
          title: '消息',
          message: '当前单据状态已不可修改',
          type: 'waring'
        });
      }
    },
    closeDialog() {
      this.addQuestionsVisible = false;
    }
  }
};
</script>
<style  lang="scss">
.InformationReleaseManagementEdit {
  height: 100%;
  overflow-y: auto;
  .QuestionDialog {
    // background-color: red;
    .el-dialog {
      width: 50% !important;
      height: 80% !important;
      line-height: 70% !important;
      margin-top: 15vh !important;
    }
    .el-input-group__append {
      border: none;
      background-color: #f5f7fa00;
      color: #353840;
      padding: 0px;
    }
  }
  .backfillSubmitForm {
    width: 80%;
  }
  .MultipleInvestigations {
    width: 50%;
    .form-left {
      i {
        width: 4px;
        background: #c4d600;
        border-radius: 4px;
        height: 18px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .el-form-item__label {
      width: 250px !important;
    }
  }
  .remark {
    width: 100%;
    .el-form-item__content {
      width: calc(100% - 150px);
      .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>

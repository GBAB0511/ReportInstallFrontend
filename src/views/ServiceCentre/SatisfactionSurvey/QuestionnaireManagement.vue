

<template>
  <div class="InformationReleaseManagement">
    <el-dialog class="common-dialog" :title="PreviewQuestionnaireName" :close-on-click-modal="false" v-if="PreviewQuestionnaireVisible" :visible.sync="PreviewQuestionnaireVisible">
      <PreviewQuestionnaire ref="PreviewQuestionnaire" :Question="Question"></PreviewQuestionnaire>
    </el-dialog>

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <div v-if="divType=='1'">
          <el-button size="mini" type="primary" @click="PreviewQuestionnaire()">预览问卷</el-button>

          <el-button v-if="saveVisible" size="mini" type="primary" @click="save">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
        <div v-else>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button v-if="ResultVisible==false" size="mini" type="primary" @click="resultShow()">调查结果</el-button>
        <el-button v-if="ResultVisible" icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        <el-button v-if="ResultVisible==false" size="mini" icon="el-icon-plus" @click="add('2','')" type="primary">添加</el-button>

      </div>
    </div>

    <div v-if="EditVisible" style=" height: calc(100% - 41px);">
      <InformationReleaseManagementEdit ref="childWarehousing" :id="id"></InformationReleaseManagementEdit>
    </div>
    <div v-else-if="ResultVisible" style=" height: calc(100% - 41px);">
      <Findings ref="resultShow"></Findings>
    </div>

    <div v-else>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item class="form-left">

            <el-form-item label='单据日期：'>
              <el-date-picker v-model="sendTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="全部">
                <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
          <el-form-item class="form-right">
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>


          <el-table-column prop="processStateName" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="processName" min-width="60" label="进度">
          </el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人">
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>
          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="questTheme" min-width="150" label="主题">
          </el-table-column>

          <el-table-column prop="beginDate" min-width="100" label="开始时间">
          </el-table-column>

          <el-table-column prop="endDate" min-width="100" label="结束时间">
          </el-table-column>

          <el-table-column prop="questAmount" min-width="80" label="选题数量" align="right">
          </el-table-column>

          <el-table-column prop="collectNums" min-width="80" label="收集数量" align="right">
          </el-table-column>

          <el-table-column prop="questContent" min-width="100" label="说明">
          </el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="230">
            <template slot-scope="scope">
              <el-button type="text" @click="add('1',scope.row)">详情</el-button>
              <span  >|</span>
              <el-button type="text" v-if="scope.row.processStateName==='草稿'" class="noclick" @click="deleteQuest(scope.row)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import Findings from "./Findings";
import InformationReleaseManagementEdit from "./InformationReleaseManagementEdit";
import PreviewQuestionnaire from "./PreviewQuestionnaire";
export default {
  name: "InformationReleaseManagement",
  components: {
    Findings,
    InformationReleaseManagementEdit,
    PreviewQuestionnaire
  },
  data() {
    return {
      tableData:{

      },
      id:"",
      sendTime:["",""],
      tableQuery:{
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginDate:"",
        endDate:"",
        processState:"",
      },
      Question:{},
      EditVisible: false, //弹出表单
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户通知" }, { title: "问卷调查" }]
      },
      //审批状态下拉框
      approvalStatusOptions: [
        { value: "", name: "全部" },
        { value: "DRAFT", name: "草稿" },
        { value: "PROCESSING", name: "进行中" },
        { value: "END", name: "已办结" },
        { value: "CANCEL", name: "已废弃" }
      ],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      PreviewQuestionnaireName: "预览问卷",
      PreviewQuestionnaireVisible: false,
      divType: "1",
      ResultVisible:false,
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".InformationReleaseManagement", [
          ".InformationReleaseManagement .bread-contain",
          ".InformationReleaseManagement .toolbar",
          ".InformationReleaseManagement .block",
        ]);
    })

  },
  methods: {
       enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let params = {
        "busicode": "QuestManageList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        console.log(res)
        this.tableData=res;


      })
    },

    resultShow(){
      this.ResultVisible=true;
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    save(){
      let state=this.$refs.childWarehousing.formData.processState;
      if(state!='' && state!='Drafts'){
        this.$notify({
          title: '消息',
          message: '当前单据状态已不可修改',
          type: 'waring'
        });
        return fasle
      }else{
        if(this.id.length===0){
          this.saveNew();
        }else{
          this.updateOld();
        }
      }
    },
    deleteQuest(row){
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            "busicode": "QuestManageDelete",
            "data": {"id":row.id},
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.closeDialog();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    saveNew(){
      let tableData=this.$refs.childWarehousing.formData;

      let params = {
        "busicode": "QuestManageAdd",
        "data": tableData,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        });
        this.closeDialog();

      })
    },
    updateOld(){
      let tableData=this.$refs.childWarehousing.formData;
      let params = {
        "busicode": "QuestManageUpdate",
        "data": tableData,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        });
        this.closeDialog();
      })
    },
    handleClick(tab, event) {},
    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      if(val){
      this.tableQuery.page = val
      this.init()
    }
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;

    },
    //弹出框
    submit(formName) {

    },

    add(val,row) {
      //添加
      // this.$set(this.crumbsData.titleList, "3", { title: '添加', method: () => { window.histroy.back() } })
      // this.$set(this.crumbsData.titleList, "3", { title: '调查结果', method: () => { window.histroy.back() } })

      if(row.processStateName==='草稿'){
          this.saveVisible=true
      }else{
        this.saveVisible=false
      }
      if(val==="1"){
        this.id=row.id;
      }else{
        this.id="";
        this.saveVisible=true;
      }
      this.divType = 1;
      this.EditVisible = true;
    },
    edit() {
      // this.$set(this.crumbsData.titleList, "3", { title: '编辑', method: () => { window.histroy.back() } })
      this.EditVisible = true;
    },
    closeDialog() {
      //关闭会话
      // this.crumbsData.titleList.splice(3, 1);
      this.EditVisible = false;
      this.ResultVisible=false;
      this.init();
    },
    // resultCheck(){

    // },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.histroyData.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 预览问卷
    PreviewQuestionnaire() {
      this.Question=this.$refs.childWarehousing.formData.list;
      this.PreviewQuestionnaireVisible = true;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.InformationReleaseManagement {
  height: 100%;
}
</style>

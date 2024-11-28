<template>
  <div class="QualityReading">
    <!-- 抄表抽查 模块 -->
    <!-- index页 -->
    <div v-if="indexShow==1" class="baseContent">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
        </div>
      </div>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="账期：">
            <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择账期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="抽查结果：">
            <el-select ref="select1" clearable v-model="tableQuery.checkResult" placeholder="">
              <el-option v-for="(item,index) in checkResultOptions" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select ref="select2" clearable v-model="tableQuery.status" placeholder="">
              <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>
          <el-button class='searchBtn' size="mini" icon="el-icon-search" @click="init"></el-button>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row stripe border v-if="tableShow" :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" label="序号" fixed="left" width="50">
          </el-table-column>
          <el-table-column prop="status" min-width="60" label="状态">
          </el-table-column>
          <el-table-column prop="schedule" min-width="100" label="进度">
          </el-table-column>
          <el-table-column prop="currHandle" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="billNo" min-width="80" label="单据编号">
          </el-table-column>
          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>
          <el-table-column prop="accountPeriod" min-width="80" label="账期">
          </el-table-column>
          <el-table-column prop="checkNum" min-width="80" label="抽检数量">
          </el-table-column>
          <el-table-column prop="completeCheckNum" min-width="80" label="完成数量">
          </el-table-column>
          <el-table-column prop="comments" min-width="200" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" size="mini" v-if="scope.row.processState=='QualityBack'" @click.native="backEdit(scope.$index, scope.row)">回填</el-button>
              <el-button type="text" size="mini" v-else @click.native="edit(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
    <!-- 编辑页 -->
    <div v-else-if="indexShow==2" class="baseContent">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button size="mini" type="primary" @click="submit(formType)">保存</el-button>
          <el-button size="mini" type="primary" v-if="deletFormShow" @click="deletForm()">删除</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
      </div>

      <QualityReadingEdit ref="childWarehousing" :formType='formType'></QualityReadingEdit>
    </div>
    <!-- 回填页 -->
    <div v-else-if="indexShow ==4" class="baseContent">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button size="mini" type="primary" @click="submit(formType)">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
      </div>

      <QualityReadingHuiTian></QualityReadingHuiTian>
    </div>
  </div>
</template>
<script>
import QualityReadingEdit from "./QualityReadingEdit";
import QualityReadingHuiTian from "./QualityReadingHuiTian";
export default {
  components: {
    QualityReadingEdit,
    QualityReadingHuiTian
  },
  name: "QualityReading-index",
  data() {
    return {
      formType: {
        type: 'MrQualityAdd',
        id: '',
      },
      approvalStatusOptions: [

      ], //审批状态下拉框
      checkResultOptions:[],//抽查结果
      indexShow: 1, //1 index页 2添加页 3修改页 4回填页
      dialogFormVisible: false, //弹出表单
      tableData: [],
      //   查询表单
      tableQuery: {
        "page": 1,
        "pageCount": 20,
        "accountPeriod": this.common.date('month'),
        "status": "",
        "checkResult":""
      },
      form: {
        ladderType: "month",
        waterSelect: "",
        priceModel: "",
        mixtrueSelect: "",
        waterLevel: "",
        waterValue: false,
        startTime: "",
        endTime: "",
        bulidReson: "",
        priceDetail: "04",
        state: "1",
        bulidTime: "",
        updateReson: "",
        updataTime: "",
        remark: ""
      },
      formLabelWidth: "100px",
      crumbsData: {
        //面包屑`
        titleList: [
          { title: "抄表开账" },
          { title: "检查" },
          { title: "抄表抽查" }
        ]
      },
      maxHeight: 0,
      tableShow: false,
      deletFormShow: false,
      dictionaryData: [],
    };
  },
  mounted() {
    this.init();
    this.getDictionary();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(
        this,
        ".QualityReading",
        [".QualityReading .toolbar", ".QualityReading .block", '.QualityReading .bread-contain']
      );
    });
  },
  methods: {
   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    init() {
      let _this = this
      let params = {
        "busicode": "MrQualityCheckList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res;
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "PCS,RCN"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
          _this.approvalStatusOptions = _this.dictionaryData.PCS;
          _this.checkResultOptions = _this.dictionaryData.RCN;
          _this.approvalStatusOptions.unshift({name: '全部', value: ''})
          _this.checkResultOptions.unshift({name: '全部', value: ''})
        });
    },
    add() {
      //添加
      this.deletFormShow = false
      this.formType.type = 'MrQualityAdd'
      this.formType.id = ''
      this.indexShow = 2;
    },
    //编辑详情
    edit(index, row) {
      if (row.status == '草稿') {
        this.deletFormShow = true
        this.formType.type = 'MrQualityUpdate'
      } else {
        this.deletFormShow = false
        this.formType.type = 'MrQualityApprove'
      }
      this.formType.id = row.id
      this.indexShow = 2;
    },
    //回填
    backEdit(index, row) {
      this.deletFormShow = false
      this.formType.type = 'MrQualityBack'
      this.formType.id = row.id
      this.indexShow = 2;
    },
    deletForm() {
      let params = {
        "busicode": "MrQualityCheckDelete",
        "data": {
          "id": this.formType.id
        },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.closeDialog()
      })
    },
    //保存
    submit(type) {
      this.$refs.childWarehousing.submit(type);
    },
    closeDialog() {
      this.indexShow = 1;
      this.init()
    },
    handleCurrentChange() { },
    handleSizeChange() { }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  },
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.QualityReading {
  height: 100%;
  .baseContent {
    height: 100%;
  }
}
</style>


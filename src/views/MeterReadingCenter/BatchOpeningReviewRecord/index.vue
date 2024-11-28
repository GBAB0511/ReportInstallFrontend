<template>
  <div class="BatchOpeningReviewRecord">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="RecordVisible">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <!-- 详情 -->
    <div class="indexPage" style="height:calc(100% - 81px)" v-if="RecordVisible">
      <BatchOpeningReviewRecordEdit ref="BatchOpeningReviewRecordEdit" :editNeedData="editNeedData"></BatchOpeningReviewRecordEdit>
    </div>

    <div v-else class="indexPage">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="tableTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="制单人：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="tableQuery.createName" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="BatchOpeningReviewRecord-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="80" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)">详情</el-button>
              <!-- <span>|</span>
              <el-button type="text" class="noclick" v-if="scope.row.processState == '' || scope.row.processState == 'register'" @click="remove(scope.row)">删除</el-button> -->
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
  </div>
</template>
<script>
import BatchOpeningReviewRecordEdit from "./BatchOpeningReviewRecordEdit";
export default {
  name: "BatchOpeningReviewRecord",
  components: {
    BatchOpeningReviewRecordEdit
  },
  data () {
    return {
      // 表格数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startDate: '',
        endDate: '',
        createName: '',
      },
      tableTime: ["",""],
      // 添加/详情页面需要数据
      editNeedData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      crumbsData: { titleList: [{ title: "开帐复核" }, { title: "变更记录" }] },
      tableShow: false,
      maxHeight: 0,
      RecordVisible: false, //添加弹窗的显示和隐藏、
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      //审批状态下拉框
      approvalStatusOptions: [
        { value: "1", name: "全部" },
        { value: "2", name: "草稿" },
        { value: "3", name: "进行中" },
        { value: "4", name: "已办结" },
        { value: "5", name: "已废弃" }
      ],
    };
  },
  mounted () {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".BatchOpeningReviewRecord", [
      ".BatchOpeningReviewRecord .toolbar",
      ".BatchOpeningReviewRecord .block",
      ".BatchOpeningReviewRecord .bread-contain",
    ]);
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    // 初始化
    init () {
      let _this = this;
      this.getDatePicker(this.tableTime)
      let params = {
        busicode: "MrOpenAccountReviewRecordList",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res

      })
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 搜索
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    // 详情按钮
    details (row) {
      console.log(row);
      this.editNeedData = row;
      this.RecordVisible = true;
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog () {
      //关闭会话
      this.RecordVisible = false;
      this.init();
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
</style>

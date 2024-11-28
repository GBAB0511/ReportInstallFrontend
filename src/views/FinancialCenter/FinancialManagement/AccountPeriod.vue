

<template>
  <div class="AccountPeriod">
    <div class="AccountPeriodEditCon" v-if="AccountPeriodVisible">
      <AccountPeriodEdit ref="childAccountPeriod"></AccountPeriodEdit>
    </div>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='账期：'>
            <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyyMM" value-format="yyyyMM" placeholder="选择月" style="width:100%;">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <!--<el-table-column type="selection" width="50" fixed="left">
          </el-table-column>-->

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期">
          </el-table-column>

          <el-table-column prop="beginDate" min-width="80" label="开始日期">
          </el-table-column>

          <el-table-column prop="endDate" min-width="100" label="结束日期">
          </el-table-column>

          <el-table-column prop="accountBalance" min-width="150" label="本次预存金额">
          </el-table-column>

          <el-table-column prop="createTime" min-width="100" label="建立时间">
          </el-table-column>

          <el-table-column prop="createName" min-width="80" label="建立人">
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
  </div>
</template>
<script>
import AccountPeriodEdit from "./AccountPeriodEdit";
export default {
  name: "AccountPeriod",
  components: {
    AccountPeriodEdit
  },
  data() {
    return {
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',
      },
      // 列表数据
      tableData: {},


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
      AccountPeriodVisible: false,
      AccountPeriodName: "账期-增加",
      AccountPeriodCon: true
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".AccountPeriod", [
      ".AccountPeriod .toolbar",
      ".AccountPeriod .block",
      ".AccountPeriod #crumbs"
    ]);
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      let params = {
        busicode: "FnHistoryList",
        data: {
          "page": this.tableQuery.page,
          "pageCount": this.tableQuery.pageCount,
          "accountPeriod": this.tableQuery.accountPeriod,
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res
        });
    },
    // 查询按钮
    search() {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },

    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return (index + 1)
    },
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
<style lang="scss">
.AccountPeriod {
}
</style>

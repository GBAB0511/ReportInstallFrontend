<template>
  <div class="DailyReconciliationEdit">
    <div class="toolbar">
      <!-- <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

        <el-form-item class="form-left">

          <el-form-item label="收费日期：">
            <el-date-picker v-model="tableQuery.chargeDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>

      </el-form> -->
      <div class="toolRight">
        <el-button type="primary" size="mini" @click="submitAll()">总确认对账</el-button>
      </div>

    </div>
    <div class="kl-table">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="chargeDate" min-width="100" label="收费日期">
        </el-table-column>

        <el-table-column prop="chargeStaffName" min-width="100" label="收费员">
        </el-table-column>

        <el-table-column prop="chargeMoney" min-width="100" label="收费总金额" align="right">
        </el-table-column>

        <!-- <el-table-column prop="cash" min-width="100" label="现金">
        </el-table-column>

        <el-table-column prop="cheque" min-width="100" label="支票">
        </el-table-column>

        <el-table-column prop="swipingCard" min-width="100" label="刷卡">
        </el-table-column>

        <el-table-column prop="transferAccounts" min-width="100" label="转账">
        </el-table-column>

        <el-table-column prop="withhold" min-width="80" label="代扣">
        </el-table-column>

        <el-table-column prop="collection" min-width="80" label="托收">
        </el-table-column>

        <el-table-column prop="others" min-width="80" label="其它">
        </el-table-column> -->
        <template v-for='(col) in dictionaryData.DCAF'>
          <el-table-column show-overflow-tooltip :prop="col.value" :label="col.name" :key="col.value" v-if="col.name.length>0" min-width="100">
          </el-table-column>
        </template>

        <el-table-column prop="yesterdayNotDeposite" min-width="80" label="上日未缴" align="right">
        </el-table-column>

        <el-table-column prop="todayDeposite" min-width="80" label="本日缴存" align="right">
        </el-table-column>

        <el-table-column prop="todayNotDeposite" min-width="80" label="本日未缴" align="right">
        </el-table-column>
        <el-table-column prop="checkStatus" min-width="80" label="是否对账">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.checkStatus=='未对账'" type="text" @click.native="submit(scope.row)">确认对账</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "DailyReconciliationEdit",
  props: ['dailyReconciliationEditNeedData'],
  data () {
    return {
      dictionaryData: [],//数据字典
      // 查询条件对象
      tableQuery: {
        chargeDate: '',
      },
      // 列表数据
      tableData: [],







      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      ruleFormData: {},
      PrintPayer: "",
      CombinedStrike: ""
    };
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.getDayCostsAndTypes()
    this.common.changeTable(this, ".DailyReconciliationEdit", [
      ".DailyReconciliationEdit .toolbar",
      ".DailyReconciliationEdit .block",
      ".DailyReconciliationEdit #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init () {
      let _this = this;
      let params = {
        busicode: "FnDayCheckAccountDetail",
        data: {
          chargeDate: this.dailyReconciliationEditNeedData.chargeDate,
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    // 获取列表动态字段
    getDayCostsAndTypes () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "DCAF"
        //水表类型、用水对象、水表用途、抄表方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 确认对账按钮（由父页面调用）
    submit (row) {
      let _this = this
      console.log(row);
      this.$confirm('是否确认对账?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "FnDayCheckAccount",
          data: [row]
        };
        this.$api.fetch({
          params: params,//参数

        }).then(res => {
          _this.$message({
            type: "success",
            message: "确认对账成功！"
          });
          _this.$parent.closeDialog()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消确认对账'
        });
      });
    },

    submitAll () {
      console.log('tableData', this.tableData)
      this.$confirm('是否全部对账？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 过滤未对账数据
        let noCheckData = this.tableData.filter(item => {
          return item.checkStatus == '未对账'
        })
        if (noCheckData.length == 0) {
          this.$message({
            message: '暂无需对账信息！',
            type: 'warning'
          })
          return;
        }
        let params = {
          busicode: "FnDayCheckAccount",
          data: noCheckData
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.$message({
            message: '总确认对账成功！',
            type: 'success'
          })
          this.$parent.closeDialog()
        })
      }).catch(() => {
        this.$message({
          message: '已取消总确认对账',
          type: 'info'
        })
      })
    },

    demand () {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },

    cellClick (row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod (index) {
      //获取表格序号
      return (
        (1 - 1) * 20 + (index + 1)
      );
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
.DailyReconciliationEdit {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin-right: 0px;
  }
  .toolbar {
    &::after {
      content: "";
      clear: both;
      visibility: hidden;
      display: block;
    }
    .toolRight {
      float: right;
    }
  }
}
</style>
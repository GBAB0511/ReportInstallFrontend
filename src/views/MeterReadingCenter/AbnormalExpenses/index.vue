<template>
  <div class="AbnormalExpenses">
    <!-- 费用异常 模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <!-- <div class="bread-contain-right">
        <el-button size="mini" type="primary" icon="el-icon-upload2">导出</el-button>
      </div> -->
    </div>

    <div class="indexContetn">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="账期：">
              <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" placeholder="选择月">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="init" icon="el-icon-search">检查</el-button>
            </el-form-item>

        </el-form>
      </div>
      <legend class="legendColumn">重复开账检查</legend>
      <div v-if="topTableData.length == 0" class="checkContent" >
        <span >检查完成，无重复开账</span>
      </div>
      <div v-else class="kl-table" >
        <el-table highlight-current-row  v-if="tableShow" stripe border :data="topTableData" class="change-tables-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="priceJ1" min-width="50" label="单价1" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="priceJ2" min-width="50" label="单价2" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="priceJ3" min-width="50" label="单价3" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="waterJ1" min-width="60" label="水量1" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="waterJ2" min-width="60" label="水量2" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="waterJ3" min-width="60" label="水量3" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="calculateWater" min-width="80" label="计费水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="receivableMoney" min-width="60" label="金额" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="prefWater" min-width="80" label="优惠水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="prefPrice" min-width="80" label="优惠单价" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="prefMoney" min-width="80" label="优惠金额" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="addFlag" min-width="80" label="是否追加" show-overflow-tooltip>
          </el-table-column>

        </el-table>
      </div>
      <legend class="legendColumn">水费金额检查</legend>

      <div class="kl-table">
        <el-table  v-if="tableShow" stripe border :data="bottomTableData" class="change-tables-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ctmName" min-width="100" label="用户名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="priceJ1" min-width="50" label="单价1" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="priceJ2" min-width="50" label="单价2" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="priceJ3" min-width="50" label="单价3" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="waterJ1" min-width="60" label="水量1" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="waterJ2" min-width="60" label="水量2" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="waterJ3" min-width="60" label="水量3" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="calculateWater" min-width="60" label="计费水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="receivableMoney" min-width="60" label="金额" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="prefWater" min-width="60" label="优惠水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="prefPrice" min-width="60" label="优惠单价" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="prefMoney" min-width="60" label="优惠金额" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="addFlag" min-width="60" label="是否追加" show-overflow-tooltip>
          </el-table-column>

        </el-table>
      </div>
      
    </div>
  </div>
</template>
<script>
export default {
  name: "AbnormalExpenses",
  components: {
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "检查" },
          { title: "费用异常" }
        ]
      },
      tableQuery: {
        accountPeriod: ''
      },
      // 重复开账数据
      topTableData: [],
      // 水费金额数据
      bottomTableData: [],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,

    };
  },
  mounted() {
    this.tableQuery.accountPeriod = this.common.date('month')
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".AbnormalExpenses .kl-table", [
      ".AbnormalExpenses .toolbar",
      ".AbnormalExpenses .block",
      ".AbnormalExpenses #crumbs"
    ]);
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      let params = {
        "busicode": "MrAbFeeList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.topTableData = res.repetitionCheck
        _this.bottomTableData = res.moneyCheck
      })
    },
    //   导出
    exportExcel() { },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
         return   (index+1) ;
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
.AbnormalExpenses {
  width: 100%;
  height: 100%;
  .indexContetn{
    height: calc(100% - 41px);
    overflow-y: auto;
    .checkContent {
      padding: 10px;
      padding-left: 20px;
      span {
        font-size: 12px;
      }
    }
    .toolbar {
      height: 50px;
    }
  
  }
}
</style>
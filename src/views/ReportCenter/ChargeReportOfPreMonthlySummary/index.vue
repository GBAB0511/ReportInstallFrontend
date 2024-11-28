<template>
  <!-- 总帐表 -->
  <div class="ChargeReportOfPreMonthlySummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='账期：'>
              <el-date-picker v-model="tableQuery.accountPeriod" @change="getDatePicker" type="month" value-format="yyyyMM"  >
              </el-date-picker>
            </el-form-item>

  

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData" class="ChargeReportOfPreMonthlySummary-table table-padding">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="abstractType" min-width="60" label="摘要明细">
          </el-table-column>

          <!-- <el-table-column prop="debtorMoney" min-width="100" label="借方金额">
          </el-table-column>

          <el-table-column prop="lenderMoney" min-width="100" label="贷方金额">
          </el-table-column> -->

          <el-table-column prop="debtorMoney" min-width="100" label="发生金额" align="right">
          </el-table-column>

          <el-table-column prop="balanceMoney" min-width="100" label="余额" align="right">
          </el-table-column>

        </el-table>
    
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfPreMonthlySummary",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: this.common.date('month','yyyyMM'),
      },

      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "总帐表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfPreMonthlySummary", [
      ".ChargeReportOfPreMonthlySummary .toolbar",
      ".ChargeReportOfPreMonthlySummary .block",
      ".ChargeReportOfPreMonthlySummary #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MonthAdvanceSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        // res.forEach((item,index) => {
        //   item.lenderMoney = '-' + item.lenderMoney
        //   if (item.abstractType == '上月结转') {
        //     item.autualMoney = item.balanceMoney
        //   }else if(item.abstractType == '本月新收款'){
        //     item.autualMoney = item.debtorMoney
        //     item.abstractType = '本月收款'
        //     let temData = {
        //       abstractType: "本月取消收款",
        //       balanceMoney: item.balanceMoney,
        //       autualMoney: item.lenderMoney
        //       // debtorMoney: 1366,
        //       // lenderMoney: 0,
        //     }
        //     res.splice(index+1, 0, temData);
        //   }else if(item.abstractType == '本月冲减水费'){
        //     item.autualMoney = item.lenderMoney
        //     let temBalanceMoney = item.balanceMoney
        //     item.balanceMoney = item.balanceMoney
        //     let temData = {
        //       abstractType: "本月红冲退余额",
        //       balanceMoney: temBalanceMoney,
        //       autualMoney: item.debtorMoney
        //       // debtorMoney: 1366,
        //       // lenderMoney: 0,
        //     }
        //     res.splice(index+1, 0, temData);
        //   }
        //   else if(item.abstractType == '本月冲减水费' || item.abstractType == '本月取消冲减水费'){
        //     item.autualMoney = item.lenderMoney
        //   }
        //   else if(item.abstractType == '本月余额取出'){
        //     item.autualMoney = item.lenderMoney
        //   }
        //   else if(item.abstractType == '本月红冲退款'){
        //     item.autualMoney = item.lenderMoney
        //   }
        // });
         res.forEach((item,index) => {
           if (item.abstractType == '上月结转') {
            item.debtorMoney = item.balanceMoney
          }
         })
        _this.tableData = res
      })
    },
    getDatePicker(){},
    // 导出
    exportExcel() {
      let params = {
        "busicode": "MonthAdvanceSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
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
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
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
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfPreMonthlySummary {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .table-padding{
    tbody {
      .el-table__row{
        td {
          padding: 2px 0 !important;
        }
      }
    }
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

<template>
  <!-- 预收水费统计表 -->
  <div class="ChargeReportOfPresaleVolumeStatistics">
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
              <el-date-picker v-model="tableQuery.accountPeriod"  type="month" value-format="yyyyMM"  >
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight"  show-summary :summary-method='getTotal' stripe border :data="tableData" class="ChargeReportOfPresaleVolumeStatistics-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
           <el-table-column prop="businessArea" min-width="130" label="营业区域">
          </el-table-column>

          <el-table-column prop="lastMonthUsers" min-width="130" label="上月未预收户数(户)">
          </el-table-column>

          <el-table-column prop="currMonthUsers" min-width="130" label="本月未预收户数(户)">
          </el-table-column>

          <el-table-column prop="lastMonthBalance" min-width="150" label="上月结转预收余额(元)">
          </el-table-column>

          <el-table-column prop="currMonthAdvance" min-width="120" label="本月预收金额(元)">
            <template slot-scope="scope">
                {{new Number(scope.row.currMonthAdvance)}}
            </template>
          </el-table-column>

          <el-table-column prop="currMonthDeduct" min-width="120" label="本月扣缴金额(元)">
            <template slot-scope="scope">
                {{new Number(scope.row.currMonthDeduct)}}
            </template>
          </el-table-column>
   
          <el-table-column prop="currMonthCancel" min-width="150" label="本月取消扣缴金额(元)">
          </el-table-column>

          <el-table-column prop="currMonthTakeout" min-width="150" label="本月余额取出金额(元)">
          </el-table-column>

          <el-table-column prop="currMonthRefund" min-width="120" label="本月退款金额(元)">
          </el-table-column>


          <el-table-column prop="currMonthBalance" min-width="120" label="月末预收金额(元)">
          </el-table-column>

          
          <el-table-column prop="result" min-width="100" label="是否平衡">
          </el-table-column>
 
        </el-table>
    
      </div>
       <!-- 分页
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfPresaleVolumeStatistics",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      totalData:{},
      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        // page: 1,
        // pageCount: 20,
        accountPeriod: this.common.date('month','yyyyMM'),
        // accountPeriod:'',
      },

      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "预收统计表" }]
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

    this.common.changeTable(this, ".ChargeReportOfPresaleVolumeStatistics", [
      ".ChargeReportOfPresaleVolumeStatistics .toolbar",
      ".ChargeReportOfPresaleVolumeStatistics .block",
      ".ChargeReportOfPresaleVolumeStatistics #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "DepositExpenseReport",
        data: _this.tableQuery.accountPeriod
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.totalSum
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "DepositExpenseReportExport",
        "data": this.tableQuery.accountPeriod,
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
    getTotal(param){
      let vm = this;
      let sums = [];
        var selectedColm = param.columns;
        let newArray=[]
        selectedColm.forEach(a => {
            if(vm.totalData[a.property]){
              //合计-科学记数法转化成正常数值
         var num = new Number(vm.totalData[a.property]).toLocaleString();
            num = num.toString().replace(/\$|\,/g, '');
                newArray.push(num)
                }else{newArray.push('')}
          });
        sums=newArray;
        sums[0] = "合计";
        return sums;
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
      return (1 - 1) * 20 + (index + 1);

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
.ChargeReportOfPresaleVolumeStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

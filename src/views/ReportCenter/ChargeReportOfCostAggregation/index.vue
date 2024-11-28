<template>
  <!-- 收费月汇总 费用 -->
  <div class="ChargeReportOfCostAggregation">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

           
             <el-form-item label='日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="缴费方式：" class="width-150">
          <el-select  clearable v-model="tableQuery.payMethod" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="缴费渠道：" class="width-150">
          <el-select  clearable v-model="tableQuery.payChannel" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费员：" class="width-150">
          <el-select filterable   clearable v-model="tableQuery.chargeStaffName" placeholder="全部">
            <el-option v-for="item in chargingStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary 
        :summary-method='getTotal' :data="tableData" class="ChargeReportOfCostAggregation-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="date" min-width="80" label="日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="transactionMoney" min-width="80" label="交易金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsMoney" min-width="100" label="销账金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="ycMoney" min-width="100" label="预存款" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="sf" min-width="100" label="水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="100" label="违约金" show-overflow-tooltip align="right">
          </el-table-column>
           <el-table-column prop="rl" min-width="100" label="容量水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="wscl" min-width="100" label="污水处理费" show-overflow-tooltip align="right">
          </el-table-column>
           <el-table-column prop="ljcl" min-width="100" label="垃圾处理费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="de" min-width="100" label="定额垃圾费" show-overflow-tooltip align="right">
          </el-table-column>
           <el-table-column prop="ws" min-width="100" label="卫生费" show-overflow-tooltip align="right">
          </el-table-column>


        </el-table>
        
      </div>
      <!-- 分页 
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
        -->
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfCostAggregation",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      // 列表数据
      tableData: [],
      totalData: {},
        //数据字典存值
      dictionaryData: {},
      chargingStaffList: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startDate:'',
        endDate:'',
        payChannel:'',
        payMethod:'',
        chargeStaffName:''
      },
  
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "收费月汇总" }]
      },
      tableShow: false,
      maxHeight: 0,
      Time:[],
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    // let time = new Date()
    // let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    // this.tableQuery.accountPeriod = time.getFullYear() + month

    this.Time = [this.common.date(), this.common.date()]
    this.getDatePicker(this.Time) 
    this.getDictionary()
    this.getchargStaff();

    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfCostAggregation", [
      ".ChargeReportOfCostAggregation .toolbar",
      ".ChargeReportOfCostAggregation .block",
      ".ChargeReportOfCostAggregation #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "CostAggregationReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
   
     // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 数据字典
    getDictionary() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPI,BPC"//收费类型、缴费方式
      };
      this.$api.fetch({
        params: dictionaryDataParams
      }).then(res => {
        res.BPI = [...[{ name: "全部", value: "" }], ...res.BPI]
        res.BPC = [...[{ name: "全部", value: "" }], ...res.BPC]
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    // 收费员下拉框
    getchargStaff() {
      var _this = this
      var params = {
        "busicode": "PostUserSelect",
        "data": {postNo:"1"}// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        res = [...[{ userName: "全部", userAccount: "" }], ...res]
        _this.chargingStaffList = res
      })
    },
    
    // 导出
    exportExcel() {
      let params = {
        "busicode": "CostAggregationReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
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
    },
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfCostAggregation {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfCollectionStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="统计方式：" class="width-150">
              <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="统计方式">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='收费日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal'  :data="tableData.list" class="ChargeReportOfCollectionStatistics-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

           <el-table-column v-if="tableQuery.statisticsWay == 1" prop="statisticsType" min-width="80" label="收费员" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 2" prop="statisticsType" min-width="80" label="缴费方式" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 3" prop="statisticsType" min-width="80" label="缴费渠道" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="personTime" min-width="100" label="人次" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="totalWater" min-width="120" label="总用水量" show-overflow-tooltip align="right">
          </el-table-column>
          <template v-for='(col) in costList'>
           <el-table-column
             show-overflow-tooltip
             :prop="col.costNameEn"
             :label="col.costName"
             :key="col.costNo"
             v-if="col.costName.length>0" 
             align="right"
             min-width="120">
           </el-table-column>
          </template>
          <el-table-column v-if="lj" prop="ljclf" min-width="120" label="垃圾费" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="addMoney" min-width="120" label="追加水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="penaltiesMoney" min-width="120" label="罚款水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterMoney" min-width="120" label="水费合计" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
          </el-table-column>

          <!--el-table-column prop="reissueCard" min-width="120" label="补卡费" show-overflow-tooltip>
          </el-table-column-->

          <el-table-column prop="totalCost" min-width="120" label="费用合计" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsMoney" min-width="120" label="实收金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="advanceMoney" min-width="120" label="预收金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="serviceCharge" min-width="120" label="手续费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="totalMoney" min-width="120" label="总金额" show-overflow-tooltip align="right">
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfCollectionStatistics",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,

      lj:null,
      costList:[],
      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        statisticsWay: 1,
        startDate: '',
        endDate: ''
      },
      // 查询条件日期
      Time: [],
      // 统计方式下拉框数据
      processStateData: [{name:'按收费员',value:1},{name:'按缴费方式',value:2},{name:'按缴费渠道',value:3}],
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "收款统计报表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    // this.tableQuery.startDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.startDate = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.endDate = `${time.getFullYear()}-${month}-${day}`
    // this.tableQuery.endDate = `${time.getFullYear()}-${(Number(month) + 1) > 9 ? (Number(month) + 1) : '0' + (Number(month) + 1)}-${day}`
    this.Time = [this.tableQuery.startDate, this.tableQuery.endDate]
    this.getInvoiceCostsAndTypes()
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".ChargeReportOfCollectionStatistics", [
        ".ChargeReportOfCollectionStatistics .toolbar",
        ".ChargeReportOfCollectionStatistics .block",
        '.ChargeReportOfCollectionStatistics .bread-contain'
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
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "ChargeSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes() {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        let cost = []
        let lj = res.ljclf
        _this.lj=res.ljclf
        res.costList.forEach((item)=>{
          if(!lj || lj.indexOf(item.costNameEn)==-1){
            cost.push(item)
          }
        })
        this.costList=cost
      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ChargeSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
      const columns=  total.columns
      let arr = ['合计']
      for (const column of columns) {
        if (this.totalData[column.property] != '合计') {
          arr.push(this.totalData[column.property])
        }
      }
      return arr
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
.ChargeReportOfCollectionStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

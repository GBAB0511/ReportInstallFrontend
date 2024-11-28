<template>
  <!-- 业务办理汇总 -->
  <div class="OtherReportOfBusinessProStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label="统计方式：">
              <el-select ref="select1"  v-model="tableQuery.statisticsWay" placeholder="统计方式">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='业务年月：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData.list" class="OtherReportOfBusinessProStatistics-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column v-if="tableQuery.statisticsWay == 1" prop="statisticsType" min-width="60" label="业务类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 2" prop="statisticsType" min-width="60" label="办理渠道" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 3" prop="statisticsType" min-width="60" label="客户类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="businessAmount" min-width="100" label="业务单数" align="right">
          </el-table-column>

          <el-table-column prop="timelyAmount" min-width="100" label="准期单数" align="right">
          </el-table-column>

          <el-table-column prop="delayAmount" min-width="100" label="延期单数" align="right">
          </el-table-column>

          <el-table-column prop="delayRatio" min-width="80" label="延期率" align="right">
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
  name: "OtherReportOfBusinessProStatistics",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        statisticsWay: 1,
        startAccountPeriod: '',
        endAccountPeriod: ''
      },
      // 查询条件日期
      Time: [],
      // 状态下拉框数据
      processStateData: [{name:'业务类型',value:1},{name:'办理渠道',value:2},{name:'客户类型',value:3}],
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "业务办理统计表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow5')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfBusinessProStatistics", [
      ".OtherReportOfBusinessProStatistics .toolbar",
      ".OtherReportOfBusinessProStatistics .block",
      ".OtherReportOfBusinessProStatistics #crumbs"
    ]);
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
        busicode: "BusinessSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "BusinessSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
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
        this.tableQuery.startAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.startAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
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
    }},
    TimeList(val) {
      console.log(val)
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    }
  
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.OtherReportOfBusinessProStatistics {
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

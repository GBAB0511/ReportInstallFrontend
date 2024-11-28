<template>
  <div class="ProjectReportOfStatistics">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        <el-button @click="Print" size="mini" icon="el-icon-printer" type="primary">打印</el-button>
      </div>
    </div>

    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label='完工日期：'>

            <div v-if="tableQuery.statisticsWay == 1">
              <el-date-picker v-model="tableQuery.overBeginDate" value-format="yyyy" type="year" placeholder="选择年">
              </el-date-picker>
              -
              <el-date-picker v-model="tableQuery.overEndDate" value-format="yyyy" type="year" placeholder="选择年">
              </el-date-picker>
            </div>

              <el-date-picker v-if="tableQuery.statisticsWay == 2" v-model="TimeList" @change="getDatePicker" value-format="yyyyMM" type="monthrange" unlink-panels range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
              </el-date-picker>

            <el-date-picker v-if="tableQuery.statisticsWay == 3" v-model="TimeList" @change="getDatePicker" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>

          </el-form-item>

          <el-form-item label="统计方式：">
            <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="请选择" @change='clearData'>
              <el-option v-for="item in statisticsWayData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

        <!-- <el-table-column type="selection" width="50" fixed="left">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="overDate" min-width="100" label="完工日期">
        </el-table-column>

        <el-table-column prop="amount" min-width="100" label="数量">
        </el-table-column>

        <el-table-column prop="timelyAmount" min-width="100" label="及时数量" align="right">
        </el-table-column>

        <el-table-column prop="delayAmount" min-width="100" label="延期数量" align="right">
        </el-table-column>

        <el-table-column prop="timelyRatio" min-width="100" label="及时率" align="right">
        </el-table-column>

        <el-table-column prop="totalMoney" min-width="100" label="金额" align="right">
        </el-table-column>

        <el-table-column prop="timelyMoney" min-width="100" label="及时金额" align="right">
        </el-table-column>

        <el-table-column prop="delayMoney" min-width="100" label="延期金额" align="right">
        </el-table-column>

      </el-table>
      
    </div>

    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>

  </div>
</template>
<script>

export default {
  name: "ProjectReportOfStatistics",
  components: {

  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程报表" }, { title: "工程统计表" }]
      },
      // 完工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        overBeginDate: '',// 开始日期
        overEndDate: '',// 结束日期
        statisticsWay: '2',// 统计方式
      },
      // 列表数据
      tableData: {},
      // 统计方式下拉数据
      statisticsWayData: [
        { name: '按年', value: '1' },
        { name: '按月', value: '2' },
        { name: '按日', value: '3' },
      ],
      // 数据字典数据
      dictionaryData: [],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      tableShow: false,
      maxHeight: 0,
    }
  },
  watch: {
    'tableQuery.statisticsWay': {
      handler: function () {
        console.log(this.tableQuery.statisticsWay)
      }
    },
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow2')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.TimeList = [time.getFullYear() + month, time.getFullYear() + month]
    // this.init()
    this.getDictionary()
    this.$nextTick( () => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

      this.common.changeTable(this, ".ProjectReportOfStatistics", [
        ".ProjectReportOfStatistics .toolbar",
        ".ProjectReportOfStatistics .block",
        ".ProjectReportOfStatistics #crumbs"
      ])
    })
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 初始化
    init() {
      let _this = this
      let params = {
        "busicode": "PjStatisticsReport",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "CTT"
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "PjStatisticsReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 打印
    Print() {
      let arr = []
      let params = {
        busicode: "PjStatisticsReportPrint",
        data: this.tableQuery,
      };
      this.$api.fetch({ params: params }).then(res => {
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        this.common.print('print', 'PjStatisticsReportPrint', '', res, this);
        
      })
    },
    // 获取施工日期框数据
    getDatePicker(date) {
      if (date && date.length > 0) {
        this.tableQuery.overBeginDate = date[0]
        this.tableQuery.overEndDate = date[1]
      } else {
        this.tableQuery.overBeginDate = ''
        this.tableQuery.overEndDate = ''
      }
    },
    // 重置日期数据
    clearData(date) {
      this.tableQuery.overBeginDate = ''
      this.tableQuery.overEndDate = ''
      this.TimeList = []
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);

    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    TimeList(val) {
      console.log(val)
      if(val && val.length > 0) {
        this.tableQuery.overBeginDate = val[0]
        this.tableQuery.overEndDate = val[1]
      }
    }
  }
}
</script>
<style lang="scss">
.ProjectReportOfStatistics {
  width: calc(100% - 20px);
  height: calc(100% - 0px);
  .el-form-item__content /deep/ .el-input--suffix{
    width: auto !important;
  }
  .el-date-editor--year {
    width: auto !important;
  }
  .el-date-editor--month {
    width: auto !important;
  }
}
</style>
<template>
  <div class="ProjectReportOfCollectionStatistics">

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
            <el-date-picker v-model="TimeList" @change="getDatePicker" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="统计方式：">
            <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="请选择">
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

        <el-table-column prop="statisticsType" min-width="100" :label="statisticsTypeName">
        </el-table-column>

        <el-table-column prop="amount" min-width="100" label="数量">
        </el-table-column>

        <el-table-column prop="money" min-width="100" label="合计费用">
        </el-table-column>

        <el-table-column prop="taxPayable" min-width="100" label="应纳税金">
        </el-table-column>

        <el-table-column prop="afterTaxIncome" min-width="100" label="税后合计">
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
  name: "ProjectReportOfCollectionStatistics",
  components: {

  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程报表" }, { title: "工程收款统计表" }]
      },
      // 完工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        overBeginDate: '',// 完工开始日期
        overEndDate: '',// 完工结束日期
        statisticsWay: '1',// 统计方式
      },
      // 列表数据
      tableData: {},
      // 统计方式下拉数据
      statisticsWayData: [
        { name: '单据', value: '1' },
        { name: '工程', value: '2' },
        { name: '客户', value: '3' },
      ],
      // 类型表头字段名（动态化）
      statisticsTypeName: '单据',
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
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow2')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.overBeginDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.overEndDate = `${time.getFullYear()}-${month}-${day}`
    this.TimeList = [this.tableQuery.overBeginDate, this.tableQuery.overEndDate]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ProjectReportOfCollectionStatistics", [
      ".ProjectReportOfCollectionStatistics .toolbar",
      ".ProjectReportOfCollectionStatistics .block",
      ".ProjectReportOfCollectionStatistics #crumbs"
    ])
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
        "busicode": "PjChargeStatisticsReport",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "PjChargeStatisticsReportExport",
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
        busicode: "PjChargeStatisticsReportPrint",
        data: this.tableQuery,
      };
      this.$api.fetch({ params: params }).then(res => {
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        this.common.print('print', 'PjChargeStatisticsReportPrint', '', res, this);
        
      })
    },
    // 获取施工日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.overBeginDate = date[0]
        this.tableQuery.overEndDate = date[1]
      } else {
        this.tableQuery.overBeginDate = ''
        this.tableQuery.overEndDate = ''
      }
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      if (this.tableQuery.statisticsWay == 1) {
        this.statisticsTypeName = this.statisticsWayData[0].name
      } else if (this.tableQuery.statisticsWay == 2) {
        this.statisticsTypeName = this.statisticsWayData[1].name
      } else if (this.tableQuery.statisticsWay == 3) {
        this.statisticsTypeName = this.statisticsWayData[2].name
      }
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
    }
  }
}
</script>
<style lang="scss">
.ProjectReportOfCollectionStatistics {
  width: calc(100% - 20px);
  height: calc(100% - 0px);
}
</style>
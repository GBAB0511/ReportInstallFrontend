<template>
  <div class="MeterReadingOfMonthlyFineReport">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div> 
    </div>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

        <el-form-item class="form-left">

          <el-form-item label="营业区域：" prop="businessArea" class="width-150">
            <!--el-select v-model="tableQuery.businessAbode" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in businessAbodeData" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select-->
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
          </el-form-item>

          <el-form-item label="账期：">
            <div>
              <el-date-picker v-model="monthrange" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" show-summary :summary-method='getTotal' :span-method="objectSpanMethod" border :data="tableData" class="change-tables-table">

        <!-- <el-table-column type="selection" width="50" fixed="left">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <!--el-table-column prop="businessAbode" min-width="100" label="营业所" show-overflow-tooltip>
        </el-table-column-->

        <el-table-column prop="businessArea" min-width="100" label="营业区域" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="account" min-width="100" label="罚款次数" show-overflow-tooltip align="right">
        </el-table-column>

        <el-table-column prop="water" min-width="100" label="罚款水量" show-overflow-tooltip align="right">
        </el-table-column>

        <el-table-column prop="money" min-width="100" label="罚款金额" show-overflow-tooltip align="right">
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <!-- <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div> -->
    </div>

  </div>
</template>
<script>

export default {
  name: "MeterReadingOfMonthlyFineReport",
  components: {

  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "抄表水量报表" }, { title: "罚款水量月报" }]
      },
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        businessArea: '',// 营业所
        beginAccountPeriod: '',// 账期开始时间
        endAccountPeriod: '',// 账期结束时间
      },
      monthrange: [], //账期
      // 列表数据
      tableData: [],
      // 合计数据
      totalData: {},
      spanArr: [],
      pos: '',



      // 营业所下拉数据
      businessAreaData: [],
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
    eventBus.$emit('asideMenuShow', 'reportMenuShow3')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.monthrange = [time.getFullYear() + month, time.getFullYear() + month]

    // this.init()
    this.getBusinessAreaData()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfMonthlyFineReport", [
      ".MeterReadingOfMonthlyFineReport .toolbar",
      ".MeterReadingOfMonthlyFineReport .block",
      // ".MeterReadingOfMonthlyFineReport #crumbs"
    ])
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      this.tableQuery.businessArea=this.common.handleTreeData(this.tableQuery.businessArea)
      let params = {
        "busicode": "PenaltyWaterStatisticsReport",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res.detail
        this.totalData = res.total
        this.getSpanArr(this.tableData);
        // this.getTotal(res.total)
      })
    },
    // 返回合计数据
    getTotal(total) {
      //console.log(total);
      let arr = ['合计']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "PenaltyWaterStatisticsReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 营业区域下拉框
    getBusinessAreaData() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaData = res.children;
      })
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },


//     getSpanArr(data)方法 data就是我们从后台拿到的数据，通常是一个数组；spanArr是一个空的数组，用于存放每一行记录的合并数；pos是spanArr的索引。

// 如果是第一条记录（索引为０），向数组中加入１，并设置索引位置；如果不是第一条记录，则判断它与前一条记录是否相等，如果相等，则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１，

// 以此往复，得到所有行的合并数，０即表示该行不显示
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].businessArea === data[i - 1].businessArea) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
        console.log(this.spanArr)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '营业所') {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`)
        return { // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
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
      return (1 - 1) * 20 + (index + 1);

    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    monthrange(val) {
      if(val && val.length > 0) {
        this.tableQuery.beginAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    }
  }
};
</script>
<style lang="scss">
.MeterReadingOfMonthlyFineReport {
  width: calc(100% - 20px);
  height: calc(100% - 0px);
  .el-form-item__content .el-date-editor--month {
    width: auto !important;
  }
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
<template>
  <div class="OtherReportOfInvoiceDetailed">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button> -->
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item>
            <el-form-item label='日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="营业区域：">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" @change="changeBusinessArea" :show-all-levels="false" :props="props" class="shouldWater">
              </el-cascader>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" highlight-current-row show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="OtherReportOfInvoiceDetailed-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号">
          </el-table-column>

          <el-table-column prop="accountNo" min-width="100" label="账号编号">
          </el-table-column>

          <el-table-column prop="ctmNo" min-width="100" label="客户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称">
          </el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="150" label="装表地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="businessArea" min-width="100" label="营业区域" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="invoiceNo" min-width="80" label="发票号码">
          </el-table-column>

          <el-table-column prop="invoiceMoney" min-width="100" label="开票金额">
          </el-table-column>

          <el-table-column prop="invoiceStaff" min-width="80" label="开票员">
          </el-table-column>

          <el-table-column prop="invoiceAddr" min-width="150" label="开票地址" show-overflow-tooltip>
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
  name: "OtherReportOfInvoiceDetailed",
  components: {

  },
  data () {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      smsDetailFlag: false,
      smsDetailName: '发票作废明细',
      // 列表数据
      tableData: {},
      totalData: {}, //合计
      detailData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startDate: '',
        endDate: '',
        businessArea: '', // 营业区域
      },
      // 查询条件日期
      Time: [],
      // 数据字典数据
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "发票作废明细表" }]
      },
      tableShow: false,
      maxHeight: 0,

      businessAreaData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      //抄表员
      meterReaderList: [],
      showbookNosData: [],
      bookNos: [],
    };
  },
  mounted () {
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    const day = date.getDate()
    this.tableQuery.startDate = `${year}-${month}-01 00:00:00`
    this.tableQuery.endDate = `${year}-${month}-${day} 23:59:59`
    this.Time = [`${year}-${month}-01`, `${year}-${month}-${day}`]
    this.init()
    this.selectBAreaOptions();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfInvoiceDetailed .index-page", [
      ".OtherReportOfInvoiceDetailed .toolbar",
      ".OtherReportOfInvoiceDetailed .block",
    ]);
  },
  computed: {
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },

    // 列表初始化
    init () {
      let _this = this
      let params = {
        busicode: "BillOpenInvoiceReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.totalSum
      })
    },
    // 返回合计数据
    getTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=[]
      selectedColm.forEach(a => {
        if(vm.totalData[a.property]){
          newArray.push(vm.totalData[a.property])
        }else{newArray.push('')}
      });
      sums=newArray;
      sums[0] = "合计";
      sums[1]="";
      return sums;
    },
    // 导出
    exportExcel () {
      let params = {
        busicode: 'SmsMessageReportExport',
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 查询
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0] + ' 00:00:00'
        this.tableQuery.endDate = date[1] + ' 23:59:59'
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },

    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },

    //营业区域
    selectBAreaOptions (id) {
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
        _this.businessAreaData = data.children;
      })
    },

    // 营业区域改变
    changeBusinessArea () {
      if (this.tableQuery.businessArea) {
        // this.getBooks();
      } else {
        // this.getBooks();
      }
    },

    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
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
<style lang="scss" scoped>
.OtherReportOfInvoiceDetailed {
  width: 100%;
  height: 100%;

  /deep/ {
    .item {
      width: 22%;
      .el-form-item__content {
        width: calc(100% - 73px);
      }
    }
    .shouldWater {
      width: 100%;
      .el-input__inner {
        width: 100%;
      }
    }
    .searchInput {
      width: 300px;
      .el-form-item__content {
        width: calc(100% - 73px);
      }
    }
  }
  .kl-table {
    margin-top: 15px;
  }
  .chargeRemind {
    margin-left: 50px;
    .el-form-item__content {
      color: #606266;
    }
  }
  .noteReminder {
    width: 30%;
    float: left;
    text-align: left !important;
    line-height: 32px;
  }
  .block el-pagination {
    width: 60%;
    float: right;
  }
}
</style>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.OtherReportOfInvoiceDetailed {
  width: 100%;
  height: 100%;
  .index-page {
    height: calc(100% - 41px);
  }
}
</style>

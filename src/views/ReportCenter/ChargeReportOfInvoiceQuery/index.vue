<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfInvoiceQuery">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

            <el-form-item label='开票时间：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="票据类型：">
              <el-select ref="select1" clearable v-model="tableQuery.invoiceType" placeholder="票据类型">
                <el-option v-for="item in pjList" :key="item.invoiceNo" :label="item.invoiceName" :value="item.invoiceNo"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="发票号码：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.invoiceNo" placeholder="请输入发票号码" clearable @keydown.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="开票月份：">
              <el-date-picker v-model="tableQuery.preAccountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
            </el-form-item>
            <el-form-item label="销账月份：">
              <el-date-picker v-model="tableQuery.chargeAccountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="ChargeReportOfInvoiceQuery-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="60" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="invoiceType" min-width="50" label="发票类型" show-overflow-tooltip>
          </el-table-column> 

          <el-table-column prop="openInvoiceTime" min-width="50" label="开票日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="openInvoiceStaff" min-width="50" label="开票人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="invoiceCode" min-width="60" label="发票代码" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="invoiceNo" min-width="60" label="发票号码" show-overflow-tooltip>
          </el-table-column>

           

          <el-table-column prop="invoiceStatus" min-width="40" label="状态" show-overflow-tooltip>
          </el-table-column> 

          <el-table-column prop="invoiceAddr" min-width="120" label="发票下载地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="isPrintAgain" min-width="40" label="是否补打" show-overflow-tooltip>
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
  name: "ChargeReportOfInvoiceQuery",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,

      //票据类型
      pjList:[],

      // 列表数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        invoiceType: '',
        startDate: '',
        endDate: '',
        invoiceNo:'',
        preAccountPeriod: '',
        chargeAccountPeriod: '',
      },
      // 查询条件日期
      Time: [],
      // 数据字典数据
      dictionaryData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "发票查询" }]
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
    // this.tableQuery.preAccountPeriod = time.getFullYear() + month
    // this.tableQuery.chargeAccountPeriod = time.getFullYear() + month
    // this.init()
    this.getInvoiceTypes()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfInvoiceQuery", [
      ".ChargeReportOfInvoiceQuery .toolbar",
      ".ChargeReportOfInvoiceQuery .block",
      ".ChargeReportOfInvoiceQuery #crumbs"
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
        busicode: "InvoiceDetailReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
      // 导出
    exportExcel() {
      let params = {
        "busicode": "InvoiceDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 获取票据类型
    getInvoiceTypes() {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数
           
      }).then(res => {
        this.pjList = JSON.parse(JSON.stringify(res.typeList))
        this.pjList.push({invoiceNo:'ZYFP',invoiceName:'专用发票'});

      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BBT"// 发票类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
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
.ChargeReportOfInvoiceQuery {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

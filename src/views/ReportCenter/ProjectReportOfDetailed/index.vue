<template>
  <div class="ProjectReportOfDetailed">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">

          <el-form-item label='完工日期：'>
            <el-date-picker v-model="TimeList1" @change="getDatePicker1" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否延期：">
            <el-select ref="select1"  clearable v-model="tableQuery.isDelay" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-select ref="select2"  clearable v-model="tableQuery.ctmType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in dictionaryData.CTT" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="申请人/联系电话/身份证号" @keydown.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        <!-- 高级查询内容 -->
        <div v-show="isActive" class="advancedQuery">

          <el-form-item label='申请日期：'>
            <el-date-picker v-model="TimeList2" @change="getDatePicker2" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="施工日期：">
            <el-date-picker v-model="TimeList3" @change="getDatePicker3" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

        <!-- <el-table-column type="selection" width="50" fixed="left">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="billNo" min-width="100" label="单据编号">
        </el-table-column>

        <el-table-column prop="pjType" min-width="100" label="单据类型">
        </el-table-column>

        <el-table-column prop="ctmType" min-width="100" label="客户类型">
        </el-table-column>

        <el-table-column prop="billDate" min-width="100" label="收款日期">
        </el-table-column>

        <el-table-column prop="ctmName" min-width="100" label="客户名称">
        </el-table-column>

        <el-table-column prop="completionDate" min-width="100" label="完工日期">
        </el-table-column>

        <el-table-column prop="linkTel" min-width="100" label="电话号码">
        </el-table-column>

        <el-table-column prop="installAddr" min-width="120" label="用水安装地址">
        </el-table-column>

        <el-table-column prop="certNo" min-width="100" label="身份证号" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="budgetMoney" min-width="100" label="预缴金额" align="right">
        </el-table-column>

        <el-table-column prop="budgetPayDate" min-width="100" label="预缴日期">
        </el-table-column>

        <el-table-column prop="constBeginDate" min-width="120" label="施工开始日期">
        </el-table-column>

        <el-table-column prop="setmtLaborMeterBefore" min-width="100" label="表前人工费" align="right">
        </el-table-column>

        <el-table-column prop="setmtLaborMeterAfter" min-width="100" label="表后人工费" align="right">
        </el-table-column>

        <el-table-column prop="setmtMatrMeterBefore" min-width="100" label="表前材料费" align="right">
        </el-table-column>

        <el-table-column prop="setmtMatrMeterAfter" min-width="100" label="表后材料费" align="right">
        </el-table-column>

        <el-table-column prop="setmtDesignCost" min-width="100" label="设计费" align="right">
        </el-table-column>

        <el-table-column prop="costShare" min-width="100" label="总管分摊费" align="right">
        </el-table-column>

        <el-table-column prop="setmtOtherMeter" min-width="100" label="其它费用" align="right">
        </el-table-column>

        <el-table-column prop="setmtMoney" min-width="100" label="结算合计" align="right">
        </el-table-column>

        <el-table-column prop="setmtDate" min-width="100" label="结算日期" align="right">
        </el-table-column>

        <el-table-column prop="invoiceNo" min-width="100" label="发票编号">
        </el-table-column>

        <el-table-column prop="taxMoney" min-width="100" label="应纳税金" align="right">
        </el-table-column>

        <el-table-column prop="period" min-width="100" label="工期">
        </el-table-column>

        <el-table-column prop="isDelay" label="延期">
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
  name: "ProjectReportOfDetailed",
  components: {

  },
  data() {
    return {
      isActive: false, // 控制高级查询内容的显示
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程报表" }, { title: "工程明细报表" }]
      },
      // 完工日期
      TimeList1: [],
      // 申请日期
      TimeList2: [],
      // 施工日期
      TimeList3: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        completionBeginDate: "",// 完工开始日期
        completionEndDate: "",// 完工结束日期
        isDelay: "",// 是否延期
        ctmType: "",// 客户类型
        fuzzyQuery: "",// 模糊查询
        billBeginDate: "",// 申请开始日期
        billEndDate: "",// 申请结束日期
        constBeginDate: "",// 施工开始日期
        constEndDate: "",// 施工结束日期
      },
      // 列表数据
      tableData: {},
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
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow2')
    this.getDictionary()
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.billBeginDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.billEndDate = `${time.getFullYear()}-${month}-${day}`
    this.TimeList1 = [this.tableQuery.billBeginDate, this.tableQuery.billEndDate]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ProjectReportOfDetailed", [
      ".ProjectReportOfDetailed .toolbar",
      ".ProjectReportOfDetailed .block",
      ".ProjectReportOfDetailed #crumbs",
      ".ProjectReportOfDetailed .toggle-btn"
    ])
  },
  methods: {
   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    // 初始化
    init() {
      let _this = this
      let params = {
        "busicode": "PjDetailReport",
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
        "busicode": "PjDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 获取完工日期框数据
    getDatePicker1(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.completionBeginDate = date[0]
        this.tableQuery.completionEndDate = date[1]
      } else {
        this.tableQuery.completionBeginDate = ''
        this.tableQuery.completionEndDate = ''
      }
    },
    // 获取申请日期框数据
    getDatePicker2(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.billBeginDate = date[0]
        this.tableQuery.billEndDate = date[1]
      } else {
        this.tableQuery.billBeginDate = ''
        this.tableQuery.billEndDate = ''
      }
    },
    // 获取施工日期框数据
    getDatePicker3(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.constBeginDate = date[0]
        this.tableQuery.constEndDate = date[1]
      } else {
        this.tableQuery.constBeginDate = ''
        this.tableQuery.constEndDate = ''
      }
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
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)

    },
    // 高级查询按钮
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up")
        this.isActive = false
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down")

        this.isActive = true
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".ProjectReportOfDetailed", [
          ".ProjectReportOfDetailed .toolbar",
          ".ProjectReportOfDetailed .block",
          ".ProjectReportOfDetailed #crumbs",
          ".ProjectReportOfDetailed .toggle-btn"
        ])
      })
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
<style lang="scss" scoped>
.ProjectReportOfDetailed {
  width: calc(100% - 20px);
  height: 100%;
  .kl-table{
    margin-top: 15px;
  }
}
</style>
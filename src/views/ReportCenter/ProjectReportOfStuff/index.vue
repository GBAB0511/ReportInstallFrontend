<template>
  <div class="ProjectReportOfStuff">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label='完工日期：'>
            <el-date-picker v-model="TimeList" @change="getDatePicker" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="材料代码/材料名称" @keydown.enter.native="search"></el-input>
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

        <el-table-column prop="matrNo" min-width="100" label="材料代码">
        </el-table-column>

        <el-table-column prop="matrName" min-width="100" label="材料名称">
        </el-table-column>

        <el-table-column prop="matrMode" min-width="100" label="材料规格">
        </el-table-column>

        <el-table-column prop="matrNum" min-width="100" label="数量" align="right">
        </el-table-column>

        <el-table-column prop="matrUnit" min-width="100" label="材料单位">
        </el-table-column>

        <el-table-column prop="matrPrice" min-width="100" label="单价" align="right">
        </el-table-column>

        <el-table-column prop="matrMoney" min-width="100" label="金额" align="right">
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
  name: "ProjectReportOfStuff",
  components: {

  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程报表" }, { title: "工程材料清单" }]
      },
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        constBeginDate: '',// 施工开始日期
        constEndDate: '',// 施工结束日期
      },
      // 列表数据
      tableData: {},
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
    this.tableQuery.constBeginDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.constEndDate = `${time.getFullYear()}-${month}-${day}`
    this.TimeList = [this.tableQuery.constBeginDate, this.tableQuery.constEndDate]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ProjectReportOfStuff", [
      ".ProjectReportOfStuff .toolbar",
      ".ProjectReportOfStuff .block",
      ".ProjectReportOfStuff #crumbs"
    ])
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      let params = {
        "busicode": "PjUseMatrReport",
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
        "busicode": "PjUseMatrReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 获取施工日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.constBeginDate = date[0]
        this.tableQuery.constEndDate = date[1]
      } else {
        this.tableQuery.constBeginDate = ''
        this.tableQuery.constEndDate = ''
      }
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
    }
  }
};
</script>
<style lang="scss">
.ProjectReportOfStuff {
  width: calc(100% - 20px);
  height: calc(100% - 0px);
}
</style>
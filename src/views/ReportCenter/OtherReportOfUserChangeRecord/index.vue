<template>
  <!-- 收入月明细 -->
  <div class="OtherReportOfUserChangeRecord">
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

             <el-form-item label='变更时间：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="客户：" class="width-200">
              <el-tooltip class="item" effect="dark" content="客户编号、客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="客户编号、客户名称" v-model="tableQuery.user" @keydown.enter.native="search"></el-input>
            </el-tooltip>
            </el-form-item>

            <el-form-item label="变更事项：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="变更事项"  v-model="tableQuery.changeItem" @keydown.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="OtherReportOfUserChangeRecord-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="userName" min-width="100" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="changeItems" min-width="150" label="变更事项" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="createTime" min-width="100" label="变更时间" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="createName" min-width="100" label="变更人" show-overflow-tooltip>
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
  name: "OtherReportOfUserChangeRecord",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      // 列表数据
      tableData: {},
      totalData: {},
      // 数据字典数据
      dictionaryData: {},
      Time:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        user: '',
        changeItem: ''
      },
      //面包屑
      crumbsData: {
        titleList: [{ title: "其他报表" }, { title: "用户变更记录" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.getDictionary()
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfUserChangeRecord", [
      ".OtherReportOfUserChangeRecord .toolbar",
      ".OtherReportOfUserChangeRecord .block",
      ".OtherReportOfUserChangeRecord #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "UserChangeReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
        _this.totalData = res.total
      
      })
    },
     // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPC,BPI"// 换表类型
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
    // 导出
    exportExcel() {
      let params = {
        "busicode": "UserChangeReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
.OtherReportOfUserChangeRecord {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

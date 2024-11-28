<template>
  <!-- 上报集团 -->
  <div class="ChargeReportOfGroupTable">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        <el-button @click="print" size="mini" icon="el-icon-upload2" type="primary">打印</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='应收账期：'>
              <el-date-picker v-model="tableQuery.accountPeriod"  type="month" value-format="yyyyMM" >
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border   :data="tableData" class="ChargeReportOfGroupTable-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="100" label="用水类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="currendPeriodAmount" min-width="80" label="本期户数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="currendPeriodWater" min-width="100" label="本期应收水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="currendPeriodMoney" min-width="120" label="本期应收水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="synthesizePrice" min-width="80" label="综合单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priorPeriodWater" min-width="100" label="上期水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priorPeriodMoney" min-width="120" label="上期应收水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priorPeriodRecovery" min-width="120" label="上期应收回收" show-overflow-tooltip align="right">
          </el-table-column>

         
        </el-table>
        <table class="el-table total-table">
          <tr>
            <td class="table-td"  colspan="2">小口径水表用户数</td>
            <td class="table-td"  colspan="2">{{detailData.smallBoreAmount}}</td>
            <td class="table-td"  colspan="2">小口径水表用水量</td>
            <td class="table-td"  colspan="2">{{detailData.smallBoreWater}}</td>
          </tr>
          <tr>
            <td class="table-td"  colspan="2">大口径水表用户数</td>
            <td class="table-td"  colspan="2">{{detailData.bigBoreAmount}}</td>
            <td class="table-td"  colspan="2">大口径水表用水量</td>
            <td class="table-td"  colspan="2">{{detailData.bigBoreWater}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfGroupTable",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: [],
      detailData:{},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod:this.common.date('month','yyyyMM'),
      },
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "上报集团报表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfGroupTable", [
      ".ChargeReportOfGroupTable .toolbar",
      ".ChargeReportOfGroupTable .block",
      ".ChargeReportOfGroupTable #crumbs",
      ".ChargeReportOfGroupTable .total-table"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "ReportedBlocReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.list
        _this.detailData = res.detail
      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ReportedBlocReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    print() {
      if(!this.tableData || this.tableData.length === 0) {
        this.$message({
          type: 'warning',
          message: '当前表格无数据，无法打印！'
        })
        return
      }
      let data = ''
      const list = this.tableData
      for(let i = 0; i < list.length; i++) {
        data += `<tr>
      <td>${i+ 1}</td>
      <td>${list[i].waterTypeName}</td>
      <td>${list[i].currendPeriodAmount}</td>
      <td>${list[i].currendPeriodWater}</td>
      <td>${list[i].currendPeriodMoney}</td>
      <td>${list[i].synthesizePrice}</td>
      <td>${list[i].priorPeriodWater}</td>
      <td>${list[i].priorPeriodMoney}</td>
      <td>${list[i].priorPeriodRecovery}</td>
      </tr>`
      }
      const str = `<table border=1 cellpadding=0 cellspacing=0>
      <theader>
      <tr>
      <th>NO.</th>
      <th>用水类型</th>
      <th>本期户数</th>
      <th>本期水量</th>
      <th>本期水费</th>
      <th>综合单价</th>
      <th>上期水量</th>
      <th>上期应收水费</th>
      <th>上期应收回收</th>
      </tr>
      </theader>
      <tbody>
      ${data}
      </tbody>
      </table>
      <table border=1 cellpadding=0 cellspacing=0>
      <tbody>
      <tr>
            <td colspan="2">小口径水表用户数</td>
            <td colspan="2">${this.detailData.smallBoreAmount}</td>
            <td colspan="2">小口径水表用水量</td>
            <td colspan="2">${this.detailData.smallBoreWater}</td>
          </tr>
          <tr>
            <td colspan="2">大口径水表用户数</td>
            <td colspan="2">${this.detailData.bigBoreAmount}</td>
            <td colspan="2">大口径水表用水量</td>
            <td colspan="2">${this.detailData.bigBoreWater}</td>
          </tr>
      </tbody>
      </table>
      `
      const frame = document.createElement('iframe')
      document.body.appendChild(frame)
      var doc = frame.contentWindow.document;
      doc.write(str);
      var ys="th,td{padding:2px 4px; max-width:200px; text-align: center;word-break:break-all;}";
      var style=document.createElement("style");
      style.innerText=ys;
      doc.getElementsByTagName("head")[0].appendChild(style)
      doc.close();
      frame.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(frame)
      }, 500)
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
.ChargeReportOfGroupTable {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .table-td{
    border-right:1px solid #EBEEF5;width:25%;text-align:center;
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

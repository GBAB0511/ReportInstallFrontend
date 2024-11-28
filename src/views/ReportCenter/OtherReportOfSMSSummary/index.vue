<template>
  <!-- 短信汇总 -->
  <div class="OtherReportOfSMSSummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <el-dialog :title="smsDetailName" :close-on-click-modal="false" :visible.sync="smsDetailFlag" class="common-dialog" id="OtherReportOfSMSSummaryDia" @close="closeDialog">
      <div class="kl-table" :style="{height: diaTableMaxHeight + 'px'}">
        <el-table highlight-current-row v-if="diaTableShow" :max-height="diaTableMaxHeight" stripe border :data="detailData.list" class="OtherReportOfSMSSummary-table detailInfo">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="detailIndexMethod">
          </el-table-column>

          <el-table-column prop="noticeContent" min-width="200" label="消息内容" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="successNum" min-width="60" label="消费成功条数" align="right">
          </el-table-column>

          <el-table-column prop="failNum" min-width="60" label="消费失败条数" align="right">
          </el-table-column>

          <el-table-column prop="msgNum" min-width="60" label="消息总条数" align="right">
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="tableQuery1.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery1.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
      </div>
    </el-dialog>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='发送日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="短信类型：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.noticeWay" placeholder="短信类型">
                <el-option v-for="item in dictionaryData.NTY" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="OtherReportOfSMSSummary-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="noticeWay" min-width="80" label="短信类型" :formatter="formateWay">
          </el-table-column>

          <el-table-column prop="successnum" min-width="60" label="成功">
          </el-table-column>

          <el-table-column prop="failnum" min-width="60" label="失败">
          </el-table-column>

          <el-table-column prop="msgnum" min-width="60" label="总数量">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="detail(scope)">查看详情</el-button>
            </template>
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
  name: "OtherReportOfSMSSummary",
  components: {

  },
  data () {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      smsDetailFlag: false,
      smsDetailName: '短信详情',
      dictionaryData: {},
      // 列表数据
      tableData: {},
      totalData: {}, //合计
      detailData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        noticeWay: '',
        startDate: '',
        endDate: '',
      },
      tableQuery1: {
        page: 1,
        pageCount: 20,
        noticeWay: '',
        startDate: '',
        endDate: '',
      },
      // 查询条件日期
      Time: [],
      // 数据字典数据
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "短信汇总表" }]
      },
      tableShow: false,
      diaTableShow: true,
      maxHeight: 0,
      diaTableMaxHeight: 450,
    };
  },
  mounted () {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow5')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.startDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.endDate = `${time.getFullYear()}-${month}-${day}`
    this.Time = [this.tableQuery.startDate, this.tableQuery.endDate]
    // tableQuery1
    this.tableQuery1.startDate = this.tableQuery.startDate;
    this.tableQuery1.endDate = this.tableQuery.endDate;
    // this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfSMSSummary", [
      ".OtherReportOfSMSSummary .toolbar",
      ".OtherReportOfSMSSummary .block",
      ".OtherReportOfSMSSummary #crumbs"
    ]);
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    formateWay (val) {
      var way = ''
      if (this.dictionaryData.NTY != undefined) {

        this.dictionaryData.NTY.forEach((item) => {
          if (item.value === val.noticeWay) {
            way = item.name;
          }
        })
      }
      return way;
    },
    detail (val) {
      let _this = this
      this.smsDetailFlag = true
      if(val){
        this.tableQuery1.noticeWay = val.row.noticeWay
      }
      let params = {
        busicode: "SendMsgDetailReport",
        data: _this.tableQuery1
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.detailData = res
        this.calcDiaTableHeight();
      })
    },
    // 列表初始化
    init () {
      let _this = this
      let params = {
        busicode: "SendMsgSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },
    // 数据字典（查询框）
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "NTY"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 导出
    exportExcel () {
      let params = {
        "busicode": "SendMsgSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 返回合计数据
    getTotal (total) {
      let arr = ['合计']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
    calcDiaTableHeight(){
      let parentDom = $($('#OtherReportOfSMSSummaryDia .el-dialog .el-dialog__body')[0]);
      if(parentDom){
          this.diaTableMaxHeight = parentDom.innerHeight() - 80;
      }else{
          this.diaTableMaxHeight = 450;
      }
      
    },
    // 查询
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
        this.tableQuery1.startDate = date[0]
        this.tableQuery1.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
        this.tableQuery1.startDate = date[0]
        this.tableQuery1.endDate = date[1]
      }
    },
    closeDialog () {
      this.smsDetailFlag = false;
      this.tableQuery1.page = 1
      this.tableQuery1.noticeWay = ''
      this.init();
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
    //分页
    handleSizeChange1 (val) {
      //显示多少数据一页
      this.tableQuery1.pageCount = val
      this.tableQuery1.page = 1
      this.detail();
    },
    handleCurrentChange1 (val) {
      //显示多少页码
      this.tableQuery1.page = val
      this.detail();
    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    detailIndexMethod(index){
      return (this.tableQuery1.page - 1) * this.tableQuery1.pageCount + (index + 1);
    }

  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    diaTableMaxHeight(){
        this.diaTableShow = false;
        this.$nextTick(() => {
            this.diaTableShow = true;
        })
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.OtherReportOfSMSSummary {
  width: 100%;
  height: 100%;
  .index-page {
    height: calc(100% - 41px);
  }
  .detailInfo{
      margin-top: 20px;
    .el-table__row{
      .cell{
          padding: 7px 10px;
      }
      .is-right{
          .cell{
              text-align: right !important;
          }
      }
    }
  }
}
</style>

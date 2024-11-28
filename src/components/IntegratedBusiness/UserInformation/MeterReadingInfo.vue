
<template>

  <div class="WatMeterReadingInfo">

    <!-- <div class="toolbar">
      <el-form :inline="true" :model="tableQuery" class="demo-form-inline">

        <el-form-item class="form-left">
          <el-form-item label='账期：'>
            <el-date-picker v-model="DateChoosevalue" value-format="yyyyMM" :picker-options="pickerOptions" clearable type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
            </el-date-picker>
          </el-form-item>

          <el-form-item>

            <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>

        <el-form-item class="form-right">
        </el-form-item>
      </el-form>
    </div> -->

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='账期：'>
            <el-date-picker v-model="DateChoosevalue" value-format="yyyyMM" :picker-options="pickerOptions" clearable type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
          </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
           <el-form-item class="form-right">
           <el-button size="mini" type="primary" icon="el-icon-upload2"   @click.native="exportExcel">导出</el-button>
           </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="accountPeriod" min-width="80" fixed="left" label="账期">
        </el-table-column>

        <el-table-column prop="meterReadingDate" min-width="120" fixed="left" label="抄表日期">
        </el-table-column>

        <el-table-column prop="bookNo" min-width="110" label="册本号" fixed="left"></el-table-column>

        <el-table-column prop="priorPeriodNum" min-width="100" label="上期抄码" fixed="left">
        </el-table-column>

        <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" fixed="left">
        </el-table-column>

        <el-table-column prop="changeMeterFlag" min-width="80" label="换表标记" :formatter="formatter">
        </el-table-column>

        <el-table-column prop="newMeterNum" min-width="80" label="新表底码">
        </el-table-column>

        <el-table-column prop="oldMeterNum" min-width="80" label="旧表底码">
        </el-table-column>

        <el-table-column prop="currendPeriodWater" min-width="80" label="用水量">
          <template slot-scope="scope">{{parseInt(scope.row.currendPeriodWater)}}</template>
        </el-table-column>

        <el-table-column prop="addWater" min-width="80" label="增减水量">
        </el-table-column>

        <el-table-column prop="shareWater" min-width="80" label="分摊水量">
        </el-table-column>

        <el-table-column prop="realityWater" min-width="100" label="水量合计">
        </el-table-column>

        <el-table-column prop="useWaterDays" min-width="100" label="用水天数">
        </el-table-column>

        <el-table-column prop="avgWater" min-width="100" label="日均水量">
        </el-table-column>

        <el-table-column prop="yearWater" min-width="100" label="年用水量">
        </el-table-column>

        <el-table-column prop="statusName" min-width="100" label="抄表状态">
        </el-table-column>
          <el-table-column prop="meterReadFlagName" min-width="100" label="抄表标记">
        </el-table-column>
        <el-table-column prop="meterReadingStaff" min-width="120" label="抄表员" show-overflow-tooltip>
        </el-table-column>

       <!-- <el-table-column prop="mobile" min-width="80" label="手机号码">
        </el-table-column> -->

        <el-table-column prop="comments" min-width="80" label="备注" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="recordName" min-width="100" label="录单员" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WatMeterReadingInfo",
  props: ['MeterReadingInfoData'],
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '财务中心', path: '/WatMeterReadingInfo' },
          { title: '票据管理', method: () => { window.histroy.back() } }
        ],

      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo: "",
        beginDate: "",
        endDate: ""
      },
      totalData:{},
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {

      },
      WatMeterReadingInfoVisible: false,  //综合查询的显示和隐藏
      WatMeterReadingInfoName: '发票领用-领用',
      ruleFormData: {},

    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    // this.common.changeTable(this, '.WatMeterReadingInfo', 
    // ['.WatMeterReadingInfo .toolbar', 
    // '.WatMeterReadingInfo .block'])
     this.common.changeTable(this, ".WatMeterReadingInfo", [
      ".WatMeterReadingInfo .toolbar",
      ".WatMeterReadingInfo .block",
      // ".WatMeterReadingInfo #crumbs"
    ]);
  },
  methods: {
    init() {
      console.log(this.MeterReadingInfoData.userNo, this.DateChoosevalue);
      if (this.DateChoosevalue == null) {
        this.tableQuery.beginDate = '';
        this.tableQuery.endDate = '';
      } else {
        this.tableQuery.beginDate = this.DateChoosevalue[0];
        this.tableQuery.endDate = this.DateChoosevalue[1];
      }
      console.log(this.tableQuery);
      let _this = this
      let data = _this.tableQuery
      _this.tableQuery.userNo = _this.MeterReadingInfoData.userNo;
      let params = {
        "busicode": "MeterReadingList",
        data,
      }
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '','','','','','','','']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
    formatter(row, column, cellValue, index) {//转义后端0,1 => 是 否

        return row.changeMeterFlag == 0 ? '否':'是'
    },

 //导出
    exportExcel() {
          var _this = this
          var data = JSON.parse(JSON.stringify(_this.tableQuery))
          data.page=1;
          data.pageCount=999999;
          var params = {
            busicode: "MeterReadingExport",
            data: data,
            token: sessionStorage.getItem('token'),
            sysType: '002'
          }
          // 入参不需要分页
          delete params.data.page
          delete params.data.pageCount
          window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
          //window.open('http://localhost:8080/css2_war_exploded/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
        },

    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    //exportExcel() {
      //   	let listData = {}
      //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
      //     let params ={
      //       "busicode":"MeterReadingList",
      //       "data": this.tableQuery
      //     }
      //     this.$api.fetch({
      //       apiUrl: 'interface.api',//路径
      //       method: 'post',//请求方法
      //       params:params,//参数
      //       needErrorCallback:true
      //     }).then(res =>{
      //     	if(res.code===0){
      //         listData = res.data
      //         if (!listData.list[0]) {
      //         		this.$notify({
      //               title: '警告',
      //               message:'表格没有相关数据',
      //               type: 'error'
      //             })
      //         	} else {
      //         		import('@/vendor/Export2Excel').then(excel => {
      // 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
      // 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
      // 			        const list = listData.list
      // 			        const data = this.formatJson(filterVal, list)
      // 			        excel.export_json_to_excel({
      // 			          header: tHeader,
      // 			          data,
      // 			          filename: this.tableQuery.daytime + '抄表数据',
      // 			          autoWidth: '100'
      // 			        })
      // 			      })
      //         		this.tableQuery.pageCount = 20
      //         	}
      //       }
      //     })
   // },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },

    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod(index) {//获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);

    },
    closeDialog() { //关闭会话
      this.WatMeterReadingInfoVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWatMeterReadingInfo.submit()
      // this.WatMeterReadingInfoVisible = false;
    },
    add() {
      this.WatMeterReadingInfoVisible = true;
    },
    edit() {

    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.WatMeterReadingInfo {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .kl-table {
    padding: 0px 20px;
    height: 100%;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .el-form--inline .el-form-item:first-of-type {
    margin-right: 0px;
  }
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range-separator {
    line-height: 22px;
    width: 10%;
  }
   .searchBtn{
      background: #faa646;
      color: #fff;
    }
  // 滚动条覆盖固定列
  .el-table--scrollable-x .el-table__body-wrapper {
    z-index: 1;
  }
}
  .el-dialog__body{
    padding: 10px 20px;
  }
// .el-date-editor .el-range__close-icon{
//   padding: 0!important;
//   line-height : 0px!important;
// }
// .el-date-editor .el-range-separator{
//   padding: 0!important;
// }


</style>

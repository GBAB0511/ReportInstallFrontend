
<template>

  <div class="PredepositDdetailsInfo">

    <div class="toolbar">

      <div class="bread-contain">
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="printList">打印</el-button>
        <el-button size="mini" type="primary" @click="exportExcel">导出</el-button>
      </div>
    </div>

      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label='收款日期：'>
            <el-date-picker v-model="DateChoosevalue" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions" clearable type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" placeholder="" clearable @keydown.enter.native="demand" @input="e => input = inputMe(e)"></el-input>
          </el-form-item>
          <el-form-item label="账户编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountNo" placeholder="" clearable @keydown.enter.native="demand" @input="e => input = inputMe(e)"></el-input>
          </el-form-item>
          <el-form-item label="收费类型：">
            <!--el-input v-model="tableQuery.payType" placeholder="" clearable @keydown.enter.native="demand"></el-input-->
            <el-select clearable v-model="tableQuery.payType"  placeholder="" @keydown.enter.native="demand">
              <el-option v-for="(item,index) in dictionaryData.CHT" :key="index" :label="item.name" :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border :data="tableData.list" class="change-tables-table" :row-class-name="getRowClassName" :max-height="maxHeight">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="payTime" min-width="150" label="收费时间">
        </el-table-column>

        <el-table-column prop="payType" min-width="80" label="收费类型">
        </el-table-column>

        <el-table-column prop="userNo" min-width="200" label="用户编号">
        </el-table-column>

        <el-table-column prop="payMoney" min-width="100" label="交易金额">
            <template slot-scope="scope">
                {{new Number(scope.row.payMoney)}}
            </template>
        </el-table-column>

        <el-table-column prop="currendPeriodMoney" min-width="100" label="本期余额">
           <template slot-scope="scope">
                {{new Number(scope.row.currendPeriodMoney)}}
            </template>
        </el-table-column>

        <el-table-column prop="chargingStaff" min-width="80" label="收款员">
        </el-table-column>

        <!-- <el-table-column prop="daytime" min-width="100" label="票据号">
        </el-table-column> -->

        <el-table-column prop="comments" min-width="200" label="摘要">
        </el-table-column>

        
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "PredepositDdetailsInfo",
  props: ['PredepositDdetailsInfoData'],
  data() {
    return {
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo: "",
        beginDate: "",
        endDate: "",
        accountNo:"",
        payType:"",
      },
      dictionaryData:[],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [this.common.date(-365 * 24 * 60 * 60 * 1000), this.common.date()],
      tableShow: false,
      maxHeight: 0,
      tableData: {

      },
      PredepositDdetailsInfoVisible: false,  //综合查询的显示和隐藏
      PredepositDdetailsInfoName: '发票领用-领用',
      ruleFormData: {},

    }
  },
  mounted() {
    this.init();
    this.dictionaryOptions();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.PredepositDdetailsInfo', ['.PredepositDdetailsInfo .toolbar','.PredepositDdetailsInfo .block'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      if (this.DateChoosevalue == null) {
        this.tableQuery.beginDate = '';
        this.tableQuery.endDate = '';
      } else {
        this.tableQuery.beginDate = this.DateChoosevalue[0];
        this.tableQuery.endDate = this.DateChoosevalue[1];
      }
      let _this = this
      let data = JSON.parse(JSON.stringify(_this.tableQuery))
      if(_this.tableQuery.accountNo==='' || _this.tableQuery.accountNo===null){
        _this.tableQuery.accountNo = _this.PredepositDdetailsInfoData.accountNo;
        data.accountNo = _this.PredepositDdetailsInfoData.accountNo;
        if (_this.tableQuery.accountNo==='' || _this.tableQuery.accountNo===null || _this.tableQuery.accountNo===undefined) {
          if(_this.PredepositDdetailsInfoData.userNo!=null) {
            _this.tableQuery.userNo = _this.PredepositDdetailsInfoData.userNo;
            data.userNo = _this.PredepositDdetailsInfoData.userNo;
          }
        }
      }
      
      let params = {
        "busicode": "AccountFlowList",
        data,
      }
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CHT"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData",res);
      }).catch(res => {
        this.$set(this, "dictionaryData",[]);
      });
    },
    printList(){
      let _this = this
      if (_this.DateChoosevalue == null) {
        _this.tableQuery.beginDate = '';
        _this.tableQuery.endDate = '';
      } else {
        _this.tableQuery.beginDate = _this.DateChoosevalue[0];
        _this.tableQuery.endDate = _this.DateChoosevalue[1];
      }
      
      let data = _this.tableQuery
      _this.tableQuery.userNo = _this.PredepositDdetailsInfoData.userNo;
      _this.tableQuery.accountNo = _this.PredepositDdetailsInfoData.accountNo;
      let params = {
        "busicode": "AccountFlowListPrint",
        data,
      }
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.common.print('print', 'AccountFlowListPrint', '', res, _this);
      })
    },
    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
      let params = {
          "busicode": "AccountFlowListExport",
          "data": this.tableQuery,
          token: sessionStorage.getItem('token'),
          // token: 'krrjdev123',
          sysType: '002'
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
        //window.open('http://localhost:8088/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
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
        return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
    closeDialog() { //关闭会话
      this.PredepositDdetailsInfoVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childPredepositDdetailsInfo.submit()
      // this.PredepositDdetailsInfoVisible = false;
    },
    add() {
      this.PredepositDdetailsInfoVisible = true;
    },
    edit() {

    },
    getRowClassName({row}) {
      return row.cancelFlag === 1 ? 'red-row' : ''
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
.PredepositDdetailsInfo {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .toolbar{
    padding: 0px 20px;
  }
  .searchBtn{
      background: #faa646;
      color: #fff;
    }
  .kl-table {
    padding: 0px 20px;
    .red-row {
      color: #F56C6C;
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
  // 表单样式
  .demo-form-inline{
    margin-top: 20px;
  }
}
</style>

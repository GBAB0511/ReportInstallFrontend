

<template>

  <div class="DailyReceiptInquiry">
    <!-- 收费方式变更 -->
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="收费日期：">
            <el-date-picker v-model="tableQuery.payDate" type="date"
             format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="时间段：">
            <el-select clearable v-model="tableQuery.periodTime" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="上午" value="1"></el-option>
              <el-option label="下午" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费方式：">
            <el-select clearable v-model="tableQuery.payMethod" placeholder="全部">
              <el-option v-for="item in dictionaryData.BPG" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费类型：">
            <el-select clearable v-model="tableQuery.payType" placeholder="全部">
              <el-option v-for="item in dictionaryData.DAILY_CHT" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：">
            <el-tooltip class="item" effect="dark" content="客户编号、账户编号、用户编号" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search" @input="e => input = inputMe(e)"></el-input>
            </el-tooltip>
          </el-form-item>

          <div class="el-icon-button">
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search" style="margin-right:10px"></el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
            </el-form-item>
          </div>
          
      </el-form>
      <p class="sumCharge" v-html="sumCharge"></p>
    </div>
    <div class="kl-table common-diaTab" :style="{height: maxHeight + 'px'}">
      <el-table stripe border highlight-current-row v-if="tableShow" :max-height="maxHeight" :data="tableData" @selection-change="getSaveData" class="change-tables-table">

        <!--el-table-column type="selection" width="40" fixed="left">
        </el-table-column-->

        <el-table-column type="index" label="NO." width="45" fixed="left">
        </el-table-column>

        <el-table-column prop="payTime" min-width="120" label="收费时间" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="payChannel" min-width="80" label="收费渠道">
        </el-table-column>

        <el-table-column prop="payMethodName" min-width="80" label="收费方式">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" clearable v-model="scope.row.payMethod" placeholder="全部"  @change="selectOne(scope.row)">
              <el-option v-for="item in dictionaryData.BPG" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span style="color:#606266" v-if="!scope.row.isEdit">{{scope.row.payMethodName}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="payTypeName" min-width="80" label="收费类型">
        </el-table-column>

        <el-table-column prop="incomeBankName" min-width="100" label="进账银行" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" clearable v-model="scope.row.incomeBank" placeholder="全部">
              <el-option v-for="(item,index) in incomeBankList" :key="index" :label="item.bankName+' '+item.bankAccount" :value="item.id" ></el-option>
            </el-select>
            <span style="color:#606266" v-if="!scope.row.isEdit">{{scope.row.incomeBankName}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="serialNo" min-width="150" label="批次号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.serialNo}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sumTransactionMoney" min-width="85" label="交易金额">
        </el-table-column>

        <el-table-column prop="comments" min-width="80" label="备注">
        </el-table-column>
        <el-table-column label="操作" font-size="mini" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" v-if="!scope.row.isEdit && scope.row.payMethod" @click.native="updateRow(scope.row)">修改</el-button>
              <el-button type="text" v-if="scope.row.isEdit" @click.native="save(scope.row)">保存</el-button>
              <el-button type="text" v-if="scope.row.isEdit" @click.native="cancleRow(scope.row)">取消</el-button>
            </template>
          </el-table-column>
      </el-table>

    </div>
      <el-dialog title="缴费详情" :visible.sync="showDetail" class="common-dialog" append-to-body>
        <div class="toolbar">
          <p class="sumCharge sumChargeDetail" v-html="detailCharge"></p>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row :max-height="maxHeight" stripe border :data="detailList" :span-method="arraySpanMethod" class="change-tables-table">
            <el-table-column prop="ctmNo" min-width="100" label="客户编号"></el-table-column>
            <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="accountNo" min-width="100" label="账户编号"></el-table-column>
            <el-table-column prop="userNo" min-width="100" label="用户编号"></el-table-column>
            <el-table-column prop="accountPeriod" min-width="80" label="账单年月"></el-table-column>
            <el-table-column prop="costName" min-width="80" label="收费类型"></el-table-column>
            <el-table-column prop="proceedsMoney" min-width="80" label="金额"></el-table-column>
            <el-table-column prop="penaltyMoney" min-width="80" label="违约金"></el-table-column>
            <el-table-column prop="invoiceNo" min-width="80" label="发票编号"></el-table-column>
            <el-table-column prop="sumMoney" min-width="80" label="合计金额"></el-table-column>
            <el-table-column prop="chargeTime" min-width="120" label="销账时间"></el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 弹窗现金缴费 -->
<!--      <el-dialog append-to-body title="转账" :destroy-on-close="true" width="450px" height="400px" :visible.sync="cashDepositNameVisible" :close-on-click-modal="false" class="cashDeposit-dialog" @close="closeBankDialog">-->
<!--      <BankCheck v-if="cashDepositNameVisible" ref="BankCheck" ></BankCheck>-->
<!--      <div slot="footer" class="dialog-footer" ref="ruleForm">-->
<!--        <el-button type="primary" size="mini" plain @click="submit()">确 定</el-button>-->
<!--        <el-button type="info" size="mini" plain @click="closeBankDialog">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>
<script>
import payWay from "./payWay"
import BankCheck from "@/components/bankCheck";
export default {
  name: "DailyReceiptInquiry",
  components: {
    payWay,
    BankCheck
  },
  data() {
    return {
      // 查询条件对象
      tableQuery: {
        payDate: this.common.date(),
        periodTime: "",
        payMethod: "",
        payType: "",
        chargingStaff: sessionStorage.getItem('account'),
        fuzzyQuery: ""
      },
      // 列表数据
      tableData: [],
      sumCharge: '当日收款汇总：',
      detailCharge: '',
      detailList: [],
      showDetail: false,
      // 数据字典数据
      dictionaryData: {},
      incomeBankList: [],
      // 选中保存数据数组
      saveData: [],
      tableShow: false,
      maxHeight: 0,
      DailyReceiptInquiryVisible: false,  //综合查询的显示和隐藏
      payWayVisible: false,
      chargingStaffList:[],
      updateFlag:1,
      cashDepositNameVisible: false,
      rowData: {},
    }
  },
  mounted() {
    this.init();
    this.getDictionary();
    this.getchargStaff();
    this.getIncomeBankList();

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.DailyReceiptInquiry',
    ['.DailyReceiptInquiry .toolbar'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "PayDayList",
        data: JSON.parse(JSON.stringify(_this.tableQuery))
      };
      if(params.data.payDate===null || params.data.payDate===''){
        this.$message({
          showClose: true,
          message: '请先填写收费日期',
          type: 'warning'
        });
        return
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res.payDayListPageInfo
        const sum = res.payDaySummaryVos.map(item => {
          return `${item.payMethodName}<span style="color: red;">${item.payNum}</span>笔<span style="color: red;">${item.sumTransactionMoney}</span>元`
        }).join('，')
        let count = 0
        this.tableData.forEach(item => {
          count += Number(item.sumTransactionMoney) || 0
        })
        count = this.formatFloat(count);

        this.sumCharge = `当日收款汇总：合计金额<span style="color: red;">${count}</span>元，${sum}`
      })
    },
    getIncomeBankList() {
      let _this = this;
      let params = {
        busicode: "IncomeBankList",
        data: {status:'1'},
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
          this.incomeBankList = res.list;
          this.$emit('getIncomeBankListData',res.list)
        });
    },
    selectOne(row){
      console.log(row)
      if(row.payMethod!='10'){
        row.incomeBankName='';
         row.incomeBank='';
        this.incomeBankList='';

      }else{
       this.getIncomeBankList();
      }


    },
    formatFloat(num){
      let result = parseFloat(num);
      if (isNaN(result)) {
        result = 0;
      }
      result = Math.round(num * 100) / 100;
      let s_x = result.toString();
      var pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
      }
      return s_x;
    },

    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPG,DAILY_CHT"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 收费员下拉框
    getchargStaff() {
      var _this = this
      var params = {
        "busicode": "PostUserSelect",
        "data": {postNo:"1"}// 换表类型
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.chargingStaffList = [{ userName: "全部", userAccount: "" }, ...res]
      })
    },
    payMethodName(row,column){
      for ( var i = 0; i <this.dictionaryData.BPG.length; i++){
          let val = this.dictionaryData.BPG[i];
          if(row.payMethod===val.value){
            return val.name;
          }
      }
    },
    updateRow(row){
      this.$set(row,"isEdit",true)
      console.log(row)
      if(row.payMethod!='10'){
        this.incomeBankList='';
      }
    },
    cancleRow(row){
      this.$set(row,"isEdit",false)
      this.init();
    },
    // 查询
    search() {
      this.init()
    },

    // 获取选中列表数据
    getSaveData(itemList){
      this.saveData = []
      itemList.forEach(item => {
        this.saveData.push({id: item.id, payMethod: item.payMethod})
      });
    },

    // 保存按钮
    save(row){
      // if (row.payMethod == "10") {
      //   // this.cashDepositNameVisible  = true
      //   this.rowData = row
      //   return
      // }
     if(row.payMethod=="10"&&row.incomeBank == ""){
          this.$message({
          message: '进账银行不能为空',
          type: 'warning'
        });
      return;
      }

      if(row.payMethod=="1"){

        row.incomeBank=" ";
        this.rowData=row;
      }
 
      let _this = this;
      let params = {
        busicode: "PayDayUpdate",
        // data: [{serialNo: row.serialNo, payMethod: row.payMethod}]
        data: [{serialNo: row.serialNo, payMethod: row.payMethod, incomeBank: row.incomeBank}]
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.$message({
          showClose: true,
          message: '保存成功!',
          type: 'success'
        });
        _this.init()
      })
    },

    handleDetail({serialNo,sumTransactionMoney,payType}) {
      if(payType == '退款') {
        return
      }
      this.detailList = []
      this.detailCharge = ''
      this.showDetail = true
      let params = {
        busicode: "PayDayListBySerialNo",
        data: {serialNo,sumTransactionMoney,payType}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
       this.detailList = res.payDayListVos
       this.detailCharge = `缴费总金额：上期余额<span style="color: red;">${res.sumPriorPeriodMoney}</span>元，交易金额<span style="color: red;">${res.sumTransactionMoney}</span>元，本期余额<span style="color: red;">${res.sumCurrendPeriodMoney}</span>元，销<span style="color: red;">${res.sumProceedsMoney}</span>元，剩<span style="color: red;">${res.remainAmount}</span>元`
      // 处理数据，从后向前遍历
          for (let i = this.detailList.length - 1; i > 0; i--) {
            // 设置初始值
            if (!this.detailList[i].rowspan) {
              this.detailList[i].rowspan = 0;
              this.detailList[i].sumMoney = this.detailList[i].proceedsMoney + this.detailList[i].penaltyMoney;
            }
            this.detailList[i].proceedsMoney = this.formatFloat(this.detailList[i].proceedsMoney);
            // 当前抄表主键相同时
            if (this.detailList[i].userNo === this.detailList[i - 1].userNo && this.detailList[i].costName !== '预存') {
              // 设置rowspan
              if (this.detailList[i].rowspan === 0){
                this.detailList[i].rowspan = 1;
              }
              this.detailList[i - 1].rowspan = this.detailList[i].rowspan + 1;
              this.detailList[i].rowspan = 0;
              // 合计应缴
              this.detailList[i - 1].sumMoney = this.detailList[i - 1].proceedsMoney + this.detailList[i - 1].penaltyMoney;
              this.detailList[i - 1].sumMoney = Number(this.detailList[i - 1].sumMoney) + Number(this.detailList[i].sumMoney);
              // 保留2位小数
              this.detailList[i - 1].sumMoney = Number(this.detailList[i - 1].sumMoney).toFixed(2);
            } else {
               if (this.detailList[i].rowspan === 0){
                this.detailList[i].rowspan = 1;
                this.detailList[i].sumMoney = this.detailList[i].proceedsMoney + this.detailList[i].penaltyMoney;
              }
            }
            //
          }
          if (this.detailList.length === 1 && this.detailList[0].costName === '预存'){
              this.detailList[0].proceedsMoney = this.formatFloat(this.detailList[0].proceedsMoney);
              this.detailList[0].sumMoney = this.formatFloat(this.detailList[0].proceedsMoney);
          }
        this.$nextTick(()=>{
          this.common.changeTable(this, '.common-dialog',
            ['.common-dialog .toolbar'])
        })
      })
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
          column.property === 'ctmNo' ||
          column.property === 'ctmName' ||
          column.property === 'accountNo' ||
          column.property === 'userNo' ||
          column.property === 'sumMoney' ||
          column.property === 'chargeTime'
      ) {
        if (row.rowspan != 0) {
          return {
            rowspan: row.rowspan || 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },

    //   导出
    exportExcel() {
      let params = {
        busicode: 'PayDayListExport',
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },

    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    closeDialog() { //关闭会话
      this.DailyReceiptInquiryVisible = false;
      this.payWayVisible = false;
      this.init()
    },
    closeBankDialog() { //关闭会话
      this.cashDepositNameVisible = false;
    },
    //弹出框
    submit() {	//提交
      // this.$refs.childDailyReceiptInquiry.submit()
      // this.DailyReceiptInquiryVisible = false;
      let formData =  this.$refs.BankCheck.getFormData();
      let _this = this;
      let params = {
        busicode: "PayDayUpdate",
        data: [{serialNo: this.rowData.serialNo, payMethod: this.rowData.payMethod, incomeBank: this.rowData.incomeBank}]
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$message({
          showClose: true,
          message: '保存成功!',
          type: 'success'
        });
        _this.cashDepositNameVisible = false
        _this.init()
      })
    },
    add() {
      this.DailyReceiptInquiryVisible = true;
    },
    edit() {

    },
    changePay() {
      this.payWayVisible = true;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    showDetail(val) {
      if(!val) {
        this.common.changeTable(this, '.DailyReceiptInquiry',
        ['.DailyReceiptInquiry .toolbar'])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.DailyReceiptInquiry {
  width: 100%;
  height: 100%;
  .payWaySelect {
    .el-input__icon {
      line-height: 20px;
    }
    .el-input__inner {
      margin: 3px 0px;
    }
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .el-form--inline .el-form-item {
    margin-right: 0px;
  }
}
/deep/{
  .el-select {
    .el-input {
      .el-select__caret {
        line-height: 28px;
      }
    }
  }
}
.payWayDialog .el-dialog {
  width: 50%;
  height: 40%;
  margin-top: 20% !important;
}
.sumCharge {
  font-size: 16px;
  line-height: 24px;
}
.el-icon-button {
  float: right;
  margin-right: 70px;
}
</style>

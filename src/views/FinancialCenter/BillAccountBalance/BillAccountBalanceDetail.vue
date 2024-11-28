<template>
  <div class="BillAccountBalanceDetail">
    <div class="toolbar"  v-if="!saleShow && !dynamicShow">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="状态：">
          <el-select v-model="tableQuery.status" placeholder="请选择状态" clearable>
            <el-option label="所有未配对" value="0"></el-option>
            <el-option label="银行未配对" value="10"></el-option>
            <el-option label="营收未配对" value="20"></el-option>
            <el-option label="自动配对" value="1"></el-option>
            <el-option label="手动配对" value="2"></el-option>
            <el-option label="非水费" value="3"></el-option>
            <el-option label="其他水费" value="4"></el-option>
            <el-option label="历史水费" value="5"></el-option>
            <el-option label="银行未达" value="6"></el-option>
            <el-option label="内部往来" value="7"></el-option>
            <el-option label="错误交易" value="8"></el-option>
            <el-option label="POS交易" value="9"></el-option>
            <el-option label="POS交易未达已销" value="11"></el-option>
            <el-option label="银行未达已销" value="12"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="户名：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="请输入户名" clearable></el-input>
        </el-form-item>

        <el-form-item label="金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.amount" placeholder="请输入金额" clearable></el-input>
        </el-form-item>

        <el-form-item label="银行入账时间：">
<!--          <el-date-picker v-model="tableQuery.transactionTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>-->
          <el-date-picker v-model="bankTransactionTime" @change="getBankDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="营收入账日期：">
<!--          <el-date-picker v-model="tableQuery.transactionTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>-->
          <el-date-picker v-model="cssTransactionTime" @change="getCssDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="配对时间：">
<!--          <el-date-picker v-model="tableQuery.transactionTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>-->
          <el-date-picker v-model="pairTransactionTime" @change="getPairDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="营收入帐类型：">
          <el-select v-model="tableQuery.cssInType" placeholder="请选择" clearable>
            <el-option label="银行转帐" value="1"></el-option>
            <el-option label="现金缴存" value="2"></el-option>
            <el-option label="第三方转账" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="银行名称：" class="width-250">
          <el-select v-model="tableQuery.toBankName" placeholder="请选择" clearable>
            <el-option v-for="item in bankData" :key="item.id" :label="item.bankName" :value="item.bankName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-s-data" @click="saleStatistics">销售统计</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-magic-stick" @click="dynamicTable">动态表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-upload" @click="uploadShare">上传共享</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-refresh-right" @click="refreshFlow">刷新流水</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button icon="el-icon-caret-left" size="mini" @click="backIndex">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <span class="accountPeriod" v-if="!saleShow && !dynamicShow">账期：{{ accountPeriod }}</span>
    <div class="kl-table" :style="{height: maxHeight + 'px'}" v-if="!saleShow && !dynamicShow">
      <el-table
        v-if="tableShow"
        :max-height="maxHeight"
        border
        :data="tableData.list"
        class="change-tables-table"
        style="margin-top: 10px"
        show-summary
        :summary-method='getTotal'
        :span-method="arraySpanMethod"
        highlight-current-row
      >
        <el-table-column prop="index" label="序号" width="80" fixed="left" align="center"></el-table-column>

        <el-table-column prop="statusName" min-width="100" label="状态" align="center">
          <template slot-scope="scope">
            <span style="color:#000 !important" v-if="(scope.row.status == 1 || scope.row.status == 2) && scope.row.cssStatus == 2">银行未达已销</span>
            <span style="color:#000 !important" v-else>{{scope.row.statusName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click.native="pairs(scope.$index, scope.row)" v-if="scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 1 && scope.row.status !== 2">配对</el-button>
             <!-- <el-button type="text"  @click.native="cancelPairs(scope.$index, scope.row)" v-if="scope.row.status === 1 || scope.row.status === 2">取消配对</el-button> -->
            <el-popconfirm title="确认取消配对吗？"  v-if="scope.row.status === 1 || scope.row.status === 2" @confirm="cancelPairs(scope.$index, scope.row)" >
              <el-button slot="reference" type="text">取消配对</el-button>
            </el-popconfirm>
           
            <!-- <el-button type="text"  @click.native="changeType(3,scope.row)" v-if="scope.row.status !== 3 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 1 && scope.row.status !== 2">非水费</el-button> -->
            <el-popconfirm title="确认选择非水费吗？"  v-if="scope.row.status !== 3 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 1 && scope.row.status !== 2" @confirm="changeType(3,scope.row)" >
              <el-button slot="reference" type="text">非水费</el-button>
            </el-popconfirm>
            <el-popconfirm title="确认选择其他水费吗？"  v-if="scope.row.status !== 4 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 1 && scope.row.status !== 2" @confirm="changeType(4,scope.row)" >
              <el-button slot="reference" type="text">其他水费</el-button>
            </el-popconfirm>
            
            <!-- <el-button type="text"  @click.native="changeType(4,scope.row)" v-if="scope.row.status !== 4 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 1 && scope.row.status !== 2">其他水费</el-button> -->
            <el-popconfirm title="确认取消收费吗？"  v-if="scope.row.status === 5 && scope.row.cssInType === 1 && scope.row.cssStatus !== 1" @confirm="cancelCharge(scope.$index, scope.row)" >
              <el-button slot="reference" type="text" style="margin-right:10px">取消收费</el-button>
            </el-popconfirm>
            <!-- <el-button type="text"  @click.native="historyRecord(scope.$index, scope.row, 5)" v-if="(scope.row.status === 6 || scope.row.status === 7 || scope.row.status === 8) && scope.row.cssInType === 1  && scope.row.cssStatus !== 1">历史水费</el-button> -->
            <el-popconfirm title="确认选择历史水费吗？"  v-if="(scope.row.status === 6 || scope.row.status === 7 || scope.row.status === 8) && scope.row.cssInType === 1  && scope.row.cssStatus !== 1" @confirm="historyRecord(scope.$index, scope.row, 5)" >
              <el-button slot="reference" type="text">历史水费</el-button>
            </el-popconfirm>

            <!-- <el-button type="text"  @click.native="historyRecord(scope.$index, scope.row, null)" v-if="scope.row.status === 5 && scope.row.cssInType === 1  && scope.row.cssStatus === 1">取消历史水费</el-button> -->
            <el-popconfirm title="确认取消历史水费吗？"  v-if="scope.row.status === 5 && scope.row.cssInType === 1  && scope.row.cssStatus === 1" @confirm="historyRecord(scope.$index, scope.row, null)" >
              <el-button slot="reference" type="text">取消历史水费</el-button> 
            </el-popconfirm>

            <!-- <el-button type="text"  @click.native="historyRecord(scope.$index, scope.row, 6)" v-if="(scope.row.status === 5 || scope.row.status === 7 || scope.row.status === 8) && scope.row.cssStatus !== 1">银行未达</el-button> -->
            <el-popconfirm title="确认选择银行未达吗？"  v-if="(scope.row.status === 5 || scope.row.status === 7 || scope.row.status === 8) && scope.row.cssStatus !== 1" @confirm="historyRecord(scope.$index, scope.row, 6)" >
              <el-button slot="reference" type="text">银行未达</el-button>
            </el-popconfirm>

             <!-- <el-button type="text"  @click.native="historyRecord(scope.$index, scope.row, null)" v-if="scope.row.status === 6 && scope.row.cssStatus === 2">取消银行未达</el-button> -->
            <el-popconfirm title="确认取消银行未达吗？"  v-if="scope.row.status === 6 && scope.row.cssStatus === 2" @confirm="historyRecord(scope.$index, scope.row, null)" >
              <el-button slot="reference" type="text">取消银行未达</el-button> 
            </el-popconfirm>

            <!-- <el-button type="text"  @click.native="historyRecord(scope.$index, scope.row, 7)" v-if="(scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 8) && scope.row.cssStatus !== 1">内部往来</el-button> -->
            <el-popconfirm title="确认选择内部往来吗？"  v-if="(scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 8) && scope.row.cssStatus !== 1" @confirm="historyRecord(scope.$index, scope.row, 7)" >
              <el-button slot="reference" type="text">内部往来</el-button> 
            </el-popconfirm>
            <el-button type="text" @click='clickPop(scope.$index, scope.row)' :ref='`bt`+scope.$index'>备注</el-button>
            <el-popover
              class="otherRemark"
              placement="right"
              width="300"
              trigger="click"
              v-model="scope.row.visible"
              >
              <el-form :inline="true" size="mini" :model="scope.row" class="demo-form-inline">
                <el-form-item label="备注：" class="width-200">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.otherRemark" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
              </el-form>
              <div style="text-align:center">
                <el-button type="primary" size="mini" @click="saveOtherRemark(scope.row)">保 存</el-button>
                <el-button type="info" size="mini" @click="scope.row.visible = false">取 消</el-button>
              </div>
            </el-popover>
            <!-- <el-button type="text" @click.native="historyRecord(scope.$index, scope.row, 8)" v-if="(scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 7) && scope.row.cssStatus !== 1">错误交易</el-button> -->
            <el-popconfirm title="确认选择错误交易吗？"  v-if="(scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 7) && scope.row.cssStatus !== 1" @confirm="historyRecord(scope.$index, scope.row, 8)" >
              <el-button slot="reference" type="text">错误交易</el-button> 
            </el-popconfirm>
            <!-- <el-button type="text" @click.native="changeType(9, scope.row)" v-if="(scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 9)">POS交易</el-button> -->
            <el-popconfirm title="确认选择POS交易吗？"  v-if="(scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 9)" @confirm="changeType(9, scope.row)" >
              <el-button slot="reference" type="text">POS交易</el-button> 
            </el-popconfirm>
            <!-- <el-button type="text" @click.native="changeType(11, scope.row)" v-if="(scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 11)">POS交易未达已销</el-button> -->
            <el-popconfirm title="确认选择POS交易未达已销吗？"  v-if="(scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 7 && scope.row.status !== 8 && scope.row.status !== 11)" @confirm="changeType(11, scope.row)" >
              <el-button slot="reference" type="text">POS交易未达已销</el-button> 
            </el-popconfirm>
          </template>
        </el-table-column>


<!--        <el-table-column prop="accountPeriod" min-width="60" label="账期" align="center"></el-table-column>-->

<!--        <el-table-column prop="isShareName" min-width="100" label="上传状态" align="center"></el-table-column>-->

        <el-table-column  min-width="1100" label="银行流水" align="center">
          <el-table-column prop="toBankName" min-width="250" label="银行名称"></el-table-column>
          <el-table-column prop="toAccountNo" min-width="200" label="账号"></el-table-column>
          <el-table-column prop="dateTime" min-width="200" label="交易时间"></el-table-column>
          <el-table-column prop="amount" min-width="150" label="金额"></el-table-column>
          <el-table-column prop="fromName" min-width="250" label="对方银行户名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" min-width="200" label="备注" show-overflow-tooltip></el-table-column>
        </el-table-column>

        <el-table-column min-width="600" label="营收流水" align="center">
          <el-table-column prop="cssInTypeName" min-width="100" label="入账类型"></el-table-column>
          <el-table-column prop="cssToBankName" min-width="250" label="银行名称"></el-table-column>
          <el-table-column prop="cssCtmno" min-width="250" label="用户名称">
            <template slot-scope="scope"><div v-html="scope.row.cssCtmno"></div></template>
          </el-table-column>
          <el-table-column prop="cssDateTime" min-width="150" label="交易时间"></el-table-column>
          <el-table-column prop="cssAmount" min-width="150" label="金额"></el-table-column>
        </el-table-column>

        <el-table-column prop="updateName" min-width="100" label="配对人" align="center"></el-table-column>
        <el-table-column prop="updateDate" min-width="100" label="配对时间" align="center"></el-table-column>
        <el-table-column prop="otherRemark" min-width="100" label="配对备注" align="center"></el-table-column>
      </el-table>

      <el-dialog :title="pairsName" :destroy-on-close="true" :visible.sync="accountPair" :close-on-click-modal="false" class="common-dialog button-dialog" @close="closeDialog">
        <AccountPair :statusName="statusName" v-if="accountPair" :rowData="rowData" :accountPeriod="accountPeriod" ref="AccountPair" @closeDialog="closeDialog"></AccountPair>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addPairs">确 定</el-button>
          <el-button type="info" size="mini" @click="closeDialog">返 回</el-button>
        </div>
      </el-dialog>

    </div>
    <!-- 分页 -->
    <div class="block" v-if="!saleShow && !dynamicShow">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableQuery.page"
        :page-sizes="[20, 100, 500, 1000]"
        :page-size="tableQuery.pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div>
    <div class="indexContent" v-if="saleShow">
      <SaleStatistics :accountPeriod="accountPeriod" ref="SaleStatistics" @closeDialog="closeDialog" :source="source"></SaleStatistics>
    </div>
    <div class="indexContent" v-if="dynamicShow">
      <DynamicTable :accountPeriod="accountPeriod" ref="DynamicTable" @closeDialog="closeDialog" :source="source" :dynamicData="dynamicData"></DynamicTable>
    </div>
  </div>
</template>

<script>
import AccountPair from "./AccountPair";
import SaleStatistics from "./SaleStatistics";
import DynamicTable from "./DynamicTable";

export default {
  name: "BillAccountBalanceDetail",
  props: ["accountPeriod","detailShow"],
  components: {
    DynamicTable,
    SaleStatistics,
    AccountPair,
  },
  data() {
    return {
      DateChoosevalue: [],
      //审批状态下拉框
      //approvalStatusOptions: this.common.processState(),
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod:'',
        // startTransactionTime:null,
        // endTransactionTime:null,
        startBankTransactionTime: null,
        endBankTransactionTime: null,
        startCssTransactionTime: null,
        endCssTransactionTime: null,
        startPairTransactionTime: null,
        endPairTransactionTime: null,
        cssInType:null,
        toBankName: ''
      },
      bankTransactionTime:'',
      cssTransactionTime:'',
      pairTransactionTime:'',
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      pairsName: "流水配对",
      accountPair: false,
      pairIndex:0,
      saleShow:false,
      dynamicShow:false,
      pairData: {},
      source:"",
      dynamicData:{},
      sum:{},
      // 配对数据
      rowData:[],
      // 状态名称
      statusName: "",
      bankData: [],
      // reference:{},
      // // 控制渲染条件 如果不用v-if会报错 具体可自行尝试
      // showPop: false,
      // // 保存当前激活的refrence id
      // activeId:'',
    };
  },
  mounted() {
    this.getBankData()
    this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    //this.getDatePicker()
    this.common.changeTable(this, ".BillAccountBalanceDetail ", [
      ".BillAccountBalanceDetail .toolbar",
      ".BillAccountBalanceDetail .block",
      ".BillAccountBalanceDetail .accountPeriod"
    ]);
  },
  methods: {
    init() {
      let companyInfo = localStorage.getItem("companyNo");
      this.tableQuery.groupCode = companyInfo;
      this.tableQuery.accountPeriod = this.accountPeriod
      if (this.tableQuery.cssInType === "") {
        this.tableQuery.cssInType = null
      }
      let params = {
        busicode: "BillBalanceAccountDetail",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          res.list.forEach(data=>{
            if (data.amount && (Number(data.amount) || Number(data.amount) === 0)){
              data.amount = this.formatFloat(data.amount);
            }
            if (data.cssAmount && (Number(data.cssAmount) || Number(data.cssAmount) === 0)){
              data.cssAmount = this.formatFloat(data.cssAmount);
            }
            data.visible= false
          })
          // this.sum = res.list.pop();
          // this.tableData = res;
          this.sum = res.list.pop();
          var resList = []
          res.list.forEach((item,index) => {
            if (Array.isArray(item)) {
              item.forEach(child => {
                child.rowspanMark = index
                if (child.updateDate && child.updateDate!='') {
                  child.updateDate = this.getDate(child.updateDate)
                }
                resList.push(child)
              })
            }else{
              item.rowspanMark = index
              if (item.updateDate && item.updateDate!='') {
                  item.updateDate = this.getDate(item.updateDate)
                }
              resList.push(item)
            }
          })
          // console.log(resList);
          res.list = resList
          this.tableData = res;
          for (let i = this.tableData.list.length - 1; i > 0; i--) {
          // 设置初始值 其余信息合并
            if (!this.tableData.list[i].rowspan) {
              this.tableData.list[i].rowspan = 0;
            }
            //银行合并
            if (!this.tableData.list[i].bankRowspan) {
              this.tableData.list[i].bankRowspan = 0;
            }
            //营收合并
            if (!this.tableData.list[i].cssRowspan) {
              this.tableData.list[i].cssRowspan = 0;
            }
            // 当前rowspanMark相同时
            if (this.tableData.list[i].rowspanMark == this.tableData.list[i-1].rowspanMark) {
              // 设置rowspan
              if (this.tableData.list[i].rowspan == 0){
                this.tableData.list[i].rowspan = 1;
              }
              this.tableData.list[i-1].rowspan = this.tableData.list[i].rowspan + 1;
              this.tableData.list[i].rowspan = 0;

              //设置bankRowspan
              if (this.tableData.list[i].id == this.tableData.list[i-1].id) {
                if (this.tableData.list[i].bankRowspan == 0){
                  this.tableData.list[i].bankRowspan = 1;
                }
                this.tableData.list[i-1].bankRowspan = this.tableData.list[i].bankRowspan + 1;
                this.tableData.list[i].bankRowspan = 0;
              }else{
                if (this.tableData.list[i].bankRowspan == 0) {
                  this.tableData.list[i].bankRowspan = 1;
                }
              }

              //设置cssRowspan
              if (this.tableData.list[i].cssid == this.tableData.list[i-1].cssid) {
                if (this.tableData.list[i].cssRowspan == 0){
                  this.tableData.list[i].cssRowspan = 1;
                }
                this.tableData.list[i-1].cssRowspan = this.tableData.list[i].cssRowspan + 1;
                this.tableData.list[i].cssRowspan = 0;
              }else{
                if (this.tableData.list[i].cssRowspan == 0) {
                  this.tableData.list[i].cssRowspan = 1;
                }
              }
            } else {
              if (this.tableData.list[i].rowspan == 0){
                this.tableData.list[i].rowspan = 1;
              }
              if (this.tableData.list[i].bankRowspan == 0) {
                 this.tableData.list[i].bankRowspan = 1;
              }
              if (this.tableData.list[i].cssRowspan == 0) {
                 this.tableData.list[i].cssRowspan = 1;
              }
            }
          }
          //当第一条不是合并数据
          if (!this.tableData.list[0].rowspan) {
            this.tableData.list[0].rowspan = 1
            this.tableData.list[0].bankRowspan = 1;
            this.tableData.list[0].cssRowspan = 1;
          }
          let index = 0
          for (let i = 0; i < this.tableData.list.length; i++) {
            if(this.tableData.list[i].rowspan && this.tableData.list[i].rowspan > 0) {
              this.tableData.list[i].index = (this.tableQuery.page - 1) * this.tableQuery.pageCount + (++index)
            }
          }
          console.log(this.tableData.list);
        });
    },
    getBankData(){
      let params = {
        busicode: "BankDetailQuery",
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.bankData = res
      })
    },
    compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },
    search() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
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
    getBankDatePicker(date){
      if (date !== undefined && date !== null) {
        this.tableQuery.startBankTransactionTime = date[0]
        this.tableQuery.endBankTransactionTime = date[1]
      } else {
        this.tableQuery.startBankTransactionTime = null;
        this.tableQuery.endBankTransactionTime = null;
      }
    },
    getCssDatePicker(date){
      if (date !== undefined && date !== null) {
        this.tableQuery.startCssTransactionTime = date[0]
        this.tableQuery.endCssTransactionTime = date[1]
      } else {
        this.tableQuery.startCssTransactionTime = null;
        this.tableQuery.endCssTransactionTime = null;
      }
    },
    getPairDatePicker(date){
      if (date !== undefined && date !== null) {
        this.tableQuery.startPairTransactionTime = date[0]
        this.tableQuery.endPairTransactionTime = date[1]
      } else {
        this.tableQuery.startPairTransactionTime = null;
        this.tableQuery.endPairTransactionTime = null;
      }
    },
    //更改状态
    changeType(type,row) {
      let status = type;
      let updateData={
        id: row.id,
        accountIds: [],
        cssIds: [],
        updateAccount: sessionStorage.getItem('account'),
        updateName: sessionStorage.getItem('userName'),
        status: status,
      }
      let params = {
        busicode: "BillBalanceAccountUpdate",
        data: updateData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
               "修改成功！",
            type: "success"
          });
          this.init();
        });
      // row.cssDateTime = null;
      // if (type === 4){
      //   row.accountPeriod = this.accountPeriod;
      // }else if (type === 3){
      //   row.cssAccountPeriod = this.accountPeriod;
      // }
      // row.groupCode = localStorage.getItem("companyNo");
      // row.ids = [];
      // let params = {
      //   busicode: "BillBalanceAccountUpdate",
      //   data: row
      // };
      // this.$api
      //   .fetch({
      //     params: params //参数
      //   })
      //   .then(res => {
      //     this.$notify({
      //       title: "成功",
      //       message:
      //         "修改成功！",
      //       type: "success"
      //     });
      //     this.init();
      //   });
    },
    // 返回合计数据
    getTotal(param){
      let vm = this;
      let sums = [];
      //console.log(vm.sum);
     var selectedColm = param.columns;
      let newArray=[]
      selectedColm.forEach(a => {
        if(vm.sum[a.property]||vm.sum[a.property]===0||vm.sum[a.property]==='0'){//与表格列进行匹配
          newArray.push(vm.sum[a.property])
          //console.log(newArray);
        }else{
          if(a.property!==undefined){//序号列不push
            newArray.push('');
            //console.log(newArray);
          }
        }
      });
      newArray.splice(1,0,'');
      sums=newArray;
      sums[0] = '合计'
      // console.log(sums);
      return sums;
    },
    //解析时间戳
    getDate(timestamp){
      //获取当前时间
      var now=new Date();
      //根据指定时间戳转换为时间格式
      var time=new Date();
      time.setTime(timestamp);
      return time.getFullYear()+"-"
                +((time.getMonth()+1)<10?"0"+(time.getMonth()+1):(time.getMonth()+1))+"-"
                +(time.getDate()<10?"0"+time.getDate():time.getDate())
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === "序号" || column.label === "状态" || column.label === "操作" ||
          column.label === "配对人" || column.label === "配对时间" || column.label === "配对备注"
           ) {
        if (row.rowspan != 0) {
          return {
            rowspan: row.rowspan || 1,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
      if(column.property === "toBankName" || column.property === "toAccountNo" || column.property === "dateTime" || column.property === "amount" || column.property === "fromName" || column.property === "remark"){
        if (row.bankRowspan != 0) {
          return {
            rowspan: row.bankRowspan || 1,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
      if(column.property === "cssInTypeName" || column.property === "cssToBankName" || column.property === "cssCtmno" || column.property === "cssDateTime" || column.property === "cssAmount"){
        if (row.cssRowspan != 0) {
          return {
            rowspan: row.cssRowspan || 1,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
    },
    // 配对
    pairs(index, row) {
      this.rowData=[]
      this.tableData.list.forEach(item => {
        if (item.rowspanMark == row.rowspanMark) {
          this.rowData.push(item)
        }
      })
      // this.rowData.push(row)
      console.log(this.rowData);
      this.accountPair = true;
      this.statusName = row.statusName
      // let companyInfo = localStorage.getItem("companyNo");
      // let query = {
      //   groupCode:companyInfo,
      //   cssAccountPeriod:this.accountPeriod,
      //   page:1,
      //   pageCount: 20,
      //   amount:row.amount
      // }
      // let params = {
      //   busicode: "BillBalanceCss",
      //   data: query
      // };
      // this.$api
      //   .fetch({
      //     params: params //参数
      //   })
      //   .then(res => {
      //     this.pairData = res;
      //     this.accountPair = true;
      //     this.pairIndex = row.id;
      //   });

    },
    //确认配对
    addPairs(){
      let accountIds = this.$refs.AccountPair.accountIds
      let cssIds = this.$refs.AccountPair.cssIds
      let updateData={
        accountIds: accountIds,
        cssIds: cssIds,
        updateAccount: sessionStorage.getItem('account'),
        updateName: sessionStorage.getItem('userName'),
        status:2,
      }
      let params = {
        busicode: "BillBalanceAccountUpdate",
        data: updateData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
               "配对成功！",
            type: "success"
          });
          // this.$emit('closeDialog');
          this.closeDialog()
        });
    },
    closeDialog(data) {
      this.accountPair = false;
      this.saleShow = false;
      this.dynamicShow = false;
      this.init();
    },
    backIndex(){
      this.$emit("invisibleBack",false);
    },
    cancelPairs(index,row){
      let accountIds = []
      this.tableData.list.forEach(item => {
        if (item.rowspanMark == row.rowspanMark) {
          accountIds.push(item.id)
        }
      })
      let updateData={
        accountIds: [...new Set(accountIds)]
      }
      let params = {
        busicode: "CancelPairUpdate",
        data: updateData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
              "取消配对成功！",
            type: "success"
          });
          this.init();
        });
    },

    cancelCharge(index,row){
      let params = {
        busicode: "CancelChargeUpdate",
        data: {
          refId:row.refId,
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
              "取消收费成功！",
            type: "success"
          });
          this.init();
        });
    },
    historyRecord(index,row, status){
      let params= {
        busicode: "AddHistoryWaterFree",
        data: {
          status:status,
          cssId:row.cssid,
          accountPeriod:this.accountPeriod,
          cssAmount:row.cssAmount
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
              "修改成功！",
            type: "success"
          });
          this.init();
        });
    },
    // clickPop2(index){
    //   // 这个操作是为了避免与源码中的 doToggle方法冲突
    //   if (this.activeId === index && this.showPop) return
    //   this.showPop = false
    //   this.activeId = index
    //   // 因为reference是需要获取dom的引用 所以需要是$el
    //   // this.reference = this.$refs['bt'+index][0].$el
    //   this.$nextTick(() => {
    //     // 等待显示的popover销毁后再 重新渲染新的popover
    //     this.showPop = true
    //     this.$nextTick(() => {
    //       // 此时才能获取refs引用
    //       this.$refs.pop.doShow()
    //     })
    //   })
    // },
    clickPop(index, row){
      this.tableData.list.forEach(item => {
        item.visible= false
      })
      row.visible = true
    },
    saveOtherRemark(row){
      if (!row.amount || row.amount == "") {
        let params= {
          busicode: "AddHistoryWaterFree",
          data: {
            cssId:row.cssid,
            otherRemark:row.otherRemark
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "保存成功！",
              type: "success"
            });
            this.tableData.list.forEach(item => {
              item.visible= false
            })
            this.init();
          });
      }else{
        let params = {
          busicode: "BillBalanceAccountUpdate",
          data: {
            id:row.id,
            otherRemark:row.otherRemark
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "保存成功！",
              type: "success"
            });
            this.tableData.list.forEach(item => {
              item.visible= false
            })
            this.init();
          });
      }
    },
    saleStatistics(){
      this.saleShow = true;
      //this.detailShow = false;
      this.source = "detail";
      //this.$emit("invisibleBack",false);
    },
    dynamicTable(){
      let request = {};
      request.accountPeriod = this.accountPeriod
      request.groupCode = localStorage.getItem('companyNo');
      // request.page = 1;
      // request.pageCount = 20;
      // request.activeName = 'prestore';
      let params = {
        busicode: "GetPrestoreSummaryService",
        data: request
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          res.forEach(data => {
            if (data.amount){
              data.amount = this.formatFloat(data.amount);
            }
            if (data.cssAmount){
              data.cssAmount = this.formatFloat(data.cssAmount);
            }
          })
          // if ( res && res.prestoreTempDetailVOS) {
          //   res.prestoreTempDetailVOS.forEach(data => {
          //     if (data.inAmount){
          //       data.inAmount = this.formatFloat(data.inAmount);
          //     }
          //     if (data.lastAmount){
          //       data.lastAmount =this.formatFloat(data.lastAmount);
          //     }
          //     if (data.lyProceedsMoney){
          //       data.lyProceedsMoney = this.formatFloat(data.lyProceedsMoney);
          //     }
          //     if (data.outAmount){
          //       data.outAmount=this.formatFloat(data.outAmount);
          //     }
          //   })
          //   this.dynamicData = res;
          // }
          this.dynamicData = res;
          this.dynamicShow = true;
          this.detailShow = false;
          this.source = "detail";
        });
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
    uploadShare(){
      let query = {
        groupCode:localStorage.getItem("companyNo"),
      }
      let params = {
        busicode: "uploadShareService",
        data: query
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
              "上传共享成功！",
            type: "success"
          });
          this.init();
        });
    },
    refreshFlow(){
      let params = {
        busicode: "RefreshPipelineService",
        data:{}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
              "流水刷新成功！",
            type: "success"
          });
          this.init();
        });
    },
    // 导出按钮
    exportExcel() {
      var _this = this;
      var params = {
        busicode: "BillBalanceAccountDetailExport",
        data: JSON.parse(JSON.stringify(this.tableQuery)),
         token: sessionStorage.getItem('token'),
        //token: "krrjdev123",
        sysType: "002"
      };
      // 入参不需要分页
      delete params.data.page;
      delete params.data.pageCount;
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    /*accountDetail:function (newVal,oldVal){
      this.tableQuery.accountPeriod = newVal;
      console.log(newVal);
    }*/
  }
};
</script>
<style lang="scss" scoped>
.BillAccountBalanceDetail {
  width: 100%;
  height: 100%;
  /deep/{
    .otherRemark{
      .el-popover{
        left: 200px;
        top: 0;
      }
    }
  }
}
.accountPeriod{
  padding-left: 20px;
  height: 15px;
  line-height: 15px;
}
</style>

<template>
  <div class="DynamicTable">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

        <el-form-item label="账期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountPeriod" placeholder="请输入账期" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.amount " placeholder="请输入金额" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-refresh-right" @click="refresh">刷新动态表</el-button>
        </el-form-item> -->

        <el-form-item>
          <el-button class="searchBtn" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        </el-form-item> -->

        <el-form-item style="float:right">
          <el-button icon="el-icon-caret-left" size="mini" @click="back">返回</el-button>
        </el-form-item>

      </el-form>
    </div>
    <span class="accountPeriod">账期：{{ this.accountPeriod }}</span>
    <el-tabs v-model="activeName" @tab-click="changeClick" type="card" class="tabs">
      <el-tab-pane label="预存" name="prestore" >
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table
            v-if="tableShow"
            :max-height="maxHeight"
            stripe
            border
            :data="tableData"
            class="change-tables-table"
          >
            <el-table-column type="index" label="序号" width="50" fixed="left" align="center"></el-table-column>

            <!-- <el-table-column prop="toBankName" min-width="70" label="银行名称"></el-table-column>
            <el-table-column prop="toAccountNo" min-width="50" label="银行流水号"></el-table-column>

            <el-table-column prop="fromName" min-width="70" label="对方户名">
              <template slot-scope="scope"><div v-html="scope.row.fromName"></div></template>
            </el-table-column>
            <el-table-column prop="dateTime" min-width="50" label="银行入账日期"></el-table-column>

            <el-table-column prop="cssCTMNO" min-width="50" label="客户名称">
              <template slot-scope="scope"><div v-html="scope.row.cssCTMNO"></div></template>
            </el-table-column>
            <el-table-column prop="cssDateTime" min-width="50" label="营收入账日期"></el-table-column>
            <el-table-column prop="inAmount" min-width="50" label="进"></el-table-column>
            <el-table-column prop="outAmount" min-width="50" label="销"></el-table-column>
            <el-table-column prop="lastAmount" min-width="50" label="余额"></el-table-column> -->

            <el-table-column prop="remark"  min-width="200" label="摘要">
            </el-table-column>
            <el-table-column prop="amount" min-width="200" label="总金额">
              <template slot-scope="scope">
                <template v-if="scope.row.remark != '微信手续费'">
                  <span v-if="scope.row.amount != ''" style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.amount}}</span>
                  <span v-else style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.cssAmount}}</span>
                </template>
                <template v-else>
                  <span v-if="scope.row.amount != ''" style="color: #000;">{{scope.row.amount}}</span>
                  <span v-else style="color: #000;">{{scope.row.cssAmount}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-tab-pane>
      <el-tab-pane label="暂存" name="temp">
        <div class="kl-table">
          <el-table
            v-if="tableShow"
            :max-height="maxHeight"
            stripe
            border
            :data="tableData"
            class="change-tables-table"
          >
            <el-table-column type="index" label="序号" width="50" fixed="left" align="center"></el-table-column>


            <!-- <el-table-column prop="toBankName" min-width="70" label="银行名称"></el-table-column>
            <el-table-column prop="toAccountNo" min-width="50" label="银行流水号"></el-table-column>

            <el-table-column prop="fromName" min-width="70" label="对方户名">
              <template slot-scope="scope"><div v-html="scope.row.fromName"></div></template>
            </el-table-column>
            <el-table-column prop="dateTime" min-width="50" label="银行入账日期"></el-table-column>

            <el-table-column prop="cssCTMNO" min-width="50" label="客户名称">
              <template slot-scope="scope"><div v-html="scope.row.cssCTMNO"></div></template>
            </el-table-column>
            <el-table-column prop="cssDateTime" min-width="50" label="营收入账日期"></el-table-column>
            <el-table-column prop="inAmount" min-width="50" label="进"></el-table-column>
            <el-table-column prop="outAmount" min-width="50" label="销"></el-table-column>
            <el-table-column prop="lastAmount" min-width="50" label="余额"></el-table-column> -->
            <el-table-column prop="toBankName" min-width="200" label="摘要"></el-table-column>
            <el-table-column prop="inAmount" min-width="200" label="进">
              <template slot-scope="scope">
                <span v-if="scope.row.inAmount != '0.0'" style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.inAmount}}</span>
                <span v-else style="color: #000;">{{scope.row.inAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="outAmount" min-width="200" label="销">
              <template slot-scope="scope">
                <span v-if="scope.row.outAmount != '0.0'" style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.outAmount}}</span>
                <span v-else style="color: #000;">{{scope.row.outAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastAmount" min-width="200" label="余额"></el-table-column>
          </el-table>

        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 分页 -->
    <!-- <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableQuery.page"
        :page-sizes="[20, 100, 500, 1000]"
        :page-size="tableQuery.pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div> -->

    <el-dialog title="统计详情" :visible.sync="showDetail" class="common-dialog">
      <div class="dialog-detail" style="height: 100%;">
        <div class="toolbar">
          <el-button type="primary" size="mini" icon="el-icon-upload2" @click="detailExportExcel">导出</el-button>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <template v-if="activeName == 'prestore'">
            <el-table
              v-if="tableShow"
              :max-height="maxHeight"
              border
              :data="prestoreDetailTableData.list"
              class="change-tables-table"
              show-summary
              :summary-method='getTotal'
              :span-method="arraySpanMethod"
              highlight-current-row
            >
              <el-table-column prop="index" label="序号" width="80" fixed="left" align="center"></el-table-column>

              <el-table-column prop="statusName" min-width="120" label="状态" align="center">
                <template slot-scope="scope">
                  <span style="color:#000 !important" v-if="(scope.row.status == 1 || scope.row.status == 2) && scope.row.cssStatus == 2">银行未达已销</span>
                  <span style="color:#000 !important" v-else>{{scope.row.statusName}}</span>
                </template>
              </el-table-column>
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
                <el-table-column prop="cssDateTime" min-width="200" label="交易时间"></el-table-column>
                <el-table-column prop="cssAmount" min-width="150" label="金额"></el-table-column>
              </el-table-column>

              <el-table-column prop="updateName" min-width="100" label="配对人" align="center"></el-table-column>
              <el-table-column prop="updateDate" min-width="120" label="配对时间" align="center"></el-table-column>
              <el-table-column prop="otherRemark" min-width="100" label="配对备注" align="center"></el-table-column>
            </el-table>
          </template>
          <template v-else>
            <el-table
              v-if="tableShow"
              :max-height="maxHeight"
              border
              :data="prestoreDetailTableData.list"
              class="change-tables-table"
              :span-method="arraySpanMethod"
              highlight-current-row
            >
              <el-table-column prop="index" label="序号" width="80" fixed="left" align="center"></el-table-column>

              <el-table-column prop="statusName" min-width="120" label="状态" align="center">
                <template slot-scope="scope">
                  <span style="color:#000 !important" v-if="(scope.row.status == 1 || scope.row.status == 2) && scope.row.cssStatus == 2">银行未达已销</span>
                  <span style="color:#000 !important" v-else>{{scope.row.statusName}}</span>
                </template>
              </el-table-column>
              <el-table-column  min-width="1100" label="银行流水" align="center">
                <el-table-column prop="toBankName" min-width="250" label="银行名称"></el-table-column>
                <el-table-column prop="toAccountNo" min-width="200" label="账号"></el-table-column>
                <el-table-column prop="dateTime" min-width="200" label="交易时间"></el-table-column>
                <el-table-column prop="amount" min-width="150" label="金额"></el-table-column>
                <el-table-column prop="fromName" min-width="250" label="对方银行户名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" min-width="200" label="备注" show-overflow-tooltip></el-table-column>
              </el-table-column>

              <!-- <el-table-column min-width="600" label="营收流水" align="center">
                <el-table-column prop="cssInTypeName" min-width="100" label="入账类型"></el-table-column>
                <el-table-column prop="cssToBankName" min-width="250" label="银行名称"></el-table-column>
                <el-table-column prop="cssCtmno" min-width="250" label="用户名称">
                  <template slot-scope="scope"><div v-html="scope.row.cssCtmno"></div></template>
                </el-table-column>
                <el-table-column prop="cssDateTime" min-width="200" label="交易时间"></el-table-column>
                <el-table-column prop="cssAmount" min-width="150" label="金额"></el-table-column>
              </el-table-column> -->

              <el-table-column prop="updateName" min-width="100" label="配对人" align="center"></el-table-column>
              <el-table-column prop="updateDate" min-width="120" label="配对时间" align="center"></el-table-column>
              <el-table-column prop="otherRemark" min-width="100" label="配对备注" align="center"></el-table-column>
            </el-table>
          </template>

        </div>   
        <div class="block" v-if="activeName == 'prestore'">
          <el-pagination @size-change="prestoreDetailHandleSizeChange" @current-change="prestoreDetailHandleCurrentChange" :current-page="prestoreDetailTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="prestoreDetailTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="prestoreDetailTableData.total"></el-pagination>
        </div>
        <div class="block" v-else>
          <el-pagination @size-change="tempDetailHandleSizeChange" @current-change="tempDetailHandleCurrentChange" :current-page="tempDetailTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tempDetailTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="prestoreDetailTableData.total"></el-pagination>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from "element-ui";
export default {
  name: "DynamicTable",
  props: ["accountPeriod","source","dynamicData"],
  data() {
    return {
      tableQuery: {
        // page: 1,
        // pageCount: 20,
        accountPeriod:'',
        // amount: '',
        groupCode: localStorage.getItem('companyNo')
      },
      tableShow: false,
      maxHeight: 0,
      tableData: this.dynamicData,
      accountPair: false,
      activeName:'prestore',
      showDetail: false,
      prestoreDetailTableQuery: {
        page: 1,
        pageCount: 20,
        status: "",
        accountPeriod: "",
        groupCode: localStorage.getItem('companyNo')
      },
      tempDetailTableQuery: {
        page: 1,
        pageCount: 20,
        statusInt: [],
        accountPeriod: "",
        groupCode: localStorage.getItem('companyNo')
      },
      prestoreDetailTableData: {}, //预存表格数据
      tempDetailTableData: {}, //预存表格数据
      row: {}, //记录当前行
      sum: {}, //预存合计
    };
  },
  mounted() {
    this.tableQuery.accountPeriod = this.accountPeriod
    // this.tableQuery.activeName = this.activeName
    // this.initPage();
    //this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    //this.getDatePicker()
    this.common.changeTable(this, ".DynamicTable ", [
      ".DynamicTable .toolbar",
      ".DynamicTable .accountPeriod",
      ".DynamicTable .block",
      ".DynamicTable .el-tabs__header"
    ]);
    this.maxHeight = this.maxHeight - 60
  },
  methods: {
    init() {
      // this.tableQuery.groupCode = localStorage.getItem('companyNo');
      if (!this.tableQuery.accountPeriod){
        this.tableQuery.accountPeriod = this.accountPeriod
      }
      // this.tableQuery.activeName = this.activeName;
      let params = {
        busicode: this.activeName == "prestore" ? "GetPrestoreSummaryService" : "GetTempSummaryService",
        data: this.tableQuery
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
            if (data.inAmount){
              data.inAmount = this.formatFloat(data.inAmount);
            }
            if (data.outAmount){
              data.outAmount = this.formatFloat(data.outAmount);
            }
            if (data.cssAmount){
              data.cssAmount = this.formatFloat(data.cssAmount);
            }
            if (data.lastAmount) {
              data.lastAmount = this.formatFloat(data.lastAmount);
            }
          })
          this.tableData = res;
          // res.prestoreTempDetailVOS.forEach(data=>{
          //   if (data.inAmount){
          //     data.inAmount = this.formatFloat(data.inAmount);
          //   }
          //   if (data.lastAmount){
          //     data.lastAmount =this.formatFloat(data.lastAmount);
          //   }
          //   if (data.lyProceedsMoney){
          //     data.lyProceedsMoney = this.formatFloat(data.lyProceedsMoney);
          //   }
          //   if (data.outAmount){
          //     data.outAmount=this.formatFloat(data.outAmount);
          //   }
          // })
          // this.tableData = res;
          // this.tableData.total = res.prestoreTempDetailVOS.length;
          // this.tableData.lastAmount = res.prestoreTempDetailVOS[res.prestoreTempDetailVOS.length-1].lastAmount;
          // this.tableData.prestoreTempDetailVOS = res.prestoreTempDetailVOS.splice((this.tableQuery.page-1)*this.tableQuery.pageCount,this.tableQuery.pageCount);

          this.accountPeriod = this.tableQuery.accountPeriod
          //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          // this.common.changeTable(this, ".DynamicTable ", [
          //   ".DynamicTable .toolbar" 
          // ]);
        });
    },

    search() {
      //查询
      let number = Number(this.tableQuery.accountPeriod);
      if (this.tableQuery.accountPeriod && isNaN(number)){
        this.$message.error('账期格式错误，请输入正确的账期');
        return;
      }
      // this.tableQuery.page = 1;
      // this.tableQuery.pageCount = 20;
      this.init();
    },
    refresh(){
      let params = {
        busicode: "RefreshPrestoreTemp",
        data: {
          groupCode:localStorage.getItem('companyNo'),
          accountPeriod:this.accountPeriod
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.init()
        })
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
     //分页
    prestoreDetailHandleSizeChange(val) {
      //显示多少数据一页
      this.prestoreDetailTableQuery.pageCount = val;
      this.prestoreDetailTableQuery.page = 1;
      this.handleDetail(this.row);
    },
    prestoreDetailHandleCurrentChange(val) {
      //显示多少页码
      this.prestoreDetailTableQuery.page = val;
      this.handleDetail(this.row);
    },
    //分页
    tempDetailHandleSizeChange(val) {
      //显示多少数据一页
      this.tempDetailTableQuery.pageCount = val;
      this.tempDetailTableQuery.page = 1;
      this.handleDetail(this.row);
    },
    tempDetailHandleCurrentChange(val) {
      //显示多少页码
      this.tempDetailTableQuery.page = val;
      this.handleDetail(this.row);
    },
    initPage(){
      // this.tableData.total = this.tableData.prestoreTempDetailVOS.length;
      // this.tableData.lastAmount = this.tableData.prestoreTempDetailVOS[this.tableData.prestoreTempDetailVOS.length-1].lastAmount;
      // this.tableData.prestoreTempDetailVOS= this.tableData.prestoreTempDetailVOS.slice(0,20);

    },
    handleDetail(row) {
      this.row = row
      if (this.activeName == "prestore") {
        this.prestoreDetailTableQuery.accountPeriod = this.tableQuery.accountPeriod
        this.prestoreDetailTableQuery.status = row.status
      }else{
        this.tempDetailTableQuery.accountPeriod = this.tableQuery.accountPeriod
        if (row.toBankName == "往月预存销") {
          this.tempDetailTableQuery.statusInt = [1,2,3]
        }else if(row.toBankName == "往月预存非水费销"){
          this.tempDetailTableQuery.statusInt = [4]
        }else if(row.toBankName == "本月进暂存款"){
          this.tempDetailTableQuery.statusInt = []
        }
      }
      this.showDetail = true
      this.$nextTick(() => {
        this.common.changeTable(this, '.dialog-detail', [
          '.dialog-detail .toolbar',
          '.dialog-detail .block'
        ])
      })
      var loading = Loading.service({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
        target: document.querySelector('.common-dialog')
      });
      let params = {
        busicode: this.activeName == "prestore" ? "BillBalanceAccountDetail" : "GetTempDetailService",
        data: this.activeName == "prestore" ? this.prestoreDetailTableQuery : this.tempDetailTableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        // if (this.activeName == "prestore") {
          setTimeout(() => {
            loading.close();
          }, 350);
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
          if (this.activeName == "prestore") {
            this.sum = res.list.pop();
          }else{
            this.sum = {}
          }
          
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
          this.prestoreDetailTableData = res;
          for (let i = this.prestoreDetailTableData.list.length - 1; i > 0; i--) {
          // 设置初始值 其余信息合并
            if (!this.prestoreDetailTableData.list[i].rowspan) {
              this.prestoreDetailTableData.list[i].rowspan = 0;
            }
            //银行合并
            if (!this.prestoreDetailTableData.list[i].bankRowspan) {
              this.prestoreDetailTableData.list[i].bankRowspan = 0;
            }
            //营收合并
            if (!this.prestoreDetailTableData.list[i].cssRowspan) {
              this.prestoreDetailTableData.list[i].cssRowspan = 0;
            }
            // 当前rowspanMark相同时
            if (this.prestoreDetailTableData.list[i].rowspanMark == this.prestoreDetailTableData.list[i-1].rowspanMark) {
              // 设置rowspan
              if (this.prestoreDetailTableData.list[i].rowspan == 0){
                this.prestoreDetailTableData.list[i].rowspan = 1;
              }
              this.prestoreDetailTableData.list[i-1].rowspan = this.prestoreDetailTableData.list[i].rowspan + 1;
              this.prestoreDetailTableData.list[i].rowspan = 0;

              //设置bankRowspan
              if (this.prestoreDetailTableData.list[i].id == this.prestoreDetailTableData.list[i-1].id) {
                if (this.prestoreDetailTableData.list[i].bankRowspan == 0){
                  this.prestoreDetailTableData.list[i].bankRowspan = 1;
                }
                this.prestoreDetailTableData.list[i-1].bankRowspan = this.prestoreDetailTableData.list[i].bankRowspan + 1;
                this.prestoreDetailTableData.list[i].bankRowspan = 0;
              }else{
                if (this.prestoreDetailTableData.list[i].bankRowspan == 0) {
                  this.prestoreDetailTableData.list[i].bankRowspan = 1;
                }
              }

              //设置cssRowspan
              if (this.prestoreDetailTableData.list[i].cssid == this.prestoreDetailTableData.list[i-1].cssid) {
                if (this.prestoreDetailTableData.list[i].cssRowspan == 0){
                  this.prestoreDetailTableData.list[i].cssRowspan = 1;
                }
                this.prestoreDetailTableData.list[i-1].cssRowspan = this.prestoreDetailTableData.list[i].cssRowspan + 1;
                this.prestoreDetailTableData.list[i].cssRowspan = 0;
              }else{
                if (this.prestoreDetailTableData.list[i].cssRowspan == 0) {
                  this.prestoreDetailTableData.list[i].cssRowspan = 1;
                }
              }
            } else {
              if (this.prestoreDetailTableData.list[i].rowspan == 0){
                this.prestoreDetailTableData.list[i].rowspan = 1;
              }
              if (this.prestoreDetailTableData.list[i].bankRowspan == 0) {
                 this.prestoreDetailTableData.list[i].bankRowspan = 1;
              }
              if (this.prestoreDetailTableData.list[i].cssRowspan == 0) {
                 this.prestoreDetailTableData.list[i].cssRowspan = 1;
              }
            }
          }
          //当第一条不是合并数据
          if (!this.prestoreDetailTableData.list[0].rowspan) {
            this.prestoreDetailTableData.list[0].rowspan = 1
            this.prestoreDetailTableData.list[0].bankRowspan = 1;
            this.prestoreDetailTableData.list[0].cssRowspan = 1;
          }
          let index = 0
          for (let i = 0; i < this.prestoreDetailTableData.list.length; i++) {
            if(this.prestoreDetailTableData.list[i].rowspan && this.prestoreDetailTableData.list[i].rowspan > 0) {
              if (this.activeName == "prestore") {
                this.prestoreDetailTableData.list[i].index = (this.prestoreDetailTableQuery.page - 1) * this.prestoreDetailTableQuery.pageCount + (++index)
              }else{
                this.prestoreDetailTableData.list[i].index = (this.tempDetailTableQuery.page - 1) * this.tempDetailTableQuery.pageCount + (++index)
              }
            }
          }
        // }else{
        //   tempDetailTableData
        // }
        
      })
      .catch(err =>{
        loading.close();
      })
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
        }else{
          if(a.property!==undefined){//序号列不push
            newArray.push('');
          }
        }
      });
      // newArray.splice(1,0,'');
      sums=newArray;
      sums[0] = '合计'
      // console.log(sums);
      return sums;
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
    back(){
      if (this.source === "index"){
        this.$emit("invisibleBack",false);
      }else if (this.source === "detail"){
        this.$emit("closeDialog",false);
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '小计';
          return;
        }
        if (index === 1 || index ===2 || index === 3 || index === 4 || index === 5 || index === 6){
          return ;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' ';
        } else {
          sums[index] = '';
        }
      });
      if (this.activeName === 'prestore'){
        sums[7]= this.tableData.prestoreInTotal;
        sums[8]= this.tableData.prestoreOutTotal;
      }else if (this.activeName === 'temp'){
        sums[7]= this.tableData.tempInTotal;
        sums[8]= this.tableData.tempOutTotal;
      }
      sums[9]= this.tableData.lastAmount;
      return sums;
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
    changeClick(tab){
      this.activeName = tab.paneName;
      this.tableData = []
      this.init();
    },
    // 导出按钮
    exportExcel() {
      var _this = this;
      console.log(this.tableQuery);
      var params = {
        busicode: "GetBasePrestoreTempExport",
        data: JSON.parse(JSON.stringify(this.tableQuery)),
         token: sessionStorage.getItem('token'),
        //token: "krrjdev123",
        sysType: "002"
      };
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    // 详情导出
    detailExportExcel(){
      var params = {
        busicode: this.activeName == "prestore" ? "BillBalanceAccountDetailExport" : "GetTempDetailExport",  
        data: this.activeName == "prestore" ? JSON.parse(JSON.stringify(this.prestoreDetailTableQuery)) : JSON.parse(JSON.stringify(this.tempDetailTableQuery)),
        token: sessionStorage.getItem('token'),
        //token: "krrjdev123",
        sysType: "002"
      };
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
    showDetail(val) {
      if(!val) {
        this.common.changeTable(this, ".DynamicTable ", [
          ".DynamicTable .toolbar",
          ".DynamicTable .accountPeriod",
          ".DynamicTable .block",
          ".DynamicTable .el-tabs__header"
        ]);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.DynamicTable {
  width: 100%;
  height: 100%;
  .accountPeriod {
    display: inline-block;
    margin-left: 20px;
    margin-bottom: 10px;
  }
}
/deep/ .el-tabs__header{
  margin-left: 20px;
}
</style>

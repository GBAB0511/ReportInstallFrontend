<template>
  <!-- 代收支付关闭 模块 -->
  <div class="BillAccountBalance">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>

    <div v-if="!detailShow && !saleShow && !dynamicShow"  class="indexContent">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>

          <el-form-item label="账期：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountPeriod" placeholder="请输入账期" @keydown.enter.native="search" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          highlight-current-row
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" align="center"></el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期" align="center"></el-table-column>

          <el-table-column prop="isShareName" min-width="100" label="上传状态" align="center"></el-table-column>

          <el-table-column label="操作" width="170" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text"  @click.native="saleStatistics(scope.$index, scope.row)">销售统计</el-button>
              <el-button type="text"  @click.native="dynamicTable(scope.$index, scope.row)">动态表</el-button>
            </template>
          </el-table-column>

          <el-table-column  min-width="400" label="预存款" align="center">
            <el-table-column prop="prePrestore" min-width="100" label="期初"></el-table-column>
            <el-table-column prop="inPrestore" min-width="100" label="进"></el-table-column>
            <el-table-column prop="outPrestore" min-width="100" label="销"></el-table-column>
            <el-table-column prop="lastPrestore" min-width="100" label="余额"></el-table-column>
          </el-table-column>

          <el-table-column min-width="400" label="暂存款" align="center">
            <el-table-column prop="preTemp" min-width="100" label="期初"></el-table-column>
            <el-table-column prop="inTemp" min-width="100" label="进"></el-table-column>
            <el-table-column prop="outTemp" min-width="100" label="销"></el-table-column>
            <el-table-column prop="lastTemp" min-width="100" label="余额"></el-table-column>
          </el-table-column>

          <el-table-column min-width="400" label="主营业务收入" align="center">
            <el-table-column prop="waterFee" min-width="100" label="水费"></el-table-column>
            <el-table-column prop="intelWaterMeter" min-width="100" label="智能表改造"></el-table-column>
            <el-table-column prop="taxFreeWater" min-width="100" label="不征税自来水"></el-table-column>
            <el-table-column prop="doublePress" min-width="100" label="二次加压"></el-table-column>
          </el-table-column>

          <el-table-column prop="sewageDisposal" min-width="100" label="污水处理" align="center"></el-table-column>

          <el-table-column prop="garbageFee" min-width="100" label="垃圾费" align="center"></el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
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
    </div>
    <div class="indexContent" v-if="detailShow">
      <BillAccountBalanceDetail ref="BillAccountBalanceDetail" :accountPeriod="accountPeriod" :detailShow="detailShow" @invisibleBack="invisibleBack"></BillAccountBalanceDetail>
    </div>

    <div class="indexContent" v-if="saleShow">
      <SaleStatistics :accountPeriod="accountPeriod" @invisibleBack="invisibleBack" ref="SaleStatistics" :source="source"></SaleStatistics>
    </div>
    <div class="indexContent" v-if="dynamicShow">
      <DynamicTable :accountPeriod="accountPeriod" ref="DynamicTable" @invisibleBack="invisibleBack" :source="source" :dynamicData="dynamicData"></DynamicTable>
    </div>
  </div>
</template>
<script>

import BillAccountBalanceDetail from "./BillAccountBalanceDetail";
import SaleStatistics from "./SaleStatistics";
import DynamicTable from "./DynamicTable";
export default {
  name: "BillAccountBalance",
  components: {
    BillAccountBalanceDetail,
    SaleStatistics,
    DynamicTable
  },
  data() {
    return {
      buttomShow: true,
      DateChoosevalue: [],
      indexShow: true,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "银行流水对账" }
        ]
      },
      //审批状态下拉框
      //approvalStatusOptions: this.common.processState(),
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod:'',
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      detailShow:false,
      saleShow:false,
      source:"",
      dynamicShow:false,
      accountPeriod:'',
      dynamicData:{},
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    //this.getDatePicker()
    this.common.changeTable(this, ".BillAccountBalance ", [
      ".BillAccountBalance .toolbar",
      ".BillAccountBalance .block",
      '.BillAccountBalance .bread-contain'
    ]);
  },
  methods: {
    init() {
      let companyInfo = localStorage.getItem("companyNo");
      this.tableQuery.groupCode = companyInfo;
      let params = {
        busicode: "FnBankBalanceList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          res.list.forEach(data=>{
            data.doublePress = this.formatFloat(data.doublePress);
            data.garbageFee = this.formatFloat(data.garbageFee);
            data.inPrestore = this.formatFloat(data.inPrestore);
            data.inTemp = this.formatFloat(data.inTemp);
            data.intelWaterMeter = this.formatFloat(data.intelWaterMeter);
            data.lastPrestore = this.formatFloat(data.lastPrestore);
            data.lastTemp = this.formatFloat(data.lastTemp);
            data.outPrestore = this.formatFloat(data.outPrestore);
            data.outTemp = this.formatFloat(data.outTemp);
            data.prePrestore = this.formatFloat(data.prePrestore);
            data.preTemp = this.formatFloat(data.preTemp);
            data.sewageDisposal = this.formatFloat(data.sewageDisposal);
            data.taxFreeWater = this.formatFloat(data.taxFreeWater);
            data.waterFee = this.formatFloat(data.waterFee);
          })
          this.tableData = res;
          this.tableData.list = res.list.splice((this.tableQuery.page-1)*this.tableQuery.pageCount,this.tableQuery.pageCount);
          //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          // this.common.changeTable(this, ".ClosingCollectionPayment ", [
          //   ".ClosingCollectionPayment .toolbar",
          //   ".ClosingCollectionPayment .block",
          //   '.ClosingCollectionPayment .bread-contain'
          // ]);
        });
    },
    closeDialog() {
      //关闭会话
      this.detailShow = false;
      this.saleShow = false;
      /* this.backfillVisible = false;
       this.BillManagementCon = true;*/
      this.init();
    },
    search() {
      //查询
      let number = Number(this.tableQuery.accountPeriod);
      if (this.tableQuery.accountPeriod && isNaN(number)){
        this.$message.error('账期格式错误，请输入正确的账期');
        return;
      }
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
    //详情
    details(index, row) {
      this.detailShow = true;
      this.accountPeriod = row.accountPeriod;
    },
    // 销售统计
    saleStatistics(index, row) {
      this.saleShow = true;
      this.source = "index";
      this.accountPeriod = row.accountPeriod;
    },
    // 动态表
    dynamicTable(index,row){
      let request = {};
      request.accountPeriod = row.accountPeriod
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
          // if ( res && res.prestoreTempDetailVOS){
          //   res.prestoreTempDetailVOS.forEach(data=>{
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
          this.source = "index";
          this.accountPeriod = row.accountPeriod;
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
    invisibleBack(data){
      console.log(data);
      this.detailShow = data;
      this.saleShow = data;
      this.dynamicShow = data;
    }
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
.BillAccountBalance {
  width: 100%;
  height: 100%;
}
</style>

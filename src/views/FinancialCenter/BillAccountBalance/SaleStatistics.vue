<template>
  <div class="SaleStatistics">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="账期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountPeriod" placeholder="请输入账期" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" icon="el-icon-refresh-left" @click="reCalculate">重新计算</el-button>
        </el-form-item>

        <el-form-item style="float:right">
          <el-button icon="el-icon-caret-left" size="mini" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table
        v-if="tableShow"
        :max-height="maxHeight+1"
        border
        show-summary
        :summary-method="getSummaries"
        :data="tableData.list"
        class="change-tables-table"
        :cell-style="cellStyle"
        highlight-current-row
        ref="myTable"
      >
        <el-table-column prop="id" label="序号" min-width="50" fixed="left" align="center"></el-table-column>

        <el-table-column prop="costName" min-width="60" label="项目" align="center"></el-table-column>

        <el-table-column  min-width="100" label="上月" align="center">
          <!-- <el-table-column prop="cAcctName" min-width="30" label="是否核销" align="right"></el-table-column> -->
          <el-table-column prop="lstProceedsMoney" min-width="50" label="上月收入" align="right"></el-table-column>
          <el-table-column prop="lstYearTotal" min-width="50" label="上月年累" align="right"></el-table-column>

        </el-table-column>

        <el-table-column min-width="100" label="本月" align="center">
          <el-table-column prop="proceedsMoney" min-width="50" label="本月收入" align="right"></el-table-column>
          <el-table-column prop="yearTotal" min-width="50" label="本月年累" align="right"></el-table-column>
        </el-table-column>

        <el-table-column min-width="50" label="上年同期" align="center">
          <el-table-column prop="lyProceedsMoney" min-width="30" label="月收入" align="right"></el-table-column>
          <el-table-column prop="lyYearTotal" min-width="30" label="年累收入" align="right"></el-table-column>
        </el-table-column>
      </el-table>

    </div>
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
  </div>
</template>

<script>

export default {
  name: "SaleStatistics",
  props: ["accountPeriod","source"],
  data() {
    return {
      tableQuery: {
        accountPeriod:'',
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      accountPair: false,
      firstIndex :0,
      secondIndex :0
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    //this.getDatePicker()
    this.common.changeTable(this, ".SaleStatistics ", [
      ".SaleStatistics .toolbar",
      ".SaleStatistics .block"
    ]);
  },
  beforeUpdate(){
    // this.$nextTick(() => {
    //   this.$refs.myTable.doLayout();
    // })
  },
  methods: {
    init() {
      if (!this.tableQuery.accountPeriod){
        this.tableQuery.accountPeriod = this.accountPeriod
      }
      let params = {
        busicode: "SaleStasticsList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          res.list.forEach(salesData =>{
            salesData.proceedsMoney = this.formatFloat(salesData.proceedsMoney);
            salesData.yearTotal = this.formatFloat(salesData.yearTotal);
            salesData.lstProceedsMoney = this.formatFloat(salesData.lstProceedsMoney);
            salesData.lstYearTotal = this.formatFloat(salesData.lstYearTotal);
            salesData.lyProceedsMoney = this.formatFloat(salesData.lyProceedsMoney);
            salesData.lyYearTotal = this.formatFloat(salesData.lyYearTotal);
            // if (salesData.isPre == '') {
            //   salesData.cAcctName = salesData.lstProceedsMoney
            // }
            if (salesData.isPre != '') {
              salesData.lstProceedsMoney = '-'
              salesData.lstYearTotal = '-'
              salesData.yearTotal = '-'
              salesData.lyProceedsMoney = '-'
              salesData.lyYearTotal = '-'
            }
          })
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].isPre === 2) {
              this.firstIndex = i
              break;
            }
          }
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].isPre === 1) {
              this.secondIndex = i
              break;
            }
          }
          let firstSubtotal = JSON.parse(JSON.stringify(res.list[0]))
          let secondSubtotal = JSON.parse(JSON.stringify(res.list[this.firstIndex]))
          let thirdSubtotal = JSON.parse(JSON.stringify(res.list[this.secondIndex]))
          firstSubtotal.id = '小计'
          firstSubtotal.costName = ''
          firstSubtotal.lstProceedsMoney = ''
          firstSubtotal.lstYearTotal = ''
          firstSubtotal.proceedsMoney = ''
          firstSubtotal.yearTotal = ''
          firstSubtotal.lyProceedsMoney = ''
          firstSubtotal.lyYearTotal = ''
          secondSubtotal.id = '小计'
          secondSubtotal.costName = ''
          secondSubtotal.proceedsMoney = ''
          thirdSubtotal.id = '小计'
          thirdSubtotal.costName = ''
          thirdSubtotal.proceedsMoney = ''
          var lstProceedsMoney,lstYearTotal,proceedsMoney,yearTotal,lyProceedsMoney,lyYearTotal
          console.log(this.firstIndex +'  '+this.secondIndex);
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].isPre === '') {
              if (i!==0) {
                firstSubtotal.lstProceedsMoney = this.formatFloat(Number(firstSubtotal.lstProceedsMoney)+Number(res.list[i].lstProceedsMoney))
                firstSubtotal.lstYearTotal = this.formatFloat(Number(firstSubtotal.lstYearTotal)+Number(res.list[i].lstYearTotal))
                firstSubtotal.proceedsMoney = this.formatFloat(Number(firstSubtotal.proceedsMoney)+Number(res.list[i].proceedsMoney))
                firstSubtotal.yearTotal = this.formatFloat(Number(firstSubtotal.yearTotal)+Number(res.list[i].yearTotal))
                firstSubtotal.lyProceedsMoney = this.formatFloat(Number(firstSubtotal.lyProceedsMoney)+Number(res.list[i].lyProceedsMoney))
                firstSubtotal.lyYearTotal = this.formatFloat(Number(firstSubtotal.lyYearTotal)+Number(res.list[i].lyYearTotal))
              }
            }else if(res.list[i].isPre === 2){
              if (i>this.firstIndex) {
                secondSubtotal.proceedsMoney = this.formatFloat(Number(secondSubtotal.proceedsMoney)+Number(res.list[i].proceedsMoney))
              }
            }
            else if(res.list[i].isPre === 1){
              if (i>this.secondIndex) {
                thirdSubtotal.proceedsMoney = this.formatFloat(Number(thirdSubtotal.proceedsMoney)+Number(res.list[i].proceedsMoney))
              }
            }
          }
          res.list.splice(this.firstIndex, 0, firstSubtotal);
          res.list.splice(this.secondIndex+1, 0, secondSubtotal);
          res.list.splice(res.list.length, 0, thirdSubtotal);
          this.$set(this,"tableData",res)
          // this.tableData = res;
          //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          // this.common.changeTable(this, ".SaleStatistics ", [
          //   ".SaleStatistics .toolbar"
          // ]);
          // for (let i = this.tableData.list.length - 1; i > 0; i--) {
          //   if (this.tableData.list[i].isPre === 1) {
          //     // 设置初始值 其余信息合并
          //     if (!this.tableData.list[i].rowspan) {
          //       this.tableData.list[i].rowspan = 0;
          //     }
          //     // 当前rowspanMark相同时
          //     if (this.tableData.list[i].costName == this.tableData.list[i-1].costName) {
          //       // 设置rowspan
          //       if (this.tableData.list[i].rowspan == 0){
          //         this.tableData.list[i].rowspan = 1;
          //       }
          //       this.tableData.list[i-1].rowspan = this.tableData.list[i].rowspan + 1;
          //       this.tableData.list[i].rowspan = 0;

          //     } else {
          //       if (this.tableData.list[i].rowspan == 0){
          //         this.tableData.list[i].rowspan = 1;
          //       }
          //     }
          //   }
          //   if (this.tableData.list[i].isPre == '') {
          //     if (!this.tableData.list[i].colspan) {
          //       this.tableData.list[i].colspan = 0;
          //     }
          //     if (this.tableData.list[i].colspan == 0){
          //       this.tableData.list[i].colspan = 2;
          //     }
          //   }
          // }
          // //当第一条不是合并数据
          // if (!this.tableData.list[0].rowspan) {
          //   this.tableData.list[0].rowspan = 1
          // }
          // //当第一条不是合并数据
          // if (!this.tableData.list[0].colspan) {
          //   this.tableData.list[0].colspan = 2
          // }
          console.log(this.tableData.list);
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
    reCalculate(){
      let params = {
        busicode: "SaleStatisticsRecal",
        data: {
          groupCode:localStorage.getItem("companyNo"),
          accountPeriod:this.tableQuery.accountPeriod
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if (res === "success"){
            this.init();
          }
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
    back(){
      if (this.source === "index"){
        this.$emit("invisibleBack",false);
      }else if (this.source === "detail"){
        this.$emit("closeDialog",false);
      }
    },
    closeDialog(data) {
      if (data){
        this.accountPair = data;
      }else {
        this.accountPair = false;
      }
      this.init();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1 ){
          return ;
        }
        const values = data.map((item,index) =>{
          if (index===this.firstIndex || index===(this.secondIndex+1) || index===(this.tableData.list.length-1)){
            return Number(item[column.property]);
          }
          // return Number(item[column.property]);
        });
        console.log(values);
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
      let res = [];
      sums.forEach((sum,index) =>{
        if (Number(sum) || Number(sum) === 0){
          res[index]= this.formatFloat(sum);
        }else {
          res[index]= sum;
        }
      })
      return res;
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
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.firstIndex || rowIndex === (this.secondIndex+1)|| rowIndex === this.tableData.list.length-1) {
          return 'background-color:#ecf5ff;height:48px';
      } else {
          return ''
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === "序号" || column.label === "项目"
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
      if (rowIndex <= this.firstIndex || rowIndex == this.tableData.list.length-1) {
        if (columnIndex === 2) {
          return [1, 2];
        }else if (columnIndex === 3){
          return [0, 0];
        }
      }
    }
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
<style lang="scss" scoped>
.SaleStatistics {
  width: 100%;
  height: 100%;
  /deep/{
    .kl-table .el-table__body-wrapper {
      height: auto;
      .el-table__body{
        width: 100%!important;
        height: 100%!important;
      }
    }
    .kl-table .el-table__footer{
      width: 100%!important;
      height: 100%!important;
    }
  }
}
</style>

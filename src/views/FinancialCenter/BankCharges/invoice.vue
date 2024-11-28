


<template>
  <div class="invoice">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <!-- <el-form-item label="发票类型：">
          <el-select v-model="tableQuery.invoiceType" placeholder="请选择">
            <el-option
              v-for="item in dictionaryData.BBT"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="模糊查询：" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" class="searchInput" placeholder="用户编号/用户名称/银行账号/手机号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table">
      
        <!-- v-if="tableShow"
        :max-height="maxHeight" -->
      <el-table
        stripe
        border
        :data="tableData.list"
        class="change-tables-table"
        highlight-current-row
      >
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

        <el-table-column prop="userNo" min-width="100" label="用户编号"></el-table-column>

        <el-table-column prop="ctmName" min-width="140" label="客户名称"></el-table-column>

        <el-table-column prop="bankName" min-width="100" label="开户行"></el-table-column>

        <el-table-column prop="bankAccountName" min-width="80" label="开户名称"></el-table-column>

        <el-table-column prop="bankAccount" min-width="100" label="银行账号"></el-table-column>

        <el-table-column prop="invoiceType" min-width="100" label="票据类型"></el-table-column>
        
        <el-table-column prop="invoiceCode" min-width="80" label="发票代码"></el-table-column>

        <el-table-column prop="invoiceNo" min-width="80" label="发票号码"></el-table-column>

        <el-table-column prop="costName" min-width="120" label="费用名称"></el-table-column>

        <el-table-column prop="calculateWater" min-width="80" label="计费水量" align="right"></el-table-column>

        <el-table-column prop="synthesizePrice" min-width="80" label="综合单价" align="right"></el-table-column>

        <el-table-column prop="penaltyMoney" min-width="150" label="违约金" align="right"></el-table-column>

        <el-table-column prop="amountMoney" min-width="100" label="合计金额" align="right"></el-table-column>

        <el-table-column prop="chargeTime" min-width="100" label="收费日期"></el-table-column>

        <el-table-column prop="chargeStaffName" min-width="200" label="收费员"></el-table-column>
      </el-table>
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
  </div>
</template>
<script>
export default {
  name: "invoice",
  props: ["idCuster"],
  data() {
    return {
      tableQuery: {
        page: 1,
        pageCount: 50,
        invoiceType: "", //发票类型，数据字典BBT,
        id: "", //"银行代扣id",
        fuzzyQuery: "" //"模糊查询"
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dictionaryData:[],
      tableShow: false,
      maxHeight: 0,
      tableData: [],
    };
  },
  mounted() {
    this.init();
    //数据字典接口
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".invoice .kl-table", [
      ".invoice .toolbar",
      ".invoice .block"
    ]);
  },
  methods: {
    init() {
      this.tableQuery.id = this.idCuster
      let params = {
        busicode: "FnBillQueryList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },
    // 数据字典数据获取
    getDictionary() {
      var params = {
        busicode: "DictionarySelect",
        data: "BBT"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.dictionaryData = res;
        });
    },

    demand() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    //   导出
    exportExcel() {},
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
.invoice {
  width: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
}
</style>

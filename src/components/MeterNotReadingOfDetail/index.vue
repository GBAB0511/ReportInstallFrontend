<template>
  <!-- 未抄明细 -->
  <div class="MeterNotReadingOfDetail">
    <div class="main-container">
      <div class="toolbar">
        <el-form :inline="true" size="mini" class="demo-form-inline clearfix">
          <el-form-item class="right-btn">
            <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{ height: maxHeight + 'px' }">
        <el-table
          highlight-current-row
          v-if="tableShow"
          @sort-change="sortChange"
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          class="MeterReadingOfCopyDetail-table"
        >
          <el-table-column
            type="index"
            label="NO."
            width="50"
            fixed="left"
            :index="indexMethod"
          >
          </el-table-column>

          <el-table-column
            prop="accountPeriod"
            min-width="120"
            label="账期"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="bookNo"
            min-width="110"
            label="册本"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="userNo"
            min-width="100"
            label="用户编号"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="ctmName"
            min-width="100"
            label="客户名称"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="ctmAddr"
            min-width="120"
            label="客户地址"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="useWaterType"
            min-width="100"
            label="用水类型"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="businessArea"
            min-width="100"
            label="营业区域"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="meterType"
            min-width="80"
            label="分表分类"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="meterModel"
            min-width="80"
            label="水表型号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="meterBore"
            min-width="80"
            label="水表口径"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="factoryNo"
            min-width="80"
            label="表身码"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="meterReadingStaffName"
            min-width="80"
            label="抄表员"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column prop="currendPeriodNum" min-width="100" label="最后抄码" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="meterReadingDate" min-width="100" label="抄表时间" show-overflow-tooltip>
            </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
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
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MeterNotReadingOfDetail",
  props: ["queryParams"],
  data() {
    return {
      // 列表数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: this.queryParams.accountPeriod,
        businessArea: this.queryParams.businessArea,
        meterReadingStaffAccount: this.queryParams.meterReadingStaffAccount,
        bookNos: this.queryParams.bookNos,
        useWaterType: this.queryParams.useWaterType,
        meterBore: "",
        meterType: "",
        meterModel: "",
        fuzzyQuery: "" //（用户编号、客户名称）
      },
      useWaterTypeOptions: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "抄表水量报表" }, { title: "未抄明细表" }]
      },
      tableShow: false,
      maxHeight: 0
    };
  },
  mounted() {
    this.init();

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".MeterNotReadingOfDetail .main-container", [
      ".MeterNotReadingOfDetail .toolbar",
      ".MeterNotReadingOfDetail .block"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let params = {
        busicode: "NotReadDetailReport",
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
    sortChange(column) {
      console.log(column);
      this.tableQuery.sortField = column.prop;
      if (column.order === "ascending") {
        this.tableQuery.sortOrder = 1;
      } else if (column.order === "descending") {
        this.tableQuery.sortOrder = 2;
      } else {
        this.tableQuery.sortOrder = "";
        this.tableQuery.sortField = "";
      }
      this.init();
    },

    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },

    //树结构数据处理
    getArr1(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children;
        } else {
          this.getArr1(data[i].children);
        }
      }
      return data;
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
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
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    //   导出
    exportExcel() {
      let params = {
        busicode: 'NotReadDetailReportExport',
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.MeterNotReadingOfDetail {
  width: 100%;
  height: 100%;
  .input-200 {
    .el-input {
      width: 86% !important;
      .el-input--mini {
        display: inline-block;
      }
    }
  }
  .main-container {
    padding-top: 20px;
    height: calc(100% - 42px);
  }
  .right-btn{
    float: right;
  }
  .toolbar{
    padding: 5px;
  }
}
</style>

<template>
  <div class="MeterReadingOfNewUserSummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button
          @click="exportExcel"
          size="mini"
          icon="el-icon-upload2"
          type="primary"
          >导出</el-button
        >
      </div>
    </div>

    <div class="toolbar">
      <el-form
        :inline="true"
        size="mini"
        :model="tableQuery"
        class="demo-form-inline"
      >
        <el-form-item label="账期：">
          <el-date-picker
            v-model="tableQuery.accountPeriod"
            format="yyyy-MM"
            value-format="yyyyMM"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="营业区域：" prop="businessArea" class="width-150">
          <!--el-select v-model="tableQuery.businessAbode" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in businessAbodeData" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select-->
          <el-cascader
            ref="cascader"
            clearable
            v-model="tableQuery.businessArea"
            :options="businessAreaOptions"
            :show-all-levels="false"
            :props="props"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="开户日期：">
          <el-date-picker
            v-model="Time"
            @change="getDatePicker"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            :clearable="true"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            class="searchBtn"
            @click="search"
            icon="el-icon-search"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table">
      <el-table
        v-if="tableShow"
        :max-height="maxHeight"
        show-summary
        :summary-method="getTotal"
        highlight-current-row
        border
        :data="tableData"
        class="change-tables-table"
      >
        <!-- <el-table-column type="selection" width="50" fixed="left">
        </el-table-column> -->

        <!-- <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column> -->

        <!--el-table-column prop="businessAbode" min-width="100" label="营业所" show-overflow-tooltip>
        </el-table-column-->

        <el-table-column
          prop="businessArea"
          min-width="100"
          label="营业区域"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          :key="item.label"
          v-for="(item, index) in labelList"
          :label="item.label"
          align="center"
        >
          <el-table-column label="户数" min-width="60" align="right">
            <template slot-scope="scope">
              <div class="text-color">
                {{ scope.row.detailList[index].userNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="60" label="单数" align="right">
            <template slot-scope="scope">
              <div class="text-color">
                {{ scope.row.detailList[index].billNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100" label="水量" show-overflow-tooltip align="right">
            <template slot-scope="scope">
              <div class="text-color">
                {{ scope.row.detailList[index].water }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- <el-table-column prop="accountPeriod" label="非居民">
          <el-table-column prop="userNum2" min-width="60" label="户数">
          </el-table-column>
          <el-table-column prop="billNum2" min-width="60" label="单数">
          </el-table-column>
          <el-table-column prop="water2" min-width="100" label="水量" show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="accountPeriod" label="区域">
          <el-table-column prop="userNum3" min-width="60" label="户数">
          </el-table-column>
          <el-table-column prop="billNum3" min-width="60" label="单数">
          </el-table-column>
          <el-table-column prop="water3" min-width="100" label="水量" show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="accountPeriod" label="特种">
          <el-table-column prop="userNum4" min-width="60" label="户数">
          </el-table-column>
          <el-table-column prop="billNum4" min-width="60" label="单数">
          </el-table-column>
          <el-table-column prop="water4" min-width="100" label="水量" show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="accountPeriod" label="原水">
          <el-table-column prop="userNum5" min-width="60" label="户数">
          </el-table-column>
          <el-table-column prop="billNum5" min-width="60" label="单数">
          </el-table-column>
          <el-table-column prop="water5" min-width="100" label="水量" show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="accountPeriod" label="合计">
          <el-table-column prop="userNum6" min-width="60" label="户数">
          </el-table-column>
          <el-table-column prop="billNum6" min-width="60" label="单数">
          </el-table-column>
          <el-table-column prop="water6" min-width="100" label="水量" show-overflow-tooltip>
          </el-table-column>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <!-- <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "MeterReadingOfNewUserSummary",
  components: {},
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      crumbsData: {
        //面包屑
        titleList: [{ title: "抄表水量报表" }, { title: "新户抄表汇总" }],
      },
      businessAreaOptions: [],
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        accountPeriod: "", // 账期
        businessArea: "", // 营业区域
        beginOpenDate: "", // 开始时间
        endOpenDate: "", // 结束时间
      },
      // 查询条件日期
      Time: [],
      // 列表数据
      tableData: [],
      // 合计数据
      spanArr: [],
      pos: "",
      labelList: [],//动态表头
      totalData: [],//合计数组

      // 营业所下拉数据
      businessAbodeData: [],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // this.init()
    // 侧边栏
    eventBus.$emit("asideMenuShow", "reportMenuShow3");
    let time = new Date();
    let month =
      time.getMonth() + 1 > 9
        ? time.getMonth() + 1
        : "0" + (time.getMonth() + 1);
    let day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
    this.tableQuery.accountPeriod = `${time.getFullYear()}${month}`;
    this.tableQuery.beginOpenDate = `${time.getFullYear()}-${
      Number(month) - 1 > 9 ? Number(month) - 1 : "0" + (Number(month) - 1)
    }-${day}`;
    this.tableQuery.endOpenDate = `${time.getFullYear()}-${month}-${day}`;
    this.Time = [this.tableQuery.beginOpenDate, this.tableQuery.endOpenDate];

    // this.init()
    //this.getBusinessAbodeData()
    this.selecBusinessAreaOptions();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfNewUserSummary", [
      ".MeterReadingOfNewUserSummary .toolbar",
      ".MeterReadingOfNewUserSummary .block",
    ]);
  },
  methods: {
    // 初始化
    init() {
      let _this = this;
      this.tableQuery.businessArea = this.common.handleTreeData(
        this.tableQuery.businessArea
      );
      let params = {
        busicode: "MrNewUserStatistics",
        data: _this.tableQuery,
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.tableData = res.list;
          this.totalData = res.total;
          this.labelList = res.title //动态表头
          // this.getSpanArr(this.tableData);
          // this.getTotal(this.totalData)
        });
    },
    convertToArray(nodes){
    var array = null;
    try{
        array = Array.prototype.slice.call(nodes,0);
    }catch(ex){
        array = [];
        for(var i = 0,len =nodes.length; i < len; i++){
            array[i] = nodes[i];
        }
    }
    return array;
},
    //营业区域
    selecBusinessAreaOptions() {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          let data = this.getArr1(res);
          _this.businessAreaOptions = res.children;
        });
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map((i) => {
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
    // 返回合计数据
    getTotal(total) {
      let arr = ["合计"];
     if(this.totalData.length !==0){  //必须进行判空，不然界面处于卡死
      var totallist = this.totalData[0].detailList;
           totallist.forEach(element => { 
      for (const key in element) {
        console.log(key)
        if (element[key] != '合计') {
          arr.push(element[key])
        }
      }
      });
     }
      return arr;
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginOpenDate = date[0];
        this.tableQuery.endOpenDate = date[1];
      } else {
        this.tableQuery.beginOpenDate = "";
        this.tableQuery.endOpenDate = "";
      }
    },
    // 导出
    exportExcel() {
      let params = {
        busicode: "MrNewUserStatisticsExport",
        data: this.tableQuery,
        token: sessionStorage.getItem("token"),
        sysType: "002",
      };
      window.open(
        this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURI(JSON.stringify(params))
      );
    },
    // 营业区域下拉框
    getBusinessAbodeData() {
      let _this = this;
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.businessAbodeData = res;
        });
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },

    //     getSpanArr(data)方法 data就是我们从后台拿到的数据，通常是一个数组；spanArr是一个空的数组，用于存放每一行记录的合并数；pos是spanArr的索引。

    // 如果是第一条记录（索引为０），向数组中加入１，并设置索引位置；如果不是第一条记录，则判断它与前一条记录是否相等，如果相等，则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１，

    // 以此往复，得到所有行的合并数，０即表示该行不显示
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].businessArea === data[i - 1].businessArea) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
        console.log(this.spanArr);
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == "营业所") {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col,
        };
      }
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
      return (1 - 1) * 20 + (index + 1);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
};
</script>
<style lang="scss">
.MeterReadingOfNewUserSummary {
  width: calc(100% - 20px);
  height: calc(100% - 0px);
  .el-form-item__content .el-date-editor--month {
    width: auto !important;
  }
  .text-color {
    color: #606266;
  }
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
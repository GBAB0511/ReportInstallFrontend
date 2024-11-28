<template>
  <div class="DailyReconciliation">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="DailyReEditVisible">
        <!--el-button v-if="buttonShow" type="primary" size="mini" @click="reconciliationSubmit">确认对账</el-button-->
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div v-if="DailyReEditVisible" class="indexContent">
      <DailyReconciliationEdit ref="DailyReconciliationEdit"  :dailyReconciliationEditNeedData="dailyReconciliationEditNeedData"> </DailyReconciliationEdit>
    </div>

    <div v-else class="indexContent">

      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <!-- <el-form-item label="收费日期：">
            <el-date-picker v-model="tableQuery.chargeDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
        
          <el-form-item label="收费日期：">
            <el-date-picker v-model="searchDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="对账状态：">
            <el-select ref="select1" clearable v-model="tableQuery.checkStatus" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="未对账" value="0"></el-option>
              <el-option label="已对账" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" show-summary 
          :summary-method='getTotal' class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="chargeDate" min-width="100" label="收费日期">
          </el-table-column>

          <el-table-column prop="chargeMoney" min-width="100" label="收费总金额" align="right">
          </el-table-column>

          <template v-for='(col) in dictionaryData.DCAF'>
           <el-table-column
             show-overflow-tooltip
             :prop="col.value"
             :label="col.name"
             :key="col.value"
             v-if="col.name.length>0"
             min-width="100">
           </el-table-column>
          </template>

          <!-- <el-table-column prop="others" min-width="80" label="其它">
          </el-table-column> -->

        <el-table-column prop="yesterdayNotDeposite" min-width="80" label="上日未缴" align="right">
        </el-table-column>

        <el-table-column prop="todayDeposite" min-width="80" label="本日缴存" align="right">
        </el-table-column>

        <el-table-column prop="todayNotDeposite" min-width="80" label="本日未缴" align="right">
        </el-table-column>
        
        <el-table-column el-table-column prop="payNum" min-width="80" label="收费笔数" align="right">
        </el-table-column>

          <el-table-column prop="checkStatus" min-width="80" label="对账状态">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>

      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>

    </div>
  </div>
</template>
<script>
import DailyReconciliationEdit from "./DailyReconciliationEdit";
export default {
  name: "DailyReconciliation",
  components: {
    DailyReconciliationEdit
  },
  data() {
    return {
      dictionaryData:[],//数据字典
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "收款对账" },
          { title: "日收款对账" }
        ]
      },
      // 查询条件对象
      tableQuery: {
        page:1,
        pageCount:20,
        // 收费日期
        chargeDate: '',
        // 对账状态
        checkStatus: '',
        beginDate: "", //收费日期
        endDate: "", //收费日期
      },
      // 合计数据
      totalData: {},
      // 列表数据
      tableData: [],
      // 详情页面所需数据
      dailyReconciliationEditNeedData: {},
      // 确认对账按钮的显示与隐藏
      buttonShow: true,
       // 查询条件日期
      searchDate: [],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      DailyReEditVisible: false, //综合查询的显示和隐藏
      ruleFormData: {},
      PrintPayer: "",
      CombinedStrike: ""
    };
  },
  mounted() {
    let temTime = new Date()
    let time = new Date(temTime.getTime() - (7 * 24 * 60 * 60 * 1000)) 
    // time.setMonth(time.getMonth() - 1)
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    let time2 = new Date()
    let month2 = (time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1)
    let day2 = time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate()
    this.tableQuery.beginDate = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.endDate = `${time2.getFullYear()}-${month2}-${day2}`
    this.searchDate = [this.tableQuery.beginDate, this.tableQuery.endDate]
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
   this.getDayCostsAndTypes()
    this.common.changeTable(this, ".DailyReconciliation", [
      ".DailyReconciliation .toolbar",
      ".DailyReconciliation .block",
      ".DailyReconciliation #crumbs"
    ]);
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
      // 获取列表动态字段
    getDayCostsAndTypes() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "DCAF"
        //水表类型、用水对象、水表用途、抄表方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "FnDayCheckAccountList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail;
        _this.totalData = res.total;
      })
    },

    // 返回合计数据
    getTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=['合计']
      selectedColm.forEach(a => {
          if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.totalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      sums=newArray;
      // sums[1] = ''
      return sums;
    },

    // 查询按钮
    search() {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    // 确认对账按钮（调用子页面方法）
    reconciliationSubmit(){
      this.$refs.DailyReconciliationEdit.submit()
    },
    
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },

    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      /*/获取表格序号
      return (
        (1 - 1) * 20 + (index + 1)
      );*/
       //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() {
      //关闭会话
      // this.crumbsData.titleList.splice(3, 1);

      this.DailyReEditVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childDailyReconciliation.submit();
      // this.DailyReconciliation = false;
    },
    details(row) {
      this.DailyReEditVisible = true;
      this.dailyReconciliationEditNeedData.chargeDate = row.chargeDate
      if (row.checkStatus == '已对账') {
        this.buttonShow = false
      }else {
        this.buttonShow = true
      }
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
.DailyReconciliation {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin-right: 0px;
  }
}
</style>

<template>
  <div class="TollInquiry">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" icon="el-icon-upload2"   @click.native="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
        <el-form-item label="缴费日期：">
          <el-date-picker v-model="DateChoosevalue" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="缴费方式：">
          <el-select ref="select1" clearable v-model="tableQuery.payMethod" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收费类型：">
          <el-select ref="select2" clearable v-model="tableQuery.payType" placeholder="全部">
            <el-option v-for="item in dictionaryData.DAILY_CHT" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="缴费渠道：">
          <el-select ref="select3" clearable v-model="tableQuery.payChannel" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模糊查询：" class>
          <el-tooltip class="item" effect="dark" content="客户编号、账户编号、用户编号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="收费员：">
          <el-select ref="select4" clearable v-model="tableQuery.chargingStaff" placeholder="全部">
            <el-option v-for="item in chargingStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="payTime" min-width="120" label="收费时间" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="payChannel" min-width="80" label="收费渠道">
        </el-table-column>

        <el-table-column prop="payMethodName" min-width="80" label="收费方式">
        </el-table-column>

        <el-table-column prop="payTypeName" min-width="80" label="收费类型">
        </el-table-column>

        <el-table-column prop="serialNo" min-width="150" label="批次号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.serialNo}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sumTransactionMoney" min-width="85" label="交易金额" align="right">
        </el-table-column>

        <el-table-column prop="chargingStaffName" min-width="100" label="收费员">
        </el-table-column>

        <el-table-column prop="comments" min-width="80" label="备注">
        </el-table-column>
      </el-table>

    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination v-if="pageNoneShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          ></el-pagination>
      </div>
      <el-dialog title="缴费详情" :visible.sync="showDetail" class="common-dialog">
        <p class="sumCharge" v-html="detailCharge"></p>
        <el-table stripe border :data="detailList" :span-method="arraySpanMethod" class="change-tables-table">
          <el-table-column prop="ctmNo" min-width="100" label="客户编号"></el-table-column>
          <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accountNo" min-width="100" label="账户编号"></el-table-column>
          <el-table-column prop="userNo" min-width="100" label="用户编号"></el-table-column>
          <el-table-column prop="accountPeriod" min-width="80" label="账单年月"></el-table-column>
          <el-table-column prop="costName" min-width="80" label="收费类型"></el-table-column>
          <el-table-column prop="proceedsMoney" min-width="80" label="金额" align="right"></el-table-column>
          <el-table-column prop="penaltyMoney" min-width="80" label="违约金" align="right"></el-table-column>
          <el-table-column prop="invoiceNo" min-width="80" label="发票编号"></el-table-column>
          <el-table-column prop="sumMoney" min-width="80" label="合计金额" align="right"></el-table-column>
          <el-table-column prop="chargeTime" min-width="120" label="销账时间"></el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name: "TollInquiry",
  components: {},
  data() {
    return {
      pageNoneShow: true,//查询时修改为false，查询完再该回去，不然会导致页码功能异常
      tableData: {},
      totalData:{},
      crumbsData: {
        //面包屑
        titleList: [{ title: "收费管理" }, { title: "收费查询" }]
      },
      //数据字典存值
      dictionaryData: {},
      chargingStaffList: [],
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: this.common.date(-6 * 24 * 60 * 60 * 1000),//开始日期
        endDate: this.common.date(),//结束日期
        payMethod: "",//缴费方式
        fuzzyQuery: "", //模糊查询
        chargingStaff: '',
        payType: '',
        payChannel: ''
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [this.common.date(-6 * 24 * 60 * 60 * 1000), this.common.date()],
      tableShow: false,
      maxHeight: 0,
      showDetail: false,
      detailList: [],
      detailCharge: ''
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'businessMenuShow4')
    this.init();
    this.getDictionary()
    this.getchargStaff();
    this.common.changeTable(this, ".TollInquiry", [
      ".TollInquiry .toolbar",
      ".TollInquiry .block",
      ".TollInquiry .bread-contain"
    ]);
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.select4.blur()
         }
    },
    init() {
      this.pageNoneShow = false
      let _this = this
      let params = {
        busicode: "FnChangeList",
        data: _this.tableQuery,
      }

      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res.detail;
        this.totalData = res.total;
        this.pageNoneShow = true
      })
        .catch((this.tableData = {}));
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '','']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
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
    // 数据字典
    getDictionary() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "DAILY_CHT,BPI,BPC"//收费类型、缴费方式
      };
      this.$api.fetch({
        params: dictionaryDataParams
      }).then(res => {
        res.DAILY_CHT = [...[{ name: "全部", value: "" }], ...res.DAILY_CHT]
        res.BPI = [...[{ name: "全部", value: "" }], ...res.BPI]
        res.BPC = [...[{ name: "全部", value: "" }], ...res.BPC]
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
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
        res = [...[{ userName: "全部", userAccount: "" }], ...res]
        _this.chargingStaffList = res
      })
    },

    search() {
      //查询
      this.tableQuery.page = 1
      //this.tableQuery.pageCount = 20
      this.init();
    },
    // 导出按钮
    exportExcel() {
      var _this = this
      var data = JSON.parse(JSON.stringify(_this.tableQuery))
      data.page=1;
      data.pageCount=999999;
      var params = {
        busicode: "FnChangeExport",
        data: data,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      // 入参不需要分页
      delete params.data.page
      delete params.data.pageCount
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
      // window.open('http://localhost:8088/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    handleDetail({serialNo,sumTransactionMoney, payType}) {
      if(payType == '2') {
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
       this.detailCharge = `缴费总金额：上期余额<span style="color: red;">${res.sumPriorPeriodMoney}</span>元，交易金额<span style="color: red;">${res.sumTransactionMoney}</span>元，销<span style="color: red;">${res.sumProceedsMoney}</span>元，剩<span style="color: red;">${res.remainAmount}</span>元`
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
          this.detailList[0].sumMoney = this.detailList[0].proceedsMoney;
        }
      })
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
      return this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
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
.TollInquiry {
  width: 100%;
  height: 100%;
  .sumCharge {
    font-size: 16px;
    line-height: 24px;
    margin:1%
  }
  .el-table__body .el-table__row.hover-row td{
    background-color: silver;
  }
}
</style>

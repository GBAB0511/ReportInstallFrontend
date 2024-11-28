<template>
  <!--选择用户用此页面-->
  <div class="chooseUserList">
    <!-- 弹出表单费用信息 -->
    <el-dialog :title="payInfoName" :close-on-click-modal="false" v-if="payInfoVisible" append-to-body :visible.sync="payInfoVisible" class="button-dialog" @close="closeDialog1">
      <WaterUseOverTheYears ref="payInfoEditor" :WaterUseOverTheYearsData="WaterUseOverTheYearsData"></WaterUseOverTheYears>
    </el-dialog>
    <div class="toolbar">
      <!-- <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="欠费笔数 >=">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="tableQuery.arrearageNum" placeholder="欠费笔数" @keydown.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="欠费金额 >=">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="tableQuery.arrearage" placeholder="欠费金额" @keydown.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="用户编号：" class="width450">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="tableQuery.userNo" placeholder="用户编号" @keydown.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="抄表员：">
          <el-select ref="select1" v-model="tableQuery.meterReadingStaff" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form> -->

      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
        <el-form-item label="截至账期：">
          <el-date-picker v-model="tableQuery.endAccountPeriod" type="month" format="yyyy-MM" value-format="yyyyMM" :picker-options="pickerOptions" @change="getDatePicker"></el-date-picker>
        </el-form-item>
        <el-form-item label="营业区域：">
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" @change="changeBusinessArea" :show-all-levels="false" :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="用户编号：" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" clearable size="mini" @keydown.enter.native="demand"></el-input>
        </el-form-item>
        <el-form-item label="册本号：" class="searchInput">
          <el-select v-model="tableQuery.bookNos" multiple placeholder="请选择" filterable class="shouldWater" clearable>
            <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
            <el-option-group v-for="group in bookNos" :key="group.index" :label="group.areaStaffName">
              <el-option v-for="item in group.baseBookListVOList" :key="item.index" :label="item.bookNo" :value="item.bookNo">
                <span style="float: left">{{ item.bookNo }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="模糊查询：" class="searchInput">
          <el-tooltip class="item" effect="dark" content="客户编号、客户名称、客户地址" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="demand"></el-input>
          </el-tooltip>
        </el-form-item>

             <el-form-item label="显示费种">
            <el-select v-model="tableQuery.costNos"  placeholder="请选择" multiple class="shouldWater" clearable filterable>
              <span slot="prefix" v-if="showCostNames!=''">{{showCostNames}}</span>
              <el-option 
                v-for="item in costNoList"
               :key="item.costNo"
                :label="item.costName"
                :value="item.costNo"
                :title="item.costName"
                >
              </el-option>
            </el-select>
          </el-form-item>


        <!-- <div v-show="isActive" class="advancedQuery"> -->
        <el-form-item label="抄表日期：">
          <el-date-picker v-model="meterDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDatePicker1"></el-date-picker>
        </el-form-item>
        <el-form-item label="抄表员：">
          <el-select v-model="tableQuery.meterReadingStaff" placeholder="请选择" @change="changeMeterReadingStaff" class="shouldWater" clearable>
            <el-option-group v-for="group in meterReaderList" :key="group.businessAreaName" :label="group.businessAreaName">
              <el-option v-for="item in group.userInfos" :key="item.userAccount" :label="item.userName" :value="item.userName">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="账户编号：" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountNo" clearable size="mini" @keydown.enter.native="demand"></el-input>
        </el-form-item>
        <el-form-item label="用水类型：" class="waterType">
          <el-cascader ref="cascader-a" v-model="tableQuery.useWaterType" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props">
          </el-cascader>
        </el-form-item>

        <el-form-item label="大于笔数：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountPeriodNum" placeholder="大于笔数" @keydown.enter.native="demand"></el-input>
        </el-form-item>
        <el-form-item label="大于水量：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.totalWater" placeholder="大于水量" @keydown.enter.native="demand"></el-input>
        </el-form-item>

        <el-form-item label="大于金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.totalMoney" placeholder="大于金额" @keydown.enter.native="demand"></el-input>
        </el-form-item>

        <el-form-item class="button-group">
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>

        <!-- </div> -->
        <!-- <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div> -->
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <!-- <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border center :data="tableData.list" @selection-change="getSelectData" class="change-tables-table">

        <el-table-column type="selection" :selectable="selectTable" width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="序号" width="50" :index="indexMethod" fixed="left">
        </el-table-column>

        <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left">
        </el-table-column>

        <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员"></el-table-column>

        <el-table-column prop="userName" min-width="230" label="客户名称" fixed="left">
        </el-table-column>

        <el-table-column prop="userAddr" min-width="250" label="客户地址">
        </el-table-column>

        <el-table-column prop="tel" min-width="100" label="手机号码">
        </el-table-column>

        <el-table-column prop="arrearage" min-width="90" label="欠费金额">
        </el-table-column>

        <el-table-column prop="arrearageNum" min-width="90" label="欠费笔数">
        </el-table-column>

        <el-table-column prop="remoteFlag" min-width="90" label="是否远程">

        </el-table-column>

        <el-table-column prop="closeOverdueTime" min-width="100" label="关阀时间">
        </el-table-column>
        <el-table-column prop="feeStatus" min-width="90" label="欠费状态">
        </el-table-column>
        <el-table-column prop="handler" min-width="100" label="处理人员">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.native="details(scope.row)">费用信息</el-button>
          </template>
        </el-table-column>
      </el-table> -->

      <el-table v-if="tableShow" highlight-current-row stripe border center :data="tableData.list" class="change-tables-table" @selection-change="getSelectData" :max-height="maxHeight" @sort-change="sortChange" @row-click="btn" ref="eltableCurrentRow">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>
        <el-table-column prop="bookNo" min-width="130" fixed="left" label="册本号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userNo" min-width="130" fixed="left" label="用户编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctmName" min-width="140" fixed="left" label="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sortNo" min-width="120" label="抄表路线" fixed="left" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
        <el-table-column prop="setupMeterAddr" min-width="140" label="装表地址" fixed="left" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctmAddr" min-width="100" label="客户地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="useWaterType" min-width="200" label="用水类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accountPeriodNum1" min-width="50" label="笔数"></el-table-column>
        <el-table-column prop="beginAccountPeriod" min-width="90" label="开始账期"></el-table-column>
        <el-table-column prop="endAccountPeriod" min-width="90" label="结束账期"></el-table-column>
        <el-table-column prop="totalWater" min-width="100" label="水量"></el-table-column>
        <el-table-column prop="totalMoney" min-width="80" label="总金额"></el-table-column>
        <template v-for='(col) in costList'>
          <el-table-column show-overflow-tooltip :prop="col.costNameEn" :label="col.costName" :key="col.costNo" v-if="col.costName.length>0" min-width="120">
          </el-table-column>
        </template>
        <el-table-column prop="ljclf" min-width="90" label="垃圾费"></el-table-column>
        <el-table-column prop="penaltyMoney" min-width="90" label="违约金"></el-table-column>
        <el-table-column prop="mobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accountBalance" min-width="80" label="账户余额"></el-table-column>
        <el-table-column prop="priorPeriodNum" min-width="80" label="上期起码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="currentPeriodNum" min-width="80" label="本期止码" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="printName" min-width="80" label="打印人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printTime" min-width="180" label="打印时间" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meterReandingDate" min-width="120" label="抄表日期" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
    </div>
    <!-- <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="sizes, slot, jumper">
        <span class="pageBlock">
          <button class="pageStyle" v-if="tableQuery.page > 1" @click="handleCurrentChange(tableQuery.page - 1)">&#60;</button>
          <button class="pageDisableStyle" v-else>&#60;</button>
          <span> {{tableQuery.page}} </span>
          <button @click="handleCurrentChange(tableQuery.page + 1)">&#62;</button>
        </span>
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
import WaterUseOverTheYears from "@/components/IntegratedBusiness/UserInformation/WaterUseOverTheYears";
export default {
  name: "chooseUserList",
  components: {
    WaterUseOverTheYears
  },
  // props: ["formType", "waterChooseType", "disabledData"],
  data () {
    return {
      //抄表员
      meterReaderList: [],
      //费用信息
      payInfoVisible: false,
      WaterUseOverTheYearsData: {
        "userNo": ""
      },
      payInfoName: "费用信息",
      // 表格数据
      tableData: {
        list: []
      },
      // 查询条件数据
      //   tableQuery: {
      //     "page": 1,
      //     "pageCount": 20,
      //     "arrearage": "",
      //     "arrearageNum": "",
      //     "noticeTime": "",
      //     "userNo": "",
      //   },
      tableQuery: {
        costNos:[],
        page: 1,
        pageCount: 20,
        fuzzyQuery: '',
        beginAccountPeriod: '',
        endAccountPeriod: '',
        beginDate: '',
        endDate: '',
        meterReadingStaff: '',
        accountPeriodNum: '',
        totalWater: '',
        totalMoney: '',
        businessArea: '',
        useWaterType: '',
        userNo: '',
        bookNos: [],
        accountNo: '',
        groupCode: localStorage.getItem('companyNo'),
        sortOrder: '',
        sortField: '',
        valveCloseFlag: '1'
      },
      // 列表勾选数据
      selectData: [],
      tableShow: false,
      maxHeight: 0,
      isActive: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      costNoList:[],

      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      props1: {
        //树结构格式
        value: "code",
        label: "name",
        emitPath: false,
      },
      accountPeriod: [],
      meterDate: ["", ""],
      businessAreaData: [], // 营业区域字典
      useWaterTypeOptions: [], // 用水类型字典
      costList: [],
      bookNos: [],// 册本号
      showbookNosData: [],
      totalData: {},
    };
  },
  mounted () {
    // this.getMeterReader();
       this.getCostList();
    this.SelectUseWaterTypeOptions();
    this.selectBAreaOptions();
    this.getInvoiceCostsAndTypes();
    this.getReadingStaff();
    this.getBooks();
    // this.init()
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) + '' : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() + '' : '0' + time.getDate()
    this.tableQuery.endAccountPeriod = time.getFullYear() + (month - 1 < 10 ? ('0' + (month - 1)) : (month - 1).toString())
    this.common.changeTable(this, ".chooseUserList", [
      ".chooseUserList .toolbar",
      ".chooseUserList .block",
      ".chooseUserList #crumbs"
    ]);
  },
  computed: {
    showbookNos () {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
      showCostNames(){
       return this.costNoList && this.costNoList.filter(item => this.tableQuery.costNos.includes(item.costNo) ).map(item => item.costName).join(', ')
    }
  },
  methods: {
         getCostList(){
      let params = {
        busicode: "CostListZH",
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.costNoList = res;
        });
    },
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      //console.log(str);
      return str;
    },
    // 初始化 抄表抽查
    init () {
      let data = this.tableQuery
      console.log('tableQuery', this.tableQuery)
      if (this.tableQuery.endAccountPeriod === null && !this.tableQuery.businessArea) {
        this.$notify({
          title: '查询失败',
          message: '请输入账期/营业区域...',
          type: 'error'
        })
        return
      }
      if (this.accountPeriod != undefined && this.meterDate !== null) {
        data.beginDate = this.meterDate[0]
        data.endDate = this.meterDate[1]
      }
      let _this = this
      let params = {
        busicode: "ArrearagePrintList",
        data: this.tableQuery
      };
      console.log('查询参数', params);
      //   return;
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        console.log('res', res)
        // this.tableData = res
        this.tableData = res.detail
        this.totalData = res.total
      })

    },
    //抄表员下拉框数据
    // getMeterReader () {
    //   let _this = this
    //   let params = {
    //     "busicode": "PostUserSelect",
    //     "data": { "postNo": "2" },
    //   }
    //   this.$api.fetch({
    //     params,//参数
    //   }).then(res => {
    //     _this.meterReaderList = [...[{ userName: "全部" }], ...res];
    //   })
    // },
    closeDialog1 () {
      this.payInfoVisible = false
    },
    // 详情
    details (row) {
      this.WaterUseOverTheYearsData.userNo = row.userNo;
      console.log(this.WaterUseOverTheYearsData.userNo)
      this.payInfoVisible = true;
    },
    // 列表数据勾选禁用
    selectTable (row, index) {

      if (this.disabledData != undefined && this.disabledData.length > 0) {
        for (let i = 0; i < this.disabledData.length; i++) {
          if (row.id == this.disabledData[i].id) {
            return false
          } else if (row.id != this.disabledData[i].id && i == (this.disabledData.length - 1)) {
            return true
          }
        }
      } else {
        return true
      }
    },
    // 查询按钮
    search () {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      //if(){

      // }
      this.init()
    },
    // 列表选中数据事件（获取列表已勾选数据）
    getSelectData (data) {
      this.$set(this, "selectData", data);
    },
    hidden () {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
      this.$nextTick(() => {
        this.common.changeTable(this, ".chooseUserList", [
          ".chooseUserList .toolbar",
          ".chooseUserList .block",
          ".chooseUserList #crumbs"
        ]);
      })
    },
    closeDialog () {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)

    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      if (val > 0) {
        this.tableQuery.page = val
        this.init();
      }
    },
    sortChange (column) {
      console.log(column);
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init()
    },
    btn (row, col, event) {
      //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值,
      row.flag = !row.flag;
      this.$refs.eltableCurrentRow.toggleRowSelection(row, row.flag);
    },
    demand () {
      //查询
      this.tableQuery.page = 1
      this.init();
    },
    //营业区域
    selectBAreaOptions (id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaData = data.children;
      })
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions () {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes () {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        let cost = []
        let lj = ["ljclf", "wsf", "ljde", "ljgc", "ljsy", "ljqy", "ljqt"]
        res.costList.forEach((item) => {
          if (lj.indexOf(item.costNameEn) == -1) {
            cost.push(item)
          }
        })
        this.costList = cost
        console.log(this.costList)
      })
    },
    getBooks () {
      let params = {
        busicode: 'baseAllBooks',
        data: {
          businessArea: this.tableQuery.businessArea,
          meterReadingStaff: this.tableQuery.meterReadingStaff,
        }
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.tableQuery.bookNos = []
          this.bookNos = [...res];
          this.showbookNosData = []
          this.bookNos.forEach(item => {
            item.baseBookListVOList.forEach(child => {
              this.showbookNosData.push(child)
            })
          })
        });
    },
    // 抄表员数据获取
    getReadingStaff () {
      var _this = this;
      var params = {
        "busicode": "PostUserList",
        "data": { "postNo": "2", businessArea: this.tableQuery.businessArea },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    changeMeterReadingStaff () {
      this.getBooks();
    },
    getDatePicker () {

    },
    getDatePicker1 (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 营业区域、抄表员、册本号关联
    changeBusinessArea () {
      if (this.tableQuery.businessArea) {
        this.getBooks();
      } else {
        this.getBooks();
      }
      this.getReadingStaff();
    },
    //树结构数据处理
    getArr (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
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
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>

<style lang="scss">
.chooseUserList {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.pageDisableStyle {
  color: #c0c4cc;
}
.pageBlock {
  text-align: center;
}
</style>

<style lang="scss" scoped>
.kl-table {
//   margin-top: 15px;
}
</style>

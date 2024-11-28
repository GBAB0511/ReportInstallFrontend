<template>
  <div class="InfoCopy">
    <!-- 账单打印 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <div class="bread-contain-right">
        <span style="font-size:14px">选择范围：</span>
        <el-radio v-model="exportType" label="0">勾选</el-radio>
        <el-radio v-model="exportType" label="1">全部</el-radio>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleExportNew">导出</el-button>
        <el-button size="mini" @click.native="Print" type="primary">打印</el-button>
      </div>
    </div>
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" label-width="75px">
        <el-form-item label="账期：">
          <el-date-picker size="mini" v-model="monthAccount" type="monthrange" format="yyyy-MM" value-format="yyyyMM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" @change="getDatePicker">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="营业区域：" class="width-200">
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" @change="changeBusinessArea" class="shouldWater" :props="props">
          </el-cascader>
        </el-form-item>

        <!-- 抄表员 -->
        <el-form-item class="readingStaff width-200" label="抄表员：">
          <!-- <el-select v-model="tableQuery.readerAccount" size="mini" placeholder="抄表员">
          <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
        </el-select> -->
          <el-select v-model="tableQuery.readerAccount" placeholder="请选择" @change="changeMeterReadingStaff" class="shouldWater" clearable>
            <el-option-group v-for="group in meterReaderList" :key="group.businessAreaName" :label="group.businessAreaName">
              <el-option v-for="item in group.userInfos" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="册本号：" class="width-200">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="册本"></el-input> -->
          <el-select v-model="tableQuery.bookNo" multiple placeholder="请选择" filterable class="shouldWater" clearable>
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
          <el-tooltip effect="dark" content="用户编号、客户名称、客户编号、手机号码、银行卡号、联合编号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="demand" placeholder="用户编号、客户名称、客户编号、手机号码、银行卡号、联合编号"></el-input>
          </el-tooltip>
        </el-form-item>

             <el-form-item label="显示费种：" class="width-200">
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

        <el-form-item class="button-group">
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
        <div v-show="isActive" class="advancedQuery">
          <el-form-item label='抄表日期：'>
            <el-date-picker v-model="meterReadingDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDatePicker2">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="打印日期：">
            <el-date-picker v-model="printDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDatePicker1"></el-date-picker>
          </el-form-item>
          <!--el-form-item label="是否大客户：">
            <el-select ref="select1" clearable v-model="tableQuery.isBigCtm" placeholder="是">
              <el-option v-for="(item,index) in isBigCtmOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item-->
          <el-form-item label="用水类型：">
            <el-cascader ref="cascader-a" v-model="tableQuery.useWaterType" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props1">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否增值税：" label-width="100px">
            <el-select clearable v-model="tableQuery.vatFlag" placeholder="">
              <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否打印：">
            <el-select clearable v-model="tableQuery.isNotPrint" placeholder="">
              <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否核销：">
            <el-select clearable v-model="tableQuery.isChargingFlag" placeholder="">
              <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="排序号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.beginSortNo" clearable placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="-" label-width="0px">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endSortNo" clearable placeholder="" style="margin-left: 15px"></el-input>
          </el-form-item>



          <!--el-form-item label="营业所：">
            <el-select clearable v-model="tableQuery.businessAbode" placeholder>
              <el-option v-for="item in businessAbodeData" :key="item.value" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item-->

          <!--el-form-item label="缴费方式：">
            <el-select ref="select2" clearable v-model="tableQuery.payMethod" placeholder>
              <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item-->
          <!-- <el-form-item label="收费提醒：" class="chargeRemind">合计金额：<span style="color:#30B110;">{{receivableMoney}}</span>；笔数：<span style="color:#30B110;">{{calculateNum}}</span>；水量：<span style="color:#30B110;">{{calculateWater}}</span></el-form-item> -->
        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border @selection-change="getSelectList" @row-click="handleTableCellClick" ref="eltableCurrentRow" :data="tableData.list" class="change-tables-table" :max-height="maxHeight" :cell-style="cellStyle" @sort-change="sortChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

        <el-table-column prop="bookNo" min-width="150" label="册本号" show-overflow-tooltip></el-table-column>

        <el-table-column prop="userNo" min-width="130" label="用户编号" show-overflow-tooltip></el-table-column>

        <el-table-column prop="ctmName" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="250" label="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sortNo" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="120" label="抄表路线"></el-table-column>
        <el-table-column prop="setupMeterAddr" min-width="300" label="装表地址" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip></el-table-column>

        <el-table-column prop="accountPeriod" min-width="70" label="账期"></el-table-column>

        <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期"></el-table-column>
        <el-table-column prop="priorPeriodNum" min-width="120" label="上期抄码" show-overflow-tooltip align="right"></el-table-column>
        <el-table-column prop="currendPeriodNum" min-width="120" label="本期抄码" show-overflow-tooltip align="right"></el-table-column>
        <el-table-column prop="realityWater" min-width="100" label="实际用水量" align="right"></el-table-column>
        <el-table-column prop="calculateWater" min-width="80" label="计费水量" align="right"></el-table-column>
        <el-table-column prop="sf" min-width="100" label="水费金额" align="right"></el-table-column>
        <el-table-column prop="totalFee" min-width="100" label="综合水费" align="right"></el-table-column>
        <el-table-column prop="receivableMoney" min-width="100" label="应收金额" align="right"></el-table-column>
        <el-table-column prop="accountBalance" min-width="100" label="账户余额" align="right"></el-table-column>
        <el-table-column prop="currendBalance" min-width="100" label="本期余额" align="right"></el-table-column>
        <el-table-column prop="useWaterTypeName" min-width="180" label="用水类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printName" min-width="80" label="打印人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printTime" min-width="180" label="打印时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meterReadingStaffName" min-width="120" label="抄表员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stopWaterLinkMobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctmAddr" min-width="300" label="客户地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessAreaName" min-width="180" label="营业区域" show-overflow-tooltip></el-table-column>

      </el-table>

    </div>
    <!-- 分页 -->
    <div class="block">
      <div class="noteReminder chargeRemind"><span style="color:#606266;font-size:14px">合计金额：</span><span style="color:#30B110;font-size:14px">{{receivableMoney}}</span>；<span style="color:#606266;font-size:14px">合计水费金额：</span><span style="color:#30B110;font-size:14px">{{sf}}</span>；<span style="color:#606266;font-size:14px">笔数：</span><span style="color:#30B110;font-size:14px">{{calculateNum}}</span>；<span style="color:#606266;font-size:14px">水量：</span><span style="color:#30B110;font-size:14px">{{calculateWater}}</span></div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 200]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "InfoCopy",
  components: {},
  data () {
    return {
      exportType: '0',//导出范围
      flag: false,//行点击boolean值
      EditVisible: true, //弹出表单
      meterReaderList: [],//抄表员
      bookNos: [],
      showbookNosData: [],
      activeName: "WaterBill",
      isNot: [{ label: "全部", value: '' }, { label: "否", value: '0' }, { label: "是", value: '1' }],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "打印管理" },
          { title: "账单打印" }
        ]
      },
      props: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath: false,
        checkStrictly: true,
      },
      props1: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath: false,
        checkStrictly: true,
      },
      monthAccount: [this.common.date("month"), this.common.date("month")],
      printDate: [],
      meterReadingDate: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: "",//this.common.date("month"),
        meterReadingDateStart: "",
        meterReadingDateEnd: "",
        businessArea: '',
        bookNo: '',
        isBigCtm: 0,
        printStartDate: "",
        printEndDate: "",
        periodStartDate: "",
        periodEndDate: "",
        payMethod: "",
        fuzzyQuery: "",
        vatFlag: "",
        isNotPrint: "",
        useWaterType: '',
        isChargingFlag: '0',
        beginSortNo:'',
        endSortNo:'',
        costNos:[],
      },
      useWaterTypeOptions: [],//用水类型下拉框
      costNoList:[],
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      isBigCtmOptions: [
        {
          value: 1,
          name: "是"
        },
        {
          value: 0,
          name: "否"
        }
      ],
      //数据字典
      dictionaryData: [],
      businessAreaData: [],
      //营业所
      businessAbodeData: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      selectList: [],
      isActive: false,
      // 收费提醒
      receivableMoney: 0,  // 应缴金额
      sf: 0, // 水费金额
      calculateNum: 0,// 笔数
      accountPeriods: [], // 账期集合
      calculateWater: 0, // 水量
      flag: false,
      printMethodYype: 0,
      flag2: false,
      notify1: '',
    };
  },
  mounted () {
    this.selectBAreaOptions();
    this.SelectUseWaterTypeOptions();
    this.getDatePicker(this.monthAccount);
    this.getBaseConfig();
    //this.init();
    // 抄表员下拉数据
    this.getReadingStaff()
    this.getDictionarySelect();
    this.tradeClassifyDataOptions();
    this.getBooks()
    this.getCostList();
    // 添加停止打印监听事件
    document.addEventListener('click', (e) => {
      let _track = document.getElementById('stopPrint');
      if (_track) {
        if (_track.contains(e.target)) {
          this.stopPrint();//事件
        }
      }
    });
  },
  computed: {
    showbookNos () {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNo.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
    showCostNames(){

     return this.costNoList && this.costNoList.filter(item => this.tableQuery.costNos.includes(item.costNo) ).map(item => item.costName).join(', ')

    }
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
      }
    },
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
    handleTableCellClick (row, cell, event) {
      //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值,
      // row.flag = !row.flag;
      // this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.list.findIndex(item => item.id === row.id)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if (this.selectList.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.getSelectList(this.selectList.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else { //恢复该账期勾选
        this.getSelectList(this.selectList.concat(select))
        this.selectList.concat(select).forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }
    },
    changeBusinessArea () {
      if (this.tableQuery.businessArea) {
        this.getBooks();
      } else {
        this.getBooks();
      }
      this.getReadingStaff();

    },
    changeMeterReadingStaff () {
      if (this.tableQuery.readerAccount) {
        this.meterReaderList.forEach(v => {
          v.userInfos.forEach(res => {
            if (res.userAccount == this.tableQuery.readerAccount) {
              this.tableQuery.meterReadingStaffName = res.userName
            }
          })
        })
      } else {
        this.tableQuery.meterReadingStaffName = ''
      }

      this.getBooks();
    },
    getBooks () {
      // if (this.tableQuery.meterReadingStaffName){
      if (this.tableQuery.meterReadingStaffName == null || this.tableQuery.meterReadingStaffName == undefined) {
        this.tableQuery.meterReadingStaffName = ''
      }
      let params = {
        busicode: 'baseAllBooks',
        data: {
          businessArea: this.tableQuery.businessArea,
          meterReadingStaff: this.tableQuery.meterReadingStaffName,
        }
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.tableQuery.bookNo = []
          this.bookNos = [...res];
          this.showbookNosData = []
          this.bookNos.forEach(item => {
            item.baseBookListVOList.forEach(child => {
              this.showbookNosData.push(child)
            })
          })
        });
      // }else {
      //   this.bookNos = [];
      //   this.showbookNosData = [];
      // }

    },
    //营业区域
    selectBAreaOptions () {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaData = data.children;
      })
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
    cellStyle (data) {
      return "cursor:pointer;"
    },
    init () {
      if (!this.monthAccount && !this.tableQuery.fuzzyQuery) {
        this.$message({
          message: '账期和模糊查询不能都为空！',
          type: 'warning'
        });
        return
      }
      let params = {
        busicode: "BillPrintList",
        data: this.tableQuery
      };
      console.log(params)
      this.$api.fetch({ params: params }).then(res => {
        console.log(res)
        this.$set(this, "tableData", res);
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, '.InfoCopy', ['.InfoCopy .toolbar', '.InfoCopy .block', ".InfoCopy .bread-contain", ".InfoCopy .toggle-btn"])
      })
    },
    getDatePicker1 (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.printStartDate = date[0]
        this.tableQuery.printEndDate = date[1]
      } else {
        this.tableQuery.printStartDate = ''
        this.tableQuery.printEndDate = ''
      }
    },
    getDatePicker2 (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.meterReadingDateStart = date[0]
        this.tableQuery.meterReadingDateEnd = date[1]
      } else {
        this.tableQuery.printStartDate = ''
        this.tableQuery.printEndDate = ''
      }
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
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.periodStartDate = date[0]
        this.tableQuery.periodEndDate = date[1]
      } else {
        this.tableQuery.periodStartDate = ''
        this.tableQuery.periodEndDate = ''
      }
    },
    getSelectList (e) {
      this.selectList = e
      this.receivableMoney = 0
      this.sf = 0
      this.accountPeriods = []
      this.calculateNum = 0
      this.calculateWater = 0
      this.selectList.forEach(item => {
        this.receivableMoney += Number(item.receivableMoney || 0)
        this.sf += Number(item.sf || 0)
        let userAndAccountPeriod = {
          userNo: item.userNo,
          accountPeriod: item.accountPeriod
        }
        if (JSON.stringify(this.accountPeriods).indexOf(JSON.stringify(userAndAccountPeriod)) !== -1) {
        } else {
          this.accountPeriods.push(userAndAccountPeriod)
          this.calculateNum++
        }
        this.calculateWater += Number(item.realityWater || 0)
      })
      this.receivableMoney = this.receivableMoney.toFixed(2)   //保留两位小数
      this.sf = this.sf.toFixed(2)
    },
    // 资料导出
    handleExport () {
      let params = {
        busicode: "BillPrintExport",
        data: this.tableQuery,
        token: sessionStorage.getItem("token"),
        sysType: '002',
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    handleExportNew () {
      let arr = [];
      this.selectList.forEach(function (element) { arr.push({ userNo: element.userNo, accountPeriod: element.accountPeriod }) });
      if (arr.length == 0 && this.exportType == '0') {
        this.$message({
          message: '请先勾选需要打印的数据！',
          type: 'warning'
        });
        return
      }
      if (arr.length > 200) {
        this.$message({
          message: '请勾选200条以内的数据！',
          type: 'warning'
        });
        return
      }
      if (this.exportType == '') {
        this.$message({
          message: '请选择导出范围！',
          type: 'warning'
        });
        return
      }
      let params = {}
      if (this.exportType == '0') {
        params = {
          busicode: "BillPrintExport",
          data: {
            userNos: arr,
            exportAll: this.exportType
          },
          token: sessionStorage.getItem("token"),
          sysType: '002',
        };
      } else {
        var searchQuery = JSON.parse(JSON.stringify(this.tableQuery))
        searchQuery.exportAll = this.exportType
        params = {
          busicode: "BillPrintExport",
          data: searchQuery,
          token: sessionStorage.getItem("token"),
          sysType: '002',
        };
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))

    },
    // 抄表员数据获取
    getReadingStaff () {
      var _this = this;
      var params = {
        "busicode": "PostUserList",
        "data": {
          "postNo": "2",
          businessArea: this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = res;
          // _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    getBaseConfig () { //获取水量异常比例配置
      let _this = this
      var params = {
        busicode: "ConfigList",
        data: { searchContent: 'print_method_type' }
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if (data != null && data.length > 0) {
            this.printMethodYype = data[0].configValue
          }
        })
        .catch(res => {

        });
    },
    Print () {
      let arr = [];
      this.selectList.forEach(function (element) { arr.push({ userNo: element.userNo, accountPeriod: element.accountPeriod
            }) });
      if (arr.length == 0) {
        this.$message({
          message: '请先勾选需要打印的数据！',
          type: 'warning'
        });
        return
      }
      // arr.forEach(item=>{
      //   let param = []
      //   param.push(item)
      //   this.printOne(param)
      // })
      //this.printOne(arr)
      // if(this.printMethodYype && this.printMethodYype==0){
      //   this.printOne(arr)
      // }else{
      //   this.printAll(arr)
      // }
      if (this.printMethodYype == 0) {
        this.printAll(arr)
      } else {
        this.printOne(arr, this.printMethodYype)
      }

    },
    printAll (arr) {
      let params = {
        busicode: "BillPrint",
        data: { userNos: arr, costNos:this.tableQuery.costNos ,isChargingFlag:this.tableQuery.isChargingFlag}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'BillPrint', '', data[i], this);
        }
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
      })

    },
    async printOne (arr, num) {
      // arr.forEach(async item=>{
      this.notify1 = this.$notify({
        title: '成功',
        // message: '正在打印...',
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$createElement("div", null, [
          this.$createElement("div", null, [
            this.$createElement("span", {
              style: {
                lineHeight: "30px",
              }
            }, '正在打印...'),
            this.$createElement(
              "button",
              {
                style: {
                  padding: "8px 16px",
                  // margin: "10px 12px 0px 2px",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-block",
                  webkitTransitionDuration: "0.4s",
                  transitionDuration: "0.4s",
                  cursor: "pointer",
                  backgroundColor: "#409EFF",
                  color: "white",
                  // border: '2px solid ##ea8f28',
                  borderRadius: "6px",
                  border: "#409EFF",
                  float: "right",
                },
                on: {
                  click: () => {
                    this.stopPrint()
                  },
                }
              },
              "停止打印"
            )
          ])
        ]),
        duration: 0
      })
      this.$nextTick(() => {
        $('.el-notification').css('z-index', '20000')
        $('.el-notification__content').css('width', '230px')
      })
      let param = []
      let groupNum = 0
      for (let [key, item] of arr.entries()) {
        if (this.flag2) {
          this.notify1.close()
          this.flag2 = false
          return
        }
        param.push(item)
        if (param.length == num) {
          groupNum++
          let params = {
            busicode: "BillPrint",
            data: { userNos: param , costNos:this.tableQuery.costNos}
          };

          let data = await this.$api.fetch({ params: params })
          for (let i = 0; i < data.length; i++) {
            this.common.printOne('print', 'BillPrint', '', data[i], this);
            if (!this.flag) {
              this.notify1.close()
              this.flag2 = false
              return
            }
          }
          param = []
        } else {
          if ((arr.length - groupNum * num) < num) {
            console.log(key);
            if (key == arr.length - 1) {
              let params = {
                busicode: "BillPrint",
                data: { userNos: param, costNos:this.tableQuery.costNos }
              };

              let data = await this.$api.fetch({ params: params })
              for (let i = 0; i < data.length; i++) {
                this.common.printOne('print', 'BillPrint', '', data[i], this);
                if (!this.flag) {
                  this.notify1.close()
                  this.flag2 = false
                  return
                }
              }
              param = []
              groupNum = 0
            }
          }
        }

      }
      this.notify1.close()
      this.flag2 = false
    },
    stopPrint () {
      // console.log("正在停止");
      this.flag2 = true
      this.$notify({
        title: '成功',
        message: '正在停止打印...',
        type: 'success'
      })
    },
    // 数据字典
    getDictionarySelect () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPW"
      };
      this.$api.fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        }).catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    //营业所：
    tradeClassifyDataOptions () {
      let params = { busicode: "BusinessAbodeSelect", data: "" };
      this.$api.fetch({ params }).then(res => {
        this.businessAbodeData = res;
      }).catch(res => {
        this.businessAbodeData = [];
      });
    },

    handleClick (tab, event) {
      this.$set(this.crumbsData.titleList, "3", {
        title: tab.label,
        method: () => {
          window.histroy.back();
        }
      });
    },
    demand () {
      //查询
      this.tableQuery.page = 1;
      this.init();
    },
    //   导出
    exportExcel () { },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    hidden () {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
      }
      this.$nextTick(() => {
        this.common.changeTable(this, '.InfoCopy', ['.InfoCopy .toolbar', '.InfoCopy .block', ".InfoCopy .bread-contain", ".InfoCopy .toggle-btn"])
      })
    }
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
<style lang="scss" scoped>
.InfoCopy {
  width: 100%;
  height: 100%;

  /deep/ {
    .item {
      width: 22%;
      .el-form-item__content {
        width: calc(100% - 73px);
      }
    }
    .shouldWater {
      width: 100%;
      .el-input__inner {
        width: 100%;
      }
    }
    .searchInput {
      width: 375px;
      .el-form-item__content {
        width: 300px;
      }
    }
  }
  .kl-table {
    margin-top: 15px;
  }
  .chargeRemind {
    margin-left: 50px;
    .el-form-item__content {
      color: #606266;
    }
  }
  .noteReminder {
    width: 35%;
    float: left;
    text-align: left !important;
    line-height: 32px;
  }
  .block el-pagination {
    width: 60%;
    float: right;
  }
}
</style>

<template>
  <div class="ArrearageCollection">
    <!-- 欠费催缴单 模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click.native="Print">打印</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click.native="exportExcel">导出</el-button>
        <el-button size="mini" type="primary" @click.native="PrintNotice">停水通知打印</el-button>
      </div>
    </div>

    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor collectQuery" label-width="75px">


          <el-form-item label="账期：">
          <el-date-picker v-model="tableQuery.beginAccountPeriod" type="month" format="yyyy-MM" value-format="yyyyMM" :picker-options="pickerOptions" ></el-date-picker>
        </el-form-item><span class="separator">-</span>
          <el-form-item label="">
          <el-date-picker v-model="tableQuery.endAccountPeriod" type="month" format="yyyy-MM" value-format="yyyyMM" :picker-options="pickerOptions" ></el-date-picker>
        </el-form-item>



        <el-form-item label="营业区域：">
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" @change="changeBusinessArea" :show-all-levels="false" :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="用户编号：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" clearable size="mini" placeholder="请输入用户编号" @keydown.enter.native="demand"></el-input>
        </el-form-item>
        <el-form-item label="册本号：" class="width-200">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" clearable size="mini" @keydown.enter.native="demand"></el-input> -->
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
          <el-tooltip class="item" effect="dark" content="客户编号、客户名称、客户地址、联合编号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="demand" placeholder="客户编号、客户名称、客户地址、联合编号"></el-input>
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

          <el-form-item label="排序号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.sortStart" placeholder="" clearable size="mini"></el-input>
          </el-form-item><span class="separator">~</span>
          <el-form-item label="">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.sortEnd" placeholder="" clearable size="mini"></el-input>
          </el-form-item>

        <el-form-item class="button-group">
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
        <div v-show="isActive" class="advancedQuery">
          <!--el-form-item label="营业所：">
            <el-select clearable v-model="tableQuery.businessAbode" placeholder>
              <el-option
                v-for="item in businessAbodeData"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item-->
          <el-form-item label="抄表日期：" class="waterReadData">
            <el-date-picker v-model="meterDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDatePicker1"></el-date-picker>
          </el-form-item>
          <el-form-item label="抄表员：">
            <!-- <el-select ref="select1" clearable v-model="tableQuery.meterReadingStaff" placeholder="抄表员">
               <el-option v-for="item in meterReaderList" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
            </el-select> -->
            <el-select v-model="tableQuery.meterReadingStaff" placeholder="请选择" @change="changeMeterReadingStaff" class="shouldWater" clearable>
              <el-option-group v-for="group in meterReaderList" :key="group.businessAreaName" :label="group.businessAreaName">
                <el-option v-for="item in group.userInfos" :key="item.userAccount" :label="item.userName" :value="item.userName">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="账户编号：" class="">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountNo" clearable size="mini" @keydown.enter.native="demand" placeholder="账户编号"></el-input>
          </el-form-item>
          <el-form-item label="用水类型：" class="waterType">
            <el-cascader ref="cascader-a" v-model="tableQuery.useWaterType" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="缴费方式：">
            <el-select ref="select2" clearable v-model="tableQuery.payMethod" placeholder="缴费方式">
              <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
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

          <el-form-item label="打印日期：">
            <el-date-picker v-model="printDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDatePicker2"></el-date-picker>
          </el-form-item>

          <el-form-item label="是否打印：">
            <el-select clearable v-model="tableQuery.isNotPrint" placeholder="">
              <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态：">
            <el-select v-model="tableQuery.userStatus" placeholder="请选择" clearable ref="select2">
              <el-option v-for="item in dictionaryData.CUS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>


        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border :data="tableData.list" class="change-tables-table" @row-click="btn" ref="eltableCurrentRow" @selection-change="getSelectList" :max-height="maxHeight" @sort-change="sortChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>
        <el-table-column prop="bookNo" min-width="110" fixed="left" label="册本号" show-overflow-tooltip></el-table-column>
        <!--el-table-column prop="sortNo" min-width="80" label="排序号"></el-table-column-->
        <el-table-column prop="userNo" min-width="130" fixed="left" label="用户编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctmName" min-width="140" fixed="left" label="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sortNo" min-width="120" label="抄表路线" fixed="left" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
        <el-table-column prop="setupMeterAddr" min-width="140" label="装表地址" fixed="left" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctmAddr" min-width="100" label="客户地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="useWaterType" min-width="200" label="用水类型" show-overflow-tooltip></el-table-column>
        <!--el-table-column prop="useWaterType" min-width="120" label="用水类型" show-overflow-tooltip></el-table-column-->
        <el-table-column prop="accountPeriodNum1" min-width="50" label="笔数" align="right"></el-table-column>
        <el-table-column prop="beginAccountPeriod" min-width="90" label="开始账期"></el-table-column>
        <el-table-column prop="endAccountPeriod" min-width="90" label="结束账期"></el-table-column>
        <el-table-column prop="totalWater" min-width="100" label="水量" align="right"></el-table-column>
        <el-table-column prop="totalMoney" min-width="80" label="总金额" align="right"></el-table-column>
        <template v-for='(col) in costList'>
          <el-table-column show-overflow-tooltip :prop="col.costNameEn" :label="col.costName" :key="col.costNo" v-if="col.costName.length>0" min-width="120" align="right">
          </el-table-column>
        </template>
        <el-table-column prop="totalFee" min-width="80" label="综合水费" align="right"></el-table-column>
        <el-table-column prop="ljclf" min-width="90" label="垃圾费" align="right"></el-table-column>
        <el-table-column prop="penaltyMoney" min-width="90" label="违约金" align="right"></el-table-column>
        <el-table-column prop="mobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accountBalance" min-width="80" label="账户余额" align="right"></el-table-column>
        <el-table-column prop="priorPeriodNum" min-width="80" label="上期起码" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="currentPeriodNum" min-width="80" label="本期止码" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printName" min-width="80" label="打印人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printTime" min-width="180" label="打印时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meterReadingDate" min-width="120" label="抄表日期" show-overflow-tooltip></el-table-column>
        <!--el-table-column prop="accountNo" min-width="120" label="账户编号"></el-table-column>
        <el-table-column prop="ctmNo" min-width="120" label="客户编号"></el-table-column>
        <el-table-column prop="bankAccount" min-width="150" label="银行账户"></el-table-column-->
      </el-table>

    </div>
    <!-- 分页 -->
    <div class="block">
      <div class="block">
        <div class="noteReminder chargeRemind"><span style="color:#606266;font-size:14px">合计总金额：</span><span style="color:#30B110;font-size:14px">{{totalMoney}}</span>；<span style="color:#606266;font-size:14px">合计水费金额：</span><span style="color:#30B110;font-size:14px">{{sf}}</span>；<span style="color:#606266;font-size:14px">笔数：</span><span style="color:#30B110;font-size:14px">{{calculateNum}}</span>；<span style="color:#606266;font-size:14px">水量：</span><span style="color:#30B110;font-size:14px">{{calculateWater}}</span></div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <el-dialog append-to-body :close-on-click-modal='false' title="欠费通知单-日期选择" :v-if="printShow" :visible.sync="printShow" width="25%" @close='printClose'>
      <el-form :inline="true" size="mini" :model="printForm" class="demo-form-inline" :label-position="labelPosition" label-width="100px">
        <el-form-item label="通知日期：">
          <el-date-picker v-model="printForm.printDate" type="date" format="yyyy年MM月dd日" value-format="yyyy年MM月dd日" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="缴费截至日期：">
          <el-date-picker v-model="printForm.paymentDate" type="date" format="yyyy年MM月dd日" value-format="yyyy年MM月dd日" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="addPrint">确定打印</el-button>
        <el-button type="info" size="mini" @click="printClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ArrearageCollection",
  components: {},
  data () {
    return {
      flag: false,//行点击boolean值
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "打印管理" },
          { title: "欠费催缴单" }
        ]
      },
      monthAccount:[],
      accountPeriod: [],
      meterDate: [],
      costList: [],
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
      useWaterTypeOptions: [],//用水类型下拉框
      businessAreaData: [],
      costNoList:[],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: '',
        beginAccountPeriod: '',
        endAccountPeriod: '',
        beginDate: '',
        endDate: '',
        meterReadingStaff: '',
        payMethod: '',
        accountPeriodNum: '',
        totalWater: '',
        totalMoney: '',
        businessArea: '',
        useWaterType: '',
        userNo: '',
        bookNos: [],
        // bookNo:'',
        accountNo: '',
        printStartDate: "",
        printEndDate: "",
        isNotPrint: "",
        userStatus: '',
        groupCode: localStorage.getItem('companyNo'),
        sortOrder:'',
        sortField:'',
        costNos:[],//综合水费
        sortStart: '',
        sortEnd: '',
      },
      //数据字典
      dictionaryData: [],
      //营业所
      businessAbodeData: [],
      // 抄表员
      meterReaderList: [],
      bookNos: [],
      showbookNosData: [],
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      selectData: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      isActive: false,
      totalData: {},
      isNeedWindow: false,
      printShow: false,
      printForm: {
        printDate: '',
        paymentDate: ''
      },
      labelPosition: 'right',
      printDate: [],
      isNot: [{ label: "全部", value: '' }, { label: "否", value: '0' }, { label: "是", value: '1' }],
      flag: false,
      printMethodYype: 0,
      flag2: false,
      notify1: '',
      totalMoney: 0,  // 应缴金额
      sf: 0, // 水费金额
      calculateNum: 0,// 笔数
      accountPeriods: [], // 账期集合
      calculateWater: 0, // 水量
      printType: "", // 打印类型，0为打印，1为停水通知打印
    };
  },
  mounted () {

    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) + '' : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() + '' : '0' + time.getDate()
    /*
    this.accountPeriod.push( time.getFullYear() + (month - 1 < 10 ? ('0' + (month - 1)) : (month - 1).toString()))
    //this.accountPeriod.push( time.getFullYear() + month)
    this.accountPeriod.push( time.getFullYear() + (month - 1 < 10 ? ('0' + (month - 1)) : (month - 1).toString()))*/
     this.monthAccount = ['',  time.getFullYear() + (month - 1 < 10 ? ('0' + (month - 1)) : (month - 1).toString())]
     this.getDatePicker(this.monthAccount);

    this.printForm.printDate = time.getFullYear() + '年' + month + '月' + day + '日'
    //this.init();
    this.getDictionarySelect();
    this.getReadingStaff();
    this.tradeClassifyDataOptions();
    this.getInvoiceCostsAndTypes();
    this.SelectUseWaterTypeOptions();
    this.selectBAreaOptions();
    this.getIsNeedWindow();
    this.getBaseConfig();
    this.getBooks();
    this.getCostList();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".ArrearageCollection ", [
        ".ArrearageCollection .toolbar",
        ".ArrearageCollection .block",
        ".ArrearageCollection .bread-contain",
        ".ArrearageCollection .toggle-btn"
      ]);
      this.maxHeight = this.maxHeight - 3
    });

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
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
      }
    },
    btn (row, col, event) {
      //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值,
      row.flag = !row.flag;
      this.$refs.eltableCurrentRow.toggleRowSelection(row, row.flag);
    },
    init () {
      let data = this.tableQuery
      //console.log(this.accountPeriod);
      /*
      if(this.accountPeriod===null){
        this.$notify({
            title: '查询失败',
            message: '请输入账期...',
            type: 'error'
          })
          return
      }
      if (this.accountPeriod!=null && this.accountPeriod.length!=0) {
        data.beginAccountPeriod = this.accountPeriod[0]
        data.endAccountPeriod = this.accountPeriod[1]
      }*/
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
      let params = {
        busicode: "ArrearagePrintList",
        data: data
      };
      this.$api.fetch({ params: params }).then(res => {

        this.tableData = res.detail
        this.totalData = res.total
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.$nextTick(() => {
          this.common.changeTable(this, ".ArrearageCollection ", [
            ".ArrearageCollection .toolbar",
            ".ArrearageCollection .block",
            ".ArrearageCollection .bread-contain",
            ".ArrearageCollection .toggle-btn"
          ]);
          this.maxHeight = this.maxHeight - 3
        })
      })
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

    // 返回合计数据
    getTotal (param) {
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray = []
      selectedColm.forEach(a => {
        if (vm.totalData[a.property]) {
          newArray.push(vm.totalData[a.property])
        } else { newArray.push('') }
      });
      sums = newArray;
      sums[0] = "合计";
      sums[1] = "",
        sums[2] = "",
        sums[3] = ""
      return sums;
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
    //营业区域
    selectBAreaOptions (id) {
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
    // 获取日期框数据
    getDatePicker (date) {
      
      if (date !== undefined && date !== null) {
        this.tableQuery.beginAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.beginAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
      }
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
        let lj = ["ljclf", "ljde", "ljgc", "ljsy", "ljqy", "ljqt"]
        res.costList.forEach((item) => {
          if (lj.indexOf(item.costNameEn) == -1) {
            cost.push(item)
          }
        })
        this.costList = cost
        console.log(this.costList)
      })
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
    getDatePicker2 (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.printStartDate = date[0]
        this.tableQuery.printEndDate = date[1]
      } else {
        this.tableQuery.printStartDate = ''
        this.tableQuery.printEndDate = ''
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
    // 数据字典
    getDictionarySelect () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPW,CUS"
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    //营业所：
    tradeClassifyDataOptions () {
      let params = { busicode: "BusinessAbodeSelect", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.businessAbodeData = res;
        })
        .catch(res => {
          this.businessAbodeData = [];
        });
    },
    getSelectList (e) {
      this.selectData = e
      this.totalMoney = 0
      this.sf = 0
      this.accountPeriods = []
      this.calculateNum = 0
      this.calculateWater = 0
      this.selectData.forEach(item => {
        // console.log('item', item)
        this.totalMoney += Number(item.totalMoney || 0)
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
        this.calculateWater += Number(item.totalWater || 0)
      })
      this.totalMoney = this.totalMoney.toFixed(2)   //保留两位小数
      this.sf = this.sf.toFixed(2)
    },
    getBaseConfig () { //打印配置参数
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
      this.printType = "0";
      if (this.isNeedWindow) {
        if (this.selectData.length != 0) {
          this.printShow = true
        } else {
          this.$message({
            showClose: true,
            message: '请勾选要打印的数据！',
            type: 'error'
          });
        }
      } else {
        let arr = [];
        this.selectData.forEach(function (element) { arr.push({ userNo: element.userNo, accountPeriod: element.endAccountPeriod }) });
        if (this.printMethodYype == 0) {
          this.printAll(arr)
        } else {
          this.printOne(arr, this.printMethodYype)
        }
        // let params = {
        //   busicode: "ArrearagePrint",
        //   data: { pUserNos: arr }
        // };
        // this.$api
        //   .fetch({
        //     params: params //参数
        //   })
        //   .then(res => {
        //     let data = res
        //     this.$notify({
        //       title: '成功',
        //       message: '正在打印...',
        //       type: 'success'
        //     })
        //     data.forEach(element => {
        //       this.common.print('view', 'ArrearagePrint', '', element, this);
        //     });
        // })
      }
    },
    printAll (arr) {
      let params = {
        busicode: "ArrearagePrint",
        data: { pUserNos: arr ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,
        costNos:this.tableQuery.costNos,
        beginAccountPeriod:this.tableQuery.beginAccountPeriod,endAccountPeriod:this.tableQuery.endAccountPeriod}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'ArrearagePrint', '', data[i], this);
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
            busicode: "ArrearagePrint",
            data: { pUserNos: param ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
            beginAccountPeriod:this.tableQuery.beginAccountPeriod,endAccountPeriod:this.tableQuery.endAccountPeriod}
          };

          let data = await this.$api.fetch({ params: params })
          for (let i = 0; i < data.length; i++) {
            this.common.printOne('view', 'ArrearagePrint', '', data[i], this);
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
                busicode: "ArrearagePrint",
                data: { pUserNos: param ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
                beginAccountPeriod:this.tableQuery.beginAccountPeriod,endAccountPeriod:this.tableQuery.endAccountPeriod}
              };

              let data = await this.$api.fetch({ params: params })
              for (let i = 0; i < data.length; i++) {
                this.common.printOne('view', 'ArrearagePrint', '', data[i], this);
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
    // stopPrint(){
    //   // console.log("正在停止");
    //   this.flag2 = true
    //   this.$notify({
    //     title: '成功',
    //     message: '正在停止打印...',
    //     type: 'success'
    //   })
    // },
    addPrint () {
      console.log(this.printForm.printDate);
      console.log(this.printForm.paymentDate);
      let arr = [];
      this.selectData.forEach(function (element) {
        arr.push({
          userNo: element.userNo,         
          accountPeriod: element.endAccountPeriod,
          beginAccountPeriod:element.beginAccountPeriod,
          endAccountPeriod:element.endAccountPeriod 
        })
      });
      this.printForm.printDate = (this.printForm.printDate == null ? '' : this.printForm.printDate)
      this.printForm.paymentDate = (this.printForm.paymentDate == null ? '' : this.printForm.paymentDate)
      if (this.printMethodYype == 0) {
        if(this.printType == "0"){
          this.addPrintAll(arr)
        }else{
          this.addPrintWaterAll(arr)
        }
      } else {
        if(this.printType == "0"){
          this.addPrintOne(arr, this.printMethodYype)
        }else{
          this.addPrintWaterOne(arr, this.printMethodYype)
        }
        
      }

      // let params = {
      //   busicode: "ArrearagePrint",
      //   data: { pUserNos: arr, printDate: this.printForm.printDate, paymentDate:this.printForm.paymentDate }
      // };
      // this.$api
      //   .fetch({
      //     params: params //参数
      //   })
      //   .then(res => {
      //     console.log(res);
      //     let data = res
      //     this.$notify({
      //       title: '成功',
      //       message: '正在打印...',
      //       type: 'success'
      //     })
      //     data.forEach(element => {
      //       this.common.print('view', 'ArrearagePrint', '', element, this);
      //     });
      //   })
      this.printShow = false
    },
    // 弹窗打印
    addPrintAll (arr) {
      let params = {
        busicode: "ArrearagePrint",
        data: { pUserNos: arr, printDate: this.printForm.printDate, paymentDate: this.printForm.paymentDate
        ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
        beginAccountPeriod:this.tableQuery.beginAccountPeriod,
          endAccountPeriod:this.tableQuery.endAccountPeriod}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'ArrearagePrint', '', data[i], this);
        }
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
      })

    },
    async addPrintOne (arr, num) {
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
            busicode: "ArrearagePrint",
            data: { pUserNos: param, printDate: this.printForm.printDate, paymentDate: this.printForm.paymentDate 
            ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
            beginAccountPeriod:this.tableQuery.beginAccountPeriod,
          endAccountPeriod:this.tableQuery.endAccountPeriod}
          };

          let data = await this.$api.fetch({ params: params })
          for (let i = 0; i < data.length; i++) {
            this.common.printOne('view', 'ArrearagePrint', '', data[i], this);
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
                busicode: "ArrearagePrint",
                data: { pUserNos: param, printDate: this.printForm.printDate, paymentDate: this.printForm.paymentDate
                ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
                beginAccountPeriod:this.tableQuery.beginAccountPeriod,
                endAccountPeriod:this.tableQuery.endAccountPeriod}
              };

              let data = await this.$api.fetch({ params: params })
              for (let i = 0; i < data.length; i++) {
                this.common.printOne('view', 'ArrearagePrint', '', data[i], this);
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
    handleClick (tab, event) {
      this.$set(this.crumbsData.titleList, "3", {
        title: tab.label,
        method: () => {
          window.histroy.back();
        }
      });
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
    changeMeterReadingStaff () {
      // if (this.tableQuery.meterReadingStaff) {
      //   this.meterReaderList.forEach(v => {
      //     v.userInfos.forEach(res => {
      //       if (res.userAccount == this.tableQuery.meterReadingStaff) {
      //         this.tableQuery.meterReadingStaffName = res.userName
      //       }
      //     })
      //   })
      // } else {
      //   this.tableQuery.meterReadingStaffName = ''
      // }

      this.getBooks();
    },
    getBooks () {
      // if (this.tableQuery.meterReadingStaffName){
      // if (this.tableQuery.meterReadingStaffName == null || this.tableQuery.meterReadingStaffName == undefined) {
      //   this.tableQuery.meterReadingStaffName = ''
      // }
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
      // }else {
      //   this.bookNos = [];
      //   this.showbookNosData = [];
      // }
    },
    demand () {
      //查询
      this.tableQuery.page = 1
      this.init();
    },
    // 导出按钮
    exportExcel () {
      var _this = this
      var data = JSON.parse(JSON.stringify(_this.tableQuery))
      data.page = 1;
      data.pageCount = 999999;
      var params = {
        busicode: "ArrearagePrintExport",
        data: data,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      // 入参不需要分页
      delete params.data.page
      delete params.data.pageCount
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
      // window.open('http://localhost:8088/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 获取当前列表勾选的数据
    getSelectData (itemList) {
      this.selectData = itemList
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
      this.tableQuery.page = val
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
        //   $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
      }
      this.$nextTick(() => {
        this.common.changeTable(this, ".ArrearageCollection ", [
          ".ArrearageCollection .toolbar",
          ".ArrearageCollection .block",
          ".ArrearageCollection .bread-contain",
          ".ArrearageCollection .toggle-btn"
        ]);
        this.maxHeight = this.maxHeight - 3
      })
    },
    //获取参数是否需要弹窗
    getIsNeedWindow () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'ArrearageCollection_OR_NOT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length && res.list[0].configValue === "1") {//为1则打印需要弹窗
            this.isNeedWindow = true;
          }
        })
    },
    printClose () {
      this.printShow = false
    },
    // 停水通知打印
    PrintNotice(){
      this.printType = "1";
      if (this.isNeedWindow) {
        if (this.selectData.length != 0) {
          this.printShow = true
        } else {
          this.$message({
            showClose: true,
            message: '请勾选要打印的数据！',
            type: 'error'
          });
        }
      } else {
        let arr = [];
        this.selectData.forEach(function (element) { arr.push({ userNo: element.userNo, accountPeriod: element.endAccountPeriod }) });
        if (this.printMethodYype == 0) {
          this.printNoticeAll(arr)
        } else {
          this.printNoticeOne(arr, this.printMethodYype)
        }
      }
    },
    printNoticeAll (arr) {
      let params = {
        busicode: "ArrearagePrint",
        data: { pUserNos: arr ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,
        costNos:this.tableQuery.costNos,
        beginAccountPeriod:this.tableQuery.beginAccountPeriod,endAccountPeriod:this.tableQuery.endAccountPeriod}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'ArrearageWaterPrint', '', data[i], this);
        }
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
      })

    },
    async printNoticeOne (arr, num) {
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
            busicode: "ArrearagePrint",
            data: { pUserNos: param ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
            beginAccountPeriod:this.tableQuery.beginAccountPeriod,endAccountPeriod:this.tableQuery.endAccountPeriod}
          };

          let data = await this.$api.fetch({ params: params })
          for (let i = 0; i < data.length; i++) {
            this.common.printOne('view', 'ArrearageWaterPrint', '', data[i], this);
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
                busicode: "ArrearagePrint",
                data: { pUserNos: param ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
                beginAccountPeriod:this.tableQuery.beginAccountPeriod,endAccountPeriod:this.tableQuery.endAccountPeriod}
              };

              let data = await this.$api.fetch({ params: params })
              for (let i = 0; i < data.length; i++) {
                this.common.printOne('view', 'ArrearageWaterPrint', '', data[i], this);
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
    addPrintWaterAll (arr) {
      let params = {
        busicode: "ArrearagePrint",
        data: { pUserNos: arr, printDate: this.printForm.printDate, paymentDate: this.printForm.paymentDate
        ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
        beginAccountPeriod:this.tableQuery.beginAccountPeriod,
          endAccountPeriod:this.tableQuery.endAccountPeriod}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'ArrearageWaterPrint', '', data[i], this);
        }
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
      })

    },
    async addPrintWaterOne (arr, num) {
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
            busicode: "ArrearagePrint",
            data: { pUserNos: param, printDate: this.printForm.printDate, paymentDate: this.printForm.paymentDate 
            ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
            beginAccountPeriod:this.tableQuery.beginAccountPeriod,
          endAccountPeriod:this.tableQuery.endAccountPeriod}
          };

          let data = await this.$api.fetch({ params: params })
          for (let i = 0; i < data.length; i++) {
            this.common.printOne('view', 'ArrearageWaterPrint', '', data[i], this);
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
                busicode: "ArrearagePrint",
                data: { pUserNos: param, printDate: this.printForm.printDate, paymentDate: this.printForm.paymentDate
                ,sortOrder:this.tableQuery.sortOrder,sortField:this.tableQuery.sortField,costNos:this.tableQuery.costNos,
                beginAccountPeriod:this.tableQuery.beginAccountPeriod,
                endAccountPeriod:this.tableQuery.endAccountPeriod}
              };

              let data = await this.$api.fetch({ params: params })
              for (let i = 0; i < data.length; i++) {
                this.common.printOne('view', 'ArrearageWaterPrint', '', data[i], this);
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
.ArrearageCollection {
  width: 100%;
  height: 100%;
  .separator{
    line-height: 25px;
  }
  .kl-table {
    margin-top: 15px;
  }
  .pageDisableStyle {
    color: #c0c4cc;
  }
  .pageBlock {
    text-align: center;
  }
  /deep/ {
    .advancedQuery {
      .waterType {
        width: 300px;
        .el-form-item__content {
          width: 75%;
          .el-cascader {
            width: 100%;
            .el-input__inner {
              width: 100%;
            }
          }
        }
      }
      .waterReadData {
          .el-date-editor{
              width: 330px !important;
          }
      }
    }
    .collectQuery{
        .el-date-editor {
          .el-input__inner{
            width: 155px !important;
          }
        }
      .searchInput {
        width: 405px;
        .el-form-item__content {
        width: 330px;
      }
    }
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

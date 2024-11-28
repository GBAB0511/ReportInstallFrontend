<template>
  <!-- 收费查询 -->
  <div class="ChargeReportOfFlowDetail">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="print" size="mini" icon="el-icon-upload2" type="primary">收据打印</el-button>
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left">

          <el-form-item label="缴费日期：" class="width-250">
            <el-date-picker v-model="DateChoosevalue" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="缴费方式：" class="width-150">
            <el-select ref="select1" clearable v-model="tableQuery.payMethod" placeholder>
              <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="缴费渠道：" class="width-150">
            <el-select ref="select3" clearable v-model="tableQuery.payChannel" placeholder>
              <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="收费方向：">
            <el-select clearable v-model="tableQuery.cancelFlag" placeholder>
              <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="收费类型：" class="width-150">
            <el-select clearable v-model="tableQuery.payType" placeholder>
              <el-option v-for="(item,index) in dictionaryData.CHT" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="用水类型：" class="width-250">
            <el-cascader v-model="tableQuery.waterTypeId" :options="useWaterTypeOptions" :show-all-levels="false" :props="tprops" clearable @change="(val) => changeWaterType(val)"></el-cascader>
          </el-form-item>
          <el-form-item label="营业区域：" class="width-150">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea" :show-all-levels="false" :props="props" @change="(val) => changeBusinessArea(val)">
            </el-cascader>
          </el-form-item>

          <el-form-item label="收费员：" class="width-150">
            <el-select filterable ref="select4" clearable v-model="tableQuery.chargeStaffName" placeholder="全部">
              <el-option v-for="item in chargingStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="册本号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号" clearable @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item label="抄表员：" class="width-100">
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.meterReadingStaff" placeholder="请输入抄表员"></el-input> -->
            <el-select ref="select1" v-model="tableQuery.meterReadingStaffName" placeholder="请选择" clearable @keydown.enter.native="search">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="营业厅：" v-if="businessHallButton" class="width-150">
            <el-select ref="businessHall" clearable v-model="tableQuery.businessHallId" placeholder="营业厅">
              <el-option v-for="item in businessHallOptions" :key="item.id" :label="item.hallName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="批次号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.serialNo" placeholder="请输入批次号" clearable @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-200">
            <el-tooltip class="item" effect="dark" content="客户编号、账户编号、用户编号、客户名称、地址" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" border show-summary :summary-method='getTotal' @selection-change="getSelectData" :data="tableData.list" class="ChargeReportOfFlowDetail-table">
          <el-table-column type="selection" width="55" fixed="left"></el-table-column>
          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="payTime" min-width="160" label="收费时间" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payChannel" min-width="80" label="收费渠道" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payWay" min-width="80" label="收费方式" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payTypeName" min-width="80" label="收费类型" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column prop="serialNo" min-width="150" label="批次号" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="serialNo" min-width="150" label="批次号" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.serialNo}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="transactionMoney" min-width="110" label="交易金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="chargingStaff" min-width="100" label="收费员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="comments" min-width="80" label="备注" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="priorBalance" min-width="85" label="期初预存" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsMoney" min-width="100" label="销账金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="currendBalance" min-width="85" label="期末余额" show-overflow-tooltip align="right">
          </el-table-column>

          <!-- <el-table-column prop="ctmNo" min-width="85" label="客户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountNo" min-width="85" label="账户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="userNo" min-width="85" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="addr" min-width="120" label="用水地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="rushFlag" min-width="60" label="冲正" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="100" label="用水性质" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="calculateWater" min-width="100" label="水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="money" min-width="110" label="合计费用" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="synthesizeWaterFee" min-width="100" label="综合水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column :label="item.costName" min-width="120" align="right" v-for="(item,index) in costNameList" :key="'info_'+index" :render-header="(h, obj) => renderHeader(h, obj, 'cost', item.costName, item.costNo)" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="100" label="违约金" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="ycMoney" min-width="100" label="预存" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsMonth" min-width="100" label="实收月份" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="receivableMonth" min-width="100" label="应收月份" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billType" min-width="100" label="应收方式" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="businessArea" min-width="100" label="所属公司" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="receivableComments" min-width="100" label="应收备注" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="userStatus" min-width="100" label="用户状态" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="vatFlag" min-width="60" label="是否增值税" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="zpInvoiceNo" min-width="100" label="专票票号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="dzInvoiceNo" min-width="100" label="电子发票号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="zzInvoiceNo" min-width="100" label="垃圾票号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterType" min-width="100" label="水表类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column :key="priceIndex" min-width="80" align="right" :label="(priceIndex)+'阶单价'" v-for='priceIndex in level' :render-header="(h, obj) => renderHeader(h, obj, 'price', priceIndex,'')" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;">{{ scope.row['priceJ'+priceIndex] }}</span>
            </template>
          </el-table-column>

          <el-table-column :key="waterIndex" min-width="110" align="right" :label="(waterIndex)+'阶水量'" v-for='waterIndex in level' :render-header="(h, obj) => renderHeader(h, obj, 'water', waterIndex,'')" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;">{{scope.row['waterJ'+waterIndex] }}</span>
            </template>
          </el-table-column>

          <el-table-column :key="moneyIndex" min-width="110" align="right" :label="(moneyIndex)+'阶金额'" v-for='moneyIndex in level' :render-header="(h, obj) => renderHeader(h, obj, 'money', moneyIndex,'')" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;">{{ scope.row['moneyJ'+moneyIndex] }}</span>
            </template>
          </el-table-column> -->

        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>

    <el-dialog title="缴费详情" :visible.sync="showDetail" class="common-dialog" @close="detailClose">
      <div class="detailQuery">
        <p class="sumCharge" v-html="detailCharge"></p>
        <el-button @click="serialNoExport" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
        <el-table stripe border :data="detailList" :span-method="arraySpanMethod" class="">
          <el-table-column prop="ctmNo" min-width="100" label="客户编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accountNo" min-width="100" label="账户编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accountPeriod" min-width="80" label="账单年月"></el-table-column>
          <el-table-column prop="costName" min-width="80" label="收费类型"></el-table-column>
          <el-table-column prop="proceedsMoney" min-width="80" label="金额" align="right"></el-table-column>
          <el-table-column prop="penaltyMoney" min-width="80" label="违约金" align="right"></el-table-column>
          <el-table-column prop="invoiceNo" min-width="80" label="发票编号"></el-table-column>
          <el-table-column prop="sumMoney" min-width="80" label="合计金额" align="right"></el-table-column>
          <el-table-column prop="chargeTime" min-width="120" label="销账时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: "ChargeReportOfFlowDetail",
  props: ['fuzzyQuery'],
  components: {

  },
  data () {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      // 收费详情显示与隐藏
      showDetail: false,
      // isNot: [{ label: "全部", value: '' }, { label: "收费", value: '0' }, { label: "取消收费", value: '1' }, { label: "实收减免", value: '2' }],
      isNot: [{ label: "全部", value: '' }, { label: "收费", value: '0' }, { label: "取消收费", value: '1' }],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      tprops: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      level: 0,
      //用水类型
      useWaterTypeOptions: [],
      businessArea: [],
      selectData: [],
      // 列表数据
      tableData: {},
      totalData: {},
      // 抄表员下拉选择数据
      postUsers: [],

      costNameList: [],
      //数据字典存值
      dictionaryData: {},
      chargingStaffList: [],

      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startDate: this.common.date(),//开始日期,
        endDate: this.common.date(),//结束日期
        chargeStaffName: '',
        fuzzyQuery: '',
        payChannel: '',
        businessArea: '',
        waterTypeId: '',
        payMethod: '',
        bookNo: '',
        meterReadingStaffName: '',
        businessHallId: '',
        cancelFlag: '',
        serialNo: '',
        payType: '',//收费类型
      },
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [this.common.date(), this.common.date()],
      businessHallOptions: [],//营业厅 下拉框
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "收费查询" }]
      },
      tableShow: false,
      maxHeight: 0,
      businessHallButton: false,
      detailCharge: "", // 缴费详情总额
      detailList: [], // 缴费详情列表
      detailQuery: {
        serialNo: "",
        sumTransactionMoney: "",
        payType: "",
      }, // 缴费详情查询条件
    };
  },
  mounted () {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    this.showBusinessHall()
    this.getDictionary()
    this.getchargStaff();
    this.businessAreaSelect();
    this.SelectUseWaterTypeOptions()
    this.getPostUser()
    this.selectBusinessHall();
    this.tableQuery.fuzzyQuery = this.fuzzyQuery
    // let time = new Date()
    // let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    // let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    // this.tableQuery.accountPeriod = time.getFullYear() + month
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfFlowDetail", [
      ".ChargeReportOfFlowDetail .toolbar",
      ".ChargeReportOfFlowDetail .block",
      '.ChargeReportOfFlowDetail .bread-contain'
    ]);
  },
  methods: {

    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
      }
    },
    getPostUser () {
      const params = {
        busicode: 'PostUserSelect',
        data: {
          postNo: '2'
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.postUsers = res
      })
    },
    // 列表初始化
    init () {
      let _this = this
      let queryData = JSON.parse(JSON.stringify(this.tableQuery))
      delete queryData.payType; // 暂时不用
      _this.costNamelist = []
      _this.level = 0
      _this.totalData = {}


      let params = {
        busicode: "FlowDetailReport",
        data: queryData
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        if(res && Object.keys(res).length > 0){
          _this.tableData = res.pageInfo
          _this.costNameList = res.costList
          _this.level = res.level
          _this.totalData = res.total

          // for (let i = _this.tableData.list.length - 1; i > 0; i--) {

          // // 设置初始值
          // if (!_this.tableData.list[i].rowspan) {
          //   _this.tableData.list[i].rowspan = 0;
          // }
          // if (!_this.tableData.list[i].dateRowspan) {
          //   _this.tableData.list[i].dateRowspan = 0;
          // }

          // if (_this.tableData.list[i].serialNo == _this.tableData.list[i - 1].serialNo) {
          //   // 设置rowspan
          //   if (_this.tableData.list[i].rowspan == 0) {
          //     _this.tableData.list[i].rowspan = 1;
          //   }
          //   _this.tableData.list[i - 1].rowspan = (_this.tableData.list[i].rowspan || 0) + 1;
          //   _this.tableData.list[i].rowspan = 0;

          // } else {
          //   if (_this.tableData.list[i].rowspan == 0) {
          //     _this.tableData.list[i].rowspan = 1;
          //   }
          // }
          // }
          //当第一条不是合并数据
          // if (!_this.tableData.list[0].rowspan) {
          // _this.tableData.list[0].rowspan = 1
          // }
          // let index = 0
          // for (let i = 0; i < _this.tableData.list.length; i++) {
          // if (_this.tableData.list[i].rowspan && _this.tableData.list[i].rowspan > 0) {
          //   this.tableData.list[i].index = (this.tableQuery.page - 1) * this.tableQuery.pageCount + (++index)
          // }

          // }
        }else{
          _this.tableData.list = [];
        }

        this.$nextTick(() => {
          this.common.changeTable(this, ".ChargeReportOfFlowDetail", [
            ".ChargeReportOfFlowDetail .toolbar",
            ".ChargeReportOfFlowDetail .block",
            '.ChargeReportOfFlowDetail .bread-contain'
          ]);
        })
      })
    },
    getSpanArr ({ row, column, rowIndex, columnIndex }) {
      if ((column.type === "selection" || column.label === "NO." || column.label === "收费时间" || column.label === "收费渠道"
        || column.label === "收费方式" || column.label === '收费类型' || column.label === "批次号"
        || column.label === "交易金额" || column.label === "收费员" || column.label === "备注"
        || column.label === "期初预存" || column.label === "销账金额" || column.label === "期末余额"
      )) {
        return {
          rowspan: row.rowspan !== 0 ? row.rowspan || 1 : 0,
          colspan: 1,
        };
      }
    },

    changeWaterType (val) {
      this.tableQuery.waterTypeId = this.common.handleTreeData(val);
    },
    changeBusinessArea (val) {
      this.tableQuery.businessArea = this.common.handleTreeData(val);
    },
    businessAreaSelect () {   //营业所下拉框
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
        _this.businessArea = data.children;
      })
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
    getSelectData (data) {
      this.selectData = []
      if (data.length > 0) {
        data.forEach((item) => {
          this.selectData.push(item.serialNo)
        })
      }
    },
    //获取营业厅 显示配置
    showBusinessHall () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'business_hall_condition_shaw',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length > 0) {
            this.businessHallButton = res.list[0].configValue == 1 ? true : false;
          }
        })
    },
    //营业厅下拉框
    selectBusinessHall () {
      let params = {
        "busicode": "BaseBusinessHallList",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.businessHallOptions = res;
      })
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions () {
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.useWaterTypeOptions = data;
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
    // 返回合计数据
    getTotal (total) {
      let arr = []
      let {columns, data} = total;
      columns.forEach((item, index) => {
        let exist = false;
        if(index == 0){
          arr.push('合计')
        }else if(item.property == 'payTime'){
          arr.push('')
        }else {
          for(let key in this.totalData){
            if(key == 'costList' && this.totalData.costList){
              this.totalData.costList.forEach(list => {
                if(item.property == list.costNo){
                  arr.push(list.money)
                  exist = true;
                }
              })
            }else if(key === item.property){
              arr.push(this.totalData[key]);
              exist = true;
            }
          }
          if(!exist){ // totalData中没有对应的值则为空
            arr.push('');
          }
        }
      })
      return arr
    },
    renderHeader(h, { column, $index }, type, name, data) {
      if(type == 'cost'){
        column.property = data;
        return name;
      }else if(type == 'price'){
        column.property = 'priceJ'+name;
        return name+'阶单价';
      }else if(type == 'water'){
        column.property = 'waterJ'+name;
        return name+'阶水量';
      }else if(type == 'money'){
        column.property = 'moneyJ'+name;
        return name+'阶金额';
      }
    },

    // 导出
    exportExcel () {
      let params = {
        "busicode": "FlowDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    print () {
      //ReceivableMoneyPrint
      if (this.selectData.length > 0) {


        let params = {
          busicode: "ReceivableMoneyPrint",
          data: { serialNos: this.selectData }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            let data = res
            this.$notify({
              title: '成功',
              message: '正在打印...',
              type: 'success'
            })
            data.forEach(element => {
              this.common.print('view', 'ReceiptPrint', '', element, this);
            });
          })
      } else {
        this.$notify({
          title: '错误',
          message: '未获取到需打印数据...',
          type: 'error'
        })
      }
    },

    // 查询
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 数据字典
    getDictionary () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "DAILY_CHT,BPI,BPC,CHT"//收费类型、缴费方式
      };
      this.$api.fetch({
        params: dictionaryDataParams
      }).then(res => {
        res.DAILY_CHT = [...[{ name: "全部", value: "" }], ...res.DAILY_CHT]
        res.BPI = [...[{ name: "全部", value: "" }], ...res.BPI]
        res.BPC = [...[{ name: "全部", value: "" }], ...res.BPC]
        res.CHT = [...[{ name: "全部", value: "" }], ...res.CHT]
        console.log(res);
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },

    // 收费员下拉框
    getchargStaff () {
      var _this = this
      var params = {
        "busicode": "PostUserSelect",
        "data": { postNo: "1" }// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        res = [...[{ userName: "全部", userAccount: "" }], ...res]
        _this.chargingStaffList = res
      })
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
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      const arr = ['transactionMoney', 'proceedsMoney', 'calculateWater', 'money', 'penaltyMoney']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (!arr.includes(column.property)) {
          sums[index] = ''
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {

              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = 'N/A';
        }
      });

      return sums;
    },

    // 收费详情
    handleDetail({serialNo,sumTransactionMoney, payType}) {
      console.log(serialNo,sumTransactionMoney, payType)
      this.detailQuery.serialNo = serialNo;
      this.detailQuery.sumTransactionMoney = sumTransactionMoney || "";
      this.detailQuery.payType = payType;
      this.detailList = []
      this.detailCharge = ''
      this.showDetail = true
      let params = {
        busicode: "PayDayListBySerialNo",
        data: {
          serialNo,
          "sumTransactionMoney": sumTransactionMoney === undefined ? "" :sumTransactionMoney,
          payType
        }
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
    // 收费详情合并列
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
    detailClose(){
      this.detailQuery.serialNo = "";
      this.detailQuery.sumTransactionMoney =  "";
      this.detailQuery.payType = "";
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
    serialNoExport(){
      let params = {
        "busicode": "PayDayListBySerialNoExport",
        "data": this.detailQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      console.log('params', params)
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfFlowDetail {
  width: 100%;
  height: 100%;
  .index-page {
    height: calc(100% - 41px);
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
  .sumCharge{
    padding: 10px;
  }
  .detailQuery{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
  }
}
</style>

<template>
  <!-- 应收统计表 -->
  <div class="ChargeReportOfReceivablesStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left ">
       <!-- <el-row>
          <el-col :span="6">-->
            <el-form-item label="账期：" class="width-100" label-width="40px" style="white-space:nowrap;">
              <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
            </el-form-item>
            <el-form-item label='开账时间：' class="width-250" label-width="70px" style="white-space:nowrap;">
              <el-date-picker v-model="openAccountDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          <!--</el-col>
          <el-col :span="6">-->
            <el-form-item label='销账时间：' class="width-250" label-width="70px" style="white-space:nowrap;">
              <el-date-picker v-model="chargeTime" @change="getDatePickerCharge" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="统计方式：" class="width-100" label-width="70px" style="white-space:nowrap;">
              <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="请选择">
                <el-option
                  v-for="item in statisticsWayData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
          </el-form-item>

          <el-form-item>
              <el-checkbox v-model="tableQuery.showEndLevel" @change="handleShowEndLevel">显示末级</el-checkbox>
          </el-form-item>
         <!-- </el-col>
          <el-col :span="6">-->
         <!-- </el-col>
          <el-col :span="6">-->
            <el-form-item label="营业区域："  class="width-100">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
                           :show-all-levels="false" :props="tprops" @change="changeBusinessArea" class="shouldWater">
              </el-cascader>
            </el-form-item>
        <!--  </el-col>
        </el-row>-->
        <!-- <el-row>
          <el-col :span="3"> -->
            <el-form-item label="抄表员：" class="width-100" label-width="55px" style="white-space:nowrap;">
              <el-select v-model="tableQuery.meterReadingStaffName" placeholder="请选择" @change="changeMeterReadingStaff"  clearable>
                <el-option-group
                  v-for="group in staffAccounts"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item >
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
            <el-form-item label="册本：" label-width="40px" style="white-space:nowrap;">
              <el-select v-model="tableQuery.bookNos" multiple placeholder="请选择" filterable clearable>
                <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
                <el-option-group
                  v-for="group in bookNos"
                  :key="group.index"
                  :label="group.areaStaffName">
                  <el-option
                    v-for="item in group.baseBookListVOList"
                    :key="item.index"
                    :label="item.bookNo"
                    :value="item.bookNo">
                    <span style="float: left">{{ item.bookNo }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
            <el-form-item label="销账状态：" class="width-100">
              <el-select v-model="tableQuery.chargingFlag" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="已销"></el-option>
                <el-option value="0" label="未销"></el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="6"> -->
            <el-form-item label="用水类型：" class="width-200">
              <el-cascader
                v-model="tableQuery.waterTypeId"
                :options="useWaterTypeOptions"
                :show-all-levels="false"
                clearable
                :props="props">
              </el-cascader>
            </el-form-item>
          <!-- </el-col> -->
           <el-form-item>
              <el-checkbox v-model="tableQuery.needFt">剔除分摊水量</el-checkbox>
          </el-form-item>
          <el-form-item label="缴费渠道：" class="width-150">
          <el-select  clearable v-model="tableQuery.payChannel" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费方式：" class="width-150">
          <el-select  clearable v-model="tableQuery.payMethod" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        <!-- </el-row> -->

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border show-summary :summary-method='getTotal'  :data="tableData.list" class="ChargeReportOfReceivablesStatistics-table"  ref="eltableCurrentRow">

          <el-table-column type="index" label="NO." width="50" fixed="left">
          </el-table-column>

          <el-table-column prop="chargingFlagName" min-width="120" label="销账状态" show-overflow-tooltip  >
          </el-table-column>

          <!-- <el-table-column prop="statisticsWay" min-width="200" label="统计方式" fixed="left" show-overflow-tooltip  >
          </el-table-column> -->
          <el-table-column v-if="showAreaDialog" prop="businessAreaName" label="营业区域" min-width="120">
          </el-table-column>
          <el-table-column v-if="showMeterReadingStaffDialog" prop="meterReadingStaffName" label="抄表员" min-width="120">
          </el-table-column>
          <el-table-column v-if="showBookNoDialog" prop="bookNo" label="表册" min-width="120">
          </el-table-column>
          <el-table-column v-if="showWaterTypeDialog" prop="waterTypeName" label="用水类型" min-width="120">
          </el-table-column>
          <el-table-column v-if="payWayDialog" prop="payWay" label="缴费方式" min-width="120">
          </el-table-column>


          <el-table-column prop="realityWater" min-width="120" label="应收水量"   show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="total" min-width="120" label="合计费用" show-overflow-tooltip align="right" >
          </el-table-column>
<!--          <el-table-column prop="subTotal" min-width="120" label="综合水费" show-overflow-tooltip align="right" >
          </el-table-column>


          <el-table-column prop="baseWaterTotal" min-width="120" label="基本水费" show-overflow-tooltip align="right" >
          </el-table-column>-->
          <el-table-column :prop="item.costAttr" :label="item.costName" min-width="150" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip align="right" >
            <template slot-scope="scope">
              <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ftFee" min-width="110" label="分摊费用" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="prefWater" min-width="110" label="优惠水量" show-overflow-tooltip align="right" >
          </el-table-column>
           <el-table-column prop="prefMoney" min-width="110" label="优惠金额" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="waterJ1" min-width="110" label="一阶水量" show-overflow-tooltip align="right" >
          </el-table-column>
           <el-table-column prop="priceJ1" min-width="110" label="一阶水价" show-overflow-tooltip align="right" >
          </el-table-column>
           <el-table-column prop="ladderJ1" min-width="110" label="一阶金额" show-overflow-tooltip align="right" >
          </el-table-column>

          <el-table-column prop="waterJ2" min-width="110" label="二阶水量" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="priceJ2" min-width="110" label="二阶水价" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="ladderJ2" min-width="110" label="二阶金额" show-overflow-tooltip align="right" >
          </el-table-column>

          <el-table-column prop="waterJ3" min-width="110" label="三阶水量" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="priceJ3" min-width="110" label="三阶水价" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="ladderJ3" min-width="110" label="三阶金额" show-overflow-tooltip align="right" >
          </el-table-column>

<!--          <el-table-column prop="waterJ4" min-width="110" label="四阶水量" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="priceJ4" min-width="110" label="四阶水价" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="ladderJ4" min-width="110" label="四阶金额" show-overflow-tooltip align="right" >
          </el-table-column>

          <el-table-column prop="waterJ5" min-width="110" label="五阶水量" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="priceJ5" min-width="110" label="五阶水价" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="ladderJ5" min-width="110" label="五阶金额" show-overflow-tooltip align="right" >
          </el-table-column>

          <el-table-column prop="waterJ6" min-width="110" label="六阶水量" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="priceJ6" min-width="110" label="六阶水价" show-overflow-tooltip align="right" >
          </el-table-column>
          <el-table-column prop="ladderJ6" min-width="110" label="六阶金额" show-overflow-tooltip align="right" >
          </el-table-column>-->

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right" >
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
        <!-- <div class="block">
          <div class="noteReminder chargeRemind"><span style="color:#606266;font-size:14px">合计金额：</span><span style="color:#30B110;font-size:14px">{{receivableMoney}}</span>；<span style="color:#606266;font-size:14px">笔数：</span><span style="color:#30B110;font-size:14px">{{calculateNum}}</span>；<span style="color:#606266;font-size:14px">水量：</span><span style="color:#30B110;font-size:14px">{{calculateWater}}</span></div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfReceivablesStatistics",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      // 列表数据
      tableData: {},
      totalData: {},
      costNameList:[],
      costNoList:[],
      bookNos:[],
      staffAccounts:[],
      openAccountDate: ["",""],
      chargeTime:'',
      businessAreaName:'',
      //查询条件对象
      tableQuery: {
        // page: 1,
        // pageCount: 20,
        bookNos:[],
        waterTypeId: '',
        businessArea:'',
        chargingFlag:"",
        meterReadingStaffName:'',
        // sort:'',
        statisticsWay: "1", // 统计方式
        showEndLevel:false,
        groupCode: localStorage.getItem('companyNo'),
        needFt: false,
        payChannel:'',
        payMethod:'',
        accountPeriod: "",
        startAccountPeriod: "",
        endAccountPeriod: "",
      },
      statisticsWayData: [
        { name: "营业区域", value: "1" },
        { name: "抄表员", value: "2" },
        { name: "表册", value: "3" },
        { name: "用水类型", value: "4" },
        { name: "缴费方式", value: "5" },
      ],
      showAreaDialog: true,
      showMeterReadingStaffDialog: false,
      showBookNoDialog: false,
      showWaterTypeDialog: false, //用水类型
      payWayDialog: false, // 缴费方式
      //展示的册本号
      // showbookNos: '',
      showbookNosData:[],
      // 查询条件日期
      Time: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      tprops:{
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      businessArea:[],//营业区域
      useWaterTypeOptions:[],//用水类型下拉框
      dictDataOptions:[],//水表分类下拉框
      //数据字典存值
      dictionaryData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "应收统计表" }]
      },
      tableShow: false,
      maxHeight: 0,
      selectList: [],
      // 收费提醒
      receivableMoney: 0,  // 应缴金额
      calculateNum: 0,// 笔数
      accountPeriods: [], // 账期集合
      calculateWater: 0, // 水量
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate()
    // this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    this.tableQuery.accountPeriod = time.getFullYear()+month;

    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfReceivablesStatistics .index-page", [
      ".ChargeReportOfReceivablesStatistics .toolbar",
      ".ChargeReportOfReceivablesStatistics .block",
    ]);
    this.SelectUseWaterTypeOptions()
    this.businessAreaSelect();
    this.getMeterReader();
    this.getDictionary();
    // this.getCostList();
    // this.getDictDataOptions();
  },
  created() {
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate();
    // this.openAccountDate = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];

  },
  computed: {
    showbookNos() {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
      if (this.tableQuery.meterReadingStaffName === '全部'){
        this.tableQuery.meterReadingStaffName = '';
      }
   /*   if (this.tableQuery.less === '<'){
        this.tableQuery.less = '&lt;'
      }
      if (this.tableQuery.lessMoney === '<'){
        this.tableQuery.lessMoney = '&lt;'
      }*/
      let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      let params = {
        busicode: "ReceivableSummaryReport",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        // _this.totalData = res.total
        _this.costNameList =res.costNameList
        if(_this.tableData.list){
          _this.tableData.list.forEach(item => {
          item.total = this.formatFloat(item.total)
          item.subTotal = this.formatFloat(item.subTotal)
          item.baseWaterTotal = this.formatFloat(item.baseWaterTotal)
          item.waterJ1 = this.removeZero(item.waterJ1)
          item.priceJ1 = this.removeZero(item.priceJ1)
          item.waterJ2 = this.removeZero(item.waterJ2)
          item.priceJ2 = this.removeZero(item.priceJ2)
          item.waterJ3 = this.removeZero(item.waterJ3)
          item.priceJ3 = this.removeZero(item.priceJ3)
          item.waterJ4 =this.removeZero(item.waterJ4)
          item.priceJ4 = this.removeZero(item.priceJ4)
          item.waterJ5 =this.removeZero(item.waterJ5)
          item.priceJ5 = this.removeZero(item.priceJ5)
          item.waterJ6 =this.removeZero(item.waterJ6)
          item.priceJ6 = this.removeZero(item.priceJ6)
          if (item.priceJ1!=="") {
            item.priceJ1 = this.formatFloat(item.priceJ1)
          }
          if (item.priceJ2!=="") {
            item.priceJ2 = this.formatFloat(item.priceJ2)
          }
          if (item.priceJ3!=="") {
            item.priceJ3 = this.formatFloat(item.priceJ3)
          }
          if (item.priceJ4!=="") {
            item.priceJ4 = this.formatFloat(item.priceJ4)
          }
          if (item.priceJ5!=="") {
            item.priceJ5 = this.formatFloat(item.priceJ5)
          }
          if (item.priceJ6!=="") {
            item.priceJ6 = this.formatFloat(item.priceJ6)
          }
          item.costList.forEach(child => {
            child.money = this.formatFloat(child.money)
          })
          item.penaltyMoney = this.formatFloat(item.penaltyMoney)
        })
        }


        // _this.totalData.total = this.formatFloat(_this.totalData.total)
        // _this.totalData.subTotal = this.formatFloat(_this.totalData.subTotal)
        // _this.totalData.znFee = this.formatFloat(_this.totalData.znFee)
        // _this.totalData.ecFee = this.formatFloat(_this.totalData.ecFee)
        // _this.totalData.wsWater = this.formatFloat(_this.totalData.wsWater)
        // _this.totalData.bzsWater = this.formatFloat(_this.totalData.bzsWater)
        // _this.totalData.wasteFee = this.formatFloat(_this.totalData.wasteFee)
        // _this.totalData.baseWaterTotal = this.formatFloat(_this.totalData.baseWaterTotal)
        // _this.totalData.penaltyMoney = this.formatFloat(_this.totalData.penaltyMoney)

      })
    },

    // 查询
    search() {
    //   this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.startAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
      }
    },
    changeBusinessArea(){
      if (this.tableQuery.businessArea){
        this.getBooks();
      }else {
        this.bookNos = [];
      }
      this.getMeterReader();

    },
    changeMeterReadingStaff(){
      this.getBooks();
    },
    getBooks(){
      // if (this.tableQuery.meterReadingStaffName){
        let params ={
          busicode:'baseAllBooks',
          data:{
            businessArea:this.tableQuery.businessArea,
            meterReadingStaff:this.tableQuery.meterReadingStaffName,
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
    getDatePickerCharge(date){
      if (date !== undefined && date !== null) {
        this.tableQuery.startChargeTime = date[0]
        this.tableQuery.endChargeTime = date[1]
      } else {
        this.tableQuery.startChargeTime = ''
        this.tableQuery.endChargeTime = ''
      }
    },
    // 数据字典
    getDictionary() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPI,BPC"//收费类型、缴费方式
      };
      this.$api.fetch({
        params: dictionaryDataParams
      }).then(res => {
        res.BPI = [...[{ name: "全部", value: "" }], ...res.BPI]
        res.BPC = [...[{ name: "全部", value: "" }], ...res.BPC]
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    // 获取水表分类下拉数据
    getDictDataOptions() {
      let params = {
        "busicode": "DictionarySelect",
        "data": 'MMT'
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
       this.dictDataOptions = res
      })
    },
    //抄表员下拉框数据
    getMeterReader() {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea:this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffAccounts = res;
        });
    },
    // 导出
    exportExcel() {
      // let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      // var bookNos = []
      // temQuery.bookNo.forEach((item,index)=>{
      //   this.showbookNosData.forEach(item1 => {
      //     if (temQuery.bookNo[index] == item1.bookNo) {
      //       bookNos.push(item1.bookNo);
      //     }
      //   });
      // })
      let params = {
        "busicode": "ReceivableSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      // params.data.bookNo = bookNos.toString()
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    getSort(sort){
      console.log(sort);
      if (sort.prop === '智能表改造费'){
        sort.prop = 'znFee'
      }else if (sort.prop === '二次供水服务费'){
        sort.prop = 'ecFee'
      }else if (sort.prop === "不征税自来水"){
        sort.prop = 'bzsWater'
      }else if (sort.prop === '污水费'){
        sort.prop = 'wsWater'
      }else if (sort.prop === '垃圾费'){
        sort.prop = 'wasteFee'
      }
      if (sort.prop === 'waterJ1' || sort.prop === 'priceJ1' || sort.prop === 'waterJ2' || sort.prop === 'priceJ2' || sort.prop === 'waterJ3' || sort.prop === 'priceJ3'
        || sort.prop === 'waterJ4' || sort.prop === 'priceJ4' || sort.prop === 'waterJ5' || sort.prop === 'priceJ5' || sort.prop === 'waterJ6' || sort.prop === 'priceJ6'){
        sort.prop = sort.prop.substring(0,5) + '_'+ sort.prop.substring(5);
      }
      if(sort.prop === 'ctmAddr'){
        sort.prop = 'ctm_addr'
      }else if (sort.prop === 'ctmName'){
        sort.prop = 'ctm_name'
      }
      if(sort.prop === 'chargeTime'){
        sort.prop = 'CHARGE_TIME'
      }
      if (sort.order === 'descending'){
        this.tableQuery.sort = 'a.' + sort.prop + ' DESC';
      }else if (sort.order === 'ascending'){
        this.tableQuery.sort = 'a.' + sort.prop + ' ASC';
      }else {
        this.tableQuery.sort = null;
      }
      this.init();
    },
     // 返回合计数据
    getTotal(param){
    //   let arr = ['合计', '']
    //   for (const key in this.totalData) {
    //     if (this.totalData[key] != '合计') {
    //       arr.push(this.totalData[key])
    //       /*if(key === 'costList') {
    //         this.totalData.costList.forEach(item=>{
    //             arr.push(item.money)
    //         })
    //       }*/
    //     }
    //   }
    //   console.log(arr);
    //   return arr

        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && column.property.indexOf('priceJ') == -1) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = this.formatFloat(sums[index]);
          } else {
            sums[index] = '';
          }
        });

        return sums;
    //   let vm = this;
    //   let sums = [];
    //   var selectedColm = param.columns;
    //   let newArray=['合计','']
    //   selectedColm.forEach(a => {
    //       if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
    //         newArray.push(vm.totalData[a.property])
    //       }else{
    //         if(a.property!=undefined){//序号列不push
    //           newArray.push('')
    //         }
    //       }
    //     });
    //   sums=newArray;
    //   sums[2] = ''
    //   return sums;
    },
    getCostList(){
      let params = {
        busicode: "CostList",
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.costNoList = res;
        });
    },
    businessAreaSelect() {   //营业所下拉框
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
    getArr1(data) {
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
    //用水类型下拉框
    SelectUseWaterTypeOptions() {
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
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    // 勾选
    getSelectList (e) {
      this.selectList = e
      this.receivableMoney = 0
      this.accountPeriods = []
      this.calculateNum = 0
      this.calculateWater = 0
      this.selectList.forEach(item => {
        this.receivableMoney += Number(item.total || 0)
        // let userAndAccountPeriod = {
        //   userNo: item.userNo,
        //   accountPeriod: item.accountPeriod
        // }
        // if (JSON.stringify(this.accountPeriods).indexOf(JSON.stringify(userAndAccountPeriod)) !== -1) {
        // } else {
        //   this.accountPeriods.push(userAndAccountPeriod)
        //   this.calculateNum++
        // }
        this.calculateNum++
        this.calculateWater += Number(item.realityWater || 0)
      })
      this.receivableMoney = this.receivableMoney.toFixed(2)   //保留两位小数
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
    cellStyle (data) {
      return "cursor:pointer;"
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
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    // 快捷查询
    toDetail(userNo){
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail'});
      sessionStorage.setItem('userNo',userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
    formatFloat(num){
      var value = Math.round(parseFloat(num) * 100 ) / 100;
      var arrayNum = value.toString().split(".");
      if (arrayNum.length == 1) {
        return value.toString() + ".00"
      }
      if (arrayNum.length > 1) {
        //小数点右侧 如果小于两位则补一个0
        if ( arrayNum[1].length < 2) {
          return value.toString() +"0" ;
        }
        return value;
      }
    },
    removeZero(value){
      if (value==0) {
        return value = ''
      }else{
        return value
      }
    },
    handleShowEndLevel(value){
      this.showEndLevel = value
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    Time(val) {
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    },
    "tableQuery.statisticsWay": {
      handler: function (newval, oldval) {
        // this.tableQuery.businessArea = "";
        // this.tableQuery.waterTypeId = "";
        this.tableData = [];
        this.totalData = {};
        if (newval == "1") {
          //营业区域
          this.showAreaDialog = true;
          this.showMeterReadingStaffDialog = false;
          this.showBookNoDialog = false;
          this.showWaterTypeDialog = false;
          this.payWayDialog = false
        } else if (newval == "2") {
          //抄表员
          this.showAreaDialog = false;
          this.showMeterReadingStaffDialog = true;
          this.showBookNoDialog = false;
          this.showWaterTypeDialog = false;
          this.payWayDialog = false
        } else if (newval == "3") {
          //表册
          this.showAreaDialog = false;
          this.showMeterReadingStaffDialog = false;
          this.showBookNoDialog = true;
          this.showWaterTypeDialog = false;
          this.payWayDialog = false
        }else if (newval == "4") {
          //用水类型
          this.showAreaDialog = false;
          this.showMeterReadingStaffDialog = false;
          this.showBookNoDialog = false;
          this.showWaterTypeDialog = true;
          this.payWayDialog = false
        }else if(newval == "5"){
          //缴费方式
          this.showAreaDialog = false;
          this.showMeterReadingStaffDialog = false;
          this.showBookNoDialog = false;
          this.showWaterTypeDialog = false;
          this.payWayDialog = true
        }
      },
      deep: true,
    },
  }
};
</script>
<style lang="scss" scoped>
.ChargeReportOfReceivablesStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 42px);
  }
}
/deep/{
  .el-table {
    .el-table__fixed { // 左固定列
      height: auto !important;
    }
    .el-table__fixed-right { // 右固定列
      height: auto !important;
    }
    .el-table__body-wrapper{
      z-index: 2;
    }
  }
}

/deep/{
  // 第一行
  .item{
    width: 22%;
    .el-form-item__content{
      width: calc(100% - 73px);
    }
  }
  .dateAndTime{
    width: 25%;
    .el-form-item__content{
      width: 75%;
      .el-date-editor{
        width: 100%;
      }
    }
  }
  .shouldWater{
    width: 100%;
    .el-input__inner{
      width: 100%;
    }
  }

  // 第二行
  .el-col-3{
    width: auto;
  }

  // 第三行
  .shouldWaterInput{
    width: auto;
  }
}
.userNo >>> .el-input__inner{
  width: 100%;
}
.chargeRemind {
  margin-left: 50px;
  .el-form-item__content {
    color: #606266;
  }
}
.noteReminder {
  width: 30%;
  float: left;
  text-align: left !important;
  line-height: 32px;
}
/deep/{
    .el-table__body .el-table__row{
      td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
        .cell{
          text-align: right !important;
        }
      }
    }
    .el-table__header{
      th:nth-child(5),th:nth-child(6),th:nth-child(13),th:nth-child(29),th:nth-child(30),th:nth-child(31),th:nth-child(32),th:nth-child(33),th:nth-child(34){
        .cell{
          text-align: right !important;
        }
      }
    }
    .el-table__footer{
      td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
        .cell{
          text-align: right !important;
        }
      }
    }
  }
</style>

<style lang="scss">
.ChargeReportOfReceivablesStatistics {
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

<template>
  <!-- 实收明细 -->
  <div class="ChargeReportOfRealReceivablesDetailed">
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
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
       <!-- <el-row>
          <el-col :span="6">-->
            <el-form-item label='开账时间：' class="dateAndTime">
              <el-date-picker v-model="openAccountDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          <!--</el-col>
          <el-col :span="6">-->
            <el-form-item label='收费时间：' class="dateAndTime">
              <el-date-picker v-model="chargeTime" @change="getDatePickerCharge" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
         <!-- </el-col>
          <el-col :span="6">-->
            <el-form-item label="模糊查询：" class="item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="用户编号、客户名称" @keydown.enter.native="search" class="userNo"></el-input>
            </el-form-item>
         <!-- </el-col>
          <el-col :span="6">-->
            <el-form-item label="营业区域：" class="item">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
                           :show-all-levels="false" :props="tprops" @change="changeBusinessArea" class="shouldWater">
              </el-cascader>
            </el-form-item>
        <!--  </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="3">
            <el-form-item label="抄表员：">
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
          </el-col>
          <el-col :span="3">
            <el-form-item label="册本：">
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
          </el-col>
          <el-col :span="3">
            <el-form-item label="开账类型：">
              <el-select v-model="tableQuery.openType" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="0" label="正常"></el-option>
                <el-option value="1" label="红冲"></el-option>
                <el-option value="2" label="追加"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="3">
            <el-form-item label="销账状态：">
              <el-select v-model="tableQuery.chargingFlag" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="已销"></el-option>
                <el-option value="0" label="未销"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="3">
            <el-form-item label="是否税票：">
              <el-select v-model="tableQuery.vatFlag" placeholder="请选择" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用水类型：" >
              <el-cascader
                v-model="tableQuery.waterTypeId"
                :options="useWaterTypeOptions"
                :show-all-levels="false"
                clearable
                :props="props" class="shouldWater">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
          <el-form-item label="应收水量：">
            <el-select v-model="tableQuery.more" placeholder="请选择">
              <el-option
                v-for="item in moreOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldWaterAmountStart" placeholder="应收水量" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="tableQuery.less" placeholder="请选择">
              <el-option
                v-for="item in lessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldWaterAmountEnd" placeholder="应收水量" @keydown.enter.native="search" class="shouldWaterInput"></el-input>
          </el-form-item>
          <!-- <el-form-item label="应收水费：">
            <el-select v-model="tableQuery.moreMoney" placeholder="请选择">
              <el-option
                v-for="item in moreOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldAmountStart" placeholder="应收水费" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="tableQuery.lessMoney" placeholder="请选择">
              <el-option
                v-for="item in lessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldAmountEnd" placeholder="应收水费" class="shouldWaterInput"></el-input>
          </el-form-item> -->

        <el-form-item label="缴费方式：">
          <el-select ref="select1" clearable v-model="tableQuery.payWay" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="缴费渠道：">
          <el-select ref="select3" clearable v-model="tableQuery.payChannel" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="收费员：">
          <el-select filterable  ref="select4" clearable v-model="tableQuery.chargeStaffName" placeholder="全部">
            <el-option v-for="item in chargingStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" border show-summary :summary-method='getTotal'  @sort-change='getSort' :data="tableData.list" class="ChargeReportOfRealReceivablesDetailed-table" :span-method="arraySpanMethod">
          <el-table-column prop="index" label="NO." width="50" fixed="left">
          </el-table-column>

          <el-table-column prop="accountNo" min-width="170" label="账户编号" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="userNo" min-width="130" label="用户编号" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="250" label="客户名称" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ctmAddr" min-width="250" label="用户地址" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="businessArea" min-width="120" label="营业区域" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bookNo" min-width="140" label="册本号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="waterTypeName" min-width="200" label="用水类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="priorPeriodNum" min-width="80" label="上期始码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="currendPeriodNum" min-width="80" label="本期止码" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="realityWater" min-width="80" label="合计水量" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="priorPeriodBalance" min-width="120" label="上期预存" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="transactionMoney" min-width="120" label="本期预存" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="currendPeriodBalance" min-width="120" label="预存余额" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="chargeStaffName" min-width="100" label="收费员" fixed="left" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payWay" min-width="80" label="收费方式" fixed="left" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payChannel" min-width="80" label="收费渠道" fixed="left" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column prop="serialNo" min-width="240" label="预存余额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column> -->
          <el-table-column prop="processedMoney" min-width="120" label="实收金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="subTotal" min-width="120" label="综合水费" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="baseWaterTotal" min-width="120" label="基本水费" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

        

          <el-table-column :prop="item.costAttr" :label="item.costName" min-width="150" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
            <template slot-scope="scope">
              <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          
          <el-table-column prop="invoiceNo" min-width="180" label="发票号码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="invoiceAddr" min-width="280" label="电子发票地址" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="waterJ1" min-width="110" label="一阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
           <el-table-column prop="priceJ1" min-width="110" label="一阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
           <el-table-column prop="ladderJ1" min-width="110" label="一阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ2" min-width="110" label="二阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ2" min-width="110" label="二阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ2" min-width="110" label="二阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ3" min-width="110" label="三阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ3" min-width="110" label="三阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ3" min-width="110" label="三阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ4" min-width="110" label="四阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ4" min-width="110" label="四阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ4" min-width="110" label="四阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ5" min-width="110" label="五阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ5" min-width="110" label="五阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ5" min-width="110" label="五阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ6" min-width="110" label="六阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ6" min-width="110" label="六阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ6" min-width="110" label="六阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfRealReceivablesDetailed",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      moreOptions:[
        {
          value:"大于等于",
          label:"大于等于"
        },
        {
          value:"大于",
          label:"大于"
        },
        {
          value:"等于",
          label:"等于"
        },
      ],
      lessOptions:[
        {
          value:"小于等于",
          label:"小于等于"
        },
        {
          value:"小于",
          label:"小于"
        },
        {
          value:"等于",
          label:"等于"
        },
      ],
      // 列表数据
      tableData: {},
      totalData: {},
      costNameList:[],
      bookNos:[],
      staffAccounts:[],
      openAccountDate: [],
      chargeTime:'',
      businessAreaName:'',
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        bookNos:[], // 册本号
        fuzzyQuery:'', // 模糊查询
        waterTypeId: '', // 用水类型
        businessArea:'', // 营业区域
        // shouldAmountStart:'',
        // shouldAmountEnd:'',
        // chargingFlag:"",
        openType:'', // 开账类型
        vatFlag:'', // 是否税票
        shouldWaterAmountStart:"", // 应收水量
        shouldWaterAmountEnd:"", // 应收水量
        meterReadingStaffName:'', // 抄表员
        more:'大于等于', // 应收水量
        less:'小于', // 应收水量
        payWay:'', // 缴费方式
        payChannel:'', // 缴费渠道
        // moreMoney:'大于等于',
        // lessMoney:'小于',
        sort:'', // 排序
      },
      //展示的册本号
      // showbookNos: '',
      showbookNosData:[],
      //数据字典存值
      dictionaryData: {},
      chargingStaffList: [],
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
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "实收明细" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate()
    this.Time = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];

    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfRealReceivablesDetailed .index-page", [
      ".ChargeReportOfRealReceivablesDetailed .toolbar",
      ".ChargeReportOfRealReceivablesDetailed .block",
    ]);
    this.SelectUseWaterTypeOptions()
    this.businessAreaSelect();
    this.getMeterReader();
    this.getDictionary();
    this.getchargStaff();
  },
  created() {
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate();
    this.openAccountDate = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];

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
        busicode: "ActualReceiveDetailReport",
        data: this.tableQuery
      };
      params.data.groupCode = localStorage.getItem('companyNo')
      // var bookNos = []
      // temQuery.bookNo.forEach((item,index)=>{
      //   _this.showbookNosData.forEach(item1 => {
      //     if (temQuery.bookNo[index] == item1.bookNo) {
      //       bookNos.push(item1.bookNo);
      //     }
      //   });
      // })
      // params.data.bookNo = bookNos.toString()
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        _this.costNameList =res.costNameList
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

        _this.totalData.total  = this.formatFloat(_this.totalData.total)
        _this.totalData.subTotal = this.formatFloat(_this.totalData.subTotal)
        _this.totalData.znFee = this.formatFloat(_this.totalData.znFee)
        _this.totalData.ecFee = this.formatFloat(_this.totalData.ecFee)
        _this.totalData.wsWater = this.formatFloat(_this.totalData.wsWater)
        _this.totalData.bzsWater = this.formatFloat(_this.totalData.bzsWater)
        _this.totalData.wasteFee = this.formatFloat(_this.totalData.wasteFee)
        _this.totalData.baseWaterTotal = this.formatFloat(_this.totalData.baseWaterTotal)
        _this.totalData.penaltyMoney = this.formatFloat(_this.totalData.penaltyMoney)


        for (let i = this.tableData.list.length - 1; i > 0; i--) {
          // 设置初始值 其余信息合并
            if (!this.tableData.list[i].rowspan) {
              this.tableData.list[i].rowspan = 0;
            }
            // 当前rowspanMark相同时
            if (this.tableData.list[i].serialNo == this.tableData.list[i-1].serialNo) {
              // 设置rowspan
              if (this.tableData.list[i].rowspan == 0){
                this.tableData.list[i].rowspan = 1;
              }
              this.tableData.list[i-1].rowspan = this.tableData.list[i].rowspan + 1;
              this.tableData.list[i].rowspan = 0;
            } else {
              if (this.tableData.list[i].rowspan == 0){
                this.tableData.list[i].rowspan = 1;
              }
            }
        }
        //当第一条不是合并数据
        if (!this.tableData.list[0].rowspan) {
          this.tableData.list[0].rowspan = 1
        }

        let index = 0
        for (let i = 0; i < this.tableData.list.length; i++) {
          if(this.tableData.list[i].rowspan && this.tableData.list[i].rowspan > 0) {
            this.tableData.list[i].index = (this.tableQuery.page - 1) * this.tableQuery.pageCount + (++index)
          }
        }
        console.log(this.tableData);
      })
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
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
      let params = {
        "busicode": "ActualReceiveDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
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
      }else if(sort.prop === 'chargeTime'){
        sort.prop = 'CHARGE_TIME'
      }else if(sort.prop === 'priorPeriodBalance'){
        sort.prop = 'PRIOR_PERIOD_BALANCE'
      }else if(sort.prop === 'currendPeriodBalance'){
        sort.prop = 'CURREND_PERIOD_BALANCE'
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
      let vm = this;
      let sums = ['合计',''];
      var selectedColm = param.columns;
      let newArray=[]
      selectedColm.forEach(a => {
          if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.totalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      newArray[0]='合计'
      sums=newArray;
      return sums;
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === "NO." || column.label === "上期预存" || column.label === "本期预存" || column.label === "预存余额" || column.label === "账户编号" || column.label === "收费员" || column.label === "收费方式" || column.label === "收费渠道" 
           ) {
        if (row.rowspan != 0) {
          return {
            rowspan: row.rowspan || 1,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
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
      if (num != '') {
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
      }else{
        return num;
      }
      
    },
    removeZero(value){
      if (value==0) {
        return value = ''
      }else{
        return value
      }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.ChargeReportOfRealReceivablesDetailed {
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
// /deep/{
//     .el-table__body .el-table__row{
//       td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
//         .cell{
//           text-align: right !important;
//         }
//       }
//     }
//     .el-table__header{
//       th:nth-child(5),th:nth-child(6),th:nth-child(13),th:nth-child(29),th:nth-child(30),th:nth-child(31),th:nth-child(32),th:nth-child(33),th:nth-child(34){
//         .cell{
//           text-align: right !important;
//         }
//       }
//     }
//     .el-table__footer{
//       td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
//         .cell{
//           text-align: right !important;
//         }
//       }
//     }
//   }
</style>

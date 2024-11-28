<template>
  <!-- 用户明细表 -->
  <div class="OtherReportOfUserDetails">
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
          <!--</el-col>
          <el-col :span="6">-->
         <!-- </el-col>
          <el-col :span="6">-->
        <el-form-item label="用户编号：" class="item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" placeholder="" @keydown.enter.native="search" class="userNo"></el-input>
        </el-form-item>
            <el-form-item label="高级查询：" class="item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="客户名称、用户地址、手机号码等" @keydown.enter.native="search" class="userNo"></el-input>
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
					<el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-row>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" border  @sort-change='getSort' :data="tableData.list" class="OtherReportOfUserDetails-table" :span-method="arraySpanMethod">
          <el-table-column prop="index" label="NO." width="50" fixed="left">
          </el-table-column>
<el-table-column label="客户信息" align="center">
          <el-table-column prop="ctmInfoBean.ctmNo" min-width="170" label="客户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ctmInfoBean.ctmName" min-width="250" label="客户名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ctmInfoBean.ctmAddr" min-width="250" label="客户地址" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="ctmInfoBean.certTypeName" min-width="250" label="证件类型" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="ctmInfoBean.certNo" min-width="250" label="证件号码" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="ctmInfoBean.ctmTypeName" min-width="250" label="客户类型" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="ctmInfoBean.mobile" min-width="250" label="手机号码" show-overflow-tooltip>
          </el-table-column>
</el-table-column>
<el-table-column label="账户信息" align="center">
          <el-table-column prop="accountInfoBean.accountNo" min-width="170" label="账户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="accountInfoBean.invoiceTitle" min-width="250" label="开票名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="accountInfoBean.accountBalance" min-width="250" label="余额" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="accountInfoBean.invoiceTax" min-width="250" label="纳税识别号" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="accountInfoBean.invoiceAddr" min-width="250" label="联系地址" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="accountInfoBean.invoiceLink" min-width="250" label="座机号码" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="accountInfoBean.invoiceBank" min-width="250" label="开户银行" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="accountInfoBean.vatFlag" min-width="250" label="是否专票" show-overflow-tooltip>
						<template slot-scope="scope">
              <span v-if="scope.row.accountInfoBean.vatFlag == 1" style="color: #000;">是</span>
							<span v-else style="color: #000;">否</span>
            </template>
          </el-table-column>
					<el-table-column prop="accountInfoBean.openAccountBankName" min-width="250" label="缴费银行" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="accountInfoBean.bankAccount" min-width="250" label="缴费账户" show-overflow-tooltip>
          </el-table-column>
</el-table-column>
<el-table-column label="用户信息" align="center">
          <el-table-column prop="userNo" min-width="130" label="用户编号" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="setupMeterAddr" min-width="250" label="用水地址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="areaName" min-width="250" label="营业区域" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="bookNo" min-width="250" label="册本号" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="meterReadingStaffName" min-width="250" label="抄表员" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="yearWater" min-width="250" label="年累积量" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="lastReadingDate" min-width="250" label="最后抄表日期" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="lastReadingNum" min-width="250" label="最后抄码" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="openDate" min-width="250" label="立户日期" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="useWaterType" min-width="200" label="用水类型" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="status" min-width="250" label="用户状态" show-overflow-tooltip>
						<template slot-scope="scope">
              <span v-if="scope.row.status == 1" style="color: #000;">正常</span>
							<span v-else style="color: #000;">注销</span>
            </template>
          </el-table-column>
					<el-table-column prop="meterModelBean.factoryName" min-width="250" label="水表厂家" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="meterModelBean.modelName" min-width="250" label="水表型号" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="meterModelBean.meterBoreName" min-width="250" label="水表口径" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="meterModelBean.transWayName" min-width="250" label="通讯类型" show-overflow-tooltip>
          </el-table-column>
					<el-table-column prop="meterModelBean.valveControl" min-width="250" label="是否阀控" show-overflow-tooltip>
						<template slot-scope="scope">
							<span v-if="scope.row.meterModelBean.valveControl == undefined" style="color: #000;"></span>
              <span v-else-if="scope.row.meterModelBean.valveControl == 1" style="color: #000;">是</span>
							<span v-else style="color: #000;">否</span>
            </template>
          </el-table-column>
					<!-- <el-table-column prop="mobile" min-width="250" label="详情" show-overflow-tooltip>
          </el-table-column> -->
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
  name: "OtherReportOfUserDetails",
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
      bookNos:[],
      staffAccounts:[],
      openAccountDate: [],
      chargeTime:'',
      businessAreaName:'',
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo: '',// 用户编号
        bookNos:[], // 册本号
        fuzzyQuery:'', // 模糊查询
        waterTypeId: '', // 用水类型
        businessArea:'', // 营业区域
        meterReadingStaffName:'', // 抄表员
        // sort:'', // 排序
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
        titleList: [{ title: "收费管理报表" }, { title: "用户明细表" }]
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

    this.common.changeTable(this, ".OtherReportOfUserDetails .index-page", [
      ".OtherReportOfUserDetails .toolbar",
      ".OtherReportOfUserDetails .block",
    ]);
    this.SelectUseWaterTypeOptions()
    this.businessAreaSelect();
    this.getMeterReader();
    // this.getDictionary();
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
        busicode: "UserInfoDetailReport",
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
        _this.tableData = res

        for (let i = this.tableData.list.length - 1; i > 0; i--) {
          // 设置初始值 其余信息合并
					// 账户号
					 	if (!this.tableData.list[i].accountRowspan) {
              this.tableData.list[i].accountRowspan = 0;
            }
						// 客户号
            if (!this.tableData.list[i].ctmRowspan) {
              this.tableData.list[i].ctmRowspan = 0;
            }
						// 账户信息合并
            if (this.tableData.list[i].accountNo == this.tableData.list[i-1].accountNo) {
              // 设置rowspan
              if (this.tableData.list[i].accountRowspan == 0){
                this.tableData.list[i].accountRowspan = 1;
              }
              this.tableData.list[i-1].accountRowspan = this.tableData.list[i].accountRowspan + 1;
              this.tableData.list[i].accountRowspan = 0;
            } else {
              if (this.tableData.list[i].accountRowspan == 0){
                this.tableData.list[i].accountRowspan = 1;
              }
            }
            // 客户信息合并
            if (this.tableData.list[i].ctmNo == this.tableData.list[i-1].ctmNo) {
              // 设置rowspan
              if (this.tableData.list[i].ctmRowspan == 0){
                this.tableData.list[i].ctmRowspan = 1;
              }
              this.tableData.list[i-1].ctmRowspan = this.tableData.list[i].ctmRowspan + 1;
              this.tableData.list[i].ctmRowspan = 0;
            } else {
              if (this.tableData.list[i].ctmRowspan == 0){
                this.tableData.list[i].ctmRowspan = 1;
              }
            }
        }
        //当第一条不是合并数据
        if (!this.tableData.list[0].accountRowspan) {
          this.tableData.list[0].accountRowspan = 1
        }
				//当第一条不是合并数据
        if (!this.tableData.list[0].ctmRowspan) {
          this.tableData.list[0].ctmRowspan = 1
        }

        let index = 0
        for (let i = 0; i < this.tableData.list.length; i++) {
          if(this.tableData.list[i].ctmRowspan && this.tableData.list[i].ctmRowspan > 0) {
            this.tableData.list[i].index = (this.tableQuery.page - 1) * this.tableQuery.pageCount + (++index)
          }
        }
        console.log(this.tableData.list);
      })
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
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
        if (this.tableQuery.bookNos.length == 0){
        this.tableQuery.bookNos = null;
      }
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
      let sums = [];
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
      if (column.label === "NO." || column.label === "客户编号" || column.label === "客户名称" || column.label === "客户地址" || column.label === "证件类型" || column.label === "证件号码" || column.label === "客户类型" || column.label === "手机号码"  
           ) {
        if (row.ctmRowspan != 0) {
          return {
            rowspan: row.ctmRowspan || 1,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
			if (column.label === "账户编号" || column.label === "开票名称" || column.label === "余额" || column.label === "纳税识别号" || column.label === "联系地址" || column.label === "座机号码" || column.label === "开户银行" || column.label === "是否专票" || column.label === "缴费银行" || column.label === "缴费账户"    
           ) {
        if (row.accountRowspan != 0) {
          return {
            rowspan: row.accountRowspan || 1,
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
    // Time(val) {
    //   if(val && val.length > 0) {
    //     this.tableQuery.startAccountPeriod = val[0]
    //     this.tableQuery.endAccountPeriod = val[1]
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
.OtherReportOfUserDetails {
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

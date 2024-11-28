<template>
  <!-- 用户汇总表 -->
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
          <el-form-item label='开户时间：' class="dateAndTime">
              <el-date-picker v-model="openAccountDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>

          <el-form-item label="统计方式：">
              <el-select ref="select1" v-model="tableQuery.queryType" placeholder="请选择">
                <el-option
                  v-for="item in statisticsWayData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
          </el-form-item>
          
          <el-form-item v-if="!showMeterTypeDialog">
              <el-checkbox v-model="tableQuery.showEndLevel" @change="handleShowEndLevel">显示末级</el-checkbox>
          </el-form-item>

          <el-form-item label="营业区域：" class="item">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
              :show-all-levels="false" :props="tprops" @change="changeBusinessArea" class="shouldWater">
            </el-cascader>
          </el-form-item>

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

          <el-form-item label="用水类型：" >
            <el-cascader
              v-model="tableQuery.waterTypeId"
              :options="useWaterTypeOptions"
              :show-all-levels="false"
              clearable
              :props="props" class="shouldWater">
            </el-cascader>
          </el-form-item>
					<el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" border  :data="tableData" class="OtherReportOfUserDetails-table" >
          <el-table-column type="index" label="NO." width="50" fixed="left">
          </el-table-column>
          <!-- <el-table-column prop="queryType" label="统计方式" min-width="120">
          </el-table-column> -->
          <el-table-column v-if="showWaterTypeDialog" prop="userWaterTypeName" label="用水类型" min-width="120">
          </el-table-column>
          <el-table-column v-if="showMeterTypeDialog" prop="meterType" label="水表类型" min-width="120">
          </el-table-column>
          <!-- <el-table-column v-if="showAreaNoDialog" prop="areaName" label="营业区域" min-width="120">
          </el-table-column> -->
          <el-table-column prop="areaName" label="营业区域" min-width="120">
          </el-table-column>
          <el-table-column prop="status" label="用户状态" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" style="color: #000;">正常</span>
							<span v-else-if="scope.row.status == 0" style="color: #000;">注销</span>
              <span v-else style="color: #000;">停用</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCount" label="数量" min-width="120">
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
        <!-- <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div> -->
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
      tableData: [],
      totalData: {},
      costNameList:[],
      bookNos:[],
      staffAccounts:[],
      openAccountDate: [],
      // 统计方式下拉数据
      statisticsWayData: [
        { name: "用水类型", value: "1" },
        { name: "水表类型", value: "2" },
        { name: "营业区域", value: "3" },
      ],
      //查询条件对象
      tableQuery: {
        // page: 1,
        // pageCount: 20,
        // userNo: '',// 用户编号
        bookNos:[], // 册本号
        // fuzzyQuery:'', // 模糊查询
        waterTypeId: '', // 用水类型
        businessArea:'', // 营业区域
        meterReadingStaffName:'', // 抄表员
        // sort:'', // 排序
        queryType: "1", // 统计方式
        showEndLevel:false,
      },
      showWaterTypeDialog: true, //用水类型
      showMeterTypeDialog: false, //水表类型
      showAreaNoDialog: false, //营业区域
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
        titleList: [{ title: "收费管理报表" }, { title: "用户汇总表" }]
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
      if (this.tableQuery.openDateStart === ''){
        this.$message.error("请选择开户时间！")
        return
      }
      let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      let params = {
        busicode: "UserInfoSummaryReport",
        data: temQuery
      };
      if (params.data.queryType == '2') {
        delete params.data.showEndLevel
      }
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
        console.log(res);
        _this.tableData = res
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
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.openDateStart = date[0]
        this.tableQuery.openDateEnd = date[1]
      } else {
        this.tableQuery.openDateStart = ''
        this.tableQuery.openDateEnd = ''
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
        this.tableQuery.openDateStart = val[0]
        this.tableQuery.openDateEnd = val[1]
      }
    },
     "tableQuery.queryType": {
      handler: function (newval, oldval) {
        // this.tableQuery.businessArea = "";
        // this.tableQuery.waterTypeId = "";
        this.tableData = [];
        this.totalData = {};
        if (newval == "1") {
          //用水类型
          this.showWaterTypeDialog = true;
          this.showMeterTypeDialog = false;  
          this.showAreaNoDialog = false;  
        } else if (newval == "2") {
          //水表类型
          this.showWaterTypeDialog = false;
          this.showMeterTypeDialog = true;  
          this.showAreaNoDialog = false;  
        } else if (newval == "3") {
          //营业区域
          this.showWaterTypeDialog = false;
          this.showMeterTypeDialog = false;  
          this.showAreaNoDialog = true;  
        }
      },
      deep: true,
    },
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

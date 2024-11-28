<template>
  <!-- 分类应收汇总 -->
  <div class="MeterReadingOfCopyDetail">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>
    <!-- index页面 -->
    <div  class="main-container"> 
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left">
            <el-form-item label='抄表日期：' class="width-250" label-width="65px" style="white-space:nowrap;">
              <el-date-picker v-model="Time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          <el-form-item label="账期：" class="width-100" label-width="35px" style="white-space:nowrap;">
            <el-date-picker  v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
          </el-form-item>
           <!-- <el-form-item label="营业所：" prop="businessArea">
            <el-select v-model="tableQuery.businessAbodeId" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in businessAbodeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="抄表状态：" class="width-100" label-width="65px" style="white-space:nowrap;">
            <el-select v-model="tableQuery.status" clearable size="mini">
              <el-option
                v-for="item in TableStatusOption"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开账状态：" class="width-100" label-width="65px" style="white-space:nowrap;">
            <el-select v-model="tableQuery.openAccountFlag" clearable size="mini">
              <el-option
                v-for="item in isOrNot"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-150" label-width="65px" style="white-space:nowrap;">
              <el-tooltip effect="dark" content="用户编号/客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号/客户名称" v-model="tableQuery.ctm" @keydown.enter.native="search"></el-input>
              </el-tooltip>
            </el-form-item>
             <el-form-item>
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>
          <el-form-item >
          <el-form-item label="营业区域：" class="width-150">
              <el-cascader
              ref="cascader"
              clearable
              v-model="tableQuery.businessAreaId"
              @change="getBusinessArea"
              :options="businessAreaData"
              :show-all-levels="false"
              :props="props"
            >
            </el-cascader>
          </el-form-item>
            <!-- <el-form-item label="抄表员：">
                <el-select ref="select1" v-model="tableQuery.meterReadingStaff" placeholder="请选择" clearable  @keydown.enter.native="search" @change="getBookNoData">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userName"></el-option>
                </el-select>
              </el-form-item>  -->
            <el-form-item label="抄表员：" class="width-150">
              <el-select v-model="tableQuery.meterReadingStaff" placeholder="请选择" clearable @change="changeMeterReadingStaff">
                <el-option-group
                  v-for="group in staffList"
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
            </el-form-item>
           <el-form-item label="册本：" class="width-150">
            <el-select v-model="tableQuery.bookNos" clearable size="mini" multiple  placeholder="请选择" filterable>
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

              <el-form-item label="用水类型：" class="width-150">
              <el-cascader
                v-model="tableQuery.useWaterType"
                :options="useWaterTypeOptions"
                :show-all-levels="false"
                clearable
                :props="tprops"
                @change="(val) => changeWaterType(val)"
                >
              </el-cascader>
            </el-form-item> 
              <el-form-item label="水表口径：" class="width-150">
                <el-select ref="select5" clearable v-model="tableQuery.meterBore" placeholder="水表口径">
                  <el-option key="" label="全部" value=""></el-option>
                    <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="分表分类：" class="width-150">
            <el-select v-model="tableQuery.meterType" clearable size="mini">
              <el-option
                v-for="item in dictionaryData.MMT"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
              <el-form-item label="水表型号：" class="width-150">
            <el-select v-model="tableQuery.meterModel" clearable size="mini">
              <el-option
                v-for="item in WaterMeModelOpListOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="本期水量：" class="width-100">
              <el-select  ref="select7" v-model="tableQuery.curWaterCompare" size="mini">
                <el-option label="等于" value="equal"></el-option>
                <el-option label="大于等于" value="more"></el-option>
                <el-option label="小于等于" value="less"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="width-100">
              <el-input
                v-model="tableQuery.currendPeriodWater"
                @keydown.enter.native="demand"
              ></el-input>
            </el-form-item> 
            <el-form-item>
              <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">m³</span>
            </el-form-item>

          <el-form-item label="录入员：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="录入员" v-model="tableQuery.inputStaff" @keydown.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="开帐员：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="开帐员" v-model="tableQuery.openAccountStaff" @keydown.enter.native="search"></el-input>
          </el-form-item>

          </el-form-item >
          <!--el-form-item label="水量偏差：">
            <el-select  ref="select8" v-model="tableQuery.avgWaterCompare" size="mini">
              <el-option label="等于" value="equal"></el-option>
              <el-option label="大于等于" value="more"></el-option>
              <el-option label="小于等于" value="less"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item>
            <el-input
              v-model="tableQuery.avgWater"
              style="display: inline-block;width:88%"
              @keydown.enter.native="demand"
            ></el-input>m³
          </el-form-item-->
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" @sort-change='sortChange' :max-height="maxHeight" stripe border  :data="tableData.list" class="MeterReadingOfCopyDetail-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="meterReadingDate" min-width="120" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="120" label="账期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="bookNo" min-width="110" label="册本" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="100" label="用水类型" show-overflow-tooltip>
          </el-table-column> 

           <el-table-column prop="businessArea" min-width="100" label="营业区域" show-overflow-tooltip>
          </el-table-column> 

           <el-table-column prop="meterTypeName" min-width="80" label="分表分类" show-overflow-tooltip>
          </el-table-column>
             <el-table-column prop="meterModelName" min-width="80" label="水表型号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="meterBore" min-width="80" label="水表口径" show-overflow-tooltip>
          </el-table-column>

         
            <el-table-column prop="meterNo" min-width="80" label="表身码" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="inputStaffName" min-width="80" label="录入员" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="openAccountStaffName" min-width="80" label="开帐员" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="priorPeriodDate" min-width="120" label="上次抄表日期" show-overflow-tooltip>
            </el-table-column>


            <el-table-column prop="priorPeriodNum" min-width="80" label="上次读数" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column prop="currendPeriodNum" min-width="80" label="本次读数" show-overflow-tooltip align="right">
            </el-table-column>
             
            <el-table-column prop="currendPeriodWater" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="110" label="抄表水量" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="抄表状态" show-overflow-tooltip>
            </el-table-column>
              <el-table-column prop="meterReadFlagName" min-width="80" label="抄表标记" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="openAccountFlag" min-width="80" label="开账状态" show-overflow-tooltip>
            </el-table-column>

        </el-table>
       
      </div>
       <!-- 分页 -->
            <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="tableQuery.page" 
        :page-sizes="[20, 100, 500, 1000]" 
        :page-size="tableQuery.pageCount" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="tableData.total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "MeterReadingOfCopyDetail",
  components: {
   autoTree
  },
  data() {
    return {
      dictionaryData:[],
      WaterMeModelOpListOptions:[],
     props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      bookNoData:[],
      isOrNot:[{id:0,name:"否"},{id:1,name:"是"}],
      tprops: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      // 主页面显示与隐藏
      indexShow: true,
      Time:[ this.getFirstDayOfMonth(), this.common.date()],
     // 营业区域下拉数据
      businessAreaData: [], 
     // 营业所下拉数据
      businessAbodeData: [],
      meterBoreData:[],
      // 抄表状态下拉框
      TableStatusOption: [],
       // 抄表员下拉选择数据
      postUsers: [],
      staffList:[],
        bookNos:[],
      showbookNosData:[],
      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        meterType:'',
        meterModel:'',
        accountPeriod: '',
        sortOrder:'',
        sortField:'',
        page: 1,
        pageCount: 20,
        startDate:'',
        endDate: '',
        useWaterType:'',
        businessAreaId:'',
        bookNos: [],
        ctm: '',
        meterReadingStaff:'',
        curWaterCompare: "more", //本期水量比较
        currendPeriodWater: "", //本期水量
        avgWaterCompare:'more',//水量偏差
        avgWater:'',//水量偏差量
        meterBore:'',
        status:'',
        openAccountFlag:'',
        inputStaff: '', // 录入员
        openAccountStaff: '', // 开帐员
      },
      useWaterTypeOptions: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "抄表水量报表" }, { title: "抄表明细" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.accountPeriod = `${time.getFullYear()}${month}`
    this.selectBAreaOptions();
    // this.getPostUser();
    this.getMeterReader();
    this.SelectUseWaterTypeOptions();
    this.getMeterStatusOption();
    this.getMeterBore()
    this.getDictionaryOptions();
    this.SelectWaterMeModelOpListOptions();
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".MeterReadingOfCopyDetail .main-container", [
      ".MeterReadingOfCopyDetail .toolbar",
      ".MeterReadingOfCopyDetail .block",
    ]);
 
  },
    computed: {
    showbookNos() {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
  },
  methods: {
        // 获取字典数据
    getDictionaryOptions() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT"
        // 工程类型、用水期、紧急程度、客户类型、信用等级、客户（经办人）证件类型、账户类型、缴费方式、投递方式、发票类型、结算方式、预缴方式、余额退款形式、收款主体、信息来源
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },

    // 列表初始化
    init() {
      // let _this = this
      let queryData = JSON.parse(JSON.stringify(this.tableQuery));
        queryData.businessAreaId = this.common.handleTreeData(
        queryData.businessAreaId
      );
      console.log(queryData)
      var reg = new RegExp( ' ' , "g" )
      var reg2 = new RegExp( '\\t' , "g" )
      queryData.inputStaff = queryData.inputStaff.replace( reg , '' ); 
      queryData.inputStaff = queryData.inputStaff.replace( reg2 , '' ); 
      queryData.openAccountStaff = queryData.openAccountStaff.replace( reg , '' ); 
      queryData.openAccountStaff = queryData.openAccountStaff.replace( reg2 , '' ); 
      /*
      if(this.Time==null || this.Time[0]=='' || this.Time[0] == null || this.Time[1]=='' || this.Time[1]==null){
        this.$message({
          type: 'warning',
          message: '抄表日期不能为空!'
        });
        return
      }*/
      if(!queryData.businessAreaId){
        this.$message({
          type: 'warning',
          message: '营业区域不能为空!'
        });
        return
      }
      queryData.startDate=this.Time?this.Time[0]:''
      queryData.endDate=this.Time?this.Time[1]:''
      if (queryData.startDate==''&&queryData.startDate==''&&(queryData.accountPeriod==''||queryData.accountPeriod==null)) {
        this.$message({
          type: 'warning',
          message: '抄表日期和账期不能同时为空!'
        });
        return
      }
      let params = {
        busicode: "CheckMeterReport",
        data: queryData
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res
      })
    },
    sortChange(column){
          console.log(column);
       this.tableQuery.sortField = column.prop
       if(column.order === 'ascending'){
        this.tableQuery.sortOrder = 1
       } else if(column.order === 'descending'){
        this.tableQuery.sortOrder = 2
       }else{
       this.tableQuery.sortOrder = ''
       this.tableQuery.sortField = ''
       }
       this.init()
       },
    changeWaterType(val) {
      this.tableQuery.useWaterType =  this.common.handleTreeData(val);
    },
     // 水表口径下拉数据
    getMeterBore() {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": {page:1,pageCount:999}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list
      })
    },
    //抄表状态下拉框
    getMeterStatusOption() {
      let _this = this;
      let params = {
        busicode: "MeterStatusSelect",
        data: {
          abnormalFlag: "0"
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.TableStatusOption = res;
        });
    },
    getPostUser() {
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
    //抄表员下拉框数据
     getMeterReader(businessArea = businessArea || "") {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea:businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffList = res;
        });
    },
       changeMeterReadingStaff(){
      this.getBooks();
    },
       getBooks(){
        let params ={
          busicode:'baseAllBooks',
          data:{
            businessArea:this.common.handleTreeData(this.tableQuery.businessAreaId),
            meterReadingStaff:this.tableQuery.meterReadingStaff,
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
    //日期格式化，返回值形式为yy-mm-dd
    timeFormat: function (date) {
      if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
      }
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      var d = date.getDate(); //日
      return y + "-" + (m<10?('0'+m):m) + "-" + (d<10?('0'+d):d);
    },
    //获取当月第一天
    getFirstDayOfMonth: function() {
      let date = new Date();
      date.setDate(1);
      return this.timeFormat(date);
    },
     // 导出
    exportExcel() {
      //和查询一样要加参数调整
     let queryData = JSON.parse(JSON.stringify(this.tableQuery));
        queryData.businessAreaId = this.common.handleTreeData(
        queryData.businessAreaId
      );
      queryData.startDate=this.Time?this.Time[0]:''
      queryData.endDate=this.Time?this.Time[1]:''
      let params = {
        "busicode": "CheckMeterReportExport",
        "data": queryData,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      console.log(queryData)
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    //营业区域
    getBusinessArea() {
    if (this.tableQuery.businessAreaId){
        this.getBooks();
      }else {
        this.bookNos = [];
      }
       this.getMeterReader(this.common.handleTreeData(this.tableQuery.businessAreaId));
    },
    selectBAreaOptions(id) {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res);
          let data = this.getArr(res);
          // console.log(data);
          _this.businessAreaData = data.children;
          // console.log(this.businessAreaData);
        });
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map((i) => {
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
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr1(res.children)
        _this.useWaterTypeOptions = data;
      })
    },
       //水表型号下拉框
    SelectWaterMeModelOpListOptions() {
      let _this = this
      let params = {
        "busicode": "WaterMeModelOpList",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.WaterMeModelOpListOptions = res;
      })
    },
  //树结构数据处理
    getArr1(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr1(data[i].children)
        }
      }
      return data
    },
     

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
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
    if(val){
      this.tableQuery.page = val
      this.init()
    }
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
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
        this.tableQuery.startDate = val[0]
        this.tableQuery.endDate = val[1]
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.MeterReadingOfCopyDetail {
  width: 100%;
  height: 100%;
  .input-200{
  .el-input{
    width: 86%!important;
    .el-input--mini{
     display: inline-block;
  }
  }
  }
   .main-container {
    height: calc(100% - 42px);
  }
  .noLabelInput{
        width: 150px !important;
        .el-input{
            width: 120px !important;
            margin-right: 8px !important;
        }
    }
}
</style>

<style lang="scss">
.MeterReadingOfCopyDetail{
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

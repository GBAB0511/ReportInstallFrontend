<template>
  <div class="PrecedenceTable">
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" label-position="left" >
        <el-form-item label="账期：" class="width-200" label-width="35px" style="white-space:nowrap;">
          <el-date-picker
            v-model="date"
            size="mini"
            type="monthrange"
            unlink-panels
            format="yyyy-MM"
            value-format="yyyyMM"
            start-placeholder="开始账期"
            end-placeholder="结束账期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="客户类型：" class="width-100">
          <el-select  ref="select1" clearable v-model="tableQuery.ctmType" placeholde="用户类型">
            <el-option
              v-for="(item,index) in dictionaryData.CTT"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="抄表员：" class="width-100" label-width="50px" style="white-space:nowrap;">
            <el-select  ref="select2" clearable v-model="tableQuery.meterReadingStaff" placeholder="抄表员">
               <el-option v-for="item in meterReadingStaffOptions" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-select v-model="tableQuery.meterReadingStaff" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>-->

        <el-form-item label="册本号：" class="width-100" label-width="50px" style="white-space:nowrap;">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.bookNo" placeholder="起始册本号" @keydown.enter.native="demand"></el-input>
        </el-form-item>
          <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">-</span>
        <el-form-item class="width-100">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.bookNoEnd" placeholder="结束册本号"></el-input>
        </el-form-item>

        <el-form-item label="用水类型：" class="width-100">
          <el-cascader
            clearable
            v-model="tableQuery.useWaterType"
            :options="waterTypeData"
            :show-all-levels="false"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item class="" style="margin: 0">
          <el-button class="searchBtn" size="mini" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>

        <!-- 高级查询 -->
        <div v-show="isActive" class="advancedQuery">

          <!-- <el-row :gutter="20"> -->
            <!-- <el-col :span="8"> -->
              <el-form-item  label="抄表日期：" class="width-250">
                  <el-date-picker  v-model="meterReadingDate" type="daterange"
                  start-placeholder="开始账期"
                  end-placeholder="结束账期"
                  value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            <!-- </el-col> -->

            <!-- <el-col :span="16"> -->
              <el-form-item label="增减率：" class="width-100">
                <el-radio v-model="tableQuery.compareTime" label="month" style="margin-right: 18px">环比</el-radio>
                <el-radio v-model="tableQuery.compareTime" label="year">同比</el-radio>
              </el-form-item>
              <el-form-item label=""  class="width-100">
                <el-select  ref="select5" v-model="tableQuery.addRateCompare" size="mini">
                  <el-option label="等于" value="equal"></el-option>
                  <el-option label="大于等于" value="more"></el-option>
                  <el-option label="小于等于" value="less"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.addRate" clearable @keydown.enter.native="demand"></el-input>
              </el-form-item>
              <el-form-item>
                <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">%</span>
              </el-form-item>
            <!-- </el-col> -->
          <!-- </el-row> -->
          <!-- <el-row :gutter="20"> -->
            <!-- <el-col :span="8"> -->
              <el-form-item label="月均水量：" class="width-100">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.beginAvgWater" clearable @keydown.enter.native="demand"></el-input>
            </el-form-item>
            <span style="line-height:28px;margin-left:-10px;width:7px;display:inline-block;text-align:center">-</span>
            <el-form-item label="" class="width-100">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   v-model="tableQuery.endAvgWater" clearable @keydown.enter.native="demand"></el-input>
            </el-form-item>
            <el-form-item>
              <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">m³</span>
            </el-form-item>
            <!-- </el-col> -->

            <!-- <el-col :span="8"> -->
              <el-form-item label="水表口径：" class="width-100"  label-width="65px" style="white-space:nowrap;">
              <el-select  ref="select3" v-model="tableQuery.boreCompare" size="mini">
                <el-option label="等于" value="equal"></el-option>
                <el-option label="大于等于" value="more"></el-option>
                <el-option label="小于等于" value="less"></el-option>
              </el-select>
              </el-form-item>
              <el-form-item class="width-100">
              <el-select  ref="select4" v-model="tableQuery.meterBore" size="mini" clearable>
                <el-option
                  v-for="item in boreValueData"
                  :key="item.id"
                  :label="item.boreName"
                  :value="item.boreValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- </el-col> -->
              <!-- <el-col :span="8"> -->
                <el-form-item label="营业区域：" class="width-100"  label-width="65px" style="white-space:nowrap;">
              <!--el-select v-model="tableQuery.businessAbode" clearable size="mini">
                <el-option
                  v-for="item in businessAbodeData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select-->
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>
            <!-- </el-col> -->

          <!-- </el-row> -->
          <!-- <el-row :gutter="20"> -->
            <!-- <el-col :span="8"> -->
              <el-form-item label="上期水量："  class="width-100"  label-width="65px" style="white-space:nowrap;">
                <el-select  ref="select6" v-model="tableQuery.priWaterCompare" size="mini">
                  <el-option label="等于" value="equal"></el-option>
                  <el-option label="大于等于" value="more"></el-option>
                  <el-option label="小于等于" value="less"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.priorPeriodWater" @keydown.enter.native="demand"></el-input>
              </el-form-item>
              <el-form-item>
                <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">m³</span>
              </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="8"> -->
              <el-form-item label="本期水量：" class="width-100" label-width="65px" style="white-space:nowrap;">
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
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">m³</span>
              </el-form-item>
            <!-- </el-col> -->
          <!-- <el-col :span="8"> -->
              <el-form-item label="排名前：" label-width="75px" class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.num" placeholder="300" @keydown.enter.native="demand"></el-input>
              </el-form-item>
            <!-- </el-col> -->
          <!-- </el-row> -->


          <!-- <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item label="抄表日期：">
            <el-date-picker v-model="meterReadingDate" type="daterange"
            start-placeholde="开始账期"
            end-placeholde="结束账期"
            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>

          <el-form-item label="水表口径：" class="wmeter-select">
            <el-select  ref="select3" v-model="tableQuery.boreCompare" size="mini">
              <el-option label="等于" value="equal"></el-option>
              <el-option label="大于等于" value="more"></el-option>
              <el-option label="小于等于" value="less"></el-option>
            </el-select>
            <el-select  ref="select4" v-model="tableQuery.meterBore" size="mini">
              <el-option
                v-for="item in boreValueData"
                :key="item.id"
                :label="item.boreName"
                :value="item.boreValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排名前：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.num" placeholder="300" @keydown.enter.native="demand"></el-input>
          </el-form-item>
          <el-form-item label="增减率：">
            <el-radio v-model="tableQuery.compareTime" label="month">环比</el-radio>
            <el-radio v-model="tableQuery.compareTime" label="year">同比</el-radio>
          </el-form-item>
          <el-form-item label="">
            <el-select  ref="select5" v-model="tableQuery.addRateCompare" size="mini">
              <el-option label="等于" value="equal"></el-option>
              <el-option label="大于等于" value="more"></el-option>
              <el-option label="小于等于" value="less"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.addRate" style="display: inline-block;width:90%" @keydown.enter.native="demand"></el-input>%
          </el-form-item>



          <el-form-item label="上期水量：">
            <el-select  ref="select6" v-model="tableQuery.priWaterCompare" size="mini">
              <el-option label="等于" value="equal"></el-option>
              <el-option label="大于等于" value="more"></el-option>
              <el-option label="小于等于" value="less"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.priorPeriodWater" style="display: inline-block;width:88%" @keydown.enter.native="demand"></el-input>m³
          </el-form-item>

          <el-form-item label="本期水量：">
            <el-select  ref="select7" v-model="tableQuery.curWaterCompare" size="mini">
              <el-option label="等于" value="equal"></el-option>
              <el-option label="大于等于" value="more"></el-option>
              <el-option label="小于等于" value="less"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="tableQuery.currendPeriodWater"
              style="display: inline-block;width:88%"
              @keydown.enter.native="demand"
            ></el-input>m³
          </el-form-item>

          <el-form-item label="月均水量：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.beginAvgWater" @keydown.enter.native="demand"></el-input>
          </el-form-item>
          <el-form-item label="—">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endAvgWater" @keydown.enter.native="demand"></el-input>
          </el-form-item>m³ -->

        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table
        v-if="tableShow"
        :max-height="maxHeight"
        stripe
        border
        show-summary
        :summary-method='getTotal'
        highlight-current-row
        :data="tableData.list"
        class="wuserInfo-table"
        @sort-change='getSort'
      >
        <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
        <el-table-column prop="bookNo" min-width="110" label="册本号" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
        <el-table-column prop="userNo" min-width="110" label="用户编号" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
        <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="setupMeterAddr" min-width="120" label="装表地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meterBore" min-width="80" label="水表口径"></el-table-column>
        <el-table-column prop="businessArea" min-width="100" label="营业区域"></el-table-column>
        <el-table-column prop="useWaterType" min-width="100" label="用水类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="priorPeriodNum" min-width="80" label="起码" align="right"></el-table-column>
        <el-table-column prop="currendPeriodNum" min-width="80" label="止码" align="right"></el-table-column>
        <el-table-column prop="currendPeriodWater" min-width="110" label="本期水量" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
        <el-table-column prop="avgWater" min-width="80" label="平均水量" align="right"></el-table-column>
        <el-table-column prop="priorPeriodWater" min-width="80" label="上期水量" align="right"></el-table-column>
        <el-table-column prop="momAddWater" min-width="80" label="环比增减" align="right"></el-table-column>
        <el-table-column prop="momAddWaterRate" min-width="110" label="环比增减率%" align="right"></el-table-column>
        <el-table-column prop="lastYearPeriodWater" min-width="120" label="去年同期水量" align="right"></el-table-column>
        <el-table-column prop="yoyAddWater" min-width="100" label="同比增减" align="right"></el-table-column>
        <el-table-column prop="yoyAddWaterRate" min-width="120" label="同比增减率%" align="right"></el-table-column>
        <el-table-column prop="meterReadingStaff" min-width="80" label="抄表员"></el-table-column>
        <!--el-table-column prop="accountPeriod" min-width="80" label="最大账期"></el-table-column-->
        <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right"></el-table-column>
        <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right"></el-table-column>
      </el-table>

    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[20, 100, 500, 1000]"
          :page-size="tableQuery.pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        ></el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "PrecedenceTable",
  components: {},
  data() {
    return {
      props: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
        emitPath:false,
      },
      businessAreaData: [], //营业区域下拉框
      meterReadingStaffOptions:[],
      tableShow: false,
      maxHeight: 0,
      isActive: false, //控制高级查询内容的显示
      dictionaryData: [],
      boreValueData: [],
      date: [],
      meterReadingDate:[],
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginAccountPeriod: this.common.date('month'),
        endAccountPeriod: this.common.date('month'),
        meterReadingStaff: "", //抄表员：
        bookNo: "", //起始册本号：
        bookNoEnd: "", // 结束册本号
        useWaterType: "", //用水类型：
        businessArea: "", //营业区域：
        meterReadingStartDate: "", //抄表日期：
        meterReadingEndDate: "", //抄表日期：
        boreCompare: "equal", //水表口径比较
        meterBore: "", //水表口径
        priorPeriodWater: "", //上期水量
        priWaterCompare: "equal", //上期水量比较
        currendPeriodWater: "", //本期水量
        curWaterCompare: "equal", //本期水量比较
        addRate: "", //增减率
        beginAvgWater:"",//月均水量
        endAvgWater:"",//月均水量
        addRateCompare: "equal", //增减率比较
        compareTime: "month", //年月比较
        num: "", //限制数量/排名前
        sort: "", //排序
      },
      //营业所下拉框
      //businessAbodeData: [],
      //抄表员
      meterReaderList: [],
      //用水类型
      waterTypeData: [],
      tableData: {},
      totalData:{},
    };
  },
  mounted() {
    this.date = [this.common.date("month"), this.common.date("month")]
    this.init();
    this.getReadingStaff();
    this.selectBAreaOptions();
    this.$nextTick(() => {
      this.common.changeTable(this, ".PrecedenceTable", [
        ".PrecedenceTable .toolbar",
        ".PrecedenceTable .block",
        ".PrecedenceTable .toggle-btn"
      ]);
    })

  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.select4.blur()
           this.$refs.select5.blur()
           this.$refs.select6.blur()
           this.$refs.select7.blur()
           this.$refs.cascader.blur()

          //  this.$refs.select2.blur()
         }
    },
    //营业区域
    selectBAreaOptions(id) {
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
    // 返回合计数据
    getTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=[]
      selectedColm.forEach(a => {
        if(vm.totalData[a.property]){
          newArray.push(vm.totalData[a.property])
        }else{newArray.push('')}
      });
      sums=newArray;
      sums[0] = "合计";
      sums[1]="";
      return sums;
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
    init() {
      if(this.meterReadingDate && this.meterReadingDate.length===1){
        this.tableQuery.meterReadingStartDate=this.meterReadingDate[0]
      }else if(this.meterReadingDate && this.meterReadingDate.length===2){
        this.tableQuery.meterReadingStartDate=this.meterReadingDate[0]
        this.tableQuery.meterReadingEndDate=this.meterReadingDate[1]
      }else {
        this.tableQuery.meterReadingStartDate=''
        this.tableQuery.meterReadingEndDate=''
      }


      let params = {
        busicode: "MrUserWaterList",
        data: this.tableQuery
      };

      // 用水类型 数据格式处理
      params.data.useWaterType = this.common.handleTreeData(
        params.data.useWaterType
      );
      this.$api.fetch({ params: params }).then(res => {
        this.$set(this, "tableData", res.detail);
        this.$set(this, "totalData", res.totalSum);
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.changeTable()
      });
    },

     // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReadingStaffOptions = [...[{ userName: "全部" }], ...res];
        });
    },

    demand() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    // 排序
    getSort(sort){
      console.log(sort);
      if (sort.prop == "bookNo") {
        sort.prop = "BOOK_NO"
      }
      if (sort.prop == "userNo") {
        sort.prop = "USER_NO"
      }
      if (sort.prop == "currendPeriodWater") {
        sort.prop = "CURREND_PERIOD_WATER"
      }
      if (sort.order === 'descending'){
        this.tableQuery.sort = 'm.' + sort.prop + ' DESC';
      }else if (sort.order === 'ascending'){
        this.tableQuery.sort = 'm.' + sort.prop + ' ASC';
      }else {
        this.tableQuery.sort = null;
      }
      this.init();
    },
    //   导出
    exportExcel() {
      let params = {
        busicode: "MrUserWaterListExport",
        data: this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: "002"
      };

      // 用水类型 数据格式处理
      params.data.useWaterType = this.common.handleTreeData(
        params.data.useWaterType
      );
       window.open(
          this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURI(JSON.stringify(params))
      );
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
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    hidden() {
      var _this = this;
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        //$('.el-table--fit').css('height', '66%');

      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
        //$('.el-table--fit').css('height', '50%');

      }
       this.$nextTick(() => {
         this.common.changeTable(_this, ".PrecedenceTable", [
          ".PrecedenceTable .toolbar",
          ".PrecedenceTable .block",
          ".PrecedenceTable .toggle-btn"
        ]);
       })
    },
    changeTable() {
      this.common.changeTable(this, ".PrecedenceTable ", [
        ".PrecedenceTable .toolbar",
        ".PrecedenceTable .block",
        ".PrecedenceTable .toggle-btn"
      ]);
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    date: {
      deep: true,
      handler(val) {
        if(val && val.length > 0) {
          this.tableQuery.beginAccountPeriod = val[0]
          this.tableQuery.endAccountPeriod = val[1]
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.PrecedenceTable {
  width: 100%;
  height: 100%;
  .wmeter-select {
    .el-select {
      width: 120px;
    }
  }
.input-250{
  .el-input{
    width: 89%!important;
    .el-input--mini{
     display: inline-block;
  }
  // /deep/ .el-input__inner{
  //   width:180px !important
  // }
  }
}
.input-200{
  .el-input{
    width: 86%!important;
    .el-input--mini{
     display: inline-block;
  }
  // /deep/ .el-input__inner{
  //   width:180px !important
  // }
  }
}
  .kl-table{
    margin-top: 15px;
  }
  .monthWater label{
    width: auto;
  }
}
  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col  {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

<style lang="scss">
.PrecedenceTable{
    .noLabelInput{
        width: 150px !important;
        .el-input{
            width: 120px !important;
            margin-right: 8px !important;
        }
    }
    .is-right {
      .cell{
          text-align: right !important;
      }
    }
    .bookNo{
      .el-form-item__label{
          margin-left: -10px !important;
          margin-right: 3px;
      }
    }
}
</style>

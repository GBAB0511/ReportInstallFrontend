<template>
  <!-- 阶梯实收报表 -->
  <div class="ChargeReportOfLadderProceeds">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          
            <el-form-item label="账期：">
            <el-date-picker  v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
          </el-form-item>
            

         <el-form-item label="营业区域：" class="width-150">
         <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" @change="getBusinessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
        </el-cascader>
        </el-form-item>  

        <!-- <el-form-item label="抄表员：">
            <el-select ref="select1" v-model="tableQuery.readerAccount" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="抄表员：" class="width-150">
              <el-select v-model="tableQuery.readerAccount" placeholder="请选择" clearable>
                <el-option-group
                  v-for="group in staffList"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userAccount">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}"> 
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal'   :data="tableData.list" class="ChargeReportOfLadderProceeds-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="businessArea" min-width="100" label="营业区域" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="reader" min-width="100" label="抄表员" fixed="left" show-overflow-tooltip>
          </el-table-column>

            <el-table-column prop="totalUser" min-width="100" label="总户数" show-overflow-tooltip align="right">
             <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'totalUser')">{{scope.row.totalUser}}</span>
             </template>
          </el-table-column>

           <el-table-column prop="monthShouldReadSum" min-width="120" label="本月应抄户数" show-overflow-tooltip align="right">
             <!-- <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'monthShouldReadSum')">{{scope.row.monthShouldReadSum}}</span>
             </template> -->
          </el-table-column>

        <el-table-column label="机械表" align="center">
          <el-table-column prop="macresident" min-width="120" label="居民(户)" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'macresident')">{{scope.row.macresident}}</span>
             </template>
          </el-table-column>

          <el-table-column prop="macnonresident" min-width="120" label="非居民(户)" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'macnonresident')">{{scope.row.macnonresident}}</span>
             </template>
          </el-table-column>

    
        </el-table-column>


          <el-table-column label="远传表" align="center">
          <el-table-column prop="remresident" min-width="120" label="居民(户)" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'remresident')">{{scope.row.remresident}}</span>
             </template>
          </el-table-column>

          <el-table-column prop="remnonresident" min-width="120" label="非居民(户)" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'remnonresident')">{{scope.row.remnonresident}}</span>
             </template>
          </el-table-column>

        </el-table-column>
           <el-table-column align="center" label="0吨户数" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'zeroSum')">{{scope.row.zeroSum}}</span>
             </template> -->
            <el-table-column prop="macZeroSum" min-width="120" label="机械表" show-overflow-tooltip align="right">
              <template slot-scope="scope">
                  <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'macZeroSum')">{{scope.row.macZeroSum}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="remZeroSum" min-width="120" label="远传表" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'remZeroSum')">{{scope.row.remZeroSum}}</span>
             </template>
            </el-table-column>
          </el-table-column>


          <el-table-column align="center" label="小5吨户数">
                <el-table-column prop="macLessFiveSum" min-width="120" label="机械表" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'macLessFiveSum')">{{scope.row.macLessFiveSum}}</span>
             </template>
          </el-table-column>

          <el-table-column prop="remLessFiveSum" min-width="120" label="远传表" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'remLessFiveSum')">{{scope.row.remLessFiveSum}}</span>
             </template>
          </el-table-column>
          </el-table-column>
             <el-table-column prop="realReadSum" min-width="120" label="实抄户数" show-overflow-tooltip align="right">
               <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'realReadSum')">{{scope.row.realReadSum}}</span>
             </template>
          </el-table-column>
            <el-table-column prop="realOpenAccountSum" min-width="120" label="开账户数" show-overflow-tooltip align="right">
               <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'realOpenAccountSum')">{{scope.row.realOpenAccountSum}}</span>
             </template>
          </el-table-column>
            <el-table-column prop="noOpenAccountSum" min-width="120" label="未开账数" show-overflow-tooltip align="right">
               <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'noOpenAccountSum')">{{scope.row.noOpenAccountSum}}</span>
             </template>
          </el-table-column>
             <el-table-column prop="notReadSum" min-width="120" label="未抄户数" show-overflow-tooltip align="right">
               <!-- <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'notReadSum')">{{scope.row.notReadSum}}</span>
             </template> -->
          </el-table-column>
             <el-table-column prop="readRate" min-width="120" label="抄表率" show-overflow-tooltip align="right">
          </el-table-column>
             <el-table-column prop="readBackWater" min-width="120" label="抄回水量" show-overflow-tooltip align="right">
          </el-table-column>

          <!-- <el-table-column  align="center" label="机械表(居民)" show-overflow-tooltip>
             <el-table-column prop="macresidentRealReceive" min-width="120" label="实收户数">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'macresidentRealReceive',null,'realReceive')">{{scope.row.macresidentRealReceive}}</span>
             </template>
          </el-table-column>
            <el-table-column prop="macresidentRealWater" min-width="120" label="实收水量">
            <template slot-scope="scope">
               {{scope.row.macresidentRealWater}}
             </template>
          </el-table-column>
            <el-table-column prop="macresidentRealWaterfee" min-width="120" label="实收水费">
            <template slot-scope="scope">
               {{scope.row.macresidentRealWaterfee}}
             </template>
          </el-table-column>
          </el-table-column>

          <el-table-column  align="center" label="机械表(非居民)" show-overflow-tooltip>
          <el-table-column prop="macnonresidentRealReceive" min-width="120" label="实收户数">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'macnonresidentRealReceive',null,'realReceive')">{{scope.row.macnonresidentRealReceive}}</span>
             </template>
          </el-table-column>
            <el-table-column prop="macnonresidentRealWater" min-width="120" label="实收水量">
            <template slot-scope="scope">
              {{scope.row.macnonresidentRealWater}}
             </template>
          </el-table-column>
            <el-table-column prop="macnonresidentRealWaterfee" min-width="120" label="实收水费">
            <template slot-scope="scope">
              {{scope.row.macnonresidentRealWaterfee}}
             </template>
          </el-table-column>
          </el-table-column>

          <el-table-column align="center" label="远传表(居民)" show-overflow-tooltip>
                 <el-table-column prop="remresidentRealReceive" min-width="120" label="实收户数">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'remresidentRealReceive',null,'realReceive')">{{scope.row.remresidentRealReceive}}</span>
             </template>
          </el-table-column>
            <el-table-column prop="remresidentRealWater" min-width="120" label="实收水量">
            <template slot-scope="scope">
              {{scope.row.remresidentRealWater}}
             </template>
          </el-table-column>
            <el-table-column prop="remresidentRealWaterfee" min-width="120" label="实收水费">
            <template slot-scope="scope">
                {{scope.row.remresidentRealWaterfee}}
             </template>
          </el-table-column>
          </el-table-column>

          <el-table-column align="center"  label="远传表(非居民)" show-overflow-tooltip>
              <el-table-column prop="remnonresidentRealReceive" min-width="120" label="实收户数">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'remnonresidentRealReceive',null,'realReceive')">{{scope.row.remnonresidentRealReceive}}</span>
             </template>
          </el-table-column>
            <el-table-column prop="remnonresidentRealWater" min-width="120" label="实收水量">
            <template slot-scope="scope">
                {{scope.row.remnonresidentRealWater}}
             </template>
          </el-table-column>
            <el-table-column prop="remnonresidentRealWaterfee" min-width="120" label="实收水费">
            <template slot-scope="scope">
              {{scope.row.remnonresidentRealWaterfee}}
             </template>
          </el-table-column>
          </el-table-column> -->
     

            <el-table-column prop="realReceive" min-width="120" label="实收户数" show-overflow-tooltip align="right">
              <template slot-scope="scope">
                 <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row,'realReceive',null,'realReceive')">{{scope.row.realReceive}}</span>
                   </template>
          </el-table-column>
          <el-table-column prop="realReceiveWater" min-width="120" label="实收水量(m³)" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="realReceiveWaterfee" min-width="120" label="实收水费(元)" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="monthRecoveryRate" min-width="120" label="本月回收率" show-overflow-tooltip align="right">
          </el-table-column>

          <!-- <el-table-column prop="realRecoveryRate" min-width="120" label="实际回收率" show-overflow-tooltip>
          </el-table-column> -->

 

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>

     <el-dialog title="统计详情" :visible.sync="showDetail" class="common-dialog">
       <div class="dialog-detail" style="height: 100%;">
         <div class="toolbar">
            <el-form :inline="true" size="mini" :model="dialogTableQuery" class="demo-form-inline" label-width="auto">
              <el-form-item label="用户编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogTableQuery.userNo" placeholder="请输入用户编号" clearable></el-input>
              </el-form-item>

              <el-form-item label="用水类型：">
                <el-cascader
                  v-model="dialogTableQuery.useWaterType"
                  :options="useWaterTypeOptions"
                  :show-all-levels="false"
                  clearable
                  :props="props1">
                </el-cascader>
              </el-form-item>

              <el-form-item>
                <el-button class="searchBtn" icon="el-icon-search" @click="dialogSearch">查询</el-button>
                <el-button @click="dialogExportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
              </el-form-item>
            </el-form>
          </div>
              <div class="kl-table" :style="{height: maxHeight + 'px'}">
           <template v-if="this.currtColumName === 'realReceive'">
      
            <el-table highlight-current-row stripe border :data="detailData.list" show-summary :summary-method='getDetailDataTotal'  class="change-tables-table" :max-height="maxHeight">
              <el-table-column type="index" label="序号" min-width="40" fixed="left" :index="detailIndexMethod"></el-table-column>
              <el-table-column prop="businessArea" min-width="80" label="营业所"></el-table-column>
              <el-table-column prop="userNo" min-width="80" label="用户编号"></el-table-column>
              <el-table-column prop="ctmName" min-width="80" label="客户名称"></el-table-column>
              <el-table-column prop="meterType" min-width="80" label="水表类型"></el-table-column>
              <el-table-column prop="useWaterType" v-if="this.field == 'totalUser'" min-width="200" label="用水类型" show-overflow-tooltip></el-table-column>
              <el-table-column prop="setupMeterAddr" min-width="160" label="装表地址" show-overflow-tooltip></el-table-column>
               <el-table-column prop="realReceiveDate" min-width="80" label="实收日期"></el-table-column>
                <el-table-column prop="accountPeriod" min-width="80" label="应收账期"></el-table-column>
                 <el-table-column prop="chargeStaffName" min-width="80" label="收费员"></el-table-column>
                 <el-table-column prop="bookReader" min-width="80" label="册本抄表员"></el-table-column>
                  <el-table-column prop="billReader" min-width="80" label="账单抄表员"></el-table-column>
                  <el-table-column prop="billCount" min-width="80" label="账单数"></el-table-column>
                   <el-table-column prop="realReceiveMoney" min-width="80" label="实收金额"></el-table-column>

            </el-table>
                 
          <div class="block">
            <el-pagination @size-change="detailHandleSizeChange" @current-change="detailHandleCurrentChange" :current-page="dialogTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="dialogTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
          </div>
                  </template>
                   <template v-else>
                         <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table highlight-current-row stripe border :data="detailData.list"  class="change-tables-table" :max-height="maxHeight">
              <el-table-column type="index" label="序号" min-width="40" fixed="left" :index="detailIndexMethod"></el-table-column>
                 <el-table-column prop="userNo" min-width="80" label="用户编号"></el-table-column>
                        <el-table-column prop="ctmName" min-width="80" label="客户名称"></el-table-column>
               <el-table-column prop="setupMeterAddr" min-width="160" label="装表地址" show-overflow-tooltip></el-table-column>
                   <el-table-column prop="meterType" min-width="80" label="水表类型"></el-table-column>
                   <el-table-column prop="useWaterType" v-if="this.field == 'totalUser'" min-width="200" label="用水类型" show-overflow-tooltip></el-table-column>
                   <el-table-column prop="bookNo" min-width="80" label="册本号"></el-table-column>
              <el-table-column prop="priorPeriodNum" min-width="100" label="上期抄码"></el-table-column>
              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码"></el-table-column>
              <el-table-column prop="currendPeriodWater" min-width="80" label="水量"></el-table-column>
              <el-table-column prop="meterReadingDate" min-width="80" label="抄表日期"></el-table-column>
              <el-table-column prop="statusName" min-width="80" label="抄表状态"></el-table-column>
               <el-table-column prop="meterReadFlagName" min-width="80" label="抄表标记"></el-table-column>
            </el-table>
                  </div>
          <div class="block">
            <el-pagination @size-change="detailHandleSizeChange" @current-change="detailHandleCurrentChange" :current-page="dialogTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="dialogTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
          </div>

                        </template>
     </div>
        
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { Loading } from "element-ui";
export default {
  name: "MeterReadingOfReaderStatistics",
  components: {

  },
  data() {
    return {
       props: {
        //树结构格式
        value: "code",
        label: "name",
        checkStrictly: true,
      },
      props1: {//树结构格式
        value: 'code',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      // 主页面显示与隐藏
      indexShow: true,
      businessAreaData: [],
   // 抄表员下拉选择数据
      postUsers: [],
      staffList:[],
      Time:[],
      // 列表数据
      tableData: {},
      totalData: {},
      detailDataTotal:{},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',
        businessArea: '',
        readerAccount:''
      },
      dialogTableQuery: {
        page: 1,
        pageCount: 20,
        userNo: '',
        useWaterType: '',
      },
      currtColumName:"",
      waterTypeData:[],
      // 用水类型下拉数据
      useWaterTypeOptions: [],
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "抄表水量报表" }, { title: "抄表员抄表统计" }]
      },
      tableShow: false,
      maxHeight: 0,
      spanArr: [],
      // 弹窗详情显示
      showDetail: false,
      // 详情数据
      detailData: {},
      //当前钻取数据
      row: {},
      field: ''
    };
  },
  mounted() {
    this.getMeterReader();
    //  this.getPostUser()
     this.selectBAreaOptions()
     this.SelectUseWaterTypeOptions()
     this.init()
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.accountPeriod = `${time.getFullYear()}${month}`
    // this.init()
    // this.getWaterType()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfLadderProceeds", [
      ".ChargeReportOfLadderProceeds .toolbar",
      ".ChargeReportOfLadderProceeds .block",
      ".ChargeReportOfLadderProceeds #crumbs"
    ]);
  },
  methods: {
         // 返回合计数据
    getTotal(param){
      //console.log(this.totalData);
     let vm = this;
      let sums = [];           
        var selectedColm = param.columns;
        let newArray=['合计']
        selectedColm.forEach(a => {
            if(vm.totalData[a.property]){//与表格列进行匹配
                newArray.push(vm.totalData[a.property])
                }else{
                  if(a.property!=undefined){//序号列不push
                       newArray.push('')
                  }
               }            
          });
        sums=newArray;
        return sums;
    },
        getDetailDataTotal(param){
      //console.log(this.totalData);
     let vm = this;
      let sums = [];           
        var selectedColm = param.columns;
        let newArray=['合计']
        selectedColm.forEach(a => {
            if(vm.detailDataTotal[a.property]){//与表格列进行匹配
                newArray.push(vm.detailDataTotal[a.property])
                }else{
                  if(a.property!=undefined){//序号列不push
                       newArray.push('')
                  }
               }            
          });
        sums=newArray;
        return sums;
    },
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 列表初始化
    init() {
        this.tableQuery.businessArea = this.common.handleTreeData(
        this.tableQuery.businessArea
      );
      let _this = this
      let params = {
        busicode: "ReaderMRReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
       _this.tableData = res.detail
        _this.totalData = res.total
        // this.getSpanArr(this.tableData.list);
      })
    },
    getBusinessArea(val) {
       console.log(val)
      val = this.common.handleTreeData(val);
      this.getMeterReader(this.common.handleTreeData(this.tableQuery.businessArea));
      return val;
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
          let data = this.getArr(res);
          _this.businessAreaData = data.children;
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
        this.useWaterTypeOptions = data;
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
    handleDetail(row,field,queryData,currtColumName) {

      this.row = row
      this.field = field

      this.showDetail = true
      this.$nextTick(() => {
        this.common.changeTable(this, '.dialog-detail', [
          '.dialog-detail .toolbar',
          '.dialog-detail .block'
        ])
      })
  
      if (queryData!=null) {
        var loading = Loading.service({
          lock: true,
          text: "加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.3)",
          target: document.querySelector('.common-dialog')
        });
          let params = {
          busicode: "ReaderMRReportDetail",
          data: {
            businessArea: row.areaId,
            readerAccount: row.readerId,
            queryData: field,
            accountPeriod: this.tableQuery.accountPeriod,
            page: queryData.page,
            pageCount: queryData.pageCount,
            userNo: queryData.userNo,
            useWaterType: queryData.useWaterType,
          }
        }
         this.$api.fetch({
            params: params,//参数
          }).then(res => {
            setTimeout(() => {
              loading.close();
            }, 350);
                if(res.detail){
                   this.detailData=res.detail;
                 }else{
                  this.detailData = res;
                 }
            
              this.detailDataTotal =  res.total||{};
       this.setCurrtColumName(currtColumName);
          })
      } else{
        this.dialogTableQuery.page = 1
        let params = {
          busicode: "ReaderMRReportDetail",
          data: {
            businessArea: row.areaId,
            readerAccount: row.readerId,
            queryData: field,
            accountPeriod: this.tableQuery.accountPeriod,
            useWaterType: this.dialogTableQuery.useWaterType,
          }
        };
         this.$api.fetch({
          params: params,//参数
        }).then(res => {
                if(res.detail){//有detail的情况下说明有合计,改变数据结构
                   this.detailData=res.detail;
                 }else{
                  this.detailData = res;
                 }

              this.detailDataTotal = res.total||{}; //合计
              this.setCurrtColumName(currtColumName);
        })
      }
      
     
    },
    setCurrtColumName(currtColumName){
         if(currtColumName){//currtColumName为当前的一级列名
          this.currtColumName = currtColumName
          }else{
            this.currtColumName = "";
          }
    },
    // 弹窗查询
    dialogSearch() {
      this.dialogTableQuery.page = 1;
      this.handleDetail(this.row,this.field,this.dialogTableQuery,this.currtColumName);
    },
    //合计
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
    //详情分页
    detailHandleSizeChange(val) {
      //显示多少数据一页
      this.dialogTableQuery.pageCount = val
      this.dialogTableQuery.page = 1
      this.handleDetail(this.row,this.field,this.dialogTableQuery,this.currtColumName);
    },
    detailHandleCurrentChange(val) {
      //显示多少页码
      this.dialogTableQuery.page = val
      this.handleDetail(this.row,this.field,this.dialogTableQuery,this.currtColumName);
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "ReaderMRReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 弹窗导出
    dialogExportExcel() {
      let params = {
        "busicode": "ReaderMRReportDetailExport",
        "data": {
          businessArea: this.row.areaId,
          readerAccount: this.row.readerId,
          queryData: this.field,
          accountPeriod: this.tableQuery.accountPeriod,
          page: this.dialogTableQuery.page,
          pageCount: this.dialogTableQuery.pageCount,
          userNo: this.dialogTableQuery.userNo,
          useWaterType: this.dialogTableQuery.useWaterType,
        },
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },

   
    // 查询
    search() {
      this.tableQuery.page = 1;
      console.log(this.tableQuery.accountPeriod)
      if(this.tableQuery.accountPeriod == '' || this.tableQuery.accountPeriod == null){
        this.$message.error('请输入账期进行查询');
      } else{
          this.init();
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
    detailIndexMethod(index) {
      //获取表格序号
      return (this.dialogTableQuery.page - 1) * this.dialogTableQuery.pageCount + (index + 1);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    showDetail(val) {
      if(!val) {
         this.common.changeTable(this, ".ChargeReportOfLadderProceeds", [
          ".ChargeReportOfLadderProceeds .toolbar",
          ".ChargeReportOfLadderProceeds .block",
          ".ChargeReportOfLadderProceeds #crumbs"
        ]);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfLadderProceeds {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
.demo-form-inline{
  margin-top: 10px;
}
</style>

<style lang="scss">
.ChargeReportOfLadderProceeds {
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
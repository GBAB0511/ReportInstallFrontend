<template>
  <!-- 未收统计表 -->
  <div class="ChargeReportOfDetailsPaymentReceivable">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>
     
      <!-- index页面 -->
      <div  class="index-page">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" label-width="75px" label-position="left">

            <el-form-item label="用水类型：" class="width-150">
              <el-cascader clearable v-model="tableQuery.waterTypeNo" :options="waterTypeTree" :show-all-levels="false" :props="props1"></el-cascader>
            </el-form-item>

              

            <el-form-item label='应收账期：' class="width-250">
              <el-date-picker v-model="accountTime" @change="getDatePicker" type="monthrange" unlink-panels value-format="yyyyMM" format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="收费时间：" class="width-250">
            <el-date-picker v-model="chargingPeriod" @change="getDateOption" size="mini" type="daterange" unlink-panels format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

            <el-form-item label="模糊查询：">
              <el-tooltip class="item" effect="dark" content="客户名称、客户编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
              </el-tooltip>
            </el-form-item>

           <el-form-item class="button-group">
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>


          <div v-show="isActive" class="advancedQuery">

            <el-form-item label="缴费状态：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.chargingFlag" placeholder="缴费状态">
                <el-option v-for="item in chargingFlagOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item> 

            <el-form-item label="营业区域：" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.area" @change="getBusinessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
          </el-cascader>
        </el-form-item> 

          <el-form-item label="册本：" class="width-150" label-width="45px">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本" clearable @keydown.enter.native="search"></el-input>
          </el-form-item> 

         <el-form-item label="抄表员：" class="width-150" label-width="65px">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.meterReader" placeholder="请输入抄表员" clearable @keydown.enter.native="search"></el-input>
            <!-- <el-select v-model="tableQuery.meterReader" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userName"></el-option>
            </el-select> -->
          </el-form-item>

           <el-form-item label="缴费方式：" class="width-150">
              <el-select ref="select2" clearable v-model="tableQuery.payChannel" placeholder="缴费方式">
                <el-option v-for="item in dictionaryData.BPC" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="收费员:" class="width-150">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.chargeStaffName" placeholder="请输入收费员" clearable @keydown.enter.native="search"></el-input>
              <!-- <el-select clearable v-model="tableQuery.chargeStaffName" placeholder="收款员">
                <el-option v-for="item in staffs" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
              </el-select> -->
            </el-form-item>
        
           <el-form-item label="欠费金额：" class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.startFee" clearable @keydown.enter.native="search"></el-input>
          </el-form-item> 
            <span style="line-height:28px;width:10px;margin-left:-10px;display:inline-block;text-align:center">~</span>
          <el-form-item class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endFee" clearable @keydown.enter.native="search"></el-input>
          </el-form-item> 
           <el-form-item label="是否缴费及时：" label-width="100px" style="white-space:nowrap;">
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.meterReadingStaff" placeholder="请输入抄表员"></el-input> -->
            <el-select ref="select3" v-model="tableQuery.timelyChargingFlag" placeholder="请选择" clearable>
              <el-option label="是" value= '1'></el-option>
              <el-option label="否" value= '0'></el-option>
            </el-select>
          </el-form-item>

           <!-- <el-form-item label="客户：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="模糊查询" v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
            </el-form-item> -->

          </div>

          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>

          </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="ChargeReportOfDetailsPaymentReceivable-table">

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

             <el-table-column prop="chargingFlag" min-width="80" label="缴费状态" show-overflow-tooltip>
            </el-table-column>

             <el-table-column prop="timelyChargingFlag" min-width="80" label="缴费及时" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="userNo" min-width="120" label="用户编号" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="accountPeriod" min-width="80" label="账期" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="bookNo" min-width="110" label="册本号" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip>
            </el-table-column>

             <el-table-column prop="waterType" min-width="80" label="用水类型" show-overflow-tooltip>
            </el-table-column>

             <template v-for='(col) in costList'>
              <el-table-column
                show-overflow-tooltip
                :prop="'receivable_' + col.costNameEn"
                :label="'应收' + col.costName"
                :key="col.costNo"
                v-if="col.costName.length>0"
                min-width="120">
              </el-table-column>
            </template>

              <el-table-column prop="meterBore" min-width="80" label="口径" show-overflow-tooltip>
            </el-table-column>
                  <el-table-column prop="meterReadingDate" min-width="120" label="抄表日期" show-overflow-tooltip>
            </el-table-column>
                  <el-table-column prop="meterReadingStaffName" min-width="120" label="抄表员" show-overflow-tooltip>
            </el-table-column>
                  <el-table-column prop="priorPeriodNum" min-width="80" label="上期读数" show-overflow-tooltip>
            </el-table-column>
                  <el-table-column prop="currendPeriodNum" min-width="80" label="本期读数" show-overflow-tooltip>
            </el-table-column>
                  <el-table-column prop="realityWater" min-width="80" label="水量" show-overflow-tooltip>
            </el-table-column>
               <el-table-column prop="penaltyMoney" min-width="80" label="违约金" show-overflow-tooltip>
            </el-table-column>
                  <el-table-column prop="subTotal" min-width="120" label="费用合计" show-overflow-tooltip>
            </el-table-column>
             <el-table-column prop="chargeStaffName" min-width="120" label="收费员" show-overflow-tooltip>
            </el-table-column>
              <el-table-column prop="chargeTime" min-width="150" label="收费时间" show-overflow-tooltip>
            </el-table-column>
             <el-table-column prop="invoiceNo" min-width="150" label="发票号" show-overflow-tooltip>
            </el-table-column>
               <el-table-column prop="payChannel" min-width="80" label="缴费方式" show-overflow-tooltip>
            </el-table-column>
              <el-table-column prop="priorPeriodMoney" min-width="100" label="上期余额" show-overflow-tooltip>
            </el-table-column>
               <el-table-column prop="currendPeriodMoney" min-width="100" label="本期余额" show-overflow-tooltip>
            </el-table-column>
            <template v-for='(col) in costList'>
              <el-table-column
                show-overflow-tooltip
                :prop="'proceeds_' + col.costNameEn"
                :label="'实收' + col.costName"
                :key="col.costNo"
                v-if="col.costName.length>0"
                min-width="120">
              </el-table-column>
            </template>
              <el-table-column prop="proceedsMoney" min-width="100" label="实收金额" show-overflow-tooltip>
            </el-table-column>
           
          </el-table>
          
        </div>
  
        <!-- 分页 -->
          <div class="block">
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="sizes, slot, jumper">
         <span class="pageBlock">
          <button class="pageStyle" v-if="tableQuery.page > 1" @click="handleCurrentChange(tableQuery.page - 1)">&#60;</button>
          <button class="pageDisableStyle" v-else>&#60;</button>
          <span> {{tableQuery.page}} </span>
          <button @click="handleCurrentChange(tableQuery.page + 1)">&#62;</button>
         </span>
        </el-pagination>
            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper"></el-pagination> -->
          </div>
      </div>
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "ChargeReportOfDetailsPaymentReceivable",
  components: {
      autoTree
  },
  data() {
    return {
       props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      props1: {
        value: "code",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      isActive: false,
      businessAreaData:[],//营业区域
      staffs:[],//收款员
     chargingFlagOptions:[
       {
         id:'2',
         name:'全部'
       },
       {
         id:'1',
         name:'已缴'
       },
       {
         id:'0',
         name:'未缴'
       },
       ],
      treeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children"
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点"
        },
        sendTreeProp: [
          "code",
          "name",
          "districtArr",
          "children",
          "id",
          "group",
          "isLeaf",
          "isParent",
          "parent",
          "sonData"
        ],
        rootName: "总部",
        defaultOpen: {
          nodeKey: "id"
        }
      },
      // 数据字典数据
      dictionaryData: {},
       // 抄表员下拉选择数据
      postUsers: [],
      // 列表数据
      tableData: {list:[]},
      costList: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        timelyChargingFlag:'',
        endChargingTime:'',
        startChargingTime: '',
        startAccountPeriod: 202108,
        endAccountPeriod: 202108,
        chargingFlag:'',
        area:'',
        bookNo:'',
        meterReader:'',
        chargeStaffName:'',
        startFee:'',
        endFee:'',
        fuzzyQuery: '',
        waterTypeNo:'',
      },
      // 查询条件日期
      accountTime: [],
      chargingPeriod:[],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "应收缴费明细" }]
      },
      tableShow: false,
      maxHeight: 0,
      waterTypeTree: [],
      parentId:'',
      totalData:{}
    };
  },
  mounted() {
    // this.getPostUser()
     eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    this.selectBAreaOptions();
     this.getDictionary();
     this.getInvoiceCostsAndTypes()
    // 侧边栏
   
     let accountTime = new Date()
    let month = (accountTime.getMonth() + 1) > 9 ? (accountTime.getMonth() + 1).toString() : '0' + (accountTime.getMonth() + 1)

    this.accountTime = [accountTime.getFullYear() + month, accountTime.getFullYear() + month]
    this.getTreeDatas();
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".ChargeReportOfDetailsPaymentReceivable", [
          ".ChargeReportOfDetailsPaymentReceivable .toolbar",
          ".ChargeReportOfDetailsPaymentReceivable .bread-contain",
          ".ChargeReportOfDetailsPaymentReceivable .toggle-btn",
          ".ChargeReportOfDetailsPaymentReceivable .block"
        ]);
      });
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

  },
  methods: {
   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
         }
    },
    // 列表初始化
    init() {
      // let _this = this
      // this.tableQuery.waterTypeNo=this.waterTypeNo;

      // this.tableQuery.startAccountPeriod = parseInt(this.tableQuery.startAccountPeriod)
      // this.tableQuery.endAccountPeriod = parseInt(this.tableQuery.endAccountPeriod)
      this.tableQuery.area = this.common.handleTreeData(this.tableQuery.area)
      /* if(this.chargingPeriod.length == 0 && this.accountTime.length ==0) {
        this.$message({
          type: 'warning',
          message: '应收账期和收费时间不可同时为空！'
        })
        return
      }*/
      let params = {
        busicode: "AllReceivableDetailReport",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res.detail
        this.totalData = res.total
      })
      
    },
    getBusinessArea(val){
    //  console.log(val)
      val = this.common.handleTreeData(val)
      return val
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPC"// 缴费方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes() {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.costList=res.costList
        console.log(this.costList)
      })
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
     // 导出
    exportExcel() {
      let params = {
        "busicode": "AllReceivableDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
        return sums;
    },
        // 获取树的数据
    getTreeDatas() {
      let _this = this;
      let params = {
        busicode: "WaterTypeTree",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.waterTypeTree = res.children;
          // _this.init();
        });
    },
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
        let data = this.getArr(res)
        _this.businessAreaData = data.children;
        
      })
    },
    //树结构数据处理
    getArr(data) {
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
    hidden() {
      this.isActive = !this.isActive
      this.$nextTick(() => {
        this.common.changeTable(this, ".ChargeReportOfDetailsPaymentReceivable", [
          ".ChargeReportOfDetailsPaymentReceivable .toolbar",
          ".ChargeReportOfDetailsPaymentReceivable .bread-contain",
          ".ChargeReportOfDetailsPaymentReceivable .toggle-btn",
          ".ChargeReportOfDetailsPaymentReceivable .block"
        ]);
      })
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取账期日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.startAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
      }
    },
   // 获取收费日期框数据
    getDateOption(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startChargingTime = date[0]
        this.tableQuery.endChargingTime = date[1]
      } else {
        this.tableQuery.startChargingTime = ''
        this.tableQuery.endChargingTime = ''
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

  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    accountTime(val) {
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfDetailsPaymentReceivable {
  width: 100%;
  height: 100%;
  .company-content {
    overflow: hidden;
    .index-page {
      width: 100%;
      height: 100%;
      
    }
  }
  .kl-table {
    margin-top: 15px;
  }
  .pageDisableStyle {
  color: #C0C4CC;
}
  .pageBlock {
    text-align: center
  }
}
</style>

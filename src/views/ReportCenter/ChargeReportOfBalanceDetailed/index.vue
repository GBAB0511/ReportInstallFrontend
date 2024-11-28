<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfBalanceDetailed">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        <el-button @click="print" size="mini" icon="el-icon-upload2" type="primary">打印</el-button>
      </div>
  </div>
    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <el-dialog title="查看流水" class='button-dialog' :visible.sync="accountFlowShow">
        <div class="kl-table">
          <el-table highlight-current-row :data="accountFlowData.list"  stripe border tooltip-effect="dark"  >
            <el-table-column property="userNo" align="left" label="用户编号" ></el-table-column>
   
            <el-table-column property="payTime"  align="left" label="日期"></el-table-column>
            <el-table-column property="comments" align="left" label="备注"></el-table-column>
            <el-table-column property="payMoney" align="right" label="发生额"></el-table-column>
            <el-table-column property="currendPeriodMoney" align="right" label="本期余额"></el-table-column>
          </el-table>
        
         <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" 
          :current-page="tableQuery1.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery1.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="accountFlowData.total"></el-pagination>
        </div>
        </div>
      </el-dialog>
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left">
           <el-form-item label='截至日期：' class="width-200">
              <el-date-picker v-model="tableQuery.endDate"  type="date"  value-format="yyyy-MM-dd"  :clearable="true"  @change="changeDate" >
              </el-date-picker>
            </el-form-item> 

            <el-form-item label="账户类型：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.accountType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in dictionaryData.ACT" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="发票类型：">
              <el-select clearable v-model="tableQuery.invoiceType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in dictionaryData.BBT" :key="index" :label="item.name" :value="item.value" show-overflow-tooltip></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="缴费方式：" class="width-150">
              <el-select ref="select2" clearable v-model="tableQuery.payMethod" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="余额>" v-show="conditionShow" class="width-150">     
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   type="Number" v-model="tableQuery.balance"  @keydown.enter.native="search" ></el-input>
          </el-form-item>
             <el-form-item label="模糊查询：" class="width-200" align="right">
               <el-tooltip content="客户编号/账户编号">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="客户编号/账户编号" @keydown.enter.native="search"></el-input>
               </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>


        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" show-summary :summary-method='getTotal' :max-height="maxHeight" stripe border  :data="tableData.list" class="ChargeReportOfBalanceDetailed-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="ctmNo" min-width="60" label="客户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountNo" min-width="60" label="账户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountType" min-width="60" label="账户类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="60" label="客户名称" show-overflow-tooltip> 
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="80" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column prop="invoiceType" min-width="60" label="发票类型" show-overflow-tooltip>
          </el-table-column> -->

          <el-table-column prop="payWay" min-width="40" label="缴费方式" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountBalance" min-width="60" label="当前余额" show-overflow-tooltip align="right">
          </el-table-column>
           <el-table-column class="cell" label="操作" fixed="right" min-width="60" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="details(scope.row)">查看流水</el-button>
            </template>
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
  name: "ChargeReportOfBalanceDetailed",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      //流水页面
      accountFlowShow:false,
      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo:'',
        ctmName:'',
        accountType: '',
        invoiceType: '',
        payMethod: '',
        balance:0,
        endDate: this.common.date(),//截至日期
      },
      //查询用户流水对象
      tableQuery1: {
        page: 1,
        pageCount: 20,
        accountNo:'',
      },
      accountFlowData:{},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "余额明细表" }]
      },
      tableShow: false,
      maxHeight: 0,
      dictionaryData:[],
      conditionShow:true
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    // this.init();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfBalanceDetailed", [
      ".ChargeReportOfBalanceDetailed .toolbar",
      ".ChargeReportOfBalanceDetailed .block",
      ".ChargeReportOfBalanceDetailed #crumbs"
    ]);
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    changeDate(val){
      let curDate = this.common.date('number')
      if(val != null && val != '' && curDate !== val) {
        this.conditionShow = false
        this.tableQuery.balance = null
      }else
        this.conditionShow = true
    },
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "AccountBalanceReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },
     print(){
      let data = this.tableQuery
      let params = {
        busicode: "AccountBalanceReportPrint",
        data:data,
      };

      this.$api.fetch({
        params: params,
      }).then(res => {
          let data = res
          this.$notify({
            title: '成功',
            message: '正在打印...',
            type: 'success'
          })
          this.common.print('print', 'AccountBalanceReportPrint', '', data[0], this);
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "AccountBalanceReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },

    // 返回合计数据
    // 返回合计数据
    getTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=['合计']
      selectedColm.forEach(a => {
          if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.totalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      sums=newArray;
      // sums[1] = ''
      return sums;
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },

    // 流水详情按钮
    details(row) {
      let _this = this
      _this.accountFlowShow = true;
      _this.tableQuery1.accountNo = row.accountNo
      _this.getAccountFlow()
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "BBT,ACT,BPW"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    getAccountFlow(){
       let _this = this      
      let params = {
        busicode: "AccountFlowList",
        data: _this.tableQuery1
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.accountFlowData = res
      })
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
    //流水分页
    handleSizeChange1(val) {
      //显示多少数据一页
      this.tableQuery1.pageCount = val
      this.tableQuery1.page = 1
      this.getAccountFlow();
    },
    handleCurrentChange1(val) {
      //流水显示多少页码
      this.tableQuery1.page = val
      this.getAccountFlow();
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    closeDialog() {
 
      this.indexShow = true //index页面
      this.accountFlowShow = false
      this.tableQuery1.page = 1
      this.tableQuery1.userNo = ''
      this.init()
    },
    // 添加按钮
    add() {
      this.DetailedEnquiriesVisible = true
      this.indexShow = false
    },
  },
  watch: {
    maxHeight() {
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
.ChargeReportOfBalanceDetailed {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .el-input__inner{
    width: 100%!important;
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

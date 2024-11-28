<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfBankOutInDetailed">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <div class="bread-contain-right">
        
      </div>
  </div>
    <!-- 页面 1-->
    <div class="table-index1">

      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" >
             <el-form-item class="form-left">
            <el-form-item label='年月：'>
              <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" >
              </el-date-picker>
            </el-form-item>
          
            <el-form-item label="收费类型：">
              <el-select  ref="select1" clearable v-model="tableQuery.chargingType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in chargingTypeData" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table highlight-current-row v-if="tableShow"  @row-click="rowClick" :max-height="maxHeight1" stripe border  :data="tableData" class="ChargeReportOfBankOutInDetailed-table">

          <el-table-column type="index" label="NO." width="50" fixed="left">
          </el-table-column>
          <!--el-table-column prop="businessAbode" min-width="80" label="营业所" show-overflow-tooltip>
          </el-table-column-->

          <el-table-column prop="outOpt" min-width="60" label="出盘操作" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="outTime" min-width="60" label="出盘日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="outAmount" min-width="60" label="出盘数量" show-overflow-tooltip> 
          </el-table-column>

          <el-table-column prop="outMoney" min-width="60" label="出盘金额" show-overflow-tooltip> 
          </el-table-column>

          <el-table-column prop="returnOpt" min-width="80" label="回盘操作" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="returnTime" min-width="60" label="回盘日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="successAmount" min-width="40" label="成功数量" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="successMoney" min-width="60" label="成功金额" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="loseAmount" min-width="40" label="失败数量" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="loseMoney" min-width="60" label="失败金额" show-overflow-tooltip>
          </el-table-column>

        </el-table>
       
      </div>
    </div>

       <!-- 页面 2-->
    <div class="table-index2">

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" >
          <el-form-item class="form-left">
            <el-form-item label="回盘结果：">
                <el-radio-group v-model="tableQuery.chargingFlag" @change="initDetail">
                  <el-radio :label="item.value" v-for="item in flagData" :key="item.value">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
          </el-form-item>
          <el-form-item class="form-right">
              <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight2" stripe border  :data="detail.list" class="ChargeReportOfBankOutInDetailed-table">

          <el-table-column type="index" label="NO." width="50" fixed="left">
          </el-table-column>
          <el-table-column prop="ctmNo" min-width="60" label="客户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="bankName" min-width="60" label="开户银行" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="bankAccount" min-width="60" label="银行账号" show-overflow-tooltip> 
          </el-table-column>

          <el-table-column prop="bankAccountName" min-width="60" label="开户名称" show-overflow-tooltip> 
          </el-table-column>

          <el-table-column prop="linkTel" min-width="80" label="联系电话" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="amountMoney" min-width="60" label="扣款金额" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="result" min-width="40" label="回盘结果" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="remark" min-width="60" label="备注" show-overflow-tooltip>
          </el-table-column>
       

        </el-table>
       
      </div>
       <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[100, 200, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detail.total"></el-pagination>
        </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "ChargeReportOfBankOutInDetailed",
  components: {

  },
  data() {
    return {
      tableData:[],
      detail:{},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod:'',
        chargingType:'1',
        chargingFlag:'2',
        bankOutInId:'',
      },
      flagData:[{value:'2',name:'全部'},{value:'1',name:'扣款成功'},{value:'0',name:'扣款失败'}],
      accountFlowData:{},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "银行扣款记录" }]
      },
      tableShow: true,
      maxHeight1: 100,
      maxHeight2: 100,
      chargingTypeData:[{value:'1',name:'代扣'},{value:'2',name:'托收'}],
    };
  },
  mounted() {
   
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + month
    // this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 列表初始化
    init() {
      let _this = this 
      this.tableQuery.bankOutInId=''
      let params = {
        busicode: "BankOutInDetailedReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.data
        _this.detail = res.detail
        this.maxHeight1 = $('.table-index1').outerHeight() - $('.table-index1 .toolbar').outerHeight() - 20
      this.maxHeight2 = $('.table-index2').outerHeight() - $('.table-index2 .toolbar').outerHeight() - 20
      })
    },
    rowClick(row) {
        this.tableQuery.bankOutInId = row.bankOutInId 
        this.initDetail()
    },
    initDetail(){
      let _this = this
      let params = {
        busicode: "BankOutInDetailedReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.detail = res.detail 
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "BankOutInDetailedReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },

  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfBankOutInDetailed {
  width: 100%;
  height: 100%;
  .table-index1, .table-index2 {
    height: calc(50% - 40px);
    .kl-table {
      height: calc(100% - 40px);
    }
  }
}
</style>

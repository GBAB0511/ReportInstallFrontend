<template>
  <!-- 收入月明细 -->
  <div class="ChargeReportOfMonthlyRevenueDetail">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

             <el-form-item label='日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="缴费方式：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.payMethod" placeholder="缴费方式">
                <el-option v-for="item in dictionaryData.BPI" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="缴费渠道：" class="width-150">
              <el-select ref="select2" clearable v-model="tableQuery.payChannel" placeholder="缴费渠道">
                <el-option v-for="item in dictionaryData.BPC" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="营业厅:" v-if="businessHallButton" class="width-150">
              <el-select ref="businessHall" clearable v-model="tableQuery.businessHallId" placeholder="营业厅">
                <el-option v-for="item in businessHallOptions" :key="item.id" :label="item.hallName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模糊查询：" class="width-150">
              <el-tooltip class="item" effect="dark" content="用户编号、账户编号" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号、账户编号" v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
            </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData.list" class="ChargeReportOfMonthlyRevenueDetail-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="accountNo" min-width="80" label="账户" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payChannel" min-width="100" label="缴费渠道" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payWay" min-width="100" label="缴费方式" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="deposit" min-width="100" label="存款金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="payment" min-width="100" label="扣款金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="balance" min-width="100" label="余额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="chargingStaffName" min-width="100" label="收款员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payTime" min-width="100" label="付款时间" show-overflow-tooltip>
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
  name: "ChargeReportOfMonthlyRevenueDetail",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      // 列表数据
      tableData: {},
      totalData: {},
      // 数据字典数据
      dictionaryData: {},
       businessHallOptions:[],//营业厅 下拉框
      Time:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startDate:'',
        endDate:'',
        payChannel:'',
        payMethod:'',
        fuzzyQuery:'',
         businessHallId:'',
      },
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "收入月明细" }]
      },
      tableShow: false,
      maxHeight: 0,
      businessHallButton:false,
    };
  },
  mounted() {
    this.Time = [this.common.date(), this.common.date()]
    this.showBusinessHall()
    this.getDatePicker(this.Time) 
    this.getDictionary()
     this.selectBusinessHall();
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfMonthlyRevenueDetail .index-page", [
      ".ChargeReportOfMonthlyRevenueDetail .toolbar",
      ".ChargeReportOfMonthlyRevenueDetail .block",
      ".ChargeReportOfMonthlyRevenueDetail #crumbs"
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
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MonthlyRevenueDetailReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        console.log(res)
      })
    },
     //获取营业厅 显示配置
    showBusinessHall() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'business_hall_condition_shaw',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if(res.list.length>0){
                  this.businessHallButton = res.list[0].configValue==1?true:false;            
          }
        })
    },
     // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPC,BPI"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
     //营业厅下拉框
    selectBusinessHall() {
      let params = {
        "busicode": "BaseBusinessHallList",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {    
        this.businessHallOptions = res;
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
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "MonthlyRevenueDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
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
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfMonthlyRevenueDetail {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

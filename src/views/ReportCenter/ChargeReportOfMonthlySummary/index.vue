<template>
  <!-- 应收月汇总 -->
  <div class="ChargeReportOfMonthlySummary">
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
          <el-form-item class="form-left">
            <el-form-item label='账期'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
             <el-form-item label="营业区域：" class="width-150">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" @change="getBusinessArea"
              :options="businessAreaData"
              :show-all-levels="false"
              :props="props">
            </el-cascader>
          </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal' :data="tableData.list" class="ChargeReportOfMonthlySummary-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="80" label="账期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="totalAmount" min-width="100" label="总户数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="haveReadingAmount" min-width="100" label="已抄数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="notReadingAmount" min-width="100" label="未抄数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="newAmount" min-width="80" label="新增户" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="stopAmount" min-width="100" label="报停户" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column label="当月应收" align="center"> 
            <el-table-column prop="receivableAmount" min-width="100" label="户数" show-overflow-tooltip align="right">
            </el-table-column> 

            <el-table-column prop="receivableWater" min-width="120" label="水量" show-overflow-tooltip align="right">
            </el-table-column> 

             <el-table-column :label="item.costName" min-width="120" v-for="(item,index) in costNameList" align="right" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.ysCostList[index] && scope.row.ysCostList[index].money }}</span>
              </template>
             </el-table-column>


            <el-table-column prop="receivableMoney" min-width="120" label="总额" show-overflow-tooltip align="right">
            </el-table-column>


          </el-table-column>

          <el-table-column label="当月回收" align="center"> 
            <el-table-column prop="proceedsAmount" min-width="100" label="户数" align="right">
            </el-table-column>

            <el-table-column prop="proceedsWater" min-width="100" label="水量" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column :label="item.costName" min-width="120" v-for="(item,index) in costNameList" align="right" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.ssCostList[index] && scope.row.ssCostList[index].money }}</span>
              </template>
          </el-table-column>

            <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column prop="proceedsMoney" min-width="120" label="总额" show-overflow-tooltip align="right">
            </el-table-column>

          </el-table-column>

          <el-table-column prop="timelyRecoveryRatio" min-width="100" label="即时回收率" align="right">
          </el-table-column>

          <el-table-column prop="totalRecoveryRatio" min-width="90" label="总回收率" align="right">
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
  name: "ChargeReportOfMonthlySummary",
  components: {

  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      // 主页面显示与隐藏
      indexShow: true,
      // 列表数据
      tableData: {},
      totalData: {},
      costNameList:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startAccountPeriod: '',
        endAccountPeriod: '',
        businessArea:''
      },
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "应收月汇总" }]
      },
      tableShow: false,
      maxHeight: 0,
      businessAreaData: [] //营业区域
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfMonthlySummary", [
      ".ChargeReportOfMonthlySummary .toolbar",
      ".ChargeReportOfMonthlySummary .block",
      ".ChargeReportOfMonthlySummary #crumbs"
    ]);
    this.selectBAreaOptions();
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MonthReceivableReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        _this.costNameList = res.costNameList
      });
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "MonthReceivableReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    //营业区域
    getBusinessArea(val) {
      val = this.common.handleTreeData(val);
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
    // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key]) 
          if(key == 'receivableWater') {
             this.totalData.ysCostList.forEach(item=>{
                arr.push(item.money)
            })
          }
          if(key == 'proceedsWater') {
             this.totalData.ssCostList.forEach(item=>{
                arr.push(item.money)
            })
          }
        }
      }
      return arr
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
    Time(val) {
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfMonthlySummary {
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

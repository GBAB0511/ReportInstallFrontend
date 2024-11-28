<template>
  <!-- 未收明细表 -->
  <div class="ChargeReportOfUncollectedDetailed">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left">

            <el-form-item label='账期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="用户编号：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" placeholder="请输入用户编号" clearable @keydown.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="用水类型：" class="width-250">
              <el-cascader
                v-model="tableQuery.waterTypeId"
                :options="useWaterTypeOptions"
                :show-all-levels="false"
                clearable
                :props="props">
              </el-cascader>
            </el-form-item>
             <el-form-item label="营业区域：" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
               :show-all-levels="false" :props="tprops"  >
            </el-cascader>
            </el-form-item >
               <el-form-item label="抄表员：" class="width-150"  label-width="60px">
          <el-select  v-model="tableQuery.meterReadingStaffName" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
        </el-form-item>

            <el-form-item label="水量>=" class="width-150"  label-width="65px">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.calculateWater" placeholder="请输入水量" @keydown.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="欠费>=" class="width-150" label-width="60px">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.arrearsMoney" placeholder="请输入欠费" @keydown.enter.native="search"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal' @sort-change='getSort' :data="tableData.list" class="ChargeReportOfUncollectedDetailed-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="110" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="priorPeriodNum" min-width="80" label="起码" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="currendPeriodNum" min-width="80" label="止码" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="140" label="用水性质" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="calculateWater" min-width="100" label="水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="arrearsWaterFee" min-width="120" label="水费" align="right" :sort-orders="['descending','ascending','descending']" :sortable="'custom'" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" align="right" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="arrearsSweageFee" min-width="120" label="污水费" align="right" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="arrearsWaterResourceFee" min-width="120" label="水资源费" align="right" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="arrearsGarbage" min-width="120" label="垃圾费" align="right" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="arrearsSubTotal" min-width="120" label="总金额" align="right" show-overflow-tooltip>
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
  name: "ChargeReportOfUncollectedDetailed",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startAccountPeriod: '',
        endAccountPeriod: '',
        calculateWater:'',
        arrearsMoney:'',
        userNo:'',
        waterTypeId:'',
        businessArea:'',
        meterReadingStaffName:'',
      },
      meterReaderList:[],
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
       businessArea:[],
       useWaterTypeOptions:[],//用水类型下拉框
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "未收明细表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) + '' : '0' + (time.getMonth() + 1)
    // this.Time.push( time.getFullYear() + (month - 1 < 10 ? ('0' + (month - 1)) : (month - 1).toString()))
    this.Time.push( time.getFullYear() + month)
    this.Time.push( time.getFullYear() + month)
    this.tableQuery.startAccountPeriod = this.Time[0]
    this.tableQuery.endAccountPeriod = this.Time[1]
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfUncollectedDetailed", [
      ".ChargeReportOfUncollectedDetailed .toolbar",
      ".ChargeReportOfUncollectedDetailed .block",
      ".ChargeReportOfUncollectedDetailed #crumbs"
    ]);
    this.SelectUseWaterTypeOptions();
    this.businessAreaSelect();
    this.getMeterReader();
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "ArrearsDetailReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
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
     //抄表员下拉框数据
    getMeterReader() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { postNo: "2" },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ArrearsDetailReportExport",
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
    getSort(sort){
      if (sort.order === 'ascending'){
        this.tableQuery.sort = 0;
      }else {
        this.tableQuery.sort = 1;
      }
      this.init();
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
      console.log(this.tableQuery)
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
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfUncollectedDetailed {
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

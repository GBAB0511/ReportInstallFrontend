<template>
  <!-- 拆表 -->
  <div class="OtherReportOfWaterStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='开户时间：' class="dateAndTime">
              <el-date-picker v-model="openAccountDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          
            <el-form-item label="统计方式：" class="width-150">
              <el-select ref="select1"  v-model="statisticsWay" placeholder="统计方式">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="营业区域：" prop="businessArea" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>

            <el-form-item label="水表状态：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.meterStatus" placeholder="水表状态">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in dictionaryData.MMS" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表分类：" class="width-150">
              <el-select ref="select2" clearable v-model="tableQuery.meterType" placeholder="水表分类">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in dictionaryData.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

           <!-- <el-form-item  label="水表状态：">
              <el-select v-model="tableQuery.statisticsType" clearable style="width: inherit;">
                <el-option v-for="item in dictionaryData.MMS" :key="item.value" :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item v-if="tableQuery.statisticsWay == 2" label="水表类型：">
              <el-select v-model="tableQuery.statisticsType" clearable style="width: inherit;">
                <el-option v-for="item in dictionaryData.MMT" :key="item.value" :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
          </el-form-item> -->

          <!-- <el-form-item label="水表厂家：">
            <el-select clearable v-model="tableQuery.meterFactory" placeholder="水表厂家" @change="getMeterList(tableQuery.meterFactory)" >
              <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->

           <!-- <el-form-item label="水表型号：">
              <el-select clearable v-model="tableQuery.meterModel" placeholder="水表型号">
                <el-option v-for="(item,index) in meterModelData" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item> -->
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData.list" class="OtherReportOfWaterStatistics-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column v-if="statisticsWay == 1" prop="meterFactory" min-width="120" label="水表厂家">
          </el-table-column>
          <el-table-column v-if="statisticsWay == 2" prop="meterTypeName" min-width="120" label="水表分类">
          </el-table-column>
          <el-table-column v-if="statisticsWay == 3" prop="meterStatusName" min-width="120" label="水表状态">
          </el-table-column>
          <el-table-column v-if="statisticsWay == 4" prop="meterBore" min-width="120" label="口径">
          </el-table-column>
          <el-table-column v-if="statisticsWay == 5" prop="valveControl" min-width="120" label="是否阀控">
            <template slot-scope="scope">
              <span v-if="scope.row.valveControl == '1'" style="color: #000;">是</span>
							<span v-else style="color: #000;">否</span>
            </template>
          </el-table-column>
          <el-table-column v-if="statisticsWay == 6" prop="TransmittalModelName" min-width="120" label="通讯类型">
          </el-table-column>
          <el-table-column v-if="statisticsWay == 7" prop="meterModelName" min-width="200" label="水表型号">
          </el-table-column>

          <el-table-column prop="meterTypeName" min-width="120" label="水表分类">
          </el-table-column>
          <el-table-column prop="meterStatusName" label="水表状态" min-width="120">
          </el-table-column>
          <el-table-column prop="businessArea" label="营业区域" min-width="120">
          </el-table-column>
          <el-table-column prop="meterFactoryName" label="水表厂家" min-width="120">
          </el-table-column>
          <el-table-column prop="meterBore" label="水表口径" min-width="120">
          </el-table-column>
          <el-table-column prop="valveControl" label="是否阀控" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.valveControl == '1'" style="color: #000;">是</span>
							<span v-else style="color: #000;">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="transmittalModelName" label="通讯类型" min-width="120">
          </el-table-column>
          <el-table-column prop="meterModel" label="水表型号" min-width="200">
          </el-table-column>
          <el-table-column prop="commOperator" label="通讯运营商" min-width="120">
          </el-table-column>
          <el-table-column prop="meterAmount" min-width="100" label="数量" align="right">
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
  name: "OtherReportOfWaterStatistics",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      dictionaryData:[],
    // 水表厂家下拉数据
      meterFactoryData: {},
      meterModelData: [],
      Time: [],
      openAccountDate: [],
      // 列表数据
      tableData: {},
      totalData:{},//合计
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        //statisticsWay: 1,
        meterStatus:'',
        meterType:'',
        businessArea: '',
        groupCode: localStorage.getItem('companyNo'),
        //statisticsType:''
      },
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      statisticsWay: "1",
      // 状态下拉框数据
      processStateData: [
        {name:'水表厂家',value:"1"},
        {name:'水表分类',value:"2"},
        {name:'水表状态',value:"3"},
        {name:'口径',value:"4"},
        {name:'是否阀控',value:"5"},
        {name:'通讯类型',value:"6"},
        {name:'水表型号',value:"7"},
      ],
      // 营业所下拉数据
      businessAreaData: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "水表统计表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow5')
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate();
    this.openAccountDate = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];
    this.Time = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];
    // this.getMeterFactory()
    // this.getMeterModel()
    this.getBusinessAreaData() 
    this.getDictionary()
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfWaterStatistics", [
      ".OtherReportOfWaterStatistics .toolbar",
      ".OtherReportOfWaterStatistics .block",
      ".OtherReportOfWaterStatistics #crumbs"
    ]);
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
      if (this.tableQuery.setupDate1 === ''){
        this.$message.error("请选择开户时间！")
        return
      }
      let params = {
        busicode: "MeterSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
        //_this.totalData = res.total
      })
    },
    getMeterList(val){
     console.log(val)
     if(val){
       this.getMeterModel(val)
     }
    },
        // 水表厂家下拉数据
    getMeterFactory(val) {
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 20,
          "factoryId":val
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res
      })
    },
        // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMS,MMT"//水表分类、水表状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
        // 水表型号下拉数据
    getMeterModel(val) {
      var _this = this
      var params = {
        "busicode": "WaterMeModelOpList",
        "data": {
          "factoryId":val
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterModelData = res
      })
    },
    // 营业区域下拉框
    getBusinessAreaData() {
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
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.setupDate1 = date[0]
        this.tableQuery.setupDate2 = date[1]
      } else {
        this.tableQuery.setupDate1 = ''
        this.tableQuery.setupDate2 = ''
      }
    },
      // 导出
    exportExcel() {
      let params = {
        "busicode": "MeterSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计','']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
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
        this.tableQuery.setupDate1 = val[0]
        this.tableQuery.setupDate2 = val[1]
      }
    },
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.OtherReportOfWaterStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>

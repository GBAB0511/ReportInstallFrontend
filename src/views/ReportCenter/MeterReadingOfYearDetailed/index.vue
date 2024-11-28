<template>
  <div class="MeterReadingOfYearDetailed">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="main-container">
       <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left">

          <el-form-item label="年份：" class="width-200">
            <el-date-picker  v-model="tableQuery.year" size="mini" type="year" unlink-panels format="yyyy" value-format="yyyy" placeholder="选择年"></el-date-picker>
          </el-form-item>

          <el-form-item label="册本号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号"></el-input>
          </el-form-item>

          <el-form-item label="营业区域：" prop="businessArea" class="width-150">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item label="用水类型：" prop="useWaterType"  class="width-250">
            <el-cascader v-model="tableQuery.useWaterType" clearable :options="useWaterTypeData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-200">
            <el-tooltip class="item" effect="dark" content="用户编号/客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号/客户名称" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="水表口径：" prop="businessArea" class="width-150">
            <el-select ref="select1" v-model="tableQuery.boreValue" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in meterBoreOptions" :key="index" :label="item.boreName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="change-tables-table">

        <!-- <el-table-column type="selection" width="50" fixed="left">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="ctmAddr" min-width="100" label="客户地址" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="useWaterType" min-width="100" label="用水类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="meterBore" min-width="100" label="口径">
        </el-table-column>

        <el-table-column prop="month1" min-width="100" label="一月" align="right">
        </el-table-column>

        <el-table-column prop="month2" min-width="100" label="二月" align="right">
        </el-table-column>

        <el-table-column prop="month3" min-width="100" label="三月" align="right">
        </el-table-column>

        <el-table-column prop="month4" min-width="100" label="四月" align="right">
        </el-table-column>

        <el-table-column prop="month5" min-width="100" label="五月" align="right">
        </el-table-column>

        <el-table-column prop="month6" min-width="100" label="六月" align="right">
        </el-table-column>

        <el-table-column prop="month7" min-width="100" label="七月" align="right">
        </el-table-column>

        <el-table-column prop="month8" min-width="100" label="八月" align="right">
        </el-table-column>

        <el-table-column prop="month9" min-width="100" label="九月" align="right">
        </el-table-column>

        <el-table-column prop="month10" min-width="100" label="十月" align="right">
        </el-table-column>

        <el-table-column prop="month11" min-width="100" label="十一月" align="right">
        </el-table-column>

        <el-table-column prop="month12" min-width="100" label="十二月" align="right">
        </el-table-column>

        <el-table-column prop="total" min-width="100" label="合计" align="right">
        </el-table-column>

      </el-table>
      
    </div>

    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
    </div>

   

  </div>
</template>
<script>

export default {
  name: "MeterReadingOfYearDetailed",
  components: {

  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "抄表水量报表" }, { title: "水量年明细报表" }]
      },
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        year: '',// 年份
        bookNo: '',// 册本号
        businessArea: '',// 营业区域
        useWaterType: '',// 用水类型
        fuzzyQuery: '',// 模糊查询
        boreValue: '' //水表口径
      },
      // 列表数据
      tableData: {},
      // 合计数据
      totalData: {},
      // 营业区域下拉数据
      businessAreaData: [],
      // 用水类型下拉数据
      useWaterTypeData: [],
      // 水表口径下拉框数据
      meterBoreOptions: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      tableShow: false,
      maxHeight: 0,
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow3')
    let time = new Date()
    this.tableQuery.year = time.getFullYear() + ''

    // this.init()
    this.getBusinessAreaData()
    this.getUseWaterTypeData()
    this.getBoreValueData()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".MeterReadingOfYearDetailed .main-container", [
      ".MeterReadingOfYearDetailed .toolbar",
      ".MeterReadingOfYearDetailed .block"
    ])
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 初始化
    init() {
      let _this = this
      if (
        typeof _this.tableQuery.useWaterType == "object" &&
        _this.tableQuery.useWaterType != undefined
      ) {
        _this.tableQuery.useWaterType = _this.tableQuery.useWaterType[_this.tableQuery.useWaterType.length - 1];
      }
      let params = {
        "busicode": "YearWaterDetailStatistics",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res.detail
        this.totalData = res.total
        // this.getTotal(res.total)
      })
    },
    // 返回合计数据
    getTotal(total) {
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "YearWaterDetailStatisticsExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
        this.businessAreaData = data.children;
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
    // 用水类型下拉框
    getUseWaterTypeData() {
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res)
        this.$set(this, "useWaterTypeData", data.children)
      }).catch(res => {
        this.$set(this, "useWaterTypeData", [])
      });
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
     //水表口径下拉框
    getBoreValueData(){
      let params = {
        "busicode": "MeterBoreSelect",
        "data": '',
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
        this.meterBoreOptions = res
      })
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);

    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    }
  }
};
</script>
<style lang="scss">
.MeterReadingOfYearDetailed {
  width: calc(100% - 20px);
  height: 100%;
  .main-container {
    height: calc(100% - 42px);
  }
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
<template>
  <!-- 拆表 -->
  <div class="OtherReportOfWarehousingDetailed">
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
          <el-form-item label="类型：">
              <el-select ref="select1" clearable v-model="tableQuery.operateType" placeholder="类型">
                <el-option v-for="item in dictionaryData.OPT" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>

          </el-form-item >

          <el-form-item label="营业区域：" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea" :show-all-levels="false" :props="props">
            </el-cascader>
            </el-form-item>


            <el-form-item label='日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
           </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="OtherReportOfWarehousingDetailed-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="meterNo" min-width="80" label="水表编号">
          </el-table-column>

          <el-table-column prop="businessAreaName" min-width="100" label="营业区域">
          </el-table-column>

          <el-table-column prop="factoryNo" min-width="100" label="水表表身号">
          </el-table-column>

          <el-table-column prop="operateTime" min-width="100" label="操作日期">
          </el-table-column>

          <el-table-column prop="operateType" min-width="80" label="类型">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称">
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="100" label="客户地址">
          </el-table-column>

          <el-table-column prop="setupName" min-width="80" label="装表员">
          </el-table-column>

          <el-table-column prop="manageName" min-width="80" label="管表员">
          </el-table-column>
          <el-table-column prop="factoryFullName" min-width="80" label="水表厂家">
          </el-table-column>
          <el-table-column prop="modelName" min-width="80" label="水表型号">
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
  name: "OtherReportOfWarehousingDetailed",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },

      businessArea: [],
      // 列表数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        operateType: '',
        startDate: '',
        endDate: '',
        businessArea: '',
      },
      // 查询条件日期
      Time: [],
      // 数据字典数据
      dictionaryData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "水表状态变更记录" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow5')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.startDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.endDate = `${time.getFullYear()}-${month}-${day}`
    this.Time = [this.tableQuery.startDate, this.tableQuery.endDate]
    // this.init()
    this.getDictionary()
    this.businessAreaSelect()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfWarehousingDetailed", [
      ".OtherReportOfWarehousingDetailed .toolbar",
      ".OtherReportOfWarehousingDetailed .block",
      ".OtherReportOfWarehousingDetailed #crumbs"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
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
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "WaterOperateReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
      // 导出
    exportExcel() {
      let params = {
        "busicode": "WaterOperateReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "OPT"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        _this.dictionaryData.OPT.unshift({name: '全部', value: '', id: 0})
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
.OtherReportOfWarehousingDetailed {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfEndOfMonth">
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
            <el-form-item label='收费日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item> 


            <el-form-item label="营业区域：">
             <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border   :data="tableData.total" class="ChargeReportOfEndOfMonth-table">

          <el-table-column prop="waterTypeName" min-width="100" label="用水类型" show-overflow-tooltip>
          </el-table-column>


          <el-table-column  :label="item.name"  v-for="(item,index) in tableData.cost" :key="index">
              <template slot-scope="scope">              
                <span style="color:black;">{{scope.row[item.nameEn]}}</span>
              </template>
          </el-table-column>

       

          <el-table-column prop="ysMoney" min-width="120" label="预存余额" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="heji" min-width="120" label="合计" show-overflow-tooltip>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>-->
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfEndOfMonth",
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
      // 列表数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        startDate: '',
        endDate: '',
        businessArea: '',
      },
      businessAreaData: [],
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "月底收入报表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    // this.tableQuery.startDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.startDate = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.endDate = `${time.getFullYear()}-${month}-${day}`
    // this.tableQuery.endDate = `${time.getFullYear()}-${(Number(month) + 1) > 9 ? (Number(month) + 1) : '0' + (Number(month) + 1)}-${day}`
    this.Time = [this.tableQuery.startDate, this.tableQuery.endDate]
     this.selectBAreaOptions()
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".ChargeReportOfEndOfMonth", [
        ".ChargeReportOfEndOfMonth .toolbar",
        ".ChargeReportOfEndOfMonth .block",
        '.ChargeReportOfEndOfMonth .bread-contain'
      ]);
    })
    
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "EndOfMonthChargeSummary",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },

    //营业区域
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
     // 导出
    exportExcel() {
      let params = {
        "busicode": "EndOfMonthChargeSummaryExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },

    // 查询
    search() {
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

    // //分页
    // handleSizeChange(val) {
    //   //显示多少数据一页
    //   this.tableQuery.pageCount = val
    //   this.tableQuery.page = 1
    //   this.init();
    // },
    // handleCurrentChange(val) {
    //   //显示多少页码
    //   this.tableQuery.page = val
    //   this.init();
    // },
    // indexMethod(index) {
    //   //获取表格序号
    //   return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    // },

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
.ChargeReportOfEndOfMonth {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

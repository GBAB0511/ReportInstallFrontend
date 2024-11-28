<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfICProductOperation">
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
           
              <el-form-item label='账期：'>
              <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" >
              </el-date-picker>
            </el-form-item>


            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border   :data="tableData" class="ChargeReportOfICProductOperation-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
      <el-table-column prop="project" min-width="100" label="指标项目" show-overflow-tooltip>
          </el-table-column>
          
          <el-table-column prop="unit" min-width="100" label="计量单位" show-overflow-tooltip>
          </el-table-column>

         

          <el-table-column prop="curMonth" min-width="120" label="本月完成" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="lastYearSameMonth" min-width="120" label="去年同月" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="curMonthLj" min-width="120" label="本年累计" show-overflow-tooltip>
          </el-table-column> 

           <el-table-column prop="lastYearSameMonthLj" min-width="120" label="去年同期累计" show-overflow-tooltip>
          </el-table-column> 


           <el-table-column prop="ratio" min-width="120" label="同期增长率" show-overflow-tooltip>
          </el-table-column>
       

          <el-table-column prop="proceedsAmount" min-width="120" label="本月实收户数" show-overflow-tooltip>
          </el-table-column>

        </el-table>
        
      </div>

    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfICProductOperation",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      props: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      businessArea: [],
      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod:this.common.date('month','yyyyMM'),    
        businessArea:'',
      },

      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "生产经营报表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    //this.businessAreaSelect();
  
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfICProductOperation", [
      ".ChargeReportOfICProductOperation .toolbar",
      ".ChargeReportOfICProductOperation .block",
      '.ChargeReportOfICProductOperation .bread-contain'
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

    changeBusinessArea(val) {
        this.tableQuery.businessArea =  this.common.handleTreeData(val);
    },
   
    // 列表初始化
    init() {
      let _this = this

  
      let params = {
        busicode: "ICProductOperationReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
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
    
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ICProductOperationReportExport",
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
.ChargeReportOfICProductOperation {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

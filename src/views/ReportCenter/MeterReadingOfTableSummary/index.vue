<template>
  <div class="MeterReadingOfTableSummary">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="main-container">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">


            <el-form-item label="账期：">
              <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
            </el-form-item>

            <el-form-item label="营业区域：" prop="businessArea" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>

            <el-form-item label="册本号：" class="width-150">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号" clearable  @keydown.enter.native="search" ></el-input>
            </el-form-item>

            <el-form-item label="抄表员：" class="width-150">
              <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.meterReadingStaff" placeholder="请输入抄表员"></el-input> -->
              <el-select ref="select1" v-model="tableQuery.meterReadingStaff" placeholder="请选择" clearable  @keydown.enter.native="search">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userName"></el-option>
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

          <el-table-column prop="bookNo" min-width="100" label="册本号">
          </el-table-column>

          <el-table-column prop="meterReadingStaff" min-width="100" label="抄表员">
          </el-table-column>

          <el-table-column prop="meterReadingCycle" min-width="100" label="抄表周期">
          </el-table-column>

          <el-table-column prop="meterReadingDay" min-width="100" label="抄表日">
          </el-table-column>

          <el-table-column prop="receivableRead" min-width="100" label="应抄" align="right">
          </el-table-column>

          <el-table-column prop="proceedsRead" min-width="100" label="实抄" align="right">
          </el-table-column>

          <el-table-column prop="unRead" min-width="100" label="未抄" align="right">
          </el-table-column>

          <el-table-column prop="proceedsOpen" min-width="100" label="已开账" align="right">
          </el-table-column>

          <el-table-column prop="unOpen" min-width="100" label="未开账" align="right">
          </el-table-column>

        </el-table>
        
      </div>

      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="tableQuery.page" 
        :page-sizes="[20, 100, 500, 1000]" 
        :page-size="tableQuery.pageCount" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="tableData.total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  name: "MeterReadingOfTableSummary",
  components: {

  },
  data() {
    return {
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false
      },
      crumbsData: {
        //面包屑
        titleList: [{ title: "抄表水量报表" }, { title: "抄表表册汇总" }]
      },
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',// 账期
        businessArea: '',// 营业区域
        bookNo: '',// 册本号
        meterReadingStaff: '',// 抄表员
      },
      // 列表数据
      tableData: {},
      // 合计数据
      totalData: {},
      // 营业区域下拉数据
      businessAreaData: [],
      // 抄表员下拉选择数据
      postUsers: [],
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
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + month

    // this.init()
    this.getBusinessAreaData()
    this.getPostUser()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfTableSummary .main-container", [
      ".MeterReadingOfTableSummary .toolbar",
      ".MeterReadingOfTableSummary .block"
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
      let params = {
        "busicode": "MrBookStatisticsReport",
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
      console.log(total);
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
        "busicode": "MrBookStatisticsReportExport",
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
    getPostUser() {
      const params = {
        busicode: 'PostUserSelect',
        data: {
          postNo: '2'
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.postUsers = res
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
.MeterReadingOfTableSummary {
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
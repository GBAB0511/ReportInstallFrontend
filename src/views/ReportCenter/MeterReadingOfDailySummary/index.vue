<template>
  <div class="MeterReadingOfDailySummary">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="统计方式：">
            <el-select ref="select1" clearable v-model="tableQuery.statisticsWay" placeholder="请选择">
              <el-option v-for="item in statisticsWayData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="账期：">
            <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
          </el-form-item>
             <el-form-item v-if="showAreaNoDialog" label="营业区域：">
                <el-cascader
                  ref="cascader"
                  clearable
                  v-model="tableQuery.businessAreaId"
                  @change="getBusinessArea"
                  :options="businessAreaData"
                  :show-all-levels="false"
                  :props="props"
                >
                </el-cascader>
              </el-form-item>

          <el-form-item v-if="showBookNoDialog" label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号" @keydown.enter.native="search"></el-input>
          </el-form-item>

        <el-form-item v-if="showStatisticsDialog" label="抄表员：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.meterReadingStaff" placeholder="请输入" clearable @keydown.enter.native="search">
            </el-input>
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

        <el-table-column prop="statisticsType" min-width="100" :label="statisticsTypeName">
        </el-table-column>
        
        <!-- <el-table-column  prop="businessAreaId" min-width="100" label="营业区域">
        </el-table-column>

        <el-table-column v-if="showBookNoDialog" prop="bookNo" min-width="100" label="册本">
        </el-table-column>

        <el-table-column v-if="showStatisticsDialog" prop="meterReadingStaff" min-width="100" label="抄表员">
        </el-table-column> -->

        <el-table-column v-for="i in 31" :key="i" :prop="'day' + i" min-width="100" :label=" i + '日'" align="right">
        </el-table-column>

        <el-table-column prop="day32" min-width="100" label="合计" align="right">
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>

  </div>
</template>
<script>

export default {
  name: "MeterReadingOfDailySummary",
  components: {

  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
       // 营业区域下拉数据
      businessAreaData: [],
      showAreaNoDialog:true, 
      showStatisticsDialog: false,
      showBookNoDialog: false,
     // 抄表员下拉选择数据
      postUsers: [],
      crumbsData: {
        //面包屑
        titleList: [{ title: "抄表水量报表" }, { title: "抄表每日汇总" }]
      },
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',// 账期
        statisticsWay: '1',// 统计方式
      },
      // 列表数据
      tableData: {},
      // 合计数据
      totalData: {},
      // 统计方式下拉数据
      statisticsWayData: [
        // { name: '营业所', value: '1' },
        { name: '营业区域', value: '1' },
        { name: '抄表员', value: '2' },
        { name: '按册本', value: '3' },
      ],
      // 类型表头字段名（动态化）
      statisticsTypeName: '营业区域',
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
    watch: {

  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow3')
    this.getPostUser()
    this.selectBAreaOptions();
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + month

    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".MeterReadingOfDailySummary", [
        ".MeterReadingOfDailySummary .toolbar",
        ".MeterReadingOfDailySummary .block",
        '.MeterReadingOfDailySummary .bread-contain'
      ])
    })
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
     this.tableQuery.businessAreaId = this.common.handleTreeData(
        this.tableQuery.businessAreaId
      );
      let _this = this
      let params = {
        "busicode": "MrDayStatisticsReport",
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
     getBusinessArea(val) {
      //  console.log(val)
      val = this.common.handleTreeData(val);
      return val;
    },
    selectBAreaOptions() {
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
          let data = this.getArr(res);
          _this.businessAreaData = data.children;
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
        "busicode": "MrDayStatisticsReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 获取施工日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.constBeginDate = date[0]
        this.tableQuery.constEndDate = date[1]
      } else {
        this.tableQuery.constBeginDate = ''
        this.tableQuery.constEndDate = ''
      }
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      if (this.tableQuery.statisticsWay == 1) {
        this.statisticsTypeName = this.statisticsWayData[0].name
      } else if (this.tableQuery.statisticsWay == 2) {
        this.statisticsTypeName = this.statisticsWayData[1].name
      } else if (this.tableQuery.statisticsWay == 3) {
        this.statisticsTypeName = this.statisticsWayData[2].name
      }
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
    },
    'tableQuery.statisticsWay': {
      handler:function(newval,oldval){
        if(newval == 2){   //抄表员
            this.showStatisticsDialog = true
            this.showBookNoDialog = false
        } else if(newval == 3){ //册本
              this.showStatisticsDialog = false
              this.showBookNoDialog = true
        } else {
          this.showStatisticsDialog = false
          this.showBookNoDialog = false
          this.showAreaNoDialog = true
        }
      },
      deep:true
    }
  }
};
</script>
<style lang="scss">
.MeterReadingOfDailySummary {
  width: 100%;
  height: 100%;
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
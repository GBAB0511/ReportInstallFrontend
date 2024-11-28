<template>
  <!-- 垃圾费收费统计表 -->
  <div class="ChargeReportOfGarbageFeeStatistics">
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
            <el-form-item label='缴费日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange"  value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"  :default-value="['2021-01-01', '2021-08-04']">
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
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight"   stripe border   :data="tableData" class="ChargeReportOfEndOfMonth-table" :span-method="objectSpanMethod">
         <!-- <template v-for="(item,index) in tableData" > -->
          <el-table-column prop="businessArea" min-width="100" label="营业所" show-overflow-tooltip >
          </el-table-column>

          <!-- <el-table-column  :label="item.name"  v-for="(item,index) in tableData.cost" :key="index">
              <template slot-scope="scope">
                <span style="color:black;">{{scope.row[item.nameEn]}}</span>
              </template>
          </el-table-column> -->

            <el-table-column prop="payMethod" min-width="120" label="缴费渠道" show-overflow-tooltip >
            </el-table-column>
              <el-table-column prop="sumNum" min-width="120" label="笔数" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="totalMoney" min-width="120" label="缴费金额" show-overflow-tooltip >
            </el-table-column>
          <!-- </template> -->

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
  name: "ChargeReportOfGarbageFeeStatistics",
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
      tableData: [],
      //查询条件对象
      tableQuery: {
        chargeStartTime: '',
        chargeEndTime: '',
        businessArea: '',
      },
      businessAreaData: [],
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "垃圾费收费统计表" }]
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
    this.tableQuery.chargeStartTime = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month))}-${(Number(day) - 1)}`
    // this.tableQuery.startDate = `${time.getFullYear()}-${month}-${day}`
    // this.tableQuery.chargeEndTime = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.chargeEndTime = `${time.getFullYear()}-${(Number(month) + 1) > 9 ? (Number(month) + 1) : '0' + (Number(month))}-${day}`
    this.Time = [this.tableQuery.chargeStartTime, this.tableQuery.chargeEndTime]
     this.selectBAreaOptions()
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量


  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "GarbageChargeReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = []
        for (let index = 0; index < res.length; index++) {
          var element = res[index].dataList;
          for (let j = 0; j < element.length; j++) {
            var e = element[j];
            _this.tableData.push(e)
          }
        }
        if (this.tableData.length > 0) {
          //后台获取到数据后进行数据处理
          this.getSpanArr(this.tableData);
        }
        // _this.tableData = res.data;
        this.$nextTick(() => {
          this.common.changeTable(this, ".ChargeReportOfGarbageFeeStatistics", [
            ".ChargeReportOfGarbageFeeStatistics .toolbar",
            ".ChargeReportOfGarbageFeeStatistics .block",
            '.ChargeReportOfGarbageFeeStatistics .bread-contain'
          ]);
        })
      })
    },
    getSpanArr(data) {
      this.spanArr=[]
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].businessArea === data[i - 1].businessArea) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
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
        "busicode": "GarbageChargeReportExport",
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
        this.tableQuery.chargeStartTime = date[0]
        this.tableQuery.chargeEndTime = date[1]
      } else {
        this.tableQuery.chargeStartTime = ''
        this.tableQuery.chargeEndTime = ''
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
.ChargeReportOfGarbageFeeStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

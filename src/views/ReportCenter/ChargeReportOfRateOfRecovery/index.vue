<template>
  <!-- 按册回收率 -->
  <div class="ChargeReportOfRateOfRecovery">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
     <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='账期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <!--el-form-item label="营业所：">
              <el-select @change="businessAreaSelect" clearable v-model="tableQuery.businessAbode" placeholder="营业所">
                <el-option v-for="item in businessAbode" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item-->

            <el-form-item label="营业区域：" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea" :show-all-levels="false" :props="props">
            </el-cascader>
            </el-form-item>

             <el-form-item label="抄表员：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.meterReadingStaffName" placeholder="抄表员">
                <el-option v-for="item in meterStaff" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="册本：" class="width-150">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="册本" @keydown.enter.native="search" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal' :span-method="objectSpanMethod"  :data="tableData.list" class="ChargeReportOfRateOfRecovery-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <!--el-table-column prop="businessAbode" min-width="60" label="营业所" show-overflow-tooltip>
          </el-table-column-->

          <el-table-column prop="businessArea" min-width="100" label="营业区域" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="bookNo" min-width="110" label="册本号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column prop="proceedsMoney" min-width="120" label="回收金额" show-overflow-tooltip>
          </el-table-column> -->

          <el-table-column prop="meterReadingRatio" min-width="100" label="抄见率" show-overflow- align="right">
          </el-table-column>

          <el-table-column prop="reciveBookRatio" min-width="120" label="册本回收率" show-overflow-tooltip align="right">
            <template slot="header">
              <span style="color:#111 !important">册本回收率
                <el-tooltip placement="top" effect="light">
                  <template slot="content">
                    <div style="font-size:16px;line-height: 20px;">
                      <span>册本回收率 = 回收及时户数  / (已抄户 - 小5方户)</span>
                    </div>
                  </template>
                  <i class="el-icon-warning-outline" style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
                </el-tooltip>
                </span>
            </template>
          </el-table-column>

          <el-table-column prop="fundRecoveryRatio" min-width="120" label="资金回收率" show-overflow-tooltip align="right">
            <template slot="header">
              <span style="color:#111 !important">资金回收率
                <el-tooltip placement="top" effect="light">
                  <template slot="content">
                    <div style="font-size:16px;line-height: 20px;">
                      <span>资金回收率 = 回收及时金额  / 抄见金额</span>
                    </div>
                  </template>
                  <i class="el-icon-warning-outline" style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
                </el-tooltip>
                </span>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="receivableAmount" min-width="100" label="应抄户" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="proceedsReadingAmount" min-width="80" label="已抄户" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="receivableWater" min-width="100" label="抄水量" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="receivableMoney" min-width="120" label="抄见金额" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="proceedsAmount" min-width="80" label="已收户" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="proceedsWater" min-width="100" label="已收水量" show-overflow-tooltip>
          </el-table-column> -->

          <el-table-column prop="proceedsAmountRatio" min-width="120" label="回收及时户数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsMoneyRatio" min-width="120" label="回收及时金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsWater" min-width="120" label="回收及时水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="receivableAmount" min-width="100" label="应抄户" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="proceedsReadingAmount" min-width="80" label="已抄户" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="receivableWater" min-width="100" label="抄水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="openAccounts" min-width="100" label="本期开账数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="receivableMoney" min-width="120" label="抄见金额" show-overflow-tooltip align="right">
          </el-table-column>

          <!-- <el-table-column prop="proceedsAmount" min-width="80" label="已收户" show-overflow-tooltip>
          </el-table-column> -->

          <el-table-column prop="proceedsWater" min-width="100" label="已收水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="receivFiveAmount" min-width="100" label="小5方户" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="receivFiveWater" min-width="100" label="小5方水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员" show-overflow-tooltip >
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
  name: "ChargeReportOfRateOfRecovery",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: {},
      totalData: {},
      businessArea: [],
      businessAbode: [],
      meterStaff: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startAccountPeriod: '',
        endAccountPeriod: '',
        bookNo: '',
        meterReadingStaffName: '',
        businessAbode: '',
        businessArea: '',
      },
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "按册回收率" }]
      },
      tableShow: false,
      maxHeight: 0,
      spanArr: [],
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    //this.init()
    //this.businessAbodeSelect()
    this.businessAreaSelect()
    this.meterStaffSelect()
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfRateOfRecovery", [
      ".ChargeReportOfRateOfRecovery .toolbar",
      ".ChargeReportOfRateOfRecovery .block",
      ".ChargeReportOfRateOfRecovery #crumbs"
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
      let params = {
        busicode: "BookNoDetailReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        this.getSpanArr(this.tableData.list);
      })
    },
    /*
    businessAbodeSelect() {   //营业所下拉框
      let _this = this
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.businessAbode = res
      })
    },*/
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
    meterStaffSelect() {   //营业所下拉框
      let _this = this
      let params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.meterStaff = res
      })
    },
     getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].businessAbode === data[i - 1].businessAbode) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
        console.log(this.spanArr)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '营业所') {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`)
        return { // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
      // 导出
    exportExcel() {
      let params = {
        "busicode": "BookNoDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      // let arr = ['合计']
      // for (const key in this.totalData) {
      //   if (this.totalData[key] != '合计') {
      //     arr.push(this.totalData[key])
      //   }
      // }
      // return arr
      let vm = this;
      let sums = [];
      var selectedColm = total.columns;
      let newArray=['合计']
      selectedColm.forEach(a => {
          if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.totalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      sums=newArray;
      return sums;
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
    },
    'tableQuery.businessAbode'() {
        this.tableQuery.businessArea = ""
        this.businessAbodeSelect();
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfRateOfRecovery {
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

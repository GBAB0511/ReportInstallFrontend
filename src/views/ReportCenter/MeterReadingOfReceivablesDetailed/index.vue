<template>
  <div class="MeterReadingOfReceivablesDetailed">

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

            <el-form-item label="营业区域：" prop="businessArea">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea"  @change="getBusinessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>

            <!-- <el-form-item label="抄表员：">
              <el-select ref="select1" v-model="tableQuery.meterReadingStaffName" placeholder="请选择" clearable  @keydown.enter.native="search">
                <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item> -->

            <el-form-item label="抄表员：">
              <el-select v-model="tableQuery.meterReadingStaffName" placeholder="请选择" clearable>
                <el-option-group
                  v-for="group in staffList"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userAccount">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item label="水表类型：">
              <el-select ref="select2" v-model="tableQuery.meterType" placeholder="请选择" clearable  @keydown.enter.native="search">
                <el-option label="机械" value="1"></el-option>
                <el-option label="远传" value="2"></el-option>
                <el-option label="其他" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="用水类型：" prop="useWaterType" >
              <el-cascader v-model="tableQuery.useWaterType" clearable :options="useWaterTypeData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>

            <el-form-item label="缴费方式：">
              <el-select ref="select3" v-model="tableQuery.payMethod" clearable size="mini">
                <el-option v-for="item in dictionaryData.BPI" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-radio-group v-model="tableQuery.statisticsWay">
                <el-radio label="1">按户</el-radio>
                <el-radio label="2">按笔</el-radio>
              </el-radio-group>
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

          <el-table-column prop="businessArea" min-width="150" label="营业所">
          </el-table-column>

          <el-table-column prop="userNo" min-width="150" label="用户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="250" label="客户名称">
          </el-table-column>

          <el-table-column prop="useWaterType" min-width="150" label="用水类型">
          </el-table-column>

          <el-table-column prop="meterType" min-width="100" label="水表类型">
          </el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="350" label="装表地址">
          </el-table-column>

          <el-table-column prop="realReceiveDate" min-width="100" label="实收日期">
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="应收账期">
          </el-table-column>

          <el-table-column prop="chargeStaffName" min-width="100" label="收费员">
          </el-table-column>

          <el-table-column prop="bookReader" min-width="100" label="册本抄表员">
          </el-table-column>

          <el-table-column prop="billReader" min-width="100" label="账单抄表员">
          </el-table-column>

          <el-table-column prop="billCount" min-width="100" label="账单笔数">
          </el-table-column>

          <el-table-column prop="realityWater" min-width="100" label="实收水量">
          </el-table-column>

          <el-table-column prop="realReceiveMoney" min-width="100" label="基本水费">
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
  name: "MeterReadingOfReceivablesDetailed",
  components: {

  },
  data() {
    return {
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      crumbsData: { 
        //面包屑
        titleList: [{ title: "收费管理报表" }, { title: "抄表员实收明细" }]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',// 账期
        businessArea: '',// 营业区域
        meterReadingStaffName: '',// 抄表员
        meterType: "",// 水表类型
        useWaterType: "",// 用水类型
        payMethod: "",// 缴费方式
        statisticsWay: "1",// 按户/按笔
      },
      // 列表数据
      tableData: {},
      // 合计数据
      totalData: {},
      // 营业区域下拉数据
      businessAreaData: [],
      // 抄表员下拉选择数据
      postUsers: [],
      staffList:[],
      // 用水类型下拉数据
      useWaterTypeData: [],
      // 缴费方式下拉数据
      dictionaryData: [],
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
    // this.getPostUser()
    this.getMeterReader();
    this.getUseWaterTypeData()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfReceivablesDetailed .main-container", [
      ".MeterReadingOfReceivablesDetailed .toolbar",
      ".MeterReadingOfReceivablesDetailed .block"
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
      if (!this.tableQuery.accountPeriod) {
        this.$message.error('账期不能为空！')
        return
      }else if(!this.tableQuery.businessArea){
        this.$message.error('营业区域不能为空！')
        return
      }else if(!this.tableQuery.meterReadingStaffName){
        this.$message.error('抄表员不能为空！')
        return
      }
      let _this = this
      let params = {
        "busicode": "ReaderReceivableReport",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res.list
        this.totalData = res.total
        // this.getTotal(res.total)
      })
    },
    // 返回合计数据
    getTotal(param) {
     let vm = this;
      let sums = [];
      var selectedColm = param.columns;
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
    // 导出
    exportExcel() {
      let params = {
        "busicode": "ReaderReceivableReportExport",
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
    getBusinessArea(val) {
      this.getMeterReader(this.common.handleTreeData(this.tableQuery.businessArea));
    },
    //抄表员下拉框数据
    getMeterReader(businessArea = businessArea || "") {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea:businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffList = res;
        });
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
    // 数据字典数据获取
    getDictionary() {
      var params = {
        busicode: "DictionarySelect",
        data: "BPI" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.dictionaryData = res;
        });
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
<style lang="scss" scoped>
.MeterReadingOfReceivablesDetailed {
  width: calc(100% - 20px);
  height: 100%;
  .main-container {
    height: calc(100% - 42px);
  }
}
</style>
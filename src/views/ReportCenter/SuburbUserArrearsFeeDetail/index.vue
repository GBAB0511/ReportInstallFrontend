<template>
  <div class="SuburbUserArrearsFeeDetail">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="print" size="mini" type="primary">打印</el-button>
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="main-container">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

             <el-form-item label="旧行政区域：" label-width="100px" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.area" :options="areaData"
                           :show-all-levels="false" :props="oprops" >
              </el-cascader>
            </el-form-item>

             <el-form-item label="账期：">
              <el-date-picker v-model="Time2" @change="getDatePicker2" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始月份" end-placeholder="结束月份">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" @selection-change="getSelectList" :max-height="maxHeight" show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="selection" width="60" fixed="left">
          </el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="250" label="户名">
          </el-table-column>
          
          <el-table-column prop="ctmAddr" min-width="300" label="地址">
          </el-table-column>
          <el-table-column prop="status" min-width="100" label="">
          </el-table-column>
          <el-table-column prop="mobile" min-width="120" label="手机号码">
          </el-table-column>
          <el-table-column prop="periods" min-width="120" label="欠费月份">
          </el-table-column>
          <el-table-column prop="money" min-width="120" label="欠费金额" align="right">
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
  name: "SuburbUserArrearsFeeDetail",
  components: {

  },
  data() {
    return {
      // 查询条件日期
    //   Time: [],
      Time2: [],
      oprops:{
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      crumbsData: {
        //面包屑
        titleList: [{ title: "收费管理报表" }, { title: "郊区用户欠费明细" }]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        area: '',// 营业区域
        // startDate: '',// 收费日期
        // endDate: '',// 收费日期
        startAccountPeriod: '',// 收费月份
        endAccountPeriod: '',// 收费月份
      },
      // 列表数据
      tableData: {},
      // 合计数据
      totalData: {},
      // 营业区域下拉数据
      areaData: [],
      // 日期选择器
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now()
      //   }
      // },
      tableShow: false,
      maxHeight: 0,
      selectList: [],
      userNos: []
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow3')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    // this.tableQuery.accountPeriod = time.getFullYear() + month

    // this.init()
    this.getAreaData()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".SuburbUserArrearsFeeDetail .main-container", [
      ".SuburbUserArrearsFeeDetail .toolbar",
      ".SuburbUserArrearsFeeDetail .block"
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
      if (!this.tableQuery.area) {
        this.$message.error('行政区域不能为空！')
        return
      }else if(!this.tableQuery.startAccountPeriod || !this.tableQuery.endAccountPeriod ){
        this.$message.error('账期不能为空！')
        return
      }
      let _this = this
      let params = {
        "busicode": "AreaArrearageDetailReport",
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
    getTotal(param) {
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=['合计','']
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
        "busicode": "AreaArrearageDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 营业区域下拉框
    getAreaData() {
      let _this = this
      let params = {
        "busicode": "OldAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.areaData = data.children;
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
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 获取月份框数据
    getDatePicker2(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.startAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
      }
    },
    getSelectList(e) {
      this.selectList = e
      this.selectList.forEach(item =>{
        this.userNos.push(item.userNo)
      })
    },
    print(){
      let params = {
        busicode: "AreaArrearageDetailReportPrint",
        data: this.tableQuery
      };
      params.data.userNos = this.userNos
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for(let i = 0; i < data.length; i++) {
          this.common.print('view', 'AreaArrearageDetailReportPrint', '', data[i], this);
        } 
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
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
<style lang="scss" scoped>
.SuburbUserArrearsFeeDetail {
  width: calc(100% - 20px);
  height: 100%;
  .main-container {
    height: calc(100% - 42px);
  }
}
</style>

<style lang="scss">
.SuburbUserArrearsFeeDetail {
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
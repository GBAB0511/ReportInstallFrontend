<template>
  <div class="PlanAdjustment">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="营业区域：">
          <el-cascader ref="cascader1" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          <!--el-cascader
            v-model="tableQuery.businessArea"
            :options="businessAreaData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader>
          < <el-select v-model="tableQuery.businessArea" clearable size="mini" style="width:100%">
            <el-option v-for="item in businessAreaData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="抄表员：">
          <el-select ref="select1" v-model="tableQuery.meterReadingStaff" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.value" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="册本号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" clearable size="mini" @keydown.enter.native="search"></el-input>
        </el-form-item>
          <el-form-item label="下次抄码月：">
              <el-date-picker
            v-model="tableQuery.currendPeriodDate"
            type="month"
            format="yyyy-MM"
             placeholder="选择日期"
            class="month-picker"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
        <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed>
        </el-table-column>
        <!--el-table-column prop="businessAbode" min-width="100" label="营业所" fixed>
        </el-table-column-->
        <!--el-table-column prop="businessArea" min-width="100" label="营业区域" fixed>
        </el-table-column-->
        <el-table-column prop="bookNo" min-width="100" label="册本号" fixed>
        </el-table-column>
        <el-table-column prop="bookName" min-width="300" label="册本名称" fixed>
        </el-table-column>
        <el-table-column prop="lastPeriodDate" min-width="100" label="上次抄码月" fixed>
        </el-table-column>
        <el-table-column  prop="currendPeriodDate" min-width="120" label="下次抄码月" fixed>
         <template slot-scope="scope">
            <el-date-picker  v-model="scope.row.currendPeriodDate" type="month" class="month-picker"
             format="yyyy-MM" size="mini" value-format="yyyy-MM"
              placeholder="选择日期">
            </el-date-picker>
          </template>
          
        </el-table-column>
        <el-table-column prop="meterReadingCycle" min-width="120" label="抄表周期" fixed>
          <template slot-scope="scope">
            <el-select v-model="scope.row.meterReadingCycle"  @change="changeDate(scope.row,scope.$index)">
              <el-option v-for="item in dictionaryData.RTP" :key="item.id" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="meterReadingStaffName" min-width="120" label="抄表员" fixed>
          <template slot-scope="scope">
            <el-select  @change="getMeterReaderName(scope.row)" v-model="scope.row.meterReadingStaffName" size="mini">
              <el-option v-for="item in meterReaderListRow" :key="item.userAccount" :label="item.userName" :value="item.userName"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="meterReadingDay" min-width="150" label="抄表日">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.meterReadingDay" :min="1" :max="31"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
     
    </div>
     <!-- 分页 -->
      <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          >
          </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "PlanAdjustment",
  components: {},
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "表册管理" },
          { title: "抄表计划" }
        ]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        bookNo: '',
        businessArea: '',
        currendPeriodDate:'',
        meterReadingStaff: '全部',
      },
      // 列表数据
      tableData: {},
      // 营业所下拉数据
      businessAreaData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      // 数据字典下拉数据
      dictionaryData: {},
      meterReaderList: [],
      meterReaderListRow:[],
      isActive: false, //控制高级查询内容的显示
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.init();
    this.getBusinessAreaData()
    this.getDictionary()
    this.getMeterReader()

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".PlanAdjustment", [
      ".PlanAdjustment .toolbar",
      ".PlanAdjustment .block",
      ".PlanAdjustment .bread-contain"
    ]);
  },
  methods: {
         enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.cascader1.dropDownVisible = false
         }
    },
    // 列表初始化
    init() {
      let _this = this
      let val = this.tableQuery
      val.businessArea = this.common.handleTreeData(val.businessArea)
      if(val.meterReadingStaff=='全部'){
        val.meterReadingStaff = ''
      }
      let params = {
        "busicode": "MrPlanList",
        "data": val,
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.tableData = res
      })
    },
    //改变抄表周期时修正下次抄码月
    changeDate(row,index){
      let newDate = this.addMonth(row.lastPeriodDate,row.meterReadingCycle)
      let data = row
      data.currendPeriodDate=newDate
      this.$set(this.tableData,index,data);
    },
    //月份，在原有的日期基础上，增加 months 月份，默认增加1月
    addMonth(date,months){
      if(months==undefined||months=='')
          months=1;
      var date=new Date(date);
      console.log(date.getMonth(),months);
      
      date.setMonth(date.getMonth()+Number(months));
      var month=date.getMonth()+1;

      console.log(date.getFullYear());
      return date.getFullYear()+'-'+this.getFormatDate(month);
    },
    //月份<10  前面+0
    getFormatDate(arg) {
      if (arg == undefined || arg == '') {
      return '';
      }

      var re = arg + '';
      if (re.length < 2) {
      re = '0' + re;
      }
      return re;
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
    //营业区域下拉框数据
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
    getMeterReaderName(item){
      this.meterReaderListRow.forEach(e => {
        if(e.userName == item.meterReadingStaffName){
          item.meterReadingStaffAccount = e.userAccount
        }
      })
    },
    //抄表员下拉框数据
    getMeterReader() {
      let _this = this
      let params = {
        "busicode": "PostUserSelect",
        "data": {"postNo":"2"},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.meterReaderList = [...[{ userName: "全部"}],...res];
        this.meterReaderListRow = res
      })
    },
    // 数据字典数据
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "RTP"// 换表周期
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 保存按钮
    save() {
      let _this = this
      let params = {
        "busicode": "MrPlanSave",
        "data": this.tableData.list,
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$message({
          message: '保存成功！',
          type: 'success'
        });
        _this.init()
      })
    },
    search() {
      //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    // 导出按钮
    exportExcel() {
      var _this = this
      var params = {
        busicode: "MrPlanExport",
        data: JSON.parse(JSON.stringify(this.tableQuery)),
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      // 入参不需要分页
      delete params.data.page
      delete params.data.pageCount
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
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
<style lang="scss" >
.PlanAdjustment {
  width: 100%;
  height: 100%;
  .demo-form-inline{
    .el-input--mini .el-input__inner {
    width: 210px ;
}
  }
  .el-date-editor .el-input__inner {
     width: 120px !important; 
}
.el-date-editor--month{
  width:150px;
  }

}
</style>
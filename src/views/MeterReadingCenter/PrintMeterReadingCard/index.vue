<template>
  <div class="PrintMeterReadingCard">
    <!-- 打印抄表卡 模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="init('print')">打印</el-button>
      </div>
    </div>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="立户日期：">
          <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="营业区域：" class="width-150">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
            
        </el-form-item>

        <el-form-item label="册本号：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号" clearable  @keydown.enter.native="search" ></el-input>
        </el-form-item>

        <el-form-item label="抄表员：" class="width-150">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.meterReadingStaff" placeholder="请输入抄表员"></el-input> -->
          <el-select ref="select1" v-model="tableQuery.meterReadingStaffName" placeholder="请选择" clearable  @keydown.enter.native="search">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="抄表周期：" >
          <el-select ref="select1" v-model="tableQuery.meterReadingCycle" placeholder="请选择" clearable>
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option v-for="(item,index) in ReadCycleList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模糊查询：" class="searchInput">
          <el-tooltip class="item" effect="dark" content="册本号、用户编号、客户名称" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init('init')"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button class='searchBtn' @click="search()" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table ref="eltableCurrentRow" stripe border highlight-current-row :data="tableData.list" :max-height="maxHeight" class="change-tables-table" @selection-change="getSelectData" :cell-style="cellStyle" @row-click="handleTableCellClick">

        <el-table-column type="selection" width="0" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="60" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="bookNo" min-width="120" label="册本号">
        </el-table-column>

        <el-table-column prop="sortNo" min-width="100" label="排序号">
        </el-table-column>

        <el-table-column prop="userNo" min-width="140" label="用户编号">
        </el-table-column>

        <el-table-column prop="ctmName" min-width="250" label="客户名称" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="ctmAddr" min-width="400" label="客户地址" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="linkTel" min-width="130" label="联系电话" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="mobile" min-width="130" label="手机号码" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="useWaterType" min-width="200" label="用水类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="meterBore" min-width="100" label="水表口径">
        </el-table-column>

        <el-table-column prop="lastReadingNum" min-width="100" label="最后抄码" align="right">
        </el-table-column>

        <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员">
        </el-table-column>

        <el-table-column prop="openDate" min-width="100" label="立户日期">
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
  name: "PrintMeterReadingCard",
  props: ['WaterUseOverTheYearsData'],
  components: {
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "抄表" },
          { title: "打印抄表卡" }
        ]
      },
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath:false,
      },
      // 列表数据
      tableData: {},
      // 列表勾选数据
      selectData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea: '',// 营业区域
        bookNo: '',// 册本号
        meterReadingStaffName: '',// 抄表员
        meterReadingCycle:''
      },
      // 占位，无用
      tableTime: [],
      businessAreaData: [],
      // 抄表员下拉选择数据
      postUsers: [],
      ReadCycleList:[],


      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.init('init')
    this.getBusinessAreaData()
    this.getPostUser()
    this.getReadCycleList()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".PrintMeterReadingCard", [
        ".PrintMeterReadingCard .toolbar",
        ".PrintMeterReadingCard .block",
        ".PrintMeterReadingCard .bread-contain"
      ]);
    })
    
  },
  methods: {
    // 列表初始化\打印
    init(type) {
      let _this = this
      let params = {}
      params = {
        busicode: "MrRecordPrint",
        data: JSON.parse(JSON.stringify(_this.tableQuery))
      };
      // 打印时加以下入参
      if (type == 'print') {
        if (this.selectData.length <= 0) {
          this.$message({
            message: '请先勾选要打印的数据！',
            type: 'warning'
          })
          return
        }
        params.data.page = 1
        params.data.pageCount = 999999
        params.data.list = this.selectData
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        if (type == 'init') {// 初始化
          _this.tableData = res
        } else if (type == 'print') {// 打印
          // _this.printTable('print', res)
          _this.common.print('view', 'MrRecordPrint', '', res, _this);
        }
      })
    },
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
        console.log(data)
        _this.businessAreaData = data.children;
      })
    },
    getArr1(data) {
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
    getReadCycleList() {
      const params = {
        busicode: 'ReadCycleList',
        data: {
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.ReadCycleList = res
      })
    },
    search(){
      this.tableQuery.page = 1
      this.init('init')
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 获取当前列表勾选的数据
    getSelectData(itemList) {
      this.selectData = []
      // 存储勾选数据的用户编号
      itemList.forEach(item => {
        this.selectData.push(item.userNo)
      })
    },
    handleTableCellClick(row,cell,event){  
      row.flag = !row.flag;  
      this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);     
    },
    cellStyle(data){
      return "cursor:pointer;"
    },
    // 打印接口
    printTable(val, key) {
      let _this = this;
      let params = {
        "busicode": "PrintTemplateListPrint",
        "data": _this.tableQuery.companyNo
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.common.print(val, _this.tableQuery.companyNo, 'base_print_template', '', res, _this);
      })
    },






    handleClick(tab, event) {

      this.$set(this.crumbsData.titleList, "3", {
        title: tab.label,
        method: () => {
          window.histroy.back();
        }
      });
    },
    //   导出
    exportExcel() { },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init('init');
    },
    handleCurrentChange(val) {
      //显示多少页码
       this.tableQuery.page = val
      this.init('init');
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      // return (
      //   (this.tableData.pageSize - 20) * this.tableData.pages + (index + 1)
      // );
       return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },

    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        //   $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
    }
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
.PrintMeterReadingCard {
  width: 100%;
  height: 100%;
}
</style>
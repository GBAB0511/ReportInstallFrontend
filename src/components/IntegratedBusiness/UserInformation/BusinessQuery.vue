<template>

  <div class="BusinessQuery">
    <div class="tooltip">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="请输入用户编号" style="width: 300px;" @keydown.enter.native="init" @input="e => input = inputMe(e)"></el-input>
        <el-button size="mini" class="searchBtn" @click="init" icon="el-icon-search"></el-button>
      </div>
    <div class="kl-table common-diaTa">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border center :data="tableData" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="billNo" min-width="200" label="单据编号">
        </el-table-column>

        <el-table-column prop="billType" min-width="150" label="单据类型">
        </el-table-column>

        <el-table-column prop="billDate" min-width="150" label="单据时间">
        </el-table-column>

        <el-table-column prop="billState" min-width="150" label="单据状态">
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "BusinessQuery",
  // props: ['fuzzyQuery'],
  data() {
    return {
      // 列表数据
      tableData: [],
      // 父页面模糊查询输入框的值
      tableQuery: {
        fuzzyQuery: ''
      },
      formData: {
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [],
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []

      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {

      },
      BusinessQueryVisible: false,  //综合查询的显示和隐藏
      BusinessQueryName: '发票领用-领用',
      ruleFormData: {},

    }
  },
  mounted() {
    // this.tableQuery.fuzzyQuery = this.fuzzyQuery
    // this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.BusinessQuery .kl-table', ['.BusinessQuery .block', '.BusinessQuery #crumbs', '.BusinessQuery .tooltip'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 列表初始化
    init() {
      let params = {
        busicode: "BusinessQuery",
        data: {
            fuzzyQuery: this.tableQuery.fuzzyQuery
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res
      })
    },

    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      // this.tableQuery.page = val
      this.init()
    },

    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod(index) {
      //获取表格序号
      return (
        (1 - 1) * 20 + (index + 1)
      );
    },
    closeDialog() { //关闭会话
      this.BusinessQueryVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childBusinessQuery.submit()
      // this.BusinessQueryVisible = false;
    },
    add() {
      this.BusinessQueryVisible = true;
    },
    edit() {

    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.BusinessQuery {
  width: 100%;
  .tooltip {
    padding: 20px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .el-form--inline .el-form-item:first-of-type {
    margin-right: 0px;
  }
}
</style>

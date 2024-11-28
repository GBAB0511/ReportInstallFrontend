

<template>
  <div v-if="customerManagementVisible == '1'">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <customerManagementEdit></customerManagementEdit>
  </div>



  <div class="customerManagement" v-else>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <div class="bread-contain-right">
        <!-- <el-button @click="merge" icon="el-icon-document-copy" size="mini" type="primary">并户</el-button> -->
        <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button>
      </div>
    </div>
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

        <el-form-item class="form-left">

          <el-form-item label="客户类型：">
            <el-select clearable v-model="formData.watermeterWarehouse" placeholder="全部">
              <el-option v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="用户编号、账户编号、客户编号、客户名称、客户地址、联系人、座机号码" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.con" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>

            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left">
        </el-table-column>

        <el-table-column prop="connect" min-width="100" label="客户编号">
        </el-table-column>

        <el-table-column prop="areaName" min-width="180" label="客户名称">
        </el-table-column>

        <el-table-column prop="lvalue" min-width="180" label="客户地址">
        </el-table-column>

        <el-table-column prop="connect" min-width="100" label="客户类型">
        </el-table-column>

        <el-table-column prop="lvalue" min-width="100" label="联系人">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="80" label="座机号码">
        </el-table-column>

        <el-table-column class="cell" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <span  >|</span>
            <el-button type="text" class="noclick" @click="record(scope.$index, scope.row)">变动情况</el-button>

          </template>
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
import customerManagementEdit from './customerManagementEdit'
export default {
  name: "customerManagement",
  components: {
    customerManagementEdit,
    
  },
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户中心', path: '/customerManagement' },
          { title: '客户资料', method: () => { window.histroy.back() } }
        ],

      },
      formData: {
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [
          {
            name: "全部",
            value: "1"
          },
          {
            name: "停用",
            value: "1"
          },
          {
            name: "启用",
            value: "1"
          },
        ],
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
      ruleFormData: {},

    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.water-meter-inquiry .kl-table', ['.water-meter-inquiry .toolbar', '.water-meter-inquiry .block', '.water-meter-inquiry #crumbs'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {

      this.histroyData = { }
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
    indexMethod(index) {//获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1);

    },
    closeMergeCustDialog(){
      this.crumbsData.titleList.pop();
      
      this.customerManagementVisible = '0';
    },
    closeDialog() { //关闭会话
      this.crumbsData.titleList.pop();
      this.customerManagementVisible = '0';
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childcustomerManagement.submit()
    },
    edit() {
      this.customerManagementVisible = '1';
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
.customerManagement {
  width: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .kl-table {
    .el-table .el-table__body {
      tr {
        td:nth-child(3) {
          div {
            text-align: left;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            // color: #056dae;
            // cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

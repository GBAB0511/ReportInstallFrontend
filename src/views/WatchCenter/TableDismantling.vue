<template>
  <!-- TableDismantling -->
  <div class="TableDismantling">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="backfillVisible">
        <el-button icon="el-icon-bottom" @click="exportExcel" size="mini" type="primary">下载模板</el-button>
        <el-button icon="el-icon-download" @click="eee" size="mini" type="primary">导入</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="DetailedEnquiriesVisible">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>

        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="waterAddVisible">
        <el-button size="mini" type="primary" @click="save">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="ChangeTablesShow">
        <el-button size="mini" type="primary" @click="DetailedEnquiries1">历史查询</el-button>
      </div>
    </div>
    <!-- 回填 -->
    <div v-if="backfillVisible" class="backfillCon">
      <TableDismantlingBackEdit ref="TableDismantlingBackEdit" :TableDismantlingBackEditNeedData="TableDismantlingBackEditNeedData"></TableDismantlingBackEdit>
    </div>
    <div v-if="DetailedEnquiriesVisible" class="DetailedEnquiriesCon">
      <DetailedEnquiries1 ref="DetailedEnquiries1"></DetailedEnquiries1>
    </div>
    <!-- 弹出表单拆表详情 -->
    <el-dialog :title="DetailsOfTableChangeName" :visible.sync="DetailsOfTableChangeVisible" :close-on-click-modal="false" class="DetailsOfTableChange" @close="closeDialog">
      <DetailsOfTableChange ref="DetailsOfTableChange"></DetailsOfTableChange>
    </el-dialog>

    <!-- 添加 -->
    <ChangeTablesEditor1 v-if="waterAddVisible" ref="ChangeTablesEditor1" :ChangeTablesEditor1NeedData='ChangeTablesEditor1NeedData'></ChangeTablesEditor1>

    <div v-if="ChangeTablesShow">

      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='单据日期：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="拆表类型：">
              <el-select ref="select2" clearable v-model="tableQuery.replaceType" placeholder="拆表类型">
                <el-option v-for="item in dictionaryData.MRM" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="单据编号：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.billNo" placeholder="请输入单据编号"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="TableDismantling-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="当前处理人">
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>

          <el-table-column prop="replaceTypeName" min-width="100" label="拆表类型">
          </el-table-column>

          <el-table-column prop="planFinishDate" min-width="100" label="计划完工日期">
          </el-table-column>

          <el-table-column prop="meterAmount" min-width="80" label="水表数量">
          </el-table-column>

          <el-table-column prop="backfillAmount" min-width="80" label="已回填数量">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="backfill(scope.row)">回填</el-button>
              <span>|</span>
              <el-button type="text" class="noclick" @click="details(scope.row)">详情</el-button>
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
  </div>
</template>
<script>
import ChangeTablesEditor1 from "./ChangeTablesEditor1";
import TableDismantlingBackEdit from "./TableDismantlingBackEdit";
import DetailedEnquiries1 from "./DetailedEnquiries1";
import DetailsOfTableChange from "./DetailsOfTableChange";
export default {
  name: "TableDismantling",
  components: {
    ChangeTablesEditor1,
    TableDismantlingBackEdit,
    DetailedEnquiries1,
    DetailsOfTableChange
  },
  data() {
    return {
      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        receiptType: 2,

        beginDate: '',
        endDate: ''
      },
      // 查询条件日期
      tableTime: [],
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 回填页所需数据
      TableDismantlingBackEditNeedData: {
        id: "",
      },
      // 详情页面所需数据
      ChangeTablesEditor1NeedData: {},





      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "拆表" }]
      },
      formData: {
        con: "",
        watermeterWarehouse: "",
        waterMeterManufacturer: "1",
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []
      },
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          // 只能选择当前时间之前的日期
          // return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      waterAddVisible: false, //添加弹窗的显示和隐藏
      WaterEditorName: "拆表-添加",
      ruleFormData: {},
      backfillName: "拆表-回填",
      backfillVisible: false,
      DetailedEnquiriesName: "拆表-历史查询",
      DetailedEnquiriesVisible: false,
      DetailsOfTableChangeName: "拆表-详情",
      DetailsOfTableChangeVisible: false,
      ChangeTablesShow: true
    };
  },
  mounted() {
    this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".TableDismantling", [
      ".TableDismantling .toolbar",
      ".TableDismantling .block",
      ".TableDismantling #crumbs"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MsChgList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MRM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker(date){
      console.log(date);
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      }else{
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 下载模板/导出（调子页面下载模板/导出方法）
    exportExcel() {
      var _this = this
      if (this.backfillVisible) {
        this.$refs.TableDismantlingBackEdit.exportExcel()
      }else if (this.DetailedEnquiriesVisible) {
        this.$refs.DetailedEnquiries1.exportExcel()
      }
      
    },
    // 详情按钮
    details(row) {
      this.waterAddVisible = true
      this.ChangeTablesShow = false

      this.ChangeTablesEditor1NeedData.content = 'details'
      this.ChangeTablesEditor1NeedData.id = row.id
      if (row.processState === "已办结") {
        this.ChangeTablesEditor1NeedData.tableEdit = false;
      } else {
        this.ChangeTablesEditor1NeedData.tableEdit = true;
      }
    },
    // 暂存（调详情页面保存方法）
    save() {
      var _this = this
      this.$refs.ChangeTablesEditor1.save()
    },





    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        (this.tableData.pageSize - 20) * this.tableData.pages + (index + 1)
      );
    },
    closeDialog() {
      // 针对回填页面的返回
      if (this.backfillVisible) {
        this.$refs.TableDismantlingBackEdit.closeDialog()
        return
      } else {
        this.waterAddVisible = false
        this.DetailedEnquiriesVisible = false
        this.DetailsOfTableChangeVisible = false
        this.ChangeTablesShow = true
        this.init()
      }
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit()
      // this.waterAddVisible = false;
    },
    // 回填
    backfill(row) {
      this.TableDismantlingBackEditNeedData.id = row.id
      this.backfillVisible = true
      this.ChangeTablesShow = false
      //  this.$set(this.crumbsData.titleList,"2",{title:'回填' })
    },
    backfillSubmit() { },
    // 明细查询
    DetailedEnquiries1() {
      this.DetailedEnquiriesVisible = true
      this.ChangeTablesShow = false
      //  this.$set(this.crumbsData.titleList,"2",{title:'历史查询' })
    },
    edit() {
      this.DetailsOfTableChangeVisible = true
      this.ChangeTablesShow = false
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
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.TableDismantling {
  width: 100%;
  height: 100%;
  .backfillCon,
  .DetailedEnquiriesCon,
  .waterAddCon {
    width: 100%;
    height: 100%;
  }
  .el-dialog__body {
    padding: 20px;
    height: calc(100% - 196px);
  }
  .backfill .el-dialog__body,
  .DetailedEnquiries1 .el-dialog__body {
    height: calc(100% - 136px);
    padding: 0px;
  }
  .DetailsOfTableChange .el-dialog__body {
    height: calc(100% - 136px);
    padding: 0px 20px;
  }
}
</style>

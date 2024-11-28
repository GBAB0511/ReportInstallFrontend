<template>
  <!-- TableDismantling -->
  <div class="change-tables">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="backfillVisible">
        <el-button icon="el-icon-bottom" @click="exportExcel" size="mini" type="primary">下载模板</el-button>
        <el-button icon="el-icon-download" @click="uploading" size="mini" type="primary">导入</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="DetailedEnquiriesVisible">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>

        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="waterAddVisible">
        <el-button size="mini" type="primary" @click="save" v-if="ChangeTablesEditNeedData.tableEdit">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="ChangeTablesShow">
        <el-button size="mini" type="primary" @click="DetailedEnquiries">历史查询</el-button>
        <el-button @click="add" size="mini" icon="el-icon-plus" type="primary">添加</el-button>
      </div>
    </div>

    <!-- 回填 -->
    <div v-if="backfillVisible" class="backfillCon">
      <backfillSubmitEdit ref="backfillSubmitEdit" :backfillSubmitEditNeedData="backfillSubmitEditNeedData"></backfillSubmitEdit>
    </div>
    
    <div v-if="DetailedEnquiriesVisible" class="DetailedEnquiriesCon">
      <DetailedEnquiries ref="DetailedEnquiries"></DetailedEnquiries>
    </div>

    <!-- 计划 -->
    <ChangeTablesEdit ref="ChangeTablesEdit" v-if="waterAddVisible" :ChangeTablesEditNeedData="ChangeTablesEditNeedData"></ChangeTablesEdit>

    <div style="height:calc(100% - 41px)" v-if="ChangeTablesShow">

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline multiple-floor">
            <el-form-item label='单据日期：'>
              <el-date-picker v-model="tableQuery.Time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select clearable v-model="tableQuery.processState" placeholder="状态">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="换表类型：">
              <el-select clearable v-model="tableQuery.replaceType" placeholder="换表类型">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in dictionaryData.MCM" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="单据编号：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.billNo" placeholder="请输入单据编号"></el-input>
            </el-form-item>

            <el-form-item class="button-group">
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          <!-- 高级查询内容 -->
          <div v-show="isActive" class="advancedQuery">

            <el-form-item label="水表口径：">
              <el-select clearable v-model="tableQuery.meterBore" placeholder="水表口径">
                <el-option v-for="item in dictionaryData.MMC" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="当前处理人">
          </el-table-column>

          <el-table-column prop="billNo" min-width="90" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>

          <el-table-column prop="replaceTypeName" min-width="100" label="换表类型">
          </el-table-column>

          <el-table-column prop="planFinishDate" min-width="100" label="计划完工日期">
          </el-table-column>

          <el-table-column prop="replaceStaffName" min-width="80" label="换表员">
          </el-table-column>

          <el-table-column prop="meterAmount" min-width="80" label="换表量">
          </el-table-column>

          <el-table-column prop="backfillAmount" min-width="80" label="已换量">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.processState == 'backfill'" @click="backfill(scope.row)">回填</el-button>
              <span v-if="scope.row.processState == 'backfill'">|</span>
              <el-button type="text" class="noclick" @click="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import ChangeTablesEdit from "./ChangeTablesEdit";
import backfillSubmitEdit from "./backfillSubmitEdit";//回填
import DetailedEnquiries from "./DetailedEnquiries";
export default {
  name: "change-tables",
  components: {
    ChangeTablesEdit,
    backfillSubmitEdit,// 回填
    DetailedEnquiries,// 历史查询
  },
  data() {
    return {
      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        receiptType: 1,
      },
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 子页面所需数据
      ChangeTablesEditNeedData: {},
      // 暂存按钮判断字段
      saveType: 'add',
      // 高级查询
      isActive: false,


      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "换表" }]
      },
      formData: {
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [
          {
            name: "临时换表",
            value: "1"
          },
          {
            name: "正常换表",
            value: "2"
          },
          {
            name: "异常换表",
            value: "3"
          }
        ],
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
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      waterAddVisible: false, //添加弹窗的显示和隐藏
      ruleFormData: {},
      backfillName: "换表-回填",
      backfillVisible: false,
      DetailedEnquiriesName: "换表-历史查询",
      DetailedEnquiriesVisible: false,
      ChangeTablesShow: true,

      backfillSubmitEditNeedData: {
        id: "",
      }
    };
  },
  mounted() {
    this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".change-tables", [
      ".change-tables .toolbar",
      ".change-tables .block",
      ".change-tables #crumbs",
      ".change-tables .toggle-btn"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
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
    // 查询
    search() {
      if (this.tableQuery.Time !== undefined) {
        this.tableQuery.beginTime = this.tableQuery.Time[0]
        this.tableQuery.endTime = this.tableQuery.Time[1]
        delete this.tableQuery.Time
      }
      this.tableQuery.page = 1;
      this.init();
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MCM,MMC"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    //   详情按钮
    details(row) {
      this.waterAddVisible = true
      this.ChangeTablesShow = false

      this.ChangeTablesEditNeedData.content = 'details'
      this.ChangeTablesEditNeedData.subBusicode = 'MsChgUpdate'
      this.ChangeTablesEditNeedData.approveFlag = 1
      this.ChangeTablesEditNeedData.id = row.id
      // saveType 用于暂存按钮判断子页面数据属于添加数据还是修改数据
      this.saveType = 'update'
      if (row.processState == '' || row.processState  == 'register') {
        this.ChangeTablesEditNeedData.tableEdit = true;
      } else {
        this.ChangeTablesEditNeedData.tableEdit = false;
      }
    },
    // 添加
    add() {
      this.ChangeTablesEditNeedData.tableEdit = true
      this.ChangeTablesEditNeedData.content = 'add'
      this.ChangeTablesEditNeedData.subBusicode = 'MsChgAdd'
      this.ChangeTablesEditNeedData.approveFlag = 0
      this.waterAddVisible = true;
      this.ChangeTablesShow = false;
    },
    // 暂存（调子页面保存方法）
    save() {
      var _this = this
      this.$refs.ChangeTablesEdit.save(_this.saveType)
    },
    // 下载模板/导出（调子页面下载模板/导出方法）
    exportExcel() {
      var _this = this
      if (this.backfillVisible) {
        this.$refs.backfillSubmitEdit.exportExcel()
      }else if (this.DetailedEnquiriesVisible) {
        this.$refs.DetailedEnquiries.exportExcel()
      }
    },
    // 高级查询
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".water-meter-inquiry", [
          ".water-meter-inquiry .toolbar",
          ".water-meter-inquiry .block",
          ".water-meter-inquiry #crumbs",
          ".change-tables .toggle-btn"
        ]);
      });
    },

    // 导入
    uploading() { },



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
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    // 子页面的返回按钮
    closeDialog() {
      // 针对回填页面的返回
      if (this.backfillVisible) {
        this.$refs.backfillSubmitEdit.closeDialog()
        return
      } else {
        this.waterAddVisible = false
        this.DetailedEnquiriesVisible = false
        this.ChangeTablesShow = true
        this.init()
        // saveType 用于暂存按钮判断子页面数据属于添加数据还是修改数据(默认为add)
        this.saveType = 'add'
      }


    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterAddVisible = false;
    },
    // 回填
    backfill(row) {
      this.backfillSubmitEditNeedData.id = row.id;
      this.backfillVisible = true;
      this.ChangeTablesShow = false;
      //  this.$set(this.crumbsData.titleList,"2",{title:'回填',method:()=>{window.histroy.back()}})
    },
    backfillSubmit() { },
    // 明细查询
    DetailedEnquiries() {
      this.DetailedEnquiriesVisible = true;
      this.ChangeTablesShow = false;
      //  this.$set(this.crumbsData.titleList,"2",{title:'历史查询',method:()=>{window.histroy.back()}})
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
<style lang="scss" scoped>
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.change-tables {
  width: 100%;
  height: 100%;
  .kl-table{
    margin-top: 15px;
  }
}
</style>

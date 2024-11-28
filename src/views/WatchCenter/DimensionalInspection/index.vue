<template>
  <div class="DimensionalInspection">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="waterAddVisible">
        <el-button v-if="editNeedData.processState==''" size="mini" type="primary" @click="save('0')">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="InspectionExamineVisible">
        <el-button v-if="editNeedData.processState==''" size="mini" type="primary" @click="save('1')">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-show="DimlInspShow">
        <el-button icon="el-icon-plus" @click="add" size="mini" type="primary">添加</el-button>
      </div>
    </div>
    <!-- 添加/修改 -->
    <div  style="height:calc(100% - 41px)" v-if="waterAddVisible">
      <DimlInspEdit  ref="DimlInspEdit" :editNeedData="editNeedData"></DimlInspEdit>
    </div>
    <!-- 详情 -->
    <div  style="height:calc(100% - 41px)" v-if="InspectionExamineVisible">
      <DimlInspHandle ref="DimlInspHandle" :editNeedData='editNeedData' ></DimlInspHandle>
    </div>

    <section v-if="DimlInspShow" class="DimlInspCon">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label='单据日期：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select clearable v-model="tableQuery.processState" placeholder="状态">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表类型：">
              <el-select clearable v-model="tableQuery.meterType" placeholder="水表类型">
                <el-option v-for="item in dictionaryData.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="searchInput">
              <el-tooltip class="item" effect="dark" content="水表编号、合格证号、用户编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="DimlInsp-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="150" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="90" label="单据编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期" show-overflow-tooltip></el-table-column>

          <el-table-column prop="userNo" min-width="110" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="meterNo" min-width="100" label="水表编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="meterType" min-width="100" label="水表类型"></el-table-column>

          <el-table-column prop="repairTypeName" min-width="100" label="维检类型"></el-table-column>

          <el-table-column prop="repairDate" min-width="80" label="维修日期" show-overflow-tooltip></el-table-column>

          <el-table-column prop="repairResult" min-width="80" label="维修结果"></el-table-column>

          <el-table-column prop="certNo" min-width="80" label="合格证号"></el-table-column>

          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)">详情</el-button>
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
    </section>
  </div>
</template>
<script>
import DimlInspEdit from "./DimensionalInspectionEdit";
import DimlInspHandle from "./DimensionalInspectionHandle";
// .vue
export default {
  name: "DimensionalInspection",
  components: {
    DimlInspEdit,
    DimlInspHandle
  },
  data() {
    return {
      // 单据日期数组
      tableTime: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        processState: "",
        meterType: "",
        fuzzyQuery: ""
      },
      // 列表数据
      tableData: {},
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      //面包屑
      crumbsData: { titleList: [{ title: "表计管理" }, { title: "维检" }] },
      tableShow: false,
      maxHeight: 0,
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      waterAddVisible: false, //添加弹窗的显示和隐藏
      DimlInspShow: true,
      InspectionExamineVisible: false,
      editNeedData: {}
    };
  },
  mounted() {
    this.init();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".DimensionalInspection", [
      ".DimensionalInspection .toolbar",
      ".DimensionalInspection .block",
      ".DimensionalInspection #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      this.getDatePicker(this.tableTime);
      var params = {
        busicode: "MsRepairList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "MMT" // 换表类型
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
          _this.dictionaryData.MMT.unshift({
            name: '全部',
            value: '',
            id: 0
          })
        });
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0];
        this.tableQuery.endDate = date[1];
      } else {
        this.tableQuery.beginDate = "";
        this.tableQuery.endDate = "";
      }
    },
    // 查询按钮
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 详情
    details(row) {
      this.editNeedData = row;
      this.editNeedData.busicode = "MsRepairUpdate";
      this.editNeedData.saveType = "edit";
      this.InspectionExamineVisible = true;
      this.DimlInspShow = false;
    },
    // 添加
    add() {
      this.editNeedData.processState = "";
      this.editNeedData.id = "";
      this.editNeedData.busicode = "MsRepairAdd";
      this.editNeedData.saveType = "add";

      this.waterAddVisible = true;
      this.DimlInspShow = false;
    },
    //分页
    // 显示多少数据一页
    handleSizeChange(val) {
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    //显示多少页码
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.init();
    },
    //获取表格序号
    indexMethod(index) {
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() {
      //关闭会话
      this.waterAddVisible = false;
      this.InspectionExamineVisible = false;
      this.DimlInspShow = true;
      this.init();
    },
    // 暂存（调子页面保存方法）
    save(type) {
      let _this = this
      if (type==='1') {
        _this.$refs.DimlInspHandle.save();
      } else {
        _this.$refs.DimlInspEdit.save();
      }
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
.DimensionalInspection {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="DuplicateTable">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 审批 -->
      <div class="bread-contain-right" v-if="backfillVisible">
        <el-button size="mini" type="primary" @click="save">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <!-- 审批 -->
    <DuplicateTableEdit ref="DuplicateTableEdit" :DuplicateTableEditNeedData="DuplicateTableEditNeedData" v-if="backfillVisible"></DuplicateTableEdit>

    <section v-if="DuplicateTableVisible">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='单据日期：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select clearable v-model="tableQuery.processState" placeholder="状态">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="width-200">
              <el-tooltip class="item" effect="dark" content="用户编号、水表编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="DuplicateTable-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="当前处理人">
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号">
          </el-table-column>

          <el-table-column prop="userAddr" min-width="80" label="用户地址">
          </el-table-column>

          <el-table-column prop="meterNo" min-width="80" label="水表编号">
          </el-table-column>

          <el-table-column prop="reuseStaffName" min-width="80" label="复表员">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <!-- size="mini" type="warning" plain -->
              <el-button type="text" @click="details(scope.row)">详情</el-button>
              <!-- <span  >|</span>
                        <el-button type="text" class="noclick">审批</el-button> -->
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </section>
  </div>
</template>
<script>
import DuplicateTableEdit from "./DuplicateTableEdit";
export default {
  name: "DuplicateTable",
  components: {
    DuplicateTableEdit
  },
  data() {
    return {
      tableData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,

        beginDate: '',
        endDate: ''
      },
      // 状态下拉框数据
      processStateData: this.common.processState(),
      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "复装" }]
      },
      tableTime: [],
      DuplicateTableEditNeedData: {},
      
      
      tableShow: false,
      maxHeight: 0,
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      backfillName: "复装-审批",
      backfillVisible: false,
      DuplicateTableVisible: true
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".DuplicateTable", [
      ".DuplicateTable .toolbar",
      ".DuplicateTable .block",
      ".DuplicateTable #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MsReuseList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
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
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 暂存（调详情页面保存方法）
    save() {
      var _this = this
      this.$refs.DuplicateTableEdit.save()
    },












    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
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
      //关闭会话
      this.backfillVisible = false;
      this.DuplicateTableVisible = true;
      // this.crumbsData.titleList.splice(2,1);
      this.init();
    },
    // 审批
    details(row) {
      console.log(row);
      this.backfillVisible = true;
      this.DuplicateTableVisible = false;
      
      this.DuplicateTableEditNeedData.content = 'details'
      this.DuplicateTableEditNeedData.id = row.id
      if (row.processState === "已办结") {
        this.DuplicateTableEditNeedData.tableEdit = false
      } else {
        this.DuplicateTableEditNeedData.tableEdit = true
      }
    },
    backfillSubmit() {}
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
.DuplicateTable {
  height: 100%;
}
</style>

<template>
  <!-- 抄表修改 -->
  <div class="PrivilegeModification">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <font v-if="indexShow==true">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
        </font>

        <font v-else>
          <el-button size="mini" type="primary" v-if="buttomShow" @click="submit(formType.type)">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
      </div>
    </div>

    <PrivilegeModificationEdit v-if="indexShow==false" ref="childWarehousing" :formType="formType" :billStute="billStute"></PrivilegeModificationEdit>

    <div v-else class="indexPage">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker
              v-model="tableTime"
              @change="getDatePicker"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
              <el-option
                v-for="item in processStateData"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="单据编号、用户编号、用户名称、受理人" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          highlight-current-row
          stripe
          border
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left"></el-table-column>

          <el-table-column prop="theme" min-width="100" label="主题" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column
            prop="processHandleMan"
            min-width="100"
            label="当前处理人"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期"></el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期"></el-table-column>

          <el-table-column prop="changeItems" min-width="150" label="变更事项" show-overflow-tooltip></el-table-column>

          <el-table-column prop="comments" min-width="150" label="备注" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click.native="edit(scope.$index, scope.row)">详情</el-button>
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
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import PrivilegeModificationEdit from "./SingleUserEdit";
export default {
  name: "PrivilegeModification",
  components: {
    PrivilegeModificationEdit
  },
  data() {
    return {
      formType: {
        type: "add",
        id: "",
        accountPeriod: "",
        userNo: ""
      },
      indexShow: true,
      buttomShow: false,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "抄表" },
          { title: "抄表修改" }
        ]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        fuzzyQuery: "",
        processState: ""
      },
      // 列表数据
      tableData: {},
      // 占位，无用
      tableTime: [this.common.date(), this.common.date()],
      // 状态下拉框数据
      processStateData: this.common.processState(),
      tableShow: false,
      maxHeight: 0,
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".PrivilegeModification .indexPage", [
        ".PrivilegeModification .toolbar",
        ".PrivilegeModification .block"
      ]);
    this.getDatePicker(this.tableTime);
    this.init();
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
      let _this = this;
      let params = {
        busicode: "MrModifyList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        })
        .catch((this.tableData = {}));
      
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
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel() {},
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    //   添加
    add() {
      this.formType.type = "add";
      this.formType.id = "";
      this.billStute = "";
      this.indexShow = false;
      this.buttomShow = true;
    },

    closeDialog() {
      //关闭会话
      this.TransferDetailsVisible = false;
      this.indexShow = true;
      this.buttomShow = false;
      this.init();
    },
    //弹出框
    submit(type) {
        //提交
      this.$refs.childWarehousing.submit(type);
    },
    // 编辑
    edit(index, row) {
      this.formType.type = "update";
      this.formType.accountPeriod = row.accountPeriod;
      this.formType.userNo = row.userNo;
      this.formType.id = row.id;
      this.billStute = row.billStute
      this.indexShow = false;
      if (row.processState == '结束') {
        this.buttomShow = false;
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
.PrivilegeModification {
  width: 100%;
  height: 100%;
  .indexPage {
    height: calc(100% - 41px);
  }
}
</style>

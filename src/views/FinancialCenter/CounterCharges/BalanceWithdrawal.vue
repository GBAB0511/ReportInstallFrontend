


<template>
  <div class="BalanceWithdrawal">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="BalanceWithdrawalVisible">
        <el-button size="mini" type="primary" v-if="buttomShow" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="BalanceWithdrawalShow">
        <el-button icon="el-icon-plus" size="mini" @click="add" type="primary">添加</el-button>
      </div>
    </div>
    <div v-if="BalanceWithdrawalVisible" class="indexContent">
      <BalanceWithdrawalEdit ref="BalanceWithdrawalEdit" :editNeedData="editNeedData"></BalanceWithdrawalEdit>
    </div>
    <div v-if="BalanceWithdrawalShow" class="indexContent">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" clearable value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="办结时间：">
            <el-date-picker v-model="finishTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" clearable start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="未审">
              <el-option v-for="(item,index) in processStateData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="客户编号/账户编号" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processName" min-width="60" label="进度" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmNo" min-width="100" label="客户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="accountNo" min-width="100" label="账户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="outMoney" min-width="80" label="取出金额" show-overflow-tooltip align="right"></el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="updateTime" min-width="120" label="最后修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.row)">详情</el-button>
              <el-button type="text" v-if="scope.row.processState == '草稿'" @click.native="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import BalanceWithdrawalEdit from "./BalanceWithdrawalEdit";
export default {
  name: "BalanceWithdrawal",
  components: {
    BalanceWithdrawalEdit
  },
  data () {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "余额管理" },
          { title: "余额取出" }
        ]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        processState: "",
        fuzzyQuery: "",
        finishStartTime: "",
        finishEndTime: "",
      },
      // 列表数据
      tableData: {},
      // 查询条件日期
      tableTime: [],
      processStateData: this.common.processState(), //审批状态下拉框
      // 详情页所需数据
      editNeedData: {},
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      BalanceWithdrawalVisible: false,
      ruleFormData: {},
      BalanceWithdrawalShow: true,
      buttomShow: true,
      finishTime: ["", ""],
      pickerOptions: {},
    };
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".BalanceWithdrawal", [
      ".BalanceWithdrawal .toolbar",
      ".BalanceWithdrawal .block",
      ".BalanceWithdrawal #crumbs"
    ]);
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    // 列表初始化
    init () {
      let _this = this;
      this.dateFormat()
      let params = {
        busicode: "FnBalanceOutList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    dateFormat(){
      this.tableQuery.finishStartTime = this.tableQuery.finishStartTime || "";
      this.tableQuery.finishEndTime = this.tableQuery.finishEndTime || "";
      this.finishTime = this.finishTime || ["", ""]
      this.tableQuery.finishStartTime = this.finishTime[0] == "" ? "" : this.finishTime[0] + " 00:00:00";
      this.tableQuery.finishEndTime = this.finishTime[1] == "" ? "" : this.finishTime[1] + " 23:59:59";
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0];
        this.tableQuery.endDate = date[1];
      } else {
        this.tableQuery.beginDate = "";
        this.tableQuery.endDate = "";
      }
    },

    // 查询按钮
    search () {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },

    // 添加按钮
    add () {
      this.BalanceWithdrawalVisible = true;
      this.BalanceWithdrawalShow = false;
      this.buttomShow = true;
      this.editNeedData.saveType = "add";
      this.editNeedData.busicode = "FnBalanceOutAdd";
    },
    // 详情按钮
    details (row) {
      this.BalanceWithdrawalVisible = true;
      this.BalanceWithdrawalShow = false;
      this.editNeedData = row;
      this.editNeedData.saveType = 'edit';
      this.editNeedData.busicode = "FnBalanceOutUpdate";
      // 不确定下面判断有没有用，暂不删除-mo
      if (row.processState == "approval" || row.processState == "END") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }

      if (row.processState == '已办结') {
        this.buttomShow = false;
      }
    },
    // 保存按钮（调用子页面保存方法）
    save () {
      this.$refs.BalanceWithdrawalEdit.save();
    },

    // 删除按钮
    remove (row) {
      let _this = this;
      this.$confirm("是否确认删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "FnBalanceOutDelete",
            data: {
              id: row.id
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.$message({
                type: "success",
                message: "删除成功!"
              });
              _this.init();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return index + 1;
    },
    closeDialog () {
      //关闭会话
      this.BalanceWithdrawalVisible = false;
      this.BalanceWithdrawalShow = true;
      this.init();
    },
    //弹出框
    submit () {
      //提交
      this.$refs.childBalanceWithdrawal.submit();
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
.BalanceWithdrawal {
  width: 100%;
  height: 100%;
}
</style>

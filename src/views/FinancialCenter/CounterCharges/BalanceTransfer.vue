

<template>
  <div class="BalanceTransfer">
    <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="BalanceTransferVisible">
        <el-button size="mini" type="primary" v-if="buttomShow" @click="save">保存</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog">返 回</el-button>
        </div>
        <div class="bread-contain-right"  v-else>
          <el-button icon="el-icon-plus" size="mini" @click="add" type="primary">添加</el-button>
        </div>
    </div>
    <div class="indexContent" v-if="BalanceTransferVisible">
      <BalanceTransferEdit
        ref="BalanceTransferEdit"
        :editNeedData="editNeedData"
      ></BalanceTransferEdit>
    </div>

    <div v-else class="indexContent">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker
              v-model="tableTime"
              @change="getDatePicker"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              :picker-options="pickerOptions"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="未审">
              <el-option
                v-for="(item,index) in processStateData"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-250">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="单据编号/ 转出账户/ 转入账户" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>

          <el-table-column prop="processState" min-width="70" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="60" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人"></el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期"></el-table-column>

          <el-table-column prop="outMoney" min-width="80" label="过户金额" align="right"></el-table-column>

          <el-table-column prop="outAccountNo" min-width="130" label="转出账户"></el-table-column>

          <el-table-column prop="outCtmName" min-width="300" label="转出客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="inAccountNo" min-width="130" label="转入账户"></el-table-column>

          <el-table-column prop="inCtmName" min-width="150" label="转入客户名称"></el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人"></el-table-column>


          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.row)">详情</el-button>
              <el-button
                type="text"
                v-if="scope.row.processState == '草稿'"
                @click.native="remove(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import BalanceTransferEdit from "./BalanceTransferEdit";
export default {
  name: "BalanceTransfer",
  components: {
    BalanceTransferEdit
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "余额管理" },
          { title: "余额过户" }
        ]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        processState: "",
        fuzzyQuery: ""
      },
      // 列表数据
      tableData: {},
      // 查询条件日期
      tableTime: [],
      processStateData: this.common.processState(), //审批状态下拉框
      // 详情页所需数据
      editNeedData: {},

      //审批状态下拉框
      approvalStatusOptions: [
        { value: "1", name: "全部" },
        { value: "2", name: "草稿" },
        { value: "3", name: "进行中" },
        { value: "4", name: "已办结" },
        { value: "5", name: "已废弃" }
      ],

      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      BalanceTransferVisible: false,
      buttomShow: true,
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".BalanceTransfer", [
      ".BalanceTransfer .toolbar",
      ".BalanceTransfer .block",
      ".BalanceTransfer #crumbs"
    ]);
  },
  methods: {
   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "FnBalanceAssignedList",
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
    // 获取日期框数据
    getDatePicker(date) {
      console.log(date);
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
      this.tableQuery.pageCount = 20;
      this.init();
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

    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return index + 1;
    },
    closeDialog() {
      //关闭会话
      this.BalanceTransferVisible = false;
      this.backfillVisible = false;
      this.init();
      // this.crumbsData.titleList.splice(3, 1)
    },
    //弹出框
    save() {
      //提交
      this.$refs.BalanceTransferEdit.save();
    },
    add() {
      this.BalanceTransferVisible = true;
      this.buttomShow = true;
      this.editNeedData.saveType = "add";
      this.editNeedData.busicode = "FnBalanceAssignedAdd";
    },
    // 详情按钮
    details(row) {
      this.BalanceTransferVisible = true;
      this.editNeedData = row;
      this.editNeedData.saveType = "edit";
      this.editNeedData.busicode = "FnBalanceAssignedUpdate";
      if (row.processState == "approval" || row.processState == "END") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
    },
    // 删除按钮
    remove(row) {
      let _this = this;
      this.$confirm("是否确认删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "FnBalanceAssignedDelete",
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
.BalanceTransfer {
  width: 100%;
  height: 100%;
}
</style>

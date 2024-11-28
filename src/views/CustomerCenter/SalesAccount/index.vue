
<template>
  <div class="SalesAccount">
    <!-- 弹出表单明细 -->
    <el-dialog class="common-dialog" title="欠费明细" :close-on-click-modal="false" :visible.sync="DetailsArrearsShow" @close="closeDialog(0)">
      <DetailsArrears ref="detailsArrears" :formData="formData"></DetailsArrears>
    </el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="SalesAccountEditVisible">
        <el-button type="primary" size="mini" @click="detailsArrears()">欠费明细</el-button>
        <el-button type="primary" size="mini" @click="submit(status)" v-if="buttomShow">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog(1)">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button @click="acceptFormPrint" size="mini" type="primary">销户受理单打印</el-button>
        <el-button icon="el-icon-plus" size="mini" @click="salesAdd" type="primary">添加</el-button>
        <!-- <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button> -->
      </div>

    </div>
    <div class='indexContent' v-if="SalesAccountEditVisible">
      <SalesAccountEdit ref="childSalesAccount" :billStute="status" :idCuster="SalesAccountEditData"></SalesAccountEdit>
    </div>
    <div class='indexContent' v-else>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="未审">
              <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="单据编号、用户编号、旧用户编号、用户名称、制单人" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" highlight-current-row class="change-tables-table" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期" show-overflow-tooltip></el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="comments" show-overflow-tooltip min-width="80" label="销户说明"></el-table-column>
          <el-table-column prop="createName" show-overflow-tooltip min-width="80" label="制单人"></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" size="mini" v-if="scope.row.processState=='草稿'" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import SalesAccountEdit from "./SalesAccountEdit";
import chooseuser from "../Transfer/chooseuser";
import DetailsArrears from "@/components/DetailsArrears/index"; //欠费明细
export default {
  name: "SalesAccount",
  components: {
    SalesAccountEdit,
    DetailsArrears,
    chooseuser
  },
  data () {
    return {
      status: "CloseUserAdd", //add新增 updata修改
      buttomShow: false, //删除按钮的显示与隐藏
      SalesAccountEditData: {
        id: "",
        userNo: ""
      },
      formData: {
        userNo: "",
        id: ""
      },
      billTime: [],
      SalesAccountEditVisible: false,
      DetailsArrearsShow: false,
      historyData: {},
      crumbsData: {
        //面包屑
        titleList: [
          // { title: '业务管理', path: '/SalesAccount' },
          { title: "客户管理" },
          { title: "销户" }
        ]
      },
      approvalStatusOptions: this.common.processState(), //审批状态下拉框
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        fuzzyQuery: "",
        status: ""
      },
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      userNos: [],
      selectData: [],
    };
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".SalesAccount", [
      ".SalesAccount .toolbar",
      ".SalesAccount .block",
      ".SalesAccount #crumbs"
    ]);
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    init () {
      let _this = this;
      if (!_this.billTime) {
        _this.tableQuery.beginDate = "";
        _this.tableQuery.endDate = "";
      } else {
        _this.tableQuery.beginDate = _this.billTime[0];
        _this.tableQuery.endDate = _this.billTime[1];
      }
      let data = _this.tableQuery;
      let params = {
        busicode: "CloseUserList",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },

    search () {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    // 欠费明细
    detailsArrears () {
      let userNo = "";
      if (this.SalesAccountEditData.id !== "") {
        userNo = this.SalesAccountEditData.userNo;
      } else {
        userNo = this.$refs.childSalesAccount.searchUserNum;
      }
      if (userNo == "") {
        this.$message({
          message: "查询用户编号不能为空！",
          type: "warning"
        });
        return;
      }
      this.formData.userNo = userNo;
      this.DetailsArrearsShow = true;
      this.$refs["detailsArrears"].init();
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
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)

    },
    closeDialog (num) {
      //关闭会话
      this.DetailsArrearsShow = false;
      if (num == 0) {
        this.SalesAccountEditVisible = true;
      } else {
        this.SalesAccountEditVisible = false;
        this.init();
      }
    },
    //弹出框
    submit (type) {
      //提交
      this.$refs.childSalesAccount.submit(type);
    },
    details (i, row) {
      this.status = "CloseUserUpdate";
      this.SalesAccountEditData.id = row.id;
      this.SalesAccountEditData.userNo = row.userNo;
      this.SalesAccountEditVisible = true;
      if (row.processState == "进行中" || row.processState == "已办结" || row.processState == '已废弃') {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
    },
    salesAdd () {
      this.status = "CloseUserAdd";
      this.SalesAccountEditData.id = "";
      this.$store.state.isRemove = false;
      this.SalesAccountEditVisible = true;
      this.buttomShow = true;
    },
    deleteRow (index, row) {
      this.$confirm("此操作将永久删除该单据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.remove(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    remove (row) {
      let params = {
        busicode: "CloseUserDelete",
        data: {
          id: row.id
        }
      };
      let message = "删除成功！";
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.$message({
            message,
            type: "success"
          });
          this.init();
        });
    },
    // 打印销户受理单
    acceptFormPrint () {
      let command = 2; // 销户受理单
      if (this.userNos.length == 0) {
        this.$message.warning('请至少选择一条受理单')
        return
      }
      let params = {
        busicode: "ChangeUserAcceptPrint",
        data: {
          printType: command,
          userNos: this.userNos
        }
      };
      this.$api.fetch({ params: params }).then(async res => {
        let data = res
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        for (let i = 0; i < data.length; i++) {
          await this.common.print('print', 'ChangeUserAcceptPrint', '', data[i], this);
        }
        this.selectData.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
        this.userNos = []
        let select = []
        this.handleSelectionChange(select)
      })
    },
    // 选中事件
    handleSelectionChange (val) {
      this.selectData = val;
      this.userNos = [];
      val.forEach(item => {
        if (this.userNos.every(userNoItem => userNoItem !== item.userNo)) {
          this.userNos.push(item.userNo);
        }
      })
    },
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
.SalesAccount {
  width: 100%;
  height: 100%;
}
</style>

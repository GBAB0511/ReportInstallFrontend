<template>
  <el-dialog
    title="查询详情"
    :visible.sync="show"
    :close-on-click-modal="false"
    class="button-dialog search-dialog"
    @close="show = false"
  >
    <div class="searchQuery">
      <div class="search">
        <el-input
          v-model="fuzzyQuery"
          @keyup.native.enter="search"
          ref="fuzzyQuerySearch"
          clearable
          size="larger"
          placeholder="客户编号/客户名称/客户地址/账户编号/用户编号/手机号码/固定电话"
          @input="e => input = inputMe(e)"
        ></el-input>
        <el-button class="searchBtn" @click="search" icon="el-icon-search"
          >搜索</el-button
        >
      </div>
      <div class="content">
        <el-tabs v-model="active" type="border-card" @tab-click="changeTabs">
          <el-tab-pane name="custom">
            <div slot="label">
              客户<span style="color: red">{{
                customSize > 0 ? "(" + customSize + ")" : ""
              }}</span>
            </div>
            <div :style="{ height: maxHeight + 'px' }">
              <ux-grid
                ref="customTable"
                fit
                border
                :data="customTableData"
                highlight-current-row
                :max-height="maxHeight"
                header-row-class-name="table-header"
                row-class-name="table-row"
                @row-dblclick="handleSelectionChange"
              >
                <ux-table-column
                  type="index"
                  title="NO."
                  width="60"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="ctmNo"
                  min-width="100"
                  title="客户编号"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="ctmName"
                  min-width="250"
                  title="客户名称"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="ctmAddr"
                  min-width="300"
                  title="客户地址"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="certNo"
                  min-width="150"
                  title="证件号码"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="linkTel"
                  min-width="110"
                  title="固定电话"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="mobile"
                  min-width="110"
                  title="手机号码"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="comments"
                  min-width="170"
                  title="备注"
                  resizable
                ></ux-table-column>
              </ux-grid>
              <!-- <el-table ref="customTable" fit border :data="customTableData" :max-height="maxHeight" header-row-class-name="table-header" row-class-name="table-row" @row-dblclick="handleSelectionChange">
                    <el-table-column type="index" label="NO." width="70" align="center"></el-table-column>
                    <el-table-column prop="ctmNo" min-width="110" label="客户编号"></el-table-column>
                    <el-table-column prop="ctmName" min-width="150" label="客户名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="certNo" min-width="100" label="证件号码" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkTel" min-width="110" label="固定电话"></el-table-column>
                    <el-table-column prop="mobile" min-width="110" label="手机号码"></el-table-column>
                    <el-table-column prop="comments" min-width="120" label="备注"></el-table-column>
                </el-table>  -->
            </div>
          </el-tab-pane>
          <el-tab-pane name="account">
            <div slot="label">
              账户<span style="color: red">{{
                accountSize > 0 ? "(" + accountSize + ")" : ""
              }}</span>
            </div>
            <div :style="{ height: maxHeight + 'px' }">
              <ux-grid
                ref="accountTable"
                :max-height="maxHeight"
                highlight-current-row
                fit
                border
                :data="accountTableData"
                header-row-class-name="table-header"
                row-class-name="table-row"
                @row-dblclick="handleSelectionChange"
              >
                <ux-table-column
                  type="index"
                  title="NO."
                  width="100"
                  align="center"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="accountNo"
                  min-width="150"
                  title="账户编号"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="accountType"
                  min-width="80"
                  title="账户类型"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="accountBalance"
                  min-width="80"
                  title="账户余额"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="payWay"
                  min-width="100"
                  title="付款方式"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="openAccountBank"
                  min-width="80"
                  title="开户银行"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="openAccountName"
                  min-width="80"
                  title="开户名"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="bankAccount"
                  min-width="120"
                  title="银行账号"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="entrustNo"
                  min-width="120"
                  title="托收号"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="invoiceTitle"
                  min-width="100"
                  title="单位名称"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="invoiceTax"
                  min-width="100"
                  title="纳税人识别号"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
              </ux-grid>
              <!-- <el-table ref="accountTable" :max-height="maxHeight" fit border :data="accountTableData" header-row-class-name="table-header" row-class-name="table-row" @row-dblclick="handleSelectionChange">
                    <el-table-column type="index" label="NO." width="70" align="center"></el-table-column>
                    <el-table-column prop="accountNo" min-width="110" label="账户编号"></el-table-column>
                    <el-table-column prop="accountType" min-width="80" label="账户类型"></el-table-column>
                    <el-table-column prop="accountBalance" min-width="80" label="账户余额"></el-table-column>
                    <el-table-column prop="payWay" min-width="80" label="付款方式"></el-table-column>
                    <el-table-column prop="openAccountBank" min-width="80" label="开户银行"></el-table-column>
                    <el-table-column prop="openAccountName" min-width="80" label="开户名"></el-table-column>
                    <el-table-column prop="bankAccount" min-width="100" label="银行账号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="entrustNo" min-width="100" label="托收号"></el-table-column>
                    <el-table-column prop="invoiceTitle" min-width="120" label="单位名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="invoiceTax" min-width="100" label="纳税人识别号" show-overflow-tooltip></el-table-column>
                </el-table> -->
            </div>
          </el-tab-pane>
          <el-tab-pane name="user">
            <div slot="label">
              用户<span style="color: red">{{
                userSize > 0 ? "(" + userSize + ")" : ""
              }}</span>
            </div>
            <div class="kl-table" :style="{ height: maxHeight + 'px' }">
              <ux-grid
                :max-height="maxHeight"
                ref="userTable"
                fit
                border
                :data="userTableData"
                header-row-class-name="table-header"
                row-class-name="table-row"
                @selection-change="handleSelectionChange"
                highlight-current-row
              >
                <ux-table-column width="50" type="checkbox"></ux-table-column>
                <ux-table-column
                  type="index"
                  title="NO."
                  width="70"
                  align="center"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="userNo"
                  min-width="110"
                  title="用户编号"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="oldUserNo"
                  min-width="100"
                  title="老用户编号"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="ctmName"
                  min-width="120"
                  title="客户名称"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="ctmAddr"
                  min-width="120"
                  title="客户地址"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="setupMeterAddr"
                  min-width="120"
                  title="装表地址"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="businessArea"
                  min-width="120"
                  title="营业区域"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="tradeClassify"
                  min-width="80"
                  title="行业分类"
                  resizable
                ></ux-table-column>
                <ux-table-column
                  field="useWaterType"
                  min-width="80"
                  title="用水类型"
                  resizable
                  show-overflow-tooltip
                ></ux-table-column>
                <ux-table-column
                  field="status"
                  min-width="80"
                  title="用户状态"
                  resizable
                ></ux-table-column>
              </ux-grid>
              <!-- <el-table :max-height="maxHeight" ref="userTable" fit border :data="userTableData" header-row-class-name="table-header" row-class-name="table-row" @selection-change="handleSelectionChange">
                    <el-table-column prop="type" width="50" type="selection"></el-table-column>
                    <el-table-column type="index" label="NO." width="70" align="center"></el-table-column>
                    <el-table-column prop="userNo" min-width="110" label="用户编号"></el-table-column>
                    <el-table-column prop="oldUserNo" min-width="100" label="老用户编号"></el-table-column>
                    <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="setupMeterAddr" min-width="120" label="装表地址" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessArea" min-width="120" label="营业区域"></el-table-column>
                    <el-table-column prop="tradeClassify" min-width="80" label="行业分类"></el-table-column>
                    <el-table-column prop="useWaterType" min-width="80" label="用水类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" min-width="80" label="用户状态"></el-table-column>
                </el-table> -->
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="footer" v-if="active === 'user'" slot="footer">
        <el-button type="primary" size="mini" @click="handleSubmit"
          >确定</el-button
        >
        <el-button size="mini" @click="handleClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tableShow: false,
      maxHeight: 0,
      userMaxHeight: 0,
      active: "custom",
      show: false,
      customTableData: [],
      accountTableData: [],
      userTableData: [],
      fuzzyQuery: "",
      customSize: 0,
      accountSize: 0,
      userSize: 0,
      selected: "",
    };
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    open(res, fuzzyQuery) {
      this.show = true;
      this.fuzzyQuery = fuzzyQuery;
      this.init(res);
      this.$nextTick(() => {
        this.common.changeTable(this, ".searchQuery", [
          ".searchQuery .search",
          ".searchQuery .el-tabs__header",
        ]);
        this.maxHeight -= 30;
      });
    },
    init(res) {
      this.customTableData = res[0].list;
      this.customSize = res[0].size || 0;
      this.accountTableData = res[1].list;
      this.accountSize = res[1].size || 0;
      this.userTableData = res[2].list;
      this.userSize = res[2].size || 0;
      if (this.customSize + this.accountSize + this.userSize === 0) {
        this.$message({
          type: "warning",
          message: "未查询到相关内容",
        });
        return;
      }
      if (
        this.customSize === 0 &&
        this.accountSize > 0 &&
        this.userSize === 0
      ) {
        this.active = "account";
      } else if (
        this.customSize === 0 &&
        this.accountSize === 0 &&
        this.userSize > 0
      ) {
        this.active = "user";
      } else {
        this.active = "custom";
      }
    },
    search() {
      if (!this.fuzzyQuery || this.fuzzyQuery.length === 0) {
        this.$message({
          type: "error",
          message: "搜索内容不能为空",
        });
        return;
      } /* else if(this.fuzzyQuery.length < 5) {
                this.$message({
                type: 'warning',
                message: '搜索内容长度需要不低于5位'
                })
                return
            }*/
      const params = {
        busicode: "JudgeUserQuery",
        data: {
          fuzzyQuery: this.fuzzyQuery,
        },
      };
      this.$api.fetch({ params }).then((res) => {
        this.init(res);
      });
    },
    changeTabs(tab, event) {
      this.selected = "";
      if (tab.name == "user") {
        this.$nextTick(() => {
          this.common.changeTable(this, ".searchQuery", [
            ".searchQuery .search",
            ".searchQuery .el-tabs__header",
            ".searchQuery .footer",
          ]);
          this.maxHeight -= 30;
        });
      } else if(tab.name == "account") {
        this.common.changeTable(this, ".searchQuery", [
          ".searchQuery .search",
          ".searchQuery .el-tabs__header",
        ]);
        // this.maxHeight -= 30;
      }else{
        this.common.changeTable(this, ".searchQuery", [
          ".searchQuery .search",
          ".searchQuery .el-tabs__header",
        ]);
        this.maxHeight -= 30;
      }
    },
    handleSelectionChange(selection) {
      if (this.active === "custom") {
        this.selected = selection.ctmNo;
        this.handleSubmit();
      } else if (this.active === "account") {
        this.selected = selection.accountNo;
        this.handleSubmit();
      } else {
        this.selected = selection.map((item) => item.userNo).join(",");
      }
    },
    handleSubmit() {
      this.$emit("submit", this.selected);
      this.show = false;
    },
    handleClose() {
      this.show = false;
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    userMaxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
};
</script>

<style lang="scss">
.search-dialog {
  .searchQuery {
    height: calc(100% - 25px);
  }
  .footer {
    margin-left: 45%;
    margin-top: 1%;
  }
  // .elx-table--main-wrapper{
  //     .elx-table--empty-placeholder{
  //         top: 50%;
  //     }
  // }
  .search,
  .content {
    margin-top: 10px;
    .el-input {
      width: 500px;
      .el-input__inner {
        width: 100%;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
        // padding-left: 0px;
        &::-webkit-input-placeholder {
          font-size: 14px;
        }
        &::-moz-placeholder {
          font-size: 14px;
        }
        &:-ms-input-placeholder {
          font-size: 142px;
        }
      }
    }

    .table-row td .cell {
      font-size: 14px;
      line-height: 2em;
    }

    .table-header th .cell {
      font-size: 14px;
    }
  }
  .elx-body--column{
    height: auto !important;
  }
}
</style>
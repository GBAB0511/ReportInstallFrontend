
<template>
  <div class="CustomerChange">
    <!-- 变更选择框 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div v-if="CustEditVisible" class="bread-contain-right">
        <el-button type="primary" size="mini" @click="submit(status);" v-if="buttomShow">保 存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
      </div>
      <div v-else class="bread-contain-right">
        <!-- <el-dropdown @command="handleCommand" :hide-timeout="2000">
          <el-button size="mini" type="primary">
            打印<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">停用受理单</el-dropdown-item>
            <el-dropdown-item command="2">销户受理单</el-dropdown-item>
            <el-dropdown-item command="3">复表受理单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="salesAdd">添加</el-button>
      </div>
    </div>

    <div class='' v-if="CustEditVisible">
      <QuickCustomerChangeEdit ref="QuickCustomerChangeEdit" :NotDisabled="disabledChangeUser" :idCuster="idCuster" :billStute="status"></QuickCustomerChangeEdit>
    </div>
    <div class='' v-else>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="用户编号、用户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" @selection-change="getSelectData" ref="eltableCurrentRow">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号"></el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="createTime" min-width="80" label="提交时间" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="details(scope.$index, scope.row)">详情</el-button>
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
import QuickCustomerChangeEdit from "./QuickCustomerChangeEdit";
export default {
  name: "QuickCustomerChange",
  components: {
    QuickCustomerChangeEdit
  },
  data () {
    return {
      disabledChangeUser: false,
      idCuster: { id: "" },
      buttomShow: false, //保存按钮的显示与隐藏
      status: "QuickChangeUserAdd", //add 新增 updata 修改
      CustEditVisible: false,
      //面包屑
      crumbsData: { titleList: [{ title: "客户管理" }, { title: "快速变更" }] },
      billTime: [],
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        fuzzyQuery: "",
      },
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      //选中数据
      selectData: [],
      userNos: [],
    };
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".CustomerChange", [
      ".CustomerChange .toolbar",
      ".CustomerChange .block",
      ".CustomerChange #crumbs"
    ]);
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
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
        busicode: "QuickChangeUserList",
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

    demand () {
      //查询
      this.init();
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
    closeDialog () {
      //关闭会话
      this.CustEditVisible = false;
      this.init();
    },
    //弹出框
    submit (type) {
      //提交
      this.$refs.QuickCustomerChangeEdit.submit(type);
    },

    details (i, row) {
      this.idCuster.id = row.id;
      this.status = "QuickChangeUserUpdate";
      this.CustEditVisible = true;
      this.buttomShow = false;
      this.disabledChangeUser = true;
    },
    salesAdd () {
      this.idCuster.id = "";
      this.status = "QuickChangeUserAdd";
      this.CustEditVisible = true;
      this.buttomShow = true;
      this.disabledChangeUser = false;
    },
    handleCommand (command) {
      if (this.selectData.length == 0) {
        this.$message.warning('请至少选择一条变更单')
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
        this.getSelectData(select)
      })
    },
    // 表格勾选对象数组
    getSelectData (itemList) {
      this.selectData = itemList
      itemList.forEach(item => {
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
.CustomerChange {
  width: 100%;
  height: 100%;
}
</style>

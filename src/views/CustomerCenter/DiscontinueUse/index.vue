<template>
  <div class="DiscontinueUse">
    <el-dialog class="common-dialog" title="欠费明细" :close-on-click-modal="false" :visible.sync="DetailsArrearsShow">
      <DetailsArrears ref="detailsArrears" :formData="formData"></DetailsArrears>
    </el-dialog>
    <div class="bread-contain ">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div v-if="waterEditVisible" class="bread-contain-right">
        <el-button type="primary" size="mini" @click="detailsArrears('getShow')">欠费明细</el-button>
        <el-button type="primary" size="mini" @click="submit(status)" v-if="buttomShow">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div v-else class="bread-contain-right">
        <el-button @click="handleCommand()" size="mini" type="primary">停用受理单打印</el-button>
        <el-button icon="el-icon-plus" @click="add" size="mini" type="primary">添加</el-button>
      </div>
    </div>

    <div v-if="waterEditVisible" class='indexContent'>
      <DisuseProcedureEdit ref="childWaterEditor" :idCuster="DisuseProcedureData" :billStute="status"></DisuseProcedureEdit>
    </div>

    <div v-else class='indexContent'>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="未审批">
              <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拆表类型：">
            <el-select ref="select2" clearable v-model="tableQuery.splitMeterWay" placeholder="全部">
              <el-option v-for="(item,index) in dictionaryData.MRM" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="单据编号、用户编号、旧用户编号、客户名称、制单人" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="用户状态：">
            <el-select clearable v-model="tableQuery.userStatus" placeholder="全部">
              <el-option v-for="(item,index) in dictionaryData.CUS" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="init" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border @selection-change="handleSelectionChange" :data="tableData.list">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期"></el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="splitMeterFlag" min-width="80" :formatter="formatter" label="是否拆表"></el-table-column>

          <el-table-column prop="lastReadingNum" min-width="80" label="上期抄码"></el-table-column>

          <el-table-column prop="splitMeterRemark" min-width="120" show-overflow-tooltip label="备注"></el-table-column>

          <el-table-column prop="createName" min-width="80"  label="制单人"></el-table-column>

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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import DisuseProcedureEdit from "./DisuseProcedureEdit";
import DetailsArrears from "@/components/DetailsArrears/index"; //欠费明细
export default {
  name: "DiscontinueUse",
  components: {
    DisuseProcedureEdit,
    DetailsArrears
  },
  data () {
    return {
      buttomShow: false, //删除按钮的显示与隐藏
      billTime: [], //单据日期
      status: "StopUserAdd", //'add'新增 'update'修改
      multipleSelection: "",
      DetailsArrearsShow: false,
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户管理" }, { title: "停用" }]
      },
      approvalStatusOptions: this.common.processState(), //审批状态下拉框
      //数据字典
      dictionaryData: [],

      tableQuery: {
        userStatus: '',
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        status: "",
        fuzzyQuery: "",
        splitMeterWay: ""
      },
      formData: {
        userNo: "",
        id: ""
      },
      DisuseProcedureData: {
        userNo: "",
        id: ""
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
      waterEditVisible: false, //综合查询的显示和隐藏
      waterEditVisibleAdd: false,
      WaterEditorName: "停用",
      //选中数据
      selectData: [],
      userNos: [],
    };
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.getDictionary();
    this.common.changeTable(this, ".DiscontinueUse", [
      ".DiscontinueUse .toolbar",
      ".DiscontinueUse .block",
      ".DiscontinueUse #crumbs"
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
        this.$refs.select2.blur()
      }
    },
    init () {
      if (this.billTime !== null && this.billTime.length !== 0) {
        this.tableQuery.beginDate = this.billTime[0];
        this.tableQuery.endDate = this.billTime[1];
      }
      let _this = this;
      let params = {
        busicode: "StopUserList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    //  数据字典（查询框）
    getDictionary () {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "MRM,CUS"
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.$set(_this, "dictionaryData", res);
        });
    },

    formatter (row, column, cellValue, index) {
      return row.splitMeterFlag == 1 ? "是" : "否";
    },

    deleteRow (index, row) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove(row)
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    remove (row) {
      let params = {
        "busicode": "StopUserDelete",
        "data": {
          id: row.id,
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

    //保存
    submit (type) {
      this.$refs.childWaterEditor.submit(type);
    },
    // 欠费明细
    detailsArrears (val) {
      let userNo = "";
      if (this.DisuseProcedureData.id !== "") {
        userNo = this.DisuseProcedureData.userNo;
      } else {
        userNo = this.$refs.childWaterEditor.searchUserNum;
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
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.selectData = val;
      this.userNos = [];
      val.forEach(item => {
        if (this.userNos.every(userNoItem => userNoItem !== item.userNo)) {
          this.userNos.push(item.userNo);
        }
      })
    },
    //   导出
    exportExcel () { },
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
      this.waterEditVisible = false;
      this.waterEditVisibleAdd = false;
      this.init();
    },
    // 编辑
    details (i, row) {
      this.status = "StopUserUpdate";
      this.DisuseProcedureData.id = row.id;
      this.DisuseProcedureData.userNo = row.userNo;
      if (
        row.processState == "进行中" ||
        row.processState == "已办结" ||
        row.processState == '已废弃'
      ) {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
      this.waterEditVisible = true;
    },
    // 添加
    add () {
      this.status = "StopUserAdd";
      this.DisuseProcedureData.id = '';
      this.DisuseProcedureData.userNo = '';
      this.waterEditVisible = true;
      this.buttomShow = true;
    },
    // 打印停用受理单
    handleCommand () {
      let command = 1; // 停用
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
        this.handleSelectionChange(select)
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
.DiscontinueUse {
  width: 100%;
  height: 100%;
}
</style>

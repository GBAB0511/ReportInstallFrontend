<template>
  <div class="CancelCharges">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="indexVisible">
        <el-button
          v-if="buttomShow"
          size="mini"
          type="primary"
          @click="submit()"
          >保存</el-button
        >
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog"
          >返回</el-button
        >
      </div>
      <div class="bread-contain-right" v-else>
        <el-button
          icon="el-icon-plus"
          size="mini"
          @click="showChargeData"
          type="primary"
          >添加</el-button
        >
      </div>
    </div>

    <div class="indexContent" v-if="indexVisible">
      <CancelChargesEdit
        :editNeedData="editNeedData"
        :NotDisabled="buttomShow"
        :detailData="detailData"
        ref="CancelChargesEdit"
      ></CancelChargesEdit>
    </div>

    <div class="indexContent" v-else>
      <div class="toolbar">
        <el-form
          :inline="true"
          size="mini"
          :model="tableQuery"
          class="demo-form-inline"
        >
          <el-form-item label="状态：">
            <el-select
              ref="select1"
              clearable
              v-model="tableQuery.processState"
              placeholder
            >
              <el-option
                v-for="(item, index) in approvalStatusOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单据日期：">
            <el-date-picker
              v-model="DateChoosevalue"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              :picker-options="pickerOptions"
              :clearable="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="办结时间：">
            <el-date-picker
              v-model="finishTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              :picker-options="pickerOptions"
              :clearable="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="用户编号：" class="width-150">
            <el-input
              oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              v-model.trim="tableQuery.userNo"
              placeholder="用户编号"
              @keydown.enter.native="demand"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="余额退款方式：" class="width-100">
            <el-select v-model="tableQuery.refundWay" clearable>
              <el-option
                v-for="(item, index) in dictionaryData.FCC"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-150">
            <el-input
              oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              v-model.trim="tableQuery.fuzzyQuery"
              placeholder="单据编号/制单人"
              @keydown.enter.native="demand"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              class="searchBtn"
              @click="demand"
              icon="el-icon-search"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          highlight-current-row
          border
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column
            type="index"
            label="NO."
            width="50"
            fixed="left"
            :index="indexMethod"
          ></el-table-column>

          <el-table-column
            prop="processStateName"
            min-width="80"
            label="状态"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="processName"
            min-width="80"
            label="进度"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="processHandleMan"
            min-width="90"
            label="当前处理人"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="billNo"
            min-width="130"
            label="单据编号"
          ></el-table-column>

          <el-table-column
            prop="billDate"
            min-width="150"
            label="单据日期"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="userNo"
            min-width="130"
            label="用户编号"
          ></el-table-column>
          <el-table-column
            prop="origChargeTime"
            min-width="150"
            label="原收费日期"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="origChargeMoney"
            min-width="100"
            label="原收费金额"
            show-overflow-tooltip
            align="right"
          ></el-table-column>
          <el-table-column
            prop="origChargeSerialNo"
            min-width="200"
            label="原收费流水号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createName"
            min-width="80"
            label="制单人"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            min-width="150"
            label="最后更新时间"
            show-overflow-tooltip
          ></el-table-column>
           <el-table-column prop="comments" min-width="150" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.$index, scope.row)"
                >详情</el-button
              >
              <el-button
                type="text"
                v-if="
                  scope.row.processState != 'approval' && scope.row.processState != 'Process-task2' &&
                    scope.row.processState != 'END'
                "
                @click="deleteRow(scope.$index, scope.row)"
                >删除</el-button
              >
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

      <!-- 弹出表单收费查询 -->
      <el-dialog
        title="请选择要取消收费的项目"
        :destroy-on-close="true"
        :visible.sync="ChargeReportOfFlowDetailVisible"
        :close-on-click-modal="false"
        class="button-dialog"
        @close="ChargeReportOfFlowDetailVisible = false"
      >
        <ChargeReportOfFlowDetail
          v-if="ChargeReportOfFlowDetailVisible"
          ref="ChargeReportOfFlowDetail"
          @tableRadioChecked="tableRadioChecked"
        ></ChargeReportOfFlowDetail>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="add"
            >确 定</el-button
          >
          <el-button type="info" size="mini" plain @click="closeCharge"
            >取 消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ChargeReportOfFlowDetail from "@/views/ReportCenter/ChargeReportOfFlowDetailed/index";
import CancelChargesEdit from "./CancelChargesEdit";
export default {
  name: "CancelCharges",
  components: {
    CancelChargesEdit,
    ChargeReportOfFlowDetail
  },
  data() {
    return {
      ChargeReportOfFlowDetailVisible: false,
      buttomShow: true,
      editNeedData: {
        saveType: "",
        busicode: "",
        userNo: "",
        origChargeSerialNo: ""
      },

      DateChoosevalue: ["", ""],
      finishTime: ["", ""],
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        userNo: "",
        receiptBeginDate: "",
        receiptEndDate: "",
        fuzzyQuery: "", //模糊查询
        refundWay: "",
        processState: "", //状态
        finishBeginDate: "",
        finishEndDate: ""
      },
      dictionaryData: [],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "账务调整" },
          { title: "取消收费" }
        ]
      },
      //审批状态下拉框
      approvalStatusOptions: this.common.processState(),
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      indexVisible: false, // 选择红冲记录
      detailData: {},
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.getDictionary();
    this.common.changeTable(this, ".CancelCharges", [
      ".CancelCharges .toolbar",
      ".CancelCharges .bread-contain",
      ".CancelCharges .block"
    ]);
  },
  methods: {
    closeCharge(){
      this.ChargeReportOfFlowDetailVisible = false;
      this.editNeedData.userNo = '';
      this.editNeedData.origChargeSerialNo = '';
    },
    tableRadioChecked({ serialNo, userNo }) {
      this.editNeedData.origChargeSerialNo = serialNo;
      this.editNeedData.userNo = userNo;
    },
    showChargeData() {
      this.ChargeReportOfFlowDetailVisible = true;
    },
    init() {
      this.dateFormat();
      let params = {
        busicode: "FnCancelChargeList",
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
    dateFormat() {
      this.DateChoosevalue = this.DateChoosevalue || ["", ""];
      this.tableQuery.receiptBeginDate = this.DateChoosevalue[0];
      this.tableQuery.receiptEndDate = this.DateChoosevalue[1];
      this.finishTime = this.finishTime || ["", ""];
      this.tableQuery.finishBeginDate =
        this.finishTime[0] == "" ? "" : this.finishTime[0] + " 00:00:00";
      this.tableQuery.finishEndDate =
        this.finishTime[1] == "" ? "" : this.finishTime[1] + " 23:59:59";
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "HCT,FCC" 
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },

    demand() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
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
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() {
      //关闭会话
      this.indexVisible = false;
      this.init();
      // 清空editNeedData
      this.editNeedData.saveType = "";
      this.editNeedData.userNo = '';
      this.editNeedData.origChargeSerialNo = '';
      this.editNeedData.busicode = "";
    },
    //弹出框
    submit() {
      //提交
      this.$refs.CancelChargesEdit.submit();
    },
    add() {
      if(this.editNeedData.userNo != ""){
        this.editNeedData.saveType = "add";
        console.log(this.editNeedData);
        delete this.editNeedData.busicode;
        let params = {
          busicode: "FnCancelChargeQuery",
          data: {
            origChargeSerialNo: this.editNeedData.origChargeSerialNo,
            userNo: this.editNeedData.userNo
          }
        };
        this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.detailData = res;
          this.ChargeReportOfFlowDetailVisible = false;
          this.buttomShow = true;
          this.indexVisible = true;
        });
      }else{
        this.$message({
          type:"warning",
          message: "还未勾选取消收费的项目！"
        })
      }
    },
    details(index, row) {
      this.editNeedData = row;
      this.editNeedData.saveType = "edit";
      if (row.processState == "approval" || row.processState == "END" || row.processState == "Process-task2") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
      this.indexVisible = true;
    },

    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "FnCancelChargeDelete",
            data: { id: row.id }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.init();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
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
.CancelCharges {
  width: 100%;
  height: 100%;

  .indexContent {
    height: calc(100% - 41px);
    overflow: hidden;
  }
}
</style>

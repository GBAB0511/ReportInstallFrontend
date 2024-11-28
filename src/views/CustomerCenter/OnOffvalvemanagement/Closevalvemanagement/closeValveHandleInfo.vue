<template>
  <div class="closeValveHandleInfoIndex">
    <div class="closeValveHandleInfoIndex-left">
      <el-dialog
        title="转办人员列表"
        :visible.sync="administrativeDialog"
        width="30%"
      >
        <el-form size="mini" :model="tableQuery">
          <el-form-item label="转办人员：">
            <el-select
              class="selectf1"
              filterable
              clearable
              v-model="tableQuery.administrativeName"
              placeholder="请选择"
            >
              <el-option-group
                v-for="group in administrativeOptions"
                :key="group.account"
                :label="group.userName"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.account"
                  :label="item.userName"
                  :value="item.account"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="administrativeDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmadministrative"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 弹出表单查看操作历史 -->
      <el-dialog
        title="操作历史"
        v-if="valveHistoryDialog"
        :visible.sync="valveHistoryDialog"
        :close-on-click-modal="false"
        class="button-dialog"
        @close="closeDialogValveHistory"
      >
        <ValveHistory
          ref="ValveHistory"
          :editNeedId="editNeedId"
        ></ValveHistory>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="fixDialogValveHistory"
            >确 定</el-button
          >
          <el-button
            type="info"
            size="mini"
            plain
            @click="closeDialogValveHistory"
            >取 消</el-button
          >
        </div>
      </el-dialog>
      <legend class="legendColumn">单据信息</legend>

      <!--详情-->
      <el-form
        :model="formData"
        class="formBill"
        :disabled="NotDisabled"
        :inline="true"
        size="mini"
        ref="form"
        label-width="130px"
      >
        <el-form-item label="单据编号：" class="disable-item">
          <el-input
            class="read-only"
            disabled
            v-model="formData.billNo"
            placeholder=""
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>

        <el-form-item label="单据日期：" class="disable-item">
          <el-input
            class="read-only"
            disabled
            v-model="formData.receiptTime"
            placeholder=""
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>

        <el-form-item label="计划完成时间：" prop="planTime" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.planTime" size="mini" clearable class="read-only" :disabled="true"></el-input>
          <!-- <el-date-picker
            v-model="time"
            type="daterange"
            placeholder="计划完成时间"
            clearable
            @input="daterangeChange"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
             class="f3"
            :disabled="true"
          >
          </el-date-picker> -->
        </el-form-item>

        <br />
        <el-form-item
          label="计划关停数量："
          prop="planCloseNum"
          class="disable-item"
        >
          <el-input
            v-model="formData.planCloseNum"
            size="mini"
            clearable
            class="read-only"
            @input="e => input = inputMe(e)"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="已完成数量："
          prop="finishNum"
          class="disable-item"
        >
          <el-input
            v-model="formData.finishNum"
            size="mini"
            @input="e => input = inputMe(e)"
            clearable
            class="read-only"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="已取消数量："
          prop="cancelNum"
          class="disable-item"
        >
          <el-input
            v-model="formData.cancelNum"
            size="mini"
            @input="e => input = inputMe(e)"
            clearable
            class="read-only"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item
          label="待开数量："
          prop="waitOpenNum"
          class="disable-item"
        >
          <el-input
            v-model="formData.waitOpenNum"
            size="mini"
            clearable
            class="read-only"
            @input="e => input = inputMe(e)"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="已开数量：" prop="openNum" class="disable-item">
          <el-input
            v-model="formData.openNum"
            size="mini"
            clearable
            class="read-only"
            @input="e => input = inputMe(e)"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <br />

        <el-form-item
          label="关阀原因："
          class="f3"
          prop="reason"
          :class="{ 'disable-item': NotDisabled }"
        >
          <span>{{ formData.reason }}</span>
        </el-form-item>
      </el-form>
    </div>
    <legend class="legendColumn">用户信息</legend>
    <div class="toolbar">
      <el-form
        :inline="true"
        size="mini"
        :model="tableQuery"
        class="demo-form-inline width-150"
      >
        <!-- <el-form-item class="form-left"> -->
        <!-- class="longinput" -->
        <el-form-item label="用户编号：">
          <el-input
            v-model="tableQuery.userNo"
            placeholder=""
            @input="e => input = inputMe(e)"
            @keydown.enter.native="demand"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="客户名称：">
          <el-input
            v-model="tableQuery.userName"
            @input="e => input = inputMe(e)"
            placeholder=""
            @keydown.enter.native="demand"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="阀门状态：">
          <el-select
            clearable
            v-model="tableQuery.valveStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionaryData.MVS"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否取消：">
          <el-select
            clearable
            v-model="tableQuery.cancelFlag"
            placeholder="请选择"
          >
            <el-option label="否" value="0" ></el-option>
            <el-option label="是" value="1" ></el-option>
          </el-select>
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
      <el-table highlight-current-row stripe border :data="tableData.list" class="wuserInfo-table">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->

        <el-table-column
          type="index"
          label="NO."
          width="50"
          :index="indexMethod"
          fixed="left"
        >
        </el-table-column>

        <el-table-column
          prop="valveStatusName"
          min-width="100"
          label="阀门状态"
          fixed="left"
        >
          <!-- <template slot-scope="scope">
             <span style="color:#606266" v-if="scope.row.valveStatus == 1">已开阀</span>
             <span style="color:#606266" v-if="scope.row.valveStatus == 2">待开阀</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 3">已关阀</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 4">待关阀</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 6">开阀异常</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 7">关阀异常</span>
             </template> -->
        </el-table-column>

        <el-table-column prop="feeStatus" min-width="100" fixed="left" label="欠费状态">
          <template slot-scope="scope">
            <span v-if="scope.row.feeStatus === '是'" style="color: red;">{{scope.row.feeStatus}}</span>
            <span v-else style="color: rgb(28, 184, 96)">{{scope.row.feeStatus}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="usn" min-width="120" label="开账状态" show-overflow-tooltip>
        </el-table-column> -->

        <el-table-column prop="userNo" min-width="140" fixed="left" label="用户编号" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="userName" min-width="250" label="客户名称" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="userAddr" min-width="250" label="客户地址" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="tel" min-width="140" label="手机号码" show-overflow-tooltip>
        </el-table-column>


        <el-table-column prop="arrearage" min-width="100" label="欠费金额">
        </el-table-column>

        <el-table-column prop="arrearageNum" min-width="100" label="欠费笔数">
        </el-table-column>

        <el-table-column prop="remoteFlag" min-width="100" label="是否远程">
        </el-table-column>

        <el-table-column
          prop="valveControlFlag"
          min-width="100"
          label="是否阀控"
        >
        </el-table-column>

        <el-table-column prop="cancelFlag" min-width="100" label="是否取消">
        </el-table-column>
        <el-table-column prop="closeTime" min-width="200" label="关阀时间">
        </el-table-column>

        <el-table-column
          prop="closeOperator"
          min-width="100"
          label="关阀处理人"
        >
        </el-table-column>

        <el-table-column prop="paymentTime" min-width="100" label="缴费时间">
        </el-table-column>

        <el-table-column prop="openTime" min-width="200" label="开阀时间">
        </el-table-column>

        <el-table-column prop="openOperator" min-width="100" label="开阀处理人">
        </el-table-column>

        <el-table-column prop="cancelTime" min-width="200" label="取消时间">
        </el-table-column>

        <el-table-column prop="cancelOperator" min-width="100" label="取消人">
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="240">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.remoteFlag == '否'"
              @click.native="checkvalvehistory(scope.row)"
              >操作历史</el-button
            >
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.valveStatus == 1 && scope.row.remoteFlag == '否'"
              @click.native="confirmclosingvalve(scope.row)"
              >关阀</el-button
            >
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.valveStatus == 1 && scope.row.remoteFlag == '否'"
              @click.native="cancelclosingvalve(scope.row)"
              >取消关阀</el-button
            >
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.valveStatus == 1 && scope.row.remoteFlag == '否'"
              @click.native="getadministrative(scope.row)"
              >转办</el-button
            >
            <el-button
              type="text"
              size="mini"
              v-if="(scope.row.valveStatus == -1 || scope.row.valveStatus == -3) && scope.row.remoteFlag == '否'"
              @click.native="getadministrative(scope.row)"
              >处理</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click.native="checkvalvehistory(scope.row)">操作历史</el-button>
            <el-button type="text" @click.native="confirmclosingvalve(scope.row)">关阀</el-button>
            <el-button type="text"  @click.native="cancelclosingvalve(scope.row)">取消关阀</el-button>
            <el-button type="text"  @click.native="getadministrative(scope.row)">转办</el-button>
            <el-button type="text"  @click.native="getadministrative(scope.row)">处理</el-button>
          </template>
        </el-table-column> -->
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
    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
  </div>
</template>
<script>
import ValveHistory from "@/components/valveHistory";
export default {
  name: "closeValveHandleInfo",
  props: ["editNeedData"],
  components: {
    ValveHistory,
  },
  data() {
    return {
      time: [],
      editNeedId: "",
      //操作历史弹窗
      valveHistoryDialog: false,
      userRowListId: "",
      //转办人员弹框
      administrativeDialog: false,
      // 隐藏部分表单内容
      hideInputContent: false,
      // 是否需要保存
      approveFlag: 0,
      // 数据字典数据
      dictionaryData: {},
      valveStateOptions: [
        {
          id: "1",
          name: "已开阀",
        },
        {
          id: "2",
          name: "待开阀",
        },
        {
          id: "3",
          name: "已关阀",
        },
        {
          id: "4",
          name: "待关阀",
        },

        {
          id: "6",
          name: "开阀异常",
        },
        {
          id: "7",
          name: "关阀异常",
        },
      ],
      administrativeOptions: [],
      //外勤人员下拉菜单
      fieldStaffList: [],
      //抄表人下拉菜单
      meterReadingPersonnelList: [],
      rules: {
        planTime: [
          { required: true, message: "请选择计划完成日期", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请输入关阀原因", trigger: "blur" },
        ],
      },
      NotDisabled: false,
      tableData: {},
      tableQuery: {
        page: 1,
        pageCount: 20,
        valveCloseId: this.editNeedData.id,
        cancelFlag: '0'
      },
      formData: {
        planCloseNum: "0",
      },
    };
  },
  mounted() {
    this.init(); //数据初始化
    //this.getHtmlData();
    //草稿、登記
    this.getDictionary();
    // this.editNeedData.processState = "END"
    if (
      this.editNeedData.processState == "END" || //完结
      this.editNeedData.processState == "CANCEL" || //终止
      this.editNeedData.processState == "approval" //进行中-审批
    ) {
      //表单 不可修改
      this.NotDisabled = true;
      this.hideInputContent = true;
      this.approveFlag = 1;
    } else {
      //进行中-登记、草稿、回填
      if (
        this.editNeedData.processState == "" || //草稿
        this.editNeedData.processState == "register" //登记
      ) {
        //表单 可修改
        this.NotDisabled = false;
        this.hideInputContent = false;
        this.approveFlag = 0;
      } else {
        this.NotDisabled = true;
        this.hideInputContent = true;
        this.approveFlag = 1;
      }
    }
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //初始化
    init() {
      let _this = this;
      let params = {
        busicode: "ValveCloseQuery",
        data: this.tableQuery,
      };
      delete this.tableQuery.administrativeName;
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.tableData = res.list;
          //  _this.tableData.list.forEach(ele =>{
          //   if(ele.feeStatus == "0"){
          //   ele.feeStatus = "否"
          // } else if(ele.feeStatus == "1") {
          //   ele.feeStatus = "是"
          // }
          //    if(ele.valveControlFlag == "0"){
          //   ele.valveControlFlag = "否"
          // } else if(ele.valveControlFlag == "1") {
          //   ele.valveControlFlag = "是"
          // }
          //   if(ele.cancelFlag == "0"){
          //   ele.cancelFlag = "否"
          // } else if(ele.cancelFlag == "1") {
          //   ele.cancelFlag = "是"
          // }
          //   if(ele.remoteFlag == "0"){
          //   ele.remoteFlag = "否"
          // } else if(ele.remoteFlag == "1") {
          //   ele.remoteFlag = "是"
          // }

          //    })
          _this.formData = res.ValveCloseVo;

        //   _this.time[0] = res.ValveCloseVo.planStartTime

        //  _this.time[1] = res.ValveCloseVo.planTime

          // _this.formData.planCloseNum = _this.tableData.list.length;

          // this.daterangeChange(this.time)//回显时间范围

          if (this.formData.processState == "") {
            this.approveFlag = 0;
          } else {
            this.approveFlag = 1;
          }

          this.getHtmlData();
          //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          _this.common.changeTable(this, ".closeValveHandleInfoIndex", [
            ".closeValveHandleInfoIndex.toolbar",
            ".closeValveHandleInfoIndex.block",
          ]);
        })
        .catch((this.tableData = {}));
    },
    daterangeChange(e) {
      let _this = this;
      _this.$nextTick(() => {
        _this.$set(_this, "time", [e[0] + '  -  ' + e[1]]);
        _this.$forceUpdate();
      });
    },
    getFormbData() {
      let meterNoArr = [];
      this.tableData.list.forEach((item) => {
        meterNoArr.push(item.userNo);
      });
      let data = {
        userNoList: Array.from(new Set(meterNoArr)),
        planTime: this.time[1],
        planStartTime:this.time[0],
        reason: this.formData.reason,
      };
      return data;
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "MVS", // 缴费方式
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.dictionaryData = res;
        });
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = {
            busicode: "ValveCloseUpdate",
            data: this.getFormbData(),
          };
          this.$api.fetch({ params }).then((res) => {
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
            });
          });
        }
      });
    },
    // 查看操作历史弹出框取消按钮
    closeDialogValveHistory() {
      this.valveHistoryDialog = false;
    },
    fixDialogValveHistory() {
      this.valveHistoryDialog = false;
    },
    //查询
    demand() {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    //查看操作历史
    checkvalvehistory(row) {
      this.valveHistoryDialog = true;
      this.editNeedId = row.id;
    },
    //确认关阀
    confirmclosingvalve(row) {
      this.$confirm("是否确认关阀?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _this = this;
          let params = {
            busicode: "ValveClose",
            data: {
              id: row.id,
              userNo: row.userNo,
            },
          };
          this.$api
            .fetch({
              params: params, //参数
            })
            .then((res) => {
              this.$message({
                type: "success",
                message: "关阀成功!",
              });
              this.init();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //取消关阀
    cancelclosingvalve(row) {
      this.$confirm("是否确认取消关阀?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _this = this;
          let params = {
            busicode: "ValveCloseCancel",
            data: {
              id: row.id,
              userNo: row.userNo,
            },
          };
          this.$api
            .fetch({
              params: params, //参数
            })
            .then((res) => {
              this.$message({
                type: "success",
                message: "取消关阀成功!",
              });
              this.init();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //确认转办人员列表
    confirmadministrative() {
      //  let tempArr = [];
      let Data = [];

      if (this.administrativeOptions)
        for (let i = 0; i < this.administrativeOptions.length; i++) {
          if (this.administrativeOptions[i].options !== undefined) {
            var smplist = this.administrativeOptions[i].options;

            for (let j = 0; j < smplist.length; j++) {
              if (this.tableQuery.administrativeName === smplist[j].account) {
                Data.push({
                  account: this.administrativeOptions[i].options[j].account,
                  userName: this.administrativeOptions[i].options[j].userName,
                });

                this.keyData = Data;
              } else {
              }
            }
          } else {
          }
        }
      let params = {
        busicode: "ValveTransfer",
        data: {
          account: this.keyData[0].account,
          name: this.keyData[0].userName,
          type: 1,
          id: this.userRowListId,
        },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: "转办成功!",
          });
          this.administrativeDialog = false;
          this.init();
        });
    },
    //转办人员
    getadministrative(row) {
      this.administrativeOptions = [];
      this.userRowListId = row.id;
      this.administrativeDialog = true;
      // let _this = this
      let params = {
        busicode: "ValveTransferAccountList",
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          let tempArr = []; //外勤人
          let tempArrs = []; //抄表人
          var adminList = res.legworkList;
          var adminLists = res.meterReaderList;

          // 外勤人员
          for (var i = 0; i < adminList.length; i++) {
            tempArr.push({
              account: adminList[i].userAccount,
              userName: adminList[i].userName,
            });

            this.fieldStaffList.options = tempArr;
          }
          // 抄表人员
          for (var i = 0; i < adminLists.length; i++) {
            tempArrs.push({
              account: adminLists[i].userAccount,
              userName: adminLists[i].userName,
            });

            this.meterReadingPersonnelList.options = tempArrs;
          }
          this.administrativeOptions.push(
            { userName: "外勤人员", options: this.fieldStaffList.options },
            {
              userName: "抄表人员",
              options: this.meterReadingPersonnelList.options,
            }
          );
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;

      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "valve_close",
        "审批流配置:" +
          _this.formData.processStateName +
          "(" +
          _this.formData.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (
            window.location.href.indexOf("WaterSideIndex") > 0 ||
            window.location.href.indexOf("HallBusiness") > 0
          ) {
            // 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        "ValveCloseUpdate"
      );
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
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.f3 {
  width: 70%;
}
.selectf1 {
  width: 120px;
}
</style>
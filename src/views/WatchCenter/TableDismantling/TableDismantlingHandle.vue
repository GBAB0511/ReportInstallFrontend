<template>
  <div class="TableDismantlingHandle">
    <!-- 弹出表单查看附件 -->
    <el-dialog title="查看附件" :visible.sync="ViewAttachmentVisible" v-if="ViewAttachmentVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogViewAtt" append-to-body>
      <attachment-view-info :receiptAccessory="viewAttaParams" busicode="ReceiptAccessoryList" />
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeDialogViewAtt">关 闭</el-button>
      </div>
    </el-dialog>
    <el-form :model="selectData" ref="form" class="formBill" :inline="true" :disabled="NotDisabled" size="mini" label-width="130px">
      <!-- 单据信息 -->
      <billInfo ref="billInfo"></billInfo>

      <legend class="legendColumn">拆表信息</legend>
      <el-form-item label="拆表类型" v-if='NotDisabled' class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.replaceTypeName" size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="拆表类型：" v-else>
        <el-select clearable v-model="selectData.replaceType" placeholder="拆表类型">
          <el-option v-for="item in dictionaryData.MRM" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="计划完成日期：" v-if="!NotDisabled">
        <el-date-picker v-model="selectData.planFinishDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="计划完成日期：" v-else class="disable-item">
        <!-- <el-date-picker v-model="selectData.planFinishDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker> -->
        <span>{{selectData.planFinishDate}}</span>
      </el-form-item>

      <el-form-item label='拆表员：' v-if='!NotDisabled'>
        <el-select clearable v-model="selectData.replaceStaff" placeholder="请选择">
          <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拆表员：" v-else class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.replaceStaffName" size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="拆表原因：" class="f2" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" :rows="2" v-model="selectData.replaceReason" placeholder="拆表原因"></el-input>
        <span v-else>{{selectData.replaceReason}}</span>
      </el-form-item>
      <el-form-item label="水表数量：" v-if="this.editNeedData.processState != ''&& this.editNeedData.processState != 'register' " :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.meterAmount" disabled size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="已回填数量：" v-if="this.editNeedData.processState != '' && this.editNeedData.processState != 'register' " :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.backfillAmount" disabled size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
    </el-form>
    <legend class="legendColumn">回填信息</legend>
    <div :class="{ backfillContent:isActive , backfillContentNone:!isActive}">
      <div :class="{ submitEditLeft:isActive , submitEditLeftNone:!isActive}">
        <div class="submit_edit_left_msg">
          <div class="msg_content">
            <span>用户编号：</span>
            <span>{{activeData.userNo}}</span>
          </div>

          <div class="msg_content">
            <span>客户名称：</span>
            <span>{{activeData.ctmName}}</span>
          </div>

          <div class="msg_content">
            <span>客户地址：</span>
            <span>{{activeData.ctmAddr}}</span>
          </div>

          <div class="msg_content">
            <span>水表口径：</span>
            <span>{{activeData.oldMeterBore}}</span>
          </div>

          <div class="msg_content">
            <span>上期抄码：</span>
            <span>{{activeData.upperNum}}</span>
          </div>
        </div>
        <div class="submit_edit_left_content">
          <el-form size="mini" :inline="true" class="formBill-One" label-width="100px" :model="activeData" ref="leftForm" :rules="rules">
            <el-form-item label="拆表日期：" prop="replaceDate">
              <el-date-picker v-model="activeData.replaceDate" size="mini" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>

            <el-form-item label="拆表员：" size="mini" prop="replaceStaff">
              <el-select v-model="activeData.replaceStaff" placeholder="请选择">
                <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="旧表底码：" prop="oldMeterNum">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.oldMeterNum" size="mini" @blur="blurTest('old')" type="Number"></el-input>
            </el-form-item>

            <el-form-item label="余量：" prop="margin">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.margin" disabled size="mini" readonly="readonly" clearable></el-input>
            </el-form-item>

            <el-form-item label="旧表处理方式：" size="mini" prop="oldHandleWay">
              <el-select v-model="activeData.oldHandleWay" placeholder="请选择">
                <el-option v-for="item in dictionaryData.OMD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注：" prop="comments">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.comments" size="mini" clearable></el-input>
            </el-form-item>

            <div class="DataEntry-button">
              <el-upload class="upload-file" multiple action="/" :http-request="uploadAttachment" :show-file-list="false">
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button size="mini" @click="submit" type="primary">保存</el-button>
            </div>
          </el-form>
        </div>
      </div>

      <div :class="{ submitEditRight:isActive , submitEditRightNone:!isActive}">
        <!-- <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="search-input">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="请输入用户编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="searchBtn" @click="getTableData" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div> -->
        <div class="kl-table">
          <el-table highlight-current-row stripe highlight-current-row border :data="tableData.list" :row-class-name="rowClassName" ref="klTableData" @row-click="rowClick">
            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

            <el-table-column prop="userNo" min-width="120" label="用户编号" show-overflow-tooltip></el-table-column>

            <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>

            <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip></el-table-column>

           <!-- <el-table-column prop="oldMeterBore" min-width="80" label="水表口径"></el-table-column>-->

            <el-table-column min-width="80" prop="upperNum" label="上期抄码" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="80" prop="oldMeterNum" label="旧表底码" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="140" prop="setupMeterDate" label="装表日期"></el-table-column>

            <el-table-column min-width="140" prop="replaceDate" label="拆表日期"></el-table-column>

            <el-table-column min-width="180" prop="oldHandleWayName" label="旧表处理方式" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="80" prop="margin" label="余量" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="150" prop="comments" label="备注" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button type="text" v-if="editNeedData.processState != ''" @click="getViewAttachment(scope.$index,scope.row)">查看附件</el-button>
                <!-- <el-button type="text" v-if="editNeedData.processState == ''||editNeedData.processState == 'register' " @click="deleteRow(scope.$index,scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div>
      <legend class="legendColumn">上传附件
        <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
      </legend>
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </div>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import uploadFile from "@/components/uploadPic"; //上传附件
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "TableDismantlingHandle",
  components: {
    billInfo,
    uploadFile,
    AttachmentViewInfo,
  },
  props: ["editNeedData"],
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_chg_plan#2",
      tempId: "",
      // 查看附件
      ViewAttachmentVisible: false,
      // 查看附件 data
      viewAttaParams: [],
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //是否可显示回填表单
      isActive: true,
      formDataIndex: 0,//修改表单索引号
      // 数据字典
      dictionaryData: {},
      // 表单校验
      rules: {},
      tableQuery: {
        receiptId: this.editNeedData.id,
        fuzzyQuery: "",
        page: 1,
        pageCount: 20
      },
      // 列表数据
      tableData: {},
      // 点击的数据 回填内容
      activeData: {
        userNo: "",
        userName: "",
        userAddr: "",
        meterBore: "",
        upperNum: "",
        replaceDate: "",
        replaceStaff: "",
        oldMeterNum: "",
        oldHandleWay: "",
        comments: ""
      },
      // 拆表信息
      selectData: {
        replaceTypeName: '',//拆表类型
        replaceType: '',//拆表类型：
        planFinishDate: '',//计划完成日期：
        replaceStaff: '',//拆表员：
        replaceStaffName: '',//拆表员：
        replaceReason: '',//拆表原因：
        meterAmount: '',//水表数量：
        backfillAmount: '',//已回填数量：
      },
      // 拆表员下拉数据
      replaceStaffData: [],
      // 列表中已回填数据（点击了保存）的新表编号
      savedCheck: [],
      tableShow: false,
      maxHeight: 0
    };
  },
  mounted() {
    if (this.editNeedData.id) {
      // 列表信息数据
      this.getTableData();
      // 换表信息数据
      this.getMsChgList();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      this.tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', this.tempId)
      this.getHtmlData();
    }
    //草稿、登記
    if (
      this.editNeedData.processState == "END" || //完结
      this.editNeedData.processState == "CANCEL" || //终止
      this.editNeedData.processState == "approval" //进行中-审批
    ) {
      this.isActive = false; //表单 不可修改
      this.NotDisabled = true;
      this.approveFlag = 1;
    } else {
      //进行中-登记、草稿、回填
      if (
        this.editNeedData.processState == "" || //草稿
        this.editNeedData.processState == "register" //登记
      ) {
        this.isActive = false; //表单 可修改
        this.NotDisabled = false;
        this.approveFlag = 0;
      } else if (this.editNeedData.processState == "backfill") {
        //回填
        this.isActive = true;
        //表单 不可修改
        this.NotDisabled = true;
        this.approveFlag = 1
      }
     
    }
     // 拆表员数据
      this.getReplaceStaffData();
      // 数据字典数据
      this.getDictionary();
  },
  methods: {
    //拆表信息数据
    getMsChgList() {
      let _this = this;
      let data = {
        id: this.editNeedData.id,
        receiptType: 2
      };
      let params = {
        busicode: "MsChgList",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.selectData = res.list[0];
          // 单据信息数据
          this.getBillData(res.list[0]);
          this.getHtmlData();
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_chg_plan#2",
        "审批流配置:" +
        _this.selectData.processStateName +
        "(" +
        _this.selectData.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.selectData.id, // 任务id
        _this.selectData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.editNeedData.busicode
      );
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      if (
      res.processState == "END" || //完结
      res.processState == "CANCEL" || //终止
      res.processState == "approval" //进行中-审批
    ) {
      this.isActive = false; //表单 不可修改
      this.NotDisabled = true;
      this.approveFlag = 1;
    } else {
      //进行中-登记、草稿、回填
      if (
        res.processState == "" || //草稿
        res.processState == "register" //登记
      ) {
        this.isActive = false; //表单 可修改
        this.NotDisabled = false;
        this.approveFlag = 0;
      } else if (res.processState == "backfill") {
        //回填
        this.isActive = true;
        //表单 不可修改
        this.NotDisabled = true;
        this.approveFlag = 1
      }
     
    }
      this.$refs.billInfo.init(this.billData);
    },
    // 获取列表数据以及左侧默认第一行数据信息
    getTableData() {
      let _this = this;
      let params = {
        busicode: "MsChgQuery",
        data: this.tableQuery
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.$set(_this, "tableData", res);
            if (_this.tableData.list.length > 0) {
              _this.activeData = JSON.parse(JSON.stringify(_this.tableData.list[0]));
              this.formDataIndex = 0
              this.$refs.klTableData.setCurrentRow(this.tableData.list[Number(this.formDataIndex)]);
              // 获取列表所有数据的新表编号，用来判断该数据是否修改过
              // for (let i = 0; i < _this.tableData.length; i++) {
              //   _this.savedCheck[i] = _this.tableData[i].newMeterNo;
              // }
          }
        });
    },

    rowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "OMD,MRM" // （旧表处理方式）
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 获取拆表员数据
    getReplaceStaffData() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "5" }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.replaceStaffData = res;
        });
    },
    //输入框失去焦点效验
    blurTest(str) {
      if (str == "old") {
        if (
          parseFloat(this.activeData.oldMeterNum) >=
          parseFloat(this.activeData.upperNum)
        ) {
          this.activeData.margin =
            parseFloat(this.activeData.oldMeterNum) -
            parseFloat(this.activeData.upperNum);
        } else {
          this.activeData.oldMeterNum = "";
          this.activeData.margin = "";
          this.$message({
            message: "旧表底码应大于上期抄码",
            type: "warning"
          });
        }
      } else {
        if (parseFloat(this.activeData.newMeterNum) < 0) {
          this.$message({
            message: "新表起码应该大于0",
            type: "warning"
          });
          this.activeData.newMeterNum = "";
        }
      }
    },
    //保存提交
    submit() {
      let _this = this;
      this.$refs["leftForm"].validate(valid => {
        if (valid) {
          // 入参数据处理
          let saveData = {};
          saveData.receiptId = _this.editNeedData.id;
          saveData.replaceDate = _this.activeData.replaceDate;
          saveData.oldMeterNum = _this.activeData.oldMeterNum;
          saveData.oldMeterNo = _this.activeData.oldMeterNo;
          saveData.newMeterNum = _this.activeData.newMeterNum;
          saveData.newMeterNo = _this.activeData.newMeterNo;
          saveData.margin = _this.activeData.margin;
          saveData.oldHandleWay = _this.activeData.oldHandleWay;
          saveData.comments = _this.activeData.comments;
          saveData.userNo = _this.activeData.userNo;
          // 拆表员value
          saveData.replaceStaff = _this.activeData.replaceStaff;
          // 拆表员name
          _this.replaceStaffData.forEach(item => {
            if (_this.activeData.replaceStaff == item.userAccount) {
              saveData.replaceStaffName = item.userName;
            }
          });

          let params = {
            busicode: "MsChgBackfill",
            data: [saveData]
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.getSheetData();

            });
        } else {
          this.$message({
            message: "数据未填完整！",
            type: "warning"
          });
          return false;
        }
      });
    },
    async getSheetData() {
      let params = {}
      params.busicode = "MsChgQuery"
      params.data = JSON.parse(JSON.stringify(this.tableQuery))
      params.data.userNo = this.activeData.userNo
      try {
        let getIndexData = await this.$api.fetch({ params });
        // 给已修改好的行赋值
        this.tableData.list[Number(this.formDataIndex)] = JSON.parse(JSON.stringify(getIndexData.list[0]))
        // 高亮下一行

        if (this.tableData.list.length - 1 == this.formDataIndex) {
          this.$message({
            message: '这是最后一条可修改数据了噢！',
            type: 'warning'
          });
          this.formDataIndex = 0
        } else {
          this.formDataIndex = Number(this.formDataIndex + 1)
        }
        this.$refs.klTableData.setCurrentRow(this.tableData.list[Number(this.formDataIndex)]);
        // 给表单赋值下一行数据
        this.activeData = JSON.parse(JSON.stringify(this.tableData.list[Number(this.formDataIndex)]))
      } catch (error) {
        console.log(error);
        // 点击的数据
        this.activeData = {
          userNo: "",
          userName: "",
          userAddr: "",
          meterBore: "",
          upperNum: "",
          replaceDate: "",
          replaceStaff: "",
          oldMeterNum: "",
          oldHandleWay: "",
          comments: ""
        };
      }
    },
    getFormbData() {

      var _this = this
      _this.replaceStaffData.forEach(item => {
            if (_this.selectData.replaceStaff == item.userAccount) {
              _this.selectData.replaceStaffName = item.userName;
            }
      });
      var saveData = {
        receiptType: 2,
        id: _this.editNeedData.id,
        // 拆表类型
        replaceType: _this.selectData.replaceType,
        // 计划完工日期
        planFinishDate: _this.selectData.planFinishDate,
        // 拆表员
        replaceStaff: _this.selectData.replaceStaff,
        replaceStaffName: _this.selectData.replaceStaffName,
        // 拆表原因
        replaceReason: _this.selectData.replaceReason,
        //附件临时ID
        tempId: _this.tempId
        // // 水表数量
        // replaceReason: _this.selectData.meterAmount,
        // // 已回填数量
        // replaceReason: _this.selectData.backfillAmount,
      }
      return saveData;
    },

    // 暂存按钮（添加/修改）
    save() {
      var _this = this
      var saveData = this.getFormbData()
      var params = {
        "busicode": this.editNeedData.busicode,
        "data": saveData
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
      })
    },
    // 返回前判断是否有数据尚未回填，提醒用户
    closeDialog() {
      let _this = this;
      // 默认savedCheck不存在null
      let savedCheckNull = false;
      for (let i = 0; i < this.savedCheck.length; i++) {
        if (this.savedCheck[i] === null) {
          savedCheckNull = true;
          _this
            .$confirm("尚有数据未回填，是否确认退出？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              _this.$parent.backfillVisible = false;
              _this.$parent.ChangeTablesShow = true;
              _this.$parent.init();
            })
            .catch(() => { });
          break;
        }
      }
      // 如果savedCheck不存在null，则表示所有数据已回填，可以直接退出
      if (!savedCheckNull) {
        _this.$parent.backfillVisible = false;
        _this.$parent.ChangeTablesShow = true;
        _this.$parent.init();
      }
    },
    // 点击列表的某一行
    rowClick(row, column, event, $index) {
      this.formDataIndex = row.index
      this.activeData = JSON.parse(JSON.stringify(row));
    },

    //上传附件
    uploadAttachment(file) {
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.editNeedData.id,
          receiptType: "ms_chg_plan#2",
          accessoryNo: "008",
          file: file.file
        },
        token: "krrjdev123", //
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
        });
    },
    // 下载模板按钮/导出
    exportExcel() {
      var _this = this;
      var params = {
        busicode: "MsChgDownload",
        data: {
          receiptType: 2,
          id: this.editNeedData.id,
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },

    // 导入按钮
    importExcel(file) {
      let _this = this;
      let params = {
        busicode: "MsChgImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.batchSave(res)

      })
    },
    batchSave(res) {
      let saveValLast = []
      res.forEach(itemVal => {
        // 入参数据处理
        let saveData = {};
        saveData.receiptId = this.editNeedData.id;
        saveData.replaceDate = itemVal.replaceDate;
        saveData.oldMeterNum = itemVal.oldMeterNum;
        saveData.oldMeterNo = itemVal.oldMeterNo;
        saveData.newMeterNum = itemVal.newMeterNum;
        saveData.newMeterNo = itemVal.newMeterNo;
        saveData.margin = itemVal.margin;//余量
        saveData.oldHandleWay = itemVal.oldHandleWay;
        saveData.comments = itemVal.comments;
        saveData.userNo = itemVal.userNo;
        // 换表员value
        saveData.replaceStaff = itemVal.replaceStaff;
        // 换表员name
        this.replaceStaffData.forEach(item => {
          if (itemVal.replaceStaff == item.userAccount) {
            saveData.replaceStaffName = item.userName;
          }
        });
        saveValLast.push(saveData)
      });
      let params = {
        busicode: "MsChgBackfill",
        data: saveValLast
      };
      this.$api.fetch({ params })
        .then(res => {
          this.getTableData()
          this.formData.backfillAmount = res
          this.$message({
            message: "保存成功",
            type: "success"
          });

        });
    },
    // 查看附件 弹出框取消按钮
    closeDialogViewAtt() {
      this.ViewAttachmentVisible = false;
    },
    // 查看附件弹框
    getViewAttachment(index, row) {
      this.ViewAttachmentVisible = true
      this.viewAttaParams = {
        receiptType: "ms_chg_plan#2",
        receiptId: this.editNeedData.id
      };
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.pageCount - 20) * this.tableQuery.page + (index + 1)
      );
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.getTableData();
    },
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.TableDismantlingHandle {
  height: 100%;
  overflow-y: auto;
  .formBill-One {
    line-height: 30px;
  }
  .backfillContent {
    // height: 460px;
    .submitEditLeft {
      width: 27%;
      display: inline-block;
      // float: left;
      border-right: 1.5px solid #eaf4ff;
      // height: 100%;
      .submit_edit_left_msg {
        font-size: 12px;
        border-bottom: 1.5px solid #eaf4ff;
        border-left: none;
        padding-top: 10px;
        .msg_content {
          padding-bottom: 19px;
          width: 76%;
          margin: 0 auto;
        }
      }
      .submit_edit_left_content {
        font-size: 14px;
        padding-right: 15px;
        .DataEntry-button {
          padding: 10px 0px;
          text-align: center;
          .upload-file {
            display: inline-block;
          }
        }
      }
    }
    .submitEditRight {
      float: right;
      width: 72%;
      display: inline-block;
    }
  }

  .submitEditLeftNone {
    display: none;
  }
  .submitEditRightNone {
    width: 100%;
    display: inline-block;
  }
  .backfillContentNone {
    height: auto;
  }
}
</style>

<template>
  <div class="ChangeTablesHandle">

    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info v-if="viewAttachmentShow" :receiptAccessory="receiptAccessory" busicode="ReceiptAccessoryList"></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单选择客户 -->
    <el-dialog title="选择客户" :visible.sync="choosectmVisible" :close-on-click-modal="false" class="button-dialog" @close="closechoosectm">
      <choosectm ref="childWaterEditor"></choosectm>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closechoosectm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单选择账户 -->
    <el-dialog title="选择账户" :visible.sync="chooseAccountVisible" :close-on-click-modal="false" class="button-dialog" @close="closechoosectm">
      <chooseAccount ref="childWaterEditor"></chooseAccount>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closechoosectm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单添加客户 -->
    <el-dialog title="添加客户" append-to-body v-if="addCtm" :visible.sync="addCtm" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <OpenAccountEdit v-if="addCtm" ref="childWarehousing" :wayOpen="wayOpen" :NotDisabled="disabledOpenAccount" :billStuteDetail="billStuteDetail" :idCuster="detailId" @chooseCtm="choosectm" @chooseAccount="chooseAccount"></OpenAccountEdit>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" v-if="!disabledOpenAccount" plain @click="fixDialogSelectWater">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater">取 消</el-button>
      </div>
    </el-dialog>
    <el-form :model="formData" ref="billForm" class="formBill" :rules="rules" :inline="true" :disabled="!NoDisabled" size="mini" label-width="130px">

      <billInfo v-if="billStute=='OpenAccUpdate'" ref="billInfo" :editType="0"></billInfo>

      <div :class="{ submitEditRight:isActive , submitEditRightNone:!isActive}">
        <div class="kl-table">

          <el-button size="mini" v-if="NoDisabled" type="primary" @click="addRow()" class="select-btn">添加</el-button>

          <el-table stripe highlight-current-row border :data="tableData.list" :row-class-name="rowClassName" ref="klTableData" @row-click="rowClick">
            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>
            <el-table-column prop="ctmNo" min-width="100" label="客户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="accountNo" min-width="100" label="账户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="bookNo" min-width="100" label="册本号" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="businessAreaName" min-width="150" label="营业区域"></el-table-column>
            <el-table-column prop="setupMeterAddr" min-width="120" label="装表地址"></el-table-column>
            <el-table-column prop="setupMeterDate" min-width="120" label="装表日期"></el-table-column>
            <el-table-column v-if="billStute == 'OpenAccUpdate'" prop="useWaterTypeName" min-width="150" label="用水类型"></el-table-column>
            <el-table-column v-if="billStute == 'OpenAccUpdate'" prop="imei" min-width="60" label="IMEI"></el-table-column>
            <el-table-column v-if="billStute == 'OpenAccUpdate'" prop="imsi" min-width="60" label="IMSI"></el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">
                <!--el-button type="text" v-if="NoDisabled" @click="deleteRow(scope.$index,scope.row)">删除</el-button-->
                <span style="color: #409eff; cursor: pointer;" @click="detail(scope.$index,scope.row)">详情</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="block" v-if="billStute=='OpenAccUpdate'">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
      </div>

      <!--legend class="legendColumn">上传附件
        <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
      </legend>
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile-->
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>

</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import OpenAccountEdit from './OpenAccountEdit'
import uploadFile from "@/components/uploadPic"; //上传附件
import choosectm from "@/components/ctmInfor"
import chooseAccount from "@/components/accountInfo"
export default {
  name: "OpenAccountList",
  components: {
    billInfo,
    OpenAccountEdit,
    choosectm,
    chooseAccount,
    uploadFile,
  },
  props: ["billStute", "idCuster"],
  data () {
    return {
      disabledOpenAccount: false,
      billStuteDetail: "",
      NoDisabled: true,
      uploadFileShow: true,
      busicode: "",
      uploadIcon: "el-icon-minus",
      receiptType: "USER_OPEN",
      tempId: "",
      chooseAccountVisible: false,
      choosectmVisible: false,
      //添加客户
      addCtm: false,
      //选择水表 弹框类型
      formType: 'OpenAccountList',
      editData: null,
      //打开功能下
      addWay: "addAccount",
      wayOpen: "OpenAccount",
      //选择水表 选择数据获取类型
      waterChooseType: '',
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //是否可显示回填表单
      isActive: true,
      formDataIndex: 0,//修改表单索引号
      // 数据字典
      dictionaryData: {},
      tableQuery: {
        id: this.idCuster,
        page: 1,
        pageCount: 20
      },
      // 列表数据
      tableData: {
        list: []
      },
      // 换表信息
      formData: {
        userOpenInfo: {}
      },
      // 换表员下拉数据
      replaceStaffData: [],
      // 列表中已回填数据（点击了保存）的新表编号
      savedCheck: [],
      detailId: "",
      tableShow: false,
      maxHeight: 0,
      rules: {
        replaceType: [
          { required: true, message: '请选择换表类型', trigger: 'change' }
        ],
        planFinishDate: [
          { required: true, message: '请选择计划完成日期', trigger: 'blur' }
        ],
        replaceStaff: [
          { required: true, message: '请选择换表员', trigger: 'change' }
        ],
        replaceReason: [
          { required: true, message: '请输入换表原因', trigger: 'blur' }
        ],
      },
      rules1: {},
      addFlag: -1,
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
      attachmentData: [],
    };
  },
  mounted () {
    if (this.idCuster) {
      this.init();
      eventBus.$emit('receiptId', this.idCuster)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.tempId = tempId
      this.getHtmlData();
    }

  },
  methods: {
    init () {
      var _this = this;
      _this.tableQuery.id = _this.idCuster
      var params = {
        busicode: "OpenUserDetailList",
        data: _this.tableQuery // （旧表处理方式）
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
          if (res.list.length > 0) {


            this.getBillData(res.list[0].userOpenMessage);
            this.formData.userOpenInfo = res.list[0].userOpenMessage
            this.getHtmlData();
            console.log(this.formData.userOpenInfo.processState)
            if (this.formData.userOpenInfo.processState == "" || this.formData.userOpenInfo.processState == 'register') {
              //修改动态表单可编辑判断-节点驳回：登记以及 草稿状态可编辑
              this.disabledOpenAccount = false
            } else {
              this.approveFlag = 1
              this.NoDisabled = false
              this.disabledOpenAccount = true
            }
          }

        });
    },
    addList (list) {
      this.tableData.list = this.tableData.list.concat(list)
    },
    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      if (this.billStute == 'OpenAccUpdate') {
        this.$refs.billInfo.init(this.billData);
      }

    },
    submit () {

    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "USER_OPEN",
        "审批流配置:" +
        _this.formData.userOpenInfo.processName +
        "(" +
        _this.formData.userOpenInfo.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.userOpenInfo.id, // 任务id
        _this.formData.userOpenInfo.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        (res) => {
          if (window.location.href.indexOf('WaterSideIndex') > -1 || window.location.href.indexOf('HallBusiness') > -1) {// 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog()
          } else {// 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        "OpenUserAddBill"
      );
    },
    addRow () {
      this.detailId = ""
      this.busicode = "OpenUserAdd"
      this.addFlag = -1,
        this.addCtm = true;
    },
    closeDialogSelectWater () {
      this.addCtm = false;
    },
    rowClassName ({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // 查看附件按钮
    viewAttachment (type) {
      this.receiptAccessory = {
        receiptType: "USER_OPEN",
        receiptId: this.idCuster ? this.idCuster : this.tempId
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog () {
      this.viewAttachmentShow = false;
    },
    //上传附件
    uploadAttachment (file) {
      let _this = this;
      // const isJPG = file.file.type === 'image/jpg';
      // const isPNG = file.file.type === 'image/png';
      // if (!isJPG&&!isPNG) {
      //   this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
      //   return
      // }
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.idCuster ? this.idCuster : this.tempId,
          receiptType: "USER_OPEN",
          accessoryNo: "000",
          file: file.file
        },
        //token: "krrjdev123", //
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

          _this.$parent.AttachmentQty = _this.$parent.AttachmentQty + 1
        });
    },

    // 暂存按钮（添加/修改）
    save (type) {
      let _this = this;
      var params = {
        busicode: "OpenUserAddBill",
        data: {
          list: this.getDetailListId(),
          id: this.idCuster,
          tempId: this.tempId    //附件临时ID
        }
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        _this.$message({
          message: "保存成功",
          type: "success"
        });
        this.$parent.closeDialog();
      });

    },
    getDetailListId () {
      let list = []
      this.tableData.list.forEach((item, index) => {
        list.push(item.id);
      })
      return list
    },
    // 返回前判断是否有数据尚未回填，提醒用户
    closeDialog () {

    },
    // 点击列表的某一行
    rowClick (row, column, event, $index) {

    },
    closechoosectm () {
      this.choosectmVisible = false;
      this.chooseAccountVisible = false;
    },
    choosectm () {
      this.choosectmVisible = true;
    },
    chooseAccount () {
      this.chooseAccountVisible = true;
    },
    indexMethod (index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    getFormbData () {
      let data = {
        list: this.getDetailListId(),
        id: this.idCuster,
        tempId: this.tempId    //附件临时ID
      }
      return data
    },
    fixDialogSelectWater () {
      let _this = this;
      let validateMsg = this.$refs.childWarehousing.validateFrom();
      validateMsg.then(
        function (data) {
          let ctmData = JSON.parse(JSON.stringify(_this.$refs.childWarehousing.getFormbData()));
          let params = {
            busicode: _this.busicode,
            data: ctmData
          };
          //   console.log('addCtm', params);
          //   return;
          _this.$api.fetch({ params }).then(res => {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
            // this.$refs.childWarehousing.$refs.priceInfo.userMixtureSave(res.id);
            // this.$refs.childWarehousing.$refs.priceInfo.userDiscountSave(res.id);
            _this.$refs.childWarehousing.$refs.priceInfo.wPopulationSubmit(res.id)

            let rowData = _this.getRowData(res);

            if (_this.busicode === "OpenUserAdd") {
              _this.tableData.list.push(rowData)
            } else {
              // _this.tableData[_this.addFlag]=rowData
              _this.tableData.list.splice(_this.addFlag, 1, rowData)
            }
            //_this.init();
            _this.closeDialogSelectWater();
          });
        },
        function (reason) {
          _this.$message({
            type: 'error',
            message: reason
          });
        })


    },
    //将详情变成列表行数据
    getRowData (res) {
      let val = {
        id: res.id,
        ctmNo: res.ctmNo,
        accountNo: res.accountNo,
        userNo: res.userNo,
        ctmName: res.ctmName,
        bookNo: res.bookNo,
        businessAreaName: res.businessAreaName,
        setupMeterAddr: res.setupMeterAddr,
        setupMeterDate: res.setupMeterDate,
      }
      return val
    },
    detail (index, row) {
      let _this = this
      _this.busicode = "OpenAccUpdate"
      _this.addFlag = index;
      _this.billStuteDetail = this.formData.userOpenInfo.processState == undefined ? "" : this.formData.userOpenInfo.processState;
      _this.detailId = row.id
      _this.addCtm = true;
      // if(this.formData.userOpenInfo.processState === 'END' || this.formData.userOpenInfo.processState === 'approvle') {
      //   this.disabledOpenAccount = false
      // } else {
      //   this.disabledOpenAccount = true
      // }
    },
    // 删除行
    deleteRow (index, row) {
      if (this.tableData.list.length > 1) {
        this.$confirm('是否确认删除该行?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            busicode: "OpenUserDetailDelete",
            data: { id: row.id }
          };
          this.$api.fetch({ params }).then(res => {
            this.tableData.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }

    },
    deleteDetail (row) {

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
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChangeTablesHandle {
  height: 100%;
  overflow-y: auto;

  .select-btn {
    float: right;
    margin-bottom: 0.2rem;
  }
  .backfillContent {
    height: 610px;
    .submitEditLeft {
      width: 27%;
      display: inline-block;
      float: left;
      border-right: 1.5px solid #eaf4ff;
      height: 100%;
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

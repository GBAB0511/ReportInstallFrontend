
<template>
  <div class="QualityReadingEdit">
    <!--el-dialog class="button-dialog" title="选择水表" v-if="selectDialogVisible" :visible.sync="selectDialogVisible" width="80%" close-on-click-modal :before-close="handleClose">
      <SelectWaterTable :formType='"QualityReadingEdit"' ref="SelectWaterTable"></SelectWaterTable>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="getSelecMeterData">确 定</el-button>
        <el-button size="mini" @click="selectDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog-->
    <!--原抽查水表-->
    <el-dialog class="button-dialog" title="选择水表" v-if="checkDialogVisible" :visible.sync="checkDialogVisible" width="80%" close-on-click-modal :before-close="handleClose">
      <checkWaterTable  ref="checkDialogVisible"></checkWaterTable>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="getCheckMeterData">确 定</el-button>
        <el-button size="mini" @click="checkDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-form class="formBill" :inline="true" size="mini" :model="formData" :rules="rules" label-width="130px">

      <!-- 单据信息 -->
      <billInfo v-if="formType.type!='MrQualityAdd'" ref="billInfo" ></billInfo>

      <legend class="legendColumn">抄表质量检查单</legend>
        <el-form-item label="账期：">
          <el-date-picker v-model="formData.accountPeriod" 
          size="mini" type="month"  disabled
          unlink-panels format="yyyy-MM" value-format="yyyyMM"  placeholder="选择账期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抽查人员：" prop="qualityCheckStaff">
          <!--el-input :disabled="formType.type!='MrQualityAdd' && formType.type!='MrQualityUpdate'" v-model="formData.qualityCheckStaff" autocomplete="off" placeholder="请输入抽查人员"></el-input-->
          <el-select :disabled="formType.type!='MrQualityAdd' && formType.type!='MrQualityUpdate'" autocomplete="off" v-model="formData.qualityCheckStaff" size="mini" placeholder="抽查人员">
            <el-option v-for="item in MrQualityList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="Remarks" label="备注：">
          <el-input :disabled="formType.type!='MrQualityAdd' && formType.type!='MrQualityUpdate'" v-model="formData.comments" autocomplete="off" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
        <div class="kl-table">
          <el-button highlight-current-row @click="checkWaterTableShow" v-if="formType.type=='MrQualityAdd' || formType.type=='MrQualityUpdate'" type="primary" size='mini' class="select-btn" style="margin-left:5px">选择水表</el-button>
          <!--<el-button @click="checkWaterTableShow" v-if="formType.type=='MrQualityAdd' || formType.type=='MrQualityUpdate'" type="primary" size='mini' class="select-btn" style="margin-left:5px">抽查条件选择</el-button>
          <el-button @click="selectWaterTableShow" v-if="formType.type=='MrQualityAdd' || formType.type=='MrQualityUpdate'" type="primary" size='mini' class="select-btn">选择水表</el-button>-->
          
          <el-table stripe border :data="tableList" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>
            <el-table-column prop="bookNo" min-width="100" label="册本号">
            </el-table-column>

            <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="ctmAddr" min-width="100" label="客户地址" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期">
            </el-table-column>

            <el-table-column prop="priorPeriodNum" min-width="100" label="上期抄码">
            </el-table-column>

            <el-table-column prop="currendPeriodNum" min-width="100" label="本期抄码">
            </el-table-column>

            <el-table-column prop="currendPeriodWater" min-width="100" label="本期水量">
            </el-table-column>

            <el-table-column prop="avgWater" min-width="100" label="日均水量">
            </el-table-column>

            <el-table-column v-if="formType.type!='MrQualityAdd' || formType.type!='MrQualityUpdate'" prop="preNum" min-width="80" label="预估抄码">
            </el-table-column>

            <el-table-column v-if="formType.type!='MrQualityAdd' || formType.type!='MrQualityUpdate'" prop="currendPeriodCheckNum" min-width="80" label="本次抄码">
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                  :disabled="formType.type!='MrQualityBack'"
                  v-model="scope.row.currendPeriodCheckNum"
                  placeholder="本次抄码">
                </el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="formType.type!='MrQualityAdd' || formType.type!='MrQualityUpdate'" prop="checkResult" min-width="80" label="检查结果">
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                  :disabled="formType.type!='MrQualityBack'"
                  v-model="scope.row.checkResult"
                  placeholder="检查结果">
                </el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="formType.type!='MrQualityAdd' || formType.type!='MrQualityUpdate'" prop="comments" min-width="100" label="备注">
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                  :disabled="formType.type!='MrQualityBack'"
                  v-model="scope.row.comments"
                  placeholder="备注">
                </el-input>
              </template>
            </el-table-column>

          <el-table-column label="操作" width="70" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click.native="deleteRow(scope.$index, scope.row)" v-if="formType.type=='MrQualityAdd' || formType.type=='MrQualityUpdate'" style="font-size:12px;">删除</el-button>
            </template>
          </el-table-column>

          </el-table>
        </div>
        <legend class="legendColumn">上传附件
          <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
        </legend>
        <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
        <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import procedure from "@/components/procedure"; //审批
import SelectWaterTable from "@/components/SelectWaterTable"; 
import checkWaterTable from "./CheckWaterTable"; 
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "QualityReadingEdit",
  props: ["formType"],
  components: {
    uploadFile,
    procedure,
    billInfo,
    commonPart,
    SelectWaterTable,
    checkWaterTable
  },
  data() {
    return {
      MrQualityList:[],
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "MR_QUALITY_CHECK",
      tableList: [],
      formData: {
        id: "",
        accountPeriod: this.common.date('month'),
        comments: "",
        qualityCheckStaff: "",
        meterReadingIds:[],
        processState: "",
      },
      selectDialogVisible: false,
      checkDialogVisible: false,
      multipleSelection: [],
      billNo: "",
      billDate: "",
      processInstanceId: "",
      processName: "",
      approveFlag: 0,
      rules: {
        qualityCheckStaff: [
          { required: true, message: '抽查人员不能为空', trigger: 'change' }
        ]
      }
    };
  },
  mounted() {
    if (this.formType.type == 'MrQualityApprove') {
      this.approveFlag = 1
    }
    if (this.formType.type != 'MrQualityAdd') {
      this.init()
      
      eventBus.$emit('receiptId', this.formType.id)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId= tempId
      this.getHtmlData()
    }
    this.getQualityStaffList();
  },
  methods: {
    init() {
      let params = {
        "busicode": "MrQualityQuery",
        "data": {
          id:this.formType.id,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.formData.id = res.bill.id
        this.formData.accountPeriod = res.bill.accountPeriod.toString()
        this.formData.comments = res.bill.comments
        this.formData.qualityCheckStaff = res.bill.qualityCheckStaff
        this.formData.processState = res.bill.processState
        this.processInstanceId = res.bill.processInstanceId
        this.processName = res.bill.processName
        this.tableList = res.queryDetail;
        this.getBillData(res);
        this.getHtmlData()        
      })
    },
    getFormbData(){
      let arr = []
      this.tableList.forEach(function(element){ arr.push(element.meterReadingId) });
      this.$set(this.formData,'meterReadingIds',arr)

      let data = {}
      if (this.formType.type == 'MrQualityAdd') {
        delete this.formData.id
      }
      if (this.formType.type != 'MrQualityBack') {
        delete this.formData.processState
        data = { ...this.formData, userNos: this.tableList.map(item => item.userNo) }
      }
      if (this.formType.type == 'MrQualityBack') {
        delete this.formData.meterReadingIds
        data = {
          bill: this.formData,
          queryDetail: this.tableList
        }
      }
      return data
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.bill.billNo, //单据编号
        billDate: res.bill.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 抽查人员数据获取
    getQualityStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "12" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.MrQualityList = [...res];
        });
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getSelecMeterData() {
      this.tableList = this.$refs.SelectWaterTable.selectData
      this.selectDialogVisible = false;
    },
    selectWaterTableShow() {
      this.selectDialogVisible = true;
    },
    checkWaterTableShow(){
      this.checkDialogVisible = true;
    },
    getCheckMeterData() {
      this.tableList = this.$refs.checkDialogVisible.selectData
      this.checkDialogVisible = false;
    },
    deleteRow(index,row){
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList.splice(index, 1)
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
    // 保存接口
    submit(type) {
      let data = this.getFormbData()
      let params = {
        busicode: this.formType.type,
        data: data
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        });
        this.$parent.closeDialog();
      });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;  
      
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "MR_QUALITY_CHECK",
        "审批流配置:" +
          _this.processName +
          "(" +
          _this.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.processInstanceId, // 流程实例Id，添加时可为空
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
        _this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        _this.formType.type
      );
    },
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.QualityReadingEdit {
  height: calc(100% - 41px);
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  .select-btn {
    float: right;
    margin-bottom: 0.2rem;
  }
}
</style>

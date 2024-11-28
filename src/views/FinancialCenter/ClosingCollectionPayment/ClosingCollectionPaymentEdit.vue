
<template>
  <div class="ClosingCollectionPaymentEdit">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :disabled="NotDisabled"
      label-width="130px"
      ref="formData"
    >
      <!-- 单据信息 -->
      <billInfo v-if="formStute.billStute!='InternetCloseAdd'" ref="billInfo"></billInfo>
      <legend class="legendColumn">代收支付关闭信息</legend>
      <el-form-item label="开始时间：" prop="branchOpsition" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-if="!NotDisabled" v-model="formData.beginDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始日期"></el-date-picker>
        <span v-else>{{formData.beginDate}}</span>
      </el-form-item>
      <el-form-item label="结束时间：" prop="branchAddr" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-if="!NotDisabled" v-model="formData.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束日期"></el-date-picker>
        <span v-else>{{formData.endDate}}</span>
      </el-form-item>
      <br />
      <el-form-item label="备注：" class="Remarks" :class="{'disable-item': NotDisabled}">
        <el-input
          v-if="!NotDisabled"
          v-model="formData.comments"
          type="textarea"
          :rows="3"
          show-word-limit
          maxlength="150"
          placeholder="备注"
          clearable
        ></el-input>
        <span v-else>{{formData.comments}}</span>
      </el-form-item>
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
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //审批
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; //单据信息
export default {
  name: "ClosingCollectionPaymentEdit",
  props: ["formStute"],
  components: {
    uploadFile,
    procedure,
    billInfo,
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_internet_close",
      NotDisabled: false, //是否可编辑
      formData: {
        id: "",
        beginDate: "",
        endDate: "",
        comments: ""
      },
    };
  },
  mounted() {
    if (this.formStute.idFinaEdit) {
      this.init();
       eventBus.$emit('receiptId', this.formStute.idFinaEdit)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId= tempId
      this.getHtmlData();
    }
  },
  methods: {
    init() {
      let params = {
        busicode: "InternetCloseQuery",
        data: {
          id: this.formStute.idFinaEdit
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res;
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END"
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          this.getHtmlData();
          //单据信息
          this.getBillData(res);
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_internet_close",
        "审批流配置:" +
          _this.formData.processName +
          "(" +
          _this.formData.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf('WaterSideIndex') > 0 || window.location.href.indexOf('HallBusiness') > 0) {// 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog()
          } else {// 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.formStute.billStute
      );
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    getFormbData() {
      return this.formData;
    },
    submit() {
      let params = {
        busicode: this.formStute.billStute,
        data: this.getFormbData()
      };
      if(params.data.beginDate>params.data.endDate){
        this.$notify({
          title: "警告",
          message: "开始日期不能大于结束日期",
          type: "warning"
        });
        return;
      }
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success"
        });
        this.$parent.closeDialog();
      });
    }
  }
};
</script>

<style lang="scss">
.ClosingCollectionPaymentEdit {
  width: 100%;
  height: calc(100% - 41px);
  overflow-y: auto;
}
</style>
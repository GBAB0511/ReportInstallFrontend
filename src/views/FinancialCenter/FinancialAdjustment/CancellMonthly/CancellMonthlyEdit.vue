

<template>
  <div class="CancellMonthlyEdit">
    <el-form
      class="formBill"
      :disabled="NotDisabled"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="130px"
      ref="ruleForm"
      :rules="rules"
    >
      <el-form-item
        label="用户编号："
        v-if="formData.processState=='register'||formData.processState==''||editNeedData.busicode=='CancelCurrMonthAdd'"
        class="userNo"
      >
        <el-input
          class="read-only"
          v-model="searchUserNum"
          placeholder="请输入用户编号"
          @keydown.enter.native="initUserNo(searchUserNum)"
          clearable
        >
          <el-button
            slot="append"
            class="searchBtn scanning-btn"
            @click="initUserNo(searchUserNum)"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.busicode!='CancelCurrMonthAdd'" ref="billInfo"></billInfo>

      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo>

      <legend class="legendColumn">取消当月收费信息</legend>

      <el-form-item label="期数：" class="disable-item">
        <el-input
          class="read-only"
          disabled="disabled"
          v-model="formData.accountPeriod"
        ></el-input>
      </el-form-item>

      <el-form-item label="取消金额：" class="disable-item">
        <el-input
          class="read-only"
          disabled="disabled"
          v-model="formData.billMoney"
        ></el-input>
      </el-form-item>

      <el-form-item class="f2" label="备注：" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
        <span v-else>{{formData.comments}}</span>
      </el-form-item>

      <legend class="legendColumn">流程处理</legend>
        <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; //单据信息
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
export default {
  name: "CancellMonthlyEdit",
  props: ["editNeedData"],
  components: {
    uploadFile,
    billInfo,
    userInfo
  },
  data() {
    return {
      formData: {
        id: "",
        userNo: "",
        billId:'',
        accountPeriod: "",
        billMoney: "",
        comments: ""
      },
      NotDisabled: false, //是否可编辑
      approveFlag: 0,
      searchUserNum: "",
      wayOpen: "LiquidatedDamagesEdit",
      rules: {
        userNum: [
          { required: true, trigger: "blur", message: "请输入用户编号" }
        ],
        desc: [{ required: true, trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.editNeedData.saveType != 'add') {
      this.init();
    } else {
      this.getHtmlData();
    }
  },
  methods: {
    init() {
      let params = {
        busicode: "CurrMonthChargeQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res;
          this.initUserNo(res.userNo);
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
        "bill_cancel_curr_month",
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
        this.editNeedData.busicode
      );
    },
    initUserNo(val) {
      //用户编号查询
      if (val == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: val
      };
      let params = {
        busicode: "UserSelect",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (this.editNeedData.busicode == "CancelCurrMonthAdd") {
            this.getTableDate(res.userInfo.userNo);
          }
          this.formData.userNo = res.userInfo.userNo;
          this.useWaterType = res.userInfo.useWaterType;
          this.getFormData(res);
        });
    },
    getTableDate(val) {
      this.$api
        .fetch({
          params: {
            busicode: "CurrMonthChargeQuery",
            data: { userNo: val }
          }
        })
        .then(res => {
          this.formData.accountPeriod = res.accountPeriod;
          this.formData.billId = res.billId;
          this.formData.billMoney = res.billMoney;
        });
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    getUserData(res) {
      // 用户信息
      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        statusName: res.userInfo.statusName, // 用户状态名称
        houseCert: res.userInfo.houseCert, //户口簿号
        comments: res.userInfo.comments, //备注
        fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限

        reformFlag: res.userInfo.reformFlag, //户表改造标记
        contractNo: res.userInfo.contractNo, //合同编号
        contractAddr: res.userInfo.contractAddr, //合同地址
        contractDate: res.userInfo.contractDate, //合同日期
        businessAbodeName: res.userInfo.businessAbodeName, //营业所
        businessAbode: res.userInfo.businessAbode, //营业所
        adminAreaName: res.userInfo.adminAreaName, //行政区域
        adminArea: res.userInfo.adminArea, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        stopWaterLinkMan: res.userInfo.stopWaterLinkMan, // 停水联系人
        stopWaterLinkMobile: res.userInfo.stopWaterLinkMobile //停水联系手机
      };
    },
    getFormData(res, type) {
      this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);
    },
    getFormbData() {
      return this.formData;
    },
    submit() {
      let params = {
        busicode: this.editNeedData.busicode,
        data: this.getFormbData()
      };
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
.CancellMonthlyEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
  .userNo {
    width: 360px;
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
}
</style>

 
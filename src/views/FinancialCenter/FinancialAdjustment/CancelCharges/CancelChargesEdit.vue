<template>
  <div class="CancelChargesEdit">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="100px"
      ref="ruleForm"
      :rules="rules"
    >
      <!-- 单据信息 -->
      <billInfo
        v-if="editNeedData.saveType != 'add'"
        ref="billInfo"
      ></billInfo>

      <legend class="legendColumn">原收费信息</legend>
      <el-form-item label="收费时间：" class="disable-item">
        <span>{{ formData.origChargeTime }}</span>
      </el-form-item>
      <el-form-item label="缴费方式：" class="disable-item">
        <span>{{ formData.payWay }}</span>
      </el-form-item>
      <el-form-item label="缴费渠道：" class="disable-item">
        <span>{{ formData.payChannel }}</span>
      </el-form-item>
      <el-form-item label="收费员：" class="disable-item">
        <span>{{ formData.chargeStaffName }}</span>
      </el-form-item>
      <el-form-item label="批次号：" class="disable-item">
        <span>{{ formData.origChargeSerialNo }}</span>
      </el-form-item>
      <el-form-item label="交易金额：" class="disable-item">
        <span>{{ formData.origChargeMoney }}</span>
      </el-form-item>
      <div>
 <el-form-item
        label="退款方式："
        prop="refundWay"
        :class="{ 'disable-item': NotDisabled }"
        label-width="100px"
      >
        <el-select
          :disabled="!NotDisabled"
          v-model="formData.refundWay"
          class="tipWid"
        >
          <el-option
            v-for="(item, index) in dictionaryData.FCC"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户银行：" prop="bankName" v-show="formData.refundWay === '2'">
        <span v-if="!NotDisabled">{{ formData.bankName }}</span>
        <el-input
          oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
          v-else
          v-model="formData.bankName"
          placeholder=""
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="户名："
        prop="bankAccountName"
        style="width: calc(46% + 10px)"
         v-show="formData.refundWay === '2'"
      >
        <span v-if="!NotDisabled">{{ formData.bankAccountName }}</span>
        <el-input
          oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
          v-else
          v-model="formData.bankAccountName"
          placeholder=""
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item class="f2" label="银行账户："  v-show="formData.refundWay === '2'">
        <span v-if="!NotDisabled">{{ formData.bankAccount }}</span>
        <el-input
          oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
          v-else
          v-model="formData.bankAccount"
          placeholder=""
          clearable
        ></el-input>
      </el-form-item>
     <el-form-item  class="f2" label="备注：" prop="comments">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :disabled="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
      </el-form-item>
      </div>
     
      <div class="kl-table">
        <el-table
          stripe
          border
          :data="formData.list"
          class="change-tables-table"
        >
          <el-table-column
            prop="ctmNo"
            min-width="60"
            label="客户编号"
          ></el-table-column>
          <el-table-column
            prop="accountNo"
            min-width="90"
            label="账户编号"
          ></el-table-column>
          <el-table-column
            prop="userNo"
            min-width="90"
            label="用户编号"
          ></el-table-column>
          <el-table-column
            prop="chargeMoney"
            min-width="80"
            label="金额"
            align="right"
          ></el-table-column>
        </el-table>
      </div>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; //单据信息
export default {
  name: "CancelChargesEdit",
  props: ["editNeedData", "NotDisabled", "detailData"],
  components: {
    billInfo
  },
  data() {
    return {
  
      receiptType: "bill_cancel_charge",
      formData: {
        userNo: "",
        origChargeTime: "",
        origChargeMoney: "",
        origChargeSerialNo: "",
        refundWay: "",
        bankName: "",
        payChannel: "",
        chargeStaffName: "",
        processHandleMan: "",
        processInstanceId: "",
        processName: "",
        comments:"",
        processState: "",
        id: "",
        processStateName: "",
        bankAccountName: "",
        bankAccount: "",
        list: []
      },

      approveFlag: 0,
      rules: {
        refundWay: [
          { required: true, message: "请选择退款方式", trigger: "change" },
        ],
        comments: [{ required: true, message: "备注不能为空", trigger: 'blur' }],
      },

      dictionaryData: {}
    };
  },
  mounted() {
    if (this.editNeedData.saveType != "add") {
      this.init({ id: this.editNeedData.id });
    } else {
      // this.init({
      //   origChargeSerialNo: this.editNeedData.origChargeSerialNo,
      //   userNo: this.editNeedData.userNo
      // });
      if (this.detailData.processState === "" || this.detailData.processState === "register") {
        this.approveFlag = 0;
      } else {
        this.approveFlag = 1;
      }
      this.formData = this.detailData

      this.getHtmlData();
    }

    this.getDictionary();
  },
  methods: {
    init(data) {
      let _this = this;
      let params = {
        busicode: "FnCancelChargeQuery",
        data
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if (res.processState === "" || res.processState === "register") {
            this.approveFlag = 0;
          } else {
            this.approveFlag = 1;
          }

          _this.formData = res;
         if(this.editNeedData.saveType != "add"){
           _this.$refs.billInfo.init({
            billNo: res.billNo,
            billDate: res.billDate
          });
         }
     
          this.getHtmlData();
          // 获取完数据调用
        });
    },



    getFormbData() {
      if (this.formData.id) {
        return {
          id: this.formData.id,
          refundWay: this.formData.refundWay,
          bankName: this.formData.bankName,
          bankAccountName: this.formData.bankAccountName,
          bankAccount: this.formData.bankAccount,
          comments:this.formData.comments
        };
      } else {
        return {
          userNo: this.editNeedData.userNo,
          origChargeTime: this.formData.origChargeTime,
          origChargeMoney: this.formData.origChargeMoney,
          origChargeSerialNo: this.editNeedData.origChargeSerialNo,
          refundWay: this.formData.refundWay,
          bankName: this.formData.bankName,
          bankAccountName: this.formData.bankAccountName,
          bankAccount: this.formData.bankAccount,
          comments:this.formData.comments
        };
      }
    },
    submit() {
      var params = {
        busicode: this.formData.id
          ? "FnCancelChargeUpdate"
          : "FnCancelChargeAdd",
        data: this.getFormbData()
      };
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              if (
                window.location.href.indexOf("HallBusiness") > 0 ||
                window.location.href.indexOf("PendingTrial") > 0 ||
                window.location.href.indexOf("WaterSideIndex") > 0
              ) {
                // 流程中心模块触发
                this.$parent.$parent.closeDialog();
              } else {
                // 普通模块触发
                this.$parent.closeDialog(); // 提交后回调方法
              }
            });
        } else {
          return false;
        }
      });
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "HCT,FCC" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    indexMethod(index) {
      //获取表格序号
      return index + 1;
    },



    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_cancel_charge",
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
        this.formData.id ? "FnCancelChargeUpdate" : "FnCancelChargeAdd"
      );
    }
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.CancelChargesEdit {
  height: 100%;
  overflow-y: auto;
  .el-form .disable-item .el-form-item__content {
    border-bottom: none;
  }
  .redTip {
    color: red;
    font-weight: bolder;
    font-size: 15px;
  }
  .tipWid {
    width: calc(100% - 25px) !important;
  }
  .inlineBox {
    display: inline-block;
    margin-left: 10px;
  }
  .el-form-item__error {
    padding-top: 4px;
    color: #f56c6c !important;
  }
}
</style>

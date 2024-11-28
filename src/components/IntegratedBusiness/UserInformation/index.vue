
<template>
  <div class="UserInformation">
    <div class="botModel">
      <!-- <el-button size="mini" type="primary">锁定</el-button>
      <el-button size="mini" icon="el-icon-edit"  type="primary" @click="dataModification">资料修改</el-button> -->
      <el-button size="mini" type="primary" @click="ctmChange">变动情况</el-button>
      <el-button size="mini" type="primary" @click="payInfo">费用信息</el-button>
      <el-button size="mini" type="primary" @click="meterInfo">抄表信息</el-button>
      <el-button size="mini" type="primary" @click="Predeposit">账户流水</el-button>
     <!-- <el-button size="mini" type="primary">打印合同</el-button>
      <el-button size="mini" type="primary">打印新卡</el-button> -->
      <el-button size="mini" type="primary" @click="AttachmentView">查看附件</el-button>
    </div>

<div class="userInfoIndex">
    <userInfoSearch :formDataUserNo="formDataUserNo"></userInfoSearch>
</div>
    <!--1 变动情况 -->
    <el-dialog
      class="TwoModel"
      :title="ChangeName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="Changeshow"
      @close="closeDialog"
    >
      <ChangesSituation :CustomerChangesEditData='CustomerChangesEditData'></ChangesSituation>
    </el-dialog>

    <!--2 费用信息 -->
    <el-dialog
      class="TwoModel"
      :title="WaterUseName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="WaterUseshow"
      @close="closeDialog"
    >
      <WaterUseOverTheYears :WaterUseOverTheYearsData='CustomerChangesEditData'></WaterUseOverTheYears>
    </el-dialog>

    <!--3 抄表信息 -->
    <el-dialog
      class="TwoModel"
      :title="MeterReadName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="MeterReadshow"
      @close="closeDialog"
    >
      <MeterReadingInfo :MeterReadingInfoData='CustomerChangesEditData'></MeterReadingInfo>
    </el-dialog>

    <!--4 账户流水 -->
    <el-dialog
      class="TwoModel"
      :title="PredepoName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="Predeposhow"
      @close="closeDialog"
    >
      <PredepositDdetailsInfo :PredepositDdetailsInfoData='CustomerChangesEditData'></PredepositDdetailsInfo>
    </el-dialog>

    <!--5 查看附件 -->
    <el-dialog
      class="TwoModel"
      :title="AttachmName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="Attachmshow"
      @close="closeDialog"
    >
      <AttachmentViewInfo :receiptAccessory='CustomerChangesEditData'></AttachmentViewInfo>
    </el-dialog>

    <!--6 资料修改 -->
    <el-dialog
      class="TwoModel"
      :title="DataChangeNamw"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="DataChangeshow"
      @close="closeDialog"
    >
      <DataChangeVisible></DataChangeVisible>
    </el-dialog>
  </div>
</template>
<script>
import ChangesSituation from "@/components/IntegratedBusiness/UserInformation/CustomerChanges"; //变动情况
import WaterUseOverTheYears from "@/components/IntegratedBusiness/UserInformation/WaterUseOverTheYears"; //费用信息
import MeterReadingInfo from "@/components/IntegratedBusiness/UserInformation/MeterReadingInfo"; //抄表信息
import PredepositDdetailsInfo from "@/components/IntegratedBusiness/UserInformation/PredepositDdetailsInfo"; //账户流水
import AttachmentViewInfo from "@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo"; //查看附件
import DataChangeVisible from "@/views/CustomerCenter/DataChange/DataChangeAdd"; //资料修改

import userInfoSearch from "@/views/CustomerCenter/userInfo/userInfoEdit"; //用户资料

export default {
  name: "UserInformation",
  props: ["formDataUserNo","formDataAccountNo"],
  components: {
    ChangesSituation,
    WaterUseOverTheYears,
    MeterReadingInfo,
    PredepositDdetailsInfo,
    AttachmentViewInfo,
    DataChangeVisible,
    userInfoSearch
  },
  data() {
    return {
      Changeshow: false,
      WaterUseshow: false,
      MeterReadshow: false,
      Predeposhow: false,
      Attachmshow: false,
      DataChangeshow: false,
      ChangeName: "变动情况",
      WaterUseName: "费用信息",
      MeterReadName: "抄表信息",
      PredepoName: "账户流水",
      AttachmName: "查看附件",
      DataChangeNamw: "资料修改",

      // 变动情况所需数据
      CustomerChangesEditData: {
        userNo: '',
        accountNo:''
      }
    };
  },
  mounted() {
    this.CustomerChangesEditData.userNo = this.formDataUserNo
    this.CustomerChangesEditData.accountNo = this.formDataAccountNo
     this.common.changeTable(this, ".UserInformation", [
        ".UserInformation .botModel",
    ]);
  },
  methods: {
    closeDialog() {
      this.Changeshow = false;
      this.WaterUseshow = false;
      this.MeterReadshow = false;
      this.Predeposhow = false;
      this.Attachmshow = false;
      this.DataChangeshow = false;
    },
    // 变动情况
    ctmChange() {
      this.Changeshow = true;
    },
    // 费用信息
    payInfo() {
      this.WaterUseshow = true;
    },
    // 抄表信息
    meterInfo() {
      this.MeterReadshow = true;
    },
    // 账户流水
    Predeposit() {
      this.Predeposhow = true;
    },
    // 查看附件
    AttachmentView() {
      this.Attachmshow = true;
    },
    // 资料修改
    dataModification() {
      this.DataChangeshow = true;
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.UserInformation {
  height: 100%;
  width: 100%;
  .botModel {
    height: 35px;
    display: inline-block;
    // margin-left: 601px;
    margin-top: 7px;
  }
   .userInfoIndex {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>

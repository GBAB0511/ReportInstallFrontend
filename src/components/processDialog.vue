<template>
    <el-dialog class="common-dialog" :title="approvalPageName" :close-on-click-modal="false" :visible.sync="approvalPageVisible" append-to-body @close="closeDialog">
      <ClosingCollectionPaytmentEdit v-if="childPageShowData.ClosingCollectionPaytmentEditShow" :formStute="editNeedData"></ClosingCollectionPaytmentEdit>
      <!-- 收费管理-财务调整-应收追加 -->
      <FinancialAdjustmentEdit v-if="childPageShowData.FinancialAdjustmentEditShow" :editNeedData="editNeedData"></FinancialAdjustmentEdit>
      <!-- 收费管理-财务调整-其他收费 -->
      <OtherChargesEdit v-if="childPageShowData.OtherChargesEditShow" :editNeedData="editNeedData"></OtherChargesEdit>
      <!-- 收费管理-财务调整-举报罚款 -->
      <RecoverEdit v-if="childPageShowData.RecoverEditShow" :editNeedData="editNeedData"></RecoverEdit>
      <!-- 收费管理-财务调整-违约金减免 -->
      <LiquidatedDamagesEdit v-if="childPageShowData.LiquidatedDamagesEditShow" :editNeedData="editNeedData"></LiquidatedDamagesEdit>
      <!-- 收费管理-财务调整-呆账处理 -->
      <DealingBadDebtsEdit v-if="childPageShowData.DealingBadDebtsEditShow" :editNeedData="editNeedData"></DealingBadDebtsEdit>
      <!-- 收费管理-财务调整-坏账报损 -->
      <ReportingBadDebtsEdit v-if="childPageShowData.ReportingBadDebtsEditShow" :editNeedData="editNeedData"></ReportingBadDebtsEdit>
      <!-- 收费管理-财务调整-实收减免 -->
      <RedFlushingEdit v-if="childPageShowData.RedFlushingEditShow" :editNeedData="editNeedData"></RedFlushingEdit>
      <!-- 收费管理-财务调整-水量红冲 -->
      <waterFlushingEdit v-if="childPageShowData.waterFlushingEditShow" :editNeedData="editNeedData"></waterFlushingEdit>
      <!-- 收费管理-财务调整-红冲调整 -->
      <redFlushEdit v-if="childPageShowData.redFlushEditShow" :editNeedData="editNeedData"></redFlushEdit>
      <!-- 收费管理-财务调整-取消当月收费 -->
      <CancellMonthlyEdit v-if="childPageShowData.CancellMonthlyEditShow" :editNeedData="editNeedData"></CancellMonthlyEdit>
      <!-- 收费管理-余额管理-余额取出 -->
      <BalanceWithdrawalEdit v-if="childPageShowData.BalanceWithdrawalEditShow" :editNeedData="editNeedData"></BalanceWithdrawalEdit>
      <!-- 收费管理-余额管理-余额过户 -->
      <BalanceTransferEdit v-if="childPageShowData.BalanceTransferEditShow" :editNeedData="editNeedData"></BalanceTransferEdit>
      <!-- 表计管理-换表 -->
      <ChangeTablesHandle v-if="childPageShowData.ChangeTableEditShow" :editNeedData="editNeedData"></ChangeTablesHandle>
      <!-- 表计管理-复表 -->
      <DuplicateTableEdit v-if="childPageShowData.DuplicateTableEditShow" :editNeedData="editNeedData"></DuplicateTableEdit>
      <!-- 表计管理-用户复核 -->
      <ComparisonTableHandle v-if="childPageShowData.ComparisonTableHandleShow" :editNeedData="editNeedData"></ComparisonTableHandle>
      <!-- 表计管理-维检 -->
      <DimensionalInspectionHandle v-if="childPageShowData.DimensionalInspectionHandleShow" :editNeedData="editNeedData"></DimensionalInspectionHandle>
      <!-- 表计管理-水表注册 -->
      <WareHousingEdit v-if="childPageShowData.WareHousingEditShow" :editNeedData="editNeedData"></WareHousingEdit>
      <!-- 表计管理-拆表审批 -->
      <TableDismantlingHandle v-if="childPageShowData.TableDismantlingHandleShow" :editNeedData="editNeedData"></TableDismantlingHandle>
      <!-- 表计管理-水表变更单据 -->
      <wMeterEditAdd v-if="childPageShowData.wMeterEditAddShow" :editNeedData="editNeedData"></wMeterEditAdd>
      <!-- 工程管理-用户工程-用水咨询 -->
      <waterQueryHandle v-if="childPageShowData.waterQueryHandleShow" :editNeedData="editNeedData"></waterQueryHandle>
      <!-- 工程管理-用户工程-用水安装 -->
      <waterMeterHandleInfo v-if="childPageShowData.waterMeterHandleInfoShow" :editNeedData="editNeedData"></waterMeterHandleInfo>
      <!-- 工程管理-内部工程 -->
      <insideHandleInfo v-if="childPageShowData.insideHandleInfoShow" :editNeedData="editNeedData"></insideHandleInfo>
      <!-- 工程管理-工程审批 -->
      <engineer-approval-edit v-if="childPageShowData.engineerApprovalShow" :id="editNeedData.id" />
      <!-- 工程管理-工程延期 -->
      <engineer-delay-edit v-if="childPageShowData.engineerDelayShow" :delayData="{delayId: editNeedData.id}" />
      <!-- 工程管理-工程终止 -->
      <engineer-termination-edit v-if="childPageShowData.engineerTerminationShow" :terminationData="{terminationId: editNeedData.id}" />
      <!-- 客户管理-变更 -->
      <CustomerChangeEdit v-if="childPageShowData.customerChangeEditShow" :idCuster="editNeedData"></CustomerChangeEdit>
      <!-- 客户管理-销户 -->
      <SalesAccountEdit v-if="childPageShowData.SalesAccountEditShow" :idCuster="editNeedData" :billStute="'CloseUserUpdate'"></SalesAccountEdit>
      <!-- 客户管理-复用 -->
      <multiplexingEdit v-if="childPageShowData.multiplexingEditShow" :idCuster="editNeedData" :billStute="'ReuseUserUpdate'"></multiplexingEdit>
      <!-- 客户管理-停用 -->
      <DisuseProcedureEdit v-if="childPageShowData.DisuseProcedureEditShow" :idCuster="editNeedData" :billStute="'StopUserUpdate'"></DisuseProcedureEdit>
      <!-- 客户管理-过户 -->
      <TransferEdit v-if="childPageShowData.TransferEditShow" :idCuster="editNeedData" :billStute="'TransferUserUpdate'"></TransferEdit>
      <!-- 客户管理-开户 -->
      <OpenAccountList v-if="childPageShowData.OpenAccountEditShow" :idCuster="editNeedData.id" :billStute="'OpenAccUpdate'"></OpenAccountList>
      <!-- 抄表开账-抄表抽查 -->
      <QualityReadingEdit v-if="childPageShowData.QualityReadingEditShow" :formType="editNeedData"></QualityReadingEdit>
      <!-- 抄表开账-抄表修改 -->
      <PrivilegeModificationEdit v-if="childPageShowData.PrivilegeModificationEditShow" :formType="editNeedData"></PrivilegeModificationEdit>
  </el-dialog>
</template>

<script>
// 收费管理-代收关闭支付
import ClosingCollectionPaytmentEdit from '@/views/FinancialCenter/ClosingCollectionPayment/ClosingCollectionPaymentEdit'
// 收费管理-财务调整-应收追加
import FinancialAdjustmentEdit from "@/views/FinancialCenter/FinancialAdjustment/FinancialAdjustment/FinancialAdjustmentEdit.vue"
// 收费管理-财务调整-其他收费
import OtherChargesEdit from '@/views/FinancialCenter/FinancialAdjustment/OtherCharges/OtherChargesEdit.vue'
// 收费管理-财务调整-举报罚款
import RecoverEdit from '@/views/FinancialCenter/FinancialAdjustment/Recover/RecoverEdit.vue'
// 收费管理-财务调整-违约金减免
import LiquidatedDamagesEdit from '@/views/FinancialCenter/FinancialAdjustment/LiquidatedDamages/LiquidatedDamagesEdit.vue'
// 收费管理-财务调整-呆账处理
import DealingBadDebtsEdit from '@/views/FinancialCenter/FinancialAdjustment/DealingBadDebts/DealingBadDebtsEdit.vue'
// 收费管理-财务调整-坏账报损
import ReportingBadDebtsEdit from '@/views/FinancialCenter/FinancialAdjustment/ReportingBadDebts/ReportingBadDebtsEdit.vue'
// 收费管理-财务调整-实收减免
import RedFlushingEdit from '@/views/FinancialCenter/FinancialAdjustment/RedFlushing/RedFlushingEdit.vue'
// 收费管理-财务调整-水量红冲
import waterFlushingEdit from '@/views/FinancialCenter/FinancialAdjustment/waterFlushing/waterFlushingEdit.vue'
// 收费管理-财务调整-红冲调整
import redFlushEdit from '@/views/FinancialCenter/FinancialAdjustment/redFlushAdjust/redFlushEdit.vue'
// 收费管理-财务调整-取消当月收费
import CancellMonthlyEdit from '@/views/FinancialCenter/FinancialAdjustment/CancellMonthly/CancellMonthlyEdit.vue'
// 收费管理-余额管理-余额取出
import BalanceWithdrawalEdit from '@/views/FinancialCenter/CounterCharges/BalanceWithdrawalEdit.vue'
// 收费管理-余额管理-余额过户
import BalanceTransferEdit from '@/views/FinancialCenter/CounterCharges/BalanceTransferEdit.vue'
// 表计管理-换表
import ChangeTablesHandle from '@/views/WatchCenter/ChangeTables/ChangeTablesHandle.vue'
// 表计管理-复表
import DuplicateTableEdit from '@/views/WatchCenter/DuplicateTable/DuplicateTableEdit'
// 表计管理-用户复核
import ComparisonTableHandle from '@/views/WatchCenter/ComparisonTable/ComparisonTableHandle'
// 表计管理-维检
import DimensionalInspectionHandle from '@/views/WatchCenter/DimensionalInspection/DimensionalInspectionHandle'
// 表计管理-水表注册
import WareHousingEdit from '@/views/WatchCenter/Warehousing/WarehousingEditNotStruct'
// 表计管理-拆表审核
import TableDismantlingHandle from '@/views/WatchCenter/TableDismantling/TableDismantlingHandle'
// 表计管理-水表变更单据
import wMeterEditAdd from '@/views/WatchCenter/wMeterEdit/wMeterEditAdd'
// 工程管理-用户工程-用水咨询
import waterQueryHandle from '@/views/EngineeringCenter/waterQuery/waterQueryHandle'
// 工程管理-用户工程-用水安装
import waterMeterHandleInfo from '@/views/EngineeringCenter/waterMeterInstall/waterMeterHandleInfo'
// 工程管理-内部工程
import insideHandleInfo from '@/views/EngineeringCenter/insideEnging/insideHandleInfo'
// 客户管理-变更
import CustomerChangeEdit from '@/views/CustomerCenter/changeMangement/CustomerChangeEdit'
// 客户管理-销户
import SalesAccountEdit from '@/views/CustomerCenter/SalesAccount/SalesAccountEdit'
// 客户管理-复用
import multiplexingEdit from '@/views/CustomerCenter/multiplexing/multiplexingEdit'
// 客户管理-停用
import DisuseProcedureEdit from '@/views/CustomerCenter/DiscontinueUse/DisuseProcedureEdit'
// 客户管理-过户
import TransferEdit from '@/views/CustomerCenter/Transfer/TransferEdit'
// 客户管理-开户
import OpenAccountList from '@/views/CustomerCenter/OpenAccount/OpenAccountList'
// 抄表开账-抄表抽查
import QualityReadingEdit from '@/views/MeterReadingCenter/QualityReading/QualityReadingEdit'
// 抄表开账-抄表修改
import PrivilegeModificationEdit from '@/views/MeterReadingCenter/PrivilegeModification/SingleUserEdit'
// 工程管理-工程审批
import EngineerApprovalEdit from '@/views/EngineeringCenter/engineerApproval/engineerApprovalEdit.vue'
// 工程管理-工程延期
import EngineerDelayEdit from '@/views/EngineeringCenter/engineerDelay/engineerDelayEdit.vue'
// 工程管理-工程终止
import EngineerTerminationEdit from '@/views/EngineeringCenter/engineerTermination/engineerTerminationEdit.vue'
export default {
    name: 'processDialog',
    // props: ['editNeedData'],
    components: {
        ClosingCollectionPaytmentEdit,
        FinancialAdjustmentEdit,
        OtherChargesEdit,
        RecoverEdit,
        LiquidatedDamagesEdit,
        DealingBadDebtsEdit,
        ReportingBadDebtsEdit,
        RedFlushingEdit,
        waterFlushingEdit,
        redFlushEdit,
        CancellMonthlyEdit,
        BalanceWithdrawalEdit,
        BalanceTransferEdit,
        ChangeTablesHandle,
        DuplicateTableEdit,
        ComparisonTableHandle,
        DimensionalInspectionHandle,
        WareHousingEdit,
        TableDismantlingHandle,
        wMeterEditAdd,
        waterQueryHandle,
        waterMeterHandleInfo,
        insideHandleInfo,
        CustomerChangeEdit,
        SalesAccountEdit,
        multiplexingEdit,
        DisuseProcedureEdit,
        TransferEdit,
        OpenAccountList,
        QualityReadingEdit,
        PrivilegeModificationEdit,
        EngineerApprovalEdit,
        EngineerDelayEdit,
        EngineerTerminationEdit
  },
  data() {
    return {
        // 控制某一审批页面的显示与隐藏
        childPageShowData: {
            // 收费管理-代收关闭支付
            ClosingCollectionPaytmentEditShow: false,
            // 收费管理-财务调整-应收追加
            FinancialAdjustmentEditShow: false,
            // 收费管理-财务调整-其他收费
            OtherChargesEditShow: false,
            // 收费管理-财务调整-举报罚款
            RecoverEditShow: false,
            // 收费管理-财务调整-违约金减免
            LiquidatedDamagesEditShow: false,
            // 收费管理-财务调整-呆账处理
            DealingBadDebtsEditShow: false,
            // 收费管理-财务调整-坏账报损
            ReportingBadDebtsEditShow: false,
            // 收费管理-财务调整-实收减免
            RedFlushingEditShow: false,
            // 收费管理-财务调整-水量红冲
            waterFlushingEditShow: false,
            redFlushEditShow:false,
            // 收费管理-财务调整-取消当月收费
            CancellMonthlyEditShow: false,
            // 收费管理-余额管理-余额取出
            BalanceWithdrawalEditShow: false,
            // 收费管理-余额管理-余额过户
            BalanceTransferEditShow: false,
            // 表计管理-换表
            ChangeTableEditShow: false,
            // 表计管理-复表
            DuplicateTableEditShow: false,
            // 表计管理-用户复核
            ComparisonTableHandleShow: false,
            // 表计管理-维检
            DimensionalInspectionHandleShow: false,
            // 表计管理-水表注册
            WareHousingEditShow: false,
            // 表计管理-拆表审批
            TableDismantlingHandleShow: false,
            // 表计管理-水表单据变更
            wMeterEditAddShow: false,
            // 工程管理-用户工程-用水咨询
            waterQueryHandleShow: false,
            // 工程管理-用水安装
            waterMeterHandleInfoShow: false,
            // 工程管理-内部工程
            insideHandleInfoShow: false,
            // 工程管理-工程审批
            engineerApprovalShow: false,
            // 工程管理-工程延期
            engineerDelayShow: false,
            // 工程管理-工程终止
            engineerTerminationShow: false,
            // 客户管理-变更
            customerChangeEditShow: false,
            // 客户管理-销户
            SalesAccountEditShow: false,
            // 客户管理-复用
            multiplexingEditShow: false,
            // 客户管理-停用
            DisuseProcedureEditShow: false,
            // 客户管理-过户
            TransferEditShow: false,
            // 客户管理-开户
            OpenAccountEditShow: false,
            // 抄表开账-抄表抽查
            QualityReadingEditShow: false,
            // 抄表开账-抄表修改
            PrivilegeModificationEditShow: false
        },
        approvalPageName: '办理',
        approvalPageVisible: false,
        editNeedData: {}
    }
  },
  methods: {
      open(processCode, editNeedData) {
          this.approvalPageVisible = true
          const process = {
              bill_internet_close: {
                  name: '代收关闭支付',
                  show: 'ClosingCollectionPaytmentEditShow',
                  busicode: 'InternetCloseUpdate'
              },
              bill_add_cost: {
                  name: '应收追加',
                  show:  'FinancialAdjustmentEditShow',
                  busicode: 'AddCostUpdate'
              },
              bill_other_charge: {
                  name: '其他收费',
                  show: 'OtherChargesEditShow',
                  busicode: 'OtherChageUpdate'
              },
              bill_add_penalty: {
                  name: '举报罚款',
                  show: 'RecoverEditShow',
                  busicode: 'AddAppendUpdate'
              },
              bill_penalty_remission: {
                  name:'违约金减免',
                  show: 'LiquidatedDamagesEditShow',
                  busicode: 'PenaltyRemissionUpdate'
              },
              bill_bad_debts_1: {
                  name: '呆账处理',
                  show: 'DealingBadDebtsEditShow',
                  busicode: 'BadDebtsUpdate'
              },
              bill_bad_debts_2: {
                  name: '坏账报损',
                  show: 'ReportingBadDebtsEditShow',
                  busicode: 'BadDebtsUpdate'
              },
              bill_rush_red_2: {
                  name: '实收减免',
                  show: 'RedFlushingEditShow',
                  busicode: 'RushRedUpdate'
              },
              bill_red_rush_hide: {
                  name: '水量红冲',
                  show: 'waterFlushingEditShow',
                  busicode: 'RushRedUpdate'
              },
              bill_red_rush: {
                  name: '红冲',
                  show: 'redFlushEditShow',
                  busicode: 'FnRedRushSave'
              },
              bill_cancel_curr_month: {
                  name: '取消当月收费',
                  show: 'CancellMonthlyEditShow',
                  busicode: 'CancelCurrMonthUpdate'
              },
              bill_balance_out: {
                  name: '余额取出',
                  show: 'BalanceWithdrawalEditShow',
                  busicode: 'BalanceOutUpdate'
              },
              bill_balance_assigned: {
                  name: '余额过户',
                  show: 'BalanceTransferEditShow',
                  busicode: 'BalanceAssignedUpdate'
              },
              ms_chg_plan_1: {
                  name: '换表',
                  show: 'ChangeTableEditShow',
                  busicode: 'MsChgUpdate'
              },
              ms_reuse: {
                  name: '复表',
                  show: 'DuplicateTableEditShow',
                  busicode: 'MsReuseBackfill'
              },
              ms_verify: {
                  name: '用户复核',
                  show: 'ComparisonTableHandleShow',
                  busicode: 'MsVeriUpdate'
              },
              ms_repair: {
                  name: '维检',
                  show: 'DimensionalInspectionHandleShow',
                  busicode: 'MsRepairUpdate'
              },
              ms_in_plan: {
                  name: '水表注册',
                  show: 'WareHousingEditShow',
                  busicode: 'MsInPlanUpdate'
              },
              ms_chg_plan_2: {
                  name: '拆表审批',
                  show: 'TableDismantlingHandleShow',
                  busicode: 'MsChgPlanUpdate'
              },
              ms_info_change: {
                  name: '水表变更单据',
                  show: 'wMeterEditAddShow',
                  busicode: 'WmChgUpdate'
              },
              pj_consult: {
                  name: '用水咨询',
                  show: 'waterQueryHandleShow',
                  busicode: 'PjConsult'
              },
              pj_install: {
                  name: '用水安装',
                  show: 'waterMeterHandleInfoShow',
                  busicode: 'PjInstall'
              },
              pj_internal: {
                  name: '内部工程',
                  show: 'insideHandleInfoShow',
                  busicode: 'PjInternal'
              },
              pj_info_new: {
                name: '工程审批',
                show: 'engineerApprovalShow',
                busicode: 'pj_info_new'
              },
              pj_process_node_time_postpone: {
                name: '工程延期',
                show: 'engineerDelayShow',
                busicode: 'pj_process_node_time_postpone'
              },
              pj_termination: {
                name: '工程终止',
                show: 'engineerTerminationShow',
                busicode: 'pj_termination'
              },
              user_change: {
                  name: '变更',
                  show: 'customerChangeEditShow',
                  busicode: 'UserChange'
              },
              user_close: {
                  name: '销户',
                  show: 'SalesAccountEditShow',
                  busicode: 'UserClose'
              },
              user_reuse: {
                  name: '复用',
                  show: 'multiplexingEditShow',
                  busicode: 'UserReuse'
              },
              user_stop: {
                  name: '停用',
                  show: 'DisuseProcedureEditShow',
                  busicode: 'UserStop'
              },
              user_transfer: {
                  name: '过户',
                  show: 'TransferEditShow',
                  busicode: 'UserTransfer'
              },
              user_open: {
                  name: '开户',
                  show: 'OpenAccountEditShow',
                  busicode: 'UserOpen'
              },
              MR_QUALITY_CHECK: {
                  name: '抄表抽查',
                  show: 'QualityReadingEditShow',
                  busicode: 'QualityCheckUpdate'
              },
              MR_MODIFY: {
                  name: '抄表修改',
                  show: 'PrivilegeModificationEditShow',
                  busicode: 'ModifyUpdate'
              }
          }
          this.editNeedData = editNeedData
          this.editNeedData.busicode = process[processCode].busicode

          this.childPageShowData[process[processCode].show] = true
          this.approvalPageName = process[processCode].name
          
      },
      closeDialog() {
          this.approvalPageVisible = false
          for(const key in this.childPageShowData) {
            this.childPageShowData[key] = false
          }
          this.$emit('close')
        //   this.$parent.processDialogShow = false
      }
  }
}
</script>

<style lang="scss" scoped>

/deep/ {
    .el-dialog__body {
        overflow: auto!important;
    }
}

</style>
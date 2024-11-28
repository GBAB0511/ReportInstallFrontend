<template>
  <div class="IntegratedBusiness">
    <!-- 弹出页面 -->
    <!-- 弹出表单用户销户 -->
    <el-dialog :title="SalesAccountName" :destroy-on-close="true" :visible.sync="SalesAccountVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <SalesAccount v-if="SalesAccountVisible" ref="SalesAccount" :userNo="userListNo" billStute="CloseUserAdd"></SalesAccount>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('SalesAccount');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单用户过户 -->
    <el-dialog :title="TransferName" :destroy-on-close="true" :visible.sync="TransferVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <Transfer v-if="TransferVisible" ref="Transfer" :userNo="userListNo" billStute="TransferUserAdd"></Transfer>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('Transfer');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单用户复用 -->
    <el-dialog :title="multiplexingName" :destroy-on-close="true" :visible.sync="multiplexingVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <multiplexing v-if="multiplexingVisible" ref="multiplexing" :userNo="userListNo" :idCuster="null" billStute="ReuseUserAdd"></multiplexing>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('multiplexing');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单登记红冲 -->
    <el-dialog :title="redFlushAdjustName" :destroy-on-close="true" :visible.sync="redFlushAdjustVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <redFlushAdjustVisible v-if="redFlushAdjustVisible" :userNo="userListNo" :NotDisabled="true" ref="redFlushAdjust" billStute="FnRedRushAdd" :editNeedData="redFlushAdjustVisibleEditNeedData" :idCuster="null"></redFlushAdjustVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('redFlushAdjust');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单收费查询 -->
    <el-dialog :title="ChargeReportOfFlowDetailName" :destroy-on-close="true" :visible.sync="ChargeReportOfFlowDetailVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <ChargeReportOfFlowDetail v-if="ChargeReportOfFlowDetailVisible" ref="ChargeReportOfFlowDetail" :fuzzyQuery="tableQuery.fuzzyQuery" billStute="ChargeReportOfFlowDetail"></ChargeReportOfFlowDetail>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单用户停用 -->
    <el-dialog :title="DiscontinueUseName" :destroy-on-close="true" :visible.sync="DiscontinueUseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <DiscontinueUse v-if="DiscontinueUseVisible" ref="DiscontinueUse" :userNo="userListNo" :idCuster="null" billStute="StopUserAdd"></DiscontinueUse>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('DiscontinueUse')">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单用水咨询 -->
    <el-dialog :title="EngineeringRegistrationName" :destroy-on-close="true" :visible.sync="EngineeringRegistrationVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <EngineeringRegistration v-if="EngineeringRegistrationVisible" ref="childWaterEditor" :indexAdd="wQEditNeedData.indexAddDate" :wQEditData="wQEditNeedData.wQEditData"></EngineeringRegistration>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('childWaterEditor');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出查看用户资料 -->
    <el-dialog :title="UserInformationName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="UserInformationShow" class="common-dialog" @close="closeDialog">
      <UserProfileView :formDataUserNo="formDataUserNo" :formDataAccountNo="ctmInfoData.accountNo" v-if="UserInformationShow"></UserProfileView>
    </el-dialog>
    <!-- 弹出表日收款查询 -->
    <el-dialog :title="DailyReceiptInquiryName" :destroy-on-close="true" :visible.sync="DailyReceiptInquiry" :close-on-click-modal="false" class="common-dialog" @close="closeDialog">
      <DailyReceiptInquiry v-if="DailyReceiptInquiry" ref="DailyReceiptInquiry"></DailyReceiptInquiry>
    </el-dialog>
    <!-- 弹出表发票管理 -->
    <el-dialog :title="InvoiceReplacementName" :destroy-on-close="true" v-if="InvoiceReplacement" :visible.sync="InvoiceReplacement" :close-on-click-modal="false" class="common-dialog" @close="closeDialog">
      <InvoiceReplacement v-if="InvoiceReplacement" ref="InvoiceReplacement" :userNo='userListNo' :accountNo='ctmInfoData.accountNo' :fuzzyQuery='tableQuery.fuzzyQuery' @getInvoiceTypes='getInvoiceTypes'></InvoiceReplacement>
    </el-dialog>
    <!-- 弹出表工程收费 -->
    <el-dialog :title="EngineeringFeesName" :destroy-on-close="true" :visible.sync="engineerFeeDetail" :close-on-click-modal="false" class="common-dialog" @close="closeDialog">
      <!-- <EngineeringFees v-if="EngineeringFees" ref="EngineeringFees"></EngineeringFees> -->
      <engineerFeeDetail v-if="engineerFeeDetail" ref="engineerFeeDetail"></engineerFeeDetail>
    </el-dialog>
    <!-- 弹出表工单登记 -->
    <el-dialog :title="WorkOrderRegistrationName" :destroy-on-close="true" :visible.sync="WorkOrderRegistration" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <WorkOrderRegistration v-if="WorkOrderRegistration" ref="WorkOrderRegistration"></WorkOrderRegistration>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('WorkOrderRegistration')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" plain @click="searchWorkOrder">工单查询</el-button>
      </div>
    </el-dialog>
     <!-- 弹出表工单查询 -->
    <el-dialog title="工单查询" :destroy-on-close="true" :visible.sync="WorkOrderQuery" :close-on-click-modal="false" class="button-dialog" @close="closeWorkOrderQueryDialog">
      <WorkOrderQuery v-if="WorkOrderQuery" ref="WorkOrderQuery"></WorkOrderQuery>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeWorkOrderQueryDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出资料变更 -->
    <el-dialog :title="DataChangeVisibleName" :destroy-on-close="true" :visible.sync="DataChangeVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <DataChangeVisible v-if="DataChangeVisible" :userNo="userListNo" ref="DataChangeVisible"></DataChangeVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出用水类型变更 -->
    <el-dialog :title="TypesOfWaterUseVisibleName" :destroy-on-close="true" :visible.sync="TypesOfWaterUseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <TypesOfWaterUseVisible v-if="TypesOfWaterUseVisible" ref="TypesOfWaterUseVisible"></TypesOfWaterUseVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出用人口变更 -->
    <el-dialog :title="SteppedPopulationVisibleName" :destroy-on-close="true" :visible.sync="SteppedPopulationVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <SteppedPopulationVisible v-if="SteppedPopulationVisible" ref="SteppedPopulationVisible"></SteppedPopulationVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表优惠变更 -->
    <el-dialog :title="PreferentialWaterUseVisibleName" :destroy-on-close="true" :visible.sync="PreferentialWaterUseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <PreferentialWaterUseVisible v-if="PreferentialWaterUseVisible" ref="PreferentialWaterUseVisible"></PreferentialWaterUseVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出开票方式变更 -->
    <el-dialog :title="InvoiceInformationVisibleName" :destroy-on-close="true" :visible.sync="InvoiceInformationVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <InvoiceInformationVisible v-if="InvoiceInformationVisible" ref="InvoiceInformationVisible"></InvoiceInformationVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出校表 -->
    <el-dialog :title="ComparisonTableVisibleName" :destroy-on-close="true" :visible.sync="ComparisonTableVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <ComparisonTableVisible :userNo="userListNo" v-if="ComparisonTableVisible" ref="ComparisonTableVisible" :editNeedData='ComparisonTableVisibleEditNeedData'></ComparisonTableVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ComparisonTableVisible')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表缴费方式变更 -->
    <el-dialog :title="PaymentMethodVisibleName" :destroy-on-close="true" :visible.sync="PaymentMethodVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <PaymentMethodVisible v-if="PaymentMethodVisible" ref="PaymentMethodVisible"></PaymentMethodVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表日结扎帐 -->
    <el-dialog :title="UnsettledAccountsStatisticsName" :destroy-on-close="true" :visible.sync="UnsettledAccountsStatistics" :close-on-click-modal="false" class="button-dialog UnsettledAccountsStatistics-dialog" @close="closeDialog">
      <UnsettledAccountsStatistics v-if="UnsettledAccountsStatistics" ref="UnsettledAccountsStatistics"></UnsettledAccountsStatistics>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain v-preventReClick @click="submit('UnsettledAccountsStatistics')">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表资料变更-->
    <el-dialog :title="CustomerChangeVisibleName" :destroy-on-close="true" :visible.sync="CustomerChangeVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <CustomerChangeVisible :mainUserNo="userListNo" v-if="CustomerChangeVisible" ref="CustomerChangeVisible" :idCuster="CustomerChangeVisibleEditNeedData.idCuster" :billStute="CustomerChangeVisibleEditNeedData.status"></CustomerChangeVisible>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="submit('CustomerChangeVisible')">保 存</el-button>
        <el-button type="info" size="mini" @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表余额过户-->
    <el-dialog :title="BalanceTransferName" :destroy-on-close="true" :visible.sync="BalanceTransfer" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <BalanceTransfer v-if="BalanceTransfer" ref="BalanceTransfer" :editNeedData="balanceTransferEditNeedData"></BalanceTransfer>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="submit('BalanceTransfer')">保 存</el-button>
        <el-button type="info" size="mini" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表余额取出-->
    <el-dialog :title="BalanceWithdrawalName" :destroy-on-close="true" :visible.sync="BalanceWithdrawal" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <BalanceWithdrawal v-if="BalanceWithdrawal" ref="BalanceWithdrawal" :accountNo="ctmInfoData.accountNo" :editNeedData="balanceWithdrawalEditNeedData"></BalanceWithdrawal>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="submit('BalanceWithdrawal')">保 存</el-button>
        <el-button type="info" size="mini" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表取消收费 -->
    <el-dialog :title="CancellationChargesName" :destroy-on-close="true" :visible.sync="CancellationCharges" :close-on-click-modal="false" class="common-dialog" @close="closeDialog">
      <CancellationCharges v-if="CancellationCharges" :fuzzyQuery="tableQuery.fuzzyQuery" ref="CancellationCharges"></CancellationCharges>
    </el-dialog>
    <!-- 弹出表收费取消授权 -->
    <el-dialog :title="CancellationChargeAuthorizationName" :destroy-on-close="true" :visible.sync="CancellationChargeAuthorization" :close-on-click-modal="false" class="common-dialog" @close="closeDialog">
      <CancellationChargeAuthorization v-if="CancellationChargeAuthorization" ref="CancellationChargeAuthorization"></CancellationChargeAuthorization>
    </el-dialog>

    <!-- 弹出表单账户流水 -->
    <el-dialog :title="PredepositDdetailsName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="PredepositDdetailsVisible" class="button-dialog" @close="closeDialog">
      <PredepositDdetailsInfo v-if="PredepositDdetailsVisible" ref="PredepositDdetails"></PredepositDdetailsInfo>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini">保 存</el-button>
        <el-button type="info" size="mini" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单高级查询 -->
    <el-dialog :title="WaterEditorName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="waterAddVisible" class="button-dialog" @close="closeDialog">
      <ComprehensiveQuery v-if="waterAddVisible" ref="childWaterEditor"></ComprehensiveQuery>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('ruleForm');">查询</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单多户查询 -->
    <el-dialog :title="multipleUserVisibleName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="multipleUserVisible" class="button-dialog" @close="closeDialog">
      <multipleUser v-if="multipleUserVisible" :multipleUserId="multipleUserId" ref="multipleUser"></multipleUser>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="multipleUsersubmit">确定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗账期过滤 -->
    <el-dialog title="账期区间选择" :destroy-on-close="true" width="450px" height="400px" :visible.sync="accountPeriodFilterVisible" :close-on-click-modal="false" class="accountPeriodFilter-dialog" @close="closeDialog">
      <div>
        <el-form :inline="true" ref="form2">
          <el-row>
            <el-form-item label="账期：">
              <el-date-picker v-model="accountPeriodFilterVal" value-format="yyyyMM" :picker-options="pickerOptions" :clearable="false" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
              </el-date-picker>
              <el-button type="text" class="lockBtn" :icon="lockIcon" ref="lockIcon" @click="toggleLockAccountPeriod()"></el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="accountPeriodFilterSubmit('accountPeriodFilter');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗现金缴费 -->
    <el-dialog :title="cashDepositName" :destroy-on-close="true" width="450px" height="400px" :visible.sync="cashDepositNameVisible" :close-on-click-modal="false" class="cashDeposit-dialog" @close="closeDialog">
      <BankCheck v-if="isCashDeposit" ref="BankCheck"></BankCheck>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('cashDeposit');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗刷卡缴费 -->
    <el-dialog append-to-body :title="cardDepositName" :destroy-on-close="true" width="30%" :visible.sync="cardDepositNameVisible" :close-on-click-modal="false" class="charge-dialog" @close="closeDialog">
      <!-- <BankCheck v-if="isCashDeposit" ref="BankCheck" ></BankCheck> -->
      <div id="card-box" style="font-size:30px;padding:50px 0px;text-align: center;">
        <div v-if="cardPayingVisible">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  ref="chargeContent" v-model="chargeContent" class="chargeContent" disabled :placeholder="'请付费'+this.chargeAmount+'元'"></el-input> -->
          请刷卡<span style="color:#F56C6C;">{{chargeAmount}}元</span>
        </div>
        <div v-if="cardSwipingVisible">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  ref="chargeContent" v-model="chargeContent" class="chargeContent" disabled :placeholder="'请付费'+this.chargeAmount+'元'"></el-input> -->
          {{cardSwipingVisibleMsg}}
        </div>
      </div>
      <div style="text-align: center;">
        <el-button v-if="cardPayingVisible" :autofocus="true" class="paid-btn" style="width: 120px;height: 60px;font-size: 20px;" type="primary" @click="submit('cardDeposit')">确 认</el-button>
        <!-- <el-button v-if='payWay !=="cash"' class="paid-btn" style="height: 60px;font-size: 20px;" type="primary" @click="payWayChange(payWay)">生成付款码</el-button>
   -->
        <el-button v-if="cardPayingVisible" style="width: 120px;height: 60px;font-size: 20px;" @click="closeDialog">取 消</el-button>
      </div>
      <!-- <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('cardDeposit');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div> -->
    </el-dialog>
    <!-- 弹出搜索 -->
    <FuzzyManyQueryDialog ref="searchDialog"></FuzzyManyQueryDialog>

    <!-- 弹出表单客户资料 -->
    <el-dialog :title="countManagementName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="countManagementVisible" class="button-dialog" @close="closeDialog">
      <countManagementEdit v-if="countManagementVisible" ref="childcountManagement" :formDataUserNo="ctmInfoData.ctmNo"></countManagementEdit>
    </el-dialog>

    <!-- 弹出表单业务查询 -->
    <el-dialog :title="BusinessQueryName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="BusinessQuery" class="button-dialog" @close="closeDialog">
      <BusinessQuery v-if="BusinessQuery" ref="childWaterEditor" :fuzzyQuery="tableQuery.fuzzyQuery"></BusinessQuery>
    </el-dialog>

    <!-- 弹出快速变更查询 -->
    <el-dialog :title="QuickChangeVisibleName" :destroy-on-close="true" :close-on-click-modal="false" class="button-dialog" :visible.sync="QuickChangeVisible" @close="closeDialog">
      <QuickChange v-if="QuickChangeVisible" ref="childQuickChange" billStute='QuickChangeUserAdd' :idCuster="{userNo:userListNo}"></QuickChange>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('quickChange');">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出发票拆分查询 -->
    <el-dialog :title="InvoiceSplittingVisibleName" :destroy-on-close="true" :close-on-click-modal="false" class="button-dialog" :visible.sync="InvoiceSplittingVisible" @close="closeDialog">
      <InvoiceSplitting v-if="InvoiceSplittingVisible" ref="childInvoiceSplitting"></InvoiceSplitting>
    </el-dialog>

    <!-- 弹出修改手机号码 -->
    <el-dialog width="450px" height="400px" :title="MobileChangeVisibleName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="mobileInfoVisible" @close="closeDialog">
      <el-form :inline="true" size="mini" :model="mobileQuery" class="demo-form-inline" @submit.native.prevent>
        <el-form-item class="fullSearch" label="手机号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="mobileQuery.mobile" clearable size="larger" placeholder="" style="line-height:38px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitMobile()">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出并户是否多户合缴 -->
    <el-dialog width="450px" height="400px" title="提示" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="isIncorporativeVisible" @close="closeDialog">
      <div style="font-size: 16px; padding: 10px 0px 20px;text-align: center;">
        <span>检查到本户已做并户，是否多户合缴？</span>
      </div>
      <div style="text-align: center;">
        <el-button type="info" @click="noPayment()">不合缴</el-button>
        <el-button type="primary" @click="accountPayment()">账户合缴</el-button>
        <el-button type="primary" @click="ctmPayment()">客户合缴</el-button>
      </div>
      
      <!-- <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" @click="submitMobile()">不合缴</el-button>
        <el-button type="primary" size="mini" @click="closeDialog()">账户合缴</el-button>
        <el-button type="primary" size="mini" @click="closeDialog()">客户合缴</el-button>
      </div> -->
    </el-dialog>

    <!-- 页面 -->
    <section class="toolBlock">
      <div class="leftForm">
        <div class="left-con">
          <div class="leftFormOption">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>
              <el-form-item class="fullSearch">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @input="e => input = inputMe(e)" @keyup.enter.native="search" ref="fuzzyQuerySearch" clearable size="larger" placeholder="联合编号/客户编号/客户名称/客户地址/账户编号/用户编号/手机号码/固定电话"></el-input>
              </el-form-item>
              <el-form-item class="fullBtn">
                <el-button class="searchBtn" @click="search" icon="el-icon-search">搜索</el-button>
                <!-- <el-button type="primary" @click="advancedSearch" class="advanceSearch" icon="el-icon-arrow-down"></el-button> -->
                <el-button type="primary" @click="multipleSearch" icon="el-icon-copy-document">多户</el-button>
                <el-button type="primary" @click="accountPeriodFilter" class="accountPeriodFilterBtn" icon="el-icon-date"></el-button>
              </el-form-item>
            </el-form>
            <ul class="userInfo">
              <li class="userDetails">
                <span class="userInfoLabel test">用户编号：</span>
                <el-tooltip placement="top" effect="light">
                    <template slot="content">
                      <div style="font-size:16px;line-height: 20px;">
                        <span style="color:#30B110;">微信公众号、微信生活缴费、支付宝缴费用户使用该编号</span>
                      </div>
                    </template>
                   <span class="userNo" @click="userInfoSearch('用户资料','UserInformationShow', ctmInfoUserNo)">{{ctmInfoUserNo}}</span>
                  </el-tooltip>
              </li>
              <li key="0">
                <span class="userInfoLabel longLabel">客户名称：</span>

                <span class="userInfoValue longName">{{ctmInfoData.ctmName}}</span>
              </li>
              <li class="userDetails">
                <span class="userInfoLabel test">客户编号：</span>
                <span class="ctmNo" @click="getCtmInfoShow">{{ctmInfoData.ctmNo}}</span>
              </li>
              <li key="3">
                <span class="userInfoLabel longLabel">客户地址：</span>

                <span class="userAddressInfoValue longName">{{ctmInfoData.ctmAddr}}</span>
              </li>
              <li key="1">
                <span class="userInfoLabel">账户余额：</span>

                <!-- <span class="userInfoValue">{{ctmInfoData.accountNo}}<span class="balanceTxt"><em v-if="ctmInfoData.accountBalance">(</em><em style="color: red;">{{ctmInfoData.accountBalance}}</em><em v-if="ctmInfoData.accountBalance">元)</em></span></span> -->
                <span class="userInfoValue"><span class="balanceTxt"><em v-if="ctmInfoData.accountBalance"></em><em style="color: red;">{{ctmInfoData.accountBalance}}</em><em v-if="ctmInfoData.accountBalance">元</em></span></span>
              </li>
              <li class="userDetails" key="2">
                <span class="userInfoLabel test">手机号码：</span>

                <!-- <span class="ctmNo" @click="getCtmMobile">{{ctmInfoData.mobile}}</span> -->
                <span v-if="ctmInfoData.mobile " class="ctmNo" @click="updateCtmMobile">{{ctmInfoData.mobile}}</span>
                <span v-else-if="!ctmInfoData.mobile && mobileQueryDialog " class="ctmNo" @click="updateCtmMobile">修改手机号码</span>
                <!-- <span v-else-if="mobileAnyQueryDialog">{{ctmInfoData.mobile}}</span> -->

                <span class="test">/通知人手机号：</span>
                <span v-if="stopWaterLinkMobile " class="ctmNo" @click="updateCtmMobile">{{stopWaterLinkMobile}}</span>
                <span v-else-if="!stopWaterLinkMobile && mobileQueryDialog " class="ctmNo" @click="updateCtmMobile">修改手机号码</span>
                <!-- <span v-else-if="mobileAnyQueryDialog">{{stopWaterLinkMobile}}</span> -->
              </li>

              <!-- <li>
                <span class="userInfoLabel">发票类型：</span>

                <span class="userInfoValue">{{ctmInfoData.invoiceTypeName}}</span>
              </li> -->
            </ul>
          </div>
          <div class="leftFormPaymentOption">
            <ol class="costInfo">
              <!-- <li>
                欠费金额：
                <b>{{receivableMoney}}</b>
              </li> -->
              <li style="width:20%">
                合计金额：
                <b>{{receivableMoney}}</b>
              </li>
              <li style="width:20%">
                应缴金额：
                <b>{{receivableTotal}}</b>
              </li>
              <li class="changeMoney">
                找零：
                <b>{{changeMoney}}</b>
              </li>
              <li class="balanceMoney">
                结存：
                <b>{{balanceMoney}}</b>
              </li>
              <li class="AmountCharged">
                收取金额：
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  ref="chargeInput" size="mini" placeholder="0" v-model="chargeAmount" @input="calculation" style="width: 500px;" @keydown.enter.native.prevent="gojiaohuji"></el-input>
              </li>
              <el-button type="danger" icon="el-icon-wallet" size="mini" style="font-size:20px; padding: 7px;" @click="gojiaohuji">收费</el-button>
            </ol>
            <el-form :inline="true" size="mini" :model="formInline" class="PayForm" label-width="90px">
              <el-form-item label="收费方式：">
                <el-radio-group v-model="payMethod" @change="changePayMethod">
                  <el-radio :label="item.value" v-for="item in dictionaryData.BPG" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="收费项目：" class="form-item-checkbox">
                <el-checkbox-group v-model="chargeClickData" :disabled="!workbenchCostSelect" @change="chargeClickMethod">
                  <el-checkbox :label="item.costNo" v-for="item in chargeData" :key="item.id" :disabled="item.isMust=='1'">{{item.costName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="结存方式：">
                <el-radio-group v-model="balanceWay" :disabled="disabledChangeBalanceWay" @change="changeBalanceWay">
                  <el-radio label="1" :disabled="disabledBackChange">全额找零</el-radio>
                  <el-radio label="2">剩余结存</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="打印选项：">
                <!-- <el-radio-group style="line-height: 28px;" v-model="PrintingModel" @change="printChange">
                  <el-radio label="1">不打印</el-radio>
                  <el-radio label="2">打票据</el-radio>
                  <el-radio label="3" v-if="showReceiptButton">打收据</el-radio>
                </el-radio-group> -->
                <el-checkbox-group v-model="checkedPrint" @change="printCheckChange">
                  <el-checkbox v-for="item in printType" :label="item.invoiceNo" :key="item.id">{{item.invoiceName}}</el-checkbox>
                </el-checkbox-group>
                <el-checkbox label="合打" :disabled="printChangeModel" class="afterPay" v-model="PrintingModel1"></el-checkbox>
              </el-form-item>
              <el-form-item label="发票抬头：" class="invioce">{{ctmInfoData.invoiceTitle}}</el-form-item>
              <!-- <el-form-item label="备注：" class="searchInput remark">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="comments" class="read-only" placeholder="备注"></el-input>
              </el-form-item> -->

              <el-form-item label="票据提醒：" class="noteReminder">{{invoiceTypes}}</el-form-item>
              <el-form-item label="收费提醒：" class="noteReminder chargeRemind">欠费金额：<span style="color:#30B110;">{{receivableMoney}}</span>；笔数：<span style="color:#30B110;">{{calculateNum}}</span>；水量：<span style="color:#30B110;">{{calculateWater}}</span>；垃圾费：<span style="color:#30B110;">{{garbageFee}}</span>；水费及其他代收费用：<span style="color:#30B110;">{{waterAndOtherFee}}</span></el-form-item>
            </el-form>
          </div>
        </div>
        <div class="kl-table-IntegratedBusiness">
          <div class="tableMore" @click="detailsClick">
            <i :class="tabMore"></i>
          </div>
          <el-table ref="table" fit @selection-change="handleSelectionChange" @select="handleSelect" :span-method="arraySpanMethod" highlight-current-row border :data="tableData" :max-height="maxHeight" class="change-tables-table" :row-class-name="tableRowClass" @cell-click="handleTableCellClick">
            <el-table-column prop="index" label="NO." width="48" align="center"></el-table-column>
            <el-table-column prop="type" width="50" type="selection" :selectable="selectable"></el-table-column>

            <el-table-column prop="lvalue" min-width="150">
              <template slot="header">
                <span>用户
                  <el-tooltip placement="top" effect="light">
                    <template slot="content">
                      <div style="font-size:16px;line-height: 20px;">
                        <span style="color:#F56C6C;">红色：已经代扣或托收出盘；</span>
                        <span style="color: #A040FF;">紫色：拆表；</span>
                        <span style="color:#0B417A;">深蓝色：代扣用户；</span>
                        <span style="color:#E6A23C;">黄色：托收用户；</span>
                        <span style="color:#62A8F2;">蓝色：用户锁；</span>
                        <span style="color:#30B110;"> 绿色：增值税用户；</span>
                      </div>
                    </template>
                    <i class="el-icon-warning-outline" style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
                  </el-tooltip>
                </span>
              </template>
              <template slot-scope="scope">
                <p style="text-align: left;">{{scope.row.ctmName}}</p>
                <h3 style="text-align: left;">
                  <span></span>
                  <span style="color:#297ACC;cursor:pointer;" @click="userInfoSearch('用户资料','UserInformationShow', scope.row.userNo)">{{scope.row.userNo}}</span>
                </h3>
                <!-- <h3 style="text-align: left;"><span style="color:#909399;">用水类型：</span><span style="color:#000;">{{scope.row.Wtype}}</span></h3> -->
                <h3 style="text-align: left;">
                  <span style="color:#909399;"></span>
                  <span style="color:#000;">{{scope.row.userAddr}}</span>
                </h3>
                <!-- <h3>{{scope.row.areaName}}</h3> -->
              </template>
            </el-table-column>

            <el-table-column prop="useWaterType" min-width="80" label="用水类型"></el-table-column>

            <!-- <el-table-column prop="typeMonth" width="50" type="selection"></el-table-column> -->

            <el-table-column prop="accountPeriod" min-width="80" label="账期" class-name="font14">
              <template slot-scope="scope">
                <p style="color:#297ACC;cursor:pointer;font-weight:normal;">{{scope.row.accountPeriod}}</p>
                <!-- <p>{{scope.row.daytime}} / {{scope.row.code}}</p>
                <p>{{scope.row.areaName}}</p>-->
              </template>
            </el-table-column>

            <el-table-column v-if="BreachOfContract" prop="priorPeriodNum" min-width="80" label="上期抄码"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="currendPeriodNum" min-width="80" label="本期抄码"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="addWater" min-width="80" label="增减水量">
              <!-- <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="消防分摊：5方、总表分摊：5方" placement="top-start">
                  <p>{{scope.row.addWater}}</p>
                </el-tooltip>
              </template> -->
            </el-table-column>

            <el-table-column prop="calculateWater" min-width="80" label="计费水量" class-name="font14"></el-table-column>

            <el-table-column prop="arrearageTotal" min-width="100" label="欠费合计" class-name="font14"></el-table-column>

            <el-table-column prop="receivableTotalByMonth" min-width="100" label="应缴合计" class-name="font14"></el-table-column>

            <el-table-column prop="deductBalanceAll" min-width="90" label="预存抵扣"></el-table-column>

            <el-table-column prop="costName" min-width="100" label="费用名称"></el-table-column>

            <el-table-column prop="synthesizePrice" min-width="80" label="综合单价"></el-table-column>

            <el-table-column prop="receivableMoney" min-width="90" label="金额"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="prefPrice" min-width="80" label="优惠单价"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="prefWater" min-width="80" label="优惠水量"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="prefMoney" min-width="80" label="优惠金额"></el-table-column>

            <!-- BreachOfContract:true,//违约明细
                  CopyInstructions:true,//抄表明细
                  Discount:true,  //    优惠明细
            Balance:true,//结存明细-->
            <el-table-column v-if="BreachOfContract" prop="penaltyDays" min-width="70" label="违约天数"></el-table-column>

            <!-- <el-table-column v-if="BreachOfContract" prop="unusual" min-width="90" label="应收违约金"></el-table-column> -->

            <el-table-column prop="penaltyMoney" min-width="90" label="违约金"></el-table-column>

            <!-- <el-table-column prop="deductBalance" min-width="90" label="预存抵扣"></el-table-column> -->

            <el-table-column prop="meterReadingStaff" min-width="90" label="抄表员"></el-table-column>

            <el-table-column prop="receivableTotal" v-if="false" min-width="100" label="应缴合计-每行"></el-table-column>

          </el-table>
        </div>
      </div>
      <aside class="rightBtn" @mouseover="leftShow" @mouseleave="leftHidden">
        <h5>
          <span>常用业务</span>
          <!-- <i class="el-icon-s-tools setTip"></i> -->
        </h5>
        <section class="btnsBlock btnTop">
          <div v-for="(v, i) in rightBtns2" :key="i" @click="userInfoSearch(v.label,v.name)">
            <img :src="v.src" alt />
            <p>{{v.label}}</p>
          </div>
        </section>
        <h5>常用功能</h5>
        <section class="btnsBlock">
          <div v-for="(v, i) in rightBtnsEvents3" :key="i" @click="userInfoSearch(v.label,v.name)">
            <!-- <el-badge :hidden="v.name !== 'EngineeringFees'" :value="EngineeringFeesCount"> -->
            <img :src="v.src" alt />
            <p>{{v.label}}</p>
            <!-- </el-badge> -->
          </div>

          <!-- <div class="menuLeft" @click="next" v-show="menuLeftShow">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="menuRight" @click="next" v-show="menuLeftShow">
            <i class="el-icon-arrow-right"></i>
          </div> -->
        </section>
      </aside>
    </section>
    <!-- 选择收费方式，收费按钮触发 -->
    <el-dialog class="charge-dialog" :close-on-click-modal='false' title="收取费用" :v-if="chargeShow" :visible.sync="chargeShow" width="30%"  @close='paidAndClose' close-on-press-escape :show-close='false'>
      <el-radio-group v-model="payWay" @change="payWayChange" v-if='(paySucceed === false)&&(isWechatPay||isAliPay)&& !(["10","6"].includes(payMethod))'>
        <el-radio label="cash">现金</el-radio>
        <el-radio label="wechat" v-if="isWechatPay">微信</el-radio> 
        <el-radio label="ali" v-if="isAliPay">支付宝</el-radio>
      </el-radio-group>
      <div id="text-box">
        <div v-if='payWay === "cash"'>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  ref="chargeContent" v-model="chargeContent" class="chargeContent" disabled :placeholder="'请付费'+this.chargeAmount+'元'"></el-input> -->
       <span v-if="payMethod == '10'">请转账</span> <span v-else>请付费</span> <span style="color:#F56C6C;">{{chargeAmount}}元</span>
        </div>
        <div v-if='(payWay !== "cash") && !paySucceed'>
          支付中... 等待付款<span style="color:#F56C6C;">{{chargeAmount}}元</span>
        </div>
        <div v-if='(payWay !== "cash")&&paySucceed'>
          支付完成，已收款<span style="color:#F56C6C;">{{chargeAmount}}元</span>
        </div>
      </div>
      <el-button v-if="payWay === 'cash'" :autofocus="true" class="paid-btn" style="width: 200px;height: 60px;font-size: 20px;" type="primary" @click="charge">已收费</el-button>
      <!-- <el-button v-if='payWay !=="cash"' class="paid-btn" style="height: 60px;font-size: 20px;" type="primary" @click="payWayChange(payWay)">生成付款码</el-button>
   -->
      <el-button style="width: 120px;height: 60px;font-size: 20px;" @click="paidAndClose">取 消</el-button>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paidAndClose">已收现</el-button>
        <el-button @click="paidAndClose">取 消</el-button>
      </span> -->
    </el-dialog>
    <object classid="clsid:96BB8ADA-D348-4414-8892-DC79C8818841" id="GWQ" width="0" height="0"></object>

    <!-- 用于调用pay页面的获取支付状态方法 --src上加了个css2，打包给后端时加，本地测不用加 -->
    <!-- <iframe ref="payIframe" name="payIframe" src="../../../static/interactiveMachine/pay.html" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe> -->
    <modifyNumber :diaVisible.sync="modifyNumberDia"  @submitDone="submitDone" :formData="updateNumber" refreshNode="userInfoSearchDetail"></modifyNumber>
  </div>
</template>
<script>
import '../../../static/interactiveMachine/js/gwq.js'
import throttle from '@/assets/js/throttle.js'
import ComprehensiveQuery from "@/views/CustomerCenter/userInfo/ComprehensiveQuery"; //高级查询
import countManagementEdit from "./UserInformation/ctmInfo"; //客户资料
import multipleUser from "./UserInformation/multipleUser"; //多户查询
import FuzzyManyQueryDialog from './UserInformation/FuzzyManyQueryDialog' // 搜索
import PredepositDdetailsInfo from "@/components/IntegratedBusiness/UserInformation/PredepositDdetailsInfo"; //账户流水
import UserProfileView from "@/components/IntegratedBusiness/UserInformation/index"; //用户查看资料
import BusinessQuery from "@/components/IntegratedBusiness/UserInformation/BusinessQuery"; //业务查询
import InvoiceReplacement from "./UserInformation/InvoiceReplacement"; //发票管理
import BankCheck from "@/components/bankCheck";
import DailyReceiptInquiry from "./UserInformation/DailyReceiptInquiry"; //日收款查询
import UnsettledAccountsStatistics from "./UserInformation/UnsettledAccountsStatistics"; //日结扎帐
import CancellationCharges from "./UserInformation/CancellationCharges"; //取消收费
import CancellationChargeAuthorization from "./UserInformation/CancellationChargeAuthorization"; //收费取消授权
import QuickChange from "./UserInformation/QuickChange"; //快速变更
import InvoiceSplitting from "./UserInformation/InvoiceSplitting"; //发票拆分
import SPagination from "../SPagination"; //
// import EngineeringRegistration from "@/views/EngineeringCenter/waterQuery/waterQueryEdit"; //用水咨询
import EngineeringRegistration from "@/views/EngineeringCenter/engineerApproval/engineerApprovalEdit"; //用水咨询
import DiscontinueUse from "@/views/CustomerCenter/DiscontinueUse/DisuseProcedureEdit"; //用户停用
import multiplexing from "@/views/CustomerCenter/multiplexing/multiplexingEdit"; //用户复用
import Transfer from "@/views/CustomerCenter/Transfer/TransferEdit"; //用户过户
import SalesAccount from "@/views/CustomerCenter/SalesAccount/SalesAccountEdit"; //用户销户
import BalanceWithdrawal from "@/views/FinancialCenter/CounterCharges/BalanceWithdrawalEdit"; //余额取出
import BalanceTransfer from "@/views/FinancialCenter/CounterCharges/BalanceTransferEdit"; //余额过户
import engineerFeeDetail from "@/views/EngineeringCenter/engineerFeeDetail"; //工程收费
import WorkOrderRegistration from "./UserInformation/WorkOrderRegistration"; //工单登记
import WorkOrderQuery from "./UserInformation/WorkOrderQuery"; //工单登记
import DataChangeVisible from "@/views/CustomerCenter/DataChange/DataChangeAdd"; //资料变更
import TypesOfWaterUseVisible from "@/views/CustomerCenter/DataChange/TypesOfWaterUseEdit"; //用水类型变更
import SteppedPopulationVisible from "@/views/CustomerCenter/DataChange/SteppedPopulationEdit"; //用水人口
import PreferentialWaterUseVisible from "@/views/CustomerCenter/DataChange/PreferentialWaterUseEdit"; //优惠变更
import PaymentMethodVisible from "@/views/CustomerCenter/DataChange/PaymentMethodAdd"; //缴费方式变更
import InvoiceInformationVisible from "@/views/CustomerCenter/DataChange/InvoiceInformationAdd"; //开票变更
import ComparisonTableVisible from "@/views/WatchCenter/ComparisonTable/ComparisonTableEdit"; //校表
import CustomerChangeVisible from "@/views/CustomerCenter/changeMangement/CustomerChangeEdit"; //变更
import redFlushAdjustVisible from "@/views/FinancialCenter/FinancialAdjustment/redFlushAdjust/redFlushEdit";//红冲
import ChargeReportOfFlowDetail from "@/views/ReportCenter/ChargeReportOfFlowDetailed/index";//红冲
import modifyNumber from "@/components/modifyNumber";//修改手机号码、通知人手机
import axios from "axios";
export default {
  name: "IntegratedBusiness",
  components: {
    InvoiceReplacement,
    DailyReceiptInquiry,
    UnsettledAccountsStatistics,
    CancellationCharges,
    CancellationChargeAuthorization,
    SPagination,
    BankCheck,
    ComprehensiveQuery,
    countManagementEdit,
    PredepositDdetailsInfo,
    EngineeringRegistration,
    DiscontinueUse,
    multiplexing,
    Transfer,
    SalesAccount,
    engineerFeeDetail,
    WorkOrderRegistration,
    WorkOrderQuery,
    DataChangeVisible,
    BusinessQuery,
    BalanceTransfer, //余额过户
    BalanceWithdrawal, //余额取出
    TypesOfWaterUseVisible,
    SteppedPopulationVisible, //用水人口
    PreferentialWaterUseVisible, //优惠变更
    PaymentMethodVisible, //缴费方式变更
    InvoiceInformationVisible, //开票变更
    ComparisonTableVisible, //校表
    redFlushAdjustVisible,//红冲
    ChargeReportOfFlowDetail,//收费查询
    CustomerChangeVisible,
    UserProfileView, //用户资料查询
    QuickChange, //快速变更
    InvoiceSplitting, //发票拆分
    multipleUser, //多户查询弹框
    FuzzyManyQueryDialog, //搜索弹窗
    modifyNumber, //修改手机号码、通知人手机弹窗
  },
  data () {
    return {
      // formQueryUserNo:'',//用户编号
      mobileQueryDialog: false, //单户手机号码修改操作
      mobileAnyQueryDialog: false,//多户不可修改手机号码操作
      userListNo: '',
      MobileChangeVisibleName: '修改手机号码',
      mobileInfoVisible: false,
      isAliPay: false,//是否启用支付宝二维码支付
      isWechatPay: false,
      payWay: 'cash',
      paySucceed: false,
      isFuzzyQueryFocus: false,//是否对查询框聚焦
      // 启动列表勾选和收费项目勾选联通
      tableAndChargeShow: false,
      multipleUserId: "",
      canCalcFlag: false,
      //
      formDataUserNo: "",
      formDataAccountNo:"",
      // 查询条件对象
      tableQuery: {
        // fuzzyQuery: "C0101135,C0101310",
        fuzzyQuery: null,
      },
      mobileQuery: {
        mobile: null,
      },
      // 用水咨询所需数据
      wQEditNeedData: {
        wQEditData: "",
        indexAddDate: "add",
      },
      // 余额过户所需数据
      balanceTransferEditNeedData: {
        saveType: "add",
        busicode: "FnBalanceAssignedAdd",
      },
      // 余额取出所需数据
      balanceWithdrawalEditNeedData: {
        saveType: "add",
        busicode: "FnBalanceOutAdd",
      },
      // 资料变更所需数据
      CustomerChangeVisibleEditNeedData: {
        idCuster: { id: "" },
        status: "ChangeUserAdd",
      },
      // 用户复核所需数据
      ComparisonTableVisibleEditNeedData: {
        processState: '',
        id: '',
        busicode: 'MsVeriAdd',
        saveType: 'add',
      },
      // 红冲所需数据
      redFlushAdjustVisibleEditNeedData: {
        processState: '',
        id: '',
        busicode: 'FnRedRushAdd',
        saveType: 'add',
      },
      // 列表数据
      tableData: [],
      // 客户信息数据
      ctmInfoData: {},
      // 客户信息用户编号
      ctmInfoUserNo: '',
      // 是否需要输入框内容
      isNeedReplace: true,
      // 通知人手机 
      stopWaterLinkMobile: '',
      // 修改号码弹窗
      modifyNumberDia: false,
      // 修改号码formData
      updateNumber: {
        ctmNo: "",
        mobile: "",
        userNo: "",
        stopWaterLinkMobile: "",
      },
      // 搜索用户编号是否并户
      isIncorporative: false,
       // 搜索用户编号是否并户弹窗
      isIncorporativeVisible: false,
      customTableData: [],
      accountTableData: [],
      userTableData: [],
      // 欠费金额
      receivableMoney: 0,

      // 笔数
      calculateNum: 0,
      // 账期集合
      accountPeriods: [],
      // 水量
      calculateWater: 0,
      // 垃圾费
      garbageFee: 0,
      // 水费及其他费用
      waterAndOtherFee: 0,

      // 应缴金额字段
      receivableTotal: 0,
      // 找零字段
      changeMoney: "",
      // 结存字段
      balanceMoney: "",
      // 禁止找零
      disabledBackChange: false,
      // 收取金额字段
      chargeAmount: "",

      // 收费方式字段
      payMethod: "1",
      // 票据提醒字段
      invoiceTypes: "",
      // 结存方式字段
      balanceWay: "1",
      // 禁止修改结存方式
      disabledChangeBalanceWay: false,
      // 备注字段
      // comments: "",
      // 收费项目数据
      chargeData: [],
      // 收费项目勾选数据
      chargeClickData: [],
      // 数据字典数据
      dictionaryData: {},
      tabMore: "el-icon-d-arrow-right",
      waterAddVisible: false, //高级查询
      WaterEditorName: "高级查询",
      menuLeftShow: false,
      moreBtn: "el-icon-arrow-down",
      isRightBtn: false,
      isRightBtnTitle: "查看更多",
      payServiceModelLive: false,
      FlowingTableVisible: false,
      // 缴费类型
      PrintingModel: "1",
      PrintingModel1: false,

      //   查询表单
      formInline: {
        con: "",
        document: "",
        proposer: "",
        application: "",
        options: []
      },
      details: [
        // {
        //     title:" 客户编号：",
        //     value:"0120154265"
        // },
        {
          title: " 客户名称：",
          value: "王淑英"
        },
        {
          title: "账户编号：",
          value: "11122445886"
        },
        {
          title: "座机号码：",
          value: "13655487981"
        },
        {
          title: "客户地址：",
          value: "宁水花园1栋1单元703"
        }
      ],
      rightBtns2: [
        // {
        //     label:"用户资料",
        //     name:"userInfo",
        //     src: require('@/assets/images/用户资料.png')
        // },

        // {
        //     label:"打印新卡",
        //     name:"PrintCard",
        //     src: require('@/assets/images/打印新卡.png')
        // },
        {
          label: "用水报装",
          // name:"/EngineeringCenter/EngineeringRegistration",
          name: "EngineeringRegistrationVisible",
          src: require("@/assets/images/用户工程.png")
        },

        {
          label: "用户停用",
          // name:"/CustomerCenter/DiscontinueUse",
          name: "DiscontinueUseVisible",
          src: require("@/assets/images/用户停用.png")
        },
        {
          label: "用户复用",
          // name:"/CustomerCenter/multiplexing",
          name: "multiplexingVisible",
          src: require("@/assets/images/用户复用.png")
        },
        {
          label: "用户过户",
          // name:"/CustomerCenter/Transfer",
          name: "TransferVisible",
          src: require("@/assets/images/用户过户.png")
        },
        {
          label: "用户销户",
          // name:"/CustomerCenter/SalesAccount",
          name: "SalesAccountVisible",
          src: require("@/assets/images/用户销户.png")
        },
        {
          label: "资料变更",
          name: "CustomerChangeVisible",
          src: require("@/assets/images/资料更变.png")
        },
        {
          label: "用户校表",
          name: "ComparisonTableVisible",
          src: require("@/assets/images/检定.png")
        },
        {
          label: "快速变更",
          name: 'QuickChangeVisible',
          src: require("@/assets/images/quickly_change.png")
        },
        {
          label: "余额过户",
          name: "BalanceTransfer",
          src: require("@/assets/images/日收款.png")
        },
        {
          label: "余额取出",
          name: "BalanceWithdrawal",
          src: require("@/assets/images/日收款.png")
        },
        {
          label: "红冲",
          name: "redFlushAdjustVisible",
          src: require("@/assets/images/红冲.png")
        },
        {
          label: "收费查询",
          name: "ChargeReportOfFlowDetailVisible",
          src: require("@/assets/images/日收款.png")
        },
      ],
      rightBtnsEvents: [
        {
          label: "查看计算公式",
          name: "DailyReceiptInquiry",
          src: require("@/assets/images/未结账统计.png")
        },

        {
          label: "快速变更",
          name: "QuickChangeVisible",
          src: require("@/assets/images/未结账统计.png")
        },
        {
          label: "发票拆分",
          name: "InvoiceSplittingVisible",
          src: require("@/assets/images/未结账统计.png")
        },
        {
          label: "合同打印",
          name: "InvoiceSplittingVisible",
          src: require("@/assets/images/未结账统计.png")
        }
      ],
      rightBtnsEvents2: [],
      rightBtnsEvents3: [
        {
          label: "日收款查询",
          name: "DailyReceiptInquiry",
          src: require("@/assets/images/日收款.png")
        },

        {
          label: "发票管理",
          name: "InvoiceReplacement",
          src: require("@/assets/images/发票补打.png")
        },
        {
          label: "取消当日收费",
          name: "CancellationCharges",
          src: require("@/assets/images/取消收费.png")
        },
        {
          label: "取消收费授权",
          name: "CancellationChargeAuthorization",
          src: require("@/assets/images/取消收费权限.png")
        },

        {
          label: "业务查询",
          name: "BusinessQuery",
          src: require("@/assets/images/日收款.png")
        },
        {
          label: "日结扎帐",
          name: "UnsettledAccountsStatistics",
          src: require("@/assets/images/未结账统计.png")
        },
        {
          label: "工程收费",
          name: "engineerFeeDetail",
          src: require("@/assets/images/客服工单.png")
        },
        {
          label: "工单登记",
          name: "WorkOrderRegistration",
          src: require("@/assets/images/客服工单.png")
        }
      ],
      UserInformationName: "",
      UserInformationShow: false,
      currentName: "",
      tableShow: false,
      maxHeight: 200,
      btnsHeight: 0,
      BusinessQueryName: "业务查询",
      BusinessQuery: false,

      PredepositDdetailsName: "账户流水",
      PredepositDdetailsVisible: false,

      countManagementName: "客户资料",
      countManagementVisible: false, //客户资料的显示和隐藏

      TypesOfWaterUseVisibleName: "用水类型变更",
      TypesOfWaterUseVisible: false,

      SteppedPopulationVisibleName: "人口变更",
      SteppedPopulationVisible: false,

      PreferentialWaterUseVisibleName: "优惠变更",
      PreferentialWaterUseVisible: false,

      PaymentMethodVisibleName: "缴费方式变更",
      PaymentMethodVisible: false,

      InvoiceInformationVisibleName: "开票变更",
      InvoiceInformationVisible: false,

      ComparisonTableVisibleName: "用户校表",
      ComparisonTableVisible: false,

      DataChangeVisibleName: "资料变更",
      DataChangeVisible: false,

      BalanceWithdrawalName: "余额取出",
      BalanceWithdrawal: false,

      redFlushAdjustName: "红冲",
      redFlushAdjustVisible: false,

      ChargeReportOfFlowDetailName: "收费查询",
      ChargeReportOfFlowDetailVisible: false,

      BalanceTransferName: "余额过户",
      BalanceTransfer: false,

      CustomerChangeVisibleName: "资料变更",
      CustomerChangeVisible: false,

      DailyReceiptInquiryName: "日收款查询",
      DailyReceiptInquiry: false,

      InvoiceReplacementName: "发票管理",
      InvoiceReplacement: false,

      EngineeringFeesName: "工程收费",
      engineerFeeDetail: false,

      WorkOrderRegistrationName: "工单登记",
      WorkOrderRegistration: false,

      WorkOrderQueryName: "工单查询",
      WorkOrderQuery: false,

      UnsettledAccountsStatisticsName: "日结扎帐",
      UnsettledAccountsStatistics: false,

      CancellationChargesName: "取消收费",
      CancellationCharges: false,

      CancellationChargeAuthorizationName: "取消收费授权",
      CancellationChargeAuthorization: false,

      EngineeringRegistrationName: "用水报装",
      EngineeringRegistrationVisible: false,

      DiscontinueUseName: "用户停用",
      DiscontinueUseVisible: false,

      multiplexingName: "用户复用",
      multiplexingVisible: false,

      TransferName: "用户过户",
      TransferVisible: false,

      SalesAccountName: "用户销户",
      SalesAccountVisible: false,

      QuickChangeVisibleName: "快速变更",
      QuickChangeVisible: false,

      InvoiceSplittingVisibleName: "发票分票",
      InvoiceSplittingVisible: false,

      multipleUserVisibleName: "多户查询",
      multipleUserVisible: false,



      cashDepositName: "转账",
      cashDepositNameVisible: false,
      isCashDeposit: false,

      cardDepositName: "刷卡",
      cardDepositNameVisible: false,//刷卡弹窗
      isCardDeposit: false,

      BreachOfContract: false, //违约明细
      CopyInstructions: false, //抄表明细
      Discount: false, //    优惠明细
      Balance: false, //结存明细
      lastPage: 1,
      total: 2,

      showSum: true,
      // 列表勾选数据
      selectData: [],
      // 收费弹出框显示与隐藏
      chargeShow: false,
      // 收费方式(收费按钮弹出框选择)
      chargeMethod: '0',
      // 水司编号
      groupCode: '',
      // 收费方式按钮显示与隐藏
      radioShow: true,
      // 收费按钮弹出框显示字样
      chargeContent: '',
      printChangeModel: true,
      // 减免金额大于0的名单
      deductBalanceAccountList: [],
      //打印选项是否显示打印收据
      showReceiptButton: false,
      autoReceiptButton: false,//自动打印收据
      autoZbsfButton: false,//自动打印电子发票
      workbenchCostSelect: 1, // 1允许选择， 0默认全选不允许修改（收费项目）
      EngineeringFeesCount: 0, //工程收费未缴费数量
      balanceToNumberWay: '1', //结存时采用向上取整还是向下取整,'1'向上取整，'2'向下取整
      everyoneUserRoundWay: "0", //针对多户缴费的情况下，每一户都要单独对各自的费用取整后合计收费（0关，1开）
      everyoneUserRoundMoney: 0,
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      accountPeriodFilterVisible: false,
      accountPeriodFilterVal: [],

      // 账期锁定，默认未锁定
      isAccountPeriodLock: false,
      accountPeriodLockVal: [],
      lockIcon: 'el-icon-unlock',

      unAbleToCalc: false,

      // 是否检测到连接POS机
      isConnectPOS: false,
      // 正在刷卡弹窗
      cardSwipingVisible: false,
      // 正在刷卡弹窗消息
      cardSwipingVisibleMsg: '',
      // 订单号
      orderNum: '',
      // 刷卡请付款弹窗
      cardPayingVisible: true,
      // 是否勾选全部收费项目
      isChargeAllClick: true,

      // 打印选项
      printType: [],
      // 勾选中的打印选项
      checkedPrint: [],
      // 电子发票域名
      invoiceTurnUrl: ""
    };
  },
  mounted () {

    //获取是否启用二维码支付方式

    this.getCashDepositConfig();

    this.getPayMethodConfig();

    this.getIsQrCodeAlipay();
    this.getIsQrCodeWeChat();

    this.getInvoiceCostsAndTypes(); // 获取打印选项
    this.getInvoiceTurnUrl(); // 获取电子发票域名
    

    this.$refs.fuzzyQuerySearch.focus();
    this.getInvoiceTypes();
    this.getChargeData();
    this.getDictionary();
    this.showReceipt();
    this.autoReceipt();
    this.autozbsf();
    this.showBalanceMethod();
    this.showPrintItem();
    this.getEngineeringFeesCount()
    this.balanceToNumber()
    this.everyoneUserRound()

    this.getPOSCheckStatus()
    this.pos.posCharge = this.posCharge
    this.pos.posFailCharge = this.posFailCharge
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    // this.common.changeTable(this, ".IntegratedBusiness .leftForm", [
    //   ".IntegratedBusiness .leftForm .left-con"
    // ]);
  },

  methods: {
    submitDone(data){
        this.ctmInfoData.mobile = data.mobile;
        this.stopWaterLinkMobile =  data.stopWaterLinkMobile ;
    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    accountPeriodFilter () {
      if (!this.tableData.length) {
        this.$message({
          message: '当前无欠费数据！',
          type: 'warning'
        });
        return;
      }
      this.accountPeriodFilterVisible = true;
    },
    accountPeriodFilterSubmit () {
      if (this.accountPeriodFilterVal.length !== 2) {
        this.$message({
          message: '请选择正确的账期区间！',
          type: 'warning'
        });
        return;
      }
      this.unAbleToCalc = true;
      // 修改锁定状态
      this.isAccountPeriodLock = (this.lockIcon == 'el-icon-lock') ? true : false;
      if (this.isAccountPeriodLock) {
        // 锁定账期区间
        this.accountPeriodLockVal = this.accountPeriodFilterVal;
      } else {
        this.accountPeriodLockVal = [];
      }

      for (let j = 0; j < this.tableData.length; j++) {//对区间内的账期进行表格勾选 日期比较
        if ((this.tableData[j].accountPeriod >= this.accountPeriodFilterVal[0]) && (this.tableData[j].accountPeriod <= this.accountPeriodFilterVal[1])) {
          this.$refs.table.toggleRowSelection(this.tableData[j], true);
        } else {
          this.$refs.table.toggleRowSelection(this.tableData[j], false);
        }
      }
      this.unAbleToCalc = false;
      this.calcTableData();
      this.closeDialog();
    },
    getPayMethodConfig() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_PAY_METHOD_DEFAULT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length && res.list.length>0) {
            this.payMethod = res.list[0].configValue;

          }
        })
    },
    getCashDepositConfig () {//获取现金缴存配置
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'Cash_deposit_in_bank',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length && res.list[0].configValue === "01") {//为01则启用
            this.isCashDeposit = true;

          }
        })
    },

    // 检测刷卡是否需要连接pos机
    getPOSCheckStatus(){
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'IS_NEED_POS_CHECK',
        }
      };
      this.$api.fetch({
        params
      }).then(res => {
        if(res.list.length&&res.list[0].configValue == "1"){
          _this.isConnectPOS = true;
        }
      })
    },
    // 检测服务是否连上
    checkConnectServer(){
      console.log("连接服务！");
      // let orderNum = await this.getOrderNum()
      // this.orderNum = orderNum
      // this.posCharge()
      // console.log("12312123");
      this.pos.createWebsocket()
      this.cardSwipingVisibleMsg = '正在连接服务...'
      this.delayServer(this.checkConnectPos)
    },
    // 检测pos级是否连上
    checkConnectPos(){
      console.log("连接pos机！");
      this.cardSwipingVisibleMsg = '正在检测pos连接...'
      this.doSendCheckPos()
      this.delayCheckPos(this.reGetServer)
    },
    delayServer(callback){
      console.log("JwListenerConnect："+this.pos.JwListenerConnect);
      // setTimeout(this.setIsc, 5000)
      if(this.pos.JwListenerConnect){
        console.log("连上JwListener服务！");
        callback();
        return;
      }
      else{
        console.log("connectError："+this.pos.connectError);
        if (this.pos.connectError) {
          if (this.cardDepositNameVisible) {
            this.cardDepositNameVisible = false;
          }
          this.$message({
            message: '本机服务未开启，请开启服务！',
            type: 'error'
          });
          return;
        }
        setTimeout(this.delayServer, 1000, callback)
      }
    },
    delayCheckPos(callback){
      console.log("正在连接pos机...");
      if(this.pos.posMessage.rspmes == 'POS/PINPAD准备就绪'){
        console.log("pos已连接！");
        callback();
        return;
      }
      else{
        if (this.pos.isConnect && this.pos.posMessage.rspmes != 'POS/PINPAD准备就绪') {
          return;
        }
        setTimeout(this.delayCheckPos, 1000,callback)
      }
    },
    doSendCheckPos() {
      var sendData = "{ \"trantp\" : \"53\" }";
      if (echo_websocket != null && echo_websocket.readyState == 1) {
          echo_websocket.send(sendData);
      } else {
        if (this.cardDepositNameVisible) {
          this.cardDepositNameVisible = false;
        }
        this.$message({
          message: 'POS机服务未连接，先连接服务',
          type: 'error'
        });
      }
      // console.log("Sent message: " + message);
    },
    setIsc(){
      this.pos.isConnect = true
    },
    reGetServer(){
      //检测pos机没问题,重新连接服务
      this.pos.createWebsocket()
      this.reDelayServer(this.getConnect)
    },
    reDelayServer(callback){
      if(this.pos.JwListenerConnect){
        callback();
        return;
      }
      else{
        console.log("connectError："+this.pos.connectError);
        if (this.pos.connectError) {
          if (this.cardDepositNameVisible) {
            this.cardDepositNameVisible = false;
          }
          this.$message({
            message: '本机服务未开启，请开启服务！',
            type: 'error'
          });
          return;
        }
        setTimeout(this.delayServer, 1000, callback)
      }
    },
    async getConnect() {
      this.cardSwipingVisibleMsg = '正在刷卡中...'
      let moneyString = this.formatFloat(Number(this.chargeAmount))
      let orderNum = await this.getOrderNum()
      this.orderNum = orderNum
      var sendData = "{ \"amount\": \""+moneyString+"\",\"trantp\" : \"01\" ,\"merord\" : \""+orderNum+"\"}"
    	if(echo_websocket!=null && echo_websocket.readyState==1){
        // this.cardSwipingVisible = true
        // this.cardPayingVisible = false
        this.doSend(sendData);
    	//	writeToScreen("send data: " + sendData);
    	} else{
        this.$message({
          message: 'POS收费失败！',
          type: 'error'
        });
        if (this.cardDepositNameVisible) {
          this.cardDepositNameVisible = false;
        }
        this.pos.isConnect = false
        // writeToScreen("服务未连接，先连接服务");
    		//重新连接后，跟着马上发送数据会失败！（我猜测是异步执行的关系）

    		//得等到  连接成功事件收到后 再发送。
    	}
      console.log("阿萨德2");
    },
    // 获取订单号
    getOrderNum(){
      let verification = this.selectData.map(item => {
        return { billId: item.id };
      })
      let params = {
        busicode: 'PosOrderGenerate',
        data: {
          paymentType: -1,
          isPrestore: this.receivableTotal == 0 ? 1 : 0,
          groupCode: localStorage.getItem('companyNo'),
          accountNo: this.selectData.length ? this.selectData[0].userNo : this.ctmInfoData.accountNo,
          payType: 7,
          payMoney: this.chargeAmount,
          verification,
          feeType: 1,
          payChannel: 4,
        }
      }
      return this.$api
        .fetch({
          params,//参数
        })
        .then(res => { //获取支付链接和订单信息
          console.log("获取订单号成功");
          return res.order
        });
    },
    doSend(message) {
      echo_websocket.send(message);
      console.log("Sent message: " + message);
    },
    formatFloat(num){
      console.log(num);
      let money = JSON.parse(JSON.stringify(num.toString()))
      // if (money.indexOf('.')!=-1) {
      //   let money1 = (Number(money)*100).toString()
      //   console.log(money1);
      //   var zeroNum = 12 - money1.length
      //   var returnValue = ''
      //   for(var i= 0;i<zeroNum;i++){
      //     returnValue += '0'
      //   }
      //   returnValue += money1
      //   console.log(returnValue);
      // }else{
      //   let money1 = money.toString()
      //   var zeroNum = 10 - money1.length
      //   var returnValue = ''
      //   for(var i= 0;i<zeroNum;i++){
      //     returnValue += '0'
      //   }
      //   returnValue += (money1+'00')
      //   console.log(returnValue);
      // }

      var arrayNum = money.toString().split(".");
      if (arrayNum.length == 1) {
        let money1 = arrayNum[0].toString()
        var zeroNum = 10 - money1.length
        var returnValue = ''
        for(var i= 0;i<zeroNum;i++){
          returnValue += '0'
        }
        returnValue += (money1+'00')
        console.log(returnValue);
        return returnValue
      }
      if (arrayNum.length > 1) {
        //小数点右侧 如果小于两位则补一个0
        if ( arrayNum[1].length < 2) {
          arrayNum[1] += '0'
          var returnValue = ''
          var money1 = arrayNum[0] + arrayNum[1]
          var zeroNum = 12 - money1.length
          for(var i= 0;i<zeroNum;i++){
            returnValue += '0'
          }
          returnValue += money1
          console.log(returnValue);
          return returnValue
        }else{
          //小数点右侧 等于两位
          var returnValue = ''
          var money1 = arrayNum[0] + arrayNum[1]
          var zeroNum = 12 - money1.length
          for(var i= 0;i<zeroNum;i++){
            returnValue += '0'
          }
          returnValue += money1
          console.log(returnValue);
          return returnValue
        }
      }
    },
    // pos机收费成功回调
    posCharge(){
       let params = {
        busicode: 'PosOrderCharge',
        data: {
          order: this.orderNum
        }
      }
      this.$api.fetch({
        params,//参数
      })
      .then(res => { //销账成功
        this.$message({
          message: "销账成功！",
          type: "success"
        });
        this.cardDepositNameVisible = false;
        this.cardSwipingVisible = false;
        this.cardPayingVisible = true
        this.search()
      });
    },
    // pos机收费失败回调
    posFailCharge(){
      this.cardDepositNameVisible = false;
      this.cardSwipingVisible = false;
      this.cardPayingVisible = true
    },


    getIsQrCodeAlipay () {//获取支付宝电子屏二维码配置
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'ALIPAY_OR_NOT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length && res.list[0].configValue == "1") {//为1则启用
            _this.isAliPay = true;
          }
        })
    },
    getIsQrCodeWeChat () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WECHAT_OR_NOT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length && res.list[0].configValue == "1") {
            _this.isWechatPay = true;
          }
        })
    },
    payWayChange (val) {
      clearTimeout(window.pollTimer);
      if (val === 'cash') {
        return;
      }
      if (webSocket.readyState != webSocket.OPEN) {
        this.$message({
          message: '请正确连接设备或设备驱动未启动，请检查',
          type: 'error'
        });
        this.paidAndClose();
        return;
      }

      //清除计时器轮询状态
      this.gwq.GWQ_CancelOperate(); //关闭电子屏支付页
      if (window.gwqConnFail) {
        window.gwqConnFail = false;
        return;
      }
      let verification = this.selectData.map(item => {
        return { billId: item.id };
      })
      let params = {
        busicode: val === 'wechat' ? 'WeChatPayWay' : 'AliPayWay',
        data: {
          paymentType: -1,
          isPrestore: this.receivableTotal == 0 ? 1 : 0,
          groupCode: localStorage.getItem('companyNo'),
          accountNo: this.selectData.length ? this.selectData[0].userNo : this.ctmInfoData.accountNo,
          payType: val === 'wechat' ? 2 : 3,
          payMoney: this.chargeAmount,
          verification,
          feeType: 1,
          payChannel: 4,
          payWay: this.payWay,
        }
      }
      let that = this;
      window.pollTimer = null;
      function queryStatus () {
        window.clearTimeout(window.pollTimer)
        axios({//使用axios，不显示加载中弹窗
          method: 'post',
          url: 'interface.api',
          withCredentials: true,
          timeout: 0,
          hideLoading: true,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "token": sessionStorage.getItem('token')
          },
          data: {
            busicode: val === 'wechat' ? 'WeChatResultQuery' : 'aliResultQuery',
            token: sessionStorage.getItem('token'),
            sysType: "002",
            data: {
              order: params.order,
              groupCode: params.groupCode,
              accountNo: params.accountNo,

            }
          },

        }).then((res) => {
          res = res.data.data;
          if (res.payStatus == 0) {
            if (val)
              window.pollTimer = setTimeout(() => {
                return queryStatus(); //轮询查询支付状态3s
              }, 3000)
          }
          if ((res.payStatus == 2) || (res.payStatus == 1)) { //支付成功，关闭弹窗
            that.paySucceed = true;
            window.pollTimer && window.clearTimeout(window.pollTimer)
            that.chargeShow = false
            that.getInvoiceTypes();
            that.getChargeData();
            that.getDictionary();
            that.printInvoice();
            that.isFuzzyQueryFocus = true;
            that.search()

            that.balanceMoney = 0;
            setTimeout(() => {
              that.gwq.GWQ_CancelOperate();
              that.paidAndClose();

            }
              , 5000)
          }

        })
      }

      that.$api
        .fetch({
          params,//参数
        })
        .then(res => { //获取支付链接和订单信息
          params = params.data;
          params.order = res.order;
          console.log(res)
          window.delayTimer = null;
          window.clearTimeout(window.delayTimer);
          window.delayTimer = setTimeout(() => {
            if (val === 'ali' && this.isAliPay) { //支付宝支付
              //   window.open('http://10.11.227.231:8083/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params))+'&qrcodeUrl='+encodeURI(res.url))
              //  //调用跳转电子屏页面中生成二维码
              //线上地址
              this.gwq.GWQ_OpenURL(location.origin+'/css2/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params)) + '&qrcodeUrl=' + encodeURI(res.url))

            }
            if (val === 'wechat' && this.isWechatPay) {//微信支付

              //  window.open('http://10.11.227.231:8083/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params))+'&qrcodeUrl='+encodeURI(res.url));
             
              this.gwq.GWQ_OpenURL(location.origin+ '/css2/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params)) + '&qrcodeUrl=' + encodeURI(res.url))
            }

          }, 1000);
          queryStatus();//开始轮询支付的状态
        });
    },

    changePayMethod (val) {
      if (val === '1') {
        this.disabledBackChange = false
      } else {
        this.disabledBackChange = true
        this.balanceWay = '2'
      }
      this.calcTableData()
    },

    changeBalanceWay (val) {
      this.calcTableData()
    },

    printChange (val) {
      if (val === '1') {
        this.printChangeModel = true;
        this.PrintingModel1 = false;
      } else {
        this.printChangeModel = false;
      }

    },
    // 已收现/取消按钮
    paidAndClose () {
      if ((this.payWay == "wechat" || this.payWay == "ali") && window.gwqConnFail == false) {
        this.gwq.GWQ_CancelOperate(); //关闭电子屏支付页
      }
      this.chargeShow = false
      this.payWay = 'cash';
      this.paySucceed = false;

      window.pollTimer && window.clearTimeout(window.pollTimer); //清除计时器轮询状态


    },
    enterKeyDown (e) {
      if (e.keyCode === 13) {
        this.charge()
      }
    },
    // 打开交互机
    async gojiaohuji () {
      if (!this.tableQuery.fuzzyQuery || this.tableQuery.fuzzyQuery.length === 0) {
        this.$message({
          message: '请输入户号！',
          type: 'warning'
        });
        return
      }
      console.log(Number(this.receivableMoney));
      // 余额>应收
      if (((Number(this.ctmInfoData.accountBalance) > Number(this.receivableMoney))) && Number(this.chargeAmount) !== 0 && Number(this.receivableMoney) !== 0) {
        this.$message({
          message: '当前余额充足，请先抵扣余额！',
          type: 'warning'
        });
        return
      }

      if (Number(this.chargeAmount) < 0 || isNaN(Number(this.chargeAmount))) {
        this.$message({
          message: '请输入正确的收取金额！',
          type: 'warning'
        });
        return
      }

      // 转账
      if (this.payMethod == '6' || this.payMethod == '7' || this.payMethod == '10') {
        if (Number(this.chargeAmount) < Number(this.receivableTotal)) {
          try {
            await this.$confirm('您输入的金额小于应缴金额, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          } catch (e) {
            console.error(e)
            this.$message({
              type: 'info',
              message: '已取消收费！'
            })
            return
          }
        }
      } else if (this.payMethod == '1') {
        // 现金 找零 收取金额不能小于应缴金额
        if (this.balanceWay == '1' && Number(this.chargeAmount) < Number(this.receivableTotal)) {
          this.$message({
            message: '请输入正确的收取金额！',
            type: 'warning'
          });
          return
        }
        if (this.balanceWay == '2') {
          // 现金 结存 判断向上向下取整
          if (this.balanceToNumberWay == '2') { // 向下取整 收取金额不小于应缴金额的向下取整值
            if (Number(this.chargeAmount) < Math.floor(Number(this.receivableTotal))) {
              this.$message({
                message: '请输入正确的收取金额！',
                type: 'warning'
              });
              return
            }
          } else { // 向上取整 收取金额不小于应缴金额
            if (Number(this.chargeAmount) < Number(this.receivableTotal)) {
              this.$message({
                message: '请输入正确的收取金额！',
                type: 'warning'
              });
              return
            }
          }
        }
      } else { // 其他缴费方式 收取金额不小于应缴金额
        if (Number(this.chargeAmount) < Number(this.receivableTotal)) {
          this.$message({
            message: '请输入正确的收取金额！',
            type: 'warning'
          });
          return
        }
      }

      if (this.payMethod == "10" && this.isCashDeposit) {//刷卡或转账
        this.cashDepositNameVisible = true;
        return;
      }
      if (this.payMethod == "7") {//刷卡
        this.cardDepositNameVisible = true;
        if (this.isConnectPOS) {
          this.cardSwipingVisible = true
          this.cardPayingVisible = false
          this.pos.connectError = false
          this.pos.isConnect = false
          this.checkConnectServer()
        }
        return;
      }
      this.chargeShow = true
      this.$refs.chargeInput.blur()
      setTimeout(() => {
        document.addEventListener('keypress', this.enterKeyDown)
      }, 50)

      // this.chargeContent = `请付费${this.chargeAmount}元`
      // setTimeout(() => {
      //   this.$refs.chargeContent.focus()
      // }, 100);

      if (this.payWay == "ali" || this.payWay == "wechat") {
        this.gwq.GWQ_CancelOperate(); //关闭电子屏支付页
      }


      function myBrowser () {

        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        // console.log(userAgent);
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
          return "Opera"
        } //判断是否Opera浏览器
        else if (userAgent.indexOf("Firefox") > -1) {
          return "FF";
        } //判断是否Firefox浏览器
        else if (userAgent.indexOf("Edge") > -1) {
          return "Edge";
        } 	//判断是否Safari浏览器
        else if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
        }
        else if (userAgent.indexOf("Safari") > -1) {
          return "Safari";
        }
        else {
          return "IE";
        } //判断是否IE浏览器
      }

    },
    // 获取缴费状态
    getChargeStatus () {
      let _this = this;
      let params = {
        busicode: "resultQuery.htm",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.invoiceTypes = res.invoiceTypes;
        });
    },
    // 获取票据提醒字段
    getInvoiceTypes () {
      let _this = this;
      let params = {
        busicode: "InvoicesTypeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.invoiceTypes = res.invoiceTypes;
        });
    },
    // 获取收费项目数据
    getChargeData () {
      let _this = this;
      _this.chargeData = []
      _this.chargeClickData = []
      let params = {
        busicode: "WorkbenchCostList",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.workbenchCostSelect = res.workbenchCostSelect
          _this.chargeData = [];
          _this.chargeClickData = [];
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].used) {
              _this.chargeData.push(res.list[i]);

            }
            // if(!res.workbenchCostSelect){
            _this.chargeClickData.push(res.list[i].costNo);
            // }
          }
        });
    },
    // 收费项目勾选方法
    chargeClickMethod (itemList) {
      this.canCalc = true;
      this.unAbleToCalc = true;
      let _this = this;
      // 获取所有勾选数据id
      let allItemList = [];
      for (let i = 0; i < this.chargeData.length; i++) {
        allItemList.push(this.chargeData[i].costNo);
      }
      // 勾选
      let itemListCount = itemList.length;
      let selectCount = this.selectData.length;
      let selectDataPeriod = []; // 手动勾选列表的账期
      if (selectCount > 0) {
        for (let x = 0; x < selectCount; x++) {
          if (selectDataPeriod.indexOf(this.selectData[x].accountPeriod) == -1) {
            selectDataPeriod.push(this.selectData[x].accountPeriod);
          }
        }
        selectDataPeriod.sort(); // 账期从小到大排序
      }
      for (let i = 0; i < itemListCount; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (itemList[i] == this.tableData[j].costNo && this.tableData[j].diyFlag !== 1 && this.tableData[j].diyFlag !== 2) {
            if (this.isAccountPeriodLock && this.isAccountPeriodLockData()) { // 锁定账期区间，且已勾选的列表在锁定账期区间内，则切换收费项目时只勾选账期区间内的列表数据
              if (this.tableData[j].accountPeriod >= this.accountPeriodLockVal[0] && this.tableData[j].accountPeriod <= this.accountPeriodLockVal[1]) {
                this.$refs.table.toggleRowSelection(this.tableData[j], true);
              }
            } else if (selectCount != 0) { // 手动勾选列表，且已勾选的列表数据在锁定账期区间以外，则切换收费项目时就勾选所有已勾选的列表数据
              if (this.tableData[j].accountPeriod >= selectDataPeriod[0] && this.tableData[j].accountPeriod <= selectDataPeriod[selectDataPeriod.length - 1]) {
                this.$refs.table.toggleRowSelection(this.tableData[j], true);
              }
            } else { // 未锁定账期区间，且未手动勾选列表，则切换收费项目时默认勾选全部列表数据
              this.$refs.table.toggleRowSelection(this.tableData[j], true);
            }
          }
        }
      }
      // 取交集
      let jiao = allItemList.filter(item => !new Set(itemList).has(item));
      // 取消勾选
      for (let i = 0; i < jiao.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (jiao[i] == this.tableData[j].costNo) {
            this.$refs.table.toggleRowSelection(this.tableData[j], false);
          }
        }
      }
      this.unAbleToCalc = false;
      if (!this.canCalcFlag) {
        this.calcTableData()
      }

    },
    isAccountPeriodLockData () { // 判断选中列表是否属于锁定账期之间的数据
      let result = true;
      if (this.isAccountPeriodLock) {
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].accountPeriod < this.accountPeriodLockVal[0] || this.selectData[i].accountPeriod > this.accountPeriodLockVal[1]) {
            result = false;
            break;
          }
        }
      } else {
        result = false
      }
      return result;
    },
    handleSelect (selection, row) {
        // console.log(selection, row)
      this.$nextTick(() => {
        const meterReadingId = row.meterReadingId
        const useWaterType = row.useWaterType
        const userNo = row.userNo
        if (selection.some(select => select.id === row.id)) {
          this.tableData.forEach(item => {
            if (item.meterReadingId === meterReadingId && item.useWaterType === useWaterType && item.userNo === userNo) {
              this.$refs.table.toggleRowSelection(item, true)
            }
          })
        } else {
          this.tableData.forEach(item => {
            if (item.meterReadingId === meterReadingId && item.useWaterType === useWaterType && item.userNo === userNo) {
              this.$refs.table.toggleRowSelection(item, false)
            }
          })
        }
      })
    },
    selectable (row) {
      return row.diyFlag !== 1 && row.diyFlag !== 2 && this.workbenchCostSelect
    },
    // 获取数据字典数据
    getDictionary () {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "BPG" // 收费方式
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 收费按钮
    charge: throttle(function () {

      let _this = this;
      // 获取列表已勾选的数据id数组
      let ids = [];
      _this.$refs.table.selection.forEach(item => {
        ids.push(item.id);
      });
      let params = {
        busicode: "ChargeMoney",
        data: {
          ids: ids, //主键
          accountNo: this.ctmInfoData.accountNo, //账户编号
          payMethod: this.payMethod, //收费方式
          balanceWay: this.balanceWay, //结存方式
          receivableAmount: this.receivableTotal, //应收金额
          chargeAmount: this.chargeAmount, //收取金额
          changeMoney: this.changeMoney, //找零金额
          balanceMoney: this.balanceMoney, //结存金额
          // comments: this.comments //备注
        }
      };
      if (this.cashDepositNameVisible) {
        let formData = this.$refs.BankCheck.getFormData();
        if (formData) {
          params.data.incomeBank = formData.incomeBank;
          //   params.data.bankStatement = formData.bankStatement;
          //  params.data.billPicture = formData.billPicture;
        } else {
          return;
        }

      }
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "收费成功！",
            type: "success"
          });
          // this.gwq.GWQ_CancelOperate()
          this.chargeShow = false
          this.getInvoiceTypes();
          this.getChargeData();
          this.getDictionary();
          this.printInvoice();
          // if (res != null && res != '')
            // this.printDZFP(res);//单户开具电子发票
          if (res != null && res != '')
            this.printReceipt(res);//打印收据
          // this.tableData = []
          this.isFuzzyQueryFocus = true;
          this.search()
          this.balanceMoney = 0;
          // this.comments = ''
          if (this.cashDepositNameVisible) {
            this.cashDepositNameVisible = false;
          }
          if (this.cardDepositNameVisible) {
            this.cardDepositNameVisible = false;
            this.cardSwipingVisible = false;
            this.cardPayingVisible = true
          }
          //收费后默认选择现金
          this.payMethod = '1'
          // this.balanceWay = '1'
          this.changePayMethod('1')
        })
        .catch(err => {
          // this.gwq.GWQ_CancelOperate()
          this.chargeShow = false
        });
    }, 5000),
    printReceipt (serialNo) {//打印收据

      let _this = this
      // if(_this.PrintingModel == 1){ //不打印

      //   return;
      // }
      if(this.checkedPrint.indexOf("SJDY") == -1){ // 没有勾选不打印
        return;
      }
      // if (_this.showReceiptButton == false) // 打印收据为动态配置,如果不显示则不打印;
        // return;


      let sendata = []
      // let userData = []

      if (_this.$refs.table.selection.length <= 0) {
        return;
      }

      // _this.$refs.table.selection.forEach((item)=>{
      //     if(!userData.find(sdata => sdata.userNo === item.userNo )){
      //       userData.push({userNo:item.userNo});
      //     }
      // })
      // if(userData.length>1)
      //   return;

      _this.$refs.table.selection.forEach((item) => {
        if (!sendata.find(sdata => sdata.userNo === item.userNo && sdata.accountPeriod === item.accountPeriod)) {
          sendata.push({ userNo: item.userNo, accountPeriod: item.accountPeriod, serialNo: serialNo });
        }

      })

      if (sendata != undefined && sendata.length >= 1) {

        let params = {
          busicode: 'ReceiptPrint',
          data: {
            // isTogether: 1,
            isTogether: _this.PrintingModel1 ? 1 : 0,
            list: sendata
          }
        };
        _this.$api.fetch({
          params: params,//参数

        }).then(res => {
          _this.common.print('print', 'ReceiptPrint', '', res, _this);
        })
      }
    },
    printDZFP (serialNo) {    //单户开通电子发票
      let _this = this
      let sendata = []
      // let userData = []
      let isTogether = 1;

      if (_this.autoZbsfButton == false)
        return;

      // if(_this.PrintingModel1==true)    //若勾选合打
      //     isTogether = 1;
      let data = {
        isTogether: isTogether,
        reprint: 0,
        invoiceType: 'ZBSF',
        chargeFlag: 1,
        beginCharge: '',
        endCharge: '',
        fuzzyQuery: '',
      }
      _this.$refs.table.selection.forEach((item) => {
        if (!sendata.find(sdata => sdata.userNo === item.userNo && sdata.accountPeriod === item.accountPeriod)) {
          sendata.push({ userNo: item.userNo, accountPeriod: item.accountPeriod, serialNo: serialNo });
        }
        //  if(!userData.find(sdata => sdata.userNo === item.userNo )){
        //   userData.push({userNo:item.userNo});
        // }
      })
      if (sendata != undefined && sendata.length == 1) {
        data.list = sendata
        let params = {
          "busicode": "FctYCInvoicePrint",
          "data": data
        }
        _this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.$notify({
            title: '成功',
            message: '开具电子发票成功',
            type: 'success'
          })
        })
      }

    },
    printInvoice () {
      //0：衔头发票 1：电子发票
      let _this = this
      let sendata = []
      let arr = this.checkedPrint.filter(item => { // 去除收据打印,发票打印都走FctYCInvoicePrint接口
        return item != "SJDY"
      })
      
      if(arr.length > 0){
        arr.forEach(item => {
          console.log('item', item)
          let data = {
            isTogether: _this.PrintingModel1 === true ? 1 : 0,
            reprint: 0,
            invoiceType: item,
            chargeFlag: 1,
            beginCharge: '',
            endCharge: '',
            fuzzyQuery: '',
          }
          _this.$refs.table.selection.forEach((item) => {
            if (!sendata.find(sdata => sdata.userNo === item.userNo && sdata.accountPeriod === item.accountPeriod)) {
              sendata.push({ userNo: item.userNo, accountPeriod: item.accountPeriod });
            }
          })
          data.list = sendata
          let params = {
            "busicode": "FctYCInvoicePrint",
            "data": data
          }
          _this.$api.fetch({
            params: params,//参数
          }).then(res => {
            console.log('Print res', res)
            let data = res
              this.$notify({
                title: '成功',
                message: '正在打印...',
                type: 'success'
              })
            data.forEach(element => {
              if (element.type === 1) {
                let ZBSFinvoiceAddr = JSON.parse(JSON.stringify(element.key))
                if (ZBSFinvoiceAddr.indexOf('http://59.37.13.30:8095') !== -1) {
                  ZBSFinvoiceAddr = ZBSFinvoiceAddr.replace('http://59.37.13.30:8095/download/', this.invoiceTurnUrl)
                }
                setTimeout(() => {
                  window.open(ZBSFinvoiceAddr, '_blank') //这个方法key要是https才行呀 不得劲
                }, 2000)
              } else if (element.type === 0) {
                this.common.print('print', 'SewageInvoicePrint', '', element.key, this);
              }
            });
          })
        })
      }
    },
    // 计算结存、找零
    calculation (num) {
      // num = this.chargeAmount(收取金额)，this.receivableTotal(应收金额),this.changeMoney(找零)this.balanceMoney(结存)
      // balanceWay: 1.找零，2.剩余结存
      // balanceToNumberWay: '1'向上；'2'向下
      if (this.balanceWay == '1') {
        this.changeMoney = Number(num) - Number(this.receivableTotal)
        this.balanceMoney = 0
      } else {
        this.balanceMoney = Number(num) - Number(this.receivableTotal)
        this.changeMoney = 0
      }

      this.balanceMoney = this.balanceMoney.toFixed(2);
      this.changeMoney = this.changeMoney.toFixed(2)

    },

    // 列表勾选事件
    handleSelectionChange (val) {
      this.selectData = val

      // 重新刷新列表以便重新合计
      this.showSum = false;
      this.$nextTick()
        .then(() => {
          this.showSum = true;
        })

      // 当默认勾选所有数据执行完毕，此代码控制下面代码块启动
      if (this.selectData.length == this.tableData.length) {
        this.tableAndChargeShow = true
      }

      if (this.tableAndChargeShow && this.workbenchCostSelect) {
          // 去除列表关联收费项目
        // 列表勾选与取消勾选与收费项目字段联通，例：当列表上所有水费手动取消勾选时，收费项目上的水费勾选取消
        // for (let i = 0; i < this.chargeClickData.length; i++) {
        //   for (let j = 0; j < this.selectData.length; j++) {
        //     if (this.chargeClickData[i] == this.selectData[j].costNo) {
        //       break
        //     } else if (this.chargeClickData[i] != this.selectData[j].costNo && j == this.selectData.length - 1) {
        //       this.chargeClickData.splice(i, 1);
        //     }
        //   }
        // }
        // 勾选列表中其中一个水费，也会引起收费项目中的水费处于勾选状态（许海宜要求）
        // for (let i = 0; i < this.selectData.length; i++) {
        //   for (let j = 0; j < this.chargeData.length; j++) {
        //     if (this.selectData[i].costNo == this.chargeData[j].costNo) {
        //       this.chargeClickData.push(this.selectData[i].costNo)
        //       break
        //     } else if (this.selectData[i].costNo != this.chargeData[j].costNo && j == this.chargeData.length - 1) {
        //       break
        //     }
        //   }
        // }
      }
      if(this.isChargeAllClick && this.selectData.length == this.tableData.length){ // 首次点击搜索时，默认收费项目全部勾选
        this.chargeClickData = this.chargeData.map(item => {
            return item.costNo
        })
        this.isChargeAllClick = false;
      }else{
          if(this.selectData.length == 0 && this.workbenchCostSelect != 0){ // 选中数据列表为空，直接取消勾选全部收费项目（收费项目本身全为不可选时，不清空）
            // this.chargeClickData = []
          }else{
            // this.chargeClickData = Array.from(new Set(this.chargeClickData))
          }
      }
      if (this.unAbleToCalc) { // 选择收费项目时，无需立即合计，改变列表数据勾选状态后再统一计算
        return
      }
      if (!this.canCalcFlag) {
        this.calcTableData()
      }
    },
    check () {
      this.FlowingTableVisible = true;
    },
    detailsClick (val) {
      if (this.BreachOfContract) {
        this.tabMore = "el-icon-d-arrow-right";
        this.BreachOfContract = false;
      } else {
        this.tabMore = "el-icon-d-arrow-left";
        this.BreachOfContract = true;
      }
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (column.label === "NO." ||
        column.property === 'type' ||
        column.label === "用户" ||
        column.label === "用水类型" ||
        column.label === "账期" ||
        column.label === "计费水量" ||
        column.label === "欠费合计" ||
        column.label === "上期抄码" ||
        column.label === "本期抄码" ||
        column.label === "增减水量" ||
        // column.label === "违约天数" ||
        column.label === "应缴合计" ||
        column.property === "deductBalanceAll" ||
        // column.label === "上期余额" ||
        // column.label === "结存余额" ||
        column.property === 'lvalue') {
        if (row.rowspan != 0) {
          return {
            rowspan: row.rowspan || 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }; return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    // getSummaries(param) {
    //   return;
    //   // 勾选数据重新合计
    //   param.data = this.selectData
    //   const { columns, data } = param;
    //   const sums = [];
    //   let handleData = [
    //     "违约金",
    //     "应缴合计"
    //   ];
    //   columns.forEach((column, index) => {
    //     if (index === 0) {
    //       sums[index] = "合计";
    //       return;
    //     }

    //     const values = data.map(item => Number(item[column.property]));
    //     if (handleData.includes(column.label)) {
    //       sums[index] = values.reduce((prev, curr) => {
    //         const value = Number(curr);
    //         if (!isNaN(value)) {
    //           return prev + curr;
    //         } else {
    //           return prev;
    //         }
    //       }, 0);
    //       sums[index] = sums[index].toFixed(2);
    //       sums[index] += "";
    //     } else {
    //       sums[index] = "";
    //     }
    //   });
    //   return sums;

    // },

    tableRowClass ({ row, rowIndex }) {
      const className = ['', 'table-row-light-blue', 'table-row-red', 'table-row-green', 'table-row-purple', 'table-row-dark-blue', 'table-row-yellow']
      return className[row.diyFlag]
    },

    closeDialog () {
      //关闭会话
      this.UserInformationShow = false;
      this.DailyReceiptInquiry = false;
      this.InvoiceReplacement = false;
      this.UnsettledAccountsStatistics = false;
      this.CancellationCharges = false;
      this.CancellationChargeAuthorization = false;
      this.waterAddVisible = false;
      this.countManagementVisible = false;
      this.PredepositDdetailsVisible = false;
      this.EngineeringRegistrationVisible = false;
      this.DiscontinueUseVisible = false;
      this.multiplexingVisible = false;
      this.TransferVisible = false;
      this.SalesAccountVisible = false;
      this.BusinessQuery = false; //业务查询
      this.DataChangeVisible = false; //资料变更
      this.TypesOfWaterUseVisible = false; //用水类型变更
      this.BalanceTransfer = false; //余额过户
      this.BalanceWithdrawal = false; //余额取出
      this.TypesOfWaterUseVisible = false; //用水类型变更
      this.PreferentialWaterUseVisible = false; //优惠变更
      this.PaymentMethodVisible = false; //优惠变更
      this.ComparisonTableVisible = false; //校表
      this.redFlushAdjustVisible = false;//红冲
      this.ChargeReportOfFlowDetailVisible = false;//收费查询
      this.CustomerChangeVisible = false; //
      this.QuickChangeVisible = false; //快速变更
      this.InvoiceSplittingVisible = false; //发票分票
      this.multipleUserVisible = false; //多户查询
      this.WorkOrderRegistration = false; //工单登记
      this.cashDepositNameVisible = false;
      this.cardDepositNameVisible = false;//刷卡
      this.mobileInfoVisible = false //修改手机号码
      this.accountPeriodFilterVisible = false;
      this.isIncorporativeVisible = false;
      this.lockIcon = this.isAccountPeriodLock ? 'el-icon-lock' : 'el-icon-unlock'; // 取消修改恢复锁定按钮样式
    },
    searchWorkOrder(){
      this.WorkOrderQuery = true;
    },
    closeWorkOrderQueryDialog(){
      this.WorkOrderQuery = false;
    },
    //弹出框
    submit (pageName) {
      //提交
      if (pageName == "UnsettledAccountsStatistics") {
        // 现金缴存
        this.$refs.UnsettledAccountsStatistics.submit();
      } else if (pageName == "BalanceTransfer") {
        // 余额过户
        this.$refs.BalanceTransfer.save();
      } else if (pageName == "BalanceWithdrawal") {
        // 余额取出
        this.$refs.BalanceWithdrawal.save();
      } else if (pageName == "CustomerChangeVisible") {
        // 资料变更
        this.$refs.CustomerChangeVisible.submit('ChangeUserAdd');
      } else if (pageName == "ComparisonTableVisible") {
        // 资料变更
        this.$refs.ComparisonTableVisible.save()
      } else if (pageName == "DiscontinueUse") {
        // 用户停用
        this.$refs.DiscontinueUse.submit('StopUserAdd')
      } else if (pageName == "multiplexing") {
        // 用户复用
        this.$refs.multiplexing.submit('ReuseUserAdd')
      } else if (pageName == "WorkOrderRegistration") {
        // 工单登记
        this.$refs.WorkOrderRegistration.submit()
      } else if (pageName === 'quickChange') {
        // 快速变更
        this.$refs.childQuickChange.submit('integratedBusiness')
      } else if (pageName === 'childWaterEditor') {
        // 用水咨询
        this.$refs.childWaterEditor.save()
        this.closeDialog()
      } else if (pageName === 'Transfer') {
        // 用户过户SalesAccount
        this.$refs.Transfer.submit('TransferUserAdd')
      } else if (pageName === 'SalesAccount') {
        // 用户销户
        this.$refs.SalesAccount.submit('CloseUserAdd')
      } else if (pageName === 'redFlushAdjust') {
        // 红冲
        this.$refs.redFlushAdjust.submit('FnRedRushAdd')
      } else if (pageName === 'cashDeposit' || pageName === 'cardDeposit') {
        this.charge();
      } else if (pageName === 'ChargeReportOfFlowDetail') {
        this.$refs.ChargeReportOfFlowDetail.init()
      }
    },
    // 用户信息查询
    userInfoSearch (currentLabel, name, userNo) {
      if (/^[a-zA-Z]/g.test(name)) {
        this.UserInformationName = currentLabel;
        this.currentName = name;
        this[name] = true;
        if (name == 'UserInformationShow') {
          this.formDataUserNo = userNo
          // } else if (name == 'CustomerChangeVisible') {// 资料变更
          //   this.CustomerChangeVisibleEditNeedData.idCuster.userNo = this.tableQuery.fuzzyQuery
        }
      } else if (/^\//g.test(name)) {
        this.$router.push({ path: name });
      }
      // this.rightBtnsEvents.forEach((item)=>{
      //     if(/^\//g.test(name))
      //     if(name==item.name){
      //         this[item.name] = true;
      //     }
      // })
    },
    //获取收据显示开关
    showReceipt () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_PRINT_SHOWRECEIPT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.showReceiptButton = res.list[0].configValue == 1 ? true : false;
          }
        })
    },
    //获取收据自动打印开关
    autoReceipt () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_PRINT_RECEIPT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length > 0) {
            this.autoReceiptButton = res.list[0].configValue == 1 ? true : false;
          }
        })
    },
    //获取电子发票自动打印开关
    autozbsf () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_PRINT_ZBSF',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length > 0) {
            this.autoZbsfButton = res.list[0].configValue == 1 ? true : false;
          }
        })
    },
    //获取结存方式
    showBalanceMethod () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_BALANCE_METHOD',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.balanceWay = res.list[0].configValue;
          }
        })
    },
    //获取结存方式
    balanceToNumber () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_CHARGE_ROUND_WAY',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.balanceToNumberWay = res.list[0].configValue;
          }
        })
    },
    //获取每户单独计算取整
    everyoneUserRound () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_EVERYONE_USER_ROUND_WAY',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.everyoneUserRoundWay = res.list[0].configValue;
          }
        })
    },
    //获取打印选项
    showPrintItem () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_PRINT_ITEM',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.PrintingModel = res.list[0].configValue;
          }
        })
    },
    //搜索后选中的客户、账户、用户
    chargeQuery (data) {
      if (this.isNeedReplace) {
        this.tableQuery.fuzzyQuery = data
      }
      let str = data.replaceAll('，', ',').replaceAll(' ', '').replaceAll(',,,,,', ',').replaceAll(',,,,', ',').replaceAll(',,,', ',').replaceAll(',,', ',').trim();
      let useNos = str.split(',')

      if (useNos && useNos.length > 0) {
        let dataNos = []
        useNos.forEach(item => {
          if (dataNos.indexOf(item) === -1) {
            dataNos.push(item)
          }
        })
        if (this.isNeedReplace) {
          this.tableQuery.fuzzyQuery = dataNos.join(',')
        }
        data = dataNos.join(',')
      }
      this.isNeedReplace = true
      this.mobileQueryDialog = true  //判断手机号码是否为空，初始界面不显示
      let _this = this;
      this.tableAndChargeShow = false
      let params = {
        busicode: "ChargeQuery",
        data: {
          fuzzyQuery: data
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          this.disabledBackChange = false//若不为纯预存，则两种结存方式都可选择
          // console.log(this.formQueryUserNo)
          // 获取当前水司编号
          this.groupCode = res.curWaterCode
          this.isChargeAllClick = true;
          // 列表数据
          //   console.log('res' + res.minPeriod + ', ' + res.maxPeriod)
          if (this.isAccountPeriodLock) {
            this.accountPeriodFilterVal = this.accountPeriodLockVal;
          } else {
            this.accountPeriodFilterVal = [res.minPeriod, res.maxPeriod];
          }
          for (let i = 0; i < _this.tableData.length; i++) {
            this.$refs.table.toggleRowSelection(_this.tableData[i], false)
          }

          _this.tableData = res.chargeDetails;
          // 用户编号
          this.formDataUserNo = res.ctmInfo.ctmNo;//获取账户编号
          // this.formQueryUserNo = res.accountList[0].users[0] //获取用户编号
          //不在过滤负数
          //this.deductBalanceAccountList = res.accountList.filter(item => Number(item.accountBalance) > 0)
          this.deductBalanceAccountList = res.accountList
          // 处理数据，从后向前遍历
          for (let i = _this.tableData.length - 1; i > 0; i--) {
            // 设置初始值
            if (!_this.tableData[i].rowspan) {
              _this.tableData[i].rowspan = 0;
              _this.tableData[i].receivableTotalByMonth = _this.tableData[i].receivableTotal;
              _this.tableData[i].arrearageTotal = _this.tableData[i].receivableMoney;
            }
            // 当前抄表主键和用水类型,以及用户编号相同时
            if (_this.tableData[i].meterReadingId == _this.tableData[i - 1].meterReadingId && _this.tableData[i].useWaterType == _this.tableData[i - 1].useWaterType && _this.tableData[i].userNo == _this.tableData[i - 1].userNo) {
              // 设置rowspan
              if (_this.tableData[i].rowspan == 0) {
                _this.tableData[i].rowspan = 1;
              }
              _this.tableData[i - 1].rowspan = _this.tableData[i].rowspan + 1;
              _this.tableData[i].rowspan = 0;
              // 合计应缴
              _this.tableData[i - 1].receivableTotalByMonth = Number(_this.tableData[i - 1].receivableTotal) + Number(_this.tableData[i].receivableTotalByMonth);
              _this.tableData[i].receivableTotalByMonth = 0;
              // 保留2位小数
              _this.tableData[i - 1].receivableTotalByMonth = Number(_this.tableData[i - 1].receivableTotalByMonth).toFixed(2);
              //欠费合计
              _this.tableData[i - 1].arrearageTotal = Number(_this.tableData[i - 1].receivableMoney) + Number(_this.tableData[i].arrearageTotal);
              _this.tableData[i].arrearageTotal = 0;
              // 保留2位小数
              _this.tableData[i - 1].arrearageTotal = Number(_this.tableData[i - 1].arrearageTotal).toFixed(2);
            } else {
              if (_this.tableData[i].rowspan == 0) {
                _this.tableData[i].rowspan = 1;
              }
            }
            //
          }
          //当第一条不是合并数据
          if (!_this.tableData[0].rowspan) {
            _this.tableData[0].rowspan = 1
            _this.tableData[0].arrearageTotal = Number(_this.tableData[0].receivableMoney).toFixed(2);
          }

          let index = 0
          for (let i = 0; i < _this.tableData.length; i++) {
            if (_this.tableData[i].rowspan && _this.tableData[i].rowspan > 0) {
              _this.tableData[i].index = ++index
            }
            this.$refs.table.toggleRowSelection(_this.tableData[i], false)

            // 去除水量小数点
            _this.tableData[i].calculateWater = parseInt(Number(_this.tableData[i].calculateWater))
            _this.tableData[i].addWater = parseInt(Number(_this.tableData[i].addWater))
          }

          // 客户信息数据
          _this.ctmInfoData = res.ctmInfo;
          // 客户用户编号
          _this.ctmInfoUserNo = res.userNo;
          _this.stopWaterLinkMobile = res.stopWaterLinkMobile
          _this.mobileQueryDialog = true  //判断手机号码是否为空，初始界面不显示
          // 默认全部勾选列表数据
          //::start 新增点击搜索默认选中所有
          let chargeData = _this.chargeData;
          if (this.workbenchCostSelect) {
            _this.chargeClickData = [];
            for (let i = 0; i < chargeData.length; i++) {
              if (chargeData[i].used) {
                for (let j = 0; j < this.tableData.length; j++) {
                  if (chargeData[i].costNo == this.tableData[j].costNo)
                    _this.chargeClickData.push(chargeData[i].costNo);
                }

              }
            }
            _this.chargeClickData = Array.from(new Set(_this.chargeClickData))
          }
          //::end
          setTimeout(() => {
            this.$refs.chargeInput.focus()
            _this.chargeClickMethod(_this.chargeClickData);
            if (this.isFuzzyQueryFocus) { //收费完后需要光标移入查询框
              this.$refs.fuzzyQuerySearch.focus();
              this.$nextTick(() => {
                this.$refs.fuzzyQuerySearch.select()
              });
              this.isFuzzyQueryFocus = false;
            } else {
              this.$nextTick(() => {
                this.$refs.chargeInput.select()
              })
            }
            if (this.canCalcFlag) {
              this.calcTableData();
              this.canCalcFlag = false;
            }

          }, 0);


          //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          this.common.changeTable(
            this,
            ".IntegratedBusiness .kl-table-IntegratedBusiness",
            []
          );

        })
        .catch(err => {
          if (err.code == 11006) {
            _this.$message({
              message: err.description,
              type: "success"
            });
            _this.chargeAmount = 0;
            // 收费提醒
            this.receivableMoney = 0
            this.calculateNum = 0
            this.calculateWater = 0
            this.garbageFee = 0
            this.waterAndOtherFee = 0
            _this.receivableTotal = 0;
            this.changeMoney = 0;
            this.balanceMoney = 0;
            this.balanceWay = '2' // 纯预存情况禁止找零，且选择剩余结存方式
            this.disabledBackChange = true
            _this.tableData = [];
            _this.groupCode = null;
            _this.deductBalanceAccountList = [];
            if (this.workbenchCostSelect) {
              _this.chargeClickData = [];
            }
            // 客户信息数据
            _this.ctmInfoData = err.data.ctmInfo;
            _this.ctmInfoUserNo = err.data.userNo;
            _this.stopWaterLinkMobile = err.data.stopWaterLinkMobile;
            if (this.isFuzzyQueryFocus) {   //收费完后需要光标移入查询框
              this.$refs.fuzzyQuerySearch.focus();
              this.$nextTick(() => {
                this.$refs.fuzzyQuerySearch.select()
              });
              this.isFuzzyQueryFocus = false;
            } else {
              this.$refs.chargeInput.focus()
              this.$nextTick(() => {
                this.$refs.chargeInput.select()
              })
            }
          }
        });
    },

    // 计算表格扣除金额，应缴合计
    calcTableData () {
      const accountMoney = {}
      for (const account of this.deductBalanceAccountList) {
        accountMoney[account.accountNo] = Number(account.accountBalance)
      }
      this.tableData.forEach((item, index) => {
        const needMoney = (Number(item.penaltyMoney) + Number(item.receivableMoney))
        let result = 0
        let total = 0
        if (this.selectData.some(select => select.id === item.id)) {
          //   console.log(result, accountMoney[item.accountNo]);
          if (needMoney <= accountMoney[item.accountNo]) {
            result = needMoney
            accountMoney[item.accountNo] -= needMoney
          } else if (accountMoney[item.accountNo] > 0) {
            result = accountMoney[item.accountNo]
            accountMoney[item.accountNo] -= accountMoney[item.accountNo]
          } else if (accountMoney[item.accountNo] < 0) {
            result = accountMoney[item.accountNo]
            accountMoney[item.accountNo] -= accountMoney[item.accountNo]
          } else {
            result = 0
          }
          total = needMoney - result
        } else {
          result = 0
        }
        this.$set(this.tableData[index], 'deductBalance', result.toFixed(2))
        this.$set(this.tableData[index], 'deductBalanceAll', result.toFixed(2))
        this.$set(this.tableData[index], 'receivableTotalByMonth', total.toFixed(2))
        // if (this.everyoneUserRoundWay == '1') {
        //     if (this.balanceToNumberWay == '1') {
        //       this.$set(this.tableData[index], 'receivableTotalByMonth', Math.ceil(total.toFixed(2)));
        //     } else if (this.balanceToNumberWay == '2') {
        //       this.$set(this.tableData[index], 'receivableTotalByMonth', Math.floor(total.toFixed(2)));
        //     }
        // }
      })
      // 处理数据，从后向前遍历
      for (let i = this.tableData.length - 1; i > 0; i--) {
        // 当前抄表主键相同时
        if (this.tableData[i].meterReadingId == this.tableData[i - 1].meterReadingId && this.tableData[i].useWaterType == this.tableData[i - 1].useWaterType && this.tableData[i].userNo == this.tableData[i - 1].userNo) {
          // 合计应缴
          this.tableData[i - 1].receivableTotalByMonth = Number(this.tableData[i - 1].receivableTotalByMonth) + Number(this.tableData[i].receivableTotalByMonth);
          this.tableData[i].receivableTotalByMonth = 0;
          // 保留2位小数
          this.tableData[i - 1].receivableTotalByMonth = Number(this.tableData[i - 1].receivableTotalByMonth).toFixed(2);

          // 预存抵扣
          this.tableData[i - 1].deductBalanceAll = Number(this.tableData[i - 1].deductBalanceAll) + Number(this.tableData[i].deductBalanceAll);
          this.tableData[i].deductBalanceAll = 0;
          // 保留2位小数
          this.tableData[i - 1].deductBalanceAll = Number(this.tableData[i - 1].deductBalanceAll).toFixed(2);

          if (this.tableData[i].costNo === '01' && (this.tableData[i - 1].costNo === '01')) {
            this.tableData[i - 1].calculateWater = Number(this.tableData[i - 1].calculateWater) + Number(this.tableData[i].calculateWater);
            this.tableData[i].calculateWater = 0

          }

        }
      }
      // 针对多户缴费的情况下，每一户都要单独对各自的费用取整后合计收费（0关，1开）
      if (this.everyoneUserRoundWay == '1') {
        let merge = 0
        let userRoundMoney = 0
        this.everyoneUserRoundMoney = 0
        for (let i = this.tableData.length - 1; i > 0; i--) {
          merge = 1;
          if (this.tableData[i].userNo == this.tableData[i - 1].userNo) {
            userRoundMoney = Number(userRoundMoney) + Number(this.tableData[i - 1].receivableTotalByMonth);
            merge = 0;
          }
          if (merge == 1 || i == 1) {
            if (this.balanceToNumberWay == '1') {
              this.everyoneUserRoundMoney = Number(this.everyoneUserRoundMoney) + Number(Math.ceil(userRoundMoney));
            } else if (this.balanceToNumberWay == '2') {
              this.everyoneUserRoundMoney = Number(this.everyoneUserRoundMoney) + Number(Math.floor(userRoundMoney));
            }
            userRoundMoney = 0;
          }
        }
      }
      
      this.receivableMoney = 0
      this.calculateNum = 0
      this.accountPeriods = []
      this.calculateWater = 0
      this.garbageFee = 0
      this.waterAndOtherFee = 0
      this.selectData.forEach(item => {
        this.receivableMoney += (Number(item.receivableMoney) + Number(item.penaltyMoney))
        let userAndAccountPeriod = {
          meterReadingId: item.meterReadingId,
          useWaterType: item.useWaterType,
          userNo: item.userNo
        }
        // console.log(userAndAccountPeriod);
        if (JSON.stringify(this.accountPeriods).indexOf(JSON.stringify(userAndAccountPeriod)) !== -1) {
        } else {
          this.accountPeriods.push(userAndAccountPeriod)
          this.calculateNum++
        }
        // console.log(this.selectData);
        // for(let i = 0; i < this.selectData.length; i++) {
        //   if(this.selectData[i].rowspan && this.selectData[i].rowspan > 0) {
        //     this.calculateNum ++
        //   }
        // }
        if (item.costNo == '01') {
          this.calculateWater += Number(item.calculateWater)
        }
        if (item.costNo == '04') {
          this.garbageFee += Number(item.receivableMoney)
        }
        if (item.costNo != '04') {
          this.waterAndOtherFee += Number(item.receivableMoney)
        }
      })
      this.receivableMoney = this.receivableMoney.toFixed(2)
      this.garbageFee = this.garbageFee.toFixed(2)
      this.waterAndOtherFee = this.waterAndOtherFee.toFixed(2)
      const accountBalance = isFinite(Number(this.ctmInfoData.accountBalance)) ? Number(this.ctmInfoData.accountBalance) : 0
      this.receivableTotal = 0
      // 针对多户缴费的情况下，每一户都要单独对各自的费用取整后合计收费（0关，1开）
      if (this.everyoneUserRoundWay == '1') {
        this.receivableTotal = this.everyoneUserRoundMoney;
      } else {
        this.tableData.forEach(item => {
          this.receivableTotal += Number(item.receivableTotalByMonth)
        })
        this.receivableTotal = Number(this.receivableTotal);
      }

      this.chargeAmount = this.receivableTotal;
      if (this.payMethod == '1' && this.balanceWay == '2') {
        if (this.balanceToNumberWay == '1') {
          this.chargeAmount = Math.ceil(this.receivableTotal);
        } else if (this.balanceToNumberWay == '2') {
          this.chargeAmount = Math.floor(this.receivableTotal);
        }
      }
      this.receivableTotal = Number(this.receivableTotal).toFixed(2);
      this.chargeAmount = Number(this.chargeAmount).toFixed(2)
      this.calculation(this.chargeAmount);
    },

    // 表格点击账期时切换勾选的状态
    handleTableCellClick (row, column, cell, event) {
      if (column.property !== "accountPeriod") {
        return
      }
      // if(!this.workbenchCostSelect) {
      //   return
      // }
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.findIndex(item => item.id === row.id)
      const select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData[i])
      }
      if (this.selectData.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.handleSelectionChange(this.selectData.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.table.toggleRowSelection(item, false);
        })
        this.$message({
          type: 'warning',
          message: `已取消用户：${row.ctmName}(${row.userNo})，账期：${row.accountPeriod}的费用`
        })
      } else { //恢复该账期勾选
        this.handleSelectionChange(this.selectData.concat(select))
        this.selectData.concat(select).forEach(item => {
          this.$refs.table.toggleRowSelection(item, true);
        })
        this.$message({
          type: 'success',
          message: `已统计用户：${row.ctmName}(${row.userNo})，账期：${row.accountPeriod}的费用`
        })
      }
    },

    // 搜索按钮
    search () {
      this.canCalcFlag = true;
      if (!this.tableQuery.fuzzyQuery || this.tableQuery.fuzzyQuery.length === 0) {
        this.$message({
          type: 'error',
          message: '搜索内容不能为空'
        })
        return
      }
      // else if(this.tableQuery.fuzzyQuery.length < 5) {
      //   this.$message({
      //     type: 'warning',
      //     message: '搜索内容长度需要不低于5位'
      //   })
      //   return
      // }
      this.tableQuery.fuzzyQuery = this.tableQuery.fuzzyQuery.replaceAll("，", ",");
      if (this.tableQuery.fuzzyQuery.indexOf(",") > 0) {
        if (this.tableQuery.fuzzyQuery.substring(this.tableQuery.fuzzyQuery.length - 1) === ",") {
          this.tableQuery.fuzzyQuery = this.tableQuery.fuzzyQuery.substring(0, this.tableQuery.fuzzyQuery.length - 1);
        }
        // this.mobileAnyQueryDialog = true  //多户判断手机号码操作
        this.chargeQuery(this.tableQuery.fuzzyQuery)
        return
      } else {
        // this.mobileAnyQueryDialog = false
      }
      const params = {
        busicode: "JudgeUserQuery",
        data: {
          fuzzyQuery: this.tableQuery.fuzzyQuery
        }
      }
      this.$api.fetch({ params }).then(res => {
        const customTableData = res[0].list
        const customSize = res[0].size || 0
        const accountTableData = res[1].list
        const accountSize = res[1].size || 0
        const userTableData = res[2].list
        const userSize = res[2].size || 0
        const unionSizeData = res[3].list
        const unionSize = res[3].size || 0
        this.isIncorporative = res[4].list[0]
        this.customTableData = customTableData
        this.accountTableData = accountTableData
        this.userTableData = userTableData
        this.userListNo = userSize > 0 ? userTableData[0].userNo : ''//获取用户编号来修改发票信息
        if (customSize + accountSize + userSize + unionSize === 0) { // 查询不到用户
          this.$message({
            type: 'warning',
            message: '未查询到相关内容'
          })
          this.chargeAmount = 0;
          this.receivableMoney = 0
          this.calculateNum = 0
          this.calculateWater = 0
          this.garbageFee = 0
          this.waterAndOtherFee = 0
          this.receivableTotal = 0;
          this.changeMoney = 0;
          this.balanceMoney = 0
          this.tableData = [];
          this.groupCode = null;
          this.deductBalanceAccountList = [];
          if (this.workbenchCostSelect) {
            this.chargeClickData = [];
          }
          // 客户信息数据
          this.ctmInfoData = {};
          this.$refs.chargeInput.focus()
          this.$nextTick(() => {
            this.$refs.chargeInput.select()
          })
        } else
          if (unionSize > 0) { //查询结果为联合编号
            // this.chargeQuery(unionSizeData.map(i => i.userNo).join())
            // console.log(unionSizeData.map(i => i.userNo).join(), 3333112)
            // this.$refs.searchDialog.open(res, this.tableQuery.fuzzyQuery)
            this.chargeQuery(unionSizeData[0].userNo); // 直接取第一个账户进行查询
          } else
            if (customSize + accountSize + userSize === 1) { // 单个用户
              if (customSize === 1) {
                this.isNeedReplace = false
                this.chargeQuery(customTableData[0].ctmNo)
              }
              if (accountSize === 1) {
                this.isNeedReplace = false
                this.chargeQuery(accountTableData[0].accountNo)
              }
              if (userSize === 1) {
                this.chargeQuery(userTableData[0].userNo)
              }
            } else if (customSize === 1 && accountSize === 1 & userSize === 1 & unionSize === 0) { // ?
              if (this.isIncorporative == 1) { // 是否为并户
                this.isIncorporativeVisible = true
              }else{
                this.chargeQuery(userTableData[0].userNo)
              }
            } else { // 弹窗模糊查询
              this.$refs.searchDialog.open(res, this.tableQuery.fuzzyQuery)
            }
      }).catch(e => {
        if (e.code == 1) {
          this.chargeAmount = 0;
          this.receivableMoney = 0
          this.calculateNum = 0
          this.calculateWater = 0
          this.garbageFee = 0
          this.waterAndOtherFee = 0
          this.receivableTotal = 0;
          this.changeMoney = 0;
          this.balanceMoney = 0
          this.tableData = [];
          this.groupCode = null;
          this.ctmInfoUserNo = "";
          this.stopWaterLinkMobile = "";
          this.deductBalanceAccountList = [];
          if (this.workbenchCostSelect) {
            this.chargeClickData = [];
          }
          // 客户信息数据
          this.ctmInfoData = {};
          this.$refs.chargeInput.focus()
          this.$nextTick(() => {
            this.$refs.chargeInput.select()
          })
        }
      })

    },
    dialogTitleEdit (title) {
      this.UserInformationName = title;
    },
    next () {
      if (this.rightBtnsEvents2 == this.rightBtnsEvents3) {
        this.rightBtnsEvents2 = this.rightBtnsEvents;
      } else {
        this.rightBtnsEvents2 = this.rightBtnsEvents3;
      }
    },
    leftShow () {
      this.menuLeftShow = true;
    },
    leftHidden () {
      this.menuLeftShow = false;
    },
    // 高级查询
    advancedSearch () {
      this.waterAddVisible = true;
    },
    // 多户查询
    multipleSearch () {
      this.multipleUserVisible = true;
    },
    // 多户 模糊查询 提交
    fuzzyManySubmit () {
      this.$set(
        this.tableQuery,
        "fuzzyQuery",
        this.$refs.searchDialog.selectData
      );
      this.closeDialog();
      this.search();
    },
    unionSubmit(){ // 联合编号直接查询欠费信息
      this.closeDialog();
      this.chargeQuery(this.$refs.searchDialog.selectData);
    },
    //多户查询提交
    multipleUsersubmit () {
      this.$set(
        this.tableQuery,
        "fuzzyQuery",
        this.$refs.multipleUser.userOptions.replace(/\n/g, ",")
      );
      this.closeDialog();
      this.search();
    },
    // 客户资料
    getCtmInfoShow () {
      if (this.ctmInfoData.ctmNo) {
        this.countManagementVisible = true;
      } else {
        this.$message({
          showClose: true,
          message: "请先选择用户",
          type: "error"
        });
      }
    },
    //修改手机号码
    getCtmMobile () {
      this.mobileInfoVisible = true
      this.mobileQuery.mobile = this.ctmInfoData.mobile
    },
    submitMobile () {
      let params = {
        busicode: 'WBCtmInfoUpdate',
        data: {
          ctmNo: this.ctmInfoData.ctmNo,
          mobile: this.mobileQuery.mobile
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        // this.EngineeringFeesCount = res
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        });
        this.closeDialog()
        this.search()
      })
    },
    getEngineeringFeesCount () {
      let params = {
        busicode: 'ProjectReceiptTotal',
        data: {}
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.EngineeringFeesCount = res
      })
    },
    // 锁定账期，默认未锁定
    toggleLockAccountPeriod () {
      this.lockIcon = this.lockIcon == 'el-icon-lock' ? 'el-icon-unlock' : 'el-icon-lock';
    },
    //修改手机号码
    updateCtmMobile () {
      this.updateNumber.userNo = this.ctmInfoUserNo;
      this.updateNumber.ctmNo = this.ctmInfoData.ctmNo;
      this.updateNumber.mobile = this.ctmInfoData.mobile;
      this.updateNumber.stopWaterLinkMobile = this.stopWaterLinkMobile;
      this.modifyNumberDia = true;
    },
    // 不合缴
    noPayment(){
      this.isIncorporativeVisible = false
      this.chargeQuery(this.userTableData[0].userNo)
    },
    // 账户合缴
    accountPayment(){
      this.isIncorporativeVisible = false
      this.chargeQuery(this.accountTableData[0].accountNo)
    },
    // 客户合缴
    ctmPayment(){
      this.isIncorporativeVisible = false
      this.chargeQuery(this.customTableData[0].ctmNo)
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes () {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        console.log(res)
        this.printType = res.typeList;
        this.printType.forEach(item => {
          if(item.autoPrint == '1'){
            this.checkedPrint.push(item.invoiceNo);
          }
        })
        this.printCheckChange();
      })
    },
    // 打印选项改变
    printCheckChange(val){
      let arr = this.checkedPrint.filter(item => {
        return item != "SJDY";
      })
      if(arr.length <= 0){
        this.PrintingModel1 = false;
        this.printChangeModel = true;
      }else{
        this.printChangeModel = false;
      }
    },
    //获取电子发票域名
    getInvoiceTurnUrl(){
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'INVOICE_TRAN_URL',
        }
      };
      this.$api.fetch({
        params
      }).then(res => {
        if (res.list.length > 0) {
          this.invoiceTurnUrl = res.list[0].configValue
        } else {
          this.invoiceTurnUrl = '';
        }
      })
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    chargeShow: {
      handler (val) {
        if (!val) {
          this.$refs.chargeInput.focus()
          document.removeEventListener('keypress', this.enterKeyDown)
        }
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$theme-color: #297acc;
.IntegratedBusiness {
  zoom: 1;
  padding-top: 10px;
  width: 100%;
  height: calc(100% - 10px);

  .balanceTxt {
    font-weight: bolder;
    font-size: 1.5rem;
  }
  .cashDeposit-dialog {
    height: 400px;
  }
  .UnsettledAccountsStatistics-dialog {
    height: 530px;
  }
  #text-box {
    padding: 50px 0px;
    font-size: 30px;
  }
  #card-box {
    padding: 50px 0px;
    font-size: 30px;
    text-align: center;
  }
  .button-dialog {
    .el-dialog__body {
      overflow: auto !important;
    }
  }
  .chargeContent .el-input__inner {
    width: 50%;
    font-size: 18px;
    border: none;
  }
  .charge-dialog .el-radio__label {
    font-size: 18px !important;
  }
  .charge-dialog .el-dialog__body {
    text-align: center;
    padding: 15px 20px;
  }
  .charge-dialog .el-dialog {
    width: 40% !important;
  }
  .el-table__footer-wrapper {
    .has-gutter {
      td:last-of-type .cell {
        color: red;
        font-size: 18px;
      }
    }
  }
  &:after {
    @include _clearBoth();
  }
  & > section {
    zoom: 1;
    height: 100%;
    &:after {
      @include _clearBoth();
    }
  }
  .leftForm {
    float: left;
    width: calc(100% - 220px);
    // width: 100%;
    height: 100%;
    zoom: 1;
    &:after {
      @include _clearBoth();
    }
    .left-con {
      // float: left;
      height: 340px;
      // width: calc(100% - 320px);
      width: 100%;
      .leftFormOption {
        width: 100%;
        zoom: 1;
        &:after {
          @include _clearBoth();
        }
        .demo-form-inline {
          float: left;
          width: calc(40% - -36px);
          height: 125px;
          padding: 10px 20px;
          .fullSearch {
            width: 100%;
            margin-bottom: 15px;
            .el-form-item__content {
              width: 100%;
              .el-input__inner {
                width: 100%;
                font-size: 18px;
                height: 40px;
                line-height: 40px;
                // padding-left: 0px;
                padding-right: 20px;
                &::-webkit-input-placeholder {
                  font-size: 14px;
                }
                &::-moz-placeholder {
                  font-size: 14px;
                }
                &:-ms-input-placeholder {
                  font-size: 14px;
                }
              }
            }
          }
          .el-form-item__label {
            font-size: 16px;
            text-align: justify;
          }

          .fullBtn {
            width: 100%;
            text-align: center;
            position: relative;
            .el-form-item__content {
              width: 100%;
              height: 40px;
            }
            .el-button {
              width: 30%;
              height: 40px;
              line-height: 25px;
              span {
                font-size: 15px;
              }
            }
            .accountPeriodFilterBtn {
              width: 50px;
              line-height: 15px;
            }
            i {
              font-size: 18px;
            }
            .el-button--default {
              height: 40px;
            }
            .advanceSearch {
              // position: absolute;
              // bottom: 0px;
              // right: 5px;
              // color: rgba(0,0,0,.5);
              // cursor: pointer;
              width: 8%;
              height: 40px;
              margin-left: -5px;
              background: #faa646;
              border-color: #dcdfe6;
              border-left: 1px solid #ccc;
              padding: 0px;
              line-height: 16px;
            }
          }
        }
        .userInfo {
          width: calc(60% - 50px);
          float: right;
          height: 125px;
          padding: 10px 20px 0px;
          text-align: justify;
          overflow-y: auto;
          .longLabel {
            vertical-align: top;
          }
          .longName {
            display: inline-block;
            width: calc(100% - 85px);
          }
        }
      }
      .leftFormPaymentOption {
        height: 208px;
        padding: 10px 20px 15px;
        .remark {
          margin-right: 0px !important;
          .el-form-item__content {
            width: calc(100% - 90px);
            .el-input {
              width: 80%;
            }
          }
        }
        .chargeRemind .el-form-item__content {
          // color: #606266;
        }
        .costInfo {
          width: 100%;
          font-size: 16px;
          margin-top: 0px;
          border-bottom: 1px dashed #dfe3e6;
          padding-bottom: 10px;
          & > li {
            //width: 18%;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            b {
              margin-right: 5px;
              font-size: 24px;
            }
          }
          .changeMoney,
          .balanceMoney {
            width: 14%;
          }
          & > li:nth-of-type(1) > b {
            color: red;
            font-weight: 300;
          }
          & > li:nth-of-type(2) > b {
            color: red;
            font-weight: 300;
          }
          & > li:nth-of-type(3) > b {
            color: $theme-color;
          }
          & > li:nth-of-type(4) > b {
            color: #faa646;
          }
        }
        .PayForm {
          padding-top: 5px;
          overflow-y: auto;
          height: calc(100% - 35px);
          .invioce {
            .el-checkbox__label {
              color: #909399 !important;
            }
          }
          .el-form-item {
            width: 40%;
            &:nth-of-type(2n) {
              width: 55%;
            }
            &:nth-of-type(7) {
              width: 80%;
            }
            &:nth-of-type(5) {
              // width: 150px;
              // margin-right: 20px;
              .el-checkbox {
                margin-left: 20px;
              }
            }
            .el-radio {
              height: 27px;
              line-height: 27px;
            }
            .el-form-item__label,
            .el-radio__label,
            .el-checkbox__label {
              font-size: 16px;
            }
            .el-radio__label,
            .el-checkbox__label {
              color: #000;
            }
            .el-form-item__label {
              text-align: justify;
              text-align-last: justify;
            }
          }
          .form-item-checkbox {
            .el-form-item__content {
              max-width: calc(100% - 90px);
              .el-checkbox {
                .is-disabled {
                  .el-checkbox__inner::after {
                    border-color: #409eff;
                  }
                }
              }
            }
          }
          .afterPay {
            height: 32px;
            line-height: 27px;
            vertical-align: top;
          }
        }
      }
    }
  }
  .rightBtn {
    text-align: right;
    border: 1px solid #aebbc342;
    margin-right: 10px;
    border-radius: 5px;
    zoom: 1;
    position: relative;
    height: 100%;
    float: right;
    width: 200px;
    box-sizing: border-box;
    overflow: auto;
    .el-button {
      display: block;
    }
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
    &:after {
      @include _clearBoth();
    }
    & > h5 {
      font-size: 16px;
      text-align: left;
      padding: 5px 8px;
      background: #aebbc342;
      zoom: 1;
      &:after {
        @include _clearBoth();
      }
      .setTip {
        color: $theme-color;
        float: right;
        line-height: 20px;
        font-size: 16px;
      }
      span {
        float: left;
        line-height: 20px;
      }
    }
    .btnsBlock {
      zoom: 1;
      margin-bottom: 5px;
      &:after {
        @include _clearBoth();
      }
    }
    .btnTop {
      height: auto;
    }
    div {
      margin-top: 12px;
      width: 49%;
      float: left;
      text-align: center;
      &:hover {
        cursor: pointer;
      }
      p {
        color: #54575f;
        // font-size: 13px;
        font-weight: 500;
      }
      img {
        width: 20px;
        height: 20px;
      }
      .el-badge {
        width: 100%;
        margin-top: 4px;
        .el-badge__content {
          right: 32px;
        }
      }
    }
    .moreBtn {
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 0px;
      width: 100%;
      // padding-right: 15px;
      .spagination {
        position: absolute;
        bottom: 5px;
        right: 27%;
        text-align: center;
        .up,
        .down {
          width: 0px;
        }
        .pageNum {
          padding-top: 5px;
        }
      }
      .set {
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 5px;
        height: 5px;
        border-right: 1px solid $theme-color;
        border-bottom: 1px solid $theme-color;
      }
    }
    .menuLeft,
    .menuRight {
      position: absolute;
      // top: 50%;
      top: 71%;
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 50%;
      -moz-border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      i {
        font-size: 14px;

        color: #fff;
        line-height: 25px;
      }
    }
    .menuLeft {
      left: 0px;
    }
    .menuRight {
      right: 0px;
    }
  }
  .el-form--inline {
    width: 100%;
    margin-top: 0px;
  }
  // .el-form--inline .el-form-item {
  //   margin-right: 15px;
  // }
  .el-radio,
  .el-checkbox {
    margin-right: 10px;
  }
  .el-table .el-checkbox {
    margin-right: 0px;
  }
  .el-radio__label {
    font-size: 12px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 4px;
  }
  .userInfo,
  .costInfo {
    zoom: 1;

    &:after {
      @include _clearBoth();
    }
    & > li {
      float: left;
      & > span {
        color: #000;
      }
    }

    .AmountCharged {
      width: 300px !important;
      font-weight: 700;
      .el-input {
        width: 65% !important;

        .el-input__inner {
          // color: red !important;
          font-size: 28px;
          margin-right: 5px;
          height: 40px;
          line-height: 40px;
          width: 100%;
        }
      }
    }
  }
  .costInfo {
    .el-button {
      width: 90px;
      height: 40px;
      line-height: 24px;
      font-size: 20px;
    }
  }
  .userInfo {
    .userDetails {
      color: $theme-color;
      cursor: pointer;
      .ctmNo, .userNo {
        text-decoration: underline;
        color: $theme-color;
      }
    }
    & > li:nth-of-type(odd) {
      width: 35%;
    }
    & > li:nth-of-type(even) {
      width: 65%;
    }
    & > li {
      color: #909399;
      // width: 50%;
      margin-bottom: 13px;
      font-weight: bold;
      font-size: 16px;
      &:last-of-type {
        color: #a24848;
      }
      .userInfoLabel {
        color: #111;
        font-weight: 550;
        display: inline-block;
        width: 80px;
        text-align: justify;
        text-align-last: justify;
        // float: left;
      }
      .userAddressInfoValue {
        // white-space: nowrap;
        // // float: right;
        // position: absolute;
        // width: 70%;
      }
    }
  }

  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row > td,
  .el-table__body tr.hover-row.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped > td,
  .el-table__body tr.hover-row > td {
    background-color: #fff;
    word-wrap: break-word;
  }
  .leftFormOption .demo-form-inline,
  .leftFormPaymentOption,
  .userInfo {
    border: 1px solid #aebbc342;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .kl-table-IntegratedBusiness {
    position: relative;
    //   padding: 0px;
    //   width: 100%;
    height: calc(100% - 340px);
    width: 100%;
    .el-table {
      margin-top: 10px;
      //     width: 100%;
      // height: calc(100% - 10px);
      .el-table__body-wrapper {
        overflow-y: auto;
        height: calc(100% - 31px);
      }
      .el-table__footer-wrapper {
        height: 0px;
        .el-table__footer {
          border-collapse: collapse;
        }
      }
      .font14 {
        .cell {
          font-size: 15px;
          font-weight: 500;
        }
      }

      .table-row-red {
        color: #f56c6c;
      }
      .table-row-purple {
        color: #a040ff;
      }
      .table-row-dark-blue {
        color: #0b417a;
      }
      .table-row-yellow {
        color: #e6a23c;
      }
      .table-row-light-blue {
        color: #62a8f2;
      }
      .table-row-green {
        color: #30b110;
      }
      .el-checkbox {
        .is-disabled {
          .el-checkbox__inner::after {
            border-color: #409eff;
          }
        }
      }
    }
    //   .table-tool {
    //     .el-checkbox-group {
    //       width: 280px;
    //       display: inline-block;
    //     }
    //     .payLabel {
    //       font-size: 15px;
    //     }
    //   }
    .tableMore {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 111;
      cursor: pointer;
    }
  }
  .border-line {
    width: 1px;
    border-right: 1px dashed #dfe3e6;
    height: 18px;
    margin-top: 5px;
  }
  .el-table__body-wrapper .el-table_97_column_1181 .cell {
    height: 90px;
    line-height: 90px;
    word-wrap: break-word;
  }
}
.el-tooltip__popper.is-light {
  border: 1px solid #297acc;
  color: #297acc;
}
.el-form-item__content {
  font-size: 16px;
}
.lockBtn {
  padding: 8px;
  i {
    font-size: 20px;
  }
}
</style>

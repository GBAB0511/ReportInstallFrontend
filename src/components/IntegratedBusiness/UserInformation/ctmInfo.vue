<template>
  <div class="ctmInfo">
    <el-form class="formBill" :inline="true" size="mini" :model="formData" label-width="130px" ref="ruleForm">
      <legend class="legendColumn">客户信息</legend>

      <el-form-item label="客户编号：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.ctmNo" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

       <el-form-item label="证件类型：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.certType" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

      <el-form-item label="客户身份证号：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.certNo" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

       <el-form-item label="客户类型：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.ctmType" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

        <el-form-item label="客户名称：" class="disable-item" style="width:47%">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.ctmName" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

      <el-form-item label="客户地址：" class="disable-item" style="width:47%">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.ctmAddr" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

      <el-form-item label="信用等级：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.creditLevel" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

      <el-form-item label="固定电话：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.linkTel" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

      <el-form-item label="手机号码：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="formData.ctmInfo.mobile" placeholder="" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>

      <el-form-item label="传真号码：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled v-model="formData.ctmInfo.faxNumber" placeholder="" class="read-only" @input="e => input = inputMe(e)"></el-input>
      </el-form-item>
      <div class="content">
        <legend class="legendColumn">账户列表</legend>

        <div class="kl-table">
          <el-table ref="retable" stripe :highlight-current-row="highlightFlag"  @row-click="handleRowChange" border :data="accountData" class="change-tables-table">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="accountNo" min-width="180" label="账户编号">
            </el-table-column>

            <el-table-column prop="accountType" min-width="180" label="账户类型">
            </el-table-column>

            <el-table-column prop="payWay" min-width="100" label="缴费方式">
            </el-table-column>

            <el-table-column prop="accountBalance" min-width="180" label="余额">

            </el-table-column>

            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">

                <el-button type="text" size="mini" class="noclick" @click="getAccountEdit(scope.$index, scope.row)">详情</el-button>
                <el-button type="text" size="mini" class="noclick" @click="FlowingShow(scope.$index, scope.row)">查看流水</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <legend class="legendColumn"> 用户列表</legend>
        <div class="kl-table">
          <el-table stripe border :data="userData" highlight-current-row class="change-tables-table">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="userNo" min-width="120" label="用户编号">
            </el-table-column> 

            <el-table-column prop="newAccountNo" min-width="120" label="账户编号" v-if="fromPage != null && fromPage == 'userSearch'"> 
               <template slot-scope="scope" >
                  <el-select  v-model="scope.row.newAccountNo"  @change="changeAccount(scope.row)">
                    <el-option v-for="item in accountData" :key="item.accountNo" :label="item.accountNo" :value="item.accountNo"></el-option>
                  </el-select>
                </template>
            </el-table-column>

            <el-table-column prop="status" min-width="130" label="用户状态">
            </el-table-column>

            <el-table-column prop="businessAreaName" min-width="150" label="营业区域">
            </el-table-column>

            <el-table-column prop="useWaterTypeName" min-width="80" label="用水类型">
            </el-table-column>

            <el-table-column prop="useWaterObject" min-width="80" label="用水对象">
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">

                <el-button type="text" size="mini" class="noclick" @click="getUserEdit(scope.$index, scope.row)">详情</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
    </el-form>
    <!-- 账户详情 -->
    <el-dialog class="TwoModel" v-if="accountEditVisible" append-to-body :title="accountEditName" :close-on-click-modal="false" :visible.sync="accountEditVisible">

      <el-form class="formBill" size="mini" :inline="true" :model="accountEditData" label-width="130px" ref="ruleForm">

        <legend class="legendColumn">账户信息</legend>
        <el-form-item label="账户编号：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.accountNo}}</span>
        </el-form-item>
        <el-form-item label="缴费方式：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.payWayName}}</span>
        </el-form-item>
        <el-form-item label="账户类型：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.accountTypeName}}</span>
        </el-form-item>
        <el-form-item label="开户银行：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.openAccountBankName}}</span>
        </el-form-item>
        <el-form-item label="开户名称：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.openAccountName}}</span>
        </el-form-item>

        <el-form-item label="银行账户：" style="width: calc(46% + 10px)" class="disable-item">
          <span class="account-detail-info">{{accountEditData.bankAccount}}</span>
        </el-form-item>
        <el-form-item label="托号：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.entrustNo}}</span>
        </el-form-item>
        <el-form-item label="银行协议号：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.entrustContract}}</span>
        </el-form-item>
        <!-- <el-form-item label="托收合同号：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.entrustContract}}</span>
        </el-form-item> -->

        <el-form-item label="投递方式：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.deliverWayName}}</span>
        </el-form-item>

        <el-form-item label="投递地址：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.deliverAddr}}</span>
        </el-form-item>

        <el-form-item label="电子邮件：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.emailAddr}}</span>
        </el-form-item>
        <el-form-item label="账户余额：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.accountBalance}}</span>
        </el-form-item>
        <el-form-item label="开户行号：" style="width: calc(46% + 10px)" class="disable-item">
          <span class="account-detail-info">{{accountEditData.bankSn}}</span>
        </el-form-item>
        <el-form-item label="出盘编号：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.outNo === 2 ? '旧用户编号' : '新用户编号'}}</span>
        </el-form-item>
        <legend class="legendColumn">开票信息</legend>
        <!-- <el-form-item label="发票类型：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceType}}</span>
        </el-form-item> -->
        <el-form-item label="单位名称：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceTitle}}</span>
        </el-form-item>
        <el-form-item label="纳税人识别号：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceTax}}</span>
        </el-form-item>
        <el-form-item label="联系地址：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceAddr}}</span>
        </el-form-item>
        <el-form-item label="座机号码：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceLink}}</span>
        </el-form-item>
        <el-form-item label="开户银行：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceBank}}</span>
        </el-form-item>
        <el-form-item label="银行账户：" style="width: calc(46% + 10px)" class="disable-item">
          <span class="account-detail-info">{{accountEditData.invoiceAccount}}</span>
        </el-form-item>
        <el-form-item label="是否增值税：" class="disable-item">
          <span class="account-detail-info">{{accountEditData.vatFlagName}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 用户详情 -->
    <el-dialog :title="UserInformationName" v-if="userEditVisible" append-to-body :close-on-click-modal="false" :visible.sync="userEditVisible" class="scorllModel" @close="closeDialog">
      <div class="btn-group">
        <el-button size="mini" type="primary" @click="ctmChange">变动情况</el-button>
        <el-button size="mini" type="primary" @click="payInfo">费用信息</el-button>
        <el-button size="mini" type="primary" @click="meterInfo">抄表信息</el-button>
        <el-button size="mini" type="primary" @click="Predeposit">账户流水</el-button>
        <el-button size="mini" type="primary" @click="AttachmentView">查看附件</el-button>
      </div>
   <div class="main-form" >
     <el-form size="mini" class="formBill" :inline="true" :model="userEditData" label-width="130px" ref="ruleForm">

        <legend class="legendColumn">用户信息</legend>
        <el-form-item label="用户编号：" prop="userNume" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.userNo}}</span>
        </el-form-item>

        <el-form-item label="锁定状态：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.lockFlag ? '是' : '否'}}</span>
        </el-form-item>

        <el-form-item label="用户状态：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.statusName}}</span>
        </el-form-item>

        <el-form-item label="房地产编号：" prop="houseCert" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.houseCert}}</span>
        </el-form-item>

        <el-form-item label="合同编号：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.contractNo}}</span>
        </el-form-item>

        <el-form-item label="合同地址：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.contractAddr}}</span>
        </el-form-item>

        <el-form-item label="签订日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.contractDate}}</span>
        </el-form-item>
        <el-form-item label="用水期限：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.useTimeLimit}}</span>
        </el-form-item>
        <!--el-form-item label="营业所：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.businessAbodeName}}</span>
        </el-form-item-->
        <el-form-item label="行政区域：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.adminAreaName}}</span>
        </el-form-item>
        <el-form-item label="营业区域：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.businessAreaName}}</span>
        </el-form-item>
        <el-form-item label="行业分类：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.tradeClassifyName}}</span>
        </el-form-item>

        <el-form-item label="户表改造标记：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.reformFlag ? '是' : '否'}}</span>
        </el-form-item>

        <el-form-item label="立户日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.openDate}}</span>
        </el-form-item>
        <el-form-item label="停用日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.stopDate}}</span>
        </el-form-item>
        <el-form-item label="注销日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.cancelDate}}</span>
        </el-form-item>

        <el-form-item label="备注：" class="Remarks disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.comments}}</span>
        </el-form-item>

        <legend class="legendColumn">用户-抄表信息</legend>

        <el-form-item label="册本号：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.bookNo}}</span>
        </el-form-item>
        <el-form-item label="排序号：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.sortNo}}</span>
        </el-form-item>
        <el-form-item label="抄表日：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.lastReadingDate}}</span>
        </el-form-item>
        <el-form-item label="抄表周期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.meterReadingCycleName}}</span>
        </el-form-item>
        <el-form-item label="最后抄码：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.lastReadingNum}}</span>
        </el-form-item>
        <el-form-item label="抄表员：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.meterReadingStaff}}</span>
        </el-form-item>
        <el-form-item label="下次抄表月：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.nextMonthid}}</span>
        </el-form-item>
        <legend class="legendColumn">用户-水表信息</legend>
        <el-form-item label="水表编号：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.meterNo}}</span>
        </el-form-item>
        <el-form-item label="水表表身号：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.factoryNo}}</span>
        </el-form-item>
        <el-form-item label="装表地址：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.setupMeterAddr}}</span>
        </el-form-item>
        <el-form-item label="装表位置：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.setupMeterLocationName}}</span>
        </el-form-item>
        <el-form-item label="水表类型：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.meterTypeName}}</span>
        </el-form-item>
        <el-form-item label="虚拟计算公式：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.virtualDesignFormulas}}</span>
        </el-form-item>
        <el-form-item label="水表用途：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.meterUseName}}</span>
        </el-form-item>
        <el-form-item label="用水对象：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.useWaterObjectName}}</span>
        </el-form-item>
        <el-form-item label="水表口径：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.meterBoreName}}</span>
        </el-form-item>
        <el-form-item label="水表厂家：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.meterFactoryName}}</span>
        </el-form-item>
        <el-form-item label="水表型号：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.meterModelName}}</span>
        </el-form-item>
        <el-form-item label="装表日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.setupMeterDate}}</span>
        </el-form-item>
        <el-form-item label="换表日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.changeMeterDate}}</span>
        </el-form-item>
        <el-form-item label="拆表日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.splitMeterDate}}</span>
        </el-form-item>
        <el-form-item label="拆表类型：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.splitMeterWayName}}</span>
        </el-form-item>
        <el-form-item label="远传通讯费：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.transCommFee}}</span>
        </el-form-item>
        <el-form-item label="通讯运营商：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.commOperatorName}}</span>
        </el-form-item>
        <el-form-item label="通讯费开始日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.commFeeStart}}</span>
        </el-form-item>
        <el-form-item label="通讯费结束日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.msInfo.commFeeEnd}}</span>
        </el-form-item>

        <legend class="legendColumn">用户-价格信息</legend>

        <el-form-item label="用水类型：" class="disable-item">
          <span class="user-detail-info clickable" v-if="userEditData.userInfo.useWaterType == '6'" @click="showUserMixture">{{userEditData.userInfo.useWaterTypeName}}</span>
          <span class="user-detail-info" v-else>{{userEditData.userInfo.useWaterTypeName}}</span>
        </el-form-item>
        <el-form-item label="用水人口：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.ladderPersonNum}}</span>
        </el-form-item>
        <el-form-item label="优惠策略：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.prefStrategyName}}</span>
        </el-form-item>

        <el-form-item label="优惠证件号码：" prop="prefCertNo" style="width: calc(46% + 10px)" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.prefCertNo}}</span>
        </el-form-item>

        <el-form-item label="优惠策略开始日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.lastReadingDate}}</span>
        </el-form-item>
        <el-form-item label="优惠策略结束日期：" class="disable-item">
          <span class="user-detail-info">{{userEditData.userInfo.lastReadingDate}}</span>
        </el-form-item>
        <el-form-item label="详细价格：">
          <el-button size="mini" type="text" class="viewBtn" @click="showPrice">查看</el-button>
        </el-form-item>
          <el-form-item label="费用折扣：">
          <el-button size="mini" type="text" class="viewBtn" @click="showDiscount">查看</el-button>
        </el-form-item>
         <el-form-item label="混合用水：">
          <el-button size="mini" type="text" class="viewBtn" @click="showUserMixture">查看</el-button>
        </el-form-item>

        <el-dialog title="详细价格" :append-to-body="true" :visible.sync="EditVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
          <WaterPriceEdit ref="WaterPriceEdit"></WaterPriceEdit>
          <div slot="footer" class="dialog-footer" ref="ruleForm">
            <el-button type="info" size="mini" plain @click="closeDialog">关闭</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="费用折扣"
          :visible.sync="userDiscountVisible"
          :close-on-click-modal="false"
          append-to-body
          class="button-dialog"
        >
          <userDiscountEdit ref="userDiscountEdit" :isEdit="true" :discountData="discountData" :userNo="userNo"></userDiscountEdit>
          <div slot="footer" class="dialog-footer">
            <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
            <el-button type="info" size="mini" plain @click="closeDialog"
              >关闭</el-button
            >
          </div>
        </el-dialog>

        
      <el-dialog title="混合用水" :visible.sync="userMixtureVisible" append-to-body :close-on-click-modal="false" class="button-dialog">
        <userMixtureEdit ref="userMixtureEdit" :mixtureData="mixtureData" :isEdit="true" :userNo="userNo"></userMixtureEdit>
        <div slot="footer" class="dialog-footer">
          <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
          <el-button type="info" size="mini" plain @click="closeDialog">确定</el-button>
        </div>
      </el-dialog>
      </el-form>
</div>
 
    </el-dialog>
    <!-- 查看流水 -->

    <el-dialog title="查看流水" class="TwoModel" v-if="FlowingTableVisible" append-to-body :close-on-click-modal="false" :visible.sync="FlowingTableVisible" @close="FlowingTableVisible = false">
      <PredepositDdetailsInfo :PredepositDdetailsInfoData='PredepositDdetailsInfoData'></PredepositDdetailsInfo>
    </el-dialog>

    <!--1 变动情况 -->
    <el-dialog
      class="TwoModel"
      :title="ChangeName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="Changeshow"
      @close="closeDialog"
    >
      <ChangesSituation :CustomerChangesEditData='{userNo: userEditData.userInfo.userNo}'></ChangesSituation>
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
      <WaterUseOverTheYears :WaterUseOverTheYearsData='{userNo: userEditData.userInfo.userNo}'></WaterUseOverTheYears>
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
      <MeterReadingInfo :MeterReadingInfoData='{userNo: userEditData.userInfo.userNo}'></MeterReadingInfo>
    </el-dialog>

    <!--4 账户流水 -->
    <el-dialog
      class="TwoModel"
      :title="PredepoName"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="Predeposhow"
      @close="closeDialog"
       v-if="Predeposhow"
    >
      <PredepositDdetailsInfo :PredepositDdetailsInfoData='{accountNo: userEditData.accountInfo.accountNo}'></PredepositDdetailsInfo>
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
      <AttachmentViewInfo :receiptAccessory='{userNo: userEditData.userInfo.userNo}'></AttachmentViewInfo>
    </el-dialog>

  </div>
</template>
<script>
import userMixtureEdit from "@/views/publicModule/infmtnManagement/userMixtureEdit"; //
import userDiscountEdit from "@/views/publicModule/infmtnManagement/userDiscountEdit"; //
import WaterPriceEdit from "@/views/FinancialCenter/PriceContrl/WaterPrice/WaterPriceEdit"; //
import userInfo from "@/components/userInfo/ctmInfo"
import ChangesSituation from "@/components/IntegratedBusiness/UserInformation/CustomerChanges"; //变动情况
import WaterUseOverTheYears from "@/components/IntegratedBusiness/UserInformation/WaterUseOverTheYears"; //费用信息
import MeterReadingInfo from "@/components/IntegratedBusiness/UserInformation/MeterReadingInfo"; //抄表信息
import PredepositDdetailsInfo from "@/components/IntegratedBusiness/UserInformation/PredepositDdetailsInfo"; //账户流水
import AttachmentViewInfo from "@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo"; //查看附件
export default {
  name: "ctmInfo",
  props: ['formDataUserNo','fromPage'],
  components: {
    userInfo,
    PredepositDdetailsInfo,
    WaterPriceEdit,
    ChangesSituation,
    WaterUseOverTheYears,
    MeterReadingInfo,
    AttachmentViewInfo,
    userMixtureEdit,
    userDiscountEdit
  },
  data() {
    return {
      userMixtureVisible:false,//混合用水
      mixtureData: {},
      userDiscountVisible: false,//费用折扣
      discountData:{},
      userNo:'',
      initUserNoFlag:{},
      highlightFlag:true,
      formData: {
        ctmInfo: {
          ctmNo: "",//客户编号：
          ctmName: "",//客户名称：
          certNo: "",//客户身份证号：
          certType: "",//证件类型：
          creditLevel: "",//信用等级：
          linkMan: "",//联系人：
          linkTel: "",//固定电话：
          mobile: "",//手机号码：
          faxNumber: "",//传真号码:
        },
      },
      // 账户表格数据
      accountData: [],
      // 账户详情数据
      accountEditData: {
        // 账户信息
        accountNo: "",//账户编号
        payWay: "",//缴费方式
        accountType: "",//账户类型
        openAccountBank: "",//开户银行
        openAccountName: "",//开户名称
        bankAccount: "",//银行账户
        entrustNo: "",//托号
        entrustContract: "",//托收合同
        deliverWay: "",//投递方式
        deliverAddr: "",//投递地址
        emailAddr: "",//邮箱地址
        // 开票信息
        invoiceType: "",//发票类型
        invoiceTitle: "",//单位名称
        invoiceTax: "",//纳税人识别号
        invoiceAddr: "",//联系地址
        invoiceLink: "",//座机号码
        invoiceBank: "",//开户银行
        invoiceAccount: "",//银行账户

      },
      EditVisible: false,
      accountEditName: "查询账户详情",
      accountEditVisible: false,
      // 用户表格数据
      userData: [],
      userEditData: {

        userInfo: {
          userNo: "",//用户编号：
          lockFlag: '',//锁定状态：
          status: "",//用户状态：
          houseCert: "",//房地产编号：
          comments: "",//备注：

          reformFlag: '',//户表改造标记：
          contractNo: "",//合同编号：
          contractAddr: "",//合同地址：
          contractDate: "",//签订日期：
          businessAbodeName: "",//营业所：
          adminAreaName: "",//行政区域：
          businessAreaName: '',//营业区域：
          tradeClassifyName: '',//行业分类：
          openDate: '',//立户日期：
          stopDate: '',//停用日期：
          cancelDate: '',//注销日期：
          useTimeLimit: '',//用水期限：

          // 用户-水表信息
          meterNo: '',//水表编号：
          setupMeterAddr: '',//装表地址：
          setupMeterLocation: '',//装表位置：
          virtualDesignFormulas: '',//虚拟计算公式：
          meterUse: '',//水表用途：
          useWaterObject: '',//用水对象：
          setupMeterDate: '',//装表日期：
          changeMeterDate: '',//换表日期：
          splitMeterDate: '',//拆表日期：
          splitMeterWay: '',//拆表类型：

          // 用户-抄表信息
          bookNo: '',//册本号：
          sortNo: '',//排序号：
          lastReadingDate: '',//抄表日：
          meterReadingCycle: '',//抄表周期：
          lastReadingNum: '',//最后抄码：

          // 用户-价格信息
          useWaterTypeName: '',//用水类型：
          prefStrategyName: '',//优惠策略：
          prefCertNo: '',//优惠证件号码：
          ladderPersonNum: '',//用水人口：

        },
        msInfo: {
          // 用户-水表信息
          factoryNo: '',//水表表身号：
          meterTypeName: '',//水表类型：
          meterBoreName: '',//水表口径：
          meterFactoryName: '',//水表厂家：
          meterModelName: '',//水表型号：
          transCommFee: '',//远传通讯费：
          commOperatorName: '',//通讯运营商：
          commFeeStart: '',//通讯费开始日期：
          commFeeEnd: '',//通讯费结束日期：

        },
      },
      UserInformationName: "查看用户资料详情",
      userEditVisible: false,
      PredepositDdetailsInfoData: {//账户流水
        accountNo: '',
      },
      //流水界面显示
      FlowingTableVisible: false,

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

    }
  },
  mounted() {
    this.init();
    this.getAccountInit()
    this.getUserInit()
  },
  watch: {
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    async showPrice() {
      let _this = this
      try {
        if (window.location.href.indexOf('HallBusiness')) {
          setTimeout(() => {
            $('.v-modal').css('z-index', '2000!important')
          }, 1000);
        }
        let val = this.common.handleTreeData(this.userEditData.userInfo.useWaterType)
        let getId = await this.$api.fetch({ params: { busicode: 'GetWaterPriceId', data: { id: val } } });
        if (getId.id) {
          let valForm = await this.$api.fetch({ params: { busicode: 'WaterPriceQuery', data: { id: getId.id } } });
          let handleData = valForm.WaterPricebean;
          _this.EditVisible = true

          setTimeout(() => {
            _this.$refs.WaterPriceEdit.costNameOptions = valForm.costlist;
            console.log(handleData);
            _this.$refs.WaterPriceEdit.editData(handleData);
            _this.$refs.WaterPriceEdit.EditRight = false;
            _this.$refs.WaterPriceEdit.EditShow = false
          }, 1000);
        } else {
          _this.$message({
            message: "此用水类型暂无价格信息",
            type: "warning"
          });
        }

      } catch (e) {
        console.log(e);
        return
      }
    },
    changeAccount(row){
      let _this = this
      
      this.$confirm("是否确定修改?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "ChangeUserAccount",
            data: {ctmNo:row.ctmNo,userNo:row.userNo,accountNo:row.accountNo,newAccountNo:row.newAccountNo}
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.$message({
                message: "修改成功！",
                type: "success"
              });
            }).catch(()=>{
              row.newAccountNo = row.accountNo
            });
        })
        .catch(() => {

          _this.$message({
            type: "info",
            message: "已取消"
          });
          row.newAccountNo = row.accountNo
        });
    },
    async showDiscount() {
      let _this = this
      try {
        if (window.location.href.indexOf('HallBusiness')) {
          setTimeout(() => {
            $('.v-modal').css('z-index', '2000!important')
          }, 1000);
        }
    let val = this.userEditData.userInfo.userNo;
      let params = {
        busicode: "UserDiscountList",
        data: { id: "", userNo: val, type: 1 },
      };
      _this.$api.fetch({ params }).then((discountData) => {
  
         this.discountData = discountData
         this.userNo = this.userEditData.userInfo.userNo;
      });
      _this.userDiscountVisible = true
      } catch (e) {
        return
      }
    },
      async showUserMixture() {
      let _this = this
      try {
        if (window.location.href.indexOf('HallBusiness')) {
          setTimeout(() => {
            $('.v-modal').css('z-index', '2000!important')
          }, 1000);
        }
    let val = this.userEditData.userInfo.userNo;
          let params = {
        busicode: "UserMinxtureList",
        data: { id: "", userNo: val, type: 1 },
      };
      _this.$api.fetch({ params }).then((mixtureData) => {
      
         this.mixtureData = mixtureData
         this.userNo = this.userEditData.userInfo.userNo;
      });
      _this.userMixtureVisible = true
      } catch (e) {

        return
      }
    },
    FlowingShow(index, row) {
      this.PredepositDdetailsInfoData.accountNo = row.accountNo
      this.FlowingTableVisible = true
    },
    indexMethod(index) {
      return (index + 1);

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    init() {
      let _this = this
      let params = {
        "busicode": "ClientInfoQuery",
        "data": {
          'ctmNo': _this.formDataUserNo,
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.formData.ctmInfo = res;
      })
    },
    //获取账户列表
    getAccountInit() {
      let _this = this
      let params = {
        "busicode": "QueryAccountByCtm",
        "data": {
          'ctmNo': _this.formDataUserNo,
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.accountData = res;
      })
    },

    //账户详情数据获取
    getAccountEdit(index, row) {
      let _this = this
      let params = {
        "busicode": "AccountInfoQuery",
        "data": {
          'accountNo': row.accountNo,
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.accountEditData = res;
        _this.accountEditVisible = true;
      })

    },

    //获取用户列表
    getUserInit(val) {

      let _this = this
      let params = {
        "busicode": "QueryUserByCtm",
        "data": {
          'ctmNo': _this.formDataUserNo,
          'accountNo': val,
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.userData = res;
      })
    },
    //用户详情数据获取
    getUserEdit(index, row) {
      let _this = this
      let data = {
        userNo: row.userNo,
      }
      let params = {
        "busicode": "UserInfoQuery",
        data,
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.userEditVisible = true;
        _this.userEditData = res
      })

    },
    closeDialog() { //关闭会话
      this.userMixtureVisible = false,
      this.userDiscountVisible = false,
      this.EditVisible = false
      this.Changeshow = false;
      this.WaterUseshow = false;
      this.MeterReadshow = false;
      this.Predeposhow = false;
      this.Attachmshow = false;
      this.DataChangeshow = false;
    },
    // 点击账户行，切换用户列表
    handleRowChange(row) {

      if(this.initUserNoFlag && this.initUserNoFlag.accountNo===row.accountNo){
        this.initUserNoFlag={}
        this.$refs.retable.toggleRowSelection(row,false)
        this.highlightFlag=false
        this.getUserInit()
      }else{
        this.initUserNoFlag=row
        this.getUserInit(row.accountNo)
        this.highlightFlag=true
      }
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
  }
}
</script>
<style lang="scss" scoped>
.ctmInfo {
/deep/{
  .el-select {
    .el-input {
      .el-select__caret {
        line-height: 28px;
      }
    }
  }
}
  .el-dialog__wrapper{
    overflow-y: unset;
    /deep/.scorllModel{
     overflow-y: unset;
  }
    }
  .FlowingTabel {
    .el-form-item__content /deep/ .el-date-editor {
      width: 340px;
    }
    .el-dialog__body {
      padding: 10px;
    }
  }
  .UserInformation {
    .el-dialog__body {
      height: calc(100% - 60px);
      padding: 0px;
      overflow-y: auto;
    }
  }
  .account-left {
    width: 48%;
    float: left;
    padding: 0px 10px 0px 0px;
  }
  .user-right {
    width: 50%;
    float: right;
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
  /deep/ {
    .is-disabled {
      .el-input__inner{
        color: #606266;
      }
    }
  }
  
  .clickable {
    color: #409eff;
    cursor: pointer;
  }
}
/deep/ {
  .el-dialog__body {
    padding-top: 10px;
    .btn-group {
      margin-bottom: 10px;
    }
   .main-form{
    height: 570px;
    overflow-y: auto;
  }
  }
}
</style>

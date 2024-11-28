<template>
  <div class="waterMeterHandleInfo">
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        busicode="ReceiptAccessoryList"
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 预览电子签名 -->
    <el-dialog :title="signName" :visible.sync="signVisible" :close-on-click-modal="false" class="button-dialog">
      <img src="@/assets/images/sign.jpg" alt="签名">

    </el-dialog>
    <!-- 查看需求咨询 -->
    <el-dialog :title="queryName" v-show="queryDetailShow" :visible.sync="queryDetailShow" :close-on-click-modal="false" class="common-dialog">
      <!-- <waterQuery ></waterQuery> -->

      <!-- 详情页面 -->
      <!-- <waterQuery ref="handleInfo" :wQEditData="queryDetailData" :ConstructionShow="ConstructionShowData" style="height:calc(100% - 41px)" :indexAdd="indexAddDate" 
      v-if="queryDetailShow" @fromHandleChild="getChildHandleNum" @fromChildVal="getChildTabsNum">
      </waterQuery> -->
      <waterQuery ref="handleInfo" :openWay="openWay" :editNeedData="queryDetailData" style="height:calc(100% - 41px)"
      v-if="queryDetailShow">
      </waterQuery>

    </el-dialog>

    <div class='process'>
      <div class="process-left">
        <el-form :model="formData" class="formBill" :disabled="NotDisabled" :inline="true" size="mini" ref="form" :rules="rules" label-width="130px">
          <el-form-item label="单据编号：" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled v-model="formData.billNo" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="单据日期：" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled v-model="formData.billDate" placeholder=""></el-input>
          </el-form-item>

          <legend class="legendColumn"> 客户信息 </legend>

          <el-form-item label="客户编号：" prop="ctmNo" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.ctmNo" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="客户类型：" prop="ctmType" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.ctmType" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="业主名称：" prop="ctmName" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.ctmName" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="业主证件类型：" prop="certType" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.certType" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="业主证件号码：" prop="certNo" style="width: calc(46% + 10px)" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.certNo" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="业主电话：" prop="mobile" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.mobile" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <legend class="legendColumn"> 工程信息 </legend>

          <el-form-item label="工程类型：" prop="pjTypeName" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.pjTypeName" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="紧急程度：" prop="urgentFlag" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.urgentFlag" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="装表地址：" prop="installAddr" class="disable-item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.installAddr" size="mini" clearable class="read-only" :disabled="true"></el-input>
          </el-form-item>
          <!-- 工程收款 
          <div v-if="operationShow == 'charge' || operationShow == 'Process-task1'">
            <legend class="legendColumn"> 收款信息 </legend>

            <el-form-item label="预缴合计：" prop="prepayMoney">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.charge.prepayMoney" size="mini" clearable class="read-only" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="押金合计：" prop="depositMoney">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.charge.depositMoney" size="mini" clearable class="read-only" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="应收合计：" prop="budgetMoney">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.charge.budgetMoney" size="mini" clearable class="read-only" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="收款人员：" prop="budgetPayStaff">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.charge.budgetPayStaff" size="mini" clearable class="read-only" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="收款日期：" prop="budgetPayDate">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.charge.budgetPayDate" size="mini" clearable class="read-only" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="缴款说明：" class="Remarks" prop="budgetPayComments">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="textarea" disabled v-model="formData.charge.budgetPayComments"></el-input>
            </el-form-item>

          </div>-->
          <!-- 安装施工 -->
          <div v-if="operationShow == 'build' || operationShow == 'Process-task2'">
            <el-tabs type="border-card" tab-position="bottom" @tab-click="tabCurrent">
              <el-tab-pane label="基础信息">

                <legend class="legendColumn"> 安装信息 </legend>

                <el-form-item label="派单日期：" prop="build.sendOrderDate" :class="{'disable-item': NotDisabled}">
                  <el-date-picker v-model="formData.build.sendOrderDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期">
                  </el-date-picker>
                  <span v-else>{{formData.build.sendOrderDate}}</span>
                </el-form-item>

                <el-form-item label="施工人员：" prop="build.constGroup" style="width:280px" :class="{'disable-item': NotDisabled}">
                  <el-select v-model="formData.build.constGroup" size="mini" placeholder="施工人员" multiple v-if="!NotDisabled" disabled>
                    <span slot="prefix">{{constGroupName}}</span>
                    <el-option v-for="item in constGroupList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                  </el-select>
                  <span v-else>{{formData.build.constGroupName}}</span>
                </el-form-item>

                <el-form-item label="工程收款主体：" prop="build.projectCharge" style="width:280px" class="disable-item">
                  <span>{{formData.build.projectCharge}}</span>
                </el-form-item>
                
                <el-form-item label="开始施工日期：" prop="build.constBeginDate" :class="{'disable-item': NotDisabled}">
                  <el-date-picker v-model="formData.build.constBeginDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期">
                  </el-date-picker>
                  <span v-else>{{formData.build.constBeginDate}}</span>
                </el-form-item>

                <el-form-item label="结束施工日期：" prop="build.constEndDate" :class="{'disable-item': NotDisabled}">
                  <el-date-picker v-model="formData.build.constEndDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期">
                  </el-date-picker>
                  <span v-else>{{formData.build.constEndDate}}</span>
                </el-form-item>

                <el-form-item label="施工说明：" class="Remarks" prop="constComments" :class="{'disable-item': NotDisabled}">
                  <el-input type="textarea" v-model="formData.build.constComments" v-if="!NotDisabled"></el-input>
                  <span v-else>{{formData.build.constComments}}</span>
                </el-form-item>
              </el-tab-pane>

              <el-tab-pane label="多水表">
                <waterMeter ref="buildwaterMeter" :id="formData.consultId" :NotDisabled="NotDisabled" :editShow="false"></waterMeter>
              </el-tab-pane>

              <el-tab-pane label="施工材料">
                <ConstructionMaterials ref="ConstructionMaterials" :isId="formData.consultId" :NotDisabled="NotDisabled">
                </ConstructionMaterials>
              </el-tab-pane>
            </el-tabs>

          </div>
          <!-- 工程验收 -->
          <div v-if="operationShow == 'check' || operationShow == 'Process-task12'">
            <legend class="legendColumn"> 验收信息 </legend>

            <el-form-item label="验收人员：" style="width:280px" prop="check.checkStaff" :class="{'disable-item': NotDisabled}">
              <!--el-input v-model="formData.check.checkStaff" size="mini" :disabled="NotDisabled" clearable></el-input-->
              <el-select v-model="formData.check.checkStaff" size="mini" placeholder="验收人员" multiple v-if="!NotDisabled">
                <span slot="prefix">{{checkStaffName}}</span>
                <el-option v-for="item in checkStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
              <span v-else>{{formData.check.checkStaffName}}</span>
            </el-form-item>

            <el-form-item label="验收日期：" prop="check.checkDate" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-model="formData.check.checkDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.check.checkDate}}</span>
            </el-form-item>
            <el-form-item label="工程收款主体：" prop="build.projectCharge" style="width:280px" class="disable-item">
              <span>{{formData.build.projectCharge}}</span>
            </el-form-item>
            <el-form-item label="验收说明：" class="Remarks" prop="checkDesc" :class="{'disable-item': NotDisabled}">
              <el-input type="textarea" v-model="formData.check.checkDesc" v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.check.checkDesc}}</span>
            </el-form-item>
          </div>
          <!-- 立户 -->
          <div v-if="operationShow == 'open' || operationShow == 'Process-task13'">
            <legend class="legendColumn">水表明细
              <!-- <el-button icon="el-icon-document-copy" type="text" size="mini">整列复制</el-button> -->
            </legend>
            <waterMeter v-if="operationShow == 'open' || operationShow == 'Process-task13'" ref="waterMeter1" :NotDisabled="NotDisabled" :id="formData.consultId">
            </waterMeter>
          </div>
          <!-- 编制结算 --> 
          <div v-if="operationShow == 'preSetmt' || operationShow == 'Process-task10'">
            <ConstructionMaterials ref="ConstructionMaterials" v-if="ConstructionShow" :isId="formData.consult.id"></ConstructionMaterials>
            <legend class="legendColumn"> 编制结算信息 </legend>
            <el-form-item label="表前人工费结算：" prop="setmtLaborMeterBefore" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtLaborMeterBefore" type="number"  v-if="!NotDisabled" size="mini" clearable ></el-input>
              <span v-else>{{formData.setmt.setmtLaborMeterBefore}}</span>
            </el-form-item>

            <el-form-item label="表后人工费结算：" prop="setmtLaborMeterAfter" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtLaborMeterAfter" v-if="!NotDisabled" size="mini" clearable ></el-input>
              <span v-else>{{formData.setmt.setmtLaborMeterAfter}}</span>
            </el-form-item>

            <el-form-item label="表前材料费结算：" prop="setmtMatrMeterAfter" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtMatrMeterAfter" v-if="!NotDisabled" size="mini" clearable ></el-input>
              <span v-else>{{formData.setmt.setmtMatrMeterAfter}}</span>
            </el-form-item>

            <el-form-item label="表后材料费结算：" prop="setmtMatrMeterBefore" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtMatrMeterBefore" v-if="!NotDisabled" size="mini" clearable ></el-input>
              <span v-else>{{formData.setmt.setmtMatrMeterBefore}}</span>
            </el-form-item>

            <el-form-item label="其他结算：" prop="setmtOtherMeter" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtOtherMeter" v-if="!NotDisabled" size="mini" clearable ></el-input>
              <span v-else>{{formData.setmt.setmtOtherMeter}}</span>
            </el-form-item>

            <el-form-item label="设计费结算：" prop="setmtDesignCost" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtDesignCost" v-if="!NotDisabled" size="mini" clearable ></el-input>
              <span v-else>{{formData.setmt.setmtDesignCost}}</span>
            </el-form-item>

            <el-form-item label="总管分担费用：" prop="costShare" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.costShare" size="mini" v-if="!NotDisabled" clearable ></el-input>
              <span v-else>{{formData.setmt.costShare}}</span>
            </el-form-item>

            <el-form-item label="结算合计：" prop="setmtMoney" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.setmt.setmtMoney" size="mini" class="read-only" clearable></el-input>
              <span v-else>{{formData.setmt.setmtMoney}}</span>
            </el-form-item>

            <el-form-item label="预缴合计：" prop="prepayMoney" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.prepayMoney" size="mini" disabled class="read-only" clearable></el-input>
            </el-form-item>

            <el-form-item label="退补金额：" prop="backFillMoney" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.backFillMoney" size="mini" disabled class="read-only" clearable></el-input>
            </el-form-item>

            <el-form-item label="结算人员：" prop="setmt.setmtStaff" :class="{'disable-item': NotDisabled}">
              <!--el-input v-model="formData.setmt.setmtStaff" size="mini" :disabled="NotDisabled" clearable></el-input-->
              <el-select v-model="formData.setmt.setmtStaff" size="mini" placeholder="结算人员" v-if="!NotDisabled">
                <el-option v-for="item in setmtStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
              <span v-else>{{formData.setmt.setmtStaffName}}</span>
            </el-form-item>

            <el-form-item label="编制日期：" prop="setmt.setmtDate" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-model="formData.setmt.setmtDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.setmt.setmtDate}}</span>
            </el-form-item>
            <el-form-item label="工程收款主体：" prop="build.projectCharge" style="width:280px" class="disable-item">
                  <span>{{formData.build.projectCharge}}</span>
                </el-form-item>
            <el-form-item label="编制说明：" class="Remarks" prop="setmtComments" :class="{'disable-item': NotDisabled}">
              <el-input type="textarea" v-model="formData.setmt.setmtComments" v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.setmt.setmtComments}}</span>
            </el-form-item>
          </div>
          <!-- 工程结算 -->
          <div v-if="operationShow == 'setmt' || operationShow == 'Process-task4'">
            <legend class="legendColumn"> 退款信息</legend>

            <el-form-item label="结算合计：" prop="setmtMoney" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtMoney" size="mini" disabled class="read-only" clearable type="number" @change='countNum()'></el-input>
            </el-form-item>

            <el-form-item label="预缴金额：" prop="prepayMoney" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.prepayMoney" size="mini" disabled class="read-only" clearable type="number" @change='countNum()'></el-input>
            </el-form-item>

            <el-form-item label="退补金额：" prop="backFillMoney" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.backFillMoney" size="mini" clearable disabled class="read-only"></el-input>
            </el-form-item>

            <el-form-item label="收款方式：" prop="paymentMethod" class="disable-item">
              
            </el-form-item>

            <el-form-item label="结算人员：" prop="settlers" :class="{'disable-item':NotDisabled}">
              <!--el-input v-model="formData.setmt.setmtStaff" size="mini" disabled clearable></el-input-->
              <el-select v-model="formData.setmt.setmtStaff" size="mini" placeholder="结算人员" v-if="!NotDisabled">
                <el-option v-for="item in setmtStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
              <span v-else>{{formData.setmt.setmtStaffName}}</span>
            </el-form-item>

            <el-form-item label="结算日期：" prop="settlementDate" :class="{'disable-item':NotDisabled}">
              <el-date-picker v-model="formData.refund.setmtPayDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-if="!NotDisabled" type="date" placeholder="选择日期">
              </el-date-picker>
              <span v-else>{{formData.refund.setmtPayDate}}</span>
            </el-form-item>
            <el-form-item label="工程收款主体：" prop="build.projectCharge" style="width:280px" class="disable-item">
                  <span>{{formData.build.projectCharge}}</span>
                </el-form-item>
            <el-form-item label="结算说明：" class="Remarks" prop="settlementStatement" :class="{'disable-item':NotDisabled}">
              <el-input v-if="!NotDisabled" type="textarea" v-model="formData.setmt.setmtComments" disabled class="read-only"></el-input>
              <span v-else>{{formData.setmt.setmtComments}}</span>
            </el-form-item>

            <el-form-item label="余款退款方式：" class="Remarks" prop="refundWay">

              <el-radio v-model="formData.refund.refundWay" label="0">无</el-radio>
              <el-radio v-model="formData.refund.refundWay" label="1">现金</el-radio>
              <el-radio v-model="formData.refund.refundWay" label="10">转账</el-radio>
              <el-radio v-model="formData.refund.refundWay" label="5">转余额</el-radio>

              <!-- <el-select v-model="formData.register.refundWay"  clearable size="mini"  >
                        <el-option v-for="item in dictionaryData.PBT" :key="item.value" :label="item.name" :value="item.value"></el-option>
                      </el-select> -->
            </el-form-item>
            <br>

            <el-form-item label="开户银行：" prop="bankName" :class="{'disable-item':NotDisabled}">

              <el-cascader v-if="!NotDisabled" v-model="formData.refund.bankName" :options="openABankOptions" :show-all-levels="false" :props="props">
              </el-cascader>
              <span v-else>{{formData.refund.bankNameName}}</span>
            </el-form-item>

            <el-form-item label="开户名称：" prop="bankAccountName" :class="{'disable-item':NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.refund.bankAccountName" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.refund.bankAccountName}}</span>
            </el-form-item>

            <el-form-item label="银行账户：" prop="bankAccount" :class="['id-card',{'disable-item':NotDisabled}]" style="width: calc(46% + 10px)">
              <el-input placeholder="银行账户" v-model="formData.refund.bankAccount" class="input-with-select" clearable v-if="!NotDisabled" @input="validateBankAccount">
                <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
              </el-input>
              <span v-else>{{formData.refund.bankAccount}}</span>
            </el-form-item>

          </div>
          <legend class="legendColumn">上传附件
            <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
          </legend>
          <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
          <legend class="legendColumn"> 流程处理 </legend>
          <div id="workflowDiv"></div>
        </el-form>
      </div>
      <div class="StepCollapse" @click="collapse">
        <i class="el-icon-arrow-right leftChange"></i>
      </div>
      <div class="process-right" v-if="approvalShow">

        <div class="stepsTitle">流程信息</div>
        <div class="line"></div>
        <el-steps :active="operation" direction="vertical" finish-status="success">
          <!--el-step title="工程收款" @click.native="stepActive(0,'charge')"></el-step-->
          <el-step title="安装施工" @click.native="stepActive(0,'build')"></el-step>
          <el-step title="工程验收" @click.native="stepActive(1,'check')"></el-step>
          <el-step title="立户" @click.native="stepActive(2,'open')"></el-step>
          <el-step title="编制结算" @click.native="stepActive(3,'preSetmt')"></el-step>
          <el-step title="工程结算" @click.native="stepActive(4,'setmt')"></el-step>
          <!-- <el-step title="表计挂接" @click.native="stepActive(11)"></el-step> -->
          <!-- <el-step title="结束" @click.native="stepActive(12)"></el-step> -->
        </el-steps>

      </div>
    </div>

  </div>
</template>
<script>
import ConstructionMaterials from '@/components/ConstructionMaterials';
import waterMeter from '@/components/waterMeter';
// import waterMeter1 from '@/components/waterMeter';
import choosectm from "@/components/ctmInfor"
import waterQuery from "../waterQuery/waterQueryHandle"
import uploadFile from '@/components/uploadPic'
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "waterMeterHandleInfo",
  components: {
    ConstructionMaterials,
    waterMeter,
    // waterMeter1,
    uploadFile,
    choosectm,
    waterQuery,
    AttachmentViewInfo
  },
  props: ['editNeedData', 'ConstructionShow'],
  data() {
    return {
      openWay:"waterMeterHandleInfo",
      businessArea:"",
      checkStaffList:[],
      setmtStaffList:[],
      constGroupList:[],
      receiptType: "PJ_INSTALL",
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      approvalShow: true,
      queryName: "用水需求咨询",
      queryDetailShow: false,
      eleSignType: "进行签名",
      signName: "电子签名",
      signVisible: false,
      choosectmName: "选择客户",
      choosectmVisible: false,
      operationShow: 5,
      operation: 0,
      NotDisabled: false,// 是否可编辑
      dictionaryData: [],//数据字典存值
      openABankOptions: [],//开户银行下拉框
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      crumbsData: { //面包屑
        titleList: [
          { title: '工程管理' },
          { title: '用户工程' },
          { title: '用水安装' },
        ],
      },
      // 用水咨询数据获取
      queryDetailData: {},
      // 校验
      rules: {
        build: {
          sendOrderDate:[{ required: true, message: '请输入派单日期', trigger: 'change' }],
          //constGroup:[{ required: true, message: '请输入施工人员', trigger: 'blur' }],
          constBeginDate:[{ required: true, message: '请输入开始施工日期', trigger: 'change' }],
          constEndDate:[{ required: true, message: '请输入结束施工日期', trigger: 'change' }],
        },
        check:{
          checkStaff:[{ required: true, message: '请输入验收人员', trigger: 'blur' }],
          checkDate:[{ required: true, message: '请输入验收日期', trigger: 'change' }],
        },
        setmt:{
          setmtStaff:[{ required: true, message: '请输入编制人员', trigger: 'blur' }],
          setmtDate:[{ required: true, message: '请输入编制日期', trigger: 'blur' }],
        }
          
      },
      formData: {
        // 单据信息
        billNo: '',//单据编号
        billDate: '',//单据日期
        id: "",
        consultId: "",
        // 客户信息
        ctmInfo: {
          ctmNo: "",//客户编号
          ctmType: "1", //客户类型
          ctmName: "",//业主名称
          certType: "1", //业主证件类型
          certNo: "", //业主证件号码
          mobile: "",//业主电话
        },
        // 工程信息
        register: {
          pjType: "1",//工程类型
          pjTypeName: "",//工程类型
          urgentFlag: "1",//紧急程度
          installAddr: "",//装表地址
        },
        // 工程收款节点
        charge: {
          prepayMoney: "",//预缴合计
          depositMoney: "",//押金合计
          budgetMoney: "",//应收合计
          budgetPayStaff: "",//收款人员
          budgetPayDate: this.common.date(),//收款日期
          budgetPayComments: "",//缴款说明
        },
        // 施工安装节点
        build: {
          sendOrderDate: this.common.date(),//派单日期
          constGroup: "",//施工班组
          constBeginDate: this.common.date(),//开始施工日期
          constEndDate: this.common.date(),//结束施工日期
          constComments: "",//施工说明
        },
        // 工程验收节点
        check: {
          checkStaff: "",//验收人员
          checkDate: this.common.date(),//验收日期
          checkDesc: "",//验收说明
        },
        //编制结算节点
        setmt: {
          setmtLaborMeterBefore: "",//表前人工费结算
          setmtLaborMeterAfter: "",//表后人工费结算
          setmtMatrMeterAfter: "",//表前材料费结算
          setmtMatrMeterBefore: "",//表后材料费结算
          setmtOtherMeter: "",//其他结算
          setmtDesignCost: "",//设计费结算
          costShare: "",//总管分担费用
          setmtMoney: "",//结算合计
          prepayMoney: "",//预缴合计
          backFillMoney: "",//退补金额
          setmtStaff: "",//编制人员
          setmtDate: this.common.date(),//编制日期
          setmtComments: "",//编制说明
          setmtFlag:0,//为1直接结束流程
        },
        refund: {
          setmtPayDate:"",//结算日期
          bankName: "",//开户银行
          bankAccountName: "",//开户名称
          bankAccount: "",//银行账户
          refundWay: "",//余款退款方式
        },
      },
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
      attachmentData: [],
      constGroup:[],
    }
  },
  computed: {
    constGroupName() {
      return this.constGroupList && this.constGroupList.filter(item => this.formData.build.constGroup.includes(item.userAccount)).map(item => item.userName).join(', ')
    },
    checkStaffName() {
      return this.checkStaffList && this.checkStaffList.filter(item => this.formData.check.checkStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
    }
  },
  mounted() {
    //console.log(this.ConstructionShow)
    this.clearformData()
    let params = {
          "busicode": "PjInstallQuery",
          "data":  {
            'id':this.editNeedData.id,
          }
        }
    this.$api.fetch({
      params: params,//参数
    }).then(res => {
      this.formData = res
      this.operationShow = this.formData.processState==''?'build':this.formData.processState;
      //审批界面接口
      this.getHtmlData();
      this.$set(this.formData.build,"constGroup",this.formData.build.constGroup.split(','));
      
      if(this.formData.check.checkStaff.length>0){
        this.$set(this.formData.check,"checkStaff",this.formData.check.checkStaff.split(','));
      }else{
        this.formData.check.checkStaff=[]
      }
      
      if(res.processState =='build'|| res.processState =='Process-task2'){
        this.stepActive(0,'build')
        this.$nextTick(() => {
          this.$refs.buildwaterMeter.init();
        })
      }else if(res.processState =='check'|| res.processState =='Process-task12'){
        this.stepActive(1,'check')
      }else if(res.processState =='open'|| res.processState =='Process-task13'){
        this.stepActive(2,'open')
      }else if(res.processState =='preSetmt'|| res.processState =='Process-task10'){
        this.stepActive(3,'preSetmt')
      }else if(res.processState =='setmt'|| res.processState =='Process-task4'){
        this.stepActive(4,'setmt')
      }else{
        this.stepActive(0,'build')
      }
      this.queryWater(this.formData.consultId)
      
      localStorage.setItem('billId', this.formData.consultId)
      eventBus.$emit('receiptId', this.editNeedData.id)
    })
    // 开户银行
    this.selectOABankOptions()
    this.getCheckStaffList()
    this.getDesignStaffList()
    this.getConstGroupList()
    //this.$refs.buildwaterMeter.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, '.engineer-center .engineer-center-right', ['.engineer-center .table-top'])
    })
    eventBus.$on('operation', (item) => {
      this.operationShow = item.num;
    });
  },
  watch: {
    //输入金额监听格式
    "formData.setmt.setmtLaborMeterBefore":{
        handler: function(val, olVal){
          this.formData.setmt.setmtLaborMeterBefore=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.setmtLaborMeterAfter":{
        handler: function(val, olVal){
          this.formData.setmt.setmtLaborMeterAfter=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.setmtMatrMeterAfter":{
        handler: function(val, olVal){
          this.formData.setmt.setmtMatrMeterAfter=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.setmtMatrMeterBefore":{
        handler: function(val, olVal){
          this.formData.setmt.setmtMatrMeterBefore=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.setmtOtherMeter":{
        handler: function(val, olVal){
          this.formData.setmt.setmtOtherMeter=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.setmtDesignCost":{
        handler: function(val, olVal){
          this.formData.setmt.setmtDesignCost=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.costShare":{
        handler: function(val, olVal){
          this.formData.setmt.costShare=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    "formData.setmt.setmtMoney":{
        handler: function(val, olVal){
          this.formData.setmt.setmtMoney=val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        },
        deep: true,
        immediate:true
    },
    queryDetailShow(val) {
      if(!val) {
        this.getHtmlData()
      }
    },
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    operationShow(newVal, oldVal) {
      if (newVal == 'END') {//已完成charge
        this.operation = 1;
        this.NotDisabled = true;
        this.operationShow = 'build'
      } else if (newVal == 'CANCEL') {//已废弃
        this.operation = 1;
        this.NotDisabled = true;
        this.operationShow = 'build'
      } else {//进行中

        /*if (newVal == 'charge' || newVal == 'Process-task1') {//工程收款
          //this.operation = 0;
        } else 
        */
        if (newVal == 'build' || newVal == 'Process-task2') {//安装施工
          this.operation = 0;
        } else if (newVal == 'check' || newVal == 'Process-task12') {//工程验收
          this.operation = 1;
        } else if (newVal == 'open' || newVal == 'Process-task13') {//开户
          this.operation = 2;
          this.$nextTick(() => {
            this.$refs.waterMeter1.init();
            this.$refs.waterMeter1.changeArea(this.businessArea)
          })
          // eventBus.$emit('openInit', 'open');
          
        } else if (newVal == 'preSetmt' || newVal == 'Process-task10') {//编制结算
          this.operation = 3;
        } else if (newVal == 'setmt' || newVal == 'Process-task4') {//工程结算
          this.operation = 4;
          // 数据字典
          this.getDictionary();
        }
        //在相同业务节点下
        if (this.formData.processState == newVal || this.formData.processState==='') {
          if (this.formData.approveFlag == 1) {
            //审批节点
            this.NotDisabled = true//不可修改
          } else {
            //非审批节点
            this.NotDisabled = false//可修改
          }
          // 不同的业务节点
        } else {
          this.NotDisabled = true//不可修改
        }
      }
    },
  },
  methods: {
    //施工班组
    getConstGroupList(){
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "8" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.constGroupList = [...res];
        });
    },
    // 结算人员数据获取
    getDesignStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "11" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.setmtStaffList = [...res];
        });
    },
    //打印流程审批记录
    workFlowPrint(){
      let _this=this
      let data={
        billId:_this.editNeedData.id,
        processCode:"pj_install"
      }
      let params = {
        busicode: "WorkFlowHistoryPrint",
        data:data,
      };
      _this.$api.fetch({
        params: params,
      }).then(res => {
          let data = res
          _this.common.print('print', 'WorkFlowHistoryPrint', '', data[0], _this);
      })
    },
    // 验收人员数据获取
    getCheckStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "10" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.checkStaffList = [...res];
        });
    },
    addProject(val){
      let params={
        "busicode": "PjAddProject",
        "data": {
          ysAmount:val.YSAmount,
          yjAmount:val.YAmount,
          consultId:this.formData.consultId,
          id:this.formData.id,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '添加工程收款成功',
          type: 'success'
        });
        this.$parent.closeAddDialog();
      })
    },
    // getTotal(){
    //   this.formData.setmt.setmtMoney=Number(this.formData.setmt.setmtLaborMeterBefore) + 
    //     Number(this.formData.setmt.setmtLaborMeterAfter) + Number(this.formData.setmt.setmtMatrMeterAfter) +
    //     Number(this.formData.setmt.setmtMatrMeterBefore) + Number(this.formData.setmt.setmtOtherMeter) + 
    //     Number(this.formData.setmt.setmtDesignCost) + Number(this.formData.setmt.costShare);
    //   this.formData.setmt.backFillMoney = Number(this.formData.setmt.setmtMoney)-Number(this.formData.setmt.prepayMoney)
    // },
    async BeforeSubmit(val){
      //收款机节点不允许提交
      //if((this.formData.processState==='Process-task1' || this.formData.processState==='charge')&&val.operation===32){
      //  return "当前节点不允许提交,请到工程收费进行收费"
      //}
      //结算单已收费 工程结算节点不允许驳回到之前节点
      //let meterData = this.$refs.buildwaterMeter.getData();
      //console.log(meterData);
      
      return null
    },
    getFormbData() {
      let data = {}
      //安装施工
      if (this.formData.processState == 'build' || this.formData.processState == '') {
        data = {
          id: this.formData.id,
          processState: this.formData.processState,
          sendOrderDate: this.formData.build.sendOrderDate,
          constGroup: this.formData.build.constGroup.toString(),
          constBeginDate: this.formData.build.constBeginDate,
          constEndDate: this.formData.build.constEndDate,
          constComments: this.formData.build.constComments,
        }
        //工程验收
      } else if (this.formData.processState == 'check') {
        data = {
          id: this.formData.id,
          processState: this.formData.processState,
          checkStaff: this.formData.check.checkStaff.toString(),//验收人员
          checkDate: this.formData.check.checkDate,//验收日期
          checkDesc: this.formData.check.checkDesc,//验收说明
        }
        //验收审批
      }else if (this.formData.processState == 'Process-task12') {
        data = {
          id: this.formData.id,
          processState: this.formData.processState,
          formVariables:{
            "pjType":this.formData.register.pjType
          }
        }
        //立户
      } else if (this.formData.processState == 'open') {
        data = {
          id: this.formData.id,
          processState: this.formData.processState,
        }
        
        //立户审批
      }else if(this.formData.processState == 'Process-task13'){

        data = {
          id: this.formData.id,
          processState: this.formData.processState,
          formVariables:{
            "setmtFlag":this.formData.setmt.setmtFlag
          }
        }
        //编制结算
      }else if (this.formData.processState == 'preSetmt') {
        data = {
          id: this.formData.id,
          processState: this.formData.processState,
          setmtLaborMeterBefore: this.formData.setmt.setmtLaborMeterBefore,//表前人工费结算
          setmtLaborMeterAfter: this.formData.setmt.setmtLaborMeterAfter,//表后人工费结算
          setmtMatrMeterAfter: this.formData.setmt.setmtMatrMeterAfter,//表前材料费结算
          setmtMatrMeterBefore: this.formData.setmt.setmtMatrMeterBefore,//表后材料费结算
          setmtOtherMeter: this.formData.setmt.setmtOtherMeter,//其他结算
          setmtDesignCost: this.formData.setmt.setmtDesignCost,//设计费结算
          costShare: this.formData.setmt.costShare,//总管分担费用

          setmtMoney: this.formData.setmt.setmtMoney,//结算合计
          prepayMoney: this.formData.setmt.prepayMoney,//预缴合计
          backFillMoney: this.formData.setmt.backFillMoney,//退补金额
          setmtStaff: this.formData.setmt.setmtStaff,//编制人员
          setmtDate: this.formData.setmt.setmtDate,//编制日期
          setmtComments: this.formData.setmt.setmtComments,//编制说明
        }
        //工程结算
      } else if (this.formData.processState == 'setmt') {
        data = {
          id: this.formData.id,
          processState: this.formData.processState,
          setmtPayDate:this.formData.refund.setmtPayDate,//结算日期
          refundWay:this.formData.refund.refundWay,//余款退款方式
          bankName:this.common.handleTreeData(this.formData.refund.bankName),//开户银行
          bankAccountName:this.formData.refund.bankAccountName,//开户名称
          bankAccount:this.formData.refund.bankAccount,//银行账号
        }
      }
      return data
    },
    save(){
      this.$refs.waterMeter1.SaveWaterMeter(this.formData.consultId);
    },
    saveMaterials(){
      this.$refs.ConstructionMaterials.save();
    },
    submit(index) {//步骤条-工程登记-暂存/暂存
      var params = {
        "busicode": "PjInstallSave",
        "data": this.getFormbData()
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {

        this.$notify({
          title: '成功',
          message: '表单保存成功',
          type: 'success'
        });
      })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView("PJ_INSTALL",
        "审批流配置:" + _this.formData.processName + "(" + _this.formData.billNo + ")",
        _this.formData.id,
        _this.formData.processInstanceId, "workflowDiv", _this, () => {
          
          if(_this.formData.processState=='open'){
            _this.save();
          }else if(_this.formData.processState=='build'){
            console.log(this.$refs.buildwaterMeter);
            
            this.$refs.buildwaterMeter.SaveWaterMeter(this.formData.consultId);
            _this.saveMaterials();
          }
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        }, _this.formData.approveFlag,
        'PjInstallSave'
      );
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PBT"
        //余款退款方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    clearformData() {

      this.formData = {
        // 单据信息
        billNo: '',//单据编号
        billDate: '',//单据日期
        consultId:"",
        id:"",
        // 客户信息
        ctmInfo: {
          ctmNo: "",//客户编号
          ctmType: "1", //客户类型
          ctmName: "",//业主名称
          certType: "1", //业主证件类型
          certNo: "", //业主证件号码
          mobile: "",//业主电话
        },
        // 工程信息
        register: {
          pjType: "1",//工程类型
          urgentFlag: "1",//紧急程度
          installAddr: "",//装表地址
        },
        // 工程收款节点
        charge: {
          prepayMoney: "",//预缴合计
          depositMoney: "",//押金合计
          budgetMoney: "",//应收合计
          budgetPayStaff: "",//收款人员
          budgetPayDate: this.common.date(),//收款日期
          budgetPayComments: "",//缴款说明
        },
        // 施工安装节点
        build: {
          sendOrderDate: this.common.date(),//派单日期
          constGroup: "",//施工班组
          constBeginDate: this.common.date(),//开始施工日期
          constEndDate: this.common.date(),//结束施工日期
          constComments: "",//施工说明
        },
        // 工程验收节点
        check: {
          checkStaff: "",//验收人员
          checkDate: this.common.date(),//验收日期
          checkDesc: "",//验收说明
        },
        //编制结算节点
        setmt: {
          setmtLaborMeterBefore: "",//表前人工费结算
          setmtLaborMeterAfter: "",//表后人工费结算
          setmtMatrMeterAfter: "",//表前材料费结算
          setmtMatrMeterBefore: "",//表后材料费结算
          setmtOtherMeter: "",//其他结算
          setmtDesignCost: "",//设计费结算
          costShare: "",//总管分担费用
          setmtMoney: "",//结算合计
          prepayMoney: "",//预缴合计
          backFillMoney: "",//退补金额
          setmtStaff: "",//编制人员
          setmtDate: this.common.date(),//编制日期
          setmtComments: "",//编制说明
        },
        refund: {

          bankName: "",//开户银行
          bankAccountName: "",//开户名称
          bankAccount: "",//银行账户
          refundWay: "",//余款退款方式
        },
      }
    },
    collapse() {
      if (this.approvalShow == true) {
        this.approvalShow = false
        this.util.approvalShow(this.approvalShow, '.process-left', '.stepsCompar', '.StepCollapse', '.leftChange')
      } else {
        this.approvalShow = true
        this.util.approvalShow(this.approvalShow, '.process-left', '.stepsCompar', '.StepCollapse', '.leftChange')
      }
    },
    //树结构数据处理
    getArr(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    // 开户银行
    selectOABankOptions() {
      let _this = this
      let params = {
        "busicode": "BankTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.openABankOptions = data;

      })
    },
    queryWater(val){
      let params = {
        "busicode": "PjConsultQuery",
        "data": {
          'id': val,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.businessArea=res.consult.businessArea;
        if (res.consult.businessArea.length>0) {
          this.$refs.waterMeter1 && this.$refs.waterMeter1.changeArea(res.consult.businessArea)

          this.$refs.buildwaterMeter && this.$refs.buildwaterMeter.changeArea(res.consult.businessArea)
        }
      })
    },

    // 查看用水咨询单
    queryDetail() {
      // 详情按钮事件
      // 根据单据状态判断进入的界面
      // 单据状态 processState ：
      /*
      let params = {
        "busicode": "PjConsultQuery",
        "data": {
          'id': this.formData.consultId,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.queryDetailData  = res;
        if(this.queryDetailData.consult.installStaff.length>0){
          this.queryDetailData.consult.installStaff=this.queryDetailData.consult.installStaff.split(',');
        }else{
          this.queryDetailData.consult.installStaff=[]
        }
      })
        */
      this.$set(this.queryDetailData, 'id', this.formData.consultId)
      this.queryDetailShow = true;
    },
    addExecution() {//步骤条-设计-施工材料-添加
      this.$refs.ConstructionMaterials.addExecution();
    },
    saveExecution() {
      this.$refs.ConstructionMaterials.saveExecution();
    },
    //审批流程返回按钮
    operationReturn() {
      eventBus.$emit('operationReturn', false);
    },
    closeDialog() {
    },
    // 多页签的点击
    tabCurrent(val) {
      if (val.index == '1') {
        if (this.indexAdd == 'add') {//点击添加按钮时 不用调用此方法
        } else {
          //this.$refs.waterMeter.init();//初始化 多水表页面
          if(this.$refs.buildwaterMeter.tableData[0].id.length==0){
            this.$refs.buildwaterMeter.init();
            this.$refs.buildwaterMeter.changeArea(this.businessArea)
          }
          
        }
      }
      this.$emit('fromChild', val.index)//给父组件传递当前tabs值 0/登记界面 1/多水表界面  
    },
    countNum() {

      let settlementTotal = this.formData.settlementTotal;
      let advancePayment = this.formData.advancePayment;
      if (!settlementTotal) {
        settlementTotal = 0;
      }
      if (!advancePayment) {
        advancePayment = 0;
      }
      let amountRefund = Number(settlementTotal) - Number(advancePayment)
      amountRefund = amountRefund.toFixed(2)
      this.$set(this.formData, 'amountRefund', amountRefund);
    },
    chooseCtm() {
      this.$emit('chooseCtm', 'chooseCtm')
    },
    //判断右侧流程节点是否可以点击
    processStep(){
      let process = 0;
      if(this.formData.processState==='charge' || this.formData.processState==='Process-task1' ){
        //process=0
      }else if(this.formData.processState==='build' || this.formData.processState==='Process-task2' || this.formData.processState===''){
        process=0
      }else if(this.formData.processState==='check' || this.formData.processState==='Process-task12'){
        process=1
      }else if(this.formData.processState==='open' || this.formData.processState==='Process-task13'){
        process=2
      }else if(this.formData.processState==='preSetmt' || this.formData.processState==='Process-task10'){
        process=3
      }else if(this.formData.processState==='setmt' || this.formData.processState==='Process-task4'){
        process=4
      }else if(this.formData.processState==='END'){
        process=5
      }
      return process
    },
    stepActive(val, step) {
      let processstep= this.processStep();
      if(processstep>=val){
        if(processstep!==val){
          this.$emit('getChildHandleNum', 'END')
        }else{
          this.$emit('getChildHandleNum', step)
        }
        
        this.operationShow = step;
        this.operation = val;
      }
      
    },
    closechoosectm() {
      this.choosectmVisible = false;
    },
    //上传附件
    uploadAttachment(file, fileList) {
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
          receiptId: this.editNeedData.id,
          receiptType: "PJ_INSTALL",
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
    // 查看附件按钮
    viewAttachment(type) {
      this.receiptAccessory = {
        receiptType: "PJ_INSTALL",
        receiptId: this.editNeedData.id
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
      this.$emit('closeAttachment')
    },
    // 展示更多
    showMore(val, icon) {
      if (this[val]) {
        this[val] = false;
        this[icon] = "el-icon-plus";
      } else {
        this[val] = true;
        this[icon] = "el-icon-minus";
      }
    },
    // // 电子签名
    // Signature(){
    //   if(this.eleSignType==="进行签名"){
    //     this.eleSignType = "查看";
    //     this.formData.electronicSignature = "已签名";
    //   }else{
    //     // this.eleSignType="进行签名"
    //     this.signVisible = true;
    //   }
    // },
    validateBankAccount(val) {
      const bankAccount = val.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(this.formData.refund, 'bankAccount', bankAccount)
    }
  },
}
</script>
<style lang="scss">
.waterMeterHandleInfo {
  height: 100%;
}
</style>
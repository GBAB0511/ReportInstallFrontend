<template>
  <div class="waterQueryEdit">
    <!-- 预览电子签名 -->
    <el-dialog :title="signName" :visible.sync="signVisible" :close-on-click-modal="false" class="addDialog">
      <img src="@/assets/images/sign.jpg" alt="签名">
    </el-dialog>
    <div class="engineer-center-right-content">
      <el-tabs type="border-card" tab-position="bottom" v-model="activeName" @tab-click="tabCurrent">
        <el-tab-pane label="基础信息" name='基础信息'>
          <el-form :model="formData" class="formBill" :inline="true" ref="form" size="mini" :rules="rules" label-width="130px">
            <el-form-item label="单据编号：" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.consult.billNo" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="单据日期：" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.consult.billDate" placeholder=""></el-input>
            </el-form-item>
            <legend class="legendColumn"> 开户信息 </legend>
            <el-form-item label="开户名称：" prop="ctmInfo.ctmName" style="width: calc(46% + 10px)" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.ctmInfo.ctmName" size="mini" clearable></el-input>
              <span v-else>{{ formData.ctmInfo.ctmName }}</span>
            </el-form-item>
            <el-form-item label="开户类型：" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.ctmInfo.ctmType" clearable size="mini" :class="{readOnly:NotDisabled}" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.CTT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.ctmInfo.ctmTypeName}}</span>
            </el-form-item>
             <el-form-item label="开户证件类型：" prop="certType" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.ctmInfo.certType" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.IDT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.ctmInfo.certTypeName}}</span>
            </el-form-item>
            <el-form-item label="开户证件号码：" prop="ctmInfo.certNo" style="width: calc(46% + 10px)" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" placeholder="证件号码" v-model="formData.ctmInfo.certNo" class="input-with-select">
                <template slot="append">
                  <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
                    <el-button icon="el-icon-reading" class="scanning-btn" @click="idCard('certNo')" size='mini'></el-button>
                  </el-tooltip>
                </template>
              </el-input>
              <span v-else>{{formData.ctmInfo.certNo}}</span>
            </el-form-item>
           <el-form-item label="手机号码：" prop="ctmInfo.mobile" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.mobile" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.ctmInfo.mobile}}</span>
            </el-form-item>
            <el-form-item label="固定电话：" prop="linkTel" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.linkTel" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.ctmInfo.linkTel}}</span>
            </el-form-item>
            
            
            
            <el-form-item label="开户地址：" prop="ctmInfo.clientAddr" :class="{'disable-item':NotDisabled, 'two-input': true}">
              <!--el-input v-model="formData.ctmInfo.ctmAddr" size="mini" clearable :disabled="NotDisabled"></el-input-->
              <template v-if="!NotDisabled">
                <el-select
                  v-model="formData.ctmInfo.clientAddr"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  :remote-method="adminAreaDataOptions"
                  :loading="false">
                  <template v-for="item in adminAreaData">
                    <el-option
                      :key="item.id"
                      :label="item.fullName"
                      :value="item.id">
                    </el-option>
                  </template>
                </el-select>
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.clientAddrDetail" placeholder="" clearable></el-input>
              </template>
              <span v-else>{{formData.ctmInfo.ctmAddr}}</span>
            </el-form-item>
            
            <el-form-item label="经办人名称：" prop="consult.agentMan" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.agentMan" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.consult.agentMan}}</span>
            </el-form-item>
            <el-form-item label="经办人证件类型：" prop="agentCertType" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.agentCertType" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.IDT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.consult.agentCertTypeName}}</span>
            </el-form-item>
             <el-form-item label="经办人证件号码：" prop="agentCertNo" style="width: calc(46% + 10px)" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="证件号码" v-model="formData.consult.agentCertNo" class="input-with-select" v-if="!NotDisabled">
                <template slot="append">
                  <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
                    <el-button icon="el-icon-reading" class="scanning-btn" @click="idCard('agentCertNo')" size='mini'></el-button>
                  </el-tooltip>
                </template>
              </el-input>
              <span v-else>{{formData.consult.agentCertNo}}</span>
            </el-form-item>
            <el-form-item label="经办人电话：" prop="consult.agentLinkTel" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.agentLinkTel" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.consult.agentLinkTel}}</span>
            </el-form-item>
            
           
            <el-form-item label="信用等级：" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.ctmInfo.creditLevel" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.CDL" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.ctmInfo.creditLevelName}}</span>
            </el-form-item>
            <el-form-item label="电子签名：" prop="electronicSignature" class="electronicSignature">
              <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.electronicSignature" size="mini" class="read-only" disabled></el-input> -->
              <el-image v-if="signUrl" class="sign-img" :src="signUrl"></el-image>
            </el-form-item>
            <el-form-item class="SignatureBtn">
              <el-button v-if="formData.consult.billNo" type="primary" size="mini" :disabled="NotDisabled" @click="Signature">进行签名</el-button>
              <el-button v-if="signPDFUrl" type="primary" size="mini" :disabled="NotDisabled" @click="seeSignPDFUrl">查看申请单</el-button>
            </el-form-item>
            <el-form-item label="传真号码：" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.faxNumber" v-if="!(formData.ctmEdit || NotDisabled)" placeholder="" class="read-only"></el-input>
              <span v-else>{{formData.ctmInfo.faxNumber}}</span>
            </el-form-item>
            <el-form-item label="开户编号：" class="disable-item">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.ctmNo" placeholder="新开户" disabled class="read-only"></el-input>
            </el-form-item>
            <legend class="legendColumn">工程信息</legend>
            <!--el-form-item label="来源渠道：" prop="consult.channelsOfOrigin">
              <el-select v-model="formData.consult.channelsOfOrigin" clearable size="mini" :disabled="NotDisabled">
                <el-option v-for="item in dictionaryData.COR" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item-->
            <el-form-item label="工程类型：" prop="consult.pjType" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.pjType" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.PPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.consult.pjTypeName}}</span>
            </el-form-item>
            <el-form-item label="紧急程度：" prop="consult.urgentFlag" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.urgentFlag" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.consult.urgentFlagName}}</span>
            </el-form-item>
            <el-form-item label="装表地址：" prop="consult.installAddr" :class="{'disable-item':NotDisabled, 'two-input': true}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.consult.installAddr" size="mini" clearable :disabled="NotDisabled"></el-input>
              <span v-else>{{formData.consult.installAddr}}</span>
            </el-form-item>
            <el-form-item label="信息来源：" prop="sourceFlag" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.sourceFlag" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.PIS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.consult.sourceFlagName}}</span>
            </el-form-item>
            <!-- <el-form-item label="行政区域：" prop="consult.adminArea" :class="{'disable-item': NotDisabled}">
              <el-cascader ref="cascader" v-if="!NotDisabled" clearable v-model="formData.consult.adminArea" :options="adminAreaOptions" :show-all-levels="false" :props="props" @change="handleCascaderChange">
              </el-cascader>
              <span v-else>{{formData.consult.adminAreaName}}</span>
            </el-form-item> -->
            <!--el-form-item label="营业所：" prop="consult.businessAbode" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.businessAbode" v-if="!NotDisabled" clearable size="mini" @change='changeBAbode(formData.consult.businessAbode)'>
                <el-option v-for="item in businessAbodeOptions" :key="item.value" :label="item.name" :value="item.id"> </el-option>
              </el-select>
              <span v-else>{{formData.consult.businessAbodeName}}</span>
            </el-form-item-->
            <el-form-item label="营业区域：" prop="consult.businessArea" :class="{'disable-item': NotDisabled}">
              <!--el-select v-model="formData.consult.businessArea" clearable size="mini" v-if="!NotDisabled" @change="changeAreaNull">
                <el-option v-for="item in businessAreaOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select-->
              <el-cascader ref="cascader" v-if="!NotDisabled" clearable  @change="changeAreaNull" v-model="formData.consult.businessArea" :options="businessAreaOptions" :show-all-levels="false" :props="props">
              </el-cascader>
              <span v-else>{{formData.consult.businessAreaName}}</span>
            </el-form-item>
            <el-form-item label="原户号：" prop="oloUserNo" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.oloUserNo" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.consult.oloUserNo}}</span>
            </el-form-item>
            <el-form-item label="总表户号：" prop="suserNo" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.suserNo" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.consult.suserNo}}</span>
            </el-form-item>
            <el-form-item label="总表户号2：" prop="suserNo2" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.consult.suserNo2" size="mini" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.consult.suserNo2}}</span>
            </el-form-item>
            <el-form-item label="用水期：" prop="limitFlag" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.consult.limitFlag" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.UWD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.consult.limitFlagName}}</span>
            </el-form-item>
            <el-form-item label="用水期限：" prop="limitDate" :class="{'disable-item': NotDisabled}">
              <el-date-picker v-model="formData.consult.limitDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-if="!NotDisabled">
              </el-date-picker>
              <span v-else>{{formData.consult.limitDate}}</span>
            </el-form-item>
            <el-form-item label="备注：" class="Remarks" prop="comments" :class="{'disable-item': NotDisabled}">
              <el-input type="textarea" v-model="formData.consult.comments" v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.consult.comments}}</span>
            </el-form-item>
            <legend class="legendColumn"> 账户信息 </legend>
            <el-form-item label="账户编号：" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.accountInfo.accountNo" @change="changeAcount" clearable size="mini" v-if="!NotDisabled">
                <el-option label="新开户" value=""></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.accountNo}}</span>
            </el-form-item>
            <el-form-item label="缴费方式：" prop="accountInfo.payWay" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.accountInfo.payWay" placeholder="" v-if="!NotDisabled" @change="payWayChange">
                <el-option v-for="item in dictionaryData.BPW" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.payWayName}}</span>
            </el-form-item>
            <el-form-item label="账户类型：" prop="accountInfo.accountType" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.accountInfo.accountType" clearable size="mini" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.ACT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.accountTypeName}}</span>
            </el-form-item>
            <el-form-item label="开户银行：" prop="accountInfo.openAccountBank" :class="{'disable-item': NotDisabled}">
              <el-cascader @change="bankChange" v-if="!NotDisabled" v-model="formData.accountInfo.openAccountBank" 
              :show-all-levels="false" :options="openABankOptions" :props="props">
              </el-cascader>
              <span v-else>{{formData.accountInfo.openAccountBankName}}</span>
            </el-form-item>
            <el-form-item label="开户名称：" prop="accountInfo.openAccountName" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.openAccountName" placeholder="" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.accountInfo.openAccountName}}</span>
            </el-form-item>
            <el-form-item label="银行账户：" prop="accountInfo.bankAccount" style="width: calc(46% + 10px)" :class="{'disable-item': NotDisabled}">
              <!--el-input placeholder="银行账户" v-model="formData.accountInfo.bankAccount" class="input-with-select" :disabled="NotDisabled">
                <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="icCard('bankAccount')" size='mini'></el-button>
              </el-input-->
              <el-input type="text" v-model="formData.accountInfo.bankAccount" placeholder="请输入银行账号" class="input-with-select"
                v-if="!NotDisabled"  @input="validateNum1()">
                <template slot="append">
                  <el-tooltip content="请连接高拍仪获取银行账户" placement="top">
                    <el-button icon="el-icon-reading" class="scanning-btn" @click="icCard('bankAccount')" size='mini'></el-button>  
                  </el-tooltip>
                </template>
              </el-input>
              <span v-else>{{formData.accountInfo.bankAccount}}</span>
            </el-form-item>
            <el-form-item label="托号：" prop="accountInfo.entrustNo" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.entrustNo" placeholder="" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.accountInfo.entrustNo}}</span>
            </el-form-item>
            <el-form-item label="银行协议号：" prop="accountInfo.entrustContract" :class="{'disable-item': NotDisabled}">
              <template v-if="!NotDisabled">
                <el-tooltip :disabled="entrustContractAddrToolShow" effect="dark" :content="formData.accountInfo.entrustContract" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="entrustContract" v-model="formData.accountInfo.entrustContract" placeholder clearable></el-input>
                </el-tooltip>
              </template>
              <span v-else>{{formData.accountInfo.entrustContract}}</span>
            </el-form-item>
            <el-form-item label="投递方式：" prop="desc1" :class="{'disable-item': NotDisabled}">
              <el-select clearable v-model="formData.accountInfo.deliverWay" placeholder="" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.SDW" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.deliverWayName}}</span>
            </el-form-item>
            <el-form-item label="投递地址：" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.deliverAddr" placeholder="" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.accountInfo.deliverAddr}}</span>
            </el-form-item>
            <el-form-item label="邮箱地址：" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.emailAddr" placeholder="" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.accountInfo.emailAddr}}</span>
            </el-form-item>
            <el-form-item label="开户行号：" prop="accountInfo.bankSn" style="width: calc(46% + 10px)" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.bankSn" placeholder="" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.accountInfo.bankSn}}</span>
            </el-form-item>
            <el-form-item label="出盘编号：" prop="accountInfo.outNo" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.accountInfo.outNo" placeholder="" v-if="!NotDisabled">
                <el-option label="新用户编号" :value="1"></el-option>
                <el-option label="旧用户编号" :value="2"></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.outNo === 2 ? '旧用户编号' : '新用户编号'}}</span>
            </el-form-item>
            <legend class="legendColumn">开票信息</legend>
            <!-- <el-form-item label="发票类型：" prop="accountInfo.invoiceType" :class="{'disable-item': NotDisabled}">
              <el-select v-model="formData.accountInfo.invoiceType" placeholder="" v-if="!NotDisabled">
                <el-option v-for="item in dictionaryData.BBT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.invoiceTypeName}}</span>
            </el-form-item> -->
            <el-form-item label="单位名称：" :class="{'disable-item': NotDisabled}">
              <template v-if="!NotDisabled">
                <el-tooltip :disabled="invoiceTitleToolShow" effect="dark" :content="formData.accountInfo.invoiceTitle" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="invoiceTitle" v-model="formData.accountInfo.invoiceTitle" placeholder="" clearable></el-input>
                </el-tooltip>
              </template>
              <span v-else>{{formData.accountInfo.invoiceTitle}}</span>
            </el-form-item>
            <el-form-item label="纳税人识别号：" :class="{'disable-item': NotDisabled}">
              <template v-if="!NotDisabled">
                <el-tooltip :disabled="invoiceTaxToolShow" effect="dark" :content="formData.accountInfo.invoiceTax" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="invoiceTax" v-model="formData.accountInfo.invoiceTax" placeholder="" clearable></el-input>
                </el-tooltip>
              </template>
              <span v-else>{{formData.accountInfo.invoiceTax}}</span>
            </el-form-item>
            <el-form-item label="联系地址：" :class="{'disable-item': NotDisabled}">
              <!--el-input v-model="formData.accountInfo.invoiceAddr" placeholder="" clearable :disabled="NotDisabled"></el-input-->
              <template v-if="!NotDisabled">
                <el-tooltip :disabled="invoiceAddrToolShow" effect="dark" :content="formData.accountInfo.invoiceAddr" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="invoiceAddr" v-model="formData.accountInfo.invoiceAddr" placeholder="" clearable></el-input>
                </el-tooltip>
              </template>
              <span v-else>{{formData.accountInfo.invoiceAddr}}</span>
            </el-form-item>
            <el-form-item label="固定电话：" :class="{'disable-item': NotDisabled}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.invoiceLink" placeholder="" clearable v-if="!NotDisabled"></el-input>
              <span v-else>{{formData.accountInfo.invoiceLink}}</span>
            </el-form-item>
            <el-form-item label="开户银行：" :class="{'disable-item': NotDisabled}">
              <el-cascader v-if="!NotDisabled" v-model="formData.accountInfo.invoiceBank" :options="openABankOptions" :show-all-levels="false" :props="props">
              </el-cascader>
              <span v-else>{{formData.accountInfo.invoiceBank}}</span>
            </el-form-item>
            <el-form-item label="银行账户：" prop="invoiceAccount" style="width: calc(46% + 10px)" :class="{'disable-item': NotDisabled}">
              <el-input type="text" v-model="formData.accountInfo.invoiceAccount" placeholder="请输入银行账号" class="input-with-select"
                v-if="!NotDisabled"  @input="validateNum()">
                <template slot="append">
                  <el-tooltip content="请连接高拍仪获取银行账户" placement="top">
                    <el-button icon="el-icon-reading" class="scanning-btn" @click="icCard('invoiceAccount')" size='mini'></el-button>  
                  </el-tooltip>
                </template>
              </el-input>
              <span v-else>{{formData.accountInfo.invoiceAccount}}</span>
              <!--el-input placeholder="银行账户" v-model="formData.accountInfo.invoiceAccount" class="input-with-select" :disabled="NotDisabled">
                 <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="icCard('invoiceAccount')" size='mini'></el-button>
              </el-input-->
            </el-form-item>
            <el-form-item label="增值税标记：" prop="accountInfo.vatFlag" :class="{'disable-item': NotDisabled}">
              <!-- <el-radio-group v-if="!NotDisabled" v-model="formData.accountInfo.vatFlag">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group> -->
              <el-select v-if="!NotDisabled" v-model="formData.accountInfo.vatFlag">
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
              </el-select>
              <span v-else>{{formData.accountInfo.vatFlagName}}</span>
            </el-form-item>
            <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
            <uploadFile ref="uploadFiles" :disabledUpload="NotDisabled"  :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
            <legend class="legendColumn" v-if="indexAdd!='DRAFT'||indexAdd!='handle'">流程处理
              <i class="fontRight" :class="procedureIcon" @click="showMore('procedureShow','procedureIcon')"></i>
            </legend>
            <div id="workflowDiv"></div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="多水表" name='多水表'>
          <waterMeter ref="waterMeter" :NotDisabled="NotDisabled" :id="formData.consult.id" :editShow="false"></waterMeter>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 用于调用demo页面的电子签名方法，并在交互机点确定后确保gwq.js的调用路径正常 --src上加了个css2，打包给后端时加，本地测不用加 -->
    <iframe style="display: none" ref="signIframe" name="signIframe" src="../../../../css2/static/interactiveMachine/demo.html" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>

    <!-- 获取身份证号码插件所需标签 不显示在页面  可忽略 -->
    <div style="display: none">
      <object TYPE="application/x-itst-activex" clsid="{36C2AA6E-FE75-4EB0-A1F1-FCD918754506}" id="IDCardOper"></object>
      <table>
        <tbody>
          <tr>
            <td>
              水印文字：<input id="LogoMsg" type="text" value="捷宇专用" size="54">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <form>
                        设 备 ： <select id="Device" style="width:100px">
                          <option value="HID">HID</option>
                          <option value="COM1">COM1</option>
                          <option value="COM2">COM2</option>
                          <option value="COM3">COM3</option>
                          <option value="COM4">COM4</option>
                          <option value="COM5">COM5</option>
                          <option value="COM6">COM6</option>
                        </select>
                        波 特 率： <select id="Baud" style="width:100px">
                          <option value="9600">9600</option>
                          <option value="19200">19200</option>
                          <option value="38400">38400</option>
                          <option value="115200">115200</option>
                        </select>
                      </form>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <form>
                        扩展口： <select id="ExtPort" style="width:100px">
                          <option value="">无</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="K">K</option>
                        </select>
                        超时(秒)： <input id="Timeout" type="text" size="13" value="5">
                      </form>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <textarea id="CardInfo" rows="12" cols="64">身份证信息</textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      图片路径：<input id="ImgPath" type="text" value="D:\head.bmp" size="54">
                    </td>
                  </tr>

                  <tr>
                    <td>图片类型：<select id="ImgType" style="width:370px">
                        <option value="0">头像</option>
                        <option value="1">正面图片</option>
                        <option value="2">反面图片</option>
                        <option value="3">完整图片</option>
                        <option value="4">正面图片带水印</option>
                      </select></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="button" value="读身份证" onclick="ReadIDCard( )">
                      <input type="button" value="读居留证" onclick="ReadIDCardForeigner( )">
                      <input type="button" value="保存图片" onclick="SaveImg( )">
                      <input type="button" value="读取图片BASE64编码" onclick="GetImgBase64( )">
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td><img id="CardImg" src="" width="329" height="420" alt="图片" content="no-cache"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- IC-获取银行卡信息插件所需标签 不显示在页面  可忽略 -->
    <div style="display: none">
      <object TYPE="application/x-itst-activex" clsid="{36C2AA6E-FE75-4EB0-A1F1-FCD918754506}" id="IccPboc"></object>
      <p align="left">
        终端信息数据:<br />
        <textarea name="TxSendData" cols="126" rows="3" id="TxSendData">P012000000000100Q012000000000000R0040156S006140725T00201U006131049W004GZNX</textarea>
      </p>

      <p align="left">
        发送脚本数据:<br />
        <textarea name="SendScriptData" cols="126" rows="3" id="SendScriptData">910A36297819EF8BDC7430309F360201E37222860F04DA9F770A000000099900580576A7860F04DA9F780A0000000999003B3EF374</textarea>
      </p>
      <p align="left">
        AID :<br />
        <textarea name="DefaultAid" cols="126" rows="3" id="DefaultAid">A000000333</textarea>
      </p>

      <select name="selComPort" size="1" id="selComPort">
        <option value="1001" selected="selected">U 口</option>
        <option value="COM1">COM1</option>
        <option value="COM2">COM2</option>
        <option value="COM3">COM3</option>
        <option value="COM4">COM4</option>
        <option value="COM5">COM5</option>
        <option value="COM6">COM6</option>
        <option value="COM7">COM7</option>
        <option value="COM8">COM8</option>
        <option value="COM9">COM9</option>
        <option value="COM10">COM10</option>
        <option value="COM11">COM11</option>
      </select>

      <select name="selBpNo" size="1" id="selBpNo">
        <option value="" selected="selected">无</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="K">K</option>
      </select>

      <select name="selCardType" size="1" id="selCardType">
        <option value="1" selected="selected">接触式 IC 卡</option>
        <option value="2">非接触式 IC 卡</option>
        <option value="3">自动判断</option>
      </select>

      <select name="selSlotType" size="1" id="selSlotType">
        <option value="00" selected="selected"> 00</option>
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="FF">FF</option>
      </select>

      <select name="selBaudList" size="1" id="selBaudList">
        <option value="0" selected="selected">9600</option>
        <option value="1">19200</option>
        <option value="2">38400</option>
        <option value="3">57600</option>
        <option value="4">115200</option>
      </select>

      <select name="selNewFunc" size="1" id="selNewFunc">
        <option value="0" selected="selected">是</option>
        <option value="1">否</option>
      </select>
    </div>

    <!-- 磁条-获取银行卡信息插件所需标签 不显示在页面  可忽略 -->
    <div style="display: none">
      <object TYPE="application/x-itst-activex" clsid="{36C2AA6E-FE75-4EB0-A1F1-FCD918754506}" id="MsgCardOper"></object>
      <form>
        设备：<select id="Device" style="width:250px">
          <option value="HID">HID</option>
          <option value="COM1">COM1</option>
          <option value="COM2">COM2</option>
          <option value="COM3">COM3</option>
          <option value="COM4">COM4</option>
          <option value="COM5">COM5</option>
          <option value="COM6">COM6</option>
        </select>

        波特率：<select id="Baudrate" style="width:250px">
          <option value="9600">9600</option>
          <option value="19200">19200</option>
          <option value="38400">38400</option>
          <option value="115200">115200</option>
        </select>

        扩展口：<select id="EntendPort" style="width:250px">
          <option value="">无</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="K">K</option>
        </select>

        字符集：<select id="Charset" style="width:250px">
          <option value="0">ISO</option>
          <option value="1">IBM</option>
          <option value="2">ISO(德卡)</option>
          <option value="3">IBM(德卡)</option>
        </select>

        超时(秒)：<input id="Timeout" type="text" size="36" value="5" />

        动作：<select id="Action" style="width:250px">
          <!-- <option value="1">读1磁道</option>
			<option value="2">读2磁道</option>
			<option value="3">读3磁道</option>
			<option value="4">读12磁道</option> -->
          <option value="5">读23磁道</option>
          <!-- <option value="6">读123磁道</option>
			<option value="7">写1磁道</option>
			<option value="8">写2磁道</option>
			<option value="9">写3磁道</option>
			<option value="10">写12磁道</option>
			<option value="11">写23磁道</option>
			<option value="12">写123磁道</option> -->
        </select>

        磁道1：<input id="sk1" type="text" size="36" />

        磁道2：<input id="sk2" type="text" size="36" />

        磁道3：<input id="sk3" type="text" size="36" />

        <input type="button" value="确定" onClick="RAWCard()" />
      </form>
    </div>

  </div>
</template>
<script>
// import '../../../static/interactiveMachine/js/gwq.js'
import waterMeter from '@/components/waterMeter'
import uploadFile from '@/components/uploadPic'
import chooseAccount from "@/components/accountInfo"
export default {
  name: "waterQueryEdit",
  props: ['wQEditData', 'NotDisabled', 'indexAdd'],
  components: {
    uploadFile,
    waterMeter,
    chooseAccount,
  },
  data() {
    const checkAddr = (rule, value, callback) => {
      if(!this.formData.ctmInfo.clientAddr || this.formData.ctmInfo.clientAddr.trim().length == 0) {
        callback(new Error('开户地址不能为空'))
      }
      if(!this.formData.ctmInfo.clientAddrDetail || this.formData.ctmInfo.clientAddrDetail.trim().length == 0) {
        callback(new Error('开户地址不能为空'))
      }
      callback()
    }
    const checkMeterAddr  = (rule, value, callback) => {
      if(!this.formData.consult.clientContractAddr || this.formData.consult.clientContractAddr.trim().length == 0) {
        callback(new Error('开户地址不能为空'))
      }
      if(!this.formData.consult.clientContractAddrDetail || this.formData.consult.clientContractAddrDetail.trim().length == 0) {
        callback(new Error('开户地址不能为空'))
      }
      callback()
    }
    return {
      // 签名弹出框显示与隐藏
      signShow: false,
      // 签名图片地址
      // signUrl: 'http://10.13.1.248:10041/fileService/fileDownload?path=WeChatBusiness/2020-08/15964412203812NFI99.png',
      signUrl: '',
      // 签名pdf地址
      signPDFUrl: '',


      isId: '',
      receiptType: "PJ_CONSULT",
      activeName: '基础信息',
      procedureShow: true,
      procedureIcon: "el-icon-minus",
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      signName: "电子签名",
      signVisible: false,
      chooseAccountName: "选择账户",
      chooseAccountVisible: false,
      isShow: false,
      icon: '\ue617',
      formData: {
        //账户信息
        accountInfo: {
          id: "",//
          //账户信息
          accountNo: "",//账户编号
          payWay: "3",//缴费方式
          accountType: "1",//账户类型
          openAccountBank: "",//开户银行
          openAccountName: "",//开户名称
          bankAccount: "",//银行账户
          entrustNo: "",//托号
          entrustContract: "",//托收合同
          deliverWay: "1",//投递方式
          deliverAddr: "",//投递地址
          emailAddr: "",//邮箱地址
          bankSn:"",//开户行号
          // 开票信息
          invoiceType: "1",//发票类型
          invoiceTitle: "",//单位名称
          invoiceTax: "",//纳税人识别号
          invoiceAddr: "",//联系地址
          invoiceLink: "",//座机号码
          invoiceBank: "",//开户银行
          invoiceAccount: "",//银行账户
          vatFlag: 0, //增值税
          outNo: 1 // 出盘编号
        },
        consult: {
          id: "",//
          tempId:"",//附件临时ID
          tenantId: "",//租户id
          // 开户信息-经办人信息
          agentMan: "",//经办人姓名
          agentCertNo: "",//经办人证件号码
          agentCertType: "1",//经办人证件类型
          agentLinkTel: "",//经办人联系电话
          //单据信息
          billDate: "",//单据日期
          billNo: "",//单据编号
          // 工程信息
          channelsOfOrigin:"1",//来源渠道
          pjName: "",//工程名称
          pjType: "1",//工程类型
          adminArea: [],//行政区域
          businessArea: "",//营业区域
          //businessAbode: "",//营业所
          urgentFlag: "2",//紧急程度
          installAddr: "",//装表地址
          sourceFlag: "1",//信息来源
          oloUserNo: "",//原户号
          suserNo: "",//总表户号
          suserNo2: "",//总表户号2
          limitDate: "",//用水期限
          limitFlag: "1",//用水期
          comments: "",//备注
          // 流程信息
          processInstanceId: "",//流程id
          processName: "",//节点名称
          processState: "",//节点编号
        },
        ctmInfo: {
          // 开户信息
          id: "",//
          ctmNo: "",//开户编号
          ctmType: "1",//开户类型
          certType: "1",//证件类型
          certNo: "",//开户证件号码
          creditLevel: "1",//信用等级
          ctmAddr: "",//业主地址
          clientAddr: '',
          clientAddrDetail: '',
          ctmName: "",//业主名称
          faxNumber: "",//传真号码
          linkTel: "",//固定电话
          mobile: "",//业主电话
        },
        meterDto:{//多水表保存

        },
      },
      uploadPic: false,
      dialogEditContent: false,
      dialogForm: {
        userName: '',
        userAddress: '',
        meterAddress: '',
        Contacts: '',
        contactNumber: '',
      },
      dictionaryData: [],//数据字典存值
      openABankOptions: [],//开户银行下拉框
      props: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true
      },
      adminAreaOptions: [],//行政区域下拉框
      //businessAbodeOptions: [],//营业所下拉框
      businessAreaOptions: [],//营业区域下拉框
      editContent: false,
      rules: {
        ctmInfo:{
          ctmName:[{ required:true, message:"开户名称不能为空", trigger: "blur"}],
          clientAddr:[
            { required: true, message:"开户地址不能为空", trigger: 'blur'},
            { validator: checkAddr, trigger: 'blur'}
            ],
          certNo:[{ required:true, message:"开户证件号码不能为空", trigger: "change"}],
          mobile:[{ pattern: /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/, message:"手机号码格式不正确", trigger: "blur"}],
        },
        consult:{
          agentMan:[{ required:true, message:"经办人名称不能为空", trigger: "blur"}],
          agentLinkTel:[{ required:true, message:"经办人联系电话不能为空", trigger: "blur"}],
          adminArea:[{ required:true, message:"行政区域不能为空", trigger: "change"}],
          businessArea:[{ required:true, message:"营业区域不能为空", trigger: "change"}],
          //businessAbode:[{ required:true, message:"营业所不能为空", trigger: "change"}],
          clientContractAddr:[
            { required:true, message:"装表地址不能为空", trigger: "blur"},
            { validator: checkMeterAddr, trigger: 'blur' }
            ],
          pjType:[{ required:true, message:"工程类型不能为空", trigger: "change"}],
          urgentFlag:[{ required:true, message:"紧急程度不能为空", trigger: "change"}],
        },
        accountInfo:{
          payWay:[{ required:true, message:"缴费方式不能为空", trigger: "change"}],
          invoiceType:[{ required:true, message:"发票类型不能为空", trigger: "change"}],
          accountType: [],//账户类型
          openAccountBank: [],//开户银行
          openAccountName: [],//开户名称
          bankAccount: [],//银行账户
          entrustNo: [],//托号
          entrustContract: [],//托收合同
          vatFlag: [{ required: true, message: '增值税标记不能为空', trigger: 'change' }],
          outNo: [{ required: true, message: '出盘编号不可为空', trigger: 'change' }]
        }
      },
      waterMeterFlag:0,
      ctmAddrToolShow: false,
      installAddrToolShow: false,
      invoiceTaxToolShow: false,
      invoiceAddrToolShow: false,
      invoiceTitleToolShow: false,
      entrustContractAddrToolShow: true,
      adminAreaData: [],
      adminAreaData1: []
    }
  },
  mounted() {
    
    if (this.wQEditData != '') {
      
      this.clearformData()
      this.formData = this.wQEditData
      this.validateNum1()
      this.validateNum()
      this.payWayChange(this.wQEditData.accountInfo.payWay)
      eventBus.$emit('receiptId', this.formData.consult.id)
      //if (this.formData.consult.businessAbode) {
      //  this.selectBAreaOptions(this.formData.consult.businessAbode)
      //}
      // let nodeId=this.wQEditData.consult.adminArea
      // let cascaderData =this.adminAreaOptions
      // let msg = this.getCascaderFullValue(cascaderData,nodeId);
      // this.formData.consult.adminArea=msg
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)   //添加时 附件临时ID
      this.clearformData()
      this.formData.consult.tempId = tempId
    }

    if (this.indexAdd == 'DRAFT' || this.indexAdd == 'handle') {
      this.$refs.waterMeter.initDraft(this.formData.consult.id);//初始化 多水表页面
    }
    //数据字典接口
    this.getDictionary();
    //审批界面接口
    this.getHtmlData();
    //行政区域接口
    // this.selectTSubSystemTree();
    //营业区域接口
    this.selectBAreaOptions();
    //开户银行接口
    this.selectOABankOptions();
    //多水表册本号下拉框
    this.changeArea(this.formData.consult.businessArea);
    // 存储单据id
    if (this.indexAdd == 'add') {
      localStorage.setItem('billId', '')
    } else {
      localStorage.setItem('billId', this.wQEditData.consult.id)
    }
  },
  created() {
    let _this = this
    // 和iframe建立通信
    window['getSignUrlHTML'] = (params) => {
      _this.getSignUrlVUE(params)
    }
  },
  watch: {
    'formData.ctmInfo.ctmAddr': {
      immediate: true,
      deep: true,
      handler(val) {
        const ctmAddr = document.querySelector('.ctmAddr .el-input__inner')
        ctmAddr && (this.ctmAddrToolShow = (ctmAddr.scrollWidth <= ctmAddr.offsetWidth) || !(val && val.length > 0))
      }
    },
    'formData.consult.installAddr': {
      immediate: true,
      deep: true,
      handler(val) {
        const installAddr = document.querySelector('.installAddr .el-input__inner')
        installAddr && (this.installAddrToolShow = (installAddr.scrollWidth <= installAddr.offsetWidth) || !(val && val.length >0))
      }
    },
    'formData.accountInfo.invoiceTax': {
      immediate: true,
      deep: true,
      handler(val) {
        const invoiceTax = document.querySelector('.invoiceTax .el-input__inner')
        invoiceTax && (this.invoiceTaxToolShow = (invoiceTax.scrollWidth <= invoiceTax.offsetWidth) || !(val && val.length >0))
      }
    },
    'formData.accountInfo.invoiceAddr': {
      immediate: true,
      deep: true,
      handler(val) {
        const invoiceAddr = document.querySelector('.invoiceAddr .el-input__inner')
        invoiceAddr && (this.invoiceAddrToolShow = (invoiceAddr.scrollWidth <= invoiceAddr.offsetWidth) || !(val && val.length >0))
      }
    },
    'formData.accountInfo.invoiceTitle': {
      immediate: true,
      deep: true,
      handler(val) {
        const invoiceTitle = document.querySelector('.invoiceTitle .el-input__inner')
        invoiceTitle && (this.invoiceTitleToolShow = (invoiceTitle.scrollWidth <= invoiceTitle.offsetWidth) || !(val && val.length >0))
      }
    },
    'formData.accountInfo.entrustContract': {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if(!/^[0-9a-zA-Z]*$/.test(val) && val !== '') {
          if(oldVal === '' || oldVal === null || oldVal === undefined) {
            this.formData.entrustContract = ''
          } else {
            this.formData.entrustContract = oldVal
          }
        }
        const entrustContract = document.querySelector('.entrustContract .el-input__inner')
        entrustContract && (this.entrustContractAddrToolShow = (entrustContract.scrollWidth <= entrustContract.offsetWidth) || !(val && val.length > 0))
      }
    },
  },
  methods: {
    // 输入银行卡号
    validateNum () {
      this.setNum(this.formData.accountInfo)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum (data) {
      data.invoiceAccount = data.invoiceAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'invoiceAccount', data.invoiceAccount)
    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.formData.accountInfo)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.bankAccount = data.bankAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'bankAccount', data.bankAccount)
    },
    changeArea(val){
      this.$refs.waterMeter.changeArea(val);
    },
    changeAreaNull(val){
      this.$refs.waterMeter.changeAreaNull(val);
    },
    payWayChange(val){
      if(val==='2'){
        this.$set(this.rules.accountInfo,'accountType',[{ required:true, message:"账户类型不能为空", trigger: "change"}]);
        this.$set(this.rules.accountInfo,'openAccountBank',[{ required:true, message:"开户银行不能为空", trigger: "change"}]);
        this.$set(this.rules.accountInfo,'openAccountName',[{ required:true, message:"开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules.accountInfo,'bankAccount',[{ required:true, message:"银行账户不能为空", trigger: 'blur'}]);
        this.$set(this.rules.accountInfo,'entrustNo',[{ required:true, message:"托号不能为空", trigger: 'blur'}]);
        this.$set(this.rules.accountInfo,'entrustContract',[{ required:true, message:"银行协议号不能为空", trigger: 'blur'}]);
      }else if(val==='1'){
        this.$set(this.rules.accountInfo,'accountType',[{ required:true, message:"账户类型不能为空", trigger: "change"}]);
        this.$set(this.rules.accountInfo,'openAccountBank',[{ required:true, message:"开户银行不能为空", trigger: "change"}]);
        this.$set(this.rules.accountInfo,'openAccountName',[{ required:true, message:"开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules.accountInfo,'bankAccount',[{ required:true, message:"银行账户不能为空", trigger: 'blur'}]);
        this.$delete(this.rules.accountInfo,'entrustNo');
        this.$delete(this.rules.accountInfo,'entrustContract');
      }else{
        this.$delete(this.rules.accountInfo,'accountType');
        this.$delete(this.rules.accountInfo,'openAccountBank');
        this.$delete(this.rules.accountInfo,'openAccountName');
        this.$delete(this.rules.accountInfo,'bankAccount');
        this.$delete(this.rules.accountInfo,'entrustNo');
        this.$delete(this.rules.accountInfo,'entrustContract');
      }
    },
    //根据节点id获取全路径
    //节点id
    //匹配数据
    //字段名
    getFathersById (id, data, prop) {
      var arrRes = []
      const rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          const node = data[i]
          if (node[prop] === nodeId) {
            arrRes.unshift(node[prop])
            return true
          } else {
            if (node.children && node.children.length) {
              if (rev(node.children, nodeId)) {
                arrRes.unshift(node[prop])
                return true
              }
            }
          }
        }
        return false
      }
      rev(data, id)
      return arrRes
    },
    getSignUrlVUE(res) {
      this.signUrl = res.SignNameBase64
      this.signPDFUrl = res.SignPdfBase64
    },
    //根据node查询路径数组
    getCascaderFullValue(cascader, id) {
      let cascaderFullValue = [id];
      this.getParentId(cascaderFullValue, cascader,cascader, id);

      return cascaderFullValue;
      
    },
    getParentId(cascaderFullValue, cascader, _cascader, _id) {
      if (!Array.isArray(cascader)) return;
      
      for (let cascaderItem of cascader) {
        if (!Array.isArray(cascaderItem.children)) continue;

        let index = cascaderItem.children.findIndex(item => item.value === _id);
        if (index >= 0) {
          cascaderFullValue.unshift(cascaderItem.value);

          if(_cascader.findIndex(item => item.value === cascaderItem.value) < 0) //is original item
            this.getParentId(cascaderFullValue, _cascader, _cascader,cascaderItem.value);
        } else {
          this.getParentId(cascaderFullValue, cascaderItem.children, _cascader,_id);
        }
      }
    },
    // 查看申请单按钮
    seeSignPDFUrl(){
      window.open(signPDFUrl)
    },
    adminAreaDataOptions(query) {
      if(query==null || query.length==0){
        return 
      }
      let params = { busicode: "AdminAreaQuery", data: {areaName:query,isLeaf:1} };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this,"adminAreaData",res.list)
        })
    },
    adminAreaDataOptions1(query) {
      if(query==null || query.length==0){
        return 
      }
      let params = { busicode: "AdminAreaQuery", data: {areaName:query,isLeaf:1} };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this,"adminAreaData1",res.list)
        })
    },
    // 证件号码按钮
    idCard(name) {
      if(this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面')
        return
      }
      if(!this.IDCard.online) {
        this.$message.error('请连接高拍仪')
        return
      }
      this.IDCard.ReadIDCard(name)
      setTimeout(() => {
        console.log(this.IDCard.getData(name));
        if (name == 'certNo') {
          const certNo = this.IDCard.getData(name)
          this.formData.ctmInfo.certNo =  (certNo && certNo.length > 0) && certNo;
        } else if (name == 'agentCertNo') {
          const agentCertNo = this.IDCard.getData(name)
          this.formData.consult.agentCertNo =  (agentCertNo && agentCertNo.length > 0) && agentCertNo;
        }
      }, 2000);
    },
    // 银行账户按钮
    icCard(name) {
      if(this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面')
        return
      }
      if(!this.ICCard.online) {
        this.$message.error('请连接高拍仪')
        return
      }
      this.ICCard.IccCardPresent()
      setTimeout(() => {
        // 检测IC卡槽是否插卡，若没插卡则启动磁条读取(大于-1则卡槽有卡)
        if (this.ICCard.getData('code') > -1) {
          this.ICCard.IccGetInfo(name)
          setTimeout(() => {
            console.log(this.ICCard.getData(name));
            if (name == 'bankAccount') {
              const bankAccount = this.ICCard.getData(name)
              this.formData.accountInfo.bankAccount = (bankAccount && bankAccount.length > 0) && bankAccount;
            } else if (name == 'invoiceAccount') {
              const invoiceAccount = this.ICCard.getData(name)
              this.formData.accountInfo.invoiceAccount = (invoiceAccount && invoiceAccount.length > 0) && invoiceAccount;
            }
          }, 4000);
        } else {
          this.MsgCard.RAWCard(name)
          setTimeout(() => {
            console.log(this.MsgCard.getData(name));
            if (name == 'bankAccount') {
              this.formData.accountInfo.bankAccount = this.MsgCard.getData(name)
            } else if (name == 'invoiceAccount') {
              this.formData.accountInfo.invoiceAccount = this.MsgCard.getData(name)
            }
          }, 4000);
        }
      }, 100);

      // this.ICCard.IccGetInfo(name)
      // this.MsgCard.RAWCard(name)
      // setTimeout(() => {
      //   console.log(this.ICCard.getData(name));
      //   if (name == 'bankAccount') {
      //     this.formData.accountInfo.bankAccount = this.ICCard.getData(name)
      //   } else if (name == 'invoiceAccount') {
      //     this.formData.accountInfo.invoiceAccount = this.ICCard.getData(name)
      //   }
      // }, 4000);
    },

    // 电子签名
    Signature() {
      this.signShow = true
      this.getSignaturePDF()
    },
    // 进行签名按钮（调pdf文件接口获取pdf）
    getSignaturePDF() {
      let _this = this
      var paramsList = ['', '', '', '', '', '', '', '', '', '']
      // 营业所中文名称
      /*删除营业所字段改成多级营业区域
      _this.businessAbodeOptions.forEach(item => {
        if (this.formData.consult.businessAbode == item.id) {
          paramsList[0] = item.name// 营业所（受理营业厅）
        }
      })*/
      paramsList[1] = this.formData.consult.billNo// 单据编号（办理编号）
      paramsList[2] = this.formData.consult.billDate// 单据日期（办理时间）

      // 信息来源中文名称
      _this.dictionaryData.PIS.forEach(item => {
        if (this.formData.consult.sourceFlag == item.value) {
          paramsList[3] = item.name// 信息来源（受理渠道）
        }
      })

      // 工程类型中文名称
      _this.dictionaryData.PPT.forEach(item => {
        if (this.formData.consult.pjType == item.value) {
          paramsList[4] = item.name// 业务类型（工程类型）
        }
      })

      paramsList[5] = this.formData.ctmInfo.ctmName// 开户名称（业主名称）
      paramsList[6] = this.formData.ctmInfo.certNo// 身份证号（开户证件号码）
      paramsList[7] = ''// 用水性质（）
      paramsList[8] = this.formData.ctmInfo.ctmAddr// 用水地址（开户地址）
      paramsList[9] = this.formData.ctmInfo.linkTel// 固定电话（固定电话）


      let params = {
        "busicode": "PDFFileUpload",
        "data": paramsList
        // "data": ['1','2']
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        // _this.gwq.DoGWQ_StartSign(res, 'D:\\hw.xml', '0,1,450,500', '', 60)
        _this.$refs.signIframe.contentWindow.DoGWQ_StartSign(res, 'D:\\hw.xml', '0,1,100,445', '', 60)
      })
    },
    bankChange(val) {

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
    //行政区域
    /*selectTSubSystemTree() {
      let _this = this
      let params = {
        "busicode": "DistrictTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.adminAreaOptions = data;
      })
    },*/
    //行政区域：
    // selectTSubSystemTree() {
    //   let _this = this
    //   let params = { busicode: "DistrictTree", data: {} };
    //   this.$api
    //     .fetch({ params })
    //     .then(res => {
    //       let data = this.getArr1(res);
    //       this.adminAreaOptions=undefined
    //       this.$nextTick(() => {
    //         if(data.children.length==0){
    //           delete data.children;
    //           _this.adminAreaOptions = [JSON.parse(JSON.stringify(data))];
    //           _this.formData.consult.adminArea = [data.id]
    //         }else{
    //           _this.adminAreaOptions = JSON.parse(JSON.stringify(data.children));
    //         }
    //         if(this.wQEditData.consult && this.wQEditData.consult.adminArea!==undefined){
    //           let value = _this.getFathersById(_this.wQEditData.consult.adminArea,JSON.parse(JSON.stringify(data.children)),'id');
    //           _this.formData.consult.adminArea=value
    //         }
    //       })
    //     })
    //     .catch(res => {
    //       this.adminAreaOptions = [];
    //     });
    // },
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
    getArr1(data) {
      function abc(arr) {

        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },

    handleCascaderChange() {
      this.$refs.cascader.dropDownVisible = false
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
        let data = _this.getArr1(res)
        _this.openABankOptions = data.children;
      })
    },
    //营业所
    /*
    selectBAbodeOptions() {
      let _this = this
      let params = {
        "busicode": "BusinessAbodeSelect",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.businessAbodeOptions = res;
      })
    },
    changeBAbode(id) {
      //营业区域
      this.selectBAreaOptions();
    },*/
    //营业区域
    selectBAreaOptions() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {
          
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaOptions = data.children;

      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "CTT,IDT,CDL,PPT,EGD,ACT,BBT,SDW,PIS,UWD,BPW,COR"
        //开户类型、证件类型、信用级别、工程类型、紧急程度、账户类型 、发票类型、投递方式、信息来源、用水期、缴费方式、来源渠道
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "PJ_CONSULT",
        "审批流配置:" + _this.formData.consult.processName + "(" + _this.formData.consult.billNo + ")",
        _this.formData.consult.id,
        _this.formData.consult.processInstanceId,
        "workflowDiv",
        _this, (res) => {
          if (window.location.href.indexOf("HallBusiness") > -1 || window.location.href.indexOf("PendingTrial") > -1 || window.location.href.indexOf("WaterSideIndex") > -1) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog ? this.$parent.$parent.closeDialog() : this.$parent.closeDialog();
          } else {
            // 普通模块触发
            this.$parent.closeDialog(); // 提交后回调方法
          }
          if(_this.formData.consult.processState=='register' || _this.formData.consult.processState==''){
            _this.SaveWaterMeterval(res.id);
          }
        },
        _this.formData.approveFlag,
        'PjConsultSave',//保存方法的接口名称
      );
    },
    //index判断 保存方法是暂存（true）按钮触发 还是提交（）按钮触发
    getFormbData() {
      let _this = this
      // 行政区域 只需要传最后一个值过去 
      if (typeof _this.formData.consult.adminArea == 'object') {
        _this.formData.consult.adminArea = _this.formData.consult.adminArea.pop()
      }
      if (typeof _this.formData.consult.businessArea == 'object') {
        _this.formData.consult.businessArea = _this.formData.consult.businessArea.pop()
      }
      // // 开户银行 数据格式处理
      // if (_this.formData.accountInfo.openAccountBank.length != 0) {
      //   _this.formData.accountInfo.openAccountBank = _this.formData.accountInfo.openAccountBank[0]
      // }
      // // 开户银行 数据格式处理
      // if (_this.formData.accountInfo.invoiceBank.length != 0) {
      //   _this.formData.accountInfo.invoiceBank = _this.formData.accountInfo.invoiceBank[0]
      // }
      if(typeof this.formData.consult.installStaff === "object" ){
        this.formData.consult.installStaff=this.formData.consult.installStaff.toString();
      }
      var reg=new RegExp(' ','g'); 
      _this.formData.accountInfo.invoiceAccount = _this.formData.accountInfo.invoiceAccount.replace(reg,'');
      _this.formData.accountInfo.bankAccount = _this.formData.accountInfo.bankAccount.replace(reg,'');
      _this.formData.accountInfo.openAccountBank = this.common.handleTreeData(_this.formData.accountInfo.openAccountBank)
      _this.formData.accountInfo.invoiceBank = this.common.handleTreeData(_this.formData.accountInfo.invoiceBank)
      this.formData.consult.branchRoadFlag = this.formData.consult.branchRoadFlag == true ? 1 : (this.formData.consult.branchRoadFlag == 1 ? 1 : 0)
      this.formData.consult.exceedHigh = this.formData.consult.exceedHigh == true ? 1 : (this.formData.consult.exceedHigh == 1 ? 1 : 0)
      
      let data = _this.$refs.waterMeter.getData()
      _this.$set(_this.formData,'meterDto',{'consultId':'','userInfo':data});
      
      return this.formData
    },

    async Preservation() {

      let val = '1'
      this.$refs.form.validate((valid)=>{
        if(!valid){
          val="当前必填项未完善，请检查"
        }
      })
      if(val!=='1'){
        this.$notify({
          title: "验证失败",
          message: val,
          type: "error"
        });
        return;
      }
      if(this.$refs.waterMeter.tableData.length===0){
        this.$notify({
          title: '校验失败',
          message: '多水表至少要添加一条数据',
          type: 'error'
        });
        return
      }
      let receiptId=""
      if (this.wQEditData != '') {
          receiptId= this.formData.consult.id
      }else{
          receiptId= this.formData.consult.tempId
      }
       let accesooryParams = {
        "busicode": "AccessorySubmitJudge",
        "data": {receiptId:receiptId,receiptType:"PJ_CONSULT"}
      }
      let a =  await this.$api.fetch({
        params: accesooryParams,//参数
      })
     if(a!=null && a!="") {
        this.$notify({
              title: '',
              message: a,
              type: 'error'
        });
        return;
     }
      let params = {
        "busicode": "PjConsultSave",
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
          //获取id
        console.log(this.formData.consult.id);
        if(this.formData.consult.id==''){
          //this.details(res, 'Preservation')
          this.formData.consult.id=res.id
        }
        this.SaveWaterMeter();//初始化 多水表页面
        
        //this.$refs.uploadFiles.submitFile(this.formData.consult.id);
        localStorage.setItem('billId', this.formData.consult.id)
        if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            this.$parent.closeDialog(); // 提交后回调方法
          }
      })
    },
    // 新建保存后，获取单据编号
    details(val, index) {
      let _this = this;
      let params = {
        "busicode": "PjConsultQuery",
        "data": {
          'id': val.id,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.formData = res;
        _this.SaveWaterMeter();//多水表页面保存 
      })
    },
    //多水表保存
    SaveWaterMeter() {
      this.$refs.waterMeter.SaveWaterMeter(this.formData.consult.id);//初始化 多水表页面
    },
    //多水表保存
    SaveWaterMeterval(val) {
      this.$refs.waterMeter.SaveWaterMeter(val);//初始化 多水表页面
    },
    handleChange(value) {
      // console.log(value);
    },
    clearformData() {
      this.formData = {
        //账户信息
        accountInfo: {
          id: "",//
          //账户信息
          accountNo: "",//账户编号
          payWay: "3",//缴费方式
          accountType: "1",//账户类型
          openAccountBank: "",//开户银行
          openAccountName: "",//开户名称
          bankAccount: "",//银行账户
          entrustNo: "",//托号
          entrustContract: "",//托收合同
          deliverWay: "1",//投递方式
          deliverAddr: "",//投递地址
          emailAddr: "",//邮箱地址
          bankSn:"",//开户行号
          // 开票信息
          invoiceType: "1",//发票类型
          invoiceTitle: "",//单位名称
          invoiceTax: "",//纳税人识别号
          invoiceAddr: "",//联系地址
          invoiceLink: "",//座机号码
          invoiceBank: "",//开户银行
          invoiceAccount: "",//银行账户
          vatFlag: 0, //增值税标记
          outNo: 1 //出盘编号
        },
        consult: {
          id: "",//
          tenantId: "",//租户id
          // 开户信息-经办人信息
          agentMan: "",//经办人姓名
          agentCertNo: "",//经办人证件号码
          agentCertType: "1",//经办人证件类型
          agentLinkTel: "",//经办人联系电话
          //单据信息
          billDate: "",//单据日期
          billNo: "",//单据编号
          // 工程信息
          channelsOfOrigin:"1",//来源渠道
          pjName: "",//工程名称
          pjType: "1",//工程类型
          adminArea: [],//行政区域
          businessArea: "",//营业区域
          //businessAbode: "",//营业所
          urgentFlag: "2",//紧急程度
          installAddr: "",//装表地址
          sourceFlag: "1",//信息来源
          oloUserNo: "",//原户号
          suserNo: "",//总表户号
          suserNo2: "",//总表户号2
          limitDate: "",//用水期限
          limitFlag: "1",//用水期
          comments: "",//备注
          // 流程信息
          processInstanceId: "",//流程id
          processName: "",//节点名称
          processState: "",//节点编号
        },
        ctmInfo: {
          // 开户信息
          id: "",//
          ctmNo: "",//开户编号
          ctmType: "1",//开户类型
          certType: "1",//证件类型
          certNo: "",//开户证件号码
          creditLevel: "1",//信用等级
          ctmAddr: "",//业主地址
          clientAddr: '',
          clientAddrDetail: '',
          ctmName: "",//业主名称
          faxNumber: "",//传真号码
          linkTel: "",//固定电话
          mobile: "",//业主电话
        },
      }
    },

    // 多页签的点击
    tabCurrent(val, tab) {
      
      if (val.index == '1') {
        if (this.indexAdd == 'add') {//点击添加按钮时 不用调用此方法

        } else {
          if(this.waterMeterFlag==0){
            this.waterMeterFlag=1;
            this.$refs.waterMeter && this.$refs.waterMeter.init();//初始化 多水表页面
          }
          
        }
      }
      this.$emit('fromChild', val.index)//给父组件传递当前tabs值 0/登记界面 1/多水表界面  
    },
    upload() {//附件上传
      this.uploadPic = true;
    },
    closeDialog(val) {
      this.editContent = false;
      this.uploadPic = false;
    },
    chooseAccount() {
      this.chooseAccountVisible = true;
    },
    changeAcount(val) {
      if (val === "1") {
        this.chooseAccount();
      } else {
        this.closechoosectm();
      }
    },
    closechoosectm() {
      this.choosectmVisible = false;
      this.chooseAccountVisible = false;
    },
  },
}
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.waterQueryEdit {
  height: 100%;
  position: relative;
  .engineer-center-right-content {
    height: 100%;
    overflow-y: auto;
  }
  .sign-img img{
    width: 80px;
  }
  .two-input {
      width: calc(46% + 10px);
      .el-input {
        width: 49% !important;
      }
      .el-select {
        width: 49% !important;
        .el-input {
          width: 100% !important;
        }
      }
    }
}
</style>

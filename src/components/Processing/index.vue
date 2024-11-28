<template>
  <div class="allHandleInfo">
      <!-- 预览电子签名 -->
    <el-dialog :title="signName" :visible.sync="signVisible" :close-on-click-modal="false" class="addDialog">
        <img src="@/assets/images/sign.jpg" alt="签名">

    </el-dialog>
    <!-- 弹出表单选择客户 -->
    	<el-dialog :title="choosectmName" :visible.sync="choosectmVisible" :close-on-click-modal="false" class="addDialog" @close="closechoosectm">
            <choosectm
                ref="childWaterEditor" 
                
            ></choosectm>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="submit;">确 定</el-button>
		      <el-button type="info" size="mini" plain @click="closechoosectm">取 消</el-button>
		    </div>
    	</el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if='operationShow == 1 && !editContent && !uploadPic'>
        <!-- <el-button size="mini" type="primary" @click="submitForm('EngineeringForm')">保存</el-button>
        <el-button size="mini" type="primary" @click="submitForm('EngineeringForm')">提交</el-button> -->
        <!-- <el-button size="mini" type="primary" @click="upload()">上传附件</el-button>
        <el-button size="mini" type="primary" @click='waterInfo(0)'>多水表录入</el-button>
        
        <el-button size="mini" type="primary">电子签名</el-button>
        <el-button size="mini" type="primary">打印</el-button> -->
        
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" style="margin-right: 1.5%" @click="operationReturn">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 1 && editContent'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(0)">保存</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addEditContent()">添加</el-button>
        <el-button size="mini" type="primary" icon="el-icon-bottom">下载模板</el-button>
        <el-button size="mini" type="primary" icon='el-icon-download'>导入</el-button> -->
        
        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 1 && uploadPic'>
        <!-- <el-button size="mini" type="primary">保存</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 11 || operationShow == 12'>
        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 2'>
        <!-- <el-button size="mini" type="primary">上传附件</el-button> -->
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(2)">提交</el-button> -->
        <!-- <el-button size="mini" type="primary">工程暂停</el-button> -->
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 3 && !isExecution'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(4)">提交</el-button>
        <el-button size="mini" type="primary">上传附件</el-button>
        <el-button size="mini" type="primary" @click="takeExecution()">施工材料</el-button>
        
        <el-button size="mini" type="primary">工程暂停</el-button> -->
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 3 && isExecution'>
        <!-- <el-button size="mini" type="primary" @click='saveExecution()'>保存</el-button>
        <el-button size="mini" type="primary">选择模板</el-button>
        <el-button size="mini" type="primary" @click="addExecution()">添加</el-button> -->
        
        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 4'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(5)">提交</el-button>
        <el-button size="mini" type="primary">上传附件</el-button> -->
        
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 5'>
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 6 && !isExecution && !editContent'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(7)">提交</el-button>
        <el-button size="mini" type="primary">上传附件</el-button>
        <el-button size="mini" type="primary" @click="takeExecution()">施工材料</el-button>
        <el-button size="mini" type="primary" @click="waterInfo(1)">水表资料</el-button> -->
        
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 6 && isExecution && !editContent'>
        <!-- <el-button size="mini" type="primary" @click='saveExecution()'>保存</el-button>
        <el-button size="mini" type="primary">选择模板</el-button>
        <el-button size="mini" type="primary" @click="addExecution()">添加</el-button> -->
        
        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 6 && !isExecution && editContent'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(0)">保存</el-button>
        <el-button size="mini" type="primary" icon="el-icon-bottom">下载模板</el-button>
        <el-button size="mini" type="primary" icon='el-icon-download'>导入</el-button> -->
        
        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 7'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(8)">提交</el-button>
        <el-button size="mini" type="primary">上传附件</el-button> -->
        
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 8'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(9)">提交</el-button>
        <el-button size="mini" type="primary">上传附件</el-button>
         -->
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 9'>
        <!-- <el-button size="mini" type="primary" @click="saveEditContent(10)">提交</el-button>
        <el-button size="mini" type="primary">上传附件</el-button> -->
        
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if='operationShow == 10'>
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus">处理意见</el-button> -->
        <el-button  icon="el-icon-caret-left" size="mini" @click="operationReturn" style="margin-right: 1.5%">返回</el-button>
      </div>
    </div>
    
    <div v-if="!editContent && !uploadPic && !isExecution" class='edit-content'>

      <div class="btn_box">
        <el-steps>
          <el-step title="登记信息" @click.native="stepActive(1)">
            
          </el-step>
          <!-- <el-step title="资料审核" @click.native="stepActive(2)"></el-step> -->
          <el-step title="勘察" @click.native="stepActive(2)"></el-step>
          <el-step title="设计" @click.native="stepActive(3)"></el-step>
          <el-step title="工程预算" @click.native="stepActive(4)"></el-step>
          <el-step title="工程收款" @click.native="stepActive(5)"></el-step>
          <el-step title="安装施工" @click.native="stepActive(6)"></el-step>
          <el-step title="工程验收" @click.native="stepActive(7)"></el-step>
          <el-step title="立户" @click.native="stepActive(8)"></el-step>
          <el-step title="工程结算" @click.native="stepActive(9)"></el-step>
          <el-step title="结算退款" @click.native="stepActive(10)"></el-step>
          <el-step title="表计挂接" @click.native="stepActive(11)"></el-step>
          <el-step title="结束" @click.native="stepActive(12)"></el-step>
        </el-steps>
        <!-- <steps :step="step" :active="active"></steps> -->
      
      </div>

      <div v-if="operationShow == 1" class="operation_box operation_one">
          
        <div class='operation_one-bottom'>
            <el-tabs type="border-card" tab-position="bottom">
                <el-tab-pane label="基础信息">
                    <el-form :model="ruleForm" ref="form" :show-message="false" :rules="rules" label-width="130px">
                        <legend>
                            客户信息
                        </legend>
                        <el-row>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="客户编号：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.backfillInput.peopleCode" placeholder="新开户" disabled class="read-only" @input="e => input = inputMe(e)"></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="客户类型：">
                                <el-select v-model="countManagementEditForm.countMsg.userType" clearable size="mini" style="width:100%">
                                    <el-option label="普通用户" value="0"></el-option>
                                    <el-option label="大用户" value="1"></el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="业主名称：" prop="Applicant">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.Applicant" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="业主证件类型：" prop="ownerId">
                                <el-select v-model="ruleForm.ownerId" clearable size="mini" style="width:100%">
                                    <el-option  v-for="(item,index) in ruleForm.ownerIdType" :key="index" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            
                            
                            
                        </el-row>

                        <el-row>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="业主证件号码：" prop="documentNumber">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="证件号码" v-model="ruleForm.documentNumber" class="input-with-select">
                                    <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                                </el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="业主电话：" prop="Contacts">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.Contacts" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="经办人名称：" prop="contactNumber">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.contactNumber" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="经办人证件类型：" prop="waterAddress2">
                                <el-select v-model="ruleForm.waterAddress2" clearable size="mini" style="width:100%">
                                    <el-option  v-for="(item,index) in ruleForm.ownerIdType" :key="index" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            
                            
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="经办人证件号码：" prop="waterAddress3">
                                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.waterAddress3" size="mini" clearable></el-input> -->
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="证件号码" v-model="ruleForm.waterAddress3" class="input-with-select">
                                    <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                                </el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="用户地址：" prop="waterAddress1">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.waterAddress1" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="电子签名：" prop="electronicSignature" class="electronicSignature">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.electronicSignature" size="mini" class="read-only" disabled></el-input>
                                
                                </el-form-item>
                                
                            </div>
                            </el-col>
                            
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item class="SignatureBtn">
                                <el-button type="primary" size="mini" @click="Signature">{{eleSignType}}</el-button>
                                </el-form-item>
                            </div>
                            </el-col>
                            
                        </el-row>
                        <legend>
                            工程信息
                        </legend>
                        <el-row>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="申请日期：" prop="applicantDate">
                                <el-date-picker v-model="ruleForm.applicantDate" type="date" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="工程类型：" prop="engineerType">
                                <el-select v-model="ruleForm.engineerType" clearable size="mini" style="width:100%">
                                    <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="紧急程度：" prop="Emergency">
                                <el-select v-model="ruleForm.Emergency" clearable size="mini" style="width:100%">
                                    <el-option label="一般" value="0"></el-option>
                                    <el-option label="紧急" value="1"></el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            
                            
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="装表地址：" prop="waterAddress">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.waterAddress" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            
                            
                        </el-row>
                        

                        <el-row>

                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="营业所：" prop="businessArea">
                                <el-select v-model="ruleForm.businessArea" clearable size="mini" style="width:100%">
                                    <el-option v-for="item in businessAreaList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="行政区域：" prop="AdministrationArea">
                                <el-select v-model="ruleForm.AdministrationArea" clearable size="mini" style="width:100%">
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="管理区域：" prop="AdministrationArea1">
                                <el-select v-model="ruleForm.AdministrationArea1" clearable size="mini" style="width:100%">
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="原户号：" prop="oldNum">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.oldNum" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            
                            
                            
                        </el-row>

                        <el-row>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="总表户号：" prop="generalTableNum1">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.generalTableNum1" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="总表户号2：" prop="generalTableNum2">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.generalTableNum2" size="mini" clearable></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="用水期：" prop="waterUse">
                                <el-select v-model="ruleForm.waterUse" clearable size="mini" style="width:100%">
                                    <el-option label="固定" value="0"></el-option>
                                    <el-option label="临时" value="1"></el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="6">
                            <div class="my-input">
                                <!-- <el-form-item label="装表数量：" prop="waterPopulation">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.waterPopulation" size="mini" clearable placeholder="1" disabled class="read-only"></el-input>
                                </el-form-item> -->
                                <el-form-item label="用水期限：" prop="putTableNum">
                                <el-date-picker
                                    v-model="ruleForm.waterPopulation"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                                </el-form-item>
                            </div>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="6">
                            <div class="my-input">
                                <el-form-item label="信息来源：" prop="source">
                                <el-select v-model="ruleForm.source" clearable size="mini" style="width:100%">
                                    <el-option v-for="item in sourceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                </el-form-item>
                            </div>
                            </el-col>
                            <el-col :span="12">
                            <div class="my-input gocenter">
                                <el-form-item label="备注：" prop="applicationReasons">
                                <el-input type="textarea" v-model="ruleForm.applicationReasons" style="width:100%"></el-input>
                                </el-form-item>
                            </div>
                            </el-col>
                            <!-- <el-col :span="12">
                            <div class="my-input gocenter">
                                <el-form-item label="派单说明：" prop="paymentNote">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="textarea" v-model="ruleForm.paymentNote" style="width:100%"></el-input>
                                </el-form-item>
                            </div>
                            </el-col> -->
                        </el-row>
                    </el-form>
                        
                    <el-form 
                                class="backfillSubmitForm" 
                                :model="countManagementEditForm" 
                                label-width="120px" 
                                ref="ruleForm" 
                                :rules="rules">
                            <legend>
                            账户信息
                            </legend>
                            <el-row>
                            <el-col :span='6'>
                                <!-- 账户编号 -->
                                <el-form-item label="账户编号：">
                                <el-select v-model="countManagementEditForm.countMsg.PriceStrategy" @change="changeAcount" clearable size="mini" style="width:100%">
                                    <el-option label="新开户" value="1"></el-option>
                                    <el-option v-for="item in countManagementEditForm.countOptions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.countMsg.PriceStrategy" placeholder="新开户" disabled class="read-only"></el-input> -->
                                </el-form-item>
                            </el-col>
                            
                            <el-col :span='6'>
                                <el-form-item label="缴费方式：">
                                <el-select  clearable v-model="countManagementEditForm.countMsg.isfines" placeholder="">
                                    <el-option  v-for="(item,index) in countManagementEditForm.PaymentMethod" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span='6'>
                                <el-form-item label="账户类型：" prop="userType1">
                                <el-select v-model="countManagementEditForm.countMsg.userType1" clearable size="mini" style="width:100%">
                                    <el-option v-for="item in userTypeList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span='6'>
                                <el-form-item label="开户银行：">
                                <el-select  clearable v-model="countManagementEditForm.countMsg.UpdateCodeCopye" placeholder="">
                                    <el-option  v-for="(item,index) in countManagementEditForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                </el-form-item>
                            </el-col>
                            
                            </el-row>

                            <el-row>
                            
                            <el-col :span='6'>
                                <el-form-item label="开户名称：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.countMsgOrder.value" placeholder="梅州粤海水务有限公司" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="银行账户：" prop="documentNumber">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="银行账户" v-model="countManagementEditForm.countMsgOrder.value1" class="input-with-select">
                                    <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                                </el-input>
                                </el-form-item>
                                
                            </el-col>

                            <el-col :span='6'>
                                <el-form-item label="托号：">
                                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.countMsg.code" placeholder="101801012001" clearable></el-input>
                                </el-form-item>
                            </el-col>
                                
                            </el-row>
                            
                            <el-row>
                              <el-col :span='6'>
                                <el-form-item label="托收合同号：">
                                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.countMsg.codeNum" placeholder="101801012001" clearable></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            
                            <legend>开票信息</legend>
                            <el-row>
                            <!-- <el-col :span='6'>
                                <el-form-item label="发票类型：" prop="desc">
                                    <el-select  clearable v-model="countManagementEditForm.desc" placeholder="">
                                    <el-option label="收据" value="0"></el-option>
                                    <el-option label="普通发票" value="1"></el-option>
                                    <el-option label="专用发票" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="6">
                                <el-form-item label="单位名称：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.InvoiceInformation.value" placeholder="粤海水务" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="纳税人识别号：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.InvoiceInformation.value1" placeholder="12441400714861777E" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="联系地址：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.InvoiceInformation.value2" placeholder="深圳市东深小区" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            
                            </el-row>
                            <el-row>
                            <el-col :span="6">
                                <el-form-item label="座机号码：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.InvoiceInformation.value3" placeholder="15544669988" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span='6'>
                                <el-form-item label="开户银行：">
                                <el-select  clearable v-model="countManagementEditForm.year" placeholder="">
                                    <el-option  v-for="(item,index) in countManagementEditForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span='6'>
                                <el-form-item label="银行账号：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.bankCountNum" placeholder="" clearable></el-input>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="12">
                                <el-form-item label="银行账户：" prop="documentNumber">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="银行账户" v-model="countManagementEditForm.bankCountNum" class="input-with-select">
                                    <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                                </el-input>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span='6'>
                                <el-form-item label="投递方式：" prop="desc1">
                                    <el-select  clearable v-model="countManagementEditForm.desc1" placeholder="">
                                    <el-option label="自取" value="0"></el-option>
                                    <el-option label="邮寄" value="1"></el-option>
                                    <el-option label="上门派送" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <legend>上传附件 <i :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i></legend>
                            <uploadFile v-if="uploadFileShow"></uploadFile>
                            <legend>流程处理 <i :class="procedureIcon" @click="showMore('procedureShow','procedureIcon')"></i></legend>
                            <el-row v-if="procedureShow">
                            <procedure :isOptions="false" :isRegister="true"></procedure>
                            <!-- <img src="@/assets/images/shenpi1.png" alt=""> -->
                            </el-row>
                    </el-form>
                </el-tab-pane>
                <!-- <el-tab-pane label="流程处理">
                    <procedure :isOptions="false"></procedure>
                </el-tab-pane> -->
                <!-- <el-tab-pane label="附件">
                    <uploadFile></uploadFile>
                </el-tab-pane> -->
                <el-tab-pane label="多水表">
                    <!-- <execution ref="execution"></execution> -->
                    <waterMeter :isEdit="true" :isShow="isShow"></waterMeter>
                </el-tab-pane>
            </el-tabs>
              
        </div>
            
      </div>
      <div v-if="operationShow == 2" class="operation_box">
        <el-form :model="ruleForm1" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="工程名称：" prop="projectName">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm1.projectName" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1" style="padding-left: 9.6%">
            <el-checkbox v-model="ruleForm1.checked">需要办破路手续</el-checkbox>
            <el-checkbox v-model="ruleForm1.checked2">超标高</el-checkbox>
          </div>
          <div class="my-input1">
            <el-form-item label="勘察人员：" prop="surveyors">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm1.surveyors" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="勘察日期：" prop="investigationDate">
              <el-date-picker v-model="ruleForm1.investigationDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2">
            <el-form-item label="勘察结论：" prop="conclusion">
              <el-input type="textarea" v-model="ruleForm1.conclusion" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <div class="operation_box" v-if="operationShow == 3">
        <el-form :model="ruleForm2" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="设计人员：" prop="designer">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm2.designer" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="设计日期：" prop="designDate">
              <el-date-picker v-model="ruleForm2.designDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="设计说明：" prop="explain">
              <el-input type="textarea" v-model="ruleForm2.explain" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <div class="operation_box" v-if="operationShow == 4">
        <el-form :model="ruleForm3" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="表前人工费预算：" prop="preTableBudget">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.preTableBudget" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="表后人工费预算：" prop="postTableBudgeted">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.postTableBudgeted" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="表前材料费预算：" prop="preTableBudget1">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.preTableBudget1" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="表后材料费预算：" prop="postTableBudgeted1">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.postTableBudgeted1" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="其他预算：" prop="otherBudgets">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.otherBudgets" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="设计费：" prop="designFee">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.designFee" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          
          <div class="my-input1">
            <el-form-item label="押金：" prop="deposit">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.deposit" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="预算合计：" prop="total">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.total" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="结算方式：" prop="prepaymentMethod">
              <el-select v-model="ruleForm3.prepaymentMethod" clearable size="mini" style="width:100%">
                <el-option v-for="item in prepaymentMethodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="编制人员：" prop="staffingStaff">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm3.staffingStaff" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="编制日期：" prop="compileDate">
              <el-date-picker v-model="ruleForm3.compileDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="编制说明：" prop="compilationNotes">
              <el-input type="textarea" v-model="ruleForm3.compilationNotes" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <div class="operation_box" v-if="operationShow == 5">
        <el-form :model="ruleForm4" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="预缴合计：" prop="budgetTotal">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm4.budgetTotal" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="押金合计：" prop="depositTotal">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm4.depositTotal" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="应收合计：" prop="receivableTotal">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm4.receivableTotal" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="收款方式：" prop="paymentMethod">
              <el-select 
                v-model="ruleForm4.paymentMethod" 
                clearable size="mini" disabled
                style="width:100%">
                <el-option v-for="item in paymentMethodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="收款人员：" prop="Cashier">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm4.Cashier" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="收款日期：" prop="collectionDate">
              <el-date-picker 
                v-model="ruleForm4.collectionDate" 
                type="date" disabled
                placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="缴款说明：" prop="payExplain">
              <el-input 
                type="textarea" disabled
                v-model="ruleForm4.payExplain" 
                style="width:100%"></el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <div class="operation_box" v-if="operationShow == 6">
        <el-form :model="ruleForm5" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="水表编号：" prop="waterCode">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm5.waterCode" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="起始码：" prop="startNum">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm5.startNum" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="派单日期：" prop="paymentDate">
              <el-date-picker v-model="ruleForm5.paymentDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="施工班组：" prop="constructionTeam">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm5.constructionTeam" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="开始施工日期：" prop="beginConstructionDate">
              <el-date-picker v-model="ruleForm5.beginConstructionDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="结束施工日期：" prop="endConstructionDate">
              <el-date-picker v-model="ruleForm5.endConstructionDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="施工说明：" prop="constructionInstructions">
              <el-input type="textarea" v-model="ruleForm5.constructionInstructions" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <div class="operation_box" v-if="operationShow == 7">
        <el-form :model="ruleForm6" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="验收人员：" prop="acceptancePersonnel">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm6.acceptancePersonnel" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="验收日期：" prop="acceptanceDate">
              <el-date-picker v-model="ruleForm6.endConstructionDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="验收说明：" prop="acceptanceNote">
              <el-input type="textarea" v-model="ruleForm6.acceptanceNote" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <div class="operation_box" v-if="operationShow == 8">
        <waterMeter></waterMeter>
        <legend>流程处理</legend>
        <procedure :isOptions="false"></procedure>
   
        
      </div>
      <!-- 工程结算 -->
      <div class="operation_box" v-if="operationShow == 9">
        <el-form :model="ruleForm8" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="表前人工费结算：" prop="PreStatementSettlement">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.PreStatementSettlement" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="表后人工费结算：" prop="PostStatementSettlemented">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.PostStatementSettlemented" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="表前材料费结算：" prop="PreStatementSettlement1">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.PreStatementSettlement1" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="表后材料费结算：" prop="PostStatementSettlemented1">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.PostStatementSettlemented1" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="其他结算：" prop="otherSettlement">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.otherSettlement" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="设计费结算：" prop="designFeeSettlement">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.designFeeSettlement" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="总管分担费用：" prop="costSharing">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.costSharing" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="结算合计：" prop="settlementTotal">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.settlementTotal" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="预缴合计：" prop="costSharing">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.costSharing" size="mini" placeholder="200.00" disabled class="read-only" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="退补金额：" prop="settlementTotal">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.settlementTotal" size="mini" placeholder="20.00" disabled class="read-only" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="编制人员：" prop="staffingStaff">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm8.staffingStaff" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="编制日期：" prop="compileDate">
              <el-date-picker v-model="ruleForm8.compileDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="编制说明：" prop="compilationNotes">
              <el-input type="textarea" v-model="ruleForm8.compilationNotes" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="余款退款方式：" prop="userNum">
              <el-radio v-model="ruleForm9.refundMode" label="0">无</el-radio>
              <el-radio v-model="ruleForm9.refundMode" label="1">现金</el-radio>
              <el-radio v-model="ruleForm9.refundMode" label="2">转账</el-radio>
              <el-radio v-model="ruleForm9.refundMode" label="4">转余额</el-radio>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
        
      </div>

      <div class="operation_box" v-if="operationShow == 10">
        <el-form :model="ruleForm9" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="结算合计：" prop="settlementTotal">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm9.settlementTotal" size="mini" disabled clearable  type="number" @change ='countNum()'></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="预缴金额：" prop="advancePayment">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm9.advancePayment" size="mini" disabled clearable  type="number" @change ='countNum()'></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="退补金额：" prop="amountRefund">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm9.amountRefund" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="收款方式：" prop="paymentMethod">
              <el-select v-model="ruleForm9.paymentMethod" clearable disabled size="mini" style="width:100%">
                <el-option v-for="item in paymentMethodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="结算人员：" prop="settlers">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm9.settlers" size="mini" disabled clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="结算日期：" prop="settlementDate">
              <el-date-picker v-model="ruleForm9.settlementDate" disabled type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <div class="my-input1 gocenter2" style="margin-bottom: 1%;">
            <el-form-item label="结算说明：" prop="settlementStatement">
              <el-input type="textarea" v-model="ruleForm9.settlementStatement" disabled style="width:100%"></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="余款退款方式：" prop="userNum">
              <el-radio v-model="ruleForm9.refundMode" label="0" disabled>无</el-radio>
              <el-radio v-model="ruleForm9.refundMode" label="1" disabled>现金</el-radio>
              <el-radio v-model="ruleForm9.refundMode" label="2" disabled>转账</el-radio>
              <el-radio v-model="ruleForm9.refundMode" label="4" disabled>转余额</el-radio>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="开户银行：" prop="openingBank">
              <el-select v-model="ruleForm9.openingBank" clearable size="mini" style="width:100%" disabled>
                <el-option v-for="item in countManagementEditForm.bankName" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="开户名称：" prop="openingBankName">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm9.openingBankName" size="mini" clearable disabled></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="银行账户：" prop="bankAccount" class="id-card" style="width: calc(46% + 10px)">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="证件号码" v-model="ruleForm9.bankAccount" class="input-with-select" clearable disabled>
                <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini' ></el-button>
              </el-input>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
        <procedure :isOptions="false"></procedure>
        </el-form>
      </div>
      <div class="operation_box" v-if="operationShow == 11">
        <el-form :model="hangUp" ref="form" :rules="rules" label-width="100px">
          <div class="my-input1">
            <el-form-item label="挂接人：" prop="Approval">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="hangUp.hangUp" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="my-input1">
            <el-form-item label="挂接日期：" prop="hangUpDate">
              <el-date-picker v-model="hangUp.hangUpDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <legend>流程处理</legend>
          <procedure :isOptions="false"></procedure>
        </el-form>
      </div>

      <el-dialog class="waterdialog" :close-on-click-modal="false" title="审批流程" :visible.sync="approvalShow">
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table style="margin-top: 3%" v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list1" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" ></el-table-column>
            <el-table-column prop="time" min-width="100" label="时间"></el-table-column>
            <!-- <el-table-column prop="node" min-width="80" label="节点"></el-table-column> -->
            <el-table-column prop="operator" min-width="80" label="操作人"></el-table-column>
            <!-- <el-table-column prop="operation" min-width="80" label="操作"></el-table-column> -->
            <el-table-column prop="disposal" min-width="150" label="处理意见" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" style="font-size:12px;text-align:center;">驳回</el-button>
                <el-button type="text" style="font-size:12px;text-align:center;">通过</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="enclosure" min-width="100" label="附件" show-overflow-tooltip></el-table-column> -->
          </el-table>
          
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
            </el-pagination>
          </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="approvalShow = false" size='mini'>返回</el-button>
        </div>
      </el-dialog>

    </div>
    <div v-if='editContent && !uploadPic && !isExecution'>
      <waterMeter :isEdit="true" :isShow="true"></waterMeter>
    </div>
    <!-- 上传附件 -->
    <!-- <div v-if='uploadPic && !editContent && !isExecution'>
      <uploadFile></uploadFile>
    </div> -->
    <!-- 多水表录入 -->
    <!-- <div v-if="!uploadPic && !editContent && isExecution">
      <execution ref="execution"></execution>
    </div> -->
  </div>
</template>
<script>
import steps from "@/components/Steps";
import uploadFile from '@/components/uploadPic';
import execution from '@/components/execution';
import waterMeter from '@/components/waterMeter';
import procedure from "@/components/procedure"
import choosectm from "@/components/ctmInfor"
export default {
    name:"allHandleInfo",
  components: {
    steps,uploadFile,execution,waterMeter,procedure,
    choosectm
  },
  data() {
    return {
      eleSignType:"进行签名",
      procedureShow:true,
      procedureIcon:"el-icon-minus",
      uploadFileShow:true,
      uploadIcon:"el-icon-minus",
      signName:"电子签名",
      signVisible:false,
      choosectmName:"选择客户",
      choosectmVisible:false,
      chooseAccountName:"选择账户",
      chooseAccountVisible:false,
      hangUp:{},
      activeName: 'first',
      isShow:false,
      oldData:[],
      tableData:[
        {
          userCode:'D00001',
          userName:'张三',
          userAddress:'深圳市罗湖区东深小区',
          meterAddress:'深圳市罗湖区科技大厦',
          bookNum:'E000001',
          documentType:'0',
          documentNum:'430124199406192201',
          meterDate:'2019-06-19',
          meterStaff:'焦文',
          meterNum:'E000001',
          meterCaliber:'0',
          waterType:'0',
          compression:'0',
          deposit:'工程中心用户工程客服营收系统已启用测试数据1',
        },
        { 
          userCode:'D00002',
          userName:'李四',
          userAddress:'深圳市罗湖区东深小区',
          meterAddress:'深圳市罗湖区科技大厦',
          bookNum:'E000002',
          documentType:'0',
          documentNum:'430124199406192201',
          meterDate:'2019-08-13',
          meterStaff:'焦文',
          meterNum:'E000002',
          meterCaliber:'0',
          waterType:'0',
          compression:'0',
          deposit:'工程中心用户工程客服营收系统已启用测试数据2',
        },
      ],
      uploadPic:false,//上传附件
      isExecution:false,//施工材料
      editContent: false,//多水表录入
      isEdit:false,//多水表录入是否可编辑
      editContent1:false,
      countManagementEditForm:{
        countOptions:[
          {
            value:'2',
            label:'082319073',
          },
        ],        
        backfillInput:{
          peopleCode:'',
          peopleName:'',
          peopleAddress:'',
          people:'',
          peopleTel:'',
          peopleLevel:'',
        },
        countMsg:{
          PriceStrategy:'',
          moreMoney:'',
          isfines:'1',
          codeNum:'',
          code:'',
          userType:'0',
          userType1:'1',
          UpdateCodeCopye:'1',
        },
        countMsgOrder:{
          Remarks:'',
          value:'',
          value1:'',
          value3:'',
        },
        InvoiceInformation:{
          value:'',
          value1:'',
          value2:'',
          value3:'',
        },
        bankCountNum:"",
        desc:"0",
        desc1:"0",
        userNume:"",
        descoptions:[
            {
                name:"普通用户",
                value:"1"
            },
            {
                name:"VIP客户",
                value:"2"
            },
            {
                name:"大客户",
                value:"3"
            },
        ],
        PaymentMethod:[
            {
                name:"代扣",
                value:"1"
            },
            {
                name:"托收",
                value:"2"
            },
            {
                name:"其他",
                value:"3"
            },
        ],
        bankName:[
            {
                name:"中国银行",
                value:'1'
            },
            {
                name:"中国农业银行",
                value:'2'
            },
            {
                name:"中国工商银行",
                value:'3'
            }
        ],
        descoptions:[
            {
                name:"启用",
                value:'2'
            },
            {
                name:"停用",
                value:'4'
            },
        ],
        PriceStrategy:"",
        isfines:"",
        UpdateCodeCopye:"",
        Remarks:"",
        year:"1"
      },
      active: 4,
      operationShow: 1,
      operation:0,
      approvalShow: false,
      crumbsData: { //面包屑
        titleList: [
          { title: '工程中心', path: '/EngineeringCenter' },
          { title: '用户工程', path: '/EngineeringCenter' },
          { title: '处理中', method: () => { window.histroy.back() } },
          { title: '办理', method: () => { window.histroy.back() } }
        ],
      },
      rules: {
        Applicant: [
          { required: true, message: '请输入申请人', trigger: 'blur' }
        ],
        applicantDate: [
          { required: true, message: '请输入申请日期', trigger: 'change' }
        ],
        engineerType: [
          { required: true, message: '请选择工程类型', trigger: 'change' }
        ],
        Contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        documentType: [
          { required: true, message: '请输入证件类型', trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入座机号码', trigger: 'blur' }
        ],
        Emergency: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
      },
      ruleForm: {
        Applicant: '',
        engineerType: 1,
        businessArea: 1,
        Emergency: '0',
        residentialType: '0',
        userType: '0',
        waterUse: '0',
        ownerId:'0',
        waterAddress2:'0',
        electronicSignature:"未签名",
        source:"",
        sourceType:[//资源来源
          {
            value:'0',
            label:'微信营业厅',
          },
          {
            value:'1',
            label:'营业厅',
          },
        ],
        ownerIdType:[//证件类型
          {
            value:'0',
            label:"居民身份证",
          },
          {
            value:'1',
            label:"护照",
          },
          {
            value:'2',
            label:"户口本",
          },
          {
            value:'3',
            label:"回乡证",
          },
          {
            value:'4',
            label:"台胞证",
          },
        ],
        engineerDataType: [//工程类型
          {
            value: 1,
            label: '用水报装'
          },
          {
            value: 2,
            label: '户表改造'
          },
          {
            value: 3,
            label: '水表移表'
          },
          {
            value: 4,
            label: '水表扩容'
          },
        ],
        urgencyType:[//紧急程度
          {
            value:'0',
            label:'一般',
          },
          {
            value:'1',
            label:'紧急',
          }
        ],
        businessAreaList: [//营业所
          {
            value: 1,
            label: '南沙'
          },
          {
            value: 2,
            label: '横沥'
          },
          {
            value: 3,
            label: '黄阁'
          },
          {
            value: 4,
            label: '万顷沙'
          },
        ],
        waterUseType:[//用水期类型
          {
            value:'0',
            label:'固定',
          },
          {
            value:'1',
            label:'临时',
          },
        ],
      },
      ruleForm1: {
        projectName:'',
        checked:false,
        checked2:false,
        surveyors:'',
        investigationDate:'',
        conclusion:'',
      },
      ruleForm2: {
        designer:'',
        designDate:'',
        explain:'',
      },
      ruleForm3: {
        preTableBudget:'',
        postTableBudgeted:'',
        otherBudgets:'',
        designFee:'',
        deposit:'',
        staffingStaff:'',
        compileDate:'',
        compilationNotes:'',
      },
      ruleForm4: {
        budgetTotal:'',
        depositTotal:'',
        receivableTotal:'',
        prepaymentMethod:'',
        paymentMethod:'',
        Cashier:'',
        collectionDate:'',
        payExplain:'',
      },
      ruleForm5: {
        waterCode:'',
        startNum:'',
        paymentDate:'',
        constructionTeam:'',
        beginConstructionDate:'',
        endConstructionDate:'',
        constructionInstructions:'',
      },
      ruleForm6: {
        acceptancePersonnel:'',
        acceptanceDate:'',
        acceptanceNote:'',
      },
      ruleForm7: {},
      ruleForm8:{
        PreStatementSettlement:'',
        PostStatementSettlemented:'',
        otherSettlement:'',
        designFeeSettlement:'',
        costSharing:'',
        settlementTotal:'',
        staffingStaff:'',
        compileDate:'',
        compilationNotes:'',
      },
      ruleForm9:{
        settlementTotal:'',
        advancePayment:'',
        amountRefund:'',
        paymentMethod:'',
        settlers:'',
        settlementDate:'',
        settlementStatement:'',
        refundMode:'',
        openingBank:'',
        openingBankName:'',
        bankAccount:'',
      },
      dialogForm: {
        userName:'',
        userAddress:'',
        meterAddress:'',
        bookNum:'',
        documentType:'',
        documentNum:'',
        meterDate:'',
        meterStaff:'',
        meterNum:'',
        meterCaliber:'',
        waterType:'',
        compression:'',
        deposit:'',
      },
      options6: [
        {
          value: 1,
          label: '用水报装'
        },
        {
          value: 2,
          label: '户表改造'
        },
        {
          value: 3,
          label: '水表移表'
        },
        {
          value: 4,
          label: '水表扩容'
        },
      ],
      c: [],
      businessAreaList: [
        {
          value: 1,
          label: '南沙'
        },
        {
          value: 2,
          label: '横沥'
        },
        {
          value: 3,
          label: '黄阁'
        },
        {
          value: 4,
          label: '万顷沙'
        },
      ],
      prepaymentMethodList: [
        {
          value: 1,
          label: '一次性缴款'
        },
        {
          value: 2,
          label: '预缴款'
        }
      ],
      paymentMethodList: [
        {
            label:"现金",
            value:"0"
        },
        {
            label:"支票",
            value:"1"
        },
        {
            label:"刷卡",
            value:"2"
        },
        {
            label:"转账",
            value:"3"
        },
        {
            label:"代扣",
            value:"4"
        },
        {
            label:"托收",
            value:"5"
        },
        {
            label:"微信",
            value:"6"
        },
        {
            label:"支付宝",
            value:"7"
        }
      ],
      userTypeList: [
        {
          value: '1',
          label: '私户'
        },
        {
          value: '2',
          label: '公户'
        },
      ],
      meterCaliberType:[//用水口径
        {
          label:'15',
          value:'0',
        },
        {
          label:'20',
          value:'1',
        },
        {
          label:'25',
          value:'2',
        },
        {
          label:'40',
          value:'3',
        },
        {
          label:'50',
          value:'4',
        },
        {
          label:'80',
          value:'5',
        },
        {
          label:'100',
          value:'6',
        },
        {
          label:'150',
          value:'7',
        },
        {
          label:'200',
          value:'8',
        },
        {
          label:'300',
          value:'9',
        },
      ],
      waterDataType:[//用水类型
        {
          label:'居民用水',
          value:'0',
        },
        {
          label:'非居民用水',
          value:'1',
        },
        {
          label:'特种用水',
          value:'2',
        },
        {
          label:'区域用水',
          value:'3'
        }
      ],
      compressionType:[//是否加压
        {
          label:'是',
          value:'0'
        },
        {
          label:'否',
          value:'1',
        }
      ],
      histroyData: {},
      maxHeight: 0,
      tableShow: false,

      step: [
        {
          num: 1,
          title: "工程登记"
        },
        {
          num: 2,
          title: "勘察"
        },
        {
          num: 3,
          title: "设计"
        },
        {
          num: 4,
          title: "工程预算"
        },
        {
          num: 5,
          title: "工程收款"
        },
        {
          num: 6,
          title: "安装施工"
        },
        {
          num: 7,
          title: "工程验收"
        },
        {
          num: 8,
          title: "立户"
        },
        {
          num: 9,
          title: "工程结算"
        },
        {
          num: 10,
          title: "结算退款"
        },
        {
          num: 11,
          title: "表计挂接"
        },

      ],
      active: 4,
      Approval:{
        Approval:"",
        ApprovalDate:"",
        explain:"",
      }


    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    // this.$changeTable(this, '.userInfo .kl-table', ['.userInfo .toolbar', '.userInfo .block', '.userInfo bread-contain'])

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.$changeTable(this, '.engineer-center .engineer-center-right', ['.engineer-center .table-top'])
    })
    eventBus.$on('operation', (item) => {
      this.operationShow = item.num;
    });
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    settlementTotal(){},
    advancePayment(){},
    amountRefund(){},
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {

      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
        ],
        list1: [
          {
            time: '2019-06-21 16:27:35',
            node: '工程登记',
            operator: '张三',
            operation: '通过',
            disposal: '尽快完成',
            enclosure: '无',
          },
          {},
          {},
          {}
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5,
      }
    },
    // 电子签名
    Signature(){
      if(this.eleSignType==="进行签名"){
        this.eleSignType = "查看";
        this.ruleForm.electronicSignature = "已签名";
      }else{
        // this.eleSignType="进行签名"
        this.signVisible = true;
      }
    },
    // 展示更多
    showMore(val,icon){
      if(this[val]){
        this[val] = false;
        this[icon] = "el-icon-plus";
      }else{
        this[val] = true;
        this[icon] = "el-icon-minus";
      }
      
    },
    handleClick(item) {
      // this.active = Number(item.index);
    },
    submitForm(formName){//步骤条-工程登记-暂存/暂存
    },
    waterInfo(num){//步骤条-工程登记-多水表录入
      if(num == 0){//
        this.isEdit = false;//工程登记进入-可编辑
      }else{
        this.isEdit = true;//安装施工进入-不可编辑
      }
      this.$set(this.crumbsData.titleList,"3",{title:'水表明细',method:()=>{window.histroy.back()}})
      this.uploadPic = false;
      this.isExecution = false;
      this.editContent = true;
    },
    addEditContent(){//步骤条-工程登记-多水表录入-添加
      this.tableData.push({});
    },
    delEditContent(i){//步骤条-工程登记-多水表录入-删除
      this.tableData.splice(i,1)
    },
    editEditContent(row){//步骤条-工程登记-多水表录入-编辑
      this.dialogForm.userName = row.userName;
      this.dialogForm.userAddress = row.userAddress;
      this.dialogForm.meterAddress = row.meterAddress;
      this.dialogForm.bookNum = row.bookNum;
      this.dialogForm.documentType = row.documentType;
      this.dialogForm.documentNum = row.documentNum;
      this.dialogForm.meterDate = row.meterDate;
      this.dialogForm.meterStaff = row.meterStaff;
      this.dialogForm.meterNum = row.meterNum;
      this.dialogForm.meterCaliber = row.meterCaliber;
      this.dialogForm.waterType = row.waterType;
      this.dialogForm.compression = row.compression;
      this.dialogForm.deposit = row.deposit;
      this.oldData = row;
      this.editContent1 = true;
    },
    saveEditContent(num){//步骤条-工程登记-多水表录入-暂存
      if(num == 0){
      }else if(num == 1){
        let newData = this.dialogForm;
        if(this.oldData !== newData){
          this.oldData.userName = newData.userName;
          this.oldData.userAddress = newData.userAddress;
          this.oldData.meterAddress = newData.meterAddress;
          this.oldData.bookNum = newData.bookNum;
          this.oldData.documentType = newData.documentType;
          this.oldData.documentNum = newData.documentNum;
          this.oldData.meterDate = newData.meterDate;
          this.oldData.meterStaff = newData.meterStaff;
          this.oldData.meterNum = newData.meterNum;
          this.oldData.meterCaliber = newData.meterCaliber;
          this.oldData.waterType = newData.waterType;
          this.oldData.compression = newData.compression;
          this.oldData.deposit = newData.deposit;
        }
        this.editContent1 = false;
      }else if(num == 2){
        // console.log(this.ruleForm1);
      }else if(num == 3){
        // console.log(this.ruleForm2);
      }else if(num == 4){
        // console.log(this.ruleForm3);
      }else if(num == 5){
        // console.log(this.ruleForm4);
      }else if(num == 6){
        // console.log(this.ruleForm5);
      }else if(num == 7){
        // console.log(this.ruleForm6);
      }else if(num == 8){
        // console.log(this.tableData);
      }else if(num == 9){
        // console.log(this.ruleForm8);
      }else if(num == 10){
        // console.log(this.ruleForm9);
      }
    },
    takeExecution(){//步骤条-设计-施工材料-显示
      // this.isExecution = true;
      this.$set(this.crumbsData.titleList,"3",{title:'施工材料',method:()=>{window.histroy.back()}})
      this.$set(this,'uploadPic',false)
      this.$set(this,'editContent',false)
      this.$set(this,'isExecution',true)

    },
    addExecution(){//步骤条-设计-施工材料-添加
      this.$refs.execution.addExecution();
    },
    saveExecution(){
      this.$refs.execution.saveExecution();
    },
    //审批流程返回按钮
    operationReturn() {
      eventBus.$emit('operationReturn', false);
    },
    closeDialog(){
      this.crumbsData.titleList.splice(3,1);
      this.editContent = false;
      this.uploadPic = false;
      this.isExecution = false;
    },
    upload(){
      this.$set(this.crumbsData.titleList,"3",{title:'上传附件',method:()=>{window.histroy.back()}})
      this.editContent = false;
      this.isExecution = false;
      this.uploadPic = true;
    },
    // 多页签的点击
    tabCurrent(val){
      if(val.index == 1){
        this.upload();
      }else if(val.index == 2){
        this.waterInfo();
      }else{
        this.closeDialog();
      }
    },
    countNum(){

      let settlementTotal = this.ruleForm9.settlementTotal;
      let advancePayment = this.ruleForm9.advancePayment;
      if(!settlementTotal){
        settlementTotal = 0;
      }
      if(!advancePayment){
        advancePayment = 0;
      }
      // if(!this.ruleForm7.settlementTotal){
      //   this.ruleForm7.settlementTotal = 0;
      // }
      // if(!this.ruleForm7.advancePayment){
      //   this.ruleForm7.advancePayment = 0;
      // }
      // if(!this.ruleForm7.amountRefund){
      //   this.ruleForm7.amountRefund = 0;
      // }
      // let amountRefund = Number(this.ruleForm7.settlementTotal) - Number(this.ruleForm7.advancePayment)
      let amountRefund = Number(settlementTotal) - Number(advancePayment)
      amountRefund = amountRefund.toFixed(2)
      this.$set(this.ruleForm9,'amountRefund',amountRefund);

    },
    chooseCtm(){
      this.$emit('chooseCtm','chooseCtm')
    },
    chooseAccount(){
      this.chooseAccountVisible = true;
    },
    chooseCus(){
      // this.chooseDioag = true
      this.choosectmVisible = true;
    },
    changeAcount(val){
      if(val==="1"){
        this.chooseAccount();
      }else{
        this.closeDialog();
      }
    },
    handleCurrentChange(val) {  //显示多少页码
      // this.tableQuery.page = val
      this.init()
    },
    stepActive(val){
      this.operationShow = val;
      this.operation = val-1;
     
    },
    handleSizeChange(){

    },
    closechoosectm(){
      this.choosectmVisible = false;
      this.chooseAccountVisible = false;
    },
  },
}
</script>

<style lang="scss">
.allHandleInfo{
  height: 100%;
  // overflow-y:scroll;
  // overflow-x: hidden; 
  // overflow: auto;
  .bread-contain #crumbs {
    width: 30% !important;
  }
  .bread-contain .bread-contain-right {
    width: 68% !important;
  }
  .Steps > ul li b {
    font-size: 14px;
  }
  .Steps > ul li span {
    font-size: 13px;
  }
  .Steps {
    // width: 1035px;
    width: 100%;
    // margin: auto;
    margin-top: 10px;
    margin-left: 15px;
    display: inline-block;
    .stepCon {
      cursor: pointer;
    }
    ul{
      // width: 100%;
      li{
        // width: 9%;
        text-align: center;
      }
    }
  }
  .btn_box {
    width: 98%;
    height: 58px;
    border-bottom: 1px solid #dcdfe6;
    margin:5px auto;
    .topclose {
      background: white;
      color: black;
      border: 1px solid #dcdfe6;
      float: left;
      margin-top: 10px;
      margin-left: 16px;
    }
  }
  .edit-content{
    // height: 100%;
    height: calc(100% - 40px);
    .operation_box {
      height: calc(100% - 70px);
      overflow: auto;
      .btnBox{
        display: inline-block;
        width: 99%;
        text-align: right;
        margin-bottom: 0;
        margin-top: .5rem;
      }
    }
    .operation_one{
      // height: calc(100% - 100px);
      overflow: hidden;
      .operation_one-top{
        height: 10%;
      }
      .operation_one-bottom{
        height:100%;
        overflow-y: hidden;
        overflow-x: hidden;
        .SignatureBtn{
          .el-form-item__content{
            margin-left: 10px !important;
          }
        }
      }
    }
  }

  legend{
      background: #f5f5f5;
      font-weight: 700;
      font-size: 12px;
      padding: 5px 20px;
      font-size: 14px;
      margin-bottom: 5px;
      i{
        float:right;
        margin-top: 5px;
        cursor: pointer;
      }
  }
  .backfillSubmitForm{
      padding: 1rem 0rem;
      // width: 93%;
      .kr-col{
        .el-form-item__content{
          margin-left: 1rem !important;
        }
      }
      .el-form-item{
          // width: 29%;
          margin-top: 0rem;
          margin-bottom: 0rem;
          .el-form-item__content{
              // width: 60%;
              .input-with-select{
                margin-top:.5rem;
              }
              .el-select{
                  width: 100%;
              }
              .el-checkbox{
                margin-left:1rem;
                margin-right: 1rem;
                width: 4rem;
              }
              .el-input{
                .el-input__inner{
                  height: 28px;
                  line-height: 28px;
                  width: 100% !important;
                }
              }
          }
      }
      .right-btn{
          text-align: right;
          width: 100%;
      }
      .from-table{
          width: 100%;
          .el-form-item__content{
              width: 100%;
          }
      }
      .userAdress{
          width:80%;
          .el-form-item__content{
              width:calc(100% - 160px);
              .el-form-item__label{
                  width: 100px !important;
              }
              .el-textarea, .el-input{
                  width:30%;
              }
              .el-select{
                  width:20%;
              }
              .el-checkbox-group{
                  display:inline-block;
                  width: 50%;
              }
          }
      }
      .selectCheck{
          width:100%;
          .el-form-item__content{
              width:calc(100% - 160px);
              .el-form-item__label{
                  width: 80px !important;
              }
              .el-textarea, .el-input{
                  width:17%;
              }
              .el-select{
                  width:20%;
              }
              .el-checkbox-group{
                  display:inline-block;
                  width: 77%;
              }
          }
      }

      .Remarks{
          width: 100%;
          .el-form-item__content{
              width:calc(100% - 160px);
          }
      }
  }
  .el-steps--horizontal{
      margin: 0 auto;
      width: 98%;
      padding-bottom: 20px;
  }
  .el-tab-pane {
    height: 100%;
  }

  .el-tabs--border-card {
    box-shadow: none !important;
    border-bottom: none;
    border-left: none;
    border-right: none;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .my-input {
    width: 100%;
    display: inline-block;
    .id-card{
      margin-top:8px;
    }
    // padding-left: 2%;
    .el-input__inner {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 0px !important;
      .input-with-select{
        margin-top: .5rem;
      }
    }
  }
  .my-input .el-input {
    width: 100% !important;
  }
  .my-input .el-input__inner {
    width: 100% !important;
    height: 28px;
  }
  .my-input .el-select .el-input {
    width: 100%;
  }
  .my-input1 {
    width: 35%;
    display: inline-block;
    padding-left: 8%;
    .el-checkbox{
      width: 7rem;
    }
    .el-input__inner {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 10px !important;
    }
    .el-checkbox__label {
      font-size: 14px !important;
    }
    .id-card .el-form-item__content{
      margin-top:.5rem; 
    }
  }
  .my-input1 .el-input {
    width: 100% !important;
  }
  .my-input1 .el-input__inner {
    width: 100% !important;
    height: 28px;
  }
  .my-input1 .el-select .el-input {
    width: 100%;
  }
  .my-input1 .el-form-item__label {
    width: 130px !important;
  }
  .my-input1 .el-form-item__content {
    margin-left: 130px !important;
  }
  .gocenter {
    width: 100%;
  }
  .gocenter1 {
    width: 83.5%;
  }
  .gocenter2 {
    width: 78.4%;
  }
  .gocenter .el-form-item__label {
    // text-align: center !important;
  }
  .gocenter .el-textarea__inner {
    min-height: 50px !important;
  }
  .btnBox {
    display: inline-block;
    width: 100%;
    text-align: center;
    margin-bottom: 2%;
  }
  .btnBox .el-button {
    margin-left: .8%;
    font-size: 14px;
  }
  .engineer-center-right-content {
    height: 87%;
    overflow-y: auto;
  }
  .kl-table {
    padding: 0px 20px;
    .el-input {
      height: 100%;
      .el-input__inner {
        // height: 100%;
      }
    }
    .el-select {
      height: 100%;
      .el-input__icon {
        line-height: 25px;
      }
    }
    .el-date-editor {
      width: 100%;
      .el-input__inner {
        width: 100% !important;
      }
    }
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .btnBox1 {
    display: inline-block;
    width: 100%;
    margin-bottom: 1%;
    margin-top: 1%;
  }
  .btnBox1 span {
    font-size: 14px;
    margin-left: 1.5%;
    text-align: left;
  }
  .btnBox2{
    .el-button{
      background: #48cc7c;
      border: 1px solid #48cc7c;
    }
  }
  .el-dialog__body {
    padding: 0px 20px !important;
    height: calc(100% - 124px) !important;
  }
  .el-dialog__footer .el-button {
    font-size: 14px;
  }
  .el-tabs__content {
    overflow-y: auto;
  }
  .receivables .el-form-item__label {
    width: 110px !important;
  }
  .receivables .el-form-item__content {
    margin-left: 110px !important;
  }
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 51px);
      padding: 0px;
    }
    .el-tabs__header.is-bottom{
      height: 40px;
    }
  }
}
</style>
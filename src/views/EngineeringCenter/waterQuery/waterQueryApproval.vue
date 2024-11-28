

<template>
  <div class="waterQueryApproval">
    <!-- 预览电子签名 -->
    <el-dialog :title="signName" :visible.sync="signVisible" :close-on-click-modal="false" class="addDialog">
           <img src="@/assets/images/sign.jpg" alt="签名">

    	</el-dialog>
    
    <div  class='process'>
        <!-- 登记 -->
        <div v-if="operationShow == 1" class="process-left">
          
            <div class="bread-contain">
              <div class="bread-contain-right" >
                <font v-if='editContent'>
                  <el-button size="mini" type="primary" @click="submitForm('EngineeringForm')">暂存</el-button>
                  <el-button size="mini" type="primary">打印</el-button>
                </font>

                
                <font v-if='uploadPic'>
                  <el-button size="mini" type="primary" @click="saveEditContent(0)">暂存</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click="addEditContent()">添加</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-bottom">下载模板</el-button>
                  <el-button size="mini" type="primary" icon='el-icon-download'>导入</el-button>
                </font>
              </div>
            </div>
            
            <el-tabs type="border-card"  tab-position="bottom" @tab-click="tabCurrent">
              <el-tab-pane label="基础信息">
                
                <el-form :model="ruleForm"  class="formBill-Three" :inline="true" ref="form"  size="mini"  :show-message="false" :rules="rules"  label-width="130px">
                  
                  <commonPart :parentToChild="'3'"></commonPart>

                  <legend class="legendColumn"> 开户信息 </legend>
                    <el-form-item label="开户编号：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.backfillInput.peopleCode" placeholder="新开户" disabled class="read-only"></el-input>
                    </el-form-item>

                    <el-form-item label="开户类型：">
                      <el-select v-model="countManagementEditForm.countMsg.userType" clearable size="mini" style="width:100%">
                        <el-option label="普通用户" value="0"></el-option>
                        <el-option label="大用户" value="1"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="业主名称：" prop="Applicant">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.Applicant" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="业主证件类型：" prop="ownerId">
                      <el-select v-model="ruleForm.ownerId" clearable size="mini" style="width:100%">
                        <el-option  v-for="(item,index) in ruleForm.ownerIdType" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                        
                    
                    <el-form-item label="业主证件号码：" prop="documentNumber" style="width: calc(46% + 10px)">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="证件号码" v-model="ruleForm.documentNumber" class="input-with-select">
                        <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="业主电话：" prop="Contacts">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.Contacts" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="经办人名称：" prop="contactNumber">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.contactNumber" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="经办人证件类型：" prop="waterAddress2">
                      <el-select v-model="ruleForm.waterAddress2" clearable size="mini" style="width:100%">
                        <el-option  v-for="(item,index) in ruleForm.ownerIdType" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="经办人证件号码：" prop="waterAddress3" style="width: calc(46% + 10px)">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="证件号码" v-model="ruleForm.waterAddress3" class="input-with-select">
                        <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                      </el-input>
                    </el-form-item>
                  
                    <el-form-item label="用户地址：" prop="waterAddress1">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.waterAddress1" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="电子签名：" prop="electronicSignature" class="electronicSignature">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.electronicSignature" size="mini" class="read-only" disabled></el-input>
                      
                    </el-form-item>
                    
                    
                    <el-form-item>
                      <el-button type="primary" size="mini" @click="Signature">{{eleSignType}}</el-button>
                    </el-form-item>
                        
                  <legend class="legendColumn">工程信息</legend>
                  
                    <el-form-item label="工程类型：" prop="engineerType">
                      <el-select v-model="ruleForm.engineerType" clearable size="mini" style="width:100%">
                        <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="紧急程度：" prop="Emergency">
                      <el-select v-model="ruleForm.Emergency" clearable size="mini" style="width:100%">
                        <el-option label="一般" value="0"></el-option>
                        <el-option label="紧急" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="装表地址：" prop="waterAddress">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.waterAddress" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="信息来源：" prop="source">
                      <el-select v-model="ruleForm.source" clearable size="mini" style="width:100%">
                        <el-option v-for="item in sourceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="营业所：" prop="businessArea">
                      <el-select v-model="ruleForm.businessArea" clearable size="mini" style="width:100%">
                        <el-option v-for="item in businessAreaList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="行政区域：" prop="AdministrationArea">
                      <el-select v-model="ruleForm.AdministrationArea" clearable size="mini" style="width:100%">
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="管理区域：" prop="AdministrationArea1">
                      <el-select v-model="ruleForm.AdministrationArea1" clearable size="mini" style="width:100%">
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="原户号：" prop="oldNum">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.oldNum" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="总表户号：" prop="generalTableNum1">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.generalTableNum1" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="总表户号2：" prop="generalTableNum2">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.generalTableNum2" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="用水期：" prop="waterUse">
                      <el-select v-model="ruleForm.waterUse" clearable size="mini" style="width:100%">
                        <el-option label="固定" value="0"></el-option>
                        <el-option label="临时" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="用水期限：" prop="putTableNum">
                      <el-date-picker
                        v-model="ruleForm.waterPopulation"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  
                    <el-form-item label="备注：" class="Remarks" prop="applicationReasons">
                      <el-input type="textarea" v-model="ruleForm.applicationReasons" style="width:100%"></el-input>
                    </el-form-item>

                  <legend class="legendColumn"> 账户信息 </legend>

                    <el-form-item label="账户编号：">
                      <el-select v-model="countManagementEditForm.countMsg.PriceStrategy" @change="changeAcount" clearable size="mini" style="width:100%">
                        <el-option label="新开户" value="1"></el-option>
                        <el-option v-for="item in countManagementEditForm.countOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="缴费方式：">
                      <el-select  clearable v-model="countManagementEditForm.countMsg.isfines" placeholder="">
                          <el-option  v-for="(item,index) in countManagementEditForm.PaymentMethod" :key="index" :label="item.name" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="账户类型：" prop="userType1">
                      <el-select v-model="countManagementEditForm.countMsg.userType1" clearable size="mini" style="width:100%">
                        <el-option v-for="item in userTypeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="开户银行：">
                      <el-select  clearable v-model="countManagementEditForm.countMsg.UpdateCodeCopye" placeholder="">
                          <el-option  v-for="(item,index) in countManagementEditForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="开户名称：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.countMsgOrder.value" placeholder="梅州粤海水务有限公司" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="银行账户：" prop="documentNumber" style="width: calc(46% + 10px)">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="银行账户" v-model="countManagementEditForm.countMsgOrder.value1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                      </el-input>
                    </el-form-item>
                    
                    
                      <el-form-item label="托号：">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.countMsg.code" placeholder="" clearable></el-input>
                      </el-form-item>
                      
                      <el-form-item label="托收合同号：">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.countMsg.codeNum" placeholder="" clearable></el-input>
                      </el-form-item>
                            
                    
                  <legend class="legendColumn">开票信息</legend>
                    
                    <el-form-item label="发票类型：" prop="desc">
                        <el-select  clearable v-model="countManagementEditForm.desc" placeholder="">
                          <el-option label="收据" value="0"></el-option>
                          <el-option label="普通发票" value="1"></el-option>
                          <el-option label="专用发票" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="单位名称：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.InvoiceInformation.value" placeholder="" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="纳税人识别号：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.InvoiceInformation.value1" placeholder="" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="联系地址：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.InvoiceInformation.value2" placeholder="" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="联系电话：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.InvoiceInformation.value3" placeholder="" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="开户银行：">
                      <el-select  clearable v-model="countManagementEditForm.year" placeholder="">
                          <el-option  v-for="(item,index) in countManagementEditForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>

                      </el-select>
                    </el-form-item>

                    <el-form-item label="银行账户：" prop="documentNumber" style="width: calc(46% + 10px)">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="银行账户" v-model="countManagementEditForm.bankCountNum" class="input-with-select">
                        <el-button slot="append" icon="el-icon-reading" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="投递方式：" prop="desc1">
                        <el-select  clearable v-model="countManagementEditForm.desc1" placeholder="">
                          <el-option label="自取" value="0"></el-option>
                          <el-option label="邮寄" value="1"></el-option>
                          <el-option label="上门派送" value="2"></el-option>
                        </el-select>
                    </el-form-item>


                      <legend class="legendColumn">上传附件
                         <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i></legend>
                      <uploadFile v-if="uploadFileShow"></uploadFile>
                      <legend class="legendColumn">流程处理 
                        <i class="fontRight" :class="procedureIcon" @click="showMore('procedureShow','procedureIcon')"></i></legend>
                      <el-row v-if="procedureShow">
                        <procedure ></procedure>
                        <!-- <img src="@/assets/images/shenpi1.png" alt=""> -->
                      </el-row>
                      
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="多水表">
                  <waterMeter :isShow="isShow" :editShow="false" :isEdit="false"></waterMeter>
              </el-tab-pane>
            </el-tabs>     
        </div>

        <!-- 勘察 -->
        <div v-if="operationShow == 2" class="process-left">
          
          <div class="bread-contain">
            <div class="bread-contain-right" >
              <el-button size="mini" type="primary" @click="saveEditContent(2)">暂存</el-button>

            </div>
          </div>
          <el-form :model="ruleForm1" class="formBill-Three" :inline="true" ref="form" :rules="rules" size="mini" label-width="130px">
            <commonPart :parentToChild="'3'"></commonPart>
            <legend class="legendColumn">  勘察信息 </legend>
              
              <el-form-item  class="Remarks" style=" margin-left: 70px;">
                <el-checkbox v-model="ruleForm1.checked">需要办破路手续</el-checkbox>
                <el-checkbox v-model="ruleForm1.checked2">超标高</el-checkbox>
              </el-form-item>
              <br>
              <el-form-item label="勘察人员：" prop="surveyors">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm1.surveyors" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="勘察日期：" prop="investigationDate">
                <el-date-picker v-model="ruleForm1.investigationDate" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              
              <el-form-item label="勘察结论：" class="Remarks" prop="conclusion">
                <el-input type="textarea" v-model="ruleForm1.conclusion" ></el-input>
              </el-form-item>
              
            
            <legend class="legendColumn">流程处理</legend>
              <procedure ></procedure>

          </el-form>
        </div>

        <!-- 设计 -->
        <div v-if="operationShow == 3" class="process-left">
          
          <div class="bread-contain">
            <div class="bread-contain-right" >
              <font v-if='!isExecution'>
                <el-button size="mini" type="primary" @click="saveEditContent(3)">暂存</el-button>
                <el-button size="mini" type="primary" @click="takeExecution()">施工材料</el-button>
              </font>

              
              <font v-if='isExecution'>
                <el-button size="mini" type="primary" @click='saveExecution()'>暂存</el-button>
                <el-button size="mini" type="primary">选择模板</el-button>
                <el-button size="mini" type="primary" @click="addExecution()">添加</el-button>                
                <el-button icon="el-icon-caret-left" size="mini" @click="operationReturn()"  >返回</el-button>

              </font>
            </div>
          </div>
          <ConstructionMaterials v-if="!uploadPic && !editContent && isExecution" ref="ConstructionMaterials"></ConstructionMaterials>

          <el-form v-if='!isExecution' :model="ruleForm2" class="formBill-Three" :inline="true"  size="mini" ref="form"  :rules="rules" label-width="130px">
            <commonPart :parentToChild="'3'"></commonPart>

            <legend class="legendColumn">  设计信息 </legend>
              <el-form-item label="设计人员：" prop="designer">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm2.designer" clearable></el-input>
              </el-form-item>
              <el-form-item label="设计日期：" prop="designDate">
                <el-date-picker v-model="ruleForm2.designDate" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="设计说明：" class="Remarks" prop="explain">
                <el-input type="textarea" v-model="ruleForm2.explain"></el-input>
              </el-form-item>

            <legend class="legendColumn">流程处理</legend>
              <procedure ></procedure>

          </el-form>
        </div>

        <!-- 工程预算 -->
        <div v-if="operationShow == 4" class="process-left">
          
          <div class="bread-contain">
            <div class="bread-contain-right" >
              <el-button size="mini" type="primary" @click="saveEditContent(4)">暂存</el-button>

            </div>
          </div>
          <el-form :model="ruleForm3"  class="formBill-Three" :inline="true"  size="mini" ref="form" :rules="rules" label-width="130px">
            <commonPart :parentToChild="'3'"></commonPart>
            <legend class="legendColumn">  工程预算信息 </legend>
              <el-form-item label="表前人工费预算：" prop="preTableBudget">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.preTableBudget" size="mini" clearable></el-input>
              </el-form-item>

              <el-form-item label="表后人工费预算：" prop="postTableBudgeted">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.postTableBudgeted" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="表前材料费预算：" prop="preTableBudget1">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.preTableBudget1" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="表后材料费预算：" prop="postTableBudgeted1">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.postTableBudgeted1" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="其他预算：" prop="otherBudgets">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.otherBudgets" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="设计费：" prop="designFee">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.designFee" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="押金：" prop="deposit">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.deposit" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="预算合计：" prop="total">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.total" size="mini" clearable disabled></el-input>
              </el-form-item>
              
              <el-form-item label="结算方式：" prop="prepaymentMethod">
                <el-select v-model="ruleForm3.prepaymentMethod" clearable size="mini" >
                  <el-option v-for="item in prepaymentMethodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="编制人员：" prop="staffingStaff">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm3.staffingStaff" size="mini" clearable></el-input>
              </el-form-item>
              
              <el-form-item label="编制日期：" prop="compileDate">
                <el-date-picker v-model="ruleForm3.compileDate" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              
              <el-form-item label="编制说明：" class="Remarks" prop="compilationNotes">
                <el-input type="textarea" v-model="ruleForm3.compilationNotes" s></el-input>
              </el-form-item>
              
            <legend class="legendColumn">流程处理</legend>
              <procedure></procedure>
          </el-form>
        </div>

        <!-- 结束 -->
        <div v-if="operationShow == 5" class="process-left">
        </div>


        <div class="StepCollapse" @click="collapse">
          <i class="el-icon-arrow-right leftChange"></i>
        </div>
        <div class="process-right" v-if="approvalShow">
          
          <div class="stepsTitle">流程信息</div>
          <!-- <div class="stepsBottom"> 
            <el-button type="primary" size="mini" class="el-icon-arrow-up"></el-button>
          </div> -->
          <div class="line"></div>
          <el-steps :active="operation" direction="vertical"  finish-status="success">
            <el-step title="登记信息" @click.native="stepActive(1)"> </el-step>
            <el-step title="勘察" @click.native="stepActive(2)"></el-step>
            <el-step title="设计" @click.native="stepActive(3)"></el-step>
            <el-step title="工程预算" @click.native="stepActive(4)"></el-step>
            <el-step title="结束" @click.native="stepActive(5)"></el-step>
          </el-steps>
        </div>
    </div>

  </div>
</template>
<script>
import uploadFile from '@/components/uploadPic';
import ConstructionMaterials from '@/components/ConstructionMaterials';
import waterMeter from '@/components/waterMeter';
import procedure from "@/components/procedure"
import choosectm from "@/components/ctmInfor"
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"//公告模块
export default {
  name:" waterQueryApproval",
  props:['codeStep'],
  components: {
    commonPart,
    uploadFile,
    ConstructionMaterials,
    waterMeter,
    procedure,
    choosectm
  },
  
  
  data() {
    return {
      approvalShow: true,
      eleSignType:"签名",
      procedureShow:true,
      procedureIcon:"el-icon-minus",
      uploadFileShow:true,
      uploadIcon:"el-icon-minus",
      signName:"电子签名",
      signVisible:false,
      choosectmName:"选择客户",
      choosectmVisible:false,
      hangUp:{},
      activeName: 'first',
      isShow:false,
      oldData:[],
      uploadPic:false,//上传附件
      isExecution:false,//施工材料
      editContent: true,//多水表录入
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
        PriceStrategy:"",
        isfines:"",
        UpdateCodeCopye:"",
        Remarks:"",
        year:"1"
      },
      operationShow:2,
      operation:1,
      crumbsData: { //面包屑
        titleList: [
          { title: '工程管理' },
          { title: '用户工程' },
          { title: '用水咨询' },
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
      showCrumbsDate:true


    }
  },
  mounted() {
    this.showCrumbs(this.codeStep)
    this.init();
    eventBus.$on('operation', (item) => {
      this.operationShow = item.num;
    });
  },
  watch: {
    codeStep(newVal,oldVal){
      this.showCrumbs(newVal)

    },
  },
  methods: {
    showCrumbs(val){
      
      if(val=='2'){
        this.showCrumbsDate = false
      }else{
        this.showCrumbsDate = true
      }

    },
    collapse(){
      if(this.approvalShow == true){
        this.approvalShow = false
        this.util.approvalShow(this.approvalShow, '.process-left', '.stepsCompar','.StepCollapse', '.leftChange')
      }else{
        this.approvalShow = true
        this.util.approvalShow(this.approvalShow, '.process-left', '.stepsCompar','.StepCollapse', '.leftChange')
      }
    },
    init() {

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
      this.uploadPic = false;
      this.isExecution = false;
      this.editContent = true;
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
      }else if(num == 2){
        // console.log(this.ruleForm1);
      }else if(num == 3){
        // console.log(this.ruleForm2);
      }else if(num == 4){
        // console.log(this.ruleForm3);
      }
    },
    takeExecution(){//步骤条-设计-施工材料-显示
      this.$set(this,'uploadPic',false)
      this.$set(this,'editContent',false)
      this.$set(this,'isExecution',true)

    },
    addExecution(){//步骤条-设计-施工材料-添加
      this.$refs.ConstructionMaterials.addExecution();
    },
    saveExecution(){
      this.$refs.ConstructionMaterials.saveExecution();
    },
    //审批流程返回按钮
    operationReturn() {
      this.isExecution = false
    },
    closeDialog(){
      this.crumbsData.titleList.splice(3,1);
      this.editContent = false;
      this.uploadPic = false;
      this.isExecution = false;
    },
    upload(){
      this.editContent = false;
      this.isExecution = false;
      this.uploadPic = true;
    },
    // 多页签的点击
    tabCurrent(val){
      if(val.index == 1){
        this.upload();
        this.editContent = false;
        this.uploadPic = true;
      }else{
        this.closeDialog();
        this.editContent =true;
        this.uploadPic =false ;
      }
    },
    chooseCtm(){
      this.$emit('chooseCtm','chooseCtm')
    },
    chooseCus(){
      // this.chooseDioag = true
      this.choosectmVisible = true;
    },
    handleCurrentChange(val) {  //显示多少页码
      // this.tableQuery.page = val
      this.init()
    },
    stepActive(val){
      this.editContent = true;
      this.uploadPic = false;
      this.operationShow = val;
      this.operation = val-1;
     
    },
    handleSizeChange(){

    },
  },
}
</script>
<style lang="scss">
.waterQueryApproval{
  height: 100%;

  .el-tabs--border-card {
    box-shadow: none !important;
    border-bottom: none;
    border-left: none;
    border-right: none;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0px 20px !important;
    height: calc(100% - 124px) !important;
  }
  .el-dialog__footer .el-button {
    font-size: 14px;
  }
  .el-tabs__content {
    .formBill-Three{
      height: 100%;
    }
  }
  .el-tabs {
    height: calc(100% - 40px);
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
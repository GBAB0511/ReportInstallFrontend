<template>
  <div class="insideHandleInfo process">
     <el-dialog title="查看附件" :visible.sync="viewAttachmentShow"    :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        :busicode="ReceiptAccessoryList"
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <div class="process-left"  >
      <el-form :model="formData" ref="form" :show-message="false" class="formBill" :inline="true" size="mini" label-width="130px">
        <el-form-item label="单据编号：" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled v-model="formData.billNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单据日期：" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled v-model="formData.billDate" placeholder=""></el-input>
        </el-form-item>
        <!-- 登记信息 -->
        <div  v-if="operationShow == 'register' || operationShow == 'Process-task11'">
          <legend  class="legendColumn">工程信息</legend>
            
            
            <el-form-item label="工程名称：" prop="inpjName" :class="{'disable-item': processForDisable!==1}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.inpjName" size="mini" clearable  v-if="processForDisable===1"></el-input>
              <span v-else>{{formData.register.inpjName}}</span>
            </el-form-item>

            <el-form-item label="工程类型：" prop="pjType" :class="{'disable-item': processForDisable!==1}">
              <el-select v-model="formData.register.pjType" clearable size="mini"  v-if="processForDisable===1">
                  <el-option v-for="item in dictionaryData.IPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.register.pjTypeName}}</span>
            </el-form-item>
            
            <el-form-item label="紧急程度：" prop="urgentFlag" :class="{'disable-item': processForDisable!==1}">
              <el-select v-model="formData.register.urgentFlag" clearable size="mini"  v-if="processForDisable===1">
                  <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{formData.register.urgentFlag}}</span>
            </el-form-item>
            
            <el-form-item label="用水地址：" prop="pjAddr" :class="{'disable-item': processForDisable!==1}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.pjAddr" size="mini" clearable  v-if="processForDisable===1"></el-input>
              <span v-else>{{formData.register.pjAddr}}</span>
            </el-form-item>
            
            <el-form-item label="联系人：" prop="linkMan" :class="{'disable-item': processForDisable!==1}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.linkMan" size="mini" clearable  v-if="processForDisable===1"></el-input>
              <span v-else>{{formData.register.linkMan}}</span>
            </el-form-item>
            
            <el-form-item label="座机号码：" prop="linkTel" :class="{'disable-item': processForDisable!==1}">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.linkTel" size="mini" clearable  v-if="processForDisable===1"></el-input>
              <span v-else>{{formData.register.linkTel}}</span>
            </el-form-item>
            
            <el-form-item label="申请原因：" class="Remarks" prop="applDesc" :class="{'disable-item': processForDisable!==1}">
              <el-input type="textarea" v-model="formData.register.applDesc"  v-if="processForDisable===1"></el-input>
              <span v-else>{{formData.register.applDesc}}</span>
            </el-form-item>
            
            <el-form-item label="派单说明：" class="Remarks" prop="acceptDesc" :class="{'disable-item': processForDisable!==1}">
              <el-input type="textarea" v-model="formData.register.acceptDesc"  v-if="processForDisable===1"></el-input>
              <span v-else>{{formData.register.acceptDesc}}</span>
            </el-form-item>
              
          <legend  class="legendColumn">上传附件 
            <i  @click="showMore('uploadFileShow','uploadIcon')"></i>
          </legend>
               <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>

        </div>

        <!-- 勘察设计 -->
        <div v-if="operationShow == 'surveyDesign'  || operationShow == 'Process-task9'">
          <el-tabs v-model="surveyActive" tab-position="bottom" type="border-card">
            <el-tab-pane label="勘察设计信息" name="survey">
              <legend  class="legendColumn">勘察设计信息</legend>
              <el-form-item  class="Remarks" style=" margin-left: 70px;">
                <el-checkbox  true-label=1 false-label=0 v-model="formData.surveyDesign.plFlag" :disabled="processForDisable!==2">需要办开挖许可证手续</el-checkbox>
                <el-checkbox  true-label=1 false-label=0 v-model="formData.surveyDesign.exceedHigh" :disabled="processForDisable!==2">超标高</el-checkbox>
              </el-form-item>
              <br>

              <el-form-item label="勘察人员：" prop="surveyName" :class="{'disable-item': processForDisable!==2}">
                <!--el-input v-model="formData.surveyDesign.surveyName" size="mini" clearable :disabled="NotDisabled"></el-input-->
                <el-select v-model="formData.surveyDesign.surveyName" clearable size="mini" placeholder="勘察人员" v-if="processForDisable===2">
                  <el-option v-for="item in surveyNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.surveyDesign.surveyNameName}}</span>
              </el-form-item>
              
              <el-form-item label="勘察日期：" prop="surveyDate" :class="{'disable-item': processForDisable!==2}">
                <el-date-picker v-model="formData.surveyDesign.surveyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===2"></el-date-picker>
                <span v-else>{{formData.surveyDesign.surveyDate}}</span>
              </el-form-item>
              
              <el-form-item label="勘察结论："  class="Remarks" prop="surveyResult" :class="{'disable-item': processForDisable!==2}">
                <el-input type="textarea" v-model="formData.surveyDesign.surveyResult" v-if="processForDisable===2"  ></el-input>
                <span v-else>{{formData.surveyDesign.surveyResult}}</span>
              </el-form-item>
              
              <el-form-item label="设计人员：" prop="designName" :class="{'disable-item': processForDisable!==2}">
                <!--el-input v-model="formData.surveyDesign.designName" size="mini" clearable :disabled="NotDisabled"></el-input-->
                <el-select v-model="formData.surveyDesign.designName" clearable size="mini" placeholder="设计人员" v-if="processForDisable===2">
                  <el-option v-for="item in designNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.surveyDesign.designNameName}}</span>
              </el-form-item>
              
              <el-form-item label="设计日期：" prop="designDate" :class="{'disable-item': processForDisable!==2}">
                <el-date-picker v-model="formData.surveyDesign.designDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===2"></el-date-picker>
                <span v-else>{{formData.surveyDesign.designDate}}</span>
              </el-form-item>
              
              <el-form-item label="设计说明： "  class="Remarks" prop="designDesc" :class="{'disable-item': processForDisable!==2}">
                <el-input type="textarea" v-model="formData.surveyDesign.designDesc"  v-if="processForDisable===2" ></el-input>
                <span v-else>{{formData.surveyDesign.designDesc}}</span>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="施工材料" name="material">
              <legend  class="legendColumn">施工材料</legend>
              <ConstructionMaterials ref="Constructions" :isId="formData.id" :disabled="processForDisable!==2"></ConstructionMaterials>
            </el-tab-pane>
          </el-tabs>
              
        </div>

        <!-- 工程预算 -->
        <div   v-if="operationShow == 'budget'  || operationShow == 'Process-task7'">
            <legend  class="legendColumn">工程预算信息</legend>
              <el-form-item label="预算合计：" prop="budgetMoney" :class="{'disable-item': processForDisable!==3}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.budget.budgetMoney" size="mini" clearable v-if="processForDisable===3"></el-input>
                <span v-else>{{formData.budget.budgetMoney}}</span>
              </el-form-item>

              <el-form-item label="编制人员：" prop="budgetName" :class="{'disable-item': processForDisable!==3}">
                <!--el-input v-model="formData.budget.budgetName" size="mini" clearable :disabled="NotDisabled"></el-input-->
                <el-select v-model="formData.budget.budgetName" clearable size="mini" placeholder="编制人员：" v-if="processForDisable===3">
                  <el-option v-for="item in budgetNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.budget.budgetNameName}}</span>
              </el-form-item>
              
              <el-form-item label="编制日期：" prop="budgetDate" :class="{'disable-item': processForDisable!==3}">
                <el-date-picker v-model="formData.budget.budgetDate" type="date" 
                value-format="yyyy-MM-dd" placeholder="选择日期 " v-if="processForDisable===3"></el-date-picker>
                <span v-else>{{formData.budget.budgetDate}}</span>
              </el-form-item>
              
              <el-form-item label="编制说明：" class="Remarks" prop="budgetPrepareNote" :class="{'disable-item': processForDisable!==3}">
                <el-input type="textarea" v-model="formData.budget.budgetPrepareNote" v-if="processForDisable===3"  ></el-input>
                <span v-else>{{formData.budget.budgetPrepareNote}}</span>
              </el-form-item>
        </div>
        <!-- 安装施工 -->
        <div   v-if="operationShow == 'install'  || operationShow == 'Process-task3'">
          <el-tabs v-model="installActive" tab-position="bottom" type="border-card">
            <el-tab-pane label="安装施工信息" name="install">
              <legend  class="legendColumn">安装施工信息</legend>
                <el-form-item label="派单日期：" prop="pdDate" :class="{'disable-item': processForDisable!==4}">
                  <el-date-picker v-model="formData.install.pdDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===4"></el-date-picker>
                  <span v-else>{{formData.install.pdDate}}</span>
                </el-form-item>

                <el-form-item label="施工班组：" prop="jobName" :class="{'disable-item': processForDisable!==4}">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.install.jobName" size="mini" clearable v-if="processForDisable===4"></el-input>
                  <span v-else>{{formData.install.jobName}}</span>
                </el-form-item>
                
                <el-form-item label="开始施工日期：" prop="jobDate" :class="{'disable-item': processForDisable!==4}">
                  <el-date-picker v-model="formData.install.jobDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===4"></el-date-picker>
                  <span v-else>{{formData.install.jobDate}}</span>
                </el-form-item>
                
                <el-form-item label="结束施工日期：" prop="overDate" :class="{'disable-item': processForDisable!==4}">
                  <el-date-picker v-model="formData.install.overDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===4"></el-date-picker>
                  <span v-else>{{formData.install.overDate}}</span>
                </el-form-item>
                
                <el-form-item label="施工说明：" class="Remarks" prop="constructionNote" :class="{'disable-item': processForDisable!==4}">
                  <el-input type="textarea" v-model="formData.install.constructionNote"  v-if="processForDisable===4" ></el-input>
                  <span v-else>{{formData.install.constructionNote}}</span>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="施工材料" name="material">
              <legend  class="legendColumn">施工材料</legend>
              <ConstructionMaterials ref="Constructioni" :isId="formData.id" v-if="processForDisable===4"></ConstructionMaterials>
            </el-tab-pane>
          </el-tabs>
              
        </div>
        
        <!-- 工程验收 -->
        <div   v-if="operationShow == 'check'  || operationShow == 'Process-task5'">
            <legend  class="legendColumn">工程验收信息</legend>
              <el-form-item label="验收人员：" prop="checkName" :class="{'disable-item': processForDisable!==5}">
                <!--el-input v-model="formData.check.checkName" size="mini" clearable :disabled="NotDisabled"></el-input-->
                <el-select v-model="formData.check.checkName" clearable size="mini" placeholder="验收人员：" v-if="processForDisable===5">
                  <el-option v-for="item in checkNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.check.checkNameName}}</span>
              </el-form-item>
              
              <el-form-item label="验收日期：" prop="checkDate" :class="{'disable-item': processForDisable!==5}">
                <el-date-picker v-model="formData.check.checkDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===5"></el-date-picker>
                <span v-else>{{formData.check.checkDate}}</span>
              </el-form-item>
              
              <el-form-item label="验收说明：" class="Remarks" prop="checkDesc" :class="{'disable-item': processForDisable!==5}">
                <el-input type="textarea" v-model="formData.check.checkDesc" v-if="processForDisable===5"  ></el-input>
                <span v-else>{{formData.check.checkDesc}}</span>
              </el-form-item>
        </div>

        <!-- 工程结算 -->
        <div   v-if="operationShow == 'setmt'  || operationShow == 'Process-task1'">
            <legend  class="legendColumn">安装施工信息</legend>
              <el-form-item label="结算合计：" prop="setmtTotal" :class="{'disable-item': processForDisable!==6}">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setmt.setmtTotal" size="mini" clearable v-if="processForDisable===6"></el-input>
                <span v-else>{{formData.setmt.setmtTotal}}</span>
              </el-form-item>

              <el-form-item label="编制人员：" prop="setmtCostSkname" :class="{'disable-item': processForDisable!==6}">
                <!--el-input v-model="formData.setmt.setmtCostSkname" size="mini" clearable :disabled="NotDisabled"></el-input-->
                <el-select v-model="formData.setmt.setmtCostSkname" clearable size="mini" placeholder="编制人员：" v-if="processForDisable===6">
                  <el-option v-for="item in budgetNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
                <span v-else>{{formData.setmt.setmtCostSknameName}}</span>
              </el-form-item>
              
              <el-form-item label="编制日期：" prop="setmtCostDate" :class="{'disable-item': processForDisable!==6}">
                <el-date-picker v-model="formData.setmt.setmtCostDate" 
                type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="processForDisable===6"></el-date-picker>
                <span v-else>{{formData.setmt.setmtCostDate}}</span>
              </el-form-item>
              
              <el-form-item label="编制说明：" class="Remarks" prop="setmtNote" :class="{'disable-item': processForDisable!==6}">
                <el-input type="textarea" v-model="formData.setmt.setmtNote"  v-if="processForDisable===6" ></el-input>
                <span v-else>{{formData.setmt.setmtNote}}</span>
              </el-form-item>
              
        </div>

        

        <legend class="legendColumn">流程处理</legend>
        <div id="workflowDiv"></div>
      </el-form>
    </div>
    <div class="StepCollapse" @click="collapse">
      <i class="el-icon-arrow-right leftChange"></i>
    </div>
    <div class="stepsCompar" v-if="approvalShow">
      
      <div class="stepsTitle">流程信息</div>
      <!-- <div class="stepsBottom"> 
        <el-button type="primary" size="mini" class="el-icon-arrow-up"></el-button>
      </div> -->
      <div class="line"></div>
      <el-steps :active="operation" direction="vertical"  finish-status="success">
        <el-step title="登记信息" @click.native="stepActive(1,'register')"></el-step>
        <el-step title="勘察设计" @click.native="stepActive(2,'surveyDesign')"></el-step>
        <el-step title="工程预算" @click.native="stepActive(3,'budget')"></el-step>
        <el-step title="安装施工" @click.native="stepActive(4,'install')"></el-step>
        <el-step title="工程验收" @click.native="stepActive(5,'check')"></el-step>
        <el-step title="工程结算" @click.native="stepActive(6,'setmt')"></el-step>
      </el-steps>
    </div>
    
          <el-dialog class="waterdialog" :close-on-click-modal="false" title="水表明细" :visible.sync="editContent">
            <el-form :model="dialogForm" ref="form" label-width="120px">
              <div class="my-input">
                <el-form-item label="用户编号：" prop="userNum">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.userNum" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="用户名称：" prop="userName">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.userName" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="用户地址：" prop="userAddress">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.userAddress" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="装表地址：" prop="meterAddress">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.meterAddress" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="街区：" prop="block">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.block" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="小区：" prop="village">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.village" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="册本号：" prop="bookNum">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.bookNum" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="联系人：" prop="Contacts">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.Contacts" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="座机号码：" prop="contactNumber">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.contactNumber" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="手机号码：" prop="phoneNumber">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.phoneNumber" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="证件类型：" prop="documentType">
                  <el-select v-model="dialogForm.documentType" clearable size="mini"  >
                    <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="证件号码：" prop="documentNum" style="width: calc(46% + 10px)">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.documentNum" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="装表日期：" prop="meterDate">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.documentNum" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="装表员：" prop="meterStaff">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.meterStaff" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="水表编号：" prop="meterNum">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.meterNum" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="水表口径：" prop="meterCaliber">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.meterCaliber" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="用水类型：" prop="waterType">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.waterType" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="供水合同：" prop="waterContract">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.waterType" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="是否加压：" prop="compression">
                  <el-select v-model="dialogForm.compression" clearable size="mini"  >
                    <el-option key="0" label="是" value="0"></el-option>
                    <el-option key="1" label="否" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="my-input">
                <el-form-item label="押金：" prop="deposit">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.deposit" size="mini" clearable></el-input>
                </el-form-item>
              </div>
              <div class="my-input gocenter1">
                <el-form-item label="备注：" prop="remarks">
                  <el-input type="textarea" v-model="dialogForm.remarks"  ></el-input>
                </el-form-item>
              </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
              <div class="sub" style="text-align:center;">
                <el-button type="primary" style="margin-right:10px;" size="mini">保存</el-button>
                <el-button @click="editContent = false" size="mini">返回</el-button>
              </div>
            </span>
          </el-dialog>
  </div>

</template>
<script>
import steps from "@/components/Steps"
import uploadFile from '@/components/uploadPic';
import procedure from "@/components/procedure"
import ConstructionMaterials from '@/components/ConstructionMaterials'
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "insideHandleInfo",
  props: ['editNeedData'],
  components: {
    steps,
    uploadFile,
    procedure,
    ConstructionMaterials,
    AttachmentViewInfo
  },
  data() {
    return {
      NotDisabled:false,
      dictionaryData:[],//数据字典存值
      operationShow: "register",
      operation:1,
      surveyActive: 'survey',
      installActive: 'install',
      uploadFileShow:true,
      formData: {        
        "id": "",
        "billNo": "",
        "billDate": "",
        "processInstanceId": "",
        "processState": "",
        "approveFlag":'',
        "register": {//登记信息
            "id": "",
            "billNo": "",
            "billDate": "",
            "pjType": "",
            "urgentFlag": "",
            "pjAddr": "",
            "linkMan": "",
            "linkTel": "",
            "applDesc": "",
            "acceptDesc": "",
            "inpjName": ""
        },
        "surveyDesign": {//勘察设计
            "plFlag": "",
            "exceedHigh": "",
            "surveyName": "",
            "surveyDate": "",
            "surveyResult": "",
            "designName": "",
            "designDate": "",
            "designDesc": "",
        },
        "budget": {//预算
            "budgetMoney": "",
            "budgetName": "",
            "budgetDate": "",
            "budgetPrepareNote": ""
        },
        "install": {//施工
            "pdDate": "",
            "jobName": "",
            "jobDate": "",
            "overDate": "",
            "constructionNote": ""
        },
        "check": {//验收
            "checkName": "",
            "checkDate": "",
            "checkDesc": ""
        },
        "setmt": {//结算
            "setmtTotal": "",
            "setmtCostSkname": "",
            "setmtCostDate": "",
            "setmtNote": ""
        }

      },
      receiptType:'PJ_INTERNAL',
      dialogForm: {},
      editContent: false,
      //右侧流程滚动条显示隐藏
      approvalShow: true,
      submitFormData:{},
      surveyNameList:[],
      designNameList:[],
      budgetNameList:[],
      checkNameList:[],
      processForDisable:"",
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
      attachmentData: [],
    }
  },
  mounted() {
    
    this.init();
    eventBus.$emit('receiptId', this.editNeedData.id)
    //审批界面接口
    //this.getHtmlData();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.engineer-center .engineer-center-right', ['.engineer-center .table-top'])
    })
  },
  watch: {
    operationShow(newVal,oldVal){
      if (newVal == 'END') {
          this.operation = 0;
          this.NotDisabled = true;
          this.operationShow = 'register'
      }else if(newVal == 'CANCEL'){
          this.operation = 0;
          this.NotDisabled = true;
          this.operationShow = 'register'
      }else{
        if (newVal == 'surveyDesign' || newVal == 'Process-task9') {//勘察
          this.operation = 1;
          this.formData.surveyDesign.plFlag = this.formData.surveyDesign.plFlag==1?true:false
          this.formData.surveyDesign.exceedHigh = this.formData.surveyDesign.exceedHigh==1?true:false
        }else if( newVal == 'budget' || newVal == 'Process-task7'){//预算
          this.operation = 2;
        }else if( newVal == 'install' || newVal == 'Process-task3'){//施工安装
          this.operation = 3;
        }else if( newVal == 'check' || newVal == 'Process-task5'){//工程验收
          this.operation = 4;
        }else if( newVal == 'setmt' || newVal == 'Process-task1'){//工程结算
          this.operation = 5;
        }else if( newVal == 'register' || newVal == 'Process-task11'){//登记
          this.operation = 0;
          this.getDictionary();
        }

        //在相同业务节点下
        if (this.formData.processState == newVal) {
          if (this.formData.approveFlag == 1) {
            //审批节点
            this.NotDisabled = true//不可修改
          }else{
            //非审批节点
            this.NotDisabled = false//可修改
          }
          // 不同的业务节点
        }else{
          if (this.formData.approveFlag == 1) {
            //审批节点
            // console.log('审批节点不可修改');
            this.NotDisabled = true//不可修改
          }else{
            //非审批节点
            if (this.formData.processState =='register'||this.formData.processState =='surveyDesign') {
              //登记节点 登记、勘察设计时 可修改
              this.NotDisabled = false//可修改
            }else{
              //登记节点 非登记、勘察设计节点 不可修改
              this.NotDisabled = true//不可修改
            }
          }
        }
      }
    },
    

  },
  methods: {
    init(){
      let params = {
        busicode: "PjInternalQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res
          this.getSurveyStaffList();
          this.getSetmtStaffList();
          this.getBudgetStaffList();
          this.getCheckStaffList();
          this.getHtmlData();
          this.processForDisable=this.processStepDisable();
          this.operationShow = res.processState
          this.$emit('detail', res)
        });
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
    // 勘察人员数据获取
    getSurveyStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "7" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.surveyNameList = [...res];
        });
    },
    // 设计人员数据获取
    getSetmtStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "9" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.designNameList = [...res];
        });
    },// 结算人员数据获取
    getBudgetStaffList() {
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
          _this.budgetNameList = [...res];
        });
    },// 验收人员数据获取
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
          _this.checkNameList = [...res];
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      // console.log(_this.formData);

      _this.common.getProcessShowView(
        "PJ_INTERNAL",
        "审批流配置:" + _this.formData.processName + "(" + _this.formData.billNo + ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
          if(_this.formData.processState=='surveyDesign'){
            _this.$refs.Constructions.save();
          }else if(_this.formData.processState=='install'){
            _this.$refs.Constructioni.save();
          }
        },
        this.formData.approveFlag, // 不等于1时，先保存后提交
        'PjInternalSave',//保存方法的接口名称
        );
    },
    submit(type) {
      let params = {
        busicode: "PjInternalSave",
        data: this.getFormbData()
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success"
        });
        this.formData.id = res.id;
        this.$parent.closeDialog();
      });
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "IPT,EGD"
        //结算方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    collapse(){
      if(this.approvalShow == true){
        this.approvalShow = false
        this.util.approvalShow(this.approvalShow, '.insideEnging .process-left', '.insideEnging .stepsCompar','.insideEnging .StepCollapse', '.insideEnging .leftChange')
      }else{
        
        this.approvalShow = true
        this.util.approvalShow(this.approvalShow, '.insideEnging .process-left', '.insideEnging .stepsCompar','.insideEnging .StepCollapse', '.insideEnging .leftChange')
      }
    },
    getFormbData(){//步骤条-工程登记-暂存/暂存
      let data = []
      this.formData.surveyDesign.plFlag = this.formData.surveyDesign.plFlag==true?1:(this.formData.surveyDesign.plFlag==1?1:0)
      this.formData.surveyDesign.exceedHigh = this.formData.surveyDesign.exceedHigh==true?1:(this.formData.surveyDesign.exceedHigh==1?1:0)
      //登记
      if (this.formData.processState == 'register') {
        data = {     
            "id": this.formData.id,
            "processState":this.formData.processState,
            register:{
              "pjType": this.formData.register.pjType,
              "urgentFlag": this.formData.register.urgentFlag,
              "pjAddr": this.formData.register.pjAddr,
              "linkMan": this.formData.register.linkMan,
              "linkTel": this.formData.register.linkTel,
              "applDesc": this.formData.register.applDesc,
              "acceptDesc": this.formData.register.acceptDesc,
              "inpjName": this.formData.register.inpjName,
            } 
        }
      //预算
      }else if(this.formData.processState == 'surveyDesign'){
        data = {     
            "id": this.formData.id,
            "processState":this.formData.processState,
            surveyDesign:{
              "plFlag": this.formData.surveyDesign.plFlag,
              "exceedHigh": this.formData.surveyDesign.exceedHigh,
              "surveyName": this.formData.surveyDesign.surveyName,
              "surveyDate": this.formData.surveyDesign.surveyDate,
              "surveyResult": this.formData.surveyDesign.surveyResult,
              "designName": this.formData.surveyDesign.designName,
              "designDesc": this.formData.surveyDesign.designDesc,
              "designDate": this.formData.surveyDesign.designDate,
            }
        }
      }
      //预算
      else if (this.formData.processState == 'budget') {
        data = {
            id:  this.formData.id,
            processState:  this.formData.processState,
            budget:{
              budgetMoney:  this.formData.budget.budgetMoney,//预算合计
              budgetName: this.formData.budget.budgetName,//预算编制人员
              budgetDate: this.formData.budget.budgetDate,//预算编制日期
              budgetPrepareNote: this.formData.budget.budgetPrepareNote,//预算编制说明
            }
        }
      //施工安装
      }else if (this.formData.processState == 'install') {
        data = {
            id:  this.formData.id,
            processState:  this.formData.processState,
            install:{
              pdDate:  this.formData.install.pdDate,//派单日期       
              jobName: this.formData.install.jobName,//施工班组
              jobDate: this.formData.install.jobDate,//开始施工日期
              overDate: this.formData.install.overDate,//结束施工日期
              constructionNote: this.formData.install.constructionNote,//施工说明
            }
        }
      //工程验收
      }else if(this.formData.processState == 'check'){
        data = {
            id:  this.formData.id,
            processState:  this.formData.processState,
            check:{
              checkName: this.formData.check.checkName,//表前材料费结算
              checkDate: this.formData.check.checkDate,//表后材料费结算
              checkDesc: this.formData.check.checkDesc,//其他结算
            }
        }
      //工程结算
      }else if(this.formData.processState == 'setmt'){
        data = {
            id:  this.formData.id,
            processState:  this.formData.processState,
            setmt:{
              setmtTotal: this.formData.setmt.setmtTotal,//表前人工费结算
              setmtCostSkname: this.formData.setmt.setmtCostSkname,//表后人工费结算
              setmtCostDate: this.formData.setmt.setmtCostDate,//表前材料费结算
              setmtNote: this.formData.setmt.setmtNote,//表后材料费结算
            }
        }
      }
      return data
    },
    operationReturn() {
      eventBus.$emit('insideOperationReturn', false);
    },
    //判断当前模块是否可修改
    processStepDisable(){
      let process =1;
      if(this.formData.processState==='register' || this.formData.processState===''){
        process=1
      }else if(this.formData.processState==='surveyDesign'){
        process=2
      }else if(this.formData.processState==='budget'){
        process=3
      }else if(this.formData.processState==='install'){
        process=4
      }else if(this.formData.processState==='check'){
        process=5
      }else if(this.formData.processState==='setmt'){
        process=6
      }else{
        process=7
      }
      return process
    },
    //判断右侧流程节点是否可以点击
    processStep(){
      let process =1;
      if(this.formData.processState==='register' || this.formData.processState==='Process-task11' || this.formData.processState===''){
        process=1
      }else if(this.formData.processState==='surveyDesign' || this.formData.processState==='Process-task9'){
        process=2
      }else if(this.formData.processState==='budget' || this.formData.processState==='Process-task7'){
        process=3
      }else if(this.formData.processState==='install' || this.formData.processState==='Process-task3'){
        process=4
      }else if(this.formData.processState==='check' || this.formData.processState==='Process-task5'){
        process=5
      }else if(this.formData.processState==='setmt' || this.formData.processState==='Process-task1'){
        process=6
      }else if(this.formData.processState==='END'){
        process=7
      }
      return process
    },
    stepActive(val,step){
      let processstep= this.processStep();
      if(processstep>=val){
        this.$emit('fromHandleChild', step)
        this.operationShow = step;
        this.operation = val-1;
      }
      
    
    },
    //上传附件
    uploadAttachment(file, fileList) {
      let _this = this;
      console.log(file)
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
          receiptType: "PJ_INTERNAL",
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
        });
    },
     // 查看附件按钮
    viewAttachment(type) {
      this.receiptAccessory = {
        receiptType: "PJ_INTERNAL",
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
  },
}
</script>
<style lang="scss" scoped>
.insideHandleInfo {
  height: 100%;
}
</style>
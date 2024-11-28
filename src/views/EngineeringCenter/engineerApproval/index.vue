<template>
  <div class="engineerApproval">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button v-if="(!showIndex && showButtons.save)&&isStatus2" size="mini" type="primary" @click="houseRenovation" :disabled="isTermination==true||myTerminationFlag!=0">户号查询</el-button>
        <el-button v-if="(!showIndex) && showButtons.SGPD" size="mini" type="primary" :disabled='sonCurrentStep!=sonOperation+1||isTermination==true||myTerminationFlag!=0'  @click="ShowSGPDDialog">施工派单</el-button>
        <!-- 立户施工合同打印 -->
        <el-button v-if="(!showIndex) && showButtons.RESGHT" size="mini" type="primary" @click="printSGHT" :disabled="isTermination==true||myTerminationFlag!=0">供水合同</el-button>
        <!-- 其他阶段施工合同打印 -->
        <el-button v-if="(!showIndex) && showButtons.CJSGHT" size="mini" type="primary"   @click="createPaperContract('sgBtn')" :disabled="isTermination==true||myTerminationFlag!=0">创建施工合同</el-button>
        <el-button v-if="(!showIndex) && showButtons.CJGSHT" size="mini" type="primary"   @click="createPaperContract('gsBtn')" :disabled="isTermination==true||myTerminationFlag!=0 || waterSelectLength==0">创建供水合同</el-button>
        <el-button v-if="(!showIndex) && showButtons.DYSGHT" size="mini" type="primary"   @click="printSGModel" :disabled="isTermination==true||myTerminationFlag!=0">打印施工模板</el-button>
        <el-button v-if="(!showIndex) && showButtons.DYGSHT" size="mini" type="primary"   @click="printSGHT" :disabled="isTermination==true||myTerminationFlag!=0">打印供水模板</el-button>
        <el-button v-if="(!showIndex) && showButtons.HTGL" size="mini" type="primary"   @click="getContractManagement" :disabled="isTermination==true||myTerminationFlag!=0">合同管理</el-button>
        <el-button v-if="(!showIndex) && showButtons.GZLC && GZLCConfig == 1" size="mini" type="primary"   @click="printGZLC" :disabled="isTermination==true||myTerminationFlag!=0">打印工作流程表</el-button>
        <el-button v-if="(!showIndex) && showButtons.YWSL && YWSLConfig == 1" size="mini" type="primary"   @click="printYWSL" :disabled="isTermination==true||myTerminationFlag!=0">打印业务受理单</el-button>
        <el-button v-if="(!showIndex) && showButtons.SGYS && SGYSConfig == 1" size="mini" type="primary"   @click="printSGYS" :disabled="isTermination==true||myTerminationFlag!=0">打印施工验收单</el-button>
        <el-button v-if="(!showIndex) && showButtons.DJSQ" size="mini" type="primary"   @click="printDJSQ" :disabled="isTermination==true||myTerminationFlag!=0">打印登记申请表</el-button>
        <el-button v-if="(!showIndex) && showButtons.CSCX" size="mini" type="primary"   @click="overTimeSearch" :disabled="isTermination==true||myTerminationFlag!=0">超时查询</el-button>
       <el-button v-if="(!showIndex) && showButtons.SGHT" size="mini" type="primary"   @click="printSGHT" :disabled="isTermination==true||myTerminationFlag!=0">供水合同</el-button>
       <el-button v-if="(!showIndex) && showButtons.YSBG" size="mini" type="primary" @click="acceptanceReport" :disabled="isTermination==true||myTerminationFlag!=0">验收报告</el-button>
       <el-button v-if="(!showIndex) && showButtons.YSLS" size="mini" type="primary" @click="acceptanceHistory" :disabled="isTermination==true||myTerminationFlag!=0">验收历史</el-button>
        <el-button v-if="(!showIndex) && showButtons.BZJS" size="mini" type="primary" v-show="settlementFlag==0&&constructionUnit!='用户自建'"  @click="$refs.edit.isPjSetmtShow = true" :disabled="isTermination==true||myTerminationFlag!=0">编制结算</el-button>
        <el-button v-if="(!showIndex) && showButtons.GCSK" size="mini" type="primary"  @click="pjCollectShow()" :disabled="isTermination==true||myTerminationFlag!=0">新增工程款</el-button>
        <el-button v-if="(!showIndex && showButtons.save)&&isStatus2" size="mini" type="primary"  @click="detailsArrears()" :disabled="isTermination==true||myTerminationFlag!=0">欠费明细</el-button>
        <el-button v-if="!showIndex && showButtons.save" size="mini" type="primary" @click="save" :disabled="isTermination==true||myTerminationFlag!=0">暂存</el-button>
        <el-button v-if="!showIndex && showButtons.BCJS" size="mini" type="primary" @click="save" :disabled="isTermination==true||myTerminationFlag!=0">保存</el-button>
        <el-button v-if="!showIndex && showButtons.BCSK" size="mini" type="primary" @click="save" :disabled="isTermination==true||myTerminationFlag!=0">保存</el-button>
        <el-button v-if="!showIndex && showButtons.print" size="mini" type="primary"  :disabled="isTermination==true||myTerminationFlag!=0">打印</el-button>
        <el-upload
                v-if="(!showIndex) && showButtons.AUpload"
                :show-file-list="false"
                class="upload-file"
                multiple action="/"
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right:10px;"
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button v-if="(!showIndex) && showButtons.AUpload" type="primary"  size="mini" @click="viewAllAttachment()" >查看附件({{AttachmentQty}})</el-button>
        <el-upload
          v-if="(!showIndex) && showButtons.GCSK&&sonOperation==12"
          class="upload-file"
          multiple action="/"
          :http-request="uploadAttachment"
          style="display:inline-block;margin-right: 10px;"
          :show-file-list="false"
        >
          <el-button size="mini" type="primary" :disabled="isTermination==true||myTerminationFlag!=0">上传附件</el-button>
        </el-upload>
        <el-button v-if="!showIndex && showButtons.printSJ" size="mini" type="primary" @click="todo" :disabled="isTermination==true||myTerminationFlag!=0">打印收据</el-button>
        <el-button v-if="!showIndex && showButtons.printFP" size="mini" type="primary" @click="todo" :disabled="isTermination==true">打印发票</el-button>
        <el-button v-if="!showIndex && showButtons.printHT" size="mini" type="primary" @click="printContract" :disabled="isTermination==true||myTerminationFlag!=0">打印合同</el-button>
        <!-- <el-button v-if="!showIndex && showButtons.material" size="mini" type="primary" @click="todo">施工材料</el-button> -->
        <el-button v-if="!showIndex && showButtons.printPGD" size="mini" type="primary" @click="todo1" :disabled="isTermination==true||myTerminationFlag!=0">下载派工单</el-button>
        <el-button v-if="!showIndex && showButtons.YESJ" size="mini" type="primary" @click="todo" :disabled="isTermination==true||myTerminationFlag!=0">余额收据</el-button>
        <el-button v-if="!showIndex && showButtons.YSYS" size="mini" type="primary" @click="todo" :disabled="isTermination==true||myTerminationFlag!=0">遗失预收</el-button>
        <el-button v-if="!showIndex && showButtons.HTQD" size="mini" type="primary" @click="contractShow()">合同清单</el-button>
        <!-- <el-button v-if="showEdit && !!editData.id " size="mini" type="primary" @click="viewAttachment(true)">查看附件({{attachmentData.length}})</el-button> -->
        <el-button v-if="!showIndex" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="pageIndex" v-if="showIndex">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form inline size="mini" label-position="right"  label-width="80px" class="multiple-floor">
          <el-form-item label="营业区域：" prop="businessAreaList" class="width-200">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessAreaList" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="查询项：" class="width-200">
            <el-select ref="select1" v-model="tableQuery.fuzzyItems" placeholder="" multiple clearable>
              <span slot="prefix">{{fuzzyItems}}</span>
              <el-option v-for="item in dictionaryData.PQI" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：" class="width-200" >
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="" clearable></el-input>
          </el-form-item>

          <!-- <el-form-item style="margin-left:-10px" label="当前处理人：" label-width='90px' class="width-80">
            <el-input v-model="tableQuery.loginUserName" placeholder="" clearable></el-input>
          </el-form-item> -->
          <el-form-item style="margin-left:-10px" label-width='90px' class="width-80">
            <el-checkbox v-model="checkedUser">仅查询当前账户</el-checkbox>
          </el-form-item>
          <el-button class="searchBtn el-button--mini"  @click="search" icon="el-icon-search"></el-button>
          <el-form-item class="button-group">
            <el-button type="primary" @click="add">登记</el-button>
            <!-- <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button> -->
            <el-button type="primary" @click="exportExcel">导出</el-button>
          </el-form-item>

          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="工程类型：" class="width-200">
              <el-select ref="select2" v-model="tableQuery.pjType" placeholder="" multiple clearable>
                <span slot="prefix">{{pjType}}</span>
                <el-option v-for="item in dictionaryData.PPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="信息来源：" class="width-200">
              <el-select ref="select3" v-model="tableQuery.sourceFlag" placeholder="" clearable>
                <el-option v-for="item in dictionaryData.PIS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流程节点：" class="width-200">
              <el-select ref="select4" v-model="tableQuery.schedule" placeholder="" multiple clearable>
                <span slot="prefix">{{schedule}}</span>
                <!-- <el-option v-for="(item,index) in scheduleOptions" :key="index" :label="item.nodeName" :value="item.nodeCode"></el-option> -->
                <el-option v-for="item in dictionaryData.PCN" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流程状态：" class="width-200">
              <el-select ref="select5" v-model="tableQuery.processState" placeholder="" clearable>
                <el-option v-for="item in dictionaryData.PCS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报装日期：" class="width-250">
              <el-date-picker type="daterange" value-format='yyyy-MM-dd' v-model="date" start-placeholder="" end-placeholder=""></el-date-picker>
            </el-form-item>
          <el-form-item label="是否延期：" class="width-200">
              <el-select v-model="tableQuery.delayState" clearable placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="已缴清：" class="width-200">
                    <el-select v-model="tableQuery.payOffFlag" clearable placeholder="">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
          <el-form-item label="已签合同：" class="width-200">
            <el-select v-model="tableQuery.signContractFlag" clearable placeholder="">
              <el-option label="施工合同已签" :value="1"></el-option>
              <el-option label="施工合同未签" :value="2"></el-option>
              <el-option label="供水合同已签" :value="3"></el-option>
              <el-option label="供水合同未签" :value="4"></el-option>
              <el-option label="部分已签" :value="5"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="是否上传：" v-if="GJUpload == 1" class="width-200">
              <el-select v-model="tableQuery.isUploadWorkBuild" clearable placeholder="">
                <el-option label="全部" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <div>
              <el-form-item label="工程超期：" class="width-100">
                <el-select v-model="tableQuery.judgment1" placeholder="请选择">
                  <el-option
                    v-for="item in moreOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\D]/g,'')" clearable v-model="tableQuery.outTimeStart" placeholder="超期时间" class="shouldWaterInput"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="tableQuery.judgment2" placeholder="请选择">
                  <el-option
                    v-for="item in lessOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\D]/g,'')" clearable v-model="tableQuery.outTimeEnd" placeholder="超期时间" @keydown.enter.native="init" class="shouldWaterInput"></el-input>
              </el-form-item>
              <el-form-item label="已用时间：" class="width-100">
                <el-select v-model="tableQuery.workDaysStartCondition" placeholder="请选择">
                  <el-option
                    v-for="item in moreOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\D]/g,'')" clearable v-model="tableQuery.workDaysStart" placeholder="已用时间" class="shouldWaterInput"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="tableQuery.workDaysEndCondition" placeholder="请选择">
                  <el-option
                    v-for="item in lessOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="width-100">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\D]/g,'')" clearable v-model="tableQuery.workDaysEnd" placeholder="已用时间" @keydown.enter.native="init" class="shouldWaterInput"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table tableStyle" :style="{height: maxHeight + 'px'}">
        <el-table stripe border :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column fixed="left" label="操作" width="170">
            <template slot-scope="scope">
              <el-button style="float: left;" type="text" size="mini" @click="detail(scope.row)">详情</el-button>
              <el-button style="float: left;" type="text" size="mini" v-if="(scope.row.processState!=='草稿' && scope.row.processState!=='已办结' && scope.row.processState!=='已终止' && scope.row.delayFlag == 0)&& scope.row.pendingState == 0" @click="delay(scope.row)">延期</el-button>
              <el-button style="float: left;" type="text" size="mini" v-if="(scope.row.processState!=='草稿' && scope.row.processState!=='已办结' && scope.row.processState!=='已终止' && scope.row.terminationFlag == 0) && scope.row.pendingState == 0" :terminationFlag='scope.row.terminationFlag' @click="dialogFormVisible = true,termination(scope.row)">终止</el-button>
              <!-- 如果pendingState返回0，三个按钮都显示，如果是其他则都不显示 -->
              <el-button style="float: left;" type="text" size="mini" v-if="scope.row.processState!=='草稿' && scope.row.processState!=='已办结' && scope.row.processState!=='已终止' && scope.row.pendingState == 0" @click="pending(scope.row)">挂起</el-button>

              <el-button style="float: left;" type="text" size="mini" v-if="scope.row.processState!=='草稿' && scope.row.processState!=='已办结' && scope.row.processState!=='已终止' && scope.row.pendingState == 2" @click="rePending(scope.row)">恢复</el-button>
              <el-button type="text" size="mini" style="float: left;color: red;" v-if="scope.row.processState==='草稿'" @click="deleteRow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="processState" min-width="80" label="流程状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sourceFlag" min-width="80" label="信息来源" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billDate" min-width="120" label="报装日期" value-format='yyyy-MM-dd' show-overflow-tooltip></el-table-column>
          <el-table-column prop="billNo" min-width="120" label="工程编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjName" min-width="120" label="工程名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjType" min-width="80" label="工程类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="constructionUnit" min-width="120" label="工程主体" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processName" width="130" label="流程节点">
            <template slot-scope="scope">
              <div>{{ scope.row.processName }}</div>
              <el-tooltip v-if="(scope.row.processName=='资料审核'||scope.row.processName=='信息登记')&&scope.row.overruleFlag==1" class="item" effect="dark" content="驳回" placement="top">
                <div><span class="tag red">驳</span></div>
              </el-tooltip>
              <el-tooltip v-if="(scope.row.processName=='资料审核'||scope.row.processName=='信息登记')&&scope.row.overruleFlag==2" class="item" effect="dark" content="二次提交" placement="top">
                <div><span class="tag green">二</span></div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="processHandleMan" min-width="120" label="当前处理人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAddr" min-width="180" label="报装地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="120" label="用户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="certNo" min-width="150" label="用户证件" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="businessArea" min-width="120" label="营业区域" show-overflow-tooltip></el-table-column>
          <el-table-column prop="agentLinkTel" min-width="120" label="经办人电话" show-overflow-tooltip></el-table-column>
          <el-table-column prop="agentMan" min-width="120" label="经办人名称" show-overflow-tooltip></el-table-column>
          
          <el-table-column prop="createName" min-width="80" label="申报人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" min-width="160" label="申报时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="usedTime" min-width="120" label="工程已用时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="color: #3c5ace;cursor: pointer;" @click="handleDetail(scope.row)">{{ scope.row.usedTime }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="planSum" min-width="120" label="工程计划时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planTime" min-width="180" label="工程计划完成时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="projectTimeOut" min-width="120" label="工程超期(h)" show-overflow-tooltip>
             <template slot-scope="scope">
              <div :style="{color:(scope.row.projectTimeOut == '未超期' ? '' : 'red')}">{{ scope.row.projectTimeOut == '未超期' ? "否" : scope.row.projectTimeOut}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="currentNodetimeOutFlag" min-width="120" label="节点超期(h)" show-overflow-tooltip>
            <template slot-scope="scope">
              <div :style="{color:(scope.row.currentNodetimeOutFlag == '未超期'? '' : 'red')}">{{ scope.row.currentNodetimeOutFlag == '未超期' ? "否": scope.row.currentNodetimeOutFlag}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="delayStateName" min-width="120" label="是否延期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="meterNum" min-width="80" label="装表个数" show-overflow-tooltip align="right"></el-table-column>
          <el-table-column prop="timeOutFlagName" min-width="80" label="是否超期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="payOffFlagName" min-width="80" label="已缴清" show-overflow-tooltip></el-table-column>
          <el-table-column prop="contractNo" min-width="120" label="施工合同编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sgContractFlag" min-width="80" label="施工合同" show-overflow-tooltip></el-table-column>
          <el-table-column prop="gsContractFlag" min-width="80" label="供水合同" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <!-- 添加修改详情 -->
    <engineer-approval-edit :viewAttachmentShow1="viewAttachmentShow1" @getReceiptAccessoryList="getReceiptAccessoryList" @selectTableData="selectTableData" ref="edit" v-if="showEdit" :id="editData.id" @isTermination="getIsTermination" @constructionUnit='getConstructionUnit' @settlementFlag='getSettlementFlag' @currentStep='getCurrentStep' @changeButtons="changeButtons" @success="back" @getMeterList="getMeterList"/>

    <!-- 延期 -->
    <el-dialog class="delay-dialog" :visible.sync="showDelay" @closed="handleClose" :before-close="handleDialogClose" >
      <engineer-delay-edit ref="delay" v-if="showDelay"  :delayData="delayData" @func="getDialog"/>
    </el-dialog>
    <!-- 挂起 -->
    <el-dialog class="pending-dialog" :visible.sync="showPending" @closed="handleClose" :before-close="handleDialogClose" >
      <EngineerPengdingEdit ref="pending" v-if="showPending"  :pendingData="pendingData" @func="getDialog"></EngineerPengdingEdit>
    </el-dialog>

    <!-- 终止 -->
    <el-dialog :visible.sync="dialogFormVisible" @closed="handleClose" :before-close="handleDialogClose" >
      <engineer-termination-edit ref="termination" v-if="showTermination" :terminationData="terminationData" @func="getDialog"/>
    </el-dialog>
      <!-- 工程收款 -->
    <el-dialog title="工程收款" :visible.sync="isPjCollectShow" :close-on-click-modal="false"  @close="closePjClDialog"   width="600px">
        <projectPayment ref="projectPayment" :dict="{BPT:dictionaryData.BPT}" @success="closePjClDialog"></projectPayment>
         <div slot="footer" class="dialog-footer" ref="ruleForm">
         <el-button type="primary" size="mini" @click="$refs.projectPayment.pjClSave($refs.edit.getFormData())">确定新增</el-button>
        <el-button type="info" size="mini" plain @click="closePjClDialog">关 闭</el-button>
         </div>
    </el-dialog>

          <!-- 弹出表单明细 -->
    <el-dialog
      class="common-dialog"
      title="欠费明细"
      :close-on-click-modal="false"
      :visible.sync="DetailsArrearsShow"
      @close="daCloseDialog(0)" >
      <DetailsArrears ref="detailsArrears" :formData="detailsArrearsFormData"></DetailsArrears>
    </el-dialog>
    <!-- 打印合同 -->
    <el-dialog title="打印合同" :visible.sync="ContractTemplateVisible" :close-on-click-modal="false" class="button-dialog" @close="closeTemplateDialog" v-if="ContractTemplateVisible">
      <div style="width:500px;height:200px;background:red">

        <el-button size="mini" type="primary">重新上传</el-button>
        <el-button size="mini" type="primary">高拍仪上传</el-button>
        <el-button size="mini" type="primary">下载合同模板</el-button>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitTemplate()">保存</el-button>
        <el-button type="info" size="mini" plain @click="closeTemplateDialog()">取 消</el-button>
      </div>

    </el-dialog>

    <!-- 户号查询 -->
    <el-dialog title="户号查询" :visible.sync="listAddShow" class="button-dialog" :close-on-click-modal="false">
      <div class="add-user-container" style="height: 100%;">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>

            <el-form-item label="模糊查询：" class="width-200">
              <el-col :span="24">
                <el-tooltip class="item" effect="dark" content="请输入客户地址/客户名称" placement="top">
                  <el-input v-model="huHao" @keyup.enter.native="searchHu" placeholder="请输入客户地址/客户名称"></el-input>
                </el-tooltip>
              </el-col>

            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="searchHu" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="height:450px">
          <el-table tripe border @row-click="getCurrentHu" :data="tableDataHu" :max-height="450">

            <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
            <el-table-column type="selection" width="50">
              <template slot-scope="scope">
                <el-radio :label='scope.row.userNo' v-model="radio">{{''}}</el-radio>
              </template>
            </el-table-column>

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethodHu">
            </el-table-column>

            <el-table-column prop="userNo" min-width="100" label="用户编号">
            </el-table-column>

            <el-table-column prop="businessAreaName" min-width="100" label="营业区域">
            </el-table-column>

            <el-table-column prop="ctmName" min-width="100" label="客户名称">
            </el-table-column>

            <el-table-column prop="ctmAddr" min-width="100" label="客户地址">
            </el-table-column>
          </el-table>

        </div>

         <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleDialogSizeChange" @current-change="handleDialogCurrentChange" :current-page="1" :page-sizes="[18, 100, 500, 1000]" :page-size="18" layout="total, sizes, prev, pager, next, jumper" :total="tableDatahuTotal">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="UpdateHuHao()">确 定</el-button>
        <el-button size="mini" @click="listAddShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="GSHTShow" style="width:50%;margin-left:22%" title="打印供水合同">
      <el-form>
        <el-form-item label="供水合同类型">
          <el-select v-model="PROJECT_WATER">
            <el-option v-for="item in PROJECT_WATER_SUPPLY" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="printGSHT()">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeGSHTShow">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 合同管理 -->
    <el-dialog :title="ContractShowVisibleName" :visible.sync="ContractShowVisible" :close-on-click-modal="false" class="button-dialog" @close="ContractShowVisible = false" v-if="ContractShowVisible">
      <OfferWaterContract :OfferWaterContractParams="OfferWaterContractParams"></OfferWaterContract>
    </el-dialog>
    <!-- 合同管理（在合同管理节点的内容） -->
    <el-dialog :title="ContractManageShowVisibleName" :visible.sync="ContractManageShowVisible" :close-on-click-modal="false" class="button-dialog" @close="ContractManageShowVisible = false" v-if="ContractManageShowVisible">
      <OfferWaterContractManagement :OfferWaterContractParams="OfferWaterContractParams" :showContractManagementButton="showContractManagementButton"></OfferWaterContractManagement>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="daCloseDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 创建合同 -->
    <el-dialog :title="PaperShowVisibleName" :visible.sync="PaperContractShowVisible" :close-on-click-modal="false" class="button-dialog" @close="PaperContractShowVisible = false" v-if="PaperContractShowVisible">
      <paperContract ref="paperContract" :OfferWaterContractParams="OfferWaterContractParams"></paperContract>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="confirmSigningZZHT">确定签约</el-button>
        <el-button type="info" size="mini" plain @click="daCloseDialog">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="节点耗时" :visible.sync="showDetail" class="button-dialog" @close="nodeCloseDialog">
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="detailData.list">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="detailIndexMethod">
          </el-table-column>
          <el-table-column prop="taskName" min-width="120" label="节点名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="operation" min-width="120" label="操作者" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="operator" min-width="120" label="操作" align="right" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="comments" min-width="120" label="处理意见" align="right" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="complateTime" min-width="150" label="办结时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="planTime" min-width="120" label="节点计划工时" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="timeConsum" min-width="80" label="耗时" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="timeOutFlag" min-width="80" label="是否超时" show-overflow-tooltip>
            <template slot-scope="scope">
              <div :style="{color:(scope.row.timeOutFlag == 0? '' : 'red')}">{{ scope.row.timeOutFlag == 0 ? "否" : "是" }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="detailHandleSizeChange" @current-change="detailHandleCurrentChange" :current-page="dialogTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="dialogTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="nodeCloseDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//import eventBus from '../../../assets/js/eventBus.js'
import EngineerDelayEdit from '../engineerDelay/engineerDelayEdit.vue'; //延期
import EngineerPengdingEdit from '../engineerPending/engineerPendingEdit.vue'; //挂起
import EngineerTerminationEdit from '../engineerTermination/engineerTerminationEdit.vue';
import engineerApprovalEdit from './engineerApprovalEdit.vue';// 添加、修改、详情
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
import DetailsArrears from "@/components/DetailsArrears/index"; //欠费明细
import projectPayment from "./stepsForm/projectPayment"; //欠费明细
import OfferWaterContract from "@/components/IntegratedBusiness/UserInformation/OfferWaterContract"; //合同管理
import OfferWaterContractManagement from "@/components/IntegratedBusiness/UserInformation/OfferWaterContractManagement"; //合同管理节点中的合同管理内容
import paperContract from "@/components/IntegratedBusiness/UserInformation/paperContract"; //纸质合同
export default {
  components: {engineerApprovalEdit, EngineerDelayEdit, EngineerTerminationEdit, AttachmentViewInfo ,DetailsArrears,projectPayment,OfferWaterContract, EngineerPengdingEdit, OfferWaterContractManagement, paperContract},
  data() {
    return {
      showContractManagementButton:true,
      viewAttachmentShow1:false,
      AttachmentQty:0,
      checkedUser:true,
      waterSelectLength:0,
      PROJECT_WATER_SUPPLY:'',
      myTerminationFlag:0,
      isTermination:'',
      PROJECT_WATER:'',
      PROJECT_WATER_table:1,
      radioName:'',
      radio:'',
      GSHTShow:false,
      tableDataHu:[],
      tableDatahuTotal:0,
      tableQueryHu:{
        page:1,
        pageCount:18
      },
      huHao:'',
      listAddShow:false,
      constructionUnit:'',
      settlementFlag:'',
      sonCurrentStep:0,
      sonOperation:0,
      dialogFormVisible: false,
      DetailsArrearsShow:false,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "工程报装" }
        ]
      },
       detailsArrearsFormData: {
        userNo: "",
        id: ""
      },

      tableQuery: {
        fuzzyItems: [],
        fuzzyQuery: '',
        pjType: [],
        beginDate: '',
        endDate: '',
        sourceFlag: '',
        schedule: [],
        processState: '',
        page: 1,
        pageCount: 20,
        loginUserName:'',
        delayState:'',
        payOffFlag:'',
        signContractFlag:'',
        businessAreaList:[],
        isUploadWorkBuild: "",//是否上传工建
        judgment1: ">=",
        judgment2: "<",
        outTimeStart: "",//工程超期
        outTimeEnd: "",
        workDaysStartCondition: ">=",
        workDaysEndCondition: "<",
        workDaysStart: "",//已用时间
        workDaysEnd: "",
      },
      date: [],
      isActive: false,
      tableData: {
        list: [],
        total: 0
      },
      // 营业区域下拉数据
      businessAreaData: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
        multiple: true
      },
      maxHeight: 0,
      showIndex: true,
      showEdit: false,
      showDelay: false,
      showTermination: false,
      showButtons: {},
      dictionaryData: {},
      scheduleOptions: [],
      editData: {},
      delayData: {},
      terminationData: {},
      viewAttachmentShow: false,
      isPjCollectShow:false,
      receiptAccessory: {},
      attachmentData: [],
      ContractTemplateVisible:false, //打印合同
      // 合同弹窗
      ContractShowVisible: false, //合同管理
      ContractManageShowVisible: false, //合同管理节点的合同管理按钮
      PaperContractShowVisible: false, //创建合同
      ContractShowVisibleName: "合同管理",
      ContractManageShowVisibleName: "合同管理",
      PaperShowVisibleName: "创建合同",
      ElecShowVisibleName: "签订电子合同",
      OfferWaterContractParams: {
        // userNo:'',
        // certNo: '',
        // ctmName: '',
        // ctmAddr: '',
        id: '',
        billNo: '',
        meterList: [],
        typeBtn: "sgBtn",// 新增一个字段来区别点击的是【创建施工合同】还是【创建供水合同】按钮，给默认值是【创建施工合同】
      },
      ContractTemplateVisible:false, //打印合同
      // 挂起
      showPending: false,
      pendingData: {},
      YWSLConfig: "", //打印业务受理单参数
      SGYSConfig: "", //打印施工验收参数
      GJUpload: "",//是否上传查询条件参数
      GZLCConfig: "",//打印工作流程参数
      moreOptions:[
        {
          value:">=",
          label:"大于等于"
        },
        {
          value:">",
          label:"大于"
        },
        {
          value:"=",
          label:"等于"
        },
      ],
      lessOptions:[
        {
          value:"<=",
          label:"小于等于"
        },
        {
          value:"<",
          label:"小于"
        },
        {
          value:"=",
          label:"等于"
        },
      ],
      showDetail: false,//工程已用时间详情界面的显示隐藏
      dialogTableQuery: {
        page: 1,
        pageCount: 20,
      },
      tableShow: false,
      row: {},
      // 详情数据
      detailData: {},
    }
  },
  mounted() {
    const date = new Date()
    const year = date.getYear()
    const month = date.getMonth()
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    // const twoMonthAgo = month < 2 ? (year - 1).toString() + '-' + (12 - (Math.abs(month - 1) % 12)) + '-' + day : (year.toString() + '-' + (month === 11 ? '' : '0') + (month - 1)) + '-' + day
    const twoMonthAgo=this.getdate(60)
    this.date = [twoMonthAgo, this.common.date()]
    this.tableQuery.beginDate = twoMonthAgo
    this.tableQuery.endDate = this.common.date()
    // this.getProcessStateData()
    // this.getDictionary()
    // this.getBusinessAreaData()
    // this.tableQuery.loginUserName=this.$store.state.userName
    // if(this.tableQuery.loginUserName!=undefined&&this.tableQuery.loginUserName!=''){
    //   this.init()
    // }
    // this.init()

    this.$nextTick(() => {
      this.common.changeTable(this, ".engineerApproval", [
        ".engineerApproval .toolbar",
        ".engineerApproval .bread-contain",
        ".engineerApproval .toggle-btn",
        ".engineerApproval .block"
      ]);
    })
    // eventbus.$on("exportSGPD",item=>{
    //   this.todo(item)
    // })
    eventBus.$off('exoprtSGPD');
     eventBus.$on("exoprtSGPD",item=>{
       var params = {
        busicode:"PjMeterInstallInfoExport",
        data: {
            consultId: item.consultId,
            pjMeterIdList: item.pjMeterIdList,
            page:1,
            pageCount:99999
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURIComponent(JSON.stringify(params))
      );
     })
    eventBus.$on('initHomePage', () => {
      this.preventInit();
    })
     //当前处理人
    //  this.tableQuery.loginUserName=this.$store.state.userName
  },
  beforeDestroy(){
   eventBus.$off("exportSGPD")
   eventBus.$off("printSGPD")
   eventBus.$off('initHomePage');
  },
  methods: {
    preventInit(){
      this.getDictionary();
      this.init();
      this.getBusinessAreaData();
      this.getUploadWorkBuild();
      this.getPhotographic();
    },
    delayInit(callback){
      if(sessionStorage.getItem('account')){
        callback();
        return;
      }
      else{
        setTimeout(this.delayInit, 1000, callback)
      }
    },
    // 工程已用时间的弹出框内容，查询条件
    handleDetail(row) {
      this.row = row;
      this.showDetail = true;
      let params = {
        "busicode": "PjNodeListInfo",
        "data": {
          "billId": this.row.id
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.detailData = res;
      })
    },
    nodeCloseDialog(){
      this.showDetail = false;
    },
    //详情分页
    detailHandleSizeChange(val) {
      //显示多少数据一页
      this.dialogTableQuery.pageCount = val;
      this.dialogTableQuery.page = 1;
      this.handleDetail(this.row);
    },
    detailHandleCurrentChange(val) {
      //显示多少页码
      this.dialogTableQuery.page = val;
      this.handleDetail(this.row);
    },
    detailIndexMethod(index) {
      //获取表格序号
      return (this.dialogTableQuery.page - 1) * this.dialogTableQuery.pageCount + (index + 1);
    },
    // 获得高拍仪的参数
    getPhotographic () {
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'High_speed_photographic_apparatus',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length > 0) {
          // 调用高拍仪，1调用科荣高拍仪，2调用方正高拍仪；其他水司默认为1，茂名水司默认为2。
          this.$store.commit('setPhotographic', res.list[0].configValue == 2 ? true : false);
          //放到全局的store中，在任何页面都可以使用这个参数
        }
      })
    },
    // 是否上传查询条件的显示跟隐藏
    getUploadWorkBuild() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PROJECT_GJDJ_STATUS',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length && res.list.length > 0) {
          this.GJUpload = res.list[0].configValue;
        }
      })
    },
    // 打印业务受理单
    getYWSLConfig() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'REGISTER_PRINT_BSINESSACCEPTANCEFORM',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length && res.list.length>0) { //1显示，2不显示
          this.YWSLConfig = res.list[0].configValue;
        }
      })
    },
    // 打印施工验收单
    getSGYSConfig() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PROJECT_SURVEY_PRINT',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length && res.list.length>0) {
          this.SGYSConfig = res.list[0].configValue;
        }
      })
    },
    // 打印工作流程表，其他水司默认配置0不显示，茂名配置为1-显示；
    getGZLCConfig() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PRINT_WORKFIOW_TABLE',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length && res.list.length>0) {
          this.GZLCConfig = res.list[0].configValue;
        }
      })
    },
    getReceiptAccessoryList(data){
      console.log(data);
      this.AttachmentQty=data
    },
    ShowSGPDDialog(){
      if(this.waterSelectLength==0){
        this.$message({
          type:'warning',
          message:'请先勾选要施工派单的水表'
        })
        return
      }
      this.$refs.edit.isSgpdShow = true
    },
    selectTableData(data){
      this.waterSelectLength=data

    },

    UpdateHuHao(){
      eventBus.$emit('updateHuHao',this.radio)
      this.listAddShow=false
    },
    getIsTermination(data){
      this.isTermination=data
    },
    overTimeSearch(){
      eventBus.$emit('overTimeSearch',1)

    },
    // 打印业务受理单
    printYWSL(){
      console.log(this.OfferWaterContractParams.billNo)
      var params = {
        busicode: "pjRegisterDocExport",
        data: {
          "billNo": this.OfferWaterContractParams.billNo
        },
        token: sessionStorage.getItem("token"),
        sysType: "002",
      };
      window.open(this.common.getExportExcelIp() + "/project/docInterface.api?json=" + encodeURIComponent(JSON.stringify(params)));
    },
    // 打印施工验收单
    printSGYS(){
      var params = {
        busicode: "constructionAcceptanceForm",
        data: {
          "billNo": this.OfferWaterContractParams.billNo
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(this.common.getExportExcelIp() + "/project/docInterface.api?json=" + encodeURIComponent(JSON.stringify(params)));
    },
     // 打印工作流程表
    printGZLC(){
      var params = {
        busicode: "installationProcessTable",
        data: {
          "billNo": this.OfferWaterContractParams.billNo
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(this.common.getExportExcelIp() + "/project/docInterface.api?json=" + encodeURIComponent(JSON.stringify(params)));
    },
    // 打印登记申请表，套打
    printDJSQ(){
      let params = {
        busicode: "PjRegisterPrint",
        data:{
          "consultId": this.editData.hasOwnProperty("id") ? this.editData.id : "",
        },
      };
      this.$api.fetch({
        params: params,
      }).then(res => {
        let data = res;
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        this.common.printOne('view', 'PjRegisterPrint', '', data[0], this);
      })
    },
    // 创建纸质合同
    createPaperContract(value){
      // 要先判断是否有勾选水表信息中的内容
      this.OfferWaterContractParams.meterList = this.meterList;
      this.OfferWaterContractParams.typeBtn = value;
      this.PaperContractShowVisible = true;
    },
    // 合同管理
    getContractManagement(){
      this.OfferWaterContractParams.meterList = this.meterList;
      this.showContractManagementButton = false;
      this.ContractManageShowVisible = true;
    },
    // 确定签订-纸质合同
    confirmSigningZZHT(){
      // 要先校验是否输入框中有输入内容
      this.$refs.paperContract.createContract();
    },
    printGSHT(){
      if(this.waterSelectLength==0){
        this.$message({
          type:'warning',
          message:'请先勾选要打印的水表'
        })
        return
      }
      if(this.PROJECT_WATER==''){
        this.$message({
          type:'warning',
          message:'请先选择需打印的供水合同类型'
        })
        return
      }
      if(this.PROJECT_WATER_table==1){
        eventBus.$emit('rePrintSGHT',this.PROJECT_WATER)
      }else{
        eventBus.$emit('printSGHT',this.PROJECT_WATER)
      }
      this.GSHTShow=false
    },
    closeGSHTShow(){
      this.GSHTShow = false;
    },
    acceptanceReport(){
      eventBus.$emit('acceptanceReport',1)
    },
    acceptanceHistory(){
      eventBus.$emit('acceptanceHistory',1)
    },
    rePrintSGHT(){
      if(this.waterSelectLength==0){
        this.$message({
          type:'warning',
          message:'请先勾选要打印的水表'
        })
        return
      }
      this.GSHTShow=true
      this.PROJECT_WATER_table=1
      // eventBus.$emit('rePrintSGHT',1)
    },
    printSGHT(){
      if(this.waterSelectLength==0){
        this.$message({
          type:'warning',
          message:'请先勾选要打印的水表'
        })
        return
      }
      this.GSHTShow=true
      this.PROJECT_WATER_table=0
      // eventBus.$emit('printSGHT',1)
    },
    // 打印施工模板，套打
    printSGModel(){
      let params = {
        busicode: "PjConstructionPrint",
        data:{
          "consultId": this.editData.hasOwnProperty("id") ? this.editData.id : "",
        },
      };
      this.$api.fetch({
        params: params,
      }).then(res => {
        let data = res;
        this.$notify({
          title: "成功",
          message: "正在打印...",
          type: "success"
        })
        this.common.printOne("view", "PjConstructionPrint", "", data[0], this);
      })
    },
    getCurrentHu(data){
      this.radio=data.userNo
    },
    UpdateHuHao(){
      eventBus.$emit('updateHuHao',this.radio)
      this.listAddShow=false
    },
    indexMethodHu (index) {
      //  console.log(index)
      //获取表格序号
      return (
        (this.tableQueryHu.page - 1) * this.tableQueryHu.pageCount + (index + 1)
      );
    },
    handleDialogSizeChange (val) { //显示多少数据一页
      this.tableQueryHu.pageCount = val
      this.tableQueryHu.page = 1
      this.searchHu()
    },
    handleDialogCurrentChange (val) {  //显示多少页码
      this.tableQueryHu.page = val
      this.searchHu()
    },
    searchHu(){
      const params = {
        "busicode": "PjGetUserInfo",
        "data": {
          fuzzyQuery:this.huHao,
          page:this.tableQueryHu.page,
          pageCount:this.tableQueryHu.pageCount
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        // console.log(JSON.stringify(res));
        this.tableDataHu=res.list
        this.tableDatahuTotal=res.total
      })
    },
    houseRenovation(){
      this.tableDataHu.length=0
      this.huHao=''
      this.listAddShow=true
    },
    getdate(n){
        var n = n;
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        if(day <= n) {
            if(month > 1) {
                month = month - 1;
            } else {
                year = year - 1;
                month = 12;
            }
        }
        myDate.setDate(myDate.getDate() - n);
        year = myDate.getFullYear();
        month = myDate.getMonth() + 1;
        day = myDate.getDate();
        let appointDate = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (day < 10 ? ('0' + day) : day);
        return appointDate;
    },
    exportExcel(){
      var params = {
        busicode:'PjInfoListExport',
        data: {
              ...this.tableQuery,
              page:1,
              pageCount:999999
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURI(JSON.stringify(params))
      );


//       var _this = this
//       var params = {
//         "busicode": "PjInfoListExport",
//         "data": this.tableQuery
//       }
//       this.$api.fetch({
//         params: params,//参数
//       }).then(res => {
//       })

    },
    dateConfig(data) {
      var date=new Date(data)
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      var d = date.getDate(); //日
      return y + "-" + m + "-" + d;
    },
    getConstructionUnit(msg){
      this.constructionUnit=msg
    },
    getSettlementFlag(msg){
      this.settlementFlag=msg
    },
    getCurrentStep(item){
      this.sonCurrentStep=item[0]
      this.sonOperation=item[1]
    },
    printContract(){
      this.ContractTemplateVisible=true
    },
    closeTemplateDialog(){
      this.ContractTemplateVisible=false
    },
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        e=str
        return e;
      },
      getDialog(data){
          this.dialogFormVisible=false;
          this.showDelay=false
          this.showPending = false;
          this.closeDialog();
      },
      handleClose () {
          this.$refs.ruleForm.resetFields()
          this.form = {
              name: '',
              region: '',
              date1: '',
              date2: '',
              delivery: false,
              type: [],
              resource: '',
              desc: ''
          }

      },
      handleDialogClose(){
          this.dialogFormVisible=false;
          this.showDelay=false
          this.showPending = false;
          this.closeDialog();
      },
       daCloseDialog() {
      //关闭会话
      this.DetailsArrearsShow = false;
      this.PaperContractShowVisible = false;
      this.ContractManageShowVisible = false;
      this.showContractManagementButton = true;
    },

        // 欠费明细
    detailsArrears() {

      this.DetailsArrearsShow = true;
       this.detailsArrearsFormData.userNo = this.$refs.edit.getFormData().consult.oloUserNo;
      this.$refs["detailsArrears"].init();
    },
    closePjClDialog(){
        this.$refs.projectPayment.resetField();
      this.isPjCollectShow = false;
    },
    pjCollectShow(){
      this.isPjCollectShow = true;
      this.$refs.projectPayment.init()
    },

   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.select4.blur()
           this.$refs.select5.blur()
          //  this.$refs.select6.blur()
          //  this.$refs.select7.blur()
          //  this.$refs.select6.blur()
         }
    },
    init() {
      var _this = this
      var params = {
        "busicode": "PjInfoList",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData= res
        this.waterSelectLength=0
      })
    },
    search() {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PQI,PPT,PIS,PCS,BPT,PCN,PROJECT_WATER_SUPPLY " //查询项、工程类型、信息来源、流程状态、收费类型、流程节点
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        this.PROJECT_WATER_SUPPLY=res['PROJECT_WATER_SUPPLY ']
        // console.log(JSON.stringify());
      })
    },
    // 获取流程节点
    getProcessStateData() {
      this.common.getProcessStateData('pj_info_new', this, (res) => {
        this.scheduleOptions = res
      })
    },
    hidden() {
      this.isActive = !this.isActive
      this.$nextTick(() => {
        this.common.changeTable(this, ".engineerApproval", [
          ".engineerApproval .toolbar",
          ".engineerApproval .bread-contain",
          ".engineerApproval .toggle-btn",
          ".engineerApproval .block"
        ]);
      })
    },
    // 营业区域下拉框
    getBusinessAreaData() {
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
        this.businessAreaData = data.children;
      })
    },
    //树结构数据处理
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
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
    //显示多少页码
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    add() {
      this.myTerminationFlag = 0; // 登记的时候，按钮的状态要重置
      this.editData = {}
      this.showIndex = false
      this.showEdit = true
    },
    detail(row) {
      this.editData = {id: row.id}
      sessionStorage.setItem('overruleFlag',row.overruleFlag)
      this.showIndex = false
      this.showEdit = true
      this.myTerminationFlag=row.terminationFlag
      // this.OfferWaterContractParams.userNo = row.userNo
      // this.OfferWaterContractParams.certNo = row.certNo
      // this.OfferWaterContractParams.ctmName = row.ctmName
      // this.OfferWaterContractParams.ctmAddr = row.ctmAddr
      this.OfferWaterContractParams.id = row.id
      this.OfferWaterContractParams.billNo = row.billNo
      // this.viewAttachment()
    },
    save() {
      this.$refs.edit.save()
      this.showButtons.save=false
    },
    delay(row) {
      this.delayData = {id: row.id}
      this.showIndex = false
      this.showDelay = true
      this.showButtons = []
    },
    pending(row) {
      this.pendingData = {id: row.id}
      this.showIndex = false
      this.showPending = true
      this.showButtons = []
    },
    rePending(row) {
      // 这个是挂起恢复，要调用接口
      this.$confirm('确认恢复该工程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
        busicode: "PjPendingRecover",
        data: {
          pjId: row.id,
        },
      };
      this.$api
        .fetch({
          params: params,
        })
        .then((res) => {
          this.$message({
            type: 'success',
            message: '恢复成功'
          });
          this.init();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        });
      })
    },
    termination(row) {
      this.terminationData = {id: row.id,terminationFlag:row.terminationFlag,sourceFlag:row.sourceFlag}
      this.showIndex = false
      this.showTermination = true
      this.showButtons = []
    },
    deleteRow(id) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "PjInfoDelete",
            data: { id: id }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.search();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    back() {
      this.showEdit = false
      this.showDelay = false
      this.showTermination = false
      this.showIndex = true
      this.editData = {}
      this.meterList = []
      this.init()
    },
    closeDialog() {
      this.back()
    },
    changeButtons(btn) {
      this.showButtons = {}
      for(const i of btn) {
        this.$set(this.showButtons, i, true)
      }
    },
    //上传附件
    uploadAttachment(file, fileList) {
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.editData.id,
          receiptType: "pj_info_new",
          accessoryNo: "000",
          file: file.file
        },
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
          this.$refs.edit.viewAllAttachment(true);
        });
    },
    viewAllAttachment(){
      this.$refs.edit.viewAllAttachment()
    },
    // 查看附件按钮
    // viewAttachment(flag) {
    //   if(flag) {
    //     this.receiptAccessory = {
    //       receiptType: "pj_info_new",
    //       receiptId: this.editData.id
    //     }
    //     this.$nextTick(() => {
    //       this.viewAttachmentShow = true;
    //     })
    //   } else {
    //     let params = {
    //       busicode: "ReceiptAccessoryList",
    //       data: {
    //         receiptType: "pj_info_new",
    //         receiptId: this.editData.id
    //       }
    //     };
    //     this.$api
    //       .fetch({
    //         params: params //参数
    //       })
    //       .then(res => {
    //         this.attachmentData = res;
    //       });
    //   }
    // },
    // closeAttachDialog(){
    //   this.viewAttachmentShow = false;
    //   this.viewAttachment()
    // },
    // todo
    todo(){

    },
    todo1() {
      eventBus.$emit("printSGPD",true)
    },
    contractShow () {
      if (this.meterList.length == 0) {
        this.$message.error("该工程无水表信息！")
      }else{
        this.OfferWaterContractParams.meterList = this.meterList
        this.ContractShowVisible = true;
      }
    },
    getMeterList(val){
      console.log(val);
      this.meterList = val
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    checkedUser(){
      if(this.checkedUser==true){
        //当前处理人
        this.tableQuery.loginUserName=this.$store.state.userName
      }else{
        this.tableQuery.loginUserName=''
      }
    },
    "$store.state.account":{
      handler:function(newVal,oldVal){
        this.init()
        this.tableQuery.loginUserName=this.$store.state.userName
      }
    },
    date(val) {
      if(val && val.length > 0) {
        this.tableQuery.beginDate = val[0]
        this.tableQuery.endDate = val[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    isPjCollectShow(){
      setTimeout(()=>{
        this.$refs.projectPayment.initData()
      },200)
    }
  },
  computed: {
    fuzzyItems() {
      return this.dictionaryData.PQI && this.dictionaryData.PQI.filter(item => this.tableQuery.fuzzyItems.includes(item.value)).map(item => item.name).join('，')
    },
    pjType() {
      return this.dictionaryData.PPT && this.dictionaryData.PPT.filter(item => this.tableQuery.pjType.includes(item.value)).map(item => item.name).join('，')
    },
    isStatus2(){
      return this.$store.state.isStatus2;
    },
    schedule() {
      return this.dictionaryData.PCN && this.dictionaryData.PCN.filter(item => this.tableQuery.schedule.includes(item.value)).map(item => item.name).join('，')
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .multiple-floor .button-group {
  position: absolute;
  right: 10px;
}
/deep/.add-user-container{
  .el-form-item__content{
    width:90%
  }
  .width-200{
    width:94%
  }
  .el-col-24{
    width:100%
  }
  .width-200 .el-input--mini .el-input__inner {
    width: 100% !important;
  }
}
.engineerApproval {
  height: 100%;
  .tableStyle /deep/ .el-table .cell{ //要加一个class不然会影响其余页面的表格的使用
    display: flex;
    align-items: center;
  }
  .tag{
    float: left;
    color:white;
    line-height: 22px;
    text-align: center;
    font-size:12px;
    margin: auto 0;
    margin-left: 5px;
    border-radius:50%;
    width: 22px;
    height:22px;
    cursor: default;
  }
  .green{
    background-color: #4cb816;
  }
  .red{
    background-color: #f56c6c;
  }
}
.kl-table {
  margin-top: 15px;
}
/* 带底部按钮的弹出框 */
/deep/.delay-dialog .el-dialog{
  margin: 0 auto;
  width: 90%;
  height: 65%;
  margin-top: 25px !important;
}
/deep/.delay-dialog .el-dialog__wrapper {
  background: transparent !important;
  padding-top: 5%;
}
/deep/.delay-dialog .el-dialog__header {
  border-bottom: 1px solid #efefef;
}
/deep/.delay-dialog .el-dialog__body {
  padding: 0 20px;
  height: calc(100% - 0px) !important;
  overflow: hidden !important;
}
/deep/.delay-dialog .el-dialog__body .el-input__inner {
  height: 28px;
  line-height: 28px;
 /* font-size: 12px; */
   font-size: 14px;
  color:#000;
}
/deep/.delay-dialog .el-dialog__body .el-form-item {
  margin-bottom: 10px;
}
/* 带底部按钮的弹出框 */
// 挂起
/deep/.pending-dialog .el-dialog{
  margin: 0 auto;
  width: 30%;
  // height: 65%;
  // margin-top: 25px !important;
}
/deep/.pending-dialog .el-dialog__body {
  padding: 0 0 20px 0;
  height: calc(100% - 0px) !important;
  overflow: hidden !important;
}
/deep/.pending-dialog .el-dialog__body .el-input__inner {
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  color:#000;
}

</style>

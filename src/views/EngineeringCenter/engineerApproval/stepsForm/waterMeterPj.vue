<template>
  <!-- 工程中心-多水表录入 -->
  <div class="water-meter">
    <div class="table-content" v-if="!NotDisabled">
      <div class="bread-contain">
        <span style="color: hsl(169, 71%, 52%);font-weight:bold;font-size:12px;">合计：{{tableData.length}}
          <span v-for="(item,index) in numberArray" :key="index">
            &nbsp;&nbsp;&nbsp;{{getMeterBoreName(item.meterBoreId)}}：{{item.number}}
          </span>
        </span>
        <div class="bread-contain-right">
          <el-button v-if="QRpjType != '2' && QRpjType != '3'"
            :disabled="currentStep == 6 || currentStep == 2 || currentStep > 9 || (currentStep == 9 && behindRegisterAccount)? true : false"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="addRow()"
          ></el-button>
          <el-button v-if="QRpjType != '2' && QRpjType != '3'"
            :disabled="currentStep == 6 || currentStep == 2 || currentStep > 9 || (currentStep == 9 && behindRegisterAccount)? true : false"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="multipleAddRow()"
          >批量添加</el-button>

           <el-button 
           :disabled="currentStep == 6 || currentStep == 2 || (currentStep > 9 && currentStep != 18) || (currentStep == 9 && behindRegisterAccount)? true : false"
            type="primary"
            size="mini"
            @click="save"
            >保存</el-button>

          <el-upload v-if="QRpjType != '2' && QRpjType != '3'"
            action="/"
            class="upload-demo"
            style="margin-left:10px;"
            :http-request="importExcel"
            :show-file-list="false"
          >
            <el-button :disabled="currentStep == 6 || currentStep == 2 || (currentStep > 9 && currentStep != 18 || (currentStep == 9 && behindRegisterAccount))? true : false" icon="el-icon-download" size="mini" type="primary"
              >导入</el-button
            >
          </el-upload>
          <el-button v-if="QRpjType != '2' && QRpjType != '3'"
            :disabled="currentStep == 6 || currentStep == 2 || (currentStep > 9 && currentStep != 18 || (currentStep == 9 && behindRegisterAccount))? true : false"
            type="primary"
            size="mini"
            icon="el-icon-bottom"
            @click="downloadExcel"
            >下载模板</el-button
          >
          <!-- 在【工程详情-安装施工】环节，新增按钮【打印回执单】没有勾选数据的时候置灰 -->
          <el-button v-if="currentStep == 9" :disabled="selectList.length == 0" type="primary" size="mini" icon="el-icon-bottom" @click="printReceipt()" >打印回执单</el-button>
        </div>
      </div>
    </div>
    <div class="kl-table">
      <ux-grid style="margin-top:10px;"
        v-if="tableShow"
        stripe
        border
        highlight-current-row
        :data="tableData"
        class="Warehousing-table"
        @row-click="onRowClick"
        :row-class-name="tableRowClassName"
        @selection-change="getSelectList"
        ref="table"
        :max-height="420"
        :widthResize="true"
        :cell-style="{height:'40px'}"
        @sort-change="sortChange"
      >
        <ux-table-column @change="sendSelect" v-if="(QRpjType != '2' && QRpjType != '3') || currentStep== 9" type="checkbox" fixed="left" resizable></ux-table-column>
        <ux-table-column resizable
          type="index"
          fixed="left"
          title="NO."
          min-width="50"
        ></ux-table-column>
        <ux-table-column
          field="userInfo.userNo"
          min-width="150"
          title="用户编号"
        >
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\D\n]/g,'');if(value.length>14)value=value.slice(0,14)" :readonly="!editM"
              v-if="showRow(scope.row.index)"
              v-model="scope.row.userInfo.userNo"
              :disabled="NotDisabled"
              @input="e => input = inputMe(e)"
            >
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.userNo}}</span>
          </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == 7" field="userInfo.ctmName" width="250" title="客户名称">
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.ctmName" @input="e => input = inputMe(e)">
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.ctmName}}</span>
          </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17" field="userInfo.certType" width="150" title="客户证件类型">
          <template slot-scope="scope" >
            <el-select size="mini" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.certType" @change="changeCertType(scope.row.userInfo)">
              <el-option v-for="item in dictionaryData.IDT" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span style="color:black" v-else>{{scope.row.userInfo.certTypeName}}</span>
          </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17" field="userInfo.certNo" width="150" title="客户证件号码">
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\u4E00-\u9FA5]/g,'')" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.certNo" @input="e => input = inputMe(e)">
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.certNo}}</span>
          </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17" field="userInfo.ctmAddr" width="150" title="客户地址">
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.ctmAddr" @input="e => input = inputMe(e)">
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.ctmAddr}}</span>
          </template>
        </ux-table-column>
        <ux-table-column field="userInfo.setupMeterAddr" min-width="300" title="装表地址" resizable>
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              v-if="showRow(scope.row.index) && (QRpjType != '3')"
              v-model="scope.row.userInfo.setupMeterAddr"
              :disabled="NotDisabled"
              @input="e => input = inputMe(e)"
            >
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.setupMeterAddr}}</span>
          </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="userInfo.mobile" width="150" title="手机号码">
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\u4E00-\u9FA5]/g,'')" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.mobile" @input="e => input = inputMe(e)">
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.mobile}}</span>
          </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="userInfo.stopWaterLinkMobile" width="150" title="通知人手机">
          <template slot-scope="scope" >
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\u4E00-\u9FA5]/g,'')" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.stopWaterLinkMobile" @input="e => input = inputMe(e)">
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.stopWaterLinkMobile}}</span>
          </template>
        </ux-table-column>

        <template v-if="businessStep">
          <!-- <el-table-column
            prop="planMeterInstallDate"
            width="120"
            label="计划日期"
          >
            <template slot-scope="scope">
                <el-date-picker
                v-if="showRow(scope.row.index)"
                value-format="yyyy-MM-dd"
                v-model="scope.row.planMeterInstallDate">
                </el-date-picker>
                <span style="color:black" v-else>{{scope.row.planMeterInstallDate}}</span>
            </template>
        </el-table-column> -->

          <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17) || stepIdx == -1"
            field="userInfo.meterBuilder"
            width="100"
            title="施工人员"
          >

            <template slot-scope="scope">
              <el-select v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.meterBuilder" @change="meterBuilderChange(scope.row.userInfo)"  size="mini" >
                <el-option size="mini"
                  v-for="item in workerNameList"
                  :key="item.userAccount"
                  :label="item.userName"
                  :value="item.userAccount"

                ></el-option>
              </el-select>
              <span style="color:black" v-else>{{scope.row.userInfo.meterBuilderName}}</span>
            </template>
          </ux-table-column>
          <ux-table-column v-if="(((stepIdx > 5 && stepIdx != 17) || stepIdx == -1) && (QRpjType == '2' || QRpjType == '3'))" field="userInfo.oldLastReadingNum" width="120" title="旧表止码" >
            <template slot-scope="scope" >
              <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[^\d]/g,'')" v-if="showRow(scope.row.index)" v-model="scope.row.userInfo.oldLastReadingNum" :disabled="NotDisabled" @input="e => input = inputMe(e)">
              </el-input>
              <span style="color:black" v-else>{{scope.row.userInfo.oldLastReadingNum}}</span>
            </template>
          </ux-table-column>
        </template>
             
                <!-- <el-table-column
          prop="userInfo.meterBjms"
          min-width="120"
          label="表井模式"
        >
          <template slot-scope="scope">
            <el-select
              v-if="showRow(scope.row.index)"
              clearable
              v-model="scope.row.userInfo.meterBjms"
              placeholder
              :disabled="NotDisabled"
            >
              <el-option
                v-for="(item, index) in dictionaryData.BJMS"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="color:black" v-else-if='scope.row.userInfo.meterBjms==1'>管道井</span>
            <span style="color:black" v-else-if="scope.row.userInfo.meterBjms==2">地表井</span>
            <span style="color:black" v-else-if="scope.row.userInfo.meterBjms==3">入户表</span>
            <span style="color:black" v-else></span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          prop="userInfo.meterBjxs"
          min-width="130"
          label="表井形式"
        >
          <template slot-scope="scope">
            <el-select
              v-if="showRow(scope.row.index)"
              clearable
              v-model="scope.row.userInfo.meterBjxs"
              placeholder
              :disabled="NotDisabled"
            >
              <el-option
                v-for="(item, index) in dictionaryData.BJXS"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="color:black" v-else-if="scope.row.userInfo.meterBjxs==1">一井一表</span>
            <span style="color:black" v-else-if="scope.row.userInfo.meterBjxs==2">一井多表</span>
            <span style="color:black" v-else></span>
          </template>
        </el-table-column> -->



          <template v-if="businessStep">

          <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17) || stepIdx == -1"
            field="userInfo.lastReadingNum"
            min-width="120"
            title="水表起码"
          >
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
                v-if="showRow(scope.row.index)"
                v-model="scope.row.userInfo.lastReadingNum"
                size="mini"
                @input="e => input = inputMe(e)"
                clearable
              >
              </el-input>
              <span style="color:black" v-else>{{scope.row.userInfo.lastReadingNum}}</span>
            </template>
          </ux-table-column>
              <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17)|| stepIdx == -1"
            field="msInfo.factoryNo"
            min-width="150"
            title="表身码"
          >
          <template slot-scope="scope">
              <el-select size="mini"
                v-if="showRow(scope.row.index)"
                class="icon1"
                v-model="scope.row.msInfo.factoryNo"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="mTypeChange"
                @change="setMeterNo(scope.rowIndex,scope.row.msInfo)"
                :loading="false"
                clearable
              >

                <template v-for="(item_s, index) in meterNos">
                  <el-option
                    :key="index"
                    :label="item_s.factoryNo"
                    :value="item_s.factoryNo"
                  >
                  </el-option>
                </template>
              </el-select>
              <span style="color:black" v-else>{{scope.row.msInfo.factoryNo}}</span>
            </template>
          </ux-table-column>
             <ux-table-column v-if="stepIdx > 5 || stepIdx == -1"
            field="userInfo.setupMeterDate"
            min-width="250"
            title="装表日期"
          >
            <template slot-scope="scope">
              <el-date-picker class="pickerStyle" prefix-icon="  "
                v-if="showRow(scope.row.index) && stepIdx != 17"
                value-format="yyyy-MM-dd"
                size="mini"
                v-model="scope.row.userInfo.setupMeterDate"
              ></el-date-picker>
              <span style="color:black" v-else>{{scope.row.userInfo.setupMeterDate}}</span>
            </template>
          </ux-table-column>
          <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17) || stepIdx == -1" field="userInfo.meterSite" min-width="130" title="表位">
          <template slot-scope="scope">
            <el-input size="mini" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              v-if="showRow(scope.row.index)"
              v-model="scope.row.userInfo.meterSite"
              :disabled="NotDisabled"
              @input="e => input = inputMe(e)"
            >
            </el-input>
            <span style="color:black" v-else>{{scope.row.userInfo.meterSite}}</span>
          </template>
        </ux-table-column>
                    <!-- <el-table-column
            prop="userInfo.concentratorNo"
            width="200"
            label="集中器"
          >
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="showRow(scope.row.index)" size="mini" v-model="scope.row.userInfo.concentratorNo">
                <el-button
                  slot="append"
                  type="primary"
                  size="mini"
                  @click="openConcentratorOption(scope.$index)"
                  >添加</el-button
                >
              </el-input>
              <span style="color:black" v-else>{{scope.row.userInfo.concentratorNo}}</span>
            </template>
          </el-table-column> -->

          <!-- <el-table-column
            prop="userInfo.fatherMeterNo"
            min-width="200"
            label="总表编号"
          >
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
                v-if="showRow(scope.row.index)"
                v-model="scope.row.userInfo.fatherMeterNo"
                size="mini"
                @input="e => input = inputMe(e)"
                clearable
              >
              </el-input>
              <span style="color:black" v-else>{{scope.row.userInfo.fatherMeterNo}}</span>
            </template>
          </el-table-column> -->
          <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17)|| stepIdx == -1"
            field="msInfo.meterNo"
            min-width="280"
            title="水表编号"
          >

          </ux-table-column>


          <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17) || stepIdx == -1"
            field="msInfo.meterModelName"
            width="150"
            title="水表型号"
          >
          </ux-table-column>
          <ux-table-column field="userInfo.useWaterType" min-width="200" title="用水类型" resizable>
            <template slot-scope="scope">
              <el-cascader size="mini" v-if="showRow(scope.row.index)  && (QRpjType != '3')" v-model="scope.row.userInfo.useWaterType" @change="changeUseWaterType(scope.row.userInfo,scope.row.userInfo.useWaterType)" :options="useWaterTypeOptions" :show-all-levels="false" :props="props">
              </el-cascader>
              <span style="color:black" v-else>{{scope.row.userInfo.useWaterTypeName}}</span>
            </template>
          </ux-table-column>
          <ux-table-column field="msInfo.meterBore" v-if="stepIdx != 17" min-width="200" title="水表口径" resizable>
            <template slot-scope="scope">
              <el-select size="mini" v-if="showRow(scope.row.index)" v-model="scope.row.msInfo.meterBore" @change="changeMeterBore(scope.row.msInfo)" >
                <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
              </el-select>
              <span style="color:black" v-else>{{scope.row.msInfo.meterBoreName}}</span>
            </template>
          </ux-table-column>

          <ux-table-column v-if="(stepIdx > 5 && stepIdx != 17) || stepIdx == -1"
            field="msInfo.meterTypeName"
            min-width="80"
            title="水表分类"
          >
          </ux-table-column>
        </template>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="accountInfo.openAccountName" width="200" title="开户名称">
           <template slot-scope="scope">
            <el-input size="mini" oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              v-if="showRow(scope.row.index)" v-model="scope.row.accountInfo.openAccountName" @input="e => input = inputMe(e)">
            </el-input>
            <span style="color:black" v-else>{{scope.row.accountInfo.openAccountName}}</span>
           </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="accountInfo.openAccountBank" width="200" title="开户银行">
          <template slot-scope="scope">
            <el-cascader v-if="showRow(scope.row.index)"
              ref="cascader" size="mini"
              v-model="scope.row.accountInfo.openAccountBank"
              :options="openABankOptions"
              :show-all-levels="false"
              :props="props"
            >
            </el-cascader>
            <span style="color:black" v-else>{{scope.row.accountInfo.openAccountBankName}}</span>
           </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="accountInfo.bankAccount" width="230" title="银行账号">
          <template slot-scope="scope">
            <el-input  size="mini" v-if="showRow(scope.row.index)"  v-model="scope.row.accountInfo.bankAccount" oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\r\D]/g,'');if(value.length>19)value=value.slice(0,19)">
              <template slot="append">
                <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
                  <el-button icon="el-icon-reading" class="scanning-btn" @click="icCard('bankAccount', scope.row)" size='mini'></el-button>
                </el-tooltip>
              </template>
            </el-input>
            <span style="color:black" v-else>{{scope.row.accountInfo.bankAccount}}</span>
           </template>
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="gsContract.contractNo" width="150" title="供水合同编号">
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="gsContract.contractName" width="150" title="供水合同名称">
        </ux-table-column>
        <ux-table-column v-if="stepIdx == 17 || stepIdx == -1" field="gsContract.contractStatusName" width="150" title="供水合同状态" sortable>
        </ux-table-column>
        <ux-table-column title="操作" fixed="right" min-width="150" resizable>
          <template slot-scope="scope">
            <!-- <el-button
              type="text"
              @click.native="order(scope)"
              v-if="stepIdx === 7"
            >
              派单</el-button
            > -->

            <el-button v-if="stepIdx != 17" size="mini"
              :disabled="(currentStep == 6 || currentStep == 2 || currentStep > 9 || stepIdx == -1 || (currentStep == 9 && behindRegisterAccount)? true : false) || (QRpjType == '2' || QRpjType == '3')"
              type="text"
              @click.native="reMove(scope.row)"
            >
              删除</el-button
            >
            <!-- <el-button
            v-if="stepIdx>8"
              type="text"
              @click.native="detail(scope.$index,scope.row)"
            >
              详情</el-button
            > -->
            <el-button v-if="stepIdx != 17" size="mini"
              :disabled="(currentStep == 6 || currentStep == 2 || currentStep > 9 || stepIdx == -1 || (currentStep == 9 && behindRegisterAccount)? true : false) || (QRpjType == '2' || QRpjType == '3')"
              type="text"
              @click.native="copyRow(scope.row)"
            >
              复制</el-button
            >
            <el-button v-if="stepIdx == 17" size="mini" type="text" @click="openPreview(scope.row)">预览</el-button>
          </template>
        </ux-table-column>
      </ux-grid>

      <el-dialog
        title="施工派单"
        :close-on-click-modal="false"
        :visible.sync="sendOrderDialog"
        id="sendOrderDialog"
        class="button-dialog"
        @close="closeSendOrderDialog"
      >
        <el-form
          ref="form"
          :model="orderForm"
          class="formBill"
          :inline="true"
          size="mini"
          width="0%"
          label-width="130px"
          label-position="right"
        >
          <el-form-item prop="planMeterInstallDate" label="计划日期">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="orderForm.planMeterInstallDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="meterBuilder" label="施工人员：">
            <el-select v-model="orderForm.meterBuilder">
              <el-option
                v-for="item in workerNameList"
                :key="item.userAccount"
                :label="item.userName"
                :value="item.userAccount"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装表地址：" class="disable-item col-2">
            <span>{{ orderForm.setupMeterAddr }}</span>
          </el-form-item>
          <el-form-item label="表井模式：" class="disable-item">
            <span>{{
              orderForm.meterBjms &&
                dictionaryData.CTL.filter(
                  i => i.value == orderForm.meterBjms
                )[0].name
            }}</span>
          </el-form-item>
          <el-form-item label="表井形式：" class="disable-item">
            <span>{{
              orderForm.meterBjxs &&
                dictionaryData.CTL.filter(
                  i => i.value == orderForm.meterBjxs
                )[0].name
            }}</span>
          </el-form-item>
          <el-form-item label="表位：" class="disable-item">
            <span>{{ orderForm.meterSite }}</span>
          </el-form-item>

          <br />
        </el-form>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="orderSubmit"
            >确 定</el-button
          >
          <el-button
            type="info"
            size="mini"
            plain
            @click="sendOrderDialog = false"
            >取 消</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        v-if="openConcentratorDialog"
        title="集中器"
        :close-on-click-modal="false"
        append-to-body
        :visible.sync="openConcentratorDialog"
        class="button-dialog"
        @close="closeConcentratorDialog"
      >
        <concentratorInfo
          :concentratorQuery="concentratorQuery"
          ref="concentratorInfoList"
        ></concentratorInfo>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="ctrSubmit"
            >确 定</el-button
          >
          <el-button
            type="info"
            size="mini"
            plain
            @click="openConcentratorDialog = false"
            >取 消</el-button
          >
        </div>
      </el-dialog>
      <el-dialog  :destroy-on-close="true" :close-on-click-modal="false"  :visible.sync="multipleAddVisible" @close="closeDialog" class="button-dialog dialog" title="批量添加">
        <div class="toolbar">
          <div class="form-right">
            <el-button icon="" size="mini" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="add">增加</el-button>
          </div>
        </div>
        <el-table :data="gridData" border style="height:100%;overflow-y:scroll;">
          <el-table-column type="index" label="NO." min-width="50">
          </el-table-column>
          <el-table-column label="用水类型" min-width="150">
            <template slot-scope="scope">
              <el-cascader v-model="scope.row.useWaterType" :options="useWaterTypeOptions" :show-all-levels="false" :props="props">
              </el-cascader>
            </template>
          </el-table-column>
          <el-table-column label="水表口径" min-width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.meterBore">
                <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="150">
            <template slot-scope="scope">
              <el-input oninput="value=value.replace(/\D/g,'')" @input="e => input = inputMe(e)"  v-model="scope.row.number"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="getInfo()">确 定</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog()">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :append-to-body="true" :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        busicode="ReceiptAccessoryList"
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- IC-获取银行卡信息插件所需标签 不显示在页面  可忽略 -->
    <div style="display: none">
      <object TYPE="application/x-itst-activex" clsid="{36C2AA6E-FE75-4EB0-A1F1-FCD918754506}" id="IccPboc"></object>
      <p align="left">
        终端信息数据:<br />
        <textarea name="TxSendData" cols="126" rows="3"
          id="TxSendData">P012000000000100Q012000000000000R0040156S006140725T00201U006131049W004GZNX</textarea>
      </p>

      <p align="left">
        发送脚本数据:<br />
        <textarea name="SendScriptData" cols="126" rows="3"
          id="SendScriptData">910A36297819EF8BDC7430309F360201E37222860F04DA9F770A000000099900580576A7860F04DA9F780A0000000999003B3EF374</textarea>
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
import concentratorInfo from "@/components/concentratorInfo"; //选择集中器
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  // SetAccount 立户节点
  //id 单据id
  //NotDisabled 是否可修改
  props: ["NotDisabled","data", "bookNoShow", "SetAccount", "id", "stepIdx","currentStep","installAddr","ctmName","behindRegisterAccount"],
  components: {
    concentratorInfo,
    AttachmentViewInfo,
  },
  data() {
    return {
      tableLength:0,
      ischange:-1,
      factoryNoList:[],
      meterNoList:[],
      meterModelNameList:[],
      meterBoreList: [],
      meterBoreNameList:[],
      meterTypeNameList:[],
      selectList:[],
      selectAll:[],
      concentratorQuery: { concentratorNo: "" },
      openConcentratorDialog: false,
      sendOrderDialog: false,
      workerNameList: [],
      meterNos: [],
      businessAreaOptions: [],
      maxHeight: 0,
      oldData: [],
      tableShow: true,
      tableData: [],
      tableQuery: {
        consultId: "",
        userInfo: []
      },
      orderForm: {
        constBeginDate: "",
        meterBuilder: "",
        setupMeterAddr: "",
        meterBjms: "",
        meterBjxs: "",
        meterSite: ""
      },
      rowIdx: 0,
      props: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath: false,
      },
      dictionaryData: [], //数据字典
      tradeClassifyOptions: [],
      useWaterTypeOptions: [], //用水类型
      concentratorList: [], //集中器
      isTableDataChange: false,
      isInit: true,
      selectIndexList: [], // 用户勾选列表序号
      multipleAddVisible: false,//批量添加弹出框
      gridData: [
        {
          useWaterType: "",
          meterBore: "",
          number: "",
        },
      ],
      useWaterTypeOptions:[],//用水类型
      meterBoreData: [],//水表口径
      numberArray: [],
      chooseNumber: {},
      tempVal: "",
      QRpjType: "",//获得工程类型
      editM: false,//默认为false，只读
      userNoEdit: false,//获得梅州水司可以不可以编辑的参数
      receiptAccessory: {}, // 查看附件的接口的传参
      viewAttachmentShow: false, // 查看附件弹出框
      sortOrder: "", //供水合同状态要排序
      openABankOptions: [], // 开户银行
    };
  },
  computed: {
    businessStep() {
      return this.stepIdx === -1 || this.stepIdx === 0 || this.stepIdx === 1 || this.stepIdx === 3 || this.stepIdx === 5 ||this.stepIdx === 7 || this.stepIdx === 8 || this.stepIdx >9; //工程施工、施工计划 节点
    }
  },
  beforeRouteLeave( to, from, next ){
	 const answer = window.confirm('离开');
  //  console.log("----------");
	  if(answer){
		  next();
	  }else{
		  next(false)
	  }

  },
  beforeRouteEnter(to,from,next){
    next(()=>{
      // console.log("111111111111111111");
    })

  },

  mounted() {
    // console.log(this.currentStep);
    this.getDictionary();
    // this.SelectTradeClassifyOptions();
    this.SelectUseWaterTypeOptions();
    this.getMeterBore();
    this.getWorkStaffList();
    this.getUserNoEdit();
    this.selectOABankOptions();//获得开户银行信息
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".water-meter .kl-table", [
        ".water-meter .block"
      ]);
    });


    eventBus.$on("openInit", item => {
      this.init();
    });
    eventBus.$on("getPjType", (QRpjType) => {
      this.QRpjType = QRpjType;
      this.tableData = [];//切换的时候要把水表信息给清空一下
      this.acculateCount();
    });
    eventBus.$on("deliverRes", item => {
      this.tableData = [];
      this.addRow();
      if(item && item.userInfo){
        this.tableData[0].userInfo.userNo = item.userInfo.userNo;//水表信息的用户编号
        this.tableData[0].userInfo.setupMeterAddr = item.userInfo.setupMeterAddr;//水表信息的装表地址
        this.tableData[0].userInfo.useWaterType = item.userInfo.useWaterType;//水表信息的用水类型
        this.tableData[0].userInfo.useWaterTypeName = this.getuseWaterTypeName(item.userInfo.useWaterType);//水表信息的用水类型
        this.tableData[0].msInfo.meterBore = item.msInfo.meterBore;//水表信息的水表口径
        this.tableData[0].msInfo.meterBoreName = this.getMeterBoreName(item.msInfo.meterBore);//水表信息的水表口径
        this.acculateCount();
      }
    });
    //施工派单数据回填
    eventBus.$on("changeTable",item=>{
      // console.log(JSON.stringify(this.selectList));
      if(this.selectList.length==0){
        this.$message({
                showClose: true,
                message: '请选择要派单的水表!',
                type: 'warning'
          });
          return
      }
      // console.log(this.selectAll[0].userInfo.setupMeterAddr);
      //console.log("item:"+JSON.stringify(item));
      for(let i=0;i<this.selectAll.length;i++){
        for(let j=0;j<this.selectList.length;j++){
          if(this.selectAll[i]==this.selectList[j]){
            if(this.selectAll[i].userInfo.setupMeterAddr==''){
              this.$message({
                showClose: true,
                message: '施工派单前必须录入装表地址!',
                type: 'warning'
              });
            return
            }
            //console.log("ALL"+JSON.stringify(this.selectAll[i]));
            //this.selectAll[i].planMeterInstallDate=item[0].planMeterInstallDate
            // this.selectAll[i].userInfo.meterBuilder=item[j].meterBuilder
            this.selectAll[i].planMeterInstallDate=item[0].planMeterInstallDate
            this.selectAll[i].userInfo.meterBuilderName=item[0].meterBuilder
            this.selectAll[i].userInfo.meterBuilder = this.getMeterBuilderAccount(item[0].meterBuilder)
            // this.selectAll[i].userInfo.setupMeterAddr=item[0].setupMeterAddr
            // this.selectAll[i].userInfo.meterSite=item[0].meterSite
            // this.selectAll[i].userInfo.meterBjms=item[0].meterBjms
            // this.selectAll[i].userInfo.meterBjxs=item[0].meterBjxs
          }
        }
      }
      this.tableData=this.selectAll
      //console.log(JSON.stringify(this.tableData));
      //this.save()

    })
    if(this.id != undefined){
      this.init();
    }
    //打印施工派单
    eventBus.$on("printSGPD",item=>{
        // 选择列表打印
        if(this.selectList.length==0){
        this.$message({
                showClose: true,
                message: '请选择要下载的派工单!',
                type: 'warning'
          });
          return
      }
      if(this.isTableDataChange){
          this.$message({
                showClose: true,
                message: '请保存更改后再下载！',
                type: 'warning'
          });
          return
      }
    let pjMeterIdList = this.selectList.map(item => {
        return item.id
    })
      let printParams = {
        consultId: this.tableQuery.consultId,
        pjMeterIdList
      }
      eventBus.$emit("exoprtSGPD", printParams)
    //   setTimeout(() => {
    //     eventBus.$emit("exoprtSGPD",this.tableQuery.consultId)
    //  }, 300);


    })
     //提交水表校验
     eventBus.$on("waterValidate",item=>{
        // setTimeout(() => {
          for(let i=0;i<this.tableData.length;i++){
            // console.log(this.tableData[i].userInfo.setupMeterDate);
            // console.log(typeof(this.tableData[i].userInfo.setupMeterDate));
            // console.log(this.tableData[i].id);
            // console.log(typeof(this.tableData[i].id));
            // if(typeof(this.tableData[i].id) == "undefined"){
            //   eventBus.$emit("waterValidate2",0)
            //   break
            // }
            // console.log("----------------------");
            // console.log("factoryNo"+this.tableData[i].msInfo.factoryNo)
            // console.log("setupMeterDate"+this.tableData[i].userInfo.setupMeterDate)
            // console.log("id:",this.tableData[i].id);
            //校验表身码等数据
            console.log(item);
            // if(item==9){
            //   if(this.tableData[i].userInfo.setupMeterDate==""){
            //     eventBus.$emit("waterValidate2",0)
            //     break
            //   }
            // }
            //校验水表是否有数据未保存，有则先保存再提交
            if(typeof(this.tableData[i].id)=="undefined"||this.tableData[i].id==""){
              if(this.tableData.length>0){

                let params = {
                busicode: "PjMeterBatchInsert",
                data: this.tableData.map((row, i)=>{
                  if(row.accountNos == ""){
                    row.accountNos = [];
                  }
                  if(row.hasOwnProperty("gsContract")){
                    delete row.gsContract;//这个是不需要的，不能更改合同编号的相关信息
                  }
                  if(row.hasOwnProperty("sgContract")){
                    delete row.sgContract;//这个是不需要的，不能更改合同编号的相关信息
                  }
                  // if(i == 0){
                  //   row.userCtmTempId = this.data.userCtmTempId;
                  //   row.userAccountTempId = this.data.userAccountTempId;
                  // }
                    row.consultId = this.id;
                    if(row.accountInfo==""){
                      row.userInfo.accountNos=undefined
                      return {
                      ...row,
                      "discountData": undefined,
                      "userMixtureData": undefined,
                      "accountInfo":undefined,
                      "ctmInfo":undefined
                    }
                    }
                    return {
                      ...row,
                      "discountData": undefined,
                      "userMixtureData": undefined
                    }
                  })
                };
                this.$api
                .fetch({
                  params: params //参数
                })
                .then(res => {
                });
              }else{
                let params = {
                busicode: "PjMeterBatchDelete",
                data: {
                  consultId:this.tableQuery.consultId
                }
                };
                this.$api
                .fetch({
                  params: params //参数
                })
                .then(res => {
                });
              }
            }

          }

        // }, 300);
      })
    eventBus.$on("waterLength",item=>{
      // setTimeout(()=>{
        //console.log("waterLength---------"+item);
        eventBus.$emit("waterLength2",this.tableLength)
      // })

    })
    eventBus.$on('printSGHT',item=>{
      this.printAll(item)
    })
  },
  beforeDestroy(){
    eventBus.$off("changeTable")
    eventBus.$off("printSGPD")
    eventBus.$off("waterValidate")
    eventBus.$off("waterLength")
    eventBus.$off("printSGHT")
    eventBus.$off("getPjType");
    eventBus.$off("deliverRes");
    //eventBus.$off("exoprtSGPD")
  },
  watch:{
    // stepIdx(){
    //   console.log(this.stepIdx);
    // }
  },
  methods: {
    getUserNoEdit () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PJ_METER_INSTALL',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if (res.list.length > 0) {
            this.userNoEdit = res.list[0].configValue == 0 ? true : false;
          }
        })
    },
    printAll (name) {
      let myPjMeterIdList=[]
      if(this.selectList.length==0){
        this.$message({
          type:'warning',
          message:'请先勾选需要打印的数据'
        })
        return
      }
      for(let i=0;i<this.selectList.length;i++){
        myPjMeterIdList.push(this.selectList[i].id)
      }
      let params = {
        busicode: name,
        data: { pjMeterIdList:myPjMeterIdList}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'NonResidentWaterSupplyContract', '', data[i], this);
        }
        // this.$notify({
        //   title: '成功',
        //   message: '正在打印...',
        //   type: 'success'
        // })
      })

    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    showRow(index){
      //console.log(this.stepIdx);
      //使用参数为0，并且在【水表出库】节点用户编号可以编辑
      if(this.currentStep == "8" && this.userNoEdit){
        this.editM = true;
      }else{
        this.editM = false;
      }
      if((this.ischange == index && ((this.currentStep < 10 && this.currentStep != 6 && this.currentStep != 2) && this.stepIdx != -1) || this.currentStep == 18)){
        return true
      }else{
        return false
      }
    },
    tableRowClassName ({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    onRowClick (row, event, column) {
      //立户后节点默认不可修改，鼠标点击行后该行可修改
      this.ischange= row.index;
      // console.log(this.ischange);
      if(this.currentStep>9){

      }

    },
    //复选框选中触发事件
    sendSelect(){

    },
    getSelectList(e){
          this.selectList=e
          this.selectAll=this.tableData
          this.$emit('selectTableData',this.selectList.length)
          eventBus.$emit("sendSelectList",this.selectList)

      },
    meterBuilderChange(userinfo){
      userinfo.meterBuilderName = this.workerNameList.filter(item=>item.userAccount ===  userinfo.meterBuilder)[0].userName;

    },
    getMeterBuilderAccount(name){
        let account = "";
        this.workerNameList.forEach(item => {
            if(item.userName == name){
                account = item.userAccount
            }
        })
        return account;
    },
    save(isPrint){
      // }

      // if(!this.validate()){
      //       this.$message({
      //       type: "error",
      //       message:  '水表信息未填完整（装表地址、水表模式、水表形式、水表表位）'
      //     });
      //   return;
      // }
      // this.tableData.map(row=>{
      //   console.log(row);
      // })
      if(this.tableData.length == 0){
        this.$message({
          type: 'error',
          message: "水表信息不能为空"
        })
        return
      }
      if(this.tableData.length>0){
        // 水表出库节点要增加对客户名称的校验
        if(this.currentStep == 8){
          for(let i = 0;i < this.tableData.length; i++){
            if(this.tableData[i].userInfo.ctmName == ""){
              this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行客户名称不能为空"
              })
              return
            }
          }
        }
        if(this.currentStep==9){
          for(let i=0;i<this.tableData.length;i++){
          // if(this.tableData[i].msInfo.factoryNo==''){
          //   this.$message({
          //     type:'error',
          //     message:'表身码不能为空'
          //   })
          //   return
          // }
          // if(this.tableData[i].userInfo.setupMeterDate==''){
          //   this.$message({
          //     type:'error',
          //     message:'装表日期不能为空'
          //   })
          //   return
          // }
            if(this.QRpjType == '2' || this.QRpjType == '3'){//要是在水表迁移或者水表扩缩
              if(this.tableData[i].userInfo.oldLastReadingNum == ""){
                this.$message({
                  type: 'error',
                  message: "第" + (i + 1) + "行旧表止码不能为空"
                })
                return
              }
            }
            if(this.tableData[i].userInfo.lastReadingNum === ''){
              this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行水表起码不能为空"
              })
              return
            }
          }
        }
        if(this.currentStep < 10){
          for(let i = 0;i < this.tableData.length; i++){
            if(this.tableData[i].msInfo.meterBore == ""){
              this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行水表口径不能为空"
              })
              return
            }
          }
        }
        if(this.currentStep == 18){
          for(let i = 0;i < this.tableData.length; i++){
            if(this.tableData[i].userInfo.mobile != "" && (/^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/).test(this.tableData[i].userInfo.mobile) == false){
             this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行手机号码格式不正确"
              })
              return
            }
            if(this.tableData[i].userInfo.stopWaterLinkMobile != "" && (/^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/).test(this.tableData[i].userInfo.stopWaterLinkMobile) == false){
             this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行通知人手机格式不正确"
              })
              return
            }
          }
        }
        if(this.editM){ //如果满足是梅州水司并且是【水表出库】节点
          for(let i = 0;i < this.tableData.length; i++){
            if(!this.tableData[i].userInfo.userNo){
              this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行用户编号不能为空"
              })
              return;
            }
            if(this.tableData[i].userInfo.userNo.length < 14){
             this.$message({
                type: 'error',
                message: "第" + (i + 1) + "行用户编号长度错误"
              })
              return;
            }
          }
        }
        let params = {
        busicode: "PjMeterBatchInsert",
        data: this.tableData.map((row, i)=>{
          if(row.accountNos == ""){
            row.accountNos = [];
          }
          if(row.userInfo.accountNos == ""){
            row.userInfo.accountNos = [];
          }
          if(row.hasOwnProperty("gsContract")){
            delete row.gsContract;//这个是不需要的，不能更改合同编号的相关信息
          }
          if(row.hasOwnProperty("sgContract")){
            delete row.sgContract;//这个是不需要的，不能更改合同编号的相关信息
          }
          // if(i == 0){
          //   row.userCtmTempId = this.data.userCtmTempId;
          //   row.userAccountTempId = this.data.userAccountTempId;
          // }
            row.consultId = this.id;
            if(row.accountInfo==""){
              row.userInfo.accountNos=undefined
              return {
              ...row,
              "discountData": undefined,
              "userMixtureData": undefined,
              "accountInfo":undefined,
              "ctmInfo":undefined,
              "index":undefined
             }
            }
            return {
              ...row,
              "discountData": undefined,
              "userMixtureData": undefined,
              "index":undefined
             }
          })
        };
        this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
         this.$message({
            type: "success",
            message: "保存成功"
          });
          this.init()
        //   if(isPrint != undefined && isPrint == true){ // 打印前需保存
        //       eventBus.$emit("exoprtSGPD",this.tableQuery.consultId)
        //   }
        });
      }else{
        let params = {
        busicode: "PjMeterBatchDelete",
        data: {
          consultId:this.tableQuery.consultId
        }
        };
        this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
         this.$message({
            type: "success",
            message: "保存成功"
          });
          this.init()
        //   if(isPrint != undefined && isPrint == true){ // 打印前需保存
        //       eventBus.$emit("exoprtSGPD",this.tableQuery.consultId)
        //   }
        });
      }
    },
    validate() {
      // if (this.stepIdx === 6) {
      //   if (!this.tableData.length) {
      //     return false;
      //   }
      //   for (let i = 0; i < this.tableData.length; i++) {
      //     // if(this.tableData[i].msInfo[ "factoryNo"] === ''){
      //     //   return false;
      //     // }
      //     if(this.tableData[i].userInfo[ "setupMeterDate"] === ''){
      //         this.$set(this.tableData[i].userInfo,'setupMeterDate',this.common.date());
      //     }
      //     if (
      //       [
      //         "setupMeterAddr",
      //         "meterBjms",
      //         "meterSite",
      //         "meterBjxs"
      //       ].some(key => this.tableData[i].userInfo[key] === "")
      //     ) {
      //       return false;
      //     }
      //   }
      // }

      return true;
    },
    orderSubmit() {
      this.tableData[this.rowIdx].userInfo = {
        ...this.tableData[this.rowIdx].userInfo,
        ...this.orderForm
      };
      this.sendOrderDialog = false;
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    order({ row, $index }) {
      this.sendOrderDialog = true;
      this.orderForm = { ...row.userInfo };
      this.rowIdx = $index;
    },
    closeSendOrderDialog() {
      this.sendOrderDialog = false;
    },
    ctrSubmit() {
      var list = this.$refs.concentratorInfoList.radioSelect;
      this.tableData[this.rowIdx].userInfo.concentratorNo = list.code;
      this.openConcentratorDialog = false;
    },
    openConcentratorOption(rowidx) {
      this.openConcentratorDialog = true;
      // if (concentratorNo) {
      //   this.concentratorQuery.concentratorNo = this.tableData[
      //     rowidx
      //   ].concentratorNo;
      // }
      this.rowIdx = rowidx;
    },
    closeConcentratorDialog() {
      this.openConcentratorDialog = false;
    },
    // 施工人员数据获取
    getWorkStaffList() {
      var _this = this;
      var params = {
        busicode: "PostUserSelect",
        data: { postNo: "8" }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.workerNameList = res;
        });
    },
    sortChange(column){
      if(column.prop == "gsContract.contractStatusName"){
        this.sortField = "contractStatus";
      }else{
        this.sortField = column.prop;
      }
      this.sortOrder =  column.order;
      this.init();
    },
    //初始化
    init() {
      let _this = this;
      this.tableQuery.consultId = this.id;
      this.selectIndexList = this.selectList.map(item => { return item.index }) // 保存勾选列表的index
      let params = {
        busicode: "PjMeterList",
        data: {
          consultId: this.tableQuery.consultId,
          sortField: this.sortField,
          sortOrder: this.sortOrder
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
            this.tableLength=res.length
            this.isInit = true;
            this.isTableDataChange = false; // 重置
          //this.tableData = JSON.parse(JSON.stringify(res));
        //   this.$nextTick(() => {

            res.forEach((item,i) => {
            item.userInfo.accountNos =    item.userInfo.accountNos === "" ? [] : item.userInfo.accountNos;

            });
               _this.tableData = res;

            if (this.tableData.length === 0) {
              // this.addRow();
            } else {
              _this.getConcentartorOptions(
                _this.tableData[0].userInfo.adminArea
              );
            }
            this.$nextTick(() => {
              this.selectIndexList.forEach(item => { // 勾选中列表
                this.$refs.table.toggleRowSelection(this.tableData[item], true);
              })
            })
            this.$emit("getMeterList", _this.tableData)
            this.acculateCount();
        //   });
        });
    },
    setMeterNo(idx,msInfo) {

      let meterObject = {};
      this.meterNos.forEach(element => {
        if (element.factoryNo == this.tableData[idx].msInfo.factoryNo) {
          meterObject = element;
          this.tableData[idx].msInfoId = element.id
          this.tableData[idx].msInfo.meterNo=element.meterNo
          // console.log(element);
          }
        });
        if(this.tableData.length>1){
          for(let i=0;i<this.tableData.length;i++){
            if(i!=idx){
              if(this.tableData[idx].msInfo.factoryNo==this.tableData[i].msInfo.factoryNo){
                this.tableData[idx].msInfo.factoryNo=""
                this.$message({
                  type:'error',
                  message:'表身码不可重复'
                })
                return
              }
            }
          }
        }
      //若水表号存在将相关字段值带入表单内
      for (let i in msInfo) {
        //  if(i !=='concentratorNo'||i !=='factoryNo'){     //特殊：为级联菜单且字段则是他本身（集中器）
        //      i = i + "Name";
        //     }
        for (let j in meterObject) {
          if (i == j) {
            msInfo[i] = meterObject[j];
          }
        }
      }

    },
    async getFactorysInfo(list) {
      let arr = [];
      // 水表信息
      arr = await this.$api.fetch({
        params: {
          busicode: "MsInfoList",
          data: {
            page: 1,
            factoryNoList:list,
            pageCount: 9999,
            fuzzyQuery: '',
            // factoryNo:res.userInfo.fatherMeterNo,
          }
        }
      });
      this.$set(this, "meterNos", arr.list);
      for(let i=0;i<arr.list.length;i++){
        this.factoryNoList.push(arr.list[i].factoryNo);
        this.meterNoList.push(arr.list[i].meterNo);
        this.meterModelNameList.push(arr.list[i].meterModelName);
        this.meterBoreList.push(arr.list[i].meterBore);
        this.meterBoreNameList.push(arr.list[i].meterBoreName);
        this.meterTypeNameList.push(arr.list[i].meterTypeName);

      }
      // console.log(this.factoryNoList);
      // console.log(this.meterNoList);
      // console.log(this.meterModelNameList);
      // console.log(this.meterBoreNameList);
      // console.log(this.meterTypeNameList);
      for(let i=0;i<this.tableData.length;i++){
            //console.log(this.tableData[i].msInfo.factoryNo);
            //console.log(typeof(this.meterNoList[i]));
            if(this.tableData[i].msInfo.factoryNo!=""&&typeof(this.tableData[i].msInfo.factoryNo)!="undefined"){
              //console.log(this.tableData[i].msInfo.factoryNo);
              for(let j=0;j<this.factoryNoList.length;j++){

                if(this.tableData[i].msInfo.factoryNo==this.factoryNoList[j]){
                  // setTimeout(()=>{
                  //console.log("hello");
                  this.tableData[i].msInfo.meterNo = this.meterNoList[j];
                  this.tableData[i].msInfo.meterModelName = this.meterModelNameList[j];
                  this.tableData[i].msInfo.meterBore = this.meterBoreList[j];
                  this.tableData[i].msInfo.meterBoreName = this.meterBoreNameList[j];
                  this.tableData[i].msInfo.meterTypeName = this.meterTypeNameList[j];
                  // })
                  break
                }
              }
            }
          }
    },
    async mTypeChange(val) {
      let arr = [];
      // 水表信息
      arr = await this.$api.fetch({
        params: {
          busicode: "MsInfoList",
          data: {
            page: 1,
            pageCount: 9999,
            fuzzyQuery: val,
            // factoryNo:res.userInfo.fatherMeterNo,
            meterStatus: "1"
          }
        }
      });
      this.$set(this, "meterNos", arr.list);
      for(let i=0;i<arr.list.length;i++){
        this.factoryNoList.push(arr.list[i].factoryNo);
        this.meterNoList.push(arr.list[i].meterNo);
        this.meterModelNameList.push(arr.list[i].meterModelName);
        this.meterBoreList.push(arr.list[i].meterBore);
        this.meterBoreNameList.push(arr.list[i].meterBoreName);
        this.meterTypeNameList.push(arr.list[i].meterTypeName);

      }
      // console.log(this.factoryNoList);
      // console.log(this.meterNoList);
      // console.log(this.meterModelNameList);
      // console.log(this.meterBoreNameList);
      // console.log(this.meterTypeNameList);
      for(let i=0;i<this.tableData.length;i++){
            //console.log(this.tableData[i].msInfo.factoryNo);
            //console.log(typeof(this.meterNoList[i]));
            if(this.tableData[i].msInfo.factoryNo!=""&&typeof(this.tableData[i].msInfo.factoryNo)!="undefined"){
              //console.log(this.tableData[i].msInfo.factoryNo);
              for(let j=0;j<this.factoryNoList.length;j++){

                if(this.tableData[i].msInfo.factoryNo==this.factoryNoList[j]){
                  // setTimeout(()=>{
                  //console.log("hello");
                  this.tableData[i].msInfo.meterNo = this.meterNoList[j];
                  this.tableData[i].msInfo.meterModelName = this.meterModelNameList[j];
                  this.tableData[i].msInfo.meterBore = this.meterBoreList[j];
                  this.tableData[i].msInfo.meterBoreName = this.meterBoreNameList[j];
                  this.tableData[i].msInfo.meterTypeName = this.meterTypeNameList[j];
                  // })
                  break
                }
              }
            }
          }
    },
    //初始化
    //  initDraft(val) {
    //   let _this = this
    //   this.tableQuery.consultId = val;
    //   let params = {
    //       "busicode": "PjMeterList",
    //       "data": {'consultId':this.tableQuery.consultId},
    //   }
    //   this.$api.fetch({
    //     params: params,//参数
    //   }).then(res => {
    //     _this.tableData = res;
    //     // _this.getConcentartorOptions(_this.tableData.adminArea)
    //   })

    // },
    getConcentartorOptions(val) {
      let params = {
        busicode: "ConcentratorSelect",
        data: { adminArea: val }
      };
      this.$api.fetch({ params }).then(res => {
        this.concentratorList = res;
      });
    },
    // changeAreaNull(val){
    //   for(let i =0;i<this.tableData.length;i++){
    //       this.tableData[i].bookNo='';
    //   }
    //   this.changeArea(val)
    // },
    // changeArea(val){
    //   let _this = this;

    //   if(val){
    //     let businessArea = this.common.handleTreeData(val);
    //     let params = {
    //       busicode: "BaseBookList",
    //       data: {"businessArea":businessArea,"page":1,"pageCount":99}
    //     };
    //       this.$api.fetch({
    //         params: params,//参数
    //       }).then(res => {
    //         this.businessAreaOptions = res.list;

    //       })
    //   }
    // },
    //水表录入-删除
    // reMove(id) {
    //   this.$confirm("确认删除该行数据？", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {

    //            var _this = this;
    //   var params = {
    //     busicode: "pjMeterDelete",
    //     data: {id:id?id:""}
    //   };
    //   this.$api
    //     .fetch({
    //       params: params //参数
    //     })
    //     .then(res => {

    //       this.init()
    //     });

    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    reMove(row){

      // let newTableData=[]
      //   for(let i=0;i<this.tableData.length;i++){
      //     if(this.tableData[i].id!=row.id){
      //       newTableData.push(this.tableData[i])
      //     }
      //   }
      // this.tableData=newTableData


      //根据index来删除
      let newTableData=[]
      for(let i=0;i<this.tableData.length;i++){
        if(i!=row.index){
          newTableData.push(this.tableData[i])
        }
      }
      this.tableData=newTableData
      this.acculateCount();
    },
    copyRow(row) {
      let cols = {
        setupMeterAddr: row.userInfo.setupMeterAddr, //安装地址
        meterBjms: row.userInfo.meterBjms, //模式
        meterBjxs: row.userInfo.meterBjxs, //形式
        meterSite: row.userInfo.meterSite //表位
      };
       let msInfo = undefined;
      if (this.businessStep) {
        Object.assign(cols, {
          ...row.userInfo
        });
          msInfo = {
          ...row.msInfo
        }

      }
      this.tableData.push({msInfoId:row.msInfoId,msInfo,planMeterInstallDate:row.planMeterInstallDate, userInfo: cols });
      this.acculateCount();
    },
    // 添加行
    addRow() {
      let cols = {
        setupMeterAddr: this.installAddr, //安装地址
        meterBjms: "", //模式
        meterBjxs: "", //形式
        meterSite: "" //表位
      };
      let msInfo = undefined;
      if (this.businessStep) {
        Object.assign(cols, {
          meterNo: "",
          fatherMeterNo: "",
          meterBuilder: '',
          setupMeterDate: "",
          concentratorNo: "",
          lastReadingNum:'',
          ctmName: this.ctmName, //客户名称
          certType: "", //客户证件类型
          certNo: "", //客户证件号码
          ctmAddr: "", //客户地址
          mobile: "", //手机号码
          stopWaterLinkMobile: "",//通知人手机
          oldLastReadingNum: "",//旧表止码
        });
        msInfo = {
          meterModel: "",
          meterBore: "",
          meterType: "",
          factoryNo: "",
          meterTypeName: "",
          meterModelName: "",
          meterBoreName: "",
        }

      }
      this.tableData.push({ msInfo:msInfo, planMeterInstallDate:'', userInfo: cols });
      this.acculateCount();
    },
    multipleAddRow(){
      this.multipleAddVisible = true;
    },
    closeDialog(){
      // 关闭批量添加弹出框
      this.multipleAddVisible = false;
      //调用函数把内容重置一下
      this.reset(); 
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.gridData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    reset () {
      this.gridData = [
        {
          useWaterType: "",
          meterBore: "",
          number: "",
        },
      ]
    },
    add () {
      this.gridData.push({
        useWaterType: "",
        meterBore: "",
        number: "",
      })
    },
    getInfo(){
      let gridData = this.gridData;
      let message = "";
      if(gridData.length > 0) {
        for (let i = 0; i < gridData.length; i++) {
          if (!gridData[i].meterBore || gridData[i].meterBore == '' || !gridData[i].number || gridData[i].number == '') {
            if (!gridData[i].meterBore || gridData[i].meterBore == '') {
              message = "第" + (i + 1) + "行水表口径不能为空";
            } else if (!gridData[i].number || gridData[i].number === '') {
              message = "第" + (i + 1) + "行数量不能为空";
            }
            this.$message({
              message,
              type: "warning"
            });
            return;
          }
        }
      }
      gridData = gridData.map(item => {
        return {
          useWaterType: item.useWaterType,
          meterBore: item.meterBore,
          number: item.number,
        }
      })
      // 获得到批量添加弹出框中的内容
      gridData.forEach(item=>{
        if(item.number > 0){
          for(let i = 0;i< item.number ;i++){
            let cols = {
              setupMeterAddr: this.installAddr, //安装地址
              meterBjms: "", //模式
              meterBjxs: "", //形式
              meterSite: "" //表位
            };
            let msInfo = undefined;
            if (this.businessStep) {
              Object.assign(cols, {
                meterNo: "",
                fatherMeterNo: "",
                meterBuilder: '',
                setupMeterDate: "",
                concentratorNo: "",
                lastReadingNum:'',
                useWaterType: item.useWaterType,
                useWaterTypeName: this.getuseWaterTypeName(item.useWaterType),
                ctmName: this.ctmName, //客户名称
                certType: "", //客户证件类型
                certNo: "", //客户证件号码
                ctmAddr: "", //客户地址
                mobile: "", //手机号码
                stopWaterLinkMobile: "",//通知人手机
                oldLastReadingNum: "",//旧表止码
              });
              msInfo = {
                meterModel: "",
                meterBore: item.meterBore,
                meterType: "",
                factoryNo: "",
                meterTypeName: "",
                meterModelName: "",
                meterBoreName: this.getMeterBoreNameById(item.meterBore),
              }
            }
            this.tableData.push({ msInfo:msInfo, planMeterInstallDate:'', userInfo: cols });
          }
        }
      })
      this.closeDialog();
      this.acculateCount();
    },
    acculateCount(){
      // 合计水表口径的数量
      let counts = {};
      this.numberArray = [];
      let changeIdToValue = [];
      this.tableData.forEach(item => {
       if(item.msInfo.meterBore != ""){
          let tempValue = this.meterBoreData.filter(item1=>item1.id === item.msInfo.meterBore)[0].boreValue;
          changeIdToValue.push({
            meterBoreValue: tempValue
          })
        }else{
          changeIdToValue.push({
            meterBoreValue: ""
          })
        }
      })
      changeIdToValue.forEach(item => {
        counts[item.meterBoreValue] = counts[item.meterBoreValue] ? counts[item.meterBoreValue] + 1 : 1;
      })
      for (let propName in counts) {
        this.numberArray.push({
          meterBoreId: propName,
          number: counts[propName]
        })
      }
    },
    getMeterBoreNameById(val){
      let tempVal = "未填";
      this.meterBoreData.forEach(item=>{
        if(item.id === val){
          tempVal = item.boreName;
        }
      })
      return tempVal;
    },
    getMeterBoreName(val){
      let tempVal = "未填";
      this.meterBoreData.forEach(item=>{
        if(item.boreValue == val){
          tempVal = item.boreName;
        }
      })
      return tempVal;
    },
    getuseWaterTypeName(val){
      return this.getNameArr(this.useWaterTypeOptions,val);
    },
    getNameArr(data,val){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          if(data[i].id == val){
            this.tempVal = data[i].name;
          }
        } else {
          this.getNameArr(data[i].children,val)
        }
      }
      return this.tempVal;
    },
    changeMeterBore(msInfoVal){
      msInfoVal.meterBoreName = this.meterBoreData.filter(item=>item.id ===  msInfoVal.meterBore)[0].boreName;
      this.acculateCount();
    },
    changeUseWaterType(userInfoVal,val){
      userInfoVal.useWaterTypeName = this.getNameArr(this.useWaterTypeOptions,val);
    },
    changeCertType(userInfoVal){
      userInfoVal.certTypeName = this.dictionaryData.IDT.filter(item=>item.value ===  userInfoVal.certType)[0].name;
    },
    //行业分类下拉框
    // SelectTradeClassifyOptions() {
    //   let _this = this
    //   let params = {
    //     "busicode": "TradeClassifySelect",
    //     "data": {
    //       // "businessAbodeId":id
    //     },
    //   }
    //   this.$api.fetch({
    //     params,//参数
    //   }).then(res => {
    //     _this.tradeClassifyOptions = res;
    //   })
    // },

    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    // 水表口径下拉数据
    getMeterBore () {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": { page: 1, pageCount: 999 }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list;
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        //         "data": "MMT,UWS,CMC,RTP,CTL"
        data: "BJXS,CTL,BJMS,IDT"
        //表井形式、模式
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    importExcel(file) {
      let _this = this;
      let params={}
      // 信息登记节点或者驳回到信息登记节点、施工勘察要使用新的接口
      // 为0，添加的时候
      // 为1，草稿，驳回到登记节点
      if(this.currentStep == 0 || this.currentStep == 1|| this.currentStep == 4){
        params = {
          busicode: "PjMeterRegisterImport",
          type: "import",
          consultId: this.tableQuery.consultId,
          data: {
            file: file.file,
            consultId: this.tableQuery.consultId,
          }
        };
      }else if(this.currentStep == 5 || this.currentStep == 6){
        params = {
          busicode: "PjMeterImport",
          type: "import",
          data: {
            file: file.file,
          }
        };
      }else if(this.currentStep == 18){//这个是供用水合同节点的导入内容
        params = {
          busicode: "PjMeterContractImport",
          type: "import",
          consultId: this.tableQuery.consultId,
          data: {
            file: file.file,
            consultId: this.tableQuery.consultId,
          }
        };
      }else{
        params = {
          busicode: "PjMeterInstallBuildImport",
          type: "import",
          consultId: this.tableQuery.consultId,
          data: {
            file: file.file,
            consultId: this.tableQuery.consultId,
          }
        };
      }

      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "导入成功"
          });
          this.tableData=[]
          this.tableData = this.tableData.concat(res);
          let list=[]
          for(let i=0;i<this.tableData.length;i++){
            list.push(this.tableData[i].msInfo.factoryNo)
          }
          // console.log(list)
          //console.log(res);
          this.getFactorysInfo(list)

        });
    },
    downloadExcel() {
      if(this.currentStep == 0 || this.currentStep == 1 || this.currentStep == 4){//如果是登记节点、施工勘察的下载模板，要用PjMeterRegisterExport接口
        var params = {
        busicode: "PjMeterRegisterExport",
          data: {
            "consultId":this.tableQuery.consultId,
          },
          token: sessionStorage.getItem("token"),
          sysType: "002"
        };
        window.open(this.common.getExportExcelIp() + "/project/exportExcel.api?json=" + encodeURI(JSON.stringify(params)));
      }else if(this.currentStep == 18){//如果是供水合同节点，需要另外的一个模板
        var params = {
        busicode: "PjMeterContractExport",
          data: {
            "projectId":this.tableQuery.consultId,
          },
          token: sessionStorage.getItem("token"),
          sysType: "002"
        };
        window.open(this.common.getExportExcelIp() + "/project/exportExcel.api?json=" + encodeURI(JSON.stringify(params)));
      }else {
        var params = {
        busicode:this.businessStep? "PjMeterInstallBuildExport":"PjMeterExport",
          data: {
                consultId:this.tableQuery.consultId,
                page:1,
                pageCount:99999
          },
          token: sessionStorage.getItem("token"),
          sysType: "002"
        };
        window.open(
          this.common.getExportExcelIp() +
            "/project/exportExcel.api?json=" +
            encodeURI(JSON.stringify(params))
        );
      }
    },
    openPreview(row) {
      if(row.gsContract.contractType == 2 || row.gsContract.contractType == 4){
        // 电子合同是直接弹出
        let params = {
          busicode: "newEcContractPreview",
          data: {
            "contractNo": row.gsContract.contractNo,
            "contractType": row.gsContract.contractType,
            "fileId": row.gsContract.fileId,
          },
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
        window.open( this.common.getExportExcelIp() + '/project/previewPdf.api?json=' + encodeURIComponent(JSON.stringify(params)))
      }else{
        if(row.gsContract.id){
          // 普通供水合同 = 3打开查看附件
          // 打开弹出框显示附件
          this.receiptAccessory = {
            receiptType: "pj_info_new",
            receiptId: row.gsContract.id
          }
          this.$nextTick(() => {
            this.viewAttachmentShow = true;
          })
        }else{
          this.$message({
            type: "warning",
            message: "暂无附件"
          });
        }
      }
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
    },
    indexMethod(index) {
      //获取表格序号
      return index + 1;
    },
    // 开户银行
    selectOABankOptions() {
      let _this = this;
      let params = {
        busicode: "BankTree",
        data: {},
      };
      this.$api.fetch({
        params, //参数
      })
      .then((res) => {
        let data = _this.getArr(res.children);
        _this.openABankOptions = data;
      });
    },
    getArr(data) {
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children;
        } else {
          this.getArr(data[i].children);
        }
      }
      return data;
    },
    // 银行账户按钮
    icCard(name, row) {
      if (this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面');
        return;
      }
      if(this.$store.state.photographic){
        // 这里是银行账户，高拍仪不支持银行卡，所以只是提示，科荣高拍仪走下面的逻辑
        this.$message.error('设备只支持二代身份证以及附件！');
        return;
      }
      if (!this.ICCard.online) {
        this.$message.error('请连接高拍仪');
        return;
      }
      this.ICCard.IccCardPresent();
      setTimeout(() => {
        // 检测IC卡槽是否插卡，若没插卡则启动磁条读取(大于-1则卡槽有卡)
        if (this.ICCard.getData('code') > -1) {
          this.ICCard.IccGetInfo(name);
          setTimeout(() => {
            const bankAccount = this.ICCard.getData(name);
            row.accountInfo.bankAccount = (bankAccount && bankAccount.length > 0) && bankAccount;
            }, 4000);
        } else {
          this.MsgCard.RAWCard(name);
          setTimeout(() => {
            console.log(this.MsgCard.getData(name));
            row.accountInfo.bankAccount = this.MsgCard.getData(name);
          }, 4000);
        }
      }, 100);
    },
    // 打印回执单，套打（运维上面有配置模板）
    printReceipt(){
      let tempId = [];
      tempId = this.selectList.map(item => item.id);
      this.selectList
      let params = {
        busicode: "PjConstructionReceiptPrint",
        data: tempId, // 水表信息中勾选的id数组
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
        this.common.printOne('view', 'PjConstructionReceiptPrint', '', data[0], this);
      })
    },
    //多水表保存
    //     SaveWaterMeter(val){
    //       var _this = this
    //       let test = [];
    //       console.log(this.tableData);
    //       for(let i =0;i<this.tableData.length;i++){
    //         let data ={
    //           'id': _this.tableData[i].id ,
    //           'userNo': _this.tableData[i].userNo ,//用户编号
    //           'houseCert': _this.tableData[i].houseCert ,//房产证号
    //           'contractNo': _this.tableData[i].contractNo ,//供水合同编号
    //           'contractAddr': _this.tableData[i].contractAddr ,//供水合同签订地址
    //           'contractDate': _this.tableData[i].contractDate ,//供水合同签订时间
    //           'openDate': _this.tableData[i].openDate ,//开户日期
    //           'comments': _this.tableData[i].comments ,//备注
    //           'tradeClassify': _this.tableData[i].tradeClassify ,//行业分类
    //           'meterType': _this.tableData[i].meterType ,//水表类型
    //           'useWaterObject': _this.tableData[i].useWaterObject ,//用水对象
    //           'meterUse': _this.tableData[i].meterUse ,//行业分类
    //           'fatherMeterNo': _this.tableData[i].fatherMeterNo ,//总表编号
    //           'meterNo': _this.tableData[i].meterNo ,//水表编号
    //           'setupMeterAddr': _this.tableData[i].setupMeterAddr ,//装表地址
    //           'setupMeterLocation': _this.tableData[i].setupMeterLocation ,//装表位置
    //           'setupMeterDate': _this.tableData[i].setupMeterDate ,//装表日期
    //           'bookNo': _this.tableData[i].bookNo ,//册本号
    //           'sortNo': _this.tableData[i].sortNo ,//排序号
    //           'meterReadingCycle': _this.tableData[i].meterReadingCycle ,//抄表周期
    //           'useWaterType': this.common.handleTreeData(_this.tableData[i].useWaterType) ,//用水类型
    //           'inflate': _this.tableData[i].inflate ,//是否加压
    //           'secondaryWater': _this.tableData[i].secondaryWater ,//是否二供
    //           'concentratorNo': _this.tableData[i].concentratorNo ,//集中器
    //         }
    //         test.push(data)
    //       }
    //       var params = {
    //         "busicode": "PjMeterSave",
    //         "data": {
    //           'consultId': val,
    //           'userInfo' : test
    //         }
    //       }
    //       this.$api.fetch({
    //         params: params,//参数
    //       }).then(res => {
    //         /*用水咨询只显示保存成功一次，故去掉这个
    //         this.$notify({
    //           title: '成功',
    //           message: '多水表保存成功',
    //           type: 'success'
    //         });*/
    //       })
    //     },
    // getData(){
    //   var _this = this
    //   let test = [];
    //   for(let i =0;i<this.tableData.length;i++){
    //     let data ={
    //       'id': _this.tableData[i].id ,
    //       'userNo': _this.tableData[i].userNo ,//用户编号
    //       'houseCert': _this.tableData[i].houseCert ,//房产证号
    //       'contractNo': _this.tableData[i].contractNo ,//供水合同编号
    //       'contractAddr': _this.tableData[i].contractAddr ,//供水合同签订地址
    //       'contractDate': _this.tableData[i].contractDate ,//供水合同签订时间
    //       'openDate': _this.tableData[i].openDate ,//开户日期
    //       'comments': _this.tableData[i].comments ,//备注
    //       'tradeClassify': _this.tableData[i].tradeClassify ,//行业分类
    //       'meterType': _this.tableData[i].meterType ,//水表类型
    //       'useWaterObject': _this.tableData[i].useWaterObject ,//用水对象
    //       'meterUse': _this.tableData[i].meterUse ,//行业分类
    //       'fatherMeterNo': _this.tableData[i].fatherMeterNo ,//总表编号
    //       'meterNo': _this.tableData[i].meterNo ,//水表编号
    //       'setupMeterAddr': _this.tableData[i].setupMeterAddr ,//装表地址
    //       'setupMeterLocation': _this.tableData[i].setupMeterLocation ,//装表位置
    //       'setupMeterDate': _this.tableData[i].setupMeterDate ,//装表日期
    //       'bookNo': _this.tableData[i].bookNo ,//册本号
    //       'sortNo': _this.tableData[i].sortNo ,//排序号
    //       'meterReadingCycle': _this.tableData[i].meterReadingCycle ,//抄表周期
    //       'useWaterType': this.common.handleTreeData(_this.tableData[i].useWaterType) ,//用水类型
    //       'inflate': _this.tableData[i].inflate ,//是否加压
    //       'secondaryWater': _this.tableData[i].secondaryWater ,//是否二供
    //     }
    //     test.push(data)
    //   }
    //   return test
    // },
  },

  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    tableData:{
        handler(newVal, oldVal){
            if(this.isInit){ // 初始化tableData数据，不计入修改
                this.isInit = false;
                this.isTableDataChange = false;
                return;
            }
            this.isTableDataChange = true;
        },
        deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
// /deep/ .el-table tbody tr:hover>td { background-color: #b9d9dca8 !important }
/deep/ .icon1{
  .el-input__suffix {
  //设置clearable样式
  .el-icon-circle-close:before {
    // font-size: 16px;
    // font-family: 'iconfont';
    // content: '\e6f3';
    color: black !important;
    //background-color: aquamarine !important;
  }
  .el-input__icon{
    //margin-top:5px
    line-height: 1px !important;
  }
}
}

.water-meter {
  height: 100%;
  width: 100%;
  .col-2 {
    width: calc(46% + 10px);
  }

  #sendOrderDialog {
    .formBill {
      padding-top: 20px;
    }

    /deep/ .el-dialog {
      height: 40%;
    }
  }

  .button-dialog .el-dialog {
    height: 50%;
  }
  .el-input__icon {
    line-height: 0 !important;
  }
  .table-content {
    height: 40px;
    padding: 5px 0px 0px 0px;
    margin: 0 20px;

    font {
      font-weight: 700;
      padding: 5px 20px;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .add-line {
      float: right;
      margin-right: 20px;
      // margin-bottom: 5px;
      .el-button--info {
        background-color: #b5bac3;
        border-color: #b5bac3;
      }
    }
  }
  .Warehousing-table {
    /deep/ {
      .el-input--mini .el-input__inner {
        width: 100% !important;
      }
      .el-input .el-input__inner{
        padding: 0px !important;
      }
    }
    .el-input__prefix{
      display: none;
    }
  }
}
</style>

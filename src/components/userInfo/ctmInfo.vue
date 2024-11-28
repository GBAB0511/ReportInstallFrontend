<template>
  <!-- dyk -->
  <div class="ctmInfo">

    <!--开户 可编辑-用户+客户 -->
    <!-- 1客户管理-开户-详情/添加  已用 -->
    <!-- 2客户管理-过户-详情/添加  已用 -->
    <el-form v-if="formData.parentToChild == '4'" size="mini" class="formBill" :inline="true" :model="formData.ctmInfo" label-width="130px" ref="ruleForm" :rules="rules">

      <legend class="legendColumn">请修改 客户信息</legend>

        <el-form-item label="客户身份证号：" prop="certNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)"  v-model="formData.ctmInfo.certNo" clearable placeholder="" class="read-only" :disabled="formData.ctmEdit">
            <el-button slot="append" icon="el-icon-reading" type="primary" class="scanning-btn read-only" size='mini' :disabled="formData.userEdit"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="证件类型：" prop="certType">
          <!-- v-if="!formData.ctmEdit" -->
          <el-select clearable v-model="formData.ctmInfo.certType"  :disabled="formData.ctmEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in idtData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.certType" v-if="formData.ctmEdit" placeholder="" disabled  class="read-only"></el-input> -->
        </el-form-item>

        <el-form-item label="客户编号：" prop="ctmNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.ctmInfo.ctmNo" placeholder="" disabled clearable class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="客户名称：" prop="ctmName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.ctmInfo.ctmName" :disabled="formData.ctmEdit" clearable placeholder="" class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="客户地址：" prop="ctmAddr">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.ctmInfo.ctmAddr" :disabled="formData.ctmEdit" clearable placeholder="" class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="客户类型：" prop="ctmType">
           <!-- v-if="!formData.ctmEdit" -->
          <el-select clearable v-model="formData.ctmInfo.ctmType" :disabled="formData.ctmEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in cttData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.ctmType" v-if="formData.ctmEdit" placeholder="" disabled  class="read-only"></el-input> -->
        </el-form-item>

        <el-form-item label="信用等级：" prop="creditLevel">
          <!-- v-if="!formData.ctmEdit" -->
          <el-select clearable v-model="formData.ctmInfo.creditLevel" :disabled="formData.ctmEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in cdlData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmInfo.creditLevel" v-if="formData.ctmEdit" placeholder="" disabled  class="read-only"></el-input> -->
        </el-form-item>

        <el-form-item label="固定电话：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.ctmInfo.linkTel" :disabled="formData.ctmEdit" clearable placeholder="" class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="手机号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.ctmInfo.mobile" :disabled="formData.ctmEdit" placeholder="" class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="传真号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.ctmInfo.faxNumber" :disabled="formData.ctmEdit" placeholder="" class="read-only"></el-input>
        </el-form-item>

    </el-form>
    
    <el-form v-if="formData.parentToChild == '4'" size="mini" class="formBill" :inline="true" :model="formData.userInfo" label-width="130px" ref="ruleForm" :rules="rules">

      <legend class="legendColumn">请修改 用户信息</legend>
        <el-form-item label="用户编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userWaterInfo.userNo" clearable disabled class="read-only" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="房地产编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.houseCert" clearable placeholder="" class="read-only" :disabled="formData.userEdit"></el-input>
        </el-form-item>

        <!-- <el-form-item label="用户状态：">
          <el-select clearable v-model="formData.userInfo.status" v-if="formData.isEdit" disabled  placeholder="" class="read-only">
            <el-option v-for="(item,index) in cusData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userInfo.status"   placeholder="" disabled  class="read-only"></el-input>
        </el-form-item> -->

        <el-form-item label="合同编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.contractNo" clearable placeholder="" class="read-only" :disabled="formData.userEdit">
            <el-button slot="append" :disabled="formData.userEdit" icon="el-icon-s-order" type="primary" class="scanning-btn" size='mini' title="打印合同"></el-button>
          </el-input>
        </el-form-item>

        <!--无此字段  -->
        <el-form-item label="合同地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.contractAddr" clearable placeholder="" class="read-only" :disabled="formData.userEdit"></el-input>
        </el-form-item>

        <el-form-item label="签订日期：">
          <el-date-picker v-model="formData.userInfo.contractDate" value-format='yyyy-MM-dd' type="date" class="read-only" placeholder="" :disabled="formData.userEdit">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="营业所：" prop="businessAbode">
          <el-select clearable @change='changeBAbode(formData.userInfo.businessAbode)' v-model="formData.userInfo.businessAbode" v-if="!formData.isEdit" :disabled="formData.isEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in businessAbodeData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.businessAbodeName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="营业区域：" prop="businessArea">
          <el-select clearable v-model="formData.userInfo.businessArea" v-if="!formData.isEdit" :disabled="formData.isEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in businessAreaData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.businessAreaName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="行政区域：" prop="adminArea">
          <!-- <el-select clearable v-model="formData.userInfo.adminAreaName" v-if="!formData.isEdit" :disabled="formData.isEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in districtTreeData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select> -->
          <el-cascader
            v-if="!formData.isEdit"
            ref="cascader1"
            :disabled="formData.isEdit"
            v-model="formData.userInfo.adminArea"
            :options="districtTreeData"
            :show-all-levels="false"
            :props="props"
            @change="areaHandleChange">
          </el-cascader>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.adminAreaName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>
        
        <el-form-item label="行业分类：">
          <el-select clearable v-model="formData.userInfo.tradeClassify" placeholder="" v-if="!formData.isEdit" class="read-only" :disabled="formData.userEdit">
            <el-option v-for="(item,index) in tradeClassifyData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.tradeClassifyName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="用水期限：">
          <el-date-picker v-model="formData.userInfo.useTimeLimit" value-format='yyyy-MM-dd' v-if="!formData.userEdit" type="date" class="read-only" placeholder="" :disabled="formData.userEdit">
          </el-date-picker>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.useTimeLimit" v-if="formData.userEdit" placeholder="" disabled  class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="comments" class="comments f2">
          <el-input type="textarea" v-model="formData.userInfo.comments" class="read-only" clearable placeholder="" :disabled="formData.userEdit">
          </el-input>
        </el-form-item>
      <legend class="legendColumn">请修改 用户-抄表信息 </legend>
          <el-form-item label="册本号：" prop="bookNo">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.bookNo" placeholder="" class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="排序号：" prop="sortNo">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.sortNo" placeholder="" class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="抄表日：" prop="lastReadingDate">
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userInfo.lastReadingDate" placeholder=""></el-input> -->
            <el-date-picker v-model="formData.userInfo.lastReadingDate" value-format='yyyy-MM-dd' type="date" placeholder="" class="read-only">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="抄表周期：" prop="meterReadingCycle">
            <el-select clearable v-model="formData.userInfo.meterReadingCycle" placeholder="" class="read-only">
              <el-option v-for="(item,index) in rtpData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.userInfo.meterReadingCycle" placeholder=""  disabled class="read-only"></el-input> -->
          </el-form-item>
          <el-form-item label="最后抄码：" prop="lastReadingNum">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.lastReadingNum" placeholder="" class="read-only"></el-input>
          </el-form-item>
      <!-- 过户模块 水表信息不可修改 -->
      <font v-if="formData.legendTwo == '2'">
        <legend class="legendColumn">用户-水表信息</legend>
          <el-form-item label="水表编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.meterNo" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>

          <el-form-item label="水表表身号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.factoryNo" disabled placeholder="" class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="装表地址：" prop="setupMeterAddr">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterAddr" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="装表位置：">
            <!-- <el-select clearable v-model="formData.userInfo.setupMeterLocation" placeholder="" disabled class="read-only">
              <el-option v-for="(item,index) in ctlData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterLocation" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="总表编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.fatherMeterNo" disabled placeholder="" class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表类型：" prop="meterTypeName">
            <!-- <el-select clearable v-model="formData.msInfo.meterType" disabled placeholder="" class="read-only">
              <el-option v-for="(item,index) in mmtData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterTypeName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="虚拟计算公式：" >
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.virtualDesignFormulas" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表用途：" prop="meterUse">
            <!-- <el-select clearable v-model="formData.userInfo.meterUse" placeholder="" disabled class="read-only">
              <el-option v-for="(item,index) in cmcData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.meterUse" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="用水对象：" prop="useWaterObject">
            <!-- <el-select clearable v-model="formData.userInfo.useWaterObject" placeholder="" disabled class="read-only">
              <el-option v-for="(item,index) in uwsData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.useWaterObject" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表口径：" prop="meterBoreName">
            <!-- <el-select clearable disabled class="read-only" v-model="formData.caliber" placeholder="15">
                    <el-option v-for="(item,index) in formData.caliberoptions" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterBoreName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表厂家：" prop="meterFactoryName">
            <!-- <el-select clearable disabled class="read-only" v-model="formData.caliber" placeholder="">
                    <el-option v-for="(item,index) in formData.caliberoptions1" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterFactoryName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表型号：" prop="meterModelName">
            <!-- <el-select clearable disabled class="read-only" v-model="formData.caliber" placeholder="">
                    <el-option v-for="(item,index) in formData.caliberoptions2" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterModelName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="装表日期：" prop="setupMeterDate">
            <!-- <el-date-picker v-model="formData.userInfo.setupMeterDate" type="date" placeholder="" disabled class="read-only">
            </el-date-picker> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterDate" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
         <el-form-item label="换表日期：" prop="changeMeterDate">
            <el-date-picker v-model="formData.userInfo.changeMeterDate" type="date" placeholder="" disabled class="read-only">
            </el-date-picker> 
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.changeMeterDate" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="拆表日期：" prop="splitMeterDate">
            <!-- <el-date-picker v-model="formData.userInfo.splitMeterDate" type="date" placeholder="选择日期" disabled class="read-only">
            </el-date-picker> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.splitMeterDate" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="拆表类型：" prop="splitMeterWay">
            <!-- <el-date-picker v-model="formData.userInfo.splitMeterDate" type="date" placeholder="选择日期" disabled class="read-only">
            </el-date-picker> -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.splitMeterWay" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="远传通讯费：" prop="transCommFee">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.transCommFee" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="通讯运营商：" prop="commOperator">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.commOperatorName" placeholder="" disabled class="read-only"></el-input>
            <!-- <el-select clearable v-model="formData.msInfo.commOperator" placeholder="" disabled class="read-only">
              <el-option v-for="(item,index) in txsData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="通讯费开始日期：" prop="commFeeStart">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.commFeeStart" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="通讯费结束日期：" prop="commFeeEnd">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.commFeeEnd" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
      </font>

      <!-- 开户模块 水表信息可修改 -->
      <font v-else>
        <legend class="legendColumn">请修改 用户-水表信息 </legend>
          <el-form-item label="水表类型：" prop="meterType">
            <!-- userWaterInfoChanged.meterTypeName -->
            <el-select clearable v-model="formData.userInfo.meterType" v-if="!formData.isEdit" :disabled="formData.isEdit" class="read-only" placeholder="">
              <el-option v-for="(item,index) in wmtData" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
            <!-- userWaterInfoChanged.meterTypeName -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userWaterInfo.meterTypeName" v-if="formData.isEdit" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表编号：" prop="meterNo">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.meterNo" placeholder="" class="read-only" :disabled="formData.isEdit" @blur="blurChange(formData.userInfo.meterNo,'')"></el-input>
          </el-form-item>

          <el-form-item label="水表表身号：" prop="factoryNo">
            <!-- userWaterInfoChanged.factoryNo -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.factoryNo" placeholder="" class="read-only" @blur="blurChange('',userWaterInfo.factoryNo)"></el-input>
          </el-form-item>
          <el-form-item label="装表地址：" prop="setupMeterAddr">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.setupMeterAddr" placeholder="" class="read-only" :disabled="formData.isEdit"></el-input>
          </el-form-item>
          <el-form-item label="装表位置：" prop="setupMeterLocation">
            <el-select clearable v-model="formData.userInfo.setupMeterLocation" placeholder="" class="read-only" v-if="!isEdit" :disabled="formData.isEdit">
              <el-option v-for="(item,index) in ctlData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterLocation" v-if="isEdit" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="总表编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.fatherMeterNo"  placeholder="" class="read-only"></el-input>
          </el-form-item>
          
          <el-form-item label="虚拟计算公式：" v-if="formData.TypesWaterUse == 2">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.yuyuy" placeholder="" :disabled="formData.isEdit" class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表用途：" prop="meterUse">
            <el-select clearable v-model="formData.userInfo.meterUse" v-if="!formData.isEdit" placeholder="" :disabled="formData.isEdit" class="read-only">
              <el-option v-for="(item,index) in cmcData" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.meterUse" v-if="formData.isEdit" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="用水对象：" prop="useWaterObject">
            <el-select clearable v-model="formData.userInfo.useWaterObject" placeholder="" v-if="!formData.isEdit" :disabled="formData.isEdit" class="read-only">
              <el-option v-for="(item,index) in uwsData" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.useWaterObject" v-if="formData.isEdit" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表口径：" prop="meterBoreName">
            <!-- userWaterInfoChanged.meterBoreName -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.meterBoreName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表厂家：" prop="meterFactoryName">
            <!-- userWaterInfoChanged.meterFactoryName -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.meterFactoryName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="水表型号：" prop="meterModelName">
            <!-- userWaterInfoChanged.meterModelName -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.meterModelName" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="远传通讯费：" prop="transCommFee">
            <!-- userWaterInfoChanged.transCommFee -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.transCommFee" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="通讯运营商：" prop="commOperatorName">
            <!-- userWaterInfoChanged.commOperatorName -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.commOperatorName" placeholder="" disabled class="read-only"></el-input>
            <!-- <el-select clearable v-model="userWaterInfoChanged.commOperatorName" placeholder="" disabled class="read-only">
              <el-option v-for="(item,index) in txsData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="通讯费开始日期：" prop="commFeeStart">
            <!-- userWaterInfoChanged.commFeeStart -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.commFeeStart" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="通讯费结束日期：" prop="commFeeEnd">
            <!-- userWaterInfoChanged.commFeeEnd -->
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.commFeeEnd" placeholder="" disabled class="read-only"></el-input>
          </el-form-item>

      </font>
    </el-form>

    <el-form v-if="formData.parentToChild == '4'" size="mini" class="formBill" :inline="true" :model="formData.accountInfo" label-width="130px" ref="ruleForm" :rules="rules">
      <legend class="legendColumn">请修改 账户信息 </legend>
        <el-form-item label="账户编号：">
          <!-- v-if="!formData.accEdit" -->
          <el-select v-model="formData.accountInfo.accountNo"   class="read-only" :disabled="formData.accEdit" clearable size="mini">
            <el-option label="新开户" value=""></el-option>
            <el-option label="90218832" value="2"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.accountNo" v-if="formData.accEdit" placeholder="" disabled class="read-only"></el-input> -->
        </el-form-item>
        <el-form-item label="缴费方式：" prop="payWay">
           <!-- v-if="!formData.accEdit" -->
          <el-select clearable v-model="formData.accountInfo.payWay" class="read-only" :disabled="formData.accEdit" placeholder="">
            <el-option v-for="(item,index) in bpwData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.payWay" v-if="formData.accEdit" placeholder="" disabled class="read-only"></el-input> -->
        </el-form-item>
        <el-form-item label="账户类型：" prop="accountType">
           <!-- v-if="!formData.accEdit" -->
          <el-select clearable v-model="formData.accountInfo.accountType"  class="read-only" :disabled="formData.accEdit" placeholder="">
            <el-option v-for="(item,index) in actData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.accountType" v-if="formData.accEdit" placeholder="" disabled class="read-only"></el-input> -->
        </el-form-item>
        <el-form-item label="开户银行：">
          <!-- v-if="!formData.accEdit" -->
          <el-cascader
            v-if="!formData.accEdit"
            :disabled="formData.accEdit"
            v-model="formData.accountInfo.openAccountBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            @change="handleChange">
          </el-cascader>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.openAccountBankName" v-if="formData.accEdit" placeholder="" disabled class="read-only"></el-input> -->
        </el-form-item>

        <el-form-item label="开户名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.openAccountName" class="read-only" :disabled="formData.accEdit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="银行账户：" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="" v-model="formData.accountInfo.bankAccount" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="托号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.entrustNo" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="托收合同号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.entrustContract" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="投递方式：">
           <!-- v-if="!formData.accEdit"  -->
          <el-select clearable v-model="formData.accountInfo.deliverWay" class="read-only" placeholder="" :disabled="formData.accEdit">
            <el-option v-for="(item,index) in sdwData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.deliverWay" v-if="formData.accEdit" placeholder="" disabled class="read-only"></el-input> -->
        </el-form-item>
        <el-form-item label="投递地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.deliverAddr" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.emailAddr" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
      <legend class="legendColumn">请修改 开票信息</legend>
        <!-- <el-form-item label="发票类型：" prop="invoiceType">
         <el-select clearable v-model="formData.accountInfo.invoiceType" class="read-only"  placeholder="" :disabled="formData.accEdit">
            <el-option v-for="(item,index) in bbtData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
          <!-- v-if="!formData.accEdit" -->
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.accountInfo.invoiceType" placeholder="" v-if="formData.accEdit" disabled class="read-only"></el-input> -->

        <el-form-item label="单位名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceTitle" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceTax" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="联系地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceAddr" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="座机号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceLink" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：">
          <!-- v-if="!formData.accEdit" -->
          <el-cascader
            :disabled="formData.accEdit"
            v-model="formData.accountInfo.invoiceBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            @change="bankHandleChange">
          </el-cascader>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.accountInfo.invoiceBank" placeholder="" v-if="formData.accEdit" disabled class="read-only"></el-input> -->
        </el-form-item>
        <el-form-item label="银行账户：" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceAccount" placeholder="" class="read-only" :disabled="formData.accEdit"></el-input>
        </el-form-item>
    </el-form>

    <el-form v-if="formData.parentToChild == '4'" size="mini" class="formBill" :inline="true" :model="formData.userInfo" label-width="130px" ref="ruleForm" :rules="rules">
      
      <legend class="legendColumn">请修改 用户-价格信息 </legend>

        <el-form-item label="用水类型：">
          <el-select clearable v-model="formData.userInfo.useWaterType" v-if="!formData.isEdit" class="read-only" placeholder="" :disabled="formData.isEdit">
            <el-option v-for="(item,index) in bwtData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.useWaterTypeName" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="用水人口：" prop="ladderPersonNum">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.ladderPersonNum" class="read-only" placeholder="" :disabled="formData.isEdit"></el-input>
        </el-form-item>
        <el-form-item label="优惠策略：">
          <el-select clearable v-model="formData.userInfo.prefStrategyId" class="read-only" placeholder="" v-if="!formData.isEdit" :disabled="formData.isEdit">
            <el-option v-for="(item,index) in mmtData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.prefStrategyName" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="优惠证件号码：" prop="prefCertNo" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.prefCertNo" clearable placeholder="" :disabled="formData.userEdit" class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="优惠策略开始日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.prefBeginDate" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
          <el-date-picker v-model="formData.userInfo.prefBeginDate" value-format='yyyy-MM-dd' class="read-only" v-if="!formData.isEdit" type="date" placeholder="" :disabled="formData.isEdit">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优惠策略结束日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.prefEndDate" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
          <el-date-picker v-model="formData.userInfo.prefEndDate" value-format='yyyy-MM-dd' v-if="!formData.isEdit" class="read-only" type="date" placeholder="" :disabled="formData.isEdit">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="详细价格：">
          <el-button size="mini" type="primary" class="viewBtn">查看</el-button>
        </el-form-item>
        <!-- <el-form-item label="详细价格：" class="selectCheck">
          <el-table stripe border :data="histroyData.list" class="change-tables-table">
            <el-table-column type="index" label="NO." width="50">
            </el-table-column>

            <el-table-column prop="code" min-width="100" label="费用种类">
            </el-table-column>
            <el-table-column prop="code" min-width="100" label="计费策略名称">
            </el-table-column>

            <el-table-column prop="fixValue" min-width="80" label="开始水量">
            </el-table-column>

            <el-table-column prop="flux" min-width="80" label="结束水量">
            </el-table-column>

            <el-table-column prop="flux" min-width="50" label="单价">
            </el-table-column>

            <el-table-column prop="flux" min-width="50" label="系数">
            </el-table-column>

            <el-table-column prop="daytime" min-width="100" label="阶梯起始金额">
            </el-table-column>

          </el-table>
        </el-form-item> -->
    </el-form>

    <!-- 不可编辑-用户+客户  -->
    <!-- 1 工作台-客户资料按钮 -查看用户资料 已用 -->
    <!-- 2 工作台-列表点击用户编号-查看用户资料 已用 -->
    <!-- 3 客户管理-列表点击详情-查看用户资料 已用 -->
    <!-- 4 客户管理-客户资料按钮 -查看用户资料 -->
    <el-form v-if="formData.parentToChild == '2'" size="mini" class="formBill" :inline="true" :model="formData" label-width="130px" ref="ruleForm" :rules="rules">
      <legend class="legendColumn">客户信息</legend>

        <el-form-item label="客户编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.ctmNo" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="客户名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.ctmName" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="客户地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.ctmAddr" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="客户类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.ctmType" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="信用等级：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.creditLevel" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="联系人：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.linkMan" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="座机号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.linkTel" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="手机号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.ctmInfo.mobile" placeholder=""></el-input>
        </el-form-item>

      <legend class="legendColumn">用户信息</legend>
        <el-form-item label="用户编号：" prop="userNume">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" placeholder="" v-model="formData.userInfo.userNo"></el-input>
        </el-form-item>
        <el-form-item label="用户名称：" prop="userName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.userName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户地址：" prop="userAddr">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.userAddr" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="证件类型：" prop="certType">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.certType" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="证件号码：" prop="certNo" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.certNo" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkMan">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.linkMan" class="read-only"  disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="座机号码：" prop="linkTel">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.linkTel" class="read-only"  disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.email" class="read-only"  disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.mobile" class="read-only" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="传真号码：" prop="faxNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.faxNo" class="read-only" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="房地产编号：" prop="houseCert">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.houseCert" class="read-only" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注：" class="Remarks">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.comments" placeholder="" disabled class="read-only">
          </el-input>
        </el-form-item>

      <legend class="legendColumn">用户-分类信息</legend>
        <el-form-item label="锁定状态：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="lockFlag" placeholder="" disabled class="read-only">
          </el-input>
        </el-form-item>
        <el-form-item label="用户状态：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.status" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="合同编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only linkBtn" v-model="formData.userInfo.contractNo" placeholder="">
            <!-- <el-button slot="append" icon="el-icon-s-order" type="primary" class="scanning-btn" @click="" size='mini'></el-button> -->
            <el-button slot="append" type="text"   size='mini'>查看</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="合同地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.contractAddr" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="签订日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.contractDate" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="营业所：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.businessAbodeName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="行政区域：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.adminAreaName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="营业区域：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.businessAreaName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="行业分类：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.tradeClassifyName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="立户日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.openDate" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="停用日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.stopDate" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="注销日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.cancelDate" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用水期限：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.useTimeLimit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="拆表原因：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.splitMeterWay" placeholder=""></el-input>
        </el-form-item>

      <legend class="legendColumn">账户信息</legend>
        <el-form-item label="账户编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.accountNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="缴费方式：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.payWay" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="账户类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.accountType" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.openAccountBank" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="开户名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.openAccountName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="银行账户：" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="" v-model="formData.accountInfo.bankAccount" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="托号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.entrustNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="托收合同号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.entrustContract" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="托收类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.entrustContract" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
      <legend class="legendColumn">开票信息</legend>
        <!-- <el-form-item label="发票类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.accountInfo.invoiceType" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="单位名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceTitle" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceTax" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="联系地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceAddr" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="座机号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceLink" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceBank" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="银行账户：" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.invoiceBank" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="投递方式：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.accountInfo.deliverWay" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>

      <legend class="legendColumn">用户-水表信息</legend>
        <el-form-item label="水表编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.meterNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="水表表身号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.factoryNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="水表表身号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.factoryNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="装表地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterAddr" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="装表位置：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.setupMeterLocation" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="水表类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled class="read-only" v-model="userWaterInfoChanged.meterTypeName" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="水表类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.meterTypeName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="虚拟计算公式：" v-if="formData.TypesWaterUse == 2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.yuyuy" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表用途：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.meterUse" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用水对象：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled class="read-only" v-model="formData.userInfo.useWaterObject" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="水表口径：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.meterBoreName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="水表口径：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterBoreName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="水表厂家：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.meterFactoryName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="水表厂家：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterFactoryName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="水表型号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.meterModelName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="水表型号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.meterModelName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="装表日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!--el-form-item label="换表日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.changeMeterDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item-->
       <el-form-item label="换表日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.changeMeterDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="拆表日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.splitMeterDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="远传通讯费：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.transCommFee" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="远传通讯费：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.transCommFee" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="通讯运营商：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.commOperatorName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="通讯运营商：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.commOperatorName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="通讯费开始日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.commFeeStart" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="通讯费开始日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.commFeeStart" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <!-- <el-form-item label="通讯费结束日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userWaterInfoChanged.commFeeEnd" placeholder="" disabled class="read-only"></el-input>
        </el-form-item> -->
        <el-form-item label="通讯费结束日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.msInfo.commFeeEnd" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>

      <legend class="legendColumn">用户-抄表信息</legend>

        <el-form-item label="册本号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.bookNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="排序号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.sortNo" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="抄表日：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.lastReadingDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="抄表周期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.meterReadingCycle" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="最后抄码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.lastReadingNum" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="投递标记：">
          <el-radio v-model="formData.userInfo.deliverFlag" :label="0" disabled>是</el-radio>
          <el-radio v-model="formData.userInfo.deliverFlag" :label="1" disabled>否</el-radio>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.postalCode" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="投递备注：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.deliverAddr" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>

      <legend class="legendColumn">用户-价格信息</legend>

        <el-form-item label="用水类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.useWaterTypeName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="优惠策略：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.prefStrategyName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="优惠证件号码：" prop="prefCertNo" style="width: calc(46% + 10px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.prefCertNo" clearable placeholder="" :disabled="formData.userEdit" class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="优惠策略开始日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.lastReadingDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="优惠策略结束日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.lastReadingDate" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="用水人口：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.ladderPersonNum" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="详细价格：">
          <el-button size="mini" type="text" class="viewBtn">查看</el-button>
        </el-form-item>
        <!-- <el-form-item label="详细价格：" class="selectCheck">
          <el-table stripe border :data="histroyData.list" class="change-tables-table">
            
            <el-table-column type="index" label="NO." width="50">
            </el-table-column>

            <el-table-column prop="code" min-width="100" label="费用种类">
            </el-table-column>
            <el-table-column prop="code" min-width="100" label="计费策略名称">
            </el-table-column>

            <el-table-column prop="fixValue" min-width="80" label="开始水量">
            </el-table-column>

            <el-table-column prop="flux" min-width="80" label="结束水量">
            </el-table-column>

            <el-table-column prop="flux" min-width="50" label="单价">
            </el-table-column>

            <el-table-column prop="flux" min-width="50" label="系数">
            </el-table-column>

            <el-table-column prop="daytime" min-width="100" label="阶梯起始金额">
            </el-table-column>

          </el-table>
        </el-form-item> -->

    </el-form>

    <!-- 可编辑-用户  -->
    <!-- 1 客户管理-变更-用户资料修改-->
    <el-form v-if="formData.parentToChild == '3'" size="mini" class="formBill" :inline="true" :model="formData" label-width="130px" ref="ruleForm" :rules="rules">
      <legend class="legendColumn">用户信息</legend>
      <el-form-item label="用户编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userNume" placeholder="09024334" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="用户名称：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.isfines" disabled class="read-only" placeholder="有限公司"></el-input>
      </el-form-item>
      <el-form-item label="用户地址：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.isfines" :disabled="isEdit" placeholder="有限公司"></el-input>
      </el-form-item>
      <el-form-item label="证件类型：">
        <el-select clearable v-model="formData.idcardType" :disabled="!formData.isEdit" v-if="formData.isEdit" placeholder="居民身份证">
          <el-option v-for="(item,index) in formData.idcardTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.idcardType" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="证件号码：" class="" style="width: calc(46% + 10px)">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.isfines" :disabled="isEdit" placeholder="">
          <el-button slot="append" icon="el-icon-reading" type="primary" class="scanning-btn" size='mini'></el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="v.label" v-for="(v,i) in formData.ComparisonTableInfoForm" :key="i">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item :label="v.label" v-for="(v,i) in formData.ComparisonTableInfoForm1" :key="i">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips"></el-input>
      </el-form-item>
      <el-form-item label="备注：" class="Remarks">
        <el-input type="textarea" v-model="formData.desc1" placeholder="请输入备注" :disabled="isEdit">
        </el-input>
      </el-form-item>

      <legend class="legendColumn">用户-分类信息</legend>
      <el-form-item label="锁定状态：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.desc1" placeholder="锁定" :disabled="isEdit" class="read-only">
        </el-input>
      </el-form-item>

      <el-form-item label="用户状态：">
        <el-select clearable v-model="formData.userStuse" placeholder="" v-if="!formData.isEdit" :disabled="formData.isEdit">
          <el-option v-for="(item,index) in formData.userStuseOption" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userStuse" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
      </el-form-item>

      <el-form-item label="合同编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.isfines" :disabled="isEdit" placeholder="">
          <el-button slot="append" icon="el-icon-s-order" type="primary" class="scanning-btn" size='mini'></el-button>
        </el-input>

      </el-form-item>

      <el-form-item label="合同地址：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.isfines" :disabled="isEdit" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="签订日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.isfines" :disabled="isEdit" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="营业所：">
        <el-select clearable v-model="formData.region" :disabled="!formData.isEdit" v-if="formData.isEdit" placeholder="城区">
          <el-option v-for="(item,index) in formData.areas" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.region" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="行政区域：">
        <el-select clearable v-model="formData.desc" :disabled="isEdit"  v-if="!formData.isEdit"  placeholder="城区">
          <el-option v-for="(item,index) in formData.areas" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.areas" placeholder="" v-if="formData.isEdit" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="营业区域：">
        <el-select clearable v-model="formData.desc" :disabled="isEdit" placeholder="城区">
          <el-option v-for="(item,index) in formData.areas" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业分类：">
        <el-select clearable v-model="formData.TypesWaterUse1" :disabled="isEdit" placeholder="居民">
          <el-option v-for="(item,index) in formData.workType" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="v.label" v-for="(v,i) in formData.ComparisonTableInfoForm1" :key="i">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="v.value" :placeholder="v.tips" :disabled="isEdit"></el-input>
            </el-form-item> -->
      <el-form-item label="立户日期：">
        <el-date-picker v-model="formData.Remarks" :disabled="isEdit" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="停用日期：">
        <el-date-picker v-model="formData.Remarks1" :disabled="isEdit" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="注销日期：">
        <el-date-picker v-model="formData.Remarks2" :disabled="isEdit" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="用水期限：">
        <el-date-picker v-model="formData.userWaterTime" :disabled="isEdit" type="date" placeholder="选择用水期限">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="拆表原因：">
        <el-select clearable v-model="formData.isfinesResult" placeholder="">
          <el-option v-for="(item,index) in formData.isfinesOptinon" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <legend class="legendColumn">用户-水表信息</legend>
      <el-form-item label="水表编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.code" placeholder="" :disabled="isEdit"></el-input>
      </el-form-item>

      <el-form-item label="水表表身号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.code1" placeholder="009128321"></el-input>
      </el-form-item>
      <el-form-item label="装表地址：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.address" placeholder="" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="装表位置：">
        <el-select clearable v-model="formData.caliber5" placeholder="户内" :disabled="isEdit">
          <el-option v-for="(item,index) in formData.caliberoptions3" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型：">
        <el-select clearable v-model="formData.TypesWaterUse" :disabled="isEdit" placeholder="实体表">
          <el-option v-for="(item,index) in formData.TypesWwaterUse" :key="index" :label="item.name" :value="item.value"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="虚拟计算公式：" v-if="formData.TypesWaterUse == 2">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.yuyuy" placeholder="" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="水表用途：">
        <el-select clearable v-model="formData.WaterPropertie" placeholder="一般用途" :disabled="isEdit">
          <el-option v-for="(item,index) in formData.WaterProperties" :key="index" :label="item.name" :value="item.value"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="用水对象：">
        <el-select clearable v-model="formData.CategorieWaterUse" placeholder="用户表" :disabled="isEdit">
          <el-option v-for="(item,index) in formData.CategoriesWaterUse" :key="index" :label="item.name" :value="item.value"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="水表口径：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption1" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="水表厂家：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption2" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="水表型号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption3" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="新装日期：">
        <el-date-picker v-model="formData.Remarks3" type="date" placeholder="选择日期" disabled class="read-only">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="换表日期：">
        <el-date-picker v-model="formData.Remarks4" type="date" placeholder="选择日期" disabled class="read-only">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="拆表日期：">
        <el-date-picker v-model="formData.Remarks5" type="date" placeholder="选择日期" disabled class="read-only">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="远传通讯费：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption3" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="通讯运营商：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption3" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="通讯费开始日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption3" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="通讯费结束日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.caliberoption3" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>

      <legend class="legendColumn">用户-抄表信息</legend>
      <el-form-item label="册本号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.year" placeholder="003E"></el-input>
      </el-form-item>
      <el-form-item label="排序号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.year1" placeholder="1"></el-input>
      </el-form-item>
      <el-form-item label="抄表日：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.date1" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="抄表周期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.date2" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="最后抄码：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.date3" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="投递标记：">
        <el-radio v-model="formData.date4" label="1">是</el-radio>
        <el-radio v-model="formData.date4" label="2">否</el-radio>
      </el-form-item>
      <el-form-item label="邮政编码：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.date5" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="投递备注：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userNume" placeholder=""></el-input>
      </el-form-item>
    </el-form>

    <!--变更 用户资料变更 可编辑-用户-->
    <el-form v-if="formData.parentToChild == '5'" size="mini" class="formBill" :inline="true" :model="formData.userInfo" label-width="130px" ref="ruleForm" :rules="rules">

      <legend class="legendColumn">请修改 用户信息</legend>
        <el-form-item label="用户编号：">
          <!-- userWaterInfo.userNo -->
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.userNo" clearable disabled class="read-only" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="房地产编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.houseCert" clearable placeholder="" class="read-only" :disabled="formData.userEdit"></el-input>
        </el-form-item>

        <el-form-item label="合同编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.contractNo" clearable placeholder="" class="read-only" :disabled="formData.userEdit">
            <el-button slot="append" :disabled="formData.userEdit" icon="el-icon-s-order" type="primary" class="scanning-btn" size='mini' title="打印合同"></el-button>
          </el-input>
        </el-form-item>

        <!--无此字段  -->
        <el-form-item label="合同地址：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.contractAddr" clearable placeholder="" class="read-only" :disabled="formData.userEdit"></el-input>
        </el-form-item>

        <el-form-item label="签订日期：">
          <el-date-picker v-model="formData.userInfo.contractDate" value-format='yyyy-MM-dd' type="date" class="read-only" placeholder="" :disabled="formData.userEdit">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="营业所：" prop="businessAbode">
          <el-select clearable @change='changeBAbode(formData.userInfo.businessAbode)' v-model="formData.userInfo.businessAbode" v-if="!formData.isEdit" :disabled="formData.isEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in businessAbodeData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.businessAbodeName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="营业区域：" prop="businessArea">
          <el-select clearable v-model="formData.userInfo.businessArea" v-if="!formData.isEdit" :disabled="formData.isEdit" placeholder="" class="read-only">
            <el-option v-for="(item,index) in businessAreaData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.businessAreaName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>

        <el-form-item label="行政区域：" prop="adminArea">
          <el-cascader
            v-if="!formData.isEdit"
            ref="cascader2"
            :disabled="formData.isEdit"
            v-model="formData.userInfo.adminArea"
            :options="districtTreeData"
            :show-all-levels="false"
            :props="props"
            @change="areaHandleChange">
          </el-cascader>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.adminAreaName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>
        
        <el-form-item label="行业分类：">
          <el-select clearable v-model="formData.userInfo.tradeClassify" placeholder="" v-if="!formData.isEdit" class="read-only" :disabled="formData.userEdit">
            <el-option v-for="(item,index) in tradeClassifyData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.tradeClassifyName" placeholder="" v-if="formData.isEdit" disabled  class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="用水期限：">
          <el-date-picker v-model="formData.userInfo.useTimeLimit" value-format='yyyy-MM-dd' v-if="!formData.userEdit" type="date" class="read-only" placeholder="" :disabled="formData.userEdit">
          </el-date-picker>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.useTimeLimit" v-if="formData.userEdit" placeholder="" disabled  class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="comments" class="comments f2">
          <el-input type="textarea" v-model="formData.userInfo.comments" class="read-only" clearable placeholder="" :disabled="formData.userEdit">
          </el-input>
        </el-form-item>
      <legend class="legendColumn">请修改 用户-抄表信息 </legend>
        <el-form-item label="册本号：" prop="bookNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.bookNo" placeholder="" class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sortNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.sortNo" placeholder="" class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="抄表日：" prop="lastReadingDate">
          <el-date-picker v-model="formData.userInfo.lastReadingDate" value-format='yyyy-MM-dd' type="date" placeholder="" class="read-only">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抄表周期：" prop="meterReadingCycle">
          <el-select clearable v-model="formData.userInfo.meterReadingCycle" placeholder="" class="read-only">
            <el-option v-for="(item,index) in rtpData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后抄码：" prop="lastReadingNum">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.lastReadingNum" placeholder="" class="read-only"></el-input>
        </el-form-item>
      <legend class="legendColumn">请修改 用户-水表信息 </legend>
        <el-form-item label="水表类型：" prop="meterType">
          <el-select clearable v-model="formData.userInfo.meterType" v-if="!formData.isEdit" :disabled="formData.isEdit" class="read-only" placeholder="">
            <el-option v-for="(item,index) in wmtData" :key="index" :label="item.name" :value="item.value"></el-option>

          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userWaterInfo.meterTypeName" v-if="formData.isEdit" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表编号：" prop="meterNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.meterNo" placeholder="" class="read-only" :disabled="formData.isEdit" @blur="blurChange(formData.userInfo.meterNo,'')"></el-input>
        </el-form-item>

        <el-form-item label="水表表身号：" prop="factoryNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.factoryNo" placeholder="" class="read-only" @blur="blurChange('',userWaterInfo.factoryNo)"></el-input>
        </el-form-item>
        <el-form-item label="装表地址：" prop="setupMeterAddr">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.setupMeterAddr" placeholder="" class="read-only" :disabled="formData.isEdit"></el-input>
        </el-form-item>
        <el-form-item label="装表位置：" prop="setupMeterLocation">
          <el-select clearable v-model="formData.userInfo.setupMeterLocation" placeholder="" class="read-only" v-if="!isEdit" :disabled="formData.isEdit">
            <el-option v-for="(item,index) in ctlData" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.setupMeterLocation" v-if="isEdit" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="总表编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.fatherMeterNo"  placeholder="" class="read-only"></el-input>
        </el-form-item>
        
        <el-form-item label="虚拟计算公式：" v-if="formData.TypesWaterUse == 2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="formData.userInfo.yuyuy" placeholder="" :disabled="formData.isEdit" class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表用途：" prop="meterUse">
          <el-select clearable v-model="formData.userInfo.meterUse" v-if="!formData.isEdit" placeholder="" :disabled="formData.isEdit" class="read-only">
            <el-option v-for="(item,index) in cmcData" :key="index" :label="item.name" :value="item.value"></el-option>

          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.meterUse" v-if="formData.isEdit" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="用水对象：" prop="useWaterObject">
          <el-select clearable v-model="formData.userInfo.useWaterObject" placeholder="" v-if="!formData.isEdit" :disabled="formData.isEdit" class="read-only">
            <el-option v-for="(item,index) in uwsData" :key="index" :label="item.name" :value="item.value"></el-option>

          </el-select>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.userInfo.useWaterObject" v-if="formData.isEdit" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表口径：" prop="meterBoreName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.meterBoreName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表厂家：" prop="meterFactoryName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.meterFactoryName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表型号：" prop="meterModelName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.meterModelName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="远传通讯费：" prop="transCommFee">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.transCommFee" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="通讯运营商：" prop="commOperatorName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.commOperatorName" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="通讯费开始日期：" prop="commFeeStart">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.commFeeStart" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="通讯费结束日期：" prop="commFeeEnd">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" clearable v-model="userWaterInfo.commFeeEnd" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
    </el-form>
  </div>

</template>
<script>
export default {
  name: "ctmInfo",
  props: ['commonPart'],
  data() {
    return {
      isEdit: false,
      childrenData: {},
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      lockFlag:'',//锁定状态
      // 用户水表信息
      userWaterInfo: {
        meterNo:'',
        factoryNo:'',
      },
      //用户水表信息可修改的
      userWaterInfoChanged: {},

      // 客户类型
      cttData: [],
      // 信用等级
      cdlData: [],
      // 账户类型
      actData: [],
      //发票类型
      bbtData: [],
      //证件类型
      idtData: [],
      //装表位置
      ctlData: [],
      //用水类型
      bwtData:[],
      mmtData: [],
      //水表用途
      cmcData: [],
      //用水对象
      uwsData: [],
      //投递方式
      sdwData: [],
      //缴费方式
      bpwData: [],
      //抄表周期
      rtpData: [],
      //用户状态
      cusData:[],
      //通讯运营商
      txsData:[],
      //水表类型
      wmtData:[],
      //营业所
      businessAbodeData:[],
      //营业区域
      businessAreaData:[],
      //行政区域
      districtTreeData:[],
      //开户行
      bankTreeData:[],
      //行业分类
      tradeClassifyData:[],
      bankName: [
        {
          name: "中国银行",
          value: '1'
        },
        {
          name: "中国农业银行",
          value: '2'
        },
        {
          name: "中国工商银行",
          value: '3'
        }
      ],
      rules: {
        certNo: [
          { required: true, message: '请输入客户身份证号', trigger: 'blur' },
        ],
        certType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' },
        ],
        ctmName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        ctmAddr: [
          { required: true, message: '请输入客户地址', trigger: 'blur' },
        ],
        ctmType: [
          { required: true, message: '请选择客户类型', trigger: 'blur' },
        ],
        creditLevel: [
          { required: true, message: '请选择信用等级', trigger: 'blur' },
        ],
        payWay: [
          { required: true, message: '请选择缴费方式', trigger: 'blur' },
        ],
        accountType: [
          { required: true, message: '请选择账户类型', trigger: 'blur' },
        ],
        // invoiceType: [
        //   { required: true, message: '请选择发票类型', trigger: 'blur' },
        // ],
        invoiceTitle: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
        ],
        invoiceTax: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
        ],
        invoiceAddr: [
          { required: true, message: '请输入联系地址', trigger: 'blur' },
        ],
        invoiceLink: [
          { required: true, message: '请输入座机号码', trigger: 'blur' },
        ],
        invoiceBank: [
          { required: true, message: '请选择开户银行', trigger: 'blur' },
        ],
        invoiceAccount: [
          { required: true, message: '请输入银行账户', trigger: 'blur' },
        ],
        businessAbode: [
          { required: true, message: '请选择营业所', trigger: 'blur' },
        ],
        businessArea: [
          { required: true, message: '请选择营业区域', trigger: 'blur' },
        ],
        adminArea: [
          { required: true, message: '请选择行政区域', trigger: 'blur' },
        ],
        meterType: [
          { required: true, message: '请选择水表类型', trigger: 'blur' },
        ],
      },
      histroyData: {},
      formData: {},

    }
  },
  created() {
    setTimeout(() => {
      this.formData = Object.assign({}, this.commonPart);
      console.log(this.formData.userInfo.businessAbode);
      if (this.formData.userInfo.businessAbode !== undefined) {
        this.changeBAbode(this.formData.userInfo.businessAbode)
      }
      if (this.formData.userInfo.meterNo !== '' && this.formData.userInfo.meterNo !== undefined) {
        this.blurChange(this.formData.userInfo.meterNo,this.userWaterInfo.factoryNo)
      }
      if (this.formData.id == '') {
        // this.blurChange()
        // 客户信息-客户编号 先传空 以后在联调
        this.formData.ctmInfo.ctmNo = '';
        this.formData.isEdit = false;
      }
      if(this.formData.userInfo.lockFlag == 0){
        this.$set(this,'lockFlag','锁定')
      }else{
        this.$set(this,'lockFlag','未锁定')
      }
      console.log(this.formData.isEdit,this.formData.isEdit == true);
      // if(this.formData.isEdit == true){
      //   this.formData.isEdit = true
      //   return
      // }
      if(this.formData.ctmInfo.ctmNo){
        this.formData.isEdit = false;
      }
      // if (!this.formData.id) {
      this.getDictionary()
      // }
      this.isEdit = this.formData.isEdit
      this.init();
    }, 0);
  },
  mounted() {
    
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
    init() {
      // this.getDictionary()
      this.getBusinessAbodeData();
      // this.getBusinessAreaData();
      this.getBankTreeData()
      this.getDistrictTreeData();
      this.getTradeClassifyData()
      if (this.formData.id !== '') {
        // 详情
        this.blurChange(this.formData.userInfo.meterNo,this.userWaterInfo.factoryNo)
      }else{
        // 新增
        this.formData.ctmEdit = false;
      }
    },
    toParentData(){
      let data = {};
      if (this.formData.userInfo.lockFlag == 0) {
        data.lockFlag = 1
      }else if (this.formData.userInfo.lockFlag == 1) {
        data.lockFlag = 0
      }
      return data;
    },
    // 输入框失去焦点调接口
    blurChange(meterNo,factoryNo) {
      // let _this = this;
      // // let meterNo = this.formData.userInfo.meterNo;
      // // let factoryNo = this.userWaterInfo.factoryNo;
      // if (!meterNo && !factoryNo) {
      //   this.$message({
      //     message: '水表编号或水表表身号必填一个',
      //     type: 'warning'
      //   });
      //   return
      // }
      // let params = {
      //   "busicode": "MsInfoList",
      //   "data": {
      //     page: 1,
      //     pageCount: 20,
      //     meterNo,
      //     factoryNo,
      //     meterStatus:"1",
      //   }
      // }
      // _this.$api.fetch({
      //   params,//参数
      // }).then(res => {
      //   if (res.list.length == 0) {
      //     this.$message({
      //       message: '查无此水表编号或水表表身号',
      //       type: 'warning'
      //     });
      //     _this.formData.userInfo.meterNo = '';
      //     return
      //   }
      //   _this.userWaterInfo = res.list[0]
      //   // 只拿来渲染 不用传给后端了。只传meterNo 水表编号
      //   _this.formData.userInfo.meterNo = _this.userWaterInfo.meterNo;
      //   // _this.userWaterInfoChanged = Object.assign({}, _this.userWaterInfo);
      //   // _this.formData.userInfo = Object.assign({}, _this.userWaterInfo);
      // })
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        alert(valid)
        if (valid) {
          alert('submit!');
        } else {
          alert('error submit!!');
          return false;
        }
      });
      let userWaterInfo = {
        setupMeterDate: null,
        splitMeterDate: null,
      }
      if (this.userWaterInfo !== undefined) {
        userWaterInfo.setupMeterDate = this.userWaterInfoChanged.setupMeterDate;
        userWaterInfo.splitMeterDate = this.userWaterInfoChanged.splitMeterDate;
      }
      Object.assign(this.formData.userInfo, userWaterInfo);
      // this.$refs['ruleForm'].resetFields();
      return this.formData
    },
    //  数据字典（查询框）
    getDictionary() {
      console.log('ctminfo');
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": 'CTT,CDL,ACT,IDT,CTL,MMT,UWS,BBT,SDW,BPW,RTP,CMC,CUS,TXS,WMT,BWT'
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.$set(_this, 'cttData', res['CTT'])
        _this.$set(_this, 'cdlData', res['CDL'])
        _this.$set(_this, 'actData', res['ACT'])
        _this.$set(_this, 'idtData', res['IDT'])
        _this.$set(_this, 'ctlData', res['CTL'])
        _this.$set(_this, 'mmtData', res['MMT'])
        _this.$set(_this, 'cmcData', res['CMC'])
        _this.$set(_this, 'uwsData', res['UWS'])
        _this.$set(_this, 'bbtData', res['BBT'])
        _this.$set(_this, 'sdwData', res['SDW'])
        _this.$set(_this, 'bpwData', res['BPW'])
        _this.$set(_this, 'rtpData', res['RTP'])
        _this.$set(_this, 'cusData', res['CUS'])
        _this.$set(_this, 'txsData', res['TXS'])
        _this.$set(_this, 'wmtData', res['WMT'])
        _this.$set(_this, 'bwtData', res['BWT'])
      })
    },
    chooseCtm() {
      this.$emit('chooseCtm', 'chooseCtm')
    },
    //开户银行下拉框值发生改变
    handleChange(value) {
      let length = value.length;
      this.formData.accountInfo.openAccountBank = value[length - 1]
    },
    //开户银行下拉框值发生改变
    bankHandleChange(value){
      let length = value.length;
      this.formData.accountInfo.invoiceBank = value[length - 1]
    },
    //行政区域下拉框值发生改变
    areaHandleChange(value){
      let length = value.length;
      this.formData.userInfo.adminArea = value[length - 1]
      this.$refs.cascader1 ? this.$refs.cascader1.dropDownVisible = false : null
      this.$refs.cascader2 ? this.$refs.cascader2.dropDownVisible = false : null
    },
    //营业所得下拉框
    getBusinessAbodeData() {
      let _this = this
      let params = {
        "busicode": "BusinessAbodeSelect",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.businessAbodeData = res;
      })
    },
    changeBAbode(id){
     //营业区域
      this.getBusinessAreaData(id);
    },
    //营业区域下拉框
    getBusinessAreaData(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaSelect",
        "data": {
          "businessAbodeId":id
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.businessAreaData = res;
      })
    },
    // 行政区域
    getDistrictTreeData() {
      let _this = this
      let params = {
        "busicode": "DistrictTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        if(data.children.length==0){
            delete data.children;
            _this.districtTreeData = [JSON.parse(JSON.stringify(data))];
            _this.formData.userInfo.adminArea = [data.id]
        }else{
          _this.districtTreeData= [JSON.parse(JSON.stringify(data))];
        }
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
    // 开户行下拉框
    getBankTreeData() {
      let _this = this
      let params = {
        "busicode": "BankTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.bankTreeData = data;
      })
    },
    //行业分类下拉框
    getTradeClassifyData() {
      let _this = this
      let params = {
        "busicode": "TradeClassifySelect",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tradeClassifyData = res;
      })
    },
  }
}
</script>
<style lang="scss">
.ctmInfo {
  height: 100%;
  .el-date-editor /deep/ .el-input__inner {
    width: 100% !important;
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
  .selectCheck {
    width: 95%;
  }
  .el-textarea.is-disabled .el-textarea__inner{
    background: #fff;
    color: #606266;
  }
  .viewBtn{
    padding:3px 8px;
    border-radius: 0;
    border-bottom: 1px solid #409eff;
  }
  .linkBtn{
    .el-input-group__append{
      text-align: center;
      border: 0;
      border-radius: 0;
      background: #fff;
      color: #409eff;
      .el-button{
        padding:3px 8px;
        border-radius: 0;
        border-bottom: 1px solid #409eff;
      }
    }
  }
}
</style>

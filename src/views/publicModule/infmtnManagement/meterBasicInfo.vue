<template>
  <div class="meterBasicInfo disable-item">
    <legend class="legendColumn">水表基础信息</legend>
    <el-form-item label="水表编号：" v-if="formData.meterNo">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterNo" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="水表表身号：" v-if="formData.meterNo">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.factoryNo" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="水表口径：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterBoreName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="水表厂家：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterFactoryName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="水表分类：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterTypeName" placeholder=""></el-input>
    </el-form-item>
        <el-form-item label="通讯类型：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.transmittalModelName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="水表型号：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterModelName" placeholder=""></el-input>
    </el-form-item>
     <!-- v-if="pageType === 'WaterMeterInquiryEdit'" -->
    <el-form-item label="是否阀控：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.valveControlName" placeholder=""></el-input>
    </el-form-item>
     <!-- <el-form-item label="是否远传：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.transmissionName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="下行规约：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.protocolName" placeholder=""></el-input>
    </el-form-item> -->
    <el-form-item label="结构类型：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterPatternName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="采样类型：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterSensorName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="满码值：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.maxValue" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="使用期限：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.shelfLife" placeholder=""></el-input>
    </el-form-item>
        <el-form-item label="新旧表：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterFormName" placeholder=""></el-input>
    </el-form-item>
        <!-- <el-form-item label="营业区域：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.departBelongName" placeholder=""></el-input>
    </el-form-item> -->
     <el-form-item label="远程通讯费：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.transCommFee" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="通讯运营商：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.commOperatorName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="通讯费开始日期：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.commFeeStart" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="通讯费结束日期：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.commFeeEnd" placeholder=""></el-input>
    </el-form-item>
    <!-- <el-form-item label="合格证号：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterCert" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="水表状态：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.meterStatusName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="注册日期：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.createTime" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="用户编号：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.userNo" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="客户名称：">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.ctmName" placeholder=""></el-input>
    </el-form-item> -->

    <el-form-item label="IMEI：" v-if="wayOpen=='inquiry'">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.imei" placeholder="" ></el-input>
    </el-form-item>
    <el-form-item label="IMSI：" v-if="wayOpen=='inquiry'">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.imsi" placeholder="" ></el-input>
    </el-form-item>
    <el-form-item label="SIM：" v-if="wayOpen=='inquiry'">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.sim" placeholder="" ></el-input>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: "meterBasicInfo",
  props: ['editType','wayOpen','pageType'],
  data() {
    return {
      formData: {
        meterNo: '',
        factoryNo: '',
        meterBoreName: '',
        meterFactoryName: '',
        meterFormName: '',
        meterTypeName: '',
        meterModelName: '',
        meterCert: '',
        meterStatusName: '',
        billDate: '',
        userNo: '',
        userName: '',
        departBelongName: '',
        transCommFee: '',
        commOperatorName: '',
        commFeeStart: '',
        commFeeEnd: '',
        imei: '',
        imsi: '',
      },
      // WaterMeterInquiryForm:{
      //   valveControlName:"",
      //   protocolName:"",
      //   meterFormName:"",
      //   meterSensorName:"",
      //   maxValue:"",
      //   shelfLife:"",
      // }
    }
  },
  methods: {
    // 数据初始化
    init(val) {
      if (val) {
        this.formData = val
        console.log(this.formData)
      }
    },
    // getWaterMeterInquiryData(val) {
    //   if (val) {
    //     this.WaterMeterInquiryForm = val
    //   }
    // }
  },
}
</script>
<style lang="scss">
.meterBasicInfo {
  height: 100%;
}
</style>
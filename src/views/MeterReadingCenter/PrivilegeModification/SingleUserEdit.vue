

<template>
  <div class="SingleUserEdit">

    <el-form class="formBill" size="mini" :inline="true" :model="formData" :disabled="NotDisabled" label-width="130px" ref="ruleForm" >
        
        <!-- 单据信息 -->
        <billInfo v-show="formType.type=='update'" ref="billInfo" ></billInfo>

        <legend class="legendColumn">用户信息</legend>
        
            <el-form-item label="账期：" :class="{'disable-item': formType.type!='add'}">
              
              <el-date-picker v-model="formData.accountPeriod" 
              v-if="formType.type=='add'"
              size="mini" type="month" format="yyyyMM" value-format="yyyyMM" placeholder="选择年月">
              </el-date-picker>
              <span v-else>{{formData.accountPeriod}}</span>
            </el-form-item>

            <el-form-item label="用户编号：" :class="{'disable-item': formType.type!='add'}">
                <el-input
                v-if="formType.type=='add'"
                class="read-only"
                v-model="formData.userNo"
                placeholder="请输入户号"
                clearable
                @keydown.enter.native="init"
                >
                </el-input>
                <span v-else>{{formData.userNo}}</span>
            </el-form-item>
                <el-button
                    v-if="formType.type=='add'"
                    class="searchBtn scanning-btn"
                    @click="init"
                    icon="el-icon-search"
                    size="mini"
                ></el-button>
                <br>
            <el-form-item label="客户名称：" prop="ctmName" class="disable-item">
                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmName" disabled class="read-only" placeholder=""></el-input> -->
                <span>{{formData.ctmName}}</span>
            </el-form-item>
            <el-form-item label="装表地址：" prop="setupMeterAddr" class="disable-item">
                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setupMeterAddr" disabled class="read-only"  placeholder=""></el-input> -->
                <span>{{formData.setupMeterAddr}}</span>
            </el-form-item>
            <el-form-item label="用水类型：" prop="useWaterType" class="disable-item">
                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.useWaterType" disabled class="read-only"  placeholder=""></el-input> -->
                <span>{{formData.useWaterType}}</span>
            </el-form-item>

        <legend class="legendColumn" >抄表信息</legend>
            <el-form-item label="上期抄表日期：" prop="priorPeriodDate" :class="{'disable-item': NotDisabled}">
                <el-date-picker v-if="!NotDisabled" v-model="formData.priorPeriodDate" placeholder="请选择" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                <span v-else>{{formData.priorPeriodDate}}</span>
            </el-form-item>
            <el-form-item label="上期水量：" prop="priorPeriodWater" class="disable-item}">
                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   v-model="formData.priorPeriodWater" placeholder="" disabled></el-input> -->
                <span >{{formData.priorPeriodWater}}</span>
            </el-form-item>
            <el-form-item label="上期抄码：" prop="priorPeriodNum" :class="{'disable-item': NotDisabled}">
                <el-input   v-if="!NotDisabled" type="number" v-model.number="formData.priorPeriodNum" placeholder="" @blur="waterNumErr" @input="getWaterNum" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'');}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
                <span v-else>{{formData.priorPeriodNum}}</span>
            </el-form-item>
            <el-form-item label="本期抄表日期：" prop="meterReadingDate" :class="{'disable-item': NotDisabled}">
                <el-date-picker v-if="!NotDisabled" v-model="formData.meterReadingDate" placeholder="请选择" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                <span v-else>{{formData.meterReadingDate}}</span>
            </el-form-item>
            <el-form-item label="本期抄码：" prop="currendPeriodNum" :class="{'disable-item': NotDisabled}">
                <el-input   type="number" v-if="!NotDisabled" v-model.number="formData.currendPeriodNum" placeholder="" @blur="waterNumErr" @input="getWaterNum" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
                <span v-else>{{formData.currendPeriodNum}}</span>
            </el-form-item>
            <el-form-item label="本期增减水量：" prop="addWater" :class="{'disable-item': NotDisabled}">
                <el-input   v-if="!NotDisabled" type="number" v-model.number="formData.addWater" placeholder="" @blur="waterNumErr" @input="getWaterNum"></el-input>
                <span v-else>{{formData.addWater}}</span>
            </el-form-item>
            <el-form-item label="本期水量：" prop="currendPeriodWater" class="disable-item">
                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.currendPeriodWater" placeholder="" disabled></el-input> -->
                <span>{{formData.currendPeriodWater}}</span>
            </el-form-item>

            <el-form-item label="备注：" class="Remarks" :class="{'disable-item': NotDisabled}">
                <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments"  placeholder="请输入备注"  ></el-input>
                <span v-else>{{formData.comments}}</span>
            </el-form-item>

        <legend v-if="formType.type=='update'" class="legendColumn">变更事项</legend>
            <changeMatters :changeMattersData="formData.changeItems" v-if="formType.type=='update'" class=""></changeMatters>

        <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
        <legend class="legendColumn">流程处理</legend>
            <div id="workflowDiv"></div>

    </el-form>

  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
import changeMatters from "@/components/changeMatters"//变更事项
export default {
  name: "SingleUserEdit",
  props: ["formType", "billStute"],
  components: {
    uploadFile,
    billInfo,
    changeMatters,
    procedure
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "MR_MODIFY",
      tempId: "",
      formData: {        
        "id": "",//抄表修改主键
        "userNo": "",//用户编号
        "ctmName": "",//客户名称
        "setupMeterAddr": "",//装表地址
        "useWaterType": "",//用水类型
        "meterReadingId": "",//抄表主键
        "accountPeriod": this.common.date('month'),//账期
        "priorPeriodDate": "",//上期抄表日
        "priorPeriodWater":'' ,//上期水量
        "priorPeriodNum": '',//上期抄码
        "meterReadingDate": "",//本期抄表日
        "currendPeriodNum":'',//本期抄码
        "currendPeriodWater": '',//本期水量
        "addWater": '',//增减水量
        "comments": "",//备注
        "processName": "",
        "billNo": "",
        "billDate": "",
      },
      approveFlag: 0,
      NotDisabled: false,
    };
  },
  mounted() {
      if (this.formType.type=='update') {
        this.init();
        eventBus.$emit('receiptId', this.formType.id)
      }else{
        this.tempId = this.util.generateUUID()
        eventBus.$emit('receiptId', this.tempId)
        this.getHtmlData()
      }
  },
  methods: {
    //初始化
    init() {
      let _this = this;
      let data = {}
      if (this.formType.type=='update') {
          data ={
            "id":this.formType.id,//抄表修改主键（保存后有此参数）
            "userNo":this.formType.userNo,//用户编号（新增时有此参数）
            "accountPeriod":this.formType.accountPeriod//账期（新增时有此参数）
          }
      } else {
          data ={
            "id":"",//抄表修改主键（保存后有此参数）
            "userNo":this.formData.userNo,//用户编号（新增时有此参数）
            "accountPeriod":this.formData.accountPeriod//账期（新增时有此参数）
          }
      }
      //清空
      let _data = this.formData
      _data.ctmName = ''
      _data.setupMeterAddr = ''
      _data.useWaterType = ''
      _data.meterReadingId = ''
      _data.priorPeriodDate = ''
      _data.priorPeriodWater = ''
      _data.priorPeriodNum = ''
      _data.meterReadingDate = ''
      _data.currendPeriodNum = ''
      _data.currendPeriodWater = ''
      _data.addWater = ''
      _data.comments = ''
      let params = {
        "busicode": "MrModifyQuery",
        "data": data,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        res.accountPeriod = res.accountPeriod+''
        _this.$set(_this, "formData", res);
        _this.$refs.billInfo.formData.billNo = res.billNo;
        _this.$refs.billInfo.formData.billDate = res.billDate;
        if (
          _this.formData.processState == "approval" ||
          _this.formData.processState == "END"
        ) {
          _this.NotDisabled = true;
          _this.approveFlag = 1;
        }
        
      this.getHtmlData()
      })
    },
    getFormbData(){
      let data = this.formData
      delete data.billDate
      delete data.setupMeterAddr
      delete data.useWaterType
      return data
    },
    submit(type){
      let data = this.formData
      delete data.billDate
      delete data.setupMeterAddr
      delete data.useWaterType
      if(this.tempId != '')
        data.tempId = this.tempId
      let params = {
        busicode: 'MrModifySave',
        data: data
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        });
        this.$parent.closeDialog();
      });

    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;  
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "MR_MODIFY",
        "审批流配置:" +
          _this.formData.processName +
          "(" +
          _this.formData.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
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
        },
        _this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        "MrModifySave"
      );
    },
    // 计算本期水量
    getWaterNum(){
         this.formData.priorPeriodNum = Number(String(this.formData.priorPeriodNum).replace(/[^\d]/g,""));
      //  console.log(this.formData)
      this.formData.currendPeriodWater = Number(this.formData.currendPeriodNum) - Number(this.formData.priorPeriodNum) + Number(this.formData.addWater)
    },
    // 本期水量小于0报错(失去焦点才校验)
    waterNumErr(){
      if (Number(this.formData.currendPeriodWater) < 0) {
        this.$message({
          message: '本期水量不能小于0！',
          type: 'warning'
        })
      }
    },
  }
};
</script>
<style lang="scss">
.SingleUserEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
}
</style>

 
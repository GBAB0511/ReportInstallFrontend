<template>
  <div class="ctmInfo">
    <legend class="legendColumn">客户信息</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="ctmName" label="客户名称：" class="col-2" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.ctmName"></el-input>
        <span v-else>{{form.ctmName}}</span>
      </el-form-item>
      <el-form-item prop="ctmType" label="客户类型：" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-select v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.ctmType">
          <el-option v-for="item in dict.CTT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.ctmTypeName}}</span>
      </el-form-item>
      <el-form-item prop="certType" label="客户证件类型：" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-select v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.certType">
          <el-option v-for="item in dict.IDT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.certTypeName}}</span>
      </el-form-item>
      <el-form-item prop="certNo" label="客户证件号码：" class="col-2" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\u4E00-\u9FA5]/g,'')" maxlength="30" v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.certNo">
          <template slot="append">
            <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
              <el-button icon="el-icon-reading" class="scanning-btn" @click="idCardCertNo('certNo')" size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-input>
        <span v-else>{{form.certNo}}</span>
      </el-form-item>
      <el-form-item prop="creditLevel" label="信用等级：" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-select v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.creditLevel">
          <el-option v-for="item in dict.CDL" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.creditLevelName}}</span>
      </el-form-item>
      <el-form-item prop="linkTel" label="固定电话：" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-input oninput ="value=value.replace(/[^0-9.]/g,'').replace(/[^\w]/g,'','')" v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.linkTel"></el-input>
        <span v-else>{{form.linkTel}}</span>
      </el-form-item>

      <el-form-item prop="agentMan" label="经办人名称：" :class="{'disable-item': disabled||currentStep>1}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="!disabled&&currentStep<2" v-model="form.agentMan"></el-input>
        <span v-else>{{form.agentMan}}</span>
      </el-form-item>
      <el-form-item prop="agentCertType" label="经办人证件类型：" :class="{'disable-item': disabled||currentStep>1}">
        <el-select v-if="!disabled&&currentStep<2" v-model="form.agentCertType">
          <el-option v-for="item in dict.IDT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.agentCertTypeName}}</span>
      </el-form-item>
      <el-form-item prop="agentCertNo" label="经办人证件号码：" class="col-2" :class="{'disable-item': disabled||currentStep>1}">
        <el-input oninput ="value=value.replace(/[^\w]/g,'').replace(/[^\w]/g,'','')" v-if="!disabled&&currentStep<2" v-model="form.agentCertNo">
          <template slot="append">
            <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
              <el-button icon="el-icon-reading" class="scanning-btn" @click="idCardAgentCertNo('certNo')" size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-input>
        <span v-else>{{form.agentCertNo}}</span>
      </el-form-item>
      <el-form-item prop="agentLinkTel" label="经办人电话：" :class="{'disable-item': disabled||currentStep>1}">
        <el-input oninput ="value=value.replace(/[^0-9.]/g,'')"  v-if="!disabled&&currentStep<2" v-model="form.agentLinkTel"></el-input>
        <span v-else>{{form.agentLinkTel}}</span>
      </el-form-item>
      <el-form-item prop="faxNumber" label="传真号码：" :class="{'disable-item': disabled||currentStep>1 || !ctmClass}">
        <el-input oninput ="value=value.replace(/^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/,'').replace(/[^0-9.]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2 && ctmClass" v-model="form.faxNumber"></el-input>
        <span v-else>{{form.faxNumber}}</span>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号码：" :class="{'disable-item': disabled||currentStep>1}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[^0-9.]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2" v-model="form.mobile"></el-input>
        <span v-else>{{form.mobile}}</span>
      </el-form-item>
      <!-- <el-form-item prop="pjName" label="电子签名：" class="col-2" :class="{'disable-item': disabled}">
        <esign :url="form.eSignatureUrl" @uploadDone="uploadDone" :showBtn="!disabled"></esign>
      </el-form-item> -->
      <el-form-item  prop="acceptSMS" label="受理短信：" v-if="!disabled && currentStep < 2">
        <el-checkbox :disabled="disabled || currentStep > 1" v-model="form.acceptSMS" true-label="1" false-label="0"></el-checkbox>
      </el-form-item>

    </el-form>
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
  </div>
</template>

<script>
import esign from '@/components/eSign'
export default {
  props: ['dict', 'editData', 'disabled','currentStep'],
  components:{
    esign
  },
  data() {

    return {

      form: {
        ctmName: '',
        ctmType: '1',
        certType: '1',
        certNo: '',
        mobile: '',
        linkTel: '',
        ctmAddr: '',
        agentMan: '',
        agentCertType: '',
        agentCertNo: '',
        agentLinkTel: '',
        faxNumber: '',
        creditLevel: '1',
        eSignatureUrl:'',
        acceptSMS: "",//受理短信
      },
      adminAreaData: [],
      rules: {
        ctmName: [{ required: true, message: '客户名称不能为空', trigger: ['change','blur'] }],
        // certNo: [{ required: true, message: '证件号码不能为空', trigger: 'blur' }],
        ctmType: [{ required: true, message: '客户类型不能为空', trigger: ['change','blur'] }],
        certType: [{ required: true, message: '客户证件类型不能为空', trigger: ['change','blur'] }],
        certNo: [{ required: true, message: '客户证件号码不能为空', trigger: ['change','blur'] },],
        mobile: [{ required: true, message: '手机号码不能为空', trigger: ['change','blur'] },
          { pattern: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/, message:"手机号码格式不正确", trigger: ['change','blur']}],
        agentLinkTel: [
          { pattern: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/, message:"经办人电话格式不正确", trigger: ['change','blur']}],
        // legalPersonCertNo: [{ pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证号码格式不正确', trigger: 'blur' }],
        creditLevel: [{ required: true, message: '信用等级不能为空', trigger: ['change','blur'] }],
      },
      ctmClass: true,//工程类型切换的时候用来控制样式的显示
    }
  },
  created() {
    if(this.editData) {
      this.form = {...this.editData}
    }
  },
  mounted() {
    this.getAcceptSMS();
    eventBus.$on("getPjType", (QRpjType) => {
      if(QRpjType !=3){
        this.ctmClass = true;
        this.$set(this.rules,"ctmName",[{ required: true, message: '客户名称不能为空', trigger: ['change','blur'] }]);
        this.$set(this.rules,"ctmType",[{ required: true, message: '客户类型不能为空', trigger: ['change','blur'] }]);
        this.$set(this.rules,"certType",[{ required: true, message: '客户证件类型不能为空', trigger: ['change','blur'] }]);
        this.$set(this.rules,"certNo",[{ required: true, message: '客户证件号码不能为空', trigger: ['change','blur'] }]);
        this.$set(this.rules,"mobile",[{ required: true, message: '手机号码不能为空', trigger: ['change','blur'] },
          { pattern: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/, message:"手机号码格式不正确", trigger: ['change','blur']}]);
        this.$set(this.rules,"creditLevel",[{ required: true, message: '信用等级不能为空', trigger: ['change','blur'] }]);
      }else {//水表扩缩的时候没有必填标志
        this.ctmClass = false;
        const names = ['ctmName', 'ctmType', 'certType','mobile','certNo','creditLevel'];
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item);
          }
        })
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        })
      }
      this.form = {
        ctmName: '',
        ctmType: '1',
        ctmTypeName: this.getCtmTypeName(this.form.ctmType),
        certType: '1',
        certTypeName: this.getCertTypeName(this.form.certType),
        certNo: '',
        mobile: '',
        linkTel: '',
        ctmAddr: '',
        agentMan: '',
        agentCertType: '',
        agentCertNo: '',
        agentLinkTel: '',
        faxNumber: '',
        creditLevel: '1',
        creditLevelName: this.getCreditLevelName(this.form.creditLevel),
        eSignatureUrl:'',
        acceptSMS: "",//受理短信
      };
    });
    eventBus.$on("deliverRes", item => {
      if(item && item.userInfo){
        this.form.ctmName = item.ctmInfo.ctmName;//客户名称
        this.form.ctmType = item.ctmInfo.ctmType;//客户类型
        this.form.ctmTypeName = item.ctmInfo.ctmTypeName;//客户类型
        this.form.certType = item.ctmInfo.certType;//客户证件类型
        this.form.certTypeName = item.ctmInfo.certTypeName;//客户证件类型
        this.form.certNo = item.ctmInfo.certNo;//客户证件号码
        this.form.mobile = item.ctmInfo.mobile;//手机号码
        this.form.linkTel = item.ctmInfo.linkTel;//固定电话
        this.form.faxNumber = item.ctmInfo.faxNumber;//传真号码
        this.form.creditLevel = item.ctmInfo.creditLevel;//信用等级
        this.form.getCreditLevelName = item.ctmInfo.getCreditLevelName;//信用等级
      }
    });
  },
  methods: {
    inputMe(e){
      let str=e.replace(/\ +/g,"")
      str=str.replace(/[\r\n]/g,"")
      //console.log(str);
      return str;
    },
    uploadDone(url){
      this.form.eSignatureUrl = url;
    },
    getCtmTypeName(val){
      let tempName;
      this.dict.CTT.forEach(item=>{
        if(val == item.value){
          tempName = item.name;
        }
      })
      return tempName;
    },
    getCertTypeName(val){
      let tempName;
      this.dict.IDT.forEach(item=>{
        if(val == item.value){
          tempName = item.name;
        }
      })
      return tempName;
    },
    getCreditLevelName(val){
      let tempName;
      this.dict.CDL.forEach(item=>{
        if(val == item.value){
          tempName = item.name;
        }
      })
      return tempName;
    },
    // 证件号码按钮
    idCardCertNo(name) {
      if(this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面')
        return
      }
      let IDCardName = 'IDCard';
      if(this.$store.state.photographic){
        // 这个是用的方正高拍仪，下面的else还是走原来的逻辑
        IDCardName = 'IDCardFangZheng';
      }
      if(!this[IDCardName].online) {
        this.$message.error('请连接高拍仪');
        return;
      }
      this[IDCardName].ReadIDCard(name);
      setTimeout(() => {
        let idCardData = this[IDCardName].getAllData();
        const certNo = this.$store.state.photographic ? (idCardData.cardID || "") : (idCardData.CardId || "");
        this.form.certNo = (certNo && certNo.length > 0) && certNo;
      }, 2000);
    },
    idCardAgentCertNo(name) {
      if(this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面')
        return
      }
      let IDCardName = 'IDCard';
      if(this.$store.state.photographic){
        // 这个是用的方正高拍仪，下面的else还是走原来的逻辑
        IDCardName = 'IDCardFangZheng';
      }
      if(!this[IDCardName].online) {
        this.$message.error('请连接高拍仪');
        return;
      }
      this[IDCardName].ReadIDCard(name);
      setTimeout(() => {
        let idCardData = this[IDCardName].getAllData();
        const certNo = this.$store.state.photographic ? (idCardData.cardID || "") : (idCardData.CardId || "");
        this.form.agentCertNo = (certNo && certNo.length > 0) && certNo;
      }, 2000);
    },
    changeRequired(val){
      if(this.form.agentMan){
        this.$set(this.rules,"agentCertType",[{ required:true, message:"经办人证件类型不能为空", trigger: ['change','blur']}]);
        this.$set(this.rules,"agentCertNo",[{ required:true, message:"经办人证件号码不能为空", trigger: 'change'}]);
        this.$set(this.rules,"agentLinkTel",[{ required:true, message:"经办人电话不能为空", trigger: ['change','blur']},{ pattern: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/, message:"经办人电话格式不正确", trigger: ['change','blur']}]);
      }else{
        const names = ['agentCertType', 'agentCertNo','agentLinkTel']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
          this.$set(this.rules,"agentLinkTel",[{ pattern: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/, message:"经办人电话格式不正确", trigger: ['change','blur']}]);
        })
      }
    },
    getAcceptSMS () {
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PROJECT_IS_MESSAGE',
        }
      };
      this.$api.fetch({
        params
      })
      .then(res => {
        if (res.list.length > 0) {
          this.form.acceptSMS = res.list[0].configValue;
        }
      })
    },
  },
  beforeDestroy(){
    eventBus.$off("getPjType");
    eventBus.$off("deliverRes");
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    },
    'form.agentMan':{
      handler(newVal, oldVal) {
        this.changeRequired();
      },
    }
  }
}
</script>

<style lang="scss" scoped>
.ctmInfo {
  .col-2 {
    width: calc(46% + 10px);
  }
  .two-input {
    /deep/ {
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
}
</style>

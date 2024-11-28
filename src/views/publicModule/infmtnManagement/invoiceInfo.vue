<template>
  <div class="invoiceInfo">

    <legend class="legendColumn">开票信息</legend>
    <el-form :model="formData" class="formBill" size="mini" :rules="rules" ref="ruleForm" :disabled='permission!=1'>
      <!-- <el-form-item label="发票类型：" prop="invoiceType" :class="{'disable-item':editType==0}">
          <span v-if="editType==0">{{formData.invoiceTypeName}}</span> -->
      <!-- <el-select v-if="editType==0" clearable v-model="formData.invoiceType" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.BBT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
      <!-- <el-select v-else clearable v-model="formData.invoiceType" placeholder="">
            <el-option v-for="(item,index) in dictionaryData.BBT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
      <el-form-item label="单位名称：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceTitle}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceTitle" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceTax}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceTax" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系地址：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceAddr" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="座机号码：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceLink}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceLink" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="开户银行：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceBank}}</span>
        <!-- <el-cascader
            v-if="editType==0"
            disabled
            v-model="formData.invoiceBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader> -->
        <!-- <el-cascader
            v-else
            v-model="formData.invoiceBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
          >
          </el-cascader> -->
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceBank" placeholder="" clearable></el-input>
      </el-form-item>
      <!--style="width: calc(46% + 10px)"-->
      <el-form-item label="银行账户：" :class="{'disable-item':editType==0}" style="width: calc(46% + 10px)">
        <span v-if="editType==0">{{formData.invoiceAccount}}</span>
        <el-input v-else v-model="formData.invoiceAccount" placeholder="" clearable @input="validateNum1()">
          <template slot="append">
              <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
                <el-button icon="el-icon-reading" class="scanning-btn" @click="icCard('bankAccount')" size='mini'></el-button>
              </el-tooltip>
            </template>
        </el-input>
      </el-form-item>
      <el-form-item label="增值税标记：" prop="vatFlag" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.vatFlagName}}</span>
<!--        <el-select v-else v-model="formData.vatFlag" placeholder="">-->
<!--          <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
<!--        </el-select>-->
        <el-radio-group v-else v-model="formData.vatFlag">
          <el-radio v-for="item in isNot" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预开票标记：" prop="preInvoicing" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.preInvoicing  == 1 ? '是' : '否'}}</span>
<!--        <el-select v-else v-model="formData.preInvoicing" placeholder="">-->
<!--          <el-option v-for="item in isPreInvoiceNot" :key="item.value" :label="item.label"  :value="item.value"></el-option>-->
<!--        </el-select>-->
        <el-radio-group v-else v-model="formData.preInvoicing">
          <el-radio v-for="item in isPreInvoiceNot" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合并开票：" prop="mergeInvoicing" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.mergeInvoicing  == 1 ? '是' : '否'}}</span>
<!--        <el-select v-else v-model="formData.mergeInvoicing" placeholder="">-->
<!--          <el-option v-for="item in isPreInvoiceNot" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
<!--        </el-select>-->
        <el-radio-group v-else v-model="formData.mergeInvoicing">
          <el-radio v-for="item in isPreInvoiceNot" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
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
export default {
  name: "invoiceInfo",
  props: ['editType', 'wayOpen','permissions'],
  components: {
  },
  data () {
    return {
      permission:1,
      dictionaryData: [],
      //开户行
      bankTreeData: [],
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      isNot: [{ label: "是", value: '1' },{ label: "否", value: '0' }],
      isPreInvoiceNot: [{ label: "是", value: 1 },{ label: "否", value: 0 }],
      formData: {

        // 开票信息
        invoiceType: "1",//发票类型
        invoiceTypeName: "",//发票类型
        invoiceTitle: "",//单位名称
        invoiceTax: "",//纳税人识别号
        invoiceAddr: "",//联系地址
        invoiceLink: "",//座机号码
        invoiceBank: "",//开户银行
        invoiceAccount: "",//银行账户
        vatFlag: 0,//增值税标识
        vatFlagName: "否",//增值税标识
        preInvoicing: 0,// 预开票标记
        mergeInvoicing: 1, //合并开票,1为是，默认开启
      },
      rules: {
        // invoiceType:[{ required: true, message:"发票类型不能为空", trigger: 'blur'}],
        vatFlag: [{ required: true, message: "增值税标识不能为空", trigger: 'blur' }],
        preInvoicing: [{ required: true, message: "预开票标记不能为空", trigger: 'blur' }],
      },
    }
  },
  mounted () {
    if(this.permissions!=undefined&&this.permissions==0){
      this.permission=this.permissions
    }
    if (this.editType != 0) {

      this.dictionaryOptions()
      this.bankTreeDataOptions()
    }
  },

  watch: {
  },
  methods: {
    // 数据初始化
    init (val) {
      if (val) {
        this.formData.invoiceAccount = val.invoiceAccount
        this.formData.invoiceAddr = val.invoiceAddr
        this.formData.invoiceBank = val.invoiceBank
        this.formData.invoiceBankName = val.invoiceBankName
        this.formData.invoiceLink = val.invoiceLink
        this.formData.invoiceTax = val.invoiceTax
        this.formData.invoiceTitle = val.invoiceTitle
        this.formData.invoiceType = val.invoiceType
        this.formData.invoiceTypeName = val.invoiceTypeName
        this.formData.vatFlag = val.vatFlag
        this.formData.vatFlagName = val.vatFlagName
        this.formData.preInvoicing=val.preInvoicing
        this.formData.mergeInvoicing=val.mergeInvoicing
          if(this.formData.preInvoicing==''||typeof(this.formData.preInvoicing)=='undefined'){
            this.formData.preInvoicing=0
          }
        if(this.formData.vatFlag==''||typeof(this.formData.vatFlag)=='undefined'){
          this.formData.vatFlag=0
        }
        if(this.formData.mergeInvoicing==''||typeof(this.formData.mergeInvoicing)=='undefined'){
          this.formData.mergeInvoicing=0
        }

        //console.log('val',JSON.stringify(val));
        //console.log('invoiceInfo init', this.formData)
        // this.formData.preInvoicing=0
        //console.log('val', val)
        //this.formData.preInvoicing=this.isPreInvoiceNot[0].value
        this.validateNum1();
      }

    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.formData)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.invoiceAccount = data.invoiceAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'invoiceAccount', data.invoiceAccount)
    },
    // 数据字典
    dictionaryOptions () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BBT"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    //树结构数据处理
    getArr (data) {
      function abc (arr) {
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
    //开户银行
    bankTreeDataOptions () {
      let params = { busicode: "BankTree", data: "" };
      this.$api.fetch({ params }).then(res => {
        let data = this.getArr(res)
        this.bankTreeData = data.children;
      }).catch(res => {
        this.bankTreeData = [];
      });
    },
    // 银行账户按钮
    icCard (name) {
      if (this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面');
        return;
      }
      if(this.$store.state.photographic){
        // 这里是银行账户，高拍仪不支持银行卡，所以只是提示，科荣高拍仪走下面的逻辑
        this.$message.error("设备只支持二代身份证以及附件！");
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
            // console.log(this.ICCard.getData(name));
            const invoiceAccount = this.ICCard.getData(name);
            this.formData.invoiceAccount = (invoiceAccount && invoiceAccount.length > 0) && invoiceAccount;
            this.validateNum1();//科荣高拍仪直接回填的内容没有按照输入的时候的方式来加间隔，调用这个函数来触发加间隔的函数，有间隔，但是提交的时候没有空格
          }, 4000);
        } else {
          this.MsgCard.RAWCard(name);
          setTimeout(() => {
            // console.log(this.MsgCard.getData(name));
            this.formData.invoiceAccount = this.MsgCard.getData(name);
          }, 4000);
        }
      }, 100);
    },
  },
}
</script>
<style lang="scss">
.invoiceInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
    }
  }
  .scanning-btn{
    background: #409eff !important;
    color: #fff !important;
  }
}
</style>

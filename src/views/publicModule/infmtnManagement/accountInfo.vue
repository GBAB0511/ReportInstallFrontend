<template>
  <div class="accountInfo">

      <legend class="legendColumn">账户信息</legend>
      <el-form
          :model="formData"
          class="formBill"
          size="mini"
          :rules="rules"
          ref="ruleForm"
          :disabled='permission!=1'
        >
        <el-form-item label="账户编号：" :class="{'disable-item':disableAccountNo}">
          <el-select
            v-if="!disableAccountNo"
            v-model="formData.accountNo"
            filterable
            allow-create
            @change='chooseCert'
            default-first-option>
            <el-option
              v-for="item in accountlist"
              :key="item.id"
              :label="item.accountNo"
              :value="item.accountNo">
            </el-option>
          </el-select>
          <span  v-else>{{formData.accountNo}}</span>
        </el-form-item>
        <el-form-item label="缴费方式："  prop="payWay" :class="{'disable-item':editType==0}">
          <span v-if="editType==0">{{formData.payWayName}}</span>
          <!-- <el-select v-if="editType==0" clearable v-model="formData.payWay" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <el-select v-else clearable v-model="formData.payWay"  placeholder="" @change="paywayChange">
            <el-option v-for="(item,index) in dictionaryData.BPW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型："  prop="accountType" :class="{'disable-item':editType==0}">

          <span v-if="editType==0">{{formData.accountTypeName}}</span>
          <!-- <el-select v-if="editType==0" clearable v-model="formData.accountType" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.ACT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <el-select v-else clearable v-model="formData.accountType"  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.ACT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="开户银行：" prop="openAccountBank" :class="{'disable-item':editType==0}">

          <span v-if="editType==0">{{formData.openAccountBankName}}</span>
          <!-- <el-cascader
            v-if="editType==0"
            disabled
            v-model="formData.openAccountBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader> -->
          <el-cascader
            v-else
            @change="bankChange"
            v-model="formData.openAccountBank"
             ref="openAccountBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="开户名称：" prop="openAccountName" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.openAccountName}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.openAccountName" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item v-if="showFormItem" label="银行账户：" prop="bankAccount" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.bankAccount}}</span>
          <el-input v-else v-model="formData.bankAccount" placeholder="" clearable @input="validateNum1()">
            <template slot="append">
              <el-tooltip content="请连接高拍仪获取证件号码" placement="top">
                <el-button icon="el-icon-reading" class="scanning-btn" @click="icCard('bankAccount')" size='mini'></el-button>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item v-if="showFormItem" label="托号：" prop="entrustNo" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.entrustNo}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.entrustNo" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="银行协议号：" prop="entrustContract" :class="{'disable-item':editType==0}">
          <span v-if="editType==0">{{formData.entrustContract}}</span>
          <template v-else>
          <el-tooltip :disabled="entrustContractAddrToolShow" effect="dark" :content="formData.entrustContract" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="entrustContract" v-model="formData.entrustContract" placeholder clearable></el-input>
          </el-tooltip>
        </template>
        </el-form-item>

        <el-form-item label="投递方式：" prop="deliverWay" :class="{'disable-item':editType==0}">

          <span v-if="editType==0">{{formData.deliverWayName}}</span>
          <!-- <el-select v-if="editType==0" clearable v-model="formData.deliverWay" disabled placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.SDW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <el-select v-else clearable v-model="formData.deliverWay"  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.SDW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投递地址："  prop="deliverAddr" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.deliverAddr}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.deliverAddr" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="电子邮件："  prop="emailAddr" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.emailAddr}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.emailAddr" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="账户余额："  prop="accountBalance" class="disable-item">
          <span>{{formData.accountBalance}}</span>
          <!--el-input v-else v-model="formData.accountBalance" placeholder="" clearable></el-input-->
        </el-form-item>
        <el-form-item v-if="showFormItem" label="开户行号：" style="width: calc(46% + 10px)" prop="bankSn" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.bankSn}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankSn" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="showFormItem" label="出盘编号：" prop="outNo" :class="{'disable-item': editType==0}">
          <el-select v-model="formData.outNo" placeholder="" v-if="editType!==0">
            <el-option label="新用户编号" :value="1"></el-option>
            <el-option label="旧用户编号" :value="2"></el-option>
          </el-select>
          <span v-else>{{formData.outNo === 2 ? '旧用户编号' : '新用户编号'}}</span>
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
  name: "accountInfo",
  props: ['editType','wayOpen', 'disableAccountNo','permissions'],
  components: {
  },
  data() {
    return {
      permission:1,
      ctmNo:'',
      showFormItem:false,
      curWaterCode:'',
      //账户下拉框数据
      accountlist:[],
      dictionaryData:[],
      //开户行
      bankTreeData:[],
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      formData:{
          // 账户信息
          accountNo: "新开户",//账户编号
          payWay: '3',//缴费方式
          payWayName: '',//缴费方式
          accountType: "1",//账户类型
          accountTypeName: "私户",//账户类型
          openAccountBank: "",//开户银行
          openAccountBankName: "",//开户银行
          openAccountName: "",//开户名称
          bankAccount: "",//银行账户
          entrustNo: "",//托号
          entrustContract: "",//托收合同
          deliverWay: "1",//投递方式
          deliverWayName: "",//投递方式
          deliverAddr: "",//投递地址
          emailAddr: "",//电子邮件
          accountBalance: 0,
          bankSn:"",//开户行号
          outNo:1,//出盘编号
        },
      changeData:{
        // 账户信息
        accountNo: "新开户",//账户编号
        payWay: '3',//缴费方式
        payWayName: '',//缴费方式
        accountType: "1",//账户类型
        accountTypeName: "私户",//账户类型
        openAccountBank: "",//开户银行
        openAccountBankName: "",//开户银行
        openAccountName: "",//开户名称
        bankAccount: "",//银行账户
        entrustNo: "",//托号
        entrustContract: "",//托收合同
        deliverWay: "1",//投递方式
        deliverWayName: "",//投递方式
        deliverAddr: "",//投递地址
        emailAddr: "",//电子邮件
        accountBalance: 0,
        bankSn:"",//开户行号
        outNo:1,//出盘编号
        // 开票信息
        invoiceTitle: "", //单位名称
        invoiceTax: "", //纳税人识别号
        invoiceAddr: "", //联系地址
        invoiceLink: "", //座机号码
        invoiceBank: "", //开户银行
        invoiceAccount: "" //银行账户
      },
      rules:{
          //accountNo:[{ required:true, message:"账户编号不能为空", trigger: 'blur'}],
          payWay:[{ required:true, message:"缴费方式不能为空", trigger: 'change'}],
          accountType:[{ required:true, message:"账户类型不能为空", trigger: 'change'}],
          //deliverWay:[{ required:true, message:"投递方式不能为空", trigger: 'change'}],
          //deliverAddr:[{ required:true, message:"投递地址不能为空", trigger: 'blur'}],
          //emailAddr:[{ required:true, message:"电子邮件不能为空", trigger: 'blur'}],
          outNo: [{ required: true, message: '出盘编号不能为空', trigger: 'change' }]
        },

        entrustContractAddrToolShow: true

    }
  },
  mounted() {
    if(this.permissions!=undefined&&this.permissions==0){
      this.permission=this.permissions
    }
    //this.formData.payWay='其他'

    if(this.editType!=0){
      this.dictionaryOptions()
      this.bankTreeDataOptions()
    }
   this.curWaterCode = localStorage.getItem('companyNo')
    //console.log(this.curWaterCode)
    if(this.curWaterCode !== '01'){
      this.showFormItem = true
    } else {
      this.showFormItem = false
    }
    eventBus.$on('accountInfoClear',item=>{
     
        this.formData.accountNo=''
        this.formData.payWay='3'
        this.formData.accountType='1'
        this.formData.deliverWay='1'
      
        // this.formData.accountNo=''
        // this.formData.payWay='3'
        // this.formData.accountType='1'
        // this.formData.deliverWay='1'

    })
    eventBus.$on('setTableAddr',item=>{
      if(item.no!=undefined&&item.no==1&&item.settlementFlag!=0){
        this.formData=item.data[0].accountInfo
        // console.log('this.formData.clientAddr',this.formData.clientAddr);
        // console.log(JSON.stringify(this.adminAreaData));
        
      }else{
        this.formData=item.data[0].accountInfo
      }
    })
  },
  destroyed(){
    eventBus.$off('accountInfoClear')
    eventBus.$off('setTableAddr')
  },
  watch: {
    'formData.entrustContract': {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if(!/^[0-9a-zA-Z]*$/.test(val) && val !== '') {
          if(oldVal === '' || oldVal === null || oldVal === undefined) {
            this.formData.entrustContract = ''
          } else {
            this.formData.entrustContract = oldVal
          }
        }
        const entrustContract = document.querySelector('.entrustContract .el-input__inner')
        entrustContract && (this.entrustContractAddrToolShow = (entrustContract.scrollWidth <= entrustContract.offsetWidth) || !(val && val.length > 0))
      }
    },
  },
methods: {
  // 数据初始化
    init(val) {
      if (val) {
        //console.log("init",val);
        this.formData = val
        if(this.formData.payWay==""){
          this.formData.payWay='3'
        }
        if(this.formData.accountType==""){
          this.formData.accountType='1'
        }
        // this.getAccountDetail()
        // this.getAccountList(val.id)
        this.validateNum1();

        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate();
          
        })
        
      }
        
        
        
    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.formData)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.bankAccount = data.bankAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'bankAccount', data.bankAccount)
    },
    paywayChange(val){
      if(val === '1') {
        this.$set(this.rules,"openAccountBank",[{ required:true, message:"代扣时，开户银行不能为空", trigger: 'change'}]);
        this.$set(this.rules,"openAccountName",[{ required:true, message:"代扣时，开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"bankAccount",[{ required:true, message:"代扣时，银行账户不能为空", trigger: 'blur'}]);
      } else {
        const names = ['openAccountBank', 'openAccountName', 'bankAccount']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      if(val==='2'){
        this.$set(this.rules,"openAccountBank",[{ required:true, message:"代扣时，开户银行不能为空", trigger: 'change'}]);
        this.$set(this.rules,"openAccountName",[{ required:true, message:"代扣时，开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"bankAccount",[{ required:true, message:"代扣时，银行账户不能为空", trigger: 'blur'}]);

        this.$set(this.rules,"entrustNo",[{ required:true, message:"托收时，托号不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"entrustContract",[{ required:true, message:"托收时，托号合同号不能为空", trigger: 'blur'}]);
      }else{
        const names = ['entrustNo', 'entrustContract']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate();
      })
    },
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPW,ACT,SDW"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData",res);
      }).catch(res => {
        this.$set(this, "dictionaryData",[]);
      });
    },
    getAccountList(val){
      if(val){
         this.ctmNo = val
      }

         let params = {
        "busicode": "QueryAccountByCtm",
        "data": {
          'ctmNo':this.ctmNo,
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.accountlist = res;
      })
    },
    //树结构数据处理
    getArr(data) {
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
    // 银行账户按钮
    icCard (name) {
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
            // console.log(this.ICCard.getData(name));
            const bankAccount = this.ICCard.getData(name);
            this.formData.bankAccount = (bankAccount && bankAccount.length > 0) && bankAccount;
            this.validateNum1();//科荣高拍仪直接回填的内容没有按照输入的时候的方式来加间隔，调用这个函数来触发加间隔的函数，有间隔，但是提交的时候没有空格
          }, 4000);
        } else {
          this.MsgCard.RAWCard(name);
          setTimeout(() => {
            // console.log(this.MsgCard.getData(name));
            this.formData.bankAccount = this.MsgCard.getData(name);
          }, 4000);
        }
      }, 100);
    },
    //开户银行
    bankTreeDataOptions() {
      let params = { busicode: "BankTree", data: "" };
      this.$api.fetch({ params }).then(res => {
        let data = this.getArr(res)
        this.bankTreeData = data.children;
      }).catch(res => {
        this.bankTreeData = [];
      });
    },
    bankChange(val) {
      this.formData.bankSn = this.$refs["openAccountBank"].getCheckedNodes()[0].data.bankNumber;
    },
    getAccountDetail(val){
        let _this = this
        let params = {
          "busicode": "AccountInfoQuery",
          "data": {
            'accountNo':val,
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          // console.log(res);
          this.getAccountList(this.ctmNo);
          _this.formData = res;
          _this.changeData = res;
          if (_this.wayOpen !== 'changeMangement') {
            _this.$parent.$parent.getAccoInvoData(_this.formData,'getValue')
          }else {
            //console.log(_this.changeData);
            eventBus.$emit('getAccoInvoData', _this.changeData, 'getValue')
          }

        })
    },
    //点击确定
    chooseCert(val){
      if (val=='' || val=='新开户') {
        this.formData={  accountNo: "新开户", }
        if (this.wayOpen !== 'changeMangement') {
          this.$parent.$parent.getAccoInvoData(this.formData,'clear')
        }else{
          eventBus.$emit('getAccoInvoData', this.formData, 'clear')
        }
      }else{
        this.getAccountDetail(this.formData.accountNo);

      }
    },
  },
}
</script>
<style lang="scss">
.accountInfo {
  height: 100%;
  .formBill{
    .el-form-item__label{
      width: 130px;
    }
  }
  .scanning-btn{
    background: #409eff !important;
    color: #fff !important;
  }
}
</style>

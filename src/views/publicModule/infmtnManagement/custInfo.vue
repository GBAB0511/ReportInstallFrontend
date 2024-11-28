<template>
  <div class="custInfo">
    <legend class="legendColumn">客户信息</legend>
    <!-- 弹出修改手机号码 -->
    <el-dialog width="40%" :title="MobileChangeVisibleName" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="mobileInfoVisible" @close="closeDialog">
      <el-form :inline="true" size="mini" :model="mobileQuery" @submit.native.prevent>
        <el-form-item label="手机号码：" style="width: calc(80% + 15px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="mobileQuery.mobile" clearable @keyup.enter.native="search" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitMobile()">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <el-form :disabled='permission!=1' ref="ruleForm" :model="formData" class="formBill" size="mini" :rules="rules" @submit.native.prevent>
      <!--wayOpen=='OpenAccount'||wayOpen=='Transfer' ||wayOpen=='changeMangement' -->
      <el-form-item label="客户证件号码：" prop="certNo" v-if="!disableCertNo" style="width: calc(46% + 10px)" :class="{'disable-item':disableChangeCertNo}">
        <span v-if="disableChangeCertNo">{{formData.certNo}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\u4E00-\u9FA5]/g,'')" maxlength="30" v-else-if="wayOpen == 'Transfer'" v-model="formData.certNo" placeholder="" clearable>
        </el-input>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[\u4E00-\u9FA5]/g,'')" maxlength="30" v-else v-model="formData.certNo" placeholder="" @keydown.enter.native="handleSelect(formData.certNo)" clearable>
          <el-button slot="append" class="searchBtn " icon="el-icon-search " @click="handleSelect(formData.certNo)" size='mini'></el-button>
        </el-input>

      </el-form-item>

      <el-form-item label="客户编号：" prop="ctmNo" class="disable-item">
        <span>{{formData.ctmNo}}</span>
      </el-form-item>
      <el-form-item label="客户名称：" prop="ctmName" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.ctmName}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.ctmName" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="客户地址：" prop="ctmAddr" :class="{'disable-item':editType==0, 'two-input': true}">
        <span v-if="editType==0">{{formData.ctmAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmAddr" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="客户类型：" prop="ctmType" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.ctmTypeName}}</span>
        <!-- <el-select v-if="editType==0" clearable v-model="formData.ctmType" disabled placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.CTT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
        <el-select v-else clearable v-model="formData.ctmType" placeholder="">
          <el-option v-for="(item,index) in dictionaryData.CTT" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="证件类型：" prop="certType" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.certTypeName}}</span>
        <!-- <el-select v-if="editType==0" clearable v-model="formData.certType"  disabled placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.IDT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
        <el-select v-else clearable v-model="formData.certType" placeholder="">
          <el-option v-for="(item,index) in dictionaryData.IDT" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="信用等级：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.creditLevelName}}</span>
        <!-- <el-select v-if="editType==0" clearable v-model="formData.creditLevel" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.CDL" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
        <el-select v-else clearable v-model="formData.creditLevel" placeholder="">
          <el-option v-for="(item,index) in dictionaryData.CDL" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="固定电话：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.linkTel}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.linkTel" placeholder="" clearable></el-input>
      </el-form-item>

      <!--判断快捷查询界面修改手机号码-->
      <el-form-item v-if="wayOpen !== 'userInfo' || !this.disableChangeMobile" label="手机号码：" prop="mobile" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.mobile}}</span>
        <!-- <span  v-else-if="!showMobileDialog" style="color:#4875a2;"  @click="getCtmMobile">修改手机号码</span> -->
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.mobile" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item v-else label="手机号码：" prop="mobile" :class="{'disable-item':editType==0}">
        <span v-if="editType==0 && showMobileDialog" style="color:#297acc;font-weight:600" @click="getCtmMobile">{{formData.mobile}}</span>
        <span v-else-if="!showMobileDialog" style="color:#297acc;font-weight:600" @click="getCtmMobile">修改手机号码</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.mobile" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="传真号码：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.faxNumber}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.faxNumber" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="用户数量：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.userAmount}}</span>
      </el-form-item>
    </el-form>
    <el-dialog v-if="certVisible" title="请选择客户" class="miniDialog" :visible.sync="certVisible" append-to-body>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table :data="ctmNoData" highlight-current-row stripe border :max-height="maxHeight" @row-dblclick="handleRowChange">
          <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column property="ctmNo" label="客户编号：" width=""></el-table-column>
          <el-table-column property="ctmName" label="客户名称" width=""></el-table-column>
          <el-table-column property="ctmAddr" label="客户地址"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <addrAdd :addrVisible="addrVisible" v-if="addrVisible" @closeAddrAddVisible="closeAddrAddVisible"></addrAdd>
    <modifyNumber :diaVisible.sync="modifyNumberDia" :formData="updateNumber" refreshNode="userInfoSearchDetail"></modifyNumber>
  </div>
</template>
<script>
import addrAdd from "@/components/addrAdd"
import modifyNumber from "@/components/modifyNumber"
export default {
  name: "custInfo",
  props: ['editType', 'wayOpen', 'disableCertNo', 'disableChangeCertNo', 'disableChangeMobile','permissions'],
  components: {
    addrAdd,
    modifyNumber
  },
  data () {
    const checkAddr = (rule, value, callback) => {
      if(this.isShowclientAddr){
        if (!this.formData.clientAddr || this.formData.clientAddr.trim().length === 0) {
          callback(new Error('客户结构地址不能为空'))
        }
      }
      // if (!this.formData.clientAddrDetail || this.formData.clientAddrDetail.trim().length === 0) {
      //   callback(new Error('客户单元地址不能为空'))
      // }
      callback()
    }
    return {
      permission:1,
      maxHeight: 0,
      MobileChangeVisibleName: '修改手机号码',
      mobileInfoVisible: false,
      showMobileDialog: true,
      mobileQuery: {
        mobile: null,
      },
      certVisible: false,
      dictionaryData: [],
      addrVisible: false,
      formData: {
        ctmNo: "新开户",//客户编号：
        ctmName: "",//客户名称：
        certNo: "",//客户身份证号：
        certType: "1",//证件类型：
        certTypeName: "",//证件类型：
        ctmAddr: "",//客户地址：
        clientAddr: '',
        clientAddrDetail: '',
        ctmType: "1",//客户类型：
        ctmTypeName: "",//客户类型：
        creditLevel: "1",//信用等级：
        creditLevelName: "",//信用等级：
        faxNumber: "",//传真号码
        linkTel: "",//固定电话：
        mobile: "",//手机号码：
        userAmount: "",//用户数量
        ctmNo: "",
        mobile: "",
        userNo: "",
        stopWaterLinkMobile: "",
      },
      ctmNoData: [],
      adminAreaData: [],
      rules: {
        // ctmNo: [{ required: true, message: "客户编号不能为空", trigger: 'blur' }],
        ctmName: [{ required: true, message: "客户名称不能为空", trigger: 'blur' }],
        clientAddr: [
          // { required: true, message: "客户结构地址不能为空", trigger: 'blur' },
          { validator: checkAddr, trigger: 'blur' }
        ],
        ctmType: [{ required: true, message: "客户类型不能为空", trigger: 'change' }],
        certType: [{ required: true, message: "证件类型不能为空", trigger: 'change' }],
        certNo: [{ required: true, message: "客户证件号码不能为空", trigger: 'blur' }],
        //mobile:[{ required:true, message:"手机号码不能为空", trigger: 'blur'}],
      },
      // 修改号码弹窗
      modifyNumberDia: false,
      updateNumber: {
        ctmNo: "",
        mobile: "",
        userNo: "",
        stopWaterLinkMobile: "",
      },
      isShowclientAddr: true,
    }
  },
  created(){

  },
  mounted () {
    if(this.permissions!=undefined&&this.permissions==0){
      this.permission=this.permissions
    }
    // this.adminAreaDataOptions('')
    if (this.editType != 0) {
      this.getDictionarySelect()
    }
    eventBus.$on('setTableAddr',item=>{
      // console.log('setTableAddrAccepted');
      //  console.log(JSON.stringify(item));
      // console.log(this.formData.c);
      if(item.no!=undefined&&item.no==1){
        let data=item.data
        // this.formData.clientAddr=data[0].ctmInfo.clientAddr
        // this.formData.clientAddrId=data[0].ctmInfo.clientAddrId
        // this.formData.clientAddrDetail=data[0].ctmInfo.clientAddrDetail
        // this.formData.ctmNo=item.data[0].ctmInfo.ctmNo
        this.formData=item.data[0].ctmInfo
        // console.log('this.formData.clientAddr',this.formData.clientAddr);
        // console.log(JSON.stringify(this.adminAreaData));
        eventBus.$emit('sendClientAddr',{
          no:1,
          data:item.data,
          singleCustomerFlag:this.singleCustomerFlag
        })
      }else if(item.no!=undefined&&item.no==2){
        //PjMeterList数据为空时，从PjInfoquery中取出数据
        let data=item.data
        // console.log(JSON.stringify(item.data));
        // this.formData.clientAddr=data.ctmInfo.clientAddr
        // this.formData.clientAddrId=data.ctmInfo.clientAddrId
        // this.formData.clientAddrDetail=data.ctmInfo.clientAddrDetail
        // this.formData.ctmNo=data.ctmInfo.ctmNo
        // this.formData.ctmName=data.ctmInfo.ctmName
        this.formData=data.ctmInfo
        // console.log('1111111111111111111111');
        // console.log(JSON.stringify(data));
        eventBus.$emit('sendClientAddr',{
          no:2,
          data:item.data,
          singleCustomerFlag:this.singleCustomerFlag
        })
        // console.log(data.ctmInfo.clientAddr);
      }else if(item.no!=undefined&&item.no==4){
        this.formData.certNo=''
        this.formData.ctmName=''
        this.formData.mobile=''
        this.formData.ctmNo=''
        this.formData.linkTel=''
        this.formData.faxNumber=''
      }
      else{
        //单客户标志选0
        eventBus.$emit('sendClientAddr',{
          no:3,
          data:{},
          singleCustomerFlag:item.singleCustomerFlag
        })

        this.formData=item.data
        this.formData.ctmType='1'
        this.formData.certType='1'
        this.formData.creditLevel='1'
        eventBus.$emit('accountInfoClear',1)
      }
    })

    eventBus.$on('sendPjInfoQueryDataforAccount',item=>{
          // console.log('-----222222111111111-----');
          // this.formData.clientAddr=item.ctmInfo.clientAddr
          // this.formData.clientAddrId=item.ctmInfo.clientAddrId
          // this.formData.clientAddrDetail=item.ctmInfo.clientAddrDetail

        })
  },
  beforeDestroy(){
    eventBus.$off('setTableAddr')
    eventBus.$off('sendPjInfoQueryDataforAccount')
  },
  watch: {
    // 解决校验文字显示问题
    editType: function (oldVal, newVal) {
      if (newVal != 0) {
        $('.el-form-item--mini .el-form-item__error').hide()
      }
    }
  },
  methods: {
    addrSelectChange (id) {
      if (this.wayOpen === "PjMeterDetail") {
        eventBus.$emit('addrSelectChange', id)
      }
    },
    showAddrAddDialog () {
      this.$refs.addrselect.blur();
      this.addrVisible = true;
    },
    closeAddrAddVisible () {
      this.addrVisible = false;
    },
    // 数据初始化
    init (val) {
      if (val) {
        this.$set(this, "formData", val);
        this.defaultCtmNo = val.defaultCtmNo || val.ctmNo
        // console.log('2121', this.formData);
        // console.log(this.wayOpen);
        // console.log(this.disableChangeMobile);
        if (this.wayOpen == 'userInfo' && this.disableChangeMobile) {
          if (this.formData.mobile) {
            this.showMobileDialog = true
          } else {
            this.showMobileDialog = false
          }
        }
        this.setPhoneData()
      }
      console.log(typeof this.formData.clientAddrDetail)
      // this.formData.clientAddrDetail=this.$store.state.installAddr
      if(this.formData.clientAddrDetail==''){
        this.formData.clientAddrDetail=this.$store.state.installAddr

      }
    },
    //修改手机号码
    getCtmMobile () {
      //   this.mobileInfoVisible = true
      //   this.mobileQuery.mobile = this.formData.mobile
      this.modifyNumberDia = true;
    },
    // 数据字典
    getDictionarySelect () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT,IDT,CDL"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    submitMobile () {
      // console.log(this.formData.ctmNo);
      let params = {
        busicode: 'WBCtmInfoUpdate',
        data: {
          ctmNo: this.formData.ctmNo,
          mobile: this.mobileQuery.mobile
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        // this.EngineeringFeesCount = res
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        });
        this.closeDialog()
        // this.search()
        this.$parent.$parent.init()
        // this.$parent.init()
      })
    },
    async handleSelect (val) {
      let params = { "busicode": "QuerySameClient", "data": { certNo: val } }
      let testA = await this.$api.fetch({ params })
      this.$set(this, 'ctmNoData', testA)

      if (this.ctmNoData.length > 0) {
        this.$confirm('该证件号码已存在，是否新开户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          distinguishCancelAndClose: true,
          type: 'warning'
        }).then(() => {
          this.clearFormData();
          this.$parent.$parent.getAccoInvoData('', 'clear')
          this.$parent.$parent.custEditType = 1
        }).catch(action => {
          if (this.ctmNoData.length === 1) {
            this.formData = this.ctmNoData[0];
            /*
            if (this.formData.ctmAddr.indexOf('-') !== -1){
              this.formData.clientAddr = this.formData.ctmAddr.substring(0,this.formData.ctmAddr.indexOf("-")-1);
              this.formData.clientAddrDetail = this.formData.ctmAddr.substring(this.formData.ctmAddr.indexOf("-")-1);
            }else {
              this.formData.clientAddr = this.formData.ctmAddr;
              this.formData.clientAddrDetail = '无';
            }*/

            this.$parent.$parent.getaccountCusData(this.formData.ctmNo, this.defaultCtmNo === this.formData.ctmNo ? 'init' : '')
            if (this.wayOpen === 'Transfer') {
              this.$parent.$parent.custEditType = 0
            } else {
              this.$parent.$parent.custEditType = this.defaultCtmNo !== this.formData.ctmNo ? 0 : 1;
            }
          } else if (this.ctmNoData.length > 1) {
            this.certVisible = true
            this.$parent.$parent.custEditType = 0
            this.$nextTick(() => {
              //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
              this.common.changeTable(this, '.miniDialog .el-dialog', ['.miniDialog .el-dialog__header', '.miniDialog .el-dialog__header'])
            })
          }
        });
      }

      if (this.ctmNoData.length == 0) {
        this.clearFormData();
        this.$parent.$parent.getAccoInvoData('', 'clear')
        this.$parent.$parent.custEditType = 1
      }
      this.$parent.$parent.disableAccountNo = false
    },
    clearFormData () {
      this.formData.ctmNo = "新开户";
      this.formData = {
        ctmNo: "新开户",//客户编号：
        ctmName: "",//客户名称：
        certNo: this.formData.certNo,//客户身份证号：
        certType: "1",//证件类型：
        certTypeName: "",//证件类型：
        ctmAddr: "",//客户地址：
        ctmType: "1",//客户类型：
        ctmTypeName: "",//客户类型：
        creditLevel: "1",//信用等级：
        creditLevelName: "",//信用等级：
        faxNumber: "",//传真号码
        linkTel: "",//固定电话：
        mobile: "",//手机号码：
      }
    },
    adminAreaDataOptions (query) {
      if (query == null || query.length == 0) {
        return
      }
      let params = { busicode: "AdminAreaQuery", data: { areaName: query, isLeaf: 1 } };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "adminAreaData", res.list)
          //console.log("adminAreaData",JSON.stringify(this.adminAreaData));
        })
    },
    adminAreaDataByFullName (query) {
      if (query == null || query.length == 0) {
        return
      }
      let params = { busicode: "AdminAreaQuery", data: { fullName: query, isLeaf: 1 } };
      this.$api
        .fetch({ params })
        .then(res => {
          if (res.list.length > 0) {
            this.formData.clientAddr = res.list[0].id
            // console.log(this.formData.clientAddr);
          }
          this.$set(this, "adminAreaData", res.list)
        })
    },
    handleRowChange (row, column, event) {
      this.$parent.$parent.disableAccountNo = false
      this.formData = row
      // console.log("formData",JSON.stringify(this.formData));
      this.$parent.$parent.getaccountCusData(this.formData.ctmNo, this.defaultCtmNo === this.formData.ctmNo ? 'init' : '')
      this.$parent.$parent.custEditType = this.defaultCtmNo !== this.formData.ctmNo ? 0 : 1;
      this.certVisible = false
    },
    closeDialog () {
      this.certVisible = false
      this.mobileInfoVisible = false
    },
    indexMethod (index) {//获取表格序号
      return (index + 1);
    },
    setPhoneData () {
      this.updateNumber.userNo = this.formData.userNo;
      this.updateNumber.ctmNo = this.formData.ctmNo;
      this.updateNumber.mobile = this.formData.mobile;
      this.updateNumber.stopWaterLinkMobile = this.formData.stopWaterLinkMobile;
    },
  },
}
</script>
<style lang="scss">
.custInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
    }
    .two-input {
      width: calc(46% + 10px);
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

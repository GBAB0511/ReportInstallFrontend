
<template>
  <div class="BalanceWithdrawalEdit">
    <el-form class="formBill" size="mini" :inline="true" :model="formData" label-width="130px" ref="ruleForm" :rules="rules">

      <el-form-item label="单据编号：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formData.billNo" placeholder="" disabled></el-input>
      </el-form-item>

      <el-form-item label="单据日期：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formData.billDate" placeholder="" disabled></el-input>
      </el-form-item>

      <legend class="legendColumn">账户信息</legend>
      <el-form-item label="账户编号：" :class="{'disable-item': isEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountNo" :class="{ready_only:isEdit}" :readonly='isEdit' placeholder="" @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-button size="mini" v-if="!isEdit" class='searchBtn' @click="search" icon="el-icon-search"></el-button>

      <el-form-item label="账户类型：" class="disable-item">
        <span>{{searchData.accountTypeName}}</span>
        <!--el-input v-else v-model="searchData.accountType" placeholder="" disabled class="read-only"></el-input-->
      </el-form-item>

      <el-form-item label="账户余额：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="searchData.accountBalance" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>

      <legend class="legendColumn">取出信息</legend>
      <el-form-item label="余额退款方式：" :class="{'disable-item': isEdit}">
        <el-select :disabled="isEdit" clearable v-model="formData.refundWay" @change="changeWay">
            <el-option v-for="(item,index) in dictionaryData.YETNB" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item v-if="showFormItem" label="开户银行：" prop="bankName">
          <span  v-if="isEdit">{{formData.bankName}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankName" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="showFormItem" label="户名：" prop="bankAccountName" style="width: calc(46% + 10px)">
          <span  v-if="isEdit">{{formData.bankAccountName}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankAccountName" placeholder="" clearable></el-input>
        </el-form-item>
      <el-form-item v-if="showFormItem" label="银行账户：" prop="bankAccount" style="width: calc(46% + 10px)">
          <span  v-if="isEdit">{{formData.bankAccount}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankAccount" placeholder="" clearable></el-input>
        </el-form-item>

      <el-form-item label="取出金额：" :class="{'disable-item': isEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :class="{ready_only:isEdit}" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')" v-model="formData.outMoney" placeholder=""></el-input>
      </el-form-item>
      <el-button type="primary" v-if="!isEdit" size="mini">签名</el-button>

      <el-form-item label="备注：" class="f2" :class="{'disable-item': isEdit}">
        <el-input v-model="formData.comments" type="textarea" placeholder="" :class="{ready_only:isEdit}"></el-input>
      </el-form-item>

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
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "BalanceWithdrawalEdit",
  props: ['editNeedData', 'accountNo'],
  components: {
    commonPart,
    uploadFile,
  },
  data() {
    return {
      dictionaryData:[],
      showFormItem:false,
       uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "BILL_BALANCE_OUT",
      tempId:"",
      // 查询条件对象
      tableQuery: {
        accountNo: '',
      },
      // 表单数据
      formData: {
        outMoney: "",
        comments: "",
        refundWay:"1",
        bankName:"",
        bankAccount:"",
        bankAccountName:"",
      },
      // 表单数据
      searchData: {
        accountTypeName: '',
        accountType: '',
        accountBalance: '',
      },
      // 是否可编辑
      isEdit: true,

      rules: {
        userNume: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请输入取出金额", trigger: "blur" }]
      },
      approveFlag: 0,
    };
  },
  mounted() {
    console.log(this.editNeedData);
    // 工作台进入默认模糊查询
    if (window.location.href.indexOf('HallBusiness') > 0 && this.accountNo) {
      this.tableQuery.accountNo = this.accountNo
      this.search()
    }


    if (this.editNeedData.saveType != 'add') {
      this.init()
       eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      this.getHtmlData()
      this.isEdit = false
       this.tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', this.tempId)
    }
    this.getDictionary();
  },
  methods: {

    // 表单初始化
    init() {
      let _this = this
      let params = {
        busicode: "FnBalanceOutQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api.fetch({
        params: params,

      }).then(res => {
        _this.formData = res
        _this.tableQuery.accountNo = _this.formData.accountNo
        _this.search()
        _this.isEdit = true
        if (_this.formData.processState == '' || _this.formData.processState == 'register') {
          _this.isEdit = false
          this.approveFlag = 0;
        } else {
          this.approveFlag = 1;
        }

        _this.changeWay(_this.formData.refundWay)
        
        this.getHtmlData()
      })
    },
    changeWay(item){
      if(item==2){
        this.showFormItem=true
      }else{
        this.showFormItem=false
      }
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "YETNB" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 两个查询按钮
    search() {
      let _this = this

      let params = {
        busicode: "AccountInfoQuery",
        data: {
          accountNo: this.tableQuery.accountNo,
        }
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.searchData = res
      })
    },

    getFormbData() {
      var saveData = {
        "accountNo": this.searchData.accountNo,
        "accountBalance": this.searchData.accountBalance,
        "outMoney": this.formData.outMoney,
        "comments": this.formData.comments,
        "id": this.formData.id,
        "processState": this.formData.processState,
        "refundWay":this.formData.refundWay,
        "bankName":this.formData.bankName,
        "bankAccount":this.formData.bankAccount,
        "bankAccountName":this.formData.bankAccountName,
      }
      return saveData;
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "BILL_BALANCE_OUT",
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
          if (window.location.href.indexOf('WaterSideIndex') > 0 || window.location.href.indexOf('HallBusiness') > 0) {// 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog()
          } else {// 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.editNeedData.busicode
      );
    },


    //余额退款方式
    findName(b){
      let obj =this.dictionaryData.YETNB.filter(item=>item.value==b)
      console.log(obj);
      return obj[0].name
    },
    
    validate () {
      return new Promise((res, rej) => {
        const h = this.$createElement;
          this.$msgbox({
            title: '温馨提示',
            message: h('div', null, [
                h('span', null, [
                h('span', null, '您现在正在操作'), 
                h('span', { style: 'font-weight: bold;font-size: 18px' }, '余额取出')
                ]),
                h('div',null,[h('span', { style: 'margin-top: 12px;font-size: 16px' }, this.editNeedData.ctmName),
                h('span',{style:'margin-top:12px;font-size:16px'},this.editNeedData.accountNo)]),
                h('div', null, [
                h('span', null, '余额退款方式为'), 
                h('span', { style: 'color: #8CD70D'} , this.findName(this.formData.refundWay))
            ]),
                h('div', null, [
                h('span', null, '退款账户为'), 
                h('span', { style: 'color: #8CD70D'} ,this.formData.bankName )
            ]),
            h('div', null, [
              h('span', null, '银行卡号为'), 
              h('span', { style: 'color: #8CD70D'} , this.formData.bankAccount)
            ]),
            h('div', null, [
              h('span', null, [
                '取出金额为', 
                h('span', { style: 'color: #E73814' }, this.formData.outMoney),
                ', 是否确认提交?'
              ])
            ])
          ]),
          showCancelButton: true,
          confirmButtonText: '提交',
          cancelButtonText: '再想想',
          customClass: 'color-dialog'
        }).then(action => {
          res(null)
          return
        }).catch(e => {
          rej()
          return;
        })
      }).then((res) => {

        return res;
      })
      
    },

     async changeBeforeSubmit (b) { //提交前进行校验
      let message = null
      message = await this.validate();
      return message
  }, 

    // 保存方法（由父页面调用）
    save() {
      //console.log("哈哈哈哈哈");
      var _this = this
      var saveData = {
        "accountNo": _this.searchData.accountNo,
        "accountBalance": _this.searchData.accountBalance,
        "outMoney": _this.formData.outMoney,
        "comments": _this.formData.comments,
        "refundWay":_this.formData.refundWay,
        "bankName":_this.formData.bankName,
        "bankAccount":_this.formData.bankAccount,
        "bankAccountName":_this.formData.bankAccountName,
      }
      if (this.editNeedData.busicode == 'FnBalanceOutAdd') {// 添加-保存
        saveData.tempId = this.tempId
      }

      var params = {
        "busicode": "",
        "data": saveData
      }
      if (this.editNeedData.busicode == 'FnBalanceOutAdd') {// 添加-保存
        params.busicode = 'FnBalanceOutAdd'
      } else if (this.editNeedData.busicode == 'FnBalanceOutUpdate') {// 修改-保存
        params.busicode = 'FnBalanceOutUpdate'
        params.data.id = _this.formData.id
        params.data.processState = _this.formData.processState
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: params.busicode == 'FnBalanceOutAdd' ? '添加成功！' : '修改成功！',
          type: 'success'
        });
        // 工作台的返回
        if (window.location.href.indexOf('HallBusiness') > 0) {
          _this.$parent.$parent.closeDialog()
        }else{
          _this.$parent.closeDialog()
        }
        
      })
    },
  }
};
</script>
<style lang="scss">
.BalanceWithdrawalEdit {
  height: 100%;
  overflow-y: auto;
}
</style>
<style>
.color-dialog .el-message-box__btns .el-button:first-child {
    float: right;
    margin-left: 10px;
}
</style>




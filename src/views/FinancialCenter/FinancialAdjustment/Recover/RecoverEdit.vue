<template>
  <div class="RecoverEdit">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="130px"
      ref="ruleForm"
      :disabled="NotDisabled"
    >
      <el-form-item
        label="用户编号："
        v-if="formData.processState=='register'||formData.processState==''||editNeedData.busicode=='FnAddAppendAdd'"
        class="userNo"
      >
        <el-input
          class="read-only"
          v-model="searchUserNum"
          placeholder="请输入用户编号"
          @keydown.enter.native="initUserNo(searchUserNum)"
          clearable
        >
          <el-button
            slot="append"
            class="searchBtn scanning-btn"
            @click="initUserNo"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.busicode!='FnAddAppendAdd'" ref="billInfo"></billInfo>

      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo>

      <!-- 开票信息 -->
      <invoiceInfo ref="invoiceInfo" :editType="NotDisabled==false?1:0" :wayOpen="wayOpen"></invoiceInfo>

      <legend class="legendColumn">罚款信息</legend>
      <el-form-item label="罚款账期：" :class="{'disable-item': NotDisabled}">
        <el-date-picker
          v-if="!NotDisabled"
          :picker-options="pickerOptions"
          v-model="formData.accountPeriod"
          size="mini"
          type="month"
          format="yyyy-MM"
          value-format="yyyyMM"
          placeholder="选择月"
        ></el-date-picker>
        <span v-else>{{formData.accountPeriod}}</span>
      </el-form-item>

      <el-form-item label="罚款日期：" :class="{'disable-item': NotDisabled}">
        <el-date-picker
          v-if="!NotDisabled"
          v-model="formData.meterReadingDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
        <span v-else>{{formData.meterReadingDate}}</span>
      </el-form-item> 

      <el-form-item label="调整类型：" :class="{'disable-item': NotDisabled}">
           <el-select 
                v-model="formData.penaltyType"
                v-if="!NotDisabled"
                 >
                <el-option label="按水量" value="1"></el-option>
                <el-option label="按金额" value="2"></el-option>
            </el-select>
            <span v-else>{{formData.penaltyType === '1' ? '按水量' : (formData.penaltyType === '2' ? '按金额' : '')}}</span>
      </el-form-item>

      <el-form-item label="罚款水量：" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" type="text" v-model="formData.currendPeriodWater" placeholder maxlength="6"
        @keyup.native='keyupEvent($event,input)' :disabled="amountShow"></el-input>
        <span v-else>{{formData.currendPeriodWater}}</span>
      </el-form-item>

      <el-form-item label="用水类型：" :class="{'disable-item': NotDisabled}">
        <el-cascader
          v-if="!NotDisabled"
          v-model="formData.useWaterType"
          :options="waterTypeData"
          :show-all-levels="false"
          :props="props"
        ></el-cascader>
        <span v-else>{{formData.useWaterTypeName}}</span>
      </el-form-item>

      <el-form-item label="费用类型：" class="f2">
        <el-checkbox-group v-model="formData.costId" @change="costTypeChange">
          <el-checkbox v-for="v in costIdOption" :key="v.id" :label="v.id">{{v.costName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="总金额：" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.amountMoney" type="number"  placeholder :disabled="!amountShow"></el-input>
        <span v-else>{{formData.amountMoney}}</span>
      </el-form-item>
      <!--<el-button
        type="primary"
        size="mini"
        @click="CalculationWater"
        icon="el-icon-edit"
      ></el-button>-->

      <el-form-item class="f2" label="备注：" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments" placeholder ></el-input>
        <span v-else>{{formData.comments}}</span>
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
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
import invoiceInfo from "@/views/publicModule/infmtnManagement/invoiceInfo"; //开票信息
export default {
  name: "RecoverEdit",
  props: ["editNeedData"],
  components: {
    uploadFile,
    billInfo,
    invoiceInfo, //开票信息
    userInfo
  },
  data() {
    return {
      costChange: 0,
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_add_penalty",
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      amountShow:false,
      formData: {
        id: "",
        userNo: "", //"用户编号",
        ctmName: "", //"客户名称",
        ctmAddr: "", //"客户地址",
        businessAbode: "", //"营业所",
        linkTel: "", //"固定电话",

        invoiceType: "", //"发票类型",
        invoiceTypeName: '', //发票类型名称
        invoiceTitle: "", //"单位名称",
        invoiceTax: "", //"纳税人识别号",
        invoiceAddr: "", //"购买方联系地址",
        invoiceLink: "", //"购买方联系电话",
        invoiceBank: "", //"人民银行",
        invoiceAccount: "", //"购买方银行账号",

        accountPeriod: "", //"账期",
        meterReadingDate: "", //"追缴日期",
        penaltyType:'1',//调整类型
        currendPeriodWater: "", //"追缴水量",
        useWaterType: "", //"用水类型",
        costId: [], //"费用类型",
        amountMoney: 0.00, //"总金额",
        comments: "" //"备注"
      },
      searchUserNum: "",
      wayOpen: "RecoverEdit",
      waterTypeData: [], //用水类型
      NotDisabled: false, //是否可编辑
      costIdOption: [], //费用类型
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      approveFlag: 0
    };
  },
  mounted() {
    if (this.editNeedData.saveType != 'add') {
      this.init();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId = tempId
      this.getHtmlData();
    }
    this.waterTypeDataOption();
    this.getCostIdOption();
  },
  watch:{
    'formData.penaltyType'(newValue, oldValue) {
　　　　if(newValue == '1')
            this.amountShow = false
       if(newValue == '2')
            this.amountShow = true
    }
  },
  methods: {
    init() {
      let params = {
        busicode: "FnAddAppendList",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          let date = {};
          date = res.list[0];
          date.costId = date.costId.split(",");
          date.accountPeriod = date.accountPeriod + "";
          this.formData = date;

          this.searchUserNum = this.formData.userNo;
          this.initUserNo();
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END"
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          this.getHtmlData();
          //单据信息
          this.getBillData(res.list[0]);
        });
    },
    //小数校验
    keyupEvent(e,input){
      e.target.value=e.target.value.replace(/[^\d.]/g, '');
      e.target.value=e.target.value.replace(/\.{2,}/g, '.');
      e.target.value=e.target.value.replace(/^\./g, '0.');
      e.target.value=e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0,e.target.value.length-1));  
      e.target.value=e.target.value.replace(/^0[^\.]+/g, '0')
      e.target.value=e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
      this.input=e.target.value
      //console.log(this.input)
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_add_penalty",
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
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree"
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res);
          this.$set(this, "waterTypeData", data.children);
        })
        .catch(res => {
          this.$set(this, "waterTypeData", []);
        });
    },
    //用水分类下拉数据
    getCostIdOption() {
      var params = { busicode: "CostList" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "costIdOption", res);
        })
        .catch(res => {
          this.$set(this, "costIdOption", []);
        });
    },
    initUserNo() {
      //用户编号查询
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: this.searchUserNum
      };
      let params = {
        busicode: "UserSelect",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.formData.userNo = res.userInfo.userNo;
          this.formData.ctmName = res.ctmInfo.ctmName;
          this.formData.ctmAddr = res.ctmInfo.ctmAddr;
          this.formData.businessAbode = res.userInfo.businessAbode;
          this.formData.linkTel = res.ctmInfo.linkTel;
          this.getFormData(res);
        });
    },
    getUserData(res) {
      // 用户信息
      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        statusName: res.userInfo.statusName, // 用户状态名称
        houseCert: res.userInfo.houseCert, //户口簿号
        comments: res.userInfo.comments, //备注
        fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限

        reformFlag: res.userInfo.reformFlag, //户表改造标记
        contractNo: res.userInfo.contractNo, //合同编号
        contractAddr: res.userInfo.contractAddr, //合同地址
        contractDate: res.userInfo.contractDate, //合同日期
        businessAbodeName: res.userInfo.businessAbodeName, //营业所
        businessAbode: res.userInfo.businessAbode, //营业所
        adminAreaName: res.userInfo.adminAreaName, //行政区域
        adminArea: res.userInfo.adminArea, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        stopWaterLinkMan: res.userInfo.stopWaterLinkMan, // 停水联系人
        stopWaterLinkMobile: res.userInfo.stopWaterLinkMobile //停水联系手机
      };
    },

    getInvoiceData(res) {
      // 开票信息
      this.invoiceData = {
        invoiceType: res.accountInfo.invoiceType, //发票类型
        invoiceTypeName: res.accountInfo.invoiceTypeName, //发票类型名称
        invoiceTitle: res.accountInfo.invoiceTitle, //单位名称
        invoiceTax: res.accountInfo.invoiceTax, //纳税人识别号
        invoiceAddr: res.accountInfo.invoiceAddr, //联系地址
        invoiceLink: res.accountInfo.invoiceLink, //座机号码
        invoiceBank: res.accountInfo.invoiceBank, //开户银行
        invoiceBankName: res.accountInfo.invoiceBankName, //开户银行名称
        invoiceAccount: res.accountInfo.invoiceAccount //银行账户
      };
      console.log(this.invoiceData)
    },
    getInvoiceDataUpdate(res) {
      // 开票信息
      this.invoiceData = {
        invoiceType: res.invoiceType, //发票类型
        invoiceTypeName: res.invoiceTypeName, //发票类型名称
        invoiceTitle: res.invoiceTitle, //单位名称
        invoiceTax: res.invoiceTax, //纳税人识别号
        invoiceAddr: res.invoiceAddr, //联系地址
        invoiceLink: res.invoiceLink, //座机号码
        invoiceBank: res.invoiceBank, //开户银行
        invoiceBankName: res.invoiceBankName, //开户银行名称
        invoiceAccount: res.invoiceAccount //银行账户
      };
    },
    getFormData(res, type) {
      this.getUserData(res);
      if (this.editNeedData.busicode == "FnAddAppendUpdate") {
        this.getInvoiceDataUpdate(this.formData);
      } else {
        this.getInvoiceData(res);
      }
      //用户信息
      this.$refs.userInfo.init(this.userData);
      this.$refs.invoiceInfo.init(this.invoiceData);
    },
    getFormbData() {
      let val = JSON.parse(JSON.stringify(this.formData));

      val.invoiceType = this.$refs.invoiceInfo.formData.invoiceType; //"发票类型",
      val.invoiceTypeName = this.$refs.invoiceInfo.formData.invoiceTypeName // 发票类型名称
      val.invoiceTitle = this.$refs.invoiceInfo.formData.invoiceTitle; //"单位名称",
      val.invoiceTax = this.$refs.invoiceInfo.formData.invoiceTax; //"纳税人识别号",
      val.invoiceAddr = this.$refs.invoiceInfo.formData.invoiceAddr; //"购买方联系地址",
      val.invoiceLink = this.$refs.invoiceInfo.formData.invoiceLink; //"购买方联系电话",
      val.invoiceBank = this.$refs.invoiceInfo.formData.invoiceBank; //"人民银行",
      val.invoiceAccount = this.$refs.invoiceInfo.formData.invoiceAccount; //"购买方银行账号",
      val.amountMoney  = Number(val.amountMoney )
      // 用水类型 只需要传最后一个值过去
      if (
        typeof val.useWaterType == "object" &&
        val.useWaterType != undefined
      ) {
        val.useWaterType = val.useWaterType[val.useWaterType.length - 1];
      }
      // // 开户银行 数据格式处理
      if (typeof val.invoiceBank == "object" && val.invoiceBank != undefined) {
        val.invoiceBank = val.invoiceBank[val.invoiceBank.length - 1];
      }
      val.costId = val.costId.toString();

      return val;
    },
    submit() {
      if( this.costChange == 1) {
        this.$notify({
          title: "警告",
          message: "费用类型已修改，请重新计算金额",
          type: "warning"
        });
        return;
      }
      let params = {
        busicode: this.editNeedData.busicode,
        data: this.getFormbData()
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success"
        });
        this.$parent.closeDialog();
      });
    },
    costTypeChange() {
        this.costChange = 1
    },
    // 计算金额
    CalculationWater() {
      this.costChange = 0;
      let val = this.formData.useWaterType;
      // 开户银行 数据格式处理
      if (typeof val == "object" && val != undefined) {
        val = val[val.length - 1];
      }
      var params = {
        busicode: "FnAddCostCalculation",
        data: {
          costId: this.formData.costId.join(','),
          // currendPeriodNum: this.formData.currendPeriodNum,
          // priorPeriodNum: this.formData.priorPeriodNum,
          useWaterType: val,
          water: Number(this.formData.currendPeriodWater),
          // userNo: this.formData.userNo
        }
      };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this.formData, "amountMoney", res.money);
          this.$set(this.formData, "currendPeriodWater", res.water);
        })
        .catch(res => {
          this.$set(this.formData, "currendPeriodWater", '');
          this.$set(this.formData, "amountMoney", "");
        });
    }
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.RecoverEdit {
  height: 100%;
  overflow-y: auto;
  .userNo {
    width: 360px;
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
}
</style>


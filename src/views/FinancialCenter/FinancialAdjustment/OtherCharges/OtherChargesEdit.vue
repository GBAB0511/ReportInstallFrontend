<template>
  <div class="OtherChargesEdit">
    <el-form
      class="formBill"
      :disabled="NotDisabled"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="130px"
      ref="ruleForm" :rules="rules"
    >
      <el-form-item
        label="用户编号："
        v-if="formData.processState=='register'||formData.processState==''||editNeedData.busicode=='OtherChageAdd'"
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
      <billInfo v-if="editNeedData.busicode!='OtherChageAdd'" ref="billInfo"></billInfo>

      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo>
      <legend class="legendColumn">收费信息</legend>
      <el-form-item label="费用类型：" prop="costType" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.costType" placeholder>
          <el-option
            v-for="(item,index) in costIdOption"
            :key="index"
            :label="item.costName"
            :value="item.id"
          ></el-option>
        </el-select>
        <span v-else>{{formData.costTypeName}}</span>
      </el-form-item>
      <el-form-item label="费用金额：" prop="costMoney" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.costMoney" type="number"></el-input>
        <span v-else>{{formData.costMoney}}</span>
      </el-form-item>
      <el-form-item label="缴费渠道：" prop="payChannel" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.payChannel" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BPC"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.payChannelName}}</span>
      </el-form-item>
      <el-form-item label="缴费方式：" prop="payWay" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.payWay" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BPW"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.payWayName}}</span>
      </el-form-item>
      <el-form-item label="收费时间：" prop="chargingTime" :class="{'disable-item': NotDisabled}">
        <el-date-picker
          v-if="!NotDisabled"
          v-model="formData.chargingTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择时间"
        ></el-date-picker>
        <span v-else>{{formData.chargingTime}}</span>
      </el-form-item>
      <el-form-item label="收费员：" prop="chargingStaff" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.chargingStaff"></el-input>
        <span v-else>{{formData.chargingStaff}}</span>
      </el-form-item>
      <el-form-item label="发票号码：" prop="invoiceNo" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.invoiceNo"></el-input>
        <span v-else>{{formData.invoiceNo}}</span>
      </el-form-item>
      <!-- <el-form-item label="发票类型：" prop="openInvoiceItem" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" v-model="formData.openInvoiceItem" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BBT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.openInvoiceItemName}}</span>
      </el-form-item> -->
      <el-form-item label="开票时间：" :class="{'disable-item': NotDisabled}">
        <el-date-picker
          v-if="!NotDisabled"
          v-model="formData.openInvoiceTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择时间"
        ></el-date-picker>
        <span v-else>{{formData.openInvoiceTime}}</span>
      </el-form-item>
      <el-form-item label="开票人：" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.openInvoiceStaff"></el-input>
        <span v-else>{{formData.openInvoiceStaff}}</span>
      </el-form-item>
      <el-form-item label="备注：" class="f2" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
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
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "OtherChargesEdit",
  props: ["editNeedData"],
  components: {
    billInfo,
    userInfo,
    uploadFile
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_other_charge",
      NotDisabled: false, //是否可编辑
      costIdOption: [],
      dictionaryData: [],
      wayOpen: "OtherChargesEdit",
      formData: {
        id: "",
        userNo: "",
        costType: "",
        costMoney: "",
        payChannel: "",
        payWay: "",
        chargingTime: "",
        chargingStaff: "",
        invoiceNo: "",
        openInvoiceItem: "",
        openInvoiceTime: "",
        openInvoiceStaff: "",
        comments: "",
        processName: "",
        billNo: "",
        processInstanceId: "",
        setupMeterAddr:''
      },
      searchUserNum: "",
      approveFlag: 0,
      EditShow:false,
      rules:{
        costType:[{ required:true, message:"费用类型不能为空", trigger: 'change'}],
        costMoney:[{ required:true, message:"费用金额不能为空", trigger: 'blur'}],
        payChannel:[{ required:true, message:"缴费渠道不能为空", trigger: 'change'}],
        payWay:[{ required:true, message:"缴费方式不能为空", trigger: 'change'}],
        chargingTime:[{ required:true, message:"收费时间不能为空", trigger: 'change'}],
        chargingStaff:[{ required:true, message:"收费员不能为空", trigger: 'blur'}],
        //invoiceNo:[{ required:true, message:"发票号码不能为空", trigger: 'blur'}],
        // openInvoiceItem:[{ required:true, message:"发票类型不能为空", trigger: 'change'}],
      }
    };
  },
  mounted() {
    if (this.editNeedData.saveType != 'add') {
      this.init();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId= tempId
      this.getHtmlData();
    }
    this.getCostIdOption();
    this.getDictionary();
  },
  methods: {
    init() {
      let params = {
        busicode: "OtherChageList",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res.list[0];
          //单据信息
          this.getBillData(res.list[0]);
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
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_other_charge",
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

    // 数据字典
    getDictionary() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPC,BPW,BBT" //缴费渠道、缴费方式
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this, "dictionaryData", []);
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
          this.formData.setupMeterAddr = res.userInfo.setupMeterAddr;
          this.getFormData(res);
          this.$parent.EditShowVisable(false);
        }).catch(val=>{
          this.$parent.EditShowVisable(true);
        });
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
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
    getFormData(res, type) {
      this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);
    },
    getFormbData() {
      return this.formData;
    },

    submit() {
      let flag = false;
      this.$refs.ruleForm.validate((valid)=>{
        if(!valid){
          flag=true
        }
      });
      if(flag){
        this.$notify({
          title: "验证失败",
          message: "必填信息未完善，请检查",
          type: "error"
        });
        return;
      }
     if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let params = {
        busicode: this.editNeedData.busicode,
        data: this.formData
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
  }
};
</script>
<style lang="scss">
.OtherChargesEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
  .userNo {
    width: 360px;
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
}
</style>
<template>
  <div class="CustomerChangeEdit">
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow"    :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        busicode="ReceiptAccessoryList"
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详细价格" :visible.sync="EditVisible" :close-on-click-modal="false" :append-to-body="true" class="button-dialog" @close="closeDialog">
      <WaterPriceEdit v-if="EditVisible" ref="WaterPriceEdit"></WaterPriceEdit>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeDialog">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户混合用水" :visible.sync="userMixtureVisible" :close-on-click-modal="false" :append-to-body="true" class="button-dialog" :before-close="handleDialogClose1">
      <userMixtureEdit ref="userMixtureEdit" :mixtureData="mixtureData" :isEdit="mixtureEdit" :userNo="userNo"></userMixtureEdit>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
        <el-button type="info" size="mini" plain @click="closeDialog1()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户费用折扣" :visible.sync="userDiscountVisible" :append-to-body="true" :close-on-click-modal="false" class="button-dialog" :before-close="handleDialogClose2">
      <userDiscountEdit ref="userDiscountEdit" :discountData="discountData" :isEdit="discountEdit" :userNo="userNo"></userDiscountEdit>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
        <el-button type="info" size="mini" plain @click="closeDialog2()">关闭</el-button>
      </div>
    </el-dialog>
    <el-form size="mini" class="formBill" :inline="true" :model="formData" label-width="130px" :rules="rules" ref="ruleFormV">

      <el-form-item style="margin-top:1%" label="用户编号：" v-if="searchBtnShow" class="width450">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" v-model="searchUserNum" placeholder="请输入户号" @change="initUserNo" clearable @keydown.enter.native="initUserNo">
          <el-button slot="append" class="searchBtn scanning-btn" @click="initUserNo" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="billStute=='ChangeUserUpdate'" ref="billInfo" :editType="0"></billInfo>

      <el-tabs type="border-card" @tab-click="tabClick" class="tabsBlock">
        <el-tab-pane label="客户资料变更">
          <span slot="label">
            <i class="el-icon-user"></i> 客户资料变更
          </span>
          <!-- 客户信息 -->
          <custInfo ref="custInfo" :editType="custEditType" :wayOpen="wayOpen" :disableCerNo="true" :disableChangeCertNo="true"></custInfo>
        </el-tab-pane>

        <el-tab-pane label="账户资料变更">
          <span slot="label">
            <i class="el-icon-user"></i> 账户资料变更
          </span>
          <div style="overflow: hidden;">
            <accountInfo ref="accountInfo" :editType="accountEditType" :wayOpen="wayOpen" :disableAccountNo="disableAccountNo"></accountInfo>
          </div>
          <div style="overflow: hidden;">
            <invoiceInfo ref="invoiceInfo" :editType="invoiceEditType" :wayOpen="wayOpen"></invoiceInfo>
          </div>

        </el-tab-pane>

        <el-tab-pane label="用户资料变更">
          <span slot="label">
            <i class="el-icon-user"></i> 用户资料变更
          </span>
          <!-- 用户信息 -->
          <userInfo ref="userInfo" :addWay="disabledChangeEdit" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>
          <!-- 抄表信息 -->
          <meterReadInfo ref="meterReadInfo" :editType="meterEditType" :wayOpen="wayOpen"></meterReadInfo>
          <!-- 水表信息 @change="areaHandleChange" -->
          <waterMInfo ref="waterMInfo" :addWay="disabledChangeEdit" :editType="waterMEditType" :wayOpen="wayOpen"></waterMInfo>
        </el-tab-pane>

        <el-tab-pane label="用水类型变更">
          <span slot="label">
            <i class="el-icon-user"></i> 用水类型变更
          </span>
          <el-form-item label="用水类型：" prop="userInfo.useWaterType" :class="{'disable-item': NotDisabled}" :rules="[{ required:true, message:'用水类型变更必填项未完善', trigger: 'change'}]">
            <el-cascader v-if="!NotDisabled" v-model="formData.userInfo.useWaterType" :options="waterTypeData" :show-all-levels="false" :props="props" @change="changeWaterType" :disabled="custEditType==0"></el-cascader>
            <span v-else-if="formData.userInfo.useWaterType == '6'" class="clickable" @click="showUserMixture">{{formData.userInfo.useWaterTypeName}}</span>
            <span v-else>{{formData.userInfo.useWaterTypeName}}</span>
          </el-form-item>
          <el-form-item label="详细价格：">
            <el-button size="mini" type="text" @click="showPrice">查看</el-button>
          </el-form-item>
          <el-form-item label="混合用水：" v-if="isMixture">
            <el-button size="mini" type="text" @click="showUserMixture">查看</el-button>
          </el-form-item>
          <el-form-item label="费用折扣：">
            <el-button size="mini" type="text" @click="showUserDiscount">查看</el-button>
          </el-form-item>
          <el-form-item label="容量水价：" v-if="isShowCapacityWaterPrice">
            <span>{{capaMoney}}</span>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="用水人口变更">
          <span slot="label">
            <i class="el-icon-user"></i> 用水人口变更
          </span>
          <wPopulation :editType="wPopulationType" :wayOpen="wayOpen" ref="wPopulation"></wPopulation>
        </el-tab-pane>

        <el-tab-pane label="优惠用水变更">
          <span slot="label">
            <i class="el-icon-user"></i> 优惠用水变更
          </span>
          <!-- 价格信息 -->
          <priceInfo ref="priceInfo" :editType="priceEditType" :wayOpen="wayOpen"></priceInfo>
        </el-tab-pane>

        <!-- <el-tab-pane label="缴费方式变更">
          <span slot="label">
            <i class="el-icon-user"></i> 缴费方式变更
          </span>
          <accountInfo ref="accountInfo" :editType="accountEditType" :wayOpen="wayOpen"></accountInfo>
        </el-tab-pane> -->

      </el-tabs>

      <!-- <legend class="legendColumn" v-if="changeMattersShow">变更事项</legend>
      <changeMatters :changeMattersData="changeMattersData" v-if="changeMattersShow"></changeMatters> -->

      <legend class="legendColumn">上传附件
        <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
      </legend>
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>

      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv" v-if="workflowShow"></div>
    </el-form>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import changeMatters from "@/components/changeMatters"; //变更事项
import customerManagementEdit from "@/views/CustomerCenter/customerManagement/customerManagementEdit"; //客户资料变更

import wPopulation from "./wPopulation"; //用水类型变更
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
// import custInfo from "@/views/publicModule/infmtnManagement/custInfo";
import custInfo from "@/views/publicModule/infmtnManagement/CustomerChangeEditNeedCustInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";
import meterReadInfo from "@/views/publicModule/infmtnManagement/meterReadInfo";
import waterMInfo from "@/views/publicModule/infmtnManagement/waterMInfo";
// import accountInfo from "@/views/publicModule/infmtnManagement/accountInfo";
import accountInfo from "@/views/publicModule/infmtnManagement/CustomerChangeEditNeedAccountInfo";
// import invoiceInfo from "@/views/publicModule/infmtnManagement/invoiceInfo";
import invoiceInfo from "@/views/publicModule/infmtnManagement/CustomerChangeEditNeedInvoiceInfo";
import priceInfo from "@/views/publicModule/infmtnManagement/priceInfo";
import WaterPriceEdit from "@/views/FinancialCenter/PriceContrl/WaterPrice/WaterPriceEdit"; //
import userMixtureEdit from "@/views/publicModule/infmtnManagement/userMixtureEdit"; //
import userDiscountEdit from "@/views/publicModule/infmtnManagement/userDiscountEdit"; //
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "CustomerChangeEdit",
  props: ["idCuster", "billStute", 'fuzzyQuery', 'mainUserNo'],
  components: {
    uploadFile,
    customerManagementEdit,
    changeMatters,
    wPopulation,
  AttachmentViewInfo,
    billInfo,
    custInfo,
    userInfo,
    meterReadInfo,
    waterMInfo,
    accountInfo,
    invoiceInfo,
    priceInfo,
    WaterPriceEdit,
    userMixtureEdit,
    userDiscountEdit,
  },
  data () {
    return {
      isShowCapacityWaterPrice: false,//是否显示容量水价
      capaMoney: "",
      disabledChangeEdit: false,//动态表单状态判断

      msWaterInfo: {

        // 用户-水表信息(提交进行对比去掉无需提交的字段)
        virtualDesignFormulas: "", //虚拟计算公式：
        meterPatternName: "", //水表型式
        protocolName: "",
        valvueControlName: "",
        // setupMeterDate: "", //装表日期：
        // changeMeterDate: "", //换表日期：
        // splitMeterDate: "", //拆表日期：
        splitMeterWay: "", //拆表类型：
        splitMeterWayName: "", //拆表类型：
        // fatherMeterNo: "", //总表编号：
        // meterType: "", //水表类型：
        mastarNo: "",
        // meterTypeName: "",//水表类型：
        // 用户-水表信息
        factoryNo: "", //水表表身号：
        meterBore: "", //水表口径：
        meterFactoryName: "", //水表厂家：
        meterFactory: "", //水表厂家：
        transmittalModel: "",//传输方式
        meterModelName: "", //水表型号：
        meterModel: "",
        transCommFee: "", //远传通讯费：
        commOperatorName: "", //通讯运营商：
        commFeeStart: "", //通讯费开始日期：
        commFeeEnd: "", //通讯费结束日期：
        meterBoreName: "",//水表口径：
        transmittalModelName: "",//传输方式
        meterSensorName: "",//传感器
        meterSensor: "",////传感器
        maxValue: "",//"满码值"
        valveControl: "",//是否阀控,
        protocol: "",//"下行规约"
        meterPattern: "",//水表型式
        shelfLife: "",//"使用期限"
      },
      uploadFileShow: true,
      userMixtureVisible: false,    //混合用水
      userMixtureData: { list: [] },
      userDiscountVisible: false,   //费用折扣
      userDiscountData: { list: [] },
      uploadIcon: "el-icon-minus",
      receiptType: "USER_CHANGE",
      residueData: [{ "id": 1, "name": "是" }, { "id": 2, "name": "否" }],
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      searchBtnShow: true,
      searchUserNum: "",
      changeMattersShow: true,
      changeMattersData: {},
      wayOpen: "changeMangement",
      //是否可以填写
      custEditType: 1,
      accountEditType: 1,
      invoiceEditType: 1,
      userInfoEditType: 1,
      meterEditType: 1,
      waterMEditType: 1,
      priceEditType: 1,
      wPopulationType: 1,
      //表单数据
      formData: {
        userInfo: {
          useWaterType: []
        },
        userChangeInfo: {}
      },
      // 价格模块数据
      priceData: {},
      //客户信息
      custData: {},
      //单据信息
      billData: {},
      //用户信息
      userData: {},
      //抄表信息
      meterReadData: {},
      //水表信息
      waterMData: {},
      //账户信息
      accountData: {},
      //开票信息
      invoiceData: {},
      //用水类型
      waterTypeData: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      approveFlag: 0,
      NotDisabled: false, //是否可编辑
      EditVisible: false,//详细价格
      workflowShow: true,
      isMixture: false,//是否混合用水
      rules: {

      },
      ruleFormV: {
        userInfo: {
          //useWaterType:[{ required:true, message:"用水类型变更必填项未完善", trigger: 'change'}],
        }
      },
      accountlist: [],
      mixtureData: { list: [] },
      mixtureEdit: false,
      discountData: { list: [] },
      discountEdit: false,
      userNo: "",
      disableAccountNo: false,

        // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
    };
  },
  mounted () {
    this.waterTypeDataOption();
    this.getIsShowCapacityWaterPrice();
    this.getclientAddrConfig();
    this.workflowShow = false;
    if (this.idCuster && this.idCuster.id != "") {
      this.searchBtnShow = false;
      this.changeMattersShow = true;
      this.init();
      this.initAccessory()
      eventBus.$emit('receiptId', this.idCuster.id)
    } else {


      this.searchBtnShow = true;
      this.changeMattersShow = false;
      let tempId = this.util.generateUUID()
      this.formData.userChangeInfo.tempId = tempId
      this.getHtmlData();
      eventBus.$emit('receiptId', tempId)
      if (this.idCuster && this.idCuster.userNo) {
        this.searchUserNum = this.idCuster.userNo;
        this.initUserNo();
      }

    }

    if (this.mainUserNo) {
      this.searchUserNum = this.mainUserNo;
      this.initUserNo();
    }
    this.workflowShow = true;
    if (window.location.href.indexOf('HallBusiness') > -1) {// 工作台进入默认查模糊查询框内的数据
      this.searchBtnShow = true
    }
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    /*
    this.common.changeTable(this, ".CustomerChangeEdit .kl-table", [
      ".CustomerChangeEdit .toolbar",
      ".CustomerChangeEdit .block",
      ".CustomerChangeEdit .bread-contain"
    ]);*/
    eventBus.$on('getAccoInvoData', (formData, type) => {
      this.getAccoInvoData(formData, type)
    })
  },
  methods: {
    //上传附件
    uploadAttachment(file) {
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId:this.idCuster && this.idCuster.id != ""? this.idCuster.id:this.formData.userChangeInfo.tempId,
          receiptType: this.receiptType,
          accessoryNo: "000",
          file: file.file
        },
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });

          _this.$parent.AttachmentQty = _this.$parent.AttachmentQty + 1
        });
    },
           initAccessory(){    //初始化附件个数
        let _this = this;
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType:this.receiptType,
              receiptId: this.idCuster.id
            }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res != null && res.length > 0) {
            _this.$parent.AttachmentQty = res.length
          }else{
            _this.$parent.AttachmentQty=0
          }

        });
    },

        // 查看附件按钮
    viewAttachment(type) {
      this.receiptAccessory = {
        receiptType:this.receiptType,
        receiptId:this.idCuster && this.idCuster.id != ""? this.idCuster.id:this.formData.userChangeInfo.tempId
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
      this.$emit('closeAttachment')
    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init () {
      let mixtureType = 2;//查询混合用水表  1：正式   2：临时
      let discountType = 2;//查询费用折扣表  1：正式   2：临时
      let _this = this
      let params = {
        busicode: "ChangeUserQuery",
        data: { id: this.idCuster.id }
      };
      this.$api
        .fetch({ params })
        .then(res => {
          this.formData = res;
          //debugger;
          if (
            this.formData.userChangeInfo.processState == "approval" ||
            this.formData.userChangeInfo.processState == "END" ||
            this.formData.processState == 'CANCEL'
          ) {
            this.disabledChangeEdit = true
          } else {
            this.disabledChangeEdit = false

          }
          this.$nextTick(() => {
            this.$refs.custInfo.adminAreaDataByFullName(res.ctmInfo.clientAddr)
            // this.$refs.userInfo.$refs.dynamicForm.adminAreaDataByFullName(res.userInfo.clientContractAddr)
            // this.$refs.userInfo.$refs.dynamicForm.editFormData.clientContractAddr = this.$refs.userInfo.$refs.dynamicForm.editFormData.clientContractAddrId;
            // console.log('test',this.$refs.userInfo.$refs.dynamicForm.editFormData.clientContractAddr)
          });
          this.searchUserNum = res.userNo;
          this.capaMoney = res.userInfo.capaMoney;
          this.getFormData(res);
          //单据信息
          this.getBillData(res);

          this.$refs.wPopulation.init(res.person);
          if (this.formData.userInfo.useWaterType == "6")
            this.isMixture = true
          this.changeMattersData = res.userChangeInfo.changeItems;
          let userWaterType = this.getFathersById(res.userInfo.useWaterType, JSON.parse(JSON.stringify(this.waterTypeData)), 'id');
          this.formData.userInfo.useWaterType = userWaterType;

          if (
            this.formData.userChangeInfo.processState == "approval" ||
            this.formData.userChangeInfo.processState == "END" ||
            this.formData.processState == 'CANCEL'
          ) {
            this.NotDisabled = true;

            this.approveFlag = 1;
            // this.EditMethod(0);
            this.mixtureEdit = true;
            this.discountEdit = true;
          }
          if (this.formData.userChangeInfo.processState == "" || this.formData.userChangeInfo.processState == "draft"|| this.formData.userChangeInfo.processState == "Process-task0")
            this.EditMethod(1)
          else
            this.EditMethod(0)
          if (this.formData.userChangeInfo.processState != "") {
            this.disableAccountNo = true;
          }
          if (this.formData.userChangeInfo.processState === "END") {
            mixtureType = 1;
            discountType = 1;
          }
          _this.userNo = res.userInfo.userNo;
          _this.editMixture(mixtureType);
          _this.editDiscount(discountType);
          _this.$refs.uploadFiles.editUserNo(res.userInfo.userNo)
          this.getHtmlData();

        })
        .catch(res => { });
    },
    editMixture (mixtureType) {
      let _this = this
      let params = {
        busicode: "UserMinxtureList",
        data: { id: _this.idCuster.id, userNo: _this.userNo, type: mixtureType }
      }
      _this.$api.fetch({ params }).then(mixtureData => {
        this.mixtureData = mixtureData
      });
    },
    editDiscount (discountType) {
      let _this = this
      let params = {
        busicode: "UserDiscountList",
        data: { id: _this.idCuster.id, userNo: _this.userNo, type: discountType }
      }
      _this.$api.fetch({ params }).then(discountData => {
        this.discountData = discountData
      });
    },
    EditMethod (val) {
      this.custEditType = val;
      this.accountEditType = val;
      this.invoiceEditType = val;
      this.userInfoEditType = val;
      this.meterEditType = val;
      this.waterMEditType = val;
      this.priceEditType = val;
      this.wPopulationType = val;
    },
    async showUserMixture () {
      let _this = this
      this.userMixtureVisible = true
      try {
        let val = this.common.handleTreeData(this.formData.userInfo.useWaterType)
        let type = 1
        if (this.idCuster && this.idCuster.id != "") {
          type = 2
        }
        if (!val) {
          _this.$message({
            message: "请先选择用水类型",
            type: "warning"
          });
          return
        }
        // if (window.location.href.indexOf('HallBusiness') > 0) {
        //     setTimeout(() => {
        //       $('.v-modal').css('z-index', '0')
        //     }, 1000);
        //   }
      } catch (e) {
        return
      }
    },
    async showUserDiscount () {
      let _this = this
      this.userDiscountVisible = true
      // try{

      //   if (window.location.href.indexOf('HallBusiness') > 0) {
      //       setTimeout(() => {
      //         $('.v-modal').css('z-index', '0')
      //       }, 1000);
      //     }
      // }catch (e) {
      //   return
      // }
    },
    async showPrice () {
      let _this = this


      try {
        let val = this.common.handleTreeData(this.formData.userInfo.useWaterType)
        if (!val) {
          _this.$message({
            message: "请先选择用水类型",
            type: "warning"
          });
          return
        }
        let getId = await this.$api.fetch({ params: { busicode: 'GetWaterPriceId', data: { id: val } } });
        if (getId.id) {
          let valForm = await this.$api.fetch({ params: { busicode: 'WaterPriceQuery', data: { id: getId.id } } });
          let handleData = valForm.WaterPricebean;
          _this.EditVisible = true
          setTimeout(() => {
            _this.$refs.WaterPriceEdit.costNameOptions = valForm.costlist;
            _this.$refs.WaterPriceEdit.editData(handleData);
            _this.$refs.WaterPriceEdit.EditRight = false;
            _this.$refs.WaterPriceEdit.EditShow = false
          }, 1000);

        } else {
          _this.$message({
            message: "此用水类型暂无价格信息",
            type: "warning"
          });
        }

      } catch (e) {
        return
      }
    },
    handleDialogClose1 () {
      var result = this.$refs.userMixtureEdit.check("checkValue");
      if (result == "")
        this.userMixtureVisible = false
    },
    handleDialogClose2 () {
      this.userDiscountVisible = false
    },
    closeDialog1 () {
      var result = this.$refs.userMixtureEdit.check("checkValue");
      if (result == "")
        this.userMixtureVisible = false
    },
    closeDialog2 () {
      this.userDiscountVisible = false
    },
    getIsShowCapacityWaterPrice () {//获取容量水价配置
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'rlsj_change',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if (res.list.length && res.list[0].configValue == "1") {//为1则启用
            _this.isShowCapacityWaterPrice = true;
          }
        })
    },
    getclientAddrConfig(){
        let params = {
            busicode: "ConfigList",
            data: {
                searchContent: "STRUCTURED_ADDRESS",
                status: 1
            }
        }
        this.$api
        .fetch({
          params
        })
        .then(res => {
            console.log('res', res)
          if (res.list.length && res.list[0].configValue == "1") {//为1则启用
            this.$refs.custInfo.isShowclientAddr = true;
            this.$refs.userInfo.$refs.dynamicForm.isShowClientContractAddr = true;
            console.log('_this.$refs.custInfo.isShowclientAddr',this.$refs.custInfo.isShowclientAddr)
          }else{
            this.$refs.custInfo.isShowclientAddr = false;
            this.$refs.userInfo.$refs.dynamicForm.isShowClientContractAddr = false;
          }
        })
    },
    getCapacityWaterPrice () {

      let params = {
        busicode: "UserCapaMoneyChange",
        data: {
          meterBore: this.waterMData.msInfo.meterBore,
          useWaterType: this.common.handleTreeData(this.formData.userInfo.useWaterType),
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          this.capaMoney = res.capaMoney;
        })
    },
    changeWaterType () {
      if (this.isShowCapacityWaterPrice) {
        this.getCapacityWaterPrice();
      }
      let waterType = JSON.parse(JSON.stringify(this.formData.userInfo.useWaterType))
      if (waterType.pop() == "6")
        this.isMixture = true;
      else
        this.isMixture = false;

    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "USER_CHANGE",
        "审批流配置:" +
        _this.formData.userChangeInfo.processName +
        "(" +
        _this.formData.userChangeInfo.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.userChangeInfo.id, // 任务id
        _this.formData.userChangeInfo.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.billStute
      );
    },
    tabClick (tab, event) { },
    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.userChangeInfo.billNo, //单据编号
        billDate: res.userChangeInfo.billDate //单据日期
      };
      this.$refs.billInfo && this.$refs.billInfo.init(this.billData);
    },
    getCustData (res) {
      // 客户信息
      this.custData = {
        ctmNo: res.ctmInfo.ctmNo, //客户编号：
        ctmName: res.ctmInfo.ctmName, //客户名称：
        certNo: res.ctmInfo.certNo, //客户身份证号：
        certType: res.ctmInfo.certType, //证件类型：
        certTypeName: res.ctmInfo.certTypeName, //证件类型：
        ctmAddr: res.ctmInfo.ctmAddr, //客户地址：
        clientAddr: res.ctmInfo.clientAddr,
        clientAddrDetail: res.ctmInfo.clientAddrDetail,
        ctmType: res.ctmInfo.ctmType, //客户类型：
        ctmTypeName: res.ctmInfo.ctmTypeName, //客户类型：
        creditLevel: res.ctmInfo.creditLevel, //信用等级：
        creditLevelName: res.ctmInfo.creditLevelName, //信用等级：
        linkMan: res.ctmInfo.linkMan, //联系人：
        linkTel: res.ctmInfo.linkTel, //固定电话：
        mobile: res.ctmInfo.mobile, //手机号码：
        faxNumber: res.ctmInfo.faxNumber,
        id: res.ctmInfo.id
      };
    },
    getUserData (res) {
      // 用户信息
      let nodeId = res.userInfo.adminArea
      let cascaderData = this.$refs.userInfo.adminAreaData
      let msg = this.getCascaderFullValue(cascaderData, nodeId);

      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        statusName: res.userInfo.statusName, //用户状态
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
        adminArea: msg, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类F
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        oldUserNo: res.userInfo.oldUserNo, //旧用户编号
        stopWaterLinkMan: res.userInfo.stopWaterLinkMan, //停水联系人
        stopWaterLinkMobile: res.userInfo.stopWaterLinkMobile, //停水联系手机
        userGroupNo: res.userInfo.userGroupNo,
        setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：
        clientContractAddr: res.userInfo.clientContractAddr,
        clientContractAddrDetail: res.userInfo.clientContractAddrDetail,
        clientContractAddrId: res.userInfo.clientContractAddrId,//结构化地址ID（带入集中器）
        id: res.userInfo.id,
        yearWater: res.userInfo.yearWater,//年用水量
        quotaWater: res.userInfo.quotaWater,//足额水量
        lastReadingNum: res.userInfo.lastReadingNum, //最后抄码
        realEstateNo: res.userInfo.realEstateNo,//不动产单元号
        nfcCode: res.userInfo.nfcCode,//nfcCode
        //setupMeterAddr: res.userInfo.setupMeterAddr,
        bankCode: res.userInfo.bankCode, // 子银行账户
        bankSubAccount: res.userInfo.bankSubAccount, // 子银行
        area:res.userInfo.area,//旧行政区域
        areaName:res.userInfo.areaName
      };
    },
    getWaterMData (res) {
      let valMeter = {
        meterNo: res.userInfo.meterNo, //水表编号：
        //setupMeterAddr: res.userInfo.setupMeterAddr, //装表地址：迁移到userData
        setupMeterLocation: res.userInfo.setupMeterLocation, //装表位置：
        setupMeterLocationName: res.userInfo.setupMeterLocationName, //装表位置：
        virtualDesignFormulas: res.userInfo.virtualDesignFormulas, //虚拟计算公式：
        meterUse: res.userInfo.meterUse, //水表用途：
        meterUseName: res.userInfo.meterUseName, //水表用途：
        mastarNo: res.userInfo.mastarNo,//主表编号
        useWaterObject: res.userInfo.useWaterObject, //用水对象：
        useWaterObjectName: res.userInfo.useWaterObjectName, //用水对象：
        meterType: res.userInfo.meterType, //水表类型：
        meterTypeName: res.userInfo.meterTypeName, //水表类型：
        setupMeterDate: res.userInfo.setupMeterDate, //装表日期：
        changeMeterDate: res.userInfo.changeMeterDate, //换表日期：
        splitMeterDate: res.userInfo.splitMeterDate, //拆表日期：
        splitMeterWay: res.userInfo.splitMeterWay, //拆表类型：
        splitMeterWayName: res.userInfo.splitMeterWayName, //拆表类型：
        fatherMeterNo: res.userInfo.fatherMeterNo, //总表编号
        concentratorNo: res.userInfo.concentratorNo //集中器
      };
      let key = "userInfo";
      this.waterMData[key] = valMeter;
    },
    getWMeterData (res) {
      // 水表信息
      let valMeter = {
        meterModel: res.msInfo.meterModel, //水表型号
        meterTypeName: res.msInfo.meterTypeName, //水表类型
        factoryNo: res.msInfo.factoryNo,
        meterBoreName: res.msInfo.meterBoreName, //水表口径
        meterBore: res.msInfo.meterBore, //水表口径
        meterFactoryName: res.msInfo.meterFactoryName, //水表厂家
        meterFactory: res.msInfo.meterFactory, //水表厂家
        transmittalModel: res.msInfo.transmittalModel,//传输方式
        transmittalModelName: res.msInfo.transmittalModelName,//传输方式
        meterModelName: res.msInfo.meterModelName, //水表型号
        transCommFee: res.msInfo.transCommFee, //远传通讯费
        commOperatorName: res.msInfo.commOperatorName, //通讯运营商
        commOperator: res.msInfo.commOperator, //通讯运营商
        commFeeStart: res.msInfo.commFeeStart, //通讯费开始日期
        commFeeEnd: res.msInfo.commFeeEnd, //通讯费结束日期
        meterPatternName: res.msInfo.meterPatternName, //水表型式
        meterPattern: res.msInfo.meterPattern, //水表型式
        protocol: res.msInfo.protocol, //下行规约
        protocolName: res.msInfo.protocolName, //下行规约
        valveControl: res.msInfo.valveControl, //是否阀控
        valveControlName: res.msInfo.valveControlName, //是否阀控
        // transmissionName: res.msInfo.transmissionName,//是否远传
        meterSensorName: res.msInfo.meterSensorName, //水表传感器
        meterSensor: res.msInfo.meterSensor, //水表传感器
        maxValue: res.msInfo.maxValue, //满码值
        shelfLife: res.msInfo.shelfLife, //使用期限
        meterSite: res.userInfo.meterSite,//表位
        meterBjwz: res.userInfo.meterBjwz,//表井位置
        meterBjxs: res.userInfo.meterBjxs,//表井形式
        meterSiteName: res.userInfo.meterSiteName,//表位
        meterBjwzName: res.userInfo.meterBjwzName,//表井位置
        meterBjxsName: res.userInfo.meterBjxsName,//表井形式
        meterBjms: res.userInfo.meterBjms, //表井模式
        meterBjmsName: res.userInfo.meterBjmsName, //表井模式
        valveStatus: res.msInfo.valveStatus, // 阀门状态
      };
      let key = "msInfo";
      this.waterMData[key] = valMeter;
    },
    getMeterReadData (res) {
      // 抄表信息
      this.meterReadData = {
        bookNo: res.userInfo.bookNo, //册本号
        sortNo: res.userInfo.sortNo, //排序号
        lastReadingDate: res.userInfo.lastReadingDate, //抄表日
        meterReadingCycle: res.userInfo.meterReadingCycle, //抄表周期
        meterReadingCycleName: res.userInfo.meterReadingCycleName, //抄表周期
        // lastReadingNum: res.userInfo.lastReadingNum, //最后抄码
        threePeriodAvgWater: res.userInfo.threePeriodAvgWater,//三期均量
        openAccountLastMonth: res.userInfo.openAccountLastMonth,//最后开账账期
        nextMonthid: res.userInfo.nextMonthid,//下次抄表月
      };
    },
    getAccountData (res) {
      let {
        accountNo, //账户编号
        payWay, //缴费方式
        payWayName, //缴费方式
        accountType, //账户类型
        accountTypeName, //账户类型
        openAccountBank, //开户银行
        openAccountBankName, //开户名称
        openAccountName,
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverWayName, //投递方式
        deliverAddr, //投递地址
        emailAddr, //邮箱地址
        accountBalance,//账户余额
        bankSn,//开户行号
        outNo, //出盘编号
        id
      } = res.accountInfo;
      // 账户信息
      this.accountData = {
        accountNo, //账户编号
        payWay, //缴费方式
        payWayName, //缴费方式
        accountType, //账户类型
        accountTypeName, //账户类型
        openAccountBank, //开户银行
        openAccountBankName, //开户名称
        openAccountName,
        bankAccount, //银行账户
        entrustNo, //托号
        entrustContract, //托收合同
        deliverWay, //投递方式
        deliverWayName, //投递方式
        deliverAddr, //投递地址
        emailAddr, //邮箱地址
        accountBalance,//账户余额
        bankSn,//开户行号
        outNo, //出盘编号
        id
      };
    },
    getInvoiceData (res) {
      // 开票信息
      this.invoiceData = {
        invoiceType: res.accountInfo.invoiceType, //发票类型
        invoiceTypeName: res.accountInfo.invoiceTypeName, //发票类型
        invoiceTitle: res.accountInfo.invoiceTitle, //单位名称
        invoiceTax: res.accountInfo.invoiceTax, //纳税人识别号
        invoiceAddr: res.accountInfo.invoiceAddr, //联系地址
        invoiceLink: res.accountInfo.invoiceLink, //座机号码
        invoiceBank: res.accountInfo.invoiceBank, //开户银行
        invoiceBankName: res.accountInfo.invoiceBankName, //开户银行
        invoiceAccount: res.accountInfo.invoiceAccount, //银行账户
        vatFlag: res.accountInfo.vatFlag, //增值税标识
        vatFlagName: res.accountInfo.vatFlagName, //增值税标识
        preInvoicing: res.accountInfo.preInvoicing, // 预开票标记
        mergeInvoicing: res.accountInfo.mergeInvoicing, //合并开票
      };
    },
    getPriceData (res) {
      // 价格信息
      this.priceData = {
        useWaterTypeName: res.userInfo.useWaterTypeName, //用水类型：
        useWaterType: res.userInfo.userWaterType, //用水类型：
        prefStrategyName: res.userInfo.prefStrategyName, //优惠策略：
        prefStrategyId: res.userInfo.prefStrategyId, //优惠策略id
        prefCertNo: res.userInfo.prefCertNo, //优惠证件号码：
        prefBeginDate: res.userInfo.prefBeginDate, //优惠策略开始日期：
        prefEndDate: res.userInfo.prefEndDate, //优惠策略结束日期：
        ladderPersonNum: res.userInfo.ladderPersonNum, //用水人口：
      };
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
    //用水分类下拉数据
    waterTypeDataOption () {
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

    getFormData (res) {
      // 1 客户编号为空
      if (!res.accountInfo.accountNo) {
        this.getaccountCusData(res.ctmInfo.ctmNo);
      }
      this.getWaterMData(res);
      this.getCustData(res);
      this.getUserData(res);
      this.getWMeterData(res);
      this.getMeterReadData(res);
      this.getAccountData(res);
      this.getInvoiceData(res);
      this.getPriceData(res);
      //客户信息
      this.$refs.custInfo.init(this.custData);

      //用户信息
      this.$refs.userInfo.init(this.userData);

      //水表信息
      this.$refs.waterMInfo.init(this.waterMData);

      //抄表信息
      this.$refs.meterReadInfo.init(this.meterReadData);

      //账户信息
      this.$refs.accountInfo.init(this.accountData);
      this.$refs.accountInfo.getAccountList(res.ctmInfo.ctmNo)

      //开票信息
      this.$refs.invoiceInfo.init(this.invoiceData);

      //价格信息
      this.$refs.priceInfo.init(this.priceData);
    },
    //切换客户时
    async getaccountCusData (val) {
      let QuerySameAcPar = {
        busicode: "QuerySameAccount",
        data: { ctmNo: val }
      };
      let a = await this.$api.fetch({ params: QuerySameAcPar });
      let b = {};
      //清空账户下拉框数据
      this.$refs.accountInfo.accountlist = [];

      if (a.length == 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
        this.accountlist = a;
      } else if (a.length < 1) {
        b.accountInfo = {};
        this.getAccountData(b);
        this.getInvoiceData(b);

        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
      } else if (a.length > 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);

        this.$refs.accountInfo.accountlist = a;
        this.accountlist = a;
      }
    },
    // 清空账户、开票数据
    getAccoInvoData (val, type) {
      this.$refs.accountInfo.accountlist = this.accountlist;
      if (type === "clear") {
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        val = {
          // 账户信息
          accountNo: "", //账户编号
          payWay: "3", //缴费方式
          payWayName: "",
          accountType: "1", //账户类型
          accountTypeName: "",
          openAccountBank: "", //开户银行
          openAccountName: "", //开户名称
          bankAccount: "", //银行账户
          entrustNo: "", //托号
          entrustContract: "", //托收合同
          deliverWay: "", //投递方式
          deliverAddr: "", //投递地址
          emailAddr: "", //邮箱地址
          // 开票信息
          invoiceType: "1", //发票类型
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "" //银行账户
        };
        //账户信息
        this.$refs.accountInfo.init(val);
        //开票信息
        this.$refs.invoiceInfo.init(val);
      } else if (type == "getValue") {
        this.accountEditType = 1;
        this.invoiceEditType = 1;
        this.$refs.accountInfo.init(val);
        //开票信息
        this.$refs.invoiceInfo.init(val);
      }
    },
    initUserNo () {
      //用户编号查询
      let _this = this
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: this.searchUserNum,
        status: 6,//变更
      };
      let params = { busicode: "UserSelect", data };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.formData.ctmNo = res.ctmInfo.ctmNo;
          this.formData.userNo = res.userInfo.userNo;
          this.capaMoney = res.userInfo.capaMoney;
          this.$refs.wPopulation.init(res.person);
          let userWaterType = this.getFathersById(res.userInfo.useWaterType, JSON.parse(JSON.stringify(this.waterTypeData)), 'id');
          _this.formData.userInfo.useWaterType = userWaterType;
          this.getFormData(res);





          this.$refs.uploadFiles.editUserNo(res.userInfo.userNo)

          this.userNo = res.userInfo.userNo;
          if (this.formData.userInfo.useWaterType == "6") {
            this.isMixture = true
            _this.editMixture(1);
          }
          _this.editDiscount(1);
          this.$nextTick(() => {
            this.$refs.custInfo.adminAreaDataByFullName(res.ctmInfo.clientAddr)
            // this.$refs.userInfo.$refs.dynamicForm.adminAreaDataByFullName(res.userInfo.clientContractAddr)
            // this.$refs.userInfo.$refs.dynamicForm.editFormData.clientContractAddr = this.$refs.userInfo.$refs.dynamicForm.editFormData.clientContractAddrId;
          });
        })
        .catch(res => { });
    },
    //根据节点id获取全路径
    //节点id
    //匹配数据
    //字段名
    getFathersById (id, data, prop) {
      var arrRes = []
      const rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          const node = data[i]
          if (node[prop] === nodeId) {
            arrRes.unshift(node[prop])
            return true
          } else {
            if (node.children && node.children.length) {
              if (rev(node.children, nodeId)) {
                arrRes.unshift(node[prop])
                return true
              }
            }
          }
        }
        return false
      }
      rev(data, id)
      return arrRes
    },
    //用水类型下拉框值发生改变
    areaHandleChange (value) {
      let length = value.length;
      this.formData.userInfo.adminArea = value[length - 1];
    },
    indexMethod (index) {
      return (
        (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1)
      );
    },
    indexMethod1 (index) {
      //获取表格序号
      return (index + 1);
    },
    getChangeVal (val) {
      if (val == '否') {
        val = 0
      } else if (val == '是') {
        val = 1
      }
      return val
    },
    getFormbData () {
      //  if(this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag =='否'){
      //      //户表标记判断转换（是/否）  提交表单数据需相应转换数字
      //        this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag = 0

      //  }else if(this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag == '是'){
      //        this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag = 1
      //          }
      this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag = this.getChangeVal(this.$refs.userInfo.$refs.dynamicForm.editFormData.reformFlag)
      this.$refs.userInfo.$refs.dynamicForm.editFormData.valveControl = this.getChangeVal(this.$refs.userInfo.$refs.dynamicForm.editFormData.valveControl)
      for (var i in this.$refs.waterMInfo.$refs.dynamicForm.editFormData) {
        //提交表单-去掉相应水表表单字段
        for (var j in this.msWaterInfo) {
          if (i == j) {
            delete this.$refs.waterMInfo.$refs.dynamicForm.editFormData[i]
          }
        }
      }
      let useWaterType = {
        useWaterType: this.formData.userInfo.useWaterType
      }
      let val = {
        accountInfo: {
          ...this.$refs.accountInfo.formData,
          ...this.$refs.invoiceInfo.formData
        },
        ctmInfo: {
          ...this.$refs.custInfo.formData
        },
        userInfo: {
          ...this.$refs.userInfo.$refs.dynamicForm.editFormData,
          ...this.$refs.waterMInfo.$refs.dynamicForm.editFormData,
          // ...this.$refs.userInfo.formData,
          // ...this.$refs.waterMInfo.formData.userInfo,
          ...this.$refs.meterReadInfo.formData,
          ...this.meterReadData,
          ...this.$refs.priceInfo.formData,
          ...useWaterType
        },
        person: this.$refs.wPopulation.submit()
      };
      // if (this.billStute == "ChangeUserUpdate") {
      //   val.userChangeInfo = {
      //     ...this.formData.userChangeInfo
      //   };
      // }
      val.userChangeInfo = {
        ...this.formData.userChangeInfo
      };
      // 树结构
      // 行政区域 只需要传最后一个值过去
      val.userInfo.adminArea = this.common.handleTreeData(
        val.userInfo.adminArea
      );
      //营业厅，只需要传最后一个值过去
      val.userInfo.businessArea = this.common.handleTreeData(
        val.userInfo.businessArea
      );

      // 开户银行 数据格式处理
      val.accountInfo.invoiceBank = this.common.handleTreeData(
        val.accountInfo.invoiceBank
      );
      val.accountInfo.openAccountBank = this.common.handleTreeData(
        val.accountInfo.openAccountBank
      );
      // 用水类型 数据格式处理
      val.userInfo.useWaterType = this.common.handleTreeData(
        val.userInfo.useWaterType
      );
      val.userInfo.capaMoney = this.capaMoney;
      if (this.$refs.userMixtureEdit != undefined)
        val.userMixtureData = this.$refs.userMixtureEdit.mixtureData
      else
        val.userMixtureData = this.mixtureData
      if (this.$refs.userDiscountEdit != undefined)
        val.discountData = this.$refs.userDiscountEdit.discountData
      else
        val.discountData = this.discountData
      //数据格式处理
      var reg = new RegExp(' ', 'g');
      val.accountInfo.invoiceAccount = val.accountInfo.invoiceAccount.replace(reg, '');
      val.accountInfo.bankAccount = val.accountInfo.bankAccount.replace(reg, '');
      return val;
    },
    closeDialog () {
      this.EditVisible = false;
    },
    //根据node查询路径数组
    getCascaderFullValue (cascader, id) {
      let cascaderFullValue = [id];
      this.getParentId(cascaderFullValue, cascader, cascader, id);

      return cascaderFullValue;

    },
    getParentId (cascaderFullValue, cascader, _cascader, _id) {
      if (!Array.isArray(cascader)) return;

      for (let cascaderItem of cascader) {
        if (!Array.isArray(cascaderItem.children)) continue;

        let index = cascaderItem.children.findIndex(item => item.value === _id);
        if (index >= 0) {
          cascaderFullValue.unshift(cascaderItem.value);

          if (_cascader.findIndex(item => item.value === cascaderItem.value) < 0) //is original item
            this.getParentId(cascaderFullValue, _cascader, _cascader, cascaderItem.value);
        } else {
          this.getParentId(cascaderFullValue, cascaderItem.children, _cascader, _id);
        }
      }
    },
    //保存时校验用水人口
    validatewPopulation () {
      return new Promise(resolve => {
        let data = []
        let tableData = this.$refs.wPopulation.tableData.list
        tableData.forEach((item, index) => {
          data.push(item.certNo)
        })
        data.push(this.userData.userNo)
        let params = {
          "busicode": "UserPersonQuerySame",
          "data": data,
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          let currentIndex = []
          // res.forEach((item,index)=>{
          //   currentIndex.push(item);
          // })
          currentIndex = res
          this.$refs.wPopulation.currentIndex = res
          if (currentIndex.length > 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch(() => {
          resolve(true)
        })
      })
    },
    async changeBeforeSubmit (b) {
      let message = null
      message = await this.validateFrom();
      return message
    },
    async validateFrom () {
      let val = null
      // this.$refs.waterMInfo.$refs.ruleForm.validate((valid)=>{
      //   if(!valid){
      //     val="用户资料-水表信息必填项未完善"
      //   }
      // })
      this.$refs.waterMInfo.getFormData()
      // if(this.$refs.wPopulation.currentIndex.length>0 ){
      //   val="用水人口存在重复数据，请检查"
      // }
      let flag = await this.validatewPopulation()
      if (flag) {
        val = "用水人口存在重复数据，请检查"
      }

      //验证抄表必填信息
      // this.$refs.meterReadInfo.$refs.ruleForm.validate((valid)=>{
      //   if(!valid){
      //     val="用户资料-抄表信息必填项未完善"
      //   }
      // })
      this.$refs.userInfo.getFormData()
      //验证客户信息



      this.$refs.custInfo.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          val = "客户资料必填项未完善"
        }
      })


      //验证发票信息
      this.$refs.invoiceInfo.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          val = "开票资料必填项未完善"
        }
      })
      //账户信息验证
      this.$refs.accountInfo.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          val = "缴费方式必填项未完善"
        }
      })
      //用户信息验证
      // this.$refs.userInfo.$refs.ruleForm.validate((valid)=>{
      //   if(!valid){
      //     val="用户资料必填项未完善"
      //   }
      // })
      //用水类型验证
      this.$refs.ruleFormV.validate((valid) => {
        if (!valid) {
          val = "用水类型变更必填项未完善"
        }
      })
      return val;
    },
    //弹出框
    async submit (valType) {
      let params = {
        busicode: this.billStute,
        data: this.getFormbData()
      };
      let message = await this.validateFrom();
      if (message) {
        this.$notify({
          title: "验证失败",
          message: message,
          type: "error"
        });
        return;
      };
      // return
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success"
        });
        // this.$refs.wPopulation.wPopulationSubmit(res.id)
        if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
          // 流程中心模块触发
          this.$parent.$parent.closeDialog();
        } else {
          // 普通模块触发
          this.$parent.closeDialog(); // 提交后回调方法
        }

        // if(this.idCuster && this.idCuster.id!="") {
        //    this.$refs.userMixtureEdit && this.$refs.userMixtureEdit.submitForm(this.idCuster.id)
        //    this.$refs.userDiscountEdit && this.$refs.userDiscountEdit.submitForm(this.idCuster.id)
        // }
        // else {
        //     this.$refs.userMixtureEdit && this.$refs.userMixtureEdit.submitForm(res.id);
        //     this.$refs.userDiscountEdit && this.$refs.userDiscountEdit.submitForm(res.id);
        // }

      });
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.CustomerChangeEdit {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .tabsBlock {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    margin-top: 10px;
    /deep/ {
      .el-tabs__header {
        margin: 0 0 5px;
      }
      .el-tabs--border-card {
        border: 1px solid #eaf4ff;
      }
      .el-tabs__content {
        padding: 5px 0;
        height: calc(100% - 60px);
        .idCard {
          border: 0px;
        }
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
  .search-btn {
    .el-form-item__content {
      .el-input {
        width: 70% !important;
      }
    }
  }
  .userNo {
    width: 360px;
    margin-top: 10px;
    margin-bottom: 0 !important;
  }
  .clickable {
    color: #409eff;
    cursor: pointer;
  }
}
</style>

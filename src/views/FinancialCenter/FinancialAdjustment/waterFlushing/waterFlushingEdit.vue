<template>
  <div class="waterFlushing">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="100px"
      :disabled="NotDisabled"
      ref="ruleForm"
      :rules="rules"
      >
      <el-form-item
        v-if="formData.processState=='register'||formData.processState==''||editNeedData.busicode=='FnRushRedAdd'"
        label="用户编号："
        class="userNo"
        >
        <el-input
          class="read-only"
          @keydown.enter.native="initUserNo(searchUserNum)"
          v-model="searchUserNum"
          placeholder="请输入用户编号"
        >
          <el-button
            slot="append"
            class="searchBtn scanning-btn"
            @click="initUserNo(searchUserNum)"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.busicode!='FnRushRedAdd'" ref="billInfo"></billInfo>
      <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo>
      <legend class="legendColumn">抄表信息</legend>
        <el-form-item label="抄表日期：" class="disable-item">
          <!-- <el-date-picker
            disabled
            v-model="meterRead.meterReadingDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker> -->
          <span>{{meterRead.meterReadingDate}}</span>
        </el-form-item>
        <el-form-item label="增减水量：" class="disable-item">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled v-model="meterRead.addWater" placeholder></el-input> -->
          <span>{{meterRead.addWater}}</span>
        </el-form-item>
        <el-form-item label="分摊水量：" class="disable-item">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled v-model="meterRead.shareWater" placeholder></el-input> -->
          <span>{{meterRead.shareWater}}</span>
        </el-form-item>
        <el-form-item label="实际用水量：" class="disable-item">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled v-model="meterRead.realityWater" placeholder></el-input> -->
          <span>{{meterRead.realityWater}}</span>
        </el-form-item>
        <el-form-item label="是否换表：" class="disable-item">
          <!-- <el-input
            disabled
            v-model="meterRead.changeMeterFlag"
            placeholder
          >{{formData.changeMeterFlag===0?'否':'是'}}</el-input> -->
          <span>{{formData.changeMeterFlag===0?'否':'是'}}</span>
        </el-form-item>
        <el-form-item label="余量：" class="disable-item">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled v-model="meterRead.margin" placeholder></el-input> -->
          <span>{{meterRead.margin}}</span>
        </el-form-item>
      <legend class="legendColumn">水量红冲信息</legend>
        <el-form-item prop="desc" :class="{'disable-item': NotDisabled}">
          <template slot="label"><span style="color:red;">* </span>红冲账期：</template>
          <el-date-picker
            v-if="!NotDisabled"
            v-model="formData.details[0].accountPeriod"
            :picker-options="pickerOptions"
            size="mini"
            type="month"
            format="yyyy-MM"
            value-format="yyyyMM"
          ></el-date-picker>
          <span v-else>{{formData.details[0].accountPeriod}}</span>
        </el-form-item>
        <el-form-item label="用水类型：" :class="{'disable-item': NotDisabled}">
          <el-cascader @change="cal"
            v-if="!NotDisabled"
            v-model="formData.details[0].useWaterType"
            :options="waterTypeData"
            :show-all-levels="false"
            :props="props"
          ></el-cascader>
          <span v-else>{{formData.details[0].useWaterTypeName}}</span>
        </el-form-item>
            <el-form-item  label="费用类型：" class="f2" prop="details[0].costId">
              <el-checkbox-group v-model="formData.details[0].costId" >
                <el-checkbox v-for="v in costIdOption" :key="v.id" :label="v.id">{{v.costName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        <br />
        <!--
        <el-form-item label="上期抄码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  disabled v-model="formData.details[0].priorPeriodNum" type="number" placeholder></el-input>
        </el-form-item>
        <el-form-item label="本期抄码：">
          <el-input
            v-model="formData.details[0].currendPeriodNum"
            @change="getRushRedWatNum"
            type="number"
            placeholder
          ></el-input>
        </el-form-item>-->
        <el-form-item label="红冲水量：" prop="details[0].rushRedWater" :class="{'disable-item': NotDisabled}">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.details[0].rushRedWater" type="number" placeholder @change="cal"></el-input>
          <span v-else>{{formData.details[0].rushRedWater}}</span>
        </el-form-item>
     
       <!-- <el-form-item :class="{buttonItem:!NotDisabled}" label="红冲金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.details[0].rushRedMoney" disabled type="number" placeholder></el-input>
        <el-button
          size="mini" 
          type="primary"
          v-if="!NotDisabled"
          @click="RushRedCalculation"
        >计算</el-button>
        </el-form-item>-->
       
        <el-form-item class="f2" label="备注：" :class="{'disable-item': NotDisabled}">
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
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; //单据信息
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
export default {
  name: "waterFlushing",
  props: ["editNeedData"],
  components: {
    uploadFile,
    billInfo,
    userInfo
  },
  data() {

    const validatorDesc = (rule, value, callback) => {
      if(!this.formData.details[0].accountPeriod || this.formData.details[0].accountPeriod.length === 0) {
        callback(new Error('红冲账期不能为空'))
      }else {
        callback()
      }
    }

    return {
      costIdOption:[],
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_rush_red#1",
      waterTypeData: [], //用水类型
      isCal:0,  //标志用水类型和红冲水量是否更改  0  未改   1 已改
      formData: {
        id: "",
        comments: "", //备注
        rushType: 1, // 1 红冲水量 2 红冲金额
        details: [
          {
            userNo: "",
            billDetailId: "", //账单明细
            rushRedWater: "", //红冲水量
            rushRedMoney: "", //红冲金额
            useWaterType: "", //用水类型
            costId:[],//费用类型
            priorPeriodNum: "", //上期抄码
            currendPeriodNum: "", //本期抄码
            accountPeriod: "" //账期
          }
        ],
      },
      //抄表信息展示
      meterRead: {
        meterReadingDate: "",
        addWater: "",
        shareWater: "",
        realityWater: "",
        changeMeterFlag: "",
        margin: ""
      },
      NotDisabled: false, //是否可编辑
      approveFlag: 0,
      searchUserNum: "",
      wayOpen: "LiquidatedDamagesEdit",
      rules: {
        desc: [
          {
            validator: validatorDesc, trigger: 'change'
          }
        ],
      'details[0].rushRedWater':[{ required:true, message:"红冲水量不能为空", trigger: 'change'}],
        'details[0].costId':[{ required:true, message:"费用类型不能为空", trigger: 'change'}],
      },
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
    };
  },
  mounted() {
    this.getCostIdOption();
    if (this.editNeedData.saveType != 'add') {
      this.init();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId= tempId
      this.getHtmlData();
    }
    this.waterTypeDataOption();
  },
  methods: {
    indexMethod(index) {
      //获取表格序号
      return index + 1;
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
    init() {
      let params = {
        busicode: "FnRushRedQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res;
          this.formData.details[0].costId = this.formData.details[0].costId.split(",");
          this.formData.details[0].accountPeriod = this.formData.details[0].accountPeriod+'';
          this.initUserNo(res.details[0].userNo);
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END"
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          this.getHtmlData();
          //单据信息
          this.getBillData(res);
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_rush_red#2",
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
    initUserNo(val) {
      //用户编号查询
      if (val == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: val
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
          this.getTableDate(res.userInfo.userNo);
          this.getFormData(res);
          this.formData.details[0].userNo = res.userInfo.userNo;
          this.formData.details[0].useWaterType = res.userInfo.useWaterType;
        })
        .catch(res => {
          this.clearForm()
          this.formData.details[0].userNo = '';
        });
    },
    clearForm(){
      this.$refs.userInfo.clearForm();
      this.meterRead = {
        meterReadingDate: "",
        addWater: "",
        shareWater: "",
        realityWater: "",
        changeMeterFlag: "",
        margin: ""
      }
    },
    getTableDate(val) {
      this.$api
        .fetch({
          params: {
            busicode: "LastMrReadInfo",
            data: { userNo: val }
          }
        })
        .then(res => {
          if (this.editNeedData.busicode == "FnRushRedAdd") {
            this.formData.details[0].billDetailId = res.id;
            this.formData.details[0].priorPeriodNum = res.priorPeriodNum;
          }
          this.meterRead = res;
        });
    },
    getRushRedWatNum(val) {
      this.formData.details[0].rushRedWater =
        val - this.formData.details[0].priorPeriodNum;
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
    //本期抄码 - 上期抄码 ≠ 红冲水量！ 提示
    checkrushRedWaNum() {
      if (
        this.formData.details[0].rushRedWater !=
        this.formData.details[0].currendPeriodNum -
          this.formData.details[0].priorPeriodNum
      ) {
        this.$message({
          message: "本期抄码 - 上期抄码 ≠ 红冲水量！",
          type: "warning"
        });
        return;
      }
    },
    // cal(){
    //   console.log(222)
    //   this.isCal  = 1
    // },
    RushRedCalculation() {
      this.isCal = 0 
      let val = JSON.parse(JSON.stringify(this.formData));
      if (
        typeof val.details[0].useWaterType == "object" &&
        val.details[0].useWaterType != undefined
      ) {
        val.details[0].useWaterType =
          val.details[0].useWaterType[val.details[0].useWaterType.length - 1];
      }
      // this.checkrushRedWaNum(); //水量提示
      let params = {
        busicode: "RushRedCalculation",
        data: {
          rushRedWater: val.details[0].rushRedWater, //"红冲水量",
          useWaterType: val.details[0].useWaterType //"用水类型"
        }
      };
      this.$api.fetch({ params }).then(res => {
        this.formData.details[0].rushRedMoney = res.rushRedMoney;
      });
    },
    getFormbData() {
      // this.checkrushRedWaNum(); //水量提示
      let val = JSON.parse(JSON.stringify(this.formData));
      val.details.forEach((column, index) => {
        if (typeof val.details[index].costId == 'object') {
          val.details[index].costId = this.common.handleTreeData( val.details[index].costId)
        }
      })
      if (
        typeof val.details[0].useWaterType == "object" &&
        val.details[0].useWaterType != undefined
      ) {
        val.details[0].useWaterType =
          val.details[0].useWaterType[val.details[0].useWaterType.length - 1];
      }
      return val;
    },
    submit() {
      
      // if(this.isCal == 1) {
      //    this.$notify({
      //     title: "警告",
      //     message: "用水类型或红冲水量已修改，请重新计算金额",
      //     type: "warning"
      //   });
      //   return;
      // }  
      //this.formData.details[0].costId = this.formData.details[0].costId.toString();
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
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
        }
      })
      
    }
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.waterFlushing {
  height: 100%;
  //overflow-y: auto;
  .userNo {
    width: 360px;
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
}
</style>

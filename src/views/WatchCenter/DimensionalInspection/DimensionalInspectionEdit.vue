<template>
  <div class="DimensionalInspectionEdit">
    <el-form :model="formData" ref="ruleForm" class="formBill" :inline="true" :disabled="NotDisabled" size="mini" label-width="130px">
      
      <el-form-item label="水表编号：" v-if="searchBtnShow">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="searchUserNum" placeholder="请输入水表编号" @change="initMeterNo" clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="searchBtn" @click="initMeterNo" icon="el-icon-search"></el-button>
      </el-form-item>

      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo" :editType="0"></billInfo>

      <meterBasicInfo ref="meterBasicInfo" :editType="0"></meterBasicInfo>

      <legend class="legendColumn">维检信息</legend>
      <el-form-item label="拆表日期：">
        <el-date-picker v-model="formData.removeDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="送修日期：">
        <el-date-picker v-model="formData.sendRepairDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="维检类型：">
        <el-select elect v-model="formData.repairType" clearable placeholder="">
          <el-option v-for="item in dictionaryData.REPAIR_TYPE" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信息来源：">
        <el-select elect v-model="formData.sourceFlag" clearable placeholder="">
          <el-option v-for="item in dictionaryData.PIS" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="备注：" class="f2">
        <el-input type="textarea" v-model="formData.comments" size="mini" :rows="2" clearable placeholder="备注"></el-input>
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
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";//单据信息
import meterBasicInfo from "@/views/publicModule/infmtnManagement/meterBasicInfo";//水表信息
export default {
  name: "DimensionalInspectionEdit",
  props: ["editNeedData"],
  components: {
    uploadFile,
    meterBasicInfo,
    billInfo,
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_repair",
      fixTypeoptions: [],
      searchBtnShow: true,
      searchUserNum: "",
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //数据字典
      dictionaryData: [],
      formData: {
        "meterNo": '',//"水表编号",

        "removeDate": '',//"拆表日期",
        "sendRepairDate": '',//"送修日期",
        "repairType": '',//"修复类型  1维修，2送检",

        "repairDate": '',//"维修日期",
        "repairResult": '',//"维修结果",
        "repairComments": '',//"维修说明",

        "comments": '',//"备注",
        "calibrationDate": '',//"检定日期",
        "calibrationResult": '',//"检定结果",
        "calibrationComments": '',//"检定说明",
        "sourceFlag": '',//"信息来源 PIS"
      },
      //单据信息
      billData: {},
      // 模糊查询所有数据
      // 表单校验
      rules: {
        deposit: [
          { required: true, message: '请输入支付押金', trigger: 'blur' },
        ],
        comments: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
      },
      operationShow: 1,
      operation: 0,
      flag:false,
    };
  },
  mounted() {
    let tempId = this.util.generateUUID()
    eventBus.$emit('receiptId', tempId)
    this.formData.tempId = tempId
    this.getHtmlData();
    this.getDictionary()

  },
  methods: {
    // 数据字典（查询框）
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "REPAIR_TYPE,PIS" // 维检类型
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_repair",
        "审批流配置:" +
        _this.formData.processStateName +
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
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.editNeedData.busicode
      );
    },
    initMeterNo() {
      //水表编号查询
      let _this=this
      if (this.searchUserNum == "") {
        this.$message({
          message: "水表编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = { meterNo: this.searchUserNum, meterStatus: "3" };
      let params = { busicode: "MsInfoList", data };
      this.$api.fetch({ params })
        .then(res => {
          if(res.list!== undefined && res.list!== null && res.list.length>0){
            this.$refs.meterBasicInfo.init(res.list[0])
            this.formData.meterNo = res.list[0].meterNo;
            this.getMeterData(res.list[0].meterModel)
          }else{
            this.initMeterNo1();
          }
      });
    },
    initMeterNo1(){
      let data = { meterNo: this.searchUserNum, meterStatus: "1" };
      let params = { busicode: "MsInfoList", data };
      this.$api.fetch({ params })
        .then(res => {
          if(res.list!== undefined && res.list!== null && res.list.length>0){
            this.$refs.meterBasicInfo.init(res.list[0])
            this.formData.meterNo = res.list[0].meterNo;
            this.getMeterData(res.list[0].meterModel)
          }else{
            this.$message({
              message: "查无此表或该水表状态不是在库/在途。",
              type: "warning"
            });
          }
      });
    },
    async getMeterData(id) {
      try {
            // 水表型号查出的信息
        const resData = await this.$api.fetch({ 
          params: { busicode: "MeterModelQuery", data: {  id: id }}, 
        })
        this.$refs.meterBasicInfo.getWaterMeterInquiryData(resData)
      }catch(e) {
        console.log(e)
      }
    },

    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },

    getFormbData() {
      this.formData.meterNo = this.searchUserNum
      return this.formData
    },
    // 暂存按钮（添加）
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          var _this = this
          var params = {
            "busicode": this.editNeedData.busicode,
            "data": this.getFormbData()
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            });
            _this.$parent.closeDialog()
          })
        } else {
          return false;
        }
      });
    },
    stepActive(val) {
      this.operationShow = val;
      this.operation = val - 1;
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.DimensionalInspectionEdit {
  height: 100%;
  overflow-y: auto;
}
</style>

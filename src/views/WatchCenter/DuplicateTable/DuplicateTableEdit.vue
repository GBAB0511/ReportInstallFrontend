<template>
  <div class="DuplicateTableEdit">

    
    <!-- 弹出表单选择水表 -->
    <el-dialog title="水表选择" v-if="waterChooseVisible" :visible.sync="waterChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <SelectWaterTable ref="SelectWaterTable" :waterChooseType='waterChooseType' :isFuzzyQuery='isFuzzyQuery' :formType='formType'></SelectWaterTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogSelectWater">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater">取 消</el-button>
      </div>
    </el-dialog>

    <el-form size="mini"  ref="ruleForm" :rules="rules" :inline="true" :model="formData" class="formBill" label-width="130px" >

      <!-- 单据信息 -->
      <billInfo ref="billInfo"></billInfo>

       <!-- 用户信息 -->
      <userInfo ref="userInfo" :editType="userInfoEditType" :wayOpen="wayOpen"></userInfo>


      <legend class="legendColumn">复表信息</legend>

      <el-form-item label="水表编号：" prop="meterNo"  :class="{'disable-item': tableEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   v-model="formData.meterNo"  @focus="chooseWaterMeter('chooseNewMater')"  placeholder="水表编号" :class="{ready_only:tableEdit}" :readonly="tableEdit"></el-input>
      </el-form-item>

      <el-form-item label="复表日期：" :class="{'disable-item': tableEdit}">
        <el-date-picker :class="{ready_only:tableEdit}" :readonly="tableEdit" v-model="formData.reuseDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label='复表员：' prop="reuseStaff" :class="{'disable-item': tableEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="tableEdit" v-model="formData.reuseStaffName" placeholder="" :class="{ready_only:tableEdit}" :readonly="tableEdit"></el-input>
        <el-select v-else clearable v-model="formData.reuseStaff" placeholder="请选择">
          <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="复表起码：" prop="newMeterNum" :class="{'disable-item': tableEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.newMeterNum" placeholder="" :class="{ready_only:tableEdit}" :readonly="tableEdit"></el-input>
      </el-form-item>

      <el-form-item label="备注：" class="f2" :class="{'disable-item': tableEdit}">
        <el-input v-if="!tableEdit" type="textarea" :rows="2" v-model="formData.comments" placeholder="备注" :class="{ready_only:tableEdit}" :readonly="tableEdit"></el-input>
        <span v-else>{{formData.comments}}</span>
      </el-form-item>

      <el-form-item label="图片上传：">
        <el-image v-if="imgUrlList.url" class="sign-img" :src="imgUrlList.url" :preview-src-list="imgUrlList.urlList"></el-image>
      </el-form-item>

      <el-form-item v-if="formData.processStateName == '草稿'">
        <el-upload class="upload-file" multiple action="/" :http-request="uploadAttachment" :show-file-list="false">
          <el-button icon="el-icon-upload2" type="primary" class="scanning-btn" size="mini">上传底码</el-button>
        </el-upload>
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
import uploadFile from '@/components/uploadPic';//上传附件
import SelectWaterTable from "@/components/SelectWaterTable";//选择水表
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import userInfo from "@/views/publicModule/infmtnManagement/userInfo";//用户信息
export default {
  name: "DuplicateTableEdit",
  components: {
    uploadFile,
    billInfo,
    userInfo,
    SelectWaterTable,//选择水表
  },
  props: ['editNeedData'],
  data() {
    return {
      waterChooseVisible:false,
      waterChooseType:'',
       //选择水表 弹框类型
      formType: 'ChangeTablesHandle',
      isFuzzyQuery:"",
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_reuse",
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //是否可显示回填表单
      // 是否可编辑
      tableEdit: true,
      //打开功能下
      wayOpen: "DuplicateTable",
      //是否可以填写
      userInfoEditType: 0,
      // 复表员下拉数据
      replaceStaffData: [],
      formData: {
        meterNo: '',
        reuseDate: '',
        reuseStaff: '',
        newMeterNum: '',
        comments: '',
      },
      rules:{
          meterNo:[{ required:true, message:"水表编号不能为空", trigger: 'blur'}],
          reuseStaff:[{ required:true, message:"复表员不能为空", trigger: 'blur'}],
          newMeterNum:[{ required:true, message:"复表起码不能为空", trigger: 'blur'}],
        },

      // 底码上传图片
      imgUrlList: {
        url: '',
        urlList: [],
      },
      // 用户信息数据
      userData: {
        ctmInfo: {},
        msInfo: {},
        userInfo: {},
      },
    }
  },
  mounted() {
    this.getBaseConfig()
    this.getReplaceStaffData()
    this.init()
    this.getAccessoryList()
    eventBus.$emit('receiptId', this.editNeedData.id)
    //草稿、登記
    if (
      this.editNeedData.processState == "END" || //完结
      this.editNeedData.processState == "CANCEL" || //终止
      this.editNeedData.processState == "approval" //进行中-审批
    ) {
      this.NotDisabled = true;
      this.approveFlag = 1;
    } else if (this.editNeedData.processState == "" || //草稿
      this.editNeedData.processState == "register" //登记
    ) {
      this.NotDisabled = false;
      this.approveFlag = 0;
    }
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      let params = {
        busicode: "MsReuseList",
        data: {
          id: _this.editNeedData.id
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.formData = res.list[0]
        if (this.formData.processStateName == '草稿') {
          this.tableEdit = false
        }
        // 单据信息数据
        this.getBillData(res.list[0]);
        this.initUserNo(res.list[0].userNo)
        this.getHtmlData();
      })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_reuse",
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
       getBaseConfig() { //获取水量异常比例配置
      let _this = this
      var params = {
        busicode: "ConfigList",
        data:{searchContent:'MR_INFO_SELECT_IS_FUZZYQUERY'}
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if(data!=null && data.length > 0) {
            this.isFuzzyQuery = data[0].configValue
          }
        })
        .catch(res => {

        });
    },
    initUserNo(userNo) {
      let data = {
        userNo: userNo,
        status: ""
      };
      let params = { busicode: "UserSelect",  data};
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.getUserData(res)
          this.$refs.userInfo.init(this.userData);
        });
    },
        // 选择水表按钮
    chooseWaterMeter(val) {
      if(this.tableEdit == false){
      this.waterChooseType = val
      this.waterChooseVisible = true
      }

    },
    closeDialogSelectWater(){
     this.waterChooseVisible = false
    },
        // 选择水表弹出框确定按钮
    fixDialogSelectWater() {
      let val = this.$refs.SelectWaterTable.selectData
      
      if (this.waterChooseType == 'chooseNewMater') {
        this.$set(this.formData, "meterNo", val[0].meterNo);
        this.waterChooseVisible = false;
        return
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
     getUserData(res) {
      // 用户信息
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
        adminArea: res.userInfo.adminArea, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit, //用水期限
        stopWaterLinkMan:res.userInfo.stopWaterLinkMan, //停水联系人
        stopWaterLinkMobile:res.userInfo.stopWaterLinkMobile
      };
    },
    // 获取复表员数据
    getReplaceStaffData() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "6" }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.replaceStaffData = res
      })
    },
    getFormbData() {
      var _this = this
      var saveData = {
        id: _this.formData.id,
        // 水表编号
        meterNo: _this.formData.meterNo,
        // 复表日期
        reuseDate: _this.formData.reuseDate,
        // 复表员value
        reuseStaff: _this.formData.reuseStaff,
        // 复表起码
        newMeterNum: _this.formData.newMeterNum,
        // 备注
        comments: _this.formData.comments,
      }
      // 复表员name
      for (let i = 0; i < _this.replaceStaffData.length; i++) {
        if (_this.replaceStaffData[i].userAccount == _this.formData.reuseStaff) {
          saveData.reuseStaffName = _this.replaceStaffData[i].userName
        }
      }
      return saveData;
    },
    // 暂存按钮（添加/修改）
    save() {
    this.$refs.ruleForm.validate((valid)=>{
      if(valid){
     var _this = this
      var params = {
        "busicode": "MsReuseBackfill",
        "data": _this.getFormbData()
      }
      _this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
      })
        }
      })
    },

    //上传附件
    uploadAttachment(file) {
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.editNeedData.id,
          receiptType: "ms_reuse",
          accessoryNo: "008",
          file: file.file
        },
        token: "krrjdev123", //
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.imgUrlList.url = res[0]
          this.imgUrlList.urlList.push(res[0])
          // this.imgUrlList.url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          // this.imgUrlList.urlList.push('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
        });
    },
    // 获取附件
    getAccessoryList() {
      let _this = this
      let params = {
        busicode: "ReceiptAccessoryList",
        data: {
          receiptType: "ms_reuse",
          receiptId: this.editNeedData.id,
        }
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
      //   imgUrlList: {
      //   url: '',
      //   urlList: [],
      // },
      this.imgUrlList.url = res[res.length - 1].accessoryMetadata.accessoryPath
      this.imgUrlList.urlList.push(res[res.length - 1].accessoryMetadata.accessoryPath)
      })
    },
  }
}
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.DuplicateTableEdit {
  height: 100%;
  overflow-y: auto;
  .sign-img img{
    // width: 80px;
  }
  .el-image-viewer__close {
    color: white;
    top: 100px;
    right: 300px;
    width: 40px;
    height: 40px;
    font-size: 40px;
}
  
}
</style>


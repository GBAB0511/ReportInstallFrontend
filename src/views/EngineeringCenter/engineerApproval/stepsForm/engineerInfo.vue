<template>
  <div class="engineerInfo">
    <legend class="legendColumn">工程信息</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right">
      <el-form-item :disabled="disabled" prop="pjName" label="工程名称：" class="col-2" :class="{'disable-item': disabled||currentStep>=2}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2" v-model="form.pjName"></el-input>
        <span v-else>{{form.pjName}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="billNo" label="工程编号：" class="disable-item">
        <span>{{form.billNo}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="billDate" label="申请日期：" class="disable-item">
        <span>{{form.billDate}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="pjType" label="工程类型：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-select v-if="!disabled&&currentStep<2" v-model="form.pjType" @change="pjTypeChange">
          <el-option v-for="item in dict.PPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.pjTypeName}}</span>
      </el-form-item>
      <el-form-item  v-if="((djStatus == 1 && zfCheck == 0)&&(currentStep < 2))" label-width='90px' class="width-80">
        <el-checkbox v-model="form.isUploadWorkBuild" true-label="1" false-label="0" :disabled="disabled || currentStep >= 2">上传</el-checkbox>
      </el-form-item>
      <template v-if="isStatus2">
        <el-form-item :disabled="disabled" v-if="(form.pjType != undefined && form.pjType == 2) || (form.pjType!=undefined&&form.pjType==3)" prop="oloUserNo" label="原户号：" :class="{'disable-item': disabled||currentStep>=2}" :rules="oloUserNoRule">
          <el-input class oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2&&((form.pjType!=undefined&&form.pjType==2) || form.pjType!=undefined&&form.pjType==3)" v-model="form.oloUserNo">
            <el-button slot="append" class="searchBtn " icon="el-icon-search " @click="chargeLackQuery(form.oloUserNo)" size='mini'></el-button>
          </el-input>
          <span v-else>{{form.oloUserNo}}</span>
        </el-form-item>
      </template>

      <el-form-item :disabled="disabled" prop="suserNo" label="总表户号：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2" v-model="form.suserNo"></el-input>
        <span v-else>{{form.suserNo}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="businessArea" label="营业区域：" :class="{'disable-item': disabled||currentStep>=2 || (form.pjType == 3)}">
        <el-cascader v-model="form.businessArea" v-if="!disabled&&currentStep<2 && (form.pjType != 3)" size="mini" :props="props" ref="cascader" :options="businessAreaData" placeholder="请选择"></el-cascader>
        <span v-else>{{form.businessAreaName}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="limitFlag" label="用水期：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-radio-group v-if="!disabled&&currentStep<2" v-model="form.limitFlag">
          <el-radio v-for="item in dict.UWD" :key="item.value" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
        <span v-else>{{form.limitFlagName}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="installAddr" label="工程地址：" class="col-2" :class="{'disable-item': disabled||currentStep>=2}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2" v-model="form.installAddr"></el-input>
        <span v-else>{{form.installAddr}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="limitDate" label="用水年限（年月）：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-date-picker v-if="!disabled&&currentStep<2" v-model="form.limitDate" type="month" value-format="yyyyMM" format="yyyy-MM" picker-options="disabledDate"></el-date-picker>
        <span v-else>{{form.limitDate}}</span>
      </el-form-item>
      <el-form-item :disabled="disabled" prop="urgentFlag" label="紧急程度：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-select v-if="!disabled&&currentStep<2" v-model="form.urgentFlag">
          <el-option v-for="item in dict.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.urgentFlagName}}</span>
      </el-form-item>
      <!-- <el-form-item :disabled="disabled" prop="meterBore" label="水表口径：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-select v-if="!disabled&&currentStep<2" v-model="form.meterBore">
          <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
        </el-select>
        <span v-else>{{form.meterBoreName}}</span>
      </el-form-item> -->
      <!-- <el-form-item :disabled="disabled" prop="meterNum" label="装表个数：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" type="number" min="0" @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2" v-model="form.meterNum"></el-input>
        <span v-else>{{form.meterNum}}</span>
      </el-form-item> -->
      <el-form-item :disabled="disabled" prop="sourceFlag" label="信息来源：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-select v-if="!disabled&&currentStep<2" v-model="form.sourceFlag">
          <el-option v-for="item in dict.PIS" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.sourceFlagName}}</span>
      </el-form-item>
      <el-form-item prop="constructionUnit" label="施工主体：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-select v-if="!disabled&&currentStep<2" v-model="form.constructionUnit" :disabled="false">
          <el-option v-for="item in constructData" :key="item.id" :label="item.subjectName" :value="item.subjectName"></el-option>
        </el-select>
        <span v-else>{{form.constructionUnit}}</span>
      </el-form-item>
      <el-form-item v-if="showContractNo" :disabled="disabled" prop="contractNo" label="合同编号：" :class="{'disable-item': disabled||currentStep>=2}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable @input="e => input = inputMe(e)" v-if="!disabled&&currentStep<2" v-model="form.contractNo"></el-input>
        <span v-else>{{form.contractNo}}</span>
      </el-form-item>
      <!-- <el-form-item prop="redLineConstruction" label="红线外施工：" :class="{'disable-item': disabled||currentStep>1}" >
        <el-radio-group v-if="!disabled&&currentStep<3" v-model="form.redLineConstruction" :disabled="disabled">
          <el-radio style="float:left" :label="1">需要</el-radio>
          <el-radio style="float:left" :label="0">不需要</el-radio>
        </el-radio-group>
        <span v-else >{{form.redLineConstructionName}}</span>
      </el-form-item> -->
    </el-form>
    <addrAdd :addrVisible="addrVisible" v-if="addrVisible" @closeAddrAddVisible="closeAddrAddVisible"></addrAdd>
    <el-dialog :visible.sync="QRShow" v-if="QRShow" style="width:50%;margin-left:25%" title="二维码" @close="dialogClose">
      <span style="color:red;margin-left:40%;font-weight:bold;font-size:16px;" v-if="noScanShow">请扫码授权！</span>
      <span style="color:green;margin-left:25%;font-weight:bold;font-size:16px;" v-if="!noScanShow && !isFinish">用户已授权，正在获取证照...</span>
      <span style="color:green;margin-left:35%;font-weight:bold;font-size:16px;" v-if="isFinish">用户证照已获取！</span>
      <img width="100%" :src="this.QRCodeUrl" :class="noScanShow  ? '':'img1'">
      <el-button type="primary" icon="el-icon-refresh" size="mini" :class="form.pjType == 5 ? 'refresh_5':'refresh_1'" @click="refreshQRCode">刷新二维码</el-button>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refreshPic" :disabled="!authzToken" v-if=" form.pjType == 5">重新获取证照</el-button>
    </el-dialog>
    <object classid="clsid:96BB8ADA-D348-4414-8892-DC79C8818841" id="GWQ" width="0" height="0"></object>

  </div>
</template>

<script>
import '../../../../../static/interactiveMachine/js/gwq.js'
import addrAdd from "@/components/addrAdd";
import axios from "axios";
export default {
  components: {
    addrAdd
  },
  props: ['dict', 'editData', 'disabled','operation','currentStep'],
  data () {
    return {
      newDisable:true,
      constructData:[],
      oloUserNoRule: [],
      addrVisible: false,
      adminAreaData: [],
      QRShow: false, //二维码弹框展示
      QRCodeUrl:'',//转换后二维码
      txId: '', //获取二维码传参
      stop: '', //是否停止轮询
      noScanShow: true, //二维码展示
      isFinish:false, //是否获取到证照
      form: {
        pjName: '',
        billNo: '',
        billDate: this.common.date(),
        pjType: '1',
        oloUserNo: '',
        suserNo: '',
        businessArea: '',
        businessAreaName: "",
        limitFlag: '',
        limitDate: '',
        urgentFlag: '2',
        meterBore: '',
        meterNum: '',
        installAddr: '',
        sourceFlag: '1',//柜台
        constructionUnit:'',
        isUploadWorkBuild: "",//上传工建
        // redLineConstruction:'',
        // redLineConstructionName:"",
        currentType:'',
        oldPjType:'',
        options:[
          {
            lable:'需要',
            value:1
          },
          {
            lable:'不需要',
            value:0
          },
        ],
        contractNo: "", // 合同编号
      },
      rules: {
        pjName: [{ required: true, message: '工程名称不能为空', trigger: 'blur' }],
        pjType: [{ required: true, message: '工程类型不能为空', trigger: 'change' }],
        businessArea: [{ required: true, message: '营业区域不能为空', trigger: 'change' }],
        installAddr: [
          { required: true, message: '工程地址不能为空', trigger: 'blur' }
        ],
        urgentFlag: [{ required: true, message: '紧急程度不能为空', trigger: 'change' }],
        sourceFlag: [{ required: true, message: '信息来源不能为空', trigger: 'change' }],
        constructionUnit: [{ required: true, message: '施工主体不能为空', trigger: 'change' }],
        meterNum: [{ required: true, message: '装表个数不能为空', trigger: 'change' }],
        meterBore: [{ required: true, message: '水表口径不能为空', trigger: 'change' }],
        // redLineConstruction: [{ required: true, message: '红线外施工未选择', trigger: 'change' }],
      },
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      disabledDate: {
        disabledDate: () => {
          return time.getTime() > Date.now();
        }
      },
      businessAreaData: [],
      meterBoreData: [],
      count: true,
      count1: true,
      pdfList:[],//电子证照pdf遍历
      timer: null,//定时器
      license: [],
      authzToken: '',
      projectType: '',
      TWOpdfList:[],
      hasFile: false,
      picList: [],
      //政府检查
      zfCheck: "",
      // 是否上传工建
      djStatus: "",
      showContractNo: false, // 默认是不显示合同编号
    }
  },
  computed: {
    isStatus2 () {
      return this.$store.state.isStatus2;
    }
  },
  created () {

    this.selectBAreaOptions()
    this.getMeterBore()
    this.getProjectPayee()
    this.getZFCheck();
    this.getShowContractNo();
    // if (this.editData) {
    //   this.form = { ...this.editData }
    //   console.log(JSON.stringify(this.form));
    // }

  },
  mounted () {
    // console.log(this.tempid);
    // 获取当前数据的单据id
    eventBus.$on("QRtempId", (tempid) => {
      this.tempid = tempid;
      console.log(this.tempid);
    });
    eventBus.$on('updateHuHao',item=>{
      this.form.oloUserNo=item
    })
    eventBus.$on('postPicList',(picList) => {
      this.picList = picList
    })
    eventBus.$on('hasFile', (hasFile) => {
      this.hasFile = hasFile
    })
    // console.log(this.currentStep+typeof(this.currentStep));
    let componyNo = localStorage.getItem('companyNo') // 银川为01,银川默认选择新装接水
    if (!this.disabled && componyNo == '01') {
      this.form.pjType = '4';
    }
    if (this.editData) {
      this.form = { ...this.editData }
      // console.log(JSON.stringify(this.form));
    }else{
      this.$store.commit('setIsStatus2', false);
    }
    if(this.disabled==true){
      this.newDisable=false
    }
    eventBus.$on('checkoloUserNoRule',item=>{
      eventBus.$emit('checkoloUserNoRule2',{
        type:this.form.pjType,
        value:this.form.oloUserNo

      })
    })
  },
  destroyed(){
    eventBus.$off('QRtempId')
    eventBus.$off('checkoloUserNoRule')
    eventBus.$off('updateHuHao')
    eventBus.$off('postPicList')
    eventBus.$off('hasFile')
    eventBus.$off('getPjType');
  },
  methods: {
    refreshQRCode() { //点击按钮刷新二维码
    clearTimeout(this.timer)
    this.authzToken = ''
    this.noScanShow = true
    this.isFinish = false
    this.stop = 0
    // clearTimeout(this.timer)  //清除定时器
    this.getQRCode()
    },
    getQRCode() { //获取二维码     
      // console.log(this.form.pjType)
      // console.log(this.tempid);
      let params = {
        busicode: "GetAuthBizCode",
        data: { projectType: this.form.pjType }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          // console.log(res)
          // if (res.data.description == '获取授权码失败') { //获取授权码失败
          //    _this.$message({
          //     message: res.data.description,
          //     type: "error"
          //   });
          //   return
          // }
          this.txId = res.txId //获取接口返回的id
          const imgUrl = `data:image/png;base64,${res.qrCode}` //将base64展示在img标签上
          this.QRCodeUrl = imgUrl
          // console.log(this.QRCodeUrl);
          // this.gwq.GWQ_OpenURL(location.origin+ '/css2/static/interactiveMachine/qrcodeShow.html?qrcodeUrl=' + encodeURI(imgUrl)) //签批屏
          this.QRShow = true //二维码弹框展示
          this.GetAuth() //获取下一步授权结果
        });
    },
    // 获得政府检查的配置参数，控制【是否上传工建】字段的显示和隐藏
    getZFCheck() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'PROJECT_ZFCHECK_STATUS',
        }
      };
      let zfCheckData = this.$api.fetch({
        params
      }).then(res => {
        if (res.list.length && res.list.length > 0) {
          this.zfCheck = res.list[0].configValue;
        }
      })
      // 获得是否上传工建的配置参数
      let djStatusData = this.$api.fetch({
        params:{
          busicode: "ConfigList",
          data: {
            status: '1',
            searchContent: 'PROJECT_GJDJ_STATUS',
          }
        }
      }).then(res => {
        if (res.list.length && res.list.length  > 0) {
          this.djStatus = res.list[0].configValue;
        }
      })
      let pData = [];
      pData.push(zfCheckData)
      pData.push(djStatusData);
      return new Promise((resolve,reject) => {
        Promise.all(pData).then(() => {
          // 要先判断一下如果有tempId说明还是登记节点
          if(this.$parent.$parent.$parent.editData.tempId){
            if(this.djStatus == 1 && this.zfCheck == 0){
              this.form.isUploadWorkBuild = '1';
            }else if(this.djStatus == 1 && this.zfCheck == 1){
              this.form.isUploadWorkBuild = '1';
            }
          }
          resolve();
        })
      })
    },
    // 加基础参数：【报装信息登记时，是否允许录入施工合同编号】
    getShowContractNo(){
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: "1",
          searchContent: "PJ_REGISTER_CONTRACT",
        }
      };
      this.$api.fetch({
        params, 
      }).then(res => {
        if(res.list.length && res.list[0].configValue === "1"){ // 0：不允许,1：允许
          this.showContractNo = true;
        }
      })
    },
    GetAuth() { //轮询授权状态，用axios不会刷新转圈
      let _this = this
      let projectType = Number(_this.form.pjType)
      axios({
        method: 'post',
        url: 'interface.api',
        withCredentials: true,
        timeout: 0,
        hideLoading: true,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": sessionStorage.getItem('token')
        },
        data: {
          busicode: "GetAuthInfo",
          token: sessionStorage.getItem('token'),
          sysType: "002",
          data: { 
            projectType: projectType,
            param: {
              txId: _this.txId 
            }
          }
        }
      })
        .then(res => {

          if (res.data.code == 420 && this.count == true) {
            // _this.$message({
            //   message: res.data.description,
            //   type: "error"
            // });
            console.log(res.data.description);
            this.count = false
          }
          if (res.data.code == -1 && this.count1 == true) {
            // _this.$message({
            //   message: res.data.description,
            //   type: "error"
            // });
            console.log(res.data.description);
            this.count1 = false
          }
          if (this.stop != '1' && res.data.code != 0) { //未成功继续轮询
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              _this.GetAuth();
            }, 3000)
          } else if(res.data.code == 0){  //成功
     
            clearTimeout(this.timer)
            let license = []
            for (let i = 0; i < res.data.data.licenseList.length; i++) {
              license.push({  //拿到数据
                licenseCode:res.data.data.licenseList[i].licenseCode,
                catalogCode:res.data.data.licenseList[i].catalogCode
              })
            }
            this.license = license
            this.projectType = projectType
            this.authzToken = res.data.data.authzToken
         
            this.noScanShow = false //模糊二维码
            var params1 = { //获取证件照
              busicode: "GetCredFile",
              data: {
                projectType: projectType,
                param: {
                  authzToken: res.data.data.authzToken,
                  receiptId: this.tempid,
                  receiptType: "pj_info_new",
                  licenseList: license,
                }
              }
            };
            this.$api
              .fetch({
                params: params1 //参数
              })
              .then(res => {
             
                if (res[0]) {
                  _this.$message({
                    message: "获取证照成功！",
                    type: "success"
                  });
                  this.isFinish = true
                  this.QRShow = false
                }
                for (let i = 0; i < res.length; i++) {
                  res[i].title = res[i].accessoryName
                  res[i].url = res[i].accessoryUrl
                  res[i].accessoryNo = res[i].accessoryNo
                  delete res[i].accessoryName
                  delete res[i].accessoryUrl
                }
                _this.TWOpdfList = res

                _this.pdfList = _this.TWOpdfList
          
                eventBus.$emit("projectType",projectType);
                this.$emit('getPdfList',_this.pdfList)  //组件间参数传递
                eventBus.$emit("calcTestFee", _this.pdfList); //参数传递给附件组件

              });

            // return
          }
        })
        // .catch(err => {
        // // 请求错误,也继续轮询
        //   if (this.stop != '1') {
        //     setTimeout(() => {
        //       _this.GetAuth();
        //     }, 3000)
        //   } else {
        //     return
        //   }
        // })
    },
    dialogClose() {  //关闭二维码弹窗
      this.QRShow = false
      this.stop = '1'
      this.authzToken = ''
      clearTimeout(this.timer)  //清除定时器
    },
    refreshPic() { //重新获取证照
    _this = this
    this.noScanShow = false
    this.isFinish = false
      var params = { //获取证件照
              busicode: "GetCredFile",
              data: {
                projectType: this.projectType,
                param: {
                  authzToken: this.authzToken,
                  receiptId: this.tempid,
                  receiptType: "pj_info_new",
                  licenseList: this.license,
                }
              }
            };
            this.$api
              .fetch({
                params: params //参数
              })
              .then(res => {
                // console.log(res) 
                if (res[0]) {
                  _this.$message({
                    message: "获取证照成功！",
                    type: "success"
                  });
                  this.isFinish = true
                  this.QRShow = false
                }
            
                this.TWOpdfList = []
                for (let i = 0; i < res.length; i++) {
                  res[i].title = res[i].accessoryName
                  res[i].url = res[i].accessoryUrl
                  res[i].accessoryNo = res[i].accessoryNo
                  delete res[i].accessoryName
                  delete res[i].accessoryUrl
                }
                _this.TWOpdfList = res
           
                _this.pdfList = _this.TWOpdfList
             
                eventBus.$emit("projectType",projectType);
                this.$emit('getPdfList',_this.pdfList)  //组件间参数传递
                eventBus.$emit("calcTestFee", _this.pdfList); //参数传递给附件组件

              });
    },
    getOloUserNO(){
      return this.form.oloUserNo
    },
    getPjType(){
      return this.form.pjType
    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //施工主体数据
    getProjectPayee () {
      var _this = this
      var params = {
        "busicode": "ProjectPayeeList",
        "data": {
          page: 1,
          pageCount: 1000,
          status:1
        }
        //结算方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.constructData = res.list
      })
    },
    detailsArrears () {
      if (userNo == "") {
        this.$message({
          message: "查询用户编号不能为空！",
          type: "warning"
        });
        return;
      }
      this.formData.userNo = userNo;
      this.DetailsArrearsShow = true;
      this.$refs["detailsArrears"].init();
    },
    pjTypeChange () {
      this.$emit('sonPjType',this.form.pjType)
      if (((this.form.pjType != this.currentType) && this.form.pjType != undefined && this.pdfList && this.pdfList.length > 0)
      || this.hasFile ) {
        let proType= this.dict.PPT.find((item)=>item.value==this.currentType)
        this.$confirm(`是否确定转变工程类型（非${proType.name}将清空电子证照）, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '转换成功!'
          });
          var ids = []
          let ids1 = ''
          for (let i = 0; i < this.picList.length; i++) { //确定删除的附件
            if (this.picList[i].id && this.picList[i].id != "") { //存在id且不为空
              ids.push(this.picList[i].id)
              ids1 = ids.join(",") //附件id之间用逗号连接
            }
          }
          // console.log(this.$parent.$parent.$parent);
          this.$parent.$parent.$parent.$refs.uploadFiles.delFile(ids1)  //调用删除附件接口
          // console.log(this.pdfList);
          this.pdfList = []
          eventBus.$emit("calcTestFee", this.pdfList); //参数传递给附件组件
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          }); 
          this.form.pjType = this.oldPjType //将工程类型恢复为之前的
          // eventBus.$emit('getPjType',this.form.pjType) 
          this.$emit('sonPjType',this.form.pjType)
        });
      }
      if (this.form.pjType == "2" || this.form.pjType == "3") { //粤海 类型为户表改造
        // this.$message({
        //   message: "请检查原户号的费用是否结清！",
        //   type: "warning"
        // });
        this.oloUserNoRule = [{ required: true, message: '原户号不能为空', trigger: ['change','blur'] }];
        this.$store.commit('setIsStatus2', true);
      } else {
        this.oloUserNoRule = [];
        this.$store.commit('setIsStatus2', false);
      }
      eventBus.$emit('getPjType',this.form.pjType) 
    },
    chargeLackQuery (userNo) {
      //用户编号查询
      if (userNo == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: userNo,
        status: 9,//状态为9查询除销户以外的
      };
      let params = { busicode: "UserSelect", data };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          // 需要把内容回显到页面中
          eventBus.$emit('deliverRes', res);
          this.form.businessArea = res.userInfo.businessArea;
          this.form.businessAreaName = res.userInfo.businessAreaName;
          this.getDataLength(userNo)
        });

    },
    getDataLength (userNo) {
      let params = {
        busicode: "ChargeLackDetail",
        data: {
          userNo: userNo
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (res.length > 0) {
            this.$notify({
              title: "费用未结清提醒",
              message: "此用户费用未结清！",
              type: "warning"
            });
          }
        });
    },

    showAddrAddDialog () {
      this.$refs.addrselect.blur();
      this.addrVisible = true;
    },
    closeAddrAddVisible () {
      this.addrVisible = false;
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
        })
    },
    //营业区域
    selectBAreaOptions () {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.businessAreaData = res.children;
          //console.log("businessAreaData",JSON.stringify(this.businessAreaData));
        }).catch(res => {
          this.businessAreaData = [];
        });
    },
    // 水表口径下拉数据
    getMeterBore () {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": { page: 1, pageCount: 999 }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list
      })
    },
    getTreeData(data){
      for(var i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
  },
  watch: {
   'form.pjType':{
      handler(newValue,oldValue){
        this.oldPjType=oldValue;
        this.currentType=newValue;
      },
      immediate:true,
      deep:true,
    },
    businessAreaData(){
      this.getTreeData(this.businessAreaData)
    },
    editData (val) {
      if (val) {
        this.form = { ...val }
        this.pjTypeChange();
      }
    },
    disabled (val) {
      // console.log('disabled', val)
      $('input[name=demo]').removeAttr("readonly");
    },
    operation(){
    }
  }
}
</script>

<style lang="scss" scoped>
.engineerInfo {
  .col-2 {
    width: calc(46% + 10px);
  }
  .two-input {
    /deep/ {
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
  .el-message-box {
    width: 525px !important;
  }
}
.img1 {
    filter: blur(4px);
}
.refresh_5 {
  margin-left: 24%;
}
.refresh_1 {
  margin-left: 38%;
}
</style>
<style lang="scss">
.el-cascader-panel{
  max-height: 500px; //开户银行的级联内容太多的时候会溢出屏幕，限制他的最大高度是500px
}
</style>

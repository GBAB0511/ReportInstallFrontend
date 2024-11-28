
<template>
  <div class="paperContract" >
    <legend class="legendColumn">合同信息</legend>
    <div class="toolbar">
      <el-form :model="tableQuery" class="demo-form-inline" :inline="true" size="mini" ref="formContract" :rules="rulesContract">
        <el-form-item label="合同类型：" class="width-150">
          <el-select v-if="OfferWaterContractParams.typeBtn == 'sgBtn'" v-model="tableQuery.contractType" placeholder="请选择" @change="changeContract">
            <el-option v-for="(item,index) in sgContractType" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-select v-else v-model="tableQuery.contractType" placeholder="请选择" @change="changeContract">
            <el-option v-for="(item,index) in gsContractType" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 施工合同 -->
        <el-form-item v-if="tableQuery.contractType == 5">
          <el-form-item label="合同编号：" prop="contractNo" class="width-200" required>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.contractNo" placeholder="合同编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="合同名称：" prop="contractName" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.contractName" placeholder="合同名称" clearable></el-input>
          </el-form-item>
        </el-form-item>
        <!-- 选择“电子合同”的时候才显示【合同模板】 -->
        <el-form-item label="合同模板：" prop="contractTemplate" class="width-150" v-if="tableQuery.contractType == 2 || tableQuery.contractType == 4">
          <el-select v-model="tableQuery.contractTemplate" placeholder="" @change="changeContractTemplate">
            <el-option v-for="(item,index) in contractTemplateData" :key="index" :label="item.contractName" :value="item.ecCategoryId"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="合同附件：" v-if="tableQuery.contractType == 5" prop="" required class="width-150">
        </el-form-item>
        <uploadFile :disabledBtnUpload="true" ref="uploadFiles" class="uploadFile" v-if="tableQuery.contractType == 5" :style="{height: maxHeight-300 + 'px',overflow:'auto'}" :editData="{}" :receiptType="receiptType"></uploadFile>
      </el-form>
    </div>
    <div class="bread-contain">
      <legend class="legendColumn">客户信息</legend>
    </div>
    <!-- 普通施工合同 -->
    <div class="kl-table" :style="{height: maxHeight + 'px'}" style="margin-top:10px" v-if="tableQuery.contractType == 5">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="tableDataConstruction">
        <el-table-column type="index" label="序号" width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="ctmInfo.ctmName" min-width="180" label="客户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.certTypeName" min-width="120" label="客户证件类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.certNo" min-width="130" label="客户证件号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.mobile" min-width="110" label="手机号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="consult.installAddr" min-width="180" label="工程地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <!-- 电子施工合同 -->
    <div class="kl-table" :style="{height: maxHeight + 'px'}" style="margin-top:10px" v-if="tableQuery.contractType == 4">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="tableDataConstruction">
        <el-table-column type="index" label="序号" width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="ctmInfo.ctmName" min-width="180" label="客户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.certTypeName" min-width="120" label="客户证件类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.certNo" min-width="130" label="客户证件号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.mobile" min-width="110" label="手机号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmInfo.ctmAddr" min-width="180" label="工程地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <!-- 普通供水合同 -->
    <div class="kl-table" :style="{height: maxHeight + 'px'}" style="margin-top:10px" v-if="tableQuery.contractType == 3">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight-150" stripe border :data="tableData.list">
        <el-table-column type="index" label="序号" width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="userInfo.userNo" min-width="130" label="用户编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.ctmName" min-width="180" label="客户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.certTypeName" min-width="120" label="客户证件类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.certNo" min-width="130" label="客户证件号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.setupMeterAddr" min-width="110" label="装表地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.mobile" min-width="110" label="手机号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gsContract.contractNo" min-width="200" label="合同编号">
          <template v-slot:header>
            <div><span style="color: red">* </span>合同编号</div>
          </template>
          <template slot-scope="scope">
            <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" @input="e => input = inputMe(e)"  v-model="scope.row.gsContract.contractNo"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="gsContract.contractName" min-width="200" label="合同名称">
          <template slot-scope="scope">
            <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" @input="e => input = inputMe(e)"  v-model="scope.row.gsContract.contractName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="合同附件" min-width="150" fixed="right">
          <template v-slot:header>
            <div><span style="color: red">* </span>合同附件</div>
          </template>
          <template slot-scope="scope">
            <el-button style="display:inline-block;margin-right: 10px;" type="text" @click="takePhoto(scope.row)">拍照</el-button>
            <el-upload action="/" :http-request="(file) => {
                return uploadAttachmentRow(file, scope.row);
              }" style="display:inline-block;margin-right: 10px;"
                :show-file-list="false">
              <el-button type="text">上传</el-button>
            </el-upload>
              <el-button type="text" @click="openPreview(scope.row)">预览</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 电子供水合同 -->
    <div class="kl-table" :style="{height: maxHeight + 'px'}" style="margin-top:10px" v-if="tableQuery.contractType == 2">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight-150" stripe border :data="tableData.list">
        <el-table-column type="index" label="序号" width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="userInfo.userNo" min-width="120" label="用户编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.ctmName" min-width="180" label="客户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.certTypeName" min-width="120" label="客户证件类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.certNo" min-width="130" label="客户证件号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.setupMeterAddr" min-width="110" label="装表地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userInfo.mobile" min-width="110" label="手机号码" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :append-to-body="true" :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        busicode="ReceiptAccessoryList"
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拍照" :visible.sync="isTakePhoto" width="800px" style="height:600px" :modal="false" class="photo-dialog" @close="closeTakePhoto()">
      <form>
        <fieldset>
          <p><img id="photo" src="" width="800" height="400" /></p>
          <!-- <input type="button" value="旋转启动主" name="StartBtn" @click="Photo.start('bStartPlayRotate(90)')">
          <input type="button" value="启动副" name="StopBtn" @click="Photo.start('bStartPlay2')">
          <input type="button" value="停止" name="StopBtn" @click="Photo.start('bStopPlay')">
          <input type="button" value="自动对焦" name="AutoFocus" @click="Photo.start('AutoFocus')">
          <input type="button" value="去黑边" name="StartBtn" @click="Photo.start('vSetDelHBFlag(true)')">
          <input type="button" value="Base64" name="sGetBase64" @click="Photo.start('sGetBase64')">
          <input type="button" value="开始录屏" name="bStartRec" @click="Photo.start('bStartRec(d:\\test.avi)')">
          录制时间：<input id="TimeLenth" type="text" value="" size="15" />
          <input type="button" value="停止录屏" name="bStartRec" @click="Photo.start('bStopRec')">
          <input type="button" value="拍照" name="SaveJPGBtn" @click="Photo.start('getPNGBase64')">
          <input type="button" value="拍照" name="SaveJPGBtn" @click="Photo.start('bSaveJPG(D:\\,Photo)')">
          <input type="button" value="FILTER设置" name="ParaSet" @click="Photo.start('displayVideoPara')">
          <input type="button" value="PIN设置" name="ParaSet" @click="Photo.start('vSetCapturePin')">
          <input type="button" value="自动寻边" name="ParaSet" @click="Photo.start('bSetMode(3)')">
          <input type="button" value="身份证自动寻边" name="ParaSet" @click="Photo.start('bSetMode(4)')">
          <input type="button" value="vSetExposure" name="ParaSet" @click="Photo.start('vSetExposure(50)')">
          <input type="button" value="vSetBrightness" name="ParaSet" @click="Photo.start('vSetBrightness(30)')">
          <input type="button" value="vSetContrast" name="ParaSet" @click="Photo.start('vSetContrast(50)')">
          <input type="button" value="图片base64" name="base64" @click="Photo.start('Base64Encode(d:\\face.jpg)')">
          <input type="button" value="找目录" name="finddir" @click="Photo.start('bDirIsExist(D:\\pic\\20190420\\)')">
          <input type="button" value="创建目录" name="createdir" @click="Photo.start('bCreateDir(d:\\pic\\)')">
          <input type="button" value="获取临时目录" name="gettemppath" @click="Photo.start('sGetTempPath')">
          <input type="button" value="彩色拍照读取一二维码" name="sGetBarCodeEx" @click="Photo.Test5_onclick()">
          <input type="button" value="黑白拍照读取一二维码" name="sGetBarCodeEx" @click="Photo.Test6_onclick()">
          <input type="button" value="设置分辨率" name="sGetBase64" @click="Photo.start('vSetResolution(8)')">
          -->
        </fieldset>
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePhoto" size="mini">拍照并上传</el-button>
        <el-button @click="closeTakePhoto()" size="mini">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "paperContract",
  components: {
    uploadFile,
    AttachmentViewInfo,
  },
  props: ['OfferWaterContractParams'],
  data() {
    return {
      uploadFileShow: true,
      receiptType: "contract_manage",
      eleContract: false,
      // editType:0,
      dictionaryData: {},
      isUploadFiles:false,
      rules: {
        contractNo: [{ required: true, message: "合同编号不能为空", trigger: 'blur' }],
      },
      rulesContract: {
        contractTemplate: []
      },
      tableQuery: {
        contractType: "",
        contractTemplate: "",
        contractNo: "", // 合同编号
        contractName: "", // 合同名称
        page: 1,
        pageCount: 20,
      },
      tableQueryConstruction: {
        contractNo: "",
        contractName: "",
        appendices: []
      },
      // 施工合同的内容
      sgContractType:[
        {
          name: "普通施工合同",
          value: "5",
        },
        {
          name: "电子施工合同",
          value: "4",
        }
      ],
      // 供水合同的内容
      gsContractType:[
        {
          name: "普通供水合同",
          value: "3",
        },
        {
          name: "电子供水合同",
          value: "2",
        }
      ],
      appendicesList: [],
      tableShow: false,
      maxHeight: 0,
      // 列表数据
      tableDataConstruction: [],
      tableData: {},
      userData: {},
      // 弹窗
      contractVisible: false,
      contractTitle: "",
      visibleType: "",
      dialogForm: {

      },
      elecDisabled: false,
      uploadArray: [],//用来存放附件的内容
      uploadArrayRow: [],
      contractTemplateData: [],//合同模板数据
      receiptAccessory: {}, // 查看附件的接口的传参
      viewAttachmentShow: false, // 查看附件弹出框
      rowId: "",// 行的id
      isTakePhoto: false,
      sgTempId: "",
    }
  },
  mounted() {
    if(this.OfferWaterContractParams.typeBtn == "sgBtn"){
      this.tableQuery.contractType = "5"; // 施工合同的默认值
      // 施工合同的情况的时候，合同编号要必填
      this.$set(this.rulesContract, "contractNo", [{ required:true, message:"合同编号不能为空", trigger: ['blur','change']}])
    }else{
      this.tableQuery.contractType = "3"; // 供水合同的默认值
      const names = ['contractNo']
      names.forEach(item => {
        if(this.rulesContract.hasOwnProperty(item)){
          this.$delete(this.rulesContract,item)
        }
      })
    }
    debugger;
    console.log(this.$refs.uploadFiles);
    
    if (this.OfferWaterContractParams.meterList.length >= 1) {
      this.tableQuery.userNo = this.OfferWaterContractParams.meterList[0].userInfo.userNo
      this.tableQuery.certNo = this.OfferWaterContractParams.meterList[0].userInfo.certNo
      this.tableQuery.ctmName = this.OfferWaterContractParams.meterList[0].userInfo.ctmName
      this.tableQuery.ctmAddr = this.OfferWaterContractParams.meterList[0].userInfo.ctmAddr
    }
    this.getInfoQuery();
    this.tableData.list = JSON.parse(JSON.stringify(this.$parent.$parent.$refs.edit.$refs.buildwaterMeter.selectList));
    if(this.tableData.list.length > 0){
      this.tableData.list.forEach(item=>{
        this.uploadArrayRow.push([])
        this.appendicesList.push([])
      })
    }
    this.getConfig();
    this.getDictionarySelect();
    this.getReceiptAccessoryList();
    // this.init()
    this.common.changeTable(this, ".paperContract", []);
  },
  methods: {
    getInfoQuery(){
      const params = {
        "busicode": "PjInfoQuery",
        "data": { "id":this.OfferWaterContractParams.id }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        if(res.sgContract && res.sgContract.id){
          this.sgTempId = res.sgContract.id;
        }else{
          this.sgTempId = this.util.generateUUID();
        }
        eventBus.$emit('receiptId', this.sgTempId);
        this.tableDataConstruction.push(res);
        this.tableQuery.contractNo = res.sgContract.contractNo;
        this.tableQuery.contractName = res.sgContract.contractName;
        if(res.sgContract.id){
          let params = {
            busicode: "ReceiptAccessoryList",
              data: {
              receiptType: "contract_template",
              receiptId: res.sgContract.id
            }
          };
          this.$api
          .fetch({
            params: params //参数
          })
          .then(res1 => {
            res1.forEach(item =>{
              this.uploadArray.push({
                "name": item.accessoryName,
                "path": item.accessoryMetadata.accessoryPath
              })
            })
          });
          if(this.$refs.uploadFiles.initPicList.length > 0){
              this.isUploadFiles = true;
          }
        }

      })
    },
    changeContract(val){
      // 根据选择的工程类型来切换页面
      // 对于普通供水合同
      if(val == 2){
        if(this.tableData.list.length == 0){
          this.$message({
            type: 'warning',
            message: '未勾选有数据！'
          });
        }
        this.getContractTemplateData();
        this.$set(this.rulesContract,'contractTemplate',[{ required:true, message:"合同模板不能为空", trigger: ['blur','change']}])
        // 对于电子供水合同
      }else if(val == 3){
        if(this.tableData.list.length == 0){
          this.$message({
            type: 'warning',
            message: '未勾选有数据！'
          });
        }
        const names = ['contractTemplate']
        names.forEach(item => {
          if(this.rulesContract.hasOwnProperty(item)){
            this.$delete(this.rulesContract,item)
          }
        })
        // 调用接口获得信息内容
      }else if(val == 4){
        this.getContractTemplateData();
        this.$set(this.rulesContract,'contractTemplate',[{ required:true, message:"合同模板不能为空", trigger: ['blur','change']}])
      }else if(val == 5){
      }
    },
    getReceiptAccessoryList(){
      // 普通供水合同
      this.tableData.list.forEach((item,i)=>{
        if(item.gsContract.id){
          let params = {
            busicode: "ReceiptAccessoryList",
              data: {
              receiptType: "contract_template",
              receiptId: item.gsContract.id
            }
          };
          this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            res.forEach(item1 =>{
              this.uploadArrayRow[i].push({
                "name": item1.accessoryName,
                "path": item1.accessoryMetadata.accessoryPath
              })
            })
          });
        }
      })
      
    },
    changeContractTemplate(val){
      console.log(val)
    },
    importExcel(file) {
      let _this = this;
      let params={}
        params = {
          busicode: "PjMeterImport",
          type: "import",
          data: {
            file: file.file,
          }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "导入成功"
          });
          // 导入成功之后要赋值到对应的位置去
          // this.tableData=[]
          // this.tableData = this.tableData.concat(res);
          // let list=[]
          // for(let i=0;i<this.tableData.length;i++){
          //   list.push(this.tableData[i].msInfo.factoryNo)
          // }
          // // console.log(list)
          // //console.log(res);
          // this.getFactorysInfo(list)
        });
    },
    // 下载文件
    downloadExcel() {
      var params = {
        busicode: "EcWaterContractExport",
        data: {
          "projectId":this.OfferWaterContractParams.id,
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(this.common.getExportExcelIp() + "/project/exportExcel.api?json=" + encodeURI(JSON.stringify(params)));
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    takePhoto(row) {
      if(row.gsContract && row.gsContract.id){
        row.tempId = row.gsContract.id;
      }else{
        if(!row.tempId){
          row.tempId = this.util.generateUUID();
        }
      }
      this.rowId = row.tempId;
      if (this.common.myBrowser() === "IE") {
        this.$message.error("请使用其他浏览器，如谷歌，360浏览器等访问此页面");
        return;
      }
      if(this.$store.state.photographic){
        // 这个是用的方正高拍仪，下面的else还是走原来的逻辑
        if (!this.PhotoFangZheng.online) {
          this.$message.error("请连接高拍仪");
          return;
        }
        // 默认都是用的主摄像头
        this.PhotoFangZheng.OpenCamera("0");
        this.isTakePhoto = true;
        this.PhotoFangZheng.SetAutoCut(false);//默认打开的时候不寻边
      }else{
        if (!this.Photo.online) {
          this.$message.error("请连接高拍仪");
          return;
        }
        this.isTakePhoto = true;
        this.Photo.StartPlay_onclick();
        setTimeout(() => {
          // 如果打开弹出框之后没有连接有正确的设备，则关闭弹出框并给出提示
          if (!this.Photo.successConnection) {
            this.$message.error("请检查设备是否连接、驱动是否正确");
            this.closeTakePhoto();//关闭弹出框跟设备
            return;
          }
        }, 3000);
      }
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
    },
    openPreview(row) {
      if(row.gsContract.contractType == 2 || row.gsContract.contractType == 4){
        // 电子合同是直接弹出
        let params = {
          busicode: "newEcContractPreview",
          data: {
            "contractNo": row.gsContract.contractNo,
            "contractType": row.gsContract.contractType,
            "fileId": row.gsContract.fileId,
          },
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
        window.open( this.common.getExportExcelIp() + '/project/previewPdf.api?json=' + encodeURIComponent(JSON.stringify(params)))
      }else{
        let getId = "";
        if(row.gsContract.id){
          getId = row.gsContract.id;
        }else{
          if(row.tempId){
            getId = row.tempId;
          }
        }
        if(getId){
          // 打开弹出框显示附件
          this.receiptAccessory = {
            receiptType: this.receiptType,
            receiptId: getId
          }
          this.$nextTick(() => {
            this.viewAttachmentShow = true;
          })
        }else{
          this.$message({
            type: "warning",
            message: "暂无附件"
          });
        }
      }
    },
    // 弹出框确定按钮
    savePhoto() {
      let _this = this;
      // 点击获得图片，if是方正高拍仪的，else是科荣高拍仪
      let IDCardName = 'Photo';
      if(this.$store.state.photographic){
        IDCardName = 'PhotoFangZheng';
        this.PhotoFangZheng.GrabImage();
      }else{
        // 执行插件拍照方法
        this.Photo.start("bSaveJPGEx");
      }
      setTimeout(() => {
        let params = {
          busicode: "PicUpload",
          data: {
            receiptId: this.rowId,
            accessoryNo: "223", // 供用水合同：223(默认)
            data: this[IDCardName].dataOBJ.myBase64,
            userNo: "",
            receiptType: _this.receiptType,
          },
        };
        this.$api.fetch({
          params: params, //参数
        }).then((res) => {
          _this.$message({
            message: "上传成功！",
            type: "success",
          });
        });
        _this.isTakePhoto = false;
      }, 3000);
    },
    closeTakePhoto(){
      this.isTakePhoto = false;
      if(this.$store.state.photographic){
        this.PhotoFangZheng.CloseDevice();
      }else{
        this.Photo.Stop_onclick();
      }
    },
    init() {
      let params = {
        busicode: "ContractHistoryList",
        data: {
          userNo: this.OfferWaterContractParams.meterList.map(item => {
            return item.userInfo.userNo
          }).join(','),
          projectId: this.OfferWaterContractParams.id,
          page: this.tableQuery.page,
          pageCount: this.tableQuery.pageCount,
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res.pageInfo
        this.userData = res.userInfo
        this.common.changeTable(this, ".paperContract", []);
        let temUserNoList1 = []
        let temUserNoList2 = []
        this.OfferWaterContractParams.meterList.forEach(item1 => {
          temUserNoList1.push(item1.userInfo.userNo)
        })
        res.pageInfo.list.forEach(item2 => {
          temUserNoList2.push(item2.userNo)
        })
        try {
          // 有一户没有都可以创建
          if (this.getArrDifference(temUserNoList1, temUserNoList2).length > 0) {
            this.elecDisabled = false
            throw new Error()
          }else{ // 所有户都有，有一户合同是签约失败或者作废都可以创建
            res.pageInfo.list.forEach(item2 => { 
              let temList = []
              res.pageInfo.list.forEach(item3 => {
                if (item2.userNo == item3.userNo) {
                  temList.push(item3)
                }
              })
              if (temList.some(item => item.contractStatus !== "3" && item.contractStatus !== '6')) {
                console.log(item2.userNo);
                this.elecDisabled = true
              }else{
                console.log(item2.userNo);
                this.elecDisabled = false
                throw new Error()
              }
            })
          }
        } catch (err) {
        }
        
      })
    },
    getArrDifference(arr1, arr2){
      return arr1.concat(arr2).filter(function(value, i, arr){
        return arr.indexOf(value) === arr.lastIndexOf(value);
      })
    },
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CONTRACT_STATUS,CONTRACT_TYPE,IDT"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
        if (this.dictionaryData.CONTRACT_TYPE.length > 0) {
          let tem = this.dictionaryData.CONTRACT_TYPE.filter(item => {
            return item.value != "0" && item.value != "1";//要把营收中重复的给过滤掉
          });
          this.dictionaryData.CONTRACT_TYPE = tem
        }
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    // 合同模板
    getContractTemplateData() {
      var params = {
        busicode: "ContractConfigList",
        data: {
          "contractType": this.tableQuery.contractType
        }
      };
      this.$api.fetch({ params: params }).then(res => {
        this.$set(this, "contractTemplateData", res);
        this.tableQuery.contractTemplate = res[0].ecCategoryId;
      }).catch(res => {
        this.$set(this, "contractTemplateData", []);
      });
    },
    inputMe(e){
      let str=e.replace(/\ +/g,"")
      str=str.replace(/[\r\n]/g,"")
      return str;
    },
    createContract(type){
      if(this.tableQuery.contractType == "5"){//普通施工合同,需要校验合同编号,只有一行
        // 校验合同编号是否为空
        let flag;
        this.$refs.formContract.validate((valid) => {
          if (valid == false) {
            flag = false
          }
        })
        if(flag == false){
          this.$message({
            type: 'error',
            message: '信息未填写完整！'
          });
          return;
        }
        let hashUploadFiles = false;
        if(this.$refs.uploadFiles.initPicList.length > 0){
          this.$refs.uploadFiles.picList.forEach(item=>{
            if(item.url != ""){
              hashUploadFiles = true; // 说明有上传有附件
              this.isUploadFiles = true;
            }
          })
          if(hashUploadFiles == false){
            this.$message({
              type: "error",
              message: "附件未上传！"
            });
            return;
          }
        }
      }else if(this.tableQuery.contractType == 4){//电子施工合同,直接签约
        let flag;
        this.$refs.formContract.validate((valid) => {
          if (valid == false) {
            flag = false
          }
        })
        if(flag == false){
          this.$message({
            type: 'error',
            message: '信息未填写完整！'
          });
          return;
        }
      }else if(this.tableQuery.contractType == 3){//普通供水合同,判断是否有勾选数据,以及校验多行的输入
        // 循环校验合同编号是否都输入
        console.log(this.tableData.list)
        if(this.tableData.list.length == 0){
          this.$message({
            type: 'warning',
            message: '未勾选有数据！'
          });
          return;
        }
        for(let i=0; i < this.tableData.list.length; i++){
          if(this.tableData.list[i].gsContract.contractNo == "" || this.tableData.list[i].gsContract.contractNo == undefined){
            this.$message({
              type: 'error',
              message: "第" + (i + 1) + "行合同编号不能为空"
            });
            return;
          }
        }
      }else if(this.tableQuery.contractType == 2){//电子供水合同,判断是否有勾选数据
        // 循环校验合同编号是否都输入
        console.log(this.tableData.list)
        if(this.tableData.list.length == 0){
          this.$message({
            type: 'warning',
            message: '未勾选有数据！'
          });
          return;
        }
        let flag;
        this.$refs.formContract.validate((valid) => {
          if (valid == false) {
            flag = false
          }
        })
        if(flag==false){
          this.$message({
            type: 'error',
            message: '信息未填写完整！'
          });
          return;
        }
      }
      let temList = [];
      console.log(this.OfferWaterContractParams)
      console.log(this.tableDataConstruction)
      console.log(this.uploadArray)
      var params;
      if(this.tableQuery.contractType == 2){
        //普通供水合同、电子供水合同，传勾选的用户的水表信息回去
        if (this.tableData.list.length > 0) {
          this.tableData.list.forEach(item => {
            let tem = {
              contractType: this.tableQuery.contractType,
              contractNo: "",
              ecCategoryId: this.tableQuery.contractTemplate,
              userNo: item.userInfo.userNo,
              name: item.userInfo.ctmName,
              contractName: "",
              certNo: item.userInfo.certNo,
              certType: item.userInfo.certType,
              mobile: item.userInfo.mobile,
              ctmAddr: item.userInfo.ctmAddr,
              projectId: this.OfferWaterContractParams.id,
              billNo: this.OfferWaterContractParams.billNo,
              pjMeterId: item.id,
            }
            temList.push(tem);
          })
        }
        var params = {
          busicode: "NewContractManageAdd",
          data: {
            contractType: this.tableQuery.contractType,
            contractManageBeanList: temList,
            ecCategoryId: this.tableQuery.contractTemplate,
          },
        };
      }else if(this.tableQuery.contractType == 3){
        //普通供水合同、电子供水合同，传勾选的用户的水表信息回去
        if (this.tableData.list.length > 0) {
          this.tableData.list.forEach(item => {
            let tem = {
              contractType: this.tableQuery.contractType,
              contractNo: item.gsContract.contractNo,
              userNo: item.userInfo.userNo,
              name: item.userInfo.ctmName,
              contractName: item.gsContract.contractName,
              certNo: item.userInfo.certNo,
              certType: item.userInfo.certType,
              mobile: item.userInfo.mobile,
              ctmAddr: item.userInfo.ctmAddr,
              projectId: this.OfferWaterContractParams.id,
              billNo: this.OfferWaterContractParams.billNo,
              pjMeterId: item.id,
              tempId: item.tempId,
            }
            temList.push(tem);
            console.log(tem)
          })
        }
        var params = {
          busicode: "NewContractManageAdd",
          data: {
            contractType: this.tableQuery.contractType,
            contractManageBeanList: temList
          },
        };
      } else if(this.tableQuery.contractType == 4){
        // 电子施工合同、普通施工合同，传单据的客户信息回去
        let temList = [];
        let tem = {
          contractType: this.tableQuery.contractType,
          contractNo: this.tableQuery.contractNo,
          userNo: this.tableDataConstruction[0].sgContract.userNo,
          name: this.tableDataConstruction[0].ctmInfo.ctmName,
          contractName: this.tableQuery.contractName,
          certNo: this.tableDataConstruction[0].ctmInfo.certNo,
          certType: this.tableDataConstruction[0].ctmInfo.certType,
          mobile: this.tableDataConstruction[0].ctmInfo.mobile,
          ctmAddr: this.tableDataConstruction[0].ctmInfo.ctmAddr,
          projectId: this.OfferWaterContractParams.id,
          billNo: this.OfferWaterContractParams.billNo,
        }
        temList.push(tem);
        params = {
          busicode: "NewContractManageAdd",
          data: {
            contractType: this.tableQuery.contractType,
            contractManageBeanList: temList,
            ecCategoryId: this.tableQuery.contractTemplate,
          },
        };
      }else if(this.tableQuery.contractType == 5){
        // 电子施工合同、普通施工合同，传单据的客户信息回去
        let temList = [];
        let tem = {
          contractType: this.tableQuery.contractType,
          contractNo: this.tableQuery.contractNo,
          userNo: this.tableDataConstruction[0].sgContract.userNo,
          name: this.tableDataConstruction[0].ctmInfo.ctmName,
          contractName: this.tableQuery.contractName,
          certNo: this.tableDataConstruction[0].ctmInfo.certNo,
          certType: this.tableDataConstruction[0].ctmInfo.certType,
          mobile: this.tableDataConstruction[0].ctmInfo.mobile,
          ctmAddr: this.tableDataConstruction[0].ctmInfo.ctmAddr,
          projectId: this.OfferWaterContractParams.id,
          billNo: this.OfferWaterContractParams.billNo,
          tempId: this.sgTempId,
        }
        temList.push(tem);
        params = {
          busicode: "NewContractManageAdd",
          data: {
            contractType: this.tableQuery.contractType,
            contractManageBeanList: temList
          },
        };
      }
      this.$api.fetch({
        params: params //参数
      })
      .then(res => {
        console.log(res)
        console.log(this.tableQueryConstruction.appendices)
        // 普通供水合同
        if(this.tableQuery.contractType == 3){
          console.log(this.appendicesList)
          res.forEach((item,i)=>{
            // 行里面如果有附件则要循环上传
            if(this.appendicesList[i].length > 0){
              this.appendicesList[i].forEach(itemT=>{
                var params = {
                  busicode: "accessoryUpload",
                  type: "upload",
                  data: {
                    receiptId: item,
                    receiptType: "contract_template",
                    accessoryNo: "000",
                    file: itemT.file
                  },
                  sysType: "002"
                };
                this.$api.fetch({
                  params: params //参数
                })
                .then(res => {
                })
              })
            }
          })
        }
        // 普通施工用水的上传附件
        if(this.tableQuery.contractType == 5){
          console.log(this.tableQueryConstruction.appendices)
          if(this.tableQueryConstruction.appendices.length > 0){
            this.tableQueryConstruction.appendices.forEach((item,i)=>{
              var params = {
                busicode: "accessoryUpload",
                type: "upload",
                data: {
                  receiptId: res[0],
                  receiptType: "contract_template",
                  accessoryNo: "006",
                  file: item.file
                },
                sysType: "002"
              };
              this.$api.fetch({
                params: params //参数
              })
              .then(res => {
              })
            })
          }
        }
        this.$message({
          message: "签约成功！",
          type: "success"
        });
        // 需要更新表格中的数据
        this.tableData.list.forEach((item,i)=>{
          this.$set(this.$parent.$parent.$refs.edit.$refs.buildwaterMeter.tableData, item.index, item);//回显到水表信息表格中
        })
        // 关闭弹出框
        this.$parent.$parent.PaperContractShowVisible = false;
        // 调用接口初始化信息内容
        this.$parent.$parent.$refs.edit.$refs.buildwaterMeter.init();
      });
    },
    priview(row){
      if (row.contractType == "2") {
        let params = {
          busicode: "EcContractPreview",
          data: {
            userNo: row.userNo,
            projectId: this.OfferWaterContractParams.id,
            contractNo: row.contractNo,
            contractType: row.contractType,
            fileId: row.fileId,
          },
          token: sessionStorage.getItem("token"),
          sysType: '002',
        };
        window.open( this.common.getExportExcelIp() + window.location.pathname + 'exportPdf.api?json=' + encodeURIComponent(JSON.stringify(params)))
      }else{
        window.open(row.contractFileAddr)
      }
      
    },
    cancel(row){
      this.$confirm('是否确认作废该合同？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "ContractManageDelete",
          data: row
        };
        params.data.projectId = this.OfferWaterContractParams.id
        this.$api.fetch({params}).then(res => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.init()
        })
      }).catch(() => {
      });

    },
    // 催签
    urgeSign(row){
      let params = {
        busicode: "ContractNotify",
        data: {
          userNo: row.userNo,
          contractNo: row.contractNo,
          contractType: row.contractType,
          contractStatus: row.contractStatus,
          projectId: this.OfferWaterContractParams.id,
        }
      };
      this.$api.fetch({params}).then(res => {
        this.$message({
          type: 'success',
          message: '催签成功!'
        });
        this.init()
      })
    },
    // 签约完成
    finishSign(row){
      this.$confirm('是否确认签约完成？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "ContractComplete",
          data: {
            userNo: row.userNo,
            contractNo: row.contractNo,
            contractType: row.contractType,
            contractStatus: row.contractStatus,
            projectId: this.OfferWaterContractParams.id
          }
        };
        this.$api.fetch({params}).then(res => {
          this.$message({
            type: 'success',
            message: '签约成功!'
          });
          this.init()
        })
      }).catch(() => {
      });
    },
    getConfig() {
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'ec_pe_categoryId',
        }
      };
      this.$api.fetch({params}).then(res => {
        if (res.list.length && res.list[0].configValue) {//为01则启用
          this.eleContract = true;
        }
      })
    },
    initContract(){
      // let params = {
      //   busicode: "ContractGetUserInfo",
      //   data: {
      //     userNo: this.dialogForm.userNo,
      //     projectId: this.OfferWaterContractParams.id,
      //   }
      // };
      // this.$api.fetch({params}).then(res => {
      //   this.$set(this, 'dialogForm', res)
      //   // this.dialogForm = {
      //   //   contractType: res.contractType,
      //   //   contractNo: res.contractNo,
      //   //   userNo: res.userNo,
      //   //   name: res.name,
      //   //   contractTypeName: res.contractTypeName,
      //   //   certNo: res.certNo,
      //   //   mobile: res.mobile,
      //   // }
      //   console.log(this.dialogForm);
      // })
      this.dialogForm = {
        contractType: "3",
        contractNo: this.OfferWaterContractParams.meterList[0].userInfo.contractNo,
        userNo: this.OfferWaterContractParams.meterList[0].userInfo.userNo,
        name: this.OfferWaterContractParams.meterList[0].userInfo.ctmName,
        // contractTypeName: this.OfferWaterContractParams.meterList[0].userInfo.contractNo,
        certNo: this.OfferWaterContractParams.meterList[0].userInfo.certNo,
        mobile: this.OfferWaterContractParams.meterList[0].userInfo.mobile,
        ctmAddr: this.OfferWaterContractParams.meterList[0].userInfo.ctmAddr,
      }
    },
    //上传附件
    uploadAttachment(file, fileList) {
      console.log(file)
      if (!file.url) {
        file.url = URL.createObjectURL(file.file);
      }
      this.uploadArray.push({
        "name": file.file.name,
        "path": file.url
      })
      this.tableQueryConstruction.appendices.push(file)
      console.log(this.tableQueryConstruction.appendices)
      
    },
    handleRemove(file,fileList){
      this.uploadArray.forEach((item,i)=>{
        if(file.uid == item.uid){
          this.uploadArray.splice(item,1);//删除的时候要把传参的内容也去掉
          this.tableQueryConstruction.appendices.splice(i,1);
        }
      })
      this.$message({
        message: "附件移除成功！",
        type: "success"
      });
    },
    handlePreview(file,fileList){
      console.log(file)
      // 点击对应的附件的名称可以直接打开对应的内容
      window.open(file.path);
    },
    handleRemoveRow(file,index){
      console.log(file)
      console.log(index)
      console.log(this.uploadArrayRow)
      
      this.uploadArrayRow[index].forEach((item,i)=>{
        if(file.uid == item.uid){
          this.uploadArrayRow[index].splice(item,1);//删除的时候要把传参的内容也去掉
          this.appendicesList[index].splice(i,1);
        }
      })
      console.log(this.uploadArrayRow)
      this.$message({
        message: "附件移除成功！",
        type: "success"
      });
    },
    handlePreviewRow(file,fileList){
      console.log(file)
      // 点击对应的附件的名称可以直接打开对应的内容
      window.open(file.path);
    },
    //上传附件
    uploadAttachmentRow(file, row){
      if(row.gsContract && row.gsContract.id){
        row.tempId = row.gsContract.id;
      }else{
        if(!row.tempId){
          row.tempId = this.util.generateUUID();
        }
      }
      let tempGetId = row.tempId;
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: tempGetId,
          receiptType: this.receiptType,
          accessoryNo: "223", // 供用水合同：223(默认)
          file: file.file
        },
        sysType: "002"
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        _this.$message({
          message: "上传附件成功！",
          type: "success"
        });
        this.openPreview(row);//上传完成之后打开附件框
      });
    },
    deleteFile(){
      this.dialogForm.contractFileName = ""
      this.dialogForm.contractFileAddr = ""
    },
    priviewContract(){
      let params = {
        busicode: "ContractPreview",
        data: this.dialogForm,
        token: sessionStorage.getItem("token"),
        sysType: '002',
      }
      params.data.projectId = this.OfferWaterContractParams.id
      window.open( this.common.getExportExcelIp() + '/project/exportWord.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    save(){
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          var params = {
            busicode: "ContractManageAdd",
            data: {
              contractType: "3",
              contractManageBeanList: [this.dialogForm]
            },
          };
          params.data.contractManageBeanList[0].projectId = this.OfferWaterContractParams.id
          params.data.contractManageBeanList[0].billNo = this.OfferWaterContractParams.billNo
          this.$api.fetch({
            params: params //参数
          })
          .then(res => {
            this.$message.success(res);
            this.contractVisible = false
            this.init()
          });
        } else {

        }
      })
    },
    closeDialog(){
      this.contractVisible = false
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }

}
</script>
<style lang="scss" scoped>
.paperContract {
  width: 100%;
  height: 100%;
  .uploadFile{
    /deep/ .photo-dialog .el-dialog{ // 因为button-dialog这个公共样式类影响了拍照窗口的高度，需要重新调整拍照窗口的高度
      height: 500px !important;
    }
  }
}
.el-dialog__body{
  padding: 10px 20px;
}
.formBill-Two{
  height: 300px;
}
</style>

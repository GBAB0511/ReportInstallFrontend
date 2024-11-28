<template>
  <!-- 工程中心-上传附件 -->
  <div class="upload-pic">
    <!-- 进度条 -->
    <div class="progress" v-show="progressShow">
      <el-progress :percentage="percentage"></el-progress>
    </div>
    <!-- 上传附件 -->
    <div class="kr-photo">
      <div class="children" v-for="(item, i) in picList" :key="i" style="font-size:12px;">
        <div class="title2" v-if="!editData.processState || editData.processState == 'register'">
          <!-- 登记结点 -->
          <span v-if="item.fileType != 'png' && item.filetype != 'jpg' && item.filetype != 'jpeg' && item.fileArr != 'png' && item.fileArr != 'jpg' && item.fileArr != 'jpeg'">{{ item.title }}</span> 
          
          <div>
            <span @click="openPDF(item.url)" style="color:blue;" v-if="(item.accessoryNo == '101' || item.accessoryNo == '102' || item.accessoryNo == '103' || item.accessoryNo == '104' || item.accessoryNo == '105' || item.accessoryNo == '106' || item.accessoryNo == '107' || item.accessoryNo == '108' || item.accessoryNo == '109' || item.accessoryNo == '110') 
            && item.url != '' && (isShow || item.fileType == 'pdf' || item.fileArr == 'pdf')">{{ item.title2 }}</span>
          </div>
        </div>
        <div class="title2" v-if="editData.processState && editData.processState != 'register'">
          <!-- 其他结点 -->
          <span v-if="item.fileType != 'png' && item.filetype != 'jpg' && item.filetype != 'jpeg' && item.fileArr != 'png' && item.fileArr != 'jpg' && item.fileArr != 'jpeg'">{{ item.title }}</span>
          <div>
            <span @click="openPDF(item.url)" style="color:blue;" v-if=" item.fileArr != undefined && item.fileArr == 'pdf' ">{{ item.title2 }}</span>
          </div>
        </div>
        <div :class="['operation-btn', disabledUpload ? 'disabledUpload' : '']">
          <i class="el-icon-plus" @click="addPic(i)"></i>
          <i class="el-icon-close" @click="incrementPic(i)"></i>
        </div>
        <div v-if="(!editData.processState || editData.processState == 'register') && !item.isPDF">
          <!-- 登记结点 -->
          <div class="titleShow" style="margin-top: -6.7rem" v-if="item.url != '' && (!isShow || item.fileType == 'png' || item.fileType == 'jpg' || item.fileType != 'jpeg')">
            {{ item.title }}
          </div>
          <el-image
            v-if="item.url != '' && (!isShow || item.fileType == 'png' || item.fileType == 'jpg' || item.fileType != 'jpeg') "
            :src="item.url"
            :preview-src-list="item.srcList"
            referrer-policy="no-referrer-when-downgrade"
          >
          </el-image>
        </div>
        <div v-if="editData.processState && editData.processState != 'register'">
          <!-- 点击详情 -->
          <div class="titleShow" style="margin-top: -6.7rem" v-if="item.url != '' && !isShow  && item.fileArr != undefined && item.fileArr != 'pdf'">
            {{ item.title }}
          </div>
          <el-image
            v-if="item.url != '' && !isShow  && item.fileArr != undefined && item.fileArr != 'pdf'"
            :src="item.url"
            :preview-src-list="item.srcList"
            referrer-policy="no-referrer-when-downgrade"
          >
          </el-image>
        </div>
        <div class="btn-group">
          <el-button
            type="primary"
            size="mini"
            :disabled="disabledUpload || (disabledBtnUpload && item.url != '')"
            @click="takePhoto(i)"
            >拍照<i class="el-icon-camera-solid el-icon--right"></i
          ></el-button>
          <el-upload
            ref="uploadFiles"
            class="upload-file"
            :disabled="disabledUpload"
            action="/"
            :on-preview="handlePreview"
            :on-progress="handleProgress"
            multiple
            accept=".jpg,.png,.jpeg"
            :limit="1"
            :on-exceed="
              (files, fileList) => {
                handleExceed(files, fileList, item, i);
              }
            "
            :on-success="handleSuccess"
            :on-change="(value) => handleOnchange(i, value)"
            :file-list="item.pics"
            :http-request="(value) => httpRequest(i, value)"
            :before-upload="beforeUpload"
          >
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="disabledUpload || (disabledBtnUpload && item.url != '')"
              >本地上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </el-upload>
        </div>

        <!-- <el-dialog :title="v.title" :visible.sync="isTakePhoto" width="50%" :before-close="handleClose">
          <div class="kr-img">
            <img src="../assets/images/jmcxl.png" alt="这是一张帅帅的照片">
            <span></span>
          </div>
          <el-progress :percentage="50"></el-progress>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="doPhoto(ruleTitle)" size="mini">{{ruleTitle}}</el-button>
            <el-button @click="callBack(ruleTitle1)" size="mini">{{ruleTitle1}}</el-button>
          </span>
        </el-dialog> -->
      </div>

      <el-dialog
        :title="clickPicListItem.title"
        :visible.sync="isTakePhoto"
        width="800px"
        :modal="false"
        class="photo-dialog"
        @close="closeTakePhoto()"
      >
        <form>
          <fieldset>
            <p><img id="photo" src="" width="800" height="400" /></p>
            <!-- <input type="button" value="启动主" name="StartBtn" @click="Photo.StartPlay_onclick()">
            <input type="button" value="旋转启动主" name="StartBtn" @click="Photo.start('bStartPlayRotate(90)')">
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
          <el-button type="primary" @click="savePhoto" size="mini"
            >拍照并上传</el-button
          >
          <el-button
            v-if="xunbianShow"
            @click="setAutoSearchEdge()"
            size="mini"
            >身份证自动寻边</el-button
          >
          <el-button
            v-if="xunbianShow"
            @click="cancelAutoSearchEdge()"
            size="mini"
            >取消自动寻边</el-button
          >
          <el-button @click="closeTakePhoto()" size="mini">取消</el-button>
        </span>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="doPhoto(ruleTitle)" size="mini">{{ruleTitle}}</el-button>
            <el-button @click="callBack(ruleTitle1)" size="mini">{{ruleTitle1}}</el-button>
          </span> -->
      </el-dialog>
    </div>
    <el-dialog
          title="查看PDF"
          :visible.sync="dialogVisible"
          width="80%"
          :modal-append-to-body="false"
        >
          <pdf
            ref="pdf"
            v-for="i in pdfPageNumber"
            :key="i"
            :src="pdfSrc"
            :page="i"
          ></pdf>
    </el-dialog>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  components: {pdf},
  props: ["receiptType", "disabledUpload", "onOCRdone", "pdfList", "editData", "disabledBtnUpload", "disabledUpload2"],
  data() {
    return {
      progressShow: false,
      percentage: 0,
      isTakePhoto: false,
      ruleTitle: "确认",
      ruleTitle1: "取消",
      isPhoto: false,
      uploadTitle: "",
      title: "title1",
      tableList: [],
      uploadedNameList: [],
      pdfPageNumber: 0,//pdf页数
      pdfSrc: "",//pdf地址
      isShow:false,
      // isPDF: false,//返回的是否为pdf
      dialogVisible: false, //pdf预览弹窗
      projectType: '',//工程类型
      newData: [], //存储accessoryNo为102的
      newData1:[], //存储accessoryNo为103的
      hasFile: false,//判断获取附件接口返回长度！=0，true
      receiptId: "",
      userNo: "",
      processState: '', //单据状态
      picList: [
        // {
        //   title:'经办人照片',
        // },
        // {
        //   title:'业主身份证-正面',
        // },
        // {
        //   title:'业主身份证-反面'
        // },
        // {
        //   title:'房产证/用地、房产的相关证明文件/镇街以上政府部门证明（该项提供任一证明文件即可）',
        // },
        // {
        //   title:'银行卡',
        // },
        // {
        //   title:'经办人身份证-正面',
        // },
        // {
        //   title:'经办人身份证-反面'
        // },
        // {
        //   title:'银行卡账户持卡人-正面',
        // },
        // {
        //   title:'银行卡账户持卡人-反面'
        // },
        // {
        //   title:'其他',
        // }
      ],
      initPicList:[],
      localList: [],
      // 点击拍照的上传附件数据
      clickPicListItem: {},
      //点击拍照的上传附件index
      clickPicIndex: -1,
      // 接口返回的附件数据
      // accessoryList: [],
      // 是否显示寻边按钮 一般只有拍身份证才显示
      xunbianShow: false,
    };
  },
  mounted() {
    // 获取当前数据的单据id
    eventBus.$on("receiptId", (receiptId) => {
      this.receiptId = receiptId;
      console.log(this.receiptId);
      // 添加不获取附件,详情才获取
      if (this.receiptId != "") {
        this.getAccessoryList();
      }
    });
    eventBus.$on("projectType", (projectType) => {
      console.log(projectType);
      this.projectType = projectType
    })
    eventBus.$on("calcTestFee", (pdfList) => {
      console.log(pdfList);
      if(pdfList.length === 0) {
        this.picList=[...this.initPicList];
      }
      if (this.projectType == '1') { //用水报装-居民
        this.reInit(pdfList)
      } else if (this.projectType == '5') { //用水报装-企业
        this.legalReInit(pdfList)
      }
    });
    this.init();

  },
  beforeDestroy() {
    eventBus.$off("receiptId");
    eventBus.$off("calcTestFee");
    eventBus.$off("projectType")
  },
  methods: {
    // 初始化
    init() {
      let _this = this;
      let params = {
        busicode: "AccessoryQueryByReceiptType",
        data: { receiptType: _this.receiptType },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          if (res != null && res.length > 0) {

            _this.tableList = res;
            res.forEach((item) => {
              var a = {};
              a.title = item.accessoryType;
              a.receiptType = item.receiptType;
              a.accessoryNo = item.accessoryNo;
              a.pjType = item.pjType; // 拍照类型
              a.pics = [];
              a.url = "";
              a.srcList = [""];
              _this.picList.push(a);

            });
            _this.initPicList=[].concat(JSON.parse(JSON.stringify(_this.picList)))
          }
          //按照title排序
          // this.picList.sort((a,b) => {
          //   if (a['title'] != b['title']) {
          //     return a['title'].localeCompare(b['title']);
          //   }
          // })
          
          // var other = {"title":"其它","accessoryNo":"008"};
          // _this.picList.push(other);
          eventBus.$emit("postPicList",_this.picList)
        });
    },
    reInit(pdfList) { //当获取到电子证照（用水报装-居民）之后，重新刷新页面
      let _this = this;

      if (pdfList && pdfList.length > 0) {

        pdfList.forEach((item ,i) => {

          if (pdfList[i].accessoryNo == '101') { //对证照参数进行重新赋值 广东省居民身份证
            if (pdfList[i].url != "") {
              var fType = pdfList[i].url.split('.')
              pdfList[i].fType = fType[fType.length - 1]
            }
            for (let j = 0; j <  _this.picList.length; j++) {
                if (_this.picList[j].accessoryNo == '101') {
                  if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id) //调用删除附件接口
                  }
                    _this.picList[j].fileType = pdfList[i].fType
                    _this.picList[j].title2 = pdfList[i].title
                    _this.picList[j].id = pdfList[i].id
                    _this.picList[j].url = pdfList[i].url
                    break;
                }
                
            }

          }
          
          if (pdfList[i].accessoryNo == '102') { //广东省不动产权电子证书

            if (pdfList[i].url != "") {
              var fType = pdfList[i].url.split('.')
              pdfList[i].fType = fType[fType.length - 1]
            }
            for (let p = 0; p <  _this.picList.length; p++) {
                if (_this.picList[p].accessoryNo == '102' ) {
                  if (_this.picList[p].id && _this.picList[p].id != "") {
                    this.delFile(_this.picList[p].id)
                  }
                    _this.picList[p].fileType = pdfList[i].fType
                    _this.picList[p].title2 = pdfList[i].title
                    _this.picList[p].id = pdfList[i].id
                    _this.picList[p].url = pdfList[i].url
                    break;
                }
                
            }
          }
          if (pdfList[i].accessoryNo == '103' ) { //广东省不动产登记电子证明

            if (pdfList[i].url != "") {
              var fType = pdfList[i].url.split('.')
              pdfList[i].fType = fType[fType.length - 1]
            }
            for (let q = 0; q <  _this.picList.length; q++) {
                if (_this.picList[q].accessoryNo == '103') {
                  if (_this.picList[q].id && _this.picList[q].id != "") {
                    this.delFile(_this.picList[q].id)
                  }
                    _this.picList[q].fileType = pdfList[i].fType
                    _this.picList[q].title2 = pdfList[i].title
                    _this.picList[q].id = pdfList[i].id
                    _this.picList[q].url = pdfList[i].url
                    break;
                }
                
            }
          }
        })
        _this.isShow = true
        for (let i = 0; i < _this.picList.length; i++) { //判断文件类型，png/pdf
          var fileType =  _this.picList[i].url.split('.')
          _this.picList[i].fileType = fileType[fileType.length-1]
        }
      } 
      _this.isShow = true
      for (let i = 0; i < _this.picList.length; i++) { //判断文件类型，png/pdf
        var fileType =  _this.picList[i].url.split('.')
        _this.picList[i].fileType = fileType[fileType.length-1]
        if (_this.picList[i].fileType == 'pdf') {
          _this.picList[i].isPDF = true //若为pdf类型，则isPDF设为true用于进行标签显示判断
        }
      }
    },
    reInit2(list) { //本地上传后重新渲染

      for (let i = 0; i < list.length; i++) {
        var fileType =  list[i].url.split('.')
        list[i].fileType = fileType[fileType.length-1]
        if (list[i].fileType == 'pdf') { 
          this.$set(list[i], 'isPDF', true);
        } else {
          delete list[i].isPDF
        }
      }
      this.picList = list
    },
    legalReInit(pdfList) { //法人空间获取电子证照之后渲染
      let _this = this;
      _this.newData = []
      _this.newData1 = []
      var first = true
      let count={
        i_102:0,
        i_103:0,
      }
      console.log(pdfList);
      if (pdfList && pdfList.length > 0){ //获取的电子证照长度>0
        for (let i = 0; i < pdfList.length; i++) {
          if (pdfList[i].url != "") {
            var fType = pdfList[i].url.split('.')
            pdfList[i].fType = fType[fType.length - 1] //文件类型
            if (pdfList[i].accessoryNo == '102') { //给102设置count，便于渲染数据
              pdfList[i].count = count.i_102+1;
              count.i_102++;
              this.newData.push(pdfList[i])
            }
            if (pdfList[i].accessoryNo == '103') {
              pdfList[i].count = count.i_103+1;
              count.i_103++;
              this.newData1.push(pdfList[i])
            }
            
          }
        }
        // 获取插入102模块的位置
        let index=_this.picList.findIndex((item)=>
              item.accessoryNo==='102'
            )
        // 获取插入103模块的位置
        let index1=_this.picList.findIndex((item)=>
              item.accessoryNo==='103'
            )
        for (let i = 0; i < pdfList.length; i++) {
          if (pdfList[i].url != "") {
            var fType = pdfList[i].url.split('.')
            pdfList[i].fType = fType[fType.length - 1]
          }
          if (pdfList[i].accessoryNo == '104') { //广东省营业执照（A类有限责任公司）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '104') {
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break; //【内部测试】【报装-电子证照-法人空间】 点击+新增空白附件框，上传电子证照后，填入了所有该类型的附件框（实际上只有1个该类型的文件）
              }
            }
          }
          if (pdfList[i].accessoryNo == '105') { //广东省营业执照（B类集体所有制）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '105') {
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break;
              }
            }
          }
          if (pdfList[i].accessoryNo == '106') { //广东省营业执照（C类普通合伙企业）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '106') {
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break;
              }
            }
          }
          if (pdfList[i].accessoryNo == '107') { //广东省营业执照（D类农民专业合作经济组织）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '107') {
                // console.log(_this.picList[j]);
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break;
              }
            }
          }
          if (pdfList[i].accessoryNo == '108') { //广东省营业执照（E类个人独资企业）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '108') {
                // console.log(_this.picList[j]);
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    console.log("delete", j);
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break;
              }
            }
          }
          if (pdfList[i].accessoryNo == '109') { //广东省营业执照（F类个体户）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '109') {
                // console.log(_this.picList[j]);
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break;
              }
            }
          }
          if (pdfList[i].accessoryNo == '110') { //广东省营业执照（H类农民专业合作社分支机构）
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '110') {
                // console.log(_this.picList[j]);
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].fileType = pdfList[i].fType
                _this.picList[j].title2 = pdfList[i].title
                _this.picList[j].id = pdfList[i].id
                _this.picList[j].url = pdfList[i].url
                break;
              }
            }
          }
          _this.isShow = true
          
          //增加this.newData判断
          if (this.newData.length!==0  && this.newData[i] && this.newData[i].accessoryNo == '102' && first && this.newData[i].count == 1) { //第一个102文件
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '102') {
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].accessoryNo = this.newData[i].accessoryNo
                _this.picList[j].fileType = this.newData[i].fType
                _this.picList[j].title2 = this.newData[i].title
                _this.picList[j].id = this.newData[i].id
                _this.picList[j].url = this.newData[i].url
                _this.picList[j].count = this.newData[i].count
                first = false
                break;
              }
              first = false
            }
          }
          if (this.newData.length!==0 && this.newData[i] && this.newData[i].accessoryNo == '102' && !first && this.newData[i].count && this.newData[i].count != 1) { //其余102文件
            // 插入‘102’模块
            _this.tableList.splice(i + index-1, 0, { ..._this.tableList[i+index-1] }); 
             _this.picList.splice(i + index-1, 0, {
              ..._this.picList[i+index-1],
              url: this.newData[i].url,
              fileType: this.newData[i].fType,
              title2: this.newData[i].title,
              id: this.newData[i].id,
              pics: [],
              srcList: [""],
            });
          }
          if (this.newData1.length!==0 && this.newData1[i] && this.newData1[i].accessoryNo == '103'  && this.newData1[i].count === 1) { //第一个103文件
            for (let j = 0; j < _this.picList.length; j++) {
              if (_this.picList[j].accessoryNo == '103') {
                if (_this.picList[j].id && _this.picList[j].id != "") {
                    this.delFile(_this.picList[j].id)
                  }
                _this.picList[j].accessoryNo = this.newData1[i].accessoryNo
                _this.picList[j].fileType = this.newData1[i].fType
                _this.picList[j].title2 = this.newData1[i].title
                _this.picList[j].id = this.newData1[i].id
                _this.picList[j].url = this.newData1[i].url
                _this.picList[j].count = this.newData1[i].count
                break;
              }
              first = false
            }
          }
          if (this.newData1.length!==0 && this.newData1[i] && this.newData1[i].accessoryNo == '103' && this.newData1[i].count && this.newData1[i].count !== 1) {
            // 插入其余‘103’模块
            _this.tableList.splice(i + index1-1, 0, { ..._this.tableList[i+index1-1] });
             _this.picList.splice(i + index1-1, 0, {
              ..._this.picList[i+index1-1],
              url: this.newData1[i].url,
              fileType: this.newData1[i].fType,
              title2: this.newData1[i].title,
              id: this.newData1[i].id,
              pics: [],
              srcList: [""],
            });
          }
        }
        for (let i = 0; i < _this.picList.length; i++) { //判断文件类型，png/pdf
          var fileType =  _this.picList[i].url.split('.')
          _this.picList[i].fileType = fileType[fileType.length-1]
          if (_this.picList[i].fileType == 'pdf') {
            _this.picList[i].isPDF = true
          }
        }
      } 
    },
    addPic(i) { //添加同类型附件框
      if (!this.disabledUpload) {
        this.tableList.splice(i + 1, 0, { ...this.tableList[i] });
        console.log(this.picList[i]);
        this.picList.splice(i + 1, 0, {
          ...this.picList[i],
          url: "",
          pics: [],
          id: "",
          srcList: [""],
        });
        if (this.picList[i+1].fileType == 'png' || this.picList[i+1].fileType == 'jpg' || this.picList[i+1].fileType == 'jpeg') {
          delete this.picList[i+1].title2
          this.picList[i+1].fileType = ''
        }
        if (this.picList[i+1].fileArr == 'png' || this.picList[i+1].fileArr == 'jpg' || this.picList[i+1].fileArr == 'jpeg') {
          delete this.picList[i+1].title2
          this.picList[i+1].fileArr = ''
        }
        if (this.picList[i+1].fileType == 'pdf' || this.picList[i+1].fileType == 'jpg') {
          delete this.picList[i+1].title2
          delete this.picList[i+1].isPDF
          this.picList[i+1].url = ''
          this.picList[i+1].fileType = ''
        }
        if (this.picList[i+1].fileArr == 'pdf' || this.picList[i+1].fileArr == 'jpg') {
          delete this.picList[i+1].title2
          delete this.picList[i+1].isPDF
          this.picList[i+1].url = ''
          this.picList[i+1].fileArr = ''
        }
      }
    },
    incrementPic(i) { //删除同类型附件框
      if (!this.disabledUpload) {
        let _this = this;
        console.log(this.picList, this.picList[i].title);
        const sameTypeItems = _this.picList.filter(
          (item) => item.title == _this.picList[i].title
        );
        // 该图片为空，仅剩一个框不可删除，多个则可以
        if (!_this.picList[i].id) {
          if (sameTypeItems && sameTypeItems.length == 1) {
            _this.$message.warning("本类型附件至少保留一个");
            return;
          } else if (sameTypeItems && sameTypeItems.length > 1) {
            // 删除掉图片框
            _this.picList.splice(i, 1);
            return;
          }
        }
        this.$confirm('是否确定删除该文件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 先删除数据库的图片，在删除本地的图片
          let params = {
            busicode: 'AccessoryDelete',
            data: _this.picList[i].id//要删除的文件的id
          };
          _this.$api
            .fetch({
              params: params,
            })
            .then((res) => {
              if (sameTypeItems && sameTypeItems.length == 1) {
                _this.picList[i].url = '';
                _this.picList[i].id = '';
                _this.picList[i].srcList[0] = '';
                if (_this.picList[i].fileType) {
                  delete _this.picList[i].fileType
                }
                if (_this.picList[i].title2) {
                  delete _this.picList[i].title2
                }
                if (_this.picList[i].fileArr) {
                  delete _this.picList[i].fileArr
                }
                if (_this.picList[i].isPDF) {
                  delete _this.picList[i].isPDF
                }
                _this.$message.success("删除成功");
                return;
              } else {
                // 对于附件类型的最后一个的时候，类型框要保留，但是点删除按钮的时候图片会被删除
                _this.picList.splice(i, 1);
                _this.tableList.splice(i, 1);
                _this.$message({
                  message: "删除成功！",
                  type: "success",
                });
              }
            }).catch((err) => {
              console.log(err);
            });
        }).catch(() => {
          console.log("取消删除！");
        });
      }
    },
    getUploadedNameList() {
      return this.uploadedNameList;
    },
    // 获取附件
    getAccessoryList() {
      let _this = this;
      let params = {
        busicode: "ReceiptAccessoryList",
        data: {
          receiptType: _this.receiptType, //"PJ_INSTALL",
          receiptId: this.receiptId,
        },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          if (res.length !== 0) {
            this.hasFile = true
          }
          eventBus.$emit('hasFile',this.hasFile)
          // this.accessoryList = res
          var picLength = this.picList.length;
          for (let i = 0; i < picLength; i++) {
            for (let j = 0; j < res.length; j++) {
              if (this.picList[i].accessoryNo == res[j].accessoryNo) {
                if (
                  this.picList[i].url != "" &&
                  this.picList[i].url != res[j].accessoryMetadata.accessoryPath
                ) {
                  var a = {};
                  a.title = this.picList[i].title;
                  a.title2 = res[j].accessoryMetadata.accessoryName;
                  a.id = res[j].id;
                  a.receiptType = this.picList[i].receiptType;
                  a.accessoryNo = this.picList[i].accessoryNo;
                  a.pics = [];
                  a.url = res[j].accessoryMetadata.accessoryPath;
                  a.srcList = [""];
                  a.srcList[0] = res[j].accessoryMetadata.accessoryPath;
                  var Atype = res[j].accessoryMetadata.accessoryPath.split('.');
                  a.fileArr = Atype[fileArr.length-1]
                  if (a.fileArr == 'pdf') {
                    a.isPDF = true
                  }
                  this.picList.push(a);
                  continue;
                }
                this.picList[i].id = res[j].id;
                this.picList[i].url = res[j].accessoryMetadata.accessoryPath;
                this.picList[i].srcList[0] =
                  res[j].accessoryMetadata.accessoryPath;
                var fileArr = _this.picList[i].url.split('.') //判断文件类型
                _this.picList[i].fileArr = fileArr[fileArr.length-1]
                _this.picList[i].title2 = res[j].accessoryMetadata.accessoryName;
                if (_this.picList[i].fileType == 'pdf' || _this.picList[i].fileArr == 'pdf') {
                  _this.picList[i].isPDF = true
                }
              }
            }
          }
          //按照title排序
          // this.picList.sort((a, b) => {
          //   return a['sortNo'] - b['sortNo'];
          // })
          let temList = [];
          for(let i = 0;i< this.initPicList.length;i++){
            temList = temList.concat(this.picList.filter(item=>{
              return this.initPicList[i].title == item.title;
            }))
          }
          this.picList = temList;
        });
    },
    openPDF(url) { //打开PDF预览
      this.pdfSrc = url
      this.getPDFnums(url)
    },
    //计算pdf页码总数
    getPDFnums(url) {
      let loadURL = pdf.createLoadingTask({
        url: url, //你的pdf地址
      });
      loadURL.promise.then((pdf) => {
        this.pdfPageNumber = pdf.numPages;
        this.dialogVisible = true;
      });
    },
    editUserNo(userNo) {
      this.userNo = userNo;
    },
    // 弹出框确定按钮
    savePhoto() {
      if (localStorage.getItem("billId") == "") {
        this.$message({
          showClose: true,
          message: "请先保存单据!",
          type: "warning",
        });
      }
      let _this = this;
      // 点击获得图片，if是方正高拍仪的，else是科荣高拍仪
      let IDCardName = 'Photo';
      if(this.$store.state.photographic){
        IDCardName = 'PhotoFangZheng';
        this.PhotoFangZheng.GrabImage();
      }else{
      // 执行插件拍照方法
        this.Photo.start("bSaveJPGEx");
        if (this.clickPicListItem.accessoryNo == 30) {
          _this.Photo.start("bSaveJPG(D:\\,Photo)");
          _this.Photo.dataOBJ.bSaveJPGCb = function () {
            setTimeout(() => {
              _this.Photo.start("sOCRImageToString(D:\\Photo.jpg,2)");
              _this.Photo.dataOBJ.OCRtextCb = function (text) {
                _this.$emit("onOCRdone", text);
              };
            }, 1000);
          };
        }
      }
      setTimeout(() => {
        let params = {
          busicode: "PicUpload",
          data: {
            receiptId: this.receiptId,
            accessoryNo: this.clickPicListItem.accessoryNo,
            data: this[IDCardName].dataOBJ.myBase64,
            userNo: _this.userNo,
            receiptType: _this.receiptType,
          },
        };
        this.$api
          .fetch({
            params: params, //参数
          })
          .then((res) => {
            // 高拍仪每次只有一张图片，直接根据clickPicIndex回填，原本有图片则直接删除
            if (_this.picList[_this.clickPicIndex].id && _this.picList[_this.clickPicIndex].id != "") {
              _this.delFile(_this.picList[_this.clickPicIndex].id);
            }
            _this.picList[_this.clickPicIndex].id = res.receiptId;
            _this.picList[_this.clickPicIndex].url = res.accessoryPath;
            var fileType = _this.picList[_this.clickPicIndex].url.split('.') //判断文件类型
            _this.picList[_this.clickPicIndex].fileType = fileType[fileType.length-1]
            if (_this.picList[_this.clickPicIndex].fileType != 'pdf' && _this.picList[_this.clickPicIndex].isPDF == true) {
              delete _this.picList[_this.clickPicIndex].isPDF
              if (_this.picList[_this.clickPicIndex].title2) {
                delete _this.picList[_this.clickPicIndex].title2
              }
            }
            _this.picList[_this.clickPicIndex].srcList[0] = res.accessoryPath;
          });
          this.reInit2(this.picList)//重新渲染
        _this.isTakePhoto = false;
      }, 3000);
    },
    // 关闭设置，点击取消和右上角的关闭的时候要关闭设备
    // if是方正高拍仪的，else是科荣高拍仪，科荣高拍仪之前没有关闭设备的操作，也要关闭一下
    closeTakePhoto(){
      this.isTakePhoto = false;
      if(this.$store.state.photographic){
        this.PhotoFangZheng.CloseDevice();
      }else{
        this.Photo.Stop_onclick();
      }
    },
    // 设置自动寻变，if是方正高拍仪的，else是科荣高拍仪
    setAutoSearchEdge(){
      if(this.$store.state.photographic){
        this.PhotoFangZheng.SetAutoCut(true);
      }else{
        this.Photo.start('bSetMode(3)');
      }
    },
    // 取消自动寻变，if是方正高拍仪的，else是科荣高拍仪
    cancelAutoSearchEdge(){
      if(this.$store.state.photographic){
        this.PhotoFangZheng.SetAutoCut(false);
      }else{
        this.Photo.StartPlay_onclick();
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpg" || file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG 或者 PNG 格式!");
      }
      return isJPG || isPNG;
    },
    httpRequest (i, file) { //本地上传
      let _this = this;
      _this.isShow = false
      let params = {
        busicode: "AccessoryUpload",
        type: "upload",
        data: {
          file: file.file,
          receiptId: this.receiptId,
          userNo: this.userNo,
          receiptType: _this.receiptType,
          accessoryNo: _this.picList[i].accessoryNo,
        },
      };
      _this.$api
        .fetch({
          params: params,
        })
        .then((res) => {
          //当前附件框中有文件的时候，先删除再替换
          if (_this.picList[i].id && _this.picList[i].id != "") {
            this.delFile(_this.picList[i].id)
          }
          var tempUrl = res[0].path;
          this.$set(this.picList[i], "url", tempUrl + "");
          this.$set(this.picList[i], "id", res[0].id + "");
          this.picList[i].srcList[0] = tempUrl + "";
          this.uploadedNameList.push(this.picList[i].title);
          _this.$message({
            message: "上传成功！",
            type: "success",
          });
          console.log(this.picList);
          this.reInit2(this.picList)
          _this.$refs.uploadFiles.forEach((item) => {
            item.clearFiles();
          });
        })
        .catch(() => {
          for (let i = 0; i < this.picList.length; i++) {
            if (this.picList[i].fileType == 'pdf') {
              this.$set(this.picList[i], 'isPDF', true);
            }
          }
          _this.$refs.uploadFiles.forEach((item) => {
            item.clearFiles();
          });
          // this.isCheckPage = false
          // this.getData()
        });
    },
    handleSuccess(response, file, fileList) {
      this.fileList.push({
        name: file.name,
        url: file.response,
      });
    },
    submitFile(receiptId) {
      // console.log(receiptId)
      this.receiptId = receiptId;
      if (this.$refs.uploadFiles != null && this.$refs.uploadFiles.length > 0) {
        this.$refs.uploadFiles.forEach((item) => {
          item.submit();
        });
      }
      if (this.$refs.elUpload != null && this.$refs.elUpload.length > 0) {
        this.$refs.elUpload.forEach((item) => {
          item.submit();
        });
      }
      // console.log(this.fileList)
    },
    handleClose() {},
    takeUpload(i) {},
    takePhoto(i) {
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
        // 拍照类型：1：无,2：主摄像头,3：副摄像头
        // 要先有副摄像头并且拍照类型也是副摄像头
        if(this.picList[i].pjType == "3"){
          // 这里是副摄像头
          this.PhotoFangZheng.OpenCamera("1"); // 打开副摄像头要传参1
          this.isTakePhoto = true;
          this.clickPicListItem = this.picList[i];
          this.clickPicIndex = i;
          setTimeout(() => {
            // 如果打开弹出框之后没有连接有副摄像头的设备，则打开主摄像头
            if (!this.PhotoFangZheng.secondaryCamera) {
              this.$message.error("副摄像头设备异常，正在打开主摄像头");
              this.PhotoFangZheng.OpenCamera("0"); // 打开主摄像头要传参0
              return;
            }
          }, 3000);
        }else{
          // 其余情况都是走的主摄像头
          this.PhotoFangZheng.OpenCamera("0");
          this.isTakePhoto = true;
          this.clickPicListItem = this.picList[i];
          this.clickPicIndex = i;
          if (Number(this.clickPicListItem.accessoryNo) < 5) {
            this.xunbianShow = true;
            this.PhotoFangZheng.SetAutoCut(true);//开启自动寻边
          } else {
            this.xunbianShow = false;
            this.PhotoFangZheng.SetAutoCut(false);//默认打开的时候不寻边
          }
        }
      }else{
        if (!this.Photo.online) {
          this.$message.error("请连接高拍仪");
          return;
        }
        this.isTakePhoto = true;
        this.clickPicListItem = this.picList[i];
        this.clickPicIndex = i;
        console.log(this.clickPicListItem);
        if (this.clickPicListItem.accessoryNo == 30) {
          this.Photo.start("vSetResolution(8)"); //调整清晰度
          this.Photo.start("bStartPlayRotate(270)"); //旋转为竖
        }
        // 脸部照片 触发副摄像头
        else if (this.clickPicListItem.accessoryNo == "8") {
          this.Photo.start("bStartPlay2");
        } else {
          this.Photo.StartPlay_onclick();
        }
        setTimeout(() => {
          // 如果打开弹出框之后没有连接有正确的设备，则关闭弹出框并给出提示
          if (!this.Photo.successConnection) {
            this.$message.error("请检查设备是否连接、驱动是否正确");
            this.closeTakePhoto();//关闭弹出框跟设备
            return;
          }
        }, 3000);
        if (Number(this.clickPicListItem.accessoryNo) < 5) {
          this.xunbianShow = true;
          this.Photo.start("bSetMode(3)");
        } else {
          this.xunbianShow = false;
        }
      }
    },
    callBack(name) {
      //取消

      if (name == "取消") {
        this.isTakePhoto = false;
      } else {
        this.ruleTitle = "确定";
        this.ruleTitle1 = "取消";
      }
    },
    doPhoto(name) {
      this.ruleTitle = "提交";
      this.ruleTitle1 = "重拍";
      if (name == "提交") {
        this.isTakePhoto = false;
        this.ruleTitle = "确定";
        this.ruleTitle1 = "取消";
      }
    },
    handlePreview(file) {},
    handleOnchange(i, file) {
      //let url = URL.createObjectURL(file.raw)
      //console.log(file);

      var fileName = file.name + "";
      var regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.picList[i].url = file.url;
      }
    },
    handleExceed(files, fileList, item, i) {
      // 上传图片超过限制时 自动扩展为多张上传
      let tableItem = this.tableList[i];
      let exceedPics = [...this.picList];
      for (let j = 0; j < files.length; j++) {
        if (j == 0) {
          exceedPics[i + j] = { ...item };
        } else {
          exceedPics.splice(j + i, 0, { ...item, url: "", pics: [], id: "" });
          this.tableList.splice(j + i, 0, { ...tableItem });
        }
      }
      this.picList = [...exceedPics];
      this.$nextTick(() => {
        for (let j = 0; j < files.length; j++) {
          this.httpRequest(i + j, { file: files[j] });
        }
      });
    },
    handleProgress(event, file, fileList) {
      this.progressShow = true;
      this.$nextTick(() => {
        let percent = event.percent;
        this.percentage = percent.toFixed(2);
      });
      if (event.percent === 100) {
        setTimeout(() => {
          this.progressShow = false;
        }, 3000);
      }
    },
    delFile(id) {
      let _this = this;
      _this.$api.fetch({
        params: {
          busicode: "AccessoryDelete",
          data: id
          //要删除的文件的id
        }
      }).then(res => {
      }).catch((e) => {
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.upload-pic {
  width: 100%;
  // height: 100%;
  position: relative;
  .el-image-viewer__close {
    color: white;
    top: 50px;
    right: 50px;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }
  .el-image {
    text-align: center;
    width: 96%;
    height: 8rem;
    margin-top: 0.3rem;
  }
  .progress {
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    width: 50%;
    height: 100%;
    top: 0;
    left: 25%;
    z-index: 111;
    .el-progress {
      position: absolute;
      top: 50%;
      width: 100%;
      height: 20px;
      text-align: center;
      .el-progress-bar__outer {
        height: 10px !important;
      }
      .el-progress__text {
        font-size: 20px !important;
        margin-top: 15px;
      }
    }
  }
  .kr-upload {
    display: flex;
    .kr-pic {
      margin-left: 1rem;
      .el-button {
        padding: 0;
      }
      .kr-title {
        // padding-left:3rem;
        width: 10rem;
        text-align: center;
        // display: inline;
        font-size: 1rem;
        height: 20px;
        line-height: 20px;
      }
    }
  }
  .kr-photo {
    width: 100%;
    height: 100%;
    zoom: 1;
    &::after {
      display: block;
      content: "";
      clear: both;
    }
    .children {
      position: relative;
      text-align: center;
      float: left;
      margin: 10px;
      border: 1px solid #aaa;
      width: 220px;
      // height: calc(20% - 22px);
      height: 10rem;
      .title2 {
        color: #000;
        font-size: 0.9rem;
        text-align: center;
        height: 5rem;
        margin-top: 2rem;
      }
      .operation-btn {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }
      .operation-btn.disabledUpload {
        cursor: not-allowed;
      }
      .title1 {
        color: #000;
        font-size: 0.9rem;
        text-align: center;
        height: 7rem;
        line-height: 7rem;
      }

      .btn-group {
        text-align: center;
        position: absolute;
        bottom: 1rem;
        width: 100%;
        .el-upload-list {
          display: none;
        }
      }
    }
    .kr-img {
      width: 100%;
      height: 95%;
      text-align: center;
      margin: 0 auto;
      img {
        vertical-align: middle;
      }
      span {
        height: 100%;
        width: 0px;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .upload-file {
      display: inline-block;
      .el-upload {
        margin-top: 15%;
      }
    }
    /deep/ {
      .photo-dialog {
        .el-dialog__body {
          padding: 0;
        }
      }
    }
  }
  .kr-takePhoto {
    .photo {
      width: 100px;
      height: 100px;
      border: 1px solid red;
    }
  }
  #photo {
    // position: absolute;
    // left: 0;
  }
  .titleShow {
    width: 205px;
    margin-top: -6.7rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>

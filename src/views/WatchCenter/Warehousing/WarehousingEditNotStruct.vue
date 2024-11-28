<template>
  <div class="WarehousingEditNotStruct">
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog" append-to-body>
      <attachment-view-info v-if="viewAttachmentShow" :receiptAccessory="receiptAccessory" busicode="ReceiptAccessoryList"></attachment-view-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <el-form :inline="true" :model="formData" :rules="rules" :disabled="NotDisabled" ref="ruleForm" class="formBill" size="mini" label-width="130px">
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo"></billInfo>

      <legend class="legendColumn">注册信息</legend>

      <!--<el-form-item label="水表厂家：" prop="meterFactory" :class="{'disable-item': NotDisabled}">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.meterFactory" placeholder="" clearable></el-input>
          <span  v-else>{{formData.meterFactoryName}}</span>
        </el-form-item>-->

      <el-form-item label="水表厂家：" prop="meterFactory" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.meterFactory" placeholder="水表厂家">
          <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
        <span v-else>{{formData.meterFactoryName}}</span>
      </el-form-item>

      <el-form-item label="水表分类：" prop="meterType" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.meterType" placeholder="水表分类">
          <el-option v-for="item in dictionaryData.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.meterTypeName}}</span>
      </el-form-item>

      <el-form-item label="通讯类型：" prop="transmittalModel" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.transmittalModel" placeholder="通讯类型">
          <el-option v-for="item in dictionaryData.TPW" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.transmittalModelName}}</span>
      </el-form-item>
      <el-form-item label="是否阀控：" prop="valveControl" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" v-model="formData.valveControl" placeholder="请选择是否阀控">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
        <span v-else>{{formData.valveControlName}}</span>
      </el-form-item>
      <el-form-item label="结构类型：" prop="meterPattern" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" v-model="formData.meterPattern" placeholder="请选择结构类型">
          <el-option v-for="(item,index) in dictionaryData.MMP" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.meterPatternName}}</span>
      </el-form-item>
      <el-form-item label="采样类型：" prop="meterSensor" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" v-model="formData.meterSensor" placeholder="请选择采样类型">
          <el-option v-for="(item,index) in dictionaryData.MSS" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.meterSensorName}}</span>
      </el-form-item>
      <el-form-item label="满码值：" prop="maxValue" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model="formData.maxValue" maxlength="50" clearable placeholder="请输入满码值">
        </el-input>
        <span v-else>{{formData.maxValue}}</span>
      </el-form-item>
      <el-form-item label="使用期限：" prop="shelfLife" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" v-model.number="formData.shelfLife" maxlength="6" clearable placeholder="请输入使用期限">
        </el-input>
        <span v-else>{{formData.shelfLife}}</span>
      </el-form-item>

      <el-form-item label="新旧表：" prop="meterForm" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.meterForm" placeholder="新旧表">
          <el-option v-for="item in dictionaryData.MMF" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.meterFormName}}</span>
      </el-form-item>

      <el-form-item label="远程通讯费：" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="!NotDisabled" clearable v-model="formData.transCommFee" placeholder="远程通讯费"></el-input>
        <span v-else>{{formData.transCommFee}}</span>
      </el-form-item>

      <el-form-item label="通讯运营商：" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.commOperator" placeholder="通讯运营商">
          <el-option v-for="item in dictionaryData.TXS" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.commOperatorName}}</span>
      </el-form-item>

      <el-form-item label="通讯费开始日期：" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-if="!NotDisabled" v-model="formData.commFeeStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
        </el-date-picker>
        <span v-else>{{formData.commFeeStart}}</span>
      </el-form-item>

      <el-form-item label="通讯费结束日期：" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-if="!NotDisabled" v-model="formData.commFeeEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
        </el-date-picker>
        <span v-else>{{formData.commFeeEnd}}</span>
      </el-form-item>

      <el-button @click="addRow" class="add-line" size="mini" v-if="!NotDisabled" type="primary">添加行</el-button>

    </el-form>
    <div class="kl-table">
      <el-table highlight-current-row stripe border :data="storageQueryData.list" class="Warehousing-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="meterNo" min-width="80" label="水表编号">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.meterNo" size="mini" readonly></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="meterModel" min-width="80" label="水表型号">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.meterModel" size="mini" :readonly="NotDisabled"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="meterBore" min-width="80" label="水表口径">
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.meterBore" placeholder="水表口径" :disabled="NotDisabled">
              <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="factoryNo" min-width="80" label="水表表身号">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.factoryNo" size="mini" :readonly="NotDisabled"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="imei" min-width="80" label="IMEI">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.imei" size="mini" :readonly="NotDisabled"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="imsi" min-width="80" label="IMSI">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.imsi" size="mini" :readonly="NotDisabled"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="meterCert" min-width="120" label="合格证号">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.meterCert" size="mini" :readonly="NotDisabled"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-upload class="upload-file" multiple action="/" :http-request="uploadAttachment" style="display:inline-block;" :show-file-list="false">
              <el-button class="noclick" @click="uploadItem(scope.row)" type="text" v-if="!NotDisabled">上传附件</el-button>
            </el-upload>
            <el-button type="text" class="noclick" @click="viewAttachment(scope.row)">查看附件</el-button>
            <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row)" v-if="!NotDisabled">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <!-- 分页 -->
    <div class="block" v-if="editNeedData.saveType == 'edit'">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="storageQueryData.total">
      </el-pagination>
    </div>
    <!-- <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>-->
    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
//import uploadFile from "@/components/uploadPic"; //上传附件
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "WarehousingEditNotStruct",
  components: {
    //uploadFile,
    billInfo,
    AttachmentViewInfo
  },
  props: ['editNeedData'],
  data () {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      businessAreaData: [], //营业区域下拉框
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_in_plan",
      tempId: "",
      waterChooseType: '',
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      formData: {
        maxValue: 99999
      },
      // 水表明细数据
      storageQueryData: {
        list: []
      },
      // 数据字典
      dictionaryData: {},
      // 水表厂家下拉数据
      meterFactoryData: {},
      // 水表型号下拉数据
      meterModelData: {},
      // 营业所下拉数据
      businessOutletsData: [],
      // 水表口径
      meterBoreData: [],
      // 表单校验
      rules: {
        meterFactory: [
          { required: true, message: '请选择水表厂家', trigger: 'change' }
        ],
        meterForm: [
          { required: true, message: '请选择新旧表', trigger: 'change' }
        ],
        maxValue: [
          { required: true, message: '请输入满码值', trigger: 'maxValue' }
        ],
        meterType: [
          { required: true, message: '请选择水表分类', trigger: 'change' }
        ],
        transmittalModel: [
          { required: true, message: '请选择通讯类型', trigger: 'change' }
        ]
      },
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      flag: false,
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
      attachmentData: [],
      uploadMeterNo: '',//上传附件 水表编号
      // 分页数据
      tableQuery: {
        page: 1,
        pageCount: 20,
      },
      // 暂存的所有数据集合
      allStorageQueryData: {
        list: [],
      },
      hasAddNewRow: false, // 是否添加行
    };
  },
  mounted () {
    //草稿、登記
    if (
      this.editNeedData.processState == "END" || //完结
      this.editNeedData.processState == "CANCEL" || //终止
      this.editNeedData.processState == "approval" //进行中-审批
    ) {
      this.NotDisabled = true;
      this.approveFlag = 1;
    } else {
      //进行中-登记、草稿、回填
      if (
        this.editNeedData.processState == "" || //草稿
        this.editNeedData.processState == "register" //登记
      ) {
        this.NotDisabled = false;
        this.approveFlag = 0;
      }
    }
    if (this.editNeedData.id) {
      // 列表信息数据
      this.getFormData();
    } else {
      this.getHtmlData();
      this.tempId = this.util.generateUUID()
    }
    this.getDictionary()
    this.getMeterFactory()
    // this.selectBAreaOptions()
    this.getMeterBore()
    // 接收xls文件里的数据
    eventBus.$on('storageQueryData', (res) => {
      for (let i = 0; i < res.length; i++) {
        _this.storageQueryData.list.push(res[i])
      }
    })
  },
  methods: {
    //营业区域
    selectBAreaOptions (id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res)
        _this.businessAreaData = data.children;
      })
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
    // 上半部数据
    getFormData () {
      let _this = this;
      let params = {
        busicode: "MsStorageList",
        data: {
          id: _this.editNeedData.id
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.formData = res.list[0]
        this.getBillData(res.list[0]);
        _this.getMsStorageQuery()
        //审批界面接口
        _this.getHtmlData();

      })
    },
    // 水表厂家下拉数据
    getMeterFactory () {
      //debugger;
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 9999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res
      })
    },

    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.getMsStorageQueryPaging();
    },
    handleCurrentChange (val) {  //页码点击
      this.tableQuery.page = val;
      this.getMsStorageQueryPaging();
    },
    // 获取水表明细（表格）
    getMsStorageQuery () {
      let _this = this;
      let params = {
        busicode: "MsStorageQuery",
        data: {
          //   page: this.tableQuery.page,
          //   pageCount: this.tableQuery.pageCount,
          page: 1,
          pageCount: 99999, // 获取到全部数据
          receiptId: this.editNeedData.id
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.allStorageQueryData = res;
        let resTemp = JSON.parse(JSON.stringify(res))
        let startIndex = (_this.tableQuery.page - 1) * _this.tableQuery.pageCount;
        resTemp.list = resTemp.list.slice(startIndex, startIndex + _this.tableQuery.pageCount)
        _this.storageQueryData = resTemp;
        // _this.storageQueryData = res
      })
    },

    // 前端实现分页
    getMsStorageQueryPaging () {
      let startIndex = (this.tableQuery.page - 1) * this.tableQuery.pageCount;
      this.storageQueryData.list = this.allStorageQueryData.list.slice(startIndex, startIndex + this.tableQuery.pageCount);
    },

    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      //进行中-登记、草稿、回填
      if (
        res.processState == "" || //草稿
        res.processState == "register" //登记
      ) {
        this.NotDisabled = false;
        this.approveFlag = 0;
      }
      if (
        res.processState == "END" || //完结
        res.processState == "CANCEL" || //终止
        res.processState == "approval" //进行中-审批
      ) {
        this.NotDisabled = true;
        this.approveFlag = 1;
      }
      this.$refs.billInfo.init(this.billData);
    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_in_plan",
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
    // 数据字典（查询框）
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMF,MMT,TXS,TPW,XXGY,MMP,MSS"//水表形态、水表制式、远程通讯商、通讯类型、下行规约、结构类型、采样类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
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


    // 营业所下拉数据
    getBusinessOutlets () {
      var _this = this
      var params = {
        "busicode": "ServAreaOpList",
        "data": {}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.businessOutletsData = res
      })
    },
    // 添加行
    addRow () {
      this.storageQueryData.list.push({ id: 'time' + Date.parse(new Date()) }); // 添加id用于前端区分数据
      this.hasAddNewRow = true;
      console.log('add storageQueryData', this.storageQueryData)
    },
    // 删除行
    deleteRow (index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log('allStorageQueryData', this.allStorageQueryData)
          for (let i = 0; i < this.allStorageQueryData.list.length; i++) {
            if (this.allStorageQueryData.list[i].id == this.storageQueryData.list[index].id) {
              console.log(this.allStorageQueryData.list[i].id)
              this.allStorageQueryData.list.splice(i, 1);
              break;
            }
          }
          this.storageQueryData.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch((e) => {
          console.log('delete err', e)
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 流程提交公共方法需要的数据
    getFormbData () {
      let _this = this
      var saveData = {
        // 上半部分输入框数据
        // id
        id: _this.formData.id,
        // // 水表型号
        // meterModel: _this.formData.meterModel,
        // // // 水表口径
        // meterBore: _this.formData.meterBore,
        // 水表厂家
        meterFactory: _this.formData.meterFactory,
        // 结构类型
        meterPattern: _this.formData.meterPattern,
        // 水表分类
        meterType: _this.formData.meterType,

        //通讯类型
        transmittalModel: _this.formData.transmittalModel,
        // 是否阀控
        valveControl: _this.formData.valveControl,
        // 是否远传
        // transmission: _this.formData.transmission,
        // 下行规约
        protocol: _this.formData.protocol,
        // 采样类型
        meterSensor: _this.formData.meterSensor,
        // 满码值
        maxValue: _this.formData.maxValue,
        //使用期限
        shelfLife: _this.formData.shelfLife,
        // 新旧表
        meterForm: _this.formData.meterForm,
        // 营业所
        departBelong: _this.common.handleTreeData(_this.formData.departBelong),
        // 远程通讯费
        transCommFee: _this.formData.transCommFee,
        // 通讯运营商
        commOperator: _this.formData.commOperator,
        // 通讯费开始日期
        commFeeStart: _this.formData.commFeeStart,
        // 通讯费开始日期
        commFeeEnd: _this.formData.commFeeEnd,
        //附件临时ID
        tempId: _this.tempId,
        //列表数据
        msInfoPlanDetail: [],
      }

      if (this.editNeedData.saveType == 'edit') {
        this.allStorageQueryData.list.forEach(item => {
          saveData.msInfoPlanDetail.push({
            id: item.id.indexOf('time') == -1 ? item.id : '', // 去除前端添加的id
            // 水表编号
            meterNo: item.meterNo,
            // 水表型号
            meterModel: item.meterModel,
            // // 水表口径
            meterBore: item.meterBore,
            // 水表表身号
            factoryNo: item.factoryNo,
            // 合格证号
            meterCert: item.meterCert,
            //IMEI
            imei: item.imei,
            //IMSI
            imsi: item.imsi,
          })
        })
      }

      this.storageQueryData.list.forEach(item => {
        if (this.editNeedData.saveType != 'edit') {
          saveData.msInfoPlanDetail.push({
            // 水表编号
            meterNo: item.meterNo,
            // 水表型号
            meterModel: item.meterModel,
            // // 水表口径
            meterBore: item.meterBore,
            // 水表表身号
            factoryNo: item.factoryNo,
            // 合格证号
            meterCert: item.meterCert,
            //IMEI
            imei: item.imei,
            //IMSI
            imsi: item.imsi,
          })
        }
      });
      return saveData
    },
    // 暂存按钮（添加/修改）
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // 水表列表必填校验
          if (this.storageQueryData.list.length <= 0) {
            this.$message.error('请添加水表！')
            return
          }
          var params = {
            "busicode": this.editNeedData.busicode,
            "data": this.getFormbData()
          }
          console.log(params)
          //   return;
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$notify({
              title: '成功',
              message: this.editNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            this.$parent.closeDialog()
          })
        } else {
          return false;
        }
      });
    },

    // 下载模板按钮
    exportExcel () {
      var params = {
        busicode: "MsStorageNotStructExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    uploadItem (row) {
      this.uploadMeterNo = row.meterNo
    },
    //上传附件
    uploadAttachment (file, fileList) {
      let _this = this;
      // console.log(file)
      // const isJPG = file.file.type === 'image/jpg';
      // const isPNG = file.file.type === 'image/png';
      // if (!isJPG&&!isPNG) {
      //   this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
      //   return
      // }
      var receiptId = ""
      if (this.editNeedData.id) {
        receiptId = this.editNeedData.id
      } else
        receiptId = this.tempId
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: receiptId,
          receiptType: "ms_in_plan",
          accessoryNo: "000",
          file: file.file,
          meterNo: this.uploadMeterNo
        },
        //token: "krrjdev123", //
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
    // 查看附件按钮
    viewAttachment (row) {
      var receiptId = ""
      if (this.editNeedData.id) {
        receiptId = this.editNeedData.id
      } else
        receiptId = this.tempId
      this.receiptAccessory = {
        receiptType: "ms_in_plan",
        receiptId: receiptId,
        meterNo: row.meterNo
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog () {
      this.viewAttachmentShow = false;
    },
    indexMethod (index) {
      //获取表格序号
      return (index + 1);
    },
  },
  watch: {
    'allStorageQueryData.list': {
      handler (newVal, oldVal) {
        this.allStorageQueryData.total = this.allStorageQueryData.list.length;
        this.storageQueryData.total = this.allStorageQueryData.total;
        let startIndex = (this.tableQuery.page - 1) * this.tableQuery.pageCount;
        this.storageQueryData.list = this.allStorageQueryData.list.slice(startIndex, startIndex + this.tableQuery.pageCount);
      },
    },
    'storageQueryData': {
      handler (newVal, oldVal) {
        for (let i = 0; i < this.storageQueryData.list.length; i++) {
          if (this.storageQueryData.list[i].id == this.allStorageQueryData.list[i].id) {
            this.allStorageQueryData.list[i] = this.storageQueryData.list[i];
          }
        }
        if (this.hasAddNewRow) { // 新增一行数据
          this.allStorageQueryData.list.push(this.storageQueryData.list[this.storageQueryData.list.length - 1]);
          this.hasAddNewRow = false;
          this.handleCurrentChange(Math.ceil(this.allStorageQueryData.total / this.tableQuery.pageCount)) // 跳转至最后一页
        }
      },
      deep: true,
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.WarehousingEditNotStruct {
  height: 100%;
  overflow-y: auto;
  .add-line {
    float: right;
    margin-right: 20px;
    margin-bottom: 5px;
  }
  .el-upload-list {
    display: none;
  }
  .el-table__body-wrapper td {
    height: 28px;
    line-height: 28px;
  }
  .el-select {
    /deep/ {
      .el-input__suffix {
        .el-input__icon {
          line-height: 30px;
        }
      }
    }
  }
}
</style>


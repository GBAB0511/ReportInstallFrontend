<template>
  <div class="wMeterNotStructEditAdd">
    <!-- 弹出表单选择水表 -->
    <el-dialog title="选择水表" v-if="waterChooseVisible" :visible.sync="waterChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialog" append-to-body>
      <SelectWaterTable ref="SelectWaterTable" :disabledData="disabledData" :waterChooseType='waterChooseType' :formType='formType'></SelectWaterTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-form size="mini" :rules="rules" ref="ruleForms" :disabled="NotDisabled" :inline="true" :model="formData" class="formBill" label-width="130px">
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo"></billInfo>

      <legend class="legendColumn">变更信息</legend>
      <el-form-item class="f2" label="变更原因：" prop="comments">
        <el-input type="textarea" :rows="2" v-model="formData.comments" placeholder="请输入变更原因"></el-input>
      </el-form-item>

      <el-tabs type="border-card" class="tabsBlock" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="水表修改" name="1" :key="'updatewmeter'">
          <span slot="label">
            <i class="el-icon-user"></i> 水表修改
          </span>
          <el-button size="mini" v-if="!NotDisabled" class="fontRight" type="primary" @click="chooseWaterMeter">选择水表</el-button>

          <div class="kl-table">
            <el-table highlight-current-row stripe border :data="updateTabelDate" class="water-meter-inquiry-table">

              <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="meterNo" min-width="150" label="水表编号">
              </el-table-column>
              <el-table-column prop="factoryNo" min-width="100" label="表身码">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.factoryNo" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="meterBore" min-width="100" label="水表口径">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterBore" placeholder="水表口径">
                    <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="meterFactory" min-width="100" label="水表厂家">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterFactory" placeholder="水表厂家" @change="getMeterModel1(scope.row)">
                    <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="meterModelName" min-width="120" label="水表型号">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterModel" placeholder="水表型号" @click.native="getWaterMeterData(scope.row)" @change="(value) => getWaterMeterDetailData(value,scope.row)">
                    <el-option v-for="item in scope.row.meterModelData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="sim" min-width="100" label="SIM卡">
              </el-table-column>

              <el-table-column prop="imei" min-width="100" label="imei号">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.imei" size="mini"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="imsi" min-width="100" label="imsi号">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.imsi" size="mini"></el-input>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="userNo" min-width="150" label="用户编号">
              </el-table-column>

              <el-table-column prop="factoryNo" min-width="100" label="水表表身号">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.factoryNo" size="mini"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="meterModel" min-width="120" label="水表型号">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.meterModel" size="mini"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="meterBore" min-width="100" label="水表口径">
                 <template slot-scope="scope">
                   <el-select  clearable v-model="scope.row.meterBore" placeholder="水表口径" >
                  <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
                </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="meterFactory" min-width="100" label="水表厂家">
                  <template slot-scope="scope">
                    <el-select clearable v-model="scope.row.meterFactory" placeholder="水表厂家">
                    <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                  </template>
              </el-table-column>
              <el-table-column prop="meterType" min-width="100" label="水表分类">
                 <template slot-scope="scope">
                    <el-select clearable v-model="scope.row.meterType" placeholder="水表分类">
                      <el-option v-for="(item,index) in dictionaryData.MMT" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                   </template>
              </el-table-column>
              <el-table-column prop="valveControl" min-width="120" label="是否阀控">
                <template slot-scope="scope">
                   <el-select clearable v-model="scope.row.valveControl" placeholder="请选择是否阀控">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <!-- <el-table-column prop="transmission" min-width="120" label="是否远传">
                <template slot-scope="scope">
                   <el-select clearable v-model="scope.row.transmission" placeholder="请选择是否阀控">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="protocol" min-width="100" label="下行规约">
                 <template slot-scope="scope">
                   <el-select  clearable v-model="scope.row.protocol" placeholder="请选择下行规约">
                    <el-option v-for="(item,index) in dictionaryData.XXGY" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                  </template>
              </el-table-column> -->

              <!-- <el-table-column prop="meterPattern" min-width="100" label="水表型式">
                <template slot-scope="scope">
                   <el-select  clearable v-model="scope.row.meterPattern" placeholder="请选择水表型式">
                    <el-option v-for="(item,index) in dictionaryData.MMP" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="meterSensor" min-width="100" label="水表传感器">
                  <template slot-scope="scope">
                       <el-select clearable  v-model="scope.row.meterSensor" placeholder="请选择水表传感器">
                        <el-option v-for="(item,index) in dictionaryData.MSS" :key="index" :label="item.name" :value="item.value"></el-option>
                      </el-select>
                  </template>
              </el-table-column>
              <el-table-column prop="maxValue" min-width="120" label="满码值">
                  <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.maxValue" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="shelfLife" min-width="120" label="使用期限">
                   <template slot-scope="scope">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.shelfLife" size="mini"></el-input>
                  </template>
              </el-table-column> -->
              <!-- <el-table-column prop="meterBore" min-width="100" label="水表口径">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterBore" placeholder="水表口径">
                    <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="meterFactory" min-width="100" label="水表厂家">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterFactory" placeholder="水表厂家">
                    <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="transmittalModel" min-width="100" label="传输方式">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.transmittalModel" placeholder="传输方式">
                    <el-option v-for="item in dictionaryData.TPW" :key="item.id" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="meterType" min-width="120" label="水表分类">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterType" placeholder="水表分类">
                    <el-option v-for="(item,index) in dictionaryData.MMT" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column> -->

              <!-- <el-table-column prop="meterForm" min-width="120" label="新旧表">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterForm" placeholder="新旧表">
                    <el-option v-for="item in dictionaryData.MMF" :key="item.id" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column> -->

              <el-table-column prop="meterCert" min-width="100" label="合格证号">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.meterCert" size="mini"></el-input>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="meterStatus" min-width="120" label="水表状态">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.meterStatus" placeholder="水表状态">
                    <el-option v-for="(item,index) in dictionaryData.MMS" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="departBelong" min-width="100" label="所属部门">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.departBelong" placeholder="所属部门">
                    <el-option v-for="(item,index) in departBelongOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column> -->

              <el-table-column v-if="!NotDisabled" label="操作" fixed="right" width="80">
                <template slot-scope="scope">
                  <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row,'update')">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>

        </el-tab-pane>
        <el-tab-pane label="水表删除" name="2">
          <span slot="label">
            <i class="el-icon-user"></i> 水表删除
          </span>
          <el-button class="fontRight" v-if="!NotDisabled" size="mini" type="primary" @click="chooseWaterMeter">选择水表</el-button>
          <div class="kl-table">
            <el-table highlight-current-row stripe border :data="deleteTabelDate" class="water-meter-inquiry-table">

              <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="meterNo" min-width="150" label="水表编号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="150" label="用户编号">
              </el-table-column>

              <el-table-column prop="factoryNo" min-width="100" label="水表表身号">
              </el-table-column>

              <el-table-column prop="meterBoreName" min-width="100" label="水表口径">
              </el-table-column>

              <el-table-column prop="meterFactoryName" min-width="100" label="水表厂家">
              </el-table-column>

              <el-table-column prop="meterFormName" min-width="120" label="新旧表">
              </el-table-column>

              <el-table-column prop="meterTypeName" min-width="120" label="水表制式">
              </el-table-column>

              <el-table-column prop="meterModelName" min-width="120" label="水表型号">
              </el-table-column>

              <el-table-column prop="meterCert" min-width="100" label="合格证号">
              </el-table-column>

              <el-table-column prop="meterStatusName" min-width="120" label="水表状态">
              </el-table-column>

              <el-table-column prop="departBelongName" min-width="100" label="所属部门">
              </el-table-column>

              <el-table-column v-if="!NotDisabled" label="操作" fixed="right" width="80">
                <template slot-scope="scope">
                  <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row,'delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-form>
    <legend class="legendColumn">上传附件
      <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
    </legend>
    <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import SelectWaterTable from "@/components/SelectWaterTable";
import axios from 'axios'
export default {
  name: "wMeterNotStructEditAdd",
  props: ["editNeedData"],
  components: {
    uploadFile,
    SelectWaterTable,
    billInfo,
  },
  data () {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_info_change",
      tempId: "",
      activeName: '1',
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //选择水表
      waterChooseVisible: false,
      //选择水表 弹框类型
      formType: 'wMeterEdit',
      //选择水表 选择数据获取类型
      waterChooseType: 'wMeter',
      formData: {
        msInfos: [],
        id: '',
        comments: '',
      },
      formDataClear: {
        msInfos: [],
        id: '',
        comments: '',
      },
      formDataVal: {
        "meterNo": '',//"水表编号",
        "factoryNo": '',//"水表表身号",
        "meterBore": '',//"水表口径",
        "meterFactory": '',//"水表厂家",
        "transmittalModel": '',//"传输方式",
        "meterForm": '',//"新旧表",
        "meterType": '',//"水表制式",
        "meterModel": '',//"水表型号",
        "meterCert": '',//"合格证号",
        "meterStatus": '',//"水表状态",
        "departBelong": '',//"所属部门",
        "operateType": '1',//操作类型 1 修改 2 删除
        "meterPattern": '',//水表型式
        "valveControl": null,//是否阀控
        // "transmission":null,//是否远传
        "protocol": '',//下行规约
        "meterSensor": '',//水表传感器
        "maxValue": '',//满码值
        "shelfLife": '', //使用期限
        "imsi": '',
        "imei": ''
      },
      rules: {
        comments: [
          { required: true, message: '请输入变更原因', trigger: 'change' }
        ],
      },
      updateTabelDate: [],
      deleteTabelDate: [],
      dictionaryData: [],
      meterFactoryData: [],
      meterModelData: [],
      departBelongOptions: [],
      meterBoreData: [],
      // 水表修改/水表删除
      tabsLabel: '水表修改',
      // 选择水表弹出框需要禁用选择的数据
      disabledData: [],
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
    if (this.editNeedData.saveType == 'edit') {
      this.init();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      this.tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', this.tempId)
      this.getHtmlData()
    }
    this.getMeterBore();
    this.getMeterFactory();
    this.getMeterModel1()
    this.getDictionary()
    this.getDepartBelong()

  },
  methods: {
    init () {
      var params = {
        "busicode": "WmChgQuery",
        "data": this.editNeedData.id
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.formData = res;
        if (this.formData.msInfos.length > 0) {
          this.formData.msInfos.forEach((item, index) => {
            if (this.formData.msInfos[index].operateType == '1') {
              this.updateTabelDate.push(this.formData.msInfos[index])
            } else {
              this.deleteTabelDate.push(this.formData.msInfos[index])
            }
          })
        }
        // 进入初始化时显示的是抄表修改的列表，所以默认选择水表禁用数据为抄表修改的数据
        this.disabledData = this.updateTabelDate
        this.getHtmlData()
        this.getBillData(res)
      })
    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_info_change",
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
    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 水表厂家下拉数据
    getMeterFactory () {
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res
        console.log(_this.meterFactoryData)
      })
    },
    getWaterMeterData (row) {
      this.meterModelData = []
      axios({
        method: 'post',
        url: 'interface.api',
        withCredentials: true,
        timeout: 0,
        hideLoading: true,
        data: {
          busicode: 'WaterMeModelOpList',
          token: sessionStorage.getItem('token'),
          sysType: "002",
          data: {
            factoryId: row.meterFactory,
          }
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": sessionStorage.getItem('token')
        },
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.code == 0) {
            this.meterModelData = res.data.data
          }
        }


      }).catch(() => {

      })
    },
    // 水表型号变更，获取新的水表信息
    async getWaterMeterDetailData(val,row){
        try {
            // 水表型号查出的信息
        const resData = await this.$api.fetch({
          params: { busicode: "MeterModelQuery", data: {  id: val }},
        })
        row = Object.assign( row, resData)
        row.meterFactoryName = resData.factoryName
        row.meterFactory = resData.factoryId
        row.meterType = resData.meterType
        row.meterPattern = resData.meterForm
        row.transmittalModel = resData.transWay
        row.valveControl = resData.valveControl
        row.protocol = resData.protocol
        row.meterSensor = resData.meterSensor
        row.maxValue = resData.maxValue
        row.shelfLife = resData.shelfLife
        row.meterBore = resData.meterBore
      }catch(e) {
        console.log(e)
      }
    },
    // 数据字典（查询框）
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT,MMS,TXS,MMF,TPW,XXGY,MMP,MSS"//水表制式、水表状态、远程通讯商新旧表、传输方式、下行规约、水表型式、水表传感器
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 所属部门下拉数据
    getDepartBelong () {
      var _this = this
      var params = {
        "busicode": "ServAreaOpList",
        "data": {}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.departBelongOptions = res
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
        console.log(res)
        _this.meterBoreData = res.list
      })
    },
    // 水表型号下拉数据
    // getMeterModel() {
    //   var _this = this
    //   var params = {
    //     "busicode": "WaterMeModelOpList",
    //     "data": {}
    //   }
    //   this.$api.fetch({
    //     params: params,//参数
    //   }).then(res => {
    //     _this.meterModelData = res
    //   })
    // },
    getMeterModel1 (row) {
      row.meterModel = ''
      row.meterModelName = ''
      let factoryId = row.meterFactory
      var _this = this
      var params = {
        "busicode": "WaterMeModelOpList",
        "data": {
          factoryId
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterModelData = res
        // row.meterModelData = res
        this.$set(row, 'meterModelData', res)
      })
    },

    handleClick (tab, event) {
      this.tabsLabel = tab.label
      if (this.tabsLabel == '水表修改') {
        this.disabledData = this.deleteTabelDate
      } else if (this.tabsLabel == '水表删除') {
        this.disabledData = this.updateTabelDate
      }
    },
    chooseWaterMeter () {
      this.waterChooseVisible = true;
    },
    closeDialog () {
      //关闭会话
      this.$refs.SelectWaterTable.selectData = []
      this.waterChooseVisible = false;
    },
    //弹出框 提交
    submit () {
      if (this.activeName == '1') {
        // this.updateTabelDate = this.$refs.SelectWaterTable.selectData;
        const selectData = this.$refs.SelectWaterTable.selectData;
        this.updateTabelDate = selectData

        this.getMeterData(selectData)
        this.disabledData = this.deleteTabelDate
      } else {
        this.deleteTabelDate = this.$refs.SelectWaterTable.selectData
        this.disabledData = this.updateTabelDate
      }
      this.closeDialog()
    },
    async getMeterData (data) {
      if (data && data.length > 0) {
        this.updateTabelDate = [];
        data.forEach(async item => {
          try {
            // 水表型号查出的信息
            const resData = await this.$api.fetch({
              params: { busicode: "MeterModelQuery", data: { id: item.meterModel } },
            })
            if (resData.factoryId) {
              resData.meterModelData = await this.$api.fetch({
                params: { busicode: "WaterMeModelOpList", data: { factoryId: resData.factoryId } },
              })
              console.log(resData.meterModelData);
            } else {
              if (resData) {
                resData.meterModelData = []
              }
            }
            let tableData = Object.assign({}, item, resData)
            tableData.meterForm = item.meterForm
            tableData.meterFormName = item.meterFormName
            this.updateTabelDate.push(tableData)
          } catch (e) {
            console.log(e)
          }
        })
      }
    //   debugger
          console.log('updateTabelDate', this.updateTabelDate)

    },
    indexMethod (index) {
      return (index + 1);
    },
    // 删除行
    deleteRow (index, row, type) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == 'update') {
            this.updateTabelDate.splice(index, 1);
          } else {
            this.deleteTabelDate.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getFormbData () {
      let val = this.formData
      val.msInfos = []
      if (this.updateTabelDate.length > 0) {
        this.updateTabelDate.forEach((item, index) => {
          this.updateTabelDate[index].operateType = '1'
          val.msInfos.push(this.updateTabelDate[index])
        })
      }
      if (this.deleteTabelDate.length > 0) {
        this.deleteTabelDate.forEach((item, index) => {
          this.deleteTabelDate[index].operateType = '2'
          val.msInfos.push(this.deleteTabelDate[index])
        })
      }
      val = this.common.handleData(val, this.formDataClear)
      val.tempId = this.tempId
      val.msInfos.forEach(res => {
        if (res.meterModelName) {
          res.meterModel = res.meterModelName
        }
      })
      val.msInfos = this.common.handleData(val.msInfos, this.formDataVal)
      return val;
    },
    // 暂存按钮（添加/修改）
    save () {
      this.$refs['ruleForms'].validate((valid) => {
        if (valid) {
          var _this = this
          var params = {
            "busicode": this.editNeedData.busicode,
            "data": this.getFormbData(),
          }
          if (params.data.msInfos.length < 1) {
            this.$message({
              type: "warning",
              message: "请先选择水表！"
            });
            return
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$notify({
              title: '成功',
              message: params.busicode == 'MsChgAdd' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            _this.$parent.closeDialog()
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
  }
};
</script>
<style lang="scss">
.wMeterNotStructEditAdd {
  height: 100%;
  overflow-y: auto;
  .tabsBlock {
    height: calc(100% - 250px);
    margin: 5px;
    .el-tabs__header {
      margin: 0 0 5px;
    }
    .el-tabs--border-card {
      border: 1px solid #eaf4ff;
    }
    .el-tabs__content {
      padding: 5px;
      height: calc(100% - 60px);
      .idCard {
        border: 0px;
      }
      .el-tab-pane {
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>

<template>
  <div class="ChangeTablesHandle">
        <!-- 弹出表单选择集中器 -->
     <el-dialog v-if="openConcentratorDialog" title="集中器" :close-on-click-modal="false" append-to-body :visible.sync="openConcentratorDialog" class="button-dialog" @close="closeConcentratorDialog">
            <concentratorInfo :concentratorQuery="concentratorQuery" ref="concentratorInfoList"></concentratorInfo>
       <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
       <el-button type="info" size="mini" plain @click="openConcentratorDialog = false">取 消</el-button>
     </div>
       </el-dialog>
    <!-- 弹出表单选择水表 -->
    <el-dialog title="水表选择" v-if="waterChooseVisible" :visible.sync="waterChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <SelectWaterTable ref="SelectWaterTable" :waterChooseType='waterChooseType' :isFuzzyQuery='isFuzzyQuery' :selectDataLength.sync="selectDataLength" :formType='formType'></SelectWaterTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogSelectWater"  :disabled="!selectDataLength">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出表单查看附件 -->
    <el-dialog title="查看附件" :visible.sync="ViewAttachmentVisible" v-if="ViewAttachmentVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <viewAttachment ref="viewAttachment" :viewAttaParams='viewAttaParams'></viewAttachment>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater">关 闭</el-button>
      </div>
    </el-dialog>

    <el-form :model="formData" ref="billForm" class="formBill" :rules="rules" :inline="true" :disabled="NotDisabled" size="mini" label-width="130px">
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.saveType=='edit'" ref="billInfo"></billInfo>

      <legend class="legendColumn">换表信息</legend>
      <el-form-item label="换表类型：" v-if='NotDisabled' class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.replaceTypeName" size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="换表类型：" v-else prop="replaceType">
        <el-select clearable v-model="formData.replaceType" placeholder="换表类型">
          <el-option v-for="item in dictionaryData.MCM" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划完成日期：" v-if='NotDisabled' class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.planFinishDate" size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="计划完成日期：" v-else prop="planFinishDate">
        <el-date-picker v-model="formData.planFinishDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='换表员：' v-if='NotDisabled' class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.replaceStaffName" size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="换表员：" v-else prop="replaceStaff">
        <el-select v-model="formData.replaceStaff" multiple placeholder="请选择">
          <span slot="prefix">{{replaceStaffName}}</span>
          <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="换表原因：" class="f2" prop="replaceReason" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" :rows="2" v-model="formData.replaceReason" placeholder="换表原因"></el-input>
        <span v-else>{{formData.replaceReason}}</span>
      </el-form-item>
      <el-form-item label="水表数量：" v-if="editNeedData.processState != ''&& editNeedData.processState != 'register' " :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.meterAmount" disabled size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="已回填数量：" v-if="editNeedData.processState != '' && editNeedData.processState != 'register' " :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.backfillAmount" disabled size="mini" placeholder class="read-only"></el-input>
      </el-form-item>
    </el-form>
    <legend class="legendColumn" v-if="editNeedData.processState != '' && editNeedData.processState != 'register' ">回填信息</legend>
    <div :class="{ backfillContent:isActive , backfillContentNone:!isActive}">
      <div :class="{ submitEditLeft:isActive , submitEditLeftNone:!isActive}">
        <div class="submit_edit_left_msg">
          <div class="msg_content">
            <span class="msg_title">用户编号：</span>
            <span class="msg_main_content">{{activeData.userNo}}</span>
          </div>

          <div class="msg_content">
            <span class="msg_title">客户名称：</span>
            <span class="msg_main_content">{{activeData.ctmName}}</span>
          </div> 

          <div class="msg_content">
            <span class="msg_title">旧水表表身号：</span>
            <span class="msg_main_content" style="width:65%">{{activeData.oldFactoryNo}}</span>
          </div>

          <div class="msg_content">
            <span class="msg_title">装表地址：</span>
            <span class="msg_main_content">{{activeData.setupMeterAddr}}</span>
          </div>
          <div class="msg_content">
            <span class="msg_title">水表口径：</span>
            <span class="msg_main_content">{{activeData.oldMeterBore}}</span>
          </div>

          <div class="msg_content">
            <span class="msg_title">上期抄码：</span>
            <span class="msg_main_content">{{activeData.upperNum}}</span>
          </div>
        </div>
        <div class="submit_edit_left_content">
          <el-form size="mini" :inline="true" class="formBill-One" label-width="100px" :model="activeData" ref="leftForm" :rules="rules1">
            <el-form-item label="换表日期：" prop="replaceDate">
              <el-date-picker v-model="activeData.replaceDate" size="mini" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>

            <el-form-item label="换表员：" size="mini" prop="replaceStaff">
              <el-select v-model="activeData.replaceStaff" multiple placeholder="请选择">
                <span slot="prefix">{{activeReplaceStaffName}}</span>
                <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="集中器：" size="mini" prop="concentratorNo">
              <!-- <el-select v-model="activeData.concentratorNo" placeholder="请选择">
                <el-option v-for="item in concentratorData" :key="item.code" :label="item.modelName" :value="item.code"></el-option>
              </el-select> -->
           <el-input
            size="mini"
            v-model="activeData.concentratorNo"
            @change="(val) => getConcentratorNo(val, item)"
          >
            <el-button slot="append" type="primary" size='mini' @click="openConcentratorOption">添加</el-button>
          </el-input>
            </el-form-item>

           <!-- <el-form-item label="新表水表编号：" prop="newMeterNo">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.newMeterNo" size="mini" @focus="chooseWaterMeter('chooseNewMater')"></el-input>
            </el-form-item> -->

            <el-form-item label="新表表身码：" prop="newFactoryNo">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.newFactoryNo" size="mini" @focus="chooseWaterMeter('chooseNewMater')"></el-input>
            </el-form-item>

            <el-form-item label="新表起码：" prop="newMeterNum">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.newMeterNum" size="mini" type="Number"></el-input>
            </el-form-item>

            <el-form-item label="旧表底码：" prop="oldMeterNum">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.oldMeterNum" size="mini" @blur="blurTest('old')" type="Number"></el-input>
            </el-form-item>

            <el-form-item label="余量：" prop="margin">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.margin" disabled size="mini" readonly="readonly" clearable></el-input>
            </el-form-item>

            <el-form-item label="旧表处理方式：" size="mini" prop="oldHandleWay">
              <el-select v-model="activeData.oldHandleWay" placeholder="请选择">
                <el-option v-for="item in dictionaryData.OMD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注：" prop="comments">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.comments" size="mini" clearable></el-input>
            </el-form-item>

            <div class="DataEntry-button">
              <el-upload class="upload-file" multiple action="/" :http-request="uploadAttachment" :show-file-list="false">
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button size="mini" @click="submit" type="primary">保存</el-button>
            </div>
          </el-form>
        </div>
      </div>

      <div :class="{ submitEditRight:isActive , submitEditRightNone:!isActive}">
        <div class="toolbar" v-if="editNeedData.processState != '' && editNeedData.processState != 'register' ">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="search-input">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="请输入用户编号"></el-input>
            </el-form-item>
            <el-form-item class="search-input">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.oldMeterNo" placeholder="请输入水表编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="searchBtn" @click="getTableData" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">

          <el-button size="mini" type="primary" @click="chooseWaterMeter('chooseOldMeter')" class="select-btn" v-if="!NotDisabled">选择水表</el-button>

          <el-table stripe highlight-current-row border :max-height="630" :data="tableData.list" :row-class-name="rowClassName" ref="klTableData" @row-click="rowClick">
            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

            <el-table-column prop="userNo" min-width="120" label="用户编号" show-overflow-tooltip></el-table-column>

            <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>

            <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip></el-table-column>

            <el-table-column prop="oldMeterNo" min-width="120" label="水表编号" show-overflow-tooltip></el-table-column>

             <el-table-column prop="oldMeterBore" min-width="80" label="水表口径"></el-table-column> 

            <el-table-column min-width="80" prop="upperNum" label="上期抄码" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="80" prop="oldMeterNum" label="旧表底码" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="80" prop="newMeterNum" label="新表起码" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="140" prop="setupMeterDate" label="装表日期"></el-table-column>

            <el-table-column min-width="140" prop="replaceDate" label="换表日期"></el-table-column>

            <el-table-column min-width="120" prop="oldHandleWayName" label="旧表处理方式" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="80" prop="margin" label="余量" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="150" prop="comments" label="备注" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">
                <el-button type="text" v-if="editNeedData.processState != ''" @click="getViewAttachment(scope.$index,scope.row)">查看附件</el-button>
                <el-button type="text" v-if="editNeedData.processState == ''||editNeedData.processState == 'register' " @click="deleteRow(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div>
      <legend class="legendColumn">上传附件
        <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
      </legend>
      <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </div>
  </div>
</template>
<script>
import concentratorInfo from '@/components/concentratorInfo'//选择集中器
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import SelectWaterTable from "@/components/SelectWaterTable";//选择水表
import viewAttachment from "@/components/viewAttachment";//查看附件
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "ChangeTablesHandle",
  components: {
    billInfo,
    SelectWaterTable,//选择水表
    viewAttachment,//查看附件
    uploadFile,
    concentratorInfo
  },
  props: ["editNeedData"],
  data() {
    return {
       selectDataLength:0,
      concentratorQuery:{},
      openConcentratorDialog:false,
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "ms_chg_plan#1",
      tempId:"",
      concentratorData:[],
      // 查看附件
      ViewAttachmentVisible: false,
      // 查看附件 data
      viewAttaParams: [],
      //选择水表
      waterChooseVisible: false,
      //选择水表 弹框类型
      formType: 'ChangeTablesHandle',
      //选择水表 选择数据获取类型
      waterChooseType: '',
      //表单是否可以修改
      NotDisabled: false,
      // 是否需要保存
      approveFlag: 0,
      //是否可显示回填表单
      isActive: true,
      formDataIndex: 0,//修改表单索引号
      // 数据字典
      dictionaryData: {},
      tableQuery: {
        receiptId: this.editNeedData.id,
        fuzzyQuery: "",
        oldMeterNo: "",
        page: 1,
        pageCount: 9999
      },
      // 列表数据
      tableData: {
        list: [],
        total: 0
      },
      isFuzzyQuery:"",
      // 点击的数据 回填内容
      activeData: {
        userNo: "",
        userName: "",
        userAddr: "",
        meterBore: "",
        upperNum: "",
        replaceDate: "",
        replaceStaff: [],
        oldMeterNum: "",
        oldHandleWay: "",
        comments: "",
        concentratorNo:"",
      },
      // 换表信息
      formData: {
        replaceTypeName: '',//换表类型
        replaceType: '',//换表类型：
        planFinishDate: '',//计划完成日期：
        replaceStaff: [],//换表员：
        replaceStaffName: '',//换表员：
        replaceReason: '',//换表原因：
        meterAmount: '',//水表数量：
        backfillAmount: '',//已回填数量：
      },
      // 换表员下拉数据
      replaceStaffData: [],
      // 列表中已回填数据（点击了保存）的新表编号
      savedCheck: [],
      tableShow: false,
      maxHeight: 0,
      rules: {
        replaceType: [
          { required: true, message: '请选择换表类型', trigger: 'change' }
        ],
        planFinishDate: [
          { required: true, message: '请选择计划完成日期', trigger: 'blur' }
        ],
        replaceStaff: [
          { required: true, message: '请选择换表员', trigger: 'change' }
        ],

      },
      rules1: {
        newMeterNo: [
          { required: true, message: '新表水表编号不能为空', trigger: 'change' }
        ],
        oldMeterNum: [
          { required: true, message: '旧表底码不能为空', trigger: 'change' }
        ],
        replaceStaff: [
          { required: true, message: '请选择换表员', trigger: 'change' }
        ],       
        oldHandleWay: [
          { required: true, message: '请选择旧表处理方式', trigger: 'change' }
        ],
      },
    };
  },
  computed: {
    replaceStaffName() {
      return this.replaceStaffData && this.replaceStaffData.filter(item => this.formData.replaceStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
    },
    activeReplaceStaffName() {
      return this.replaceStaffData && this.replaceStaffData.filter(item => this.activeData.replaceStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
    }
  },
  mounted() {
    

    if (this.editNeedData.id) {
      // 列表信息数据
      this.getTableData();
      // 换表信息数据
      this.getMsChgList();
      
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
       this.tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', this.tempId)
      this.getHtmlData();
    }
    //草稿、登記
    if (
      this.editNeedData.processState == "END" || //完结
      this.editNeedData.processState == "CANCEL" || //终止
      this.editNeedData.processState == "approval" //进行中-审批
    ) {
      this.isActive = false; //表单 不可修改
      this.NotDisabled = true;
      this.approveFlag = 1;
    } else {
      //进行中-登记、草稿、回填
      if (
        this.editNeedData.processState == "" || //草稿
        this.editNeedData.processState == "register" //登记
      ) {
        this.isActive = false; //表单 可修改
        this.NotDisabled = false;
        this.approveFlag = 0;
      } else if (this.editNeedData.processState == "backfill") {
        //回填
        this.isActive = true;
        //表单 不可修改
        this.NotDisabled = true;
        this.approveFlag = 1
      }    
    }
  // 换表员数据
    this.getReplaceStaffData();
     //集中器
     this.getConcentratorData()
    // 数据字典数据
    this.getDictionary();
    this.getBaseConfig();
    this.formData.planFinishDate = this.common.date();
  },
  methods: {
    //换表信息数据
    getMsChgList() {
      let _this = this;
      let data = {
        id: this.editNeedData.id,
        receiptType: 1
      };
      let params = {
        busicode: "MsChgList",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (res.list.length > 0) {
            let fdata = JSON.parse(JSON.stringify(res.list[0]));
            fdata.replaceStaff=res.list[0].replaceStaff.split(',');
            _this.formData=fdata
            // 单据信息数据
            this.getBillData(res.list[0]);
            this.getHtmlData();
          } else {
            this.$message({
              message: '换表信息异常',
              type: 'warning'
            });
          }
        });
    },
    getConcentratorData(){
         let params = {
        busicode: 'ConcentratorSelect',
            data: {}
        };
       this.$api.fetch({ params }).then((res) => {
            this.concentratorData = res
         }).catch((res)=>{
           this.concentratorData = []
         })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_chg_plan#1",
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
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 获取列表数据以及左侧默认第一行数据信息
    getTableData() {
      let _this = this;
      let params = {
        busicode: "MsChgSelectList",
        data: this.tableQuery
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData=res;
          if(this.isActive) {
            this.common.changeTable(this, '.submitEditRight', ['.submitEditRight .toolbar'])
          }
          //_this.$set(_this, "tableData", res);
          if (this.editNeedData.processState == "backfill") {
            if (_this.tableData.list.length > 0) {
              _this.activeData = JSON.parse(JSON.stringify(_this.tableData.list[0]));
              _this.activeData.replaceStaff=_this.tableData.list[0].replaceStaff==''?this.formData.replaceStaff:_this.tableData.list[0].replaceStaff.split(',');
              
              if(this.activeData.oldHandleWay === '') 
                  this.activeData.oldHandleWay = '2'
              else
                  this.activeData.oldHandleWay = this.activeData.oldHandleWay + ''
              if(this.activeData.replaceDate===''){
                this.activeData.replaceDate=_this.formData.planFinishDate
              }
              if(this.activeData.newMeterNum===''){
                this.activeData.newMeterNum='0'
              }
              this.formDataIndex = 0
              this.$refs.klTableData.setCurrentRow(this.tableData.list[Number(this.formDataIndex)]);
              // 获取列表所有数据的新表编号，用来判断该数据是否修改过
              // for (let i = 0; i < _this.tableData.length; i++) {
              //   _this.savedCheck[i] = _this.tableData[i].newMeterNo;
              // }
            } else {
              // 点击的数据
              _this.activeData = {
                userNo: "",
                userName: "",
                userAddr: "",
                meterBore: "",
                upperNum: "",
                replaceDate: this.formData.planFinishDate,
                replaceStaff: this.formData.replaceStaff,
                oldMeterNum: "",
                oldHandleWay: "",
                comments: "",
                concentratorNo:""
              };
            }
          }
        });
    },

    rowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "OMD,MCM" // （旧表处理方式）
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
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
    //拆表员数据获取
    getReplaceStaffData() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "4" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.replaceStaffData = [...res];
        });
    },
    //输入框失去焦点效验
    blurTest(str) {
      if (str == "old") {
        if (
          parseFloat(this.activeData.oldMeterNum) >=
          parseFloat(this.activeData.upperNum)
        ) {
          this.activeData.margin =
            parseFloat(this.activeData.oldMeterNum) -
            parseFloat(this.activeData.upperNum);
        } else {
          this.activeData.oldMeterNum = "";
          this.activeData.margin = "";
          this.$message({
            message: "旧表底码应大于上期抄码",
            type: "warning"
          });
        }
      } else {
        if (parseFloat(this.activeData.newMeterNum) < 0) {
          this.$message({
            message: "新表起码应该大于0",
            type: "warning"
          });
          this.activeData.newMeterNum = "";
        }
      }
    },
      closeConcentratorDialog(){
     this.openConcentratorDialog = false
    },
    openConcentratorOption(){
      //  console.log(this.$refs)
         this.openConcentratorDialog = true
         if(this.activeData.concentratorNo){
          //  this.concentratorQuery.adminArea = this.concentratorList.adminArea
           this.concentratorQuery.concentratorNo = this.activeData.concentratorNo
         }
    },
    submitConcentratorNo(){
     var list = this.$refs.concentratorInfoList.radioSelect
     this.activeData.concentratorNo= list.code
    //  this.getConcentratorNo(this.activeData.concentratorNo)
     this.openConcentratorDialog = false
    },
    //上传附件
    uploadAttachment(file) {
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.editNeedData.id,
          receiptType: "ms_chg_plan#1",
          accessoryNo: "008",
          file: file.file,
          meterNo:this.activeData.newMeterNo 
        },
        token: "krrjdev123", //
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
        });
    },
    async changeBeforeSubmit(data) {
      console.log(data)
      if(data.processState ==='backfill' && data.backfillAmount<data.meterAmount)
          return "尚有数据未回填"
      else
        return null
    },
    //保存提交
    submit() {
      let _this = this;
      this.$refs["leftForm"].validate(valid => {
        if (valid) {
          // 入参数据处理
          let saveData = {};
          saveData.receiptId = _this.editNeedData.id;
          saveData.replaceDate = _this.activeData.replaceDate;
          saveData.oldMeterNum = _this.activeData.oldMeterNum;
          saveData.oldMeterNo = _this.activeData.oldMeterNo;
          saveData.oldFactoryNo = _this.activeData.oldFactoryNo;
          saveData.oldMeterCert = _this.activeData.oldMeterCert;
          saveData.newMeterNum = _this.activeData.newMeterNum;
          saveData.newMeterNo = _this.activeData.newMeterNo;
          saveData.newFactoryNo = _this.activeData.newFactoryNo;
          saveData.newMeterCert = _this.activeData.newMeterCert;
          saveData.margin = _this.activeData.margin;
          saveData.oldHandleWay = _this.activeData.oldHandleWay;
          saveData.comments = _this.activeData.comments;
          saveData.userNo = _this.activeData.userNo;
          saveData.newMeterBore = _this.activeData.newMeterBore;
          saveData.concentratorNo = _this.activeData.concentratorNo;

          //console.log(_this.activeData.replaceStaff);
          
          // 换表员value
          saveData.replaceStaff = _this.activeData.replaceStaff.toString();
          // 换表员name
          let name = []
          //console.log(_this.activeData.replaceStaff);
          
          _this.activeData.replaceStaff.forEach((item,index)=>{ 
            _this.replaceStaffData.forEach(item1 => {
              if (_this.activeData.replaceStaff[index] == item1.userAccount) {
                name.push(item1.userName);
              }
            });
          })
          
          saveData.replaceStaffName=name.toString();
          let params = {
            busicode: "MsChgBackfill",
            data: [saveData]
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              this.formData.backfillAmount = res
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.getSheetData();

            });
        } else {
          this.$message({
            message: "数据未填完整！",
            type: "warning"
          });
          return false;
        }
      });
    },
    async getSheetData() {
      let params = {}
      params.busicode = "MsChgQuery"
      params.data = JSON.parse(JSON.stringify(this.tableQuery))
      params.data.userNo = this.activeData.userNo
      try {
        let getIndexData = await this.$api.fetch({ params });
        //console.log(getIndexData);
        
        // 给已修改好的行赋值
        this.tableData.list[Number(this.formDataIndex)] = JSON.parse(JSON.stringify(getIndexData.list[0]))
        // 高亮下一行
       console.log(this.tableData)
      //  debugger
        if (this.tableData.list.length - 1 == this.formDataIndex) {
          this.$message({
            message: '这是最后一条可修改数据了噢！',
            type: 'warning'
          });
         // this.formDataIndex = 0
         return;
        } else {
          this.formDataIndex = Number(this.formDataIndex + 1)
        }
        this.$refs.klTableData.setCurrentRow(this.tableData.list[Number(this.formDataIndex)]);
        // 给表单赋值下一行数据
        let data = JSON.parse(JSON.stringify(this.tableData.list[Number(this.formDataIndex)]));
        data.replaceStaff=data.replaceStaff.split(',');
        if(data.replaceDate===''){
          data.replaceDate=this.formData.planFinishDate
        }
        this.activeData = data
        this.activeData.newMeterNum = '0'
        this.activeData.replaceStaff= this.activeData.replaceStaff==''?this.formData.replaceStaff: this.activeData.replaceStaff.split(',');
        this.activeData.oldHandleWay = this.activeData.oldHandleWay==''?'2':this.activeData.oldHandleWay + ''
      } catch (error) {
        console.log(error);
        // 点击的数据
        this.activeData = {
          userNo: "",
          userName: "",
          userAddr: "",
          meterBore: "",
          upperNum: "",
          replaceDate: "",
          replaceStaff: [],
          oldMeterNum: "",
          oldHandleWay: "1",
          comments: "",
          concentratorNo:""
        };
      }
    },

    // 暂存按钮（添加/修改）
    // save() {
    //   var _this = this

    //   this.$refs['billForm'].validate((valid) => {
    //     if (valid) {
    //       var params = {
    //         "busicode": this.editNeedData.busicode,
    //         "data": this.getFormbData(),
    //       }
    //       console.log(this.tableData.list.length);
    //       if (this.tableData.list.length < 1) {
    //         this.$message({
    //           message: '请先选择水表！',
    //           type: 'warning',
    //         });
    //         return
    //       }
    //       this.$api.fetch({
    //         params: params,//参数
    //       }).then(res => {
    //         _this.$notify({
    //           title: '成功',
    //           message: params.busicode == 'MsChgAdd' ? '添加成功！' : '修改成功！',
    //           type: 'success'
    //         });
    //         _this.$parent.closeDialog()
    //       })
    //     }
    //   });



    // },
    getFormbData() {
      var _this = this
      let name = []
      _this.formData.replaceStaff.forEach((item,index)=>{ 
        _this.replaceStaffData.forEach(item1 => {
          if (_this.formData.replaceStaff[index] == item1.userAccount) {
            name.push(item1.userName);
          }
        });
      })
      var saveData = {
        receiptType: 1,
        // 换表类型
        replaceType: _this.formData.replaceType,
        // 计划完工日期
        planFinishDate: _this.formData.planFinishDate,
        // 换表员
        replaceStaff: _this.formData.replaceStaff.toString(),
        //换表员
        replaceStaffName: name.toString(),
        // 换表原因
        replaceReason: _this.formData.replaceReason,
        //水表数量
        meterAmount:_this.formData.meterAmount,
        //已回填数量
        backfillAmount:_this.formData.backfillAmount,
        //附件临时ID
        tempId: _this.tempId,
        //单据状态
        processState:_this.editNeedData.processState,
        // 下半部列表数据
        "msChgPlanDetails": []
      }
      // 整理msChgPlanDetails列表入参
      for (let i = 0; i < _this.tableData.list.length; i++) {
        let data = {
          // 客户编号
          ctmNo: _this.tableData.list[i].ctmNo,
          // 用户编号
          userNo:_this.tableData.list[i].userNo,
          // 水表编号
          oldMeterNo: _this.tableData.list[i].oldMeterNo,
          // 水表口径
          oldMeterBore: _this.tableData.list[i].oldMeterBore,
          // 水表表身号
          oldFactoryNo:_this.tableData.list[i].oldFactoryNo,
          // 旧合格证号
          oldMeterCert:_this.tableData.list[i].oldMeterCert,
          // 表读数
          upperNum: _this.tableData.list[i].upperNum,
        }
        console.log(this.tableData.list[i].newMeterNo)
        if(this.tableData.list[i].newMeterNo != undefined && this.tableData.list[i].newMeterNo != null 
            && this.tableData.list[i].newMeterNo != '') {
              data.newMeterNo = this.tableData.list[i].newMeterNo;
              data.newMeterBore = this.tableData.list[i].newMeterBore;
              data.newFactoryNo = this.tableData.list[i].newFactoryNo;
              data.newMeterCert = this.tableData.list[i].newMeterCert;
              data.newMeterNum = this.tableData.list[i].newMeterNum;
              data.oldMeterNum = this.tableData.list[i].oldMeterNum;
              data.replaceDate = this.tableData.list[i].replaceDate;
              data.margin = this.tableData.list[i].margin;
              data.comments = this.tableData.list[i].comments;
              data.replaceStaff = this.tableData.list[i].replaceStaff;
              data.replaceStaffName = this.tableData.list[i].replaceStaffName;
              data.oldHandleWay = this.tableData.list[i].oldHandleWay;
        }
        saveData.msChgPlanDetails.push(data)
      }
      if (this.editNeedData.saveType == 'edit') {
        saveData.id = _this.formData.id
      }
      return saveData
    },

    // 暂存按钮（添加/修改）
    save() {
      var _this = this
      // var params = {
      //   "busicode": this.editNeedData.busicode,
      //   "data": this.getFormbData()
      // }
      // this.$api.fetch({
      //   params: params,//参数
      // }).then(res => {
      //   _this.$notify({
      //     title: '成功',
      //     message: '修改成功！',
      //     type: 'success'
      //   });
      //   _this.$parent.closeDialog()
      // })
      console.log(this.tableData)
      this.$refs['billForm'].validate((valid) => {
        if (valid) {
          var params = {
            "busicode": this.editNeedData.busicode,
            "data": this.getFormbData(),
          }
          if (this.tableData.list.length < 1) {
            this.$message({
              message: '请先选择水表！',
              type: 'warning',
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
        }
      });
    },
    // 返回前判断是否有数据尚未回填，提醒用户
    closeDialog() {
      let _this = this;
      // 默认savedCheck不存在null
      let savedCheckNull = false;
      for (let i = 0; i < this.savedCheck.length; i++) {
        if (this.savedCheck[i] === null) {
          savedCheckNull = true;
          _this
            .$confirm("尚有数据未回填，是否确认退出？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              _this.$parent.backfillVisible = false;
              _this.$parent.ChangeTablesShow = true;
              _this.$parent.init();
            })
            .catch(() => { });
          break;
        }
      }
      // 如果savedCheck不存在null，则表示所有数据已回填，可以直接退出
      if (!savedCheckNull) {
        _this.$parent.backfillVisible = false;
        _this.$parent.ChangeTablesShow = true;
        _this.$parent.init();
      }
    },
    // 点击列表的某一行
    rowClick(row, column, event, $index) {
      this.formDataIndex = row.index    
      this.activeData = JSON.parse(JSON.stringify(row));
      if(this.activeData.replaceDate == null || this.activeData.replaceDate == '') 
          this.activeData.replaceDate = this.formData.planFinishDate
      if(this.activeData.newMeterNum == null || this.activeData.newMeterNum == '') 
          this.activeData.newMeterNum = '0'
      if(this.activeData.oldHandleWay == null || this.activeData.oldHandleWay == '') 
          this.activeData.oldHandleWay = '2'
      this.activeData.replaceStaff= this.activeData.replaceStaff==''?this.formData.replaceStaff: this.activeData.replaceStaff.split(',');
    },
    // 下载模板按钮/导出
    exportExcel() {
      var params = {
        busicode: "MsChgDownload",
        data: {
          receiptType: 1,
          id: this.editNeedData.id,
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

    // 导入按钮
    importExcel(file) {
      let _this = this;
      let params = {
        busicode: "MsChgImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.batchSave(res)
      })
    },
    batchSave(res) {
      let saveValLast = []
      res.forEach(itemVal => {
        console.log(itemVal);
        // 入参数据处理
        let saveData = {};
        saveData.receiptId = this.editNeedData.id;
        saveData.replaceDate = itemVal.replaceDate;
        saveData.oldMeterNum = itemVal.oldMeterNum;
        saveData.oldMeterNo = itemVal.oldMeterNo;
        saveData.newMeterNum = itemVal.newMeterNum;
        saveData.newMeterNo = itemVal.newMeterNo;
        saveData.margin = itemVal.margin;//余量
        saveData.newFactoryNo = itemVal.newFactoryNo;
        saveData.comments = itemVal.comments;
        saveData.userNo = itemVal.userNo;
        if (itemVal.oldHandleWay === '入库') {
          saveData.oldHandleWay = '1';
        }else{
          saveData.oldHandleWay = '2';
        }
        // 换表员value
        saveData.replaceStaff = itemVal.replaceStaff.split(',');
        // 换表员name
        let replaceStaffName=[]
        saveData.replaceStaff.forEach((item,index)=>{
          this.replaceStaffData.forEach(item => {
          if (saveData.replaceStaff == item.userAccount) {
            replaceStaffName.push(item.userName);
          }
        });
        })
        //saveData.replaceStaffName=replaceStaffName
        saveData.replaceStaffName = replaceStaffName.join(',')
        saveData.replaceStaff = saveData.replaceStaff.join(',')
        saveValLast.push(saveData)
      });
      let params = {
        busicode: "MsChgBackfill",
        data: saveValLast
      };
      this.$api.fetch({ params })
        .then(res => {
          this.getTableData()
          this.formData.backfillAmount = res
          this.$message({
            message: "保存成功",
            type: "success"
          });
        });
    },

    // 查看附件弹框
    getViewAttachment(index, row) {
      this.ViewAttachmentVisible = true
      this.viewAttaParams = {
        receiptType: "ms_chg_plan#1",
        receiptId: this.editNeedData.id
      };
    },
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },

    // 选择水表按钮
    chooseWaterMeter(val) {
      // debugger;
      this.waterChooseType = val;
      this.waterChooseVisible = true;
    },
    // 选择水表弹出框取消按钮
    closeDialogSelectWater() {
      this.waterChooseVisible = false;
      this.ViewAttachmentVisible = false;
    },
    // 选择水表弹出框确定按钮
    fixDialogSelectWater() {
      let meterNoArr = []
      let val = this.$refs.SelectWaterTable.selectData
      
      if (this.waterChooseType == 'chooseNewMater') {
        this.$set(this.activeData, "newMeterNo", val[0].meterNo);
        this.$set(this.activeData, "newMeterBore", val[0].meterBoreName);
        this.$set(this.activeData, "newFactoryNo", val[0].factoryNo);
        this.waterChooseVisible = false;
        return
      }
      // this.tableData.list.forEach(item => {    //为什么要重新查一遍已经添加的数据
      //   meterNoArr.push(item.oldMeterNo)
      // })
      val.forEach(item => {
        meterNoArr.push(item.meterNo)
      })
      let params = {
        busicode: "MsChgSelectList",
        data: { meterNos: Array.from(new Set(meterNoArr)) }
      };
      let _this = this
      this.$api.fetch({ params })
        .then(res => {
          if(res.list!=null && res.list.length>0) {
            res.list.forEach(item => {
                var isExists = 0;
                _this.tableData.list.forEach( i =>{
                   if(item.oldMeterNo == i.oldMeterNo)
                      isExists = 1;
                })
                if(isExists == 0)
                  _this.tableData.list.push(item);
            })
          }
          //this.$set(this, "tableData", res);
          this.waterChooseVisible = false;
        });
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.getTableData();
    },
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChangeTablesHandle {
  height: 100%;
  overflow-y: auto;

  .formBill-One {
    line-height: 30px;
  }

  .select-btn {
    float: right;
    margin-bottom: 0.2rem;
  }
  .backfillContent {
    height: 730px;
    .submitEditLeft {
      width: 27%;
      display: inline-block;
      float: left;
      border-right: 1.5px solid #eaf4ff;
      height: 100%;
      .submit_edit_left_msg {
        font-size: 12px;
        border-bottom: 1.5px solid #eaf4ff;
        border-left: none;
        padding-top: 10px;
        
        .msg_content {
          padding-bottom: 19px;
          width: 76%;
          margin: 0 auto;
          height:100%;
          line-height:19px;
        }
        .msg_title{
          color: #606266;
          width:25%;
          height:100%;
        //  line-height:21px,
          // float: left;
        }
        .msg_main_content{
          width:75%;
          height:100%;
          float: right;
        }
      }
      .submit_edit_left_content {
        font-size: 14px;
        padding-right: 15px;
        .DataEntry-button {
         
          text-align: center;
          .upload-file {
            display: inline-block;
          }
        }
      }
    }
    .submitEditRight {
      width: 72%;
      display: inline-block;
      height: 100%;
    }
  }

  .submitEditLeftNone {
    display: none;
  }
  .submitEditRightNone {
    width: 100%;
    display: inline-block;
  }
  .backfillContentNone {
    height: auto;
  }
}
</style>

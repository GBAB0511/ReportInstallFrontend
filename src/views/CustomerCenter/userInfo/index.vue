<template>
  <div class="userInfo">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- //初始化按钮 -->
      <div class="bread-contain-right" v-if="backfillVisible">
        <el-button size="mini" type="primary" @click="lockFlag">{{lockFlagStr}}</el-button>
        <!--<el-button size="mini" icon="el-icon-edit" type="primary" @click="editShow">资料修改</el-button>-->
        <el-button size="mini" type="primary" @click="ctmChange">变动情况</el-button>
        <el-button size="mini" type="primary" @click="payInfo">费用信息</el-button>
        <el-button size="mini" type="primary" @click="meterInfo">抄表信息</el-button>
        <el-button size="mini" type="primary" @click="Predeposit">账户流水</el-button>
        <el-button size="mini" type="primary" @click="contractShow()">合同管理</el-button>
        <el-button size="mini" type="primary" @click="doPrint('xk')">打印新卡</el-button>
        <el-button size="mini" type="primary" @click="AttachmentView">查看附件({{attachmentQty}})</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- //录入 -->
      <div class="bread-contain-right" v-else>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="sendMessage" v-auth="['userInfoSendMsg']">发送短信</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleExport">资料导出</el-button>
      </div>
    </div>
    <!--用户详情-->
    <div v-if="backfillVisible" class="indexContent">
              <el-dialog
        :title="ContractShowVisibleName"
        :visible.sync="ContractShowVisible"
        :close-on-click-modal="false"
        class="button-dialog"
        @close="ContractShowVisible = false"
        v-if="ContractShowVisible"
      >
        <OfferWaterContract :OfferWaterContractParams="OfferWaterContractParams"></OfferWaterContract>

      </el-dialog>


      <!-- 弹出表资料变更 -->
      <el-dialog
        :title="DataChangeVisibleName"
        :visible.sync="DataChangeVisible"
        :close-on-click-modal="false"
        class="button-dialog"
        @close="closeDialog1"
        v-if="DataChangeVisible"
      >
        <CustomerChangeEdit ref="customerChangeEdit" :idCuster="idCuster" :billStute="status"></CustomerChangeEdit>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="submitCustomerChange">保存为草稿</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog1()">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 弹出表单客户变动情况 -->
      <el-dialog
        :title="ctmChangeName"
        :close-on-click-modal="false"
        v-if="CustomerChangesVisible"
        :visible.sync="CustomerChangesVisible"
        class="common-dialog"
        @close="closeDialog1"
      >
        <CustomerChangesEdit
          ref="ctmChangeEditor"

          :CustomerChangesEditData="CustomerChangesEditData"
        ></CustomerChangesEdit>
      </el-dialog>

      <!-- 弹出表单费用信息 -->
      <el-dialog
        :title="payInfoName"
        :close-on-click-modal="false"
        v-if="payInfoVisible"
        :visible.sync="payInfoVisible"
        class="common-dialog"
        @close="closeDialog1"
      >
        <WaterUseOverTheYears
          ref="payInfoEditor"
          :WaterUseOverTheYearsData="WaterUseOverTheYearsData"
        ></WaterUseOverTheYears>
      </el-dialog>
      <!-- 弹出表单抄表信息 -->
      <el-dialog
        :title="MeterReadingName"
        :close-on-click-modal="false"
        v-if="MeterReadingVisible"
        :visible.sync="MeterReadingVisible"
        class="common-dialog"
        @close="closeDialog1"
      >
        <MeterReadingInfo ref="MeterReading" :MeterReadingInfoData="MeterReadingInfoData"></MeterReadingInfo>
      </el-dialog>
      <!-- 弹出表单账户流水 -->
      <el-dialog
        :title="PredepositDdetailsName"
        :close-on-click-modal="false"
        v-if="PredepositDdetailsVisible"
        :visible.sync="PredepositDdetailsVisible"
        class="common-dialog"
        @close="closeDialog1"
      >
        <PredepositDdetailsInfo
          ref="PredepositDdetails"
          :PredepositDdetailsInfoData="PredepositDdetailsInfoData"
        ></PredepositDdetailsInfo>
      </el-dialog>
      <!-- 弹出表单附件查看 -->
     <el-dialog
        :title="AttachmentViewName"
        :close-on-click-modal="false"
        v-if="AttachmentViewVisible"
        :visible.sync="AttachmentViewVisible"
        class="button-dialog"
        @close="closeDialog1"
      >
        <AttachmentViewInfo v-if="AttachmentViewVisible" :receiptAccessory="receiptAccessory" ref="AttachmentView"></AttachmentViewInfo>
      </el-dialog>

      <userInfoEdit
        @fromLockFlag="getLockFlag"
        class="common-dialog"
        ref="userInfoEdit"
        :formDataUserNo="formDataUserNo"
      ></userInfoEdit>
    </div>

    <div class="userInfoIndex" v-else>
      <div style="outline:none" tabindex="0" @keydown="enterEvents($event)"  class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="营业区域：">
            <el-cascader ref="cascader" @change="changeBusinessArea" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
        <!-- 抄表员 -->
            <!-- <el-form-item class="readingStaff" label="抄表员：">
              <el-select v-model="tableQuery.meterReadingStaffAccount" size="mini" placeholder="抄表员">
                <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item> -->
         <el-form-item  label="抄表员：">
              <el-select v-model="tableQuery.meterReadingStaffAccount" placeholder="请选择"  clearable>
                <el-option-group
                  v-for="group in meterReaderList"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userAccount"
                    :label="item.userName"
                    :value="item.userAccount">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item >
          <el-form-item label="用水类型：">
            <el-cascader
              ref="cascader-a"
              v-model="tableQuery.useWaterType"
              :options="useWaterTypeOptions"
              :show-all-levels="false"
              clearable
              :props="props1">
            </el-cascader>
          </el-form-item>
          <el-form-item label="用户状态：">
            <el-select v-model="tableQuery.status" placeholder="请选择" clearable  ref="select2">
              <el-option v-for="item in dictionaryData.CUS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字查询：">
            <el-select v-model="tableQuery.queryType" placeholder="请选择" clearable  ref="select1" >
              <el-option v-for="item in dictionaryData.USER_QUERY_TYPE" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" class="fuzzy-query-input" @keydown.enter.native="init"></el-input>
          </el-form-item>
          <!-- <el-form-item label="停用月份>" class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.stopMonths" clearable size="mini"  @keydown.enter.native="init" oninput="value=value.replace(/^[^\d]+/g,'')"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            <el-button
              type="primary"
              size="mini"
              @click="ComprehensiveQuery"
              class="soce-query"
            >综合查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table"
        :style="{height: maxHeight + 'px'}"
        >
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          highlight-current-row
          center
          stripe
          border
          :data="tableData.list"
          @cell-click="handle"
          class="wuserInfo-table"
          @sort-change="sortChange"
        >
          <el-table-column align="center" type="index" label="NO." width="80" fixed="left" :index="indexMethod"></el-table-column>

<!--          <el-table-column prop="ctmNo" min-width="100" label="客户编号" show-overflow-tooltip>-->
<!--            <template slot-scope="scope">-->
<!--              <div class="ctmNo">{{scope.row.ctmNo}}</div>-->
<!--            </template>-->
<!--          </el-table-column>-->

          <!-- <el-table-column prop="accountNo" min-width="100" label="账户编号" show-overflow-tooltip></el-table-column>-->

          <el-table-column prop="userNo" min-width="150" label="用户编号" fixed="left" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="230" label="客户名称" fixed="left" show-overflow-tooltip></el-table-column>

          <el-table-column align="left" prop="setupMeterAddr" min-width="360" label="装表地址" show-overflow-tooltip></el-table-column>

          <!--el-table-column prop="businessAbode" min-width="80" label="营业所" show-overflow-tooltip></el-table-column-->

          <el-table-column prop="businessArea" min-width="110" label="营业区域" show-overflow-tooltip></el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员"></el-table-column>

          <el-table-column prop="lastReadingNum" min-width="80" label="最后抄码" align="right"></el-table-column>

          <el-table-column prop="bookNo" min-width="110" label="册本号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factoryNo" min-width="110" label="表身码" show-overflow-tooltip></el-table-column>

          <el-table-column prop="openDate"  min-width="110" label="立户日期" :sort-orders="['descending','ascending','descending']" :sortable="'custom'" show-overflow-tooltip></el-table-column>

          <!-- <el-table-column prop="meterReadingCycle" min-width="100" label="抄表周期"></el-table-column> -->

          <el-table-column prop="useWaterType" min-width="150" label="用水类型" show-overflow-tooltip></el-table-column>

          <el-table-column prop="status" min-width="100" label="用户状态" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="60">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click.native="details(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          >
          </el-pagination>
        </div>

      <!-- 弹出表单综合查询 -->
      <el-dialog
        :title="WaterEditorName"
        :close-on-click-modal="false"
        :visible.sync="waterAddVisible"
        class="button-dialog"
        @close="closeDialog"
      >
        <ComprehensiveQuery ref="comprehensiveQuery" :tableQuery="tableQuery"></ComprehensiveQuery>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="submit('ruleForm');">查询</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="sendMessageName"
        :close-on-click-modal="false"
        v-if="sendMessageShow"
        width="200"
        :visible.sync="sendMessageShow"
        @close="closeDialog1"
      >
        <SendMessage
          ref="SendMessageRef"
          :userCount="userCount"
        ></SendMessage>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="sendMsg();">发送</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog1">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 弹出表单客户资料 -->
      <el-dialog
        v-if="countManagementVisible"
        :title="countManagementName"
        :close-on-click-modal="false"
        :visible.sync="countManagementVisible"
        class="common-dialog"
        @close="closeDialog"
        :append-to-body="true"
      >
        <countManagementEdit :formDataUserNo="formDataUserNo" ref="childcountManagement"></countManagementEdit>
      </el-dialog>
      <el-dialog
        v-if="exportDialogShow"
        title="导出内容"
        :close-on-click-modal="false"
        :visible.sync="exportDialogShow"
        class="button-dialog"
        @close="closeDialog1"
        :append-to-body="true"
      >
        <ExportFieldCheckbox ref="exportField" ></ExportFieldCheckbox>
        <div slot="footer">
          <el-button type="primary" size="mini" @click="handleEnsureExport">确定</el-button>
          <el-button size="mini" @click="closeDialog1">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ComprehensiveQuery from "./ComprehensiveQuery";
import userInfoEdit from "./userInfoEdit";
import SendMessage from "./SendMessage";
import FilePreview from '@/components/FilePreview'
import countManagementEdit from "@/components/IntegratedBusiness/UserInformation/ctmInfo"; //客户资料

import CustomerChangesEdit from "@/components/IntegratedBusiness/UserInformation/CustomerChanges";
import WaterUseOverTheYears from "@/components/IntegratedBusiness/UserInformation/WaterUseOverTheYears";
import MeterReadingInfo from "@/components/IntegratedBusiness/UserInformation/MeterReadingInfo";
import PredepositDdetailsInfo from "@/components/IntegratedBusiness/UserInformation/PredepositDdetailsInfo";
import AttachmentViewInfo from "@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo";
import OfferWaterContract from "@/components/IntegratedBusiness/UserInformation/OfferWaterContract";
import DataChangeVisible from "@/views/CustomerCenter/DataChange/DataChangeAdd"; //资料变更
import CustomerChangeEdit from "@/views/CustomerCenter/changeMangement/CustomerChangeEdit";
import customerManagement from "../customerManagement";
import axios from "axios";
import ExportFieldCheckbox from './ExportFieldCheckbox.vue';
import vauth from '@/assets/js/authVueDirective.js';
export default {
  name: "userInfo",
  components: {
    ComprehensiveQuery,
    userInfoEdit,
    SendMessage,
    OfferWaterContract,
    DataChangeVisible,
    CustomerChangeEdit,
    CustomerChangesEdit,
    WaterUseOverTheYears,
    MeterReadingInfo,
    PredepositDdetailsInfo,
    AttachmentViewInfo,
    customerManagement,
    countManagementEdit,
     FilePreview,
    ExportFieldCheckbox
  },
  data() {
    return {
     meterReaderList:[],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath:false,
      },
      sendMessageShow:false,
      props1: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      businessAreaData: [], //营业区域下拉框
      //查看附件传参
      receiptAccessory:{userNo:""},
      //变更传参
      idCuster: { id: "", userNo: "" },
      status: "ChangeUserAdd", //add 新增 updata 修改
      CustomerChangesEditData: {
        //变动情况
        userNo: ""
      },
        OfferWaterContractParams:{
        userNo:'',
        dictionaryData:[]
      },
      WaterUseOverTheYearsData: {
        //费用信息
        userNo: ""
      },
      MeterReadingInfoData: {
        //抄表信息
        userNo: ""
      },
      PredepositDdetailsInfoData: {
        //账户流水
        accountNo: "",
        userNo:"",
      },
      lockFlagStr: "锁定",
      DataChangeVisibleName: "资料变更",
      DataChangeVisible: false,
      countManagementName: "查看客户资料",
      countManagementVisible: false,
      ContractTemplateVisibleName: "合同模板选择",
      ContractTemplateVisible: false,
      ContractShowVisible: false,
       ContractShowVisibleName:'合同管理',
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户管理" }, { title: "查询" }]
      },
      isActive: false, //控制高级查询内容的显示
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea: "",
        queryType: '0',
        fuzzyQuery: "",
        sortNo:'',
        useWaterType:[],
        list: [],
        status:'1'
        // stopMonths: ''
      },
      dictionaryData: {},
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {
        list: []
      },
      formData: {
        //编辑页面的id
        userNo: ""
      },
      useWaterTypeOptions:[],//用水类型下拉框
      waterAddVisible: false, //综合查询的显示和隐藏
      WaterEditorName: "综合查询",
      ruleFormData: {},
      backfillVisible: false,
      userInfoName: "用户资料-编辑",
      userInfoVisible: false,
      CustomerChangesVisible: false,
      ctmChangeName: "变动情况",
      payInfoName: "费用信息",
      sendMessageName:"短信发送",
      payInfoVisible: false,
      MeterReadingName: "抄表信息",
      MeterReadingVisible: false,
      PredepositDdetailsName: "账户流水",
      PredepositDdetailsVisible: false,
      // 查看附件弹出框显示与隐藏
      AttachmentViewVisible:false,
      AttachmentViewName: '查看附件',
      exportDialogShow: false,
      attachmentData: [],
      attachmentQty:0,
      businessAbodeOptions: [], //营业所下拉框
      formDataUserNo: "", //用户编号存值
      loadingShow: false,
      userCount:"",//当前条件的用户总数
    };
  },
  created(){
      //设置按钮权限
      vauth.setAuthList(this.$store.state['/CustomerManagement/userInfo']);
    },
  mounted() {
    this.getReadingStaff()
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow2");
    // this.getDictionary()
    this.init();
    this.selectBAreaOptions();
    this.SelectUseWaterTypeOptions();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".userInfoIndex", [
        ".userInfo .toolbar",
        ".userInfo .block"
      ]);
    });

      this.getDictionarySelect()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        enterEvents(e){
         console.log(e)
        //  console.log(this.dataList)
         if(e.keyCode == 13){
           this.init()
          //  this.$refs.cascader.blur()
          //  this.$refs.cascader1.blur()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
          //  this.$refs.c.blur()
          //  this.$refs.d.blur()
          //  this.hideVal(false)
         }
    },
    changeBusinessArea(){
      this.getReadingStaff();
    },
        // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserList",
        "data": {
          postNo: "2",
        businessArea:this.tableQuery.businessArea
         },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = res;
        });
    },
    //营业区域
    selectBAreaOptions(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaData = data.children;
      })
    },
    sortChange(column){
       if(column.order === 'ascending'){
        this.tableQuery.sortFlag = '0'
       } else if(column.order === 'descending'){
        this.tableQuery.sortFlag = '1'
       }
       this.init()
       },
    //树结构数据处理
    getArr1(data) {
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
          // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT,IDT,CDL,USER_QUERY_TYPE,CUS"//客户类型、证件类型、信用级别、用户-查询类型、用户状态
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
        this.OfferWaterContractParams.dictionaryData =  res;
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
      contractShow(){
      this.ContractShowVisible = true;
    },
    init() {
      this.loadingShow = true
      if(this.tableQuery.businessArea == null){
        this.tableQuery.businessArea = ''
      }
      let _this = this;
      let params = {
        busicode: "UserInfoList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
          this.loadingShow = false
        }).catch(() => {
          this.loadingShow = false
        })
    },

    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    initAccessory() { //初始化附件
        let _this = this;
          let params = {
            busicode: "AccessoryAboutUserList",
            data:_this.receiptAccessory
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res !=null) {
            _this.attachmentData = res;
            _this.attachmentQty =res.length
          }
        });
    },
    // 营业所下拉框的初始化
    businessInit() {
      let _this = this;
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.businessAbodeOptions = res;
        });
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "USER_QUERY_TYPE" //查询项
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    doPrint(type) {
      let _this = this;
      let params = {
        busicode: "XkPrint",
        data: {userNo:_this.$refs.userInfoEdit.formDataUserNo}
      };

      this.$api.fetch({
        params: params,
      }).then(res => {

        if (type == 'xk') {// 打印
          // _this.printTable('print', res)
          _this.common.print('view', 'XkPrint', '', res, _this);
        }
      })
    },

    getLockFlag(val) {
      if (val == "1") {
        this.lockFlagStr = "解锁";
      } else {
        this.lockFlagStr = "锁定";
      }
    },
    lockFlag() {
      //锁定
      this.$confirm("此操作将"+this.lockFlagStr+"该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.lockFlagStute();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    lockFlagStute(){
      let _this = this;
      let data = this.$refs.userInfoEdit.toParentData();
      let params = {
        busicode: "UserLockFlagUpdate",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.$message({
            type: "success",
            message: this.lockFlagStr+"成功"
          });
          if (_this.lockFlagStr == "锁定") {
            _this.lockFlagStr = "解锁";
            this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData.lockFlag = 1;
            // console.log(this.$refs.userInfoEdit.$refs.userInfo.formData.lockFlag)
            this.$refs.userInfoEdit.$refs.userInfo.init(this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData)
          } else if (_this.lockFlagStr == "解锁") {
            _this.lockFlagStr = "锁定";
           this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData.lockFlag = 0;
          //  console.log(this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData)
           this.$refs.userInfoEdit.$refs.userInfo.init(this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData)
          }
        })
    },

    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
    },
    // 返回
    handleClose() {
      this.$refs.BusinessAreaEdit.handleClose();
    },
    search() {
      //查询
      this.tableQuery.page=1;
      this.tableQuery.pageCount=20;
      this.tableQuery.businessArea=this.common.handleTreeData(this.tableQuery.businessArea)
      this.init();
    },

    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    handle(row, column, cell, event) {
      //点击文件名
      let that = this;
      if (column.label === "客户编号") {
        this.countManagementVisible = true;
        this.formDataUserNo = row.ctmNo;
      }
    },
    indexMethod(index) { 
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    closeDialog() {
      //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.userInfoVisible = false;
      this.AttachmentViewVisible = false;
      //客户资料查看
      this.formDataUserNo = "";
      this.countManagementVisible = false;
      this.exportDialogShow = false
      // 重新渲染列表
      // this.init();
      //this.selectBAreaOptions();
    },
    closeTemplateDialog() {
      this.ContractTemplateVisible = false;
    },
    closeDialog1() {
      this.CustomerChangesVisible = false;
      this.payInfoVisible = false;
      this.MeterReadingVisible = false;
      this.PredepositDdetailsVisible = false;
      this.AttachmentViewVisible = false;
      this.DataChangeVisible = false;
      this.exportDialogShow = false;
      this.sendMessageShow = false;
    },
    //弹出框
    submit(formName) {
      //提交
      // this.$refs.comprehensiveQuery.submit()
      let that = this;
      let list = that.tableQuery.list;
      let gridData = that.$refs.comprehensiveQuery.gridData;
      let message = "";
      if(gridData.length > 1) {
        for (let i = 0; i < gridData.length; i++) {
          if (
            !gridData[i].fieldName ||
            gridData[i].fieldName == '' ||
            !gridData[i].operator ||
            gridData[i].operator == '' ||
            !gridData[i].logicalValue ||
            gridData[i].logicalValue == '' ||
            !gridData[i].queryValue ||
            gridData[i].queryValue == ''
          ) {
            if (!gridData[i].fieldName || gridData[i].fieldName == '') {
              message = "字段名不能为空";
            } else if (!gridData[i].operator || gridData[i].operator == '') {
              message = "操作符不能为空";
            } else if (!gridData[i].queryValue || gridData[i].logicalValue == '') {
              message = "查询值不能为空";
            } else if (!gridData[i].logicalValue || gridData[i].queryValue == '') {
              message = "逻辑值不能为空";
            }
            this.$message({
              message,
              type: "warning"
            });
            return;
          }
        }
      }

      that.tableQuery.list = gridData
      console.log(gridData);
      if(gridData.length == 1) {
        if (
            !gridData[0].fieldName ||
            gridData[0].fieldName == '' ||
            !gridData[0].operator ||
            gridData[0].operator == '' ||
            !gridData[0].logicalValue ||
            gridData[0].logicalValue == '' ||
            !gridData[0].queryValue ||
            gridData[0].queryValue == ''
          ) {
            that.tableQuery.list = []
          }
      }
      that.tableQuery.list = that.tableQuery.list.map(item => {
        return {
          fieldName: item.fieldName,
          operator: item.operator,
          queryValue: item.queryValue,
          logicalValue: item.logicalValue
        }
      })
      this.tableQuery.page=1
      that.waterAddVisible = false;
      this.init()
    },

    //客户变更保存
    submitCustomerChange() {
     this.$refs.customerChangeEdit.submit('userInfo')
    },
    // 资料导出
    DataDerivation(list) {
      let params = {
          busicode: "UserInfoExport",
          data: {
            businessArea: this.common.handleTreeData(this.tableQuery.businessArea),
            fuzzyQuery: this.tableQuery.fuzzyQuery,
            useWaterType: this.tableQuery.useWaterType,
            list: this.tableQuery.list,
            status:this.tableQuery.status,
            queryType:this.tableQuery.queryType,
            exportList:list
            } ,
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)));

    },
    //获取当前发送用户数
    sendMessage(){
      let _this = this;
      let params = {
        busicode: "UserInfoListCount",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.userCount = res.count;
          //显示发送短信界面
          _this.sendMessageShow=true;
        })
    },
    sendMsg(){
      let _this = this;
      this.$confirm("当前预期发送用户数："+this.userCount+",确定无误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let data = JSON.parse(JSON.stringify(_this.tableQuery))
        data.content=_this.$refs.SendMessageRef.formData.content;
        let params = {
          busicode: "UserInfoNoticeAllTempMessage",
          data: data,
        };
        this.$api
          .fetch({
            params //参数
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "发送完毕",
            });
            this.closeDialog1()
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleExport() {
      this.exportDialogShow = true
    },
    handleEnsureExport() {
      const exportList = this.$refs.exportField.check
      if(!exportList || exportList.length === 0) {
        this.$message.error('请勾选至少一个字段来导出！')
        return
      }
      if(exportList.length<2){
        this.$message.error('请勾选至少两个字段来导出！')
        return
      }
      this.DataDerivation(exportList)
    },
    // 综合查询
    ComprehensiveQuery() {
      this.waterAddVisible = true;
    },
    // 详情
    details(i, row) {
      this.formDataUserNo = row.userNo;
      this.CustomerChangesEditData.userNo = row.userNo;
      this.WaterUseOverTheYearsData.userNo = row.userNo;
      this.MeterReadingInfoData.userNo = row.userNo;
      this.idCuster.userNo =  row.userNo
      this.PredepositDdetailsInfoData.accountNo = row.accountNo;
      this.receiptAccessory.userNo = row.userNo;
      this.initAccessory();
      this.backfillVisible = true;
      this.OfferWaterContractParams.userNo = row.userNo;
    },
    editShow() {
      this.DataChangeVisible = true;
    },
    ctmChange() {
      this.CustomerChangesVisible = true;
    },
    payInfo() {
      this.payInfoVisible = true;
    },
    meterInfo() {
      this.MeterReadingVisible = true;
    },
    Predeposit() {
      this.PredepositDdetailsVisible = true;
    },
    AttachmentView() {
      this.AttachmentViewVisible = true;
    },
    closeAttachDialog(){
      this.AttachmentViewVisible = false;
      this.initAccessory();
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    AttachmentViewVisible(val) {
      if(!val) {
        this.initAccessory();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.userInfo {
  height: 100%;
  width: 100%;
       .formBill {
    .el-form-item__label {
      width: 130px;
    }

  }
  .userInfoIndex {
    height: calc(100% - 41px);
    .fuzzy-query-input {
      width: 180px !important;
      /deep/ {
        .el-input__inner {
        width: 100%;
      }
      }
    }
  }
  .bread-contain #crumbs {
    width: 20% !important;
  }
  .bread-contain .bread-contain-right {
    width: 78% !important;
  }
  .wuserInfo-table {
    .el-table__body {
      tr {
        td:nth-child(2) {
          div {
            color: #3195f4;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

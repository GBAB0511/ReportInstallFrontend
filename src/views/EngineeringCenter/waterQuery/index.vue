<template>
  <div class="waterQuery">
    <!-- 弹出表工程收费 -->
    <el-dialog title="工程收费" :destroy-on-close="true" :visible.sync="EngineeringFees" :close-on-click-modal="false" class="common-dialog" @close="closeFees">
      <EngineeringFees v-if="EngineeringFees" :editNeedData="editNeedData" :showOpertions="showOpertions" ref="EngineeringFees"></EngineeringFees>
    </el-dialog>
    <!-- 面包屑 & 按钮 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <div class="waterQuery" v-if="IndexShow">
          <el-button type="primary" size="mini" v-if="privilegeShow" @click="privilege(2)">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" v-if="privilegeShow" @click="cancelPrivilege">取消</el-button>
          <!--el-button type="primary" size="mini" v-else @click="privilege(1)">特权修改</el-button-->
          <el-button type="primary" size="mini" v-if="!privilegeShow" icon="el-icon-plus" @click="addDialog">添加</el-button>
        </div>
        <!-- 添加页面顶部按钮 -->
        <div class="waterQuery" v-if="EditContent">
          <template v-if="EditVal==0">
            <el-button size="mini" type="primary" @click="saveEditContent(1)">暂存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog()">返回</el-button>
          </template>
          <template v-else-if="EditVal==1">
            <!-- 用户工程-工程登记-水表明细 
            <el-button size="mini" type="primary" @click="saveWiter('add')">保存</el-button>-->
            <el-button size="mini" type="primary" @click="saveEditContent(1)">保存</el-button>
            <el-upload  class="upload-demo" multiple   :http-request="importExcel">
              <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
            </el-upload>
            <el-button size="mini" type="primary" icon="el-icon-bottom" @click="downloadExcel">下载模板</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog()">返回</el-button>
          </template>
        </div>
        <!-- 详情页面顶部按钮 -->
        <div class="waterQuery" v-if="handleContent">
          <!-- 登记 -->
          <template v-if="HandleVal=='register' || HandleVal == 'Process-task8' ">
            <template v-if="EditVal==0">
              <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right:10px;" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
              <template v-if="wQEditData.consult.processState=='register' || wQEditData.consult.processState==''">
                <el-button size="mini" type="primary" @click="saveHandleContent(1)">暂存</el-button>
              </template>
              <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog()">返回</el-button>
            </template>
            <template v-else-if="EditVal==1">
              <!-- 用户工程-工程登记-水表明细 -->
              <template v-if="wQEditData.consult.processState!='budget'&&wQEditData.approveFlag==0">
                <el-button size="mini" type="primary" @click="saveHandleContent(1)">保存</el-button>
              </template>
              <template v-if="wQEditData.consult.processState!='budget'&&wQEditData.approveFlag==0">
                <el-upload  class="upload-demo" multiple   :http-request="importExcel">
                  <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
                </el-upload>
              </template>
              <el-button size="mini" type="primary" icon="el-icon-bottom" @click="downloadExcel">下载模板</el-button>
              <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog()">返回</el-button>
            </template>
          </template>
          <!-- 勘察 -->
          <template v-else-if="HandleVal=='survey' || HandleVal == 'Process-task1'">
            <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right:10px;" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
              <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
          </template>
          <!-- 设计 -->
          <template v-else-if="HandleVal=='design' || HandleVal == 'Process-task9'">
            <template v-if="EditVal==0">
              <!-- 设计主页面 -->
              <!-- <el-button size="mini" type="primary" @click="ConMShow('Entrance')">施工材料</el-button> -->
              <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
              <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
              <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
            </template>
            <template v-else-if="EditVal==1">
              <!-- 施工材料 -->
              <template v-if="wQEditData.consult.processState!='budget'&&wQEditData.approveFlag==0">
                <el-button size="mini" type="primary" @click="saveExecution">保存</el-button>
                <el-button size="mini" type="primary" @click="chooseTemplate()">选择模板</el-button>
              </template>
              <el-button size="mini" icon="el-icon-caret-left" @click="closeDialog">返回</el-button>
              <!-- <el-button   icon="el-icon-caret-left" size="mini" @click="ConMShow('Exit')"  >返回上一层</el-button> -->
            </template>
          </template>
          <!-- 工程预算 -->
          <template v-else-if="HandleVal=='budget' || HandleVal=='sub_pj_consult_budget'">
            <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
              <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
          </template>
          <!-- 工程收费 -->
          <template v-else-if="HandleVal=='charge' || HandleVal=='charge-approval'">
            <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
            </el-upload>
            <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
            <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
            <el-button type="primary" v-if="showButton==1"  size="mini" @click="suspend('1')" >工程暂停</el-button>
            <el-button type="primary" v-if="showButton==2" size="mini" @click="suspend('2')" >工程恢复</el-button>
            <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
          </template>
          <!-- 结束 -->
          <!-- <template v-else-if="HandleVal==5">
            <el-button   icon="el-icon-caret-left" size="mini" @click="closeDialog"  >结束</el-button>
            <el-button   icon="el-icon-caret-left" size="mini" @click="closeDialog"  >返回</el-button>
          </template>-->
        </div>
      </div>
    </div>
    <!-- 添加页面 -->
    <!-- indexAdd 判断此界面是从index界面 进入 为添加 值：add/'' -->
    <!-- wQEditData 给页面传值 -->
    <waterQueryEdit ref="waterQueryEdit" :indexAdd="indexAddDate" :wQEditData="wQEditData" :NotDisabled="false" style="height:calc(100% - 41px)" v-if="EditContent" @fromChild="getChildTabsNum"></waterQueryEdit>
    <!-- 详情页面 -->
    <handleInfo ref="handleInfo" :editNeedData="editNeedData" style="height:calc(100% - 41px)" :indexAdd="indexAddDate" v-if="handleContent" @fromHandleChild="getChildHandleNum" @fromChildVal="getChildTabsNum" @detail="handleDetail" @closeAttachment="initAccessory"></handleInfo>
    <!-- 列表页面 -->
    <div class="waterQueryIndex" v-if="IndexShow">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div style="outline:none" tabindex="0" @keydown="enterEvents($event)" >
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" @submit.native.prevent>
          <el-form-item label="咨询日期：">
            <el-date-picker size="mini" v-model="dataList" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="tableQuery.processState" size="mini" clearable ref="selectVal">
              <el-option v-for="item in dictionaryDataPCS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度：">
            <el-select v-model="tableQuery.urgentFlag" size="mini" clearable ref="a">
              <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-200" label="模糊查询：">
            <el-tooltip class="item" effect="dark" content="咨询编号、用水地址、申请人、联系人、联系电话" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search()" icon="el-icon-search"></el-button>
          </el-form-item>
          <!-- 高级查询内容 -->
          <div v-show="isActive" class="advancedQuery">
            <!-- <el-form-item label="营业所：">
              <el-select clearable v-model="tableQuery.businessAbode" placeholder="全部">
                <el-option v-for="(item) in businessAbodeOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="进度：">
              <el-select clearable v-model="tableQuery.schedule" placeholder="全部" ref="b">
                <el-option v-for="(item,index) in scheduleOptions" :key="index" :label="item.nodeName" :value="item.nodeCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="信息来源：">
              <el-select v-model="tableQuery.sourceFlag" size="mini" clearable ref="c">
                <el-option v-for="item in dictionaryData.PIS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工程类型：">
              <el-select v-model="tableQuery.pjType" size="mini" clearable ref="d">
                <el-option v-for="item in dictionaryData.PPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
        </div>
      </div>
      <!-- 主列表页 -->
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column prop="theme" min-width="180" label="主题" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processState" min-width="60" label="状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processName" min-width="100" label="进度" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="urgentFlag" min-width="70" label="紧急程度" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-if="privilegeShow" v-model="scope.row.urgentFlag" size="mini">
                <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <div v-else>{{scope.row.urgentFlagName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="billNo" min-width="100" label="咨询编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billDate" min-width="100" label="咨询日期"></el-table-column>
          <el-table-column prop="sourceFlag" min-width="100" label="信息来源"></el-table-column>
          <el-table-column prop="agentMan" min-width="80" label="联系人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="agentLinkTel" min-width="120" label="联系电话" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAddr" min-width="100" label="用水地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAmount" min-width="70" label="装表数量" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="details(scope.row)" style="font-size:13px">详情</el-button>
              <el-button type="text" size="mini" v-if="scope.row.processState==='草稿'" @click.native="deleteRow(scope.$index, scope.row)" style="font-size:13px">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import waterQueryEdit from "./waterQueryEdit";
import handleInfo from "./waterQueryHandle";
import EngineeringFees from "@/components/IntegratedBusiness/UserInformation/EngineeringFees"; //工程收费
export default {
  name: "waterQuery",
  components: {
    handleInfo,
    waterQueryEdit,
    EngineeringFees
  },
  data() {
    return {
      showOpertions:true,
      EngineeringFees:false,
      tableShow: false,
      showButton:0,
     enterVisible:false,
      maxHeight: 0,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "用水咨询" }
        ]
      },
      isActive: false, //控制高级查询内容的显示
      //用于控制顶部按钮 不同节点展示不同按钮
      HandleVal: "register",
      //
      indexAddDate: "",
      //用于顶部按钮展示 子页面tabs值 0/登记界面 1/多水表界面
      EditVal: 1,
      // 特权修改
      privilegeShow: false,
      // 添加窗口
      EditContent: false,
      // index页面
      IndexShow: true,
      //数据字典存值
      dictionaryData: [],
      //进度存值
      scheduleOptions: [],
      //营业所存值
      businessAbodeOptions: [],
      //咨询日期段
      dataList: [
        this.common.date(-60 * 24 * 60 * 60 * 1000),
        this.common.date()
      ],
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        beginDate: "", //咨询日期开始日期
        endDate: "", //咨询日期结束日期
        processState: "", //状态
        urgentFlag: "", //紧急程度
        fuzzyQuery: "", //模糊查询
        businessAbode: "", //营业所
        schedule: "", //进度
        sourceFlag:"",//来源渠道,
        pjType:""
      },
      dictionaryDataPCS:[
        {name:"草稿",value:"DRAFT"},
        {name:"进行中",value:"PROCESSING"},
        {name:"已办结",value:"END"},
        {name:"已废弃",value:"CANCEL"},
        {name:"已暂停",value:"suspend"},
      ],
      tableData: {},
      handleContent: false,
      // 给子页面传值
      wQEditData: {
        consult: {
          processState: null
        }
      },
      //设计施工材料显示
      ConstructionShowData: false,
      editNeedData: null,
      AttachmentQty:0,//附件个数
    };
  },
  mounted() {
    var arr = 'a'
    //console.log(Object.getOwnPropertyNames(arr));
    this.EditVal = 0;
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow1");
    this.init(); //初始化
    this.getDictionary(); //数据字典
    this.getProcessState(); //获得进度值
    this.selectBAbodeOptions(); //获取营业所值
    //this.getProcessStateNode();
    this.common.changeTable(this, ".waterQueryIndex", [
      ".waterQueryIndex .toolbar",
      ".waterQueryIndex .block",
      ".waterQueryIndex .toggle-btn"
    ]);
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    async tableShow() { }
  },
  methods: {
    enterEvents(e){
         console.log(e)
         console.log(this.dataList)
         if(e.keyCode == 13){
           this.init()
           this.$refs.selectVal.blur()
           this.$refs.a.blur()
           this.$refs.b.blur()
           this.$refs.c.blur()
           this.$refs.d.blur()
          //  this.hideVal(false)
         }
    },
    // hideVal(callback){
    //  console.log(callback)
    //  return callback
    // },
    //初始化
    init() {

      this.tableQuery.beginDate = this.dataList[0];
      this.tableQuery.endDate = this.dataList[1];
      let params = {
        busicode: "PjConsultList",
        data: this.tableQuery
      };
      // debugger
      // return
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        })
        .catch((this.tableData = {}));
      
    },
    initAccessory(){    //初始化附件个数
        let _this = this;
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType: "PJ_CONSULT",
              receiptId: this.editNeedData.id
            }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res != null && res.length > 0) {
            _this.AttachmentQty = res.length
          }else{
            _this.AttachmentQty=0
          }
          
        });
    },
    closeFees(){
      this.EngineeringFees=false;
    },
    //显示工程收费列表
    Showpreicpt(){
      this.EngineeringFees=true
    },
    workFlowPrint(){
      this.$refs.handleInfo.workFlowPrint();
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "PCS,EGD,PIS,PPT" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 获取单据流程节点Node
    getProcessStateNode() {
      var _this = this;
      var params = {
        busicode: "ProcessNodeList",
        data: {receiptType:"pj_install"} 
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
        });
    },
    //营业所获取
    selectBAbodeOptions() {
      let _this = this;
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.businessAbodeOptions = res;
        });
    },
    // 进度数据获取
    getProcessState() {
      var _this = this;
      _this.common.getProcessStateData(
        //receiptType单据类型，一般是启用工作流的表的数据库名称
        "PJ_CONSULT",
        _this,
        //_then 提交后的回调函数，一般用来执行界面跳转
        () => {
          _this.getSchedule();
        }
      );
    },
    // 进度数据获取
    getSchedule() {
      this.scheduleOptions = JSON.parse(
        localStorage.getItem("ProcessNodeList")
      );
    },
    //Edit 页面传值过来 判断tab
    getChildTabsNum(v) {
      this.EditVal = v;
    },
    //暂存方法调用
    saveEditContent(val) {
      this.$refs.waterQueryEdit.Preservation(true); //
    },
    //工程暂停/回复方法调用
    suspend(val) {
      if(val==='1'){
        this.$refs.handleInfo.suspend(); //
      }else{
        this.$refs.handleInfo.recovery(); //
      }
      
    },
    showSuspend(val){
      this.showButton=val;
    },

    //暂存方法调用
    saveHandleContent(val) {
      this.$refs.handleInfo.Preservation(true); //
    },
    // 多水表保存按钮
    saveWiter(val) {
      if (val == "add") {
        this.$refs.waterQueryEdit.SaveWaterMeter(val); //
      } else {
        this.$refs.handleInfo.SaveWaterMeter(val); //
      }
    },
    downloadExcel() {
      if(this.EditContent)
        this.$refs.waterQueryEdit.$refs.waterMeter.downloadExcel();
      else
        this.$refs.handleInfo.$refs.waterQueryEdit.$refs.waterMeter.downloadExcel();
    },
    importExcel(file) {
      let _this = this;
      let params = {
        busicode: "PjConsultMsImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$refs.handleInfo.$refs.waterQueryEdit.$refs.waterMeter.tableData = res
        this.$message({
            type: "success",
            message: "导入成功"
          });
      })
    },
    uploadAttachment(file) {
        this.$refs.handleInfo.uploadAttachment(file);
    },
    viewAttachment() {
        this.$refs.handleInfo.viewAttachment('show');
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)

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
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    // 高级查询按钮事件
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".waterQueryIndex", [
          ".waterQueryIndex .toolbar",
          ".waterQueryIndex .block",
          ".waterQueryIndex .toggle-btn"
        ]);
      });
    },
    //Handle 页面传值过来 判断tabs
    getChildHandleNum(v) {
      // 顶部控制按钮
      this.HandleVal = v;
      //判断 tabs 页面是 0/登记界面 1/多水表界面
      //初始化 register 节点tabs页
      this.EditVal = 0;
    },
    //特权取消按钮事件
    cancelPrivilege(){
      this.privilegeShow = false;
    },
    // 特权修改按钮事件
    privilege(val) {
      if (val == 1) {
        this.privilegeShow = true;
      } else {
        this.privilegeShow = false;
        let data = [];
        for (let i = 0; i < this.tableData.list.length; i++) {
          data.push({
            id: this.tableData.list[i].id,
            urgentFlag: this.tableData.list[i].urgentFlag
          });
        }
        let params = {
          busicode: "PjUrgentFlagUpdate",
          data: data
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.init(); //初始化
          });
      }
    },
    // 详情按钮事件
    // 根据单据状态判断进入的界面
    // 单据状态 processState ：
    details(row) {
      this.IndexShow = false;
      this.editNeedData = row
      this.initAccessory()
      this.handleContent = true;
    },

    handleDetail(res) {
      this.wQEditData = res
      if (res.consult.processState == "") {
        //草稿
        this.indexAddDate = "DRAFT";
      } else if (res.consult.processState == "END") {
        //已完成
      } else if (res.consult.processState == "CANCEL") {
        //已废弃
      } else {
        //进行中
        //对按钮进行重置
        this.getChildHandleNum(res.consult.processState);
        //给子页面赋值
      }
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "PjConsultDelete",
            data: { id: row.id }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.init();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加按钮
    addDialog() {
      this.wQEditData = "";
      this.indexAddDate = "add";
      this.EditContent = true;
      this.IndexShow = false;
    },
    //关闭会话
    closeDialog() {
      this.EditVal = 0;
      this.EditContent = false;
      this.handleContent = false;
      this.IndexShow = true;
      this.wQEditData = {
        consult: {
          processState: null
        }
      };
      this.init();
    },
    //查询
    search() {
      this.init();
    },
    saveExecution() {
      this.$refs.handleInfo.saveExecution();
      // this.$refs.handleInfo.saveExecution();
    },
    // ConMShow(val){
    //   if (val =='Entrance') {
    //     this.ConstructionShowData = true
    //     this.EditVal = 1
    //   }else if (val == 'Exit') {
    //     this.ConstructionShowData = false
    //     this.EditVal = 0
    //   }
    // },
    chooseTemplate() {
      this.$refs.handleInfo.showTemplateDialog(); //
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
.waterQuery {
  width: 100%;
  height: 100%;
  .waterQueryIndex {
    width: 100%;
    height: calc(100% - 41px);
    .kl-table{
      margin-top: 15px;
    }
  }
  .el-upload-list {
    display: none;
  }
  // ‘添加’底部tabs页
  // ‘详情-登记信息’节点 底部tabs页
  .el-tabs {
    height: 100%;
    border: 0px;
    -webkit-box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12),
      0 0 0px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12), 0 0 0px 0 rgba(0, 0, 0, 0.04);
    .el-tabs__content {
      height: calc(100% - 51px);
      padding: 0px;
      overflow-y: auto;
      .el-tab-pane {
        height: 100%;
      }
    }
    .el-tabs__header.is-bottom {
      height: 40px;
    }
  }
  .el-range-separator {
    padding: 0px 0px !important;
  }
}
</style>

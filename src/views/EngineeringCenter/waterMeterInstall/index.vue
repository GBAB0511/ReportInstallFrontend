

<template>

  <div class="waterMeterInstall">
    <!-- 弹出表工程收费 -->
    <el-dialog title="工程收费" :destroy-on-close="true" :visible.sync="EngineeringFees" :close-on-click-modal="false" class="common-dialog" @close="closeFees">
      <EngineeringFees v-if="EngineeringFees" :editNeedData="editNeedData" :showOpertions="showOpertions" ref="EngineeringFees"></EngineeringFees>
    </el-dialog>

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <div v-if="handleContent" class="bread-contain-right">
        <!-- 工程收款 
        <font v-if="HandleVal=='charge'">
          <el-button size="mini" type="primary" @click="">合同打印</el-button>
          <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font>-->
        <!-- 安装施工 -->
        <font v-if="HandleVal=='build'">
            <font v-if="EditVal==0">
              <!-- 安装施工页面 -->
              <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;"
                :show-file-list="false" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
              <el-button size="mini" type="primary">合同打印</el-button>
              <el-button size="mini" type="primary" @click="Addpreicpt">添加工程收款单</el-button>
              <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
              <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
              <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
            </font>
            <font v-else-if="EditVal==1">
              <!-- 施工材料 -->
              <el-button size="mini" type="primary" @click="saveWiter('add')">保存</el-button>
              <el-button size="mini" type="primary" icon="el-icon-download">导入</el-button>
              <el-button size="mini" type="primary" icon="el-icon-bottom">下载模板</el-button>
            </font>
            <font v-else-if="EditVal==2">
              <!-- 施工材料 -->
              <el-button size="mini" type="primary" @click='saveExecution'>保存</el-button>
              <el-button size="mini" type="primary" @click="chooseTemplate()" >选择模板</el-button>
            </font>
        </font>
        <!-- 工程验收 -->
        <font v-else-if="HandleVal=='check'">
          <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;" 
                :show-file-list="false"
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
          <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
          <el-button size="mini" type="primary">合同打印</el-button>
          <el-button size="mini" type="primary" @click="Addpreicpt">添加工程收款单</el-button>
          <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font>
        
        <!-- 开户 -->
        <font v-else-if="HandleVal=='open'">
          <el-upload
              class="upload-file"
              multiple action="/" 
              :http-request="uploadAttachment"
              style="display:inline-block;margin-right: 10px;" 
              :show-file-list="false"
            >
              <el-button size="mini" type="primary">上传附件</el-button>
            </el-upload>
            <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
          <el-button v-if="EditVal!==0" size="mini" type="primary" @click="save">暂存</el-button>
          <el-button size="mini" type="primary">合同打印</el-button>
          <el-button size="mini" type="primary" @click="Addpreicpt">添加工程收款单</el-button>
          <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font>
        <!-- 编制结算 -->
        <font v-else-if="HandleVal=='preSetmt'">
            <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;" 
                :show-file-list="false"
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
          <el-button size="mini" type="primary">合同打印</el-button>
          <!--el-button size="mini" type="primary" @click="Addpreicpt">添加工程收款单</el-button-->
          <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font>
        <!-- 工程结算 -->
        <font v-else-if="HandleVal=='setmt'">
            <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right: 10px;" 
                :show-file-list="false"
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
          <el-button size="mini" type="primary">合同打印</el-button>
          <!--el-button size="mini" type="primary" @click="Addpreicpt">添加工程收款单</el-button-->
          <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font>
        <!-- 表计挂接 -->
        <!-- <font v-if="HandleVal==11">
          <el-button size="mini" type="primary" @click="">合同打印</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font> -->
        <!-- <font v-if="HandleVal==12">
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font> -->
        <font v-else>
          <el-button size="mini" type="primary">合同打印</el-button>
          <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
          <el-button size="mini" type="primary" @click="Showpreicpt">查看工程收费</el-button>
          <el-button size="mini" type="primary" @click="queryDetail">查看用水咨询单</el-button>
          <el-button size="mini" type="primary" @click="workFlowPrint">流程打印</el-button>
          <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
        </font>
        <!--el-button v-if="!HandleVal || HandleVal === 'Process-task1'" size="mini" @click="closeDialog">返回</el-button-->
      </div>
 
      <div v-else class="bread-contain-right">
            <el-button type="primary" size="mini" v-if="privilegeShow" @click="privilege(2)">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" v-if="privilegeShow" @click="cancelPrivilege">取消</el-button>
            <!--el-button type="primary" size="mini" v-else @click="privilege(1)">特权修改</el-button-->
      </div>
    </div>
    <el-dialog title="添加工程收费" v-if="addProjectShow" :visible.sync="addProjectShow" :close-on-click-modal="false" class="CallDialog" @close="closeAddDialog">

      <el-form :inline="true" size="mini" label-width="130px" :model="proData">
        <el-form-item label="应收金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="proData.YSAmount" placeholder="请输入应收金额"></el-input>
        </el-form-item>
        <el-form-item label="用水保证金：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="proData.YAmount" placeholder="请输入用水保证金"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeAddDialog">取 消</el-button>
      </div>
    </el-dialog>
    <handleInfo ref="installHandle" style="height:calc(100% - 81px)" 
      v-if="handleContent" 
      :editNeedData="editNeedData" 
      @fromHandleChild="getChildHandleNum" 
      @fromChildVal="getChildTabsNum"
      @getChildHandleNum="getChildHandleNum"
      @closeAttachment="initAccessory"
    >
    </handleInfo>
    
    <div v-else class="waterMeterInstallIndex">

      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
          
          <el-form-item  label="单据日期：">
            <el-date-picker 
            size="mini" 
            v-model="dataList" 
            type="daterange" 
            format="yyyy-MM-dd" 
            value-format="yyyy-MM-dd" 
            unlink-panels range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" v-model="tableQuery.processState" size="mini" clearable>
                  <el-option v-for="item in dictionaryData.PCS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="紧急程度：">
              <el-select ref="select2" v-model="tableQuery.urgentFlag" size="mini" clearable>
                  <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item class="width-200" label="模糊查询：">
              <el-tooltip class="item" effect="dark" content="用水地址、联系人、座机号码" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="init"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item class="button-group">
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
            <!-- 高级查询内容 -->
            <div v-show="isActive" class="advancedQuery">
              
              <el-form-item label="营业区域：">
                <el-select ref="select3" clearable v-model="tableQuery.businessAbode" placeholder="全部">
                  <el-option v-for="(item,index) in businessAbodeOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="进度：">
                <el-select ref="select4" clearable v-model="tableQuery.schedule" placeholder="全部">
                  <el-option v-for="(item,index) in scheduleOptions" :key="index" :label="item.nodeName" :value="item.nodeCode"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="工程类型：">
                <el-select ref="select5" v-model="tableQuery.pjType" size="mini" clearable>
                    <el-option v-for="item in dictionaryData.PPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="信息来源：">
                <el-select ref="select6" v-model="tableQuery.sourceFlag" size="mini" clearable>
                    <el-option v-for="item in dictionaryData.PIS" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table stripe border  
        v-if="tableShow" 
        :max-height="maxHeight"
        :data="tableData.list" 
        class="change-tables-table">

          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod">
          </el-table-column>
          
          <el-table-column prop="theme" min-width="180" label="主题" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column  prop="urgentFlag" min-width="70" label="紧急程度" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-if="privilegeShow" v-model="scope.row.urgentFlag" size="mini">
                <el-option size="mini" v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <div v-else>
                {{scope.row.urgentFlagName}}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">

          </el-table-column>

          <el-table-column align="left" prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="agentMan" min-width="80" label="联系人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="agentLinkTel" min-width="120" label="座机号码" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="installAddr" min-width="100" label="用水地址" show-overflow-tooltip>
          </el-table-column>


          <el-table-column prop="installAmount" min-width="70" label="装表数量" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="sourceFlag" min-width="70" label="信息来源" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="pjType" min-width="70" label="工程类型" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column prop="ctmName" min-width="100" label="申请人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="consultNo" min-width="100" label="咨询编号" show-overflow-tooltip>
          </el-table-column> -->

          <el-table-column label="操作" fixed="right" width="85">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="details(scope.row)" >详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" :current-page="1" 
          :page-sizes="[20, 100, 500, 1000]" :page-size="20" 
          layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>

  </div>
</template>
<script>
//用水安装详情页
import handleInfo from './waterMeterHandleInfo'
import EngineeringFees from "@/components/IntegratedBusiness/UserInformation/EngineeringFees"; //工程收费
export default {
  name: "waterMeterInstall",
  components: {
    handleInfo,
    EngineeringFees
  },
  data() {
    return {
      //表格是否显示
      tableShow: false,
      //表格高度控制
      maxHeight: 0,
      //顶部按钮显示控制
      HandleVal:'build',
      //handle 内部页面按钮控制
      EditVal:0,
      //特权修改显示控制
      privilegeShow:false,
      //面包屑
      crumbsData: { 
        titleList: [
          { title: '工程管理' },
          { title: '用户工程' },
          { title: '用水安装' },
        ],
      },
      //列表数据存值
      tableData:[],
      //数据字典存值
      dictionaryData:[],
      //高级查询内容的显示控制
      isActive: false, 
      //咨询日期段
      dataList:[this.common.date(-60*24*60*60*1000),this.common.date() ],
      //工具栏+分页 字段
      tableQuery: {
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginDate: '',//咨询日期开始日期
        endDate:'',//咨询日期结束日期
        processState: '',//状态
        urgentFlag:'',//紧急程度
        sourceFlag:'',//信息来源
        pjType:'',//工程类型
        fuzzyQuery:'',//模糊查询
        businessAbode:'',//营业所
        schedule:''//进度
      },
      //进度存值
      scheduleOptions:[],
      //营业所存值
      businessAbodeOptions:[],
      //详情页面显示控制
      handleContent: false,
      //详情页面存值
      editNeedData:[],
      addProjectShow:false,
      proData:{
        YSAmount:0,
        YAmount:0,
      },
      EngineeringFees:false,
      showOpertions:true,
      AttachmentQty:0,
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow1");
    this.init();//数据初始化
    this.getDictionary();//数据字典
    this.getProcessState()//获得进度值
    this.selectBAbodeOptions()//获取营业所值
    // 接收handleinfo的返回
    eventBus.$on('closeDialog', (bool) => {
      this.handleContent = bool;
    });
    this.common.changeTable(this, ".waterMeterInstallIndex", [
      ".waterMeterInstallIndex .toolbar",
      ".waterMeterInstallIndex .block",
      ".waterMeterInstallIndex .toggle-btn"
    ]);
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.select4.blur()
           this.$refs.select5.blur()
           this.$refs.select6.blur()
         }
    },
    //打印审批记录
    workFlowPrint(){
      this.$refs.installHandle.workFlowPrint();
    },
    //显示工程收费列表
    Showpreicpt(){
      this.EngineeringFees=true
    },
    //添加工程收款界面
    Addpreicpt(){
      this.addProjectShow=true
    },
    //关闭工程收款节目
    closeAddDialog(){
      this.proData.YSAmount=0
      this.proData.YAmount=0
      this.addProjectShow=false
    },
    	//初始化
     init() {
      let _this = this
      this.tableQuery.beginDate=this.dataList[0]
      this.tableQuery.endDate=this.dataList[1]
      let params = {
          "busicode": "PjInstallList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.tableData = res;
      })
        .catch((this.tableData = {}));
        
        
    },
    initAccessory(){    //初始化附件个数
        let _this = this;
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType: "PJ_INSTALL",
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
          }
          
        });
    },
    
    // 数据字典数据获取
    getDictionary() {
        var _this = this
        var params = {
          "busicode": "DictionarySelect",
          "data": "PCS,EGD,PPT,PIS"//流程状态、紧急程度\工程类型、信息来源
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.dictionaryData = res
        })
    },

    //营业所获取
    selectBAbodeOptions() {
      let _this = this
      let params = {
        "busicode": "BusinessAbodeSelect",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.businessAbodeOptions = res;
      })
    },

    // 进度数据获取
    getProcessState() {
      var _this = this
      _this.common.getProcessStateData(
        //receiptType单据类型，一般是启用工作流的表的数据库名称
        "PJ_INSTALL",
        _this,
        //_then 提交后的回调函数，一般用来执行界面跳转
        () => {
          _this.getSchedule();
        }
      );
    },
    uploadAttachment(file,fileList) {
        this.$refs.installHandle.uploadAttachment(file,fileList);
    },
    viewAttachment() {
        this.$refs.installHandle.viewAttachment('show');
    },
    save(){
      this.$refs.installHandle.save();
    },
    saveLimit(){
      this.$refs.installHandle.submit();
    },
    submit(){
      this.$refs.installHandle.addProject(this.proData);
    },
    //进度数据获取
    getSchedule() {
      this.scheduleOptions = JSON.parse(localStorage.getItem('ProcessNodeList'))
    },
    //查询
    search(){
      this.init()
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
        this.common.changeTable(this, ".waterMeterInstallIndex", [
          ".waterMeterInstall .toolbar",
          ".waterMeterInstall .block",
          ".waterMeterInstallIndex .toggle-btn"
        ]);
      });
    },
    // 详情按钮事件
    // 根据单据状态判断进入的界面
    // 单据状态 processState ：
    details(row){
      this.editNeedData = row
      this.initAccessory();
      this.handleContent = true;
    },
    
    //Edit 页面传值过来 判断tab
    getChildHandleNum (v) {
      // 顶部控制按钮
      
      this.HandleVal = v;
      //判断 tabs 页面是 0/安装施工界面 1/多水表界面 2/施工材料
      //初始化 build/安装施工 节点tabs页
      this.EditVal = 0 
    },
    
    //Edit 页面传值过来 判断tab
    getChildTabsNum (v) {
      this.EditVal = v;
    },
    closeDialog(){
      this.handleContent = false;
      
      this.init()
    },
    closeFees(){
      this.EngineeringFees=false;
    },
    //查看用水咨询界面
    queryDetail(){
      this.$refs.installHandle.queryDetail();
    },
    //特权取消事件
    cancelPrivilege(){
      this.privilegeShow = false
    },
    privilege(val){
      if(val == 1){
        this.privilegeShow = true
      }else{
        this.privilegeShow = false
        let data =[]
        for (let i = 0; i < this.tableData.list.length; i++) {
          data.push({
            'id': this.tableData.list[i].consultId,
            'urgentFlag': this.tableData.list[i].urgentFlag,
          });
        }
        let params = {
            "busicode": "PjUrgentFlagUpdate",
            "data": data,
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
            // _this.tableData = res;
            this.init();
        })
      }
    },
    searchBtn(){//查询

    },
    indexMethod(index) {//获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1)
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  },
}
</script>

<style lang="scss">
.waterMeterInstall {
  
    width: 100%;
    height: 100%;
    .el-upload-list {
    display: none;
  }
  .waterMeterInstallIndex{
    width: 100%;
    height: calc(100% - 41px);
    .kl-table{
      margin-top: 15px;
    }
  }

  .bread-contain-right{
    width:70% !important;
  }
  
  // ‘添加’底部tabs页 
  // ‘详情-登记信息’节点 底部tabs页 
  .el-tabs {
    height: 100% ;
    border: 0px;
    -webkit-box-shadow: 0 0px 0px 0 rgba(0,0,0,.12), 0 0 0px 0 rgba(0,0,0,.04);
    box-shadow: 0 0px 0px 0 rgba(0,0,0,.12), 0 0 0px 0 rgba(0,0,0,.04);
    .el-tabs__content {
      height: calc(100% - 51px);
      padding: 0px;
      overflow-y: auto;
      .el-tab-pane{
        height: 100%;
      }
    }
    .el-tabs__header.is-bottom{
      height: 40px;
    }
  }
  .el-range-separator{
    padding:0px 0px!important;
  }
}
</style>



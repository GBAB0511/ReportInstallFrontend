<template>
  <div class="sectionApproval">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline multiple-floor" @submit.native.prevent>
        <el-form-item label="关键字：" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.title" placeholder="主题" @keydown.enter.native="init"></el-input>
        </el-form-item>

        <!-- <el-form-item v-if="rightShow!='1-1'&&rightShow!='1-2'&&rightShow!='1-3'">
                        <el-checkbox v-model="formInline.yiban">我的待办</el-checkbox>

                </el-form-item> -->

        <el-form-item class="button-group">
          <el-button class="searchBtn" icon="el-icon-search" @click="init"></el-button>
          <el-button type="primary" size="mini" @click="init" icon="el-icon-refresh">刷新</el-button>
        </el-form-item>

        <div v-if="rightShow!='1-1'&&rightShow!='1-2'&&rightShow!='1-3'" class="applicationDate">
          <p class="">流程类别：</p>
          <ul style="max-width: calc(100% - 60px)">
            <!-- <li v-for="(v, i) in documentoOptions1" :key="i" @click=processCodeClick(v,i) :processcodeindex="i">{{v.label}}</li> -->
            <el-button
              v-for="(v, i) in documentoOptions1"
              :key="i"
              size="mini"
              :type="processCodeIndex === i ? 'primary' : 'info'"
              @click="processCodeClick(v,i)"
              >{{v.label}}</el-button>
          </ul>
        </div>

        <!-- <div v-if="rightShow=='1-3'" class="applicationDate">
          <p class="isactive">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</p>
          <ul>
            <li v-for="(v, i) in approvalDate" :key="i" @click="statusClick(i)" :statusindex="i">{{v}}</li>
          </ul>
        </div> -->

        <!-- 高级查询内容 -->
        <div v-show="isActive" class="advancedQuery">

          <!-- <div v-if="rightShow!='1-1'&&rightShow!='1-3'" class="applicationDate"> -->
          <!-- <div v-if="rightShow!='1-1'" class="applicationDate">
            <p class="">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</p>
            <ul>
              <li v-for="(v, i) in approvalDate" :key="i" @click="statusClick(i)" :statusindex="i">{{v}}</li>
            </ul>
          </div> -->

          <div class="applicationDate">
            <p class="">申请日期：</p>
            <ul>
              <!-- <li v-for="(v, i) in applicationDate" :key="i" @click="applyClick(i)" :applyindex="i">{{v}}</li> -->
              <el-button
                v-for="(v, i) in applicationDate"
                :key="i"
                size="mini"
                :type="applyDateIndex === i ? 'primary' : 'info'"
                @click="applyClick(i)"
              >{{v}}</el-button>
              <el-date-picker size="mini" v-if="applyDateShow" v-model="Time" @change="getApplyDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left: 20px;">
              </el-date-picker>
            </ul>
          </div>
          <!-- <el-form-item class=" isactive" label="申请部门：">
            <el-select v-model="formInline.application" placeholder="选择申请部门">
              <el-option v-for="(v,i) in formInline.options" :label="v.name" :value="v.value" :key="i"></el-option>
            </el-select>
          </el-form-item> -->

          <!-- <el-form-item class="isactive" label="申请人：">
            <el-select v-model="formInline.proposer" placeholder="选择申请人">
              <el-option v-for="(v,i) in proposerOptions" :label="v.label" :value="v.value" :key="i"></el-option>
            </el-select>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.applyMan" placeholder="申请人"></el-input>
          </el-form-item> -->

          <!-- <el-form-item v-if="rightShow=='1-1'||rightShow=='1-2'||rightShow=='1-3'" label="流程类别：" class="searchInput">
            <el-cascader v-model="tableQuery.category" :options="documentoOptions"></el-cascader>
            <el-cascader v-model="firstCascaderList" :options="documentoOptions" @change="getFirCascaderData"></el-cascader>
          </el-form-item> -->
        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>

    <div class="myDeskConBtn" :style="{height: maxHeight + 'px'}">

          <el-table v-if="tableShow" :max-height="maxHeight" class="listTable kl-table" border stripe :data="listTable.list">

            <el-table-column min-width="45" type="index" fixed="left" label="No." :index="indexMethod"></el-table-column>
            <el-table-column prop="title" min-width="200" label="主题" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                {{scope.row.themeCon}}
                ({{scope.row.applicationUser}}
                {{scope.row.applicationTime}})
              </template> -->
            </el-table-column>
            <el-table-column prop="billNo" min-width="140" label="单据编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="applyMan" min-width="80" label="申请人"></el-table-column>
            <el-table-column prop="urgent" min-width="80" label="紧急程度"></el-table-column>
            <el-table-column prop="applyTime" min-width="120" label="申请时间"></el-table-column>
            <!-- <el-table-column prop="endTime" min-width="120" label="结束时间"></el-table-column> -->
            <el-table-column prop="status" min-width="60" label="状态"></el-table-column>
            <el-table-column prop="progress" min-width="100" label="进度">
              <!-- <template slot-scope="scope">
                {{scope.row.stepEnd}} ( {{scope.row.themeTitle}})
              </template> -->
            </el-table-column>
            <el-table-column prop="currHandler" show-overflow-tooltip min-width="80" label="当前处理人"></el-table-column>

            <el-table-column min-width="80" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" plain @click.native="details(scope.$index, scope.row)">详情</el-button>
                <!-- <el-button type="text"  plain  v-else  @click.native="details(scope.$index, scope.row)">办理</el-button> -->
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
              :total="listTable.total"
            >
            </el-pagination>
          </div>

    <!-- 弹出审批界面 -->
    <processDialog :editNeedData="editNeedData" ref="processDialog" @close="closeDialog" />
  </div>
</template>
<script>
import processDialog from '@/components/processDialog'
export default {
  name: "sectionApproval",
  components: {
    processDialog
  },
  props: ["sectionApprovalType", 'category'],
  data() {
    return {
      showType: "",
      isActive: false,
      listTableList2: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张三",
          themeTitle: "用水咨询",
          themeCon: "YY00001",
          stepStart: "进行中",
          stepEnd: "勘察",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "紧急",
          handleEndUser: "贺雄浩;巫洋彬;周新宇"
        }
      ],
      approvalPageType: "",
      //   查询表单
      formInline: {
        con: "",
        document: ["0"],
        proposer: "",
        application: "",
        handle: "2",
        oApproval: "1",
        oApproval: "22",
        DocumentStatus: "1",
        yiban: true
      },

       // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        type: 2,

        title: '',
        applyTimeType: 0,
        startDate: '',
        endDate: '',
        applyMan: '',
        status: 0,
        setCode: '',
        category: this.category
      },
       //   表格的高度
      maxHeight: 500,
      //   控制表格的显示
      tableShow: false,
       // 指定时间时的日期框显示与隐藏
      applyDateShow: false,
      listTable: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-06-03 14:05",
          applicationUser: "张三",
          workflowname: "用水需求咨询",
          themeTitle: "用水咨询",
          themeCon: "SS00001",
          stepStart: "进行中",
          handleStartUser: "张三",
          stepEnd: "勘察",
          status: "进行中",
          handleEndUser: "李四",
          getAllConc: 0
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-06-03 14:05",
          applicationUser: "张三",
          workflowname: "用户资料变更",
          themeTitle: "停用",
          themeCon: "YY00001",
          stepStart: "进行中",
          handleStartUser: "张三",
          stepEnd: "部门领导审批",
          status: "进行中",
          handleEndUser: "李四",
          getAllConc: 1
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-06-03 14:05",
          applicationUser: "张三",
          workflowname: "换表",
          themeTitle: "停用",
          themeCon: "HH00001",
          stepStart: "进行中",
          handleStartUser: "张三",
          stepEnd: "部门领导审批",
          status: "进行中",
          handleEndUser: "李四",
          getAllConc: 0
        }
      ],

      //   申请日期
      applicationDate: ["全部", "今天", "3天内", "7天内", "30天内", "指定时间"],
      //   单据状态
      approvalDate: ["全部", "草稿", "进行中", "已办结", "已废弃"],
      total: 2,
      rightShow: "1-1",
      isActive: false, //控制高级查询内容的显示
      documentoOptions: [],
      dOptions: [
        {
          label: "全部",
          value: "0"
        },
        {
          label: "用户管理",
          value: "1",
          children: [
            { label: "用水咨询", value: "22" },
            { label: "用水安装", value: "22" },
            { label: "内部工程", value: "2" }
          ]
        },
        {
          label: "抄表开账",
          value: "2",
          children: [{ label: "抄表质量检查", value: "321" }]
        },
        {
          label: "收费管理",
          value: "3",
          children: [
            { label: "应收追加", value: "321" },
            { label: "举报罚款", value: "321" },
            { label: "违约金减免", value: "321" },
            { label: "呆账处理", value: "321" },
            { label: "坏账处理", value: "321" },
            { label: "红冲", value: "321" },
            { label: "取消当月收费", value: "321" },
            { label: "余额取出", value: "321" },
            { label: "余额过户", value: "321" }
          ]
        },
        {
          label: "客户管理",
          value: "4",
          children: [
            { label: "开户", value: "121" },
            { label: "过户", value: "122" },
            { label: "并户", value: "123" },
            { label: "停用", value: "124" },
            { label: "销户", value: "125" },
            { label: "变更", value: "126" }
          ]
        },
        {
          label: "表计管理",
          value: "5",
          children: [
            { label: "注册", value: "321" },
            { label: "换表", value: "321" },
            { label: "拆表", value: "322" },
            { label: "复装", value: "322" },
            { label: "校表", value: "322" },
            { label: "变更", value: "323" }
          ]
        },
        {
          label: "客户通知",
          value: "6",
          children: [
            { label: "通知公共", value: "321" },
            { label: "问卷调查", value: "321" }
          ]
        },
        {
          label: "基础信息",
          value: "7",
          children: [
            { label: "全部", value: "5" },
            { label: "水价管理", value: "321" }
          ]
        }
      ],
      documentoOptions1: [],
      dOptionsEngineering1: [
        {
          label: "全部",
          value: "5"
        },

        { label: "用水咨询", value: "22" },
        { label: "用水安装", value: "22" },
        { label: "内部工程", value: "22" }
      ],
      // 客户管理
      dOptionsCustomer1: [
        {
          label: "全部",
          value: "5"
        },
        { label: "开户", value: "121" },
        { label: "过户", value: "122" },
        { label: "并户", value: "123" },
        { label: "停用", value: "124" },
        { label: "销户", value: "125" },
        { label: "变更", value: "126" }
      ],

      listTableCustomer: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张燕",
          themeTitle: "开户",
          themeCon: "YY00001",
          stepStart: "进行中",
          stepEnd: "结算收款",
          getAllConc: 1,
          status: "进行中",
          handleEndUser: "李四",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张三",
          themeTitle: "停用",
          themeCon: "HH00001",
          stepStart: "进行中",
          stepEnd: "部门领导审批",
          getAllConc: 0,
          status: "进行中",
          handleEndUser: "李四",
          phoneNum: "一般"
        }
      ],
      // 表务
      dOptionsMeter1: [
        {
          label: "全部",
          value: "5"
        },
        { label: "注册", value: "321" },
        { label: "换表", value: "321" },
        { label: "拆表", value: "322" },
        { label: "复装", value: "322" },
        { label: "校表", value: "322" },
        { label: "变更", value: "323" }
      ],

      listTableMeter: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张燕",
          themeTitle: "校表",
          themeCon: "YY00001",
          stepStart: "进行中;",
          stepEnd: "二次换表",
          getAllConc: 1,
          status: "进行中",
          handleEndUser: "李四",
          phoneNum: "一般"
        }
      ],
      //抄表开账
      MeterReadingRecord: [
        { label: "全部", value: "5" },
        { label: "抄表质量检查", value: "321" }
      ],
      listTableRecord: [
        // {
        //     applicationTime:"2019-06-03 12.27",
        //     updateTime:"2019-07-10 14:05",
        //     applicationUser:"张三",
        //     themeTitle:"抄表质量检查",
        //     themeCon:"HH00001",
        //     stepStart:"<无>",
        //     stepEnd:"结束节点",
        //     getAllConc:0,
        //     status:'已办结'   ,
        //     phoneNum:'一般'
        // },
      ],
      //收费管理
      ChargeManagement: [
        { label: "全部", value: "5" },
        { label: "应收追加", value: "321" },
        { label: "举报罚款", value: "321" },
        { label: "违约金减免", value: "321" },
        { label: "呆账处理", value: "321" },
        { label: "坏账处理", value: "321" },
        { label: "红冲", value: "321" },
        { label: "取消当月收费", value: "321" },
        { label: "余额取出", value: "321" },
        { label: "余额过户", value: "321" }
      ],
      listTableCharge: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张三",
          themeTitle: "违约金减免",
          themeCon: "HH00001",
          stepStart: "进行中",
          stepEnd: "部门经理审核",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "一般",
          handleEndUser: "李东乡"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张三",
          themeTitle: "红冲",
          themeCon: "HH00001",
          stepStart: "进行中",
          stepEnd: "部门组长审核",
          getAllConc: 0,
          status: "进行中",
          handleEndUser: "李四",
          phoneNum: "急"
        }
      ],
      //客户通知
      CustomerNotCenter: [
        { label: "全部", value: "5" },
        { label: "通知公共", value: "321" },
        { label: "问卷调查", value: "321" }
      ],
      listTableNot: [
        // {
        //     applicationTime:"2019-06-03 12.27",
        //     updateTime:"2019-07-10 14:05",
        //     applicationUser:"张三",
        //     themeTitle:"问卷调查",
        //     themeCon:"HH00001",
        //     stepStart:"<无>",
        //     stepEnd:"部门组长审核",
        //     getAllConc:0,
        //     status:'进行中'   ,
        //     phoneNum:'一般'
        // },
      ],
      notificationAlarm: [
        {
          label: "全部",
          value: "5"
        },
        { label: "开账", value: "321" },
        { label: "互联网对账", value: "321" },
        { label: "抄表录入", value: "322" }
      ],

      approvalPageName: "办理",
      approvalPageVisible: false,
      editNeedData: null,
      Time: [],
      processCodeIndex: 0,
      applyDateIndex : 0
    };
  },
  mounted() {
    this.handleSelect(this.sectionApprovalType);
    this.showType = this.sectionApprovalType;
    this.getCategory(this.category);
    this.init();
    this.common.changeTable(this, ".sectionApproval", [
      ".sectionApproval .searchInput",
      ".sectionApproval .block",
      '.sectionApproval .applicationDate',
      '.sectionApproval .toggle-btn'
    ]);
  },
  methods: {
    // 初始化列表数据
    init() {
      var _this = this
      var params = {
        "busicode": "ProcessQuery",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
        
      }).then(res => {
        _this.listTable = res
        // this.getPubReceiptData()
        _this.common.changeTable(_this, ".sectionApproval", [
          ".sectionApproval .searchInput",
          ".sectionApproval .block",
          '.sectionApproval .applicationDate',
          this.isActive ? '.sectionApproval .advancedQuery' : null,
          '.sectionApproval .toggle-btn'
        ]);
      })
    },
    getCategory(category) {
      const params = {
        "busicode": "ProcessCategoryList",
        "data": {
          "prefix": category
        }
      }
      this.$api.fetch({
        params: params,
        
      }).then(res => {
        this.documentoOptions1 = res.map(item => {
          return {
            value: item.processCode,
            label: item.processName
          }
        })
        this.documentoOptions1.unshift({
          label: '全部',
          value: 'all'
        })
      }).finally(() => {
        this.$nextTick(() => {
          for (let i = 0; i < this.documentoOptions1.length; i++) {
            $('[processcodeindex=' + i + ']').css({ 'background': '#fff', 'color': '#000' })
          }
          $('[processcodeindex=0]').css({ 'background': '#328ed1', 'color': '#fff' })
        })
      })
    },
    closeDialog() {
      this.approvalPageVisible = false;
    },
    //   详情
    details(index, row) {
      this.editNeedData = row
      this.editNeedData.id = row.billId
      this.editNeedData.saveType = 'edit'
      this.editNeedData.idFinaEdit = row.id
      this.$refs.processDialog.open(row.processCode, this.editNeedData)
    },
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
    },
    // 申请日期查询条件点击事件
    applyClick(index) {
      // for (let i = 0; i < this.applicationDate.length; i++) {
      //   $('[applyindex=' + i + ']').css({ 'background': '#fff', 'color': '#000' })
      // }
      // $('[applyindex=' + index + ']').css({ 'background': '#328ed1', 'color': '#fff' })
      this.applyDateIndex = index
      this.tableQuery.applyTimeType = index
      if (index <= 4) {
        // 隐藏指定时间日期框
        this.applyDateShow = false
        delete this.tableQuery.startDate
        delete this.tableQuery.endDate
        this.init()
      } else {
        this.applyDateShow = true
        this.Time = []
      }


    },
    // 状态查询条件点击事件
    statusClick(index) {
      for (let i = 0; i < this.approvalDate.length; i++) {
        $('[statusindex=' + i + ']').css({ 'background': '#fff', 'color': '#000' })
      }
      $('[statusindex=' + index + ']').css({ 'background': '#328ed1', 'color': '#fff' })

      this.tableQuery.status = index
      this.init()
    },

    // 流程状态条件点击事件
    processCodeClick(item, index) {
      // for (let i = 0; i < this.documentoOptions1.length; i++) {
      //   $('[processcodeindex=' + i + ']').css({ 'background': '#fff', 'color': '#000' })
      // }
      // $('[processcodeindex=' + index + ']').css({ 'background': '#328ed1', 'color': '#fff' })
      this.processCodeIndex = index
      this.tableQuery.processCode = item.value
      if(item.label === '全部') {
        delete this.tableQuery.processCode
      }
      this.init()
    },

    // 获取指定时间日期框的值
    getApplyDate(time) {
      this.tableQuery.startDate = time[0]
      this.tableQuery.endDate = time[1]
      this.init()
    },

    handleSelect(key, keyPath) {
      this.rightShow = key;
      if (key == "2-1") {
        //工程管理
        this.documentoOptions1 = this.dOptionsEngineering1;
        this.listTable = this.listTableList2;
      } else if (key == "2-3") {
        //客户管理
        this.documentoOptions1 = this.dOptionsCustomer1;
        this.listTable = this.listTableCustomer;
      } else if (key == "2-4") {
        //表计管理
        this.documentoOptions1 = this.dOptionsMeter1;
        this.listTable = this.listTableMeter;
      } else if (key == "2-6") {
        //抄表开账
        this.documentoOptions1 = this.MeterReadingRecord;
        this.listTable = this.listTableRecord;
      } else if (key == "2-7") {
        //收费管理
        this.documentoOptions1 = this.ChargeManagement;
        this.listTable = this.listTableCharge;
      } else if (key == "2-8") {
        //客户通知
        this.documentoOptions1 = this.CustomerNotCenter;
        this.listTable = this.listTableNot;

        // if(key=='1-1'){//待办

        // }else if(key=='2-1'){//工程管理
        //     this.documentoOptions1 = this.dOptionsEngineering1

        // }else if(key=='2-3'){//客户管理
        //     this.documentoOptions1 = this.dOptionsCustomer1

        // }else if(key=='2-4'){//表计管理
        //     this.documentoOptions1 = this.dOptionsMeter1

        // }else if(key=='2-6'){//抄表开账
        //     this.documentoOptions1 = this.MeterReadingRecord

        // }else if(key=='2-7'){//收费管理
        //     this.documentoOptions1 = this.ChargeManagement

        // }else if(key=='2-8'){//客户通知
        //     this.documentoOptions1 = this.CustomerNotCenter
      }
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
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    }
  },
  watch: {
    sectionApprovalType(val) {
      this.handleSelect(val);
      this.showType = val;
    },
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
     isActive(val) {
      this.$nextTick(() => {
        if(val) {
          this.common.changeTable(this, ".sectionApproval", [
          ".sectionApproval .searchInput",
          ".sectionApproval .block",
          '.sectionApproval .applicationDate',
          '.sectionApproval .advancedQuery',
          '.sectionApproval .toggle-btn'
        ]);
        } else {
          this.common.changeTable(this, ".sectionApproval", [
          ".sectionApproval .searchInput",
          ".sectionApproval .block",
          '.sectionApproval .applicationDate',
          '.sectionApproval .toggle-btn'
        ]);
        }
      })
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.sectionApproval {
  height: calc(100% - 20px);
  width: calc(100% - 40px);
  margin: 10px 20px;
  .TwoModel {
    .el-dialog__body {
      height: calc(100% - 55px);
    }
  }
  .isactive {
    color: #328ed1;
    font-weight: 700;
    & > .el-form-item__label {
      color: #328ed1;
      font-weight: 700;
    }
  }

  .btn-right {
    float: right;
  }
  .advancedQuery{
    border-top: 1px dashed #ccc;
    border-bottom: 1px solid transparent;
  }
  .applicationDate {
    // padding: 8px 0;
    padding-top: 8px;
    width: 100%;

    .el-button {
      margin-bottom: 8px;
    }

    .el-button--info {
      background-color: #A9A9A9;
      border: #A9A9A9;
    }

    &:after {
      @include _clearBoth();
    }
    & > p {
      float: left;
      padding: 3px 0px;
    }
    & > ul {
      float: left;
      padding-left: 10px;
      &:after {
        @include _clearBoth();
      }
      & > li {
        float: left;
        padding: 0px 24px;
        border-radius: 2px;
        height: 25px;
        line-height: 25px;
        cursor: pointer;
      }
      & > li:first-child {
        background: #328ed1;
        color: #fff;
      }
      .el-date-editor{
        height: 25px;
        .el-icon-date{
          line-height: 17px;
        }
        .el-range-separator{
          line-height: 17px;
        }
      }
    }
  }
  .dataTable {
    margin-top: 10px;
    width: 100% !important;
  }
  .listTable {
    overflow: hidden;
    margin-top: 15px;
  }
  .block {
    text-align: right;
    padding: 10px 0px;
  }
}
</style>

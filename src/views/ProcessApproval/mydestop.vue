<template>
  <!-- 我的桌面 -->
  <div class="mydestop">
    <div class="mydestop-left">
      <el-menu :default-active="rightShow" class="el-menu-vertical" unique-opened @open="handleOpen" @select="handleSelect" @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <span>我的待办</span>
          </template>
          <el-menu-item index="1-1">
            <el-badge is-dot class="item2">
              待办
            </el-badge>
          </el-menu-item>

          <el-menu-item index="1-2">已办</el-menu-item>
          <el-menu-item index="1-3">我发起的</el-menu-item>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <span>按类别</span>
          </template>
          <el-menu-item index="2-1">
            <el-badge is-dot class="item4">
              工程管理
            </el-badge>
          </el-menu-item>
          <!-- <el-menu-item index="2-2">内部工程</el-menu-item> -->
          <el-menu-item index="2-6">抄表开账</el-menu-item>
          <el-menu-item index="2-7">收费管理</el-menu-item>
          <el-menu-item index="2-3">客户管理</el-menu-item>
          <el-menu-item index="2-4">表计管理</el-menu-item>
          <el-menu-item index="2-8">客户通知</el-menu-item>
          <!-- <el-menu-item index="2-9"></el-menu-item> -->
          <!-- <el-menu-item index="2-5">报警通知</el-menu-item> -->
        </el-submenu>
      </el-menu>
    </div>

    <div class="mydestop-right">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" @submit.native.prevent>

        <el-form-item label="单据编号：" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.title" placeholder="单据编号" @keydown.enter.native="init"></el-input>
        </el-form-item>

        <!-- <div v-if="rightShow == '1-1' || rightShow == '1-2' || rightShow == '1-3'" class="applicationDate"> -->
           <el-form-item label="流程类别：" v-if="rightShow == '1-1' || rightShow == '1-2' || rightShow == '1-3'">
            <el-cascader ref="cascader" clearable v-model="tableQuery.processCode" @change="getBusinessArea"
                  :options="businessAreaData"
                  :show-all-levels="false"
                  :props="props">
            </el-cascader>
            </el-form-item>
        <!-- </div> -->

        <el-form-item class="button-group">
          <el-button class="searchBtn" icon="el-icon-search" @click="init"></el-button>
          <el-button type="primary" size="mini" @click="init" icon="el-icon-refresh">刷新</el-button>
        </el-form-item>

        <div v-if="rightShow != '1-1' && rightShow!='1-2' && rightShow!='1-3'" class="applicationDate">
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
          <div v-if="rightShow!='1-1'&&rightShow!='1-2'&&rightShow!='1-3'" class="applicationDate">
            <p class="">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</p>
            <ul>
              <!-- <li v-for="(v, i) in approvalDate" :key="i" @click="statusClick(i)" :statusindex="i">{{v}}</li> -->
              <el-button
                v-for="(v, i) in approvalDate"
                :key="i"
                size="mini"
                :type="approvalDateIndex === i ? 'primary' : 'info'"
                @click="statusClick(i)"
              >{{v}}</el-button>
            </ul>
          </div>

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

      <div class="myDeskConBtn" :style="{height: maxHeight + 'px'}">

          <el-table v-if="tableShow" :max-height="maxHeight" class=" kl-table" border stripe :data="listTable.list">

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
            <el-table-column v-if="rightShow == '1-2'" prop="endTime" min-width="120" label="结束时间"></el-table-column>
            <el-table-column prop="status" min-width="80" label="状态"></el-table-column>
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

    </div>

    <!-- 弹出审批界面 -->
    <processDialog :editNeedData="editNeedData" ref="processDialog" @close="closeDialog" />

  </div>
</template>
<script>
import processDialog from '@/components/processDialog'

export default {
  name: "mydestop",
  components: {
    processDialog
  },
  
  data() {
    return {
      approvalPageName: "办理",
      approvalPageVisible: false,
      // 详情页面所需数据
      editNeedData: {},
      businessArea: "", //"营业区域",
      businessAreaData: [], //营业区域
      total: 6,
      rightShow: "1-1",
      isActive: false, //控制高级查询内容的显示
      documentoOptions: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false
      },
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
            { label: "复表", value: "322" },
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
        }
        // {
        //     label: '基础信息',
        //     value: '7',
        //     children: [
        //         { label: '全部', value: '5', },
        //         { label: '水价管理', value: '321' },
        //     ]
        // },
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
          stepStart: "贺雄浩;巫洋彬;",
          stepEnd: "结算收款",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "停用",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "已办结",
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
        { label: "复表", value: "322" },
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
          stepStart: "王五;",
          stepEnd: "二次换表",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "一般"
        }
      ],
      //抄表开账
      MeterReadingRecord: [
        { label: "全部", value: "5" },
        { label: "抄表质量检查", value: "321" }
      ],
      listTableRecord: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "抄表质量检查",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        }
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
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "违约金减免",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "余额过户",
          themeTitle: "红冲",
          themeCon: "HH00001",
          stepStart: "张红",
          stepEnd: "部门组长审核",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "一般"
        }
      ],
      //客户通知
      CustomerNotCenter: [
        { label: "全部", value: "5" },
        { label: "通知公共", value: "321" },
        { label: "问卷调查", value: "321" }
      ],
      listTableNot: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "问卷调查",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        }
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

      //   申请人
      proposerOptions: [],
      //   办理状态
      processingStatus: "commission",
      //   表格的高度
      maxHeight: 0,
      //   控制表格的显示
      tableShow: false,
      //   关联类型
      associatedType: ["全部", "我发起的", "我经办的"],
      //   申请日期
      applicationDate: ["全部", "今天", "3天内", "7天内", "30天内", "指定时间"],
      //   单据状态
      // approvalDate: ["全部", "进行中", "已办结", "已废弃"],
      approvalDate: ["全部", "我发起的", "我待审的", "我参与的", "我已沟通的", "我已办的"],
      //  办理状态
      handleOptions: [
        { name: "全部", value: "1" },
        { name: "待办", value: "2" },
        { name: "已办", value: "3" }
      ],
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
      tabsActiveName: "home",
      listTable:{},
      listTableList: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张晓风",
          themeTitle: "用水咨询",
          themeCon: "SS00001",
          stepStart: "周新宇",
          stepEnd: "勘察",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张晓风",
          themeTitle: "停用",
          themeCon: "SS00001",
          stepStart: "周新宇",
          stepEnd: "停用",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张晓风",
          themeTitle: "销户",
          themeCon: "SS00001",
          stepStart: "周新宇",
          stepEnd: "销户",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "一般"
        },
        // {
        //     applicationTime:"2019-06-03 12.27",
        //     updateTime:"",
        //     applicationUser:"张燕",
        //     themeTitle:"余额过户",
        //     themeCon:"YY00001",
        //     stepStart:"贺雄浩;巫洋彬;周新宇",
        //     stepEnd:"余额过户",
        //     getAllConc:1,
        //     status:'进行中'  ,
        //     phoneNum:'紧急'
        // },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张三",
          themeTitle: "违约金减免",
          themeCon: "HH00001",
          stepStart: "周新宇",
          stepEnd: "违约金减免",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "紧急"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张晓风",
          themeTitle: "红冲",
          themeCon: "SS00001",
          stepStart: "周新宇",
          stepEnd: "红冲",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "紧急"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张晓风",
          themeTitle: "校表",
          themeCon: "SS00001",
          stepStart: "周新宇",
          stepEnd: "校表",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "紧急"
        }
      ],
      listTableList2: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张燕",
          themeTitle: "余额过户",
          themeCon: "YY00001",
          stepStart: "贺雄浩;巫洋彬;周新宇",
          stepEnd: "余额过户",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "紧急"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "违约金减免",
          themeCon: "HH00001",
          stepStart: "巫洋彬",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "紧急"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "违约金减免",
          themeCon: "HH00001",
          stepStart: "巫洋彬",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "进行中",
          phoneNum: "紧急"
        }
      ],
      listTableList3: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张燕",
          themeTitle: "用水安装",
          themeCon: "YY00001",
          stepStart: "贺雄浩;巫洋彬;",
          stepEnd: "结算收款",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "换表",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        }
      ],
      EngineeList: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张燕",
          themeTitle: "用水咨询",
          themeCon: "YY00001",
          stepStart: "贺雄浩;巫洋彬;",
          stepEnd: "勘察",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "用水安装",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "安装施工",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        }
      ],
      EngineeList: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "张燕",
          themeTitle: "用水咨询",
          themeCon: "YY00001",
          stepStart: "贺雄浩;巫洋彬;",
          stepEnd: "勘察",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "张三",
          themeTitle: "用水安装",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "安装施工",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        }
      ],
      launchList: [
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "",
          applicationUser: "周新宇",
          themeTitle: "余额过户",
          themeCon: "YY00001",
          stepStart: "贺雄浩;巫洋彬;周新宇",
          stepEnd: "余额过户",
          getAllConc: 1,
          status: "进行中",
          phoneNum: "紧急"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "周新宇",
          themeTitle: "用水安装",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "安装施工",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        },
        {
          applicationTime: "2019-06-03 12.27",
          updateTime: "2019-07-10 14:05",
          applicationUser: "周新宇",
          themeTitle: "换表",
          themeCon: "HH00001",
          stepStart: " ",
          stepEnd: "结束节点",
          getAllConc: 0,
          status: "已办结",
          phoneNum: "一般"
        }
      ],




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
        processCode: ''
      },
      // 我的待办流程类别下拉选择数据
      firstCascaderList: [],
      // 指定时间时的日期框显示与隐藏
      applyDateShow: false,
      Time: [],
      processCodeIndex: 0,
      applyDateIndex : 0,
      approvalDateIndex: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // this.common.changeTable(this, ".water-side .mydestop", [
      //   ".water-side .demo-form-inline",
      //   ".water-side .applicationDate",
      //   ".water-side .applicationDate"
      // ]);
      this.common.changeTable(this, ".mydestop-right", [
        ".mydestop-right .block",
        '.mydestop-right .searchInput',
        '.mydestop-right .applicationDate',
        '.mydestop-right .toggle-btn'
      ]);
    });

    if (localStorage.getItem("mordel") != undefined) {
      // 首页

      this.rightShow = localStorage.getItem("mordel");
      this.handleSelect(localStorage.getItem("mordel"));
    }
    this.init()
    this.selectBAreaOptions()
    this.getPubReceiptData()
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
        if(this.isActive) {
           this.common.changeTable(this, ".mydestop-right", [
            ".mydestop-right .block",
            '.mydestop-right .searchInput',
            '.mydestop-right .applicationDate',
            '.mydestop-right .advancedQuery',
            '.mydestop-right .toggle-btn'
          ]);
        } else {
           this.common.changeTable(this, ".mydestop-right", [
            ".mydestop-right .block",
            '.mydestop-right .searchInput',
            '.mydestop-right .applicationDate',
            '.mydestop-right .toggle-btn'
          ]);
        }
      })
    },
    selectBAreaOptions() {
      let _this = this;
      let params = {
        busicode: "PubReceiptTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          let data = this.getArr(res);
          _this.businessAreaData = data.children;
        });
    },
    // 切换菜单时重置查询条件
    tableQueryInit() {
      this.tableQuery = {
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
      }
      this.firstCascaderList = []
    },
    // 流程类别数据
    getPubReceiptData() {
      var _this = this
      var params = {
        "busicode": "PubReceiptSelect",
        "data": {}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.documentoOptions = res
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
        params: params
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
    // 流程类别数据选择后的数据处理
    getFirCascaderData(value) {
      this.tableQuery.setCode = value[1]
    },
    // 申请日期查询条件点击事件
    applyClick(index, disableRefresh = false) {
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
        !disableRefresh && this.init()
      } else {
        this.applyDateShow = true
        this.Time = []
      }
    },
    // 状态查询条件点击事件
    statusClick(index, disableRefresh = false) {
      // for (let i = 0; i < this.approvalDate.length; i++) {
      //   $('[statusindex=' + i + ']').css({ 'background': '#fff', 'color': '#000' })
      // }
      // $('[statusindex=' + index + ']').css({ 'background': '#328ed1', 'color': '#fff' })
      this.approvalDateIndex = index
      this.tableQuery.status = index
      !disableRefresh && this.init()
    },

    // 流程状态条件点击事件
    processCodeClick(item, index, disableRefresh = false) {
      // for (let i = 0; i < this.documentoOptions1.length; i++) {
      //   $('[processcodeindex=' + i + ']').css({ 'background': '#fff', 'color': '#000' })
      // }
      // $('[processcodeindex=' + index + ']').css({ 'background': '#328ed1', 'color': '#fff' })
      this.processCodeIndex = index
      this.tableQuery.processCode = item.value
      if(item.label === '全部') {
        delete this.tableQuery.processCode
      }
      !disableRefresh && this.init()
    },
    // 获取指定时间日期框的值
    getApplyDate(time) {
      this.tableQuery.startDate = time[0]
      this.tableQuery.endDate = time[1]
      this.init()
    },

    // 详情页面关闭方法
    closeDialog() {
      this.init()
    },
    handleSelect(key, keyPath) {
      this.rightShow = key;
      this.processCodeClick({value: 'all', label: '全部'}, 0, true)
      if (key == "1-1") {
        //待办
        // this.documentoOptions = this.dOptions;
        // this.listTable = this.listTableList;

        this.tableQueryInit()

        this.tableQuery.type = 2
        this.applyClick(0, true)
        this.statusClick(0, true)
      } else if (key == "1-2") {
        //已办
        // this.documentoOptions = this.dOptions;
        // this.listTable.list = this.listTableList2;

        this.tableQueryInit()

        this.tableQuery.type = 5
        this.applyClick(0, true)
        this.statusClick(0, true)
      } else if (key == "1-3") {
        //我发起的
        // this.documentoOptions = this.dOptions;
        // this.listTable.list = this.launchList;

        this.tableQueryInit()

        this.tableQuery.type = 1
        this.applyClick(0, true)
        this.statusClick(0, true)
      } else if (key == "2-1") {
        //工程管理
        this.listTable.list = this.EngineeList;
        this.tableQuery.category = 'pj'
        this.tableQuery.type = 0
        this.getCategory('pj')
      } else if (key == "2-3") {
        //客户管理
        this.listTable.list = this.listTableCustomer;
        this.tableQuery.category = 'user'
        this.tableQuery.type = 0
        this.getCategory('user')
      } else if (key == "2-4") {
        //表计管理
        this.listTable.list = this.listTableMeter;
        this.tableQuery.category = 'ms'
        this.tableQuery.type = 0
        this.getCategory('ms')
      } else if (key == "2-6") {
        //抄表开账
        this.listTable = this.listTableRecord;
        this.tableQuery.category = 'mr'
        this.tableQuery.type = 0
        this.getCategory('mr')
      } else if (key == "2-7") {
        //收费管理
        this.listTable.list = this.listTableCharge;
        this.tableQuery.category = 'bill'
        this.tableQuery.type = 0
        this.getCategory('bill')
      } else if (key == "2-8") {
        //客户通知
        this.listTable.list = this.listTableNot;
        this.tableQuery.category = 'notice'
        this.tableQuery.type = 0
        this.getCategory('notice')
      }
      this.init()
    },
     //营业区域
    getBusinessArea(val) {
      val = this.common.handleTreeData(val);
      return val;
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map((i) => {
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
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose() { },

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
    },

    //   详情
    details(index, row) {
      this.editNeedData = row
      this.editNeedData.id = row.billId
      this.editNeedData.saveType = 'edit'
      this.$refs.processDialog.open(row.processCode, this.editNeedData)

      // if (row.processCode == 'bill_add_cost') {// 收费管理-财务调整-应收追加
      //   this.editNeedData.busicode = 'FnAddCostUpdate'
      //   this.approvalPageName = '应收追加'
      // } else if (row.processCode == 'bill_other_charge') {// 收费管理-财务调整-其他收费
      //   this.editNeedData.busicode = 'OtherChageUpdate'
      //   this.approvalPageName = '其他收费'
      // } else if (row.processCode == 'bill_add_penalty') {// 收费管理-财务调整-举报罚款
      //   this.editNeedData.busicode = 'FnAddAppendUpdate'
      //   this.approvalPageName = '举报罚款'
      // } else if (row.processCode == 'bill_penalty_remission') {// 收费管理-财务调整-违约金减免
      //   this.editNeedData.busicode = 'FnPenaltyRemissionUpdate'
      //   this.approvalPageName = '违约金减免'
      // } else if (row.processCode == 'bill_bad_debts_1') {// 收费管理-财务调整-呆账处理
      //   this.editNeedData.busicode = 'FnBadDebtsUpdate'
      //   this.approvalPageName = '呆账处理'
      // } else if (row.processCode == 'bill_bad_debts_2') {// 收费管理-财务调整-坏账报损
      //   this.editNeedData.busicode = 'FnBadDebtsUpdate'
      //   this.approvalPageName = '坏账报损'
      // } else if (row.processCode == 'bill_rush_red_1') {// 收费管理-财务调整-实收减免
      //   this.editNeedData.busicode = 'FnRushRedUpdate'
      //   this.approvalPageName = '实收减免'
      // } else if (row.processCode == 'bill_rush_red_2') {// 收费管理-财务调整-水量红冲
      //   this.editNeedData.busicode = 'FnRushRedUpdate'
      //   this.approvalPageName = '水量红冲'
      // } else if (row.processCode == 'bill_cancel_curr_month') {// 收费管理-财务调整-取消当月收费
      //   this.editNeedData.busicode = 'CancelCurrMonthUpdate'
      //   this.approvalPageName = '取消当月收费'
      // } else if (row.processCode == 'bill_balance_out') {// 收费管理-余额管理-余额取出
      //   this.editNeedData.busicode = 'FnBalanceOutUpdate'
      //   this.approvalPageName = '余额取出'
      // } else if (row.processCode == 'bill_balance_assigned') {// 收费管理-余额管理-余额过户
      //   this.editNeedData.busicode = 'FnBalanceAssignedUpdate'
      //   this.approvalPageName = '余额过户'
      // } else if (row.processCode === 'ms_chg_plan_1') {
      //   this.editNeedData.busiCode === 'FnChgPlanUpdate'
      //   this.approvalPageName = '换表'
      // } else if(row.processCode === 'ms_reuse') {
      //   this.editNeedData.busiCode === 'FnMsReuseUpdate'
      //   this.approvalPageName = '复表'
      // } else if(row.processCode === 'ms_verify') {
      //   this.editNeedData.busiCode === 'FnMsVerifyUpdate'
      //   this.approvalPageName = '用户复核'
      // } else if(row.processCode === 'ms_repair') {
      //   this.editNeedData.busiCode === 'FnMsRepairUpdate'
      //   this.approvalPageName = '维检'
      // } else if(row.processCode === 'ms_in_plan') {
      //   this.editNeedData.busiCode = 'FnMsInPlanUpdate'
      //   this.approvalPageName = '水表注册'
      // } else if(row.processCode === 'ms_chg_plan_2') {
      //   this.editNeedData.busiCode = 'FnMsChgPlanUpdate'
      //   this.approvalPageName = '拆表审批'
      // } else if(row.processCode === 'ms_info_change') {
      //   this.editNeedData.busiCode = 'FnInfoChange'
      //   this.approvalPageName = '水表变更单据'
      // } else if(row.processCode === 'pj_consult') {
      //   this.editNeedData.busiCode = 'FnPjConsult'
      //   this.approvalPageName = '用水咨询'
      // } else if(row.processCode === 'pj_install') {
      //   this.editNeedData.busiCode = 'FnPjInstall'
      //   this.approvalPageName = '用水安装'
      // } else if(row.processCode === 'pj_internal') {
      //   this.editNeedData.busiCode = 'FnPjInternal'
      //   this.approvalPageName = '内部工程'
      // } else if(row.processCode === 'user_change') {
      //   this.editNeedData.busiCode = 'FnUserChange'
      //   this.approvalPageName = '变更'
      // } else if(row.processCode === 'user_close') {
      //   this.editNeedData.busiCode = 'FnUserClose'
      //   this.approvalPageName = '销户'
      // } else if(row.processCode === 'user_reuse') {
      //   this.editNeedData.busiCode = 'FnUserReuse'
      //   this.approvalPageName = '复用'
      // } else if(row.processCode === 'user_stop') {
      //   this.editNeedData.busiCode = 'FnUserStop'
      //   this.approvalPageName = '停用'
      // } else if(row.processCode === 'user_transfer') {
      //   this.editNeedData.busiCode = 'FnUserTransfer'
      //   this.approvalPageName = '过户'
      // } else if(row.processCode === 'user_open') {
      //   this.editNeedData.busiCode = 'FnUserOpen'
      //   this.approvalPageName = '开户'
      // }

    },

    tabsShow(val) {
      this.tabsActiveName = val;
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
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".mydestop-right", [
          ".mydestop-right .toolbar",
          ".mydestop-right .block",
          '.mydestop-right .searchInput',
          '.mydestop-right .applicationDate',
          '.mydestop-right .toggle-btn'
        ]);
      });
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    isActive(val) {
      this.$nextTick(() => {
        if(val) {
          this.common.changeTable(this, ".mydestop-right", [
            ".mydestop-right .block",
            '.mydestop-right .searchInput',
            '.mydestop-right .applicationDate',
            '.mydestop-right .advancedQuery',
            '.mydestop-right .toggle-btn'
          ]);
        } else {
          this.common.changeTable(this, ".mydestop-right", [
            ".mydestop-right .block",
            '.mydestop-right .searchInput',
            '.mydestop-right .applicationDate',
            '.mydestop-right .toggle-btn'
          ]);
        }
      })
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
.mydestop {
  height: calc(100% - 50px);
  background: #eaf4ff;
  padding-top: 10px;

  .mydestop-left {
    height: 100%;
    width: 200px;
    float: left;
    position: relative;
    background: #fff;
    .item2 {
      .el-badge__content {
        right: 0px;
        top: 16px;
        left: 19px;
      }
    }
    .item4 {
      .el-badge__content {
        right: 0px;
        top: 16px;
        left: 49px;
      }
    }
    // .el-badge__content.is-fixed.is-dot{
    //     right: 0px;
    //     top: 23px;
    //     left: 116px;
    // }
    .el-menu-vertical {
      .el-submenu {
        font-weight: 700;
      }
      .el-menu-item {
        font-weight: 700;
      }
      .el-menu-item:focus,
      .el-menu-item:hover,
      .el-menu-item.is-active {
        color: #fff;
        background: #297acc;
      }
    }
  }
  .mydestop-right {
    // height: calc(100% - 20px);
    // width: calc(100% - 230px);
    height: 100%;
    width: calc(100% - 210px);
    position: relative;
    float: left;
    background: #fff;
    margin-left: 10px;
    padding: 10px;
   .button-group{
     margin-bottom: 0px;
   }
    .block {
      text-align: right;
      padding: 10px 0px;
    }
    .advancedQuery {
      border-bottom: 1px solid transparent;
      .applicationDate {
        border-top: 1px dashed #ccc;
        border-bottom: 1px solid transparent;
        &:nth-child(2) {
          margin-bottom: 1px;
        }
      }
      
    }
  }
  .btn-right {
    float: right;
  }
  .isactive {
    color: #328ed1;
    font-weight: 700;
    height: 20px;
    line-height: 20px;
    & > .el-form-item__label {
      color: #328ed1;
      font-weight: 700;
    }
  }

  .el-input .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  .applicationDate {
    padding-top: 8px;
    width: 100%;
    border-bottom: 1px solid transparent;

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
  .kl-table{
    margin-top: 25px;
  }
  .water-side-left,
  .water-side-center,
  .water-side-right {
    float: left;
    height: 100%;
  }

  .home {
    width: 100%;
    height: 100%;
    &:after {
      @include _clearBoth();
    }
    .water-side-con {
      width: 100%;
      height: 100%;
      zoom: 1;
      &:after {
        @include _clearBoth();
      }
    }
    .water-side-center {
      width: 55%;
      margin-right: 20px;
      height: 100%;
      & > .water-side-pie {
        width: 100%;
        height: 40%;
        zoom: 1;
        &:after {
          @include _clearBoth();
        }
        & > li {
          padding-top: 10px;
          text-align: center;
          height: 86%;
          width: 50%;
          margin: auto;
        }
      }
      & > .water-side-centerCategory {
        width: 100%;
        height: 60%;
        padding-left: 20px;
        #CategoryCustom {
          width: 100%;
          height: 90%;
        }
      }
    }
    .water-side-right {
      width: 40%;
      padding: 15px;
      height: 96%;
      .table-top {
        margin-top: 20px;
      }
    }
    .el-table .el-table__body tr .cell:nth-child(1) {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-tabs__header.is-top {
    margin: 0px;
  }
  .el-tabs.el-tabs--border-card.el-tabs--top {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 68px);
      #pane-home {
        height: 100%;
        .reportCenterCon {
          height: 100%;
        }
      }
    }
  }
}
</style>
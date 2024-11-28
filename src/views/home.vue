<template>
  <div class="custom-home">
    <header>
      <first-Nav :firstNav="firstNav" @changeNav="changeNav">
        <div class="leftItem header-top-right">
          <!-- <el-select v-model="curWaterCode" @change="sendCompany">
              <el-option
                  v-for="item in companyData"
                  :key="item.interiorCode"
                  :label="item.shortName"
                  :value="item.interiorCode">
              </el-option>
            </el-select> -->
          <!-- <img class="menu_img menu1" :src="'../assets/images/Home-active'+ i + '.png'" @click="getSecondMenu('Home')" alt="" > -->
          <img class="menu_img menu1 60a28fae7a4147cc97e17ff7e13fcc2b" src="../assets/images/Home-active.png" @click="getSecondMenu('Home')" alt="">
          <img class="menu_img menu2 c6eb39027c044fff8ba482b7008e247c" src="../assets/images/Workbench.png" @click="getSecondMenu('Workbench')" alt="">
          <img class="menu_img menu3 791f2a642d0e4dd5bd15e1fd866e8c6d" src="../assets/images/Business.png" @click="getSecondMenu('Business')" alt="">
          <img class="menu_img menu4 b45c456c8ca44c6089974bb91a513a2a" src="../assets/images/Statistical.png" @click="getSecondMenu('Statistical')" alt="">
          <img class="menu_img menu5 8a752c9fb18c4d74a7350836b4abc17b" src="../assets/images/Basics.png" @click="getSecondMenu('Basics')" alt="">
          <img class="menu_img menu6 7d98780c7b634eaf9359117171d9634f" src="../assets/images/system.png" @click="getSecondMenu('system')" alt="">
          <img class="menu_img menu7 c7005aa2e31241f1ad06777a76d5b041" src="../assets/images/searchUser.png" @click="jump" alt="">
          <div class="loginArea">

            <div class="user-company">
              <!-- <div class="user-name">周新宇</div> -->
              <el-select class="company-select" v-model="curWaterCode" placeholder="请选择" @change="switchCompany">
                <el-option v-for="item in companyData" :key="item.companyNo" :label="item.shortName" :value="item.companyNo">
                </el-option>
              </el-select>
            </div>
            <!-- <img :src=" userInfo.photourl" alt @mouseover="changeStyle" @mouseout="restStyle"> -->
            <span class="userName" @mouseover="changeStyle" @mouseout="restStyle">{{userData.userName}}</span>
            <div class='infoPop'>
              <div class="loginout" @click="loginout">[退出登录]</div>
            </div>
          </div>
        </div>
      </first-Nav>
    </header>
    <aside v-if="menuShow" class="primary-menu">
      <aside class="kl-aside">
        <!-- 业务办理 -->
        <second-Nav :secondNav="businessMenu.secondNav1" v-if="menuShowData.businessMenuShow1"></second-Nav>
        <second-Nav :secondNav="businessMenu.secondNav2" v-if="menuShowData.businessMenuShow2"></second-Nav>
        <second-Nav :secondNav="businessMenu.secondNav3" v-if="menuShowData.businessMenuShow3"></second-Nav>
        <second-Nav :secondNav="businessMenu.secondNav4" v-if="menuShowData.businessMenuShow4"></second-Nav>
        <second-Nav :secondNav="businessMenu.secondNav5" v-if="menuShowData.businessMenuShow5"></second-Nav>
        <second-Nav :secondNav="businessMenu.secondNav6" v-if="menuShowData.businessMenuShow6"></second-Nav>
        <!-- 基础信息 -->
        <second-Nav :secondNav="basicsMenu.secondNav1" v-if="menuShowData.basicsMenuShow1"></second-Nav>
        <second-Nav :secondNav="basicsMenu.secondNav2" v-if="menuShowData.basicsMenuShow2"></second-Nav>
        <second-Nav :secondNav="basicsMenu.secondNav3" v-if="menuShowData.basicsMenuShow3"></second-Nav>
        <second-Nav :secondNav="basicsMenu.secondNav4" v-if="menuShowData.basicsMenuShow4"></second-Nav>
        <second-Nav :secondNav="basicsMenu.secondNav5" v-if="menuShowData.basicsMenuShow5"></second-Nav>
        <second-Nav :secondNav="basicsMenu.secondNav6" v-if="menuShowData.basicsMenuShow6"></second-Nav>
        <!-- 统计报表 -->
        <second-Nav :secondNav="reportMenu.secondNav1" v-if="menuShowData.reportMenuShow1"></second-Nav>
        <second-Nav :secondNav="reportMenu.secondNav2" v-if="menuShowData.reportMenuShow2"></second-Nav>
        <second-Nav :secondNav="reportMenu.secondNav3" v-if="menuShowData.reportMenuShow3"></second-Nav>
        <second-Nav :secondNav="reportMenu.secondNav4" v-if="menuShowData.reportMenuShow4"></second-Nav>
        <second-Nav :secondNav="reportMenu.secondNav5" v-if="menuShowData.reportMenuShow5"></second-Nav>
      </aside>
      <div class="collapse" @click="collapse">
        <i class="el-icon-arrow-left leftChange"></i>
      </div>
    </aside>
    <section class="kl-container  aside-show-css">
      <div class="kl-main loadingHiden" style="margin-left: 0px;" id="main-home">
        <router-view v-if='isRouterAlive'></router-view>
      </div>
    </section>
  </div>
</template>
<script>
import WaterSideIndex from './WaterSideIndex/index'
import axios from 'axios'
export default {
  name: "custom-home",
  components: {
    WaterSideIndex,
  },
  data() {
    return {
      firstNav: {
        //系统名称
        title: '工程报装系统',
        //logo路径
        // logoSrc: require('../assets/images/logo3.png'),
         logoSrc: require('../assets/images/logo5.png'),
        // logoSrc: require('../assets/images/shanke.png'),
        //导航
        navData: {
          navList: [
          ],
          //默认路径
          activeChanel: '/CenterSideIndex',
        },
      },
      // 显示侧边栏
      menuShowData: {
        //工程管理
        businessMenuShow1: false,
        businessMenuShow2: false,
        businessMenuShow3: false,
        businessMenuShow4: false,
        businessMenuShow5: false,
        businessMenuShow6: false,
        // 基础信息
        basicsMenuShow1: false,
        basicsMenuShow2: false,
        basicsMenuShow3: false,
        basicsMenuShow4: false,
        basicsMenuShow5: false,
        basicsMenuShow6: false,
        // 统计报表
        reportMenuShow1: false,
        reportMenuShow2: false,
        reportMenuShow3: false,
        reportMenuShow4: false,
        reportMenuShow5: false,
      },
      // 业务办理侧边栏菜单
      businessMenu: {
        // 工程管理
        secondNav1: {
          navList: [
            {
              NavName: "用户工程",
              icon: "waterQuery0",
              type: 'submenu',
              url: "/EngineeringManagement/waterQuery",
              opCode: "e2c019ae50c44f62b9f276269c1870b8",
              children: [
                {
                  type: 'firstmenu',
                  icon: "waterQuery1",
                  children: [],
                  NavName: "用水咨询",
                  url: "/EngineeringManagement/waterQuery",
                  opCode: "87def74381294c47b2c79b12139b850f",
                },
                {
                  type: 'firstmenu',
                  icon: "waterQuery2",
                  children: [],
                  NavName: "用水安装",
                  url: "/EngineeringManagement/waterMeterInstall",
                  opCode: "6923c8c57a964a85ade24168b4c63d6e",
                },
              ],
            },
            {
              NavName: "内部工程",
              icon: "insideAllProjects0",
              type: 'firstmenu',
              children: [],
              url: "/EngineeringManagement/insideAllProjects",
              opCode: "ad6b66d680814a7ea3e24261cc12ee9d",
            },
             {
              NavName: "工改系统",
              icon: "insideAllProjects0",
              type: 'firstmenu',
              children: [],
              url: "/EngineeringManagement/companyEditProjects",
              opCode: "de44fbd7-1dd0-4ede-bd57-66cf2264f194",
            },
          ]
        },
        // 客户管理
        secondNav2: {
          navList: [
            {
              NavName: "查询",
              type: 'firstmenu',
              icon: "userInfo0",
              children: [],
              url: "/CustomerManagement/userInfo",
              opCode: "207b63cd496e413992196f9bd28a1176",
            },
            {
              NavName: "开户",
              icon: "OpenAccount0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/OpenAccount",
              opCode: "513e8ff05b8c460d881cad3cdd10e863",
            },
            {
              NavName: "过户",
              icon: "Transfer0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/Transfer",
              opCode: "88e611c5a8e34f74b33935824d3cb348",
            },
            {
              NavName: "并户",
              icon: "IncorporativeAccount0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/IncorporativeAccount",
              opCode: "586d1bfb836e455599e1c06c0e3f31cf",
            },
            {
              NavName: "拆户",
              icon: "ApartAccount0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/ApartAccount",
              opCode: "3b11d74a-fd57-4671-8611-4bf6befbbee8",
            },
            {
              NavName: "停用",
              icon: "DiscontinueUse0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/DiscontinueUse",
              opCode: "af16394e632349eb855803480c52b4fd",
            },
            {
              NavName: "复用",
              icon: "multiplexing0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/multiplexing",
              opCode: "dc01a2b75d9842b6a9717967d0d6430a",
            },
            {
              NavName: "销户",
              icon: "SalesAccount0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/SalesAccount",
              opCode: "46c018bf3d2a4655a89757ce577f2a32",
            },
            {
              NavName: "变更",
              icon: "CustomerChange0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/CustomerChange",
              opCode: "62ac9e7dab8544289bd4f890d0095b16",
            },
            {
              NavName: "快速变更",
              icon: "quickCustomerChange0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerManagement/quickCustomerChange",
              opCode: "d8ea7e29e55246a0836030cb1ecf6f44",
            },
          ]
        },
        // 抄表开账
        secondNav3: {
          navList: [
            {
              NavName: "抄表",
              icon: "MeterReadingRecord0",
              type: 'submenu',
              url: "/MeterReading/MeterReadingRecord",
              opCode: "7ac7725b423c4d2d8f7a587b4682006e",
              children: [
                {
                  NavName: "抄表录入",
                  type: 'firstmenu',
                  icon: "MeterReadingRecord1",
                  children: [],
                  url: "/MeterReading/MeterReadingRecord",
                  opCode: "d84d646f3b13448ba85c61685b0fc4c9"
                },
                {
                  NavName: "抄表轨迹",
                  type: 'firstmenu',
                  icon: "MeterReadingRecord2",
                  children: [],
                  url: "/MeterReading/MeterReadingTrack",
                  opCode: "3a54d42881b44c6bab8c4b69799bebc9",
                },
                {
                  NavName: "打印抄表卡",
                  type: 'firstmenu',
                  icon: "MeterReadingRecord3",
                  children: [],
                  url: "/MeterReading/PrintMeterReadingCard",
                  opCode: "33f7223e232d4b72809bc65346c9af64",
                },
                {
                  NavName: "抄表修改",
                  type: 'firstmenu',
                  icon: "MeterReadingRecord4",
                  children: [],
                  url: "/MeterReading/PrivilegeModification",
                  opCode: "56342f72f27f48b1aabe630a778f8740",
                },
              ],

            },
            {
              NavName: "检查",
              icon: "AnomalyAnalysis0",
              type: 'submenu',
              url: "/MeterReading/AnomalyAnalysis",
              opCode: "51203f562ab24b1e86e2da34d3d5cc6b",
              children: [
                {
                  NavName: "水量异常",
                  type: 'firstmenu',
                  icon: "AnomalyAnalysis1",
                  children: [],
                  url: "/MeterReading/AnomalyAnalysis",
                  opCode: "80e52be506014a90a11613a87818fb95",
                },
                {
                  NavName: "水表异常",
                  type: 'firstmenu',
                  icon: "AnomalyAnalysis2",
                  children: [],
                  url: "/MeterReading/AbnormalVerification",
                  opCode: "05e57f7d2a2a4b0fae043f082d4f28f5",
                },
                {
                  NavName: "费用异常",
                  type: 'firstmenu',
                  icon: "AnomalyAnalysis3",
                  children: [],
                  url: "/MeterReading/AbnormalExpenses",
                  opCode: "0c832b76431f438fb706bf23b470b272",
                },
                {
                  NavName: "抄表抽查",
                  type: 'firstmenu',
                  icon: "AnomalyAnalysis4",
                  children: [],
                  url: "/MeterReading/QualityReading",
                  opCode: "eef70cc6f7ce49458f535182e9ac27b2",
                },
              ],

            },
            {
              NavName: "开账",
              icon: "BatchOpening0",
              type: 'firstmenu',
              children: [],
              url: "/MeterReading/BatchOpening",
              opCode: "771edaec1fd7458a9404169b8f1abac0",
            },
            {
              NavName: "打印管理",
              icon: "InfoCopy0",
              type: 'submenu',
              url: "/MeterReading/InfoCopy",
              opCode: "2c3ef39e45824ebfb2eec4c4a884c045",
              children: [
                {
                  NavName: "账单打印",
                  type: 'firstmenu',
                  icon: "InfoCopy1",
                  children: [],
                  url: "/MeterReading/InfoCopy",
                  opCode: "2b9cc8cbf72e487da37e44eb207e9fd6",
                },
                {
                  NavName: "欠费催缴单",
                  type: 'firstmenu',
                  icon: "InfoCopy2",
                  children: [],
                  url: "/MeterReading/ArrearageCollection",
                  opCode: "ab8b623a45fc4ad2ab559f9c40d0eceb",
                },
              ],
            },
            {
              NavName: "统计",
              icon: "TotalScoreAnalysis0",
              type: 'submenu',
              url: "/MeterReading/TotalScoreAnalysis",
              opCode: "01caef7eaf9a47909d72c522ddffa689",
              children: [
                {
                  NavName: "总分分析",
                  type: 'firstmenu',
                  icon: "TotalScoreAnalysis1",
                  children: [],
                  url: "/MeterReading/TotalScoreAnalysis",
                  opCode: "ef865fc3585c4b84bbc88a0fd184f9a8",
                },
                {
                  NavName: "用水分析",
                  type: 'firstmenu',
                  icon: "TotalScoreAnalysis2",
                  children: [],
                  url: "/MeterReading/Statistics",
                  opCode: "8cfbcec07a86431b83e6b8f793328d98",
                },
              ],
            },
            {
              NavName: "计划维护",
              icon: "BookAdjustment0",
              type: 'submenu',
              url: "/MeterReading/BookAdjustment",
              opCode: "02872482fa694eeeb8e06d5faa199ac9",
              children: [
                {
                  NavName: "表册调整",
                  type: 'firstmenu',
                  icon: "BookAdjustment1",
                  children: [],
                  url: "/MeterReading/BookAdjustment",
                  opCode: "9cf32acab27a4a15bcf8fd00267f5b2d",
                },
                {
                  NavName: "抄表计划",
                  type: 'firstmenu',
                  icon: "BookAdjustment2",
                  children: [],
                  url: "/MeterReading/PlanAdjustment",
                  opCode: "b1e31f719a6a404d8701d3182c3a0ba8",
                },
                {
                  NavName: "抄表路线",
                  type: 'firstmenu',
                  icon: "BookAdjustment3",
                  children: [],
                  url: "/MeterReading/MeterReadingCircuit",
                  opCode: "3d2807815ef043909d785030b36f2943",
                },
                {
                  NavName: "表阀门管理",
                  type: 'firstmenu',
                  icon: "BookAdjustment4",
                  children: [],
                  url: "/MeterReading/TableValveManagement",
                  opCode: "768724eec9e04f488240ffa38af6562e",
                },
              ],

            },
          ],
        },
        // 收费管理
        secondNav4: {
          navList: [
            {
              NavName: "收费查询",
              type: 'firstmenu',
              icon: "TollInquiry0",
              children: [],
              url: "/ChargeManagement/TollInquiry",
              opCode: "73d47cd94de84db7ab581a20c60990bd",
            },
            {
              NavName: "银行代扣",
              icon: "BankCharges0",
              type: 'firstmenu',
              url: "/ChargeManagement/BankCharges",
              opCode: "8fcf41f039f74417be0897a55de86b02",
              children: [
                {
                  NavName: "代扣签约",
                  type: 'firstmenu',
                  icon: "BankCharges1",
                  children: [],
                  url: "/ChargeManagement/BankChargesSign",
                  opCode: "",
                },
                {
                  NavName: "银行签约",
                  type: 'firstmenu',
                  icon: "BankCharges2",
                  children: [],
                  url: "/ChargeManagement/BankSign",
                  opCode: "",
                },
              ],
            },
            /*{
              icon: "FinancialCenter3",
              type: 'firstmenu',
              children: [],
              url: "/ChargeManagement/ManualCollection",
              NavName: "手工托收"
            },*/
            {
              NavName: "收款对账",
              icon: "UnionPay0",
              type: 'submenu',
              url: "/ChargeManagement/UnionPay",
              opCode: "5baa456d3f524842860ad684d072fb04",
              children: [
                {
                  NavName: "互联网对账",
                  type: 'firstmenu',
                  icon: "UnionPay1",
                  children: [],
                  url: "/ChargeManagement/UnionPay",
                  opCode: "482e57b06b784ff29ae5533e390d89ea",
                },
                {
                  NavName: "日收款对账",
                  type: 'firstmenu',
                  icon: "UnionPay2",
                  children: [],
                  url: '/ChargeManagement/DailyReconciliation',
                  opCode: "94a187e5c033498e9a7f540a541e6500",
                },
              ],
            },
            {
              NavName: "账务调整",
              icon: "FinancialAdjustment0",
              type: 'submenu',
              url: "/ChargeManagement/FinancialAdjustment",
              opCode: "53325fc21fca4fdb993b1391f4ffe84a",
              children: [
                {
                  NavName: "应收追加",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment1",
                  children: [],
                  url: "/ChargeManagement/FinancialAdjustment",
                  opCode: "500c4e8342e9429bb726dc328d9006ad",
                },
                {
                  NavName: "其他收费",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment2",
                  children: [],
                  url: "/ChargeManagement/OtherCharges",
                  opCode: "401ecbdad47f45a99b0cd73dcb3c448f",
                },
                {
                  NavName: "举报罚款",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment3",
                  children: [],
                  url: '/ChargeManagement/Recover',
                  opCode: "1a43eab6d1a74346b55e91be2e3208bc",
                },
                {
                  NavName: "违约金减免",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment4",
                  children: [],
                  url: "/ChargeManagement/LiquidatedDamages",
                  opCode: "ec4b26b684d54184a64e85eff97a16bd"
                },
                {
                  NavName: "呆账处理",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment5",
                  children: [],
                  url: "/ChargeManagement/DealingBadDebts",
                  opCode: "86361fe5dc8c46298e15fecbf036cf4b",
                },
                {
                  NavName: "坏账报损",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment6",
                  children: [],
                  url: "/ChargeManagement/ReportingBadDebts",
                  opCode: "7892107a19214df1a4c70fd5d2101292",
                },
                {
                  NavName: "实收减免",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment7",
                  children: [],
                  url: "/ChargeManagement/RedFlushing",
                  opCode: "f66ecd2aaefc4053b3a5627b25405d46",
                },
                {
                  NavName: "水量红冲",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment8",
                  children: [],
                  url: "/ChargeManagement/waterFlushing",
                  opCode: "9cd52423df7e43fbbec2a4592fa74c45",
                },
                {
                  NavName: "取消当月收费",
                  type: 'firstmenu',
                  icon: "FinancialAdjustment9",
                  children: [],
                  url: "/ChargeManagement/CancellMonthly",
                  opCode: "59712ad471b34615a98bdaa6bd4506ca",
                },
              ],
            },
            {
              NavName: "余额管理",
              icon: "BalanceWithdrawal0",
              type: 'submenu',
              url: "/ChargeManagement/BalanceWithdrawal",
              opCode: "3d130c884ab94100b869a18f0649acfa",
              children: [
                {
                  NavName: "余额取出",
                  type: 'firstmenu',
                  icon: "BalanceWithdrawal1",
                  children: [],
                  url: "/ChargeManagement/BalanceWithdrawal",
                  opCode: "b8b387459a8b450b8e5d14744d751862",
                },
                {
                  NavName: "余额过户",
                  type: 'firstmenu',
                  icon: "BalanceWithdrawal2",
                  children: [],
                  url: '/ChargeManagement/BalanceTransfer',
                  opCode: "e74078584d8f46b2afd8a38340750fc6",
                },
              ],
            },
            {
              NavName: "月结",
              icon: "FinancialManagement0",
              type: 'firstmenu',
              children: [],
              url: "/ChargeManagement/FinancialManagement",
              opCode: "a973220cfc9344c8920029e4c684ce55",
            },
            {
              NavName: "代收支付关闭",
              icon: "ClosingCollectionPayment0",
              type: 'firstmenu',
              children: [],
              url: "/ChargeManagement/ClosingCollectionPayment",
              opCode: "81eb6772b5c343f99db02e896c86b8a9",
            },
            {
              NavName: "票据管理",
              icon: "BillManagement0",
              type: 'submenu',
              url: "/ChargeManagement/BillManagement",
              opCode: "c1c11e54aaf14911ad6041f8a5c3969c",
              children: [
                {
                  NavName: "票据注册",
                  type: 'firstmenu',
                  icon: "BillManagement1",
                  children: [],
                  url: "/ChargeManagement/BillManagement",
                  opCode: "ffcb49cd01f14ebe97a651c8eff14f7c",
                },
                {
                  NavName: "票据领用",
                  type: 'firstmenu',
                  icon: "BillManagement2",
                  children: [],
                  url: "/ChargeManagement/InvoiceAcquisition",
                  opCode: "07b81fd0f34648d5aa035127408b2d18",
                },
                {
                  NavName: "票据调用",
                  type: 'firstmenu',
                  icon: "BillManagement3",
                  children: [],
                  url: "/ChargeManagement/InvoiceBorrowing",
                  opCode: "4fd06a669d524f0298c858937a0df3c7",
                },
                {
                  NavName: "票据修改",
                  type: 'firstmenu',
                  icon: "BillManagement4",
                  children: [],
                  url: "/ChargeManagement/InvoiceInvalidated",
                  opCode: "11a81d2d6c1849309660aa45fe551ec2",
                },
                {
                  NavName: "票据交票",
                  type: 'firstmenu',
                  icon: "BillManagement5",
                  children: [],
                  url: "/ChargeManagement/InvoicePayment",
                  opCode: "57754e64d834438ca4f15e60ef89a7ba",
                },
                {
                  NavName: "票据查询",
                  type: 'firstmenu',
                  icon: "BillManagement6",
                  children: [],
                  url: "/ChargeManagement/InvoiceSearch",
                  opCode: "ca8e66b04cbd449e8cb3db5f7572abdd",
                },
              ],
            },
            {
              NavName: "价格管理",
              icon: "WaterPrice0",
              type: 'submenu',
              url: "/ChargeManagement/WaterPrice",
              opCode: "0517b9eac3f44a2ca18f92b34a198b9e",
              children: [
                {
                  NavName: "用水价格",
                  type: 'firstmenu',
                  icon: "WaterPrice1",
                  children: [],
                  url: "/ChargeManagement/WaterPrice",
                  opCode: "ea9cacb5db7b4c358cbdf6a69350250a",
                },
                // {
                //   type: 'firstmenu',
                //   icon: "BusinessArea9-2",
                //   children: [],
                //   NavName: "计费策略",
                //   url: "/ChargeManagement/PriceInfo"
                // },
                {
                  NavName: "用水类型",
                  type: 'firstmenu',
                  icon: "WaterPrice2",
                  children: [],
                  url: "/ChargeManagement/WaterType",
                  opCode: "271d96f7f4484fe1a3f3a3df8c8cbd5f",
                },
                {
                  NavName: "优惠策略",
                  type: 'firstmenu',
                  icon: "WaterPrice3",
                  children: [],
                  url: "/ChargeManagement/CheapStrategy",
                  opCode: "59d724700b1941f5a53427d17808e481",
                },
                {
                  NavName: "违约策略",
                  type: 'firstmenu',
                  icon: "WaterPrice4",
                  children: [],
                  url: "/ChargeManagement/BreakSet",
                  opCode: "b4f873c5c17a4140b19ca797813b5210",
                },
                {
                  NavName: "垃圾费定价",
                  type: 'firstmenu',
                  icon: "WaterPrice5",
                  children: [],
                  url: "/ChargeManagement/GarbagePricing",
                  opCode: "6ef2ef9e477b481c8d0f72bd0964b89a",
                },
                {
                  NavName: "垃圾费免收",
                  type: 'firstmenu',
                  icon: "WaterPrice6",
                  children: [],
                  url: "/ChargeManagement/GarbageFree",
                  opCode: "6c4cbb309ff548069927e385eefab6ae",
                },
                // {
                //   type: 'firstmenu',
                //   icon: "FinancialCenter9-10",
                //   url: "/ChargeManagement/GarbageManagement",
                //   NavName: "垃圾费管理"
                // },
              ],
            },
          ],
        },
        // 表计管理
        secondNav5: {
          navList: [
            {
              NavName: "查询",
              icon: "WaterMeterInquiry0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/WaterMeterInquiry",
              opCode: "0ed43436fbb04a5d95f0ebaf0f0a6fa5",
            },
            {
              NavName: "注册",
              icon: "Warehousing0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/Warehousing",
              opCode: "8e346b3553dc4cab947739b1fbc78b14",
            },
            {
              NavName: "换表",
              icon: "ChangeTables0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/ChangeTables",
              opCode: "f6c2830256f14310ad27bc9305db9113",
            },
            {
              NavName: "快捷换表",
              icon: "QuickChangeTables0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/QuickChangeTables",
              opCode: "f6c2830256f14310ad27bc9305db9112",
            },
            {
              NavName: "拆表",
              icon: "TableDismantling0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/TableDismantling",
              opCode: "3d880dba81564e7bb19cda4a8f60de94",
            },
            {
              NavName: "复装",
              icon: "DuplicateTable0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/DuplicateTable",
              opCode: "ee53128000e943ef89454a2a4c78500e",
            },
            {
              NavName: "校表",
              icon: "ComparisonTable0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/ComparisonTable",
              opCode: "7ebee2a439a44fcf969b497d72d38561",
            },
            {
              NavName: "维检",
              icon: "DimensionalInspection0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/DimensionalInspection",
              opCode: "aa7e06f4995c49dc9ba85cf24b0a2056",
            },
            {
              NavName: "变更",
              icon: "wMeterEdit0",
              type: 'firstmenu',
              children: [],
              url: "/MeterManagement/wMeterEdit",
              opCode: "ff8bfda3d30542a48c471a9bbc713d66",
            },
          ],
        },
        // 客户通知
        secondNav6: {
          navList: [
            {
              NavName: "通知公告",
              icon: "InformationReleaseManagement0",
              type: 'firstmenu',
              children: [],
              url: "/CustomerNotificationCenter/InformationReleaseManagement",
              opCode: "a53babc6f4d8405aa6fa26e2fbafa1f6",
            },
            {
              NavName: "消息查询",
              type: 'firstmenu',
              icon: "NotificationDetails0",
              children: [],
              url: "/CustomerNotificationCenter/NotificationDetails",
              opCode: "833a7ded10504449a7301377ac4c19c9",
            },
            {
              NavName: "问卷调查",
              type: 'firstmenu',
              icon: "QuestionnaireManagement0",
              children: [],
              url: "/CustomerNotificationCenter/QuestionnaireManagement",
              opCode: "cf2bc268473647b0ac034a67133b00b2",
            },
            {
              NavName: "短信通知",
              type: 'submenu',
              icon: "MessageSending0",
              url: "/CustomerNotificationCenter/MessageNotification/MessageSending",
              opCode: "e4d46969b508451282e2d9e23682c640",
              children: [
                {
                  NavName: "短信发送",
                  type: 'firstmenu',
                  icon: "MessageSending1",
                  children: [],
                  url: "/CustomerNotificationCenter/MessageNotification/MessageSending",
                  opCode: "ba019327aa4c4a49adc83e259ed90f9f",
                },
                {
                  NavName: "水费通知",
                  type: 'firstmenu',
                  icon: "MessageSending2",
                  children: [],
                  url: "/CustomerNotificationCenter/MessageNotification/WaterRateNotification",
                  opCode: "44e161f94cd1467da21962ae856f8710",
                },
                {
                  NavName: "欠费催缴",
                  type: 'firstmenu',
                  icon: "MessageSending3",
                  children: [],
                  url: "/CustomerNotificationCenter/MessageNotification/OweWorth",
                  opCode: "9cea6df43cbb43d4afdb000774851e0f",
                },
                {
                  NavName: "缴费提醒",
                  type: 'firstmenu',
                  icon: "MessageSending4",
                  children: [],
                  url: "/CustomerNotificationCenter/MessageNotification/Reminders",
                  opCode: "6929b18f4d484dbc920f43cd877fa3a8",
                },
                {
                  NavName: "停水维修通知",
                  type: 'firstmenu',
                  icon: "MessageSending5",
                  children: [],
                  url: "/CustomerNotificationCenter/MessageNotification/WaterMaintenance",
                  opCode: "ebaaa62ff2334342975f56c0c0cf97b0",
                },
              ],
            }
          ],
        },
      },
      // 统计报表侧边栏菜单
      reportMenu: {
        // 智能分析
        secondNav1: {
          navList: [
            {
              NavName: "销售管理分析",
              type: 'firstmenu',
              icon: "saleManagement0",
              children: [],
              url: "/ReportCenter/saleManagement",
              opCode: "949246c2217840b7b0b1b2c4acc7a9c7",
            },
            {
              NavName: "业务办理分析",
              type: 'firstmenu',
              icon: "BusinessManagement0",
              children: [],
              url: "/ReportCenter/BusinessManagement",
              opCode: "fed83ea2e74c428c9d44ee781b2170ad",
            },
            {
              NavName: "客户管理中心",
              type: 'firstmenu',
              icon: "CustomerManagementCenter0",
              children: [],
              url: "/ReportCenter/CustomerManagementCenter",
              opCode: "fef770c94e5c450dbfe95884630acbe0",
            },
            {
              NavName: "呼叫中心分析",
              type: 'firstmenu',
              icon: "CallCenter0",
              children: [],
              url: "/ReportCenter/CallCenter",
              opCode: "5f0b205fae5144b8b422b4fe803d5a46",
            },
          ],
        },
        // 工程报表
        secondNav2: {
          navList: [
            {
              NavName: "工程明细报表",
              type: 'firstmenu',
              icon: "ProjectReportOfDetailed0",
              children: [],
              url: "/EngineeringReport/ProjectReportOfDetailed",
              opCode: "faf4fa3b348a4e589a180631865184f4",
            },
            {
              NavName: "工程材料清单",
              type: 'firstmenu',
              icon: "ProjectReportOfStuff0",
              children: [],
              url: "/EngineeringReport/ProjectReportOfStuff",
              opCode: "2d87e22c59eb49b8b40a1f63cab56c9d",
            },
            {
              type: 'firstmenu',
              icon: "ProjectReportOfCollectionDetailed0",
              children: [],
              NavName: "工程收款明细表",
              url: "/EngineeringReport/ProjectReportOfCollectionDetailed",
              opCode: "3ad07472aa4d47c39b4c69c4b2f94943",
            },
            {
              NavName: "工程收款统计表",
              type: 'firstmenu',
              icon: "ProjectReportOfCollectionStatistics0",
              children: [],
              url: "/EngineeringReport/ProjectReportOfCollectionStatistics",
              opCode: "56f553459ea848e6b08de8297ed76e2d",
            },
            {
              NavName: "工程统计表",
              type: 'firstmenu',
              icon: "ProjectReportOfStatistics0",
              children: [],
              url: "/EngineeringReport/ProjectReportOfStatistics",
              opCode: "eac9f92bc13a4a4e98f7c8e9d3c06b5c",
            },
          ],
        },
        // 抄表水量报表
        secondNav3: {
          navList: [
            {
              NavName: "抄表每日汇总",
              type: 'firstmenu',
              icon: "MeterReadingOfDailySummary0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfDailySummary",
              opCode: "459047b3a64e4ed5919b3b2424583031",
            },
            {
              NavName: "抄表表册汇总",
              type: 'firstmenu',
              icon: "MeterReadingOfTableSummary0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfTableSummary",
              opCode: "b1f220c701694ffeb69b277b78ce6cb8",
            },
            {
              NavName: "新户抄表汇总",
              type: 'firstmenu',
              icon: "MeterReadingOfNewUserSummary0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfNewUserSummary",
              opCode: "9a460ffd87fe46c59463230546caf7e9",
            },
            {
              NavName: "罚款水量月报",
              type: 'firstmenu',
              icon: "MeterReadingOfMonthlyFineReport0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfMonthlyFineReport",
              opCode: "41ff60f11f014fe0ae97eedd9a14b5e0",
            },
            {
              NavName: "水量月汇总",
              type: 'firstmenu',
              icon: "MeterReadingOfMonthlySummary0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfMonthlySummary",
              opCode: "097bf322017542e1bdf78df0c7827a8e",
            },
            {
              NavName: "水量年明细报表",
              type: 'firstmenu',
              icon: "MeterReadingOfYearDetailed0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfYearDetailed",
              opCode: "9f299d79a002426d8e2c7d6316c9e698",
            },
            {
              NavName: "水量年统计报表",
              type: 'firstmenu',
              icon: "MeterReadingOfYearStatistics0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfYearStatistics",
              opCode: "046a1d7046f547f5932e8e0bfded3f94",
            },
            {
              NavName: "抄表员抄表统计",
              type: 'firstmenu',
              icon: "MeterReadingOfReaderStatistics0",
              children: [],
              url: "/WaterMeterReading/MeterReadingOfReaderStatistics",
              opCode: "63b988a31a0a4911a1fd61d5288",
            },
          ],
        },
        // 抄表水量报表
        secondNav4: {
          navList: [
            {
              NavName: "收款统计报表",
              type: 'firstmenu',
              icon: "ChargeReportOfCollectionStatistics0",
              children: [],
              url: "/ChargeReport/ChargeReportOfCollectionStatistics",
              opCode: "b650afbda600427c87edaf8f1c06a080",
            },
            {
              NavName: "阶梯应收报表",
              type: 'firstmenu',
              icon: "ChargeReportOfLadderReceivables0",
              children: [],
              url: "/ChargeReport/ChargeReportOfLadderReceivables",
              opCode: "78e74c41335b4cfab3a233d7e26ffa97",
            },
            {
              NavName: "阶梯实收报表",
              type: 'firstmenu',
              icon: "ChargeReportOfLadderNetReceipts0",
              children: [],
              url: "/ChargeReport/ChargeReportOfLadderNetReceipts",
              opCode: "3b55d4af65a1401189657a5a428ce515",
            },
            {
              NavName: "应收回收汇总",
              type: 'firstmenu',
              icon: "ChargeReportOfRecoverySummary0",
              children: [],
              url: "/ChargeReport/ChargeReportOfRecoverySummary",
              opCode: "bea727b5083e4c04bf74937f3ade3009",
            },
            {
              NavName: "应收明细",
              type: 'firstmenu',
              icon: "ChargeReportOfReceivablesDetailed0",
              children: [],
              url: "/ChargeReport/ChargeReportOfReceivablesDetailed",
              opCode: "a526ba546c3c464a8dd7e2950b081e8a",
            },
            {
              NavName: "收费明细",
              type: 'firstmenu',
              icon: "ChargeReportOfNetReceiptsDetailed0",
              children: [],
              url: "/ChargeReport/ChargeReportOfNetReceiptsDetailed",
              opCode: "6dcf137bbbae4a5987f22c18e914cb49",
            },
            {
              NavName: "分类应收汇总",
              type: 'firstmenu',
              icon: "ChargeReportOfClassifySummary0",
              children: [],
              url: "/ChargeReport/ChargeReportOfClassifySummary",
              opCode: "b8b484fad3c94d479c87d4c8faaa9acd",
            },
            {
              NavName: "应收月汇总",
              type: 'firstmenu',
              icon: "ChargeReportOfMonthlySummary0",
              children: [],
              url: "/ChargeReport/ChargeReportOfMonthlySummary",
              opCode: "5ff13dcc38e8415bad1b3408076a796c",
            },
            {
              NavName: "上报集团报表",
              type: 'firstmenu',
              icon: "ChargeReportOfGroupTable0",
              children: [],
              url: "/ChargeReport/ChargeReportOfGroupTable",
              opCode: "f101da99bc1a48c181df01620cf4d238",
            },
            {
              NavName: "未收明细表",
              type: 'firstmenu',
              icon: "ChargeReportOfUncollectedDetailed0",
              children: [],
              url: "/ChargeReport/ChargeReportOfUncollectedDetailed",
              opCode: "011e09e300aa4fa6b6eac58cf71cf37b",
            },
            {
              NavName: "未收统计表",
              type: 'firstmenu',
              icon: "ChargeReportOfUncollectedSummary0",
              children: [],
              url: "/ChargeReport/ChargeReportOfUncollectedSummary",
              opCode: "94b017c94a1248fdb986c3ea0770c23d",
            },
            {
              NavName: "按册回收率",
              type: 'firstmenu',
              icon: "ChargeReportOfRateOfRecovery0",
              children: [],
              url: "/ChargeReport/ChargeReportOfRateOfRecovery",
              opCode: "e9904ca403d0411c824bc9220fee3707",
            },
            {
              NavName: "余额明细表",
              type: 'firstmenu',
              icon: "ChargeReportOfBalanceDetailed0",
              children: [],
              url: "/ChargeReport/ChargeReportOfBalanceDetailed",
              opCode: "d74f51af1f8c405490b9b956d46b871a",
            },
            {
              NavName: "预收月汇总",
              type: 'firstmenu',
              icon: "ChargeReportOfPreMonthlySummary0",
              children: [],
              url: "/ChargeReport/ChargeReportOfPreMonthlySummary",
              opCode: "ac22cfb5c3334117a02395641fab237c",
            },
            {
              NavName: "发票查询",
              type: 'firstmenu',
              icon: "ChargeReportOfInvoiceQuery0",
              children: [],
              url: "/ChargeReport/ChargeReportOfInvoiceQuery",
              opCode: "648d8e2b060244a0a5b7547944f08a6e",
            },
            {
              NavName: "实收月汇总",
              type: 'firstmenu',
              icon: "ChargeReportOfProceedsSummary",
              children: [],
              url: "/ChargeReport/ChargeReportOfProceedsSummary",
              opCode: "1eb3db4ea8f24d2fa52539f05954a3f0",
            },
            {
              NavName: "污水发票汇总",
              type: 'firstmenu',
              icon: "WSInvoiceReport",
              children: [],
              url: "/ChargeReport/WSInvoiceReport",
              opCode: "54a51b59c84c4c3b926b2e34cd7c948c",
            },
            {
              NavName: "银行扣款记录",
              type: 'firstmenu',
              icon: "ChargeReportOfBankOutInDetailed",
              children: [],
              url: "/ChargeReport/ChargeReportOfBankOutInDetailed",
              opCode: "b17f11a08a5e460489b0374a6687653d",
            },
          ],
        },
        // 其他报表
        secondNav5: {
          navList: [
            {
              NavName: "水表状态变更记录",
              type: 'firstmenu',
              icon: "OtherReportOfWarehousingDetailed0",
              children: [],
              url: "/OtherReport/OtherReportOfWarehousingDetailed",
              opCode: "bd1d1a05f6f8456a802751eba81cb534",
            },
            {
              NavName: "水表统计表",
              type: 'firstmenu',
              icon: "OtherReportOfWaterStatistics0",
              children: [],
              url: "/OtherReport/OtherReportOfWaterStatistics",
              opCode: "2b3b90e0a5cf41688ebd957437973136",
            },
            {
              NavName: "业务办理统计表",
              type: 'firstmenu',
              icon: "OtherReportOfBusinessProStatistics0",
              children: [],
              url: "/OtherReport/OtherReportOfBusinessProStatistics",
              opCode: "231860ac158a4742aef4ac5d24492a58",
            },
            {
              NavName: "用户统计表",
              type: 'firstmenu',
              icon: "OtherReportOfCustomerInfoSummary0",
              children: [],
              url: "/OtherReport/OtherReportOfCustomerInfoSummary",
              opCode: "8a017971beee47c59136c2bd2f835240",
            },
            {
              NavName: "短信汇总表",
              type: 'firstmenu',
              icon: "OtherReportOfSMSSummary0",
              children: [],
              url: "/OtherReport/OtherReportOfSMSSummary",
              opCode: "3a9a4383346c41bdaf7c378619749dc9",
            },
          ],
        },
      },
      // 基础信息侧边栏菜单
      basicsMenu: {
        // 区域配置
        secondNav1: {
          navList: [
            {
              NavName: "营业所",
              type: 'firstmenu',
              icon: "BusinessAbode0",
              children: [],
              url: "/RegionalConfiguration/BusinessAbode",
              opCode: "7a8901626dd2472095921340059ff2ef",
            },
            {
              NavName: "营业区域",
              type: 'firstmenu',
              icon: "BusinessArea0",
              children: [],
              url: "/RegionalConfiguration/BusinessArea",
              opCode: "dc3450795c40414ea784840ac913732b",
            },
            {
              NavName: "营业网点",
              type: 'firstmenu',
              icon: "BusinessBranch0",
              children: [],
              url: "/RegionalConfiguration/BusinessBranch",
              opCode: "5565af313422447380a087c61b1bd3a8",
            },
            // {
            //   type: 'firstmenu',
            //   icon: "BusinessArea1-3",
            //   children: [],
            //   NavName: "行政区域",
            //   url: "/RegionalConfiguration/AdminRegion"
            // },
          ],
        },
        // 水表配置
        secondNav2: {
          navList: [
            //  {
            //    type: 'firstmenu',
            //    icon: "BusinessArea1-2",
            //    children: [],
            //    NavName: "水表型号",
            //    url: "/WaterMeterConfiguration/WatermeterModel"
            //  },
            // {
            //   type: 'firstmenu',
            //   icon: "BusinessArea1-7",
            //   children: [],
            //   NavName: "水表口径",
            //   url: "/WaterMeterConfiguration/CaliberInfo"
            // },
            {
              NavName: "水表关系",
              type: 'firstmenu',
              icon: "MeterRelationship0",
              children: [],
              url: "/WaterMeterConfiguration/MeterRelationship",
              opCode: "6694b42c99854134bfdf3ec6c54dbd22",
            },
            // {
            //   type: 'firstmenu',
            //   icon: "BusinessArea1-8",
            //   children: [],
            //   NavName: "抄表状态",
            //   url: "/WaterMeterConfiguration/MeterStatus"
            // },
            // {
            //   type: 'firstmenu',
            //   icon: "BusinessArea1-3",
            //   children: [],
            //   NavName: "水表供应商",
            //   url: "/WaterMeterConfiguration/WaterMeterFactory"
            // },
          ],
        },
        // 模板配置
        secondNav3: {
          navList: [
            {
              NavName: "用料模板",
              type: 'firstmenu',
              icon: "MaterialTemplate0",
              children: [],
              url: "/TemplateConfiguration/MaterialTemplate",
              opCode: "65191235cfcc42768a2bc7f1efa4d5e9",
            },
            {
              NavName: "短信模板",
              type: 'firstmenu',
              icon: "ShortMessage0",
              children: [],
              url: "/TemplateConfiguration/ShortMessage",
              opCode: "b11c53667dea432ba85e10afa3c038fe",
            },
            {
              NavName: "合同模板",
              type: 'firstmenu',
              icon: "Contract0",
              children: [],
              url: "/TemplateConfiguration/Contract",
              opCode: "07834cb4fcec44308e55fec3fd8395a3",
            },
          ],
        },
        // 其他配置
        secondNav4: {
          navList: [
            // {
            //   NavName: "工程报装权限配置",
            //   type: 'firstmenu',
            //   icon: "ProjectApproval0",
            //   children: [],
            //   url: "/OtherConfigurations/ProjectApproval",
            //   opCode: "3cf97636-0753-4695-8528-f4a80f21daba",
            // },
            {
              NavName: "工程验收配置",
              type: 'firstmenu',
              icon: "projectAcceptance0",
              children: [],
              url: "/OtherConfigurations/ProjectAcceptance",
              opCode: "4fd18cd3-bfa8-40d9-8c57-d09d67eaecbd",
            },
            {
              NavName: "工程审批意见配置",
              type: 'firstmenu',
              icon: "projectAcceptance0",
              children: [],
              url: "/OtherConfigurations/ProjectOpinionConfig",
              opCode: "4fd18cd3-bfa8-40d9-8c57-d09d67eaecbd",
            },
            {
              NavName: "册本信息",
              type: 'firstmenu',
              icon: "BookInfo0",
              children: [],
              url: "/OtherConfigurations/BookInfo",
              opCode: "b7f5dfa5ce39404cbbbd3ada685223cc",
            },
            {
              NavName: "费用类型",
              type: 'firstmenu',
              icon: "CostProject0",
              children: [],
              url: "/OtherConfigurations/CostProject",
              opCode: "04069b946b5d4284bf60787ef96df12e",
            },
            {
              NavName: "用户开户银行",
              type: 'firstmenu',
              icon: "BankInfo0",
              children: [],
              url: "/OtherConfigurations/BankInfo",
              opCode: "d7030ae6b0c44ba9a3d99013e00a2b3f",
            },
            {
              NavName: "附件资料",
              type: 'firstmenu',
              icon: "Appendix0",
              children: [],
              url: "/OtherConfigurations/Appendix",
              opCode: "fabef486a1ab4942809e63d00f8a9920",
            },
            // {
            //   type: 'firstmenu',
            //   icon: "BusinessArea5-4",
            //   children: [],
            //   NavName: "假期设置",
            //   url: "/OtherConfigurations/HolidaySet"
            // },
            {
              NavName: "材料定价",
              type: 'firstmenu',
              icon: "MaterialPrice0",
              children: [],
              url: "/OtherConfigurations/MaterialPrice",
              opCode: "547155c50bc246a686051650cd5d27ce",
            },
            {
              NavName: "票据类型",
              type: 'firstmenu',
              icon: "BillType0",
              children: [],
              url: "/OtherConfigurations/BillType",
              opCode: "8d2dd8d4c1b54e959fd62aa1f3e4c6c4",
            },
            {
              NavName: "费用票据关系",
              type: 'firstmenu',
              icon: "ExpenseBillRelationship0",
              children: [],
              url: "/OtherConfigurations/ExpenseBillRelationship",
              opCode: "b32f490000db4ec0ba61d774150ae350",
            },
            {
              NavName: "其他参数配置",
              type: 'firstmenu',
              icon: "GlobalParamSet0",
              children: [],
              url: "/OtherConfigurations/GlobalParamSet",
              opCode: "124aceab52154704b0748cd832ca2bce",
            },
            {
              NavName: "快速变更配置",
              type: 'firstmenu',
              icon: "QuickChangeConfiguration0",
              children: [],
              url: "/OtherConfigurations/QuickChangeConfiguration",
              opCode: "269eaedb2ec54293ad8d8f9083488e81",
            },
            {
              NavName: "垃圾费类型",
              type: 'firstmenu',
              icon: "GarbageType0",
              children: [],
              url: "/OtherConfigurations/GarbageType",
              opCode: "5d988431bb7e4c88a1dbb2cc89f6b5fb",
            },
             {
              NavName: "进账银行",
              type: 'firstmenu',
              icon: "GarbageType0",
              children: [],
              url: "/OtherConfigurations/IncomeBank",
              opCode: "e0fc2fc56fce467092d17cbe1da17058",
            },
          ],
        },
        // 通知配置
        secondNav5: {
          navList: [
            {
              NavName: "水费账单精灵",
              type: 'firstmenu',
              icon: "WaterBill0",
              children: [],
              url: "/NotificationManagement/WaterBill",
              opCode: "3d519531b1f44cfc80b122124cb2184d",
            },
            {
              NavName: "欠费催缴精灵",
              type: 'firstmenu',
              icon: "ArrearsCharging0",
              children: [],
              url: "/NotificationManagement/ArrearsCharging",
              opCode: "e1a0118fcee44231b01338770ee3652b",
            },
            {
              NavName: "缴费通知精灵",
              type: 'firstmenu',
              icon: "PaymentNotice0",
              children: [],
              url: "/NotificationManagement/PaymentNotice",
              opCode: "1177eb423f7d4591998cae75f3f83b8b",
            },
            {
              NavName: "其他精灵",
              type: 'firstmenu',
              icon: "OtherNotice0",
              children: [],
              url: "/NotificationManagement/OtherNotice",
              opCode: "56c663a795b54f25b578289a08f799d6",
            },
          ],
        },
        // 流程超时管理
        secondNav6: {
          navList: [
            {
              NavName: "流程超时配置",
              type: 'firstmenu',
              icon: "OverDue0",
              children: [],
              url: "/ProcessConfiguration/OverDue",
              opCode: "c81b666bf3be411cbe4eae37ee1debef"
            },
            {
              NavName: "流程超时记录",
              type: 'firstmenu',
              icon: "OverDueRecord0",
              children: [],
              url: "/ProcessConfiguration/OverDueRecord",
              opCode: "d04c58cf27ad47369d1cd2c5ca1c2a9f",
            },
          ],
        },
      },
      secondNav: {
        navList: [
        ],
      },
      loginInfo: '',


      showMenu: 1,
      isRouterAlive: true,
      defaultPage: '/',
      userInfo: { photourl: require('../assets/images/cute.jpeg') },
      host: "",
      menuShow: false,
      navTree: [],
      activeIndex: "/",
      // 用户个人信息、水司切换、动态菜单数据
      userData: {},
      // 水司下拉框数据
      companyData: [],
      // 选中的下拉框水司code
      curWaterCode: '',
      // 动态菜单数据
      menuData: [],

      // 当前默认前往的第一个三级或四级菜单url
      defaultUrl: '',
      // 处理动态菜单产生的高亮bug
      activeClass: '',
      activedNav: 'Home',
      activedNavIndex: 0,

    }
  },
  inject: ["pageReload"],
  mounted() {
    var _this = this
    eventBus.$on('asideMenuShow', (show) => {
      Object.keys(this.menuShowData).forEach(function (key) {
        if (key == show) {
          setTimeout(() => {
            _this.menuShowData[key] = true
          }, 0);

          // _this.thirdMenuHandle(key)
          // console.log(key)
        } else {
          _this.menuShowData[key] = false
        }
      })
    })
    let n = window.location.host.search(':')
    let str = window.location.host + ""
    this.host = str.slice(0, n)
    // this.host = "jc.uat.gdhwater.com"
    if (this.host === '127.0.0.1')
      this.host = 'localhost'
    this.getUserData()

    //用于解决刷新页面时直接跳转首页的问题
    this.defaultUrl = ''
    // this.$router.push('/WaterSideIndex')
    if (window.location.href.indexOf('UserInfoSearchDetail') > -1) {
      this.getSecondMenu('Workbench1')
    }else {
      this.$router.push('/WaterSideIndex')
    }
    // this.refreshNav(menuName, 0)
    // this.getUser()// 获取当前用户信息
  },
  updated() {
    this.$nextTick(() => {
      if (!this.hasReset) {
        this.hasReset = true
      }
    })
  },
  methods: {
    test1(index) {
      // console.log(index)
    },
    jump() {
      window.open('#/UserInfoSearchDetail')
    },
    // 获取用户数据
    getUserData() {
      var _this = this
      var params = {
        "busicode": "UserAuthority",
        "data": {}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.userData = res
        _this.companyData = res.companys
        // 获取当前选中的水司
        _this.curWaterCode = res.curWaterCode
        localStorage.setItem('companyNo', _this.curWaterCode)
        // 获取动态菜单数据
        _this.menuData = res.operations


        sessionStorage.setItem('account', res.account);
        sessionStorage.setItem('userName', res.userName);
        if (window.location.href.indexOf('UserInfoSearchDetail') > -1) {// 点开'客户查询'一级菜单时不再跳首页
          _this.getSecondMenu('Workbench1')
          //$('.user-company').hide()
          $('.menu_img').hide()
        }else{
          _this.getSecondMenu('Home')
        }
      })
    },
    // 切换水司方法
    switchCompany() {
      var _this = this
      var params = {
        "busicode": "SwitchCompany",
        "data": _this.curWaterCode
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        localStorage.setItem('companyNo', _this.curWaterCode)
        _this.pageReload()
        _this.getUserData()
      })
    },

    changeStyle(obj) {
      $('.loginArea > .infoPop').css('display', 'block');
    },
    loginout() {
      axios({
        method: 'get',
        url: process.env.NODE_ENV == "development" ? 'loginout.api' : '/project/loginout.api',// 开发 ：打包
        params: {
          ticket: sessionStorage.getItem('token')
        },
        headers : {
          "returntype" : "ajax/json"
        },
      }).then((res)=>{
        window.open(res.data.data, '_self')
      })
    },
    restStyle(obj) {
      setTimeout(() => {
        $('.loginArea > .infoPop').css('display', 'none');
      }, 2000);
    },
    // 菜单配置
    getSecondMenu(menuName) {
      // 存储当前二级菜单的opcode
      let menuOpCodeList = []
      // 存储当前二级菜单的path
      let menuPathList = []
      if (menuName == 'Home') {// 首页
        this.defaultUrl = ''
        this.$router.push('/WaterSideIndex')
        // this.refreshNav(menuName, 0)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home-active.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'Workbench') {// 工作台
        this.defaultUrl = ''
        this.$router.push('/HallBusiness')
        // this.refreshNav(menuName, 1)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench-active.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'Business') {// 业务管理
        // this.$router.push('/EngineeringManagement')
        // this.refreshNav(menuName, 2)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business-active.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [
            //工程管理
            {
              Navtitle: '工程管理',
              path: "/EngineeringManagement",
              opCode: "8daaaa069a224d1dbd40ae055920a544",
              children: [],
            },
            //客户管理
            {
              Navtitle: '客户管理',
              path: "/CustomerManagement",
              opCode: "34c7a6d4f1224ab28e809072eb3b49d8",
              children: [],
            },
            // 抄表开账
            {
              Navtitle: '抄表开账',
              path: "/MeterReading",
              opCode: "887d46854a1441b5821214799216c28b",
              children: [],
            },
            // 收费管理
            {
              Navtitle: '收费管理',
              path: "/ChargeManagement",
              opCode: "83f6c283c26c45d2b9f458158fd8f6d4",
              children: [],
            },
            //表计管理
            {
              Navtitle: '表计管理',
              path: "/MeterManagement",
              opCode: "cbe1c9487d564bdc98e8232375163afb",
              children: [],
            },
            //客户通知
            {
              Navtitle: '客户通知',
              path: "/CustomerNotificationCenter",
              opCode: "01cc125ac0ea45178f3bf94a46518ee9",
              children: [],
            },
          ],
        }
        $('.custom-home header').css('height', '88px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 90px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'Statistical') {// 统计报表
        // this.$router.push('/ReportCenter')
        // this.refreshNav(menuName, 3)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical-active.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [
            // 收费管理报表
            {
              path: "/ChargeReport",
              Navtitle: "收费管理报表",
              opCode: "df6e9610070844eeb384a3c93b421226",
              children: [],
            },
            // 智能分析
            {
              path: "/ReportCenter",
              Navtitle: "智能分析",
              opCode: "3767ca05b799491fa8535059d6ff1092",
              children: [],
            },
            // 工程报表
            {
              path: "/EngineeringReport",
              Navtitle: "工程报表",
              opCode: "2cbebac11c294270b947a52808f39da5",
              children: [],
            },
            // 抄表水量报表
            {
              path: "/WaterMeterReading",
              Navtitle: "抄表水量报表",
              opCode: "79a0c3c3cfe64fe789767fbf3feb79b4",
              children: [],
            },

            // 其他报表
            {
              path: "/OtherReport",
              Navtitle: "其他报表",
              opCode: "2f0931d61f2945afb10f81b59eb25276",
              children: [],
            },
          ],
        }
        $('.custom-home header').css('height', '88px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 90px)')
        this.$nextTick(function () {
          $('#firstNav .nav .navList > li').css('min-width', '100px')
        })

      } else if (menuName == 'Basics') {// 基础信息
        // this.$router.push('/RegionalConfiguration')
        // this.refreshNav(menuName, 4)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics-active.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [
            // 区域配置
            {
              path: "/RegionalConfiguration",
              Navtitle: "区域配置",
              opCode: "192a954c7e4244e1918e2895d569458d",
              children: [],
            },
            // 水表配置
            {
              path: "/WaterMeterConfiguration",
              Navtitle: "水表配置",
              opCode: "27d3788c46fa49b482fe8c27a0d83acd",
              children: [],
            },
            // 通知管理
            {
              path: "/NotificationManagement",
              Navtitle: "水精灵管理",
              opCode: "b56f8f17d9fd45ef9819515f966cc05c",
              children: [],
            },
            // 模板配置
            {
              path: "/TemplateConfiguration",
              Navtitle: "模板配置",
              opCode: "8cfe52ed90fe4bc1a6ab6cfce3588e01",
              children: [],
            },
            // 其他配置
            {
              path: "/OtherConfigurations",
              Navtitle: "其他配置",
              opCode: "d8d53544f6414e20a2a18a6cbf018fb9",
              children: [],
            },
            // 流程超时管理
            {
              path: "/ProcessConfiguration",
              Navtitle: "流程超时配置",
              opCode: "c81b666bf3be411cbe4eae37ee1debef",
              children: [],
            },
          ],
        }
        $('.custom-home header').css('height', '88px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 90px)')
      } else if (menuName == 'system') {// 系统管理
        // this.$router.push('/UserAuthorization')
        this.defaultUrl = ''
        // this.refreshNav(menuName, 5)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system-active.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [
            {
              Navtitle: "用户角色",
              icon: "UserAuthorization11",
              path: "/UserAuthorization",
              opCode: "deb1378946184caf9248e3cbf5d38b50",
              children: []
            },
            // {
            //   Navtitle: "权限管理",
            //   icon: "RoleManage11",
            //   path: "/RoleManage",
            //   opCode: "e54428b09c8a47c7bfaf2d4b16d2c9a7",
            //   children: []
            // },
            {
              Navtitle: "用户管理",
              icon: "UserManage",
              path: "/UserManage",
              opCode: "83cf7d45238243eba8c21bbca477a7d3",
              children: []
            },
            // {
            //   Navtitle: "菜单管理",
            //   icon: "MenuManage0",
            //   path: "/MenuManage",
            //   opCode: "90d53b6d12eb4d5687f88fef6a55c6cd",
            //   children: []
            // },
          ],
        }
        $('.custom-home header').css('height', '88px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 90px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'Workbench1') {// 客户查询
        this.defaultUrl = ''
        this.$router.push('/UserInfoSearchDetail')
        // this.refreshNav(menuName, 1)
        $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
        $('.menu_img').eq(6).attr('src', require('../assets/images/searchUser.png'))
        this.firstNav.navData = {
          navList: [],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
        // window.open('/UserInfoSearchDetail')
      } else if (menuName == 'Approval') {// 流程中心
        this.firstNav.navData = {
          navList: [
            {
              Navtitle: "",
              icon: "RoleManage0",
              path: "/RoleManage",
              children: [
                {
                  type: 'firstmenu',
                  icon: "BusinessArea1-1",
                  children: [],
                  NavName: "待办",
                  url: "/RegionalConfiguration/BusinessArea"
                },
                {
                  type: 'firstmenu',
                  icon: "BusinessArea1-2",
                  children: [],
                  NavName: "已办",
                  url: "/RegionalConfiguration/ManagementArea",
                },]
            },
            // {
            //   Navtitle: "已办",
            //   icon: "UserManage",
            //   path: "/UserManage",
            //   children: []
            // }
          ],
        }
      }

      // 动态菜单处理
      this.menuHandle()
    },

    // 一级、二级动态菜单处理方法
    menuHandle() {
      // console.log(this.firstNav.navData.navList)
      // 筛选出来的二级菜单数据
      let secMenuList = []

      this.menuData.forEach((item) => {
        // 一级菜单
        $('.' + item.opCode).show()
        // 二级菜单
        // if (this.firstNav.navData.navList.length > 0) {
        //   for (let i = 0; i < this.firstNav.navData.navList.length; i++) {
        //     if (item.opCode == this.firstNav.navData.navList[i].opCode) {
        //       secMenuList.push(this.firstNav.navData.navList[i])
        //     }
        //   }
        // }

      })

      if (this.firstNav.navData.navList.length > 0) {

        for (let i = 0; i < this.firstNav.navData.navList.length; i++) {
          this.menuData.forEach(item => {
            if (this.firstNav.navData.navList[i].opCode == item.opCode) {
                secMenuList.push(this.firstNav.navData.navList[i])
            }
          });

        }
      }

      // console.log(secMenuList)
      // 二级菜单
      if (this.firstNav.navData.navList.length > 0) {
        this.firstNav.navData.navList = secMenuList
        // 默认跳转到第一个二级菜单
        this.$router.push(this.firstNav.navData.navList[0].path)
      }
      // console.log(this.firstNav.navData.navList)

      for (const key in this.menuShowData) {
        this.thirdMenuHandle(key)
      }
      sessionStorage.setItem('thirdMenu', JSON.stringify({
        businessMenu: this.businessMenu,
        reportMenu: this.reportMenu,
        basicsMenu: this.basicsMenu,
      }))
    },
    // 三级动态菜单处理方法
    thirdMenuHandle(key) {
      let secondNavName = 'secondNav' + key.substring(key.length - 1, key.length)
      if (key.indexOf('businessMenu') > -1) {
        this.businessMenu[secondNavName].navList = this.getFinalThirdMenu(this.businessMenu[secondNavName].navList)
      } else if (key.indexOf('reportMenu') > -1) {
        this.reportMenu[secondNavName].navList = this.getFinalThirdMenu(this.reportMenu[secondNavName].navList)
      } else if (key.indexOf('basicsMenu') > -1) {
        this.basicsMenu[secondNavName].navList = this.getFinalThirdMenu(this.basicsMenu[secondNavName].navList)
      }
    },
    //
    getFinalThirdMenu(navList) {
      let thirdMenuList = []
      // 处理第一层数组
      for (let i = 0; i < navList.length; i++) {
        for (let j = 0; j < this.menuData.length; j++) {
          if (navList[i].opCode == this.menuData[j].opCode) {
            thirdMenuList.push(navList[i])
          }
        }
      }
      // 处理第二层chirdren
      for (let i = 0; i < thirdMenuList.length; i++) {
        let children = []
        if (thirdMenuList[i].children.length > 0) {
          for (let j = 0; j < thirdMenuList[i].children.length; j++) {

            for (let k = 0; k < this.menuData.length; k++) {
              if (thirdMenuList[i].children[j].opCode == this.menuData[k].opCode) {
                children.push(thirdMenuList[i].children[j])
              }
            }

          }

        }
        thirdMenuList[i].children = children
      }

      // 借该方法来获取当前默认前往的第一个三级或四级菜单url，与菜单数据处理无关
      // if (navList[0].children.length > 0) {
      //   this.defaultUrl = navList[0].children[0].url
      //   this.activeClass = navList[0].children[0].icon
      // } else {
      //   this.defaultUrl = navList[0].url
      //   this.activeClass = navList[0].icon
      // }

      return thirdMenuList
    },

    refreshNav(menuName, index) {
      // console.log(menuName, index)
      const menuIcon = {
        Home: require('../assets/images/Home.png'),
        Workbench: require('../assets/images/Workbench.png'),
        Business: require('../assets/images/Business.png'),
        Statistical: require('../assets/images/Statistical.png'),
        Basics: require('../assets/images/Basics.png'),
        system: require('../assets/images/system.png')
      }

      const menuIconActived = {
        Home: require('../assets/images/Home-active.png'),
        Workbench: require('../assets/images/Workbench-active.png'),
        Business: require('../assets/images/Business-active.png'),
        Statistical: require('../assets/images/Statistical-active.png'),
        Basics: require('../assets/images/Basics-active.png'),
        system: require('../assets/images/system-active.png')
      }

      const noSecendNav = ['Home', 'Workbench']

      $('.menu_img').eq(0).attr('src', require('../assets/images/Home.png'))
      $('.menu_img').eq(1).attr('src', require('../assets/images/Workbench.png'))
      $('.menu_img').eq(2).attr('src', require('../assets/images/Business.png'))
      $('.menu_img').eq(3).attr('src', require('../assets/images/Statistical.png'))
      $('.menu_img').eq(4).attr('src', require('../assets/images/Basics.png'))
      $('.menu_img').eq(5).attr('src', require('../assets/images/system.png'))
      // $('.menu_img').eq(this.activedNavIndex).attr('src', menuIcon[this.activedNav])
      $('.menu_img').eq(index).attr('src', menuIconActived[menuName])

      const navList = {
        Home: [],
        Workbench: [],
        Business: [
          //工程管理
          {
            Navtitle: '工程管理',
            path: "/EngineeringManagement",
            opCode: "8daaaa069a224d1dbd40ae055920a544",
            children: [],
          },
          //客户管理
          {
            Navtitle: '客户管理',
            path: "/CustomerManagement",
            opCode: "34c7a6d4f1224ab28e809072eb3b49d8",
            children: [],
          },
          // 抄表开账
          {
            Navtitle: '抄表开账',
            path: "/MeterReading",
            opCode: "887d46854a1441b5821214799216c28b",
            children: [],
          },
          // 收费管理
          {
            Navtitle: '收费管理',
            path: "/ChargeManagement",
            opCode: "83f6c283c26c45d2b9f458158fd8f6d4",
            children: [],
          },
          //表计管理
          {
            Navtitle: '表计管理',
            path: "/MeterManagement",
            opCode: "cbe1c9487d564bdc98e8232375163afb",
            children: [],
          },
          //客户通知
          {
            Navtitle: '客户通知',
            path: "/CustomerNotificationCenter",
            opCode: "01cc125ac0ea45178f3bf94a46518ee9",
            children: [],
          }
        ],
        Statistical: [
          // 收费管理报表
          {
            path: "/ChargeReport",
            Navtitle: "收费管理报表",
            opCode: "df6e9610070844eeb384a3c93b421226",
            children: [],
          },
          // 智能分析
          {
            path: "/ReportCenter",
            Navtitle: "智能分析",
            opCode: "3767ca05b799491fa8535059d6ff1092",
            children: [],
          },
          // 工程报表
          {
            path: "/EngineeringReport",
            Navtitle: "工程报表",
            opCode: "2cbebac11c294270b947a52808f39da5",
            children: [],
          },
          // 抄表水量报表
          {
            path: "/WaterMeterReading",
            Navtitle: "抄表水量报表",
            opCode: "79a0c3c3cfe64fe789767fbf3feb79b4",
            children: [],
          },

          // 其他报表
          {
            path: "/OtherReport",
            Navtitle: "其他报表",
            opCode: "2f0931d61f2945afb10f81b59eb25276",
            children: [],
          }
        ],
        Basics: [
          // 区域配置
          {
            path: "/RegionalConfiguration",
            Navtitle: "区域配置",
            opCode: "192a954c7e4244e1918e2895d569458d",
            children: [],
          },
          // 水表配置
          {
            path: "/WaterMeterConfiguration",
            Navtitle: "水表配置",
            opCode: "27d3788c46fa49b482fe8c27a0d83acd",
            children: [],
          },
          // 通知管理
          {
            path: "/NotificationManagement",
            Navtitle: "水精灵管理",
            opCode: "b56f8f17d9fd45ef9819515f966cc05c",
            children: [],
          },
          // 模板配置
          {
            path: "/TemplateConfiguration",
            Navtitle: "模板配置",
            opCode: "8cfe52ed90fe4bc1a6ab6cfce3588e01",
            children: [],
          },
          // 其他配置
          {
            path: "/OtherConfigurations",
            Navtitle: "其他配置",
            opCode: "d8d53544f6414e20a2a18a6cbf018fb9",
            children: [],
          },
          // 流程超时管理
          {
            path: "/ProcessConfiguration",
            Navtitle: "流程超时配置",
            opCode: "c81b666bf3be411cbe4eae37ee1debef",
            children: [],
          }
        ],
        system: [
          {
            Navtitle: "用户角色",
            icon: "UserAuthorization0",
            path: "/UserAuthorization",
            opCode: "deb1378946184caf9248e3cbf5d38b50",
            children: []
          },
          // {
          //   Navtitle: "权限管理",
          //   icon: "RoleManage0",
          //   path: "/RoleManage",
          //   opCode: "e54428b09c8a47c7bfaf2d4b16d2c9a7",
          //   children: []
          // },
          {
            Navtitle: "用户管理",
            icon: "UserManage0",
            path: "/UserManage",
            opCode: "83cf7d45238243eba8c21bbca477a7d3",
            children: []
          },
          // {
          //   Navtitle: "菜单管理",
          //   icon: "MenuManage0",
          //   path: "/MenuManage",
          //   opCode: "90d53b6d12eb4d5687f88fef6a55c6cd",
          //   children: []
          // },
        ]
      }
      this.firstNav.navData = {
        navList: navList[menuName]
      }
      // console.log(this.firstNav.navData)

      if (noSecendNav.includes(menuName)) {
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
      } else if (menuName === 'Statistical') {
        $('.custom-home header').css('height', '88px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 90px)')
        this.$nextTick(() => {
          $('#firstNav .nav .navList > li').css('min-width', '100px')
        })
      } else {
        $('.custom-home header').css('height', '88px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 90px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      }

      this.activedNavIndex = index
      this.activedNav = menuName

    },

    // 获取当前用户信息
    getUser() {
      let params = {
        "token": window.location.search.substring(1)
      }
      this.$api.fetch({
        apiUrl: 'TAuthorization/getLoginInfo.api',//路径
        method: 'post',//请求方法
        params: params,//参数
        needErrorCallback: true
      }).then(res => {
        if (res.code === 0) {
          this.loginInfo = JSON.parse(res.data.staff)
        }
      })
    },
    //退出登录
    quit() {
      // window.sessionStorage.removeItem("token");
      // // window.location.href = 'http://login2.ebs.krdev.gdhwater.com/cas.htm?urlhttp://oa.ds.com:8080/cas/login?service=http://' + this.host + ':8080/cas.htm'
      //         if(this.host=='localhost'){
      //           window.location.href = 'http://login2.ebs.krdev.gdhwater.com/cas.htm?urlhttp://oa.ds.com:8080/cas/login?service=http://' + this.host + ':8080/cas.htm'
      //         }else {
      //           window.location.href = 'http://login2.ebs.krdev.gdhwater.com/cas.htm?urlhttp://oa.ds.com:8080/cas/login?service=http://jc.uat.gdhwater.com/cas.htm'
      //         }
      // window.location.href = 'http://login2.ebs.krdev.gdhwater.com/cas.htm?urlhttp://oa.ds.com:8080/cas/login?service=http://' + this.host + ':8080/cas.htm'
    },
    // 页面重加载函数
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true))
    },
    changeNav(val) {
      let strurl = val.path.match(/^(\/[\w]+)\/?/)[1];
      // var arr = ["/approvalPage",'/WaterSideIndex','/ProcessApproval/PendingTrial', '/HallBusiness', '/saleManagement', '/BusinessManagement', '/CustomerManagementCenter', '/CallCenter', '/RoleManage', '/UserManage']
      var arr = ["/approvalPage", '/WaterSideIndex', '/ProcessApproval/PendingTrial', '/HallBusiness', '/RoleManage', '/UserManage', '/UserAuthorization', '/MenuManage', '/UserInfoSearchDetail']
      var arr1 = ['/ProcessApproval/PendingTrial']
      // console.log(val.path)
      if (arr.includes(val.path)) {
        this.menuShow = false;
        $(".primary-menu").css('width', '0px');
        $('.kl-container').css('width', '100%');
        $('.primary-menu .kl-aside').css('display', 'none');
        $('.primary-menu .leftChange').addClass('el-icon-arrow-right').removeClass('el-icon-arrow-left');
      } else {
        this.menuShow = true;
        $(".primary-menu").css('width', '200px');
        $('.kl-container').css('width', 'calc(100% - 210px)');
        $('.primary-menu .kl-aside').css('display', 'block');
        $('.primary-menu .leftChange').addClass('el-icon-arrow-left').removeClass('el-icon-arrow-right');
      }
    },
    navTreeHandleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    collapse() {
      this.util.menuShow('.primary-menu', '.kl-container', '.primary-menu .kl-aside', '.primary-menu .leftChange')
    }
  },
  watch: {
    defaultPage() {
      return this.defaultPage
    },
    defaultUrl() {
      let _this = this
      let newVal = {
        path: this.defaultUrl
      }
      this.changeNav(newVal);
      if (this.defaultUrl) {
        this.$router.push(_this.defaultUrl)
        this.$nextTick(() => {
          $('.' + _this.activeClass).parent().addClass('is-active')
        })
      }
    },
    $route(newVal) {

      // console.log(this.firstNav.navData.navList)
      // console.log(this.reportMenu.secondNav1.navList)
      // console.log(newVal)
      // console.log(this.defaultUrl)
      const match = {
        EngineeringManagement: 'businessMenuShow1',
        CustomerManagement: 'businessMenuShow2',
        MeterReading: 'businessMenuShow3',
        ChargeManagement: 'businessMenuShow4',
        MeterManagement: 'businessMenuShow5',
        CustomerNotificationCenter: 'businessMenuShow6',
        ReportCenter: 'reportMenuShow1',
        EngineeringReport: 'reportMenuShow2',
        WaterMeterReading: 'reportMenuShow3',
        ChargeReport: 'reportMenuShow4',
        OtherReport: 'reportMenuShow5',
        RegionalConfiguration: 'basicsMenuShow1',
        NotificationManagement: 'basicsMenuShow5',
        TemplateConfiguration: 'basicsMenuShow3',
        OtherConfigurations: 'basicsMenuShow4',
        ProcessConfiguration: 'basicsMenuShow6',
        WaterMeterConfiguration: 'basicsMenuShow2'
      }
      for (const key in match) {
        if (newVal.path.startsWith('/' + key)) {
          setTimeout(() => {
            this.menuShowData[match[key]] = true
          }, 0);

        } else {
          setTimeout(() => {
            this.menuShowData[match[key]] = false
          }, 0);

          this.defaultUrl = ''
        }
      }

      const menuMatch = {
        WaterSideIndex: {
          name: 'Home',
          index: 0
        },
        HallBusiness: {
          name: 'Workbench',
          index: 1
        },
        EngineeringManagement: {
          name: 'Business',
          index: 2
        },
        CustomerManagement: {
          name: 'Business',
          index: 2
        },
        MeterReading: {
          name: 'Business',
          index: 2
        },
        ChargeManagement: {
          name: 'Business',
          index: 2
        },
        MeterManagement: {
          name: 'Business',
          index: 2
        },
        CustomerNotificationCenter: {
          name: 'Business',
          index: 2
        },
        ReportCenter: {
          name: 'Statistical',
          index: 3
        },
        EngineeringReport: {
          name: 'Statistical',
          index: 3
        },
        WaterMeterReading: {
          name: 'Statistical',
          index: 3
        },
        ChargeReport: {
          name: 'Statistical',
          index: 3
        },
        OtherReport: {
          name: 'Statistical',
          index: 3
        },
        RegionalConfiguration: {
          name: 'Basics',
          index: 4
        },
        NotificationManagement: {
          name: 'Basics',
          index: 4
        },
        TemplateConfiguration: {
          name: 'Basics',
          index: 4
        },
        OtherConfigurations: {
          name: 'Basics',
          index: 4
        },
        ProcessConfiguration: {
          name: 'Basics',
          index: 4
        },
        WaterMeterConfiguration: {
          name: 'Basics',
          index: 4
        },
        UserAuthorization: {
          name: 'system',
          index: 5
        },
        RoleManage: {
          name: 'system',
          index: 5
        },
        UserManage: {
          name: 'system',
          index: 5
        },
        MenuManage: {
          name: 'system',
          index: 5
        },
      }

      for (const key in menuMatch) {
        if (newVal.path.includes(key)) {
          // this.refreshNav(menuMatch[key].name, menuMatch[key].index)
          // this.menuHandle()
        }
      }

      if (this.defaultUrl == '') {
        this.changeNav(newVal);
      }
    }
  },
}
</script>
<style lang="scss">
@import "../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
section,
section div {
  box-sizing: border-box;
}
.fontRight {
  float: right;
  margin: 0 0 10px;
}
#second_nav .badge {
  height: 17px;
  line-height: 17px;
}
.el-checkbox__label {
  font-size: 12px;
}
.searchInput,
.bigSelect {
  width: 220px;

  .el-form-item__label {
    font-size: 12px;
  }
  .el-form-item__content {
    width: calc(100% - 72px);
    width: calc(100% - 72px) \0;
  }
  .el-input__inner,
  .el-select {
    width: 100% !important;
  }
}
.center-side-right .table-top {
  margin-top: 20px;
  .el-table__body-wrapper {
    font-weight: 700;
  }
  .el-table__body-wrapper tr td:nth-child(1) .cell {
    color: #3195f4;
    cursor: pointer;
  }
}
.custom-home .tab-title {
  height: 2.5rem;
  line-height: 2.5rem;
  margin: 0;
  background: #fff;
  color: #000;
  border-radius: 6px 6px 0 0;
  padding-left: 20px;
  font-size: large;
  font-weight: 600;
  border-bottom: 1px solid #f3f5fb;
  span {
    font-weight: 400;
  }
}
.custom-home .tab-title i {
  width: 4px;
  background: #c4d600;
  border-radius: 4px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f5f5;
}
#firstNav {
  .top,
  .logo,
  .setting {
    height: 58px !important;
    margin-right: -5px;
  }
  .logoLine {
    line-height: 58px;
    margin-right: 0px;
    font-size: 1.5rem;
  }
  .logo img {
    height: 42px !important;
  }
  .title {
    height: 58px;
    line-height: 58px !important;
    font-size: 23px !important;
  }
}
#firstNav .nav .navList > li {
  line-height: 25px;
  height: 24px !important;
}
.el-table__header {
  th {
    color: #111;
    background: #f3f5fb;
  }
}
.custom-home {
  background: #eaf4ff;
  zoom: 1;

  &:after {
    @include _clearBoth();
  }
  .title {
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    height: 50px;
    /* line-height: 50px; */
    padding: 0 20px;
  }
  height: 100%;
  .select-tree {
    z-index: 3000;
    position: fixed;
    right: 0;
    top: 60px;
    height: calc(100% - 60px);
    /*background: #ccc !important;*/
    transition: width 500ms linear;
    box-shadow: 0 0 10px 0 #ccc;
  }
  .show-tree {
    width: 300px;
  }
  .hide-tree {
    width: 0px;
  }
  header {
    height: 88px;
    background-color: #297acc;
    .header-top {
      // display: flex;
      padding-right: 30px;
      color: #fff;
      text-align: center;
      height: 68px;
      line-height: 38px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      zoom: 1;
      &::after {
        display: block;
        content: "";
        clear: both;
      }
      .nav-right {
        height: 38px;
      }
      .header-top-left {
        float: left;
        height: 38px;
        img {
          height: 34px;
          vertical-align: middle;
          line-height: 34px;
          margin-top: -13px;
        }
        i {
          width: 1.8px;
          height: 20px;
          margin-top: 9px;
          background-color: #dfdfea;
          display: inline-block;
          opacity: 0.5;
        }
        & > p {
          float: left;
          height: px2rem(24px);
          border-right: 1px solid #000;
          margin: px2rem(27) px2rem(20);
        }
        span {
          font-weight: bolder;
          font-size: 18px;
          vertical-align: top;
        }
      }
      & > b {
        font-size: 20px;
      }
      .kl-button--mini {
        padding: 2px 10px;
      }
    }
  }
  .header-top-right {
    display: flex;
    align-items: center;
    height: 100%;
    float: right;
    .menu1 {
      margin-right: 40px !important;
      height: 40px;
      cursor: pointer;
    }
    .menu7 {
      margin-right: 5px !important;
    }
    .menu_img {
      margin-right: 30px;
      height: 40px;
      cursor: pointer;
      display: none;
    }
    .el-input__icon {
      line-height: 45px;
    }
    .loginArea {
      display: block;
      float: left;
      position: relative;
      line-height: 8px;
      padding: 0px 10px 0px 40px;
      font-size: 12px;
      text-align: center;
      img {
        width: 45px;
        height: 45px;
        margin: 5px 0;
        border-radius: 50%;
      }
      .userName{
        font-size: 24px;
        font-weight: bold;
        color:#fff;
        line-height: 58px;
      }
      .infoPop {
        display: none;
        position: absolute;
        right: 3px;
        top: 55px;
        width: 100px;
        font-size: 12px;
        line-height: 22px;
        border: 1px solid #e2e2e2;
        background: #fff;
        padding: 10px;
        border-radius: 4px;
        -webkit-box-shadow: 1px 2px 2px #e2e2e2;
        box-shadow: 1px 2px 2px #e2e2e2;
        text-align: left;
        z-index: 2000;
        &:after {
          content: "";
          display: block;
          border-bottom: 10px solid #c5343400;
          border-left: 10px solid #ffffff;
          position: absolute;
          right: 23px;
          top: -3px;
          z-index: 11;
          background-color: transparent;
          transform: rotate(45deg);
        }
        .nick {
          width: 100%;
          color: #4889f3;
          margin: 0;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .line {
          border-bottom: 1px dashed #e4e4e4;
          height: 0;
          font-size: 0;
          overflow: hidden;
          margin: 5px 0;
        }
        .loginout {
          color: #5c5c5c;
          cursor: pointer;
          &:hover {
            color: #bf5757;
          }
        }
      }
    }
    & > span {
      color: #fff;
      font-size: 14px;
      i {
        color: #fff;
        font-size: 14px;
        vertical-align: middle;
        height: 14px;
        width: 14px;
      }
    }
    & > * {
      float: left;
    }
    .el-button--primary {
      border-color: #f78e1e;
      background-color: #f78e1e;
    }
    i {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 10px;
      img {
        width: 40px;
        height: 40px;
        float: left;
      }
    }
    b {
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      padding: 0 20px 0 10px;
      font-weight: 400;
    }
    & > div {
      margin-left: 10px;
      span {
        font-size: 14px;
        color: #f5f7f9;
      }
      u {
        position: absolute;
        padding: 5px;
        border-radius: 50%;
        top: 5px;
        right: 0;
        &.active {
          background: red;
        }
      }
      .el-input.el-input--suffix {
        input {
          border: 0;
          color: #000;
          width: 2.5rem;
          padding-right: 0;
          padding-left: 10px;
          font-size: 12px;
          width: 90px;
          height: 26px;
          line-height: 26px;
        }
        .el-input__suffix {
          right: -10px;
          top: -8px;
          .el-input__suffix-inner {
            .el-select__caret {
              height: auto;
              // margin-top: -4px;
            }
          }
        }
      }
    }
  }
  .first_box {
    width: 100%;
    height: 0.35rem;
    .menu {
      height: 100%;
      div {
        display: inline-block;
        // width: 7%;
        height: 0.25rem;
        line-height: 0.25rem;
        background: white;
        text-align: center;
        border-radius: 0.05rem;
        border: 1px solid red;
        margin-left: 0.1%;
        cursor: pointer;
        margin-top: 0.4%;
        span {
          font-size: 0.12rem;
          color: #428ad2;
          // vertical-align: middle;
          line-height: 70%;
          display: inline-block;
          // margin-top: 2%;
          padding: 0.1rem;
        }
      }
    }
  }
  & > .kl-container {
    height: calc(100% - 90px);
    position: relative;
    background: #eaf4ff;
    padding: 10px;
    float: left;
    width: 100%;
    // width: calc(100% - 20px);
    .kl-aside {
      position: absolute;
      left: 10px;
      // top: 10px;
      width: $imgWidth;
      z-index: 1000;
      background: #fff;
      height: calc(100% - 18px);
      color: #000;
      border-radius: 3px;
    }
    .kl-main {
      height: 100%;
      margin-left: 210px;
      border-radius: 3px;
      background: #fff;
      & > div {
        height: 100%;
        box-sizing: border-box;
        .main-content {
          height: 100%;
          border: 2px solid #f3f5fb;
          /*设置内容区域公共标题样式*/
          .bread-bottom {
            border-bottom: 1px solid #f3f5fb;
          }
        }
      }
      .model-first-rank {
        padding: 0px;
      }
    }
  }
  & > .primary-menu {
    float: left;
    width: 200px;
    height: calc(100% - 110px);
    position: relative;
    background: #fff;
    margin: 10px;
    margin-right: 0px;
    .kl-aside {
      position: absolute;
      left: 0px;
      // top: 10px;
      width: 200px;
      z-index: 1000;
      background: #fff;
      height: calc(100% - 18px);
      color: #000;
      border-radius: 3px;
      .el-menu {
        width: 100%;
        border: none;
        overflow: auto;
        background: transparent;
        background: #fff;
        height: 100%;
        .el-menu-item {
          height: 38px;
        }
        .el-menu-item.is-active {
          background: #328ed1;
          color: #fff;
        }
        .el-menu-item {
          width: 100%;
          text-align: center;
        }
        .el-menu-item,
        li.el-submenu {
          color: #000;
          .el-menu {
            background: transparent;
          }
          .el-submenu__title {
            text-align: left;
            height: 50px !important;
            line-height: 50px !important;
            font-size: 14px;
            font-weight: 700;
            &:hover,
            &:focus {
              background: $theme-color;
            }
          }
        }
        .el-menu-item {
          background: transparent;
          color: #3b3a3a;
          text-align: left;
          height: 38px !important;
          line-height: 38px !important;
          font-size: 14px;
          min-width: 180px;
          &:hover,
          &:focus {
            background: $theme-color;
          }
          &.is-active {
            background: $theme-color;
            color: #fff;
            height: 38px !important;
            line-height: 38px !important;
          }
        }
      }
      .kr-title {
        color: #3195f4;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        text-align: center;
      }
      .switch-btn {
        position: relative;
        width: 18px;
        height: 100%;
        float: left;
        background: rgba(0, 70, 142, 0.1);
        line-height: 100%;
        text-align: center;
        .glyphicon-menu-right,
        .glyphicon-menu-left {
          vertical-align: middle;
          background: rgb(0, 70, 141);
          color: #fff;
          height: 60px;
          line-height: 60px;
          font-weight: bolder;
          position: absolute;
          top: 50%;
          left: 3%;
          transform: translateY(-50%);
          border-radius: 0 3px 3px 0;
        }
      }
    }
  }
}
.el-select-dropdown__item {
  padding: 0 17px;
}
.header-menu {
  //ul
  background-color: #0c6ad7;
  border-right: 0px !important;
  display: flex;
  width: 50%;
  height: 100%;
  .menu-item {
    padding: 3px;
    & > li {
      padding: 11px 15px !important;
      height: 24px;
      font-size: 12px;
    }
    .el-menu-item {
      line-height: 2px;
      border-radius: 2px;
      color: #297acc;
    }
  }
  .el-menu-item:hover {
    //li
    background: #cdcdcd !important;
    color: #297acc !important;
  }
  .el-menu-item {
    height: 100%;
  }
  .is-active {
    background: #328ed1 !important;
    color: #fff !important;
  }
}
.read-only.el-input.is-disabled .el-input__inner {
  border: none;
  background-color: transparent;
  border-radius: 0px;
  cursor: text !important;
  &::-webkit-input-placeholder {
    color: #000;
  }
  &::-moz-placeholder {
    color: #000;
  }
  &:-ms-input-placeholder {
    color: #000;
  }
}
.el-table {
  padding: 0px;
  .el-input__inner {
    // border:none;
    background: transparent;
    height: 30px;
    line-height: 30px;
    padding-right: 0px;
    width: 100% !important;
    padding-left: 0px;
  }
  .el-input__inner:hover {
    border: 1px solid #b8bdca;
  }
  .el-date-editor .el-input__inner {
    padding-left: 30px;
  }
}
#app .center-side .el-dialog {
  width: 70% !important;
  .el-dialog__body {
    height: calc(100% - 56px);
  }
}
#app .searchBtn {
  background: #faa646;
  color: #fff;
}
#app .textareaBecs {
  width: 100%;
  .el-form-item__content {
    width: 50%;
  }
}
#app .basicInfoForm {
  margin: 20px;
  .el-form-item {
    margin-bottom: 18px;
    width: 75%;
    .el-form-item__content {
      width: calc(100% - 150px);
      .el-select {
        // width: 100% !important;
        width: 100%;
      }
    }
  }
  .el-input--mini /deep/ .el-input__inner {
    width: 100% !important;
  }
}
#app .water-side .el-tabs__header.is-top,
#app .WaterSideIndex .el-tabs__header.is-top {
  display: none !important;
}
#app .water-side .mydestop .el-tabs .el-tabs__content,
#app .WaterSideIndex .mydestop .el-tabs .el-tabs__content {
  width: calc(100% - 41px);
}
#app .toolbar-line {
  width: 4px;
  background: #c4d600;
  border-radius: 4px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
}
#app .toolbar-font {
  font-weight: 700;
  font-size: 16px;
  height: 19px;
  display: inline-block;
  line-height: 19px;
  vertical-align: middle;
}
#app .toolbar-fontSon {
  font-size: 14px;
  height: 19px;
  display: inline-block;
  line-height: 19px;
  vertical-align: middle;
}
.el-tree {
  .el-tree-node__label {
    font-size: 12px;
  }
}
.date-picker .el-date-editor {
  display: inline-block;
  width: calc(100% - 30px) !important;
  .el-input__inner {
    width: 100% !important;
    border: none;
    border-bottom: 1px solid #ccc;
    background-color: transparent;
    border-radius: 0px;
  }
}
#app .center-side .quotaSetting .el-dialog__body,
#app .WaterSideIndex2 .quotaSetting .el-dialog__body {
  height: calc(100% - 136px);
}
#app .center-side .echartsWaterSaless .el-dialog {
  height: 70%;
  margin-top: 30px !important;
}
#app .el-input.is-disabled .el-input__inner {
  color: #000;
}
#app .collapse {
  z-index: 1122;
  position: absolute;
  right: 0;
  top: 50%;
  margin-bottom: 25px;
  cursor: pointer;
  background-color: #000;
  color: #f3f3f3;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  -webkit-border-top-left-radius: 3px;
  -webkit-border-bottom-left-radius: 3px;
  -moz-border-radius-topleft: 3px;
  -moz-border-radius-bottomleft: 3px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  filter: alpha(opacity=25);
  -moz-opacity: 0.25;
  opacity: 0.25;
}
#app .StepCollapse {
  z-index: 1122;
  position: absolute;
  right: 153px;
  top: 50%;
  margin-bottom: 25px;
  cursor: pointer;
  background-color: #000;
  color: #f3f3f3;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  -webkit-border-top-right-radius: 3px;
  -webkit-border-bottom-right-radius: 3px;
  -moz-border-radius-topright: 3px;
  -moz-border-radius-bottomright: 3px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  filter: alpha(opacity=25);
  -moz-opacity: 0.25;
  opacity: 0.25;
}
#app .stepsCompar {
  width: 150px;
  height: 100%;
  display: inline-block;
  border-left: 10px solid #eaf4ff;
  position: relative;
  .stepsTitle {
    font-size: 16px;
    margin-left: 10px;
    font-weight: 700;
    color: #4593d8;
    display: inline-block;
  }
  .el-step__title {
    font-size: 14px;
  }
  .el-steps {
    width: calc(100% - 30px);
    height: calc(100% - 80px) !important;
    margin-left: 30px;
  }
  .line {
    border-bottom: 1px solid #4593d8;
    height: 0;
    font-size: 0;
    overflow: hidden;
    margin: 5px 10px;
  }
}
#app .approvalPageDio {
  .el-dialog__body {
    height: calc(100% - 55px);
  }
}
#app .animation {
  transition: all 0.5s;
  -webkit-transform: translateX(0px);
  -ms-transform: translateX(0px);
  transform: translateX(0px);
}
#app .el-checkbox__input.is-checked + .el-checkbox__label {
  margin-right: 0px !important;
}
.el-loading-spinner i {
  font-size: 50px;
}
.el-loading-spinner .el-loading-text {
  font-size: 18px;
}
#app .el-textarea .el-input__count {
  height: 20px;
}
.user-company {
  display: inline-block;
  float: left;
  margin-right: 25px;
  height: 58px;
  .user-name {
    height: 50%;
    line-height: 29px;
    font-size: 14px;
  }
  .company-select {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

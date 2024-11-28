<template>
  <div class="WaterSideIndex">
    <!-- 弹出审批界面 -->
    <el-dialog :title="approvalPageName" class="common-dialog" :close-on-click-modal="false" :visible.sync="approvalPageVisible" @close="closeDialog">
      <approvalPage :approvalPageType="approvalPageType" :codeStep="codeStep" ref="approvalPage"></approvalPage>
    </el-dialog>

    <!-- 弹出业务审批界面 -->
    <el-dialog :title="sectionApprovalName" class="common-dialog approval-dialog" :close-on-click-modal="false" :visible.sync="sectionApprovalVisible" @close="closeDialog">
      <sectionApproval v-if="sectionApprovalVisible" :sectionApprovalType="sectionApprovalType" :category="agencyCategory" ref="sectionApproval"></sectionApproval>
    </el-dialog>

    <!-- 弹出添加快捷菜单界面 -->
    <el-dialog v-if="shortcutVisible" title="快截菜单添加" class="button-dialog" :close-on-click-modal="false" :visible.sync="shortcutVisible" @close="closeDialog">
      <shortcutAdd :shortcutAddLength="shortcutAddLength" ref="shortcutAdd"></shortcutAdd>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="addShortcutMenu">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出通知界面 -->
    <el-dialog :title="noticeApprovalName" class="common-dialog" :close-on-click-modal="false" :visible.sync="noticeApprovalVisible" v-if="noticeApprovalVisible" @close="closeDialog">
      <noticeApproval ref="noticeApproval"></noticeApproval>
    </el-dialog>

    <!-- 弹出公告列表 -->
    <el-dialog :title="bulletinName" class="common-dialog" :close-on-click-modal="false" :visible.sync="bulletinVisible" @close="closeDialog">
      <bulletin ref="bulletin" v-if="bulletinVisible"></bulletin>
    </el-dialog>

    <!-- 弹出公告详情 -->
    <el-dialog :title='bulletinName' class="common-dialog" :close-on-click-modal="false" :visible.sync="noticeVisible" @close="closeDialog">
      <div v-if="noticeVisible" class="noticeContentBody">
        <div class="noticeTitleForm" v-html="noticeTitle"></div>
        <br>
        <div v-html="noticeContent"></div>
      </div>
    </el-dialog>

    

    <section v-show="idShow && !PendingTrialShow" class="homePage">
      <!-- 指标 -->

      
      
    
    </section>
    <!-- <EngineeringList></EngineeringList> -->
  </div>
</template>
<script>
import PendingTrial from '@/views/ProcessApproval/PendingTrial'
import IntegratedBusiness from "@/components/IntegratedBusiness";
import mydestop from "@/views/ProcessApproval/mydestop";
import CenterSideIndex from "@/views/CenterSideIndex";
import echartsWaterSales from "../CenterSideIndex/echartsWaterSales";
import approvalPage from "@/views/ProcessApproval/approvalPage";
import sectionApproval from "./sectionApproval";
import noticeApproval from "./noticeApproval";
import bulletin from "./bulletin";
import shortcutAdd from "./shortcutAdd";
// import InformationReleaseManagementEditForm from '../ServiceCentre/InformationDelivery/InformationReleaseManagementEditFrom'
import processDialog from '@/components/processDialog'
import EngineerApprovalEdit from '../EngineeringCenter/engineerApproval/engineerApprovalEdit.vue';
import EngineeringList from '@/views/EngineeringCenter/engineerApproval/index.vue'
export default {
  name: "WaterSideIndex",
  components: {
    IntegratedBusiness,
    mydestop,
    echartsWaterSales,
    approvalPage,
    sectionApproval,
    noticeApproval,
    bulletin,
    CenterSideIndex,
    shortcutAdd,
    // InformationReleaseManagementEditForm,
    processDialog,
    PendingTrial,
    EngineeringList
  },
  data() {
    return {
      tableQuery: [],
      codeStep: "2",
      CenterSideIndexShow: false,
      shortcutAddLength: false,
      shortcutVisible: false,
      noticeApprovalName: "通知",
      noticeApprovalType: "",
      // cute: require("@/assets/images/水精灵.png"),
      cute: require("@/assets/images/water_cute.png"),
      sectionApprovalType: "",
      sectionApprovalVisible: false,
      sectionApprovalName: "",

      bulletinVisible: false,
      bulletinName: "通知公告",

      approvalPageVisible: false,
      approvalPageName: "办理",
      approvalPageType: "",
      NoticeTitle: "通知公告",
      AgencyTitle: "待办分类",
      menuTitle: "快捷菜单",
      AgencyTitleDetail: "待办项目",
      NoticeList: [
        // {
        //   messageTitle: "深圳市罗湖区爱国路停水通知",
        //   releaseTime: "2019-09-09 "
        // },
        // {
        //   messageTitle: "非居民用水报装指南-永久用水",
        //   releaseTime: "2019-09-11 "
        // },
        // {
        //   messageTitle: "深圳水库2019年度水质报告",
        //   releaseTime: "2019-09-09 "
        // },
        // {
        //   messageTitle: "罗湖水厂开放日通知",
        //   releaseTime: "2019-09-11 "
        // }
      ],
      Agencylist: [
        // {
        //   projectName: "用水咨询",
        //   con: "【SS00192】张三"
        // },
        // {
        //   projectName: "停用",
        //   con: "【CM00112】王燕"
        // },
        // {
        //   projectName: "销户",
        //   con: "【CH00192】李四"
        // },
        // {
        //   projectName: "违约金减免",
        //   con: "【CH00192】李四"
        // },
        // {
        //   projectName: "红冲",
        //   con: "【CH00192】李四"
        // },
        // {
        //   projectName: "校表",
        //   con: "【CH00192】李四"
        // }
      ],
      AgencyCion: [
        {
          label: "工程管理",
          name: "InvoiceReplacement",
          src: require("@/assets/images/待办工程管理.png"),
          num: 0,
          mordel: "2-1",
          category: 'pj'
        },
        {
          label: "抄表开账",
          name: "InvoiceReplacement",
          src: require("@/assets/images/待办抄表开账.png"),
          num: 0,
          mordel: "2-6",
          category: 'mr'
        },
        {
          label: "收费管理",
          name: "InvoiceReplacement",
          src: require("@/assets/images/待办收费管理.png"),
          num: 0,
          mordel: "2-7",
          category: 'bill'
        },
        {
          label: "客户管理",
          name: "UnsettledAccountsStatistics",
          src: require("@/assets/images/待办客户管理.png"),
          num: 0,
          mordel: "2-3",
          category: 'user'
        },
        {
          label: "表计管理",
          name: "CancellationChargeAuthorization",
          src: require("@/assets/images/待办表计管理.png"),
          num: 0,
          mordel: "2-4",
          category: 'ms'
        },
        {
          label: "客户通知",
          name: "CancellationChargeAuthorization",
          src: require("@/assets/images/待办客户通知.png"),
          num: 0,
          mordel: "2-8",
          category: 'notice'
        }
      ],
      idShow: true,
      shortcutMenu: [
        {
          icon: "el-icon-plus",
          title: "自定义菜单"
        }
      ],
      shortcutMenuList: [],
      kpiValue: [
        {
          title: "售水量",
          titleValue: "sellWater",
          src: require("@/assets/images/售水量.png"),
          currMonth: "13000万吨",
          currYear: "130万吨",
          unit: "万吨"
        },
        {
          title: "水费回收率",
          titleValue: "waterRecoveryRate",
          src: require("@/assets/images/水质合格.png"),
          currMonth: "：95%",
          currYear: "99%",
          unit: "%"
        },
        {
          title: "报装业务处理及时率",
          titleValue: "projectTimelinessRate",
          src: require("@/assets/images/水压合格.png"),
          currMonth: "96%",
          currYear: "98%",
          unit: "%"
        },
        {
          title: "投诉处理及时率",
          titleValue: "complainTimelinessRate",
          src: require("@/assets/images/投诉.png"),
          currMonth: "95%",
          currYear: "98%",
          unit: "%"
        }
      ],
      kpiDate: this.common.date("month"),
      kpiMonth: "",
      kpiYear: "",
      menuLeftShow: false,
      noticeApprovalVisible: false,
      editNeedData: {},
      noticeVisible: false,
      agencyCategory: 'pj',
      noticeContent: '',
      noticeTitle:'',
      todoCount: 0,
      PendingTrialShow: false
      // 
      // processDialogShow: false
    };
  },
  mounted() {   
    this.getShortcutMenu(); //快捷菜单
    this.getKpiDate(); //kpi指标初始化
    this.getNoticeList(); //通知公共栏初始化
    this.getClassify(); //待办分类
    this.getTodoCount(); //小水滴
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".WaterSideIndex .WaterSideIndex-right", [
        ".WaterSideIndex .table-top",
        ".WaterSideIndex .blank"
      ]);
    });
  },
  methods: {
    leftShow(i) {
      $("[mykey=" + i + "]").show();
    },
    leftHidden(i) {
      $("[mykey=" + i + "]").hide();
    },
    // 快捷菜单
    getShortcutMenu() {
      this.$api
        .fetch({
          params: {
            busicode: "HomePageQuickMenu",
            data: {}
          } //参数
        })
        .then(res => {
          var List = res
          List.forEach(e => {
            if(e.icon == '' || e.icon.indexOf("el-icon") == -1){
              e.icon = 'el-icon-picture-outline'
            }
          })
          this.shortcutMenuList = List;
        });
    },

    addShortcutMenu() {
      this.$refs.shortcutAdd.getCheckedNodes()
      const formData = this.$refs.shortcutAdd.sectionDate
      let params = {
        busicode: "HomePageQuickMenuSet",
        data: formData.map(item => {
          return {
            "moduleNo": item.opCode,
            "moduleName": item.opName,
            "url": item.url,
            "icon": item.icon
          }
        })
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          this.closeDialog();
          this.getShortcutMenu();
        });
    },
    getKpiTime() {
      this.kpiYear = this.kpiDate.substring(0, 4) + "年";
      if (this.kpiDate.substring(4, 5) == "0") {
        this.kpiMonth = this.kpiDate.substring(5, 6) + "月";
      } else {
        this.kpiMonth = this.kpiDate.substring(4, 6) + "月";
      }
    },
    getKpiDate() {
      this.$api
        .fetch({
          params: {
            busicode: "HomePageKpi",
            data: {
              time: this.kpiDate
            }
          } //参数
        })
        .then(res => {
          for (let key in res) {
            this.kpiValue.forEach(val => {
              if (val.titleValue == key) {
                val.currMonth = res[key].currMonth;
                val.currYear = res[key].currYear;
              }
            });
          }
        });
      this.getKpiTime();
    },
    getNoticeList() {
      this.$api
        .fetch({
          params: {
            busicode: "NoticeList",
            data: {
              page: 1,
              pageCount: 10,
              status:2
            }
          } //参数
        })
        .then(res => {
          this.NoticeList = res.list;
        });
    },
    getClassify(refresh = 0) {
      if (refresh === 1) {
        $('#agencyCionRefresh').addClass('refresh-animation')
      }
      if (refresh === 2) {
        $('#agencyListRefresh').addClass('refresh-animation')
      }
      this.$api
        .fetch({
          params: {
            busicode: "HomePageToDo",
            data: {
              page: 1,
              pageCount: 10
            }
          } //参数
        })
        .then(res => {
          // 工程管理数量
          this.AgencyCion[0].num = res.todoClassify.project;
          // 抄表开账待办数量
          this.AgencyCion[1].num = res.todoClassify.meterReading;
          // 收费中心待办数量
          this.AgencyCion[2].num = res.todoClassify.charge;
          // 客户中心待办数量
          this.AgencyCion[3].num = res.todoClassify.customer;
          // 表计管理待办数量
          this.AgencyCion[4].num = res.todoClassify.meter;
          // 通知中心待办数量
          this.AgencyCion[5].num = res.todoClassify.notice;

          // 待办项目列表
          this.Agencylist = res.todoProject;
        }).finally(() => {
          $('#agencyCionRefresh').removeClass('refresh-animation')
          $('#agencyListRefresh').removeClass('refresh-animation')
        });
    },
    getTodoCount() {
      this.$api.fetch({
        params: {
          busicode: 'HomePageWaterElfCount'
        }
      }).then(res => {
        this.todoCount = res
      })
    },
    moreAnaly() {
      this.CenterSideIndexShow = true;
      this.idShow = false;
    },
    cionLogoShow() {
      this.noticeApprovalVisible = true;
    },
    handlePorject(val) {
      // this.processDialogShow = false
      // this.approvalPageType = val.title;
      // this.approvalPageName = "办理-" + val.title;
      // this.approvalPageVisible = true;
      // this.codeStep = "2";
      this.editNeedData = val
      this.editNeedData.id = val.billId
      this.editNeedData.saveType = 'edit'
      // this.processDialogShow = true
      this.$refs.processDialog.open(val.processCode, this.editNeedData)
    },
    closeDialog() {
      //关闭会话
      this.waterAddVisible = false;
      this.approvalPageVisible = false;
      this.sectionApprovalVisible = false;
      this.noticeApprovalVisible = false;
      this.bulletinVisible = false;
      this.shortcutVisible = false;
      this.noticeVisible = false;
      this.codeStep = "0";
    },
    sectionShow(val, value, category) {
      this.sectionApprovalType = value;
      this.agencyCategory = category;
      this.sectionApprovalVisible = true;
      this.sectionApprovalName = "办理-" + val;
    },
    bulletinShow() {
      this.bulletinVisible = true;
    },
    noticeShow(item) {
      this.noticeVisible = true;
      this.editNeedData = item;
      const params = {
        "busicode": "NoticeQuery",
        "data": {
          id: item.id
        }
      }
      this.$api.fetch({
        params: params,//参数
        
      }).then(res => {
        this.noticeTitle = res.messageTitle
        this.noticeContent = res.releaseContent
      })
    },
    // 点击快捷菜单列表跳转
    add(url) {
      this.$parent.changeTbas(url);

    },
    // 添加快捷菜单
    shortcutAdd(i) {
      this.shortcutVisible = true;
    },
    //删除快捷菜单
    del(i, event) {
      event.stopPropagation();
      this.$confirm("是否确认删除该快捷菜单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .fetch({
              params: {
                busicode: "HomePageQuickDelete",
                data: {
                  id: this.shortcutMenuList[i].id
                }
              }
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getShortcutMenu()
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    PendingTrial(targetName, mordel) {
      if (targetName === "待办分类") {
        this.PendingTrialShow = true
        localStorage.setItem("text", "true");
        localStorage.setItem("mordel", mordel);
      }
    },
    addTab(targetName, mordel) {
      let path = "";
      if (targetName === "待办分类") {
        path = '/ProcessApproval/PendingTrial'
        localStorage.setItem("text", "true");
        localStorage.setItem("mordel", mordel);
      } else if (targetName === "工作台") {
        path = '/HallBusiness'
      } else if (targetName === "通知公告") {
        path = '/CustomerNotificationCenter/InformationReleaseManagement'
      } else if (targetName === "用水咨询") {
        path = '/EngineeringManagement/waterQuery'
      } else if (targetName === "抄表录入") {
        path = '/MeterReading/MeterReadingRecord'
      } else if (targetName === "权限管理") {
        path = '/RoleManage'
      } else if (targetName === "业务办理分析") {
        path = '/BusinessManagement'
      } else if (targetName === "微信对账异常提醒") {
        path = '/ChargeManagement/UnionPay'
        this.noticeApprovalVisible = false;
      } else if (targetName === "水表到期提醒") {
        path = '/MeterManagement/WaterMeterInquiry'
        this.noticeApprovalVisible = false;
      } else if (targetName === "流程超时提醒") {
        path = '/ProcessConfiguration/OverDueRecord'
        this.noticeApprovalVisible = false;
      } else if (targetName === "抄表异常提醒") {
        path = '/MeterReading/AbnormalVerification'
        this.noticeApprovalVisible = false;
      }
      if(path !== '') {
        this.$parent.changeTbas(path);
      }
    },
    backDialog() {
      this.CenterSideIndexShow = false;
      this.idShow = true;
    },
    startMove(e) {
      // 鼠标按下，计算当前元素距离可视区的距离
      const _this = this
      const startTime = new Date()
      const dragDom = document.querySelector('#draggable')
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
      const disX = e.clientX - dragDom.offsetLeft
      const disY = e.clientY - dragDom.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
      let moved = false
      document.onmousemove = function (ev) {
        moved = true
        // 通过事件委托，计算移动的距离
        const l = ev.clientX - disX
        const t = ev.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l > document.body.clientWidth ? document.body.clientWidth : l}px`
        dragDom.style.top = `${t > document.body.clientHeight ? document.body.clientHeight : t}px`

        ev.preventDefault()
      }

      document.onmouseup = function (ev) {
        document.onmousemove = null
        document.onmouseup = null
        if ((new Date() - startTime < 300) && !moved) {
          _this.cionLogoShow()
        }
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;

.WaterSideIndex {
  width: 100%;
  height: 100%;
  .hhh {
    display: none;
  }
  .homePage {
    width: 100%;
    height: 100%;
    padding: 10px;
    zoom: 1;
    &::after{
      display: block;
      content: "";
      clear: both;
    }
  }
  .mydestop,
  .BusinessHall {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
  }
  .el-table .el-table__body tr td:nth-child(1) div {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cionLogo {
    width: 100px;
  }
  .draggableCion {
    width: 100px;
    height: 90px;
    position: absolute;
    bottom: 40px;
    right: 40px;
    cursor: move;
  }
  .Highlight-line {
    height: 20px;
    width: 2px !important;
    background-color: #297acc;
    padding-left: 0px !important;
    margin-right: 10px;
    margin-top: 8px;
  }
  &:after {
    @include _clearBoth();
  }

  .noticeContentBody {
    padding: 20px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    .noticeTitleForm{
      text-align: center;
    }
  }

  .WaterSideIndex-center {
    width: 55%;
    height: 100%;
    float: left;
    padding-right: 10px;
    .WaterSideIndex-pie {
      width: 100%;
      height: 100%;
      zoom: 1;
      &:after {
        @include _clearBoth();
      }
      & > li {
        box-shadow: 0 0 10px #0000004a;
        float: left;
        width: 100%;
        height: 50%;
        border-radius: 2px;
        border: 1px solid #e4e7ed;
        h3 {
          height: 35px;
          line-height: 35px;
          font-size: 16px;
          padding-left: 15px;
          border-bottom: 1px solid #e4e7ed;
          background-color: #f5f5f5;
          zoom: 1;
          &:after {
            @include _clearBoth();
          }
          & > div {
            padding-left: 15px;
            float: left;
            zoom: 1;
            &:first-of-type {
              width: calc(50% - 16px);
              border-right: 1px solid #f5f5f5;
            }
            &:last-of-type {
              width: calc(50% - 15px);
            }
            &:after {
              @include _clearBoth();
            }
          }
          span {
            float: left;
          }
          i {
            float: right;
            font-size: 18px;
            width: 30px;
            height: 35px;
            line-height: 35px;
            &:hover {
              cursor: pointer;
            }
          }
          & > h5 {
            float: right;
            padding-right: 10px;
            .el-input__inner {
              padding-left: 2px;
            }
          }
        }
        section {
          width: 100%;
          height: calc(100% - 50px);
          margin-top: 10px;
          zoom: 1;
          overflow-y: auto;
          overflow-x: hidden;
          &:after {
            @include _clearBoth();
          }
          div {
            float: left;
            width: 50%;
            height: calc(100% - 5px);
          }
          h2 {
            height: 25px;
            line-height: 25px;
            padding-left: 15px;
            font-size: 14px;
            font-weight: 700;
          }

          ol {
            zoom: 1;
            &:after {
              @include _clearBoth();
            }
          }
          ol li {
            p {
              height: 25px;
              line-height: 25px;
              text-align: center;
              padding-left: 20px;
              font-size: 14px;
              font-weight: 700;
              span {
                margin-left: 10px;
              }
            }
          }
        }
      }
      & > .WaterSideIndex-left {
        width: calc(100% - 20px);
        zoom: 1;
        &:after {
          @include _clearBoth();
        }
        & > section {
          width: 50%;
          float: left;
          div {
            //    margin-top: 25px;
            height: 100%;
          }
        }
        .waterPay div {
          // margin-top: 25px;
        }
      }
      .Notice {
        width: 100%;
        zoom: 1;
        &:after {
          @include _clearBoth();
        }
        .NoticeLeft {
          height: 100%;
          width: calc(100% - 22px);
          padding-left: 15px;
          float: left;
          h2 {
            color: #666666;
            font-weight: 400;
            margin-bottom: 10px;
            .el-icon-bell {
              color: #3991dc;
            }
            .NoticeLeftTime {
              font-style: unset;
              margin-top: 0px;
              line-height: 20px;
              font-size: 12px;
              white-space: nowrap;
              margin-right: 0;
              margin-left: 5px;
              width: 10em;
              max-width: 10em;
              display: inline-block;
              color: #9e9e9e;
              text-align: right;
              float: right;
              margin-right: 10px;
            }
            &:hover {
              cursor: pointer;
              color: $theme-color;
            }
          }

          & > div {
            padding-top: 15px;
          }
        }
        section {
          margin-top: 0px;

          div {
            padding-top: 15px;
            &:nth-of-type(1) {
              width: calc(50% - 1px);
              border-right: 1px solid #f5f5f5;
            }
            h2 {
              color: #666666;
              font-weight: 400;
              &:hover {
                text-decoration: underline;
                cursor: pointer;
                color: $theme-color;
              }
            }
          }
        }
      }
      .shortcutMenu {
        section {
          ul {
            width: 100%;
            height: 100%;
            zoom: 1;
            &:after {
              @include _clearBoth();
            }
            & > li {
              float: left;
              width: calc(25% - 12px);
              height: calc(50% - 12px);
              text-align: center;
              border: 1px dashed #b2b4b8ad;
              margin: 5px;
              position: relative;
              background-color: #fefeff;

              h4 {
                color: #c0c4cc;
              }
              &:hover {
                cursor: pointer;
                background: #d0e0ff52;
              }
              &:nth-of-type(1) {
                h4 {
                  color: #f77a76;
                }
              }
              &:nth-of-type(2) {
                h4 {
                  color: #66b5f0;
                }
              }
              &:nth-of-type(3) {
                h4 {
                  color: #a1de8e;
                }
              }
              &:nth-of-type(4) {
                h4 {
                  color: #98adff;
                }
              }
              &:nth-of-type(5) {
                h4 {
                  color: #ffca64;
                }
              }
              &:nth-of-type(6) {
                h4 {
                  color: #c0c4cc;
                }
              }
              &:nth-of-type(7) {
                h4 {
                  color: #c0c4cc;
                }
              }
              &:nth-of-type(8) {
                h4 {
                  color: #c0c4cc;
                }
              }
              i {
                font-size: 3.5rem;
                padding: 0.65rem 1.68rem;
              }
              h4 {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }
  }

  .WaterSideIndex-right {
    width: 25%;
    height: 100%;
    float: left;

    .WaterSideIndex-pie {
      width: 100%;
      height: 100%;
      zoom: 1;
      &:after {
        @include _clearBoth();
      }
      & > li {
        float: left;
        box-shadow: 0 0 10px #0000004a;
        width: 100%;
        height: 50%;
        border-radius: 2px;
        border: 1px solid #e4e7ed;
        h3 {
          height: 35px;
          line-height: 35px;
          font-size: 16px;
          padding-left: 15px;
          border-bottom: 1px solid #e4e7ed;
          zoom: 1;
          background-color: #f5f5f5;
          &:after {
            @include _clearBoth();
          }
          & > div {
            padding-left: 15px;
            float: left;
            zoom: 1;
            &:first-of-type {
              width: calc(50% - 16px);
              border-right: 1px solid #f5f5f5;
            }
            &:last-of-type {
              width: calc(50% - 15px);
            }
            &:after {
              @include _clearBoth();
            }
          }
          span {
            float: left;
          }
          i {
            float: right;
            font-size: 18px;
            width: 30px;
            height: 35px;
            line-height: 35px;
            &:hover {
              cursor: pointer;
            }
          }
          & > h5 {
            float: right;
            padding-right: 10px;
            .el-input__inner {
              padding-left: 2px;
            }
          }
        }
      }
      .Notice {
        zoom: 1;
        &:after {
          @include _clearBoth();
        }
        .btnsBlock {
          width: 100%;
          height: calc(100% - 46px);
          margin: 5px auto;
          display: flex;
          flex-wrap: wrap;
          .circular {
            text-align: center;
            color: #fff;
            z-index: 2;
            margin-left: 15px;
            position: absolute;
            left: calc(50% + 2px);
            top: 5px;
          }
          & > div {
            width: 33%;
            float: left;
            text-align: center;
            min-height: 43px;
            padding: 18px;
            position: relative;
          }
        }
        .pending {
          height: 100%;
          h2 {
            color: #666666;
            font-weight: 400;
            margin-bottom: 10px;
            i {
              font-style: initial;
              display: inline-block;
              width: calc(100% - 30px);
            }
            &:hover {
              text-decoration: underline;
              cursor: pointer;
              color: $theme-color;
            }
          }

          .noticeList {
            padding-top: 15px;
            padding-left: 15px;
            height: calc(100% - 35px);
            overflow: auto;
          }
        }
      }
    }
  }
  .WaterSideIndex-left {
    width: 20%;
    height: 100%;
    float: left;
    padding-right: 10px;
  }
  .quota {
    // margin: 10px;
    height: 100%;
    padding: 10px;
    border: 1px solid #e4e7ed;
    box-shadow: 0 0 10px #0000004a;
    .quota-select {
      .monthSelect {
        margin-bottom: 10px;
        width: 60% !important;
      }
      .el-date-editor /deep/ {
        .el-input__inner {
          font-size: 14px;
          color: #0f78ab;
          border: 0px;
          cursor: pointer;
        }
        .el-input__prefix {
          font-size: 14px;
          color: #0f78ab;
          cursor: pointer;
        }
      }
      .item-chart {
        font-size: 18px;
        float: right;
        color: #969e9e;
        cursor: pointer;
      }
    }
    .quota-div {
      height: 24%;
      padding-bottom: 10px;
    }
    .task-num-border {
      border: 1px solid #e4e7ed;
      border-radius: 5px;
      background: #fff;
      height: 100%;
      padding: 10px;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    .task-num {
      width: 200px;
      margin: 0 auto;
      padding: 2.3rem 0px;
      &:first {
        margin-left: 0;
      }

      &:after {
        @include _clearBoth();
      }
      img {
        width: 3rem;
        height: 3.18rem;
        vertical-align: middle;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
      }
      span {
        float: left;
      }
      p {
        font-size: 0.75rem;
        font-family: "\5FAE\8F6F\96C5\9ED1";
        color: #000;
        margin-top: 5px;
      }
      i {
        color: $theme-color;
        font-size: 14px;
        font-style: normal;
      }
      b {
        color: #000;
        font-size: 12px;
        font-weight: 400;
      }
    }
    .el-col:nth-of-type(1) {
      padding-left: 0px !important;
      .task-num {
        width: 163px;
        margin: 0 auto;
      }
    }
    .el-col:nth-of-type(4) {
      .task-num {
        width: 166px;
        margin: 0 auto;
      }
    }
    .el-col:nth-of-type(3) {
      .task-num {
        width: 185px;
        margin: 0 auto;
      }
    }
    .el-col:last-child {
      .task-num {
        width: 123px;
      }

      span {
        margin-top: 10px;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .WaterSideIndex .WaterSideIndex-center .WaterSideIndex-pie .shortcutMenu {
    section {
      margin-top: 5px;
      height: calc(100% - 40px);
      ul {
        & > li {
          float: left;
          width: calc(25% - 12px);
          height: calc(50% - 12px);
          text-align: center;
          // border:1px dashed rgb(12, 16, 24);
          margin: 5px;
          &:nth-of-type(1) {
            width: calc(50% - 12px);
          }
          &:nth-of-type(2) {
            width: calc(50% - 12px);
          }
          i {
            font-size: 2rem;
            padding: 0.15rem 1.68rem;
          }
        }
      }
    }
  }
}
.el-icon-refresh {
  text-align: center;
}
.refresh-animation {
  animation: rotate 1s infinite;
  transform-origin: center center;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.approval-dialog {
  /deep/ {
    .el-dialog__body {
      height: calc(100% - 55px) !important;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss">
.noticeContentBody{
  figure.image{
    img{
        width: 100%;
    }
  }
}
</style>
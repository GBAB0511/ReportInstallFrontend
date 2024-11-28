import Vue from "vue";
import Router from "vue-router";

// 统计报表
import IntelligentAnalysis from "./ReportCenter/IntelligentAnalysis";
import EngineeringReport from "./ReportCenter/EngineeringReport";
import WaterMeterReading from "./ReportCenter/WaterMeterReading";
import ChargeReport from "./ReportCenter/ChargeReport";
import OtherReport from "./ReportCenter/OtherReport";
//下载页
import DownloadPage from "./DownloadPage";
//系统管理
import SystemSet from "./SystemSet";

// 基础配置
import RegionalConfiguration from "./BasicConfiguration/RegionalConfiguration";
import WaterMeterConfiguration from "./BasicConfiguration/WaterMeterConfiguration";
import NotificationManagement from "./BasicConfiguration/NotificationManagement";
import TemplateConfiguration from "./BasicConfiguration/TemplateConfiguration";
import OtherConfigurations from "./BasicConfiguration/OtherConfigurations";
import ProcessConfiguration from "./BasicConfiguration/ProcessConfiguration";
// 业务管理
import EngineeringManagement from "./BusinessManagement/EngineeringManagement";
import CustomerManagement from "./BusinessManagement/CustomerManagement";
import MeterReading from "./BusinessManagement/MeterReading";
import ChargeManagement from "./BusinessManagement/ChargeManagement";
import MeterManagement from "./BusinessManagement/MeterManagement";
import CustomerNotificationCenter from "./BusinessManagement/CustomerNotificationCenter";

Vue.use(Router);

var router;

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router = new Router({
  routes: [
    {
      path: "/",
      meta: {
        title: "主容器"
      },
      component: resolve => require(["@/views/home"], resolve),
      children: [
        {
          path: "/",
          meta: {
            title: "首页"   //水司端首页
          },
          component: resolve => require(["@/views/WaterSideIndex"], resolve)
        },
        {
          path: "/WaterSideIndex",
          meta: {
            title: "首页"   //水司端首页
          },
          component: resolve => require(["@/views/WaterSideIndex"], resolve)
        },
        {
          path: "/HallBusiness",
          meta: {
            title: "工作台" //important
          },
          component: resolve =>
            require(["@/views/ServiceCentre/HallBusiness"], resolve)
        },
        {
          path: "/UserInfoSearchDetail",
          meta: {
            title: "快捷查询" //important
          },
          component: resolve =>
            require(["@/views/UserInfoSearchDetail"], resolve)
        },
        {
          path: "/DownloadPage",
          meta: {
              title: "下载页" //important
          },
          component: resolve =>
              require(["@/views/DownloadPage"], resolve)
        },
        {
          path: "/CenterSideIndex",
          meta: {
            title: "集团首页"
          },
          component: resolve => require(["@/views/CenterSideIndex"], resolve)
        },

        {
          path: "/ProcessApproval/PendingTrial",
          meta: {
            title: "流程中心"
          },
          component: resolve =>
            require(["@/views/ProcessApproval/PendingTrial"], resolve)
        },
        // 统计报表
        ...IntelligentAnalysis,
        ...EngineeringReport,
        ...WaterMeterReading,
        ...ChargeReport,
        ...OtherReport,

        // 系统管理
        ...SystemSet,
        
        //下载页
        ...DownloadPage,

        // 一级菜单-基础配置
        // 区域配置
        ...RegionalConfiguration,
        // 水表配置
        ...WaterMeterConfiguration,
        // 通知管理
        ...NotificationManagement,
        // 模板配置
        ...TemplateConfiguration,
        // 其他配置
        ...OtherConfigurations,
        //流程超时配置
        ...ProcessConfiguration,
        // 一级菜单-业务管理
        // 工程管理
        ...EngineeringManagement,
        // 客户管理
        ...CustomerManagement,
        // 抄表开张
        ...MeterReading,
        // 收费管理
        ...ChargeManagement,
        // 表计管理
        ...MeterManagement,
        // 客户通知
        ...CustomerNotificationCenter,

        // 销售管理
        {
          path: "/CustomerAnalysisReport",
          meta: {
            title: "销售管理"
          },
          component: resolve =>
            require(["@/views/CustomerAnalysisReport"], resolve),
          children: []
        },
        // 客户管理
        {
          path: "/ChargeAnalysisStatement",
          meta: {
            title: "客户管理"
          },
          component: resolve =>
            require(["@/views/ChargeAnalysisStatement"], resolve),
          children: []
        },
        // 业务办理
        {
          path: "/EngineeringAnalysisReport",
          meta: {
            title: "业务办理"
          },
          component: resolve =>
            require(["@/views/EngineeringAnalysisReport"], resolve),
          children: []
        },
        // 呼叫中心
        {
          path: "/StatementAnalysisReport",
          meta: {
            title: "呼叫中心"
          },
          component: resolve =>
            require([
              "@/views/AnalysisCenter/StatementAnalysisReport"
            ], resolve),
          children: []
        },
        // 微厅分析报表
        {
          path: "/MicrosoftAnalysisReport",
          meta: {
            title: "微厅分析报表"
          },
          component: resolve =>
            require([
              "@/views/AnalysisCenter/MicrosoftAnalysisReport"
            ], resolve),
          children: []
        },
        // 网厅分析报表
        {
          path: "/NetOfficeAnalysisReport",
          meta: {
            title: "网厅分析报表"
          },
          component: resolve =>
            require([
              "@/views/AnalysisCenter/NetOfficeAnalysisReport"
            ], resolve),
          children: []
        },
        // 智慧营业厅分析报表
        {
          path: "/AnalysisReportIntelligentBusiness",
          meta: {
            title: "智慧营业厅分析报表"
          },
          component: resolve =>
            require([
              "@/views/AnalysisCenter/AnalysisReportIntelligentBusiness"
            ], resolve),
          children: []
        }
      ]
    },
    //     {
    //   path: '/login',
    //   meta: {
    //     title: '登录'
    //   },
    //   component: resolve => require(['@/views/login.vue'], resolve)
    // },
    {
      path: "/error",
      meta: {
        title: "错误页面"
      },
      component: resolve => require(["@/views/errorPage"], resolve)
    }
  ]
});

// 主要处理三四级菜单的跳转
router.beforeEach((to, from, next) => {
  let thirdMenu = JSON.parse(sessionStorage.getItem("thirdMenu"));
  let thirdMenuData = {};
  for (const key in thirdMenu) {
    if (key == "businessMenu") {
      thirdMenuData.EngineeringManagement = thirdMenu[key].secondNav1.navList;
      thirdMenuData.CustomerManagement = thirdMenu[key].secondNav2.navList;
      thirdMenuData.MeterReading = thirdMenu[key].secondNav3.navList;
      thirdMenuData.ChargeManagement = thirdMenu[key].secondNav4.navList;
      thirdMenuData.MeterManagement = thirdMenu[key].secondNav5.navList;
      thirdMenuData.CustomerNotificationCenter =
        thirdMenu[key].secondNav6.navList;
    }
    if (key == "reportMenu") {
      thirdMenuData.ReportCenter = thirdMenu[key].secondNav1.navList;
      thirdMenuData.EngineeringReport = thirdMenu[key].secondNav2.navList;
      thirdMenuData.WaterMeterReading = thirdMenu[key].secondNav3.navList;
      thirdMenuData.ChargeReport = thirdMenu[key].secondNav4.navList;
      thirdMenuData.OtherReport = thirdMenu[key].secondNav5.navList;
    }
    if (key == "basicsMenu") {
      thirdMenuData.RegionalConfiguration = thirdMenu[key].secondNav1.navList;
      thirdMenuData.WaterMeterConfiguration = thirdMenu[key].secondNav2.navList;
      thirdMenuData.TemplateConfiguration = thirdMenu[key].secondNav3.navList;
      thirdMenuData.OtherConfigurations = thirdMenu[key].secondNav4.navList;
      thirdMenuData.NotificationManagement = thirdMenu[key].secondNav5.navList;
      thirdMenuData.ProcessConfiguration = thirdMenu[key].secondNav6.navList;
    }
  }
  for (const thirdMenukey in thirdMenuData) {
    if (to.redirectedFrom && to.redirectedFrom.indexOf(thirdMenukey) > -1) {
      if (thirdMenuData[thirdMenukey][0].children.length > 0) {
        // 四级菜单跳转
        next({ path: thirdMenuData[thirdMenukey][0].children[0].url });
      } else {
        // 三级菜单跳转
        next({ path: thirdMenuData[thirdMenukey][0].url })
      }
    } else {
      next()
    }
  }
  if (!to.redirectedFrom) {// 首次打开系统时执行
    next()
  }
});

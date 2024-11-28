import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

// 基础配置
import BasicConfigurationRouters from "./BasicConfiguration"   
// 业务管理
import BusinessManagementRouters from "./BusinessManagement" 
// 统计报表
// import ReportCenterRouters from "./ReportCenter" 
// 系统管理
import SystemSet from "./SystemSet" 
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    meta: {
        title: "主容器"
    },
    component: resolve => require(["@/views/homeNew"], resolve),
    redirect:"/EngineeringManagement/engineerApproval",
    children: [
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
        ...BasicConfigurationRouters,
        ...BusinessManagementRouters,
        // ...ReportCenterRouters,
        ...SystemSet
    ]
  },
  {
    path: "/error",
    meta: {
      title: "错误页面"
    },
    component: resolve => require(["@/views/errorPage"], resolve)
  },
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: resolve => require(['@/views/login.vue'], resolve)
  },
]


const router = new Router({
  routes,
  scrollBehavior: () => ({ y: 0 })
})

export default router

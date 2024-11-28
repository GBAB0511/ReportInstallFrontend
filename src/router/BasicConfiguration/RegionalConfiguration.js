
export default [
  {
    path: "/RegionalConfiguration",
    meta: {
      title: "区域配置"
    },
    component: resolve => require(["@/views/BasicSet"], resolve),
    children: [
      // {
      //     path: '/',
      //     redirect:"BusinessAbode"
      // },
      {
        path: "/RegionalConfiguration/BusinessBranch",
        meta: {
          title: "营业网点"
        },
        component: resolve =>
          require(["@/views/BasicSet/BasicInfo/BusinessBranch/index"], resolve),
        children: []
      },
      {
        path: "/RegionalConfiguration/BusinessAbode",
        meta: {
          title: "营业所"
        },
        component: resolve =>
          require(["@/views/BasicSet/BasicInfo/BusinessAbode/index"], resolve),
        children: []
      },
      {
        //基础设置-基础信息-营业区域
        path: "/RegionalConfiguration/BusinessArea",
        meta: {
          title: "营业区域"
        },
        component: resolve =>
          require(["@/views/BasicSet/BasicInfo/BusinessArea/index"], resolve),
        children: []
      },
      {
        //基础设置-基础信息-营业区域
        path: "/RegionalConfiguration/servantRegionConfiguration",
        meta: {
          title: "服务区域配置"
        },
        component: resolve =>
          require([
            "@/views/BasicSet/BasicInfo/servantRegionConfiguration/index"
          ], resolve),
        children: []
      },
      {
        //基础设置-基础信息-营业区域
        path: "/RegionalConfiguration/structuralAddressManagement",
        meta: {
          title: "结构地址管理"
        },
        component: resolve =>
          require([
            "@/views/BasicSet/BasicInfo/structuralAddressManagement/index"
          ], resolve),
        children: []
      },
      {
        //基础设置-基础信息-旧行政区域
        path: "/RegionalConfiguration/OldArea",
        meta: {
          title: "营业区域"
        },
        component: resolve =>
          require(["@/views/BasicSet/BasicInfo/OldArea/index"], resolve),
        children: []
      },
      // {//基础设置-基础信息-行政区域
      //     path: '/RegionalConfiguration/AdminRegion',
      //     meta: {
      //     title: '行政区域'
      //     },
      //     component: resolve => require(['@/views/BasicSet/BasicInfo/AdminRegion/index'], resolve),
      //     children:[],
      // },
    ]
  }
];
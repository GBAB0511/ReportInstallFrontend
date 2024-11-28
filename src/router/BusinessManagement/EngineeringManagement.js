
export default ([
    {
        path: '/EngineeringManagement',
        meta: {
          title: '用水咨询'
        },
        component: resolve => require(['@/views/EngineeringCenter'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"waterQuery"
            // },
            {
                path: '/EngineeringManagement/waterQuery',
                meta: {
                title: '用水咨询'
                },
                component: resolve => require(['@/views/EngineeringCenter/waterQuery'], resolve)
            },
            {
                path: '/EngineeringManagement/waterMeterInstall',
                meta: {
                title: '用水安装'
                },
                component: resolve => require(['@/views/EngineeringCenter/waterMeterInstall'], resolve)
            },
            {
              path: '/EngineeringManagement/engineerApproval',
              meta: {
              title: '工程审批'
              },
              component: resolve => require(['@/views/EngineeringCenter/engineerApproval'], resolve)
            },
            {
              path: '/EngineeringManagement/engineerDelay',
              meta: {
              title: '工程延期'
              },
              component: resolve => require(['@/views/EngineeringCenter/engineerDelay'], resolve)
            },
            {
              path: '/EngineeringManagement/engineerPending',
              meta: {
              title: '工程挂起'
              },
              component: resolve => require(['@/views/EngineeringCenter/engineerPending'], resolve)
            },
            {
              path: '/EngineeringManagement/engineerTermination',
              meta: {
              title: '工程终止'
              },
              component: resolve => require(['@/views/EngineeringCenter/engineerTermination'], resolve)
            },
            {
              path: '/EngineeringManagement/engineerFeeDetail',
              meta: {
              title: '工程收款'
              },
              component: resolve => require(['@/views/EngineeringCenter/engineerFeeDetail'], resolve)
            },
            {
              path: '/EngineeringManagement/settlementCompile',
              meta: {
                title: '编制结算'
              },
              component: resolve => require(['@/views/EngineeringCenter/settlementCompile'], resolve)
            },
            {
              path: '/EngineeringManagement/engineerFeeAdjust',
              meta: {
              title: '工程款调整'
              },
              component: resolve => require(['@/views/EngineeringCenter/engineerFeeAdjust'], resolve)
            },
            {// 内部工程-内部工程
                path: '/EngineeringManagement/insideAllProjects',
                meta: {
                title: '内部工程'
                },
                component: resolve => require(['@/views/EngineeringCenter/insideEnging/index.vue'], resolve)
            },
            {
                path: '/EngineeringManagement/companyEditProjects',
                meta: {
                title: '工改系统'
                },
                component: resolve => require(['@/views/EngineeringCenter/companyEditProjects/index.vue'], resolve)
            },
            {
              path: '/EngineeringManagement/materialManagement',
              meta: {
              title: '材料管理'
              },
              component: resolve => require(['@/views/EngineeringCenter/materialManagement'], resolve)
            },
        ],
    },
])

export default ([
    {
        path: '/ProcessConfiguration',
        meta: {
          title: '流程超时配置'
        },
        component: resolve => require(['@/views/BasicSet'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"OverDue"
            // },
            {//基础设置-水精灵管理-流程超时配置
                path: '/ProcessConfiguration/OverDue',
                meta: {
                title: '流程超时配置'
                },
                component: resolve => require(['@/views/BasicSet/OverDue/index'], resolve),
                children:[],
            },
            {//基础设置-水精灵管理-流程超时记录
                path: '/ProcessConfiguration/OverDueRecord',
                meta: {
                title: '流程超时记录'
                },
                component: resolve => require(['@/views/BasicSet/OverDue/OverDueRecord'], resolve),
                children:[],
            },
           
        ],
    },
])

export default ([
    {
        path: '/WaterMeterConfiguration',
        meta: {
          title: '水表配置'
        },
        component: resolve => require(['@/views/BasicSet'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"MeterRelationship"
            // },
            {// 抄表-水表关系
                path: '/WaterMeterConfiguration/MeterRelationship',
                meta: {
                title: '水表关系'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/MeterRelationship/index'], resolve)
            },
            {//基础设置-基础信息-水表型号
                path: '/WaterMeterConfiguration/WatermeterModel',
                meta: {
                title: '水表型号'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/WatermeterModel/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-水表口径
                path: '/WaterMeterConfiguration/CaliberInfo',
                meta: {
                title: '水表口径'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/CaliberInfo/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-抄表状态
                path: '/WaterMeterConfiguration/MeterStatus',
                meta: {
                title: '抄表状态'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/MeterStatus/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-水表供应商
                path: '/WaterMeterConfiguration/WaterMeterFactory',
                meta: {
                title: '水表供应商'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/WaterMeterFactory/index'], resolve),
                children:[],
            },
        ],
    },
])
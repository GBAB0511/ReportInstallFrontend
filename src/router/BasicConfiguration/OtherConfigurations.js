
export default ([
    {
        path: '/OtherConfigurations',
        meta: {
          title: '用水价格'
        },
        component: resolve => require(['@/views/BasicSet'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"BookInfo"
            // },

            {//基础设置-基础信息-用户开户银行
                path: '/OtherConfigurations/BankInfo',
                meta: {
                title: '用户开户银行'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/BankInfo/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-用户开户银行
                path: '/OtherConfigurations/BankInfo',
                meta: {
                title: '用户开户银行'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/BankInfo/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-工程验收配置
                path: '/OtherConfigurations/ProjectAcceptance',
                meta: {
                title: '工程验收配置'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/ProjectAcceptance/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-工程审批意见配置
                path: '/OtherConfigurations/ProjectOpinionConfig',
                meta: {
                    title: '工程审批意见配置'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/ProjectOpinionConfig/index'], resolve),
                children: [],
            },
            // {//基础设置-基础信息-工程报装权限配置
            //     path: '/OtherConfigurations/ProjectApproval',
            //     meta: {
            //     title: '工程报装权限配置'
            //     },
            //     component: resolve => require(['@/views/BasicSet/BasicInfo/ProjectApproval/index'], resolve),
            //     children:[],
            // },
            {//基础设置-基础信息-附件文件
                path: '/OtherConfigurations/Appendix',
                meta: {
                title: '附件资料'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/Appendix/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-假期设置
                path: '/OtherConfigurations/HolidaySet',
                meta: {
                title: '假期设置'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/HolidaySet/index'], resolve),
                children:[],
            },
            {//基础设置-材料价格
                path: '/OtherConfigurations/MaterialPrice',
                meta: {
                title: '材料定价'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/MaterialPrice'], resolve),
                children:[],
            },
            {//基础设置-其他参数配置
                path: '/OtherConfigurations/GlobalParamSet',
                meta: {
                title: '其他参数配置'
                },
                component: resolve => require(['@/views/BasicSet/GlobalParamSet/index'], resolve),
                children:[],
            },
            {//基础设置-价格管理-费用组成
                path: '/OtherConfigurations/CostProject',
                meta: {
                title: '费用组成'
                },
                component: resolve => require(['@/views/BasicSet/PriceContrl/CostProject/index'], resolve),
                children:[],
            },
            {//基础设置-票据类型
                path: '/OtherConfigurations/BillType',
                meta: {
                title: '票据类型'
                },
                component: resolve => require(['@/views/BasicSet/Bill/BillType/index'], resolve),
                children:[],
            },
            {//基础设置-费用票据关系
                path: '/OtherConfigurations/ExpenseBillRelationship',
                meta: {
                title: '费用票据关系'
                },
                component: resolve => require(['@/views/BasicSet/Bill/ExpenseBillRelationship'], resolve),
                children:[],
            },
            {//基础设置-快速变更配置
                path: '/OtherConfigurations/QuickChangeConfiguration',
                meta: {
                title: '快速变更配置'
                },
                component: resolve => require(['@/views/BasicSet/QuickChangeConfiguration/index'], resolve),
                children:[],
            },
             {// 基础设置-垃圾费类型
                path: '/OtherConfigurations/GarbageType',
                meta: {
                title: '垃圾费类型'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/GarbageType/index'], resolve)
            },
             {// 基础设置-进账银行
                path: '/OtherConfigurations/IncomeBank',
                meta: {
                title: '进账银行'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/IncomeBank/index'], resolve)
            },
            {// 基础设置-工程收款主体配置
                path: '/OtherConfigurations/ProjectPayee',
                meta: {
                title: '工程收款主体'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/ProjectPayee/index'], resolve)
            },
               {//基础设置-其他参数配置
                path: '/OtherConfigurations/MeterCycleConfig',
                meta: {
                title: '抄表周期配置'
                },
                component: resolve => require(['@/views/BasicSet/MeterCycleConfig/index'], resolve),
                children:[],
            },
            {//基础设置-基础信息-工作日配置
                path: '/OtherConfigurations/WeekdaySet',
                meta: {
                title: '工作日配置'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/WeekdaySet/index'], resolve),
                children:[],
            },
        ],
    },
])

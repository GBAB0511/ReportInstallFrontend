
export default ([
    {
        path: '/TemplateConfiguration',
        meta: {
          title: '模板配置'
        },
        component: resolve => require(['@/views/BasicSet'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"MaterialTemplate"
            // },
            {//基础设置-用料模板
                path: '/TemplateConfiguration/MaterialTemplate',
                meta: {
                title: '用料模板'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/MaterialTemplate'], resolve),
                children:[],
            },
            {//基础设置-短信模板
                path: '/TemplateConfiguration/ShortMessage',
                meta: {
                title: '短信模板'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/ShortMessage'], resolve),
                children:[],
            },
            {//基础设置-合同模板
                path: '/TemplateConfiguration/Contract',
                meta: {
                title: '合同模板'
                },
                component: resolve => require(['@/views/BasicSet/BasicInfo/ContractTemplate'], resolve),
                children:[],
            },
        ],
    },
])
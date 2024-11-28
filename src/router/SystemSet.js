
export default ([
    {//系统管理
        path: '/SystemSet',
        meta: {
          title: '系统管理'
        },
        component: resolve => require(['@/views/SystemSet'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"RoleManage"
            // },
            {//系统管理-用户管理
                path: 'UserManage',
                meta: {
                title: '用户管理'
                },
                component: resolve => require(['@/views/SystemSet/UserManage/index'], resolve),
                children:[],
            },
            {//系统管理-权限管理
                path: 'RoleManage',
                meta: {
                title: '权限管理'
                },
                component: resolve => require(['@/views/SystemSet/RoleManage/index'], resolve),
                children:[],
            },
            {//系统管理-用户角色
                path: 'UserAuthorization',
                meta: {
                title: '用户角色'
                },
                component: resolve => require(['@/views/SystemSet/UserAuthorization/index'], resolve),
                children:[],
            },
            {//系统管理-菜单管理
                path: 'MenuManage',
                meta: {
                title: '菜单管理'
                },
                component: resolve => require(['@/views/SystemSet/MenuManage/index'], resolve),
                children:[],
            },
            {
              path: 'processConfig',
              meta: {title: '审批人配置'},
              component: resolve => require(['@/views/SystemSet/ProcessConfig/index'], resolve)
            }
        ],
    },
])
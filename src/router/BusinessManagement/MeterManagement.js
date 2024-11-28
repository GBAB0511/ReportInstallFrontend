
export default ([
    {
        path: '/MeterManagement',
        meta: {
          title: '表计管理'
        },
        component: resolve => require(['@/views/WatchCenter'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"WaterMeterInquiry"
            // },
            {
              path: '/MeterManagement/WaterMeterInquiry',
              meta: {
                title: '表计-查询'
              },
              component: resolve => require(['@/views/WatchCenter/WaterMeterInquiry/index'], resolve)
          },
          {
            path: '/MeterManagement/Warehousing',
            meta: {
            title: '注册'
            },
            component: resolve => require(['@/views/WatchCenter/Warehousing/index'], resolve)
          },
          {
            path: '/MeterManagement/ChangeTables',
            meta: {
            title: '换表'
            },
            component: resolve => require(['@/views/WatchCenter/ChangeTables/index'], resolve)
          },
          {
            path: '/MeterManagement/QuickChangeTables',
            meta: {
            title: '快捷换表'
            },
            component: resolve => require(['@/views/WatchCenter/QuickChangeTables/index'], resolve)
          },
          {
            path: '/MeterManagement/TableDismantling',
            meta: {
            title: '拆表'
            },
            component: resolve => require(['@/views/WatchCenter/TableDismantling/index.vue'], resolve)
          },
          {
            path: '/MeterManagement/DuplicateTable',
            meta: {
            title: '复装'
            },
            component: resolve => require(['@/views/WatchCenter/DuplicateTable/index.vue'], resolve)
          },
          {
            path: '/MeterManagement/ComparisonTable',
            meta: {
            title: '校表'
            },
            component: resolve => require(['@/views/WatchCenter/ComparisonTable/index'], resolve)
          },
          {
            path: '/MeterManagement/DimensionalInspection',
            meta: {
            title: '维检'
            },
            component: resolve => require(['@/views/WatchCenter/DimensionalInspection/index'], resolve)
          },
          {
            path: '/MeterManagement/wMeterEdit',
            meta: {
            title: '表计-变更'
            },
            component: resolve => require(['@/views/WatchCenter/wMeterEdit'], resolve)
        },
        ],
    },
])
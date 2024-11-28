
export default ([
    {
        path: '/NotificationManagement',
        meta: {
          title: '水精灵管理'
        },
        component: resolve => require(['@/views/BasicSet'], resolve),
        children:[
            // {
            //     path: '/',
            //     redirect:"WaterBill"
            // },
            {//基础设置-水精灵管理-水费账单提醒
                path: '/NotificationManagement/WaterBill',
                meta: {
                title: '水费账单精灵'
                },
                component: resolve => require(['@/views/BasicSet/NotificationManagement/WaterBill'], resolve),
                children:[],
            },
            {//基础设置-水精灵管理-欠费催缴提醒
                path: '/NotificationManagement/ArrearsCharging',
                meta: {
                title: '欠费催缴精灵'
                },
                component: resolve => require(['@/views/BasicSet/NotificationManagement/ArrearsCharging'], resolve),
                children:[],
            },
            {//基础设置-水精灵管理-缴费通知提醒
                path: '/NotificationManagement/PaymentNotice',
                meta: {
                title: '缴费通知精灵'
                },
                component: resolve => require(['@/views/BasicSet/NotificationManagement/PaymentNotice'], resolve),
                children:[],
            },
            {//基础设置-水精灵管理-优惠到期提醒
                path: '/NotificationManagement/CouponExpiration',
                meta: {
                title: '优惠到期提醒'
                },
                component: resolve => require(['@/views/BasicSet/NotificationManagement/CouponExpiration'], resolve),
                children:[],
            },
           {//基础设置-水精灵管理-其他提醒
            path: '/NotificationManagement/OtherNotice',
            meta: {
            title: '其他精灵'
            },
            component: resolve => require(['@/views/BasicSet/NotificationManagement/OtherNotice'], resolve),
            children:[],
        },
        ],
    },
])
export default ([{
  path: '/CustomerNotificationCenter',
  meta: {
    title: '信息发布管理'
  },
  component: resolve => require(['@/views/ServiceCentre'], resolve),
  children: [
    // {
    //     path: '/',
    //     redirect:"InformationReleaseManagement"
    // },
    {
      path: '/CustomerNotificationCenter/InformationReleaseManagement',
      meta: {
        title: '通知公告'
      },
      component: resolve => require(['@/views/ServiceCentre/InformationDelivery/InformationReleaseManagement'], resolve)
    },

    {
      path: '/CustomerNotificationCenter/CommonFormManagementEdit',
      meta: {
        title: '信息发布管理-添加'
      },
      component: resolve => require(['@/views/ServiceCentre/InformationDelivery/CommonFormManagementEdit'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/NotificationDetails',
      meta: {
        title: '消息查询'
      },
      component: resolve => require(['@/views/ServiceCentre/CustomerNotification/NotificationDetails'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/QuestionnaireManagement',
      meta: {
        title: '问卷管理'
      },
      component: resolve => require(['@/views/ServiceCentre/SatisfactionSurvey/QuestionnaireManagement'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/MessageNotification/MessageSending',
      meta: {
        title: '短信发送'
      },
      component: resolve => require(['@/views/ServiceCentre/MessageSending'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/MessageNotification/WaterRateNotification',
      meta: {
        title: '水费通知'
      },
      component: resolve => require(['@/views/ServiceCentre/WaterRateNotification'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/MessageNotification/OweWorth',
      meta: {
        title: '欠费催缴'
      },
      component: resolve => require(['@/views/ServiceCentre/OweWorth'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/MessageNotification/ArrearsStopWater',
      meta: {
        title: '欠费停水通知'
      },
      component: resolve => require(['@/views/ServiceCentre/ArrearsStopWater'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/MessageNotification/Reminders',
      meta: {
        title: '缴费提醒'
      },
      component: resolve => require(['@/views/ServiceCentre/Reminders'], resolve)
    },
    {
      path: '/CustomerNotificationCenter/MessageNotification/WaterMaintenance',
      meta: {
        title: '自定义通知'
      },
      component: resolve => require(['@/views/ServiceCentre/WaterMaintenance'], resolve)
    },
  ],
}, ])

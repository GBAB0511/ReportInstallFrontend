// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/resert.scss'
import $ from 'jquery'
import store from './store/store'
import axios from 'axios'
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式   防卡顿第三方组件库
// 统一ui
import companyComponents from 'component-public-company'
// 公司组件样式
import '@/assets/component-public-company/allStyle.css'
import router from './router/indexNew'
ElementUI.Dialog.props.closeOnClickModal.default = false;

Vue.use(companyComponents)
import { MP } from './map/map.js' 
Vue.prototype.$mp = MP;
import api from '@/assets/js/api.js'
Vue.prototype.$api = api;


Vue.use(UmyUi);

// 引入防止重复点击指令
import preventReClick from '@/assets/js/noDbClick.js'
Vue.use(preventReClick)

// 高拍仪、交互机所需文件
// import gwq from '../static/interactiveMachine/js/gwq'
import gwq from '@/assets/js/gwqToVUE.js'
Vue.prototype.gwq = gwq;
import IDCard from '@/assets/js/IDCard.js'
Vue.prototype.IDCard = IDCard;
import ICCard from '@/assets/js/ICCard.js'
Vue.prototype.ICCard = ICCard;
import MsgCard from '@/assets/js/MsgCard.js'
Vue.prototype.MsgCard = MsgCard;
import Photo from '@/assets/js/Photo.js'
Vue.prototype.Photo = Photo;
import ICCardAjax from "@/assets/js/ICCardIntegration.js";
Vue.prototype.ICCardAjax = ICCardAjax;
import pos from "@/assets/js/posConnect.js";
Vue.prototype.pos = pos;
// 方正高拍仪的引入
import IDCardFangZheng from '@/assets/js/IDCardFangZheng.js'
Vue.prototype.IDCardFangZheng = IDCardFangZheng;
import PhotoFangZheng from '@/assets/js/PhotoFangZheng.js'
Vue.prototype.PhotoFangZheng = PhotoFangZheng;
// import 'default-passive-events'
// 公用函数工具

import common from '@/assets/js/common.js'
Vue.prototype.common = common;
import util from '@/assets/js/util.js'
Vue.prototype.util = util;
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
//高德地图
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: '6cd5aa0e6752ea8bfdc7984179395f51',
    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType','AMap.Geocoder','AMap.Geolocation','AMap.PlaceSearch'],
    uiVersion: '1.0.11'
})
window.$baseUrl = process.env.baseUrl
Vue.config.productionTip = false;
Vue.use(ElementUI);


// 引入ueditor编辑器js

import '../static/ueditor/ueditor.config'
import '../static/ueditor/ueditor.all'
import '../static/ueditor/lang/zh-cn/zh-cn'
import '../static/ueditor/ueditor.parse.min.js'

// 引入字体图标样式
// import "@/iconfont/iconfont.css"
import "@/iconfont/iconfont.js"

// 鼠标右击事件
import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu)
// bus总线
window.eventBus = new Vue();
/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
let token = getUrlParam('code');
let ticket = getUrlParam('ticket');
if(token) {
  sessionStorage.setItem("token", token);
  window.location.href = location.href.split("?")[0];   //重定向，去掉链接的token值
}
if(ticket) {
  sessionStorage.setItem("token", ticket);
  window.location.href = location.href.split("?")[0];   //重定向，去掉链接的token值
}
token = sessionStorage.getItem("token");
function getUrlParam(param) {
    debugger;
    const url = decodeURIComponent(window.location.search);
    const paramsStr = url.split('?')[1];
    if (!paramsStr) {
      return null;
    }
    const paramsArr = paramsStr.split('&');
    for (const pair of paramsArr) {
      const [key, value] = pair.split('=');
      if (key === param) {
        return value;
      }
  }
  return null;
}

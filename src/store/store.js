'use strict'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

function dealTreeNode(treeNode) {
  let treeBread = [];
  let sunBread = treeNode;
  for (let i = 0; i <= treeNode.level; i++) {
    sunBread.checkable = true;
    if (i === 0) {
      sunBread.checkable = false;
    }
    treeBread.unshift(sunBread);
    sunBread = sunBread.getParentNode();
  }
  return treeBread
}

export default new Vuex.Store({
  state: {
    treeNode: "",
    treeBread: [],
    company: "", //当前状态水司是否是本集团
    hostIP: "",
    companyInfo: {}, //当前选中水司信息
    user: "",
    uid: "",
    isStatus2: false, //工程-报装-工程类型是否为户表改造
    account:"",//当前账户
    userName:'',//当前账户名
    currentNav:0,
    photographic: false, //高拍仪的使用参数
    "/ICCardManagement": [], //ic卡模块权限
    "/CustomerManagement/userInfo": [], //用户查询模块
    isRemove: false //删除按钮的显示与隐藏 业务管理-客服管理-开户
  },
  mutations: {
    setTreeNode(state, treeNode) {
      state.treeNode = treeNode;
    },
    setTreeBread(state, treeBread) {
      state.treeBread = treeBread;
      // console.log(state.treeBread)
    },
    setCompany(state, company) {
      state.company = company;
    },
    setAuthList(state, auth) {
      state[auth.name].push(auth.authList);
      // console.log(state.treeBread)
    },
    setHostIP(state, hostIP) {
      let n = window.location.host.search(":");
      let str = window.location.host + "";
      let host = str.slice(0, n);
      if (host === "127.0.0.1") host = "localhost";
      state.hostIP = host;
    },
    setIsStatus2(state, val) {
      state.isStatus2 = val;
    },
    setAccount(state,val){
      state.account=val;
    },
    setUserName(state,val){
      state.userName=val;
    },
    setCurrentNav(state,val){
      state.currentNav=val
    },
    setPhotographic(state,val){
      state.photographic = val;
    }
  },
  actions: {
    commitSetTreeNode({ commit }, treeNode) {
      commit("setTreeBread", dealTreeNode(treeNode));
      commit("setTreeNode", treeNode);
    },
    commitHostIP({ commit }, hostIP) {
      commit("setHostIP", hostIP);
    }
  }
});

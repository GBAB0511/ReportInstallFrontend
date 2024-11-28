import Vue from 'vue';
let authList = []
let setAuthList = (list)=>{ 
  //在组件中传入当前用户的权限列表
authList = list||[];
}
const hasPermission = userPermission => {
  // 当前用户的权限列表
  return authList.some(i => userPermission.includes(i));
};
// 权限指令
Vue.directive("auth", {
  inserted: (el, binding, vnode) => {
    if (!hasPermission(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
export default {setAuthList}
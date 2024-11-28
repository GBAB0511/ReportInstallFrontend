const files = require.context('.', true, /\.js$/)

let BusinessManagementRouters = []
//获取其他文件里面的路由
files.keys().forEach(key => {
  if (key === './index.js') return
  BusinessManagementRouters = BusinessManagementRouters.concat(files(key).default) 
})
export default BusinessManagementRouters 

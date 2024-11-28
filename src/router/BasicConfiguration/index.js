const files = require.context('.', true, /\.js$/)

let BasicConfigurationRouters = []
//获取其他文件里面的路由
files.keys().forEach(key => {
  if (key === './index.js') return
  BasicConfigurationRouters = BasicConfigurationRouters.concat(files(key).default) 
})
export default BasicConfigurationRouters 

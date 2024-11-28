import axios from "axios";
import { Loading } from "element-ui";
import _this from '../../main.js';
const METHOD = {
  GET: "get",
  POST: "post"
};

let reqNum = 0

var loading = {}
function startLoading() {
  if(reqNum === 0) {
    loading = Loading.service({
      lock: true,
      text: "加载中......",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.3)",
    });
  }
  reqNum++

}

function endLoading(){
  setTimeout(closeLoading,300)
}

function closeLoading() {
  if(reqNum <=0) return
  reqNum--
  if(reqNum == 0)
    loading.close();
}
//节流
function throttle(fn, wait) {
  var pre = Date.now();
  return function() {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - pre >= wait) {
      fn.apply(context, args);
      pre = Date.now();
    }
  };
}
window.netWorkFailDialog = null;
   let netWorkFail = throttle(
            function () {
             window.netWorkFailDialog && window.netWorkFailDialog.close();
             window.netWorkFailDialog = vm.$message({
               showClose: true,
               message: "网络连接失败，请检查网络！",
               type: "error",
               duration: 4000
             });
            },
           1000
     );
axios.interceptors.request.use(
  config => {
    if (!config.hideLoading){
    startLoading();
    }
    let n = window.location.hash.indexOf("?");
    if (n !== -1) {
      config.headers.url = window.location.hash.substring(0, n);
    } else {
      config.headers.url = window.location.hash;
    }
    config.headers.url = config.headers.url.replace("#","")
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    endLoading()
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "请求错误";
          vm.$message({
            showClose: true,
            message: "请求错误！",
            type: "error"
          });
          break;

        case 401:
          err.message = "未授权，请登录";
          vm.$message({
            showClose: true,
            message: "未授权，请登录！",
            type: "error"
          });
          break;

        case 403:
          err.message = "拒绝访问";
          vm.$message({
            showClose: true,
            message: "拒绝访问！",
            type: "error"
          });
          break;

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`;
          vm.$message({
            showClose: true,
            message: `请求地址出错: ${err.response.config.url}`,
            type: "error"
          });
          break;

        case 408:
          err.message = "请求超时";
          vm.$message({
            showClose: true,
            message: `请求超时`,
            type: "error"
          });
          break;

        case 500:
          err.message = "服务器内部错误";
          vm.$message({
            showClose: true,
            message: `服务器内部错误`,
            type: "error"
          });
          break;

        case 501:
          err.message = "服务未实现";
          vm.$message({
            showClose: true,
            message: `服务未实现`,
            type: "error"
          });
          break;

        case 502:
          err.message = "网关错误";
          vm.$message({
            showClose: true,
            message: `网关错误`,
            type: "error"
          });
          break;

        case 503:
          err.message = "服务不可用";
          vm.$message({
            showClose: true,
            message: `服务不可用`,
            type: "error"
          });
          break;

        case 504:
          err.message = "网关超时";
          vm.$message({
            showClose: true,
            message: `网关超时`,
            type: "error"
          });
          break;

        case 505:
          err.message = "HTTP版本不受支持";
          vm.$message({
            showClose: true,
            message: `HTTP版本不受支持`,
            type: "error"
          });
          break;

        default:
          err.message = "未知错误";
          vm.$message({
            showClose: true,
            message: "未知错误" + err,
            type: "error"
          });
      }
    }
    endLoading()
    return Promise.reject(err);
  }
);
export default {

  fetch(myConfig) {


    let defaultConfig = {
      apiUrl: "interface.api",
      method: METHOD.POST,
      params: null,
      isJson: true,
      needErrorCallback: true
    };
    myConfig = Object.assign({}, defaultConfig, myConfig);
    myConfig.params.token = sessionStorage.getItem("token");
    // console.log(myConfig.params.token);

    // myConfig.params.token = 'krrjdev123';
    // 暂时使用
    // localStorage.setItem('token', 'krrjdev123');
    // localStorage.setItem('companyNo', 'C021028')

    myConfig.params.sysType = "002";
    axios.defaults.baseURL = $baseUrl;
    let RequestObj = {
      url: myConfig.apiUrl,
      // +'?'+Math.floor(Math.random()*100000)
      method: myConfig.method,
      timeout: 0,
      // timeout: 10,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true
    };

    // 数据格式处理
    if (myConfig.method === METHOD.GET) {
      RequestObj.params = myConfig.params;
    } else if (myConfig.method === METHOD.POST) {
      if (myConfig.isJson) {
        // json格式
        RequestObj.headers["Content-Type"] = "application/json;charset=UTF-8";
        RequestObj.data = myConfig.params;
      } else {
        // 默认表单格式
        RequestObj.params = myConfig.params;
      }
    }
    let n = window.location.host.search(":");
    let str = window.location.host + "";
    let host = str.slice(0, n);

    // 导入方法专用代码
    if (
      RequestObj.data &&
      RequestObj.data.type !== undefined &&
      RequestObj.data.type == "import"
    ) {
      console.log(RequestObj);
      RequestObj.url = "importExcel.api";
      RequestObj.headers["Content-Type"] = "multipart/form-data;charset=UTF-8";
      var formData = new FormData();
      if (RequestObj.data.data.id) {
        formData.append(
          "json",
          JSON.stringify({
            token: RequestObj.data.token,
            sysType: RequestObj.data.sysType,
            busicode: RequestObj.data.busicode,
            data: {
              id: RequestObj.data.data.id
            }
          })
        );
      } else {
        if(RequestObj.data.consultId){
          formData.append(
            "json",
            JSON.stringify({
              token: RequestObj.data.token,
              sysType: RequestObj.data.sysType,
              busicode: RequestObj.data.busicode,
              data:{
                consultId: RequestObj.data.consultId,
              }
            })
          );
        }else if(RequestObj.data.singleCustomerFlag != undefined){
          formData.append(
            "json",
            JSON.stringify({
              token: RequestObj.data.token,
              sysType: RequestObj.data.sysType,
              busicode: RequestObj.data.busicode,
              data:{
                singleCustomerFlag: RequestObj.data.singleCustomerFlag,
              }
            })
          );
        }else{
          formData.append(
          "json",
          JSON.stringify({
            token: RequestObj.data.token,
            sysType: RequestObj.data.sysType,
            busicode: RequestObj.data.busicode
          })
        );
        }
      }
      formData.append("file", RequestObj.data.data.file);

      RequestObj.data = formData;
    }
    // 上传附件方法专用代码
    if (
      RequestObj.data &&
      RequestObj.data.type !== undefined &&
      RequestObj.data.type == "upload"
    ) {
      console.log(RequestObj);
      RequestObj.url = "accessoryUpload.api";
      RequestObj.headers["Content-Type"] = "multipart/form-data;charset=UTF-8";
      var formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          token: RequestObj.data.token,
          sysType: RequestObj.data.sysType,
          busicode: RequestObj.data.busicode,
          data: {
            receiptId: RequestObj.data.data.receiptId,
            receiptType: RequestObj.data.data.receiptType,
            accessoryNo: RequestObj.data.data.accessoryNo,
            userNo:RequestObj.data.data.userNo,
            ctmNo:RequestObj.data.data.ctmNo,
            contractNo:RequestObj.data.data.contractNo,
            contractType:RequestObj.data.data.contractType,
            projectId:RequestObj.data.data.projectId,
          }
        })
      );
      formData.append("file", RequestObj.data.data.file);

      RequestObj.data = formData;
    }
    // 下载驱动
    if (
      RequestObj.data &&
      RequestObj.data.type !== undefined &&
      RequestObj.data.type == "downTown"
    ) {
      console.log(RequestObj);
      RequestObj.url = "accessoryDown.api";
      RequestObj.headers["Content-Type"] = "multipart/form-data;charset=UTF-8";
      var formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          token: RequestObj.data.token,
          sysType: RequestObj.data.sysType,
          busicode: RequestObj.data.busicode,
          data: {
            id: RequestObj.data.data.id,
          }
        })
      );
      RequestObj.data = formData;
    }

    if (host === "127.0.0.1") host = "localhost";
    return new Promise((resolve, reject) => {

      axios(RequestObj)
      .then(
        res => {
          //loading.close();
          if (res.status === 200) {
            //console.log(res.data.code);
            if (res.data.code === undefined) {

            }else{
              if (res.data.code === 10000) {
                let curl = $baseUrl;
                if (!curl.startsWith("http")) {
                  let loc = window.location.href;
                  loc = loc.substring(0, loc.indexOf("/#", 8));
                  curl = loc + curl; //这是服务器端的地址
                }
                //正式登录页(接口联调期间暂不跳转)
                // window.location.href =
                //   "http://login2.ebs.krdev.gdhwater.com/cas.htm?url=" +
                //   curl +
                //   "/loginCustomer.htm";
                console.log(curl);
                console.log(curl.split('apis'));
                let url = curl.split('apis')
                // alert(curl)
               window.location.href = localStorage.getItem("appSSOUrl") + url[0]
              // window.location.href = curl + "/loginCustomer.htm?ticket=";
              // window.location.href = "http://36.103.241.141:9998/cas/login?url=" + curl + "/loginCustomer.htm";
              }
              if (res.data.code != 0) {
                if (res.data.code != 11006) {
                  vm.$message({
                    showClose: true,
                    message: res.data.description,
                    type: "error"
                  });
                  // 登录失效时首页调多个接口导致页面弹出多个message，以下代码防止登录失效时多次弹出message
                  if (res.data.code == 10000) {
                    vm = undefined
                  }
                }

                if (myConfig.needErrorCallback) {

                  reject(res.data);
                }
              } else {

                resolve(res.data.data);
              }
            }

          }
        },
        err => {
          //loading.close();
          if (myConfig.needErrorCallback) {
            netWorkFail();
            reject(err);
          }
        }
      )
      .catch(error => {
        //loading.close();
        if (myConfig.needErrorCallback) {
          reject(error);
        }
      });
    });
  }
};

/**
 * 公用函数方法
 */
 "use strict";
 import Vue from "vue";
 import { Loading } from "element-ui";
 let common = {};
 let thatCache;
 let fatherCache;
 let brotherCache;
 // 状态公共调用地址
 common.processState = () => {
   return [
     { name: "全部", value: "" },
     { name: "草稿", value: "DRAFT" },
     { name: "进行中", value: "PROCESSING" },
     { name: "已办结", value: "END" },
     { name: "已废弃", value: "CANCEL" }
   ];
 };
 //导出/下载模板 公共ip/域名
 common.getExportExcelIp = () => {
   // return '192.168.13.135:8080';//xhy
   // return "192.168.137.242:8005";//zlb
   // return "192.168.13.127:8080";//zyq
   // return "192.168.199.11:8080";//zyq
  // return "192.168.13.86:8080";//zyq
  //return "36.103.225.121:9012";//zyq
  if(process.env.NODE_ENV === 'development'){
    return process.env.exportUrl;
  }
  return window.location.origin;//生产环境导出源是当前域
  //return "https://testcss2.guangdongwater.com";
 };
 // 获取当前日期/年份
 //  空:默认返回当天的日期YY-MM-DD
 //  s:month  当前月
 //  lastMonth上个月
 //  halfYear上半年
 //  number：返回指定天日期 返回格式：（24 * 60 * 60 * 1000）
 common.date = (s,type) => {
   let day = new Date();
   let res;
   day.setTime(day.getTime());
   let year = day.getFullYear();
   let month = day.getMonth()+1;
   let d = day.getDate();
   let weekend = day.getDay();         // 获取当前星期X(0-6,0代表星期天)
   let time = day.getTime();        // 获取当前时间(从1970.1.1开始的毫秒数)
   let hours = day.getHours();       // 获取当前小时数(0-23)
   let miunt = day.getMinutes();     // 获取当前分钟数(0-59)
   let second = day.getSeconds();     // 获取当前秒数(0-59)
   let mill = day.getMilliseconds();    // 获取当前毫秒数(0-999)
   if (s === "month") {
     res = year.toString() + (month   < 10 ? ("0" + month) : month);
   } else if (s === "lastMonth") {
     res = year.toString() + (month  < 10 ? ("0" + month- 1) : (month- 1));
   } else if (s === "lastYearMonth") {
     res = (year - 1).toString() + (month   < 10 ? ("0" + month) : month);
   }else if (s === "year") {
     res = year;

   } else if (typeof s === "number") {
     day.setTime(day.getTime() + s);
     let year = day.getFullYear();
     let month = day.getMonth()+1;
     let d = day.getDate();
     res =
       year +
       "-" +
       (month   < 10 ? "0" + (month  ) : month  ) +
       "-" +
       (d < 10 ? "0" + d : d);
   } else {
     res =
       year +
       "-" +
       (month   < 10 ? "0" + (month  ) : month  ) +
       "-" +
       (d < 10 ? "0" + d : d);
   }
   return res;
 };
  common.datetime =  ()=>{
    let now = new Date();
    let time = [now.getHours(),now.getMinutes(),now.getSeconds()];
    return common.date() + " "+time.join(':');
  }
 // 表格高度计算
 function calcHeight(that, father, brother) {
   thatCache = that
   fatherCache = father
   brotherCache = brother
   let $fatherHeight = $(father).innerHeight();
   let $brothersHeight = 0;
   if (typeof brother === "object") {
     for (let i in brother) {
       if ($(brother[i]).outerHeight()) {
         $brothersHeight += $(brother[i]).outerHeight();
       } else {
         $brothersHeight += 0;
       }
     }
   }
   that.maxHeight = $fatherHeight - $brothersHeight - 10;
 }
 common.changeTable = (that, father, brother) => {
   calcHeight(that, father, brother);

   // 导出时浏览器底部弹出白色下载信息横条，导致页面高度产生变化，从而触发该方法，关闭横条时不触发，所以样式会产生错乱，故暂时注释该方法
   // $(window).resize(function () {
   //   console.log($(father).outerHeight())
   //   //动态监听监听网页窗口变化
   //   calcHeight(that, father, brother);
   // });
 };
 function calcHeight1(that, father, brother,maxHeight) {
   thatCache = that
   fatherCache = father
   brotherCache = brother
   let $fatherHeight = $(father).innerHeight();
   let $brothersHeight = 0;
   if (typeof brother === "object") {
     for (let i in brother) {
       if ($(brother[i]).outerHeight()) {
         $brothersHeight += $(brother[i]).outerHeight();
       } else {
         $brothersHeight += 0;
       }
     }
   }
   that[maxHeight] = $fatherHeight - $brothersHeight - 10;
 }
 common.changeTable1 = (that, father, brother,maxHeight) => {
   calcHeight1(that, father, brother,maxHeight);

   // 导出时浏览器底部弹出白色下载信息横条，导致页面高度产生变化，从而触发该方法，关闭横条时不触发，所以样式会产生错乱，故暂时注释该方法
   // $(window).resize(function () {
   //   console.log($(father).outerHeight())
   //   //动态监听监听网页窗口变化
   //   calcHeight(that, father, brother);
   // });
 };
 common.refreshTableHeight = () => {
   if(thatCache && fatherCache && brotherCache)
   calcHeight(thatCache, fatherCache, brotherCache);
 }

 common.myBrowser = () => {
   var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
   // console.log(userAgent);
   var isOpera = userAgent.indexOf("Opera") > -1;
   if (isOpera) {
     return "Opera"
   } //判断是否Opera浏览器
   else if (userAgent.indexOf("Firefox") > -1) {
     return "FF";
   } //判断是否Firefox浏览器
   else if (userAgent.indexOf("Edge") > -1) {
     return "Edge";
   } 	//判断是否Safari浏览器
   else if (userAgent.indexOf("Chrome") > -1) {
     return "Chrome";
   }
   else if (userAgent.indexOf("Safari") > -1) {
     return "Safari";
   }
   else {
     return "IE";
   } //判断是否IE浏览器
 }

 // 关闭前二次确认
 function handleData(newVal, oldVal) {
   // console.log(newVal)
   // console.log(oldVal)
   let result = true;
   if (Object.prototype.toString.call(newVal) !== "[object Object]") {
     console.log("旧数据不是一个对象");
     return (result = false);
   }
   if (Object.prototype.toString.call(oldVal) !== "[object Object]") {
     console.log("新数据不是一个对象");
     return (result = false);
   }
   // 获取新数据的对象属性
   let propsCurr = Object.getOwnPropertyNames(newVal);
   // 获取旧数据的对象属性
   let propsCompare = Object.getOwnPropertyNames(oldVal);
   // 比较对象长度
   if (propsCurr.length != propsCompare.length) {
     return (result = false);
   } else {
     for (var i = 0, max = propsCurr.length; i < max; i++) {
       var propName = propsCurr[i];
       // 判断对象属性值的数据类型
       if (
         Object.prototype.toString.call(newVal[propName]) == "[object Array]"
       ) {
         if (newVal[propName].length != oldVal[propName].length) {
           return (result = false);
         } else {
           for (var j = 0; j < newVal[propName].length; j++) {
             if (
               Object.prototype.toString.call(newVal[propName][j]) ==
               "[object Object]"
             ) {
               handleData(newVal[propName][j], oldVal[propName][j]);
             } else {
               if (newVal[propName][j] !== oldVal[propName][j]) {
                 return (result = false);
               }
             }
           }
         }
       } else if (
         Object.prototype.toString.call(newVal[propName]) == "[object Object]"
       ) {
         handleData(newVal[propName], oldVal[propName]);
       } else {
         if (newVal[propName] !== oldVal[propName]) {
           return (result = false);
         }
       }
     }
   }
   return result;
 }
 // obj:传入的表单对象，change:set get ,oldBJ:存入本地存储的名称，fun:确认离开后调用的方法
 common.chargeObjectEqual = (that, obj, change, oldOBJ, fun) => {
   var lock = true;
   if (change == "set") {
     sessionStorage.setItem(oldOBJ, JSON.stringify(obj));
   } else if (change == "get") {
     var oldOBJ = JSON.parse(sessionStorage.getItem(oldOBJ));
     var oldData = JSON.stringify(obj);
     var oldDataHandle = JSON.parse(oldData);
     lock = handleData(oldOBJ, oldDataHandle);
     if (lock && fun) {
       fun();
     } else if (!lock) {
       that
         .$confirm("您填写的信息尚未保存, 是否确认离开?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
         })
         .then(() => {
           fun();
         })
         .catch(() => {
           return true;
         });
     }
   }
 };
 // 下载模板
 common.downFile = url => {
   let elemIF = document.createElement("iframe");
   // elemIF.src =  `${url}/fileDown.htm?importType=1`
   elemIF.src = url;
   elemIF.style.display = "none";
   document.body.appendChild(elemIF);
 };
 //导出
 // npm i XLSX 下载
 //busicode: 接口路径,
 // obj:查询条件对象
 //tHeader:excel表头["姓名","学号","年龄"...]
 //filterVal:excel表头对应字段 ['name', 'code', 'age'...]
 //filename:excel 文件名
 //total:数据列表的总数
 common.exportExcel = (
   busicode,
   obj,
   tHeader,
   filterVal,
   filename,
   total,
   that
 ) => {
   let listData = {};
   // this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
   obj.pageCount = total === 0 ? 20 : total;
   let params = {
     // "busicode":busicode,
     data: obj
   };
   that.$api
     .fetch({
       apiUrl: busicode, //路径
       method: "post", //请求方法
       params: params, //参数
       needErrorCallback: true
     })
     .then(res => {
       if (res.code === 0) {
         listData = res.data;
         if (!listData.list[0]) {
           that.$notify({
             title: "警告",
             message: "表格没有相关数据",
             type: "error"
           });
         } else {
           import("@/vendor/Export2Excel").then(excel => {
             // const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
             const tHeader = tHeader;
             // const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
             const filterVal = filterVal;
             const list = listData.list;
             // const data = this.formatJson(filterVal, list)
             const data = list.map(v =>
               filterVal.map(j => {
                 return v[j];
               })
             );
             excel.export_json_to_excel({
               header: tHeader,
               data,
               filename: filename,
               autoWidth: "100"
             });
           });
         }
       }
     });
 };
 //附件上传
 //文件超出个数限制时的钩子
 common.handleExceed = (files, fileList) => {
   this.$message.warning(
     `当前限制选择3个文件，本次选择了 ${
       files.length
     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
   );
 };
 //删除文件之前的钩子
 common.beforeRemove = (file, fileList) => {
   return this.$confirm(`确定移除 ${file.name}？`);
 };
 //文件上传成功的钩子
 common.handleSuccess = (response, file, fileList) => {
   if (response.code === 0) {
     this.$message({
       showClose: true,
       type: "success",
       message: "文件上传成功"
     });
   } else {
     this.$message({
       showClose: true,
       message: response.description,
       type: "error"
     });
     fileList.splice(fileList.length - 1, 1);
   }
 };
 //文件上传失败的钩子
 common.handleError = (err, file, fileList) => {
   this.$message({
     showClose: true,
     message: "上传文件错误！",
     type: "error"
   });
 };
 // 编辑-保存数据处理
 common.handleData = (newVal, oldVal) => {
   if (Object.prototype.toString.call(newVal) == "[object Object]") {
     let propsNew = Object.getOwnPropertyNames(newVal);
     let propsOld = Object.getOwnPropertyNames(oldVal);
     let prop = "";
     for (var i = 0, max = propsNew.length; i < max; i++) {
       prop = propsNew[i];
       if (propsOld.includes(prop)) {
         oldVal[prop] = newVal[prop];
       }
     }
     return oldVal;
   } else if (Object.prototype.toString.call(newVal) == "[object Array]") {
     let oldData = JSON.stringify(oldVal);
     let oldVal1 = JSON.parse(oldData);
     let res = [];
     let propsOld = Object.getOwnPropertyNames(oldVal1);
     let prop = "";
     for (let j = 0; j < newVal.length; j++) {
       res[j] = {};
       let propsNew = Object.getOwnPropertyNames(newVal[j]);
       for (let k = 0, max = propsNew.length; k < max; k++) {
         prop = propsNew[k];
         if (propsOld.includes(prop)) {
           res[j][prop] = "";
           res[j][prop] = newVal[j][prop];
         }
       }
     }
     return res;
   }
 };
 // 表单 树结构 数据格式处理（仅保留最后一个值）
 common.handleTreeData = (val) => {
   if (Object.prototype.toString.call(val) == "[object Array]"&&val!= undefined) {
     val = val[val.length-1];
   }
   return val;
 };
 // 转换数据格式（字符串转为数值型）,val可以为数组，也可以是对象
 common.handleDataType = (val, id, typeId) => {
   if (Object.prototype.toString.call(val) == "[object Array]") {
     for (let i = 0; i < val.length; i++) {
       let propsCurr = Object.getOwnPropertyNames(val[i]);
       for (let j = 0; j < propsCurr.length; j++) {
         let propName = propsCurr[j];
         if (propName !== id && propName !== typeId) {
           if (typeof val[i][propName] === "string") {
             val[i][propName] = parseFloat(val[i][propName]);
           }
         }
       }
     }
   } else if (Object.prototype.toString.call(val) == "[object Object]") {
     let propsCurr = Object.getOwnPropertyNames(val[i]);
     for (let j = 0; j < propsCurr.length; j++) {
       let propName = propsCurr[j];
       if (propName !== id && propName !== typeId) {
         if (typeof val[propName] === "string") {
           val[propName] = parseFloat(val[propName]);
         }
       }
     }
   }
   return val;
 };
 //周新宇--打印公共方法，
 //TODO 注意修改url地址
 //type:"打印指令类型(printPDF=打印pdf;print=直接打印;view=打印预览;formatSet=格式设计;styleSelect=弹出打印样式选择)",
 //companyNo:"水司编号",
 //businessCode:"打印业务单据的编码（pub_print_business.code）"
 //templateId:"打印的样式文件id（base_print_template.id） 可以为空，为空代表采用businessCode的默认样式来打印"
 //key:"存储打印数据的key，PrintInterfaceImpl.setPrintData方法返回的id",
 //that:"打印页面的this对象",
 common.print = (type, businessCode, templateId, key, that) => {
   console.log(key);
   return new Promise((resolve, reject) => {
     let token = sessionStorage.getItem("token");
   let companyNo = localStorage.getItem("companyNo");
   let url = $baseUrl;
    if (!url.startsWith("http") ) {
      let loc = window.location.href;
      loc = loc.substring(0, loc.indexOf("/", 8));
      url = loc + url; //这是服务器端的地址，注意修改
    }
    if(url.indexOf("localhost")==-1)
      url = window.location.origin + '/project/';
   if (templateId == "") {
     templateId = token + "$$$" + "businessCode_" + businessCode; //如果模板id为空，则按格式要求传入业务单据id
   } else {
     templateId = token + "$$$" + templateId;
   }
   if(type==='printPDF'){
     url=key
     key=''
   }else if(type==='printTD'){
     templateId = templateId+"&businessCode=" + businessCode;
   }
   $.ajax({
     url:
       "http://localhost:25423/print?type=" +
       type +
       "&key=" +
       key +
       "&url=" +
       url +
       "&formatFile=" +
       companyNo +
       "_" +
       templateId,
     type: "GET",
     success: function(data) {
       resolve()
      //  if (data != "ok") {
      //    that.$notify({
      //      title: "警告",
      //      message: "打印不成功：" + data,
      //      type: "error"
      //    });
      //  } else {
      //    that.$notify({
      //      title: "成功",
      //      message: "打印成功！",
      //      type: "success"
      //    });
      //  }
      that.$notify({
        title: "成功",
        message: "正在打印：" + data,
        type: "success"
      });
     },
     error: function(data) {
       reject()
       that.$notify({
         title: "警告",
         message: "请启动打印服务",
         type: "error"
       });
     }
   });
   })

 };
 common.printOne = (type, businessCode, templateId, key, that) => {
   return new Promise((resolve, reject) => {
     let token = sessionStorage.getItem("token");
   let companyNo = localStorage.getItem("companyNo");
   let url = $baseUrl;
    if (!url.startsWith("http") ) {
      let loc = window.location.href;
      loc = loc.substring(0, loc.indexOf("/", 8));
      url = loc + url; //这是服务器端的地址，注意修改
    }
    if(url.indexOf("localhost")==-1)
      url = window.location.origin + '/project/';
   if (templateId == "") {
     templateId = token + "$$$" + "businessCode_" + businessCode; //如果模板id为空，则按格式要求传入业务单据id
   } else {
     templateId = token + "$$$" + templateId;
   }
   if(type==='printPDF'){
     url=key
     key=''
   }else if(type==='printTD'){
     templateId = templateId+"&businessCode=" + businessCode;
   }
   $.ajax({
     url:
       "http://localhost:25423/print?type=" +
       type +
       "&key=" +
       key +
       "&url=" +
       url +
       "&formatFile=" +
       companyNo +
       "_" +
       templateId,
     type: "GET",
     async:false,
     success: function(data) {
       resolve()
      //  if (data != "ok") {
      //    that.$notify({
      //      title: "警告",
      //      message: "打印不成功：" + data,
      //      type: "error"
      //    });
      //    that.flag = false
      //  } else {
      //    that.$notify({
      //      title: "成功",
      //      message: "打印成功！",
      //      type: "success"
      //    });
      //    that.flag = true
      //  }
      that.$notify({
        title: "成功",
        message: "打印成功！",
        type: "success"
      });
     },
     error: function(data) {
       reject()
       that.$notify({
         title: "警告",
         message: "请启动打印服务",
         type: "error"
       });
       that.flag = false
     }
   });
   })

 };
 //获取审批流状态数据，用于列表查询显示流程状态下拉列表
 //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
 common.getProcessStateData = (receiptType, that, _then) => {
   let _this = that;
   let params = {
     busicode: "ProcessNodeList",
     data: {
       receiptType: receiptType
       // "companyNo":companyNo, //营业收费正式数据不能传此参数
     }
   };
   _this.$api
     .fetch({
       params: params //参数
     })
     .then(res => {
       localStorage.setItem("ProcessNodeList", JSON.stringify(res));
       _then(res);
     });
 };
 //提交流程
 //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
 common.processCommit = (myConfig, that, _then) => {
   let _this = that;
   let defaultConfig = {
     //单据类型
     receiptType: "",
     //单据id
     billId: "",
     //水司编号，正式使用不需要传此参数，只为运维平台测试用
     // companyNo:'',
     //审批意见
     comment: "",
     //流程标题**新建流程时必填**
     title: "",
     //当前待办任务，
     taskId: "",
     //1.驳回2.转办4.添加沟通人8催办 16.废弃 32.通过 64 添加沟通/评论信息
     operation: "",
     //operation为1时  选择驳回到哪个节点的节点的名称
     rejectNodeCode: "",
     //operation为2和4 时该表示转办人和沟通人,多个人员中间加逗号
     relatedUser: "",
     //表单字段json字符串，只支持K-V
     formVariables: {},
     //下级候选.<br/>如流程设计时节点有设置权限属性“可修改节点或必须修改节点”，则：<br/>当operation为32时需指定对应节点的审批人<br/>多办理人以中划线隔开{‘Usertask01’:12-34-12’,’Usertask02’:’897-54-23’,’Usertask03’:’897-54-23’}
     nextCandidateUsers: "",
     //附件标识
     attachment: ""
   };
   myConfig = Object.assign({}, defaultConfig, myConfig);
   let params = {
     busicode: myConfig.submitBusiCode || "ProcessCommit",
     data: {...myConfig, submitBusiCode: undefined}
   };
   _this.$api
     .fetch({
       params: params //参数
     })
     .then(res => {
       _this.$message({
         showClose: true,
         message: "提交成功",
         type: "success"
       });
       _then();
     });
 };
 //获取审批的前端代码
 //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
 //receiptType单据类型，一般是启用工作流的表的数据库名称
 //title流程标题,一般是单据类型加单据编号等，容易区分的内容\用于主题
 //billId单据Id
 //processInstanceId流程实例Id,新建流程这个为空，一般为数据库中存储的流程实例id
 //workFlowObj工作流代码插入的对象，一般需在界面放置一个div对象<div id="workflowDiv"></div>
 //companyNo "水司编号"，正式使用不需要传此参数，只为运维平台测试用
 //that:"页面的this对象"
 //_then 提交后的回调函数，一般用来执行界面跳转
 //submitFlag 是否需要先提交表单 0为需要提交表单再审批  1为不需要提交表单直接审批
 //subBusicode 用户审批前，提交的函数名称 提交的data需要调用页面写一个固定的getSubData()的方法 获取提交数据
  common.getProcessShowView = async (

   receiptType,
   title,
   billId,
   processInstanceId,
   workFlowObj,
   that,
   _then,
   submitFlag,
   subBusicode,
   submitBusiCode
 ) => {
   let _this = that;
   let params = {
     busicode: "ProcessShowView",
     data: {
       billId: billId,
       receiptType: receiptType,
       processInstanceId: processInstanceId
       // companyNo:companyNo//此参数在营收收费系统正式使用时不得上传
     }
   };
   _this.$api
     .fetch({
       params: params //参数
     })
     .then(res => {
       $("#" + workFlowObj).html(res);
       //接口返回的标签与事件，该方法写在后端接口返回的数据中，不在前端代码中
       $(".submit-opinion").on("click", async function() {
         let data = {};
         var loading = Loading.service({
           lock: true,
           text: "正在上传......",
           spinner: "el-icon-loading",
           background: "rgba(0, 0, 0, 0.3)"
         });
         try {
           data = getSubmitData();
         } catch (err) {
           loading.close();
           _this.$message({
             showClose: true,
             message: err,
             type: "error"
           });
           return;
         }
         loading.close();

         if(typeof _this.BeforeSubmit === "function"){
           let err = await _this.BeforeSubmit(data);
           if(err!==null && err!==''){
             _this.$message({
               showClose: true,
               message: err,
               type: "error"
             });
             return
           }
         }

         if(typeof _this.changeBeforeSubmit === "function" && data.operation == 32) {
           let b = _this.getFormbData();
           let err = await _this.changeBeforeSubmit(b);
           if(err!==null && err!==''){
             _this.$message({
               showClose: true,
               message: err,
               type: "error"
             });
             return
           }
         }
          //  【梅州水司、湛江水司】【报装】登记节点不需要填写水表信息，在施工勘察节点输入，增加参数跟校验
          if(((_this.waterMeterInfoIfRequiredConfig && _this.currentStep >= 4) || _this.waterMeterInfoIfRequiredConfig == false) && _this.$refs.buildwaterMeter && _this.$refs.buildwaterMeter.tableData.length == 0){
            _this.$message({
              type: 'error',
              message: "水表信息不能为空"
            })
            return
          }
          if(_this.$refs.buildwaterMeter && _this.$refs.buildwaterMeter.tableData.length > 0){
            for(let i = 0;i < _this.$refs.buildwaterMeter.tableData.length; i++){
              if(_this.$refs.buildwaterMeter.tableData[i].msInfo.meterBore == ""){
                _this.$message({
                  type: 'error',
                  message: "第" + (i + 1) + "行水表口径不能为空"
                })
                return
              }
            }
          }
         if(subBusicode){
            // 可修改-先保存表单信息，后提交流程 需要保存先
            if (submitFlag !== 1 && data.operation == 32) {
              let a = _this.getFormbData()//
              try {
                let getBillId = await _this.$api.fetch({ params:{busicode: subBusicode, data: a} });
                if (!billId) {
                  billId = getBillId.id;
                  if(_this.$refs.buildwaterMeter && _this.$refs.buildwaterMeter.tableData.length > 0){
                    let promise = await _this.savePjMeterBatchInsert(billId);
                    if(promise == false){
                      return;
                    }
                  }
                }else{
                  if( _this.$refs.buildwaterMeter && _this.$refs.buildwaterMeter.tableData.length > 0){
                    let promise = await _this.savePjMeterBatchInsert(_this.id);
                    let promisematerial;
                    // 施工勘察、预算编制、工程结算节点，提交
                    if(_this.currentStep == 4 || _this.currentStep == 6 || _this.currentStep == 19){
                      promisematerial = await _this.$refs.materialsBill.saveMBill();
                    }
                    if(promise == false || promisematerial == false){
                      return;
                    }
                  }
                }
              } catch (e) {
                console.log(e);
                return
              }
            }
         }
           // 不可修改-提交流程  直接调用审批
           //rejectNodeCode要驳回的节点
           //relatedUser转办人员，沟通人员，取消沟通人员
           //comment处理意见
           //operation操作类型
           //__nodeOperator可修改的节点信息
           //__mnodeOperator必须修改的节点信息
           //attachment附件id
           //taskid当前任务id
           //template模板编号
           //data.attachmentId = $("#fileId").val();
           let nextCandidateUsers = {};
           if (data.__nodeOperator) {
             for (let i = 0; i < data.__nodeOperator.length; i++) {
               nextCandidateUsers = Object.assign(
                 nextCandidateUsers,
                 data.__nodeOperator[i]
               );
             }
           }
           if (data.__nodeOperator) {
             for (let i = 0; i < data.__mnodeOperator.length; i++) {
               nextCandidateUsers = Object.assign(
                 nextCandidateUsers,
                 data.__mnodeOperator[i]
               );
             }
           }
           _this.common.processCommit(
             {
               receiptType: receiptType, //表单名称
               billId: billId,
               title: title,
               operation: data.operation,
               noticeManner: data.noticeManner,
               comment: data.comment,
               taskId: data.taskId,
               rejectType: data.rejectType,
               rejectNodeCode: data.rejectNodeCode,
               relatedUser: data.relatedUser,
               nextCandidateUsers: JSON.stringify(nextCandidateUsers),
               formVariables: _this.getFormbData().formVariables,
               // subject:data.comment,
               attachment: data.attachment,
               submitBusiCode: submitBusiCode,
               // companyNo: companyNo,//水司编号，正式使用不需要传此参数，只为运维平台测试用
             },
             _this,
             () => {
               if (receiptType === 'USER_TRANSFER'){
                 _then(data.operation); //提交后的回调函数
               }else {
                 _then(); //提交后的回调函数
               }

             }
           );
       });
     });
 };
 //提交后启动审批流
 //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
 //receiptType单据类型，一般是启用工作流的表的数据库名称
 //title流程标题,一般是单据类型加单据编号等，容易区分的内容\用于主题
 //billId单据Id
 //that:"页面的this对象"
 //_then 提交后的回调函数，一般用来执行界面跳转
 common.startProcess = (receiptType, title, billId, that, _then) => {
   let _this = that;
   let data = {};
   var loading = Loading.service({
     lock: true,
     text: "正在上传......",
     spinner: "el-icon-loading",
     background: "rgba(0, 0, 0, 0.3)"
   });
   try {
     data = getSubmitData();
   } catch (err) {
     loading.close();
     _this.$message({
       showClose: true,
       message: err,
       type: "error"
     });
     return;
   }
   loading.close();
   //__subinfo要驳回的节点
   //__subuser转办人员，沟通人员，取消沟通人员
   //__comment处理意见
   //__operation操作类型
   //__nodeOperator可修改的节点信息
   //__mnodeOperator必须修改的节点信息
   //__attachmentId附件id
   //taskid当前任务id
   //template模板编号
   //data.attachmentId = $("#fileId").val();
   let nextCandidateUsers = {};
   if (data.__nodeOperator) {
     for (let i = 0; i < data.__nodeOperator.length; i++) {
       nextCandidateUsers = Object.assign(
         nextCandidateUsers,
         data.__nodeOperator[i]
       );
     }
   }
   if (data.__nodeOperator) {
     for (let i = 0; i < data.__mnodeOperator.length; i++) {
       nextCandidateUsers = Object.assign(
         nextCandidateUsers,
         data.__mnodeOperator[i]
       );
     }
   }
   // console.log(receiptType,title,billId,that,_then);
   //receiptType单据类型，一般是启用工作流的表的数据库名称
   //billId id
   // operation操作类型
   //comment处理意见
   //taskId
   //rejectNodeCode要驳回的节点
   //relatedUser转办人员，沟通人员，取消沟通人员
   //nextCandidateUsers 下一个节点处理人
   //attachment附件id
   _this.common.processCommit(
     {
       receiptType: receiptType, //表单名称
       billId: billId,
       title: title,
       operation: data.operation,
       noticeManner: data.noticeManner,
       comment: data.comment,
       taskId: data.taskId,
       rejectNodeCode: data.rejectNodeCode,
       relatedUser: data.relatedUser,
       nextCandidateUsers: JSON.stringify(nextCandidateUsers),
       // subject:data.comment,
       attachment: data.attachment,
       artificialDecisionCondition: data.artificialDecisionCondition
       // companyNo: companyNo,//水司编号，正式使用不需要传此参数，只为运维平台测试用
     },
     _this,
     () => {
       _then(); //提交后的回调函数
     }
   );
 };
/**
 * get方式下载文件 a标签方式
 * @param {String} url  下载Url
 * @param {String} id   a标签id
 */
  common.downloadFile = (url,id) => {
      var a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", id);
      // 防止反复添加
      if (!document.getElementById(id)) document.body.appendChild(a);
      a.click();
      document.getElementById(id).remove();
  }
 export default common;

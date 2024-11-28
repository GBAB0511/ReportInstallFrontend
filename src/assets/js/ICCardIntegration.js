"use strict";
//ic卡集成js
import { Loading } from "element-ui";
import x2js from "x2js";
var x2jsxml = new x2js();
const baseUrl = "http://localhost:2346/iccard"; //ic卡控件地址
let ICCardObj = {};
ICCardObj.ajax = (iccardApi, data, that) => {
  var isHideErrorTip = false;
  if ("isHideErrorTip" in data) { //是否不显示未插卡提示
    isHideErrorTip = data.isHideErrorTip;
    delete data.isHideErrorTip;
  }
  if(iccardApi=="writeCard"){
    var json = {
      iccard: {
        operation: "writeCard",
        data: data.param
      }
    };
 
    data.param = x2jsxml.js2xml(json);

  }
  var loading = Loading.service({
    lock: true,
    text: "正在执行IC卡操作...",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.3)"
  });
  return new Promise((resolve, reject) => {
    $.ajax({
      url: baseUrl + "/" + iccardApi,
      type: "GET",
      data: data,
      success: function(res) {
        loading.close();
        // if (process.env.NODE_ENV == "development"){
        //       res = {
        //         resultCode: "OK",
        //         dataList: [
        //           {
        //             ShuJu: "1",
        //             ChaKa: "0",
        //             KaLeiXin: "3",
        //             QuYuHao: "9999",
        //             BiaoHao: "3",
        //             ZhiBiaoHao: "1",
        //             CaiYangDian: "",
        //             XianShiBaoJingLiang: "3",
        //             GuanBiBaoJingLiang: "2",
        //             GouMaiCiShu: "0",
        //             XianGouLiang: "50",
        //             GouMaiLiang: "3",
        //             LeiJiGouLiang: "0",
        //             LeiJiYongLiang: "0",
        //             ShengYuLiang: "0",
        //             GuoLingLiang: "0",
        //             BiaoZhuangTai: "0"
        //           }
        //         ]
        //       };
        // }
        if (res.resultCode == "error") { //未插卡 读卡失败
          reject(res);
          if (!isHideErrorTip) {
            that.$message({
              title: "警告",
              message: "请插卡！",
              type: "error"
            });
          }
        } else {
          resolve(res.dataList);
          console.log("读取成功");
        }
      },
      error: function(res) {//读卡失败
        loading.close();
        if (!isHideErrorTip) {
          that.$message({
            title: "警告",
            message: "未启动IC卡控件，请先正确启动",
            type: "error"
          });
        }


        reject(res);
      }
    });
  });
};

export default ICCardObj;

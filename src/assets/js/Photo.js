let Photo = {
  online: false,
  dataOBJ: {
    myBase64: ''
  },
  successConnection: true
}


var TotalTimelenth = 0;
var timer;
var str1, str2;
function TimeGo() {
  TotalTimelenth++;
  //TimeLenth.value=TotalTimelenth;
  var Hour, Minue, Second;
  Hour = Math.floor(TotalTimelenth / 3600);
  Minue = Math.floor((TotalTimelenth / 60) % 60);
  Second = Math.floor(TotalTimelenth % 60);
  //Time=Hour+"时"+Minue+"分"+Second+"秒";
  TimeLenth.value = Hour + "时" + Minue + "分" + Second + "秒";
}

function myBrowser() {

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

var webSocket;

if(myBrowser() != "IE") {

  webSocket = new WebSocket("ws://localhost:1818");

  webSocket.onerror = function(event) {
    onError(event);
    Photo.online = false
  };

  webSocket.onopen = function(event) {
    onOpen(event);
    Photo.online = true
  };

  webSocket.onclose = function(event) {
    onClose(event);
    Photo.online = false
    webSocket.send("bStopPlay()");
    webSocket.send("bStopPlay4()");
  };

  webSocket.onmessage = function(event) {
    onMessage(event);
  };
}

 
window.onbeforeunload = function() {
  if(myBrowser() != "IE") {
    webSocket.send("bStopPlay()");
    webSocket.send("bStopPlay4()");
  }
};

var begin_data = "data:image/jpeg;base64,";
function onMessage(event) {
    if (event.data.indexOf("bSaveJPG") >= 0) {
    console.log(event,'照片存储成功')
    Photo.dataOBJ.bSaveJPGCb();
  }

  if (event.data.indexOf("sOCRImageToString") >= 0) {
    console.log(event,'文字识别成功')
    Photo.dataOBJ.OCRtextCb( event.data.replace("BeginsOCRImageToString", "").replace("EndsOCRImageToString", ""));
  }
  if (event.data.indexOf("BarCodeTransferBegin") >= 0) {
    // console.log(1);
    // alert(
    //   event.data.replace("BarCodeTransferBegin", "").replace("BarCodeTransferEnd", "")
    // );
  } else if (event.data.indexOf("BeginbSaveJPGEx") >= 0) {// 拍照
    console.log(2);
    Photo.dataOBJ.myBase64 = begin_data + event.data.replace("BeginbSaveJPGEx", "").replace("EndbSaveJPGEx", "");
  document.getElementById("photo")&&(document.getElementById("photo").src = Photo.dataOBJ.myBase64);
    // alert(str1);
  } else if (event.data.indexOf("BeginBase64Encode") >= 0) {
    console.log(3);
    // alert(
    //   event.data.replace("BeginBase64Encode", "").replace("EndBase64Encode", "")
    // );
  } else if (event.data.indexOf("BeginbStopPlay") >= 0) {
    console.log(3);
    // alert(event.data.replace("BeginbStopPlay", "").replace("EndbStopPlay", ""));
  } else if (event.data.indexOf("BeginvSetResolution") >= 0) {
    console.log(4);
    // alert(
    //   event.data.replace("BeginvSetResolution", "").replace("EndvSetResolution", "")
    // );
  } else if (event.data.indexOf("BeginbFileExist") >= 0) {
    console.log(5);
    // alert(
    //   event.data.replace("BeginbFileExist", "").replace("EndbFileExist", "")
    // );
  } else if (event.data.indexOf("BeginbDirIsExist") >= 0) {
    console.log(6);
    // alert(
    //   event.data.replace("BeginbDirIsExist", "").replace("EndbDirIsExist", "")
    // );
  } else if (event.data.indexOf("BeginbCreateDir") >= 0) {
    console.log(7);
    // alert(
    //   event.data.replace("BeginbCreateDir", "").replace("EndbCreateDir", "")
    // );
  } else if (event.data.indexOf("BeginsGetTempPath") >= 0) {
    console.log(8);
    // alert(
    //   event.data.replace("BeginsGetTempPath", "").replace("EndsGetTempPath", "")
    // );
  } else if (event.data.indexOf("BeginbStartPlay2") >= 0) {
    console.log(9);
    if(event.data.indexOf("BeginbStartPlay2falseEndbStartPlay2") >= 0){//说明开启的画面没有成功
      Photo.successConnection = false;
    }
    // alert(
    //   event.data.replace("BeginbStartPlay2", "").replace("EndbStartPlay2", "")
    // );
  } else if (event.data.indexOf("BeginbStartPlay") >= 0) {
    console.log(10);
    if(event.data.indexOf("BeginbStartPlayfalseEndbStartPlay") >= 0 || event.data.indexOf("BeginbStartPlayRotatefalseEndbStartPlayRotate") >= 0){//说明开启的画面没有成功
      Photo.successConnection = false;
    }
    // alert(
    //   event.data.replace("BeginbStartPlay", "").replace("EndbStartPlay", "")
    // );
  } else if (event.data.indexOf("BeginsGetBarCodeEx") >= 0) {
    console.log(11);
    // alert(
    //   event.data.replace("BeginsGetBarCodeEx", "").replace("EndsGetBarCodeEx", "")
    // );
  } else if (event.data.indexOf("BeginbSetMode") >= 0) {// 自动寻边
    console.log(12);
    // alert(event.data.replace("BeginbSetMode", "").replace("EndbSetMode", ""));
  } else{// 一直去渲染base64字符串
    console.log(13);
    Photo.successConnection = true;
    // 以此获取点击拍照瞬间的base64字符串
    if (Photo.dataOBJ.myBase64 == 'bSaveJPGEx') {
      Photo.dataOBJ.myBase64 = begin_data + event.data
    }
     document.getElementById("photo")&&(document.getElementById("photo").src = begin_data + event.data); 
    
  }
  // console.log(dataOBJ.myBase64);
}
function onError(event) {
  // alert(event.data);
}
function onClose(event) {
  webSocket.send("bStopPlay()");
  webSocket.send("bStopPlay4()");
}
function onOpen(event) {}

Photo.start = function(el) {
  if (el == "bStartRec(d:\\test.avi)") {
    timer = window.setInterval("TimeGo()", 1000);
  }
  if (el == "bStopRec") {
    window.clearInterval(timer);
    TotalTimelenth = 0;
    // alert("录屏结束");
  }
  // 以此获取点击拍照瞬间的base64字符串
  if (el == 'bSaveJPGEx') {
    Photo.dataOBJ.myBase64 = 'bSaveJPGEx'
  }

  webSocket.send(el);
  return false;
}
function vout_OnClick() {}

Photo.Stop_onclick = function() {
  webSocket.send("bStopPlay()");
}

Photo.StartPlay_onclick = function () {
  webSocket.send("vSetResolution(8)");
  webSocket.send("bStartPlay()");
}

Photo.Test5_onclick = function () {
  webSocket.send("bSaveJPG(D:\\,Photo)");
  webSocket.send("sGetBarCodeEx(113662,d:\\Photo.jpg)");
}

Photo.Test6_onclick = function () {
  webSocket.send("bSaveTIFEx(d:\\,tiftif,0)");
  webSocket.send("sGetBarCodeEx(113662,d:\\tiftif.tif)");
}

export default Photo

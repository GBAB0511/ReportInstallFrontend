var websocket;
var g_strWebsocketServerPath = "ws://127.0.0.1:38088";

let PhotoFangZheng = {
  online: false,
  dataOBJ: {
    myBase64: '',
		//这里返回图片的base64地址
  },
	secondaryCamera: true,//副摄像头的设备
}

var begin_data = "data:image/jpeg;base64,";
function onMessage(e) {
  var jsonObj =JSON.parse(e.data);
  if(jsonObj.function == "video_stream")
	{
    //获取到的页面内容显示在弹出框中
		document.getElementById("photo").src= "data:image/gif;base64," + jsonObj.image_base64;
	}
	
	if(jsonObj.function == "grab_image")
	{
		if(jsonObj.code != 0)
		{
			document.getElementById("result").innerHTML = "拍照失败，错误代码：" + jsonObj.code + "，返回信息 = " + jsonObj.message;
		}
		else
		{
      PhotoFangZheng.dataOBJ.myBase64 = begin_data + jsonObj.images[0].base64
		}
	}
	if(jsonObj.function == "get_resolution")
	{
		if(jsonObj.code != 0)
		{
			document.getElementById("result").innerHTML = "获取分辨率失败，错误代码 = " + jsonObj.code + "，错误信息 = " + jsonObj.message; 	
		}
		else
		{
			// 没有返回有resolution说明没有副摄像头设备连接
			if(jsonObj.resolution == "" && g_iCamIdx == "1"){
				PhotoFangZheng.secondaryCamera = false;
			}else{
				PhotoFangZheng.secondaryCamera = true;
			}
			console.log("获取分辨率成功");
		}  				
	}
	if(jsonObj.function == "set_resolution")			
	{				
		document.getElementById("result").innerHTML = "设置分辨率，返回代码 = " + jsonObj.code + "，返回信息 = " + jsonObj.message; 	
	}
	
	if(jsonObj.function == "get_param")			
	{				
		document.getElementById("result").innerHTML = "获取参数，返回代码 = " + jsonObj.code + "，返回信息 = " + e.data; 	
	}
  if(jsonObj.function == "set_cutpage")			
	{
    console.log(jsonObj)	
		document.getElementById("result").innerHTML = "获取参数，返回代码 = " + jsonObj.code + "，返回信息 = " + e.data; 	
	}
}

var g_iCutType = "0";//这个的切边方式，只获得身份证等卡片的页面，"0"不切边：即不对页面进行裁剪，"1"自动切边：主要针对文档/证件采集时，根据材料边缘进行自动裁剪
var g_iCamIdx = "0";// 默认值为"0"文档摄像头，"0"代表采集文档摄像头的图像，"1"代表采集人像摄像头的图像，"2"代表采集第二人像摄像头的图像
var g_bIsIE = false;
var g_iAngle = 0;//旋转角度，必须为 90 的倍数，默认为"0"。
var g_fileList = "";
var g_timer = null;
var g_iAutoPreCode = "0";

ConnectServer();//初始化调用

function ConnectServer(callback, value) {
  if ("WebSocket" in window) {
    websocket = new WebSocket(g_strWebsocketServerPath);
  } else if (window.WebSocket) {
    websocket = new WebSocket(g_strWebsocketServerPath);
  } else if ("MozWebSocket" in window) {
    websocket = new MozWebSocket(g_strWebsocketServerPath);
  } else {
    alert("浏览器版本太低！请使用Chrome、Firefox、IE10+浏览器！");
  }

  websocket.onopen = function () {
    PhotoFangZheng.online = true;
    // callback(value);
  }
  websocket.onclose = function (e) {
    PhotoFangZheng.online = false;
  }
  websocket.onmessage = function (e) {
    onMessage(e);
  }
  websocket.onerror = function (e) {
		onError(e);
  };
}
function sendMessage(jsonStr) {
  console.log(jsonStr)
  console.log(JSON.parse(jsonStr))
  PhotoFangZheng.online ? websocket.send(jsonStr) : alert("未连接websocket服务器，请确保已运行服务端！");
}

PhotoFangZheng.OpenCamera = function(g_iCamIdxValue)
{
	var camradio = document.getElementsByName("camidx");
	for(let i=0; i<camradio.length; i++)
	{
		if(camradio[i].checked)
			g_iCamIdx = camradio[i].value;
	}
	g_iCamIdx = g_iCamIdxValue;//获得参数,"0"代表采集文档摄像头的图像，"1"代表采集人像摄像头的图像
	var data = "{\"function\": \"open_camera\", \"camidx\": \"" + g_iCamIdx.toString() + "\"}";
  PhotoFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
	setTimeout( function(){
		GetResolutionList();
	}, 1000 );//延迟1000毫秒		
}
function GetResolutionList()
{
	var params = "{\"type\": \"resolution\",\"camidx\":\"" + g_iCamIdx.toString() + "\"}";	
	var data = "{\"function\": \"get_resolution\", \"params\": " + params + "}";
  PhotoFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);	
}
PhotoFangZheng.GrabImage = function ()
{
	var strStorageInfo = "{ \"xdpi\":\"200\", \"ydpi\":\"200\", \"jpg_quality\":\"60\" }";
	var strImageProcess = "{\"cut_type\":\"" + g_iCutType + "\", \"multi_object\":\"0\", \"rotate\":\"" + g_iAngle.toString() +  "\"}";
	var params = "{\"camidx\":\"" + g_iCamIdx.toString() + "\",\"make_uuid\":\"1\",\"image_storage_info\":" + strStorageInfo + ",\"image_process_info\":" + strImageProcess + "}";	
	var data = "{\"function\": \"grab_image\", \"params\": " + params + "}";
  PhotoFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}
// 切边，是否进行相应的裁剪
PhotoFangZheng.SetAutoCut = function(bAuto)
{
	g_iCutType = bAuto ? 1 : 0;
	var params = "{\"cutpage\":\"" + (g_iCutType ? "true" : "false") + "\"}";//
	var data = "{\"function\": \"set_cutpage\", \"params\": " + params + "}";
	PhotoFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}
// 关闭设备
PhotoFangZheng.CloseDevice = function()
{
	var data = "{\"function\": \"close_camera\", \"camidx\": \"" + g_iCamIdx.toString() + "\"}";
  PhotoFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}
export default PhotoFangZheng

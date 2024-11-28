var websocket;
var g_strWebsocketServerPath = "ws://127.0.0.1:38088";
let IDCardFangZheng = {
  online: false
}
// 要获取数据的字段
var getDataName = ''
var dataOBJ = {
  certNo: '',// 客户证件号码
  agentCertNo: '',// 经办人证件号码
}
var allData = {}; // 所有数据
IDCardFangZheng.getData = function (name) {
  return dataOBJ[name]
}
IDCardFangZheng.getAllData = function (){
  return allData;
}
function Init()
{
	document.getElementById("url_input").value="iReadCardBas_HSM_Step1";
}
/**
 * 初始化webSocket连接
 * @param callback
 * @param value
 * @constructor
 */
ConnectServer();
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
		IDCardFangZheng.online = true;
	}
	websocket.onclose = function (e) {
		IDCardFangZheng.online = false;
	}
	websocket.onmessage = function (e) {
		onMessage(e);
	}
	websocket.onerror = function (e) {
		onError(e);
  };
}

/**
 * 接收服务器消息
 * @param e
 */
function onMessage(e) {
  var jsonObj = eval("(" + e.data + ")");
	if(0 != jsonObj.code) {
		//如果出现错误，返回为空，不清空可能会出现，移走身份证点击获取的时候仍然能获取成功的情况
		allData = {};
		for (const key in dataOBJ) {
			if (key == getDataName) {
				dataOBJ[key] = "";
			}
		}
		// document.getElementById("result_text").innerHTML = "";
		// document.getElementById("card_photo").src= "image/idcard_photo.png";
		// ShowStatus("发生错误：" + jsonObj.message + "(" + jsonObj.code + ")");
		return;
	}
	if(jsonObj.function == "get_samid")
	{
		var tmp = document.getElementById("result_text").innerHTML;
		document.getElementById("result_text").innerHTML = tmp + "<br />模块号：" + jsonObj.samID;
	}
	else if(jsonObj.function == "read_idcard")
	{
		// 这里获得身份证的相关信息
		allData = jsonObj.IDCardInfo;
		for (const key in dataOBJ) {
			if (key == getDataName) {
				dataOBJ[key] = jsonObj.IDCardInfo.cardID;
			}
		}
		// document.getElementById("result_text").innerHTML =
		// 							 "姓名：" + jsonObj.IDCardInfo.name +
		// 							 "<br />性别：" + jsonObj.IDCardInfo.sex +
		// 							 "<br />生日：" + jsonObj.IDCardInfo.birthday +
		// 							 "<br />地址：" + jsonObj.IDCardInfo.address +
		// 							 "<br />身份证号：" + jsonObj.IDCardInfo.cardID +
		// 							 "<br />发卡机构：" + jsonObj.IDCardInfo.issueOrgan + 
		// 							 "<br />有效时间：" + jsonObj.IDCardInfo.validStart + "-" + jsonObj.IDCardInfo.validEnd;
		// document.getElementById("card_photo").src= "data:image/gif;base64," + jsonObj.IDCardInfo.photoBase64;
		// ShowStatus("读取成功");
		// GetSAMId();
	}
	else if(jsonObj.function == "read_sociaseceritycard")
	{
		document.getElementById("result_text").innerHTML = 
									 "社保号：" + jsonObj.SocialCardInfo.SocialSecurityNumber +
									 "<br />姓名：" + jsonObj.SocialCardInfo.Name + 	
									 "<br />性别：" + jsonObj.SocialCardInfo.Sex +
									 "<br />民族：" + jsonObj.SocialCardInfo.Nation +
									 "<br />生日：" + jsonObj.SocialCardInfo.Birthday +
									 "<br />出生地：" + jsonObj.SocialCardInfo.Birthplace +
									 "<br />卡识别码：" + jsonObj.SocialCardInfo.CardDistinguishCode +
									 "<br />卡类别：" + jsonObj.SocialCardInfo.SocialSecurityCardType + 
									 "<br />卡规范版本：" + jsonObj.SocialCardInfo.CardNormVer +
									 "<br />签证机关：" + jsonObj.SocialCardInfo.VisaInstitution + 
									 "<br />有效时间：" + jsonObj.SocialCardInfo.ValidStart + "-" + jsonObj.SocialCardInfo.ValidEnd +
									 "<br />卡号：" + jsonObj.SocialCardInfo.CardNumber;
		ShowStatus("读取成功");
	}
	else if(jsonObj.function == "read_iccard")
	{
		document.getElementById("result_text").innerHTML = 
									 "卡号: " + jsonObj.ICCardInfo.CardNumber +
									 "<br />卡类型: " + jsonObj.cardType +
									 "<br />姓名: " + jsonObj.ICCardInfo.Name + 	
									 "<br />证件类型: " + jsonObj.ICCardInfo.CertificatesType +
									 "<br />证件号码: " + jsonObj.ICCardInfo.CertificatesNo +
									 "<br />余额: " + jsonObj.ICCardInfo.Balance + 
									 "<br />余额上限: " + jsonObj.ICCardInfo.BalanceLimit +
									 "<br />单笔交易限额: " + jsonObj.ICCardInfo.SingleTradingLimit +
									 "<br />应用货币代码: " + jsonObj.ICCardInfo.TransactionCurrencyCode + 
									 "<br />失效日期: " + jsonObj.ICCardInfo.ExpiryDate +
									 "<br />IC卡序列号: " + jsonObj.ICCardInfo.SerialNumber +
									 "<br />一磁道信息: " + jsonObj.ICCardInfo.Track1 +
									 "<br />二磁道信息: " + jsonObj.ICCardInfo.Track2 +
									 "<br />三磁道信息: " + jsonObj.ICCardInfo.Track3 +
									 "<br />当前IC卡的AID: " + jsonObj.ICCardInfo.IcCardAID
									 ;
		ShowStatus("读取成功");
	}
	else if(jsonObj.function == "read_magcard")
	{
		document.getElementById("result_text").innerHTML = 
									 "磁道1: " + jsonObj.MagCardInfo.Track1 +
									 "<br />磁道2: " + jsonObj.MagCardInfo.Track2 + 	
									 "<br />磁道3: " + jsonObj.MagCardInfo.Track3;
		ShowStatus("读取成功");
	}
	else
	{
		document.getElementById("result_text").innerHTML = jsonObj.function + "接口请求成功，返回数据 =\r\n" + jsonObj.pOutInfo;
		ShowStatus("操作成功");
	}

}

/**
 * 向服务器发送信息的共享方法
 * @param jsonStr
 */
function sendMessage(jsonStr) {
	IDCardFangZheng.online ? websocket.send(jsonStr) : alert("未连接websocket服务器，请确保已运行服务端！");
}

function ShowStatus(str)
{
	document.getElementById("status_text").innerHTML = str;
}

function GetSAMId()
{
	var data = "{\"function\": \"get_samid\"}";
	IDCardFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}

IDCardFangZheng.ReadIDCard = function (name)
{
	getDataName = name;//获得传参的名称来判断是获取的哪个证件号码
    // ShowStatus("二代证信息读取中......");
	var data = "{\"function\": \"read_idcard\"}";
	IDCardFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}

function ReadSocialCard() {

	ShowStatus("社保卡信息读取中......");
	var data = "{\"function\": \"read_sociaseceritycard\"}";
	IDCardFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}

function ReadICCard()
{
	ShowStatus("IC卡信息读取中......");
	var data = "{\"function\": \"read_iccard\"}";
	IDCardFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data);
}

function ReadMagCard()
{
	ShowStatus("磁条卡信息读取中......");
	var data = "{\"function\": \"read_magcard\"}";
	IDCardFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data); 
}

function PostToService()
{
	ShowStatus("读取中......");
	var params = document.getElementById("para_input").value;
	var data = "{\"function\": \"" + document.getElementById("url_input").value + "\", \"params\": " + params + "}";
	IDCardFangZheng.online ? sendMessage(data) : ConnectServer(sendMessage, data); 
}
export default IDCardFangZheng

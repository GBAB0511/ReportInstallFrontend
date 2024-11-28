let IDCard = {
  online: false
}
// 要获取数据的字段
var getDataName = ''
var dataOBJ = {
  certNo: '',// 客户证件号码
  agentCertNo: '',// 经办人证件号码
}
// 添加这里是因为在开户的时候需要名称和号码都回显，所以把所有的数据都返回
var allData = {}; // 所有数据

IDCard.getData = function (name) {
  return dataOBJ[name]
}
IDCard.getAllData = function (){
  return allData;
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

// console.log('ws://' + window.location.hostname + ':1818');
webSocket = new WebSocket('ws://localhost:1818');

webSocket.onerror = function(event) {
  onError(event);
  IDCard.online = false
};

  webSocket.onopen = function(event) {
  onOpen(event);
  IDCard.online = true
  };
  
webSocket.onclose = function(event) {
    onClose(event);
    IDCard.online = false
    
};

  webSocket.onmessage = function(event) {
    onMessage(event)
}
}

 
window.onbeforeunload = function() {
};
 

function onMessage(event) 
{
  // alert(event.data);
  var resData = JSON.parse(event.data.split('BeginCT_ReadIDCard')[1].split('EndCT_ReadIDCard')[0])
  if(resData.msg == 0){
    allData = resData;
    for (const key in dataOBJ) {
      if (key == getDataName) {
        dataOBJ[key] = resData.CardId;
      }
    }
  }else{
    allData = {};
    for (const key in dataOBJ) {
      if (key == getDataName) {
        dataOBJ[key] = "";
      }
    }
  }
  console.log(dataOBJ);
}
function onError(event)
{
//    alert(event.data);
}
function onClose(event)
{

}
function onOpen(event)
{
	
}
function start(el) 
{
  webSocket.send(el);
}

IDCard.ReadIDCard = function (name)
{	
  getDataName = name
	var szDevice = document.getElementById("Device").value;
	var nBaud = parseInt(document.getElementById("Baud").value);
	var nTimeOut = parseInt(document.getElementById("Timeout").value);
	var CardInfo = document.getElementById( "CardInfo" );
	var BpNo = document.getElementById("ExtPort").value;
	var szImgpath = document.getElementById("ImgPath").value;
	var CardImg = document.getElementById( "CardImg" );

	CardImg.src = "";
	CardInfo.value = "";

	if(IDCardOper == null )
	{ 
		window.alert("请先安装ocx控件");
		return ;
	}

	//var bRet = IDCardOper.CT_ReadIDCard( szDevice, BpNo, nBaud, nTimeOut, szImgpath );
	start("CT_ReadIDCard("+szDevice+","+BpNo+","+nBaud+","+nTimeOut+","+szImgpath+")");
	/*if(  bRet == 0 )
	{
		if(IDCardOper.iFlag == 0)
		{
			CardInfo.value = "姓名：" + IDCardOper.Name + "\r\n" +
							"性别：" + IDCardOper.Sex + "\r\n" +
							"民族：" + IDCardOper.Nation + "\r\n" +
							"出生日期：" + IDCardOper.Birthday + "\r\n" +
							"身份证号：" + IDCardOper.CardId + "\r\n" +
							"签发机关：" + IDCardOper.Police + "\r\n" +
							"起始有效期："+ IDCardOper.ValidStart + "\r\n" +
							"截止有效期："+ IDCardOper.ValidEnd + "\r\n" +
							"地址：" + IDCardOper.Address + "\r\n"+ 
							"性别代码："+ IDCardOper.SexCode + "\r\n" +
							"民族代码："+ IDCardOper.NationCode + "\r\n" +
							"最新地址：" +IDCardOper.AppendMsg + "\r\n" +
							"图片Base："+ "\r\n" + IDCardOper.PhotoData;

			window.alert("读二代证成功" );
			
			CardImg.width  = 102;
			CardImg.height = 126;
			CardImg.src = "file:///" + IDCardOper.ImgPath + "?" + Math.random();
		}
		else
		{
			CardInfo.value = "姓名：" + IDCardOper.Name + "\r\n" +
							"英文姓名：" + IDCardOper.EngName + "\r\n" +
							"性别：" + IDCardOper.Sex + "\r\n" +
							"国籍：" + IDCardOper.Nation + "\r\n" +
							"证件版本：" + IDCardOper.Version + "\r\n" +
							"机关代码：" + IDCardOper.govCode + "\r\n" +
							"证件类型：" + IDCardOper.cardType + "\r\n" +
							"出生日期：" + IDCardOper.Birthday + "\r\n" +
							"永久居留证号码：" + IDCardOper.CardId + "\r\n" +
							"起始有效期："+ IDCardOper.ValidStart + "\r\n" +
							"截止有效期："+ IDCardOper.ValidEnd + "\r\n" +
							"预留项：" + IDCardOper.otherData + "\r\n" +
							"图片Base："+ "\r\n" + IDCardOper.PhotoData;

			window.alert("读取外国人永久居留证成功" );

			CardImg.width  = 102;
			CardImg.height = 126;
			CardImg.src = "file:///" + IDCardOper.ImgPath + "?" + Math.random();
		}   
	}
	else
	{
		window.alert("读取证件错误，错误代码：" + bRet );
  }  */
  
  
}



function ReadIDCardForeigner(  )
{	
	var szDevice = document.getElementById("Device").value;
	var nBaud = parseInt(document.getElementById("Baud").value);
	var nTimeOut = parseInt(document.getElementById("Timeout").value);
	var CardInfo = document.getElementById( "CardInfo" );
	var BpNo = document.getElementById("ExtPort").value;
	var szImgpath = document.getElementById("ImgPath").value;
	var CardImg = document.getElementById( "CardImg" );

	CardImg.src = "";
	CardInfo.value = "";

	if(IDCardOper == null )
	{ 
		window.alert("请先安装ocx控件");
		return ;
	}
	document.getElementById("sk1").value = MsgCardOper.Tr1Data;
	document.getElementById("sk2").value = MsgCardOper.Tr2Data;
	document.getElementById("sk3").value = MsgCardOper.Tr3Data;

	//var bRet = IDCardOper.CT_ReadIDCardForeigner( szDevice, BpNo, nBaud, nTimeOut, szImgpath );
	start("CT_ReadIDCardForeigner("+szDevice+","+BpNo+","+nBaud+","+nTimeOut+","+szImgpath+")");
	/*if(  bRet == 0 )
	{
		CardInfo.value = "姓名：" + IDCardOper.Name + "\r\n" +
						"英文姓名：" + IDCardOper.EngName + "\r\n" +
						"性别：" + IDCardOper.Sex + "\r\n" +
						"国籍：" + IDCardOper.Nation + "\r\n" +
						"证件版本：" + IDCardOper.Version + "\r\n" +
						"机关代码：" + IDCardOper.govCode + "\r\n" +
						"证件类型：" + IDCardOper.cardType + "\r\n" +
						"出生日期：" + IDCardOper.Birthday + "\r\n" +
						"永久居留证号码：" + IDCardOper.CardId + "\r\n" +
						"起始有效期："+ IDCardOper.ValidStart + "\r\n" +
						"截止有效期："+ IDCardOper.ValidEnd + "\r\n" +
						"预留项：" + IDCardOper.otherData + "\r\n" +
						"图片Base："+ "\r\n" + IDCardOper.PhotoData;


						window.alert("读取外国人永久居留证成功" );

		CardImg.width  = 102;
		CardImg.height = 126;
		CardImg.src = "file:///" + IDCardOper.ImgPath + "?" + Math.random();
	}
	else
	{
		window.alert("读取证件错误，错误代码：" + bRet );
	}*/
}

function SaveImg()
{
	var ImgType = parseInt(document.getElementById("ImgType").value);
	var CardImg = document.getElementById( "CardImg" );
	var szTmpPath = document.getElementById("ImgPath").value;
	var szLogoMsg = document.getElementById("LogoMsg").value;
	CardImg.src = "";

	if(IDCardOper == null )
	{ 
		window.alert("请先安装ocx控件");
		return ;
	}

	if(ImgType == 4)
	{
		//var bRet = IDCardOper.CT_SaveFrontImgEx( szTmpPath, szLogoMsg );
		start("CT_SaveFrontImgEx("+szTmpPath+","+szLogoMsg+")");
	}
	else
	{
		//var bRet = IDCardOper.CT_SaveImg( ImgType, szTmpPath );
		start("CT_SaveImg("+ImgType+","+szTmpPath+")");
	}

	//if(  bRet == 0 )
	{
		window.alert("保存图片成功" );

		switch( ImgType )
		{
			case 0:
				CardImg.width  = 102;
				CardImg.height = 126;
				break;
			case 1:
			case 2:
			case 4:
				CardImg.width  = 329;
				CardImg.height = 210;
				break;
			case 3:
				CardImg.width  = 329;
				CardImg.height = 420;
				break;
		}
		CardImg.src = "file:///" + IDCardOper.ImgPath + "?" + Math.random(); 
	}
	/*else
	{
		window.alert("保存图片错误，错误代码：" + bRet );
	}*/
}


function GetImgBase64()
{
	var ImgType = parseInt(document.getElementById("ImgType").value);
	CardImg.src = "";

	if(IDCardOper == null )
	{ 
		window.alert("请先安装ocx控件");
		return ;
	}

	//var bRet = IDCardOper.CT_GetImgBase64( ImgType );
	start("CT_GetImgBase64("+ImgType+")");
	//if(  bRet != "" )
	{	
		//window.alert("读取BASE64成功" );

		switch( ImgType )
		{
			case 0:
				CardImg.width  = 102;
				CardImg.height = 126;
				break;
			case 1:
			case 2:
				CardImg.width  = 329;
				CardImg.height = 210;
				break;
			case 3:
				CardImg.width  = 329;
				CardImg.height = 420;
				break;
		}
		CardImg.src = "file:///" + IDCardOper.ImgPath + "?" + Math.random(); 
		CardInfo.value = "图片Base："+ "\r\n" + IDCardOper.PhotoData; 
	}
	//else
	{
		//window.alert("保存图片错误，错误代码：" + bRet );
	}
}

export default IDCard


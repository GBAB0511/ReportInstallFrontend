let MsgCard = {}
// 要获取数据的字段
var getDataName = ''
var dataOBJ = {
  bankAccount: '',
  invoiceAccount: '',
}

MsgCard.getData = function(name) {
  return dataOBJ[name];
};

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

webSocket = new WebSocket('ws://localhost:1818');

webSocket.onerror = function(event) {
  onError(event);
};

  webSocket.onopen = function(event) {
  onOpen(event);
  };
  
webSocket.onclose = function(event) {
    onClose(event);
    
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
  console.log(event.data);
  if (event.data.indexOf("BeginCT_ReadMsgCard") > -1) {
    var resData = JSON.parse(
      event.data.split("BeginCT_ReadMsgCard")[1].split("EndCT_ReadMsgCard")[0]
    );
    // Tr3Data: "6228480128715138276=28062201596770000"
    // console.log(resData);
    var ICCode = resData.Tr3Data.split("=")[0];
    console.log(ICCode);
    for (const key in dataOBJ) {
      if (key == getDataName) {
        dataOBJ[key] = ICCode;
      }
    }
    console.log(dataOBJ);
  }
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

MsgCard.RAWCard = function (name)
{
  getDataName = name
	var sec = document.getElementById("Action");
	switch( parseInt(sec.value) )
	{
		case 1:
			ReadTrack( 1 );
			break;
		case 2:
			ReadTrack( 2 );
			break;
		case 3:
			ReadTrack( 3 );
			break;
		case 4:
			ReadTrack( 12 );
			break;
		case 5:
			ReadTrack( 23 );
			break;
		case 6:
			ReadTrack( 123 );
			break;
		case 7:
			WriteTrack( 1 );
			break;
		case 8:
			WriteTrack( 2 );
			break;
		case 9:
			WriteTrack( 3 );
			break;
		case 10:
			WriteTrack( 12 );
			break;
		case 11:
			WriteTrack( 23 );
			break;
		case 12:
			WriteTrack( 123 );
			break;
	}
}	


function ReadTrack( nMode )
{		
	var szDevice = document.getElementById("Device").value;
	var nBaudrate = parseInt(document.getElementById("Baudrate").value);
	var BpNo = document.getElementById("EntendPort").value;
	var nTimeOut = parseInt(document.getElementById("Timeout").value);
	var nCharset = parseInt(document.getElementById("Charset").value);

	if(MsgCardOper == null )
	{ 
		window.alert("请先安装ocx控件");
		return ;
	}
	
	document.getElementById("sk1").value = "";
	document.getElementById("sk2").value = "";
	document.getElementById("sk3").value = "";
	//var bRet = MsgCardOper.CT_ReadMsgCard( szDevice, nBaudrate, BpNo, nCharset, nTimeOut, nMode );
	start("CT_ReadMsgCard("+szDevice+","+nBaudrate+","+BpNo+","+nCharset+","+nTimeOut+","+nMode+")");
	
	//if( bRet == 0 )
	{
//		if(nMode == 1)
//		{
//			document.getElementById("sk1").value = MsgCardOper.Tr2Data;
//		}
//		else if( nMode == 2 )
//		{
//			document.getElementById("sk2").value = MsgCardOper.Tr2Data;
//		}
//		else if( nMode == 3 )
//		{
//			document.getElementById("sk3").value = MsgCardOper.Tr3Data;
//		}
//		else if( nMode == 12 )
//		{
//			document.getElementById("sk1").value = MsgCardOper.Tr1Data;
//			document.getElementById("sk2").value = MsgCardOper.Tr2Data;
//		}
//		else if( nMode == 23 )
//		{
//			document.getElementById("sk2").value = MsgCardOper.Tr2Data;
//			document.getElementById("sk3").value = MsgCardOper.Tr3Data;
//		}
//		else
		{
			
		}
	}
/*	else
	{
		window.alert("读卡错误，错误代码：" + bRet );
	}*/
}


function WriteTrack( nMode )
{
	var szDevice = document.getElementById("Device").value;
	var nBaudrate = parseInt(document.getElementById("Baudrate").value);
	var BpNo = document.getElementById("EntendPort").value;
	var nTimeOut = parseInt(document.getElementById("Timeout").value);
	var nCharset = parseInt(document.getElementById("Charset").value);
	var szTr1Data = document.getElementById("sk1").value;
	var szTr2Data = document.getElementById("sk2").value;
	var szTr3Data = document.getElementById("sk3").value;

	
	if(MsgCardOper == null )
	{ 
		window.alert("请先安装ocx控件");
		return ;
	}
	
	//var bRet = MsgCardOper.CT_WriteMsgCard( szDevice, nBaudrate, BpNo, nCharset, nTimeOut, nMode, szTr1Data, szTr2Data, szTr3Data );
	start("CT_WriteMsgCard("+szDevice+","+nBaudrate+","+BpNo+","+nCharset+","+nTimeOut+","+nMode+","+szTr1Data+","+szTr2Data+","+szTr3Data+")");
	/*if( bRet == 0 )
	{
		window.alert( "写卡成功" ) ;
	}
	else
	{
		window.alert("写卡错误，错误代码：" + bRet ) ;
	}*/
}

export default MsgCard
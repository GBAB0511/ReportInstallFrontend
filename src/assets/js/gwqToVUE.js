//电子屏集成js
import { Message } from "element-ui";
let gwq = {}

window.onload=function(){
function $(id){return document.getElementById(id)}
var menu=$("topTags") && $("topTags").getElementsByTagName("ul")[0];//�����˵�����
var tags=menu && menu.getElementsByTagName("li");//�����˵�
var ck=$("leftMenu") && $("leftMenu").getElementsByTagName("ul")[0].getElementsByTagName("li");//���˵�
var j;
//������˵������±�ǩ
if(ck) {
  for(i=0;i<ck.length;i++){
    ck[i].onclick=function(){
    $("welcome").style.display="none"//��ӭ��������
    //ѭ��ȡ�õ�ǰ����
    for(j=0;j<8;j++){
    if(this==ck[j]){
    if($("p"+j)==null){
    openNew(j,this.innerHTML);//���ñ�ǩ��ʾ����
     }
    clearStyle();
    $("p"+j).style.backgroundColor="yellow";
    clearContent();
    $("c"+j).style.display="block";
       }
     }
    return false;
      }
     }
}

//���ӻ�ɾ����ǩ
function openNew(id,name){
var tagMenu=document.createElement("li");
tagMenu.id="p"+id;
tagMenu.innerHTML=name+"   "+"<img src='./img/close.jpg' style='vertical-align:middle'/>";
//��ǩ����¼�
tagMenu.onclick=function(evt){
clearStyle();
tagMenu.style.backgroundColor="yellow";
clearContent();
$("c"+id).style.display="block";
}
//��ǩ�ڹر�ͼƬ����¼�
tagMenu.getElementsByTagName("img")[0].onclick=function(evt){
evt=(evt)?evt:((window.event)?window.event:null);
if(evt.stopPropagation){evt.stopPropagation()} //ȡ��opera��Safarið����Ϊ;
this.parentNode.parentNode.removeChild(tagMenu);//ɾ����ǰ��ǩ
var color=tagMenu.style.backgroundColor;
//��������ر�һ����ǩʱ�������һ����ǩ�õ�����
if(color=="#ffff00"||color=="yellow"){//�������������ɫ����
if(tags.length-1>=0){
clearStyle();
tags[tags.length-1].style.backgroundColor="yellow";
clearContent();
var cc=tags[tags.length-1].id.split("p");
$("c"+cc[1]).style.display="block";
 }
else{
clearContent();
$("welcome").style.display="block"
   }
  }
}
menu.appendChild(tagMenu);
}
//�����ǩ��ʽ
function clearStyle(){
for(i=0;i<tags.length;i++){
menu.getElementsByTagName("li")[i].style.backgroundColor="#FFCC00";
  }
}
//�������
function clearContent(){
for(i=0;i<ck.length;i++){
$("c"+i).style.display="none";
 }
}
}

/*
ErrorCode:
0 ------------------------------------------成功 
-1 ------------------------------------------传入参数错误 
-2 ------------------------------------------超时 
-3 ------------------------------------------打开设备失败 
-4 ------------------------------------------写数据错误
 -5 ------------------------------------------读数据错误 
 -6 ------------------------------------------文件不存在或者为空 
 -7 ------------------------------------------设备返回错误信息
  -8 ------------------------------------------读取文件错误
   -9 ------------------------------------------取消操作 
   -10 ------------------------------------------传入空间太小，内存错误
   */
function OnAfterCall(ErrorCode)
{
	if(ErrorCode==0)
	{
		console.error("成功");
	}
	else if(ErrorCode==-1)
	{
		console.error("传入参数错误");
	}
	else if (ErrorCode==-2)
	{
		console.error("超时");
	}
	else if(ErrorCode==-3)
	{
		console.error("打开设备失败");
	}
	else if(ErrorCode==-4)
	{
		console.error("写数据错误");
	}
	else if(ErrorCode==-5)
	{
		console.error("读数据错误");
	}
	else if(ErrorCode==-6)
	{
		console.error("文件不存在或者为空");
	}
	else if(ErrorCode==-7)
	{
		console.error("设备返回错误信息");
	}
	else if(ErrorCode==-9)
	{
		console.error("取消操作");
	}
	else
	{
		console.error("错误" + ErrorCode);
	}
}
var SignPDFCount=0;
var GWQ_StartSignType = 3;
gwq.DoGWQ_StartSign = function DoGWQ_StartSign(PDFPath,XmlPath,mylocation,VoiceStr,timeout)
{
	if(PDFPath=="") PDFPath="D:\\test.pdf";
	if(myBrowser()=="IE")
	{
		var ret=GWQ.DoGWQ_StartSign(PDFPath,XmlPath,mylocation,VoiceStr,timeout);
		//OnAfterCall(ret);
	}
	else {
		var json = {};
		json.PDFPath=PDFPath;
		json.XmlPath=XmlPath;
		json.Location=mylocation;
		json.Retain=VoiceStr;
		json.Timeout=timeout;
		json.type=3;
		var jsonStr = JSON.stringify(json);
		//alert(jsonStr);
		webSocket.send(jsonStr);
	}
}
gwq.OnAfterGWQ_StartSign = function OnAfterGWQ_StartSign(ErrorCode,SignPdfBase64,SignNameBase64,FingerPrintBase64,MixBase64)
{
	alert('1111')
	if(ErrorCode==0)
	{
		alert("����ǩ���ɹ�");
	}
	else if(ErrorCode==-9)
	{
		alert("����ǩ��ȡ��");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

var GWQ_SignNameType = 11;
gwq.DoGWQ_SignName=function DoGWQ_SignName(XmlPath,SignNamePath)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_SignName(XmlPath,SignNamePath,"test");
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=11;
		json.XmlPath=XmlPath;
		json.SignNamePath=SignNamePath;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_SignName(ErrorCode,data)
{

	if(ErrorCode==0)
	{
    gwq.OnAfterGWQ_SignName && gwq.OnAfterGWQ_SignName(data);
     console.log('签字获取成功')
	}
	else if(ErrorCode==-9)
	{
		console.log('取消操作')
	}
	else
	{
		console.log("签字错误",ErrorCode);
	}
}
var GWQ_ReadFingerprintType = 12;
function DoGWQ_ReadFingerprint(TimeOut,FileFullName)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_ReadFingerprint(TimeOut,FileFullName);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=12;
		json.TimeOut=TimeOut;
		json.FileFullName=FileFullName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_ReadFingerprint(ErrorCode)
{
	if(ErrorCode==0)
	{
		alert("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		alert("ȡ��");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}
var GWQ_PDFConfirmType = 13;
function DoGWQ_PDFConfirm(PDFPath,timeout)
{
	if(PDFPath=="") PDFPath="C:\\Program Files (x86)\\GWQOcx\\test.pdf";
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_PDFConfirm(PDFPath,timeout);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=13;
		json.PDFPath=PDFPath;
		json.Timeout=timeout;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}

}

function OnAfertGWQ_PDFConfirm(ErrorCode)
{
	if(ErrorCode==0)
	{
		alert("ȷ������");
	}
	else if(ErrorCode==-9)
	{
		alert("����");
	}
	else if(ErrorCode==-2)
	{
		alert("��ʱ");
	}
	else
	{
		alert("ȷ��ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}
var GWQ_ReadIDType = 4;
function DoGWQ_ReadID(name,sex,nation,birth,addr,id_num)
{
	document.getElementById(name).value="";
	document.getElementById(sex).value="";
	document.getElementById(nation).value="";
	document.getElementById(birth).value="";
	document.getElementById(addr).value="";
	document.getElementById(id_num).value="";
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_ReadID();
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=4;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_ReadID(ErrorCode,JsonData,name,sex,nation,birth,addr,id_num)
{
	if(ErrorCode==0)
	{
		var obj = JSON.parse(JsonData);
		document.getElementById(name).value=obj.name;
		document.getElementById(sex).value=obj.sex;
		document.getElementById(nation).value=obj.nation;
		document.getElementById(birth).value=obj.birth;
		document.getElementById(addr).value=obj.addr;
		document.getElementById(id_num).value=obj.id_num;
	}
	else if(ErrorCode==-9)
	{
		alert("ȡ��");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}
var GetFileBase64Type = 23;
function GetFileBase64(FileFullName)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GetFileBase64(FileFullName);
		alert(ret);
	}
	else{
		var json = {};
		json.type=23;
		json.Filename=FileFullName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}
var Base64ToFileType = 16;
function Base64ToFile(Base64,Filename)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.Base64ToFile(Base64,Filename);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=16;
		json.Base64=Base64;
		json.Filename=Filename;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}
var GWQ_FileDeleteType = 7;
function GWQ_FileDelete(FileName)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_FileDelete(FileName);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=7;
		json.FileName=FileName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}

}
var GWQ_StartFaceType = 5;
function DoGWQ_StartFace(name,sex,nation,birth,addr,id_num)
{
	document.getElementById(name).value="";
	document.getElementById(sex).value="";
	document.getElementById(nation).value="";
	document.getElementById(birth).value="";
	document.getElementById(addr).value="";
	document.getElementById(id_num).value="";
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_StartFace();
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=5;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_StartFace(ErrorCode,JsonData,name,sex,nation,birth,addr,id_num)
{
	if(ErrorCode==0)
	{
		//alert(JsonData);
		var obj = JSON.parse(JsonData);
		document.getElementById(name).value=obj.name;
		document.getElementById(sex).value=obj.sex;
		document.getElementById(nation).value=obj.nation;
		document.getElementById(birth).value=obj.birth;
		document.getElementById(addr).value=obj.addr;
		document.getElementById(id_num).value=obj.id_num;
		if(obj.passFlag==true)
			alert("�ȶ�ͨ��");
		else
			alert("�ȶ�ʧ��");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

var GWQ_GetFrameType = 14;
function GWQ_GetFrame(filename)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_GetFrame(filename);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=14;
		json.FileName=filename;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_GetFrame(ErrorCode)
{
	if(ErrorCode==0)
	{
		alert("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		alert("ȡ��");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

var GWQ_StartVideoRecType = 24;
function DoGWQ_StartVideoRec(FileName)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_StartVideoRec(FileName);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=24;
		json.Filename=FileName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_StartVideoRec(ErrorCode,endTime)
{
	if(ErrorCode==0)
	{
		alert("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		alert("ȡ��");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}
window.gwqConnFail = false;
var GWQ_CancelOperateType = 2;
gwq.GWQ_CancelOperate = function GWQ_CancelOperate()
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_CancelOperate();
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=2;
		var jsonStr = JSON.stringify(json);
		console.log(webSocket)
		webSocket.send(jsonStr);
	}
}
var GWQ_FileUploadType = 6;
function GWQ_FileUpload(FileName)
{
	if(FileName=="") FileName="C:\\Program Files (x86)\\GWQOcx\\ad.jpg";
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_FileUpload(FileName);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=6;
		json.FileName=FileName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}
var GWQ_GetFileListType = 8;
function GWQ_GetFileList()
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_GetFileList();
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=8;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function GWQ_StartEvaluator(TellerName,TellerNo,TellerPhoto)
{
	if(TellerPhoto=="") TellerPhoto="C:\\Program Files (x86)\\GWQOcx\\test.jpg";
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_StartEvaluator(TellerName,TellerNo,TellerPhoto);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=10;
		json.TellerName=TellerName;
		json.TellerNo=TellerNo;
		json.TellerPhoto=TellerPhoto;
		json.Timeout=60;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}
var GWQ_StartEvaluatorType = 10;
function OnAfterGWQ_StartEvaluator(ErrorCode,EvaluatorLevel)
{
	if(ErrorCode==0)
	{
		if(EvaluatorLevel==1)
			alert("�ǳ�����");
		if(EvaluatorLevel==2)
			alert("����");
		if(EvaluatorLevel==3)
			alert("һ��");
		if(EvaluatorLevel==4)
			alert("�ǳ�������");
	}
	else
	{
		alert("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}
var GWQ_SetVolumeType = 19;
var j = parseInt("11");
//�������ܵĵ���
function GWQ_SetVolume(Value)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_SetVolume(Value);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=19;
		json.Value=parseInt(Value);
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}
var GWQ_SetBrightnessType = 20;
function GWQ_SetBrightness(Value)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_SetBrightness(Value);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=20;
		json.Value=parseInt(Value);
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}

}

var sUpLoadImageEx3Type = 25;
function sUpLoadImageEx3(fileName, serverName, usPort, objectName, upLoadData, bWaitUI, bRetUI)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.sUpLoadImageEx3(fileName, serverName, usPort, objectName, upLoadData, bWaitUI, bRetUI);
	}
	else{
		var json = {};
		json.type=25;
		json.fileName=fileName;
		json.serverName=serverName;
		json.objectName=objectName;
		json.upLoadData=upLoadData;
		json.usPort=parseInt(usPort);
		json.bWaitUI=parseInt(bWaitUI);
		json.bRetUI=parseInt(bRetUI);
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAftersUpLoadImageEx3(Respond)
{
	alert(Respond);
}

function OnAfterGWQ_FileUpload(ErrorCode)
{
	OnAfterCall(ErrorCode);
}

function OnAfterGWQ_FileDelete(ErrorCode)
{
	OnAfterCall(ErrorCode);
}

function OnAfterGWQ_GetFileList(FileListBuf)
{
	alert(FileListBuf);
}

function GWQ_StartPreview(type)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_StartPreview(1);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=27;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function GWQ_StopPreview(type)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_StopPreview(type);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=28;
		json.MyType=type;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function GWQ_StartRecord(FileName)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_StartRecord(FileName);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=29;
		json.FileName=FileName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function GWQ_StopRecord()
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_StopRecord();
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=30;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function GWQ_GetFrameWithIndex(Index)
{
	if(myBrowser()=="IE"){
		GWQ.GWQ_SetIsAutoCut(1);//���֤������ͷ�Ƿ��Զ��б�
		var ret=GWQ.DoGWQ_GetFrameWithIndex(Index);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=58;
		json.IsAutoCut=1;
		json.Index=Index;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}


function GWQ_SetMode(mode)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_SetMode(mode);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=59;
		json.mode=mode;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}


function GWQ_SetIP(IP)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_SetIP(IP);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=72;
		json.IP=IP;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}


function OnAfterGWQ_StartFormInfo(ErrorCode,info)
{
	if(ErrorCode==0)
	{
		alert(info);
	}
	else
	{
		OnAfterCall(ErrorCode);
	}
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


      if (myBrowser() != "IE") {
        window.webSocket = new WebSocket('ws://localhost:1919');

        window.webSocket.onerror = function (event) {
          // alert("连接错误");
          // onError(event)
        };

        window.webSocket.onopen = function (event) {
          //alert("open"+event.data);
          console.log(event);

        };

        window.webSocket.onclose = function(event) {
          // alert("服务不存在或者被关闭");
          //onClose(event);
        };

        window.webSocket.onmessage = function (event) {
       
						if (JSON.parse(event.data).ret < 0) {
              			Message({
                      showClose: true,
                      message: "请正确连接设备或设备驱动未启动，请检查",
                      type: "error"
                    });
										 window.gwqConnFail=true;
										
            }
			onMessage(event)
					 console.log(event);

        };


}
gwq.GWQ_OpenURL = function GWQ_OpenURL(url) {

	// alert(url);

	if (myBrowser() == "IE") {
		var ret = GWQ.GWQ_OpenURL(url);
		OnAfterCall(ret);
	}
	else {
		var json = {};
		json.type = 90;
		json.URL = url;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

gwq.DoGWQ_StartFormInfo = function DoGWQ_StartFormInfo(Info,TimeOut,ShowInfo)
{
	if(myBrowser()=="IE"){
		GWQ.GWQ_SetShowInfo(ShowInfo);
		var ret=GWQ.DoGWQ_StartFormInfo(Info,TimeOut);
		OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=22;
		json.Info=Info;
		json.Timeout=TimeOut;
		json.ShowInfo=ShowInfo;//"��ʾ����������";
		json.VoiceType=-1;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

function OnAfterGWQ_UpdateFile(ErrorCode)
{
	if(ErrorCode==0){
		alert("�����ɹ�");
	}
	else
	{
		OnAfterCall(ErrorCode);
	}
}
var GWQ_UpdateExType=          -11
function GWQ_UpdateEx(FileName)
{
	alert(FileName);
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_UpdateFile(FileName,0);
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=GWQ_UpdateExType;
		json.FileName=FileName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}


 function onMessage(event) {
      var ret = event.data;
      var obj = JSON.parse(ret);
      //alert(obj.type);
      if (obj.type == GWQ_ReadIDType) {
        //身份证
        if (obj.ret == 0) {
          var json = {};
          json.type = 13;
          json.name = obj.name;
          json.sex = obj.sex;
          json.nation = obj.nation;
          json.addr = obj.addr;
          json.birth = obj.birth;
          json.id_num = obj.id_num;
          json.base64_ID = obj.base64_ID;
          json.validityTime = obj.validityTime;
          json.depart = obj.depart;
          json.FrontImgBase64 = obj.FrontImgBase64;
          json.BackImgBase64 = obj.BackImgBase64;
          var jsonStr = JSON.stringify(json);
          OnAfterGWQ_ReadID(
            obj.ret,
            jsonStr,
            "name",
            "sex",
            "nation",
            "birth",
            "addr",
            "id_num"
          );
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_StartFaceType) {
        //人脸识别
        if (obj.ret == 0) {
          var json = {};
          json.type = 13;
          json.name = obj.name;
          json.sex = obj.sex;
          json.nation = obj.nation;
          json.addr = obj.addr;
          json.birth = obj.birth;
          json.id_num = obj.id_num;
          json.base64_ID = obj.base64_ID;
          json.validityTime = obj.validityTime;
          json.depart = obj.depart;
          json.passFlag = obj.passFlag;
          json.FrontImgBase64 = obj.FrontImgBase64;
          json.BackImgBase64 = obj.BackImgBase64;
          var jsonStr = JSON.stringify(json);
          OnAfterGWQ_StartFace(
            obj.ret,
            jsonStr,
            "name",
            "sex",
            "nation",
            "birth",
            "addr",
            "id_num"
          );
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_ReadFingerprintType) {
        //指纹采集
        if (obj.ret == 0) {
          OnAfterGWQ_ReadFingerprint(obj.ret);
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_StartSignType) {
        //电子签名
        if (obj.ret == 0) {
          OnAfterGWQ_StartSign(
            obj.ret,
            obj.SignPdfBase64,
            obj.SignNameBase64,
            obj.FingerPrintBase64,
            obj.XML
          );
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_SignNameType) {
        //启动签名版
        if (obj.ret == 0) {
          OnAfterGWQ_SignName(obj.ret, obj);
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_PDFConfirmType) {
        //文档确认
        if (obj.ret == 0) {
          OnAfertGWQ_PDFConfirm(obj.ret);
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_FileUploadType) {
        //文件上传
        OnAfterGWQ_FileUpload(obj.ret);
      }
      if (obj.type == GWQ_FileDeleteType) {
        //文件删除
        OnAfterGWQ_FileDelete(obj.ret);
      }
      if (obj.type == GWQ_GetFileListType) {
        //文件列表
        if (obj.ret == 0) {
          OnAfterGWQ_GetFileList(obj.FileList);
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_GetFrameType) {
        //启动拍照
        if (obj.ret == 0) {
          OnAfterGWQ_GetFrame(obj.ret);
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == GWQ_StartVideoRecType) {
        //录制视频
        if (obj.ret == 0) {
          OnAfterGWQ_StartVideoRec(obj.ret, obj.endTime);
        } else {
          OnAfterCall(obj.ret);
        }
      }
      if (obj.type == sUpLoadImageEx3Type) {
        //http上传
        OnAftersUpLoadImageEx3(obj.Respond);
      }
      if (obj.type == GWQ_StartEvaluatorType) {
        //评价
        if (obj.ret == 0) {
          OnAfterGWQ_StartEvaluator(obj.ret, obj.EvaluatorLevel);
        } else {
          OnAfterCall(obj.ret);
        }
      }

      if (obj.type == GWQ_GetPreviewDataCallbackType) {
        //视频预览
        document.getElementById("photo").src =
          "data:image/jpeg;base64," + obj.data;
      }
      if (obj.type == GWQ_GetPreviewDataType) {
        //
        OnAfterCall(obj.ret);
      }
      if (obj.type == GWQ_StopPreviewType) {
        //
        OnAfterCall(obj.ret);
      }
      if (obj.type == GWQ_StartRecordType) {
        //
        OnAfterCall(obj.ret);
      }
      if (obj.type == GWQ_StopRecordType) {
        //
        OnAfterCall(obj.ret);
      }
      if (obj.type == GWQ_FPCompareType) {
        OnAfterCall(obj.ret);
      }
      if (obj.type == GWQ_GetFrameWithIndexType) {
        if (0 == obj.ret) {
          var name = document.getElementById("GWQ_GetFrameFileName").value;
          Base64ToFile(obj.FrameBase64, name);
        }
        OnAfterGWQ_GetFrame(obj.ret);
      }
      if (obj.type == GWQ_GetVerType) {
        //获取版本
        alert(obj.version);
      }
      if (obj.type == GWQ_ImageAutoCutTypeType) {
        //自动寻边
        alert(obj.base64);
      }
    }
var GWQ_FPCompareType = 49;
	var GWQ_GetPreviewDataCallbackType = 270;
  var GWQ_GetPreviewDataType = 27;
  function GWQ_StartPreview(type) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_StartPreview(1);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_GetPreviewDataType;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_StopPreviewType = 28;
  function GWQ_StopPreview(type) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_StopPreview(type);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_StopPreviewType;
      json.MyType = type;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_StartRecordType = 29;
  function GWQ_StartRecord(FileName) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_StartRecord(FileName);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_StartRecordType;
      json.FileName = FileName;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_StopRecordType = 30;
  function GWQ_StopRecord() {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_StopRecord();
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_StopRecordType;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_GetFrameWithIndexType = 58;
  function GWQ_GetFrameWithIndex(Index) {
    if (myBrowser() == "IE") {
      GWQ.GWQ_SetIsAutoCut(0); //���֤������ͷ�Ƿ��Զ��б�
      var ret = GWQ.DoGWQ_GetFrameWithIndex(Index);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_GetFrameWithIndexType;
      json.IsAutoCut = 0;
      json.Index = Index;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_SetModeType = 59;
  function GWQ_SetMode(mode) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_SetMode(mode);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_SetModeType;
      json.mode = mode;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_SetIPType = 72;
  function GWQ_SetIP(IP) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_SetIP(IP);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_SetIPType;
      json.IP = IP;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var SetPreviewCameraType = 74;
  function SetPreviewCamera(CameraIndex) {
    if (myBrowser() == "IE") {
      var ret = GWQ.SetPreviewCamera(CameraIndex);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = SetPreviewCameraType;
      json.CameraIndex = CameraIndex;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_SetFingerQualityType = 86;
  function GWQ_SetFingerQuality(FingerQuality) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_SetFingerQuality(FingerQuality);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_SetFingerQualityType;
      json.FingerQuality = parseInt(FingerQuality);
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_GetVerType = 0;
  function GWQ_GetVer() {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_GetVer();
      alert(ret);
    } else {
      var json = {};
      json.type = GWQ_GetVerType;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_SetLineColorType = 106;
  function GWQ_SetLineColor(LineColor) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_SetLineColor(LineColor);
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_SetLineColorType;
      json.LineColor = LineColor;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
  var GWQ_LowResolutionPreviewType = 96;
  function GWQ_LowResolutionPreview() {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_LowResolutionPreview();
      OnAfterCall(ret);
    } else {
      var json = {};
      json.type = GWQ_LowResolutionPreviewType;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }

  var GWQ_GetPreviewFrameType = 97;
  function GWQ_GetPreviewFrame(snap) {
    if (myBrowser() == "IE") {
      var img = GWQ.GWQ_GetPreviewFrame();
      var ret = GWQ.GWQ_ImageAutoCut(img); //�Զ�Ѱ��
      img = ret;
      $("#snap").attr("src", "data:image/jpeg;base64," + img);
      console.log(img);
      var PreviewFilename = "D:\\Preview.jpg";
      Base64ToFile(img, PreviewFilename);
    } else {
      var json = {};
      json.type = GWQ_GetPreviewFrameType;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }

  var GWQ_ImageAutoCutTypeType = 114;
  function GWQ_ImageAutoCut(img) {
    if (myBrowser() == "IE") {
      var ret = GWQ.GWQ_ImageAutoCut(img);
      GWQ.Base64ToFile(ret, "d:\\AutoCut.jpg");
      alert(ret);
    } else {
      var json = {};
      json.type = GWQ_ImageAutoCutTypeType;
      json.image = img;
      var jsonStr = JSON.stringify(json);
      webSocket.send(jsonStr);
    }
  }
export default gwq;

//��ǩ�л��õķ���3

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

function OnAfterCall(ErrorCode)
{
	if(ErrorCode==0)
	{
		console.log("�ɹ�");
	}
	else if(ErrorCode==-1)
	{
		console.log("��������");
	}
	else if (ErrorCode==-2)
	{
		console.log("��ʱ");
	}
	else if(ErrorCode==-3)
	{
		console.log("�豸���Ӵ���");
	}
	else if(ErrorCode==-4)
	{
		console.log("��������ʧ��");
	}
	else if(ErrorCode==-5)
	{
		console.log("��ȡ����ʧ��");
	}
	else if(ErrorCode==-6)
	{
		console.log("�ļ�����ʧ��");
	}
	else if(ErrorCode==-7)
	{
		console.log("�豸���ش�����Ϣ");
	}
	else if(ErrorCode==-9)
	{
		console.log("ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}
var SignPDFCount=0;
function DoGWQ_StartSign(PDFPath,XmlPath,mylocation,VoiceStr,timeout)
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
		//console.log(jsonStr);
		webSocket.send(jsonStr);
	}
}
function OnAfterGWQ_StartSign(ErrorCode,SignPdfBase64,SignNameBase64,FingerPrintBase64,MixBase64)
{
	var data = {
		imgData: {
			SignPdfBase64: SignPdfBase64,
			SignNameBase64: SignNameBase64,
		},
		// billId: localStorage.getItem('billId')
	};
	console.log(data);
	sendToBackEnd(data)
	if(ErrorCode==0)
	{
		console.log("����ǩ���ɹ�");
	}
	else if(ErrorCode==-9)
	{
		console.log("����ǩ��ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}


function DoGWQ_SignName(XmlPath,SignNamePath)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.DoGWQ_SignName(XmlPath,SignNamePath,"Ԥ���ֶ�");
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

function OnAfterGWQ_SignName(ErrorCode)
{
	if(ErrorCode==0)
	{
		console.log("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		console.log("ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

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
		console.log("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		console.log("ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

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
		console.log("ȷ������");
	}
	else if(ErrorCode==-9)
	{
		console.log("����");
	}
	else if(ErrorCode==-2)
	{
		console.log("��ʱ");
	}
	else
	{
		console.log("ȷ��ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

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
		console.log("ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

function GetFileBase64(FileFullName)
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GetFileBase64(FileFullName);
		console.log(ret);
	}
	else{
		var json = {};
		json.type=23;
		json.Filename=FileFullName;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

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
		//console.log(JsonData);
		var obj = JSON.parse(JsonData);
		document.getElementById(name).value=obj.name;
		document.getElementById(sex).value=obj.sex;
		document.getElementById(nation).value=obj.nation;
		document.getElementById(birth).value=obj.birth;
		document.getElementById(addr).value=obj.addr;
		document.getElementById(id_num).value=obj.id_num;
		if (obj.passFlag == true) {
			console.log("�ȶ�ͨ��");
		}
		else {
			console.log("�ȶ�ʧ��");
		}
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}


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
		console.log("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		console.log("ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}


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
		console.log("�ɹ�");
	}
	else if(ErrorCode==-9)
	{
		console.log("ȡ��");
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

function GWQ_CancelOperate()
{
	if(myBrowser()=="IE"){
		var ret=GWQ.GWQ_CancelOperate();
		//OnAfterCall(ret);
	}
	else{
		var json = {};
		json.type=2;
		var jsonStr = JSON.stringify(json);
		webSocket.send(jsonStr);
	}
}

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

function OnAfterGWQ_StartEvaluator(ErrorCode,EvaluatorLevel)
{
	if(ErrorCode==0)
	{
		if(EvaluatorLevel==1)
			console.log("�ǳ�����");
		if(EvaluatorLevel==2)
			console.log("����");
		if(EvaluatorLevel==3)
			console.log("һ��");
		if(EvaluatorLevel==4)
			console.log("�ǳ�������");			
	}
	else
	{
		console.log("ʧ�ܣ����ش�����Ϊ"+ErrorCode);
	}
}

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
	console.log(Respond);
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
	console.log(FileListBuf);
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
		console.log(info);
	}
	else
	{
		OnAfterCall(ErrorCode);
	}	
}

function DoGWQ_StartFormInfo(Info,TimeOut,ShowInfo)
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
		console.log("�����ɹ�");
	}
	else
	{
		OnAfterCall(ErrorCode);
	}
}
var GWQ_UpdateExType=          -11
function GWQ_UpdateEx(FileName)
{
	console.log(FileName);
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


// 发送签名文件（base64）给后台
function sendToBackEnd(base64OBJ) {
	var params = {
		busicode: 'SignPicUpload',
		token: sessionStorage.getItem('token'),
		sysType: '002',
		data: base64OBJ,
	}
	
	var url = "http://" + window.location.host + "/css2/interface.api"
	// var url = "http://192.168.199.14:8012/css2/interface.api"
	console.log(url);
	XMLHttpRequestSend("post", url, params);
}



/**
       * 原生http请求
       * @param type get或者post
       * @param url 后端接口地址
       * @param params 参数
       * @constructor
       */
      function XMLHttpRequestSend(type, url, params) {
        // （1） 获取 XMLHttpRequest对象
        xmlHttp = new XMLHttpRequest();
        //  (2) 连接服务器
        xmlHttp.open(type, url);
        // 设置数据类型
        xmlHttp.setRequestHeader("Content-type", "application/json");
        // xmlHttp.setRequestHeader('Accept', '*/*');
        // （3） 发送数据
        xmlHttp.send(JSON.stringify(params)); // 请求体数据
        // （4） 回调函数  success
        xmlHttp.onload = function(e) {
          console.log("请求成功");
          console.log(xmlHttp.status, "请求的URL的相应状态");
          console.log(xmlHttp.readyState, "请求的结果，一般都是4");
					if (xmlHttp.status === 200) {
						window.parent['getSignUrlHTML'](JSON.parse(e.target.response).data)
						// localStorage.setItem('signURL', e.target.response.data)
          } else {
            console.log(e)
            // window.history.back(-1);
          }
        };
        xmlHttp.onerror = function(e) {
          console.log("请求失败");
        };
			}
			

			// export default gwq;
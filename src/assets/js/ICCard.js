let ICCard = {
  online: false
};
// 要获取数据的字段
var getDataName = "";
var dataOBJ = {
  bankAccount: "",
  invoiceAccount: "",

  // 判断ic是否已插好（大于0插好）
  code: -1,
};

ICCard.getData = function(name) {
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
  

webSocket = new WebSocket("ws://localhost:1818");

webSocket.onerror = function(event) {
  onError(event);
  ICCard.online = false
};

webSocket.onopen = function(event) {
  onOpen(event);
  ICCard.online = true
};

webSocket.onclose = function(event) {
  onClose(event);
  ICCard.online = false
};

webSocket.onmessage = function(event) {
  onMessage(event);
};
}


window.onbeforeunload = function() {};


function onMessage(event) {
  // alert(event.data);
  console.log(event.data);

  // IccGetInfo
  if (event.data.indexOf("BeginCT_GetIccInfo") > -1) {
    var resData = JSON.parse(
      event.data.split("BeginCT_GetIccInfo")[1].split("EndCT_GetIccInfo")[0]
    );
    
    var ICLength = Number(resData.szInfo.slice(1, 4));
    console.log(ICLength);
    var ICCode = resData.szInfo.slice(4, ICLength + 4);
    console.log(ICCode);
    for (const key in dataOBJ) {
      if (key == getDataName) {
        dataOBJ[key] = ICCode;
      }
    }
  }else if (event.data.indexOf("BeginCT_DetectCard") > -1) {// IccCardPresent
    dataOBJ.code = Number(event.data.split("BeginCT_DetectCard")[1].split("EndCT_DetectCard")[0])
    
  }

  console.log(dataOBJ);
}
function onError(event) {
  // alert(6666666);
  // alert(event.data);
}
function onClose(event) {}
function onOpen(event) {}
function start(el) {
  webSocket.send(el);
}

function ConverErrCode(msg) {
  var ErrCode;

  if (msg == "1") {
    ErrCode = "�ǽӴ���λ�Ѿ��ϵ�";
  } else if (msg == "2") {
    ErrCode = "�Ӵ���λ�Ѿ��ϵ�";
  } else if (msg == "3") {
    ErrCode = "�Ӵ���λδ�ϵ�";
  } else if (msg == "-1") {
    ErrCode = "δ֪����";
  } else if (msg == "-2") {
    ErrCode = "�򿪴��ڣ�U�ڣ�ʧ��";
  } else if (msg == "-17") {
    ErrCode = "��ƬΪ2.0��Ƭ��û��Ȧ����־���";
  } else if (msg == "-105") {
    ErrCode = "δ֪����";
  } else if (msg == "-300") {
    ErrCode = "�򿪴��ڣ�U�ڣ�ʧ��";
  } else if (msg == "-201") {
    ErrCode = "ѡ��Ӧ�û���ʧ��";
  } else if (msg == "-202") {
    ErrCode = "ѡ��Ӧ��ʧ��";
  } else if (msg == "-203") {
    ErrCode = "Ӧ�ó�ʼ��ʧ��";
  } else if (msg == "-204") {
    ErrCode = "��ȡ ARQC ʧ��";
  } else if (msg == "-205") {
    ErrCode = "�ⲿ��֤ʧ��";
  } else if (msg == "-206") {
    ErrCode = "ִ�нű�����";
  } else if (msg == "-207") {
    ErrCode = "û����־���";
  } else if (msg == "-208") {
    ErrCode = "��Ƭ������";
  } else if (msg == "-209") {
    ErrCode = "��Ƭ��������";
  } else if (msg == "-1001") {
    ErrCode = "��֧�ֽӴ��û�";
  } else if (msg == "-1002") {
    ErrCode = "�Ӵ��û���λδ�嵽λ";
  } else if (msg == "-1004") {
    ErrCode = "�Ӵ��û���δ�ϵ�";
  } else if (msg == "-1005") {
    ErrCode = "�Ӵ��û����ϵ�ʧ��";
  } else if (msg == "1006") {
    ErrCode = "�Ӵ��û��������޻�Ӧ";
  } else if (msg == "1007") {
    ErrCode = "�Ӵ��û������ݳ��ִ���";
  } else if (msg == "-2001") {
    ErrCode = "��֧�� PSAM ��";
  } else if (msg == "-2004") {
    ErrCode = "PSAM��δ�ϵ�";
  } else if (msg == "-2005") {
    ErrCode = "PSAM ���ϵ�ʧ��";
  } else if (msg == "-2006") {
    ErrCode = "����PSAM�������޻�Ӧ";
  } else if (msg == "-2007") {
    ErrCode = "����PSAM�����ݳ��ִ���";
  } else if (msg == "-2009") {
    // ԭ-1
    ErrCode = "��ȡ������ϸʧ��";
  } else if (msg == "-3001") {
    ErrCode = "��֧�ַǽӴ��û���";
  } else if (msg == "-3004") {
    ErrCode = "�ǽӴ��û���δ����";
  } else if (msg == "-3005") {
    ErrCode = "�ǽӴ��û�������ʧ��";
  } else if (msg == "-3006") {
    ErrCode = "�ȴ��������Ӧ����ʱ";
  } else if (msg == "-3007") {
    ErrCode = "�����ǽӴ��û������ݳ��ִ���";
  } else if (msg == "-3008") {
    ErrCode = "���ÿ� halt ״̬ʧ��";
  } else if (msg == "-3009") {
    ErrCode = "�ж��ſ��ڸ�Ӧ��";
  } else {
    ErrCode = "δ֪����";
  }

  return ErrCode;
}

function resetWin() {
  document.getElementById("txtRsp").value = "";
}

// �ϵ纯��
function IccPowerON() {
  var buf;
  var nRet;
  var info;
  var Len;
  var nErrCode;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var slottype = document.getElementById("selSlotType").value;

    var msg = 0;
    var info;
    var cAtr = "";

    //IccPboc.CT_SetSlot(slottype);
    start("CT_SetSlot(" + slottype + ")");

    //msg = IccPboc.CT_PowerOn(comport, bpno, cardtype);
    start("CT_PowerOn(" + comport + "," + bpno + "," + cardtype + ")");

    //info=IccPboc.szAtr;
    //Len = IccPboc.nAtrLen;
    //if ( msg == 0 )
    //{
    //	document.getElementById("txtRsp").value += "IC ���ϵ�ɹ�  ����:" + Len + "��Ϣ:" + info + //"\r\n";
    //}
    //else
    //{
    //	nErrCode = ConverErrCode(msg);
    //	info = " IC���ϵ�ʧ�� -- ������Ϣ��" + nErrCode;
    //	window.alert(info);
    //}
  } catch (e) {
    txtRsp.value += " ������Ϣ:" + e + "\r\n";
  }
}

// �µ纯��
function IccPowerOff() {
  var buf;
  var nRet;
  var info;
  var nErrCode;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;

    var msg = 0;
    var info;
    //msg = IccPboc.CT_PowerOff(comport, bpno, cardtype);
    start("CT_PowerOff(" + comport + "," + bpno + "," + cardtype + ")");
    //if ( msg == 0 )
    //{
    //	document.getElementById("txtRsp").value +="IC ���µ�ɹ� \r\n";
    //}
    //else
    //{
    //	nErrCode = ConverErrCode(msg);
    //	info = " IC���µ�ʧ��-- ��������Ϣ" + nErrCode;
    //	window.alert(info);
    //}
  } catch (e) {
    document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
}

// ���������
function IccSendCmd() {
  var buf;
  var nRet;
  var info;
  var Len;
  var nErrCode;
  var msg = -1;
  var info;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;

    //msg = IccPboc.CT_SendCommand(comport, bpno, cardtype, 22, "00A4040005A00000033300");
    start(
      "CT_SendCommand(" +
        comport +
        "," +
        bpno +
        "," +
        cardtype +
        ",22,00A4040005A00000033300)"
    );
    //if ( msg == 0 )
    //{
    //	Len = IccPboc.nCmdLen ;
    //	info = IccPboc.szCmdRecv;
    //	document.getElementById("txtRsp").value += "IC ��������ɹ� ���ȣ�" + Len + "���ݣ�" + info + "\r\n";
    //}
    //else
    //{
    //	nErrCode = ConverErrCode(msg);
    //	info = " IC ��������ʧ��-- ������Ϣ��" + nErrCode;
    //	window.alert(info);
    //}
  } catch (e) {
    document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
}

// ����λ���
ICCard.IccCardPresent = function() {
  var buf;
  var nRet;
  var info;
  var Len;
  var nErrCode;
  var msg;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var slottype = document.getElementById("selSlotType").value;
    var newfunc = document.getElementById("selNewFunc").value;

    //IccPboc.CT_SetSlot(slottype);
    start("CT_SetSlot(" + slottype + ")");
    if (newfunc == "0") {
      //msg = IccPboc.CT_DetectCard(comport, bpno, cardtype);
      start("CT_DetectCard(" + comport + "," + bpno + "," + cardtype + ")");
    } else {
      //msg = IccPboc.CT_CardPresent(comport, bpno, cardtype);
      start("CT_CardPresent(" + comport + "," + bpno + "," + cardtype + ")");
    }

    // document.getElementById("txtRsp").value += "IC����λ������" + "\r\n";
    //nErrCode = ConverErrCode(msg);
    //info = " IC����λ���" + nErrCode;
    //window.alert(info);
  } catch (e) {
    // document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
};
//��ȡIC��Ƭ��Ϣ����

ICCard.IccGetInfo = function(name) {
  getDataName = name;
  var szTagList = "ABCDEFGHIJKL";
  var Len;
  var msg;
  var info;
  var nErrCode;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var slottype = document.getElementById("selSlotType").value;
    var newfunc = document.getElementById("selNewFunc").value;
    var defaultaid = document.getElementById("DefaultAid").value;

    //IccPboc.CT_SetSlot(slottype);
    start("CT_SetSlot(" + slottype + ")");
    if (newfunc == "0") {
      //msg = IccPboc.CT_GetIccInfo( comport, bpno, cardtype, defaultaid, szTagList );
      start(
        "CT_GetIccInfo(" +
          comport +
          "," +
          bpno +
          "," +
          cardtype +
          "," +
          defaultaid +
          "," +
          szTagList +
          ")"
      );
    } else {
      //msg = IccPboc.CT_getIcInfo( comport, bpno, cardtype, szTagList );
      start(
        "CT_getIcInfo(" +
          comport +
          "," +
          bpno +
          "," +
          cardtype +
          "," +
          szTagList +
          ")"
      );
    }

    //if ( msg == 0 )
    //{
    //	info = IccPboc.szInfo;
    //	Len = IccPboc.nInfoLen;
    //	document.getElementById("txtRsp").value += "��ȡ��Ƭ��Ϣ�ɹ�  ���ȣ�" + Len + "��Ϣ" + info + "\r\n";
    //}
    //else
    //{
    //	nErrCode = ConverErrCode(msg);
    //	info = "��ȡ��Ƭ��Ϣʧ�� -- ������Ϣ��" + nErrCode;
    //	window.alert(info);
    //}
  } catch (e) {
    // document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
};



// ����ARQC����
function IccGenArqc() {
  try {
    var msg;
    var info;
    var ascArqc = "";
    var nErrCode;

    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var slottype = document.getElementById("selSlotType").value;
    var newfunc = document.getElementById("selNewFunc").value;
    var defaultaid = document.getElementById("DefaultAid").value;
    var txdata = document.getElementById("TxSendData").value;

    if (selNewFunc.value == "0") {
      //msg = IccPboc.CT_GenerateARQC( comport, bpno, cardtype, defaultaid, txdata );
      start(
        "CT_GenerateARQC(" +
          comport +
          "," +
          bpno +
          "," +
          cardtype +
          "," +
          defaultaid +
          "," +
          txdata +
          ")"
      );
    } else {
      //msg = IccPboc.CT_genARQC( comport, bpno, cardtype, txdata );
      start(
        "CT_getIcInfo(" +
          comport +
          "," +
          bpno +
          "," +
          cardtype +
          "," +
          txdata +
          ")"
      );
    }

    //if ( msg == 0 )
    //{
    //	info = IccPboc.szArqc ;
    //	Len = IccPboc.nArqcLen;
    //	document.getElementById("txtRsp").value += "GenArqc  �ɹ�  ����:" + Len + "��Ϣ" + info + "\r\n";
    //}
    //else
    //{
    //	nErrCode = ConverErrCode(msg);
    //	info = "����ARQC ʧ�� -- ������Ϣ��" + nErrCode;
    //	window.alert(info);
    //}
  } catch (e) {
    document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
}

//�����ű�
function IccExScript() {
  var msg;
  var info;
  var nErrCode;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var newfunc = document.getElementById("selNewFunc").value;
    var txdata = document.getElementById("TxSendData").value;
    var scriptdata = document.getElementById("TxSendData").value;

    if (selNewFunc.value == "0") {
      //msg = IccPboc.CT_CloseTransAction( comport, bpno, cardtype, txdata, scriptdata );
      start(
        "CT_CloseTransAction(" +
          comport +
          "," +
          bpno +
          "," +
          cardtype +
          "," +
          txdata +
          "," +
          scriptdata +
          ")"
      );
    } else {
      //msg = IccPboc.CT_CtlScriptData( comport, bpno, cardtype, txdata, scriptdata );
      start(
        "CT_CtlScriptData(" +
          comport +
          "," +
          bpno +
          "," +
          cardtype +
          "," +
          txdata +
          "," +
          scriptdata +
          ")"
      );
    }

    //if(msg != 0)
    //{
    //	info = "�ű�ִ��ʧ�� -- ������Ϣ��" + IccPboc.szScriptResult;
    //	window.alert(info);
    //}
    //else
    //{
    //	document.getElementById("txtRsp").value += "�ű�ִ�гɹ� TC���ȣ�" + IccPboc.nTc + "��Ϣ" + IccPboc.szTc + "\r\n";
    //	document.getElementById("txtRsp").value += "�ű����:" + IccPboc.szScriptResult + "\r\n";
    //}
  } catch (e) {
    document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
}

function IccGetDetail() {
  var msg;
  var info;
  var Len;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var slottype = document.getElementById("selSlotType").value;
    var newfunc = document.getElementById("selNewFunc").value;
    var defaultaid = document.getElementById("DefaultAid").value;

    //IccPboc.CT_SetSlot(slottype);
    start("CT_SetSlot(" + slottype + ")");
    //msg = IccPboc.CT_GetTranDetail( comport, bpno, cardtype );
    start("CT_GetTranDetail(" + comport + "," + bpno + "," + cardtype + ")");
    //if ( msg == 0 )
    //{
    //	info = IccPboc.szDetail ;
    //	Len = IccPboc.nDetailLen;
    //	document.getElementById("txtRsp").value += "��ȡ������־�ɹ� ���ȣ�" + Len + "��Ϣ" + info + //"\r\n";
    //}
    //else
    //{
    //	info = "��ȡ������־ ʧ��" + msg;
    //	window.alert(info);
    //}
  } catch (e) {
    document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
}
//Ȧ����ϸ

function IccGetCreditLog() {
  var msg;
  var info;
  var Len;

  try {
    var comport = document.getElementById("selComPort").value;
    var bpno = document.getElementById("selBpNo").value;
    var cardtype = document.getElementById("selCardType").value;
    var slottype = document.getElementById("selSlotType").value;
    var newfunc = document.getElementById("selNewFunc").value;
    var defaultaid = document.getElementById("DefaultAid").value;

    IccPboc.CT_SetSlot(slottype);
    //msg = IccPboc.CT_GetCreditLoadLog( comport, bpno, cardtype, defaultaid );
    start(
      "CT_GetCreditLoadLog(" +
        comport +
        "," +
        bpno +
        "," +
        cardtype +
        "," +
        defaultaid +
        ")"
    );
    //if ( msg == 0 )
    //{
    //	info = IccPboc.szCreditLog ;
    //	Len = IccPboc.nCreditLen;
    //	document.getElementById("txtRsp").value += "��ȡȦ����־�ɹ� ���ȣ�" + Len + "��Ϣ" + info + "\r\n";
    //}
    //else
    //{
    //	info = " ��ȡȦ����־ ʧ��" + msg;
    //	window.alert(info);
    //}
  } catch (e) {
    document.getElementById("txtRsp").value += " ������Ϣ:" + e + "\r\n";
  }
}

export default ICCard;

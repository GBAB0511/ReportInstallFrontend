import { Message } from "element-ui";
import Vue from 'vue'
let vm = new Vue()
let pos = {}
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
// pos机服务
pos.JwListenerConnect = false  // 本机Listener服务
pos.isConnect = false  // 服务开启、是否检测到pos机
pos.posMessage = "" //pos回调信息
pos.connectError = false //
pos.createWebsocket = function createWebsocket() {
	if (myBrowser() != "IE") {
		var echo_websocket;

		var wsUri = "ws://localhost:30035";
		window.echo_websocket = new WebSocket(wsUri);

		window.echo_websocket.onopen = function (evt) {
			pos.JwListenerConnect = true
			pos.connectError = false
			// pos.isConnect = true
			console.log("pos-onpen-------------------------"+evt);
			// writeToScreen("Connected !");
			//doSend(textID.value);
		};

		window.echo_websocket.onmessage = function (evt) {
			console.log("pos-onmessage-------------------------"+evt);
			console.log(JSON.parse(evt.data));
			pos.isConnect = true
			pos.posMessage = JSON.parse(evt.data)
			if (pos.posMessage.rspmes == '消费成功') {
				console.log(pos.posMessage.rspmes);
                pos.posCharge()
			}else{
        if (pos.posMessage.rspmes !='POS/PINPAD准备就绪') {
          Message({
            showClose: true,
            message: pos.posMessage.rspmes,
            type: "error"
          });
          pos.posFailCharge()
        }
			}
			// writeToScreen("Received message: " + evt.data);

			//echo_websocket.close();

		};

		window.echo_websocket.onerror = function (evt) {

			// writeToScreen('<span style="color: red;">ERROR:</span> '

			// + evt.data);
			pos.JwListenerConnect = false
			pos.connectError = true
            // pos.isConnect = false
			console.log("pos-onerror-------------------------"+evt);
            // console.log(JSON.parse(evt.data));
            // pos.testJS()
			window.echo_websocket.close();
		};

		window.echo_websocket.onclose = function (evt) {
			// pos.connectError = false
			pos.JwListenerConnect = false
			console.log("pos-onclose-------------------------"+evt);
            // console.log(JSON.parse(evt.data));
			// pos.isConnect = false
			// writeToScreen('<span style="color: red;">CLOSE:</span> ');

		};


	}
}

export default pos;

		var socket;
		if(!window.WebSocket){
			window.WebSocket = window.MozWebSocket;
		}
		if(window.WebSocket){
			socket = new WebSocket("ws://47.101.190.24:8889/websocket");
			socket.onmessage = function(event){
//				sendCommand(formation);
				var msg=event.data;
				var command=JSON.parse(msg);
//				console.log(msg);
//				changeTheme(parseInt(msg));
				if(command!==null){
					if(command.code==0){
						if(command.value=="Theme1"){
							changeTheme(0);
						}else if(command.value=="Theme2"){
							changeTheme(1);
						}else if(command.value=="Theme3"){
							changeTheme(2);
						}else if(command.value=="Theme4"){
							changeTheme(3);
						}else if(command.value=="layout1"){
							formation=0;
							loadDisplayZone();
							sendCommand(formation);
						}else if(command.value=="layout2"){
							formation=1;
							loadDisplayZone();
							sendCommand(formation);
						}else if(command.value=="layout3"){
							formation=2;
							loadDisplayZone();
							sendCommand(formation);
						}else if(command.value=="layout4"){
							formation=3;
							loadDisplayZone();
							sendCommand(formation);
						}
					}else if(command.code==1){
						
					}else if(command.code==2){
						var requestCom=new Object();
						requestCom.dataType=command.dataType;
						requestCom.arg=command.chartDatas;
						requestCom.amount=command.dataNum;
						requestCommandList[command.chartId]=requestCom;
						chartTypeList[command.chartId]=command.chartType;
						console.log(requestCommandList);
						request("POST","http://47.101.190.24:8989/findZXData",JSON.stringify(requestCom),'JSON',b,b,true,command.chartId);
						
						setTimeout(function(){
							optionArray[command.chartId]=assembleChart(command.chartType,dataArray[command.chartId]);
							chartArray[command.chartId] = echarts.init(document.getElementsByClassName("blocks")[command.chartId],'dark');
							chartArray[command.chartId].clear();
							chartArray[command.chartId].setOption(optionArray[command.chartId]);
						},2000)
						
					}else if(command.code==3){
						sendCommand(formation);
						console.log("收到获得排版请求")
					}else if(command.code==4){
						console.log(command.value);
					}
					
				}
			};

			socket.onopen = function(event){
			};

			socket.onclose = function(event){
			};
		}else{
			alert("您的浏览器不支持WebSocket");
		}


		function sendCommand(message){
			if(!window.WebSocket){
				return;
			}
			if(socket.readyState == WebSocket.OPEN){
				socket.send(message);
			}else{
				alert("WebSocket连接没有建立成功！！");
			}
		}
		
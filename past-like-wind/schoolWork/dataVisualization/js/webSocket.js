		var socket;
		if(!window.WebSocket){
			window.WebSocket = window.MozWebSocket;
		}
		if(window.WebSocket){
			socket = new WebSocket("ws://47.101.190.24:8889/websocket");
			socket.onmessage = function(event){
			var msg=event.data;
				if(parseInt(msg)<10)/*规定从大屏传来小于10的值为formation的指代*/{
					formation=parseInt(msg);
					console.log(formation);
					formatThumbnails();
				}
			};

			socket.onopen = function(event){
				requestFormation();
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
		function requestFormation(){
			var command=new Object();
			command.code=3;
			sendCommand(JSON.stringify(command))
		}
		

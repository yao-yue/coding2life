var WINDOW_WIDTH = document.body.offsetWidth;
	var WINDOW_HEIGHT = document.body.offsetHeight;
	var num = 500;
	var starss = [];
	var mouseX = WINDOW_WIDTH/2;
	var mouseY = WINDOW_HEIGHT/2;
	var rnd;
//$("canvas").remove();
//	$("body").prepend("<canvas></canvas>");
//		canvas = document.getElementsByTagName("canvas")[0];
		canvas=document.getElementById("a");
//$("body").prepend("<canvas id='c"+themeCount+"'></canvas>");
//		canvas = document.getElementById("c"+themeCount);
//canvas=c;
		canvas.width = WINDOW_WIDTH;
		canvas.height = WINDOW_HEIGHT;

		ctx = canvas.getContext('2d');
		addStar();
		setInterval(render,33);
		liuxing();


	function liuxing(){
		var time = Math.round(Math.random()*3000+33);
		setTimeout(function(){
			rnd = Math.ceil(Math.random()*starss.length)
			liuxing();
		},time)
	}

	function render(){
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
		// 
		for(var i =0; i<num ; i++){
			var star = starss[i];
			if(i == rnd){
				star.vx = -5;
				star.vy = 5;
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(255,255,255,'+star.alpha+')';
				ctx.lineWidth = star.r;
				ctx.moveTo(star.x,star.y);
				ctx.lineTo(star.x+star.vx,star.y+star.vy);
				ctx.stroke();
				ctx.closePath();
			}
			star.alpha += star.ra;
			if(star.alpha<=0){
				star.alpha = 0;
				star.ra = -star.ra;
				star.vx = Math.random()*0.2-0.1;
				star.vy = Math.random()*0.2-0.1;
			}else if(star.alpha>1){
				star.alpha = 1;
				star.ra = -star.ra
			}
			star.x += star.vx;
			if(star.x>=WINDOW_WIDTH){
				star.x = 0;
			}else if(star.x<0){
				star.x = WINDOW_WIDTH;
				star.vx = Math.random()*0.2-0.1;
				star.vy = Math.random()*0.2-0.1;
			}
			star.y += star.vy;
			if(star.y>=WINDOW_HEIGHT){
				star.y = 0;
				star.vy = Math.random()*0.2-0.1;
				star.vx = Math.random()*0.2-0.1;
			}else if(star.y<0){
				star.y = WINDOW_HEIGHT;
			}
			ctx.beginPath();
			var bg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
			bg.addColorStop(0,'rgba(255,255,255,'+star.alpha+')')
			bg.addColorStop(1,'rgba(255,255,255,0)')
			ctx.fillStyle  = bg;
			ctx.arc(star.x,star.y, star.r, 0, Math.PI*2, true);
			ctx.fill();
			ctx.closePath();
		}
	}

	function addStar(){
		for(var i = 0; i<num ; i++){
			var aStar = {
				x:Math.round(Math.random()*WINDOW_WIDTH),
				y:Math.round(Math.random()*WINDOW_HEIGHT),
				r:Math.random()*3,
				ra:Math.random()*0.05,
				alpha:Math.random(),
				vx:Math.random()*0.2-0.1,
				vy:Math.random()*0.2-0.1
			}
			starss.push(aStar);
		}
	}
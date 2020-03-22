			/* -----------------------------------------------------------
			 * 
			 * 出场方式——中心——横向展开——纵向展开——旋转
			 * 
			 * -----------------------------------------------------------
			*/ 
			function showAnimation_CHVR(displayZone,oriRotate,defaultRotate,background){
				var thisWidth=$(displayZone).width();
				var thisHeight=$(displayZone).height();
				var thisLeft=parseInt($(displayZone).css("left"));
				var thisTop=parseInt($(displayZone).css("top"));
				$(displayZone).children().hide();
				$(displayZone).toggleClass(oriRotate);
				$(displayZone).css({
					"height":"2px",
					"width":"0px",
					"top":thisHeight/2+thisTop,
					"left":thisWidth/2+thisLeft,
					"transition": "transform 1s,background 1s"
				});
				setTimeout(function(){
					$(displayZone).animate({
						width:"100vw",
						left:thisLeft
					},1000)
				},1000);
				setTimeout(function(){
					$(displayZone).removeClass(oriRotate).toggleClass(defaultRotate);
				},2000);
				setTimeout(function(){
					$(displayZone).animate({
						height:"100vh",
						top:thisTop,
					},1000);
					$(displayZone).css({
					"background":background
				});
					$(displayZone).children().show();
				},3000);
			}
			
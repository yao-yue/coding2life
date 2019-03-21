$(document).keydown(function(event){
//		if((event.keyCode==17) && (event.altKey)){
//			$("#menuMaskOuter").show();
//		}
		if((event.ctrlKey)&&(event.keyCode==81)){
			$("#menuMaskOuter").show();
		}
	});
	$(document).keyup(function(event){
		if(event.keyCode==81){
			$("#menuMaskOuter").hide();
		}

	});
		$("#mmBlockCenter").on("click","#mmBlockCenterInner",function(){$("#menuMaskOuter").hide();});
	$("#menuMaskInner").on("click","#mmBlockOne",function(){$("#menuMaskOuter").hide();console.log(1); });
	$("#menuMaskInner").on("click","#mmBlockTwo",function(){$("#menuMaskOuter").hide();console.log(2);});
	$("#menuMaskInner").on("click","#mmBlockThree ",function(){$("#menuMaskOuter").hide();console.log(3);});
	$("#menuMaskInner").on("click","#mmBlockFour",function(){$("#menuMaskOuter").hide();console.log(4);});
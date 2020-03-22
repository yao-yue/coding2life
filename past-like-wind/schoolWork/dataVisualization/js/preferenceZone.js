			$("#fillPage").on("click",".dot",function(){
				$(this).removeClass("oriDot").toggleClass("activeDot");
				$(this).siblings(".activeDot").removeClass("activeDot").toggleClass("oriDot");
				$("#fillZoneInner").animate({marginTop:"-"+80*$(this).index()+"vh"},1000)
				
			})
			$("#preferenceZone").on("click","#preferenceButton",function(){
				if($(this).attr("func")=="1"){
					loadDisplayZone();
				}
				var dotIndex=$("#fillPage .activeDot").index();
				if(dotIndex<2){
					$(".dot").eq(dotIndex+1).click();
				}
				if(dotIndex==2){
					$(this).css({"transform":"rotateY(720deg)"});
					$(this).text("Submit");
					$(this).attr("func","1");
				}
				
				$("#progressBar").animate({width:33.3*(dotIndex+1)+"vw"},500);
			})
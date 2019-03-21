var fullscreen=function(){
    elem=document.body;
    if(elem.webkitRequestFullScreen){
        elem.webkitRequestFullScreen();   
    }else if(elem.mozRequestFullScreen){
        elem.mozRequestFullScreen();
    }else if(elem.requestFullScreen){
        elem.requestFullscreen();
    }else{
        //浏览器不支持全屏API或已被禁用
    }
}
var exitFullscreen=function(){
    var ele=document;
    if(ele.webkitCancelFullScreen){
        ele.webkitCancelFullScreen();    
    }else if(ele.mozCancelFullScreen){
        ele.mozCancelFullScreen();
    }else if(ele.cancelFullScreen){
        ele.cancelFullScreen();
    }else if(ele.exitFullscreen){
        ele.exitFullscreen();
    }else{
        //浏览器不支持全屏API或已被禁用
    }
}
$("#fullScreen").on("click","img",function(){
	if($(this).attr("src")=="img/fullScreenOn.png"){
//				$("#realTimeUpdate a").text("Real-Time-Update On");
				$(this).attr("src","img/fullScreenOff.png");
				fullscreen();
			}else if($(this).attr("src")=="img/fullScreenOff.png"){
//				$("#realTimeUpdate a").text("Real-Time-Update Off");
				$(this).attr("src","img/fullScreenOn.png");
				exitFullscreen();
			}
})

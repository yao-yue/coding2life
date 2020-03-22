//$("canvas").remove();
//	$("body").prepend("<canvas></canvas>");
//$("body").prepend("<canvas id='c"+themeCount+"'></canvas>");
		canvas = document.getElementById("a");
var max_particles    = 100;
var particles        = [];
var frequency        = 100;
var init_num         = max_particles;
var max_time         = frequency*max_particles;
var time_to_recreate = false;

// Enable repopolate
setTimeout(function(){
  time_to_recreate = true;
}.bind(this), max_time)

// Popolate particles
popolate(max_particles);

var tela = canvas;
    canvas.width = $(window).width();
    canvas.height = $(window).height();
//  $("body").append(tela);

//var ctx = tela.getContext('2d');
ctx = canvas.getContext('2d');



/*
 * Function to clear layer ctx
 * @num:number number of particles
 */
function popolate(num){
  for (var i = 0; i < num; i++) {
   setTimeout(
     function(x){
       return function(){
         // Add particle
         particles.push(new Particle(ctx))
       };
     }(i)
     ,frequency*i);
  }
  return particles.length
 }

function clear(){
  // ctx.globalAlpha=0.04;
  ctx.fillStyle='#111111';
  canvas.width = $(window).width();
    canvas.height = $(window).height();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ctx.globalAlpha=1;
}
//$(window).resize(clear);

function connection(){
  var old_element = null
  $.each(particles, function(i, element){
    if(i>0){
      var box1 = old_element.getCoordinates()
      var box2 = element.getCoordinates()
      ctx.beginPath();
      ctx.moveTo(box1.x,box1.y);
      ctx.lineTo(box2.x,box2.y);
      ctx.lineWidth = 0.45;
      ctx.strokeStyle="#3f47ff";
      ctx.stroke();
      ctx.closePath();
    }
    old_element = element
  })
}

/*
 * Function to update particles in ctx
 */
function update(){
  clear();
  connection()
  particles = particles.filter(function(p) { return p.move() })
  // Recreate particles
  if(time_to_recreate){
    if(particles.length < init_num){ popolate(1);}
  }
//if(ani!=null){
//	window.cancelAnimationFrame(ani);
//}

ani=requestAnimationFrame(update.bind(this))
//requestAnimationFrame(update.bind(this))
}

update()
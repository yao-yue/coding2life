			class Particle{
  constructor(ctx, options){
    var colors = ["#feea00","#a9df85","#5dc0ad", "#ff9a00","#fa3f20"]
    var types  = ["full","fill","empty"]
    this.random = Math.random()
    this.ctx = ctx;
    this.progress = 0;

    this.x = ($(window).width()/2)  + (Math.random()*200 - Math.random()*200)
    this.y = ($(window).height()/2) + (Math.random()*200 - Math.random()*200)
    this.w = $(window).width()
    this.h = $(window).height()
    this.radius = 1 + (8*this.random)
    this.type  = types[this.randomIntFromInterval(0,types.length-1)];
    this.color = colors[this.randomIntFromInterval(0,colors.length-1)];
    this.a = 0
    this.s = (this.radius + (Math.random() * 1))/10;
    //this.s = 12 //Math.random() * 1;
  }

  getCoordinates(){
    return {
      x: this.x,
      y: this.y
    }
  }

  randomIntFromInterval(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  render(){
    // Create arc
    var lineWidth = 0.2 + (2.8*this.random);
    var color = this.color;
    switch(this.type){
      case "full":
        this.createArcFill(this.radius, color)
        this.createArcEmpty(this.radius+lineWidth, lineWidth/2, color)
      break;
      case "fill":
        this.createArcFill(this.radius, color)
      break;
      case "empty":
        this.createArcEmpty(this.radius, lineWidth, color)
      break;
    }
  }

  createArcFill(radius, color){
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  createArcEmpty(radius, lineWidth, color){
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  move(){

    this.x += Math.cos(this.a) * this.s;
    this.y += Math.sin(this.a) * this.s;
    this.a += Math.random() * 0.4 - 0.2;

    if(this.x < 0 || this.x > this.w - this.radius){
      return false
    }

    if(this.y < 0 || this.y > this.h - this.radius){
      return false
    }
    this.render()
    return true
  }

  calculateDistance(v1, v2){
    var x = Math.abs(v1.x - v2.x);
    var y = Math.abs(v1.y - v2.y);
    return Math.sqrt((x * x) + (y * y));
  }
}
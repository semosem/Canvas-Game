
const variables={
  semlet:function(){
    return document.getElementById('semlet')
  },

  ctx:function(){
    return semlet.getContext("2d");
  }
}
// ---------canvas manipulation starts here-----------------
function canvasResizer(){
  variables.semlet().height=240;
  variables.semlet().width=400;
  variables.ctx().strokeStyle="white";
}
canvasResizer();

// canvas mouseevents and event property

function MouseObj(x,y){
  this.x=x;
  this.y=y;
}
const mouseObj= new MouseObj();

window.addEventListener('mousemove', function(e){
  mouseObj.x=e.x;
  mouseObj.y=e.y;
});
// setInterval(function(){
//   console.log(mouseObj);
// },1000);


// array of items inside the canvas

items=[];
itemsPainter=["#ECF0F1","#3498DB","#E74C3C","2C3E50"];

// is a constructor of objects containing necessary coordinates to creat items
const maxRadius=50;
const minRadius=10;
function ObjCreator(){

  this.r =10;
  this.x = Math.random()* (innerWidth-this.r*2)+this.r;
  this.y = Math.random()* (innerHeight-this.r*2)+this.r;
  this.dx = (Math.random()-.5)*2;
  this.dy = (Math.random()-.5)*2;
  this.color=itemsPainter[Math.floor(Math.random()*4)];
}

  // populate the items array with objecCreator above
  for (var i = 0; i < 100; i++) {
    var mygod=new ObjCreator();
    items[i]=mygod;
    // console.log(mygod);

  }


  // draw the canvas whenever the below function is called
  function realDrawer(i){

    variables.ctx().beginPath();
    variables.ctx().arc(items[i].x+=items[i].dx,items[i].y+=items[i].dy,items[i].r,0,2*Math.PI);
    // variables.ctx().stroke();
    variables.ctx().fillStyle =items[i].color;
    variables.ctx().fill();

  }

realDrawer(0);

  function canvasAnimate() {
    requestAnimationFrame(canvasAnimate);
    // variables.ctx().clearRect(0,0,innerWidth,innerHeight);

}
// canvasAnimate();

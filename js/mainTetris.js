
const variables={
  semlet:function(){
    return document.getElementById('semlet');
  },

  ctx:function(){
    return semlet.getContext("2d");
  },

  score:function(){
    return document.getElementById("score");
  }
}
variables.semlet().height=400;
variables.semlet().width=240;
variables.ctx().scale(20,20);



function collide(arenia,player) {

  const [m,o]=[player.matrix,player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
        if (
            m[y][x]!== 0 &&
            (arenia[y + o.y]&&
            arenia[y + o.y][x+ o.x])!==0)
           {
            return true;
        }
      }
  }
  return false;
}

function createMatrix(w,h) {
  const matrix=[];
  while(h--){
    matrix.push( new Array(w).fill(0));
  }
  return matrix;
}

function createBlocks(type){
  if (type==='T') {

    return [
              [0,0,0],
              [1,1,1],
              [0,1,0]
           ];

  } else if (type==='O') {
    return [
              [2,2],
              [2,2],
           ];
  } else if (type==='L') {
    return [
            [0,3,0],
            [0,3,0],
            [0,3,3]
           ];
  } else if (type==='J') {
    return [
            [0,4,0],
            [0,4,0],
            [4,4,0]
           ];
  } else if (type==='I') {
    return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
           ];
  } else if (type==='S') {
    return [
            [0,6,6],
            [6,6,0],
            [0,0,0]
           ];
  } else if (type==='Z') {
    return [
            [7,7,0],
            [0,7,7],
            [0,0,0]
           ];
  }
}

function draw(){

  variables.ctx().fillStyle="#000";
  variables.ctx().fillRect(0,0,variables.semlet().width,variables.semlet().height);
  drawMatrix(arenia, {x:0,y:0});
  drawMatrix(player.matrix, player.pos);

}


function drawMatrix(matrix,offset){

  matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if (value!==0) {
            variables.ctx().fillStyle= colors[value];
            variables.ctx().fillRect(x+offset.x,y+offset.y,1,1);
      }

    });
  });
}

const colors = [
  null,
  '#C2FF27',
  '#225378',
  '#1695A3',
  '#FF8C00',
  '#ACF0F2',
  '#F3FFE2',
  '#EB7F00'
];

function sweepingTime(){

  let rowCount=1;
  outer:for (let y = arenia.length-1;y > 0 ; y--) {
    for (let x = 0; x < arenia[y].length; x++) {
      if (arenia[y][x]===0) {
        continue outer;
      }
    }

    const row= arenia.splice(y,1)[0].fill(0);
    arenia.unshift(row);
    y++;

    player.score+=rowCount*10;
    rowCount*=2;
  }
}

function merge(arenia,player) {
  player.matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if (value!==0) {
        arenia[y+player.pos.y][x+player.pos.x]=value;
      }
    });
  });
}

const arenia= createMatrix(12,20);

console.table(arenia);

const player={
  pos:{x:0,y:0},
  matrix:null,
  score:0
}

function playerMove(dir){
    player.pos.x+=dir;
  if (collide(arenia,player)) {
    player.pos.x-=dir;
  }
}

function playerReset(){
  const blocks='ILJOTSZ';
  player.matrix= createBlocks(blocks[blocks.length*Math.random()| 0]);

  player.pos.y=0;
  player.pos.x=(arenia[0].length/2|0)-(player.matrix[0].length/2|0);

  if (collide(arenia,player)) {
    arenia.forEach(row=>row.fill(0));
    player.score=0;
    scoreUpdator();
  }
}

playerReset();

function playerRotate(dir){
  const pos=player.pos.x;
  let offset=1;
  rotate(player.matrix,dir);
  while (collide(arenia,player)) {
    player.pos.x+=offset;
    offset = -(offset +(offset >0 ? 1 : -1));
    if (offset> player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x=pos;
      return;
    }
  }
}

function rotate(matrix, dir){

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [ matrix[x][y],
        matrix[y][x],] = [matrix[y][x],
             matrix[x][y]];

    }
}
   if (dir>0) {
     matrix.forEach(row => row.reverse());
   } else {
     matrix.reverse();
   }
}
function playerDrop(){
  player.pos.y++;
  if (collide(arenia,player)) {
    player.pos.y--;
    merge(arenia,player);
    playerReset();
    sweepingTime();
    scoreUpdator();
    player.pos.y=0;
  }
  dropCounter=0;
}

let dropCounter=0;
let dropInterval=250;
let lastTime=0;

function animateDraw(time=0){
  const delatTime=time-lastTime;
  lastTime=time;

  dropCounter+=delatTime;
  if (dropCounter>dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(animateDraw);


}

animateDraw();

function scoreUpdator(){
  variables.score().innerText=player.score;
}

scoreUpdator();

document.addEventListener('keydown', event=>{
  if (event.keyCode===37) {
      playerMove(-1);
  } else if (event.keyCode===39) {
      playerMove(1);
  } else if (event.keyCode===40) {
      playerDrop();
  } else if (event.keyCode===81) {
      playerRotate(1);
  } else if (event.keyCode===87) {
      playerRotate(1);
  }
});

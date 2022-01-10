var checkpoint;
var jumpSound;
var dieSound;
var gameOver,gameOverImage;
var restart,restartImage;
var score=0;
var play=1;
var jogando=play;
var end=0;
var obstaculos1,obstaculos2,obstaculos3,obstaculos4,obstaculos5;
var clouds,cloudsMoving
var soloInv;
var solo,soloImage
var trex ,trex_running ,trexCollided;
var groupNuvens;
var groupCactos;

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  soloImage = loadImage("ground2.png");
  cloudsMoving = loadImage("cloud.png");
  obstaculos1 = loadImage("obstacle1.png");
  obstaculos2 = loadImage("obstacle2.png");
  obstaculos3 = loadImage("obstacle3.png");
  obstaculos4 = loadImage("obstacle4.png");
  obstaculos5 = loadImage("obstacle5.png");
  obstaculos6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  checkpoint = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidht, windowHeight);

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible=false;

  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible=false;

  score=0;

  groupCactos=new Group();

  groupNuvens=new Group();
  
  solo = createSprite(width/2,height,width,2);
  solo.addImage("ground", soloImage);
  solo.velocityX = -8;
  solo.x=solo.width/2;
  soloInv = createSprite(width/2,height-10,width,125);
  soloInv.visible=false;

  trex = createSprite(height-70,190,600,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("morto", trexCollided);
  trex.scale = 0.5; 
}

function draw(){ 
  background("gWhite")

  trex.setCollider("rectangle",0,0,50,trex.height);
  //trex.debug=true;
  text("Score: "+score,500,10);

  if(jogando===play){

    trex.changeAnimation("running", trex_running);

    score=score+Math.round(getFrameRate()/60);

    solo.velocityX=-(8+2*score/100);

    if(score>0 && score%1000 === 0){
      checkpoint.play();
    }

    if(solo.x<0){
      solo.x=solo.width/2;
    }
 
    if(touches.lenght>0 && trex.y>=height-120){
     trex.velocityY=-13;
     jumpSound.play();
     touches=[];
    }

    nuvens();

    cactos();

   trex.velocityY=trex.velocityY+0.8;
 
   trex.collide (soloInv);

   if(groupCactos.isTouching(trex)){
     jogando=end;
     dieSound.play();
   }
  }

  else if(jogando===end){
    gameOver.visible=true;

    restart.visible=true;

    solo.velocityX=0;

    trex.velocityY=0;
    trex.changeAnimation("morto",trexCollided);

    groupNuvens.setLifetimeEach(-1);
    groupNuvens.setVelocityXEach(0);

    groupCactos.setLifetimeEach(-1);
    groupCactos.setVelocityXEach(0);

    if(touches.lenght>0){
      reset();
      touches=[];
    }
  }

  drawSprites();
}

function nuvens(){

  if(frameCount%60===0){
    clouds = createSprite(widtht+20,height-300,10,10);
    clouds.addImage ("cloud", cloudsMoving);
    clouds.scale = 0.5;
    clouds.velocityX=-2;
    clouds.y=Math.round(random(20,150));
    trex.depth=clouds.depth;
    trex.depth=trex.depth+1;
    clouds.lifetime=350;
    groupNuvens.add(clouds);
  }
}

function cactos(){
  
  if(frameCount%60===0){
    var obstaculo = createSprite(600,height-95,10,10);
    obstaculo.velocityX=-(8+2*score/100);
    var sorteio = Math.round(random(1,6));
    switch(sorteio){
      case 1: obstaculo.addImage(obstaculos1);
        break;
      case 2: obstaculo.addImage(obstaculos2);
        break;
      case 3: obstaculo.addImage(obstaculos3);
        break;
      case 4: obstaculo.addImage(obstaculos4);
        break;
      case 5: obstaculo.addImage(obstaculos5);
        break;
      case 6: obstaculo.addImage(obstaculos6);
        break;
    
      default:break;
    }
  obstaculo.scale=0.6;
  obstaculo.lifetime=300;
  groupCactos.add(obstaculo);
  }
}

function reset(){

  jogando=play;

  groupCactos.destroyEach();
  groupNuvens.destroyEach();

  gameOver.visible=false;
  restart.visible=false;  

  score=0;
}
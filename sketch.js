var PLAY = 1;
var END = 0;
var gameState = PLAY;
var mario, marioImage, mario1;
var coin, coinImage, coinGroup, coinSound;
var ground1, ground2, groundImage;
var block, blockImage, blockGroup;
var obstacle, obstacleImage, obstacleGroup;
var invisibleGround;
var invisible, invisibleGroup;
var score = 0;
var restart,restartImg;
var gameOverSound;
         
function preload() {
  coinImage = loadAnimation("images/coin1.png", "images/coin2.png", "images/coin3.png", "images/coin4.png", "images/coin5.png", "images/coin6.png");

  groundImage = loadImage("images/bg1.png");

  marioImage = loadAnimation("images/0.png", "images/1.png", "images/2.png", "images/3.png", "images/4.png", "images/5.png", "images/6.png", "images/7.png");

  mario1 = loadImage("images/1.png");

  blockImage = loadImage("images/blockImg.png");

  coinSound = loadSound("sounds/coinsound.mp3");
  
  obstacleImage = loadImage("images/ob.gif");
  
  restartImg = loadImage("reset.jfif");
  
  gameOverSound = loadSound("sounds/gameOver.mp3");
}

function setup() {
  createCanvas(600, 550);

  //groupa
  blockGroup = new Group();
  coinGroup = new Group();
  invisibleGroup = new Group();
  obstacleGroup = new Group();

  //ground
  ground1 = createSprite(600, 300, 1000, 10);
  ground1.velocityX = -4;
  ground1.x = ground1.width / 2
  ground1.addImage(groundImage);

  //ground
  ground2 = createSprite(600, 300, 600, 10);
  ground2.velocityX = -4;
  ground2.x = ground2.width / 2
  ground2.shapeColor = "red";
  ground2.addImage(groundImage);

  //mario
  mario = createSprite(90, 310, 20, 20);
  mario.addAnimation("mariorun", marioImage);
  mario.scale = 0.8;

  //to make mario run on ground
  invisibleGround = createSprite(300, 500, 600, 10);
  invisibleGround.visible = false;
  
  //restart button
  restart = createSprite(300,300,20,20);
  restart.addImage(restartImg);
  restart.visible = false;
  restart.scale = 0.2;

}

function draw() {
  background(255);

  //when gameState is play
  if (gameState === PLAY) {
    
    //reseting the ground
    if (ground1.x > 0) {
      ground1.x = ground1.width / 2;
    }

    if (ground2.x < 0) {
      ground2.x = ground2.width / 2;
    }

    //making mario collide
    mario.collide(invisibleGround);
    
    restart.visible = false;

    //calling the functions
    coins();
    Obstacle();
    
    if (mario.isTouching(invisibleGroup)) {
      mario.velocityY = 0;
    }

    //making mario jump
    if (keyDown("space") && mario.y >= 200) {
      mario.velocityY = -12;
    }

    //giving gravity
    mario.velocityY = mario.velocityY + 0.8;

    if(mario.isTouching(coinGroup)){
      score = score+2; 
      coinGroup.destroyEach();
      coinSound.play();
    }

    if (mario.isTouching(obstacleGroup)) {
      gameState = END;
      gameOverSound.play();
    }

  }

  mario.setCollider("circle", 0, 15, 80);

  //to display sprites
  drawSprites();
  
  //when gameState is end
  if (gameState === END) {
    restart.visible = true;
    
    mario.velocityY = 0;
    ground1.velocityX = 0;
    ground2.velocityX = 0;
    invisibleGround.velocityX = 0;
    
    blockGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);

    blockGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    invisibleGroup.setVelocityXEach(0);
    
    text("GAME OVER", 110, 200, fill("black"), textSize(50));
    
      if(mousePressedOver(restart)) {
      reset();
    }
  }


  text("SCORE:" + score, 450, 30, fill("black"), textSize(20));
}

//coins,block & invisible
function coins() {
  if (frameCount % 100 === 0) {
    coin = createSprite(600, 300, 20, 20);
    coin.addAnimation("COINS", coinImage);
    coin.scale = 0.3;
    coin.velocityX = -4;
    coin.y = Math.round(random(200, 300));
    coin.lifetime = 200;
    coinGroup.add(coin);

    block = createSprite(600, 500, 20, 20);
    block.addImage(blockImage);
    block.y = coin.y + 60;
    block.velocityX = -4;
    block.lifetime = 200;
    blockGroup.add(block);

    invisible = createSprite(600, 500, block.width, 10);
    invisible.y = coin.y + 40;
    invisible.velocityX = -4;
    invisible.lifetime = 200;

    invisible.visible = false;
    invisibleGroup.add(invisible);

    mario.depth = coin.depth;
    mario.depth = mario.depth + 1;

    mario.depth = block.depth;
    mario.depth = mario.depth + 1

    invisible.depth = mario.depth;
    invisible.depth = invisible.depth + 1;
  }
}

//obstacles
function Obstacle(){
  if(frameCount % 110 === 0){
    obstacle = createSprite(600,460,20,20);
    obstacle.addImage(obstacleImage);
    obstacle.y = Math.round(random(460, 300));
    obstacle.velocityX = -4;
    obstacle.lifetime = 200;
    obstacle.scale = 0.2;
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  
  score = 0;
  
  //mario.destroy(); 
  obstacleGroup.destroyEach();
  blockGroup.destroyEach();
  coinGroup.destroyEach();
  invisibleGroup.destroyEach();
}
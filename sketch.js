// variables
// images
var backgroundImage, lavaImage, explorerImage1, explorerImage2, enemyImage1, enemyImage2, enemyImage3, smallPlatformImage, mediumPlatformImage, largePlatformImage, treasureOpen, treasureClose, powerUpImage1, powerUpImage2, powerUpImage3, powerUpImage4, boomerangImage1, boomerangImage2, gameOverImage1, gameOverImage2, gameOverImage3, restartImage;
// sprites
var lava, explorer, firstplatform, platform, platformEnemy, enemy, treasure, treasure2, edges, powerUp, boomerang, gameOver, restart;
// gameStates
var PLAY = 1;
var END = 0;
var gameState = PLAY;
// powerUps
var NONE = 0;
var INVINCIBILITY = 1;
var SPEED = 2;
var FLYING = 3;
var BOOMERRANG = 4;
var powers = NONE;
var powersTimer = 0;
var imageNumber = 1;
var movement = -2;
var effect = 0;
// etc
var score = 0;
var gameOverNumber = 0;

function preload() {
  // images
  backgroundImage = loadImage("background.jpg");
  lavaImage = loadImage("lava.png");
  explorerImage1 = loadImage("explorer.png");
  explorerImage2 = loadImage("explorer2.png");
  smallPlatformImage = loadImage("platform.png");
  mediumPlatformImage = loadImage("platform2.png");
  largePlatformImage = loadImage("platform3.png")
  enemyImage1 = loadImage("enemy1.png");
  enemyImage2 = loadImage("enemy2.png");
  enemyImage3 = loadImage("enemy3.png");
  treasureOpen = loadImage("treasureOPEN.png");
  treasureClose = loadImage("treasureNOTOPEN.png");
  powerUpImage1 = loadImage("invicibility.png");
  powerUpImage2 = loadImage("speed.png");
  powerUpImage3 = loadImage("wings.png");
  powerUpImage4 = loadImage("boomerang.png");
  boomerangImage1 = loadImage("boomerangPower.png");
  boomerangImage2 = loadImage("boomerangPower2.png");
  gameOverImage1 = loadImage("GAMEOVER.png");
  gameOverImage2 = loadImage("GAMEOVER2.png");
  gameOverImage3 = loadImage("GAMEOVER3.png");
  restartImage = loadImage("TryAgain.png");
}

function setup() {
  // canvas
  createCanvas(800, 600);

  // frameRate
  frameRate(60);
  
  // Groups
  platformGroup = new Group();
  platformEnemyGroup = new Group();
  enemies = new Group();
  platformTreasureGroup = new Group();
  treasures = new Group();
  treasures2 = new Group();
  platformPowerUpGroup = new Group();
  powerUps = new Group();
  boomerangs = new Group();

  // lava
  lava = createSprite(400, 620, 800, 40);
  lava.addImage(lavaImage);
  lava.scale = 2
  lava.velocityX = movement;

  // explorer
  explorer = createSprite(600, 180, 40, 40);
  explorer.addImage(explorerImage1);
  explorer.scale = 0.2;

  // firstPlatform
  firstPlatform = createSprite(600, 225);
  firstPlatform.addImage(largePlatformImage);
  firstPlatform.scale = 0.25;
  firstPlatform.velocityX = movement;
  firstPlatform.lifetime = 600;
  platformGroup.add(firstPlatform);
  
  gameOver = createSprite(400, 300);
  var rand = Math.round(random(1, 3));
  switch (rand) {
    case 1:
      gameOver.addImage("gameOver", gameOverImage1);
      break;
    case 2:
      gameOver.addImage("gameOver", gameOverImage2);
      break;
    case 3:
      gameOver.addImage("gameOver", gameOverImage3);
      break;
    default:
      break;
  }
  gameOver.visible = false;
  
  restart = createSprite(550, 200);
  restart.addImage("restart", restartImage);
  restart.scale = 2;
  restart.visible = false;
}
function draw() {
  // edges
  edges = createEdgeSprites();
  
  // gameStates
  if (gameState === PLAY) {
    // controls
    // jumping with up arrow key
    if (keyDown(UP_ARROW) && explorer.collide(platformGroup) || keyDown(UP_ARROW) && explorer.collide(platformEnemyGroup) || keyDown(UP_ARROW) && explorer.collide(platformTreasureGroup) || keyDown(UP_ARROW) && explorer.collide(platformPowerUpGroup) || keyDown(UP_ARROW) && powers === FLYING) {
      explorer.velocityY = -9.5;
    }
    // moving left with left arrow key
    if (keyDown(LEFT_ARROW)) {
      explorer.x = explorer.x - (5 * -(movement+1));
      explorer.addImage(explorerImage2);
      imageNumber = 0;
    }
    // moving right with right arrow key
    if (keyDown(RIGHT_ARROW)) {
      explorer.x = explorer.x + (5 * -(movement+1));
      explorer.addImage(explorerImage1);
      imageNumber = 1;
    }
    // using boomerang with boomerang powerUp
    if (powers === BOOMERRANG && powersTimer === 19) {
      if (imageNumber === 1) {
        boomerangSprite = createSprite(explorer.x, explorer.y, 20, 20);
      boomerangSprite.addImage(boomerangImage1);
      boomerangSprite.scale = 2;
      boomerangSprite.velocityX = 4;
        
      } else {
        boomerangSprite = createSprite(explorer.x, explorer.y, 20, 20);
      boomerangSprite.addImage(boomerangImage2);
      boomerangSprite.scale = 2;
        boomerangSprite.velocityX = -4;
      }
      boomerangs.add(boomerangSprite);
      boomerangSprite.depth = gameOver.depth - 1;
      boomerangSprite.lifetime = 200;
      powersTimer = 0;
      powers = NONE;
      if (boomerangSprite.collide(enemies)) {
      enemies.destroyEach();
    }
    }
    

    // gravity
    if (explorer.velocityY < 6) {
      explorer.velocityY = explorer.velocityY + 0.25;
    }

    // lava moving
    if (lava.x < 300) {
      lava.x = 400;
    }
    
    // spawns platforms
    if (frameCount % 160 === 0) {
      treasurePlatform();
      powerUpPlatform();
    }
    
    // powerUp picking up
    if (explorer.isTouching(powerUps)) {
        powerUps.destroyEach();
      
      if (effect === 1) {
        powers = INVINCIBILITY;
      } else if (effect === 2) {
        powers = SPEED;
      } else if (effect === 3) {
        powers = FLYING;
      } else if (effect === 4) {
        powers = BOOMERRANG;
      }
      
        powersTimer = 20;
      }
    
    // powersTimer
    if (powers === NONE) {
      console.log("NONE");
    } else {
      powersTimer = powersTimer - (1/16);
    }
    if (powersTimer < 0) {
      powers = NONE;
    }

    // treasures picking up
    if (explorer.isTouching(treasures)) {
      score = score+1000;
      treasure2 = createSprite(treasure.x, treasure.y);
    treasures.destroyEach();
      treasure2.addImage(treasureOpen);
      treasure2.scale = 0.05;
      treasure2.velocityX = movement;
      treasure2.lifetime = 600;
      treasures2.add(treasure2);
      gameOver.depth = treasure2.depth + 1;
      restart.depth = gameOver.depth + 1;
      
    }
    
    // score
    score = score + Math.round(getFrameRate()/120);

    // lose
    if (explorer.collide(enemies) || explorer.collide(lava) || explorer.collide(edges[0])) {
      if (powers === INVINCIBILITY) {
        enemies.destroyEach();
        explorer.x = 375;
        explorer.y = 100;
        explorer.velocityX = -20;
      } else {
      gameState = END;
      explorer.velocityY = 0;
      }
    }
  } else if (gameState === END) {
  restart.depth = gameOver.depth +1;
    
    
    
    
    // making velocity 0
    platformGroup.setVelocityXEach(0);
    platformEnemyGroup.setVelocityXEach(0);
    platformTreasureGroup.setVelocityXEach(0);
    platformPowerUpGroup.setVelocityXEach(0);
    lava.velocityX = 0;
    enemies.setVelocityXEach(0);
    treasures.setVelocityXEach(0);
    treasures2.setVelocityXEach(0);
    powerUps.setVelocityXEach(0);
    boomerangs.setVelocityXEach(0);

    // making lifetime infinte
    platformGroup.setLifetimeEach(-1);
    platformEnemyGroup.setLifetimeEach(-1);
    platformTreasureGroup.setLifetimeEach(-1);
    platformPowerUpGroup.setLifetimeEach(-1);
    enemies.setLifetimeEach(-1);
    treasures.setLifetimeEach(-1);
    treasures2.setLifetimeEach(-1);
    powerUps.setLifetimeEach(-1);
    boomerangs.setLifetimeEach(-1);
    
    // making gameOver and restart visible
    gameOver.visible = true;
    restart.visible = true;

    // reseting the game
    if (mousePressedOver(restart)) {
      reset();
    }


  }
  background(backgroundImage);

  explorer.collide(platformGroup);
  explorer.collide(platformEnemyGroup);
  explorer.collide(platformTreasureGroup);
  explorer.collide(platformPowerUpGroup);
  explorer.collide(edges[1]);
  explorer.collide(edges[2]);

    // speed powerUp
  if (powers === SPEED) {
      movement = -2.5;
    } else {
      movement = -2;
    }
  
  explorer.velocityX = 0;

  fill("white");
  textSize(20);
  text("Score: "+score, 50, 50);
  
  drawSprites();
}

function spawnPlatform() {
  platform = createSprite(800, 120, 150, 10);
  platform.y = Math.round(random(250, 350));
  platform.shapeColor = "orange";
  platform.addImage(smallPlatformImage);
  platform.scale = 0.1;
  platform.velocityX = movement;

  // assign lifetime to the variable
  platform.lifetime = 475;

  // depth
  platform.depth = gameOver.depth;
  gameOver.depth = gameOver.depth + 1;
  restart.dept = gameOver.depth + 1;


  // add each platform to the group
  platformGroup.add(platform);
}

function enemyPlatform() {
  platformEnemy = createSprite(800, 120, 250, 10);
  platformEnemy.y = Math.round(random(250, 350));
  enemy = createSprite(800, platformEnemy.y - 35, 40, 40);

  var rand = Math.round(random(1, 3));
  switch (rand) {
    case 1:
      enemy.addImage(enemyImage1);
      enemy.scale = 0.1;
      enemy.y = enemy.y + 5;
      break;
    case 2:
      enemy.addImage(enemyImage2);
      enemy.scale = 2;
      break;
    case 3:
      enemy.addImage(enemyImage3);
      enemy.scale = 1.2;
      enemy.y = enemy.y - 25;
      break;
    default:
      break;
  }

  platformEnemy.shapeColor = "orange";
  platformEnemy.addImage(mediumPlatformImage);
  platformEnemy.scale = 0.15;
  platformEnemy.velocityX = movement;
  enemy.velocityX = movement;

  // assign lifetime to the variable
  platformEnemy.lifetime = 525;
  enemy.lifetime = 525;

// depth
  platformEnemy.depth = gameOver.depth;
  enemy.depth = platformEnemy.depth - 1;
  gameOver.depth = gameOver.depth + 1;
  restart.dept = gameOver.depth + 1;

  // add each platform to the group
  platformEnemyGroup.add(platformEnemy);
  enemies.add(enemy);
}

function treasurePlatform() {
  platformTreasure = createSprite(800, 120, 400, 10);
  platformTreasure.y = Math.round(random(350, 375));
  treasure = createSprite(800, platformTreasure.y - 25, 30, 30);
  treasure.addImage(treasureClose);
  treasure.scale = 0.05;
  var rand = Math.round(random(1, 2));
  switch (rand) {
    case 1:
      enemy = createSprite(900, platformTreasure.y - 25, 40, 40);
      enemy.lifetime = 600;
      enemy.velocityX = movement;
      enemy.addImage(enemyImage3);
      enemy.scale = 1.2;
      enemy.y = enemy.y - 35;
      enemies.add(enemy);
      break;
    case 2:
      enemy = createSprite(700, platformTreasure.y - 25, 40, 40);
      enemy.lifetime = 600;
      enemy.velocityX = movement;
      enemy.addImage(enemyImage3);
      enemy.scale = 1.2;
      enemy.y = enemy.y - 35;
      enemies.add(enemy);
      break;
    default:
      break;
  }
  platformTreasure.addImage(largePlatformImage);
  platformTreasure.scale = 0.25;
  platformTreasure.velocityX = movement;
  treasure.velocityX = movement;

  // assign lifetime to the variable
  platformTreasure.lifetime = 600;
  treasure.lifetime = 600;

// depth
  platformTreasure.depth = gameOver.depth;
  treasure.depth = platformTreasure.depth - 1;
  enemy.depth = treasure.depth - 1;
  gameOver.depth = gameOver.depth + 1;
  restart.dept = gameOver.depth + 1;

  // add each platform to the group
  platformTreasureGroup.add(platformTreasure);
  treasures.add(treasure);
}

function powerUpPlatform() {
  platformPowerUp = createSprite(800, 120, 250, 10);
  platformPowerUp.y = Math.round(random(250, 350));
  powerUp = createSprite(800, platformPowerUp.y - 35, 40, 40);
  
  var rand = Math.round(random(1, 4));
  switch (rand) {
    case 1:
      powerUp.addImage(powerUpImage1);
      powerUp.scale = 2;
      powerUp.y = powerUp.y - 5;
      effect = 1;
      break;
    case 2:
      powerUp.addImage(powerUpImage2);
      powerUp.scale = 2;
      powerUp.y = powerUp.y - 5;
      effect = 2;
      break;
    case 3:
      powerUp.addImage(powerUpImage3);
      powerUp.scale = 2;
      powerUp.y = powerUp.y - 5;
      effect = 3;
      break;
    case 4:
      powerUp.addImage(powerUpImage4);
      powerUp.scale = 2;
      powerUp.y = powerUp.y - 5;
      effect = 4;
      break;
    default:
      break;
  }

  platformPowerUp.shapeColor = "orange";
  platformPowerUp.addImage(mediumPlatformImage);
  platformPowerUp.scale = 0.15;
  platformPowerUp.velocityX = movement;
  powerUp.velocityX = movement;

  // assign lifetime to the variable
  platformPowerUp.lifetime = 525;
  powerUp.lifetime = 525;

// depth
  platformPowerUp.depth = gameOver.depth;
  powerUp.depth = platformPowerUp.depth - 1;
  gameOver.depth = gameOver.depth + 1;
  restart.dept = restart.depth + 1;

  // add each platform to the group
  platformPowerUpGroup.add(platformPowerUp);
  powerUps.add(powerUp);
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
    platformGroup.destroyEach();
    platformEnemyGroup.destroyEach();
    platformTreasureGroup.destroyEach();
    platformPowerUpGroup.destroyEach();
    enemies.destroyEach();
    treasures.destroyEach();
  treasures2.destroyEach();
    powerUps.destroyEach();
    boomerangs.destroyEach();
  
  // explorer
  explorer.x = 600;
  explorer.y = 180;

  // firstPlatform
  firstPlatform = createSprite(600, 225, 400, 10);
  firstPlatform.addImage(largePlatformImage);
  firstPlatform.scale = 0.25;
  firstPlatform.velocityX = movement;
  firstPlatform.lifetime = 600;
  platformGroup.add(firstPlatform);
  
  gameOver.depth = firstPlatform.depth + 1;
  
  
  score = 0;
  
  lava.velocityX = movement;
  
  var rand = Math.round(random(1, 3));
  switch (rand) {
    case 1:
      gameOver.addImage("gameOver", gameOverImage1);
      break;
    case 2:
      gameOver.addImage("gameOver", gameOverImage2);
      break;
    case 3:
      gameOver.addImage("gameOver", gameOverImage3);
      break;
    default:
      break;
  }
}
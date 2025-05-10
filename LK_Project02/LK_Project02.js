let ladybug;
let pipes = [];
let shuffledPipes = [];
let table;
let score = 0;
let pipeIndex = 0;
let gameStart = false;
let gameEnd = false;
let restartButton;

function preload(){
  icon = loadImage('ladybug.png');
  table = loadTable('gameandgrade.csv', 'csv', 'header');
}

function setup(){
  createCanvas(400, 600);
  ladybug = new Ladybugclass();

  for (let i = 0; i < table.getRowCount(); i++){
    shuffledPipes.push(table.rows[i]);
  }
  shuffledPipes = shuffle(shuffledPipes, true);
}

function draw(){
  background('#9ECDE5');

  if (!gameStart){
    textSize(30);
    textAlign(CENTER);
    fill(0);
    textFont('Arial');
    text("Press SPACE to", width/2 - 10, height/2 - 40);
    text("Start Game", width/2 - 10, height/2 + 10);
    return;
  }

  if (frameCount % 90 === 0 && pipeIndex < table.getRowCount()){
    let row = shuffledPipes[pipeIndex];
    let bottomHeight = int(row.get('Grade')) * 3.5; //multiplying by 3.5 so that the pipes are uniformly longer
    let playingOften = int(row.get('Playing Often')); //value of playing often

    if (playingOften == 0){
      color = '#80E57D'; //Green
      console.log("this is green");
    }
    else if (playingOften == 1){
      color = '#4FE6E0'; //Blue
      console.log("this is blue");
    }
    else if (playingOften == 2){
      color = '#E51C14'; //Red
      console.log("this is red");
    }
    else if (playingOften == 3){
      color = '#E5B91F'; //Orange
      console.log("this is orange");
    }
    else if (playingOften == 4){
      color = '#A361AD'; //Purple
      console.log("this is purple");
    }
    else { (playingOften == 5)
      color = '#E5D865'; //Yellow
      console.log("this is yellow");
    }

    pipes.push(new Pipe(bottomHeight, color));
    pipeIndex++;
    console.log(playingOften);
    //console.log(color);
    //console.log(bottomHeight);
  }

  for (let i = pipes.length - 1; i >= 0; i--){
    pipes[i].update();
    pipes[i].show();

  if (pipes[i].hits(ladybug)) {
    triggerGameEnd();
  }

  if (!pipes[i].passed && pipes[i].x + pipes[i].w < ladybug.x){
    pipes[i].passed = true;
    score++;
  }

    if (pipes[i].offscreen()){
      pipes.splice(i, 1);
    }
  }

  //SCORE COUNTER
  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 250, 10);

  ladybug.update();
  ladybug.show();
}

function showRestartButton(){
  restartButton = createButton('Restart Game');
  restartButton.position(width/2-85, height/2 - 50);
  restartButton.size(200, 150);
  restartButton.style("font-family", "Arial");
  restartButton.style("font-size", "48px");
  restartButton.mousePressed(restartGame);
}

function triggerGameEnd(){
  if (!gameEnd) {
    gameEnd = true;
    noLoop();
    showRestartButton();
  }
}

function restartGame(){
  ladybug = new Ladybugclass();
  pipes = [];
  pipeIndex = 0;
  gameStart = false;
  gameEnd = false;
  score = 0;

  shuffledPipes = [];
  for (let i = 0; i < table.getRowCount(); i++){
    shuffledPipes.push(table.rows[i]);
  }
  shuffledPipes = shuffle(shuffledPipes, true);

  restartButton.remove();
  //Restart the draw loop
  loop();
}

function keyPressed(){
  if (key == ' '){
    if (!gameStart){
      gameStart = true;
    } else {
      ladybug.up();
    }
  }
}




class Ladybugclass{
  constructor(){
    this.y = height/2;
    this.x = 64;
    this.gravity = 0.7;
    this.lift = -12;
    this.velocity = 0;
  }

  up(){
    this.velocity += this.lift;
  }

  update(){
    this.velocity += this.gravity;
    this.y += this.velocity;

    //If ladybug tries to go above top canvas or if ladybug tries to go below bottom canvas
    if (this.y >= height || this.y <= 0){
      triggerGameEnd();
      //console.log("current height is " + this.y);
      //console.log("total height is " + height);
    }
  }
    show(){
      imageMode(CENTER);
      image(icon, this.x, this.y, 40, 40);
      //fill(255, 255, 0);
      //ellipse(this.x, this.y, 32, 32);
    }
}







class Pipe{
  constructor(bottomHeight, color){
    this.spacing = 200;
    this.top = height - bottomHeight - this.spacing;
    this.bottom = bottomHeight;
    this.x = width;
    this.w = 40;
    this.speed = 2;
    this.passed = false;
    this.color = color;
    //console.log("color - " + color);
  }

  hits(ladybug){
    if (ladybug.y < this.top || ladybug.y > height - this.bottom){
      if (ladybug.x > this.x && ladybug.x < this.x + this.w){
        return true;
      }
    }
    return false;
  }

  show(){
    fill('#3498EB');
    rect(this.x, 0, this.w, this.top);
    fill(this.color);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  update(){
    this.x -= this.speed;
  }

  offscreen(){
    return this.x < -this.w;
  }
}


//SIGHTED SIDE


// Create a new connection using socket.io (imported in index.html)
let socket = io();
let blindId = undefined;

// define the function that will be called on a new newConnection
socket.on("connect", function () {
  console.log("your id:", socket.id);
  //emit welcome information
  let message = {
    room: "labyrinth",
    side: "sighted",
  };
  socket.emit("welcome", message);
});

socket.on("start", setBlindId);
function setBlindId(id) {
  blindId = id;
  console.log("START SIGHTED!!!!");
}






let windowDiagonal;
let preLobby = true;

function preload(){
  windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
  //Load map
  labyrinth = loadImage("assets/Images/Blind/labyrinth.png");
  //Load characters sprites & sounds
  main = new character("assets/Images/Blind/Sprites","assets/Sounds/wall_bump.m4a","assets/Sounds/pin.mp3");
  //Load loading gif
  gif_loading = createImg("assets/Images/loading.gif");

}

function setup() {
  createCanvas(windowWidth,windowHeight);
  push();
  imageMode(CENTER);
  let mapCenter_x = windowWidth/2;
  let mapCenter_y = windowHeight/2;
  let map_diagonal = windowDiagonal/10*7;
  let map_height = map_diagonal/pow(pow(labyrinth.height,2)+pow(labyrinth.width,2),0.5)*labyrinth.height;
  let map_width = labyrinth.width/labyrinth.height*map_height;
  image(labyrinth, mapCenter_x, mapCenter_y, map_width, map_height);
  pop();

  let mapTopLeft_x = mapCenter_x-map_width/2;
  let mapTopLeft_y = mapCenter_y-map_height/2;
  let mapDownRight_x = mapCenter_x+map_width/2;
  let mapDownRight_y = mapCenter_y+map_height/2;
  main.gridOn(160, 120, mapTopLeft_x, mapTopLeft_y, mapDownRight_x, mapDownRight_y);
  //main.spritesOn(80, 3, windowDiagonal/45, 6);
  main.spritesOn(80, 119, windowDiagonal/45, 6);
  main.loadCollisions();
  main.pinOn();

  background("black");

  //main.printGrid(); //DEBUG, uncomment this line and comment function draw
}

function draw() {
  //Update window diagonal
  windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
  background("black");

  if (preLobby) {
    let gifWidth=windowDiagonal/100
    let gifHeight=gifWidth/gif_loading.width*gif_loading.height;
    gif_loading.size(gifWidth,gifHeight);
    gif_loading.position((windowWidth-gif_loading.width)/2, (windowHeight-gif_loading.height)/2);
  }
  else {
    // Draw map
    push();
    imageMode(CENTER);
    let mapCenter_x = windowWidth/2;
    let mapCenter_y = windowHeight/2;
    let map_diagonal = windowDiagonal/10*7;
    let map_height = map_diagonal/pow(pow(labyrinth.height,2)+pow(labyrinth.width,2),0.5)*labyrinth.height;
    let map_width = labyrinth.width/labyrinth.height*map_height;
    image(labyrinth, mapCenter_x, mapCenter_y, map_width, map_height);
    pop();

    //Draw pin
    main.displayPin(1);

    //Draw character
    let mapTopLeft_x = mapCenter_x-map_width/2;
    let mapTopLeft_y = mapCenter_y-map_height/2;
    let mapDownRight_x = mapCenter_x+map_width/2;
    let mapDownRight_y = mapCenter_y+map_height/2;
    main.updateDimensions(mapTopLeft_x, mapTopLeft_y, mapDownRight_x, mapDownRight_y, windowDiagonal/45);
    main.move_lC();
    main.display();
    main.timeOn();

    //Win check
    main.victoryCheck();

    // Draw hole
    //hole(main.getPosition()[0], main.getPosition()[1], windowDiagonal/30);
  }

}

class character {
  constructor(spritesFolder, wallSound_Path, pinSound_Path) {
    // Upload sprites
    this.front = [loadImage(spritesFolder+"/front.png"),
                  loadImage(spritesFolder+"/front - right foot.png"),
                  loadImage(spritesFolder+"/front.png"),
                  loadImage(spritesFolder+"/front - left foot.png")];
    this.back = [loadImage(spritesFolder+"/back.png"),
                 loadImage(spritesFolder+"/back - right foot.png"),
                 loadImage(spritesFolder+"/back.png"),
                 loadImage(spritesFolder+"/back - left foot.png")];
    this.left = [loadImage(spritesFolder+"/left.png"),
                 loadImage(spritesFolder+"/left - right foot.png"),
                 loadImage(spritesFolder+"/left.png"),
                 loadImage(spritesFolder+"/left - left foot.png")];
    this.right = [loadImage(spritesFolder+"/right.png"),
                  loadImage(spritesFolder+"/right - right foot.png"),
                  loadImage(spritesFolder+"/right.png"),
                  loadImage(spritesFolder+"/right - left foot.png")];
    // Upload sounds
    this.wallSound = loadSound(wallSound_Path);
    this.pinSound = loadSound(pinSound_Path);
  }
  gridOn(gridNodesX, gridNodesY, gridTopLeft_x, gridTopLeft_y, gridDownRight_x, gridDownRight_y) {
    // Set grid parameters
    this.gridNodesX = gridNodesX;
    this.gridNodesY = gridNodesY;
    // Create grid
    this.gridX = [];
    let stepX = (gridDownRight_x-gridTopLeft_x)/(gridNodesX+1);
    for (let i=1; i<=this.gridNodesX; i++) {
      this.gridX.push(gridTopLeft_x + i*stepX)
    }
    this.gridY = [];
    let stepY = (gridDownRight_y-gridTopLeft_y)/(gridNodesY+1);
    for (let j=1; j<=this.gridNodesY; j++) {
      this.gridY.push(gridTopLeft_y + j*stepY)
    }
  }
  spritesOn (sprites_i, sprites_j, spritesDiagonal, animationPause) {
    //Set sprites parameters
    this.sprites_i = sprites_i;
    this.sprites_j = sprites_j;
    this.spritesHeight = spritesDiagonal/pow(pow(this.front[0].height,2)+pow(this.front[0].width,2),0.5)*this.front[0].height;
    this.spritesFrame = 0;
    // Initialize previous key pressed
    this.pKey = "UP_ARROW"; //previous key
    this.pLeg = false; //previous leg, 1:right 0:left
    this.pImage = this.back[0];
    // Set time and pause
    this.t = 0;
    this.pause = animationPause;
    this.collisionSound = [0,0,0,0]; //up, down, left, right

  }
  loadCollisions(){
    function detectWallX(xStart,xEnd,y,nChecks) {
      let dx = (xEnd-xStart)/nChecks;
      for (let n=1; n<nChecks; n++) {
        let x = xStart+n*dx;
        let col = get(x,y);
        if (col[0]==255 && col[1]==255 && col[2]==255) {return 1;}
/*        push();
        stroke('red');
        strokeWeight(1);
        point(x,y);
        pop();*/
      }
      return 0;
    }
    function detectWallY(yStart,yEnd,x,nChecks) {
      let dy = (yEnd-yStart)/nChecks;
      for (let n=1; n<nChecks; n++) {
        let y = yStart+n*dy;
        let col = get(x,y);
        if (col[0]==255 && col[1]==255 && col[2]==255) {return 1;}
        /*push();
        stroke('red');
        strokeWeight(1);
        point(x,y);
        pop();*/
      }
      return 0;
    }
    this.collisionGrid = [];
    let nChecks =3;

    let leftCollisionPE = []; //left collision at previous element
    for (let j=0; j<this.gridNodesY; j++) {
      leftCollisionPE.push(false);
    }
    for (let i=0; i<this.gridNodesX; i++) {
      let column = [];
      let upCollisionPE = false; //up collision at previous element
      for (let j=0; j<this.gridNodesY; j++) {
        let rightCollisionCE = false; //right collision current element
        let downCollisionCE = false; //down collision at current element
        let element = [0, 0, 0, 0]; //up, down, left, right
        //up
        if(upCollisionPE) { //up collision previous element
          element[0]=1;
        }
        if (j == 0) {
          element[0] = 1;
          upCollisionPE=true;
        }
        else if (detectWallY(this.gridY[j - 1], this.gridY[j], this.gridX[i], nChecks)) {
          element[0] = 1;
          upCollisionPE=true;
        }
        else {
          upCollisionPE=false;
        }
        //down
        if (j == this.gridNodesY - 1) {
          element[1] = 1;
          downCollisionCE = true;
        }
        else if (detectWallY(this.gridY[j], this.gridY[j + 1], this.gridX[i], nChecks)) {
          element[1] = 1;
          downCollisionCE = true;
        }
        //left
        if (leftCollisionPE[j]){ //left collision previous Element
          element[2] = 1;
        }
        if (i == 0) {
          element[2] = 1;
          leftCollisionPE[j] = true;
        }
        else if (detectWallX(this.gridX[i - 1], this.gridX[i], this.gridY[j], nChecks)) {
          element[2] = 1;
          leftCollisionPE[j] = true;
        }
        else {
          leftCollisionPE[j] = false;
        }
        //right
        if (i == this.gridNodesX - 1) {
          element[3] = 1;
          rightCollisionCE = true;
        }
        else if (detectWallX(this.gridX[i], this.gridX[i + 1], this.gridY[j], nChecks)) {
          element[3] = 1;
          rightCollisionCE = true;
        }

        //down collision current Element
        if(downCollisionCE && j!=0) {
          column[column.length-1][1]=1;
        }
        //right collision current element
        if(rightCollisionCE && i!=0) {
          this.collisionGrid[this.collisionGrid.length-1][j][3] = 1;
        }
        column.push(element);
      }
      this.collisionGrid.push(column);
    }
  }
  timeOn () {
    this.t++;
  }
  updateDimensions(gridTopLeft_x, gridTopLeft_y, gridDownRight_x, gridDownRight_y, spritesDiagonal) {
    // Update grid
    let oldGridX = this.gridX;
    this.gridX = [];
    let stepX = (gridDownRight_x - gridTopLeft_x) / (this.gridNodesX + 1);
    for (let i = 1; i <= this.gridNodesX; i++) {
      this.gridX.push(gridTopLeft_x + i * stepX)
    }
    let oldGridY = this.gridY;
    this.gridY = [];
    let stepY = (gridDownRight_y - gridTopLeft_y) / (this.gridNodesY + 1);
    for (let j = 1; j <= this.gridNodesY; j++) {
      this.gridY.push(gridTopLeft_y + j * stepY)
    }
    //Update sprites parameters
    this.spritesHeight = spritesDiagonal/pow(pow(this.front[0].height,2)+pow(this.front[0].width,2),0.5)*this.front[0].height;
    //Update pin parameters
    this.pin_x=map(this.pin_x,oldGridX[1],oldGridX[oldGridX.length-1],this.gridX[1],this.gridX[this.gridX.length-1]);
    this.pin_y=map(this.pin_y,oldGridY[1],oldGridY[oldGridY.length-1],this.gridY[1],this.gridY[this.gridY.length-1]);
  }
  move_lC () {
    if (this.t > this.pause) {
      if (keyIsDown(LEFT_ARROW) && this.pKey == "LEFT_ARROW") {
        if (this.collisionGrid[this.sprites_i][this.sprites_j][2]){
          if (this.collisionSound[2]!=1) {
            this.wallSound.play();
            this.collisionSound = [0,0,1,0];
          } else {
            this.collisionSound = [0,0,0,0];
          }
        }
        else{
          this.sprites_i = max(this.sprites_i - 1, 0);
        }
      }
      else if (keyIsDown(RIGHT_ARROW) && this.pKey == "RIGHT_ARROW") {
        if (this.collisionGrid[this.sprites_i][this.sprites_j][3]) {
          if (this.collisionSound[3]!=1) {
            this.wallSound.play();
            this.collisionSound = [0,0,0,1];
          } else {
            this.collisionSound = [0,0,0,0];
          }
        } else {
          this.sprites_i = min(this.sprites_i + 1, this.gridNodesX - 1);
        }
      }
      else if (keyIsDown(UP_ARROW) && this.pKey == "UP_ARROW") {
        if (this.collisionGrid[this.sprites_i][this.sprites_j][0]) {
          if (this.collisionSound[0]!=1) {
            this.wallSound.play();
            this.collisionSound = [1,0,0,0];
          } else {
            this.collisionSound = [0,0,0,0];
          }
        } else {
          this.sprites_j = max(this.sprites_j - 1, 0);
        }
      }
      else if (keyIsDown(DOWN_ARROW) && this.pKey == "DOWN_ARROW") {
        if (this.collisionGrid[this.sprites_i][this.sprites_j][1]) {
          if (this.collisionSound[1]!=1) {
            this.wallSound.play();
            this.collisionSound = [0,1,0,0];
          } else {
            this.collisionSound = [0,0,0,0];
          }
        } else {
          this.sprites_j = min(this.sprites_j + 1, this.gridNodesY - 1);
        }
      }
    }
  }
  move_ulC () { //move without uploading the collision first, [still to be implemented!!!]
    if (this.t > this.pause) {
      if (keyIsDown(LEFT_ARROW) && this.pKey == "LEFT_ARROW" ){ //&& !this.collisionGrid[this.sprites_i][this.sprites_j][2]) {
        this.sprites_i = max(this.sprites_i - 1, 0);
      }
      else if (keyIsDown(RIGHT_ARROW) && this.pKey == "RIGHT_ARROW" ){ //&& !this.collisionGrid[this.sprites_i][this.sprites_j][3]) {
        this.sprites_i = min(this.sprites_i + 1, this.gridNodesX - 1);
      }
      else if (keyIsDown(UP_ARROW) && this.pKey == "UP_ARROW" ){ //&& !this.collisionGrid[this.sprites_i][this.sprites_j][0]) {
        this.sprites_j = max(this.sprites_j - 1, 0);
      }
      else if (keyIsDown(DOWN_ARROW) && this.pKey == "DOWN_ARROW" ){ //&& !this.collisionGrid[this.sprites_i][this.sprites_j][1]) {
        this.sprites_j = min(this.sprites_j + 1, this.gridNodesY - 1);
      }
    }
  }
  printGrid () {
    //very heavy, use it just for debugging
    for (let i=0; i<this.gridNodesX; i++) {
      for (let j=0; j<this.gridNodesY; j++) {
        let x = this.gridX[i];
        let y = this.gridY[j];
        //up
        if (this.collisionGrid[i][j][0] == 1) {
          push();
          stroke('red');
          strokeWeight(7);
          point(x,y);
          pop();
        }
        //down
        if (this.collisionGrid[i][j][1] == 1) {
          push();
          stroke('blue');
          strokeWeight(7);
          point(x,y);
          pop();
        }
        //left
        if (this.collisionGrid[i][j][2] == 1) {
          push();
          stroke('green');
          strokeWeight(7);
          point(x,y);
          pop();
        }
        //right
        if (this.collisionGrid[i][j][3] == 1) {
          push();
          stroke('purple');
          strokeWeight(7);
          point(x,y);
          pop();
        }

      }
    }
  }
  display() {
    let spritesWidth = this.spritesHeight / this.front[0].height * this.front[0].width;
    let x = this.gridX[this.sprites_i]-spritesWidth/20;
    let y = this.gridY[this.sprites_j]-this.spritesHeight/3;

    if (this.t > this.pause) {
      if (keyIsDown(LEFT_ARROW)) {
        if (this.pKey == "LEFT_ARROW" && this.sprites_i!=0) {
          this.pImage = this.left[this.spritesFrame];
        } else {
          this.pImage = this.left[0];
        }
        this.pKey = "LEFT_ARROW";
      }
      else if (keyIsDown(RIGHT_ARROW)) {
        if (this.pKey == "RIGHT_ARROW" && this.sprites_i!=this.gridNodesX-1) {
          this.pImage = this.right[this.spritesFrame];
        } else {
          this.pImage = this.right[0];
        }
        this.pKey = "RIGHT_ARROW";
      }
      else if (keyIsDown(UP_ARROW)) {
        if (this.pKey == "UP_ARROW" && this.sprites_j!=0) {
          this.pImage = this.back[this.spritesFrame];
        } else {
          this.pImage = this.back[0];
        }
        this.pKey = "UP_ARROW";
      }
      else if (keyIsDown(DOWN_ARROW)) {
        if (this.pKey == "DOWN_ARROW" && this.sprites_j!=this.gridNodesY-1) {
          this.pImage = this.front[this.spritesFrame];
        } else {
          this.pImage = this.front[0];
        }
        this.pKey = "DOWN_ARROW";
      }
      else {
        if (this.pLeg) {
          this.spritesFrame = 0;
        }
        else {
          this.spritesFrame = 2;
        }
        this.pLeg = !this.pLeg; //alternate starting leg
        switch (this.pKey) {
          case "LEFT_ARROW":
            this.pImage = this.left[this.spritesFrame];
            break;
          case "RIGHT_ARROW":
            this.pImage = this.right[this.spritesFrame];
            break;
          case "UP_ARROW":
            this.pImage = this.back[this.spritesFrame];
            break;
          case "DOWN_ARROW":
            this.pImage = this.front[this.spritesFrame];
            break;
        }
      }
      this.t=0;
      this.spritesFrame++;
      if (this.spritesFrame>3) {this.spritesFrame = 0;}
    }
    push();
    imageMode(CENTER);
    image(this.pImage, x, y, spritesWidth, this.spritesHeight);
    pop();
  }
  getCoordinates() {
    return [this.sprites_i, this.sprites_j];
  }
  getPosition() {
    return [this.gridX[this.sprites_i], this.gridY[this.sprites_j]];
  }
  pinOn() {
    this.pinCount=0;
    this.showPin=false;
  }
  pushPinCoords(){
    // Pin only inside the map
    if (mouseX>this.gridX[1] && mouseX<this.gridX[this.gridX.length-1] &&
        mouseY>this.gridY[1] && mouseY<this.gridY[this.gridY.length-1]) {
          this.pin_x=mouseX;
          this.pin_y=mouseY;
          this.showPin=1;
          this.pinCount=0;
          if (this.pinSound.isPlaying()){
            this.pinSound.stop();
          }
        }
  }
  displayPin(imageOn){
    if(this.showPin){
      let mapDiagonal = pow(pow(this.gridX[0]-this.gridX[this.gridX.length-1],2)+
                            pow(this.gridY[0]-this.gridY[this.gridY.length-1],2),0.5);

      if (this.pinCount==0){
        let distance = pow(pow(this.gridX[this.sprites_i]-this.pin_x,2)+
                           pow(this.gridY[this.sprites_j]-this.pin_y,2),0.5);
        //The smaller the distance, the higher the volume
        let volume = map(distance,0,mapDiagonal,1,0);
        this.pinSound.setVolume(volume);
        //The smaller the distance, the higher the frequency
        this.maxPinCount = map(distance,0,mapDiagonal,2,20);
        //Play sound
        this.pinSound.play();
      }

      if (imageOn) {
        let strokeW = mapDiagonal/500;
        let circleRadius = this.pinCount/this.maxPinCount*this.spritesHeight;
        push();
        stroke(255, 0, 0);
        strokeWeight(strokeW);
        noFill();
        circle(this.pin_x, this.pin_y, circleRadius*2);
        pop();
      }

      if (this.pinCount<this.maxPinCount){
        this.pinCount+=0.1;
      } else {
        this.pinCount=0;
      }
    }
  }
  victoryCheck(){
    if (this.t > this.pause) {
      if (77<=this.sprites_i<=82 && this.sprites_j== 1) {
        if (keyIsDown(UP_ARROW) && this.pKey == "UP_ARROW") {
          console.log("YOU WON!");
        }
      }
    }
  }
}

function mouseClicked(){
  main.pushPinCoords();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function hole (x,y,radius) {
  let wDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
  let radius_circle = (radius + wDiagonal)/2;
  let strokeW = windowDiagonal-radius;
  push();
  stroke(0, 0, 0);
  strokeWeight(strokeW);
  noFill();
  circle(x, y, radius_circle*2);
  pop();

}

// Lock scrolling on the page with DOWN_ARROW
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

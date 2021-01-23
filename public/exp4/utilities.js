// NOTE: this is needed before sketch.js

//let canSee = true; // NOTE: already set by HTML
let getUserType = {true: "sighted", false: "blind"}; // gets user type from canSee (call getUserType[canSee])

let otherId; // id of matched player
let preLobby = true; // lobby to wait the other user

let camPos = [0,0]; // distance in pixel between the top left of camera and top left of map
let tileSize = 40; // grid step size in pixels
let scaleGridImages = tileSize/100; // scaling factor for tile images (the width in files must be 100 px)

// Selects manually which are the tiles images to be loaded
let mapTiles2Load = ["el_86_86_86","el_127_127_127","el_162_128_104","el_226_228_0","el_0_0_0",
  "el_237_28_36","el_194_194_194","el_162_166_89","el_188_191_136","el_179_163_87","el_226_228_150"];

let mapImage; // assets/street/map.png : one pixel for each tile
let mapBoard = []; // list of lists of GridTile objects
let mapGridImages = {}; // dict mapping string of file name to mapImageLoader objects
let mapW = 50; // width of the map in tiles
let streetsStart = [4,27]; // y grid position of street tiles (for car horn sounds)

let fps = 20;
let main; // main character
let mousePointing = []; // list of mousePointer objects (red radar pin)
let entities = []; // list of Entity objects (cars and trams)
let entityImages = {}; // dict of strings mapping to mapImageLoader objects

let accident = -1; // == -1: there was no accident, >= 0: seconds since accident
let success = -1; // == -1: base, >= 0: seconds since end
let firstMove = false; // has pressed any key (to activate audio)

let pinSound, trafficNoise, accidentNoise, carHorn, cowBell; // sounds and audios

let speaker = new p5.Speech();
speaker.setLang("en-UK");

let sightedCol = 0;

// Draws map, characters and entities
function drawMap(limits = [0,mapBoard.length,0,mapBoard[0].length]) { // limits selects which tiles to show
  push();
  let wasInTile = false; // to select last tile of main char.
  for (var y = limits[2]; y < limits[3]; y++) {
    for (var x = limits[0]; x < limits[1]; x++) {
      if (isTileInCamera(x,y)) {
        mapBoard[x][y].display(); // shows the tile
        entities.forEach((en, ien) => { // shows entities
          if(en.gridPos[0] == x && en.gridPos[1] == y) {
            en.display();
          }
        });
        // Displays the character in the last possible frame
        if (!wasInTile && main.isInTile(x,y)) {
          wasInTile = true;
        }
        else if(wasInTile && !main.isInTile(x,y)) {
          main.display();
          wasInTile = false;
        }
      }
    }
  }
  pop();
}

// Finds whether the tile is visible (with a bit of a margin)
function isTileInCamera(xt,yt) {
  return (camPos[0] <= (xt+1)*tileSize &&
    camPos[0]+windowWidth >= (xt-8)*tileSize &&
    camPos[1] <= (yt+1)*tileSize &&
    camPos[1]+windowHeight >= (yt-1)*tileSize);
}

// Loader of images: needed because images are not passed by reference, but objects are
class mapImageLoader {
  constructor(path) {
    this.i = loadImage(path);
  }
}

// Object for map tiles (inside mapBoard)
class GridTile {
  constructor(xt,yt,pixel_color) {
    this.gridPos = [xt,yt];
    this.mapColor = pixel_color;
    this.mapColorName = "el_" +[String(pixel_color[0]),String(pixel_color[1]),String(pixel_color[2])].join("_");
    this.heightFromSoil = 0;
    this.imgset = false;
    if (mapGridImages[this.mapColorName] !== undefined) {
      this.img = mapGridImages[this.mapColorName];
      this.imgh = this.img.i.height*scaleGridImages; // Real height of shown image
      this.imgset = true;
      this.heightFromSoil = this.imgh - tileSize;
    }
  }
  display() {
    if (this.imgset)
      image(this.img.i,this.gridPos[0]*tileSize-camPos[0],this.gridPos[1]*tileSize-this.imgh+tileSize-camPos[1],tileSize,this.imgh);
  }
}

// Main Character class
class character {
  constructor(spritesFolder) {
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
    this.gridPos = [[7,1]]; // position on the grid
    this.pos = [(this.gridPos[0][0]+0.5)*tileSize,(this.gridPos[0][1]+0.5)*tileSize]; // center of grid tile
    this.pImage = this.front; //starting image
    this.spritesFrame = 0; //starting frame
    this.lastSpriteFrame = frameCount/fps; // last time the frame was updated
    this.timeStartMovement = 0; // time of beginning of the movement
    this.speed = 3; // movement speed
    this.heightFromSoil = 10; // starting height from soil (sidewalk)
  }

  // Is still inside one of the tiles?
  isInTile(xt,yt) {
    let result = false;
    this.gridPos.forEach((gp, igp) => {
      if (gp[0] == xt && gp[1] == yt) {
        result = true;
      }
    });
    return result;
  }

  // Move the camera and the character
  move() {
    if(!canSee) {
      if(this.pos[0]<camPos[0]+windowWidth/3){
        camPos[0] -= camPos[0]+windowWidth/3-this.pos[0];
      }
      if(this.pos[0]>camPos[0]+windowWidth*2/3){
        camPos[0] += this.pos[0]-camPos[0]-windowWidth*2/3;
      }
      if(this.pos[1]<camPos[1]+windowHeight/3){
        camPos[1] -= camPos[1]+windowHeight/3-this.pos[1];
      }
      if(this.pos[1]>camPos[1]+windowHeight*2/3){
        camPos[1] += this.pos[1]-camPos[1]-windowHeight*2/3;
      }
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        this.moveTile([-1,0]);
      }
      else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        this.moveTile([1,0]);
      }
      else if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        this.moveTile([0,-1]);
      }
      else if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        this.moveTile([0,1]);
      }
    }

    if (this.gridPos.length == 1) {
      this.pos = tileXYmid(this.gridPos[0]);
      this.spritesFrame = 0;
    }
    else if(this.gridPos.length == 2) { // is moving
      if (abs(this.lastSpriteFrame-frameCount/fps) > 0.10) {
        this.spritesFrame++;
        if (this.spritesFrame>3) {this.spritesFrame = 0;}
        this.lastSpriteFrame = frameCount/fps;
      }
      if (this.gridPos[0][0]<this.gridPos[1][0]) {
        this.pImage = this.right;
      }
      else if (this.gridPos[0][0]>this.gridPos[1][0]) {
        this.pImage = this.left;
      }
      else if (this.gridPos[0][1]<this.gridPos[1][1]) {
        this.pImage = this.front;
      }
      else if (this.gridPos[0][1]>this.gridPos[1][1]) {
        this.pImage = this.back;
      }

      this.pos[0] += (this.gridPos[1][0]-this.gridPos[0][0])/fps*tileSize*this.speed;
      this.pos[1] += (this.gridPos[1][1]-this.gridPos[0][1])/fps*tileSize*this.speed;
      // if has gone too far away
      if (distXY(this.pos,tileXYmid(this.gridPos[0]))>distXY(tileXYmid(this.gridPos[1]),tileXYmid(this.gridPos[0]))) {
        //this.pos = tileXYmid(this.gridPos[1]);
        this.gridPos.shift();
        this.heightFromSoil = mapBoard[this.gridPos[0][0]][this.gridPos[0][1]].heightFromSoil;
      }
    }
  }

  // Shows the character
  display() {
    let curimg = this.pImage[this.spritesFrame];
    push();
    let imgH = tileSize*curimg.height/curimg.width;
    if (accident>=0) {
      translate(tileSize/2+this.pos[0]-camPos[0]-tileSize/2,imgH/2+ this.pos[1]-camPos[1]-imgH+tileSize/2-this.heightFromSoil);
      rotate(PI*frameCount/fps);
      image(curimg, -tileSize/2, -imgH/2, tileSize, imgH);
    }
    else
      image(curimg, this.pos[0]-camPos[0]-tileSize/2, this.pos[1]-camPos[1]-imgH+tileSize/2-this.heightFromSoil, tileSize, imgH);
    pop();
  }

  // Movement: tries to change tile
  moveTile(direction) {
    if(this.gridPos.length == 1 && accident<0) { // is not moving
      let nextTile = [this.gridPos[0][0]+direction[0],this.gridPos[0][1]+direction[1]];
      if (isTileInMap(nextTile))
        if (abs(mapBoard[nextTile[0]][nextTile[1]].heightFromSoil-this.heightFromSoil)<=tileSize/2) {
          this.gridPos.push(nextTile);
          this.updateTile(this.gridPos, this.pos);
            let message = {
              gridPos : this.gridPos,
              pos : this.pos,
              name: "main",
              recipient : otherId
            }
            socket.emit("forwardEntityMsg", message);
        }
    }
  }

  // Movement: updateTiles
  updateTile(newGridPos, newpos) {
    this.gridPos = newGridPos;
    if (this.gridPos[0][1]>=35 && success < 0 && !canSee) {
      success = 0;
    }
    this.pos = newpos;
    this.timeStartMovement = frameCount/fps;
    for (var i = 0; i < streetsStart.length; i++)
      if(streetsStart[i] == this.gridPos[1][1]) {
        streetsStart[i] = -1;
        carHorn.play();
        carHorn.setVolume(0.1);
      }
  }

}

// Radar pin class
class mousePointer {
  constructor(x,y) {
    this.pos = [x,y];
    this.t = 0;
    this.lastBeep = -1000;
    this.sound = pinSound;
    this.sound.setVolume(0.5);
    this.sound.play();
  }

  // Shows it
  display() {
    let volume = (1-this.distwithmain()/dist(0,0,windowWidth,windowHeight))**2;
    this.sound.setVolume(min(1,volume+0.5));
    if (abs(this.t-this.lastBeep)>(1-volume)*2){
      let dd = distanceDir(main.pos,this.pos);
      this.sound.rate(dd/4+0.5);
      this.sound.play();
      this.lastBeep = this.t;
    }
    push();
    stroke(255,0,0);
    fill(200,0,0,100);
    strokeWeight(2);
    ellipse(this.pos[0]-camPos[0],this.pos[1]-camPos[1],tileSize*sin(this.t*PI));
    pop();
    this.t += 1/fps;
  }

  // Gets the distance between pin and main
  distwithmain() {
    return dist(this.pos[0],this.pos[1],main.pos[0],main.pos[1]);
  }
}

// Clicks --> Pin
function mouseClicked() {
  if (canSee) {
    let px = mouseX+camPos[0];
    let py = mouseY+camPos[1];

    if(isTileInMap(gridFromPos([px,py]))) {
      mousePointingInteraction(px,py);

      let message = {
        x: px,
        y: py,
        showPin: true,
        recipient: otherId
      }
      socket.emit("forwardPingMsg", message);
    }
  }
}

// Interacting with mousePointer (pin)
function mousePointingInteraction(inX,inY) {
  let isdel = -1;
  mousePointing.forEach((mp, i) => {
    if (distXY(mp.pos,[inX,inY])<tileSize) {
      isdel = i;
    }
  });
  if (isdel>=0) { // if he/she is deleting
    mousePointing.splice(isdel,1);
  }
  else { // if she/he is adding
    mousePointing.push(new mousePointer(inX,inY));
  }
}

// Is tile outside borders?
function isTileInMap(tile) {
  return (tile[0]>=0 && tile[1]>=0 && tile[0] < mapBoard.length && tile[1] < mapBoard[0].length);
}

// Gets the mid position from tile
function tileXYmid(tilePos) {
  return [(tilePos[0]+0.5)*tileSize,(tilePos[1]+0.5)*tileSize];
}

// Gets the distance between points
function distXY(pos1,pos2) {
  return dist(pos1[0],pos1[1],pos2[0],pos2[1]);
}

// If canSee == false most of the screen is hidden
function hole(x,y,radius) {
  let wDiagonal = dist(0,0,windowWidth,windowHeight);
  let radius_circle = (radius + wDiagonal)/2;
  push();
  stroke(0, 0, 0);
  strokeWeight(wDiagonal-radius);
  noFill();
  circle(x, y, radius_circle*2);
  pop();
}

// Gets the relative position (right,bottom,left,top) between two points
function distanceDir(posMain,posObj) {
  let distX = posMain[0]-posObj[0];
  let distY = posMain[1]-posObj[1];
  if(distX>=distY && distX>=-distY) {
    return 1;
  }
  else if (distX>=distY && distX<-distY) {
    return 2;
  }
  else if (distX<distY && distX>=-distY) {
    return 0;
  }
  else if (distX<distY && distX<-distY) {
    return 3;
  }
}

// Gets position on the grid from point
function gridFromPos(pos){
  return [floor(pos[0]/tileSize),floor(pos[1]/tileSize)];
}

// Is grid element in grid list?
function isGridInListOfGrids(grid,listOfGrid){
  let result = false;
  listOfGrid.forEach((lg, i) => {
    if(lg[0] == grid[0] && lg[1] == grid[1])
      result = true;
  });
  return result;
}

// Entities class (cars, trams)
class Entity {
  constructor(name, mapImageClass, gridPos, speed = [-200,0],occupiedTiles = [5,2]) {
    this.name = name;
    this.img = mapImageClass;
    this.gridPos = gridPos; // bottom right
    this.pos = [(gridPos[0]+1)*tileSize-1,(gridPos[1]+1)*tileSize-1]; // bottom right pos
    this.startingPos = [this.pos[0],this.pos[1]];
    this.speed = speed; // array
    this.occupiedTiles = occupiedTiles; //the ones it stands on
    this.toDel = false;
  }

  // Moves it
  move(){
    this.pos[0] = (this.startingPos[0] + frameCount*this.speed[0]/fps)%(mapW*tileSize);
    if (this.pos[0] < 0) {
      this.pos[0] += mapBoard.length*tileSize;
    }
    this.pos[1] = (this.startingPos[1] + frameCount*this.speed[1]/fps)%(mapW*tileSize);
    if (this.pos[1] < 0) {
      this.pos[1] += mapBoard[1].length*tileSize;
    }
    this.gridPos = gridFromPos(this.pos);
    if (!isTileInMap(this.gridPos)){
      //this.toDel = true;
      let side = 1;
      if (this.gridPos[0]>0) {
        side = -1;
      }
      this.gridPos[0] += side*mapW;
      this.pos[0] += side*mapW*tileSize;
    }
    if (accident < 0 && this.collision() && !canSee){
      accident = 0.0;
      accidentNoise.play();
      accidentNoise.setVolume(1);
    }
  }

  // Shows it
  display() {
    push();
    let w = this.occupiedTiles[0]*tileSize;
    let h = w*this.img.i.height/this.img.i.width;
    let distBorder = min(abs(this.pos[0]),abs(mapW*tileSize - this.pos[0]));
    /*if (distBorder<this.occupiedTiles[0]*tileSize) {
      //tint(255,255*distBorder/this.occupiedTiles[0]*tileSize); // too slow
      w=distBorder;
    }*/
    image(this.img.i,this.pos[0]-w-camPos[0],this.pos[1]-h-camPos[1],w,h);
    pop();
  }

  // Is it colliding with main?
  collision() {
    let result = false;
    for (var xt = this.pos[0]; xt > this.pos[0]-this.occupiedTiles[0]*tileSize; xt-=tileSize) {
      for (var yt = this.pos[1]; yt > this.pos[1]-this.occupiedTiles[1]*tileSize; yt-=tileSize) {
        let curGrid = gridFromPos([xt,yt]);
        if(isGridInListOfGrids(curGrid,main.gridPos)) {
          xt = this.pos[0]-this.occupiedTiles[0]*tileSize;
          yt = this.pos[1]-this.occupiedTiles[1]*tileSize;
          result = true;
        }
      }
    }
    return result;
  }
}

// Resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Lock scrolling on the page with DOWN_ARROW
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    if(!firstMove) {
      trafficNoise.loop();
      trafficNoise.volume(0.2);
      firstMove = true;
    }
}, false);

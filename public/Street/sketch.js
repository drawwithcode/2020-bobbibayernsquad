let streetImages = [];
let camPos = [100,100]; // distance in pixel between the top left of camera and top left of map
let tileSize = 40; // grid step size in pixels
let mapImage;
let mapBoard = [];
let mapGridImages = {};
let scaleGridImages = tileSize/100;
let fps = 20;
let canSee = true;
let main;
let mousePointing = [];
let pinSound;
let entities = [];
let mapW = 50;
let entityImages = {};
let accident = -1;
let trafficNoise, accidentNoise, carHorn, cowBell;
let firstMove = false;
let streetsStart = [4,27];
//let entityByPosition = [];

let mapTiles2Load = ["el_86_86_86","el_127_127_127","el_162_128_104","el_226_228_0","el_0_0_0",
  "el_237_28_36","el_194_194_194","el_162_166_89","el_188_191_136","el_179_163_87","el_226_228_150"];
  //,"el_226_228_150","el_211_215_100","el_202_205_61","el_179_163_87"

function preload(){
  trafficNoise = createAudio('assets/Sounds/city_traffic.ogg');
  accidentNoise = loadSound('assets/Sounds/crash_metal_sweetener_distant.ogg');
  carHorn = loadSound('assets/Sounds/car_horn.ogg');
  cowBell = loadSound('assets/Sounds/cartoon_cowbell.ogg');
  mapImage = loadImage("assets/street/map.png");
  mapTiles2Load.forEach((colname, i) => {
    if (mapGridImages[colname] === undefined) {
      //print(curTile.mapColorName);
      let path = "assets/street/"+colname+".png";
      mapGridImages[colname] = new mapImageLoader(path);// loadImage(path);
    }
  });

  entityImages["carL"] = new mapImageLoader("assets/entities/CarLeft.png");
  entityImages["tramL"] = new mapImageLoader("assets/entities/TramLeft.png");
  entityImages["carR"] = new mapImageLoader("assets/entities/CarRight.png");
  entityImages["tramR"] = new mapImageLoader("assets/entities/TramRight.png");

  randomSeed(420);
  [5,8,11].forEach((yt, iyt) => {
    let xt = 5;
    while (xt<mapW) {
      entities.push(new Entity("car",entityImages["carL"],[xt,yt],[-yt*30,0]));
      xt += round(random(8,10+yt*2));
    }
  });

  let xt = 10, yt = 18;
  while (xt<mapW) {
    entities.push(new Entity("tram",entityImages["tramL"],[xt,yt],[-300,0],[10,2]));
    xt += round(random(20,32));
  }

  xt = mapW-10;
  yt = 21;
  while (xt>0) {
    entities.push(new Entity("tram",entityImages["tramR"],[xt,yt],[300,0],[10,2]));
    xt -= round(random(20,32));
  }


  [28,31,34].forEach((yt, iyt) => {
    let xt =  mapW-5;
    while (xt>0) {
      entities.push(new Entity("car",entityImages["carR"],[xt,yt],[(39-yt)*30,0]));
      xt -= round(random(8,10+(39-yt)*2));
    }
  });

  main = new character("assets/Sprites");
  pinSound = loadSound("assets/Sounds/pin.mp3");
}

function setup() {
  // Loads map tiles
  for (let x = 0; x < mapImage.width; x++) {
    let hline = [];
    for (let y = 0; y < mapImage.height; y++) {
      let curTile = new GridTile(x,y,mapImage.get(x,y));
      hline.push(curTile);
    }
    mapBoard.push(hline);
  }

  createCanvas(windowWidth,windowHeight);
  frameRate(fps);
}

function draw() {
  if (canSee){
    if (keyIsDown(65)){ //(mouseX<windowWidth/5) {
      camPos[0]-=200/fps;
    }
    if (keyIsDown(87)){ //(mouseY<windowHeight/5) {
      camPos[1]-=200/fps;
    }
    if (keyIsDown(68)){ //(mouseX>windowWidth*4/5) {
      camPos[0]+=200/fps;
    }
    if (keyIsDown(83)){ //(mouseY>windowHeight*4/5) {
      camPos[1]+=200/fps;
    }
  }


  background("black");

  //image(mapImage,0,0);
  //main.display();
  main.move();
  entities.forEach((en, ien) => {
    en.move();
  });
  let todel = -1;
  do {
    let todel = -1;
    entities.forEach((en, ien) => {
      if (en.toDel)
        todel = ien;
    });
    if (todel != -1)
      entities.splice(todel,1);
  } while (todel != -1);


  drawMap();
  let shift = -1;
  mousePointing.forEach((mp, i) => {
    mp.display();
    let mainGP = gridFromPos(main.pos);
    let pinGP = gridFromPos(mp.pos);
    if (mainGP[0] == pinGP[0] && mainGP[1] == pinGP[1]) {
      shift = i;
      cowBell.play();
    }
  });
  if(shift>=0) mousePointing.splice(shift,1);

  if(accident>=0){
    accident += 1/fps;
    push();
    fill(255,0,0,max(100-accident*10,0));
    rect(0,0,windowWidth,windowHeight);
    pop();
    if (100-accident*10<=0) {
      location.reload();
    }
  }
  else if (!canSee)
    hole(main.pos[0]-camPos[0],main.pos[1]-camPos[1],tileSize*1.5);
}

function drawMap(limits = [0,mapBoard.length,0,mapBoard[0].length]) {
  push();
  stroke(255,0,0);
  strokeWeight(2);
  let wasInTile = false;
  for (var y = limits[2]; y < limits[3]; y++) {
    for (var x = limits[0]; x < limits[1]; x++) {
      if (isTileInCamera(x,y)) {
        mapBoard[x][y].display();

        entities.forEach((en, ien) => {
          if(en.gridPos[0] == x && en.gridPos[1] == y) {
            en.display();
          }
        });

        // Displays the character in the frame after the one he is in
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
  if(canSee) {
    //  filter(INVERT);
  }
  pop();
}

function isTileInCamera(xt,yt) {
  return (camPos[0] <= (xt+1)*tileSize &&
    camPos[0]+windowWidth >= (xt-8)*tileSize &&
    camPos[1] <= (yt+1)*tileSize &&
    camPos[1]+windowHeight >= (yt-1)*tileSize);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    main.moveTile([-1,0]);
  } else if (keyCode === RIGHT_ARROW) {
    main.moveTile([1,0]);
  } else if (keyCode === UP_ARROW) {
    main.moveTile([0,-1]);
  } else if (keyCode === DOWN_ARROW) {
    main.moveTile([0,1]);
  }
}

class mapImageLoader {
  constructor(path) {
    this.i = loadImage(path);
  }
}

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
    this.gridPos = [[7,1]];
    this.pos = [(this.gridPos[0][0]+0.5)*tileSize,(this.gridPos[0][1]+0.5)*tileSize]; // center of grid tile
    this.pImage = this.front[0];
    this.spritesFrame = 0;
    this.lastSpriteFrame = frameCount/fps;
    this.timeStartMovement = 0;
    this.speed = 3;
    this.heightFromSoil = 10;
  }

  isInTile(xt,yt) {
    let result = false;
    this.gridPos.forEach((gp, igp) => {
      if (gp[0] == xt && gp[1] == yt) {
        result = true;
      }
    });
    return result;
  }

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
    }
    if (keyIsDown(LEFT_ARROW)) {
      this.moveTile([-1,0]);
      if (this.pKey == "LEFT_ARROW" && this.sprites_i!=0) {
        this.pImage = this.left[this.spritesFrame];
      } else {
        this.pImage = this.left[0];
      }
      this.pKey = "LEFT_ARROW";
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      this.moveTile([1,0]);
      if (this.pKey == "RIGHT_ARROW" && this.sprites_i!=this.gridNodesX-1) {
        this.pImage = this.right[this.spritesFrame];
      } else {
        this.pImage = this.right[0];
      }
      this.pKey = "RIGHT_ARROW";
    }
    else if (keyIsDown(UP_ARROW)) {
      this.moveTile([0,-1]);
      if (this.pKey == "UP_ARROW" && this.sprites_j!=0) {
        this.pImage = this.back[this.spritesFrame];
      } else {
        this.pImage = this.back[0];
      }
      this.pKey = "UP_ARROW";
    }
    else if (keyIsDown(DOWN_ARROW)) {
      this.moveTile([0,1]);
      if (this.pKey == "DOWN_ARROW" && this.sprites_j!=this.gridNodesY-1) {
        this.pImage = this.front[this.spritesFrame];
      } else {
        this.pImage = this.front[0];
      }
      this.pKey = "DOWN_ARROW";
    }
    else {
      if (this.gridPos.length == 1)
        this.pos = tileXYmid(this.gridPos[0]);
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
    if (abs(this.lastSpriteFrame-frameCount/fps) > 0.15) {
      this.spritesFrame++;
      if (this.spritesFrame>3) {this.spritesFrame = 0;}
      this.lastSpriteFrame = frameCount/fps;
    }
    if(this.gridPos.length == 2) { // is moving
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

  display() {
    push();
    let imgH = tileSize*this.pImage.height/this.pImage.width;
    if (accident>=0) {
      translate(tileSize/2+this.pos[0]-camPos[0]-tileSize/2,imgH/2+ this.pos[1]-camPos[1]-imgH+tileSize/2-this.heightFromSoil);
      rotate(PI*frameCount/fps);
      image(this.pImage, -tileSize/2, -imgH/2, tileSize, imgH);
    }
    else
      image(this.pImage, this.pos[0]-camPos[0]-tileSize/2, this.pos[1]-camPos[1]-imgH+tileSize/2-this.heightFromSoil, tileSize, imgH);
    pop();
  }
  moveTile(direction) {
    if(this.gridPos.length == 1 && accident<0) { // is not moving
      let nextTile = [this.gridPos[0][0]+direction[0],this.gridPos[0][1]+direction[1]];
      if (isTileInMap(nextTile))
        if (abs(mapBoard[nextTile[0]][nextTile[1]].heightFromSoil-this.heightFromSoil)<=tileSize/2) {
          this.gridPos.push(nextTile);
          this.timeStartMovement = frameCount/fps;
          for (var i = 0; i < streetsStart.length; i++)
            if(streetsStart[i] == this.gridPos[1][1]) {
              streetsStart[i] = -1;
              carHorn.play();
              carHorn.setVolume(0.1);
            }
        }
    }
  }
}

class mousePointer {
  constructor(x,y) {
    this.pos = [x,y];
    this.t = 0;
    this.lastBeep = -1000;
    this.sound = pinSound;
    this.sound.setVolume(0.5);
    this.sound.play();
  }
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
  distwithmain() {
    return dist(this.pos[0],this.pos[1],main.pos[0],main.pos[1]);
  }
}

function mouseClicked() {
  if (canSee) {
    mousePointingInteraction();
  }
}
function mousePointingInteraction() {
  let isdel = -1;
  mousePointing.forEach((mp, i) => {
    if (distXY(mp.pos,[mouseX+camPos[0],mouseY+camPos[1]])<tileSize) {
      isdel = i;
    }
  });
  if (isdel>=0) {
    mousePointing.splice(isdel,1);
  }
  else {
    mousePointing.push(new mousePointer(mouseX+camPos[0],mouseY+camPos[1]));
  }
}

function isTileInMap(tile) {
  return (tile[0]>=0 && tile[1]>=0 && tile[0] < mapBoard.length && tile[1] < mapBoard[0].length);
}

function tileXYmid(tilePos) {
  return [(tilePos[0]+0.5)*tileSize,(tilePos[1]+0.5)*tileSize];
}
function distXY(pos1,pos2) {
  return dist(pos1[0],pos1[1],pos2[0],pos2[1]);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


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

function gridFromPos(pos){
  return [floor(pos[0]/tileSize),floor(pos[1]/tileSize)];
}
function isGridInListOfGrids(grid,listOfGrid){
  let result = false;
  listOfGrid.forEach((lg, i) => {
    if(lg[0] == grid[0] && lg[1] == grid[1])
      result = true;
  });
  return result;
}

class Entity {
  constructor(name,mapImageClass,gridPos,speed = [-200,0],occupiedTiles = [5,2]) {
    this.name = name;
    this.img = mapImageClass;
    this.gridPos = gridPos; // bottom right
    this.pos = [(gridPos[0]+1)*tileSize-1,(gridPos[1]+1)*tileSize-1]; // bottom right pos
    this.speed = speed; // array
    this.occupiedTiles = occupiedTiles; //the ones it stands on
    this.toDel = false;
  }
  move(){
    this.pos[0] += this.speed[0]/fps;
    this.pos[1] += this.speed[1]/fps;
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
    if (accident < 0 && this.collision()){
      accident = 0.0;
      accidentNoise.play();
      accidentNoise.setVolume(1);
    }
  }
  display() {
    push();
    let w = this.occupiedTiles[0]*tileSize;
    let h = w*this.img.i.height/this.img.i.width;
    let distBorder = min(abs(this.pos[0]),abs(mapW*tileSize - this.pos[0]));
    if (distBorder<this.occupiedTiles[0]*tileSize) {
      //tint(255,255*distBorder/this.occupiedTiles[0]*tileSize); // too slow
      w=distBorder;
    }
    image(this.img.i,this.pos[0]-w-camPos[0],this.pos[1]-h-camPos[1],w,h);
    pop();
  }
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

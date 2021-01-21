////////// GLOBAL VARIABLES FOR PAGE ELEMENTS & OTHER //////////
let cnv; //canvas
let shown = false;
let success = false; //the bell has been found: end of the experience

let theX = 1;
let theY = 1;
let easing = 0.1;

////////// GLOBAL VARIABLES FOR THE ITEMS ON THE TABLE //////////
//images
let items = []; //the array of objects placed on the table, including:
let imgBell;
let imgCoins;
let imgCupStanding;
let imgGlasses;
let imgKeys;
let imgNotepad;
let imgPapers;
let imgPc;
let imgPens;
//sounds
let sndBell;
let sndCoins;
let sndCupStanding;
let sndGlasses;
let sndKeys;
let sndNotepad;
let sndPapers;
let sndPc;
let sndPens;
let sndTable = [];


function preload() {
  ////////// IMAGES PRELOAD //////////
  imgBell = loadImage("./assets/images/bell.png");
  imgCoins = loadImage("./assets/images/coins.png");
  imgCupStanding = loadImage("./assets/images/cup-standing.png");
  imgGlasses = loadImage("./assets/images/glasses.png");
  imgKeys = loadImage("./assets/images/keys.png");
  imgNotepad = loadImage("./assets/images/notepad.png");
  imgPapers = loadImage("./assets/images/papers.png");
  imgPc = loadImage("./assets/images/pc.png");
  imgPens = loadImage("./assets/images/pens.png");
  ////////// SOUNDS PRELOAD //////////
  soundFormats("mp3", "wav");
  sndBell = loadSound("./assets/sounds/bell.mp3");
  sndCoins = loadSound("./assets/sounds/coins.mp3");
  sndCupStanding = loadSound("./assets/sounds/cup-standing.mp3");
  sndGlasses = loadSound("./assets/sounds/glasses.mp3");
  sndKeys = loadSound("./assets/sounds/keys.mp3");
  sndNotepad = loadSound("./assets/sounds/notepad.mp3");
  sndPapers = loadSound("./assets/sounds/papers.mp3");
  sndPc = loadSound("./assets/sounds/pc.mp3");
  sndPens = loadSound("./assets/sounds/pens.mp3");
  for (let i = 0; i < 2; i++) {
    sndTable[i] = loadSound("./assets/sounds/table" + i + ".mp3");
  }
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  ////////// CANVAS SETTINGS //////////
  cnv = createCanvas(windowWidth,windowHeight);
  cnv.style("z-index", "-1");
  centerCanvas();
  //cnv.style('background-color', 'white');

  ////////// SCENE SETTING //////////
  items[0] = new Item(imgBell);
  items[1] = new Item(imgCoins);
  items[2] = new Item(imgCupStanding);
  items[3] = new Item(imgGlasses);
  items[4] = new Item(imgKeys);
  items[5] = new Item(imgNotepad);
  items[6] = new Item(imgPapers);
  items[7] = new Item(imgPc);
  items[8] = new Item(imgPens);

  ////////// PAGE ELEMENTS //////////
  //...

}

function mousePressed() {
  ////////// CLICK EVENTS //////////
  //whenever an object is clicked, its specific sound is played
  //items that are shown on top of others are played first, as they are the ones to be touched by the user in an overlapping scenario
  if (items[0].clicked()) {
    items[0].play(sndBell);

    //the page changes since the activity has finished
    success = true;
    //document.getElementById("t").style.color = "black";
    let a = select('#t');
    a.style('color', 'black');

  } else if (items[8].clicked()) {
    items[8].play(sndPens);
  } else if (items[2].clicked()) {
    items[2].play(sndCupStanding);
  } else if (items[4].clicked()) {
    items[4].play(sndKeys);
  } else if (items[1].clicked()) {
    items[1].play(sndCoins);
  } else if (items[3].clicked()) {
    items[3].play(sndGlasses);
  } else if (items[5].clicked()) {
    items[5].play(sndNotepad);
  } else if (items[6].clicked()) {
    items[6].play(sndPapers);
  } else if (items[7].clicked()) {
    items[7].play(sndPc);
  } else {
  //whenever the user clicks elsewhere, the sound of the table being touched is played
    let anySndTable = random(sndTable);
    anySndTable.play();
  }
}

function draw() {
  ////////// SCENE SETTING //////////
  background("white");

  //first drawing the objects that are more likely to be overlapped by others in a real desk setting, then the others
  items[7].show(imgPc.width, imgPc.height, 429);
  items[6].show(imgPapers.width, imgPapers.height, 253);
  items[5].show(imgNotepad.width, imgNotepad.height, 123);
  items[3].show(imgGlasses.width, imgGlasses.height, 214);
  items[1].show(imgCoins.width, imgCoins.height, 50);
  items[4].show(imgKeys.width, imgKeys.height, 63);
  items[2].show(imgCupStanding.width, imgCupStanding.height, 155);
  items[8].show(imgPens.width, imgPens.height, 223);
  items[0].show(imgBell.width, imgBell.height, 103);

  //avoiding for the objects to overlap on one another
  isOverlap();
  if (!shown) {
    shown = true;
    solveOverlap();
  }

  //covering the canvas so that the user does not see the items on the table
  if (!success) {
    fill("black");
    rect(0, 0, windowWidth*2, windowHeight*2);
  }

  //ellipse following the mouse
  push();
  stroke("white");
  strokeWeight(1);
  noFill();
  let targetX = mouseX;
  let pastX = targetX - theX;
  theX += pastX * easing;
  let targetY = mouseY;
  let pastY = targetY - theY;
  theY += pastY * easing;
  ellipse(theX,theY,60);
  pop();

}

function solveOverlap() {
  let i = 0;
  while (isOverlap() && i < 200) {
    i++;
    console.log("!");
  }
}

function isOverlap() {
  let result = false;
  for (var i = 0; i < items.length; i++) {
    let diagi = dist(0, 0, items[i].w/2, items[i].h/2);
    for (var j = 0; j < items.length; j++) {
      let diagj = dist(0, 0, items[j].w/2, items[j].h/2);
      if (i !=j && dist(items[i].x, items[i].y, items[j].x, items[j].y) < (diagi + diagj)/1.1) {
        let dx = 0;
        let dy = 0;
        let speed = 10;
        if (items[j].x > items[i].x) {
          dx += speed;
        } else {
          dx -= speed;
        }
        if (items[j].y > items[i].y) {
          dy += speed;
        } else {
          dy -= speed;
        }
        if (dx + items[j].x < 80 || dx + items[j].x > windowWidth - 80) {
          dx = 0;
        }
        if (dy + items[j].y < 80 || dy + items[j].y > windowHeight - 80) {
          dy = 0;
        }
        if (dx !=0 || dy !=0) {
          items[j].x += dx;
          items[j].y += dy;
          result = true;
        }
      }
    }
  }
  return result;
}

function windowResized() {
  //centerCanvas();
  resizeCanvas(windowWidth, windowHeight);
}

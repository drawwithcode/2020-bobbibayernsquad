////////// GLOBAL VARIABLES FOR PAGE ELEMENTS //////////
let cnv; //canvas

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


function preload(){
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
  items[0].clicked(sndBell);
  items[1].clicked(sndCoins);
  items[2].clicked(sndCupStanding);
  items[3].clicked(sndGlasses);
  items[4].clicked(sndKeys);
  items[5].clicked(sndNotepad);
  items[6].clicked(sndPapers);
  items[7].clicked(sndPc);
  items[8].clicked(sndPens);

  //let anySndTable = random(sndTable); //voglio che anySndTable venga riprodotto quando clicco su parti vuote del canvas

}

function draw() {
  ////////// SCENE SETTING //////////
  items[0].show(imgBell.width, imgBell.height, 103);
  items[1].show(imgCoins.width, imgCoins.height, 50);
  items[2].show(imgCupStanding.width, imgCupStanding.height, 155);
  items[3].show(imgGlasses.width, imgGlasses.height, 214);
  items[4].show(imgKeys.width, imgKeys.height, 63);
  items[5].show(imgNotepad.width, imgNotepad.height, 123);
  items[6].show(imgPapers.width, imgPapers.height, 253);
  items[7].show(imgPc.width, imgPc.height, 429);
  items[8].show(imgPens.width, imgPens.height, 223);
}


function windowResized() {
  centerCanvas();
}

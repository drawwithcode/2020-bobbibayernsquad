////////// GLOBAL VARIABLES FOR PAGE ELEMENTS & OTHER //////////
let cnv; //canvas
let success = false; //the bell has been found: end of the experience

let theX = 1;
let theY = 1;
let easing = 0.1;

let echos = [];

////////// GLOBAL VARIABLES FOR THE ITEMS ON THE TABLE //////////
let items = [];
let itemsPosition = [];
let itemsDimensions = [];
let images = [];
let sounds = [];
let sndTable = [];
let refs = [];


function preload() {
  ////////// IMAGES PRELOAD //////////
  images.push(loadImage("assets/images/papers.png"));
  refs.push(253);
  images.push(loadImage("assets/images/pc.png"));
  refs.push(429);
  images.push(loadImage("assets/images/pens.png"));
  refs.push(223);
  images.push(loadImage("assets/images/glasses.png"));
  refs.push(214);
  images.push(loadImage("assets/images/cup-standing.png"));
  refs.push(155);
  images.push(loadImage("assets/images/notepad.png"));
  refs.push(123);
  images.push(loadImage("assets/images/bell.png"));
  refs.push(103);
  images.push(loadImage("assets/images/keys.png"));
  refs.push(63);
  images.push(loadImage("assets/images/coins.png"));
  refs.push(50);

  ////////// SOUNDS PRELOAD //////////
  soundFormats("mp3", "wav");
  sounds.push(loadSound("assets/sounds/papers.mp3")); //0
  sounds.push(loadSound("assets/sounds/pc.mp3")); //1
  sounds.push(loadSound("assets/sounds/pens.mp3")); //2
  sounds.push(loadSound("assets/sounds/glasses.mp3")); //3
  sounds.push(loadSound("assets/sounds/cup-standing.mp3")); //4
  sounds.push(loadSound("assets/sounds/notepad.mp3")); //5
  sounds.push(loadSound("assets/sounds/bell.mp3")); //6
  sounds.push(loadSound("assets/sounds/keys.mp3"));
  sounds.push(loadSound("assets/sounds/coins.mp3"));


  for (let i = 0; i < 2; i++) {
    sndTable[i] = loadSound("assets/sounds/table" + i + ".mp3");
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
  let margin = 80;
  for (let i=0; i<images.length; i++) {
    let xy = getXY(margin, i);
    items.push(new Item(images[i],sounds[i],xy[0],xy[1],refs[i]));
    itemsPosition.push([items[i].x, items[i].y]);
    itemsDimensions.push([items[i].w, items[i].h]);
  }

  ////////// PAGE ELEMENTS //////////
  //pat animation at the bottom
  var animation = bodymovin.loadAnimation({
    container: document.getElementById('anim'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'pat-animation-wh.json'
  })
}

function mousePressed() {
  ////////// CLICK EVENTS //////////
  //whenever an object is clicked, its specific sound is played
  //items that are shown on top of others are played first, as they are the ones to be touched by the user in an overlapping scenario
  let soundPlayed = false;
  for (let i=0;i<items.length;i++) {
    if (items[i].clicked()) {
      items[i].play();
      soundPlayed=true;
      if (i==6) {
        //the page changes since the activity has finished
        success = true;
        //document.getElementById("t").style.color = "black";
        let t = select('#t');
        t.style('color', 'black');
        let ia = select('#ia');
        ia.hide();
        let ib = select('#ib');
        ib.hide();
        let anim = select('#anim');
        anim.style('filter', 'invert(100%)');
      }
    }
  }
  if (!soundPlayed) {
    let anySndTable = random(sndTable);
    anySndTable.play();
  }

  //new sound echo shows on touch
  let clickEcho = new Echo();
  echos.push(clickEcho);
  if (echos.length > 20) {
    echos.splice(0, 1);
  }
}

function draw() {
  ////////// SCENE SETTING //////////
  background("white");

  //drawing the objects
  for (let i=0; i<items.length; i++) {
    items[i].scale();
    items[i].show();
  }

  //covering the canvas so that the user does not see the items on the table
  if (!success) {
    push();
    fill("black");
    //fill('rgba(0,0,0,0.2)'); //for testing
    rect(-windowWidth/2, -windowHeight/2, windowWidth*2, windowHeight*2);
    pop();
  }

  //echos
  for (var i = 0; i < echos.length; i++) {
    let clickEcho = echos[i];
    clickEcho.display();
  }

  //ellipse following the mouse
  push();
  if (!success) {
    stroke("white");
  } else { stroke("black") };
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

function checkOverlaps (x,y) {
  for (let i=0; i<itemsPosition.length; i++) {
    if (x > itemsPosition[i][0] - itemsDimensions[i][0]/2 &&
        x < itemsPosition[i][0] + itemsDimensions[i][0]/2 &&
        y > itemsPosition[i][1] - itemsDimensions[i][1]/2 &&
        y < itemsPosition[i][1] + itemsDimensions[i][1]/2) {
      return true;
    }
  }
  return false;
}

function getXY (margin, i) {
  let x;
  let y;
  let windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
  let scale = windowDiagonal*0.8 / (1280 / refs[i] * images[i].width);
  let w = images[i].width*scale;
  let h = w * images[i].height / images[i].width; //the height of the image always stays proportional to its width
  let overlapped =true;
  let j=0;
  while (overlapped) {
    x = floor(random(margin, windowWidth - margin));
    y = floor(random(margin, windowHeight - margin));
    if (!(checkOverlaps(x,y) ||
        checkOverlaps(x-w/2,y-h/2) || checkOverlaps(x-w/2,y+h/2) ||
        checkOverlaps(x+w/2,y-h/2) || checkOverlaps(x+w/2,y+h/2))) {
          overlapped = false;
    }
    j++;
    console.log(j);
  }
  return [x,y];
}

function windowResized() {
  //centerCanvas();
  resizeCanvas(windowWidth, windowHeight);
}

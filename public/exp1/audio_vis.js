
function preload(){
  audio = loadSound('assets/sounds/beach.m4a');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  background('black');
  audio.setVolume(0.5);
  audio.play();
  audio.setVolume(0, 1, 16);

}

function draw(){

}

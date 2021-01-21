function preload(){
  audio = loadSound('assets/sounds/australia summer midday.mp3');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  background('black');
  audio.setVolume(0.5);
  audio.play();
  audio.setVolume(0, 1, 16);

}

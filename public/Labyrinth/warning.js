

function preload(){

}

function setup() {
  createCanvas(windowWidth,windowHeight);
}

function draw() {

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Lock scrolling on the page with DOWN_ARROW
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

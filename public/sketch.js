// Create a new connection using socket.io (imported in index.html)
let socket = io();

// define the function that will be called on a new newConnection
socket.on("connect", newConnection);

function newConnection() {
  console.log("your id:", socket.id);
}

// Define which function should be called when a new message
// comes from the server with type "mouseBroadcast"

socket.on("mouseBroadcast", otherMouse);

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("red");

  //Button
  let diagonal = pow(pow(windowWidth,2)+pow(windowHeight,2), 0.5);
  button = createButton("OPEN LABYRINTH");
  let xSizeB = windowWidth/6;
  let ySizeB = windowHeight/13;
  button.size(xSizeB, ySizeB);
  button.position(windowWidth/2-xSizeB/2, windowHeight*2/3-ySizeB/2);
  button.style("font-size", diagonal/60+"px");
  button.style("font-family", "Comic Sans MS");
  button.style('background-color', color("#38b000"));
  button.style("text-align", "center");
  button.mousePressed(function() {
    console.log("button pressed");
    window.open("./Maurizio/index.html", "_self");
  });
}

// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function otherMouse(data) {
  //console.log("received:", data);
  noStroke();
  fill("yellow");
  ellipse(data.x, data.y, 20);
}

function mouseDragged() {
  console.log("sending: ", mouseX, mouseY);
  noStroke();
  fill(255);
  // create an object containing the mouse position
  let message = {
    x: mouseX,
    y: mouseY,
  };
  // send the object to server,
  // tag it as "mouse" event
  socket.emit("mouse", message);

  ellipse(mouseX, mouseY, 20);
}

function draw() {
  // evert draw cycle, add a background with low opacity
  // to create the "fade" effect
  background(0, 5);
}

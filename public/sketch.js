function setup() {
  createCanvas(windowWidth, windowHeight);
  background("red");

  //Button Sighted
  let diagonal = pow(pow(windowWidth,2)+pow(windowHeight,2), 0.5);
  let xSizeB = windowWidth/6;
  let ySizeB = windowHeight/13;
  buttonS = createButton("OPEN LABYRINTH (SIGHTED)");
  buttonS.size(xSizeB, ySizeB);
  buttonS.position(windowWidth/3*2-xSizeB/2, windowHeight*2/3-ySizeB/2);
  buttonS.style("font-size", diagonal/100+"px");
  buttonS.style("font-family", "Comic Sans MS");
  buttonS.style('background-color', color("#38b000"));
  buttonS.style("text-align", "center");
  buttonS.mousePressed(function() {
    window.open("/Labyrinth/sighted.html", "_self");
  });

  //Button Blind
  buttonB = createButton("OPEN LABYRINTH (BLIND)");
  buttonB.size(xSizeB, ySizeB);
  buttonB.position(windowWidth/3-xSizeB/2, windowHeight*2/3-ySizeB/2);
  buttonB.style("font-size", diagonal/100+"px");
  buttonB.style("font-family", "Comic Sans MS");
  buttonB.style('background-color', color("#38b000"));
  buttonB.style("text-align", "center");
  buttonB.mousePressed(function() {
    window.open("/Labyrinth/blind.html", "_self");
  });
}



function draw() {
  // evert draw cycle, add a background with low opacity
  // to create the "fade" effect
  background(0, 5);
}

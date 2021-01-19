function setup() {
  createCanvas(windowWidth, windowHeight);
  background("red");

  //Button
  let diagonal = pow(pow(windowWidth,2)+pow(windowHeight,2), 0.5);
  button = createButton("OPEN LABYRINTH (SIGHTED)");
  let xSizeB = windowWidth/6;
  let ySizeB = windowHeight/13;
  button.size(xSizeB, ySizeB);
  button.position(windowWidth/2-xSizeB/2, windowHeight*2/3-ySizeB/2);
  button.style("font-size", diagonal/100+"px");
  button.style("font-family", "Comic Sans MS");
  button.style('background-color', color("#38b000"));
  button.style("text-align", "center");
  button.mousePressed(function() {
    window.open("/Labyrinth/sighted.html", "_self");
  });

  //Button
  let diagonal = pow(pow(windowWidth,2)+pow(windowHeight,2), 0.5);
  button = createButton("OPEN LABYRINTH (BLIND)");
  let xSizeB = windowWidth/6;
  let ySizeB = windowHeight/13;
  button.size(xSizeB, ySizeB);
  button.position(windowWidth/2-xSizeB/2, windowHeight*2/3-ySizeB/2);
  button.style("font-size", diagonal/100+"px");
  button.style("font-family", "Comic Sans MS");
  button.style('background-color', color("#38b000"));
  button.style("text-align", "center");
  button.mousePressed(function() {
    window.open("/Labyrinth/blind.html", "_self");
  });
}



function draw() {
  // evert draw cycle, add a background with low opacity
  // to create the "fade" effect
  background(0, 5);
}

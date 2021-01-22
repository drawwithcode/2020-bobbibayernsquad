////////// CLICK FEEDBACK //////////
//An echo shows when the table is being touched

class Echo {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.size = 55;
    this.opacity = 200;
    this.strokeweight = 2;
  }
  display() {
    this.size += 5; // gets bigger
    this.opacity -= 11; // fades out
    this.strokeweight += 0.2; // gets thicker
    push();
    noFill();
    strokeWeight(this.strokeweight);
    if (!success) {
      stroke(255, 255, 255, this.opacity);
    } else {
      stroke(211, 211, 211, this.opacity);
    }
    ellipse(this.x, this.y, this.size);
    pop();
  }
}

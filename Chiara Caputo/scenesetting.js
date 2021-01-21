////////// SCENE SETTING //////////
//Setting the scene: place the objects on the table and assign sounds on click

class Item {
  constructor(img) {
    this.init();
    this.img = img;
  }

  init() {
    this.margin = 80;
    this.x = floor(random(this.margin, width - this.margin));
    this.y = floor(random(this.margin, height - this.margin));
  }

  show(imgw, imgh, ref) {
    imageMode(CENTER);
    let scale = width / (1280 / ref * imgw); //scaling based on the window width and a reference proportion
    this.w = imgw * scale;
    this.h = this.w * imgh / imgw; //the height of the image always stays proportional to its width
    image(this.img, this.x, this.y, this.w, this.h); //draw the image with the new set values
    //noLoop();
  }

  clicked() {
    if (
      mouseX > this.x - this.w/2 &&
      mouseX < this.x + this.w/2 &&
      mouseY > this.y - this.h/2 &&
      mouseY < this.y + this.h/2
    ) {
      return true;
    } else {
      return false;
    }
  }

  play(snd) {
    snd.play();
  }

}

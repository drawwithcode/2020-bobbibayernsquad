////////// SCENE SETTING //////////
//Setting the scene: place the objects on the table and assign sounds on click

class Item {
  constructor(img, snd, x, y, ref) {
    //Item position
    this.x = x;
    this.x_normalized = map(this.x,0,windowWidth,0,1);
    this.y = y;
    this.y_normalized = map(this.y,0,windowHeight,0,1);

    //Item dimensions
    this.ref = ref;
    let windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
    let scale = windowDiagonal*0.8 / (1280 / this.ref * img.width);
    this.w = img.width*scale;
    this.h = this.w * img.height / img.width; //the height of the image always stays proportional to its width

    //Items image
    this.img = img;

    //Items sound
    this.snd=snd ;
  }

  show() {
    push();
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h); //draw the image with the new set values
    pop();
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

  scale() {
    this.x=map(this.x_normalized,0,1,0,windowWidth);
    this.y=map(this.y_normalized,0,1,0,windowHeight);
    let windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
    let scale = windowDiagonal*0.8 / (1280 / this.ref * this.img.width);
    this.w = this.img.width*scale;
    this.h = this.w * this.img.height / this.img.width; //the height of the image always stays proportional to its width
  }

  play() {
    this.snd.play();
  }

}

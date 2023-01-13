import Sprite from "../../progression/Sprite.js";

export default class Button extends Sprite {
  constructor(x, y, w, h, text, useImage = false, imageName = "button") {
    super({});
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.useImage = useImage;
    this.esconder = false;
    this.imageName = imageName;
  }

  desenhar(ctx, assets) {
    if (this.esconder)
      return;
    ctx.beginPath();
    let fontSize = 0.05 * ctx.canvas.height;
    ctx.font = `${fontSize}px 'Skranji'`;
    if (this.useImage) {
      ctx.drawImage(
        assets.img(this.imageName),
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
    } else {
      ctx.fillStyle = "hsl(30, 100%, 60%)";
      ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
      ctx.strokeStyle = "hsl(30, 100%, 40%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.x, this.y + this.w * 0.04);
  }
}

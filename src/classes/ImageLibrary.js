export default function ImageLibrary(){
  this.images = {};
  this.loaded = 0;
  this.size = 0;
}

ImageLibrary.prototype.load = function (key,url) {
  const img = new Image();
  this.images[key] = img;
  this.size++;
  const that = this;
  img.addEventListener('load', function(){
    that.loaded++;
    console.log(key, "terminou de carregar:", that.loaded,that.size);
  })
  img.src = url;
};

ImageLibrary.prototype.draw = function (ctx, key, x, y) {
  ctx.drawImage(this.images[key], x, y);
};

ImageLibrary.prototype.drawSize = function (ctx, key, x, y, w, h) {
  ctx.drawImage(this.images[key], x, y, w, h);
};

ImageLibrary.prototype.drawAngle = function(ctx, key, x, y, ang){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang*Math.PI/180);
  ctx.drawImage(this.images[key], -this.images[key].width/2, -this.images[key].height/2);
  ctx.restore();
}

ImageLibrary.prototype.drawClip = function(ctx, key, sx, sy, w, h, dx, dy){
  ctx.drawImage(this.images[key], sx, sy, w, h, dx, dy, w, h);
}

ImageLibrary.prototype.drawClipSize = function(ctx, key, sx, sy, w, h, dx, dy, dw, dh){
  //sx, sy, w, h dentro da imagem - w e h são para a parte da imagem que irá pegar
  //dx, dy, dw, dh onde irá desenhar e em que proporção
  ctx.drawImage(this.images[key], sx, sy, w, h, dx, dy, dw, dh);
}

ImageLibrary.prototype.drawClipAngle = function(ctx, key, sx, sy, w, h, dx, dy, ang){
  ctx.save();
  ctx.translate(dx, dy);
  ctx.rotate(ang*Math.PI/180);
  ctx.drawImage(this.images[key], sx, sy, w, h, -w/2, -h/2, w, h);
  ctx.restore();
}

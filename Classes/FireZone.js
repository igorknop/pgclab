function FireZone() {
    /**
     * Estabelece a relação de Herança entre Player e Sprite:
     *  -> Sprite é pai e player é filho
     */
    Sprite.call(this, {s: 32, w: 32, h: 32});    

    this.animation = [];
    this.qtdAnimacoes = 12;
    this.speedAnimation = 1.2;
    this.matrizImagem = {
        linhas: 3,
        colunas: 4,
        widthImagem: 16,
        heightImagem: 24
    }
    //this.h = 24;
    this.criarAnimacoes();
}

// Heranca
FireZone.prototype = new Sprite();                          // Define que o Firezone é um Sprite
FireZone.prototype.constructor = FireZone;

FireZone.prototype.criarAnimacoes = function(){
    for(let i = 0; i < this.matrizImagem.linhas; i++){
        for(let j = 0; j < this.matrizImagem.colunas; j++){
            let animationFrame = {
                sizeImagem: this.s,
                pose: (i + j * this.matrizImagem.colunas),
                sx: 16 * j,
                sy: 24 * i,
            };
            this.animation.push(animationFrame);
        }
    }
}

FireZone.prototype.desenhar = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "red";
    ctx.linewidth = 2;
    ctx.globalAlpha = 0.20;         //Transparência
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    //ctx.ellipse(0, 0, this.s * 0.7, this.s * 0.7, 0, 0, Math.PI * 2, false);
    ctx.ellipse(0, 0, this.matrizImagem.widthImagem * 0.7, this.matrizImagem.widthImagem * 0.7, 0, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1.00;         //Transparência

    //ctx, key, sx, sy, w, h, dx, dy
    /*assetsMng.drawClip({ctx: ctx, key: "flames", 
        sx: (Math.floor(this.pose) * 16),
        sy: 0,
        w: 16, h: 24, dx: -8,  
        dy: -12
    });*/
    assetsMng.drawClip({ctx: ctx, key: "flames", 
        sx: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sx,
        sy: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sy,
        w: 16, h: 24, dx: -8,  
        dy: -12
    });
    ctx.restore();
    if(debugMode == 1){
        //this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCentro(ctx);
    }
    else if(debugMode == 2){
        //this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCaixaColisao(ctx);
    }
}

FireZone.prototype.mover = function (dt) {
    this.pose = this.pose + this.speedAnimation * dt;
    //this.x = this.gx * this.map.s + this.s;             // Centraliza a firezone na celula
    //this.y = this.gy * this.map.s + this.s;
}

FireZone.prototype.copyWithAnimation = function(firezone){
    this.copy(firezone);
    for(let i = 0; i < firezone.animation.length; i++){
        let animationFrame = {
            sizeImagem: firezone.animation[i].sizeImagem,
            pose: firezone.animation[i].pose,
            sx: firezone.animation[i].sx,
            sy: firezone.animation[i].sy,
        };
        this.animation.push(animationFrame);
    }
    this.qtdAnimacoes = firezone.qtdAnimacoes;
    this.speedAnimation = firezone.speedAnimation;
    this.matrizImagem = {
        linhas: firezone.matrizImagem.linhas,
        colunas: firezone.matrizImagem.colunas,
        widthImagem: firezone.matrizImagem.widthImagem,
        heightImagem: firezone.matrizImagem.heightImagem
    }
}

FireZone.prototype.desenharCaixaColisao = function(ctx){
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillRect(- this.w/2, - this.h/2, this.w, this.h);
  ctx.strokeRect(- this.w/2, - this.h/2, this.w, this.h);
  ctx.restore();
}
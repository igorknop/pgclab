
function Enemy() {
    Sprite.call(this, {s: 22, w: 22, h: 10, nomeImagem: "slime", sizeImagem: 22});            
    this.alvo = null;
    this.roomNumber = -1;
    this.maxHp = 200;
    this.hp = 200;
    this.animation = [];
    this.qtdAnimacoes = {types: 2, lines: [0, 1], qtd: [9, 3] /* atacking: 9, normal: 3*/};
    this.speedAnimation = 11.49; //1.2;
    this.type = 0;
    this.pose = 0;
    this.matrizImagem = {
        linha: 1,
        colunas: 9,
        widthImagem: 22,
        heightImagem: 22
    };
    this.cooldownAtaque = 1;                  //Tempo travado até terminar o ataque            
    this.cooldownImune = 1;
    this.criarAnimacoes();
}

// Heranca
Enemy.prototype = new Sprite();              // Define que o Enemy é um Sprite
Enemy.prototype.constructor = Enemy;

Enemy.prototype.movimento = function (dt) {
    this.pose = this.pose + this.speedAnimation * dt;
    this.mover(dt);
    /*this.x += this.vx*dt;
    this.y += this.vy*dt;*/

}

Enemy.prototype.criarAnimacoes = function(){
    // Cria a lista de tipos de animações
    for(let i = 0; i < this.qtdAnimacoes.types; i++){
        let auxAnimation = {
            animationFrame: [],
            type: i,
            qtdFrames: this.qtdAnimacoes.qtd[i]
        }
        this.animation.push(auxAnimation);
    }

    for(let i = 0; i < this.animation.length; i++){             // Animações
        for(let j = 0; j < this.animation[i].qtdFrames; j++){   // Frames
            let animationFrame = {
                sizeImagem: this.s,
                pose: j,
                sx: 1 + 23 * j,
                sy: 1 + 23 * this.qtdAnimacoes.lines[i],
            };
            this.animation[i].animationFrame.push(animationFrame);
        }
    }

    this.pose = seedGen.getRandomIntMethod_1(0, 50);             // Sorteia uma posição inicial para que os 
                                                                 // inimigos não fiquem sincronizados
}

Enemy.prototype.desenhar = function(ctx){
    let elipse = {
        x: 0,
        y: 0,
        radiusX: this.sizeImagem/2 - 0.8,
        radiusY: this.sizeImagem/3 - 2.2,
        rotation: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        anticlockwise: false
    }
    ctx.linewidth = 1;
    ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
    ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.ellipse(elipse.x, elipse.y, elipse.radiusX, elipse.radiusY, elipse.rotation, elipse.startAngle, 
    elipse.endAngle, elipse.anticlockwise);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    assetsMng.drawClip({ctx: ctx, key: this.nomeImagem, 
        sx: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sx,
        sy: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sy,
        w: this.matrizImagem.widthImagem, h: 22, dx: -this.matrizImagem.widthImagem/2,  
        dy: -this.matrizImagem.heightImagem/2 - 8/*- this.matrizImagem.heightImagem/2*/
    });
    ctx.restore();
    this.desenharHP();
    if(debugMode == 1){
        this.desenharCentro(ctx);
    }
    else if(debugMode == 2){
        this.desenharCaixaColisao(ctx);
        this.desenharCentro(ctx);
    }
} 

Enemy.prototype.desenharHP = function(){
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillRect(this.x - this.w/2, this.y - this.h * 2.5, this.w, 4);         // Fundo
    ctx.fillStyle = `hsl(${120*this.hp/this.maxHp}, 100%, 50%)`;
    ctx.fillRect(this.x - this.w/2, this.y - this.h * 2.5, this.w*(Math.max(0,this.hp)/this.maxHp), 4);         // Quantidade de HP
    ctx.strokeRect(this.x - this.w/2, this.y - this.h * 2.5, this.w, 4);       // Borda
}

Enemy.prototype.persegue = function(alvo){
    if(this.alvo === null){
        const dx = Math.floor(alvo.x) - Math.floor(this.x);
        const dy = Math.floor(alvo.y) - Math.floor(this.y);
        const d = Math.sqrt(dx*dx+dy*dy);
        const k = 5;
        if(Math.abs(d)<k*16){
            this.alvo = alvo;
            this.persegue();
            return;
        }

    } else {
        const dx = Math.floor(this.alvo.x) - Math.floor(this.x);
        const dy = Math.floor(this.alvo.y) - Math.floor(this.y);
        this.vx = 20*Math.sign(dx);
        this.vy = 20*Math.sign(dy);
    }
}
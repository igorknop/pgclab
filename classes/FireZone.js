import Sprite from "./Sprite.js";
import seedGen from "./SeedGen.js";
import assetsMng from "./AssetsMng.js";
import Debugger, { DEBUG_MODE } from "./utils/Debugger.js";


export default class FireZone extends Sprite {

    constructor() {
        super({ s: 32, w: 32, h: 32, nomeImagem: "flames" });

        this.animation = [];
        this.qtdAnimacoes = 12;
        this.speedAnimation = 11.49;
        this.matrizImagem = {
            linhas: 3,
            colunas: 4,
            widthImagem: 16,
            heightImagem: 24
        }
        //this.h = 24;
        this.criarAnimacoes();
    }

    criarAnimacoes() {
        for (let i = 0; i < this.matrizImagem.linhas; i++) {
            for (let j = 0; j < this.matrizImagem.colunas; j++) {
                let animationFrame = {
                    sizeImagem: this.s,
                    pose: (i + j * this.matrizImagem.colunas),
                    sx: 16 * j,
                    sy: 24 * i,
                };
                this.animation.push(animationFrame);
            }
        }

        this.pose = seedGen.nextRandInt(0, 20);             // Sorteia uma posição inicial para que os 
        // Firezones não fiquem sincronizados
    }

    mover(dt) {
        this.pose = this.pose + this.speedAnimation * dt;
    }

    desenhar(ctx) {
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
        assetsMng.drawClip({
            ctx: ctx, key: this.nomeImagem,
            sx: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sx,
            sy: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sy,
            w: 16, h: 24, dx: -8,
            dy: -12
        });
        ctx.restore();
        if (Debugger.isDebugMode(DEBUG_MODE.LIGACAO_TELEPORTES)) {
            //this.desenharCell(ctx);         //Debug mode Grid
            this.desenharCentro(ctx);
        }
        else if (Debugger.isDebugMode(DEBUG_MODE.CAIXA_DE_COLISAO)) {
            //this.desenharCell(ctx);         //Debug mode Grid
            this.desenharCaixaColisao(ctx);
            this.desenharCentro(ctx);
        }
    }

    copyWithAnimation(firezone) {
        this.copy(firezone);
        for (let i = 0; i < firezone.animation.length; i++) {
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

    desenharCaixaColisao(ctx) {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillRect(- this.w / 2, - this.h / 2, this.w, this.h);
        ctx.strokeRect(- this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();
    }
}
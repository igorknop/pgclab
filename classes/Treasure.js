import Sprite from "./Sprite.js";
import seedGen from "./SeedGen.js";
import assetsMng from "./AssetsMng.js";
import Debugger, { DEBUG_MODE } from "./utils/Debugger.js";


export default class Treasure extends Sprite {
    constructor() {
        super({ s: 18, w: 17, h: 10, nomeImagem: "coin_gold" });
        this.roomNumber = -1;
        this.room = null;
        this.animation = [];
        this.qtdAnimacoes = 8;
        this.speedAnimation = 14;//1.5;  // 1.2
        this.matrizImagem = {
            linhas: 1,
            colunas: 8,
            widthImagem: 32,
            heightImagem: 32
        }
        this.criarAnimacoes();
    }


    criarAnimacoes() {
        for (let i = 0; i < this.matrizImagem.linhas; i++) {
            for (let j = 0; j < this.matrizImagem.colunas; j++) {
                let animationFrame = {
                    sizeImagem: this.s,
                    pose: (i + j * this.matrizImagem.colunas),
                    sx: this.matrizImagem.widthImagem * j,
                    sy: this.matrizImagem.heightImagem * i,
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
        ctx.translate(this.x, this.y);
        assetsMng.drawClip({
            ctx: ctx, key: this.nomeImagem,
            sx: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sx,
            sy: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sy,
            w: this.matrizImagem.widthImagem, h: this.matrizImagem.heightImagem, dx: -this.matrizImagem.widthImagem / 2,
            dy: -this.matrizImagem.heightImagem / 2 - this.matrizImagem.heightImagem / 2 + 3
        });
        ctx.restore();
        if (Debugger.isDebugMode(DEBUG_MODE.LIGACAO_TELEPORTES)) {
            this.desenharCentro(ctx);
        }
        else if (Debugger.isDebugMode(DEBUG_MODE.CAIXA_DE_COLISAO)) {
            this.desenharCaixaColisao(ctx);
            this.desenharCentro(ctx);
        }
    }

    copyWithAnimation(treasure) {
        this.copy(treasure);
        for (let i = 0; i < treasure.animation.length; i++) {
            let animationFrame = {
                sizeImagem: treasure.animation[i].sizeImagem,
                pose: treasure.animation[i].pose,
                sx: treasure.animation[i].sx,
                sy: treasure.animation[i].sy,
            };
            this.animation.push(animationFrame);
        }
        this.qtdAnimacoes = treasure.qtdAnimacoes;
        this.speedAnimation = treasure.speedAnimation;
        this.matrizImagem = {
            linhas: treasure.matrizImagem.linhas,
            colunas: treasure.matrizImagem.colunas,
            widthImagem: treasure.matrizImagem.widthImagem,
            heightImagem: treasure.matrizImagem.heightImagem
        }
    }
}
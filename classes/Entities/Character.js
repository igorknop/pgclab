import Sprite from "../Sprite.js";
import seedGen from "../SeedGen.js";
import assetsMng from "../AssetsMng.js";
import { escreveTexto } from "../Utils.js";
import Debugger, { DEBUG_MODE } from "../utils/Debugger.js";
import { getPlayer } from "./Player.js";

export default class Character extends Sprite {
    constructor(params, nivel) {
        super(params);
        this.nivel = nivel;
        this.alvo = null;
        this.roomNumber = -1;
        this.room = null;
        this.hpMax = 200;
        this.hpAtual = 200;
        this.animation = [];
        this.speedAnimation = 11.49; //1.2;
        this.type = 0;
        this.pose = 0;
        this.raioAtaque = 5;
        this.imune = false;
        // this.atributos = {
        //     hpMax: 200,
        //     hpAtual: 200,
        //     ataque: 40,
        //     velocidade: 0,
        //     raioAtaque: 5,
        //     cooldownAtaque: 0,
        //     cooldownImune: 0
        // }
        this.criarAnimacoes();
    }

    passo(dt) {
        this.persegue(getPlayer());
        this.movimento(dt);
    }


    movimento(dt) {
        this.pose = this.pose + this.speedAnimation * dt;
        this.controleInvencibilidade();
        this.mover(dt);
        if (this.type === 1) {
            this.atributos.cooldownAtaque = this.atributos.cooldownAtaque - 2 * dt;
        }
    }

    mover(dt) {
        if (this.direcaoX == 0 && this.direcaoY == 0) {
            return;
        }
        const velocidade = this.calcularVelocidade();
        this.gx = Math.floor(this.x / this.map.s);
        this.gy = Math.floor(this.y / this.map.s);

        const vetorNormalizado = Math.sqrt(
            (this.direcaoX * this.direcaoX) +
            (this.direcaoY * this.direcaoY)
        ) || 1; // se for 0, coloca 1 pra não dar exceção

        let newX = this.x + (this.direcaoX / vetorNormalizado) *
            velocidade * dt;
        let newY = this.y + (this.direcaoY / vetorNormalizado) *
            velocidade * dt
        if (Debugger.isDebugMode(DEBUG_MODE.DEBUG_OFF) ||
            Debugger.isDebugMode(DEBUG_MODE.CAIXA_DE_COLISAO)) {
            newX = this.restricoesHorizontal(newX);
            newY = this.restricoesVertical(newY);
        }
        this.x = newX;
        this.y = newY;
    }

    restricoesHorizontal(newX) {
        if (this.direcaoX == 0) {
            return this.x;
        }
        // limite esquerdo é o pixel mais a esquerda do bloco atual
        // limite direito é o pixel mais direita
        const limite = (this.gx + (this.direcaoX == 1 ? 1 : 0)) * this.map.s - this.direcaoX;
        // Se estiver na borda esquerda ou direita do mapa
        if ((this.gx === 0 && this.direcaoX == -1) || (this.gx === (this.map.w - 1) && this.direcaoX == 1)) {
            if (this.direcaoX == -1 && newX < limite) {
                return this.x;
            } else if (this.direcaoX == 1 && newX > limite) {
                return this.x;
            }
        } else {

            for (let i = -1; i <= 1; i++) {
                if (this.gy + i < 0 || this.gy + i >= this.map.h) {
                    continue;
                }
                if (this.map.cell[this.gy + i][this.gx + this.direcaoX].tipo === 1) {
                    const celulaPlayer = { x: newX, y: this.y, w: this.w, h: this.h }
                    const celula = {
                        x: (this.gx + this.direcaoX) * this.map.s + this.map.s / 2,
                        y: (this.gy + i) * this.map.s + this.map.s / 2,
                        w: this.map.s, h: this.map.s
                    }
                    if (Sprite.verificaColisao(celulaPlayer, celula)) {
                        return limite - (this.w / 2 * this.direcaoX);
                    }
                }
            }
        }
        return newX;
    }

    restricoesVertical(newY) {
        if (this.direcaoY == 0) {
            return this.y;
        }
        // limite superior é o pixel mais acima do bloco atual
        // limite inferior é o pixel mais abaixo do bloco atual
        const limite = (this.gy + (this.direcaoY == 1 ? 1 : 0)) * this.map.s - this.direcaoY;
        // Se estiver na borda superior ou inferior do mapa
        if ((this.gy === 0 && this.direcaoY == -1) || (this.gy === (this.map.h - 1) && this.direcaoY == 1)) {
            if (this.direcaoY == -1 && newY < limite) {
                return this.y;
            } else if (this.direcaoY == 1 && newY > limite) {
                return this.y;
            }
        } else {
            for (let i = -1; i <= 1; i++) {
                if (this.gx + i < 0) {
                    continue;
                }
                if (this.map.cell[this.gy + this.direcaoY][this.gx + i].tipo === 1) {
                    const celulaPlayer = { x: this.x, y: newY, w: this.w, h: this.h }
                    const celula = {
                        x: (this.gx + i) * this.map.s + this.map.s / 2,
                        y: (this.gy + this.direcaoY) * this.map.s + this.map.s / 2,
                        w: this.map.s, h: this.map.s
                    }
                    if (Sprite.verificaColisao(celulaPlayer, celula)) {
                        return limite - (this.h / 2 * this.direcaoY);
                    }
                }
            }
        }
        return newY;
    }

    controleInvencibilidade(dt) {
        this.atributos.cooldownImune = this.atributos.cooldownImune - dt;
        if (this.atributos.cooldownImune < 0) {
            this.imune = false;
        }
        else {
            //this.atributos.cooldownAtaque = 0;
            //this.type = 0;
        }
    }

    ativarInvencibilidade() {
        this.atributos.cooldownImune = 1.2;
        this.imune = true;
    }

    criarAnimacoes() {
        // Cria a lista de tipos de animações
        for (let i = 0; i < this.qtdAnimacoes.types; i++) {
            let auxAnimation = {
                animationFrame: [],
                type: i,
                qtdFrames: this.qtdAnimacoes.qtd[i]
            }
            this.animation.push(auxAnimation);
        }

        for (let i = 0; i < this.animation.length; i++) {             // Animações
            for (let j = 0; j < this.animation[i].qtdFrames; j++) {   // Frames
                let animationFrame = {
                    sizeImagem: this.s,
                    pose: j,
                    sx: 1 + 23 * j,
                    sy: 1 + 23 * this.qtdAnimacoes.lines[i],
                };
                this.animation[i].animationFrame.push(animationFrame);
            }
        }

        this.pose = seedGen.nextRandInt(0, 50);             // Sorteia uma posição inicial para que os 
        // inimigos não fiquem sincronizados
    }

    desenhar(ctx) {
        let elipse = {
            x: 0,
            y: 0,
            radiusX: this.sizeImagem / 2 - 0.8,
            radiusY: this.sizeImagem / 3 - 2.2,
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
        if (this.atributos.cooldownImune > 0) {
            ctx.globalAlpha = 0.4;
            this.imune = true;
        }
        else {
            this.imune = false;
        }
        assetsMng.drawClip({
            ctx: ctx, key: this.nomeImagem,
            sx: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sx,
            sy: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sy,
            w: this.matrizImagem.widthImagem, h: 22, dx: -this.matrizImagem.widthImagem / 2,
            dy: -this.matrizImagem.heightImagem / 2 - 8/*- this.matrizImagem.heightImagem/2*/
        });
        ctx.restore();
        this.desenharHP(ctx);
        this.desenharAtributos(ctx);
        if (Debugger.isDebugMode(DEBUG_MODE.LIGACAO_TELEPORTES)) {
            this.desenharCentro(ctx);
        }
        else if (Debugger.isDebugMode(DEBUG_MODE.CAIXA_DE_COLISAO)) {
            this.desenharCaixaColisao(ctx);
            this.desenharCentro(ctx);
        }
    }

    desenharHP(ctx) {
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillRect(this.x - this.w / 2, this.y - this.h * 2.5, this.w, 4);         // Fundo
        ctx.fillStyle = `hsl(${120 * this.hpAtual / this.atributos.hpMax}, 100%, 50%)`;
        ctx.fillRect(this.x - this.w / 2, this.y - this.h * 2.5, this.w * (Math.max(0, this.hpAtual) / this.atributos.hpMax), 4);         // Quantidade de HP
        ctx.strokeRect(this.x - this.w / 2, this.y - this.h * 2.5, this.w, 4);       // Borda
    }


    desenharAtributos(ctx) {
        ctx.save();
        ctx.fillStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.strokeStyle = "black";
        ctx.font = "10px Arial Black";
        if (this.nivel) {
            ctx.strokeText(this.nivel, this.x, this.y - this.h * 2.7);
            ctx.fillText(this.nivel, this.x, this.y - this.h * 2.7);
        }
        
        if (this.atributos) {
            ctx.lineWidth = 1;
            ctx.textAlign = 'left';
            ctx.font = "8px Arial Black";
            escreveTexto(ctx, "A: " + this.atributos.ataque, this.x + (0.7 * this.w), this.y - (this.h * 2))
            escreveTexto(ctx, "H: " + this.atributos.hpMax, this.x + (0.7 * this.w), this.y - this.h)
            escreveTexto(ctx, "V: " + this.atributos.velocidade, this.x + (0.7 * this.w), this.y)
            escreveTexto(ctx, "Pa: " + this.poderTotal, this.x + (0.7 * this.w), this.y + this.h)
        }
        ctx.restore();

    }

    persegue(alvo) {
        if (alvo == null) {
            return;
        }
        const distanciaX = Math.floor(alvo.x) - Math.floor(this.x);
        const distanciaY = Math.floor(alvo.y) - Math.floor(this.y);
        if (this.alvo === null) {
            const distanciaAlvo = Math.sqrt(
                (distanciaX * distanciaX) +
                (distanciaY * distanciaY)
            );
            // if (Math.abs(distanciaAlvo) < this.atributos.raioAtaque * (this.map.s / 2)) {       //(k * 16) ==> 16 tamanho do celula
            if (Math.abs(distanciaAlvo) < 5 * (this.map.s / 2)) {       //(k * 16) ==> 16 tamanho do celula
                this.alvo = alvo;
                this.propagarAlvo(alvo, 2);
                return;
            }

        } else {
            this.direcaoX = Math.sign(distanciaX);
            this.direcaoY = Math.sign(distanciaY);
        }
    }

    propagarAlvo(alvo, distancia) {
        const roomAtual = this.room;
        const celulasNoRange = this.map.getCellsByDist(
            this.gx,
            this.gy,
            distancia
        );
        celulasNoRange.forEach(celula => {
            roomAtual.enemies.forEach(enemy => {
                if (enemy.gx == celula.coluna && enemy.gy == celula.linha) {
                    enemy.alvo = alvo;
                }
            });
        })
    }

    attackPlayer(player) {
        if (this.colidiuComCentralWidthHeight(player) && this.type === 0) {    // Detecta o player e não ta atacando
            this.type = 1;
            this.atributos.cooldownAtaque = 1;
        }
        if (this.atributos.cooldownAtaque < 0 && this.type === 1) {
            this.type = 0;
            if (this.colidiuComCentralWidthHeight(player)) {
                if (player.hp > 0) {
                    player.hp = player.hp - this.atributos.ataque;
                    player.ativarInvencibilidade();
                }
                else {
                    player.hp = 0;
                }
            }
        }
    }

    sofrerAtaque(dano) {
        this.hpAtual -= dano;
        if (this.hpAtual <= 0) {
            return this.morrer();
        }
        return false;
    }

    morrer() {
        console.log('Morrer do Character');
    }

    getPorcentagemVida() {
        return Math.max(0, this.hpAtual) / this.atributos.hpMax;
    }

    calcularVelocidade() {
        return 30 + (Math.pow(this.atributos.velocidade, 1.25) - 1);
    }

}
import seedGen from "../SeedGen.js";
import Character from "./Character.js";


export default class Enemy extends Character {
    
    constructor(params, nivel) {
        super(params, nivel);
        this.alvo = null;
        this.cooldownImune = 0;
        this.imune = false;
    }


    movimento(dt) {
        this.pose = this.pose + this.speedAnimation * dt;
        this.controleInvencibilidade();
        this.mover(dt);
        if (this.type === 1) {
            this.cooldownAtaque = this.cooldownAtaque - dt;
        }
    }

    controleInvencibilidade(dt) {
        this.cooldownImune = this.cooldownImune - dt;
        if (this.cooldownImune < 0) {
            this.imune = false;
        }
        else {
            //this.cooldownAtaque = 0;
            //this.type = 0;
        }
    }

    ativarInvencibilidade() {
        this.cooldownImune = 1.2;
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
        super.desenhar(ctx);
    }

    desenharHP(ctx) {
        super.desenharHP(ctx);
    }

    attackPlayer(player) {
        const colidiuComPlayer = this.colidiuComCentralWidthHeight(player);
        if (colidiuComPlayer && this.type === 0) {    // Detecta o player e não ta atacando
            this.type = 1;
            this.cooldownAtaque = 1;
        }
        if (this.cooldownAtaque < 0 && this.type === 1) {
            this.type = 0;
            if (colidiuComPlayer) {
                player.sofrerAtaque(this.atributos.ataque)
            }
        }
    }

    copy(enemy) {
        super.copy(enemy);
    }

    morrer() {
        super.morrer();
        this.room.enemies.splice(this.room.enemies.indexOf(this), 1);
        return true;
    }

}
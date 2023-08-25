import Personagem from "./Personagem.js";

export default class Jogador extends Personagem {
    constructor(canvas = null, cena = null) {
        super(canvas, cena);
        this.experienciaAtual = 10;
        this.experienciaNivel = 10;
        this.nivel = 1;
        this.pontosAtributos = 0;
        this.stunned = false;
        this.stunCooldown = 4;
        this.cooldown = 0.2 + ((3 - this.atributos['velocidade'].valor) < 0 ? 0 : 3 - this.atributos['velocidade'].valor);
        this.contador = this.cooldown;
    }



    controle() {
        if (this.stunned) {
            this.contador -= this.cena.dt;
            if (this.contador <= 0) {
                this.stunned = false;
                this.vidaAtual = this.vidaMaxima;
                this.contador = this.cooldown;
            }
        } else {
            super.controle();
        }
    }

    atacar() {
        this.cena.inimigo.sofrerDano(this.atributos['forca'].valor);
    }

    desenhar() {
        let x = 0.05 * this.canvas.width;
        let y = 0.38 * this.canvas.height;
        super.desenhar(x, y);
        this.ctx.textAlign = "left";
        this.ctx.fillText("Jogador", 0.05 * this.canvas.width,
            0.3 * this.canvas.height);

        x = 0.18 * this.canvas.width;
        y = 0.63 * this.canvas.height;
        this.ctx.fillText(this.vidaAtual + "/" + this.atributos['vida'].valor, x, y);

        x = 0.075 * this.canvas.width;
        y = 0.65 * this.canvas.height;

        // Barra de Vida
        let sr = this.vidaAtual / this.vidaMaxima;
        const h = 0.02 * this.canvas.height;
        this.desenharBarra(x, y, "#2BDC36", sr, null, h);

        // Barra de cooldown
        y = 0.7 * this.canvas.height;
        if (this.stunned) {
            sr = (this.stunCooldown - this.contador) / this.stunCooldown;
        } else {
            sr = (this.cooldown - this.contador) / this.cooldown;
        }
        this.desenharBarra(x, y, this.stunned ? "hsl(30, 100%, 60%)" : "red", sr);
    }



    upgrade(nomeAtributo) {
        const atributo = this.atributos[nomeAtributo];
        if (this.experienciaAtual >= atributo.custoAtual) {
            this.experienciaAtual -= atributo.custoAtual;
            atributo.quantidade++;
            atributo.valor += 1;
            atributo.custoAtual = Math.round(
                atributo.custoInicial * Math.pow(1.15, atributo.quantidade)
            );
            console.log("Novo custo: " + atributo.custoAtual);
        }
        this.cooldown = 0.2 + ((3 - this.atributos['velocidade'].valor) < 0 ? 0 : 3 - this.atributos['velocidade'].valor)
        /*
        if (atributo.currentCost > this.pontosAtuais)
            return;
        this.pontosAtuais = parseFloat(
            (this.pontosAtuais - atributo.currentCost).toFixed(10)
        );
        this.pontosGastos += parseFloat(
            atributo.currentCost.toFixed(10)
        );
        atributo.quantity++;
        this.taxaPonto = parseFloat(
            (this.taxaPonto + atributo.income).toFixed(10)
        );
        this.log.upgrades.push({
            "recursoMelhorado": atributo.label,
            "custo": atributo.currentCost,
        });
        atributo.currentCost = Math.round(
            atributo.initialCost * Math.pow(1.15, atributo.quantity)
        );
        this.game.graph.adicionarDado(parseInt(this.temporizador), this.taxaPonto);
        this.game.graph.atualizarGrafico()
        // this.game.graph.adicionarDado(atributo.currentIncome, atributo.currentCost);
        // this.game.graph.atualizarGrafico();
        return;
        */
    }

    sofrerDano(dano) {
        if (this.vidaAtual - dano <= 0) {
            this.vidaAtual = 0;
        } else {
            super.sofrerDano(dano);
        }
        if (this.vidaAtual == 0) {
            this.stunned = true;
            this.contador = this.stunCooldown;
        }
    }


}
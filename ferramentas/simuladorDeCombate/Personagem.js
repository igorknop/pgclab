import { atributos } from "./atributos.js";

export default class Personagem {
    constructor(canvas = null, cena = null) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext("2d");
        this.cena = cena;
        this.atributos = atributos;
        this.vidaMaxima = this.atributos['vida'].valor;
        this.vidaAtual = this.vidaMaxima;
        this.contador = 3;
        this.cooldown = 3;
        this.defesa = 0;
    }


    controle() {
        this.contador -= this.cena.dt;
        if (this.contador <= 0) {
            this.atacar();
            this.contador = this.cooldown;
        }
    }

    sofrerDano(dano) {
        this.vidaAtual -= (dano - this.defesa);
    }

    atacar() {

    }

    desenhar(x, y) {
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Vida máxima: ", x, y);
        this.ctx.fillText(this.atributos['vida'].valor, x + 120, y);
        y += 25
        this.ctx.fillText("Dano: ", x, y);
        this.ctx.fillText(this.atributos['forca'].valor, x + 120, y);
        y += 25
        this.ctx.fillText("Defesa: ", x, y);
        this.ctx.fillText(this.atributos['defesa'].valor, x + 120, y);
        y += 25
        this.ctx.fillText("Velocidade: ", x, y);
        this.ctx.fillText(this.atributos['velocidade'].valor, x + 120, y);
    }

    desenhaBarraDeAtaque(x, y, width, height) {
        const sr = (this.cooldown - this.contador) / this.cooldown;
        this.desenharBarra(x, y, "red", sr, width, height);
    }

    desenharBarraDeVida(x, y, width, height) {
        const sr = this.vidaAtual / this.vidaMaxima;
        const h = height ?? 0.02 * this.canvas.height;
        this.desenharBarra(x, y, "#2BDC36", sr, width, h);
    }

    desenharBarra(x, y, color, sr, width, height) {
        const w = width ?? 0.25 * this.canvas.width;
        const h = height ?? 0.01 * this.canvas.height;

        // background
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, y, w, h);
        //filling bar
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w * sr, h);
        // border
        this.ctx.strokeStyle = "hsl(120,50%,25%)";
        this.ctx.lineWidth = h / 3;
        this.ctx.strokeRect(x, y, w, h);

    }
}
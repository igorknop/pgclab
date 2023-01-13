import Sprite from "../Sprite.js";

export default class Barra {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.corBarra = "rgb(170, 120, 0)";
        this.corFundo = "black";
        this.corBorda = "white";
        this.tamanhoBorda = 1;
        this.texto = "null";
        this.barraInterna = null;
        this.barraExterna = null;
        this.porcentagem = () => 1;
    }

    desenhar(ctx) {
        // Barra de fundo
        ctx.fillStyle = this.corFundo;
        ctx.fillRect(
            this.barraInterna.x,
            this.barraInterna.y,
            this.barraInterna.w,
            this.barraInterna.h
        );
        // Barra de preenchimento
        ctx.fillStyle =
            typeof this.corBarra === "function"
                ? this.corBarra()
                : this.corBarra;
        ctx.fillRect(
            this.barraExterna.x,
            this.barraExterna.y,
            this.barraExterna.w * this.porcentagem(),
            this.barraExterna.h
        );
        // Linha de contorno
        ctx.strokeStyle = this.corBorda;
        ctx.lineWidth = this.tamanhoBorda;
        ctx.strokeRect(
            this.barraInterna.x,
            this.barraInterna.y,
            this.barraInterna.w,
            this.barraInterna.h
        );

        if (this.texto) {
            // Texto com o número no meio da barra
            const texto = this.texto;
            ctx.font = texto.font;
            ctx.fillStyle = texto.fillStyle;
            ctx.textAlign = texto.textAlign;
            ctx.lineWidth = texto.lineWidth;
            ctx.strokeStyle = texto.strokeStyle;
            ctx.strokeText(
                texto.valor(),
                this.barraInterna.x + this.barraInterna.w / 2,
                this.barraInterna.y + this.barraInterna.h / 2 + 4
            );
            ctx.fillText(
                texto.valor(),
                this.barraInterna.x + this.barraInterna.w / 2,
                this.barraInterna.y + this.barraInterna.h / 2 + 4
            );
        }
    }

    criarBarras() {
        this.barraInterna = new Sprite({
            x: this.x,
            y: this.y,
            w: this.largura,
            h: this.altura,
        });
        this.barraExterna = new Sprite({
            x: this.x,
            y: this.y,
            w: this.largura,
            h: this.altura,
        });
        return this;
    }

    setX(x) {
        this.x = x;
        return this;
    }

    setY(y) {
        this.y = y;
        return this;
    }

    setLargura(largura) {
        this.largura = largura;
        return this;
    }

    setAltura(altura) {
        this.altura = altura;
        return this;
    }

    setCorBarra(corBarra) {
        this.corBarra = corBarra;
        return this;
    }

    setCorFundo(corFundo) {
        this.corFundo = corFundo;
        return this;
    }

    setCorBorda(corBorda) {
        this.corBorda = corBorda;
        return this;
    }

    setTamanhoBorda(tamanhoBorda) {
        this.tamanhoBorda = tamanhoBorda;
        return this;
    }

    setTexto(texto) {
        this.texto = texto;
        return this;
    }

    setPorcentagem(porcentagem) {
        this.porcentagem = porcentagem ? porcentagem : () => 1
        return this;
    }
}

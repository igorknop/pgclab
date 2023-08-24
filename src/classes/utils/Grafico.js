const COR_TESOURO = "yellow";
const COR_INIMIGO = "rgba(225, 0, 0, 0.6)";
const COR_FIREZONE = "rgba(0, 255, 127, 0.6)";
const COR_PODER = "rgba(27, 172, 247, 0.6)";

export const MODO_GRAFICO = Object.freeze({
    GRAFICO_OFF: 0,
    TRANSPARENTE: 1,
    OPACO: 2,
});

export default class Grafico {
    constructor() {
        this.titulo = "";
        this.inicioEixoX = 0;
        this.inicioEixoY = 0;
        this.x = 0;
        this.y = 0;
        this.altura = 0;
        this.largura = 0;
        this.escalaX = 0;
        this.escalaY = 0;
        this.caminho = null;
        this.informacoes = [];
        this.modo = MODO_GRAFICO.TRANSPARENTE;
    }

    desenhar(ctx) {
        if (this.modo === MODO_GRAFICO.GRAFICO_OFF) {
            return;
        }
        this.tamanhoEixoX = this.largura - this.inicioEixoX + this.x;
        this.tamanhoEixoY = this.altura * 0.85;
        this.espacamentoX = this.tamanhoEixoX / this.escalaX;
        // this.espacamentoY = this.tamanhoEixoY / this.escalaY;
        this.espacamentoY = this.tamanhoEixoY / 5;

        // Desenho do quadro do gráfico
        ctx.save();
        ctx.fillStyle = "rgba(10, 10, 10, 1)"; //0.8
        ctx.strokeStyle = "rgba(105, 105, 105, 0.9)";
        ctx.globalAlpha = this.modo === MODO_GRAFICO.TRANSPARENTE ? 0.6 : 1;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);

        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "rgba(225, 225, 225, 0.9)";
        ctx.font = "13px Arial Black";
        ctx.fillText(
            "Passo (" + this.escalaX + ")",
            this.inicioEixoX + this.largura / 2,
            this.inicioEixoY + (this.altura * 0.033)
        );
        ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
        ctx.font = "13px Arial Black";
        ctx.fillText(
            this.titulo,
            this.inicioEixoX + this.largura / 2,
            this.y + (this.altura * 0.033)
        );
        ctx.font = "13px Arial Black";
        ctx.strokeStyle = "rgba(225, 225, 225, 0.9)";
        ctx.rotate((-Math.PI) / 2);
        ctx.restore();

        // Desenho dos eixos do gráfico
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Eixo X
        ctx.moveTo(this.inicioEixoX, this.inicioEixoY);
        ctx.lineTo(this.inicioEixoX + this.tamanhoEixoX, this.inicioEixoY);
        // Eixo Y
        ctx.moveTo(this.inicioEixoX, this.inicioEixoY);
        ctx.lineTo(this.inicioEixoX, this.inicioEixoY - this.tamanhoEixoY);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        // Marcações X
        if (this.escalaX <= 200) {
            let atualX = this.inicioEixoX;
            const tamanhoTraco = this.altura * 0.004;
            for (let i = 0; i < this.escalaX; i++) {
                ctx.moveTo(atualX + this.espacamentoX, this.inicioEixoY - tamanhoTraco);
                ctx.lineTo(atualX + this.espacamentoX, this.inicioEixoY + tamanhoTraco);
                atualX = atualX + this.espacamentoX;
            }
        }

        // Marcações Y
        if (this.escalaY !== 999) {
            let atualY = this.inicioEixoY;
            const tamanhoTraco = this.largura * 0.0025;
            for (let i = 0; i < 5; i++) {
                ctx.moveTo(this.inicioEixoX - tamanhoTraco, atualY - this.espacamentoY);
                ctx.lineTo(this.inicioEixoX + tamanhoTraco, atualY - this.espacamentoY);
                ctx.fillText(
                    ((1 / 5) * (i + 1)).toFixed(1),
                    this.inicioEixoX - (this.largura * 0.025),
                    atualY - this.espacamentoY + 5
                )
                atualY = atualY - this.espacamentoY;
            }
        }
        ctx.closePath();
        ctx.stroke();

        this.desenharLegenda(ctx);
        this.desenharInformacoes(ctx);
    }

    desenharLegenda(ctx) {
        ctx.save();
        ctx.textAlign = 'left';
        const tamanhoLinha = (this.largura * 0.025);
        const distanciaLegendas = this.tamanhoEixoX / this.informacoes.length;
        let xAtual = this.inicioEixoX;
        let yAtual = this.inicioEixoY + (this.altura * 0.081);
        this.informacoes.forEach((informacao) => {
            ctx.beginPath();
            ctx.strokeStyle = informacao.cor;
            ctx.moveTo(xAtual, yAtual);
            ctx.lineTo(xAtual + tamanhoLinha, yAtual);
            ctx.fillText(
                informacao.titulo +
                    (informacao.escala != null
                        ? ` (${informacao.escala})`
                        : ""),
                xAtual + tamanhoLinha * 1.5,
                yAtual + this.altura * 0.01
            );
            ctx.closePath();
            ctx.stroke();
            xAtual += distanciaLegendas;
        });
        ctx.restore();
    }

    desenharInformacoes(ctx) {
        ctx.lineWidth = 2;
        this.espacamentoY = this.tamanhoEixoY;
        this.informacoes.forEach((informacao) => {
            // Posição 0,0 no gráfico
            let xAtual = this.inicioEixoX;
            let yAtual = this.inicioEixoY - this.espacamentoY * informacao.dados[0];

            let valY = informacao.dados[0];
            let valorAtual = valY;
            let muxY;

            // Desenho da linha do gráfico
            ctx.beginPath();
            ctx.strokeStyle = informacao.cor;
            for (let i = 1; i < informacao.dados.length; i++) {
                if (valY < informacao.dados[i]) {
                    muxY = -1;
                } else if (valY > informacao.dados[i]) {
                    muxY = 1;
                } else if (valY === informacao.dados[i]) {
                    muxY = 0;
                }

                valY = informacao.dados[i];

                if (i !== 0) {
                    ctx.moveTo(xAtual, yAtual);
                    ctx.lineTo(
                        xAtual + this.espacamentoX,
                        yAtual + (valY - valorAtual) * -this.espacamentoY
                    );
                }
                xAtual = xAtual + this.espacamentoX;
                yAtual = yAtual + (valY - valorAtual) * -this.espacamentoY;
                valorAtual = informacao.dados[i];
            }
            ctx.closePath();
            ctx.stroke();
        });
    }

    criarGrafico(caminho) {
        this.caminho = caminho;
        this.limparInformacoes();
        this.altura = 450;
        this.largura = 800;
        this.x = 20;
        this.y = 180;
        this.inicioEixoX = this.x + (this.largura * 0.045);
        this.inicioEixoY = this.y + (this.altura * 0.89);
        let maiorPoder = 0;
        let maiorDistInimigos = 0;
        let maiorDistFirezones = 0;
        let maiorDistTesouros = 0;
        for (let i = 0; i < this.caminho.steps.length; i++) {
            if (this.caminho.steps[i].distTesouros > maiorDistTesouros) {
            	maiorDistTesouros = this.caminho.steps[i].distTesouros;
            }
            if (this.caminho.steps[i].distInimigos > maiorDistInimigos) {
                maiorDistInimigos = this.caminho.steps[i].distInimigos;
            }
            if (this.caminho.steps[i].distFirezones > maiorDistFirezones) {
                maiorDistFirezones = this.caminho.steps[i].distFirezones;
            }
            if (this.caminho.steps[i].influenciaPoder > maiorPoder) {
                maiorPoder = this.caminho.steps[i].influenciaPoder;
            }
        }
        const influenciaPoderEmEscala = this.caminho.steps.map(step => {
            return (step.influenciaPoder) / maiorPoder;
        });
        const distInimigosEmEscala = this.caminho.steps.map(step => {
            return (step.distInimigos) / maiorDistInimigos;
        });
        const distFirezonesEmEscala = this.caminho.steps.map(step => {
            return (step.distFirezones) / maiorDistFirezones;
        });
        const distTesourosEmEscala = this.caminho.steps.map(step => {
            return (step.distTesouros) / maiorDistTesouros;
        });

        this.escalaX = this.caminho.steps.length - 1;
        this.escalaY = 1;
        if (this.escalaX > 999) {
            this.largura = 610;
        }
        this.adicionarInformacao({
            titulo: "Dist Tesouro",
            cor: COR_TESOURO,
            dados: distTesourosEmEscala,
            escala: maiorDistTesouros
        });
        this.adicionarInformacao({
            titulo: "Dist Firezone",
            cor: COR_FIREZONE,
            dados: distFirezonesEmEscala,
            escala: maiorDistFirezones
        });
        this.adicionarInformacao({
            titulo: "Dist Inimigo",
            cor: COR_INIMIGO,
            dados: distInimigosEmEscala,
            escala: maiorDistInimigos
        });
        this.adicionarInformacao({
            titulo: "Poder",
            cor: COR_PODER,
            dados: influenciaPoderEmEscala,
            escala: maiorPoder
        });
    }

    setLargura(largura) {
        this.largura = largura;
        return this;
    }

    setAltura(altura) {
        this.altura = altura;
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

    setTitulo(titulo) {
        this.titulo = titulo;
        return this;
    }

    setEscalaX(escalaX) {
        this.escalaX = escalaX;
        return this;
    }

    setEscalaY(escalaY) {
        this.escalaY = escalaY;
        return this;
    }

    setInicioEixoX(inicioEixoX) {
        this.inicioEixoX = inicioEixoX;
        return this;
    }

    setInicioEixoY(inicioEixoY) {
        this.inicioEixoY = inicioEixoY;
        return this;
    }

    adicionarInformacao(informacao) {
        this.informacoes.push(informacao);
        return this;
    }

    limparInformacoes() {
        this.informacoes = [];
        return this;
    }

    setModo(modo) {
        this.modo = modo;
        return this;
    }

    alternarModo() {
        this.modo++;
        if (this.modo >= Object.values(MODO_GRAFICO).length) {
            this.modo = MODO_GRAFICO.GRAFICO_OFF;
        }
    }

    isGraficoOn() {
        return this.modo !== MODO_GRAFICO.GRAFICO_OFF;
    }

}

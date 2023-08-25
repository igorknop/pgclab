import Cena from "./Cena.js";
import Button from "../../../js/utils/Button.js"
import getXY from "../../../js/utils/getXY.js"
import Jogador from "../Jogador.js";
import Inimigo from "../Inimigo.js";

export default class CenaJogo extends Cena {
    constructor(canvas = null, assets = null) {
        super(canvas, assets);
        this.jogador = new Jogador(this.canvas, this);
        this.inimigo = new Inimigo(this.canvas, this);
        this.taxaPonto = 0;
        this.pontosGastos = 0;
        this.pontosAtuais = 100;
        this.nivelAtual = 1;
        this.mapaTeclado = {
            " ": false
        }
        this.log = {
            upgrades: [],
            registros: []
        }
        this.espacoPressionado = false;
    }

    desenhar() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.desenharHud();
        this.desenharPersonagens();
        super.desenharBotoes();
    }

    desenharPersonagens() {

        this.jogador.desenhar();
        this.inimigo.desenhar();


    }

    desenharHud() {

        this.ctx.fillStyle = "hsl(30, 100%, 60%)";
        this.ctx.fillRect(0, 0, this.canvas.width, 100);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, 100);
        this.ctx.beginPath();

        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Times";
        this.ctx.textAlign = "left";
        let x1 = 30;
        let x2 = 220;
        let yOffset = 30;
        let yPadding = 25;
        this.ctx.fillText("Tempo: ", 785, 40);
        this.ctx.fillText(this.temporizador.toFixed(0), 850, 40);
        this.ctx.fillText("Experiencia: ", x1, yOffset);
        this.ctx.fillText("Nível: ", x1, yOffset + yPadding);
        this.ctx.fillText("Pontos disponíveis: ", x1, yOffset + 2 * yPadding);
        this.ctx.fillText(this.jogador.experienciaAtual + '/' + this.jogador.experienciaNivel, x2, yOffset);
        this.ctx.fillText(this.jogador.nivel, x2, yOffset + yPadding);
        this.ctx.fillText(this.jogador.pontosAtributos, x2, yOffset + 2 * yPadding);
        this.ctx.fillStyle = "white";
        // this.ctx.textAlign = "center";

        this.ctx.font = "28px Times";
        this.ctx.fillStyle = "hsl(30, 100%, 80%)";
        this.ctx.fillText("Nivel ", 0.45 * this.canvas.width,
            0.3 * this.canvas.height + (0.055 * this.canvas.height) / 2);
        this.ctx.fillText(this.nivelAtual, 0.55 * this.canvas.width,
            0.3 * this.canvas.height + (0.055 * this.canvas.height) / 2);
        this.ctx.font = "20px Times";

    }


    createAreas() {
        this.botaoFaseAnterior = this.adicionarBotao(new Button(
            0.35 * this.canvas.width,
            0.3 * this.canvas.height,
            0.035 * this.canvas.width,
            0.055 * this.canvas.height,
            "",
            true,
            "arrow_left"
        ));
        this.botaoProximaFase = this.adicionarBotao(new Button(
            0.65 * this.canvas.width,
            0.3 * this.canvas.height,
            0.035 * this.canvas.width,
            0.055 * this.canvas.height,
            "",
            true,
            "arrow_right"
        ));
        // this.botaoAtacar = this.adicionarBotao(new Button(
        //     0.5 * this.canvas.width,
        //     0.5 * this.canvas.height,
        //     0.15 * this.canvas.width,
        //     0.07 * this.canvas.height,
        //     "ATACAR"
        // ));
        this.botaoForca = this.adicionarBotao(new Button(
            0.2 * this.canvas.width,
            0.8 * this.canvas.height,
            0.2 * this.canvas.width,
            0.07 * this.canvas.height,
            "+ DANO"
        ));
        this.botaoVelocidade = this.adicionarBotao(new Button(
            0.2 * this.canvas.width,
            0.9 * this.canvas.height,
            0.2 * this.canvas.width,
            0.07 * this.canvas.height,
            "+ VELOCIDADE"
        ));
    }

    quadro(t) {
        super.quadro(t);
        this.temporizador += this.dt;
        this.controle();
        this.pontosAtuais = parseFloat(
            (this.pontosAtuais + this.taxaPonto * this.dt).toFixed(10)
        );
        if (this.counter >= 1) {
            // this.log.registros.push({
            // 	"tempo": this.temporizador.toFixed(0),
            // 	"totalGasto": this.pontosGastos,
            // 	"taxaAtual": this.taxaPonto,
            // 	"poderAtual": this.pontosAtuais.toFixed(1)
            // });
            // this.game.graph.adicionarDado(parseInt(this.temporizador), this.taxaPonto);
            // this.game.graph.atualizarGrafico();
            this.counter = 0;
        }
        // if (this.temporizador.toFixed(0) % 5 === 0) {
        // 	this.game.graph.atualizarGrafico();
        // }
    }

    // Controle dos inputs do teclado
    controle() {
        this.inimigo.controle();
        this.jogador.controle();
        // Atalho para aumentar pontos
        if (this.input.comandos.get("MIL")) {
            if (!this.mapaTeclado["+"]) {
                this.mapaTeclado["+"] = true;
                this.pontosAtuais += 1000;
            }
            return;
        } else {
            this.mapaTeclado["+"] = false;
        }

        this.heuristica?.controle(this);
    }


    preparar() {
        super.preparar();
        this.createAreas();
        this.canvas.onmousedown = (e) => {
            this.mousedown(e);
        };
        this.canvas.onmousemove = (e) => {
            this.mousemove(e);
        };
        this.canvas.onclick = (e) => {
            this.click(e);
        };
    }

    mousedown(e) {
        if (this.assets.progresso() < 100.0 || this.expire > 0) {
            return;
        }
    }

    mousemove(e) {
        super.mousemove(e);
    }

    click(e) {
        this.mousedown(e);
        const [x, y] = getXY(e, this.canvas);
        // if (this.botaoAtacar.hasPoint({ x, y })) {
        //     this.atacar();
        // }
        if (this.botaoForca.hasPoint({ x, y })) {
            this.upgrade('forca');
        }
        if (this.botaoVelocidade.hasPoint({ x, y })) {
            this.upgrade('velocidade');
        }
        if (this.botaoProximaFase.hasPoint({ x, y })) {
            this.nivelAtual++;
        }
        if (this.botaoFaseAnterior.hasPoint({ x, y })) {
            this.nivelAtual = this.nivelAtual > 1 ? this.nivelAtual - 1 : this.nivelAtual;
        }

    }


    upgrade(atributo) {

        this.jogador.upgrade(atributo);
        /*
        if (resource.currentCost > this.pontosAtuais)
            return;
        this.pontosAtuais = parseFloat(
            (this.pontosAtuais - resource.currentCost).toFixed(10)
        );
        this.pontosGastos += parseFloat(
            resource.currentCost.toFixed(10)
        );
        resource.quantity++;
        this.taxaPonto = parseFloat(
            (this.taxaPonto + resource.income).toFixed(10)
        );
        this.log.upgrades.push({
            "recursoMelhorado": resource.label,
            "custo": resource.currentCost,
        });
        resource.currentCost = Math.round(
            resource.initialCost * Math.pow(1.15, resource.quantity)
        );
        this.game.graph.adicionarDado(parseInt(this.temporizador), this.taxaPonto);
        this.game.graph.atualizarGrafico()
        // this.game.graph.adicionarDado(resource.currentIncome, resource.currentCost);
        // this.game.graph.atualizarGrafico();
        return;
        */
    }

    atacar() {
        this.jogador.atacar();
    }

}

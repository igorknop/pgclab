import Cena from "./Cena.js";
import getXY from "../../../js/utils/getXY.js";
import Button from "../../../js/utils/Button.js"

export default class CenaMenu extends Cena {
    constructor(canvas = null, assets = null) {
        super(canvas, assets);
    }

    desenhar() {
        super.desenhar();
    }

    quadro(t) {
        super.quadro(t);
    }

    controle() { }

    quandoColidir(a, b) { }

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

    createAreas() {
        this.iniciarJogo = this.adicionarBotao(new Button(
            0.5 * this.canvas.width,
            0.5 * this.canvas.height,
            0.25 * this.canvas.width,
            0.07 * this.canvas.height,
            "Iniciar jogo"
        ));
        // this.jogo = this.adicionarBotao(new Button)
    }

    mousedown(e) {
        if (this.assets.progresso() < 100.0 || this.expire > 0) {
            return;
        }
        const [x, y] = getXY(e, this.canvas);
        if (this.iniciarJogo.hasPoint({ x, y })) {
            this.game.selecionaCena("cenaJogo");
        }
    }

    click(e) {
        // this.mousedown(e);
    }

    mousemove(e) {
        super.mousemove(e);
    }

    desenharHud() { }
}

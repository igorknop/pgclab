import CenaJogo from "./CenaJogo.js";
import { recursosRegressivo } from "./recursos.js"


export default class CenaJogoRegressivo extends CenaJogo {

    constructor(canvas = null, assets = null) {
        super(canvas, assets);
        this.recursos = recursosRegressivo;
        this.temporizador = 300;
    }

    quadro(t) {
        super.quadro(t);
        this.temporizador -= this.dt;
    }

    controle() {
        if (Math.round(this.temporizador) == 0) {
            console.log("Entrou aqui");
            this.game.pausarJogo();
        }
        super.controle();

    }

}
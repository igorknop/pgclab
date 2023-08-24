import { recursosNormal } from "./recursos.js"
import CenaJogo from "./CenaJogo.js";

export default class CenaJogoNormal extends CenaJogo {
    constructor(canvas = null, assets = null) {
        super(canvas, assets);
        this.recursos = recursosNormal;
    }

    quadro(t) {
        super.quadro(t);
        this.temporizador += this.dt;
    }

}
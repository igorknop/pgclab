/**
 * Heurística que compra o recurso mais barato
 * possível
 */

import Heuristica from "./Heuristica.js";

export default class MaisBarato extends Heuristica {
    constructor(canvas) {
        super(canvas);
    }

    controle(cena) {
        super.controle(cena);
        if (cena.counter >= 1) {
            cena.powerUp();
        }
        let recursos = cena.recursos.slice(0);
        let cheaper = recursos[0];
        recursos.forEach(resource => {
            cheaper = resource.currentCost < cheaper.currentCost ? resource : cheaper;
        });
        cena.upgrade(cheaper);

    }

}
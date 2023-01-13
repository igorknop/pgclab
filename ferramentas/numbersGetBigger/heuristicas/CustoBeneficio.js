/**
 * Heurística que compra o recurso com o maior
 * custo benefício (custo / incremento)
 */

import Heuristica from "./Heuristica.js";

export default class CustoBeneficio extends Heuristica {
    constructor(canvas) {
        super(canvas);
    }

    controle(cena) {
        super.controle(cena);
        if (cena.counter >= 1) {
            cena.powerUp();
        }
        let recursos = cena.recursos.slice(0);
        let best = recursos[0];
        let custoBeneficioAtual = best.currentCost / best.income;
        recursos.forEach(resource => {
            let custoBeneficio = resource.currentCost / resource.income;
            if (custoBeneficio < custoBeneficioAtual) {
                best = resource;
                custoBeneficioAtual = best.currentCost / best.income;
            }
        });
        cena.upgrade(best);

    }

}
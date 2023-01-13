import ProgressionManager from "../ProgressionManager.js";
import Character from "./Character.js";
import { slime_atributos_base, slime_crescimento_por_nivel } from "./EnemiesBaseAttributes.js";
import Enemy from "./Enemy.js";

export default class Slime extends Enemy {

    static getAtributosBase() {
        const atributos = Object.assign({}, slime_atributos_base);
        return atributos;
    }

    static getTaxaCrescimentoAtributos() {
        const taxasCrescimento = Object.assign({}, slime_crescimento_por_nivel);
        return taxasCrescimento;
    }

    static getPoderBase() {
        return ProgressionManager.calcularPoderTotal(Slime.getAtributosBase(), Slime.getTaxaCrescimentoAtributos());
    }

    constructor(nivel) {
        super({ s: 22, w: 22, h: 10, nomeImagem: "slime", sizeImagem: 22 }, nivel);
        this.matrizImagem = {
            linha: 1,
            colunas: 9,
            widthImagem: 22,
            heightImagem: 22
        };
        this.qtdAnimacoes = { types: 2, lines: [1, 0], qtd: [3, 9] /* atacking: 9, normal: 3*/ };
        this.speedAnimation = 11.49; //1.2;
        this.xpFornecida = 50;
        this.cooldownAtaque = 8;                  //Tempo travado até terminar o ataque            
        this.atributos = Slime.getAtributosBase();
        this.taxasCrescimento = Slime.getTaxaCrescimentoAtributos();
        this.criarAnimacoes();
    }

    distribuirPoder(poder, seedGen) {
        let podeFazerUpgrade = true;
        const keys = Object.keys(this.atributos);
        let atributosVisitados = keys.map((k, index) => {
            if (index < 3)
                return 0;
            return 1;
        });
        while (poder > 0 && podeFazerUpgrade) {
            let indexAtributo = seedGen.nextRandInt(0, 3);
            let valorAtual = this.atributos[keys[indexAtributo]];
            let custoUpgrade = ProgressionManager.aplicarFuncaoDeProgressao(
                valorAtual,
                1,
                "cookie",
                this.taxasCrescimento[keys[indexAtributo]]
            );
            if (poder < custoUpgrade) {
                atributosVisitados[indexAtributo] = 1;
                if (atributosVisitados.filter(atributo => atributo === 0).length === 0) {
                    podeFazerUpgrade = false;
                }
            } else {
                poder -= custoUpgrade;
                this.atributos[keys[indexAtributo]] += 1;
            }
        }
    }

    calcularNivel(poder) {
        // this.poderTotal = poder;
        this.nivel = (Math.log10(poder) / (Math.log10(1.5)) << 0) - 2;
    }

}
import { getPlayer } from "./Entities/Player.js";
import Slime from "./Entities/Slime.js";

const RATE = 1.07;

export default class ProgressionManager {
    constructor() {
        this.poderBase = Slime.getPoderBase();
        this.contadorInimigos = 0;
    }

    static distribuirPoderEntreInimigos(room, mapa) {
        let poder = this.poderBase;
        const inimigosOrdenados = room.enemies.sort((a, b) => {
            const celulaA = mapa.getCell(a.gy, a.gx);
            const celulaB = mapa.getCell(b.gy, b.gx);
            return celulaB.distInundacaoSaida - celulaA.distInundacaoSaida;
        });
        inimigosOrdenados.forEach(inimigo => {
            poder = ProgressionManager.aplicarFuncaoDeProgressao(this.contadorInimigos, this.poderBase, 'cookie');
            this.contadorInimigos++;
            const poderAcimaDoBase = poder - this.poderBase;
            inimigo.distribuirPoder(poderAcimaDoBase, this.seedGen);
            inimigo.hpAtual = inimigo.atributos.hpMax;
            inimigo.poderTotal = ProgressionManager.calcularPoderTotal(inimigo.atributos, inimigo.taxasCrescimento);
            inimigo.calcularNivel(poder);
        });
        return poder;
    }

    static aplicarFuncaoDeProgressao(valorAtual, valorBase, funcao, multiplicador = RATE) {
        switch (funcao) {
            case 'cookie':
                return (valorBase * Math.pow(multiplicador, valorAtual));
            case 'incremental':
                return Math.round(valorBase * ((1 - Math.pow(RATE, valorAtual)) / (1 - multiplicador)));
            default:
                return valorAtual * 1.05;
        }
    }
    
    static calculaMapaDePoderSala(room) {
        if (room == null) {
            return;
        }
        const inimigos = room.enemies;
        inimigos.forEach((inimigo, index) => {
            const celula = room.blocks.find(block => {
                return (block.linha == inimigo.gy && block.coluna == inimigo.gx);
            });
            if (celula) {
                let poderInimigo = inimigo.poderTotal;
                const avaliar = [{ celula: celula, poder: poderInimigo}];
                let aux;
                while (aux = avaliar.shift()) {
                    if (aux.poder <= 0 || aux.celula.idObjetoInundacao == index) {
                        continue;
                    }
                    aux.celula.influenciaPoder += aux.poder;
                    aux.celula.idObjetoInundacao = index;
                    for (let i = 0; i < aux.celula.vizinhos.length; i++) {
                        avaliar.push({
                            celula: room.blocks[aux.celula.vizinhos[i]],
                            poder: Math.floor(aux.poder - (poderInimigo * 0.1))
                        });
                    }
                }
            }
        });
        room.atualizaMetricas(['influenciaPoder']);
    }

    static calcularPoderTotal(atributos, taxaCrescimento) {
        let somaPoder = 0;
        Object.keys(atributos).forEach((key) => {
            let somaAtributo = 0;
            for (let i = 1; i <= atributos[key]; i++) {
                let custoAtributo = ProgressionManager.aplicarFuncaoDeProgressao(i, 1, "cookie", taxaCrescimento[key]);
                somaAtributo += custoAtributo;
            }
            somaPoder += somaAtributo;
        });
        return somaPoder << 0;
    }

}
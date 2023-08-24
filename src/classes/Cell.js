export default class Cell {
    constructor(params = {}) {
        let exemplo = {
            tipo: 0,
            room: -3,
            distTeleportes: 999,
            distFirezones: 999,
            distInimigos: 999,
            distTesouros: 999,
            distCaminhoEntradaSaida: 999,
            linha: 0,
            coluna: 0,
            direcaoSaida: ">",
            direcaoTesouros: "V",
            notacaoTesouros: ".",
            notacaoPlayer: ".   .",
            distInundacaoSaida: Infinity,
            distInundacaoTemp: -1,
            indexRoom: -1,
            vizinhos: [],
            influenciaPoder: 0,
            idObjetoInundacao: -1,
            podePosicionarInimigo: false,
            podePosicionarTesouro: false,
        };

        Object.assign(this, exemplo, params); // Sobrescreve os atributos de params e exemplo na classe

        this.metricas = {
            distCaminhoEntradaSaida: 999,
            mediaInimigoTeleportePoder: -1,
            mediaInimigoTesouroTeleportePoder: -1,
            mediaTesouroFirezoneTeleporteEntradaSaida: -1,
        };
    }

    // Média entre as distências da célula até inimigo e teleporte
    distInimigoTeleporte(maxInimigo = 1, maxTeleporte = 1) {
        return (
            (this.distInimigos / maxInimigo +
                this.distTeleportes / maxTeleporte) /
            2
        );
    }

    // Média entre as distências da célula até inimigo e teleporte
    distInimigo_Tesouro_Teleporte(
        maxInimigo = 1,
        maxTeleporte = 1,
        maxTesouro = 1
    ) {
        return (
            (this.distInimigos / maxInimigo +
                this.distTeleportes / maxTeleporte +
                this.distTesouros / maxTesouro) /
            2
        );
    }

    /**
     * Média entre as distâncias normalizadas da célula até inimigo e teleporte 
     * e o valor normalizado de poder.
     * É utilizado para o posicionamento de inimigo.
     */
    mediaInimigo_Teleporte_Poder(
        maxInimigo = 1,
        maxTeleporte = 1,
        maxPoder = 1
    ) {
        let poder = this.influenciaPoder / maxPoder;
        if (this.influenciaPoder === 0 || maxPoder === 0) {
            poder = 0;
        }
        return (
            (this.distInimigos / maxInimigo +
                this.distTeleportes / maxTeleporte +
                1 -
                poder) /
            3
        );
    }

    // Média entre as distências normalizadas da célula até inimigo, tesouro e teleporte e o valor
    // normalizado de poder
    mediaInimigo_Tesouro_Teleporte_Poder(
        maxInimigo = 1,
        maxTeleporte = 1,
        maxTesouro = 1,
        maxPoder = 1
    ) {
        let poder = this.influenciaPoder / maxPoder;
        if (this.influenciaPoder === 0 || maxPoder === 0) {
            poder = 0;
        }
        return (
            (this.distInimigos / maxInimigo +
                this.distTeleportes / maxTeleporte +
                this.distTesouros / maxTesouro +
                1 -
                poder) /
            4
        );
    }

    /**
     * Média entre as distências normalizadas da célula até teleporte, firezone, tesouro
     * e a distância até o caminho entrada-saída.
     * É utilizado para o posicionamento de tesouros
     */
    mediaTesouro_Firezone_Teleporte_EntradaSaida(
        maxTeleporte = 1,
        maxFirezones = 1,
        maxTesouro = 1,
        maxEntradaSaida = 1
    ) {
        return ((
            // this.distTeleportes / maxTeleporte +
                this.distFirezones / maxFirezones +
                this.distTesouros / maxTesouro +
                this.distTesouros / maxTesouro +
                this.distCaminhoEntradaSaida / maxEntradaSaida) /
            4
        );
    }


    clone(celula) {
        this.tipo = celula.tipo;
        this.room = celula.room;
        this.distTeleportes = celula.distTeleportes;
        this.distFirezones = celula.distFirezones;
        this.distInimigos = celula.distInimigos;
        this.distTesouros = celula.distTesouros;
        this.distCaminhoEntradaSaida = celula.distCaminhoEntradaSaida;
        this.linha = celula.linha;
        this.coluna = celula.coluna;
        this.influenciaPoder = celula.influenciaPoder;
        this.vizinhos = celula.vizinhos;
        this.distInundacaoSaida = celula.distInundacaoSaida;
        this.metricas = celula.metricas;
    }
}

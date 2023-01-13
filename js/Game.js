export default class Game {
    constructor(canvas, assets, input) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.assets = assets;
        this.input = input;
        this.cenas = new Map();
        this.cena = null;
        this.moedas = 0;
        this.pause = false;
        this.heuristica = null;
    }

    adicionarCena(chave, cena) {
        this.cenas.set(chave, cena);
        cena.game = this;
        cena.canvas = this.canvas;

        cena.ctx = this.ctx;
        cena.assets = this.assets;
        cena.input = this.input;
        if (this.cena === null) {
            this.cena = cena;
        }
    }

    selecionaCena(chave) {
        if (this.cenas.has(chave)) {
            //console.log(chave);
            this.parar();
            this.cena = this.cenas.get(chave);
            this.cena.setHeuristica(this.heuristica);
            this.cena.preparar();
            this.iniciar();
        }
    }

    preparar() {
        this.cena?.preparar();
    }

    iniciar() {
        this.cena?.iniciar();
    }

    parar() {
        this.cena?.parar();
    }

    setHeuristica(heuristica) {
        this.heuristica = heuristica;
        this.cena?.setHeuristica(heuristica);
    }

    pausarJogo() {
        this.pause = false;
        this.cena?.pausarJogo();
    }


}
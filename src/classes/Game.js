import CenaJogo from "./Cenas/CenaJogo.js";
import CenaMenu from "./Cenas/CenaMenu.js";

export default class Game {

    constructor(canvas, assetsMng, inputManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.assetsMng = assetsMng;
        this.inputManager = inputManager;
        this.cenas = new Map();
        this.cenaAtual = null;
        this.pause = "false";

        this.widthMap = 120;
        this.heightMap = 120;
        this.sizeMap = 32;
        this.escala = 1.8;

        this.adicionarCena('jogo', new CenaJogo());
        this.adicionarCena('menuInicial', new CenaMenu());
        this.selecionarCena('menuInicial');
        this.moedas = 0;
    }

    adicionarCena(chave, cena) {
        this.cenas.set(chave, cena);
        cena.game = this;
        cena.canvas = this.canvas;

        cena.ctx = this.ctx;
        cena.assetsMng = this.assetsMng;
        cena.inputManager = this.inputManager;
        if (this.cenaAtual === null) {
            this.cenaAtual = cena;
        }
    }

    selecionarCena(chave) {
        if (this.cenas.has(chave)) {
            this.parar();
            this.cenaAtual = this.cenas.get(chave);
            this.preparar();
            this.iniciar();
        }
    }

    preparar() {
        this.cenaAtual?.preparar();
    }

    iniciar() {
        this.cenaAtual?.iniciar();
    }

    parar() {
        this.cenaAtual?.parar();
    }
}
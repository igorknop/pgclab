export const fontMainMenu = "30px Arial Black";
export const wordsColor = "white";
export const alignMainMenu = "center";
import Hud from "../Hud.js";
import getXY from "../utils/getXY.js";

export default class Cena {
    constructor(canvas = null, assets = null) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext("2d");
        this.assets = assets;
        this.game = null;
    }

    desenhar() {
        this.limparTela();
    }

    adicionar(sprite) {
        sprite.cena = this;
        this.sprites.push(sprite);
    }

    passo(dt) {
        if (this.assets.acabou()) {
            for (const sprite of this.sprites) {
                sprite.passo(dt);
            }
        }
    }

    quadro(t) {
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0) / 1000;
        // this.passo(this.dt);
        this.desenhar();
        // this.checaColisao();
        if (this.rodando) {
            this.idAnim = requestAnimationFrame((t) => { this.quadro(t); });
        }
        this.t0 = t;
    }

    iniciar() {
        this.rodando = true;
        this.idAnim = requestAnimationFrame((t) => { this.quadro(t); });
    }

    parar() {
        this.rodando = false;
        cancelAnimationFrame(this.idAnim);
        this.t0 = null;
        this.dt = 0;
    }

    checaColisao() {
        for (let a = 0; a < this.sprites.length - 1; a++) {
            const spriteA = this.sprites[a];
            for (let b = a + 1; b < this.sprites.length; b++) {
                const spriteB = this.sprites[b];
                if (spriteA.colidiuCom(spriteB)) {
                    this.quandoColidir(spriteA, spriteB);
                }
            }
        }
    }

    quandoColidir(a, b) {

    }

    configuraMapa(mapa) {
        this.mapa = mapa;
        this.mapa.cena = this;
    }

    configuraLayer(layer) {
        this.layer = layer;
        this.layer.cena = this;
    }

    configuraPath(path) {
        this.path = path;
        this.path.cena = this;
    }

    preparar() {
        this.sprites = [];
        this.aRemover = [];
        this.t0 = null;
        this.dt = 0;
        this.idAnim = null;
        this.mapa = null;
        this.layer = null;
        this.path = null;
        this.rodando = true;
    }

    desenharHud() {

    }

    limparTela() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    mousemove(e) {
        const [x, y] = getXY(e, this.canvas);
        const botoes = Hud.getInstance().botoes;
        for (let i = 0; i < botoes.length; i++) {
            const botao = botoes[i];
            if (!botao.esconder && botao.hasPoint({ x, y })) {
            this.canvas.style.cursor = 'pointer'
            return;
            }
        }
        this.canvas.style.cursor = 'default'
    }

    // capturarInput() {
    //     if (this.input.comandos.get("F")) {
    //         fullscreen = !fullscreen;
    //         if (fullscreen) {
    //             openFullscreen();
    //         }
    //         else {
    //             closeFullscreen();
    //         }
    //         break;
    //         return;
    //     }
    // }
}

export const fontMainMenu = "30px Arial Black";
export const wordsColor = "white";
export const alignMainMenu = "center";
import Hud from "../Hud.js";
import getXY from "../utils/getXY.js";

export default class Scene {
    constructor() {
        this.game = null;
        this.assets = null;
    }

    draw() {
        this.clearScreen();
    }

    add(sprite) {
        sprite.scene = this;
        this.sprites.push(sprite);
    }

    step(dt) {
        if (this.assets.acabou()) {
            for (const sprite of this.sprites) {
                sprite.passo(dt);
            }
        }
    }

    frame(t) {
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0) / 1000;
        // this.step(this.dt);
        this.draw();
        // this.checkCollision();
        if (this.running) {
            this.idAnim = requestAnimationFrame((t) => { this.frame(t); });
        }
        this.t0 = t;
    }

    start() {
        this.running = true;
        this.idAnim = requestAnimationFrame((t) => { this.frame(t); });
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.idAnim);
        this.t0 = null;
        this.dt = 0;
    }

    checkCollision() {
        for (let a = 0; a < this.sprites.length - 1; a++) {
            const spriteA = this.sprites[a];
            for (let b = a + 1; b < this.sprites.length; b++) {
                const spriteB = this.sprites[b];
                if (spriteA.colidiuCom(spriteB)) {
                    this.onCollide(spriteA, spriteB);
                }
            }
        }
    }

    onCollide(a, b) {

    }

    setupMap(mapa) {
        this.mapa = mapa;
        this.mapa.cena = this;
    }

    setupLayer(layer) {
        this.layer = layer;
        this.layer.cena = this;
    }

    setupPath(path) {
        this.path = path;
        this.path.cena = this;
    }

    setup() {
        this.sprites = [];
        this.aRemover = [];
        this.t0 = null;
        this.dt = 0;
        this.idAnim = null;
        this.mapa = null;
        this.layer = null;
        this.path = null;
        this.running = true;
    }

    drawHud() {

    }

    clearScreen() {
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

    // captureInput() {
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

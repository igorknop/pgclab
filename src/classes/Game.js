import GameScene from "../scene/GameScene.js";
import MenuScene from "../scene/MenuScene.js";

export default class Game {

    constructor(canvas, assets, input) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.assets = assets;
        this.input = input;
        this.scenes = new Map();
        this.currentScene = null;
        this.pause = "false";

        this.widthMap = 120;
        this.heightMap = 120;
        this.sizeMap = 32;
        this.escala = 1.8;

        this.addScene('jogo', new GameScene());
        this.addScene('menuInicial', new MenuScene());
        this.selectScene('menuInicial');
        this.moedas = 0;
    }

    addScene(chave, scene) {
        this.scenes.set(chave, scene);
        scene.game = this;
        scene.assets = this.assets;
        scene.canvas = this.canvas;
        scene.ctx = this.ctx;
        scene.input = this.input;
        if (this.currentScene === null) {
            this.currentScene = scene;
        }
    }

    selectScene(key) {
        if (this.scenes.has(key)) {
            this.stop();
            this.currentScene = this.scenes.get(key);
            this.setup();
            this.start();
        }
    }

    setup() {
        this.currentScene?.setup();
    }

    start() {
        this.currentScene?.start();
    }

    stop() {
        this.currentScene?.stop();
    }
}
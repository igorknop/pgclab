import AssetManager from "../../js/AssetManager.js";
import Mixer from "../../js/Mixer.js";
import InputManager from "../../js/InputManager.js";
import Game from "../../js/Game.js";
import Cena from "./cenas/Cena.js";
import CenaMenu from "./cenas/CenaMenu.js";
import CenaJogo from "./cenas/CenaJogo.js";

const input = new InputManager();
const mixer = new Mixer(10);
export const assets = new AssetManager(mixer);

assets.carregaImagem("arrow_right", "../../assets/images/arrow_right.png"); // 75x77
assets.carregaImagem("arrow_left", "../../assets/images/arrow_left.png"); // 75x77
const canvas = document.querySelector("canvas");
canvas.width = 16 * 60;
canvas.height = 9 * 48;

// var myChart = new Graph();
input.configurarTeclado({
    ArrowLeft: "MOVE_ESQUERDA",
    ArrowRight: "MOVE_DIREITA",
    ArrowUp: "MOVE_CIMA",
    ArrowDown: "MOVE_BAIXO",
    h: "MOSTRA_HITBOX",
    t: "CENA_CAMINHO_SPRITE",
    r: "CENA_CAMINHO_GRID",
    d: "VER_DISTANCIAS",
    m: "MENU",
    s: "VER_MATRIZ",
    a: "ATIVAR_LAYER",
    n: "MOSTRAR_CAMINHO",
    " ": "ATACAR",
    a: "A",
    b: "B",
    c: "C",
    d: "D",
    e: "E",
    Enter: "ENTER",
    l: "PAUSAR_JOGO",
    "+": "MIL"
});

const game = new Game(canvas, assets, input);
// game.graph = myChart;
const cenaMenu = new CenaMenu();
const cenaJogo = new CenaJogo(canvas, assets);

// game.adicionarCena("menu", cenaMenu);
game.adicionarCena("cenaJogo", cenaJogo);

game.preparar();
game.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "i":
            game.iniciar();
            break;
        case "p":
            game.parar();
            break;
    }
});

import AssetManager from "../../js/AssetManager.js";
import Mixer from "../../js/Mixer.js";
import InputManager from "../../js/InputManager.js";
import Game from "../../js/Game.js";
import Cena1 from "./Cena1.js";
import CenaJogo from '../../classes/Cenas/CenaJogo.js'
import CenaMenu from '../../classes/Cenas/CenaMenu.js'
import StartScene from "./StartScene.js";

const input = new InputManager();
const mixer = new Mixer(10);
export const assets = new AssetManager(mixer);

const canvas = document.querySelector("canvas");
canvas.width = 16 * 60;
canvas.height = 9 * 48;

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
  " ": "MAKE_POINT",
  a: "A",
  b: "B",
  c: "C",
  d: "D",
  e: "E",
  Enter: "ENTER"
});

const game = new Game(canvas, assets, input);
// const cenaMenu = new CenaMenu(canvas);
// const cenaJogo = new CenaJogo(canvas);
// game.adicionarCena("menu", cenaMenu);
// game.adicionarCena("jogo", cenaJogo);
// const cena1 = new CenaFase1();
// const cena2 = new CenaMapaGrid();
// const cenaInicio = new CenaInicio();
// game.adicionarCena("inicio", cenaInicio);
// game.adicionarCena("fase1", cena1);
// game.adicionarCena("fase2", cena2);

const cena1 = new Cena1(canvas);
const startScene = new StartScene(canvas);
game.adicionarCena("startScene", startScene);
game.adicionarCena("cena1", cena1);

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

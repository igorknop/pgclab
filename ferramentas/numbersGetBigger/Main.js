import AssetManager from "../../js/AssetManager.js";
import Mixer from "../../js/Mixer.js";
import InputManager from "../../js/InputManager.js";
import Game from "../../js/Game.js";
import CenaInicial from "./CenaInicial.js";
import Graph from './Grafico.js'
import CenaJogoRegressivo from "./CenaJogoRegressivo.js";
import CenaJogoNormal from "./CenaJogoNormal.js";

const input = new InputManager();
const mixer = new Mixer(10);
export const assets = new AssetManager(mixer);

assets.carregaImagem("checkbox", "../../assets/images/checkbox.png"); // 75x77
const canvas = document.querySelector("canvas");
canvas.width = 16 * 60;
canvas.height = 9 * 48;

var myChart = new Graph();
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
  Enter: "ENTER",
  l: "PAUSAR_JOGO",
  "+": "MIL"
});

const game = new Game(canvas, assets, input);
game.graph = myChart;
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

const cenaNormal = new CenaJogoNormal(canvas);
const cenaRegressivo = new CenaJogoRegressivo(canvas);
const cenaInicial = new CenaInicial(canvas);
game.adicionarCena("CenaInicial", cenaInicial);
game.adicionarCena("cenaNormal", cenaNormal);
game.adicionarCena("cenaRegressivo", cenaRegressivo);

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

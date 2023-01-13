import AssetsManager from "./AssetsManager.js";
import SeedGenerator from "./SeedGenerator.js";
import Sprite from "./Sprite.js";
import Player, { setPlayer, getPlayer } from "./Entities/Player.js";
import Level from "./Level.js";
import Room from "./Room.js";
import Map from "./Map.js";
import Cell from "./Cell.js";
import CellularAutomata from "./CellularAutomata.js";
import assetsMng from "./AssetsMng.js";
import { setMapArea, getMapArea } from "./MAPA_AREA.js";
import { setDebugMode, getDebugMode } from "./DebugMode.js";
import { converteTelaCheia, escreveTexto } from "./Utils.js";
import Game from "./Game.js";

// import AssetsManager from "./AssetsManager.js";
// // import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
// import Game from "./Game.js";
// import CenaJogo from './Cenas/CenaJogo.js'
// import CenaMenu from './Cenas/CenaMenu.js'

const tela = document.getElementById("canvas");
const input = new InputManager();
input.configurarTeclado({
    ArrowLeft: "SETA_ESQUERDA",
    ArrowRight: "SETA_DIREITA",
    ArrowUp: "SETA_CIMA",
    ArrowDown: "SETA_BAIXO",
    " ": "SPACE",
    Enter: "ENTER",
    Control: "CONTROL",
    Shift: "Shift",
    m: "m",
    Escape: "ESC",
    c: "ALTERNA_CAMINHO",
    p: "p",
    o: "o",
    t: "t",
    g: "ALTERNA_GRAFICO",
    Add: "+",
    Subtract: "-"


});
// Ocupa a janela toda
tela.width = window.innerWidth;
tela.height = window.innerHeight;
tela.widthOld = 600;
tela.heightOld = 350;

tela.style.border = '2px solid #000';                       //Colocando borda no canvas
const ctx = tela.getContext("2d");
let fullscreen = false;
let anterior = 0;
let dt = 0;
let estado = 1;

// Controle das imagens e sons presentes no jogo
//var assetsMng = new AssetsManager();
//console.log(assetsMng);

// Carregamento das imagens do jogo
assetsMng.loadImage("brick_gray", "assets/images/brick_gray.png");
assetsMng.loadImage("brick_dark_Tp_0", "assets/images/brick_dark0.png");
assetsMng.loadImage("coin_copper", "assets/images/coin_copper.png");
assetsMng.loadImage("coin_gold", "assets/images/coin_gold.png");
assetsMng.loadImage("coin_silver", "assets/images/coin_silver.png");
assetsMng.loadImage("flames", "assets/images/flames.png");
assetsMng.loadImage("floor_sand", "assets/images/floor_sand_stone0.png");
assetsMng.loadImage("grass_full", "assets/images/grass_full.png");
assetsMng.loadImage("player", "assets/images/player-sprite.png");
assetsMng.loadImage("rockBlock", "assets/images/rock.png");
assetsMng.loadImage("slime", "assets/images/slime.png");

// Carregamento dos audios presentes no jogo
assetsMng.loadAudio("teleporte", "assets/audios/Teleport.wav");

// SeedGenerator ===> Utilizado para retornar ao mesmo mapa com apenas o código da seed
let seedValueURL = location.search;

if (seedValueURL.length != 0) {                   //SEED PASSADA NA URL
    let aux = "?seed=";
    seedValueURL = seedValueURL.substring(aux.length, seedValueURL.length);
    seedValueURL = parseInt(seedValueURL);
}
else {                                           //SEED ALEATÓRIA
    let maxValue = 5000000;
    let minValue = 500000;
    seedValueURL = 4248372;//(Math.floor(Math.random() * (maxValue - minValue)) + minValue);
}
const seedGen = new SeedGenerator({ seed_1: seedValueURL, seed_2_string: "teste" });

// Proporções do mapa

const widthMap = 120;
const heightMap = 120;
const sizeMap = 32;
//setMapArea(14);  //20
let escala = 1.8;
// let escala = 3;
const K = 1;
const debugModeBegin = 0;
const debugModeEnd = 18;
setDebugMode(debugModeBegin);    // 0
// const player = new Player({
//     s: 27, w: 27, h: 11,
//     hitBox: {
//         x: 0,
//         y: 0,
//         w: 27,
//         h: 11,
//         wDefault: 27,
//         hDefault: 11
//     }
// });
// setPlayer(player);

// const hud = getHud();
// hud.init(tela);

// const levelAtual = new Level(widthMap, heightMap, sizeMap, { hud, seedGen, assetsMng });
// let levels = [];
// levels.push(new Level(widthMap, heightMap, sizeMap, { hud, seedGen, assetsMng }));

/**
  METODO DE SUBMATRIZES
*/

/*
var geraFase = new CellularAutomata(Math.floor(heightMap / K), Math.floor(widthMap / K), 1, 0.5, 4, 0, 5, 1);//new CellularAutomata(heightMap, widthMap, 2, 0.5, 13, 0, 5, 1);
// 0 => floor
// 5 => rock
// 1 => wall
for(var k = 0; k<K; k++){
  geraFase.scenarioRandomWall();
  geraFase.fullstep(2);
  //geraFase.fullstep(6);
  levels[0].setMatrixMap2(getelaraFase.map, Math.floor(k/3)*40, (k%3)*40);
}
geraFase.countRooms();
geraFase.filterRooms(15);
for(var k = 0; k<K; k++){
  levels[0].setMatrixMap2(geraFase.map, Math.floor(k/3)*40, (k%3)*40);
}
*/

/**
  METODO DA MATRIZ TOTAL
*/
// const geraFase = new CellularAutomata({
//     HS: heightMap, WS: widthMap, MOORE: 1, r: 0.5,
//     totalRock: 4, floorIndex: 0, rockIndex: 2, wallIndex: 1, seedGen
// });   
//new CellularAutomata(heightMap, widthMap, 2, 0.5, 13, 0, 5, 1);
// 0 => floor
// 2 => rock
// 1 => wall

// geraFase.scenarioRandomWall();
// geraFase.fullstep(2);
// geraFase.countRooms();
// geraFase.filterRooms(25);

// levels[0].setMatrixMap(geraFase.map);       // Copia a matriz de tipos dentro do gerador
// levels[0].copiaSalas(geraFase.rooms);       // Copia os dados em que os blocos da sala são apenas as posições linha e coluna da matriz
// levels[0].montarLevel({
//     dt: dt,
//     geraFase: geraFase,
//     player: getPlayer(),
// });
// levels[0].setTempo(20);                // 20 segundos

let tempoGameOver = 2;

// levelAtual.clonarLevel(levels[0]);
// getPlayer().map = levelAtual.mapa;

// let teasuresCollected = 0;

// Tempo
// const barraTempo = {
//     externa: new Sprite(),
//     interna: new Sprite(),
//     desenhar: function (ctx) {
//         this.externa.desenharTempo(ctx);
//         this.interna.desenharTempo(ctx);
//     },
//     init: function () {
//         this.externa.w = 127;
//         this.externa.h = 15;
//         this.externa.colorBG = "black";
//         this.externa.colorBorder = "white";
//         this.externa.x = 95;
//         this.externa.y = 7;
//         this.interna.w = 127;
//         this.interna.h = 15;
//         this.interna.x = 96;
//         this.interna.y = 8;
//         this.interna.colorBG = "rgb(170, 120, 0)";
//         this.interna.borderSize = 0;
//     }
// };

// barraTempo.init();

// Energia === Player
// const barraEnergia = {
//     sprite: new Sprite(),
//     desenhar: function (ctx) {
//         this.sprite.desenharBarraEnergiaHUD(ctx, getPlayer());
//     },
//     init: function () {
//         this.sprite.w = 127;
//         this.sprite.h = 15;
//         this.sprite.colorBG = "black";
//         this.sprite.colorBorder = "white";
//         this.sprite.x = 95;
//         this.sprite.y = 7;
//     }
// };

// barraEnergia.init();

// Main Menu campos
const fontMainMenu = "30px Arial Black";
const wordsColor = "white";
const alignMainMenu = "center";
let stateMainMenu = 0;

/******************************************************************************
*   ---------------------------- DEBUG MODE ------------------------------    *
*                                                                             *
*       0 => Normal;                                                          *
*       1 => Centro Player;                                                   *
*       2 => Box Collision;                                                   *
*       3 => Dados das celulas (Teleportes):                                  *
*             (Firezones)                                                     *
*           - tipo (amarelo); - room (verde); - distTeleportes (azul));       *
*       4 => Dados das celulas (Firezones):                                   *
*             (Firezones)                                                     *
*           - tipo (amarelo); - room (verde); - distFirezones (azul));        *
*       5 => Dados das celulas (Inimigos):                                    *
*             (Firezones)                                                     *
*           - tipo (amarelo); - room (verde); - distInimigos (azul));         *
*       6 => Dados das celulas (Tesouros):                                    *
*             (Firezones)                                                     *
*           - tipo (amarelo); - room (verde); - distTesouros (azul));         *
*                                                                             *
*******************************************************************************/

/************************************
*   --------- ESTADOS -----------   *
*                                   *
*       0 => Jogando;               *
*       1 => Menu principal;        *
*       2 => Game over;             *
*       3 => Jogo fechado;          *
*       4 => Passou de fase;        *
*       5 => Reiniciar fase;        *
*                                   *
*************************************/
const game = new Game(tela, assetsMng, input);
// requestAnimationFrame(passo);
// function passo(t) {
//     dt = (t - anterior) / 1000;
//     if (assetsMng.progresso() === 100) {       // Verifica se carregou todos os arquivos do jogo
//         switch (estado) {
//             case 0:     // Jogando
//                 limparTela();
//                 /*if(audioLibrary.isPlaying("BGM")==false){
//                   audioLibrary.play("BGM");
//                 }*/
// levelAtual.movimento(dt);
//                 controleTempo();
//                 ctx.save();
//                 ctx.scale(escala, escala);
//                 ctx.translate(-getPlayer().x + tela.width / 4, - getPlayer().y + tela.height / 4);
//                 // ctx.translate(-getPlayer().x, - getPlayer().y);
//                 levelAtual.desenhar(ctx);
//                 ctx.restore();
//                 desenharHUD(ctx);
//                 if (!getPlayer().vivo) {
//                     estado = 5;
//                 }
//                 break;
//             case 1:         // Main menu
//                 limparTela();
//                 //imageLibrary.drawSize(ctx, "BG", 0, 0, tela.width, tela.height); // Imagem do fundo
//                 //if(audioLibrary.isPlaying("BGM")==false){
//                 //audioLibrary.play("BGM");
//                 //}
//                 ctx.fillStyle = wordsColor;
//                 ctx.textAlign = alignMainMenu;
//                 ctx.lineWidth = 2;
//                 ctx.strokeStyle = "black";
//                 ctx.font = "40px Arial Black";
//                 ctx.strokeText("Maze Runner", tela.width / 2, tela.height / 3 - 50);
//                 ctx.fillText("Maze Runner", tela.width / 2, tela.height / 3 - 50);
//                 ctx.font = "15px Arial Black";
//                 ctx.font = fontMainMenu;
//                 if (stateMainMenu == 0) {
//                     ctx.fillStyle = "yellow";
//                     ctx.strokeText("New Game", tela.width / 2, tela.height / 2 - 60);
//                     ctx.fillText("New Game", tela.width / 2, tela.height / 2 - 60);
//                     ctx.fillStyle = wordsColor;
//                     ctx.strokeText("Quit", tela.width / 2, tela.height / 2 - 10);
//                     ctx.fillText("Quit", tela.width / 2, tela.height / 2 - 10);
//                 }
//                 else {
//                     ctx.fillStyle = wordsColor;
//                     ctx.strokeText("New Game", tela.width / 2, tela.height / 2 - 60);
//                     ctx.fillText("New Game", tela.width / 2, tela.height / 2 - 60);
//                     ctx.fillStyle = "yellow";
//                     ctx.strokeText("Quit", tela.width / 2, tela.height / 2 - 10);
//                     ctx.fillText("Quit", tela.width / 2, tela.height / 2 - 10);
//                 }
//                 break;
//             case 2:     // Game Over
//                 limparTela();
//                 //audioLibrary.stop("BGM");
//                 ctx.fillStyle = "white";
//                 ctx.textAlign = alignMainMenu;
//                 ctx.font = "40px Arial Black";
//                 ctx.lineWidth = 2;
//                 ctx.strokeStyle = "black";
//                 ctx.strokeText("GAME OVER", tela.width / 2, tela.height / 2);
//                 ctx.fillText("GAME OVER", tela.width / 2, tela.height / 2);

//                 if (tempoGameOver >= 0) {
//                     tempoGameOver = tempoGameOver - 0.7 * dt;
//                 }
//                 else {
//                     limparDados();
//                     estado = 1;
//                 }
//                 break;
//             case 3:       // Tela preta == Jogo finalizado
//                 limparTela();
//                 break;
//             case 4:       // Passou de fase
//                 barraTempo.interna.w = 127;
//                 /*treasuresCount = 0;
//                 teasuresCollected = 0;*/
//                 getPlayer().levelNumber = getPlayer().levelNumber + 1;
//                 loadLevel(0);       // Load new level
//                 break;
//             case 5:     // Recarregar fase
//                 barraTempo.interna.w = 127;
//                 /*treasuresCount = 0;
//                 teasuresCollected = 0;*/
//                 getPlayer().vidas--;
//                 if (getPlayer().vidas < 1) {       // Game over
//                     estado = 2;
//                     tempoGameOver = 2;
//                 }
//                 else {
//                     loadLevel(1);   // Reload Level
//                 }
//                 break;
//             default:
//         }
//     }
//     anterior = t;
//     requestAnimationFrame(passo);
// }

// A cada 1 segundo ele executa uma diminuição na barra de tempo
function controleTempo() {
    if (getDebugMode() == 0) {
        //if(!getPlayer().imune){
        barraTempo.interna.w = barraTempo.interna.w - levelAtual.taxaDiminuicaoTempo;
        levelAtual.updateTempo();
        if (barraTempo.interna.w <= 0) {
            barraTempo.interna.w = 0;
            estado = 5;
            limparTela();
        }
        //}
    }
}

/*
function desenharHUD() {
    barraTempo.desenhar(ctx);
    barraEnergia.desenhar(ctx);
    hud.bussola.desenhar(ctx);

    ctx.font = "15px Arial Black";
    ctx.fillStyle = "white";
    ctx.textAlign = alignMainMenu;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    escreveTexto(ctx, hud.tempo.text, hud.tempo.x, hud.tempo.y);
    escreveTexto(ctx, hud.energia.text, hud.energia.x, hud.energia.y);
    escreveTexto(ctx, hud.vidas.text + getPlayer().vidas, hud.vidas.x, hud.vidas.y);
    escreveTexto(ctx, hud.tesouros.text + getPlayer().tesourosColetados, hud.tesouros.x, hud.tesouros.y);
    escreveTexto(ctx, hud.level.text + getPlayer().levelNumber, hud.level.x, hud.level.y);



    if (getDebugMode() >= 1) {
        let typeMode = hud.debugText[getDebugMode() - 1];

        // Desenha menu debaixo
        ctx.font = "13px Arial Black";
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.strokeStyle = "rgba(238, 255, 0, 0.5)";
        ctx.fillRect(converteTelaCheia(5, tela.widthOld, tela.width), converteTelaCheia(310, tela.heightOld, tela.height), converteTelaCheia(585, tela.widthOld, tela.width), converteTelaCheia(37, tela.heightOld, tela.height));
        ctx.strokeRect(converteTelaCheia(5, tela.widthOld, tela.width), converteTelaCheia(310, tela.heightOld, tela.height), converteTelaCheia(585, tela.widthOld, tela.width), converteTelaCheia(37, tela.heightOld, tela.height));

        // Escritos
        ctx.strokeStyle = "black";
        ctx.fillStyle = "yellow";
        escreveTexto(ctx, "Debug mode ativado!!!", converteTelaCheia(110, tela.widthOld, tela.width), converteTelaCheia(321, tela.heightOld, tela.height));
        escreveTexto(ctx, typeMode, converteTelaCheia(110, tela.widthOld, tela.width), converteTelaCheia(332, tela.heightOld, tela.height));
        escreveTexto(ctx, "FPS: " + ((1 / dt).toFixed(4)), converteTelaCheia(110, tela.widthOld, tela.width), converteTelaCheia(343, tela.heightOld, tela.height));
        escreveTexto(ctx, "Teleporte Inicial Level: [" + (levelAtual.teleporteInicioLevel.gy) + "][" + (levelAtual.teleporteInicioLevel.gx) + "]", converteTelaCheia(tela.widthOld / 2, tela.widthOld, tela.width), converteTelaCheia(321, tela.heightOld, tela.height));
        escreveTexto(ctx, "Teleporte Final Level: [" + (levelAtual.teleporteFinalLevel.gy) + "][" + (levelAtual.teleporteFinalLevel.gx) + "]", converteTelaCheia(tela.widthOld / 2, tela.widthOld, tela.width), converteTelaCheia(343, tela.heightOld, tela.height));
        escreveTexto(ctx, "Escala mapa: " + escala.toFixed(4), converteTelaCheia(500, tela.widthOld, tela.width), converteTelaCheia(321, tela.heightOld, tela.height));
        escreveTexto(ctx, "Grade Player: [" + (getPlayer().gy) + "][" + (getPlayer().gx) + "]", converteTelaCheia(500, tela.widthOld, tela.width), converteTelaCheia(332, tela.heightOld, tela.height));
        // escreveTexto(ctx, "Grade Player: [" + tela.width + "][" + tela.height + "]", converteTelaCheia(400, tela.widthOld, tela.width), converteTelaCheia(332, tela.heightOld, tela.height));
        escreveTexto(ctx, "Seed: " + seedValueURL, converteTelaCheia(500, tela.widthOld, tela.width), converteTelaCheia(343, tela.heightOld, tela.height));
    }
}
*/

/*
// Atualiza o formato do convas ao mudar o formato da janela ou ser redimensionada
function onResize(tela) {
    tela.width = window.innerWidth;
    tela.height = window.innerHeight;
    updateTamanhoElementos(tela);
}

window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize

// Atualiza o tamanho dos elementos quando a interface é redimensionada
function updateTamanhoElementos(tela) {
    // Update barra de tempo
    barraTempo.externa.x = converteTelaCheia(67, tela.widthOld, tela.width);
    barraTempo.externa.y = converteTelaCheia(13.5, tela.heightOld, tela.height);
    barraTempo.interna.x = converteTelaCheia(67, tela.widthOld, tela.width);
    barraTempo.interna.y = converteTelaCheia(13.5, tela.heightOld, tela.height);

    // Update barra de energia do player
    barraEnergia.sprite.x = converteTelaCheia(225, tela.widthOld, tela.width);
    barraEnergia.sprite.y = converteTelaCheia(13.5, tela.heightOld, tela.height);

    // HUD
    hud.updateElementos(tela);
}

updateTamanhoElementos(tela);
*/

function limparDados() {
    levelAtual = new Level(widthMap, heightMap, sizeMap, { hud, seedGen, assetsMng });
    levelAtual.clonarLevel(levels[0]);
    levelAtual.posicionarPlayer(getPlayer());
    levelAtual.setTaxaDiminuicaoTempo(dt, barraTempo.interna);        // Atualiza o decaimento da barra
    getPlayer().restart();
    hud.bussola.update();
}

function limparTela() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, tela.width, tela.height);
}

function loadLevel(option) {
    switch (option) {
        case 0:   //Load New Level
            if (getPlayer().levelNumber > levels.length) {
                limparDados();
                estado = 1;
            }
            else {
                levelAtual.clonarLevel(levels[getPlayer().levelNumber - 1]);
                levelAtual.posicionarPlayer(player);
                levelAtual.setTaxaDiminuicaoTempo(dt, barraTempo.interna);        // Atualiza o decaimento da barra
                getPlayer().restart();
                hud.bussola.update(levelAtual);
                getPlayer().vidas = 3;
                estado = 0;
            }
            break;
        case 1:   //Reload
            levelAtual.clonarLevel(levels[getPlayer().levelNumber - 1]);
            levelAtual.posicionarPlayer(getPlayer());
            levelAtual.setTaxaDiminuicaoTempo(dt, barraTempo.interna);        // Atualiza o decaimento da barra
            getPlayer().restart();
            hud.bussola.update(levelAtual);
            estado = 0;
            break;
    }
}

//FullScreen
/* View in fullscreen */
function openFullscreen() {
    if (tela.requestFullscreen) {
        tela.requestFullscreen();
    } else if (tela.mozRequestFullScreen) { /* Firefox */
        tela.mozRequestFullScreen();
    } else if (tela.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        tela.webkitRequestFullscreen();
    } else if (tela.msRequestFullscreen) { /* IE/Edge */
        tela.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

/************************************************************
 * Mapeamento de teclas pressionadas apenas durante o Jogo  *
 * Estado = 0                                               *
 ************************************************************/
function mapeamentoTecladoNoEstadoJogando(keyCode) {
    //keyCode.preventDefault();                         //Evento padrao do navegador
    switch (keyCode) {
        /**
         *  Fullscreen
         */
        case 70:    //Letra F
            fullscreen = !fullscreen;
            if (fullscreen) {
                openFullscreen();
            }
            else {
                closeFullscreen();
            }
            break;
        case 37:       // Left Arrow
            getPlayer().setTeclas("left", true);
            break;
        case 39:      // Right Arrow
            getPlayer().setTeclas("right", true);
            break;
        case 38:            // Up Arrow
            getPlayer().setTeclas("up", true);
            break;
        case 40:            // Down Arrow
            getPlayer().setTeclas("down", true);
            break;
        case 32:  //Espaco  -- Ativa teleporte
            getPlayer().setTeclas("space", true);
            break;
        case 17:            // Left CTRL -- Ataque
            getPlayer().setTeclas("ctrl", true);
            break;
        case 16:            // Left SHIFT -- Correr
            getPlayer().setTeclas("shift", true);
            break;
        case 77:            // M
            hud.bussola.mapMode = hud.bussola.mapMode + 1;
            if (hud.bussola.mapMode > 3) {
                hud.bussola.mapMode = 0;
            }
            break;
        case 27:      //Pressionar o Esq === RETORNA AO MENU PRINCIPAL
            stateMainMenu = 0;
            limparDados();
            estado = 1;
            break;

        /**
         *  Debug Mode
         */
        case 80:      //Pressionar a letra P
            setDebugMode(getDebugMode() + 1);
            if (getDebugMode() > debugModeEnd) {
                setDebugMode(debugModeBegin);  //Padrão do jogo
                escala = 1.8;
                setMapArea(14);
            }
            break;
        case 79:  // Pressionar tecla O - Voltar no menu do Debug
            setDebugMode(getDebugMode() - 1);
            if (getDebugMode() < debugModeBegin) {
                setDebugMode(debugModeBegin);  //Padrão do jogo
                escala = 1.8;
                setMapArea(14);
            }
            break;
        case 187:
        case 107:      //+
            if (getDebugMode() >= 1) {
                escala = escala + 0.025;
                if (escala >= 0.85)
                    setMapArea(20);
                else {
                    if (escala > 0.3) {
                        setMapArea(100);
                    }
                    else {
                        if (escala >= 0.0) {
                            setMapArea(160);
                        }
                    }
                }
            }
            break;
        case 189:
        case 109:      //-
            if (getDebugMode() >= 1) {
                escala = escala - 0.025;
                if (escala >= 0.85)
                    setMapArea(20);
                else {
                    if (escala > 0.3) {
                        setMapArea(80);
                    }
                    else {
                        if (escala >= 0.0) {
                            setMapArea(160);
                        }
                    }
                }
            }
            break;
    }
}


import AssetsManager from "./src/classes/AssetsManager.js";
import { getDebugMode, setDebugMode } from "./src/classes/DebugMode.js";
import { getPlayer } from "./src/classes/Entities/Player.js";
import Game from "./src/classes/Game.js";
import Level from "./src/classes/Level.js";
import { setMapArea } from "./src/classes/MAPA_AREA.js";
import SeedGenerator from "./src/classes/SeedGenerator.js";
import InputManager from "./src/classes/InputManager.js";
//import Mixer from "./classes/Mixer.js";


const tela = document.getElementById("canvas");
// Switch to fullscreen
tela.widthOld = tela.width;
tela.heightOld = tela.height;
tela.width = window.innerWidth;
tela.height = window.innerHeight;
tela.style.border = '2px solid #000';
const ctx = tela.getContext("2d");
let fullscreen = false;
let anterior = 0;
let dt = 0;
let estado = 1;


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





// Controle das imagens e sons presentes no jogo
var assetsMngBuilder = new AssetsManagerBuilderLPC();
assetsMngBuilder.reset();
var assetsMng = assetsMngBuilder.build();

// Carregamento dos audios presentes no jogo
import audioTeleport from "./assets/audios/Teleport.wav";
import { AssetsManagerBuilder } from "./src/classes/AssetsManagerBuilder.js";
import { AssetsManagerBuilderLPC } from "./src/classes/AssetsManagerBuilderLPC.js";
assetsMng.loadAudio("teleporte", audioTeleport);

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
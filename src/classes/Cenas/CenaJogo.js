import CellularAutomata from '../CellularAutomata.js';
import { getDebugMode, setDebugMode } from '../DebugMode.js';
import Hud from "../Hud.js";
import Level from "../Level.js";
import { setMapArea } from "../MAPA_AREA.js";
import Player, { getPlayer, setPlayer } from "../Entities/Player.js";
import SeedGenerator from "../SeedGenerator.js";
import Sprite from "../Sprite.js";
import { converteTelaCheia, escreveTexto } from "../Utils.js";
import Cena, { fontMainMenu, wordsColor, alignMainMenu } from "./Cena.js";
import Button from "../utils/Button.js";
import getXY from '../utils/getXY.js';
import Debugger, { DEBUG_MODE } from '../utils/Debugger.js';
let stateMainMenu = 0;
export default class CenaJogo extends Cena {

    desenhar() {
        super.desenhar();
        /*if(audioLibrary.isPlaying("BGM")==false){
          audioLibrary.play("BGM");
        }*/
        this.controleTempo();
        this.ctx.save();
        this.ctx.scale(this.game.escala, this.game.escala);
        this.ctx.translate(-getPlayer().x + this.canvas.width / 4, - getPlayer().y + this.canvas.height / 4);
        // this.ctx.translate(-getPlayer().x, - getPlayer().y);
        this.levelAtual.desenhar(this.ctx);
        this.ctx.restore();
        this.desenharHUD(this.ctx);
        if (!getPlayer().vivo) {
            this.estado = 5;
        }
        this.hud.desenharBotoes(this.ctx, this.assetsMng);
    }

    quadro(t) {
        super.quadro(t);
        this.capturarInput();
        this.levelAtual.passo(this.dt);
    }

    preparar() {
        this.debugModeBegin = 0;
        this.debugModeEnd = 18;
        this.hud = Hud.getInstance();
        this.hud.init(this.canvas);

        this.seedGen = this.getSeedGenerator();

        const player = new Player({
            s: 27, w: 27, h: 11,
            hitBox: {
                x: 0,
                y: 0,
                w: 27,
                h: 11,
                wDefault: 27,
                hDefault: 11
            }
        }, 5);
        player.cena = this;
        setPlayer(player);


        this.levels = [];
        this.levelAtual = new Level(
            this.game.widthMap,
            this.game.heightMap,
            this.game.sizeMap,
            { hud: this.hud, seedGen: this.seedGen, assetsMng: this.assetsMng }
        );
        this.levels.push(this.levelAtual);

        const geraFase = new CellularAutomata({
            HS: this.game.heightMap, WS: this.game.widthMap, MOORE: 1, r: 0.5,
            totalRock: 4, floorIndex: 0, rockIndex: 2, wallIndex: 1, seedGen: this.seedGen
        });
        //new CellularAutomata(this.game.heightMap, this.game.widthMap, 2, 0.5, 13, 0, 5, 1);
        // 0 => floor
        // 2 => rock
        // 1 => wall
        geraFase.scenarioRandomWall();
        geraFase.fullstep(2);
        geraFase.countRooms();
        geraFase.filterRooms(25);

        this.levelAtual.setMatrixMap(geraFase.map);       // Copia a matriz de tipos dentro do gerador
        this.levelAtual.copiaSalas(geraFase.rooms);       // Copia os dados em que os blocos da sala são apenas as posições linha e coluna da matriz
        this.levelAtual.montarLevel({
            dt: this.dt,
            geraFase: geraFase,
            player: getPlayer(),
        });
        this.levelAtual.setTempo(20);                // 20 segundos

        let tempoGameOver = 2;

        getPlayer().map = this.levelAtual.mapa;
        getPlayer().level = this.levelAtual;

        this.teasuresCollected = 0;

        // Main Menu campos
        const fontMainMenu = "30px Arial Black";
        const wordsColor = "white";
        const alignMainMenu = "center";
        let stateMainMenu = 0;

        // window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize
        
        this.criarBotoes();
        this.criarBarras();
        this.canvas.onmousemove = (e) => {
            this.mousemove(e);
        };
        this.canvas.onmousedown = (e) => {
            this.mousedown(e);
        };
        this.loadLevel(0);
        this.updateTamanhoElementos(this.canvas);
    }

    mousedown(e) {
        // if (this.assets.progresso() < 100.0 || this.expire > 0) {
        //     return;
        // }
        const [x, y] = getXY(e, this.canvas);
        const botoes = this.hud.botoes;
        for (let i = 0; i < botoes.length; i++) {
            const botao = botoes[i];
            if (!botao.esconder && botao.hasPoint({ x, y })) {
                botao.executarFuncao();
                return;
            }
        }
      }

    mousemove(e) {
        super.mousemove(e);
    }

    inciar() {
        super.iniciar();
        window.addEventListener("resize", onResize, false); // Ouve os eventos de resize
    }

    desenharHUD() {
        this.hud.bussola.desenhar(this.ctx);

        this.ctx.font = "15px Arial Black";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = alignMainMenu;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black";
        this.ctx.textAlign = "left";
        escreveTexto(this.ctx, this.hud.tempo.text, this.hud.tempo.x, this.hud.tempo.y);
        escreveTexto(this.ctx, this.hud.energia.text, this.hud.energia.x, this.hud.energia.y);
        escreveTexto(this.ctx, this.hud.vidas.text + getPlayer().vidas, this.hud.vidas.x, this.hud.vidas.y);
        escreveTexto(this.ctx, this.hud.tesouros.text + getPlayer().tesourosColetados, this.hud.tesouros.x, this.hud.tesouros.y);
        escreveTexto(this.ctx, this.hud.level.text + getPlayer().levelNumber, this.hud.level.x, this.hud.level.y);
        
        escreveTexto(this.ctx, this.hud.levelJogador.text + getPlayer().levelAtual, this.hud.levelJogador.x, this.hud.levelJogador.y);
        escreveTexto(this.ctx, this.hud.pontos.text + getPlayer().pontos, this.hud.pontos.x, this.hud.pontos.y);
        escreveTexto(this.ctx, this.hud.poder.text + getPlayer().poderTotal, this.hud.poder.x, this.hud.poder.y);

        // Atributos
        escreveTexto(this.ctx, this.hud.atributos.text, this.hud.atributos.x, this.hud.atributos.y);
        escreveTexto(this.ctx,this.hud.dano.text,this.hud.dano.x,this.hud.dano.y);
        escreveTexto(this.ctx, this.hud.vida.text, this.hud.vida.x, this.hud.vida.y);
        escreveTexto(this.ctx, this.hud.velocidade.text, this.hud.velocidade.x, this.hud.velocidade.y);

        this.ctx.textAlign = "right";
        escreveTexto(this.ctx, getPlayer().atributos.hpMax, this.hud.vida.x + 150, this.hud.vida.y);
        escreveTexto(this.ctx, getPlayer().atributos.ataque, this.hud.dano.x + 150, this.hud.dano.y);
        escreveTexto(this.ctx, getPlayer().atributos.velocidade, this.hud.velocidade.x + 150, this.hud.velocidade.y);

        this.hud.desenharBarras(this.ctx);
        this.ctx.textAlign = alignMainMenu;
        this.desenharDebug();
        this.hud.grafico.desenhar(this.ctx);
    }
    
    desenharDebug() {
        if (Debugger.isDebugModeOn()) {
            let typeMode = this.hud.debugText[Debugger.getDebugMode() - 1];
    
            // Desenha menu debaixo
            this.ctx.font = "13px Arial Black";
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.strokeStyle = "rgba(238, 255, 0, 0.5)";
            this.ctx.fillRect(
                converteTelaCheia(5, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(310, this.canvas.heightOld, this.canvas.height),
                converteTelaCheia(585, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(37, this.canvas.heightOld, this.canvas.height)
            );
            this.ctx.strokeRect(
                converteTelaCheia(5, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(310, this.canvas.heightOld, this.canvas.height),
                converteTelaCheia(585, this, canvas.widthOld, this.canvas.width),
                converteTelaCheia(37, this.canvas.heightOld, this.canvas.height)
            );
    
            // Escritos
            this.ctx.strokeStyle = "black";
            this.ctx.fillStyle = "yellow";
            escreveTexto(
                this.ctx, "Debug mode ativado!!!",
                converteTelaCheia(110, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(321, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, typeMode,
                converteTelaCheia(110, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(332, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "FPS: " + ((1 / this.dt).toFixed(4)),
                converteTelaCheia(110, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(343, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Teleporte Inicial Level: [" + (this.levelAtual.teleporteInicioLevel.gy) +
                "][" + (this.levelAtual.teleporteInicioLevel.gx) + "]",
                converteTelaCheia(this.canvas.widthOld / 2, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(321, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Teleporte Final Level: [" + (this.levelAtual.teleporteFinalLevel.gy) +
                "][" + (this.levelAtual.teleporteFinalLevel.gx) + "]",
                converteTelaCheia(this.canvas.widthOld / 2, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(343, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Escala mapa: " + this.game.escala.toFixed(4),
                converteTelaCheia(500, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(321, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Grade Player: [" + (getPlayer().gy) + "][" + (getPlayer().gx) + "]",
                converteTelaCheia(500, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(332, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(this.ctx, "Seed: " + this.seedValueURL,
                converteTelaCheia(500, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(343, this.canvas.heightOld, this.canvas.height)
            );
        }
    }

    controleTempo() {
        if (!Debugger.isDebugModeOn()) {
            //if(!getPlayer().imune){
            this.barraTempo.barraExterna.w -= (this.barraTempo.barraExterna.w * this.dt) / this.levels[0].tempoTotal;
            this.levelAtual.updateTempo();
            if (this.barraTempo.barraExterna.w <= 0) {
                this.barraTempo.barraExterna.w = 0;
                // estado = 5;
                limparTela();
            }
            if (this.levelAtual.colisaoFireZones(getPlayer())) {
                this.barraTempo.barraExterna.w = this.barraTempo.barraInterna.w;
            }
        }
    }
    onResize(tela) {
        tela.width = window.innerWidth;
        tela.height = window.innerHeight;
        updateTamanhoElementos(this.canvas);
    }



    // Atualiza o tamanho dos elementos quando a interface é redimensionada
    updateTamanhoElementos(tela) {
        // HUD
        this.hud.updateElementos(tela);
    }

    getSeedGenerator() {
        // SeedGenerator ===> Utilizado para retornar ao mesmo mapa com apenas o código da seed
        this.seedValueURL = location.search;

        if (this.seedValueURL.length != 0) {                   //SEED PASSADA NA URL
            let aux = "?seed=";
            this.seedValueURL = this.seedValueURL.substring(aux.length, this.seedValueURL.length);
            this.seedValueURL = parseInt(this.seedValueURL);
        }
        else {                                           //SEED ALEATÓRIA
            let maxValue = 5000000;
            let minValue = 500000;
            this.seedValueURL = 4248372;//(Math.floor(Math.random() * (maxValue - minValue)) + minValue);
        }
        return new SeedGenerator({ seed_1: this.seedValueURL, seed_2_string: "teste" });
    }

    loadLevel(option) {
        switch (option) {
            case 0:   //Load New Level
                if (getPlayer().levelNumber > this.levels.length) {
                    this.limparDados();
                    this.estado = 1;
                }
                else {
                    this.levelAtual.clonarLevel(this.levels[getPlayer().levelNumber - 1]);
                    this.levelAtual.posicionarPlayer(getPlayer());
                    getPlayer().restart();
                    this.hud.bussola.update(this.levelAtual);
                    getPlayer().vidas = 3;
                    this.estado = 0;
                }
                break;
            case 1:   //Reload
                this.levelAtual.clonarLevel(this.levels[getPlayer().levelNumber - 1]);
                this.levelAtual.posicionarPlayer(getPlayer());
                getPlayer().restart();
                this.hud.bussola.update(this.levelAtual);
                this.estado = 0;
                break;
        }
    }

    capturarInput() {
        if (this.inputManager.foiPressionado("M")) {
            this.hud.bussola.mapMode = this.hud.bussola.mapMode + 1;
            if (this.hud.bussola.mapMode > 3) {
                this.hud.bussola.mapMode = 0;
            }
            return;
        }
        if (this.inputManager.foiPressionado("ESC")) {
            this.game.selecionarCena("menuInicial");
            this.limparDados();
            this.estado = 1;
            return;
        }

        // Debug mode
        if (this.inputManager.foiPressionado("p")) {
            console.log("Clicou no P");
            Debugger.nextDebugMode();
            this.levelAtual.iniciaRooms();
            return;
        }
        
        if (this.inputManager.foiPressionado("o")) {
            Debugger.previousDebugMode();
            this.levelAtual.iniciaRooms();
            return;
        }
        
        // Path
        if (this.inputManager.foiPressionado("ALTERNA_CAMINHO")) {
            if (Debugger.isDebugModeOn()) {
                Debugger.nextPath();
                this.hud.atualizarGrafico(this.levelAtual);
            }
            return;
        }

        if (this.inputManager.foiPressionado("ALTERNA_GRAFICO")) {
            if (Debugger.isDebugModeOn()) {
                this.hud.grafico.alternarModo();
            }
            return;
        }

        if (this.inputManager.foiPressionado("t")) {
            this.levelAtual.posicionarInimigoDebug();
            return;
        }

        if (this.inputManager.foiPressionado("+")) {
            if (Debugger.isDebugModeOn()) {
                this.game.escala = this.game.escala + 0.025;
                if (this.game.escala >= 0.85)
                    setMapArea(20);
                else {
                    if (this.game.escala > 0.3) {
                        setMapArea(100);
                    }
                    else {
                        if (this.game.escala >= 0.0) {
                            setMapArea(160);
                        }
                    }
                }
            }
            return;
        }
        if (this.inputManager.foiPressionado("-")) {
            if (Debugger.isDebugModeOn()) {
                this.game.escala = this.game.escala - 0.025;
                if (this.game.escala >= 0.85)
                    setMapArea(20);
                else {
                    if (this.game.escala > 0.3) {
                        setMapArea(80);
                    }
                    else {
                        if (this.game.escala >= 0.0) {
                            setMapArea(160);
                        }
                    }
                }
            }
            return;
        }
    }

    limparDados() {
        this.levelAtual = new Level(this.game.widthMap,
            this.game.heightMap,
            this.game.sizeMap,
            { hud: this.hud, seedGen: this.seedGen, assetsMng: this.assetsMng }
        );
        this.levelAtual.clonarLevel(this.levels[0]);
        this.levelAtual.posicionarPlayer(getPlayer());
        getPlayer().restart();
        this.hud.bussola.update(this.levelAtual);
    }

    criarBotoes() {
        const aumentarDano = new Button(
            0.2 * this.canvas.width,
            0.9 * this.canvas.height,
            0.25 * this.canvas.width,
            0.07 * this.canvas.height,
            "+ Dano"
        );
        aumentarDano.setFuncao(() => getPlayer().aumentarAtributo('dano'));

        const aumentarVida = new Button(
            0.5 * this.canvas.width,
            0.9 * this.canvas.height,
            0.25 * this.canvas.width,
            0.07 * this.canvas.height,
            "+ Vida"
        );
        aumentarVida.setFuncao(() => getPlayer().aumentarAtributo('vida'));

        const aumentarVelocidade = new Button(
            0.8 * this.canvas.width,
            0.9 * this.canvas.height,
            0.25 * this.canvas.width,
            0.07 * this.canvas.height,
            "+ Velocidade"
        );
        aumentarVelocidade.setFuncao(() => getPlayer().aumentarAtributo('velocidade'));

        this.hud.adicionarBotao(aumentarDano);
        this.hud.adicionarBotao(aumentarVida);
        this.hud.adicionarBotao(aumentarVelocidade);
    }

    criarBarras() {
        this.barraTempo = this.hud.adicionarBarra({
            x: 67,
            y: 13.5,
            width: 127,
            height: 15,
            corBarra: "rgb(170, 120, 0)",
            corFundo: 'black',
            corBorda: 'white',
            tamanhoBorda: 1,
            texto: null,
        });

        this.barraEnergia = this.hud.adicionarBarra({
            x: 225,
            y: 13.5,
            width: 127,
            height: 15,
            corBarra: () => `hsl(${120 * getPlayer().getPorcentagemVida()}, 100%, 50%)`,
            corFundo: 'black',
            corBorda: 'black',
            tamanhoBorda: 2,
            porcentagem: () => (getPlayer().getPorcentagemVida()),
            texto: {
                valor: () => getPlayer().hpAtual,
                font: "13px Arial Black",
                fillStyle: "yellow",
                textAlign: "center",
                lineWidth: 2,
                strokeStyle: "black",
            },
        });

        this.barraXp = this.hud.adicionarBarra({
            x: 20,
            y: 50,
            width: 150,
            height: 20,
            corBarra: () => 'purple',
            corFundo: 'black',
            corBorda: 'black',
            tamanhoBorda: 'white',
            porcentagem: () => (getPlayer().xpAtual / getPlayer().xpDoLevel),
            texto: {
                valor: () => `${getPlayer().xpAtual}/${getPlayer().xpDoLevel}`,
                font: "13px Arial Black",
                fillStyle: "white",
                textAlign: "center",
                lineWidth: 2,
                strokeStyle: "black",
            },
        });
    }

}
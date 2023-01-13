import Map from "./Map.js";
import Room from "./Room.js";
import Teleporter, { TeleporterType } from "./Teleporter.js";
import FireZone from "./FireZone.js";
import Enemy from "./Entities/Enemy.js";
import Treasure from "./Treasure.js";
import Ordenacao from "./Ordenacao.js";
import ProgressionManager from "./ProgressionManager.js";
import Slime from "./Entities/Slime.js";
import Debugger, { DEBUG_MODE, PATHS } from "./utils/Debugger.js";
import { getPlayer } from "./Entities/Player.js";
import TreasurePositioningManager from "./TreasurePositioningManager.js";
import EnemyPositioningManager from "./EnemyPositioningManager.js";


//TODO Fix parametro
export default class Level {

  constructor(w, h, s, { hud, seedGen, assetsMng }) {
    this.mapa = new Map(w, h, s, assetsMng);
    this.progressionManager = new ProgressionManager();
    this.treasurePositioningManager = new TreasurePositioningManager(seedGen, this.mapa);
    this.enemyPositioningManager = new EnemyPositioningManager(seedGen, this.mapa);
    this.rooms = [];
    this.tempoFase = 0;
    this.tempoTotal = 0;
    this.taxaDiminuicaoTempo = 0;
    this.tempo = undefined;
    this.tamanhoSalasMinimo = 25;
    this.larguraBarra = 127;
    this.teleporteInicioLevel = new Teleporter(TeleporterType.InicioLevel);         //(Inicio) mapa
    this.teleporteFinalLevel = new Teleporter(TeleporterType.FimLevel);        //(Final) mapa
    this.player = undefined;
    this.hud = hud;
    this.seedGen = seedGen;
    this.filaDesenho = [];
    this.roomIniciado = false;
    this.caminhoSaida = false;
    this.caminhoTesouros = false;
    this.caminhoPlayer = false;
  };

  /**
   * GX => Coluna;
   * GY => Linha
   */


  setTempo(tempo) {
    this.tempoFase = tempo;
    this.tempoTotal = tempo;
    //this.taxaDiminuicaoTempo = Math.floor(larguraBarra/tempo);
  };

  updateTempo() {
    this.tempoFase = this.tempoFase - 1;
  }

  // Caminha na matriz e encontra as salas que cada célula pertence
  mapearSalas() {
    this.mapa.mapearSalas();
  }

  setMatrixMap(matrix) {
    this.mapa.copyDates(matrix);
  };

  setMatrixMap2(matrix, L, C) {
    this.mapa.copyDataInto(matrix, L, C);
  };

  clonarLevel(level) {
    this.mapa.w = level.mapa.w;
    this.mapa.h = level.mapa.h;
    this.mapa.s = level.mapa.s;
    for (let l = 0; l < level.mapa.h; l++) {
      for (let c = 0; c < level.mapa.w; c++) {
        this.mapa.cell[l][c].clone(level.mapa.cell[l][c]);
      }
    }

    this.tempoFase = level.tempoFase;
    this.tempoTotal = level.tempoTotal;
    this.taxaDiminuicaoTempo = level.taxaDiminuicaoTempo;
    this.larguraBarra = level.larguraBarra;
    this.tempo = level.tempo;                       // Referencia na memoria pra barra de tempo
    this.teleporteInicioLevel.copyTeleporte(level.teleporteInicioLevel);
    this.teleporteFinalLevel.copyTeleporte(level.teleporteFinalLevel);
    this.player = level.player;
    this.copiaSalasComReferencia(level.rooms);
  }

  // Copia as salas do método de geração de fase e atualiza a matriz do mapa
  // os blocos são compostos por posições de linha e coluna ao inves de referencia pra matriz

  // USA O BLOCKS[ID, linha/coluna]
  copiaSalas(rooms) {
    this.rooms = [];
    for (let i = 0; i < rooms.length; i++) {
      this.rooms.push(new Room(0));
      this.rooms[this.rooms.length - 1].copyByLevelGeneration(rooms[i], this.mapa);
    }
  }

  copiaSalasComReferencia(rooms) {
    this.rooms = [];
    //console.log("COPIA SALAS COM REFERENCIA:");
    for (let i = 0; i < rooms.length; i++) {
      this.rooms.push(new Room(0));
      this.rooms[this.rooms.length - 1].copyWithReference(rooms[i], this.mapa);
      // Passado o vetor de rooms para poder clonar o teleporte para a proxima sala
    }

    // Copia as referencias do proximo teleporte
    for (let i = 0; i < this.rooms.length; i++) {
      this.rooms[i].teleporterInitial.copyConnection(rooms[i].teleporterInitial, this.rooms);
      this.rooms[i].teleporterFinal.copyConnection(rooms[i].teleporterFinal, this.rooms);
    }
  }

  /**
   * Utiliza o gerador de seed como referencia pra escolha numerica
   */
  getRandomInt(min, max) {
    return this.seedGen.nextRandInt(min, max);
  }

  caminhoColetaTesouros() {
    /*
    teleporteInicioLevel
    teleportefinalLevel
    */
    let salas = [];
    for (let i = 0; i < this.rooms.length; i++) {
      salas.push(false);
    }
    let salaInicial = this.rooms[this.teleporteInicioLevel.getCell().room - 1];
    let indiceSala = salaInicial.room - 1;
    while (!salas[indiceSala]) {

    }
    //console.log(salaInicial);

    for (let i = 0; i < this.rooms.length; i++) {
      //this.rooms[i].caminhoColetaTesouros();

    }
  }

  /**
   * -> Atribui os teleportes dentro das salas e insere nos blocos A REFERENCIA PARA O MAPA
   * -> Posiciona de forma com base na DISTÂNCIA DOS TELEPORTES
   * 
   *  params:{porcentagem, opcaoTeleporteInicio, opcaoTeleporteFinal, opcaoMapaCircular}
   *  porcentagem: Intervalo de distância
   * 
   *  opcaoTeleporteInicio:                                            
   *  0 => Posicionamento na SALA 1;  1 => Posicionamento Aleatório;  
   *    
   *  opcaoTeleporteFinal:                                             
   *  0 => Final pode ficar na mesma sala do teleporte inicial;       
   *  1 => Final na sala diferente do teleporte inicial;              
   *    
   *  opcaoMapaCircular:                                               
   *  false  => A última sala não possui um teleporte final;          
   *  true => A última sala possui um teleporte final para a primeira;
   */
  posicionarTeleportes(params) {
    if (this.rooms.length <= 1) {
      console.log("Level with only one room !!!");
      return;
    }
    let roomsAvailable = [];            //Rooms disponíveis para escolher o teleporte inicial
    let sortPosition;
    let menorSala = this.rooms[0];
    for (let i = 0; i < this.rooms.length; i++) {
      const roomAtual = this.rooms[i];
      if (roomAtual.blocks.length < menorSala.blocks.length) {
        menorSala = roomAtual;
      }
      // Pre-processamento -- Pega o bloco do meio da sala, calcula a distancia, pega o bloco
      // da maior, zera a distancia, posiciona o bloco e calcula a distancia de novo

      let blocoMedio = Math.floor(roomAtual.blocks.length / 2) - 1;
      this.mapa.atualizaDist(roomAtual.blocks[blocoMedio].linha, roomAtual.blocks[blocoMedio].coluna, 0, 'distTeleportes');     // Atualiza distancia dos teleportes
      let maxDist = roomAtual.getMaxDist(0);
      let celulas = roomAtual.getCellsByDist(maxDist, 0);
      sortPosition = this.getRandomInt(0, (celulas.length - 1));
      roomAtual.resetDistancia(0);

      // Posicionamento teleporte de inicio de sala
      roomAtual.teleporterInitial.setPosition(celulas[sortPosition]);
      roomAtual.teleporterInitial.roomNumber = celulas[sortPosition].room;
      roomAtual.teleporterInitial.gy = celulas[sortPosition].linha;
      roomAtual.teleporterInitial.gx = celulas[sortPosition].coluna;
      roomAtual.teleporterInitial.map = this.mapa;
      this.mapa.atualizaDist(roomAtual.teleporterInitial.gy, roomAtual.teleporterInitial.gx, 0, 'distTeleportes');     // Atualiza distancia dos teleportes
      // roomAtual.resetDistancia(0);
      // roomAtual.teleporterInitial = this.criaTeleporte(roomAtual, 100).setType(TeleporterType.InicioSala);
      roomAtual.teleporterFinal = this.criaTeleporte(roomAtual, params.porcentagem).setType(TeleporterType.FimSala);
      roomsAvailable.push(roomAtual.number);
    }

    // Posicionamento teleporte inicio de fase
    // let roomInicioLevel = params.opcaoTeleporteInicio ? this.getRandomInt(0, (this.rooms.length - 1)) : 0;
    let roomInicioLevel = menorSala.number - 1;
    this.teleporteInicioLevel = this.criaTeleporte(this.rooms[roomInicioLevel], params.porcentagem).setType(TeleporterType.InicioLevel);

    // Posicionamento teleporte fim de fase
    let roomFinalLevel = this.getRandomInt(0, this.rooms.length - 1);                 // Possibilita ter o teleporte de FINAL DE FASE na mesma sala de início
    if (params.opcaoTeleporteFinal == 1) {
      while (roomFinalLevel == roomInicioLevel) {                               // Certifica de não repetir a sala
        roomFinalLevel = this.getRandomInt(0, this.rooms.length - 1);
      }
    }
    this.teleporteFinalLevel = this.criaTeleporte(this.rooms[roomFinalLevel], params.porcentagem).setType(TeleporterType.FimLevel);

    this.interligarTeleportes();

    if (!params.opcaoMapaCircular) {
      this.rooms[this.teleporteInicioLevel.roomNumber - 1].teleporterInitial.setAtivo(false);
      this.rooms[this.teleporteInicioLevel.roomNumber - 1].teleporterInitial.proximoTeleporte.setAtivo(false);
    }
  }


  /**************************************************************
   * LIGANDO OS TELEPORTES ENTRE AS SALAS DE MANEIRA CIRCULAR   *
   **************************************************************/
  interligarTeleportes() {
    let roomsAvailable = this.rooms.map(room => room.number);
    let roomsClosed = [];               //Rooms que o teleporte inicial foi conectado

    let indCurrentRoom;
    let indNextRoom;
    let currentRoom;
    let nextRoom;
    while (roomsAvailable.length > 1) {
      // Na primeira vez, seleciona uma sala aleatória.
      indCurrentRoom = nextRoom ? roomsAvailable.indexOf(nextRoom) : this.getRandomInt(0, (roomsAvailable.length - 1));
      indNextRoom = this.getRandomInt(0, (roomsAvailable.length - 1));
      while (indCurrentRoom === indNextRoom) {
        indNextRoom = this.getRandomInt(0, (roomsAvailable.length - 1));
        if (roomsAvailable.length === 2) {
          indNextRoom = indCurrentRoom === 0 ? 1 : 0;
        }
      }
      currentRoom = roomsAvailable[indCurrentRoom];
      nextRoom = roomsAvailable[indNextRoom];
      this.rooms[currentRoom - 1].teleporterInitial.proximoTeleporte = this.rooms[nextRoom - 1].teleporterFinal;
      this.rooms[nextRoom - 1].teleporterFinal.proximoTeleporte = this.rooms[currentRoom - 1].teleporterInitial;
      roomsClosed.push(currentRoom);
      roomsAvailable.splice(indCurrentRoom, 1);
    }
    // Connecting last room => to create a cycle on the rooms connections
    this.rooms[roomsAvailable[0] - 1].teleporterInitial.proximoTeleporte = this.rooms[roomsClosed[0] - 1].teleporterFinal;
    this.rooms[roomsClosed[0] - 1].teleporterFinal.proximoTeleporte = this.rooms[roomsAvailable[0] - 1].teleporterInitial;

  }

  criaTeleporte(room, porcentagem) {
    let maxDist = room.getMaxDist(0);                       // Maxima distancia dos teleportes
    let criterio = Math.floor((porcentagem * maxDist) / 100);   // Porcentagem da distancia maxima
    let celulas = room.getCellsByDist(criterio, 0);    // Listagem de celulas dentro do criterio de escolha para o teleporte
    let sortPosition = this.getRandomInt(0, (celulas.length - 1));
    let teleporte = new Teleporter();
    teleporte.setPosition(celulas[sortPosition]);
    teleporte.roomNumber = celulas[sortPosition].room;
    teleporte.gy = celulas[sortPosition].linha;
    teleporte.gx = celulas[sortPosition].coluna;
    teleporte.map = this.mapa;
    this.mapa.atualizaDist(teleporte.gy, teleporte.gx, 0, 'distTeleportes');     // Atualiza distancia dos teleportes
    return teleporte;
  }

  atualizaGradeTeleportes(dt) {
    for (let i = 0; i < this.rooms.length; i++) {         //Atualiza o gx e gy dos teleportes
      this.rooms[i].teleporterInitial.mover(dt);
      this.rooms[i].teleporterFinal.mover(dt);
    }
  }

  /**
   * Posiciona o player e os teleportes de inicio e final de fase
   */
  posicionarPlayer(p) {
    p.map = this.mapa;
    p.x = this.teleporteInicioLevel.x;
    p.y = this.teleporteInicioLevel.y;
    p.gx = this.teleporteInicioLevel.gx;            // Coluna
    p.gy = this.teleporteInicioLevel.gy;            // Linha
    p.setRoom();

    // Referencia ao player para facilitar
    this.player = p;
  }

  posicionarFireZones(valor) {

    //Posiciona nos teleportes das salas
    this.posicionarFireZonesTeleportes();

    //Posiciona na primeira distancia 35 e depois recalcula
    /*let terminouPosicionamento = false;
    let indiceSala = 0;
    while(!terminouPosicionamento){
      let auxRoom = this.rooms[indiceSala];
      let listaCelulas = auxRoom.getCellsByDist(valor, 1);            //auxRoom.getCellByDist(valor, 1);
      let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
  
      while(celula != null){
        let auxFireZone = new FireZone();
        auxFireZone.gx = celula.coluna;
        auxFireZone.gy = celula.linha;
        auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
        auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
        auxFireZone.map = this.mapa;
        auxRoom.fireZones.push(auxFireZone);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula
        celula = auxRoom.getCellByDist(valor, 1);                     // valor, codigo para firezones
      }
  
      indiceSala++;
  
      if(indiceSala >= this.rooms.length){
        terminouPosicionamento = true;
      }
    }*/

    for (let i = 0; i < this.rooms.length; i++) {
      let auxRoom = this.rooms[i];
      let listaCelulas = [];
      do {
        listaCelulas = [];
        for (let j = 0; j < auxRoom.blocks.length; j++) {
          if (auxRoom.blocks[j].distFirezones === valor) {
            listaCelulas.push(auxRoom.blocks[j]);
          }
        }
        if (listaCelulas.length > 0) {
          let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
          let auxFireZone = new FireZone();
          auxFireZone.gx = celula.coluna;
          auxFireZone.gy = celula.linha;
          auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s / 2;
          auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s / 2;
          auxFireZone.map = this.mapa;
          auxRoom.fireZones.push(auxFireZone);
          this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distFirezones');     //Recalcula
          celula = auxRoom.getCellByDist(valor, 1);
        }
      }
      while (listaCelulas.length != 0);
    }
  }

  /**
   * Posiciona as firezones nos teleportes
   */
  posicionarFireZonesTeleportes() {

    /**
     * Posiciona na primeira distancia 35 e depois recalcula
     * 
     * Teleporte inicial e final de level
     */
    let auxRoom = this.rooms[this.teleporteInicioLevel.roomNumber - 1];
    let celula = this.teleporteInicioLevel.getCell();
    let auxFireZone = new FireZone();
    auxFireZone.gx = celula.coluna;
    auxFireZone.gy = celula.linha;
    auxFireZone.x = this.teleporteInicioLevel.x;
    auxFireZone.y = this.teleporteInicioLevel.y;
    auxFireZone.map = this.mapa;
    auxRoom.fireZones.push(auxFireZone);
    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distFirezones');     //Recalcula

    auxRoom = this.rooms[this.teleporteFinalLevel.roomNumber - 1];
    celula = this.teleporteFinalLevel.getCell();
    auxFireZone = new FireZone();
    auxFireZone.gx = celula.coluna;
    auxFireZone.gy = celula.linha;
    auxFireZone.x = this.teleporteFinalLevel.x;
    auxFireZone.y = this.teleporteFinalLevel.y;
    auxFireZone.map = this.mapa;
    auxRoom.fireZones.push(auxFireZone);
    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distFirezones');     //Recalcula

    /**
    * Teleportes nas salas
    */

    let terminouPosicionamento = false;
    let indiceSala = 0;
    while (!terminouPosicionamento) {
      auxRoom = this.rooms[indiceSala];
      celula = this.mapa.getCell(auxRoom.teleporterInitial.gy, auxRoom.teleporterInitial.gx);

      // No teleporte inicial
      auxFireZone = new FireZone();
      auxFireZone.gx = celula.coluna;
      auxFireZone.gy = celula.linha;
      auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s / 2;
      auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s / 2;
      auxFireZone.map = this.mapa;
      auxRoom.fireZones.push(auxFireZone);
      this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distFirezones');     //Recalcula

      // No teleporte final
      celula = this.mapa.getCell(auxRoom.teleporterFinal.gy, auxRoom.teleporterFinal.gx);
      auxFireZone = new FireZone();
      auxFireZone.gx = celula.coluna;
      auxFireZone.gy = celula.linha;
      auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s / 2;
      auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s / 2;
      auxFireZone.map = this.mapa;
      auxRoom.fireZones.push(auxFireZone);
      this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distFirezones');     //Recalcula

      indiceSala++;

      if (indiceSala >= this.rooms.length) {
        terminouPosicionamento = true;
      }
    }
  }

  posicionarTesouros(params) {

    /**
     * Metodo antigo de posicionamento
     */

    /*if(params.porcentagemTesourosPorSala != 0){     // Utiliza o tamanho da sala como referencia posicionar os elementos
      let terminouPosicionamento = false;
      let indiceSala = 0;
      while(!terminouPosicionamento){
        let auxRoom = this.rooms[indiceSala];
        let listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});            //auxRoom.getCellByDist(valor, 1);
        let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
        let qtdTesouros = Math.ceil((params.porcentagemTesourosPorSala * auxRoom.blocks.length)/100);   // Número de tesouros varia conforme o tamanho da sala
  
        for(let i = 0; i < qtdTesouros; i++){
          let auxTreasure = new Treasure();
          auxTreasure.gx = celula.coluna;
          auxTreasure.gy = celula.linha;
          auxTreasure.x = celula.coluna * this.mapa.s + this.mapa.s/2;
          auxTreasure.y = celula.linha * this.mapa.s + this.mapa.s/2;
          auxTreasure.map = this.mapa;
          auxRoom.treasures.push(auxTreasure);
          this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 3);     // Recalcula
          listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});     // Nova lista de celulas disponiveis         //auxRoom.getCellByDist(valor, 1);
          celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
        }
  
        indiceSala++;
  
        if(indiceSala >= this.rooms.length){
          terminouPosicionamento = true;
        }
      }
    }
    else{                             // Posiciona uma quantidade fixa de tesouros em cada sala
      let terminouPosicionamento = false;
      let indiceSala = 0;
      while(!terminouPosicionamento){
        let auxRoom = this.rooms[indiceSala];
        let listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});            //auxRoom.getCellByDist(valor, 1);
        let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
  
        for(let i = 0; i < params.qtdTesouros; i++){
          let auxTreasure = new Treasure();
          auxTreasure.gx = celula.coluna;
          auxTreasure.gy = celula.linha;
          auxTreasure.x = celula.coluna * this.mapa.s + this.mapa.s/2;
          auxTreasure.y = celula.linha * this.mapa.s + this.mapa.s/2;
          auxTreasure.map = this.mapa;
          auxRoom.treasures.push(auxTreasure);
          this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 3);     // Recalcula
          listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});     // Nova lista de celulas disponiveis         //auxRoom.getCellByDist(valor, 1);
          celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
        }
  
        indiceSala++;
  
        if(indiceSala >= this.rooms.length){
          terminouPosicionamento = true;
        }
      }
    }*/

    /*
    * Metodo novo de posicionamento de inimigos
    */

    for (let indiceSala = 0; indiceSala < this.rooms.length; indiceSala++) {
      let auxRoom = this.rooms[indiceSala];
      let listaCelulas = [...auxRoom.blocks.filter((b) => ((b.distTeleportes >= 5)
        && (b.distFirezones > 0) && (b.distInimigos > 0)))];        // Todos os blocks da sala com distTeleportes maior que 5
      let listaCelulasFinal = [];
      let numTesouros = Math.round(auxRoom.blocks.length / this.tamanhoSalasMinimo);    // /25
      let distMaxTeleporte = auxRoom.getMaxDist(0);
      let distMaxTesouros = auxRoom.getMaxDist(1);
      let distMaxInimigos = auxRoom.getMaxDist(2);

      do {
        let maxDistComposto = auxRoom.getMaxDist(5);            // Valor referencial maximo nao vai mudar
        let minimalValue = Math.round((params.porcentagemDistancia * distMaxTesouros) / 100);                 // Menor elemento no intervalo para o DistInimigos
        let minimalValueComposto = (params.porcentagemDistanciaComp) / 100;
        listaCelulasFinal = [];


        // Verifica a distancia composta
        for (let i = 0; i < listaCelulas.length; i++) {       // preenche a lista de celulas disponiveis --- Dist Inimigos
          let auxDistanciaNormalizada = listaCelulas[i].distInimigo_Tesouro_Teleporte(distMaxInimigos,
            distMaxTeleporte, distMaxTesouros);
          if ((minimalValueComposto <= auxDistanciaNormalizada) //&& 
            //(auxDistanciaNormalizada <= minimalValueComposto * 1.5)
            && (listaCelulas[i].distTesouros >= 5)           // Evita inimigos muito próximos
          ) {
            listaCelulasFinal.push(listaCelulas[i]);
          }
        }

        if (listaCelulasFinal.length > 0) {
          let celula = listaCelulasFinal[this.getRandomInt(0, listaCelulasFinal.length - 1)];
          let auxTreasure = new Treasure();
          auxTreasure.gx = celula.coluna;
          auxTreasure.gy = celula.linha;
          auxTreasure.x = celula.coluna * this.mapa.s + this.mapa.s / 2;
          auxTreasure.y = celula.linha * this.mapa.s + this.mapa.s / 2;
          auxTreasure.map = this.mapa;
          auxRoom.treasures.push(auxTreasure);
          this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distTesouros');     // Recalcula
        }
      }
      while (numTesouros-- > 0 && listaCelulasFinal.length > 0);
    }
  }

  posicionarInimigos(params) {
    for (let indiceSala = 0; indiceSala < this.rooms.length; indiceSala++) {
      let auxRoom = this.rooms[indiceSala];
      let listaCelulas = [...auxRoom.blocks.filter((b) => ((b.distTeleportes >= 5) && (b.distFirezones > 0)))];        // Todos os blocks da sala com distTeleportes maior que 5
      let listaCelulasFinal = [];
      let numInimigos = Math.round(auxRoom.blocks.length / this.tamanhoSalasMinimo);    // /25
      let distMaxTeleporte = auxRoom.getMaxDist(0);

      do {
        let maxDistInimigos = auxRoom.getMaxDist(2);
        let maxDistComposto = auxRoom.getMaxDist(4);            // Valor referencial maximo nao vai mudar
        let minimalValue = Math.round((params.porcentagemDistancia * maxDistInimigos) / 100);                 // Menor elemento no intervalo para o DistInimigos
        let minimalValueComposto = (params.porcentagemDistanciaComp) / 100;                 // Menor elemento no intervalo para o DistInimigos
        //listaCelulas = [...auxRoom.blocks.filter((b) => (b.distTeleportes >= 5))];        // Todos os blocks da sala com distTeleportes maior que 5
        listaCelulasFinal = [];


        // Verifica a distancia composta
        for (let i = 0; i < listaCelulas.length; i++) {       // preenche a lista de celulas disponiveis --- Dist Inimigos
          /*let auxDistanciaNormalizada = auxRoom.blocks[i].distInimigoTeleporte(auxRoom.distancias.maxInimigos, 
            auxRoom.distancias.maxTeleportes);*/
          if (listaCelulas[i].distInimigos <= 5) { // Evita inimigos muito próximos
            continue;
          }
          let auxDistanciaNormalizada = listaCelulas[i].distInimigoTeleporte(maxDistInimigos,
            distMaxTeleporte);
          if ((minimalValueComposto <= auxDistanciaNormalizada) //&& 
            //(auxDistanciaNormalizada <= minimalValueComposto * 1.5)
          ) {
            listaCelulasFinal.push(listaCelulas[i]);
          }
        }

        if (listaCelulasFinal.length > 0) {
          let celula = listaCelulasFinal[this.getRandomInt(0, listaCelulasFinal.length - 1)];
          const inimigo = this.criarInimigo(celula, auxRoom);
          this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distInimigos');     // Recalcula
        }
      }
      while (numInimigos-- > 0 && listaCelulasFinal.length > 0);
    }
  }
  
  criarInimigo(celula, room, dificuldade = 1) {
    const inimigo = new Slime(1);
    inimigo.room = room;
    inimigo.gx = celula.coluna;
    inimigo.gy = celula.linha;
    inimigo.x = celula.coluna * this.mapa.s + this.mapa.s / 2;
    inimigo.y = celula.linha * this.mapa.s + this.mapa.s / 2;
    inimigo.map = this.mapa;
    room.enemies.push(inimigo);
    return inimigo;
  }

  passo(dt) {
    this.player.passo(dt);
    this.colisaoFireZones(this.player);
    //this.colisaoInimigos(this.player);
    this.colisaoTesouros(this.player);
    this.validaAtaquePlayerInimigo(this.player);
    if (!this.player.imune) {
      this.rooms[this.player.room - 1].attackEnemiesPlayer(this.player);      // Ataque somente na sala do player
    }
    for (let i = 0; i < this.rooms.length; i++) {
      this.rooms[i].move(dt);
    }
    // this.removerInimigos();
    this.criarFilaDesenho();
  }

  montarLevel(params) {
    this.posicionarTeleportes({
      porcentagem: 100, opcaoTeleporteInicio: 1, opcaoTeleporteFinal: 1,
      opcaoMapaCircular: true
    });
    this.atualizaGradeTeleportes(params.dt);
    
    this.posicionarPlayer(params.player);
    this.posicionarFireZones(25);          // Posiciona acima de 25 na distancia de firezones
    
    this.rooms.forEach(room => {
      // Precisa para calcular distancia saida
      // que é necessário para distribuir poder entre inimigos
      room.definirBlocosVizinhos();
      room.achaSaida();
      room.inundar(room.saida, 0, 'distInundacaoSaida');
      
      //Precisa para criar caminho entrada-saida
      room.achaEntrada();
      room.apontarDirecoesParaSaida();
      
      room.getPathRoom();
      
      // Precisa para posicionar inimigos
      room.atualizaMetricas(['maxTeleportes']);
      room.atualizaDistanciaCaminhoEntradaSaida(this.mapa);

      //Precisa para posicionar tesouros
      room.atualizaMetricas(['maxCaminhoEntradaSaida', 'maxFirezones']);
    });
    
    this.enemyPositioningManager.posicionar(this);

    this.treasurePositioningManager.posicionar(this);
    
    // this.posicionarInimigos({
    //   porcentagemDistancia: 80,
    //   porcentagemDistanciaComp: 30,
    // });
    
    // this.posicionarTesouros({
    //   //porcentagemDistancia: 90, qtdTesouros: 0, porcentagemTesourosPorSala: 5
    //   porcentagemDistancia: 80,
    //   porcentagemDistanciaComp: 50,
    //   // porcentagemTesourosPorSala != 0 ==> Posiciona de acordo com o tamanho da sala
    // });

    this.rooms.forEach(room => {
      // room.achaTesouros();
      // room.maxCamadaDistancias();
    });
    

    this.mapa.camadaDistCompostas();
  }

  getPlayerRoom() {
    return (this.rooms[this.player.room - 1]);
  }

  criarFilaDesenho() {
    this.filaDesenho = [];
    // Desenhos que não seguirão a ordem de prioridade no eixo y
    for (let i = 0; i < this.rooms.length; i++) {
      let auxRoom = this.rooms[i];
      for (let j = 0; j < auxRoom.fireZones.length; j++) {
        this.filaDesenho.push(auxRoom.fireZones[j]);
      }
      this.filaDesenho.push(auxRoom.teleporterInitial);
      this.filaDesenho.push(auxRoom.teleporterFinal);
    }
    this.filaDesenho.push(this.teleporteInicioLevel);
    this.filaDesenho.push(this.teleporteFinalLevel);

    let indiceInicioOrdenacao = this.filaDesenho.length - 1;

    // Desenhos que seguirão a ordem de prioridade no eixo y
    this.filaDesenho.push(this.player);
    for (let i = 0; i < this.rooms.length; i++) {
      let auxRoom = this.rooms[i];
      for (const indiceInimigo in auxRoom.enemies) {
        const enemy = auxRoom.enemies[indiceInimigo];
        this.filaDesenho.push(enemy);
      }
      for (let j = 0; j < auxRoom.treasures.length; j++) {
        this.filaDesenho.push(auxRoom.treasures[j]);
      }
    }

    let ordenacao = new Ordenacao();
    ordenacao.quickSort({
      lista: this.filaDesenho,
      inicio: indiceInicioOrdenacao,
      fim: this.filaDesenho.length - 1,
      criterio: 1,    // Eixo Y
      ordem: 0        // Crescente
    });
  }

  desenhar(ctx) {
    this.mapa.desenhar(ctx, this.player);
    for (let i = 0; i < this.filaDesenho.length; i++) {
      this.filaDesenho[i].desenhar(ctx);
    }
    this.mapa.desenharDebugMode(ctx);

    if (!Debugger.isDebugModeOn()) {
      let playerPresente = this.ondeEstaOPlayer();
      if (playerPresente !== -1) {
        this.rooms[playerPresente].getPathPlayer(this.player.gx, this.player.gy);
      }
    }
    if (Debugger.getDebugMode() > DEBUG_MODE.CAIXA_DE_COLISAO) {
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].desenharCamadas({
          ctx: ctx, s: this.mapa.s
        });
      }
    } else if (Debugger.isDebugMode(DEBUG_MODE.LIGACAO_TELEPORTES)) {
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].drawTeleportersLine(ctx);
      }
    }
    
      
    if (Debugger.isPath(PATHS.CAMINHO_ENTRADA_SAIDA)) {
      let playerPresente = this.ondeEstaOPlayer();
      if (playerPresente !== -1) {
        this.rooms[playerPresente].pathRoom.desenhar(ctx, this.mapa.s);
      }
    }

    if (Debugger.isPath(PATHS.CAMINHO_TESOUROS)) {
      let playerPresente = this.ondeEstaOPlayer();
      if (playerPresente !== -1) {
        this.rooms[playerPresente].pathTesouros.desenhar(ctx, this.mapa.s, 0);
      }
    }

    if (Debugger.isPath(PATHS.GPS_SAIDA_ROOM)) {
      let playerPresente = this.ondeEstaOPlayer();
      if (playerPresente !== -1) {
        this.rooms[playerPresente].getPathGPS(this.player.gx, this.player.gy);
        this.rooms[playerPresente].pathGPS.desenhar(ctx, this.mapa.s);
      }
    }

    if (Debugger.isPath(PATHS.CAMINHO_PLAYER)) {
      let playerPresente = this.ondeEstaOPlayer();
      if (playerPresente !== -1) {
        this.rooms[playerPresente].pathPlayer.desenhar(ctx, this.mapa.s, 1);
      }
    }

    if (Debugger.isPath(PATHS.CAMINHO_SOBREPOSICAO)) {
      let playerPresente = this.ondeEstaOPlayer();
      if (playerPresente !== -1) {
        this.rooms[playerPresente].pathRoom.desenhar(ctx, this.mapa.s);
        this.rooms[playerPresente].pathTesouros.desenhar(ctx, this.mapa.s, 0);
        this.rooms[playerPresente].pathPlayer.desenhar(ctx, this.mapa.s, 1);
      }
    }


  };

  removerInimigos() {
    // Otimização: Inimigos atacados pelo player sempre estão na mesma sala

    for (let i = 0; i < this.rooms.length; i++) {
      let inimigos = this.rooms[i].enemies;
      for (let j = 0; j < inimigos.length; j++) {
        if (inimigos[j].hp <= 0) {
          inimigos.splice(j, 1);
        }
      }
    }
  }

  /**********************
   * Colisões e ataques *
   **********************/

  teleportar() {
    const room = this.rooms[this.player.room - 1];
    if (room.teleporterInitial.colidiuComCentralSize(this.player)) {
      room.teleporterInitial.teleportar(this.player, this);
      return true;
      //this.hud.bussola.update();
    }
    else if (room.teleporterFinal.colidiuComCentralSize(this.player)) {
      room.teleporterFinal.teleportar(this.player, this);
      return true;
      //this.hud.bussola.update();
    }
    return false;
  }

  colisaoFireZones(player) {
    let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
    if (auxRoom.collisionFirezones(player)) {             // Checa colisão com as firezones
      return true;
    }
  }

  // Testa as colisões do player com as firezones
  colisaoInimigos(player) {
    let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
    if (auxRoom.collisionEnemies(player)) {
      player.vivo = false;
      console.log("Colidiu com inimigos");
    }
  }

  validaAtaquePlayerInimigo(player) {
    //let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
    const inimigos = this.rooms[player.room - 1].enemies;
    if (player.atacando === 1 && player.cooldownAtaque > 0) {
      for (const indiceInimigo in inimigos) {
        const inimigo = inimigos[indiceInimigo];
        if (player.atacarModoPlayer(inimigo)) {
          console.log("Ataque Player no inimigo");
          inimigo.hp -= 30;
        }
      }
    }
  }

  colisaoTesouros(player) {
    let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
    if (auxRoom.collisionTreasures(player)) {
      console.log("Colidiu com tesouros");
      /*let salaInicial = this.rooms[this.teleporteInicioLevel.getCell().room - 1];
      let indiceSala = salaInicial.room - 1;
      auxRoom = this.rooms[indiceSala];
      let celula = this.mapa.getCell(this.player.gy, this.player.gx);
      this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 3);*/
    }
  }

  iniciaRooms() {
    if (this.roomIniciado) {
      return;
    }
    for (let i = 0; i < this.rooms.length; i++) {
      this.rooms[i].init();
      this.rooms[i].adicionarPontosDeInteresse();
      this.rooms[i].calculaDistPontosInteresse(); //Vai mostrar os pontos de interesse na i+1
      this.rooms[i].constroiRota();
      this.rooms[i].getPathTesouros(this.player.gx, this.player.gy, 0);
      this.rooms[i].getPathPlayer(this.player.gx, this.player.gy, 1);
      this.rooms[i].atualizaMetricas();
      this.rooms[i].atualizaMetricaCelulas("mediaInimigoTeleportePoder");
      this.rooms[i].atualizaMetricaCelulas("mediaTesouroFirezoneTeleporteEntradaSaida");
      this.rooms[i].atualizaMetricaCelulas("mediaInimigoTesouroTeleportePoder");
      this.enemyPositioningManager.marcarCelulasDisponiveisParaInimigos(this.rooms[i]);
      this.treasurePositioningManager.marcarCelulasDisponiveisParaTesouros(this.rooms[i]);
    }
    this.roomIniciado = true;
    //this.rooms[10].calculaDistPontosInteresse(); //Vai mostrar os pontos de interesse na i+1
    //this.rooms[10].constroiRota();
  }

  ondeEstaOPlayer() { // Retorna o índice do room onde o player está, ou -1 caso não esteja em nenhum.
    for (let i = 0; i < this.rooms.length; i++) {
      for (let j = 0; j < this.rooms[i].blocks.length; j++) {
        if (this.rooms[i].blocks[j].linha === this.player.gy && this.rooms[i].blocks[j].coluna === this.player.gx) {
          return i;
        }
      }
    }

    return -1;
  }

  posicionarInimigoDebug() {
    let roomAtual = this.getPlayerRoom();
    this.enemyPositioningManager.posicionarUmInimigo(this, roomAtual);
    roomAtual.atualizaMetricaCelulas("mediaInimigoTeleportePoder");
    roomAtual.metricas.mapaInfluencia.influenciaPoder = roomAtual.getValorMaxMapaInfluencia('influenciaPoder');
  }

  posicionarTesouroDebug() {
    let roomAtual = this.getPlayerRoom();
    this.treasurePositioningManager.posicionarUmTesouro(this);
    roomAtual.atualizaMetricaCelulas("mediaTesouroFirezoneTeleporteEntradaSaida");
    roomAtual.atualizaMetricaCelulas("mediaInimigoTesouroTeleportePoder");
  }

}

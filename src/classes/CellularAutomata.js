import Room from "./Room.js";

export default class CellularAutomata {
    constructor(params = {}) {
        let estruturaPadrao = {
            HS: 0,
            WS: 0,
            MOORE: 1,
            r: 0.5,
            totalRock: 5,
            floorIndex: 0,
            rockIndex: 1,
            wallIndex: 2,
            map: null,
            map2: null,
            rooms: [],
            seedGen: null
        }

        Object.assign(this, estruturaPadrao, params);

        this.map = this.initMap(this.HS, this.WS, this.floorIndex);
        this.map2 = this.initMap(this.HS, this.WS, this.floorIndex);
    }

    /**
     * GX => COLUNA
     * GY => LINHA
     */

    fullstep(steps = 2) {
        while (steps > 0) {
            this.gameOfWallRulesAutomata();
            this.toggleMaps();
            steps--;
        }
        this.gameOfWallRulesAutomataPutWalls();
        this.toggleMaps();
        while (this.gameOfWallRulesAutomataFinalStepCleanWalls() !== 0) { //Limpa as paredes espaçadas
            this.toggleMaps();
        }

        //this.gameOfWallRulesAutomataFinalStepCleanWalls();
        //this.toggleMaps();
        this.gameOfWallRulesAutomataPutWalls();
        this.toggleMaps();
    }

    countRooms() {
        this.rooms = [];
        let auxMatrix = this.initMap(this.HS, this.WS, -1);
        let auxMatrixVisited = [];
        let roomId = 0;
        let roomFloors = 0;
        let caveAreaCounter = 0;
        let caveAreaIndex = -2;
        let roomAreaIndex = -1;
        for (let i = 0; i < this.HS; i++) {
            auxMatrixVisited[i] = [];
            for (let j = 0; j < this.WS; j++) {
                auxMatrixVisited[i][j] = false;
                if (this.map[i][j] !== this.floorIndex) {
                    auxMatrix[i][j] = caveAreaIndex;   //Cave area
                    caveAreaCounter++;
                }
                else {
                    auxMatrix[i][j] = roomAreaIndex;   //rooms area
                    roomFloors++;
                }
            }
        }

        for (let i = 0; i < this.HS; i++) {
            for (let j = 0; j < this.WS; j++) {
                if (auxMatrix[i][j] === roomAreaIndex) {
                    roomId++;
                    this.visitCells(auxMatrix, this.map, i, j, this.floorIndex, 1, roomId)
                    let newRoom = new Room(roomId);
                    this.rooms.push(newRoom);
                }
            }
        }


        for (let i = 0; i < this.HS; i++) {               // Adiciona blocos às salas
            for (let j = 0; j < this.WS; j++) {
                if (auxMatrix[i][j] > 0) {
                    this.rooms[auxMatrix[i][j] - 1].addBlock(i, j);
                }
            }
        }

        //let text = "Size of rooms: {";
        /*for(let i = 0; i < sizeRooms.length; i++){
            text += "( R:"+ (i+1) + " , S:" + sizeRooms[i] + " ) ; ";
        }*/
        /*for(let i = 0; i < this.rooms.length; i++){
            text += "( R:"+ (i+1) + " , S:" + this.rooms[i].blocks.length + " ) ; ";
        }
        text += "}";*/
        //console.log(text);
        console.log("Number of rooms: " + this.rooms.length);
        console.log("Number of roomFloors: " + roomFloors);
        console.log("Number of caveArea: " + caveAreaCounter);
        console.log("Total blocks: " + this.HS * this.WS);
        //console.log(this.rooms);
        /*let text = "";
        for(let i = 0; i < this.HS; i++){
            text = text + "auxMatrix ["+i+"]: {";
            for(let j = 0; j < this.WS; j++){
                text = text + " " + auxMatrix[i][j] + "("+j+"), ";
            }
            text = text + " }\n"
        }
        console.log(text);*/
    }

    /**
     * Remove as salas de tamanho menor que um valor determinado e aplica um automato para corrigir o mapa
     */

    filterRooms(sizeRoomsMinimal = 10) {
        let count = 0;
        while (true) {
            count = 0;
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].blocks.length <= sizeRoomsMinimal) {    //Remove as salas de tamanhos menores que a variavel
                    for (let k = 0; k < this.rooms[i].blocks.length; k++) {
                        this.map2[this.rooms[i].blocks[k][0]][this.rooms[i].blocks[k][1]] = this.rockIndex;  //Atribui como rock
                    }
                    count++;
                    this.rooms.splice(i, 1);
                }
            }
            //console.log("rooms after removing: " + this.rooms.length);
            this.toggleMaps();
            if (count === 0) {
                break;
            }
        }
        for (let i = 0; i < this.rooms.length; i++) {                         //Reorder the numbers of the rooms
            this.rooms[i].number = i + 1;                                   //Initiate with number 1
        }
        /*this.gameOfWallRulesAutomataRemoveWalls();
        this.toggleMaps();
        this.gameOfWallRulesAutomataPutWalls();
        this.toggleMaps();
        this.gameOfWallRulesAutomataRemoveWalls();
        this.toggleMaps();
        this.gameOfWallRulesAutomataPutWalls();
        this.toggleMaps();
        this.gameOfWallRulesAutomataFinalStepCleanWalls();
        this.toggleMaps();*/
        while (this.gameOfWallRulesAutomataFinalStepCleanWalls() !== 0) { //Limpa as paredes espaçadas
            this.toggleMaps();
            this.gameOfWallRulesAutomataPutWalls();
            this.toggleMaps();
            this.gameOfWallRulesAutomataRemoveWalls();
            this.toggleMaps();
        }
        this.gameOfWallRulesAutomataRemoveWalls();
        this.toggleMaps();
        this.countRooms();
    }

    /*getRandomInt (min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;    
    }*/

    getRandomInt(min, max) {
        return this.seedGen.nextRandInt(min, max);
    }

    /*setTeleporters (){
        let indAvaliableRoom;
        let indFinishRoom;
        let roomsAvaliable = [];            //Rooms avaliable to choose initial teleporter 
        let roomsClosed = [];               //Rooms that the initial teleporter is connected
        let blocksSorted = [-1,-1];
        let sortPosition;
        console.log("\n\n\n\n -----" + blocksSorted +  "\n\n\n\n");
    
        for(let i = 0; i < this.rooms.length; i++){                 //Setting teleports into the room
            //Setting positions of the teleporters
            sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1));
            while(sortPosition === blocksSorted[0]){
                sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1));
            }
            this.rooms[i].teleporterInitial.setPosition(this.rooms[i].blocks[sortPosition][0], this.rooms[i].blocks[sortPosition][1]);
            blocksSorted[0] = sortPosition;
            sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1))
            while(sortPosition === blocksSorted[1]){
                sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1))
            }
            blocksSorted[1] = sortPosition;
            this.rooms[i].teleporterFinal.setPosition(this.rooms[i].blocks[sortPosition][0], this.rooms[i].blocks[sortPosition][1]);
            roomsAvaliable.push(this.rooms[i].number);
        }
        //GX => COLUNA, GY => LINHA
    
        //Connecting first rooms manually
    
        indAvaliableRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));                 //Begin teleporter room
        indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
        while(indAvaliableRoom  ===  indFinishRoom){
            indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
        }
        let currentRoom = this.rooms[roomsAvaliable[indFinishRoom] - 1].number;
        
        this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.setFinish(this.rooms[roomsAvaliable[indFinishRoom] - 1].number, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGX, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGY);
    
        this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.setFinish(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGX, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGY);
    
        roomsClosed.push(roomsAvaliable[indAvaliableRoom]);//roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
        roomsAvaliable.splice(indAvaliableRoom, 1);
    
        while(roomsAvaliable.length > 1){
            //currentRoom = this.rooms[roomsAvaliable[indFinishRoom] - 1].number;
            //console.log(roomsAvaliable.length);
            for(let i = 0; i < this.rooms.length; i++){
                if(roomsAvaliable[i] === currentRoom){                       //Room's number was finded
                    indAvaliableRoom = i;
                    break;
                }
            }
    
            indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
            while(indAvaliableRoom  ===  indFinishRoom){
                //console.log(roomsAvaliable);
                //console.log(indAvaliableRoom + " avaliableRoom");
                //console.log(indFinishRoom + " finishRoom");
                indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
                //console.log("LOOP");
                if(roomsAvaliable.length === 2){
                    if(indAvaliableRoom === 0){
                        indFinishRoom = 1;
                    }
                    else
                        indFinishRoom = 0;
                }
            }
            currentRoom = roomsAvaliable[indFinishRoom];//this.rooms[roomsAvaliable[indFinishRoom] - 1].number;
    
            this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.setFinish(this.rooms[roomsAvaliable[indFinishRoom] - 1].number, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGX, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGY);
            
            this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.setFinish(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGX, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGY);
    
            roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
            roomsAvaliable.splice(indAvaliableRoom, 1);
        }
    
    
        //Connecting last room => to create a cycle on the rooms connections
    
        this.rooms[roomsAvaliable[0] - 1].teleporterInitial.setFinish(this.rooms[roomsClosed[0] - 1].number, this.rooms[roomsClosed[0] - 1].teleporterFinal.startGX, this.rooms[roomsClosed[0] - 1].teleporterFinal.startGY);
    
        this.rooms[roomsClosed[0] - 1].teleporterFinal.setFinish(this.rooms[roomsAvaliable[0] - 1].number, this.rooms[roomsAvaliable[0] - 1].teleporterInitial.startGX, this.rooms[roomsAvaliable[0] - 1].teleporterInitial.startGY);
    
        roomsClosed.push(this.rooms[roomsAvaliable[0] - 1].number);
        roomsAvaliable.splice(indAvaliableRoom, 1);
    
        console.log("\nINITIAL\nA -> B:");
        for(let i = 0; i < this.rooms.length; i++){
            console.log("A( "+ this.rooms[i].teleporterInitial.startIDRoom +" ) -> B( " + this.rooms[i].teleporterInitial.finishIDRoom  + " )");
        }
        console.log("\nFINAL\nB -> A:");
        for(let i = 0; i < this.rooms.length; i++){
            console.log("B( "+ this.rooms[i].teleporterFinal.startIDRoom +" ) -> A( " + this.rooms[i].teleporterFinal.finishIDRoom  + " )");
        }
    }*/

    visitCells(auxMatrix, mapx, y, x, tp, d = 1, indexArea) {   //visita as celulas vizinhas de maneira recursiva e atribui o código da sala correspondente 
        /*********************************************
         * 
         * Algoritmo Flood fill:
         * https://en.wikipedia.org/wiki/Flood_fill
         * 
        ***********************************************/

        if (auxMatrix[y][x] === indexArea) {  //Célula com a "cor" ou "indice da sala" correspondente ao indexArea
            return;
        }
        if (auxMatrix[y][x] === -1) {         //Não mapeado ainda
            auxMatrix[y][x] = indexArea;    //Set cell is visited
        }
        else {                               //Ou foi mapeado ou a celula é Wall/Rock
            return;
        }
        if (y - 1 >= 0) {
            this.visitCells(auxMatrix, mapx, y - 1, x, tp, d, indexArea);
        }
        if (y + 1 < this.HS) {
            this.visitCells(auxMatrix, mapx, y + 1, x, tp, d, indexArea);
        }
        if (x - 1 >= 0) {
            this.visitCells(auxMatrix, mapx, y, x - 1, tp, d, indexArea);
        }
        if (x + 1 < this.WS) {
            this.visitCells(auxMatrix, mapx, y, x + 1, tp, d, indexArea);
        }
    }

    countAdjacentsMoore(mapx, y, x, tp, d = 1) {   //Conta as células de um tipo específico ao redor da célula (x,y)
        let total = 0;
        const mL = Math.max(y - d, 0);
        const ML = Math.min(y + d, mapx.length - 1);
        const mC = Math.max(x - d, 0);
        const MC = Math.min(x + d, mapx[0].length - 1);
        for (let l = mL; l <= ML; l++) {
            for (let c = mC; c <= MC; c++) {
                if (mapx[l][c] === tp) {
                    total++;
                }
            }
        }
        if (mapx[y][x] === tp) { //Desconta o valor da celula central
            total--;
        }
        return total;
    }

    toggleMaps() {
        this.map = JSON.parse(JSON.stringify(this.map2));   //Copia matriz
    }

    toggleRooms(rooms) {
        rooms = JSON.parse(JSON.stringify(this.rooms));  //Copia matriz
    }

    initMap(L, C, v) {
        let mapx = [];
        for (let l = 0; l < L; l++) {
            mapx[l] = [];
            for (let c = 0; c < C; c++) {
                mapx[l][c] = v;
            }
        }
        return mapx;
    }

    /**
     * 1º - Padrão descrito no artigo
     * Observa quem está ao redor de rochas e posiciona rocha ou chão no automato
     */

    gameOfWallRulesAutomata() {
        /**
        * Types:
        *   0 => floor;
        *   1 => rock;
        *   2 => wall;
        */
        for (let l = 0; l < this.map2.length; l++) {
            for (let c = 0; c < this.map2[0].length; c++) {
                this.map2[l][c] = this.map[l][c];
                if (this.countAdjacentsMoore(this.map, l, c, this.rockIndex, this.Moore) >= this.totalRock) {
                    this.map2[l][c] = this.rockIndex;
                } else {
                    this.map2[l][c] = this.floorIndex;
                }
            }
        }
    }

    /**
     * 2º - Padrão descrito no artigo
     * Posiciona os walls ao redor das cavernas
     */

    gameOfWallRulesAutomataPutWalls() {
        /**
        * Types:
        *   0 => floor;
        *   1 => rock;
        *   2 => wall;
        */
        for (let l = 0; l < this.map2.length; l++) {
            for (let c = 0; c < this.map2[0].length; c++) {
                this.map2[l][c] = this.map[l][c];
                switch (this.map[l][c]) {
                    case this.floorIndex: //Floor
                        break;
                    case this.rockIndex: //Rock
                        if ((l > 0 && l < this.map2.length - 1) && (c > 0 && c < this.map2[0].length - 1)) { //Certifica que walls nas laterais não serão removidos
                            if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) >= 1) {  //Celulas rock com 1 vizinho chão ou mais 
                                this.map2[l][c] = this.wallIndex;
                            }
                        }
                        else {
                            this.map2[l][c] = this.wallIndex;
                        }
                        break;
                    case this.wallIndex: //Wall
                        break;
                }
            }
        }
    }

    /**
     * Autômato visado para limpar as walls em posições incorretas
     */

    gameOfWallRulesAutomataFinalStepCleanWalls() {
        /**
        * Types:
        *   0 => floor;
        *   1 => rock;
        *   2 => wall;
        */
        let count = 0;
        for (let l = 0; l < this.map2.length; l++) {
            for (let c = 0; c < this.map2[0].length; c++) {
                this.map2[l][c] = this.map[l][c];
                if ((l > 0 && l < this.map2.length - 1) && (c > 0 && c < this.map2[0].length - 1)) { //Certifica que walls nas laterais não serão removidos
                    switch (this.map[l][c]) {
                        case this.floorIndex: //Floor
                            break;
                        case this.rockIndex: //Rock
                            break;
                        case this.wallIndex: //Wall
                            if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) >= 4 && this.countAdjacentsMoore(this.map, l, c, this.rockIndex, 1) === 0) {
                                this.map2[l][c] = this.floorIndex;
                                count++;
                            }
                            else {
                                if (this.countAdjacentsMoore(this.map, l, c, this.rockIndex, 1) === 0) {
                                    this.map2[l][c] = this.floorIndex;
                                    count++;
                                }
                            }
                            break;
                    }
                }
                else {
                    switch (this.map[l][c]) {
                        case this.floorIndex: //Floor
                            break;
                        case this.rockIndex: //Rock
                            break;
                        case this.wallIndex: //Wall
                            if (this.countAdjacentsMoore(this.map, l, c, this.wallIndex, 1) >= 2) {
                                this.map2[l][c] = this.floorIndex;
                                count++;
                            }
                            /*else{
                                if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) === 0) {
                                    this.map2[l][c] = this.rockIndex;
                                    count++;
                                }
                            }*/
                            break;
                    }
                }
            }
        }
        return count;
    }

    /**
     *
     * Remove as paredes em locais incorretos
     */

    gameOfWallRulesAutomataRemoveWalls() {
        /**
        * Types:
        *   0 => floor;
        *   1 => rock;
        *   2 => wall;
        */
        for (let l = 0; l < this.map2.length; l++) {
            for (let c = 0; c < this.map2[0].length; c++) {
                this.map2[l][c] = this.map[l][c];
                switch (this.map[l][c]) {
                    case this.floorIndex: //Floor
                        break;
                    case this.rockIndex: //Rock
                        break;
                    case this.wallIndex: //Wall
                        if (this.countAdjacentsMoore(this.map, l, c, this.rockIndex, 1) >= 3 && this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) === 0) {  //Celulas rock com 1 vizinho chão ou mais 
                            this.map2[l][c] = this.rockIndex;
                        }
                        break;
                }
            }
        }
    }

    /**
     * Volta as matrizes do automato para um tipo padrão
     */

    scenarioReset(tp) {
        this.map = this.initMap(this.HS, this.WS, tp);
        this.map2 = this.initMap(this.HS, this.WS, tp);
    }

    /**
     * Condição inicial do artigo: Randomiza walls em volta do mapa
     * e depois aplica os automatos
     */

    scenarioRandomWall() {
        this.scenarioReset(this.floorIndex);          //Init with floor completely
        let matrix = [];
        for (let l = 0; l < this.HS; l++) {
            for (let c = 0; c < this.WS; c++) {
                matrix.push([l, c]);
            }
        }
        let rockInMap = (this.r * this.HS * this.WS); // Porcentagem de blocos de caverna que o mapa têm
        for (let i = 0; i < rockInMap; i++) {
            let matrixIndexRandom = this.seedGen.nextRandInt(0, matrix.length);
            let linha = matrix[matrixIndexRandom][0];
            let coluna = matrix[matrixIndexRandom][1];
            this.map[linha][coluna] = this.rockIndex;
            this.map2[linha][coluna] = this.rockIndex;
            matrix.splice(matrixIndexRandom, 1);
        }
    }

}
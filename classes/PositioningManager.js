export default class PositioningManager {
    constructor(seedGen, mapa) {
        this.seedGen = seedGen;
        this.mapa = mapa;
        this.porcentagemDistanciaComp = 0.5;
    }

    getRandomInt(min, max) {
        return this.seedGen.nextRandInt(min, max);
    }

    getRandomFloat(min, max) {
        return this.seedGen.nextRandFloat(min, max);
    }

}
export const DEBUG_MODE = Object.freeze({
    DEBUG_OFF: 0,
    SIMPLE_DEBUG: 1,
    TIPO_DA_CELULA: 2,
    ROOM_DA_CELULA: 3,
    LIGACAO_TELEPORTES: 4,
    CAIXA_DE_COLISAO: 5,
    DISTANCIA_TELEPORTES: 6,
    DISTANCIA_FIREZONES: 7,
    DISTANCIA_INIMIGOS: 8,
    DISTANCIA_TESOUROS: 9,
    DISTANCIA_INIMIGOS_TELEPORTES: 10,
    DISTANCIA_INIMIGOS_TELEPORTES_FIREZONES: 11,
    INFLUENCIA_PODER: 12,
    MAPA_INIMIGOS_TELEPORTES_PODER: 13,
    MAPA_INIMIGOS_TESOURO_TELEPORTES_PODER: 14,
    POSICIONAMENTO_INIMIGO: 15,
    POSICIONAMENTO_TESOURO: 16,
    PONTOS_DE_INTERESSE: 17,
    DISTANCIA_CAMINHO_ENTRADA_SAIDA: 18,
    MAPA_TESOURO_FIREZONE_TELEPORTE_ENTRADA_SAIDA: 19,
});

export const PATHS = Object.freeze({
    CAMINHO_OFF: 0,
    GPS_SAIDA_ROOM: 1,
    CAMINHO_ENTRADA_SAIDA: 2,
    CAMINHO_TESOUROS: 3,
    CAMINHO_SOBREPOSICAO: 4,
    CAMINHO_PLAYER: 5,
});


export default class Debugger {
    static _debugMode = DEBUG_MODE.DEBUG_OFF;
    static _pathSelecionado = PATHS.CAMINHO_OFF;

    // Debug mode
    static setDebugMode(debugMode) {
        Debugger._debugMode = debugMode;
    }

    static getDebugMode(){
        return Debugger._debugMode;
    }

    static isDebugMode(debugMode) {
        return Debugger._debugMode === debugMode;
    }

    static isDebugModeOn() {
        return Debugger._debugMode !== DEBUG_MODE.DEBUG_OFF;
    }

    static nextDebugMode() {
        Debugger._debugMode++;
        if (Debugger._debugMode >= Object.values(DEBUG_MODE).length) {
            Debugger._debugMode = 0;
        }
    }

    static previousDebugMode() {
        Debugger._debugMode--;
        if (Debugger._debugMode < 0) {
            Debugger._debugMode = Object.values(DEBUG_MODE).length - 1;
        }
    }

    // Path
    static isPath(path) {
        return Debugger._pathSelecionado === path;
    }

    static setPath(path) {
        Debugger._pathSelecionado = path;
    }

    static getPath(){
        return Debugger._pathSelecionado;
    }

    static nextPath() {
        Debugger._pathSelecionado++;
        if (Debugger._pathSelecionado >= Object.values(PATHS).length) {
            Debugger._pathSelecionado = 0;
        }
    }

    static previousPath() {
        Debugger._pathSelecionado--;
        if (Debugger._pathSelecionado < 0) {
            Debugger._pathSelecionado = Object.values(PATHS).length - 1;
        }
    }

}

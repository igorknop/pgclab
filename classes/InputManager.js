export default class InputManager {
    constructor() {
        this.comandos = {};
        this.teclas = {};
        this.mapaPressionado = {};
    }

    configurarTeclado(acoes) {
        for (const tecla in acoes) {
            const comando = acoes[tecla];
            this.teclas[tecla] = comando;
            this.comandos[comando] = false;
            this.mapaPressionado[comando] = false;
        }
        const that = this;
        addEventListener("keydown", function (e) {
            const comando = that.teclas[e.key];
            if (comando) {
                that.comandos[comando] = true;
            }
            // console.log(e.key, comando, that.comandos[comando]);
        });
        addEventListener("keyup", function (e) {
            const comando = that.teclas[e.key];
            if (comando) {
                that.mapaPressionado[comando] = false;
                that.comandos[comando] = false;
            }
            // console.log(e.key, comando, that.comandos[comando]);
        });
    }

    foiPressionado(comando) {
        if (this.comandos[comando]) {
            if (this.mapaPressionado[comando] != undefined && !this.mapaPressionado[comando]) {
                this.mapaPressionado[comando] = true;
                return true;
            }
        }
        return false;
    }

    estaPressionado(comando) {
        if (this.comandos[comando]) {
            this.mapaPressionado[comando] = true;
            return true;
        }
        return false;
    }


}
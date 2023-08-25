export default class InputManager {
    constructor() {
        this.commands = {};
        this.teclas = {};
        this.pressedMap = {};
    }

    setupKeyboard(acoes) {
        for (const tecla in acoes) {
            const comando = acoes[tecla];
            this.teclas[tecla] = comando;
            this.commands[comando] = false;
            this.pressedMap[comando] = false;
        }
        const that = this;
        addEventListener("keydown", function (e) {
            const comando = that.teclas[e.key];
            if (comando) {
                that.commands[comando] = true;
            }
            // console.log(e.key, comando, that.comandos[comando]);
        });
        addEventListener("keyup", function (e) {
            const comando = that.teclas[e.key];
            if (comando) {
                that.pressedMap[comando] = false;
                that.commands[comando] = false;
            }
            // console.log(e.key, comando, that.comandos[comando]);
        });
    }

    wasPressed(command) {
        if (this.commands[command]) {
            if (this.pressedMap[command] != undefined && !this.pressedMap[command]) {
                this.pressedMap[command] = true;
                return true;
            }
        }
        return false;
    }

    isPressed(command) {
        if (this.commands[command]) {
            this.pressedMap[command] = true;
            return true;
        }
        return false;
    }


}
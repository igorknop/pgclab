export default function InputController() {
    this.nomes = {};
    this.codigos = {};
    this.teclas = {};

    this.joysticks = {};
}

InputController.prototype.setupKeyboard = function (novasTeclas) {
    for (let t = 0; t < novasTeclas.length; t++) {
        const tecla = novasTeclas[t];
        this.nomes[tecla.codigo] = tecla.nome;
        this.codigos[tecla.nome] = tecla.codigo;
        this.teclas[tecla.nome] = false;
    }
    const that = this;
    addEventListener("keydown", function (e) {
        let nome = that.nomes[e.keyCode];
        if (nome) {
            that.teclas[nome] = true;
            e.preventDefault();
        }

    });
    addEventListener("keyup", function (e) {
        let nome = that.nomes[e.keyCode];
        if (nome) {
            that.teclas[nome] = false;
            e.preventDefault();
        }

    });

}

InputController.prototype.setupJoysticks = function () {
    const that = this;
    addEventListener("gamepadconnected", function (e) {
        let gamepad = e.gamepad;
        console.log(`${gamepad.id} connected!`);
        that.joysticks[gamepad.index] = gamepad;

    });
    addEventListener("gamepaddisconnected", function (e) {
        let gamepad = e.gamepad;
        console.log(`${gamepad.id} disconnected!`);
        delete that.joysticks[gamepad.index];

    });
}

InputController.prototype.updateJoysticks = function(){
    const gamepads = navigator.getGamepads();
    for (let g = 0; g < gamepads.length; g++) {
        const gamepad = gamepads[g];
        if(gamepad){
            this.joysticks[gamepad.index] = gamepad;
        }
    }
}
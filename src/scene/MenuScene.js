import Scene, { fontMainMenu, wordsColor, alignMainMenu } from './Scene.js';
// let stateMainMenu = 0;
export default class CenaMenu extends Scene {

    draw() {
        super.draw();
        this.ctx.fillStyle = wordsColor;
        this.ctx.textAlign = alignMainMenu;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black";
        this.ctx.font = "40px Arial Black";
        this.ctx.strokeText("Maze Runner", this.canvas.width / 2, this.canvas.height / 3 - 50);
        this.ctx.fillText("Maze Runner", this.canvas.width / 2, this.canvas.height / 3 - 50);
        this.ctx.font = "15px Arial Black";
        this.ctx.font = fontMainMenu;

        this.ctx.fillStyle = this.estadoMenu == 0 ? 'yellow' : wordsColor;
        this.ctx.strokeText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        this.ctx.fillText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        this.ctx.fillStyle = this.estadoMenu == 0 ? wordsColor : 'yellow';
        this.ctx.strokeText("Quit", this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText("Quit", this.canvas.width / 2, this.canvas.height / 2 - 10);
    }

    frame(t) {
        super.frame(t);
        if (this.estadoMenu === 0) {
            if (this.input.isPressed("ENTER")) {
                this.game.selectScene("jogo");
                return;
            }
        }
        if (this.input.isPressed("SETA_BAIXO")) {
            this.estadoMenu = 1;
        } else if (this.input.isPressed("SETA_CIMA")) {
            this.estadoMenu = 0;
        }
    }

    start() {
        super.start();
    }

    setup() {
        this.estadoMenu = 0;
    }

}
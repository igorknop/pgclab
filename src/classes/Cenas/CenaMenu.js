import Cena, { fontMainMenu, wordsColor, alignMainMenu } from './Cena.js';
// let stateMainMenu = 0;
export default class CenaMenu extends Cena {

    desenhar() {
        super.desenhar();
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

    quadro(t) {
        super.quadro(t);
        if (this.estadoMenu === 0) {
            if (this.inputManager.foiPressionado("ENTER")) {
                this.game.selecionarCena("jogo");
                return;
            }
        }
        if (this.inputManager.foiPressionado("SETA_BAIXO")) {
            this.estadoMenu = 1;
        } else if (this.inputManager.foiPressionado("SETA_CIMA")) {
            this.estadoMenu = 0;
        }
    }

    iniciar() {
        super.iniciar();
    }

    preparar() {
        this.estadoMenu = 0;
    }

}
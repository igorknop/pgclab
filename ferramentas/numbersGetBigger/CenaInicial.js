import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";
import Button from "../../js/utils/Button.js";
import getXY from "../../js/utils/getXY.js";
import MaisBarato from "./heuristicas/MaisBarato.js";
import CustoBeneficio from "./heuristicas/CustoBeneficio.js";

export default class CenaInicial extends Cena {
  constructor(canvas = null, assets = null) {
    super(canvas, assets);
    this.maisBaratoSelecionado = false;
    this.custoBeneficioSelecionado = false;
  }

  desenhar() {
    super.desenhar();
    if (this.maisBaratoSelecionado) {
      this.ctx.drawImage(
        this.assets.img("checkbox"),
        0.63 * this.canvas.width,
        0.7 * this.canvas.height - (0.07 * this.canvas.height) / 2,
        0.05 * this.canvas.width,
        0.07 * this.canvas.height,
      );
    }
    if (this.custoBeneficioSelecionado) {
      this.ctx.drawImage(
        this.assets.img("checkbox"),
        0.63 * this.canvas.width,
        0.8 * this.canvas.height - (0.07 * this.canvas.height) / 2,
        0.05 * this.canvas.width,
        0.07 * this.canvas.height,
      );

    }
  }

  quadro(t) {
    super.quadro(t);
  }

  controle() { }

  quandoColidir(a, b) { }

  preparar() {
    super.preparar();
    this.createAreas();
    this.canvas.onmousedown = (e) => {
      this.mousedown(e);
    };
    this.canvas.onmousemove = (e) => {
      this.mousemove(e);
    };
    this.canvas.onclick = (e) => {
      this.click(e);
    };
    this.botaoMaisBarato = new MaisBarato(this.canvas);
    this.botaoCustoBeneficio = new CustoBeneficio(this.canvas);
  }

  createAreas() {
    this.jogoNormal = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.5 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Jogo Normal"
    ));
    this.jogoRegressivo = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.6 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Jogo Regressivo"
    ));
    this.heuristicaCheaperFirst = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.7 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Heurística mais barato"
    ));
    this.heuristicaCustoBeneficio = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.8 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Heurística custo benefício"
    ));
  }

  mousedown(e) {
    if (this.assets.progresso() < 100.0 || this.expire > 0) {
      return;
    }
    const [x, y] = getXY(e, this.canvas);
    if (this.jogoNormal.hasPoint({ x, y })) {
      this.game.selecionaCena("cenaNormal");
    }
    if (this.jogoRegressivo.hasPoint({ x, y })) {
      this.game.selecionaCena("cenaRegressivo");
    }
    if (this.heuristicaCheaperFirst.hasPoint({ x, y })) {
      this.maisBaratoSelecionado = !this.maisBaratoSelecionado;
      if (this.maisBaratoSelecionado) {
        this.custoBeneficioSelecionado = false;
      }
      // this.game.selecionaCena("cenaNormal");
      this.game.setHeuristica(this.botaoMaisBarato);
    }
    if (this.heuristicaCustoBeneficio.hasPoint({ x, y })) {
      this.custoBeneficioSelecionado = !this.custoBeneficioSelecionado;
      if (this.custoBeneficioSelecionado) {
        this.maisBaratoSelecionado = false;
      }
      // this.game.selecionaCena("cenaNormal");
      this.game.setHeuristica(this.botaoCustoBeneficio);
    }
  }

  click(e) {
    // this.mousedown(e);
  }

  mousemove(e) {
    super.mousemove(e);
  }

  desenharHud() { }
}

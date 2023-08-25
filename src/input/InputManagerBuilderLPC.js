import InputManagerBuilder from "./InputManagerBuilder";

export default class InputManagerBuilderLPC extends InputManagerBuilder {
  setupKeyboard() {
    super.setupKeyboard();
    this._inputManager.setupKeyboard({
      ArrowLeft: "SETA_ESQUERDA",
      ArrowRight: "SETA_DIREITA",
      ArrowUp: "SETA_CIMA",
      ArrowDown: "SETA_BAIXO",
      " ": "SPACE",
      Enter: "ENTER",
      Control: "CONTROL",
      Shift: "Shift",
      m: "m",
      Escape: "ESC",
      c: "ALTERNA_CAMINHO",
      p: "p",
      o: "o",
      t: "t",
      g: "ALTERNA_GRAFICO",
      Add: "+",
      Subtract: "-",
    });
  }
}

import InputManager from "./InputManager.js";

export default class InputManagerBuilder {
  constructor() {
    this._inputManager = null;
  }
  reset() {
    this._inputManager = new InputManager();
  }
  setupKeyboard() {
    this._inputManager.setupKeyboard();
  }
  setupGamepad() {
    this._inputManager.setupGamepad();
  }

  build() {
    this.reset();
    this.setupKeyboard();
    this.setupGamepad();
    return this._inputManager;
  }
}
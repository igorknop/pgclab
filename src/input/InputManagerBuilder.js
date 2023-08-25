import InputManager from "./InputManager.js";

export default class InputManagerBuilder {
  constructor() {
    this._inputManager = null;
  }
  reset() {
    this._inputManager = new InputManager();
  }
  setupKeyboard() {

  }
  setupJoystick() {

  }
  build() {
    this.reset();
    this.setupKeyboard();
    this.setupJoystick();
    return this._inputManager;
  }
}
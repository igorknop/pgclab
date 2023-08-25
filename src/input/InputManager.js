export default class InputManager {
  constructor() {
    this.commands = {};
    this.keys = {};
    this.pressedMap = {};
    this.gamepads = {};
  }

  setupKeyboard(actions) {
    const that = this;
    for (const key in actions) {
      const command = actions[key];
      this.keys[key] = command;
      this.commands[command] = false;
      this.pressedMap[command] = false;
    }
    window.addEventListener("keydown", function (e) {
      const command = that.keys[e.key];
      if (command) {
        that.commands[command] = true;
      }
    });
    window.addEventListener("keyup", function (e) {
      const command = that.keys[e.key];
      if (command) {
        that.pressedMap[command] = false;
        that.commands[command] = false;
      }
    });
  }

  isPressed(command) {
    if (this.commands[command]) {
      this.pressedMap[command] = true;
      return true;
    }
    return false;
  }

  setupGamepad() {
    const that = this;
    window.addEventListener("gamepadconnected", function (e) {
      const gamepad = e.gamepad;
      console.log(`${gamepad.id} connected!`);
      that.gamepads[gamepad.index] = gamepad;
    });
    window.addEventListener("gamepaddisconnected", function (e) {
      const gamepad = e.gamepad;
      console.log(`${gamepad.id} disconnected!`);
      delete that.gamepads[gamepad.index];
    });
  }

  updateGamepads() {
    const gamepads = navigator.getGamepads();
    for (let g = 0; g < gamepads.length; g++) {
      const gamepad = gamepads[g];
      if (gamepad) {
        this.gamepads[gamepad.index] = gamepad;
      }
    }
  }
}

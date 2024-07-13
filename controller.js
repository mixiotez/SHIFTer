class Controller {
  constructor() {
    this.pressedKeys = [];
  }

  pressKey(keyCode) {
    this.pressedKeys[keyCode] = true;
  }

  releaseKey(keyCode) {
    this.pressedKeys[keyCode] = false;
  }
}

export { Controller };

class Controller {
  constructor() {
    this.pressedKeys = {};
  }

  pressKey(key) {
    this.pressedKeys[key] = true;
  }

  releaseKey(key) {
    this.pressedKeys[key] = false;
  }
}

export { Controller };

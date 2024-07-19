import { Level } from "./level.js";
import { levels } from "./levels.js";
import { TILE_SIZE, WIDTH, HEIGHT, COLORS, SOUNDS } from "./consts.js";

// HTML elements
const navigationTutorial = document.getElementById("navigationTutorial");
const layersTutorial = document.getElementById("layersTutorial");
const bodyStyle = document.body.style;
const muteButton = document.getElementById("mute");

// Items
function loadImage(src) {
  const image = new Image();
  image.src = src;

  return image;
}

const items = {
  key: loadImage("./images/key.png"),
  hiddenKey: loadImage("./images/key-hidden.png"),
  door: loadImage("./images/door.png"),
  closedDoor: loadImage("./images/closedDoor.png"),
  saw: loadImage("./images/saw.png"),
  hiddenSaw: loadImage("./images/saw-hidden.png"),
  invertYArrow: loadImage("./images/invertYArrow.png"),
};

class Game {
  constructor(ctx, controller, player) {
    this.ctx = ctx;
    this.controller = controller;
    this.player = player;

    this.timerId = 0;
    this.isPaused = false;
    this.hasEnded = false;

    this.levels = levels.map((level) => new Level(level));
    this.levelCounter = 1;
    this.currentLevel = this.levels[this.levelCounter - 1];

    this.currentMap = this.currentLevel.maps.main;
    this.isInMainMap = true;
    this.invertedMap = false;
    this.previousColors = 0;
    this.colors = COLORS[0];
  }

  updateCurrentMap() {
    if (!this.invertedMap) {
      if (this.isInMainMap) {
        this.currentMap = this.currentLevel.maps.main;
      } else this.currentMap = this.currentLevel.maps.alt;
    } else {
      if (this.isInMainMap) {
        this.currentMap = this.currentLevel.maps.inverted;
      } else this.currentMap = this.currentLevel.maps.invertedAlt;
    }
  }

  updateColors() {
    let randomIndex = Math.floor(Math.random() * COLORS.length);

    while (this.previousColors === randomIndex) {
      randomIndex = Math.floor(Math.random() * COLORS.length);
    }

    this.previousColors = randomIndex;
    this.colors = COLORS[randomIndex];
    bodyStyle.backgroundImage = bodyStyle.backgroundColor =
      this.colors.background;
  }

  unpause() {
    clearTimeout(this.timerId);
    this.isPaused = false;
  }

  pauseAndDraw() {
    clearTimeout(this.timerId);
    this.isPaused = true;
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.drawMap();
    this.player.draw();
    this.timerId = setTimeout(() => {
      this.isPaused = false;
    }, 250);
  }

  captureMapChanges() {
    // Don't capture changes if there is no alt map
    if (!this.currentLevel.maps.alt.length) return;

    if (this.controller.pressedKeys.KeyA && !this.isInMainMap) {
      this.isInMainMap = true;
      this.updateCurrentMap();
      this.pauseAndDraw();
    }

    if (this.controller.pressedKeys.KeyD && this.isInMainMap) {
      this.isInMainMap = false;
      this.updateCurrentMap();
      this.pauseAndDraw();
    }

    // Restart – For testing only!
    if (this.controller.pressedKeys.KeyR) {
      this.respawnPlayer();
    }
  }

  restartLevel() {
    this.updateColors();
    this.isInMainMap = true;
    this.invertedMap = false;
    this.updateCurrentMap();
    bodyStyle.backgroundColor = this.colors.background;
  }

  nextLevel() {
    this.unpause();
    SOUNDS.nextLevel.play();

    switch (this.levelCounter) {
      case 1:
        navigationTutorial.classList.add("hidden");
        break;

      case 2:
        layersTutorial.classList.remove("hidden");
        break;

      case 3:
        layersTutorial.classList.add("hidden");
        break;

      case this.levels.length:
        return this.endGame();

      default:
        break;
    }

    this.currentLevel = this.levels[this.levelCounter];
    this.levelCounter++;
    this.spawnPlayer();
  }

  endGame() {
    this.isPaused = true;
    this.hasEnded = true;
    bodyStyle.animationName = "backgroundColorTransition";
    document.getElementById("winPopUp").classList.remove("hidden");
    document.querySelector("footer").style.fontSize = "3rem";
    canvas.style.display = "none";
  }

  spawnPlayer() {
    this.restartLevel();
    this.player.spawn(...this.currentLevel.spawnCoords);
  }

  respawnPlayer() {
    SOUNDS.die.play();
    this.restartLevel();
    this.player.respawn(...this.currentLevel.spawnCoords);
  }

  toggleMute() {
    if (muteButton.value === "unmuted") {
      Object.values(SOUNDS).forEach((sound) => (sound.volume = 0));
      muteButton.value = "muted";
      muteButton.innerText = "🔈";
    } else {
      Object.values(SOUNDS).forEach((sound) => (sound.volume = 1));
      muteButton.value = "unmuted";
      muteButton.innerText = "🔇";
    }
  }

  // Inverts the map vertically
  invertMap() {
    this.invertedMap = !this.invertedMap;
    this.updateCurrentMap();
    this.player.invertPosition();
    this.pauseAndDraw();
  }

  createTile(x, y, offset = 0) {
    return {
      x: y * TILE_SIZE + offset / 2,
      y: x * TILE_SIZE + offset / 2,
      width: TILE_SIZE - offset,
      height: TILE_SIZE - offset,
    };
  }

  drawTile({ tile: { x, y, width, height }, item, color }) {
    if (item) {
      this.ctx.drawImage(items[item], x, y, width, height);
    } else {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    }
  }

  // Maps numbers into images and paints them on the canvas
  drawMap() {
    for (let x = 0; x < this.currentMap.length; x++) {
      for (let y = 0; y < this.currentMap[x].length; y++) {
        let tile;

        switch (this.currentMap[x][y]) {
          case 1:
            tile = this.createTile(x, y);
            this.drawTile({ tile, color: this.colors.primary });
            this.player.handleTileCollision(tile);
            break;

          case 2:
            tile = this.createTile(x, y);
            this.drawTile({ tile, color: this.colors.secondary });
            break;

          case 3:
            tile = this.createTile(x, y, 2);
            this.drawTile({ tile, item: "saw" });

            if (this.player.isTouching(tile)) {
              this.respawnPlayer();
              this.currentLevel.keys++;
            }
            break;

          case 4:
            tile = this.createTile(x, y, 2);
            this.drawTile({ tile, item: "hiddenSaw" });
            break;

          case 5:
            if (this.currentLevel.keys) {
              tile = this.createTile(x, y, 2);
              this.drawTile({ tile, item: "key" });

              if (this.player.isTouching(tile)) {
                this.currentLevel.keys--;
                SOUNDS.key.play();
              }
            }
            break;

          case 6:
            if (this.currentLevel.keys) {
              tile = this.createTile(x, y, 4);
              this.drawTile({ tile, item: "hiddenKey" });
            }
            break;

          case 7:
            tile = this.createTile(x, y, 2);
            this.drawTile({ tile, item: "invertYArrow" });

            if (this.player.isTouching(tile)) {
              this.invertMap();
            }
            break;

          case 8:
            tile = this.createTile(x, y, 2);

            if (this.currentLevel.keys)
              this.drawTile({ tile, item: "closedDoor" });
            else {
              this.drawTile({ tile, item: "door" });
              if (this.player.isTouching(tile)) this.nextLevel();
            }
            break;

          default:
            break;
        }
      }
    }
  }
}

export { Game };

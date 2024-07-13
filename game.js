import { Level } from "./level.js";
import { levels } from "./levels.js";
import { TILE_SIZE, COLORS, SOUNDS } from "./consts.js";

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

    this.isPaused = false;
    this.levels = levels.map((level) => new Level(level));
    this.levelCounter = 1;
    this.isInMainMap = true;
    this.invertedMap = false;
    this.colors = COLORS[0];
  }

  get currentLevel() {
    return this.levels[this.levelCounter - 1];
  }

  get currentMap() {
    if (!this.invertedMap) {
      if (this.isInMainMap) {
        return this.currentLevel.maps.main;
      } else return this.currentLevel.maps.alt;
    } else {
      if (this.isInMainMap) {
        return this.currentLevel.maps.inverted;
      } else return this.currentLevel.maps.invertedAlt;
    }
  }

  generateColors() {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    this.colors = COLORS[randomIndex];
  }

  captureMapChanges() {
    if (this.controller.pressedKeys[65]) {
      this.isInMainMap = true;
      bodyStyle.backgroundImage = bodyStyle.backgroundColor =
        this.colors.background;
    }

    if (this.controller.pressedKeys[68]) {
      this.isInMainMap = false;
      bodyStyle.backgroundImage = bodyStyle.backgroundColor =
        this.colors.secondary;
    }

    if (this.controller.pressedKeys[82]) {
      this.respawnPlayer();
    }
  }

  restartLevel() {
    this.generateColors();
    this.isInMainMap = true;
    this.invertedMap = false;
    bodyStyle.backgroundColor = this.colors.background;
  }

  nextLevel() {
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

    this.levelCounter++;
    this.spawnPlayer();
  }

  endGame() {
    this.isPaused = true;
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

  invertMap() {
    this.invertedMap = true;
    this.player.invertPosition();
  }

  createTile(x, y, offset = 0) {
    return {
      x: x * TILE_SIZE + offset / 2,
      y: y * TILE_SIZE + offset / 2,
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

  // This function checks every value of the 2D array and paints an image on its coordinates
  drawMap() {
    for (let x = 0; x < this.currentMap.length; x++) {
      for (let y = 0; y < this.currentMap[x].length; y++) {
        let tile;

        switch (this.currentMap[y][x]) {
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

            if (this.player.isTouching(tile) && !this.invertedMap) {
              this.invertMap();
            }
            break;

          case 8:
            tile = this.createTile(x, y, 2);

            // If there are keys in the room, the door will remain closed
            if (this.currentLevel.keys)
              this.drawTile({ tile, item: "closedDoor" });
            else {
              // If no keys are present, the exit door will open
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

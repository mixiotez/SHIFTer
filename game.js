import { Level } from "./level.js";
import { levels } from "./levels.js";
import { TILE_SIZE, COLORS, SOUNDS } from "./consts.js";

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
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

// HTML elements
const navigationTutorial = document.getElementById("navigationTutorial");
const layersTutorial = document.getElementById("layersTutorial");
const bodyStyle = document.body.style;
const muteButton = document.getElementById("mute");

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

  // This function checks every value of the 2D array and paints an image on its coordinates
  drawMap() {
    for (let i = 0; i < this.currentMap.length; i++) {
      for (let j = 0; j < this.currentMap[i].length; j++) {
        let currentTile = this.currentMap[i][j];

        if (currentTile === 1) {
          let tile = {
            x: TILE_SIZE * [j],
            y: TILE_SIZE * [i],
            width: TILE_SIZE,
            height: TILE_SIZE,
          };
          this.ctx.fillStyle = this.colors.primary;
          this.ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
          this.player.handleTileCollision(tile);
        }

        if (currentTile === 2) {
          let tile = {
            x: TILE_SIZE * [j],
            y: TILE_SIZE * [i],
            width: TILE_SIZE,
            height: TILE_SIZE,
          };
          this.ctx.fillStyle = this.colors.secondary;
          this.ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        }

        if (currentTile === 3) {
          let tile = {
            x: TILE_SIZE * [j] + 2,
            y: TILE_SIZE * [i] + 4,
            width: TILE_SIZE - 4,
            height: TILE_SIZE - 4,
          };
          this.ctx.drawImage(saw, tile.x, tile.y, tile.height, tile.width);
          if (this.player.isTouching(tile)) {
            this.respawnPlayer();
            SOUNDS.die.play();
            this.currentLevel.keys++;
          }
        }

        if (currentTile === 4) {
          let tile = {
            x: TILE_SIZE * [j] + 2,
            y: TILE_SIZE * [i] + 4,
            width: TILE_SIZE - 4,
            height: TILE_SIZE - 4,
          };
          this.ctx.drawImage(
            hiddenSaw,
            tile.x,
            tile.y,
            tile.height,
            tile.width
          );
        }

        if (currentTile === 5) {
          if (this.currentLevel.keys) {
            let tile = {
              x: TILE_SIZE * [j] + 4,
              y: TILE_SIZE * [i] + 8,
              width: TILE_SIZE - 8,
              height: TILE_SIZE - 8,
            };
            this.ctx.drawImage(key, tile.x, tile.y, tile.width, tile.height);
            if (this.player.isTouching(tile)) {
              this.currentLevel.keys--;
              SOUNDS.key.play();
            }
          }
        }

        if (currentTile === 6) {
          if (this.currentLevel.keys) {
            let tile = {
              x: TILE_SIZE * [j] + 4,
              y: TILE_SIZE * [i] + 8,
              width: TILE_SIZE - 8,
              height: TILE_SIZE - 8,
            };
            this.ctx.drawImage(
              hiddenKey,
              tile.x,
              tile.y,
              tile.width,
              tile.height
            );
          }
        }

        if (currentTile === 7) {
          let tile = {
            x: TILE_SIZE * [j],
            y: TILE_SIZE * [i] + 4,
            width: TILE_SIZE,
            height: TILE_SIZE - 6,
          };
          this.ctx.drawImage(
            invertYArrow,
            tile.x,
            tile.y,
            tile.width,
            tile.height
          );
          if (this.player.isTouching(tile) && !this.invertedMap) {
            this.invertMap();
          }
        }

        if (currentTile === 8) {
          let tile = {
            x: TILE_SIZE * [j] + 2,
            y: TILE_SIZE * [i] + 2,
            width: TILE_SIZE - 4,
            height: TILE_SIZE - 4,
          };
          // If there are keys in the room, the door will remain closed
          if (this.currentLevel.keys)
            this.ctx.drawImage(
              closedDoor,
              tile.x,
              tile.y,
              tile.width,
              tile.height
            );
          else {
            // If no keys are present, the exit door will open
            this.ctx.drawImage(door, tile.x, tile.y, tile.width, tile.height);
            if (this.player.isTouching(tile)) this.nextLevel();
          }
        }
      }
    }
  }
}

export { Game };

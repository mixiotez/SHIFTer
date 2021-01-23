// Initialize level
let levelCount = 0;
let currentLevel = levels[levelCount];
let currentMap = currentLevel.mapMain;

// Items
const key = new Image();
key.src = "./images/key.png";

const hiddenKey = new Image();
hiddenKey.src = "./images/key-hidden.png";

const door = new Image();
door.src = "./images/door.png";

const closedDoor = new Image();
closedDoor.src = "./images/closedDoor.png";

const saw = new Image();
saw.src = "./images/saw.png";

const hiddenSaw = new Image();
hiddenSaw.src = "./images/saw-hidden.png";

const invertYArrow = new Image();
invertYArrow.src = "./images/invertYArrow.png";

// This function checks every value of the 2D array and returns an image
function drawMap(m) {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      let currentTile = m[i][j];

      if (currentTile === 1) {
        let tile = {
          x: tileSize * [j],
          y: tileSize * [i],
          width: tileSize,
          height: tileSize,
        };
        ctx.fillStyle = currentColor[0];
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        tileCollision(tile);
      }

      if (currentTile === 2) {
        let tile = {
          x: tileSize * [j],
          y: tileSize * [i],
          width: tileSize,
          height: tileSize,
        };
        ctx.fillStyle = currentColor[1];
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
      }

      if (currentTile === 3) {
        let tile = {
          x: tileSize * [j] + 2,
          y: tileSize * [i] + 4,
          width: tileSize - 4,
          height: tileSize - 4,
        };
        ctx.drawImage(saw, tile.x, tile.y, tile.height, tile.width);
        if (player.itemCollision(tile)) {
          player.respawn();
          dieSound.play();
          currentLevel.keys++;
        }
      }

      if (currentTile === 4) {
        let tile = {
          x: tileSize * [j] + 2,
          y: tileSize * [i] + 4,
          width: tileSize - 4,
          height: tileSize - 4,
        };
        ctx.drawImage(hiddenSaw, tile.x, tile.y, tile.height, tile.width);
      }

      if (currentTile === 5) {
        if (currentLevel.keys) {
          let tile = {
            x: tileSize * [j] + 4,
            y: tileSize * [i] + 8,
            width: tileSize - 8,
            height: tileSize - 8,
          };
          ctx.drawImage(key, tile.x, tile.y, tile.width, tile.height);
          if (player.itemCollision(tile)) {
            currentLevel.keys--;
            keySound.play();
          }
        }
      }

      if (currentTile === 6) {
        if (currentLevel.keys) {
          let tile = {
            x: tileSize * [j] + 4,
            y: tileSize * [i] + 8,
            width: tileSize - 8,
            height: tileSize - 8,
          };
          ctx.drawImage(hiddenKey, tile.x, tile.y, tile.width, tile.height);
        }
      }

      if (currentTile === 7) {
        let tile = {
          x: tileSize * [j],
          y: tileSize * [i] + 4,
          width: tileSize,
          height: tileSize - 6,
        };
        ctx.drawImage(invertYArrow, tile.x, tile.y, tile.width, tile.height);
        if (player.itemCollision(tile) && !player.isYInverted) {
          player.invertY();
        }
      }

      if (currentTile === 8) {
        let tile = {
          x: tileSize * [j] + 2,
          y: tileSize * [i] + 2,
          width: tileSize - 4,
          height: tileSize - 4,
        };
        // If there are keys in the room, the door will remain closed
        if (currentLevel.keys)
          ctx.drawImage(closedDoor, tile.x, tile.y, tile.width, tile.height);
        else {
          // If no keys are present, the exit door will open
          ctx.drawImage(door, tile.x, tile.y, tile.width, tile.height);
          if (player.itemCollision(tile)) player.nextLevel();
        }
      }
    }
  }
}

// Primary | Secondary | Body Background
const colorPalettes = [
  ["#AAAE8E", "#828E82", "#607B7D"],
  ["#A3C9A8", "#84B59F", "#69A297"],
  ["#DDC8C4", "#896A67", "#364652"],
  ["#E1E7E8", "#B9BCC0", "#8E8993"],
  ["#CEBEBE", "#AD999B", "#818479"],
];

// Provides a random color palette
function generateColor() {
  const randomIndex = Math.floor(Math.random() * 5);

  return colorPalettes[randomIndex];
}

let currentColor = generateColor();

function invertMap(map) {
  return [...map].reverse();
}

function createMaps() {
  levels[0].mapAlt = levels[0].mapMain;
  levels[1].mapAlt = levels[1].mapMain;

  levels.forEach((level) => {
    if (level.hasInvertedY) {
      level.invertedY = invertMap(level.mapMain);
      level.invertedYAlt = invertMap(level.mapAlt);
    }
  });
}

createMaps();

// Win method
function playerWon() {
  document.getElementById("winPopUp").classList.remove("hidden");
  canvas.style.display = "none";
}

// Audio
function startMusic() {
  const music = document.getElementById("music");
  music.src = "./sounds/game.mp3";
  music.autoplay = "true";
  music.play();
}

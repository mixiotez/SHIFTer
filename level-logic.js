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
function drawMap(m){

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j] === 1) {
        let tile = {
          x: tilesize * [j],
          y: tilesize * [i],
          width: tilesize,
          height: tilesize
        }
        ctx.fillStyle = currentColor[0];
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        tileCollision(tile);
      }

      if (m[i][j] === 2) {
        let tile = {
          x: tilesize * [j],
          y: tilesize * [i],
          width: tilesize,
          height: tilesize
        }
        ctx.fillStyle = currentColor[1];
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
      }

      if (m[i][j] === 3) {
        let tile = {
          x: tilesize * [j] + 2,
          y: tilesize * [i] + 4,
          width: tilesize - 4,
          height: tilesize - 4
        }
        ctx.drawImage(saw, tile.x, tile.y, tile.height, tile.width)
        if (player.itemCollision(tile)) {
          player.respawn();
          dieSound.load();
          checkLevel().keys++;
        }
      }

      if (m[i][j] === 4) {
        let tile = {
          x: tilesize * [j] + 2,
          y: tilesize * [i] + 4,
          width: tilesize - 4,
          height: tilesize - 4
        }
        ctx.drawImage(hiddenSaw, tile.x, tile.y, tile.height, tile.width)
      }

      if (m[i][j] === 5) {
        if (checkLevel().keys > 0){
          let tile = {
            x: tilesize * [j] + 4,
            y: tilesize * [i] + 8,
            width: tilesize - 8,
            height: tilesize - 8
          }
          ctx.drawImage(key, tile.x, tile.y, tile.width, tile.height);
          if (player.itemCollision(tile)) {
            checkLevel().keys--;
            keySound.load();
          }
        }
      }

      if (m[i][j] === 6) {
        if (checkLevel().keys > 0){
          let tile = {
            x: tilesize * [j] + 4,
            y: tilesize * [i] + 8,
            width: tilesize - 8,
            height: tilesize - 8
          }
          ctx.drawImage(hiddenKey, tile.x, tile.y, tile.width, tile.height);
        }
      }

      if (m[i][j] === 7) {
        let tile = {
          x: tilesize * [j],
          y: tilesize * [i] + 4,
          width: tilesize,
          height: tilesize - 6
        }
        ctx.drawImage(invertYArrow, tile.x, tile.y, tile.width, tile.height);
        if (player.itemCollision(tile) && !player.isYInverted) {
          player.invertY();
        }
      }

      if (m[i][j] === 8) {
        let tile = {
          x: tilesize * [j] + 2,
          y: tilesize * [i] + 2,
          width: tilesize - 4,
          height: tilesize - 4
        }
        // If there are keys in the room, the door will remain closed
        if (checkLevel().keys !== 0) ctx.drawImage(closedDoor, tile.x, tile.y, tile.width, tile.height);

        if (checkLevel().keys === 0){ // If no keys are present, the exit door will open
          ctx.drawImage(door, tile.x, tile.y, tile.width, tile.height);
          if (player.itemCollision(tile)) player.nextLevel();
        }
      }
    }
  }
}

// Provides a random color palette
function generateColor() {
  let randomNumber = Math.floor(Math.random() * 5);

  if (randomNumber === 4) return ["#CEBEBE", "#AD999B", "#818479"];
  if (randomNumber === 3) return ["#E1E7E8", "#B9BCC0", "#8E8993"];
  if (randomNumber === 2) return ["#DDC8C4", "#896A67", "#364652"];
  if (randomNumber === 1) return ["#A3C9A8", "#84B59F", "#69A297"];
  return ["#AAAE8E", "#828E82", "#607B7D"]
}

let currentColor = generateColor();

// Provides level to display and allows the player to change between the main map and the alternative one
let levelCount = 1;
let currentMap = checkLevel().mapMain;

function checkLevel(){
  if (levelCount === 1) return level1;
  if (levelCount === 2) return level2;
  if (levelCount === 3) return level3;
  if (levelCount === 4) return level4;
  if (levelCount === 5) return level5;
  if (levelCount === 6) return level6;
  if (levelCount === 7) return level7;
  if (levelCount === 8) return level8;
  if (levelCount === 9) return playerWon();
}

// Win method

function playerWon(){
  let winPopUp = document.getElementById("winPopUp");
  winPopUp.style.display = "block";
  canvas.style.display = "none";
}

// Audio

function startMusic(){
  const music = document.getElementById("music");
  music.src = "./sounds/game.mp3";
  music.autoplay = "true";
  music.load();
}
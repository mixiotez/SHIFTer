// Items
const key = new Image();
key.src = "./images/key.png"

const hiddenKey = new Image();
hiddenKey.src = "./images/key-hidden.png"

const door = new Image();
door.src = "./images/door.png"

const closedDoor = new Image();
closedDoor.src = "./images/closedDoor.png"

const saw = new Image();
saw.src = "./images/saw.png"

const hiddenSaw = new Image();
hiddenSaw.src = "./images/saw-hidden.png"

// This fuction checks every value of the 2D array and returns an image
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
          if (player.itemCollision(tile)) checkLevel().keys--;
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
function chooseColor() {
  let randomNumber = Math.floor(Math.random() * 5);

  if (randomNumber === 4) return ["#CEBEBE", "#AD999B", "#818479"];
  if (randomNumber === 3) return ["#E1E7E8", "#B9BCC0", "#8E8993"];
  if (randomNumber === 2) return ["#DDC8C4", "#896A67", "#364652"];
  if (randomNumber === 1) return ["#A3C9A8", "#84B59F", "#69A297"];
  return ["#AAAE8E", "#828E82", "#607B7D"]
}

let currentColor = chooseColor();

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
}
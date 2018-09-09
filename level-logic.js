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
        ctx.fillStyle = "#505050";
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
        ctx.fillStyle = "#262626";
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
      }

      if (m[i][j] === 3) {
        let tile = {
          x: tilesize * [j],
          y: tilesize * [i] + 15,
          width: tilesize,
          height: tilesize - 15
        }
        ctx.fillStyle = "rgb(255,0,0)"
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        if (player.itemCollision(tile)) {
          player.respawn();
          checkLevel().keys++;
        }
      }

      if (m[i][j] === 4) {
        let tile = {
          x: tilesize * [j],
          y: tilesize * [i] + 15,
          width: tilesize,
          height: tilesize - 15
        }
        ctx.fillStyle = "rgba(255,0,0,0.2)"
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
      }

      if (m[i][j] === 5) {
        if (checkLevel().keys > 0){
          let tile = {
            x: tilesize * [j] + 10,
            y: tilesize * [i] + 15,
            width: tilesize - 20,
            height: tilesize - 15
          }
          ctx.fillStyle = "blue";
          ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
          if (player.itemCollision(tile)) checkLevel().keys--;
        }
      }

      if (m[i][j] === 8) {
        if (checkLevel().keys === 0){ // If no keys are present, the exit portal will open
          let tile = {
            x: tilesize * [j] + 10,
            y: tilesize * [i] + 6,
            width: tilesize - 20,
            height: tilesize - 6
          }
          ctx.fillStyle = "green";
          ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
          if (player.itemCollision(tile)) player.nextLevel();
        }
      }
    }
  }
}

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
// Levels

const tilesize = 32;

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  , 1],
  [1,  ,  ,  , 1,  , 1,  , 1,  ,  ,  ,  ,  , 1],
  [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1, 1,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
  [1, 1,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  , 1],
  [1, 1,  , 1, 1,  ,  , 1,  , 1,  ,  ,  ,  , 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

// Tiles

const bkg1 = new Image();
bkg1.src = "./Tiles/1.png"

// This fuction checks every value of the 2D array and returns an image
function drawMap(){
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {

      if (map[i][j] === 1) {
        let tile = {
          x: tilesize * [j],
          y: tilesize * [i],
          width: tilesize,
          height: tilesize
        }

        ctx.drawImage(bkg1, tile.x, tile.y, tilesize, tilesize);
        tileCollision(tile);
      }
    }
  }
}
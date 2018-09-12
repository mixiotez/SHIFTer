class Player {
  constructor() {
    this.width = 15;
    this.height = 30;

    // Movement properties
    this.velX = 0;
    this.velY = 0;
    this.speed = 2.5; // How fast the player can go
    this.jumping = false; // This lets us know if the user can jump or not. Prevents infinite jumps.
    this.friction = 0.8; // This makes the players slide a bit instead of suddently stopping
    this.gravity = 0.3; // If player is not standing in a platform, gravity will pull them down
    
    // Score
    this.score = 0;
  }

  draw(){
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  itemCollision(item){ // Collision for grabbing items
    return (this.x < item.x + item.width) &&
        (this.x + this.width > item.x) &&
        (this.y < item.y + item.height) &&
        (this.y + this.height > item.y);
  }

  spawn(){ // Checks what's the level's x and y spawn coordinates and assigns it to the player
    this.velX = 0;
    this.velY = 0;
    this.x = checkLevel().spawnPoint[0];
    this.y = checkLevel().spawnPoint[1];
  }

  respawn(){
    currentMap = checkLevel().mapMain;
    this.x = undefined; // This makes the player disappear from the canvas by hidding it
    this.y = undefined;

    setTimeout(() => {
      this.spawn();
    }, 500);
  }

  nextLevel(){
    levelCount++;
    this.respawn();
  }
}

const keys = [];

function playerMovement() {
  if (keys[32] || keys[38]) if (!player.jumping) { // jump
      player.jumping = true;
      player.velY = -player.speed * 2.75;
    }

  if (keys[39]) if (player.velX < player.speed) player.velX++; // right
  
  if (keys[37]) if (player.velX > -player.speed) player.velX--; // left

  if (player.velY !== 0) player.jumping = true; // This prevents the player from jumping mid-air when falling

  player.x += player.velX;
  player.y += player.velY;

  player.velX *= player.friction;
  player.velY += player.gravity;

  // Changes between map layers
  if (keys[65]) { // A
    currentMap = checkLevel().mapMain;
    document.body.style.backgroundImage = 'url("./images/bkg1.jpg")'; // Change background image
  } 
  if (keys[68]) { // D
    currentMap = checkLevel().mapAlt;
    document.body.style.backgroundImage = 'url("./images/bkg2.jpg")'; // Change background image
  } 

   // Restart
  if (keys[82]) player.respawn(); // R

  player.draw();
}

document.body.onkeydown = (e) => {
  keys[e.keyCode] = true;
};

document.body.onkeyup = (e) => {
  keys[e.keyCode] = false;
};

function tileCollision(tile) {
  const vX = player.x + player.width / 2 - (tile.x + tile.width / 2),
        vY = player.y + player.height / 2 - (tile.y + tile.height / 2),

  // Add the half widths and half heights of the objects
    hWidths = player.width / 2 + tile.width / 2,
    hHeights = player.height / 2 + tile.height / 2;

  // If the player and the tile are less than the half width or half height, then we must be inside the tile, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {

  // offsetX and offsetY - Figures out on which side we are colliding with (top, bottom, left, or right)
    const oX = hWidths - Math.abs(vX),
          oY = hHeights - Math.abs(vY);
    var direction = undefined;

    if (oX >= oY){
      if (vY > 0) {
        direction = "top";
        player.y += oY;
      } else {
        direction = "bottom";
        player.y -= oY;
      }
    } else {
      if (vX > 0) {
        direction = "left";
        player.x += oX;
      } else {
        direction = "right";
        player.x -= oX;
      }
    }
  }
  
  if (direction === "left" || direction === "right") player.velX = 0; // Prevents lateral movement
  if (direction === "bottom") {player.velY = 0; player.jumping = false;} // Prevents the player from getting inside the tile when jumping
  if (direction === "top") player.velY = 0; //  Maintains the player on tile
}
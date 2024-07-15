import { SOUNDS } from "./consts.js";

class Player {
  constructor(ctx, controller) {
    this.ctx = ctx;
    this.controller = controller;

    this.width = 15;
    this.height = 30;

    // Movement properties
    this.velX = 0;
    this.velY = 0;
    this.speed = 2.5; // How fast the player can go
    this.isJumping = false; // This lets us know if the user can jump or not. Prevents infinite jumps.
    this.friction = 0.8; // This makes the players slide a bit instead of suddenly stopping
    this.gravity = 0.3; // If player is not standing in a platform, gravity will pull them down

    // Time taken by player
    this.time = 0;

    // Indicates if the player's Y position was inverted
    this.invertedPosition = false;
  }

  draw() {
    this.ctx.fillStyle = "#F0E7D8";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isTouching(item) {
    // Collision for grabbing items
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  spawn(x, y) {
    // Checks what's the level's x and y spawn coordinates and assigns it to the player
    this.invertedPosition = false;
    this.velX = 0;
    this.velY = 0;
    this.x = x;
    this.y = y;
  }

  respawn(x, y) {
    this.invertedPosition = false;
    this.x = undefined; // This makes the player disappear from the canvas by hiding it
    this.y = undefined;

    setTimeout(() => {
      this.spawn(x, y);
    }, 500);
  }

  invertPosition() {
    this.velY = 0;
    this.y = canvas.width + this.height - this.y;
    this.invertedPosition = true;
  }

  captureMovement() {
    if (this.controller.pressedKeys[32] && !this.isJumping) {
      // jump
      this.isJumping = true;
      this.velY = -this.speed * 2.75;
      SOUNDS.jump.play();
    }

    if (this.controller.pressedKeys[39] && this.velX < this.speed) this.velX++; // right

    if (this.controller.pressedKeys[37] && this.velX > -this.speed) this.velX--; // left

    if (this.velY !== 0) this.isJumping = true; // This prevents the player from jumping mid-air when falling

    this.x += this.velX;
    this.y += this.velY;

    this.velX *= this.friction;
    this.velY += this.gravity;
  }

  handleTileCollision(tile) {
    const vX = this.x + this.width / 2 - (tile.x + tile.width / 2),
      vY = this.y + this.height / 2 - (tile.y + tile.height / 2),
      // Add the half widths and half heights of the objects
      halfWidths = this.width / 2 + tile.width / 2,
      halfHeights = this.height / 2 + tile.height / 2;

    // If the player and the tile are less than the half width or half height, then we must be inside the tile, causing a collision
    if (Math.abs(vX) < halfWidths && Math.abs(vY) < halfHeights) {
      // offsetX and offsetY - Figures out on which side we are colliding with (top, bottom, left, or right)
      const offsetX = halfWidths - Math.abs(vX),
        offsetY = halfHeights - Math.abs(vY);
      var direction;

      if (offsetX >= offsetY) {
        if (vY > 0) {
          direction = "top";
          this.y += offsetY;
        } else {
          direction = "bottom";
          this.y -= offsetY;
        }
      } else {
        if (vX > 0) {
          direction = "left";
          this.x += offsetX;
        } else {
          direction = "right";
          this.x -= offsetX;
        }
      }
    }

    // Prevents lateral movement
    if (direction === "left" || direction === "right") this.velX = 0;
    if (direction === "bottom") {
      this.velY = 0;
      this.isJumping = false;
    }
    // Prevents the player from getting inside the tile when jumping
    if (direction === "top") this.velY = 0; //  Maintains the player on tile
  }
}

export { Player };

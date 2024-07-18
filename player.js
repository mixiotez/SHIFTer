import { SOUNDS, TILE_SIZE, WIDTH } from "./consts.js";

class Player {
  constructor(ctx, controller) {
    this.ctx = ctx;
    this.controller = controller;

    this.width = TILE_SIZE / 2;
    this.height = TILE_SIZE - 2;

    this.velX = 0;
    this.velY = 0;
    this.speed = 3.2; // How fast the player can go
    this.isJumping = false;
    this.friction = 0.8; // Makes player slightly slide before stopping
    this.gravity = 0.3; // Rate at which player falls

    // Score
    this.time = 0;

    this.invertedPosition = false;
  }

  draw() {
    this.ctx.fillStyle = "#F0E7D8";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isTouching(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  spawn(x, y) {
    this.invertedPosition = false;
    this.velX = 0;
    this.velY = 0;
    this.x = x;
    this.y = y;
  }

  respawn(x, y) {
    this.invertedPosition = false;

    // Disappear from canvas before spawning
    this.x = undefined;
    this.y = undefined;

    setTimeout(() => {
      this.spawn(x, y);
    }, 500);
  }

  invertPosition() {
    this.velY = 0;
    this.y = WIDTH + this.height - this.y;
    this.invertedPosition = true;
  }

  captureMovement() {
    if (this.controller.pressedKeys.Space && !this.isJumping) {
      this.isJumping = true;
      this.velY = -this.speed * 2.75;
      SOUNDS.jump.play();
    }

    if (this.controller.pressedKeys.ArrowRight && this.velX < this.speed)
      this.velX++;

    if (this.controller.pressedKeys.ArrowLeft && this.velX > -this.speed)
      this.velX--;

    // Prevents jumping if falling down
    if (this.velY !== 0) this.isJumping = true;

    this.x += this.velX;
    this.y += this.velY;

    this.velX = this.velX * this.friction;
    this.velY += this.gravity;
  }

  // Lets player stand on tiles, prevents them from moving horizontally
  // if moving against a tile, or from cropping into a tile when jumping
  handleTileCollision(tile) {
    const vX = this.x + this.width / 2 - (tile.x + tile.width / 2);
    const vY = this.y + this.height / 2 - (tile.y + tile.height / 2);

    const halfWidths = this.width / 2 + tile.width / 2;
    const halfHeights = this.height / 2 + tile.height / 2;

    // Calculates if players is inside a tile
    if (Math.abs(vX) < halfWidths && Math.abs(vY) < halfHeights) {
      const offsetX = halfWidths - Math.abs(vX);
      const offsetY = halfHeights - Math.abs(vY);

      // Figures out which direction the player is cropping into
      if (offsetX >= offsetY) {
        this.velY = 0;

        if (vY > 0) {
          // Top
          this.y += offsetY;
        } else if (vY < 0) {
          // Bottom:
          this.isJumping = false;
          this.y -= offsetY;
        }
      } else {
        this.velX = 0;

        if (vX > 0) {
          // Left
          this.x += offsetX;
        } else if (vX < 0) {
          // Right
          this.x -= offsetX;
        }
      }
    }
  }
}

export { Player };

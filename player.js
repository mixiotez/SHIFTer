class Player {
  constructor() {
    this.x = 10;
    this.y = 10;
    this.width = 15;
    this.height = 30;
    this.speed = 3.5;
    this.velX = 0;
    this.velY = 0;
    this.jumping = false;
    this.friction = 0.8;
    this.gravity = 0.3;
  }
  draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

var keys = [];

function playerMovement() {
  if (keys[32]) {
    if (!player.jumping) {
      player.jumping = true;
      player.velY = -player.speed * 2;
    }
  }

  if (keys[39]) {
    if (player.velX < player.speed) player.velX++;
  }

  if (keys[37]) {
    if (player.velX > -player.speed) player.velX--;
  }

  player.x += player.velX;
  player.y += player.velY;
  player.velX *= player.friction;
  player.velY += player.gravity;

  // Checks if user is within the limits of the map

  if (player.x >= width - player.width) {
    player.x = width - player.width;
  } else if (player.x <= 0) {
    player.x = 0;
  }

  if (player.y >= height - player.height) {
    player.y = height - player.height;
    player.jumping = false;
  }
}

document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});
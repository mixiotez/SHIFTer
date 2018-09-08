const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 480;
const height = 480;

canvas.width = width;
canvas.height = height;

const player = new Player();

function update() {
  ctx.clearRect(0, 0, width, height); // CLears the canvas
  drawMap(currentMap); // Draws the tilemap
  playerMovement(); // Draws the character
  requestAnimationFrame(update);
}

window.onload = update();
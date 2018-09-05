var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 480;
var height = 480;

canvas.width = width;
canvas.height = height;

var player = new Player();

function update() {
  ctx.clearRect(0, 0, width, height); // CLears the canvas
  drawMap(); // Draws the tilemap
  playerMovement(); // Draws the character
  requestAnimationFrame(update);
}

window.onload = update();
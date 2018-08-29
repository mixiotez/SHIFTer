var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 480;
var height = 480;

canvas.width = width;
canvas.height = height;

var player = new Player();

function update() {
  playerMovement();
  player.draw();
  requestAnimationFrame(update);
}

window.onload = update();
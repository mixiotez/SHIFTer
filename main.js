const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("menuToggle");
const timer = document.getElementById("timer");
const width = 480;
const height = 480;

canvas.width = width;
canvas.height = height;

const player = new Player();

let playerTime = document.getElementById("time");

function update() {
  ctx.clearRect(0, 0, width, height); // CLears the canvas
  drawMap(currentMap); // Draws the tilemap
  playerMovement(); // Draws the character
  player.time += (1/60);
  playerTime.innerHTML = Math.floor(player.time);
  requestAnimationFrame(update);
}

function newGame() {
  mainMenu.style.display = "none"; // Hides main menu
  canvas.style.display = "block"; // Shows canvas
  canvas.style.margin = "0 25vw"; // Centers canvas
  timer.style.display = "block"; // Shows timer

  document.body.style.backgroundColor = currentColor[2];
  
  player.spawn();
  update();
}
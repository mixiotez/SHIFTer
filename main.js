const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 480;
const height = 480;

canvas.width = width;
canvas.height = height;

const player = new Player();

let playerTime = document.getElementById("time");

function update() {
  ctx.clearRect(0, 0, width, height); // Clears the canvas
  drawMap(currentMap); // Draws the tilemap
  playerMovement(); // Draws the character
  player.time += 1 / 60;
  playerTime.innerHTML = Math.floor(player.time); // Update the timer
  requestAnimationFrame(update);
}

const mainMenu = document.getElementById("menu");
const timer = document.getElementById("timer");
const navigationTutorial = document.getElementById("navigationTutorial");
const layersTutorial = document.getElementById("layersTutorial");

function newGame() {
  mainMenu.classList.add("hidden");
  canvas.classList.remove("hidden");
  timer.classList.remove("hidden");

  document.body.classList.animation = "none";
  document.body.classList.backgroundColor = currentColor[2];
  navigationTutorial.classList.remove("hidden");

  startMusic();

  player.spawn();
  update();
}

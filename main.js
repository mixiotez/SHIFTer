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

  document.getElementById("slides").style.display = "none";

  document.body.style.backgroundColor = currentColor[2];

  startMusic();
  
  player.spawn();
  update();
}

function tutorial() {
  document.getElementById("tut-01").style.display = "block";
  document.getElementById("nextSlide").style.display = "block";
}

function nextSlide(){
  document.getElementById("tut-02").style.display = "block";
  document.getElementById("prevSlide").style.display = "block";
  document.getElementById("nextSlide").style.display = "none";
}

function prevSlide(){
  document.getElementById("tut-02").style.display = "none";
  document.getElementById("prevSlide").style.display = "none";
  document.getElementById("nextSlide").style.display = "block";
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 480;
const height = 480;

canvas.width = width;
canvas.height = height;

const player = new Player();
let pause = false;

function update() {
  ctx.clearRect(0, 0, width, height); // Clears the canvas
  drawMap(currentMap); // Draws the tilemap
  playerMovement(); // Draws the character
  player.time += 1 / 60;
  document.getElementById("time").innerHTML = Math.floor(player.time); // Update the timer

  if (!pause) requestAnimationFrame(update);
}

const mainMenu = document.getElementById("menu");
const topBar = document.getElementById("topBar");
const mute = document.getElementById("mute");
const navigationTutorial = document.getElementById("navigationTutorial");
const layersTutorial = document.getElementById("layersTutorial");
const bodyStyle = document.body.style;

function newGame() {
  mainMenu.classList.add("hidden");
  canvas.classList.remove("hidden");
  topBar.classList.remove("hidden");

  bodyStyle.animationName = undefined;
  bodyStyle.backgroundColor = currentColor[2];
  navigationTutorial.classList.remove("hidden");

  music.play();

  player.spawn();
  update();
}

function toggleMute() {
  if (mute.value === "unmuted") {
    sounds.forEach((sound) => (sound.volume = 0));
    mute.value = "muted";
    mute.innerText = "🔈";
  } else {
    sounds.forEach((sound) => (sound.volume = 0.8));
    music.volume = 0.8;
    mute.value = "unmuted";
    mute.innerText = "🔇";
  }
}

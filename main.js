import { WIDTH, HEIGHT, SOUNDS } from "./consts.js";
import { Player } from "./player.js";
import { Game } from "./game.js";
import { Controller } from "./controller.js";

const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
const controller = new Controller();
const player = new Player(ctx, controller);
const game = new Game(ctx, controller, player);

function update() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clears the canvas
  game.drawMap(); // Draws the tilemap
  player.draw(); // Draws the character
  player.captureMovement();
  player.time += 1 / 60;
  document.getElementById("time").innerHTML = Math.floor(player.time); // Update the timer

  if (!game.isPaused) requestAnimationFrame(update);
}

const bodyStyle = document.body.style;
const mainMenu = document.getElementById("menu");
const topBar = document.getElementById("topBar");

function startGame() {
  mainMenu.classList.add("hidden");
  canvas.classList.remove("hidden");
  topBar.classList.remove("hidden");

  bodyStyle.animationName = undefined;
  bodyStyle.backgroundColor = game.colors.background;
  navigationTutorial.classList.remove("hidden");

  SOUNDS.theme.play();

  game.spawnPlayer();
  update();
}

document.body.onkeydown = (e) => {
  if (!controller.pressedKeys[e.keyCode]) {
    controller.pressKey(e.keyCode);
    game.captureMapChanges();
  }
};

document.body.onkeyup = (e) => {
  controller.releaseKey(e.keyCode);
};

window.startGame = startGame;
window.toggleMute = game.toggleMute;
startGame();

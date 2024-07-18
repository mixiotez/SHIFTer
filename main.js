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

function gameLoop() {
  if (!game.isPaused) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    game.drawMap();
    player.draw();
    player.captureMovement();

    player.time += 1 / 60;
    document.getElementById("time").innerHTML = Math.floor(player.time);
  }

  if (!game.hasEnded) {
    requestAnimationFrame(gameLoop);
  }
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
  gameLoop();
}

document.body.onkeydown = ({ code }) => {
  // Prevents multiple execution while holding down a key
  if (!controller.pressedKeys[code]) {
    controller.pressKey(code);

    // Only register map changes once, unlike the player's
    // movement, which requires constant key monitoring
    if (["KeyA", "KeyD", "KeyR"].includes(code)) {
      game.captureMapChanges();
    }
  }
};

document.body.onkeyup = ({ code }) => {
  controller.releaseKey(code);
};

window.startGame = startGame;
window.toggleMute = game.toggleMute;

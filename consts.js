const WIDTH = 720;
const HEIGHT = WIDTH;
const TILE_SIZE = WIDTH / 15;

const COLORS = [
  {
    primary: "#AAAE8E",
    secondary: "#828E82",
    background: "#607B7D",
  },
  {
    primary: "#A3C9A8",
    secondary: "#84B59F",
    background: "#69A297",
  },
  {
    primary: "#DDC8C4",
    secondary: "#896A67",
    background: "#364652",
  },
  {
    primary: "#E1E7E8",
    secondary: "#B9BCC0",
    background: "#8E8993",
  },
  {
    primary: "#CEBEBE",
    secondary: "#AD999B",
    background: "#818479",
  },
];

const SOUNDS = {
  theme: new Audio("./sounds/game.mp3"),
  jump: new Audio("./sounds/jump.mp3"),
  die: new Audio("./sounds/die.mp3"),
  nextLevel: new Audio("./sounds/nextLevel.mp3"),
  key: new Audio("./sounds/key.mp3"),
};

SOUNDS.theme.level = 0.8;
SOUNDS.theme.loop = true;

export { TILE_SIZE, WIDTH, HEIGHT, COLORS, SOUNDS };

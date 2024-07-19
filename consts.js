const WIDTH = 720;
const HEIGHT = WIDTH;
const TILE_SIZE = WIDTH / 15;

const SOUNDS = {
  theme: new Audio("./sounds/game.mp3"),
  jump: new Audio("./sounds/jump.mp3"),
  die: new Audio("./sounds/die.mp3"),
  nextLevel: new Audio("./sounds/nextLevel.mp3"),
  key: new Audio("./sounds/key.mp3"),
};

SOUNDS.theme.level = 0.8;
SOUNDS.theme.loop = true;

const COLORS = [
  {
    // Olive
    primary: "#B7BAA0",
    secondary: "#7E8B7E",
    background: "#506668",
  },
  {
    // Green
    primary: "#B2D2B6",
    secondary: "#66A387",
    background: "#4F7D74",
  },
  {
    // Pink + Dark blue
    primary: "#DDC8C4",
    secondary: "#A78E8B",
    background: "#364652",
  },
  {
    // Silver
    primary: "#C5D1D3",
    secondary: "#9FA3A8",
    background: "#7B767F",
  },
  {
    // China rose
    primary: "#DCBCC9",
    secondary: "#C794A8",
    background: "#B26C88",
  },
  {
    // Violet
    primary: "#A89FD1",
    secondary: "#695AAF",
    background: "#4E4187",
  },
  {
    // Coral - Terracotta
    primary: "#BC7676",
    secondary: "#964A4A",
    background: "#7B3D3D",
  },
  {
    // Gray - Eerie black
    primary: "#928B8B",
    secondary: "#3F3B3B",
    background: "#201E1E",
  },
  {
    // Cornflower blue
    primary: "#7094D7",
    secondary: "#2D559F",
    background: "#2F2F75",
  },
  {
    // Melon
    primary: "#EEB6AA",
    secondary: "#DF7D68",
    background: "#D86146",
  },
];

export { TILE_SIZE, WIDTH, HEIGHT, COLORS, SOUNDS };

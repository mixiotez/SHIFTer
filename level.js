import { TILE_SIZE } from "./consts.js";

const invertMap = (map) => [...map].reverse();
const generateCoords = (coords) => coords.map((coord) => coord * TILE_SIZE + 2);

class Level {
  constructor({ maps, keys, invertedMap = false, spawnCoords }) {
    this.maps = {
      main: maps.main,
      alt: maps.alt,
      inverted: invertedMap ? invertMap(maps.main) : null,
      invertedAlt: invertedMap ? invertMap(maps.alt) : null,
    };
    this.keys = keys;
    this.invertedMap = invertedMap;
    this.spawnCoords = generateCoords(spawnCoords);
  }
}

export { Level };

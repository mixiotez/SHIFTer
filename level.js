const invertMap = (map) => [...map].reverse();

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
    this.spawnCoords = spawnCoords;
  }
}

export { Level };

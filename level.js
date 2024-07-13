const invertMap = (map) => [...map].reverse();

class Level {
  constructor(data) {
    this.mapMain = data.mapMain;
    this.mapAlt = data.mapAlt;
    this.keys = data.keys;
    this.hasInvertedY = data?.hasInvertedY || false;
    this.invertedY = this?.hasInvertedY ? invertMap(this.mapMain) : null;
    this.invertedYAlt = this?.hasInvertedY ? invertMap(this.mapAlt) : null;
    this.spawnPoint = data.spawnPoint;
  }
}

export { Level };

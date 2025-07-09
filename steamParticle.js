class SteamParticle extends FluidParticle {
  constructor(x, y) {
    super(x, y);

    this.density = 0.0184; // Lighter than most
    this.col = color(200, 200, random(180, 255));
    this.speed = 0.5;

    this.temperature = 110;
    this.heatConductivity = 0.005;
    this.specificHeat = 2.0;
  }

  update(grid, dt) {
    if (this.updated) return;
    if (random() > this.speed) return; // Steam moves slowly

    super.update(grid, dt); // Run fluid update (with heat and behaviors)

    // Steam-specific behavior: Condense when cold
    if (this.temperature < 100) {
      grid[this.y][this.x] = new WaterParticle(this.x, this.y);
      return;
    }
  }

  // Override direction-specific logic from FluidParticle
  getMovementDirections() {
    // Return direction priorities: upward, diagonal-up, sideways
    return [
      { dx: 0, dy: -1, dir: "up" },
      { dx: -1, dy: -1, dir: "diagonal" },
      { dx: 1, dy: -1, dir: "diagonal" },
      { dx: -1, dy: 0, dir: "side" },
      { dx: 1, dy: 0, dir: "side" }
    ];
  }
}

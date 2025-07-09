class FireParticle extends FluidParticle {
  constructor(x, y) {
    super(x, y);

    this.col = color(random(220, 255), random(100, 150), random(0, 30)); // Bright orange-yellow
    this.density = 0.1;              // Very light, like hot gas
    this.temperature = 500;          // High temp
    this.speed = 0.5;                // Moves less frequently
    this.lifetime = 1000;            // ms

    this.heatConductivity = 0.01;
    this.specificHeat = 1.0;
  }

  getMovementDirections() {
    return [
      { dx: 0, dy: -1, dir: "up" },         // Straight up
      { dx: -1, dy: -1, dir: "diagonal" },  // Diagonal left up
      { dx: 1, dy: -1, dir: "diagonal" },   // Diagonal right up
      { dx: -1, dy: 0, dir: "side" },       // Sideways left
      { dx: 1, dy: 0, dir: "side" }         // Sideways right
    ];
  }

  update(grid, dt) {
    if (this.updated || random() > this.speed) return;

    super.update(grid, dt); // Handles movement, interaction, heat

    // Burn out after lifetime expires
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      grid[this.y][this.x] = new AirParticle(this.x, this.y);
    }
  }
}
